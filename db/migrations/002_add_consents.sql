-- Migration: record cookie consent + auth consent (ToS, Privacy Policy, 18+)
-- Append-only log: never update rows, add a new one when a choice changes.

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id text,                       -- Firebase uid, null for anonymous cookie choices
  anon_id text,                       -- random browser id, links pre-login cookie choice
  kind text not null check (kind in ('cookies', 'terms', 'privacy', 'age_18')),
  granted boolean not null,
  detail text,                        -- cookies: 'all' | 'essential'
  policy_version text not null,       -- see POLICY_VERSION in lib/consent.ts
  user_agent text,
  created_at timestamptz not null default now(),
  check (user_id is not null or anon_id is not null)
);

create index consents_user_id_idx on public.consents(user_id);
create index consents_anon_id_idx on public.consents(anon_id);
