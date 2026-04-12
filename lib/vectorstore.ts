import type { VectorChunk } from "@/types";

interface SessionData {
  chunks: VectorChunk[];
  lastAccessed: number;
}

const vectorStores = new Map<string, SessionData>();

// Constants for resource management
const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_SESSIONS = 100;
const MAX_TOTAL_CHUNKS = 50000;

let globalChunkCount = 0;

function pruneInactiveSessions() {
  const now = Date.now();
  for (const [sessionId, data] of vectorStores.entries()) {
    if (now - data.lastAccessed > SESSION_TTL_MS) {
      globalChunkCount -= data.chunks.length;
      vectorStores.delete(sessionId);
    }
  }

  // If still over capacity, remove oldest sessions
  if (vectorStores.size > MAX_SESSIONS) {
    const sorted = Array.from(vectorStores.entries()).sort(
      (a, b) => a[1].lastAccessed - b[1].lastAccessed
    );
    while (vectorStores.size > MAX_SESSIONS) {
      const oldest = sorted.shift();
      if (oldest) {
        globalChunkCount -= oldest[1].chunks.length;
        vectorStores.delete(oldest[0]);
      }
    }
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  if (magnitude === 0) return 0;
  return dot / magnitude;
}

export function store(sessionId: string, chunks: VectorChunk[]): void {
  pruneInactiveSessions();

  if (globalChunkCount + chunks.length > MAX_TOTAL_CHUNKS) {
    throw new Error("Global memory limit reached. Please try again later.");
  }

  const existing = vectorStores.get(sessionId);
  if (existing) {
    existing.chunks.push(...chunks);
    existing.lastAccessed = Date.now();
  } else {
    vectorStores.set(sessionId, {
      chunks: [...chunks],
      lastAccessed: Date.now(),
    });
  }
  globalChunkCount += chunks.length;
}

export function search(
  sessionId: string,
  queryEmbedding: number[],
  topK: number
): VectorChunk[] {
  const data = vectorStores.get(sessionId);
  if (!data || data.chunks.length === 0) return [];

  // Update last accessed
  data.lastAccessed = Date.now();

  const scored = data.chunks.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}

export function clear(sessionId: string): void {
  const data = vectorStores.get(sessionId);
  if (data) {
    globalChunkCount -= data.chunks.length;
    vectorStores.delete(sessionId);
  }
}
