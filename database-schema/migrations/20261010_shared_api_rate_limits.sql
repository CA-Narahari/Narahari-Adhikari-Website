create table if not exists public.api_rate_limits (
  bucket_key text primary key check (bucket_key ~ '^[0-9a-f]{64}$'),
  hit_count integer not null check (hit_count > 0),
  window_started_at timestamptz not null,
  expires_at timestamptz not null
);

create index if not exists api_rate_limits_expires_at_idx
  on public.api_rate_limits (expires_at);

alter table public.api_rate_limits enable row level security;
revoke all on public.api_rate_limits from public, anon, authenticated;

create or replace function public.consume_api_rate_limit(
  p_bucket_key text,
  p_limit integer,
  p_window_seconds integer,
  p_cleanup boolean default false
)
returns table (allowed boolean, remaining integer, reset_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_hits integer;
  v_started_at timestamptz;
begin
  if p_bucket_key !~ '^[0-9a-f]{64}$'
    or p_limit < 1
    or p_window_seconds < 1
    or p_window_seconds > 86400 then
    raise exception 'Invalid rate-limit parameters';
  end if;

  if p_cleanup then
    delete from public.api_rate_limits as expired
    where expired.bucket_key in (
      select candidates.bucket_key
      from public.api_rate_limits as candidates
      where candidates.expires_at <= v_now
      order by candidates.expires_at
      limit 1000
    );
  end if;

  insert into public.api_rate_limits as existing (bucket_key, hit_count, window_started_at, expires_at)
  values (p_bucket_key, 1, v_now, v_now + p_window_seconds * interval '1 second')
  on conflict (bucket_key) do update set
    hit_count = case
      when existing.window_started_at + p_window_seconds * interval '1 second' <= v_now then 1
      else existing.hit_count + 1
    end,
    window_started_at = case
      when existing.window_started_at + p_window_seconds * interval '1 second' <= v_now then v_now
      else existing.window_started_at
    end,
    expires_at = case
      when existing.window_started_at + p_window_seconds * interval '1 second' <= v_now then v_now + p_window_seconds * interval '1 second'
      else existing.expires_at
    end
  returning existing.hit_count, existing.window_started_at
  into v_hits, v_started_at;

  allowed := v_hits <= p_limit;
  remaining := greatest(p_limit - v_hits, 0);
  reset_at := v_started_at + p_window_seconds * interval '1 second';
  return next;
end;
$$;

revoke all on function public.consume_api_rate_limit(text, integer, integer, boolean) from public, anon, authenticated;
grant execute on function public.consume_api_rate_limit(text, integer, integer, boolean) to service_role;

comment on table public.api_rate_limits is 'Private shared counters for public API throttling; bucket keys are HMAC digests, not raw IP addresses.';
