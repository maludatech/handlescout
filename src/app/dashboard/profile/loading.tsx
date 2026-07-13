export default function Loading() {
  return (
    <div className="shell-narrow">
      <div style={{ marginBottom: "32px" }}>
        <span className="skel skel-title" style={{ width: 140, height: 32, marginBottom: 8 }} />
        <span className="skel skel-text" style={{ width: 260 }} />
      </div>
      <div className="card-stack">
        {[3, 1, 2].map((rows, i) => (
          <div className="card" key={i}>
            <span className="skel skel-title" style={{ width: 140, height: 24, marginBottom: 20 }} />
            {Array.from({ length: rows }).map((_, j) => (
              <div className="kv" key={j}>
                <span className="skel skel-text" style={{ width: 80 }} />
                <span className="skel skel-text" style={{ width: 140 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
