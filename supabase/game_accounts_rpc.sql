-- Username account + ranked sync RPCs (no email login required)
-- Run this in Supabase SQL Editor.

begin;

create table if not exists public.game_accounts (
  account_name text primary key,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists game_accounts_updated_at_idx
  on public.game_accounts (updated_at desc);

alter table public.game_accounts enable row level security;

-- No direct table access from anon/authenticated; only RPCs below.
revoke all on table public.game_accounts from anon, authenticated;

drop function if exists public.create_game_account(text, text);
create or replace function public.create_game_account(
  p_account_name text,
  p_password_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_existing_hash text;
begin
  v_name := lower(trim(coalesce(p_account_name, '')));
  if v_name = '' or length(v_name) < 3 then
    return jsonb_build_object('ok', false, 'error', 'invalid_account_name');
  end if;
  if coalesce(p_password_hash, '') = '' then
    return jsonb_build_object('ok', false, 'error', 'invalid_password_hash');
  end if;

  select password_hash
  into v_existing_hash
  from public.game_accounts
  where account_name = v_name;

  if v_existing_hash is not null then
    if v_existing_hash = p_password_hash then
      return jsonb_build_object('ok', true, 'created', false, 'exists', true);
    end if;
    return jsonb_build_object('ok', false, 'created', false, 'exists', true);
  end if;

  insert into public.game_accounts (account_name, password_hash)
  values (v_name, p_password_hash);

  return jsonb_build_object('ok', true, 'created', true, 'exists', false);
end;
$$;

drop function if exists public.verify_game_account(text, text);
create or replace function public.verify_game_account(
  p_account_name text,
  p_password_hash text
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
    return jsonb_build_object('ok', false, 'valid', false);
  end if;

  select password_hash
  into v_hash
  from public.game_accounts
  where account_name = v_name;

  if v_hash is null then
    return jsonb_build_object('ok', false, 'valid', false);
  end if;

  if v_hash <> p_password_hash then
    return jsonb_build_object('ok', false, 'valid', false);
  end if;

  update public.game_accounts
  set updated_at = now()
  where account_name = v_name;

  return jsonb_build_object('ok', true, 'valid', true);
end;
$$;

drop function if exists public.upsert_game_ranked_profile(text, text, text, integer, integer, integer, integer, integer, integer, numeric);
create or replace function public.upsert_game_ranked_profile(
  p_account_name text,
  p_password_hash text,
  p_display_name text,
  p_rating integer,
  p_peak_rating integer,
  p_wins integer,
  p_losses integer,
  p_draws integer,
  p_matches integer,
  p_best_win_margin numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text;
  v_hash text;
  v_key text;
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

  v_key := 'acct:' || v_name;

  insert into public.head_to_head_rankings (
    player_key,
    player_name,
    display_name,
    rating,
    peak_rating,
    wins,
    losses,
    draws,
    matches,
    best_win_margin,
    updated_at
  )
  values (
    v_key,
    v_key,
    left(coalesce(nullif(p_display_name, ''), v_name), 16),
    greatest(1000, coalesce(p_rating, 1000)),
    greatest(coalesce(p_peak_rating, 1000), coalesce(p_rating, 1000), 1000),
    greatest(0, coalesce(p_wins, 0)),
    greatest(0, coalesce(p_losses, 0)),
    greatest(0, coalesce(p_draws, 0)),
    greatest(0, coalesce(p_matches, 0)),
    greatest(0, coalesce(p_best_win_margin, 0)),
    now()
  )
  on conflict (player_key)
  do update set
    display_name = excluded.display_name,
    rating = excluded.rating,
    peak_rating = greatest(coalesce(public.head_to_head_rankings.peak_rating, 1000), excluded.peak_rating, excluded.rating),
    wins = excluded.wins,
    losses = excluded.losses,
    draws = excluded.draws,
    matches = excluded.matches,
    best_win_margin = greatest(coalesce(public.head_to_head_rankings.best_win_margin, 0), excluded.best_win_margin),
    updated_at = now();

  update public.game_accounts
  set updated_at = now()
  where account_name = v_name;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.create_game_account(text, text) to anon, authenticated;
grant execute on function public.verify_game_account(text, text) to anon, authenticated;
grant execute on function public.upsert_game_ranked_profile(text, text, text, integer, integer, integer, integer, integer, integer, numeric) to anon, authenticated;

commit;
