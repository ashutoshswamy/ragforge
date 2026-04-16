import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { embedText } from "@/lib/gemini";
import { search } from "@/lib/vectorstore";
import { queryRAG } from "@/lib/rag";
import { supabase } from "@/lib/supabase";
import { QueryRequestSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const result = QueryRequestSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const { pipelineId, apiKey, question, config } = result.data;
    const { model, topK, systemPrompt } = config;

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

    const queryEmbedding = await embedText(apiKey, question);
    const relevantChunks = await search(pipelineId, queryEmbedding, topK);

    if (relevantChunks.length === 0) {
      return NextResponse.json(
        {
          answer:
            "No relevant context found. Please make sure documents have been ingested.",
          sources: [],
        },
        { status: 200 }
      );
    }

    const sources = [
      ...new Set(relevantChunks.map((chunk) => chunk.source)),
    ];

    const stream = await queryRAG(
      apiKey,
      model,
      systemPrompt,
      relevantChunks,
      question
    );

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Sources": JSON.stringify(sources),
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
