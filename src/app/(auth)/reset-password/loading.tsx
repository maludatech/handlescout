export default function Loading() {
  return (
    <div className="card auth-card">
      <span className="skel skel-title" style={{ width: 190, height: 32, marginBottom: 8 }} />
      <span className="skel skel-text" style={{ width: 230, marginBottom: 24 }} />
      <div className="form-stack">
        <div className="field">
          <span className="skel skel-text" style={{ width: 100, height: 14 }} />
          <span className="skel" style={{ width: "100%", height: 44 }} />
        </div>
        <div className="field">
          <span className="skel skel-text" style={{ width: 150, height: 14 }} />
          <span className="skel" style={{ width: "100%", height: 44 }} />
        </div>
        <span className="skel" style={{ width: "100%", height: 44 }} />
      </div>
    </div>
  );
}
