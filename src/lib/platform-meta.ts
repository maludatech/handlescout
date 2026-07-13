/**
 * Client-safe platform metadata. Kept separate from `checker.ts` (server-only:
 * uses axios + server env vars) so it can be imported from client components.
 * `name` must match `checker.ts`'s `Platform.name` strings exactly — that's
 * the join key used to attach a monogram tile to API results.
 *
 * Per the design spec, platform identity is a neutral monogram tile (not a
 * full-color brand icon) — this keeps 15 competing brand palettes from
 * shouting inside an otherwise monochrome system.
 */
export interface PlatformMeta {
  key: string;
  name: string;
  mono: string;
}

export const PLATFORM_META: PlatformMeta[] = [
  { key: "instagram", name: "Instagram", mono: "Ig" },
  { key: "x", name: "X (Twitter)", mono: "X" },
  { key: "tiktok", name: "TikTok", mono: "Tt" },
  { key: "github", name: "GitHub", mono: "Gh" },
  { key: "reddit", name: "Reddit", mono: "Rd" },
  { key: "pinterest", name: "Pinterest", mono: "Pn" },
  { key: "twitch", name: "Twitch", mono: "Tw" },
  { key: "youtube", name: "YouTube", mono: "Yt" },
  { key: "linkedin", name: "LinkedIn", mono: "Li" },
  { key: "snapchat", name: "Snapchat", mono: "Sc" },
  { key: "medium", name: "Medium", mono: "Md" },
  { key: "tumblr", name: "Tumblr", mono: "Tb" },
  { key: "soundcloud", name: "SoundCloud", mono: "Sd" },
  { key: "telegram", name: "Telegram", mono: "Tg" },
  { key: "devto", name: "DevTo", mono: "Dv" },
];

export function getPlatformMeta(name: string): PlatformMeta | undefined {
  return PLATFORM_META.find((p) => p.name === name);
}
