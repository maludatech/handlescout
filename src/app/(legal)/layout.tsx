import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MarketingNav } from "@/components/shared/MarketingNav";

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
      <MarketingNav isAuthenticated={!!user} />

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
