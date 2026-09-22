-- Log-ON Électriciens — database schema for Supabase (Postgres)
-- Paste this whole file in the Supabase SQL editor and run it once.

create extension if not exists pgcrypto;

-- ---------- tables ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text unique,
  name text not null default '',
  role text not null default 'client' check (role in ('client','pro')),
  created_at timestamptz not null default now()
);

create table if not exists public.electricians (
  id uuid primary key references public.profiles(id) on delete cascade,
  name text not null,
  phone text not null,
  zone_id text not null default 'nabeul',
  lat double precision not null,
  lng double precision not null,
  radius_km int not null default 20,
  skills text[] not null default '{}',
  description text not null default '',
  photo_url text,
  work_photos text[] not null default '{}',
  mode text not null default 'off' check (mode in ('now','evening','off')),
  available_since timestamptz,
  available_until timestamptz,
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  electrician_id uuid not null references public.electricians(id) on delete cascade,
  caller_id uuid not null references auth.users(id) on delete cascade,
  channel text not null default 'call' check (channel in ('call','whatsapp')),
  created_at timestamptz not null default now()
);
create index if not exists calls_electrician_idx on public.calls(electrician_id, created_at desc);
create index if not exists calls_caller_idx on public.calls(caller_id, created_at desc);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  electrician_id uuid not null references public.electricians(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text not null default '',
  stars int not null check (stars between 1 and 5),
  text text not null default '',
  created_at timestamptz not null default now(),
  unique (electrician_id, author_id)
);

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ---------- helpers ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.is_anonymous() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
$$;

-- updated_at + only Log-ON admins can set the "verified" badge
create or replace function public.electricians_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' and not public.is_admin() then
    new.verified := false;
  elsif tg_op = 'UPDATE' and new.verified is distinct from old.verified and not public.is_admin() then
    new.verified := old.verified;
  end if;
  return new;
end $$;
drop trigger if exists electricians_guard on public.electricians;
create trigger electricians_guard before insert or update on public.electricians
  for each row execute function public.electricians_guard();

-- delete my own account (Apple requires in-app account deletion)
create or replace function public.delete_me() returns void
language plpgsql security definer set search_path = public as $$
begin
  delete from auth.users where id = auth.uid();
end $$;

-- ---------- views ----------
create or replace view public.electricians_public with (security_invoker = on) as
  select e.*, coalesce(r.avg_stars, 0)::numeric(3,2) as rating, coalesce(r.n, 0)::int as rating_count
  from public.electricians e
  left join (select electrician_id, avg(stars) as avg_stars, count(*) as n from public.reviews group by electrician_id) r
    on r.electrician_id = e.id;

create or replace view public.electricians_admin with (security_invoker = on) as
  select e.*,
    (select count(*) from public.calls c where c.electrician_id = e.id) as calls_count,
    (select count(*) from public.reviews r where r.electrician_id = e.id) as reviews_count
  from public.electricians e;

-- ---------- row level security ----------
alter table public.profiles enable row level security;
alter table public.electricians enable row level security;
alter table public.calls enable row level security;
alter table public.reviews enable row level security;
alter table public.admins enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert with check (id = auth.uid());
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (id = auth.uid());

drop policy if exists "electricians public read" on public.electricians;
create policy "electricians public read" on public.electricians for select using (true);
drop policy if exists "electricians insert own" on public.electricians;
create policy "electricians insert own" on public.electricians for insert with check (id = auth.uid() and not public.is_anonymous());
drop policy if exists "electricians update own" on public.electricians;
create policy "electricians update own" on public.electricians for update using (id = auth.uid() or public.is_admin());
drop policy if exists "electricians delete own" on public.electricians;
create policy "electricians delete own" on public.electricians for delete using (id = auth.uid() or public.is_admin());

drop policy if exists "calls insert own" on public.calls;
create policy "calls insert own" on public.calls for insert with check (caller_id = auth.uid());
drop policy if exists "calls read" on public.calls;
create policy "calls read" on public.calls for select using (caller_id = auth.uid() or electrician_id = auth.uid() or public.is_admin());

drop policy if exists "reviews public read" on public.reviews;
create policy "reviews public read" on public.reviews for select using (true);
drop policy if exists "reviews insert after a call" on public.reviews;
create policy "reviews insert after a call" on public.reviews for insert with check (
  author_id = auth.uid() and not public.is_anonymous()
  and exists (select 1 from public.calls c where c.caller_id = auth.uid() and c.electrician_id = reviews.electrician_id)
);
drop policy if exists "reviews update own" on public.reviews;
create policy "reviews update own" on public.reviews for update using (author_id = auth.uid());
drop policy if exists "reviews delete own" on public.reviews;
create policy "reviews delete own" on public.reviews for delete using (author_id = auth.uid() or public.is_admin());

drop policy if exists "admins read own" on public.admins;
create policy "admins read own" on public.admins for select using (user_id = auth.uid());

-- ---------- photos (storage) ----------
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict (id) do nothing;
drop policy if exists "photos public read" on storage.objects;
create policy "photos public read" on storage.objects for select using (bucket_id = 'photos');
drop policy if exists "photos insert own" on storage.objects;
create policy "photos insert own" on storage.objects for insert with check (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);
drop policy if exists "photos update own" on storage.objects;
create policy "photos update own" on storage.objects for update using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);
drop policy if exists "photos delete own" on storage.objects;
create policy "photos delete own" on storage.objects for delete using (bucket_id = 'photos' and auth.uid()::text = (storage.foldername(name))[1]);

-- ---------- live updates ----------
do $$ begin
  alter publication supabase_realtime add table public.electricians;
exception when duplicate_object then null; end $$;

-- ---------- make yourself a Log-ON admin ----------
-- 1) create your account in the app (phone + PIN), then run, with your own number:
-- insert into public.admins (user_id) select id from auth.users where email = '216XXXXXXXX@phone.logon.tn';
