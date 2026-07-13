"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import Navbar from "@/components/shared/Navbar";
import { ProGate } from "@/components/shared/ProGate";
import { EmptyState } from "@/components/shared/EmptyState";
import { getPlatformMeta } from "@/lib/platform-meta";

interface SavedUsername {
  id: string;
  username: string;
  available_on: string[];
  created_at: string;
}

interface Profile {
  plan: string;
  full_name: string;
  searches_today: number;
  last_search_date: string | null;
}

function SavedSkeleton() {
  return (
    <div className="saved-grid">
      {[150, 120, 170].map((w, i) => (
        <div className="card saved-card" key={i}>
          <div className="handle">
            <span className="skel" style={{ display: "block", width: w, height: 28 }} />
          </div>
          <div className="platforms">
            {[1, 2, 3].map((j) => (
              <span key={j} className="skel skel-badge" style={{ width: 44 }} />
            ))}
          </div>
          <div className="actions">
            <span className="skel" style={{ width: "100%", height: 44 }} />
            <span className="skel" style={{ width: "100%", height: 44 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Generic illustrative example — not the user's real data — shown blurred
// behind the pro-gate card so the layout communicates what's on offer.
function SavedPreview() {
  const examples = [
    { handle: "studiominimal", on: ["Instagram", "TikTok", "GitHub"] },
    { handle: "scoutmyname", on: ["X (Twitter)", "GitHub", "DevTo"] },
  ];
  return (
    <div className="saved-grid">
      {examples.map((ex) => (
        <div className="card saved-card" key={ex.handle}>
          <div className="handle t-mono-lg">{ex.handle}</div>
          <div className="platforms">
            {ex.on.map((name) => (
              <span key={name} className="badge badge-success badge-mono">
                {getPlatformMeta(name)?.mono ?? name.slice(0, 2)}
              </span>
            ))}
          </div>
          <div className="actions">
            <button type="button" className="btn btn-secondary btn-sm">
              Copy
            </button>
            <button type="button" className="btn btn-ghost btn-sm">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Saved() {
  const { user, supabase, loading: authLoading } = useAuthGuard();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saved, setSaved] = useState<SavedUsername[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchSaved = async () => {
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

      const res = await fetch("/api/saved-usernames");
      const data = await res.json();
      if (data.saved) setSaved(data.saved);
      setLoading(false);
    };

    fetchSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (id: string, username: string) => {
    setDeleting(id);
    try {
      const res = await fetch("/api/saved-usernames", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setSaved((prev) => prev.filter((s) => s.id !== id));
        toast.success(`@${username} removed from saved`);
      } else {
        toast.error("Failed to remove. Try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setDeleting(null);
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
            <h1>Saved handles</h1>
            <p className="t-sec">Your shortlist, with the platforms where each name is still free.</p>
          </header>

          <div className="app-content">
            {loading && <SavedSkeleton />}

            {!loading && plan !== "pro" && (
              <ProGate
                preview={<SavedPreview />}
                title="Saved handles is a Pro feature"
                description="Keep a shortlist of the names you're considering, with the platforms where each is still available."
              />
            )}

            {!loading && plan === "pro" && saved.length === 0 && (
              <EmptyState
                icon="⭑"
                title="Nothing saved yet"
                description="When a check turns up a handle worth keeping, save it here before someone else claims it."
                actionHref="/dashboard"
                actionLabel="Check a username"
              />
            )}

            {!loading && plan === "pro" && saved.length > 0 && (
              <div className="saved-grid">
                {saved.map((item) => (
                  <div className="card saved-card" key={item.id}>
                    <div className="handle t-mono-lg">{item.username}</div>
                    {item.available_on.length > 0 && (
                      <div className="platforms">
                        {item.available_on.map((name) => (
                          <span key={name} className="badge badge-success badge-mono">
                            {getPlatformMeta(name)?.mono ?? name.slice(0, 2)}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          navigator.clipboard.writeText(item.username);
                          toast.success(`@${item.username} copied!`);
                        }}
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={deleting === item.id}
                        onClick={() => handleDelete(item.id, item.username)}
                      >
                        {deleting === item.id ? "…" : "Remove"}
                      </button>
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
