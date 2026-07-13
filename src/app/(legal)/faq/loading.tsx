export default function Loading() {
  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <span className="skel skel-title" style={{ width: 320, height: 32, marginBottom: 8 }} />
        <span className="skel skel-text" style={{ width: 260 }} />
      </div>
      <div className="faq-list">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ padding: "20px 0", borderBottom: "1px solid var(--border)" }}>
            <span className="skel skel-text" style={{ width: `${60 + ((i * 7) % 25)}%`, height: 16 }} />
          </div>
        ))}
      </div>
    </>
  );
}
