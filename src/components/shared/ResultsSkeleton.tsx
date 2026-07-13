import { PLATFORM_META } from "@/lib/platform-meta";

export function ResultsSkeleton() {
  return (
    <section className="results" aria-label="Checking availability">
      <div className="results-head">
        <div className="score">
          <span className="skel" style={{ width: 140, height: 28 }} />
          <span className="skel skel-badge" />
        </div>
        <span className="skel" style={{ width: 180, height: 40 }} />
      </div>
      <div className="result-list">
        {PLATFORM_META.map((meta) => (
          <div className="result-row" key={meta.key}>
            <span className="skel skel-tile" />
            <span className="name">
              <span className="skel skel-text" style={{ width: 60 + ((meta.key.length * 17) % 40) }} />
            </span>
            <span className="badge-cell-empty" />
            <span className="skel skel-badge" />
          </div>
        ))}
      </div>
    </section>
  );
}
