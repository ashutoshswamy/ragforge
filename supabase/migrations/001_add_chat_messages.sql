-- Migration: Add chat_messages table for persisting conversation history per pipeline

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  pipeline_id uuid not null references public.pipelines(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb default '[]',
  created_at timestamptz not null default now()
);

create index chat_messages_pipeline_id_idx on public.chat_messages(pipeline_id);
