create type public.event_status as enum ('coming_soon', 'available', 'low_availability', 'sold_out', 'postponed', 'cancelled');
create type public.publish_state as enum ('draft', 'published');

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  series text,
  description text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  venue text not null,
  address text not null,
  city text not null default 'Auckland',
  age_restriction text not null default 'R18 — valid photo ID required',
  ticket_url text not null,
  image_path text not null,
  status public.event_status not null default 'coming_soon',
  publish_state public.publish_state not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_dates_valid check (ends_at > starts_at)
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete set null,
  image_path text not null,
  alt_text text not null,
  caption text,
  sort_order integer not null default 0,
  publish_state public.publish_state not null default 'draft',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.events enable row level security;
alter table public.gallery_items enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

create policy "Published events are public" on public.events for select using (publish_state = 'published' or public.is_admin());
create policy "Admins manage events" on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy "Published gallery is public" on public.gallery_items for select using (publish_state = 'published' or public.is_admin());
create policy "Admins manage gallery" on public.gallery_items for all using (public.is_admin()) with check (public.is_admin());
