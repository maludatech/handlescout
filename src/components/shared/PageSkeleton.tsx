export function PageSkeleton() {
  return (
    <div>
      <nav className="nav">
        <div className="nav-inner" style={{ maxWidth: 960 }}>
          <span className="skel skel-title" style={{ width: 140, height: 22 }} />
          <div className="nav-spacer" />
          <span className="skel" style={{ width: 32, height: 32, borderRadius: 999 }} />
        </div>
      </nav>
      <main>
        <div className="shell-app">
          <header className="app-head">
            <span className="skel skel-title" style={{ width: 220, height: 32, marginBottom: 8, display: "block" }} />
            <span className="skel skel-text" style={{ width: 320 }} />
          </header>
          <div className="app-content">
            <span className="skel" style={{ width: "100%", height: 220, borderRadius: 12, display: "block" }} />
          </div>
        </div>
      </main>
    </div>
  );
}
