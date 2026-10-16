-- Schema do banco do ChatSelect (Supabase / Postgres).
--
-- Rode este arquivo uma vez no SQL Editor do projeto Supabase
-- (Dashboard → SQL Editor → New query → colar → Run). É idempotente:
-- pode ser rodado de novo sem perder dados.
--
-- Uma única tabela guarda tanto as fichas publicadas quanto as solicitações
-- enviadas pelo público. O que separa uma da outra é a coluna `status`:
--   pending  → enviada pelo formulário /solicitar, aguardando o admin
--   approved → publicada no site
--   rejected → recusada pelo admin (fica guardada, mas não aparece no site)

create table if not exists public.instruments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sheet_name text not null,
  title text not null,
  authors text,
  original_language text,
  translations text,
  description text,
  instrument_link text,
  instrument_type text,
  instrument_description text,
  category text,
  quality_attributes text,
  attributes text,
  communication_modalities text,
  original_sample text,
  item_count text,
  response_format text,
  scoring text,
  reliability text,
  reference_result text,
  advantages text[] not null default '{}',
  limitations text[] not null default '{}',
  source text,
  classification text not null default 'adapted'
    check (classification in ('adapted', 'ad-hoc')),
  is_dual_application boolean not null default false,

  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  submitter_name text,
  submitter_email text,
  submitter_notes text,
  review_notes text,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists instruments_status_idx
  on public.instruments (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists instruments_set_updated_at on public.instruments;
create trigger instruments_set_updated_at
  before update on public.instruments
  for each row execute function public.set_updated_at();

-- RLS ligado e SEM nenhuma policy: a chave pública (anon) não lê nem escreve
-- nada nesta tabela. Todo acesso passa pelo servidor do Next.js com a chave
-- secreta (service role), que é quem aplica as regras (só fichas
-- `approved` no site, só admin aprova/edita/exclui).
alter table public.instruments enable row level security;
