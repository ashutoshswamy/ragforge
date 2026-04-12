# RAGForge

Build your own RAG (Retrieval-Augmented Generation) pipeline through a simple 3-step UI: **upload documents**, **configure settings**, and **chat with your data** — powered by Google Gemini.

## Features

- **Document Upload** — Drag & drop PDF, TXT, or DOCX files
- **Configurable Pipeline** — Adjust chunk size, overlap, top-K retrieval, model selection, and system prompt
- **Real-time Chat** — Streaming responses with source attribution chips
- **In-memory Vector Store** — No database required; session-scoped vector storage with cosine similarity search
- **Dark Industrial UI** — Custom design system with Syne + DM Mono typography, Framer Motion animations, and terminal-style progress indicators

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + CSS custom properties |
| LLM / Embeddings | Google Gemini (`@google/generative-ai`) |
| Vector Store | In-memory (module-level Map, session-keyed) |
| State Management | Zustand |
| File Handling | pdf-parse, mammoth, react-dropzone |
| Animations | Framer Motion |


## How It Works

```
1. UPLOAD    →  Drop your documents (PDF / TXT / DOCX)
2. CONFIGURE →  Enter your Gemini API key, pick a model,
                tune chunk size, overlap, top-K, and system prompt
3. CHAT      →  Ask questions — answers are streamed with source citations
```

## Author

**Ashutosh Swamy**

- [GitHub](https://github.com/ashutoshswamy)
- [LinkedIn](https://linkedin.com/in/ashutoshswamy)
- [Twitter / X](https://twitter.com/ashutoshswamy_)

## License

This project is open source and available under the [MIT License](LICENSE).
