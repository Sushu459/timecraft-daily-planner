-- Enable required extension for UUID generation
create extension if not exists pgcrypto;

-- Enums
create type public.task_recurrence as enum ('none','daily','weekly','monthly');
create type public.goal_period as enum ('daily','weekly','monthly');

-- Timestamp trigger function
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Task time validation
create or replace function public.validate_task_time()
returns trigger
language plpgsql
as $$
begin
  if new.end_time <= new.start_time then
    raise exception 'end_time must be after start_time';
  end if;
  return new;
end;
$$;

-- Compute duration
create or replace function public.compute_task_duration()
returns trigger
language plpgsql
as $$
begin
  -- Calculate minutes between times and ensure positive
  new.duration_minutes := greatest(1, (extract(epoch from (new.end_time - new.start_time)) / 60)::int);
  return new;
end;
$$;

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Profiles policies
create policy if not exists "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy if not exists "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy if not exists "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

create policy if not exists "Users can delete their own profile"
  on public.profiles for delete using (auth.uid() = id);

-- Categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, name)
);

alter table public.categories enable row level security;

create index if not exists idx_categories_user on public.categories(user_id);

create policy if not exists "Users can view their categories"
  on public.categories for select using (auth.uid() = user_id);
create policy if not exists "Users can insert their categories"
  on public.categories for insert with check (auth.uid() = user_id);
create policy if not exists "Users can update their categories"
  on public.categories for update using (auth.uid() = user_id);
create policy if not exists "Users can delete their categories"
  on public.categories for delete using (auth.uid() = user_id);

create trigger if not exists trg_categories_updated
  before update on public.categories
  for each row execute function public.update_updated_at();

-- Tasks table
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  description text,
  date date not null,
  start_time time not null,
  end_time time not null,
  duration_minutes integer not null default 1,
  completed boolean not null default false,
  recurrence public.task_recurrence not null default 'none',
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create index if not exists idx_tasks_user_date on public.tasks(user_id, date);

create policy if not exists "Users can view their tasks"
  on public.tasks for select using (auth.uid() = user_id);
create policy if not exists "Users can insert their tasks"
  on public.tasks for insert with check (auth.uid() = user_id);
create policy if not exists "Users can update their tasks"
  on public.tasks for update using (auth.uid() = user_id);
create policy if not exists "Users can delete their tasks"
  on public.tasks for delete using (auth.uid() = user_id);

create trigger if not exists trg_tasks_updated
  before update on public.tasks
  for each row execute function public.update_updated_at();

create trigger if not exists trg_tasks_validate_time
  before insert or update on public.tasks
  for each row execute function public.validate_task_time();

create trigger if not exists trg_tasks_compute_duration
  before insert or update on public.tasks
  for each row execute function public.compute_task_duration();

-- Goals table
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  target_minutes integer not null,
  period public.goal_period not null default 'weekly',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create index if not exists idx_goals_user on public.goals(user_id);

create policy if not exists "Users can view their goals"
  on public.goals for select using (auth.uid() = user_id);
create policy if not exists "Users can insert their goals"
  on public.goals for insert with check (auth.uid() = user_id);
create policy if not exists "Users can update their goals"
  on public.goals for update using (auth.uid() = user_id);
create policy if not exists "Users can delete their goals"
  on public.goals for delete using (auth.uid() = user_id);

create trigger if not exists trg_goals_updated
  before update on public.goals
  for each row execute function public.update_updated_at();

-- Realtime configuration
alter table public.tasks replica identity full;
alter table public.categories replica identity full;
alter table public.goals replica identity full;

do $$ begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tasks'
  ) then
    execute 'alter publication supabase_realtime add table public.tasks';
  end if;
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'categories'
  ) then
    execute 'alter publication supabase_realtime add table public.categories';
  end if;
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'goals'
  ) then
    execute 'alter publication supabase_realtime add table public.goals';
  end if;
end $$;

-- Storage bucket for task files
insert into storage.buckets (id, name, public)
values ('task-files', 'task-files', false)
on conflict (id) do nothing;

-- Storage policies for task-files bucket
create policy if not exists "Task files: users can read own files"
  on storage.objects for select
  using (
    bucket_id = 'task-files' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Task files: users can upload to own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'task-files' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Task files: users can update own files"
  on storage.objects for update
  using (
    bucket_id = 'task-files' and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'task-files' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Task files: users can delete own files"
  on storage.objects for delete
  using (
    bucket_id = 'task-files' and auth.uid()::text = (storage.foldername(name))[1]
  );