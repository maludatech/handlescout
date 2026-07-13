/**
 * Fail fast at server boot if required env vars are missing, instead of
 * hitting an unhelpful runtime TypeError deep inside a request (e.g. from
 * a bare `process.env.X!` non-null assertion).
 */
const REQUIRED_ENV_VARS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "GROQ_API_KEY",
  "LEMONSQUEEZY_API_KEY",
  "LEMONSQUEEZY_SIGNING_SECRET",
  "LEMONSQUEEZY_VARIANT_ID",
  "NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID",
  "NEXT_PUBLIC_APP_URL",
] as const;

export function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. Check .env.local against .env.example.`,
    );
  }
}
