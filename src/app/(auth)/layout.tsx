import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="nav">
        <div className="nav-inner" style={{ maxWidth: "1120px" }}>
          <Link href="/" className="nav-logo">
            <span className="mark">@</span>HandleScout
          </Link>
          <div className="nav-spacer" />
          <ThemeToggle />
        </div>
      </nav>

      <main className="auth-main">{children}</main>

      <footer className="footer">
        <div className="footer-inner" style={{ maxWidth: "1120px" }}>
          <span className="t-caption t-muted">© {new Date().getFullYear()} HandleScout</span>
          <div className="footer-links">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
