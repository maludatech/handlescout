export default function Loading() {
  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <span className="skel skel-title" style={{ width: 220, height: 32, marginBottom: 8 }} />
        <span className="skel skel-text" style={{ width: 160 }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <span className="skel skel-text" style={{ width: 200, height: 20, marginBottom: 12 }} />
            <span className="skel skel-text" style={{ width: "100%", marginBottom: 8 }} />
            <span className="skel skel-text" style={{ width: `${70 + (i % 3) * 10}%` }} />
          </div>
        ))}
      </div>
    </>
  );
}
