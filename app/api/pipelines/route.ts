import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { CreatePipelineSchema } from "@/lib/validation";
import { clear } from "@/lib/vectorstore";

// GET /api/pipelines — list user's pipelines
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("pipelines")
      .select("id, name, config, chunk_count, created_at, updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);

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
    const { userId } = await auth();
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

    const { data, error } = await supabase
      .from("pipelines")
      .insert({ user_id: userId, name, config: safeConfig })
      .select("id, name, created_at")
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ pipeline: data }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/pipelines?id=<uuid> — delete a pipeline and its vectors
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
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

    await clear(pipelineId);

    const { error } = await supabase
      .from("pipelines")
      .delete()
      .eq("id", pipelineId)
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    return NextResponse.json({ status: "deleted" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
