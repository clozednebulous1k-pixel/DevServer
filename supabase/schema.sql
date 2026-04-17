-- Roles e acesso por usuario
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

create policy "orcamentos_insert_public"
on public.orcamentos
for insert
to anon, authenticated
with check (true);

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
