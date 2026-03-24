-- Shared public site view counter for Faith Flight Frenzy.
-- Run this in the Supabase SQL Editor.

begin;

create table if not exists public.site_view_counters (
  slug text primary key,
  view_count bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_view_counters enable row level security;

revoke all on table public.site_view_counters from anon, authenticated;

insert into public.site_view_counters (slug, view_count)
values ('faith-flight-frenzy', 0)
on conflict (slug) do nothing;

drop function if exists public.get_site_view_counter(text);
create or replace function public.get_site_view_counter(
  p_slug text default 'faith-flight-frenzy'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text;
  v_count bigint;
begin
  v_slug := lower(trim(coalesce(p_slug, 'faith-flight-frenzy')));
  if v_slug = '' then
    v_slug := 'faith-flight-frenzy';
  end if;

  insert into public.site_view_counters (slug, view_count)
  values (v_slug, 0)
  on conflict (slug) do nothing;

  select view_count
  into v_count
  from public.site_view_counters
  where slug = v_slug;

  return jsonb_build_object('ok', true, 'slug', v_slug, 'view_count', coalesce(v_count, 0));
end;
$$;

drop function if exists public.increment_site_view_counter(text);
create or replace function public.increment_site_view_counter(
  p_slug text default 'faith-flight-frenzy'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slug text;
  v_count bigint;
begin
  v_slug := lower(trim(coalesce(p_slug, 'faith-flight-frenzy')));
  if v_slug = '' then
    v_slug := 'faith-flight-frenzy';
  end if;

  insert into public.site_view_counters (slug, view_count)
  values (v_slug, 1)
  on conflict (slug)
  do update set
    view_count = public.site_view_counters.view_count + 1,
    updated_at = now()
  returning view_count into v_count;

  return jsonb_build_object('ok', true, 'slug', v_slug, 'view_count', coalesce(v_count, 0));
end;
$$;

grant execute on function public.get_site_view_counter(text) to anon, authenticated;
grant execute on function public.increment_site_view_counter(text) to anon, authenticated;

commit;