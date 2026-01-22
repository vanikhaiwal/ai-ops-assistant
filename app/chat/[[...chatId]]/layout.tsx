
import ClientOnly from "@components/client-only";
import ChatSideBar from "@components/chat-sidebar";
import Header from "@components/header";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen flex flex-col bg-blue-custom-50 dark:bg-neutral-950">
      <ClientOnly>
        <Header />
      </ClientOnly>

      <main className="w-full h-full flex gap-1 p-2">
        <ClientOnly>
          <ChatSideBar />
        </ClientOnly>

        {children}
      </main>
    </div>
  );
}
