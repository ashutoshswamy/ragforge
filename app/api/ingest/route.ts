import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-server";
import { chunkText } from "@/lib/chunking";
import { extractText } from "@/lib/parse";
import { embedText } from "@/lib/gemini";
import { store } from "@/lib/vectorstore";
import { sql } from "@/lib/db";
import { IngestRequestSchema } from "@/lib/validation";
import type { VectorChunk } from "@/types";

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const result = IngestRequestSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const { pipelineId, apiKey, docs, config } = result.data;
    const { chunkSize, chunkOverlap } = config;

    // Verify pipeline ownership
    const [pipeline] = await sql`
      select id from pipelines where id = ${pipelineId} and user_id = ${userId}
    `;

    if (!pipeline) {
      return NextResponse.json(
        { error: "Pipeline not found" },
        { status: 404 }
      );
    }

    let totalChunks = 0;

    for (const doc of docs) {
      const text = await extractText(doc.name, doc.text);
      const chunks = chunkText(text, chunkSize, chunkOverlap);

      const vectorChunks: VectorChunk[] = [];
      for (const chunk of chunks) {
        const embedding = await embedText(apiKey, chunk.text);
        vectorChunks.push({
          text: chunk.text,
          embedding,
          source: doc.name,
        });
      }

      await store(pipelineId, vectorChunks);
      totalChunks += vectorChunks.length;
    }

    // Update chunk count on pipeline
    await sql`
      update pipelines set chunk_count = ${totalChunks}, updated_at = now()
      where id = ${pipelineId}
    `;

    return NextResponse.json({ chunks: totalChunks, status: "ok" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
