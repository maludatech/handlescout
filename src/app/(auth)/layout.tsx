import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="dot-grid"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "22px",
          fontWeight: 700,
          color: "var(--text-primary)",
          textDecoration: "none",
          marginBottom: "40px",
        }}
      >
        Handle<span style={{ color: "var(--accent)" }}>Scout</span>
      </Link>
      {children}
    </div>
  );
}
