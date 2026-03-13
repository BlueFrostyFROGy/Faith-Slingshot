-- Ranked table hardening for Faith Flight Frenzy
-- Run this in the Supabase SQL editor.
-- This script matches the current client behavior in game.js, where:
--   player_key   = 'uid:' || auth.uid()
--   player_name  = same account-bound key for authenticated players
--   display_name = visible account name shown on the leaderboard

begin;

alter table public.head_to_head_rankings
  add column if not exists player_key text,
  add column if not exists display_name text,
  add column if not exists peak_rating integer default 1000;

update public.head_to_head_rankings
set
  player_key = coalesce(
    nullif(player_key, ''),
    case
      when coalesce(player_name, '') like 'uid:%' then player_name
      else 'legacy:' || left(lower(regexp_replace(coalesce(player_name, 'player'), '[^a-zA-Z0-9_.-]+', '', 'g')), 32)
    end
  ),
  display_name = coalesce(nullif(display_name, ''), left(coalesce(player_name, 'Player'), 16)),
  peak_rating = greatest(coalesce(peak_rating, 0), coalesce(rating, 1000), 1000)
where player_key is null
   or player_key = ''
   or display_name is null
   or display_name = ''
   or peak_rating is null
   or peak_rating < 1000;

with ranked_dupes as (
  select
    ctid,
    row_number() over (
      partition by player_key
      order by updated_at desc nulls last, rating desc nulls last, ctid desc
    ) as row_num
  from public.head_to_head_rankings
  where player_key is not null
)
delete from public.head_to_head_rankings t
using ranked_dupes d
where t.ctid = d.ctid
  and d.row_num > 1;

alter table public.head_to_head_rankings
  alter column player_key set not null,
  alter column peak_rating set default 1000;

create unique index if not exists head_to_head_rankings_player_key_key
  on public.head_to_head_rankings (player_key);

create index if not exists head_to_head_rankings_rating_idx
  on public.head_to_head_rankings (rating desc);

create index if not exists head_to_head_rankings_display_name_idx
  on public.head_to_head_rankings (display_name);

alter table public.head_to_head_rankings enable row level security;

DROP POLICY IF EXISTS "Ranked leaderboard readable by everyone" ON public.head_to_head_rankings;
DROP POLICY IF EXISTS "Ranked rows insertable by owner" ON public.head_to_head_rankings;
DROP POLICY IF EXISTS "Ranked rows updatable by owner" ON public.head_to_head_rankings;
DROP POLICY IF EXISTS "Ranked rows deletable by owner" ON public.head_to_head_rankings;

create policy "Ranked leaderboard readable by everyone"
on public.head_to_head_rankings
for select
using (true);

create policy "Ranked rows insertable by owner"
on public.head_to_head_rankings
for insert
to authenticated
with check (
  player_key = ('uid:' || auth.uid()::text)
  and player_name = player_key
);

create policy "Ranked rows updatable by owner"
on public.head_to_head_rankings
for update
to authenticated
using (
  player_key = ('uid:' || auth.uid()::text)
)
with check (
  player_key = ('uid:' || auth.uid()::text)
  and player_name = player_key
);

create policy "Ranked rows deletable by owner"
on public.head_to_head_rankings
for delete
to authenticated
using (
  player_key = ('uid:' || auth.uid()::text)
);

commit;
