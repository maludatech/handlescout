export default function Loading() {
  return (
    <div className="shell-app">
      <div style={{ marginBottom: "32px" }}>
        <span className="skel skel-title" style={{ width: 220, height: 32, marginBottom: 8 }} />
        <span className="skel skel-text" style={{ width: 320 }} />
      </div>
      <div className="saved-grid">
        {[150, 120, 170].map((w, i) => (
          <div className="card saved-card" key={i}>
            <div className="handle">
              <span className="skel" style={{ display: "block", width: w, height: 28 }} />
            </div>
            <div className="platforms">
              {[1, 2, 3].map((j) => (
                <span key={j} className="skel skel-badge" style={{ width: 44 }} />
              ))}
            </div>
            <div className="actions">
              <span className="skel" style={{ width: "100%", height: 44 }} />
              <span className="skel" style={{ width: "100%", height: 44 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
