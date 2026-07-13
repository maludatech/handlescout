export default function Loading() {
  return (
    <div className="card auth-card">
      <span className="skel skel-title" style={{ width: 200, height: 32, marginBottom: 8 }} />
      <span className="skel skel-text" style={{ width: 240, marginBottom: 24 }} />
      <div className="form-stack">
        {[70, 60, 80].map((w, i) => (
          <div className="field" key={i}>
            <span className="skel skel-text" style={{ width: w, height: 14 }} />
            <span className="skel" style={{ width: "100%", height: 44 }} />
          </div>
        ))}
        <span className="skel" style={{ width: "100%", height: 44 }} />
      </div>
    </div>
  );
}
