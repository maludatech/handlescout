import type { PlatformResult } from "@/lib/checker";

export type PlatformStatus = "available" | "taken" | "toolong" | "manual";

export function toPlatformStatus(r: PlatformResult): PlatformStatus {
  if (r.tooLong) return "toolong";
  if (r.error) return "manual";
  return r.available ? "available" : "taken";
}

export function computeScore(statuses: PlatformStatus[]): number {
  const eligible = statuses.filter((s) => s !== "toolong" && s !== "manual");
  if (eligible.length === 0) return 0;
  const available = eligible.filter((s) => s === "available").length;
  return Math.round((available / eligible.length) * 100);
}

export function scoreLabel(pct: number): {
  tone: "good" | "fair" | "poor";
  text: string;
} {
  if (pct >= 75) return { tone: "good", text: "Good availability" };
  if (pct >= 40) return { tone: "fair", text: "Fair availability" };
  return { tone: "poor", text: "Limited availability" };
}
