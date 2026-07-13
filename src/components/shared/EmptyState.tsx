import Link from "next/link";

export function EmptyState({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="empty">
      <span className="glyph">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionHref && actionLabel && (
        <Link className="btn btn-primary" href={actionHref}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
