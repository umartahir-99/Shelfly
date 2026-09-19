create extension if not exists pgcrypto;

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  author text not null,
  cover_image text,
  status text not null check (status in ('want_to_read', 'reading', 'finished')),
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

drop policy if exists "Users can view their own books" on public.books;
drop policy if exists "Users can insert their own books" on public.books;
drop policy if exists "Users can update their own books" on public.books;
drop policy if exists "Users can delete their own books" on public.books;

create policy "Users can view their own books"
on public.books for select
using (auth.uid() = user_id);

create policy "Users can insert their own books"
on public.books for insert
with check (auth.uid() = user_id);

create policy "Users can update their own books"
on public.books for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own books"
on public.books for delete
using (auth.uid() = user_id);

create index if not exists books_user_id_idx on public.books (user_id);
create index if not exists books_created_at_idx on public.books (created_at desc);
