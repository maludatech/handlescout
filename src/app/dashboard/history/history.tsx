"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import Navbar from "@/components/shared/Navbar";
import { ProGate } from "@/components/shared/ProGate";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import { hasFullAccess } from "@/lib/plan";

interface SearchRecord {
  id: string;
  keywords: string;
  generated_usernames: string[];
  created_at: string;
}

interface Profile {
  plan: string;
  is_founder: boolean;
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
  const [pageLoading, setPageLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [upgrading, setUpgrading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchProfileAndHistory = async () => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("plan, is_founder, full_name, searches_today, last_search_date")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Failed to load profile:", profileError.message);
        }

        setProfile(profileData);

        if (!profileData || !hasFullAccess(profileData)) {
          setLoading(false);
          return;
        }

        const res = await fetch("/api/search-history?page=1");
        if (!res.ok) throw new Error("Failed to fetch history");

        const data = await res.json();
        setHistory(data.history || []);
        setTotalPages(data.totalPages ?? 1);
      } catch (error) {
        console.error("History fetch error:", error);
        toast.error("Failed to load search history");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const goToPage = async (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) return;
    setPageLoading(true);
    try {
      const res = await fetch(`/api/search-history?page=${nextPage}`);
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setHistory(data.history || []);
      setTotalPages(data.totalPages ?? 1);
      setPage(nextPage);
    } catch (error) {
      console.error("History page fetch error:", error);
      toast.error("Failed to load that page. Try again.");
    } finally {
      setPageLoading(false);
    }
  };

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
    if (!profile || hasFullAccess(profile)) return null;
    const today = new Date().toISOString().split("T")[0];
    const isNewDay = profile.last_search_date !== today;
    if (isNewDay) return 3;
    return Math.max(0, 3 - (profile.searches_today ?? 0));
  };

  const plan = profile?.plan ?? "free";
  const fullAccess = !!profile && hasFullAccess(profile);

  if (authLoading) {
    return <PageSkeleton />;
  }

  return (
    <div>
      <Navbar
        plan={plan}
        is_founder={profile?.is_founder ?? false}
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
            {(loading || pageLoading) && <HistorySkeleton />}

            {!loading && !fullAccess && (
              <ProGate
                preview={<HistoryPreview />}
                title="History is a Pro feature"
                description="Keep every AI search — keywords and all generated handles — and come back to them any time."
              />
            )}

            {!loading && !pageLoading && fullAccess && history.length === 0 && (
              <EmptyState
                icon="⌕"
                title="No searches yet"
                description="Run your first AI generation and every keyword set and handle it produces will be kept here."
                actionHref="/dashboard"
                actionLabel="Generate handles"
              />
            )}

            {!loading && !pageLoading && fullAccess && history.length > 0 && (
              <>
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

                {totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "16px",
                      marginTop: "24px",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => goToPage(page - 1)}
                      disabled={page <= 1}
                    >
                      ← Previous
                    </button>
                    <span className="t-small t-muted t-mono">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => goToPage(page + 1)}
                      disabled={page >= totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
