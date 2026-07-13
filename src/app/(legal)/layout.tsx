import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <nav className="nav">
        <div className="nav-inner" style={{ maxWidth: "1120px" }}>
          <Link href={user ? "/dashboard" : "/"} className="nav-logo">
            <span className="mark">@</span>HandleScout
          </Link>
          <div className="nav-links">
            <Link href="/#features">Features</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div className="nav-spacer" />
          <ThemeToggle />
          {user ? (
            <Link href="/dashboard" className="btn btn-secondary btn-sm">
              Back to dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Sign in
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>

      <main>
        <div className="shell-doc">{children}</div>
      </main>

      <footer className="footer">
        <div className="footer-inner" style={{ maxWidth: "1120px" }}>
          <span className="t-caption t-muted">© {new Date().getFullYear()} HandleScout</span>
          <div className="footer-links">
            <Link href="/faq">FAQ</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/login">Sign in</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
