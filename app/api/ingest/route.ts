import { NextResponse } from "next/server";
import { chunkText } from "@/lib/chunking";
import { embedText } from "@/lib/gemini";
import { store } from "@/lib/vectorstore";
import { IngestRequestSchema } from "@/lib/validation";
import type { VectorChunk } from "@/types";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid Authorization header" },
        { status: 401 }
      );
    }
    const apiKey = authHeader.replace("Bearer ", "");

    const json = await request.json();
    const result = IngestRequestSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const { sessionId, docs, config } = result.data;
    const { chunkSize, chunkOverlap } = config;

    let totalChunks = 0;

    for (const doc of docs) {
      const chunks = chunkText(doc.text, chunkSize, chunkOverlap);

      const vectorChunks: VectorChunk[] = [];
      for (const chunk of chunks) {
        const embedding = await embedText(apiKey, chunk.text);
        vectorChunks.push({
          text: chunk.text,
          embedding,
          source: doc.name,
        });
      }

      store(sessionId, vectorChunks);
      totalChunks += vectorChunks.length;
    }

    return NextResponse.json({ chunks: totalChunks, status: "ok" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
