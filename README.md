# AI Docs Assistant

AI Docs Assistant is a Retrieval-Augmented Generation (RAG) based chat application
that allows users to upload PDF documents and ask context-aware questions.
Responses are generated strictly from the uploaded documents with source references.

## Key Features
- PDF upload & secure storage
- Context-aware chat over documents
- Source-cited AI answers
- Streaming responses
- User authentication
- Scalable vector search

## Tech Stack
- Next.js 14, React, TypeScript
- LangChain, OpenAI, Vercel AI SDK
- PostgreSQL (NeonDB) + Drizzle ORM
- Pinecone Vector Database
- AWS S3
- Clerk Authentication

## How It Works
This system uses a Retrieval-Augmented Generation (RAG) pipeline:
1. Documents are ingested, chunked, embedded, and stored in a vector database.
2. User queries are embedded and matched against stored document chunks.
3. Relevant context is injected into the prompt for grounded AI responses.

## Getting Started
1. Install dependencies
2. Configure environment variables
3. Run database migrations
4. Start the development server
