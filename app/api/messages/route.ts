import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

// GET /api/messages?pipelineId=xxx — load chat history
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pipelineId = searchParams.get("pipelineId");

    if (!pipelineId) {
      return NextResponse.json({ error: "Missing pipelineId" }, { status: 400 });
    }

    // Verify pipeline ownership
    const { data: pipeline } = await supabase
      .from("pipelines")
      .select("id")
      .eq("id", pipelineId)
      .eq("user_id", userId)
      .single();

    if (!pipeline) {
      return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("chat_messages")
      .select("role, content, sources")
      .eq("pipeline_id", pipelineId)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return NextResponse.json({ messages: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/messages — save messages (batch)
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pipelineId, messages } = await request.json();

    if (!pipelineId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Verify pipeline ownership
    const { data: pipeline } = await supabase
      .from("pipelines")
      .select("id")
      .eq("id", pipelineId)
      .eq("user_id", userId)
      .single();

    if (!pipeline) {
      return NextResponse.json({ error: "Pipeline not found" }, { status: 404 });
    }

    const rows = messages.map((msg: { role: string; content: string; sources?: string[] }) => ({
      pipeline_id: pipelineId,
      role: msg.role,
      content: msg.content,
      sources: msg.sources ?? [],
    }));

    const { error } = await supabase.from("chat_messages").insert(rows);
    if (error) throw new Error(error.message);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
