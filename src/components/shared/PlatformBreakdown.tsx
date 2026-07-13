import type { PlatformResult } from "@/lib/checker";
import { toPlatformStatus, type PlatformStatus } from "@/lib/platform-status";
import { PLATFORM_META } from "@/lib/platform-meta";

export interface UsernameResult {
  username: string;
  results: PlatformResult[];
  score: number;
}

function scoreTone(score: number): "success" | "warning" | "danger" {
  if (score >= 70) return "success";
  if (score >= 40) return "warning";
  return "danger";
}

const STATUS_BADGE: Record<PlatformStatus, { cls: string; label: string }> = {
  available: { cls: "badge-success", label: "Available" },
  taken: { cls: "badge-danger", label: "Taken" },
  manual: { cls: "badge-warning", label: "Check manually" },
  toolong: { cls: "badge-warning", label: "Too long" },
};

const STATUS_LINK: Record<PlatformStatus, string | null> = {
  available: "Claim →",
  taken: "Visit →",
  manual: "Check →",
  toolong: null,
};

export function PlatformBreakdown({
  result,
  plan,
  onSave,
}: {
  result: UsernameResult;
  plan: string;
  onSave?: (username: string, availableOn: string[]) => void;
}) {
  const byName = new Map(result.results.map((r) => [r.platform, r]));

  return (
    <section className="results" aria-label="Availability results">
      <div className="results-head">
        <div className="score">
          <span className="t-mono-lg">{result.username}</span>
          <span className={`badge badge-${scoreTone(result.score)}`}>
            Score {result.score}
          </span>
        </div>
        {plan === "pro" && onSave && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const availableOn = result.results
                  .filter((r) => r.available && !r.error && !r.tooLong)
                  .map((r) => r.platform);
                onSave(result.username, availableOn);
              }}
            >
              Save handle
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigator.clipboard.writeText(result.username)}
            >
              Copy
            </button>
          </div>
        )}
      </div>

      <div className="result-list">
        {PLATFORM_META.map((meta) => {
          const r = byName.get(meta.name);
          const status: PlatformStatus = r?.tooLong ? "toolong" : r ? toPlatformStatus(r) : "manual";
          const badge = STATUS_BADGE[status];
          const linkLabel = STATUS_LINK[status];

          return (
            <div className="result-row" key={meta.key}>
              <span className="tile">{meta.mono}</span>
              <span className="name">
                <span className="t-small" style={{ fontWeight: 600 }}>
                  {meta.name}
                </span>
              </span>
              {linkLabel && r ? (
                <a className="visit" href={r.url} target="_blank" rel="noopener noreferrer">
                  {linkLabel}
                </a>
              ) : (
                <span className="visit" />
              )}
              <span className={`badge ${badge.cls}`}>{badge.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
