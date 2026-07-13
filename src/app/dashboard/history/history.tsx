"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import Navbar from "@/components/shared/Navbar";
import { ProGate } from "@/components/shared/ProGate";
import { EmptyState } from "@/components/shared/EmptyState";

interface SearchRecord {
  id: string;
  keywords: string;
  generated_usernames: string[];
  created_at: string;
}

interface Profile {
  plan: string;
  full_name: string;
  searches_today: number;
  last_search_date: string | null;
}

function HistorySkeleton() {
  return (
    <div className="history-list">
      {[200, 160, 220].map((w, i) => (
        <div className="card history-item" key={i}>
          <div className="row1">
            <span className="skel skel-title" style={{ width: w }} />
            <span className="skel skel-text" style={{ width: 90 }} />
          </div>
          <div className="chip-group">
            {[1, 2, 3, 4].map((j) => (
              <span key={j} className="skel skel-badge" style={{ width: 70 + ((i + j) % 3) * 20 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Generic illustrative example — not the user's real data — shown blurred
// behind the pro-gate card so the layout communicates what's on offer.
function HistoryPreview() {
  const examples = [
    { keywords: "studio, minimal, brand", chips: ["studiominimal", "brandstud", "minimalco"] },
    { keywords: "handle, scout, names", chips: ["namescouter", "handlehq", "scoutmyname"] },
  ];
  return (
    <div className="history-list">
      {examples.map((ex) => (
        <div className="card history-item" key={ex.keywords}>
          <div className="row1">
            <h3 className="t-mono" style={{ fontSize: "14px" }}>
              {ex.keywords}
            </h3>
            <span className="t-caption t-muted">Recently</span>
          </div>
          <div className="chip-group">
            {ex.chips.map((c) => (
              <span key={c} className="badge badge-neutral badge-mono">
                {c}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function History() {
  const { user, supabase, loading: authLoading } = useAuthGuard();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("plan, full_name, searches_today, last_search_date")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        if (profileData?.plan !== "pro") {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error("Failed to start checkout. Try again.");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setUpgrading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const getSearchesLeft = () => {
    if (!profile || profile.plan !== "free") return null;
    const today = new Date().toISOString().split("T")[0];
    const isNewDay = profile.last_search_date !== today;
    if (isNewDay) return 3;
    return Math.max(0, 3 - (profile.searches_today ?? 0));
  };

  const plan = profile?.plan ?? "free";

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="t-small t-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar
        plan={plan}
        searchesLeft={getSearchesLeft()}
        fullName={profile?.full_name ?? ""}
        onUpgrade={handleUpgrade}
        onSignOut={handleSignOut}
        upgrading={upgrading}
      />

      <main>
        <div className="shell-app">
          <header className="app-head">
            <h1>AI search history</h1>
            <p className="t-sec">Every generation you&apos;ve run — the keywords and every handle they produced.</p>
          </header>

          <div className="app-content">
            {loading && <HistorySkeleton />}

            {!loading && plan !== "pro" && (
              <ProGate
                preview={<HistoryPreview />}
                title="History is a Pro feature"
                description="Keep every AI search — keywords and all generated handles — and come back to them any time."
              />
            )}

            {!loading && plan === "pro" && history.length === 0 && (
              <EmptyState
                icon="⌕"
                title="No searches yet"
                description="Run your first AI generation and every keyword set and handle it produces will be kept here."
                actionHref="/dashboard"
                actionLabel="Generate handles"
              />
            )}

            {!loading && plan === "pro" && history.length > 0 && (
              <div className="history-list">
                {history.map((record) => (
                  <div className="card history-item" key={record.id}>
                    <div className="row1">
                      <h3 className="t-mono" style={{ fontSize: "14px" }}>
                        {record.keywords}
                      </h3>
                      <span className="t-caption t-muted">
                        {new Date(record.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="chip-group">
                      {record.generated_usernames.map((username) => (
                        <button
                          key={username}
                          type="button"
                          className="badge badge-neutral badge-mono"
                          style={{ cursor: "pointer", border: "1px solid var(--border)" }}
                          onClick={() => {
                            navigator.clipboard.writeText(username);
                            toast.success(`@${username} copied!`);
                          }}
                        >
                          {username}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
