# RAGForge

Build and manage production-ready RAG (Retrieval-Augmented Generation) pipelines in minutes. **Upload documents**, **auto-index into Supabase**, and **chat with your data** — powered by Google Gemini.

## Features

- **Persistent Pipelines** — Save your RAG configurations and indexed data to Supabase. Resume your chat sessions anytime.
- **Secure Authentication** — Full user lifecycle management powered by Clerk. Each pipeline is scoped to its owner.
- **Multi-Format Ingest** — Drag & drop support for PDF, DOCX, and TXT files.
- **Streaming UI** — Real-time responses from Gemini with token-by-token streaming and source attribution chips.
- **Configurable RAG** — Fine-tune chunk size, overlap, top-K retrieval, model selection, and system prompts.
- **Vector Search** — High-performance similarity search using Supabase `pgvector` with 768-dimensional embeddings.
- **Dark Industrial UI** — Built with a premium design system featuring Syne + DM Mono typography and Framer Motion animations.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Authentication** | Clerk |
| **Database & Vector Store** | Supabase (PostgreSQL + `pgvector`) |
| **LLM & Embeddings** | Google Gemini (`@google/generative-ai`) |
| **Styling & Animation** | Tailwind CSS + Framer Motion |
| **File Parsing** | pdf-parse, mammoth |
| **State Management** | Zustand |

## How It Works

1. **UPLOAD** → Drop your PDF, TXT, or DOCX files.
2. **CHUNK** → Documents are split and embedded using Gemini's latest embedding models.
3. **INDEX** → Chunks are stored in Supabase with vector indices for fast retrieval.
4. **CHAT** → Ask questions; RAGForge retrieves relevant context and streams answers with citations.

## Author

**Ashutosh Swamy**
- [GitHub](https://github.com/ashutoshswamy)
- [LinkedIn](https://linkedin.com/in/ashutoshswamy)
- [Twitter / X](https://twitter.com/ashutoshswamy_)

## License

This project is open source and available under the [MIT License](LICENSE).
