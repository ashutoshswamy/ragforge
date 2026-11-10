-- Run this in the Neon SQL Editor (or via psql against DATABASE_URL)
-- https://console.neon.tech/app/projects/<your-project>/sql-editor

-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Pipelines table
create table public.pipelines (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,                        -- Clerk userId
  name text not null default 'Untitled Pipeline',
  config jsonb not null default '{}',           -- model, chunkSize, topK, systemPrompt (NO apiKey)
  chunk_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pipelines_user_id_idx on public.pipelines(user_id);

-- 3. Vector chunks table
--    Gemini embedding dimension locked to 768 via outputDimensionality in lib/gemini.ts
--    pgvector ivfflat/hnsw support max 2000 dims — 768 is well within limits.
create table public.vector_chunks (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  text text not null,
  embedding vector(768),
  source text not null,
  created_at timestamptz not null default now()
);

create index vector_chunks_pipeline_id_idx on public.vector_chunks(pipeline_id);

-- IVFFlat index for approximate nearest-neighbor search
create index vector_chunks_embedding_idx on public.vector_chunks
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- 4. Consent log (cookies, ToS, Privacy Policy, 18+). See db/migrations/002_add_consents.sql
create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  anon_id text,
  kind text not null check (kind in ('cookies', 'terms', 'privacy', 'age_18')),
  granted boolean not null,
  detail text,
  policy_version text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  check (user_id is not null or anon_id is not null)
);

create index consents_user_id_idx on public.consents(user_id);
create index consents_anon_id_idx on public.consents(anon_id);

-- Similarity search done inline via `order by embedding <=> $query limit $k`
-- in lib/vectorstore.ts — no RPC needed, Neon's sql tagged-template runs plain SQL directly.
