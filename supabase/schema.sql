create extension if not exists pgcrypto;

do $$ begin
  create type public.event_status as enum (
    'coming_soon', 'available', 'low_availability', 'sold_out', 'postponed', 'cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.publish_state as enum ('draft', 'published');
exception when duplicate_object then null;
end $$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  name text not null,
  series text,
  place_line text not null default '',
  paragraphs jsonb not null default '[]'::jsonb,
  description text not null default '',
  past boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  venue text not null default '',
  address text not null default '',
  city text not null default 'Auckland',
  age_restriction text not null default '',
  ticket_url text not null default '',
  image_path text not null default '',
  status public.event_status not null default 'coming_soon',
  publish_state public.publish_state not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  image_path text not null,
  alt_text text not null default '',
  caption text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create or replace function public.limit_event_gallery()
returns trigger
language plpgsql
as $$
begin
  if (
    select count(*)
    from public.gallery_items
    where event_id = new.event_id and id is distinct from new.id
  ) >= 10 then
    raise exception 'An event gallery holds at most ten photographs';
  end if;
  return new;
end;
$$;

drop trigger if exists gallery_items_limit on public.gallery_items;
create trigger gallery_items_limit
  before insert or update of event_id on public.gallery_items
  for each row execute function public.limit_event_gallery();

alter table public.admin_users enable row level security;

drop policy if exists "Managers read their own row" on public.admin_users;
create policy "Managers read their own row" on public.admin_users
  for select using (user_id = auth.uid());
alter table public.events enable row level security;
alter table public.gallery_items enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

drop policy if exists "Published events are public" on public.events;
create policy "Published events are public" on public.events
  for select using (publish_state = 'published' or public.is_admin());

drop policy if exists "Admins manage events" on public.events;
create policy "Admins manage events" on public.events
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Published gallery is public" on public.gallery_items;
create policy "Published gallery is public" on public.gallery_items
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.events
      where events.id = gallery_items.event_id and events.publish_state = 'published'
    )
  );

drop policy if exists "Admins manage gallery" on public.gallery_items;
create policy "Admins manage gallery" on public.gallery_items
  for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Public reads event photos" on storage.objects;
create policy "Public reads event photos" on storage.objects
  for select using (bucket_id = 'event-photos');

drop policy if exists "Admins write event photos" on storage.objects;
create policy "Admins write event photos" on storage.objects
  for all using (bucket_id = 'event-photos' and public.is_admin())
  with check (bucket_id = 'event-photos' and public.is_admin());

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on public.events to anon, authenticated, service_role;
grant select, insert, update, delete on public.gallery_items to anon, authenticated, service_role;
grant select, insert, update, delete on public.admin_users to authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.limit_event_gallery() to authenticated, service_role;
