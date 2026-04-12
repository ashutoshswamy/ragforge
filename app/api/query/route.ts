import { NextResponse } from "next/server";
import { embedText } from "@/lib/gemini";
import { search } from "@/lib/vectorstore";
import { queryRAG } from "@/lib/rag";
import { QueryRequestSchema } from "@/lib/validation";

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
    const result = QueryRequestSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const { sessionId, question, config } = result.data;
    const { model, topK, systemPrompt } = config;

    const queryEmbedding = await embedText(apiKey, question);
    const relevantChunks = search(sessionId, queryEmbedding, topK);

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
