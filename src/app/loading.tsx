export default function Loading() {
  return (
    <div className="shell-landing">
      <div className="hero">
        <span
          className="skel"
          style={{ display: "block", width: "min(560px, 80%)", height: 64, margin: "0 auto 20px", borderRadius: 12 }}
        />
        <span
          className="skel"
          style={{ display: "block", width: "min(400px, 70%)", height: 20, margin: "0 auto 32px" }}
        />
        <div className="hero-actions">
          <span className="skel" style={{ width: 180, height: 44 }} />
          <span className="skel" style={{ width: 140, height: 44 }} />
        </div>
      </div>

      <div className="feature-grid">
        {[1, 2, 3].map((i) => (
          <div className="card" key={i}>
            <span className="skel skel-tile" style={{ width: 48, height: 48, marginBottom: 16 }} />
            <span className="skel skel-text" style={{ width: "70%", height: 20, marginBottom: 8 }} />
            <span className="skel skel-text" style={{ width: "100%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
