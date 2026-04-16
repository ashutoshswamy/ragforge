import { supabase } from "@/lib/supabase";
import type { VectorChunk } from "@/types";

export async function store(
  pipelineId: string,
  chunks: VectorChunk[]
): Promise<void> {
  const rows = chunks.map((chunk) => ({
    pipeline_id: pipelineId,
    text: chunk.text,
    embedding: JSON.stringify(chunk.embedding),
    source: chunk.source,
  }));

  const { error } = await supabase.from("vector_chunks").insert(rows);
  if (error) throw new Error(`Failed to store vectors: ${error.message}`);
}

export async function search(
  pipelineId: string,
  queryEmbedding: number[],
  topK: number
): Promise<VectorChunk[]> {
  const { data, error } = await supabase.rpc("match_vector_chunks", {
    query_embedding: JSON.stringify(queryEmbedding),
    match_pipeline_id: pipelineId,
    match_count: topK,
  });

  if (error) throw new Error(`Failed to search vectors: ${error.message}`);

  return (data ?? []).map((row: { text: string; source: string }) => ({
    text: row.text,
    embedding: [],
    source: row.source,
  }));
}

export async function clear(pipelineId: string): Promise<void> {
  const { error } = await supabase
    .from("vector_chunks")
    .delete()
    .eq("pipeline_id", pipelineId);

  if (error) throw new Error(`Failed to clear vectors: ${error.message}`);
}
