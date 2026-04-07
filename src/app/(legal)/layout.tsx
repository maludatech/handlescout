import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
    <div style={{ minHeight: "100vh" }} className="dot-grid">
      {/* Navbar */}
      <nav
        style={{
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          background: "#0a0a0f99",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href={user ? "/dashboard" : "/"}
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text-primary)",
              textDecoration: "none",
            }}
          >
            Handle<span style={{ color: "var(--accent)" }}>Scout</span>
          </Link>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            {user ? (
              <Link
                href="/dashboard"
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                }}
              >
                ← Back to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{
                    fontSize: "14px",
                    color: "var(--text-muted)",
                    textDecoration: "none",
                  }}
                >
                  Sign in
                </Link>
                <Link href="/signup">
                  <button
                    className="btn-primary"
                    style={{
                      padding: "8px 18px",
                      fontSize: "14px",
                    }}
                  >
                    Get started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "64px 24px 120px",
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/terms"
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            Privacy
          </Link>
          <Link
            href="/faq"
            style={{
              fontSize: "13px",
              color: "var(--text-muted)",
              textDecoration: "none",
            }}
          >
            FAQ
          </Link>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} HandleScout. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
