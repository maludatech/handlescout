export default function Loading() {
  return (
    <div className="shell-app">
      <div style={{ marginBottom: "32px" }}>
        <span className="skel skel-title" style={{ width: 220, height: 32, marginBottom: 8 }} />
        <span className="skel skel-text" style={{ width: 320 }} />
      </div>
      <div>
        <span className="skel" style={{ width: 280, height: 32, borderRadius: 8, marginBottom: 24, display: "block" }} />
        <div className="check-row">
          <span className="skel" style={{ flex: 1, height: 44 }} />
          <span className="skel" style={{ width: 160, height: 44 }} />
        </div>
      </div>
    </div>
  );
}
