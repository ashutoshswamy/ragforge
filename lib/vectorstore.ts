import { sql } from "@/lib/db";
import type { VectorChunk } from "@/types";

export async function store(
  pipelineId: string,
  chunks: VectorChunk[]
): Promise<void> {
  // ponytail: sequential inserts, one round-trip per chunk. Batch with unnest() if ingest of large docs gets slow.
  for (const chunk of chunks) {
    await sql`
      insert into vector_chunks (pipeline_id, text, embedding, source)
      values (${pipelineId}, ${chunk.text}, ${JSON.stringify(chunk.embedding)}, ${chunk.source})
    `;
  }
}

export async function search(
  pipelineId: string,
  queryEmbedding: number[],
  topK: number
): Promise<VectorChunk[]> {
  const rows = (await sql`
    select text, source
    from vector_chunks
    where pipeline_id = ${pipelineId}
    order by embedding <=> ${JSON.stringify(queryEmbedding)}
    limit ${topK}
  `) as { text: string; source: string }[];

  return rows.map((row) => ({
    text: row.text,
    embedding: [],
    source: row.source,
  }));
}

export async function clear(pipelineId: string): Promise<void> {
  await sql`delete from vector_chunks where pipeline_id = ${pipelineId}`;
}
