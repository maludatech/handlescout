import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses Row Level Security entirely. Server-only
 * (the `server-only` import makes it a build error to reach this from a
 * Client Component). Never expose this key or client to the browser.
 *
 * Only use for trusted, founder-gated operations (e.g. admin aggregate
 * stats) that legitimately need to read/write across all users' rows.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
