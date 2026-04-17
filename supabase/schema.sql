-- Roles e acesso por usuario (assinatura / biblioteca).
-- RLS restrito: o cliente autenticado só LÊ a própria linha.
-- Não há policy de INSERT/UPDATE para authenticated — quem cria a linha é o trigger (security definer);
-- library_access e role só devem mudar via Service Role (webhook de pagamento, job interno) ou SQL admin.
-- Nunca exponha a service_role key no browser.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'user')),
  library_access boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Orcamentos publicos (sem login para criar)
create table if not exists public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  whatsapp text,
  company text,
  project_type text not null,
  budget_range text not null,
  desired_deadline text not null,
  start_date text,
  project_goal text not null,
  desired_features text not null,
  references_url text,
  additional_notes text,
  created_at timestamptz not null default now()
);

alter table public.orcamentos enable row level security;

-- Insert público com limites de tamanho (anti-abuse, alinhado a src/lib/orcamento-limits.ts).
drop policy if exists "orcamentos_insert_public" on public.orcamentos;
create policy "orcamentos_insert_public"
on public.orcamentos
for insert
to anon, authenticated
with check (
  char_length(trim(full_name)) between 1 and 200
  and char_length(trim(email)) between 3 and 254
  and char_length(trim(coalesce(whatsapp, ''))) <= 40
  and char_length(trim(coalesce(company, ''))) <= 200
  and char_length(trim(project_type)) between 1 and 120
  and char_length(trim(budget_range)) between 1 and 80
  and char_length(trim(desired_deadline)) between 1 and 80
  and char_length(trim(coalesce(start_date, ''))) <= 40
  and char_length(trim(project_goal)) between 1 and 4000
  and char_length(trim(desired_features)) between 1 and 8000
  and char_length(trim(coalesce(references_url, ''))) <= 2000
  and char_length(trim(coalesce(additional_notes, ''))) <= 4000
);

create policy "orcamentos_select_admin_only"
on public.orcamentos
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  )
);

-- Preencher profile automaticamente ao criar usuario no Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role, library_access)
  values (new.id, 'user', false)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
