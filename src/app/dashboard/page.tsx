"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import SearchForm from "@/components/shared/SearchForm";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Profile {
  plan: string;
  full_name: string;
  searches_today: number;
  last_search_date: string | null;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("plan, full_name, searches_today, last_search_date")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [supabase, router]);

  const getSearchesLeft = () => {
    if (!profile || profile.plan !== "free") return null;
    const today = new Date().toISOString().split("T")[0];
    const isNewDay = profile.last_search_date !== today;
    if (isNewDay) return 3;
    return Math.max(0, 3 - (profile.searches_today ?? 0));
  };

  const handleSearchUsed = () => {
    if (!profile || profile.plan !== "free") return;
    const today = new Date().toISOString().split("T")[0];
    const isNewDay = profile.last_search_date !== today;
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        searches_today: isNewDay ? 1 : (prev.searches_today ?? 0) + 1,
        last_search_date: today,
      };
    });
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      console.error("Upgrade failed");
    } finally {
      setUpgrading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const searchesLeft = getSearchesLeft();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "2px solid var(--border)",
              borderTop: "2px solid var(--accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Loading...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
          {/* Logo */}
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
            }}
          >
            Handle<span style={{ color: "var(--accent)" }}>Scout</span>
          </span>

          {/* Desktop nav */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {/* AI generations counter */}
            {profile?.plan === "free" && searchesLeft !== null && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#ffffff06",
                  border: "1px solid var(--border)",
                  borderRadius: "100px",
                  padding: "6px 14px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background:
                      searchesLeft === 0
                        ? "var(--danger)"
                        : searchesLeft === 1
                          ? "var(--warning)"
                          : "var(--success)",
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {searchesLeft}/3 AI generations
                </span>
              </div>
            )}

            {/* Plan badge */}
            <span
              className={
                profile?.plan === "pro" ? "badge badge-pro" : "badge badge-free"
              }
            >
              {profile?.plan ?? "free"}
            </span>

            {/* Upgrade / Manage */}
            {profile?.plan === "free" ? (
              <button
                className="btn-primary"
                onClick={handleUpgrade}
                disabled={upgrading}
                style={{ padding: "8px 18px", fontSize: "14px" }}
              >
                {upgrading ? "Redirecting..." : "Upgrade to Pro"}
              </button>
            ) : (
              <a
                href="https://app.lemonsqueezy.com/billing"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                }}
              >
                Manage plan
              </a>
            )}

            {/* Profile */}
            <Link
              href="/dashboard/profile"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#6366f120",
                border: "1px solid #6366f130",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 600,
                color: "#818cf8",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              {profile?.full_name?.charAt(0)?.toUpperCase() ?? "U"}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        <div
          style={{ textAlign: "center", marginBottom: "48px" }}
          className="animate-fade-up"
        >
          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(32px, 6vw, 52px)",
              fontWeight: 800,
              marginBottom: "16px",
              letterSpacing: "-0.03em",
            }}
          >
            Find your perfect <span className="gradient-text">username</span>
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: "var(--text-secondary)",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Check if a handle is free, or let AI generate unique ones — across
            15 platforms instantly
          </p>
        </div>

        <div className="animate-fade-up stagger-2">
          <SearchForm
            plan={profile?.plan ?? "free"}
            searchesLeft={searchesLeft}
            onSearchUsed={handleSearchUsed}
          />
        </div>
      </main>
    </div>
  );
}
