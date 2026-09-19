import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-server";
import { sql } from "@/lib/db";
import { CreatePipelineSchema } from "@/lib/validation";
import { clear } from "@/lib/vectorstore";

// GET /api/pipelines — list user's pipelines
export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await sql`
      select id, name, config, chunk_count, created_at, updated_at
      from pipelines
      where user_id = ${userId}
      order by updated_at desc
    `;

    return NextResponse.json({ pipelines: data ?? [] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/pipelines — create a new pipeline record
export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const result = CreatePipelineSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const { name, config } = result.data;

    // Never store apiKey in DB
    const { apiKey: _apiKey, ...safeConfig } = config;
    void _apiKey;

    const [pipeline] = await sql`
      insert into pipelines (user_id, name, config)
      values (${userId}, ${name}, ${JSON.stringify(safeConfig)})
      returning id, name, created_at
    `;

    return NextResponse.json({ pipeline }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/pipelines?id=<uuid> — delete a pipeline and its vectors
export async function DELETE(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pipelineId = searchParams.get("id");

    if (!pipelineId) {
      return NextResponse.json(
        { error: "Missing pipeline id" },
        { status: 400 }
      );
    }

    // Verify ownership
    const [pipeline] = await sql`
      select id from pipelines where id = ${pipelineId} and user_id = ${userId}
    `;

    if (!pipeline) {
      return NextResponse.json(
        { error: "Pipeline not found" },
        { status: 404 }
      );
    }

    await clear(pipelineId);

    await sql`delete from pipelines where id = ${pipelineId} and user_id = ${userId}`;

    return NextResponse.json({ status: "deleted" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
