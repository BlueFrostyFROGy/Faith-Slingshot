-- Live character publishing RPCs (admin-only) for Faith Flight Frenzy
-- Run this in Supabase SQL Editor after game_accounts_rpc.sql.

begin;

create table if not exists public.published_characters (
  id text primary key,
  name text not null,
  initials text not null default 'C',
  trait text not null default 'Custom build',
  bio text not null default 'Admin-published character.',
  ability text not null default 'rocket',
  mass double precision not null default 1.0,
  radius integer not null default 28,
  drag double precision not null default 0.08,
  bounce double precision not null default 0.6,
  gravity_mult double precision not null default 1.0,
  launch_boost double precision not null default 1.1,
  unlock_at integer not null default 0,
  image_data text,
  item_image_data text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists published_characters_updated_at_idx
  on public.published_characters (updated_at desc);

alter table public.published_characters enable row level security;

-- Public read for all players.
drop policy if exists "published_characters_public_read" on public.published_characters;
create policy "published_characters_public_read"
  on public.published_characters
  for select
  to anon, authenticated
  using (true);

-- No direct writes by anon/authenticated; writes go through RPC below.
revoke all on table public.published_characters from anon, authenticated;
grant select on table public.published_characters to anon, authenticated;

drop function if exists public.upsert_game_character(
  text, text, text, text, text, text, text, text,
  double precision, integer, double precision, double precision,
  double precision, double precision, integer, text, text
);
create or replace function public.upsert_game_character(
  p_account_name text,
  p_password_hash text,
  p_id text,
  p_name text,
  p_initials text,
  p_trait text,
  p_bio text,
  p_ability text,
  p_mass double precision,
  p_radius integer,
  p_drag double precision,
  p_bounce double precision,
  p_gravity_mult double precision,
  p_launch_boost double precision,
  p_unlock_at integer,
  p_image_data text,
  p_item_image_data text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_hash text;
  v_id text;
begin
  v_name := lower(trim(coalesce(p_account_name, '')));
  v_id := lower(trim(coalesce(p_id, '')));

  if v_name = '' or coalesce(p_password_hash, '') = '' then
    return jsonb_build_object('ok', false, 'error', 'invalid_credentials');
  end if;

  select password_hash into v_hash
  from public.game_accounts
  where account_name = v_name;

  if v_hash is null or v_hash <> p_password_hash then
    return jsonb_build_object('ok', false, 'error', 'invalid_credentials');
  end if;

  if v_name <> 'admin' then
    return jsonb_build_object('ok', false, 'error', 'admin_required');
  end if;

  if v_id = '' or length(v_id) < 2 then
    return jsonb_build_object('ok', false, 'error', 'invalid_character_id');
  end if;

  insert into public.published_characters (
    id,
    name,
    initials,
    trait,
    bio,
    ability,
    mass,
    radius,
    drag,
    bounce,
    gravity_mult,
    launch_boost,
    unlock_at,
    image_data,
    item_image_data,
    updated_at
  )
  values (
    v_id,
    left(coalesce(nullif(trim(p_name), ''), 'Custom'), 24),
    left(upper(coalesce(nullif(trim(p_initials), ''), 'C')), 3),
    left(coalesce(nullif(p_trait, ''), 'Custom build'), 48),
    left(coalesce(nullif(p_bio, ''), 'Admin-published character.'), 160),
    left(coalesce(nullif(trim(p_ability), ''), 'rocket'), 32),
    greatest(0.72, least(coalesce(p_mass, 1.0), 1.5)),
    greatest(16, least(coalesce(p_radius, 28), 56)),
    greatest(0.01, least(coalesce(p_drag, 0.08), 0.3)),
    greatest(0.2, least(coalesce(p_bounce, 0.6), 0.95)),
    greatest(0.6, least(coalesce(p_gravity_mult, 1.0), 1.4)),
    greatest(0.7, least(coalesce(p_launch_boost, 1.1), 1.8)),
    greatest(0, coalesce(p_unlock_at, 0)),
    case when left(coalesce(p_image_data, ''), 22) = 'data:image/png;base64,' then p_image_data else null end,
    case when left(coalesce(p_item_image_data, ''), 22) = 'data:image/png;base64,' then p_item_image_data else null end,
    now()
  )
  on conflict (id)
  do update set
    name = excluded.name,
    initials = excluded.initials,
    trait = excluded.trait,
    bio = excluded.bio,
    ability = excluded.ability,
    mass = excluded.mass,
    radius = excluded.radius,
    drag = excluded.drag,
    bounce = excluded.bounce,
    gravity_mult = excluded.gravity_mult,
    launch_boost = excluded.launch_boost,
    unlock_at = excluded.unlock_at,
    image_data = excluded.image_data,
    item_image_data = excluded.item_image_data,
    updated_at = now();

  update public.game_accounts
  set updated_at = now()
  where account_name = v_name;

  return jsonb_build_object('ok', true);
end;
$$;

drop function if exists public.delete_game_character(text, text, text);
create or replace function public.delete_game_character(
  p_account_name text,
  p_password_hash text,
  p_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_hash text;
  v_id text;
begin
  v_name := lower(trim(coalesce(p_account_name, '')));
  v_id := lower(trim(coalesce(p_id, '')));

  if v_name = '' or coalesce(p_password_hash, '') = '' then
    return jsonb_build_object('ok', false, 'error', 'invalid_credentials');
  end if;

  select password_hash into v_hash
  from public.game_accounts
  where account_name = v_name;

  if v_hash is null or v_hash <> p_password_hash then
    return jsonb_build_object('ok', false, 'error', 'invalid_credentials');
  end if;

  if v_name <> 'admin' then
    return jsonb_build_object('ok', false, 'error', 'admin_required');
  end if;

  if v_id = '' then
    return jsonb_build_object('ok', false, 'error', 'invalid_character_id');
  end if;

  delete from public.published_characters
  where id = v_id;

  update public.game_accounts
  set updated_at = now()
  where account_name = v_name;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.upsert_game_character(
  text, text, text, text, text, text, text, text,
  double precision, integer, double precision, double precision,
  double precision, double precision, integer, text, text
) to anon, authenticated;
grant execute on function public.delete_game_character(text, text, text) to anon, authenticated;

commit;
