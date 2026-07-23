-- Nakhil Real Estate Agent MVP — Supabase schema (run when you connect Supabase)

create extension if not exists vector;

create table tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ar text not null,
  name_en text,
  vertical text not null default 'real_estate',
  agent_name_ar text,
  welcome_message_ar text,
  primary_color text default '#0d6e4f',
  created_at timestamptz default now()
);

create table agents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  model text default 'gpt-4o-mini',
  system_prompt_extra text,
  language text default 'ar',
  created_at timestamptz default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  slug text not null,
  payload jsonb not null,
  unique (tenant_id, slug)
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  title text,
  source_type text,
  content text,
  embedding vector(1536),
  created_at timestamptz default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  interest text,
  project_id text,
  unit_id text,
  preferred_visit text,
  notes text,
  source text default 'chat',
  created_at timestamptz default now()
);

create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz default now()
);

create index leads_tenant_created on leads (tenant_id, created_at desc);
