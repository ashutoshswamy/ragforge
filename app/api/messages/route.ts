import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-server";
import { sql } from "@/lib/db";
import { SaveMessagesSchema } from "@/lib/validation";

// GET /api/messages?pipelineId=xxx — load chat history
export async function GET(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pipelineId = searchParams.get("pipelineId");

    if (!pipelineId) {
      return NextResponse.json({ error: "Missing pipelineId" }, { status: 400 });
    }

    // Verify pipeline ownership
    const [pipeline] = await sql`
      select id from pipelines where id = ${pipelineId} and user_id = ${userId}
    `;

    if (!pipeline) {
      return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });
    }

    const data = await sql`
      select role, content, sources
      from chat_messages
      where pipeline_id = ${pipelineId}
      order by created_at asc
    `;

    return NextResponse.json({ messages: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/messages — save messages (batch)
export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const result = SaveMessagesSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { pipelineId, messages } = result.data;

    // Verify pipeline ownership
    const [pipeline] = await sql`
      select id from pipelines where id = ${pipelineId} and user_id = ${userId}
    `;

    if (!pipeline) {
      return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });
    }

    for (const msg of messages) {
      await sql`
        insert into chat_messages (pipeline_id, role, content, sources)
        values (${pipelineId}, ${msg.role}, ${msg.content}, ${JSON.stringify(msg.sources ?? [])})
      `;
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
