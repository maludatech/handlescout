/**
 * Minimal CSRF defense for mutating routes: the Origin header (sent by
 * browsers on same-origin POST/PUT/DELETE/PATCH, not just cross-origin ones)
 * must match the request's own origin when present. Absent-header requests
 * are allowed through since some legitimate non-browser/older-browser
 * requests omit it — this is a second layer on top of the session cookie's
 * SameSite=Lax default, not the sole defense.
 */
export function isTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
