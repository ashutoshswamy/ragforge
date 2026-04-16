import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { chunkText } from "@/lib/chunking";
import { embedText } from "@/lib/gemini";
import { store } from "@/lib/vectorstore";
import { supabase } from "@/lib/supabase";
import { IngestRequestSchema } from "@/lib/validation";
import type { VectorChunk } from "@/types";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
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
    const { data: pipeline } = await supabase
      .from("pipelines")
      .select("id")
      .eq("id", pipelineId)
      .eq("user_id", userId)
      .single();

    if (!pipeline) {
      return NextResponse.json(
        { error: "Pipeline not found" },
        { status: 404 }
      );
    }

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

      await store(pipelineId, vectorChunks);
      totalChunks += vectorChunks.length;
    }

    // Update chunk count on pipeline
    await supabase
      .from("pipelines")
      .update({ chunk_count: totalChunks, updated_at: new Date().toISOString() })
      .eq("id", pipelineId);

    return NextResponse.json({ chunks: totalChunks, status: "ok" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
