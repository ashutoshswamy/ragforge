# RAGForge — CLAUDE.md

This file is the source of truth for Claude when working on this codebase. Read it fully before making any changes.

---

## Project Overview

**RAGForge** is a Next.js application that lets users build their own RAG (Retrieval-Augmented Generation) pipeline through a 3-step UI: upload documents → configure settings → chat with their data.

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS + custom CSS variables
- **LLM/Embeddings:** Google Gemini only (`@google/generative-ai`)
- **Vector Store:** In-memory (module-level Map, session-keyed)
- **State:** Zustand

---

## Architecture

```
ragforge/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout + fonts
│   ├── globals.css                 # Global styles + CSS variables
│   ├── pipeline/
│   │   └── page.tsx                # 3-step pipeline wrapper
│   └── api/
│       ├── ingest/route.ts         # Upload → parse → chunk → embed → store
│       └── query/route.ts          # Query → embed → search → Gemini → respond
├── lib/
│   ├── gemini.ts                   # Gemini client (text generation + embeddings)
│   ├── chunking.ts                 # Text splitting logic
│   ├── vectorstore.ts              # In-memory vector store + cosine similarity
│   └── rag.ts                      # Core RAG orchestration
├── components/
│   ├── stepper/
│   │   └── Stepper.tsx
│   ├── steps/
│   │   ├── Step1Upload.tsx
│   │   ├── Step2Configure.tsx
│   │   └── Step3Chat.tsx
│   └── ui/
│       ├── FileCard.tsx
│       ├── ChatBubble.tsx
│       └── SourceChip.tsx
├── store/
│   └── pipeline.ts                 # Zustand store
└── types/
    └── index.ts                    # All shared TypeScript types
```

---

## RAG Pipeline Flow

### Ingest (`POST /api/ingest`)
```
User uploads file (PDF / TXT / DOCX)
  → Parse raw text (pdf-parse for PDF, mammoth for DOCX, native for TXT)
  → Split into chunks using config (chunkSize, chunkOverlap)
  → Embed each chunk via Gemini gemini-embedding-2-preview
  → Store { text, embedding, source } in module-level Map keyed by sessionId
  → Return { chunks: number, status: "ok" }
```

### Query (`POST /api/query`)
```
User sends question
  → Embed question via Gemini gemini-embedding-2-preview
  → Cosine similarity search against stored vectors
  → Retrieve top-K chunks
  → Build prompt: systemPrompt + context chunks + question
  → Stream response from Gemini (flash or pro)
  → Return { answer: string, sources: string[] }
```

---

## Shared Types (`types/index.ts`)

```ts
export type GeminiModel = "gemini-2.5-flash" | "gemini-3-flash-preview";

export interface PipelineConfig {
  apiKey: string;
  model: GeminiModel;
  chunkSize: number;       // 256–2048, default 512
  chunkOverlap: number;    // 0–256, default 64
  topK: number;            // 1–10, default 4
  systemPrompt: string;
}

export interface ParsedDoc {
  name: string;
  text: string;
}

export interface VectorChunk {
  text: string;
  embedding: number[];
  source: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}
```

---

## Zustand Store (`store/pipeline.ts`)

```ts
interface PipelineStore {
  currentStep: 1 | 2 | 3;
  files: File[];
  parsedDocs: ParsedDoc[];
  config: PipelineConfig;
  vectorStore: VectorChunk[];
  messages: ChatMessage[];
  isIngesting: boolean;
  sessionId: string;        // uuid, generated once on mount

  // Actions
  setStep: (step: 1 | 2 | 3) => void;
  setFiles: (files: File[]) => void;
  setParsedDocs: (docs: ParsedDoc[]) => void;
  setConfig: (config: Partial<PipelineConfig>) => void;
  setVectorStore: (chunks: VectorChunk[]) => void;
  addMessage: (msg: ChatMessage) => void;
  setIsIngesting: (val: boolean) => void;
  reset: () => void;
}
```

---

## Key Implementation Details

### `lib/chunking.ts`
- Recursive character text splitter
- Splits on `\n\n`, `\n`, `. `, ` ` in order
- Respects `chunkSize` (characters, not tokens) and `chunkOverlap`
- Returns `{ text: string; index: number }[]`

### `lib/vectorstore.ts`
- Module-level `Map<sessionId, VectorChunk[]>` — persists across requests within the same server instance
- `cosineSimilarity(a: number[], b: number[]): number`
- `search(sessionId, queryEmbedding, topK): VectorChunk[]`
- `store(sessionId, chunks: VectorChunk[]): void`
- `clear(sessionId): void`

### `lib/gemini.ts`
- Initialises `GoogleGenerativeAI` with the user-supplied API key (passed per-request, never stored server-side beyond the request)
- `embedText(apiKey, text): Promise<number[]>` — uses `gemini-embedding-2-preview`
- `generateAnswer(apiKey, model, prompt): Promise<ReadableStream>` — streaming

### `lib/rag.ts`
- `buildPrompt(systemPrompt, chunks, question): string`
- Context block format:
  ```
  <context>
  [Source: filename.pdf]
  chunk text here...
  </context>
  ```
- Calls `generateAnswer` and pipes the stream back to the route handler

---

## API Routes

### `POST /api/ingest`

**Request body:**
```json
{
  "sessionId": "uuid",
  "docs": [{ "name": "file.pdf", "text": "..." }],
  "config": { "apiKey": "...", "chunkSize": 512, "chunkOverlap": 64 }
}
```

**Response:**
```json
{ "chunks": 42, "status": "ok" }
```

### `POST /api/query`

**Request body:**
```json
{
  "sessionId": "uuid",
  "question": "What is...",
  "config": { "apiKey": "...", "model": "gemini-2.5-flash", "topK": 4, "systemPrompt": "..." }
}
```

**Response:** `text/plain` streaming or JSON `{ "answer": "...", "sources": ["file.pdf"] }`

---

## UI — 3 Steps

### Step 1 — Upload
- `react-dropzone` for drag & drop
- Accepts: `.pdf`, `.txt`, `.docx`
- Shows `FileCard` per file with name, size, remove button
- Parses files client-side for TXT, sends to `/api/ingest` for PDF/DOCX parsing
- "Next" button disabled until at least 1 file is uploaded and parsed

### Step 2 — Configure
- Form fields: API Key (password input), Model selector, Chunk Size slider, Chunk Overlap slider, Top-K slider, System Prompt textarea
- "Build Pipeline" button triggers ingest API call
- Shows animated progress while ingesting (chunk count updates live)
- On success → auto-advance to Step 3

### Step 3 — Chat
- Full chat UI with message history
- Each assistant message shows `SourceChip` components listing which files the answer was drawn from
- Input is disabled while streaming
- "Reset Pipeline" button in header calls `store.reset()` and returns to Step 1

---

## Design System

**Aesthetic:** Dark industrial-technical

| Token | Value |
|---|---|
| `--bg` | `#0E0E0E` |
| `--surface` | `#1A1A1A` |
| `--border` | `#2A2A2A` |
| `--accent` | `#F5820A` |
| `--accent-dim` | `#7A3E05` |
| `--text` | `#E8E8E8` |
| `--text-muted` | `#6B6B6B` |
| `--success` | `#22C55E` |
| `--error` | `#EF4444` |

**Fonts:**
- Headings: `Syne` (Google Fonts)
- Body: `DM Mono` (Google Fonts)

**Motion:** Framer Motion for step transitions (slide + fade). Terminal-style typing animation on ingest progress text.

---

## Default Config Values

```ts
const DEFAULT_CONFIG: PipelineConfig = {
  apiKey: "",
  model: "gemini-2.5-flash",
  chunkSize: 512,
  chunkOverlap: 64,
  topK: 4,
  systemPrompt:
    "You are a helpful assistant. Answer questions based only on the provided context. If the answer is not in the context, say so clearly.",
};
```

---

## Dependencies

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.8.0",
    "zustand": "^5.0.0",
    "react-dropzone": "^14.0.0",
    "framer-motion": "^11.0.0",
    "uuid": "^10.0.0"
  },
  "devDependencies": {
    "@types/uuid": "^10.0.0",
    "@types/pdf-parse": "^1.1.4"
  }
}
```

---

## Rules for Claude

1. **Never store the user's Gemini API key** beyond the lifetime of a single request. It is passed in the request body and used immediately.
2. **Never use a database.** All vector data lives in the module-level Map in `vectorstore.ts`. It resets on server restart — that's intentional.
3. **Always validate** `sessionId`, `apiKey`, and required fields at the top of every API route. Return `400` with a clear message if missing.
4. **Streaming first.** The query route must stream Gemini responses via `ReadableStream`. Do not buffer the full response.
5. **Keep lib functions pure.** `lib/` files must not import from `app/` or `components/`.
6. **TypeScript strict mode.** No `any`. Use types from `types/index.ts`.
7. **Tailwind only for layout/spacing.** Use CSS variables (defined in `globals.css`) for all colors and typography. Do not hardcode hex values in components.
8. **One Zustand store.** Do not create additional stores. Extend `pipeline.ts` if new state is needed.
9. **Build order when starting fresh:** `types` → `lib/*` → `store` → `api routes` → `UI components` → `pages`.
10. **No auth, no database, no external services** beyond the Gemini API.