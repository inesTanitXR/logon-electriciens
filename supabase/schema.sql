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
  status text not null default 'pending' check (status in ('pending','approved','refused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- upgrade from the first version (verified boolean → status)
do $$ begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='electricians' and column_name='verified') then
    alter table public.electricians add column if not exists status text not null default 'pending';
    update public.electricians set status = case when verified then 'approved' else 'pending' end;
    alter table public.electricians drop column verified;
    alter table public.electricians add constraint electricians_status_check check (status in ('pending','approved','refused'));
  end if;
end $$;

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

-- devis: a client (or an electrician on the client's behalf) sends Log-ON a photo of the materials list
create table if not exists public.devis (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  submitted_by text not null default 'client' check (submitted_by in ('client','pro')),
  electrician_id uuid references public.electricians(id) on delete set null,
  client_name text not null default '',
  client_phone text not null,
  note text not null default '',
  photos text[] not null default '{}',
  delivery text not null default 'pickup' check (delivery in ('pickup','delivery')),
  delivery_zone_id text,
  status text not null default 'received' check (status in ('received','quoted','confirmed','ready','delivered','cancelled')),
  admin_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists devis_created_by_idx on public.devis(created_by, created_at desc);
create index if not exists devis_status_idx on public.devis(status, created_at desc);

-- the current promotion (one row), edited by Log-ON admins from the app
create table if not exists public.promo (
  id int primary key default 1 check (id = 1),
  active boolean not null default false,
  title_fr text not null default '',
  title_ar text not null default '',
  text_fr text not null default '',
  text_ar text not null default '',
  image_url text,
  ends_on date,
  updated_at timestamptz not null default now()
);
insert into public.promo (id) values (1) on conflict (id) do nothing;

-- ---------- helpers ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.is_anonymous() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false);
$$;

-- updated_at + only Log-ON admins can approve an electrician; a non-approved electrician can't be "available"
create or replace function public.electricians_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' and not public.is_admin() then
    new.status := 'pending';
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status and not public.is_admin() then
    new.status := old.status;
  end if;
  if new.status <> 'approved' then
    new.mode := 'off'; new.available_since := null; new.available_until := null;
  end if;
  return new;
end $$;
drop trigger if exists electricians_guard on public.electricians;
create trigger electricians_guard before insert or update on public.electricians
  for each row execute function public.electricians_guard();

-- devis: the person who sent it can only cancel it; Log-ON admins can change everything
create or replace function public.devis_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' and not public.is_admin() then
    if new.status <> 'cancelled' or old.status not in ('received','quoted') then
      raise exception 'only Log-ON can update a devis';
    end if;
    new.client_name := old.client_name; new.client_phone := old.client_phone; new.note := old.note; new.photos := old.photos;
    new.electrician_id := old.electrician_id; new.delivery := old.delivery; new.delivery_zone_id := old.delivery_zone_id;
    new.admin_note := old.admin_note; new.submitted_by := old.submitted_by; new.created_by := old.created_by;
  end if;
  return new;
end $$;
drop trigger if exists devis_guard on public.devis;
create trigger devis_guard before insert or update on public.devis
  for each row execute function public.devis_guard();

create or replace function public.promo_touch() returns trigger
language plpgsql as $$ begin new.updated_at := now(); return new; end $$;
drop trigger if exists promo_touch on public.promo;
create trigger promo_touch before update on public.promo for each row execute function public.promo_touch();

-- delete my own account (Apple requires in-app account deletion)
create or replace function public.delete_me() returns void
language plpgsql security definer set search_path = public as $$
begin
  delete from auth.users where id = auth.uid();
end $$;

-- ---------- views ----------
drop view if exists public.electricians_public;
drop view if exists public.electricians_admin;
create view public.electricians_public with (security_invoker = on) as
  select e.*, coalesce(r.avg_stars, 0)::numeric(3,2) as rating, coalesce(r.n, 0)::int as rating_count
  from public.electricians e
  left join (select electrician_id, avg(stars) as avg_stars, count(*) as n from public.reviews group by electrician_id) r
    on r.electrician_id = e.id;

create view public.electricians_admin with (security_invoker = on) as
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
alter table public.devis enable row level security;
alter table public.promo enable row level security;

drop policy if exists "profiles read own" on public.profiles;
create policy "profiles read own" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert with check (id = auth.uid());
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update using (id = auth.uid());

drop policy if exists "electricians public read" on public.electricians;
create policy "electricians public read" on public.electricians for select using (status = 'approved' or id = auth.uid() or public.is_admin());
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

drop policy if exists "devis insert own" on public.devis;
create policy "devis insert own" on public.devis for insert with check (created_by = auth.uid());
drop policy if exists "devis read" on public.devis;
create policy "devis read" on public.devis for select using (created_by = auth.uid() or electrician_id = auth.uid() or public.is_admin());
drop policy if exists "devis update" on public.devis;
create policy "devis update" on public.devis for update using (created_by = auth.uid() or public.is_admin());

drop policy if exists "promo public read" on public.promo;
create policy "promo public read" on public.promo for select using (true);
drop policy if exists "promo admin write" on public.promo;
create policy "promo admin write" on public.promo for update using (public.is_admin());

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

-- devis photos: private bucket, readable by the sender and by Log-ON
insert into storage.buckets (id, name, public) values ('devis', 'devis', false) on conflict (id) do nothing;
drop policy if exists "devis photos insert own" on storage.objects;
create policy "devis photos insert own" on storage.objects for insert with check (bucket_id = 'devis' and auth.uid()::text = (storage.foldername(name))[1]);
drop policy if exists "devis photos read" on storage.objects;
create policy "devis photos read" on storage.objects for select using (bucket_id = 'devis' and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin()));
-- promotion image: admins write in the public "photos" bucket under promo/
drop policy if exists "promo image admin" on storage.objects;
create policy "promo image admin" on storage.objects for insert with check (bucket_id = 'photos' and (storage.foldername(name))[1] = 'promo' and public.is_admin());
drop policy if exists "promo image admin update" on storage.objects;
create policy "promo image admin update" on storage.objects for update using (bucket_id = 'photos' and (storage.foldername(name))[1] = 'promo' and public.is_admin());

-- ---------- live updates ----------
do $$ begin
  alter publication supabase_realtime add table public.electricians;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.devis;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.promo;
exception when duplicate_object then null; end $$;

-- ---------- make yourself a Log-ON admin ----------
-- 1) create your account in the app (phone + PIN), then run, with your own number:
-- insert into public.admins (user_id) select id from auth.users where email = '216XXXXXXXX@phone.logon.tn';
