import { db } from "@/lib/db";
import {
  messages as _messages,
  sources as _sources,
  user_settings,
} from "@/lib/db/schema";
import { retrieval } from "@/lib/langchain";
import { getUserSettings } from "@/lib/account";
import { Message } from "ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { VALID_MODELS } from "@/constants/models";
import { logger } from "@/lib/logger";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

function validateModel(selectedModel?: string): string | undefined {
  if (!selectedModel) return undefined;
  return VALID_MODELS.includes(selectedModel) ? selectedModel : undefined;
}

const formatMessages = (messages: Message[]) => {
  return messages
    .map(
      (message) =>
        `${message.role === "user" ? "Human" : "Assistant"}: ${message.content}`
    )
    .join("\n");
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      messages,
      fileKey,
      chatId,
      messageCount,
      isAdmin,
      selectedModel,
      apiKeys,
    } = await req.json();

    const userSettings = await getUserSettings();
    if (
      userSettings?.messageCount &&
      userSettings?.freeMessages &&
      userSettings.messageCount >= userSettings.freeMessages
    ) {
      return NextResponse.json(
        { error: "Free messages limit reached" },
        { status: 403 }
      );
    }

    const currentMessageContent = messages[messages.length - 1].content;
    const previousMessages = messages.slice(0, -1);
    const chatHistory = formatMessages(previousMessages);

    const validatedModel = validateModel(selectedModel);
    if (selectedModel && !validatedModel) {
      logger.warn(`Invalid model received: ${selectedModel}`);
    }

    let count = 0;
    let sources: { content: string; pageNumber: number }[] = [];

    const streamingResponse = await retrieval({
      question: currentMessageContent,
      chatHistory,
      previousMessages,
      fileKey,
      isAdmin,
      selectedModel: validatedModel,
      apiKeys,
      streamCallbacks: {
        handleRetrieverEnd: (documents) => {
          sources = documents.map((d) => ({
            content: d.pageContent,
            pageNumber: d.metadata.pageNumber,
          }));
        },
        handleLLMEnd: async (output) => {
          count++;
          if (count === 2) {
            await db.insert(_messages).values({
              chatId,
              content: currentMessageContent,
              role: "user",
            });

            await db
              .update(user_settings)
              .set({ messageCount: messageCount + 1 })
              .where(eq(user_settings.userId, userId));

            const completion = output.generations[0][0].text;

            const inserted = await db
              .insert(_messages)
              .values({
                chatId,
                content: completion,
                role: "system",
                model: validatedModel,
              })
              .returning({ id: _messages.id });

            if (sources.length > 0) {
              await db.insert(_sources).values({
                messageId: inserted[0].id,
                chatId,
                data: JSON.stringify(sources),
              });
            }
          }
        },
      },
    });

    return streamingResponse;
  } catch (err) {
    logger.error("Error generating reply", err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

