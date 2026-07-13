import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Atomic per-user rate limit backed by a Postgres function (see the SQL
 * migration) rather than Upstash — avoids the free-tier auto-pause-on-idle
 * issue and reuses infra we already pay for.
 *
 * Fails open (allows the request) if the RPC itself errors, e.g. the
 * migration hasn't been applied yet in this environment — a missing rate
 * limiter should never be the reason real users get 500s.
 */
export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  route: string,
  maxRequests: number,
  windowSeconds: number,
): Promise<boolean> {
  const { data, error } = await supabase.rpc("check_rate_limit", {
    p_user_id: userId,
    p_route: route,
    p_max_requests: maxRequests,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error(`Rate limit check failed for ${route}:`, error.message);
    return true;
  }

  return data === true;
}
