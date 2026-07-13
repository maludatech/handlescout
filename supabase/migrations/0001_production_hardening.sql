-- HandleScout production-hardening migration.
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Every statement is idempotent — safe to re-run if it fails partway through.

-- =========================================================================
-- 1. Founder bypass flag
-- =========================================================================
alter table public.profiles
  add column if not exists is_founder boolean not null default false;

-- Set this to your own account once you know your user id or email:
-- update public.profiles set is_founder = true where email = 'you@example.com';


-- =========================================================================
-- 2. Rate limiting (Postgres-based — no Upstash pause-on-idle issue)
-- =========================================================================
create table if not exists public.rate_limits (
  user_id uuid not null,
  route text not null,
  window_start timestamptz not null default now(),
  count int not null default 1,
  primary key (user_id, route)
);

-- RLS enabled with zero policies = fully locked to direct table access;
-- the SECURITY DEFINER function below is the only way in, by design.
alter table public.rate_limits enable row level security;

create or replace function public.check_rate_limit(
  p_user_id uuid,
  p_route text,
  p_max_requests int,
  p_window_seconds int
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_count int;
  v_window_start timestamptz;
begin
  insert into public.rate_limits (user_id, route, window_start, count)
  values (p_user_id, p_route, v_now, 1)
  on conflict (user_id, route) do update
    set count = case
                  when public.rate_limits.window_start < v_now - make_interval(secs => p_window_seconds)
                    then 1
                  else public.rate_limits.count + 1
                end,
        window_start = case
                  when public.rate_limits.window_start < v_now - make_interval(secs => p_window_seconds)
                    then v_now
                  else public.rate_limits.window_start
                end
  returning count, window_start into v_count, v_window_start;

  return v_count <= p_max_requests;
end;
$$;


-- =========================================================================
-- 3. Row Level Security — verify/enforce owner-only access
-- =========================================================================
alter table public.profiles enable row level security;
alter table public.searches enable row level security;
alter table public.saved_usernames enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "searches_select_own" on public.searches;
create policy "searches_select_own" on public.searches
  for select using (auth.uid() = user_id);

drop policy if exists "searches_insert_own" on public.searches;
create policy "searches_insert_own" on public.searches
  for insert with check (auth.uid() = user_id);

drop policy if exists "saved_usernames_select_own" on public.saved_usernames;
create policy "saved_usernames_select_own" on public.saved_usernames
  for select using (auth.uid() = user_id);

drop policy if exists "saved_usernames_insert_own" on public.saved_usernames;
create policy "saved_usernames_insert_own" on public.saved_usernames
  for insert with check (auth.uid() = user_id);

drop policy if exists "saved_usernames_delete_own" on public.saved_usernames;
create policy "saved_usernames_delete_own" on public.saved_usernames
  for delete using (auth.uid() = user_id);


-- =========================================================================
-- 4. Privilege-escalation guard on profiles
-- =========================================================================
-- The UPDATE policy above lets a signed-in user update their OWN row (needed
-- so /api/generate can bump searches_today via the user's own session). But
-- RLS is row-level, not column-level — without this trigger, a user could
-- bypass the app UI entirely and PATCH their own row via the Supabase REST
-- API to set plan='pro' or is_founder=true for free. This trigger forces
-- those columns back to their previous value unless the request is running
-- as service_role (i.e. our webhook/admin code, which uses the service key).
create or replace function public.protect_profile_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() <> 'service_role' then
    new.plan := old.plan;
    new.is_founder := old.is_founder;
    new.stripe_subscription_id := old.stripe_subscription_id;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privileged_columns_trigger on public.profiles;
create trigger protect_profile_privileged_columns_trigger
  before update on public.profiles
  for each row
  execute function public.protect_profile_privileged_columns();


-- =========================================================================
-- 5. Verification queries — run these after and eyeball the output
-- =========================================================================
-- Expect rowsecurity = true for all three tables:
-- select tablename, rowsecurity from pg_tables
--   where schemaname = 'public' and tablename in ('profiles','searches','saved_usernames','rate_limits');

-- Expect the policies created above, one row each:
-- select tablename, policyname, cmd from pg_policies
--   where schemaname = 'public' order by tablename, policyname;
