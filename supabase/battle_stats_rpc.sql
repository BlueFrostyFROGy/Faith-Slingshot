-- Battle stats sync for public leaderboard + per-account K/D/KDR tracking
-- Run this in Supabase SQL Editor.

begin;

create table if not exists public.battle_player_stats (
  account_name text primary key references public.game_accounts(account_name) on delete cascade,
  display_name text not null default 'Player',
  lifetime_kills integer not null default 0,
  lifetime_deaths integer not null default 0,
  best_kdr numeric(10,2) not null default 0,
  most_kills_single_match integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists battle_player_stats_kills_idx
  on public.battle_player_stats (lifetime_kills desc);

create index if not exists battle_player_stats_best_kdr_idx
  on public.battle_player_stats (best_kdr desc);

alter table public.battle_player_stats enable row level security;

revoke all on table public.battle_player_stats from anon, authenticated;

drop policy if exists "Battle stats readable by everyone" on public.battle_player_stats;
create policy "Battle stats readable by everyone"
  on public.battle_player_stats
  for select
  to anon, authenticated
  using (true);

drop function if exists public.upsert_game_battle_stats(text, text, text, integer, integer, numeric, integer);
create or replace function public.upsert_game_battle_stats(
  p_account_name text,
  p_password_hash text,
  p_display_name text,
  p_lifetime_kills integer,
  p_lifetime_deaths integer,
  p_best_kdr numeric,
  p_most_kills_single_match integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_hash text;
begin
  v_name := lower(trim(coalesce(p_account_name, '')));
  if v_name = '' or coalesce(p_password_hash, '') = '' then
    return jsonb_build_object('ok', false, 'error', 'invalid_credentials');
  end if;

  select password_hash
  into v_hash
  from public.game_accounts
  where account_name = v_name;

  if v_hash is null or v_hash <> p_password_hash then
    return jsonb_build_object('ok', false, 'error', 'invalid_credentials');
  end if;

  insert into public.battle_player_stats (
    account_name,
    display_name,
    lifetime_kills,
    lifetime_deaths,
    best_kdr,
    most_kills_single_match,
    updated_at
  ) values (
    v_name,
    left(coalesce(nullif(p_display_name, ''), v_name), 16),
    greatest(0, coalesce(p_lifetime_kills, 0)),
    greatest(0, coalesce(p_lifetime_deaths, 0)),
    greatest(0, coalesce(p_best_kdr, 0)),
    greatest(0, coalesce(p_most_kills_single_match, 0)),
    now()
  )
  on conflict (account_name)
  do update set
    display_name = excluded.display_name,
    lifetime_kills = greatest(coalesce(public.battle_player_stats.lifetime_kills, 0), excluded.lifetime_kills),
    lifetime_deaths = greatest(coalesce(public.battle_player_stats.lifetime_deaths, 0), excluded.lifetime_deaths),
    best_kdr = greatest(coalesce(public.battle_player_stats.best_kdr, 0), excluded.best_kdr),
    most_kills_single_match = greatest(coalesce(public.battle_player_stats.most_kills_single_match, 0), excluded.most_kills_single_match),
    updated_at = now();

  update public.game_accounts
  set updated_at = now()
  where account_name = v_name;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.upsert_game_battle_stats(text, text, text, integer, integer, numeric, integer) to anon, authenticated;

commit;
