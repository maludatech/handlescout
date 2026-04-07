"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

interface SearchRecord {
  id: string;
  keywords: string;
  generated_usernames: string[];
  created_at: string;
}

function SkeletonRow() {
  return (
    <div
      style={{
        padding: "20px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div className="skeleton" style={{ height: "16px", width: "30%" }} />
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: "24px", width: "80px", borderRadius: "100px" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("free");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single();

        const userPlan = profile?.plan ?? "free";
        setPlan(userPlan);

        if (userPlan !== "pro") {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/search-history");
        if (!res.ok) throw new Error("Failed to fetch history");

        const data = await res.json();
        setHistory(data.history || []);
      } catch (error) {
        console.error("History fetch error:", error);
        toast.error("Failed to load search history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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
            href="/dashboard"
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

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link
              href="/dashboard"
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              ← Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Search history
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
            Your last 50 AI generation searches
          </p>
        </div>

        {/* Pro gate */}
        {!loading && plan !== "pro" && (
          <div
            className="glass"
            style={{
              padding: "64px 40px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}
            >
              🔒
            </div>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "22px",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              Pro feature
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "15px",
                marginBottom: "24px",
                maxWidth: "400px",
                margin: "0 auto 24px",
              }}
            >
              Upgrade to Pro to access your full search history and never lose a
              great username idea.
            </p>
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: "12px 28px" }}>
                Upgrade to Pro — $9/mo
              </button>
            </Link>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="glass" style={{ overflow: "hidden" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && plan === "pro" && history.length === 0 && (
          <div
            className="glass empty-state"
            style={{ textAlign: "center", padding: "80px 40px" }}
          >
            <div
              style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.6 }}
            >
              🔍
            </div>
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "var(--text-secondary)",
              }}
            >
              No searches yet
            </h3>
            <p
              style={{
                fontSize: "14px",
                marginBottom: "24px",
                color: "var(--text-muted)",
              }}
            >
              Your AI generation history will appear here
            </p>
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: "10px 24px" }}>
                Start generating
              </button>
            </Link>
          </div>
        )}

        {/* History list */}
        {!loading && plan === "pro" && history.length > 0 && (
          <div className="glass" style={{ overflow: "hidden" }}>
            {history.map((record, i) => (
              <div
                key={record.id}
                style={{
                  padding: "20px 24px",
                  borderBottom:
                    i < history.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    &quot;{record.keywords}&quot;
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--text-muted)",
                    }}
                  >
                    {new Date(record.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {record.generated_usernames.map((username) => (
                    <button
                      key={username}
                      onClick={() => {
                        navigator.clipboard.writeText(`@${username}`);
                        toast.success(`@${username} copied!`);
                      }}
                      style={{
                        padding: "4px 12px",
                        borderRadius: "100px",
                        border: "1px solid var(--border)",
                        background: "#ffffff06",
                        color: "var(--text-secondary)",
                        fontSize: "13px",
                        fontWeight: 500,
                        cursor: "pointer",
                        fontFamily: "DM Sans, sans-serif",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.color = "#818cf8";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}
                    >
                      @{username}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
