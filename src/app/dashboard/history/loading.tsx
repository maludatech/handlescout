export default function Loading() {
  return (
    <div className="shell-app">
      <div style={{ marginBottom: "32px" }}>
        <span className="skel skel-title" style={{ width: 220, height: 32, marginBottom: 8 }} />
        <span className="skel skel-text" style={{ width: 320 }} />
      </div>
      <div className="history-list">
        {[200, 160, 220].map((w, i) => (
          <div className="card history-item" key={i}>
            <div className="row1">
              <span className="skel skel-title" style={{ width: w }} />
              <span className="skel skel-text" style={{ width: 90 }} />
            </div>
            <div className="chip-group">
              {[1, 2, 3, 4].map((j) => (
                <span key={j} className="skel skel-badge" style={{ width: 70 + ((i + j) % 3) * 20 }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
