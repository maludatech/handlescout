export function ProGate({
  preview,
  title,
  description,
}: {
  preview: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="gate-wrap">
      <div className="gate-preview" aria-hidden="true">
        {preview}
      </div>
      <div className="gate-card">
        <div className="card">
          <span className="badge badge-accent">Pro</span>
          <h3>{title}</h3>
          <p className="t-small">{description}</p>
          <div className="gate-actions">
            <a className="btn btn-primary" href="/dashboard">
              Upgrade to Pro
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
