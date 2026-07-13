"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import SearchForm from "@/components/shared/SearchForm";
import Navbar from "@/components/shared/Navbar";

interface Profile {
  plan: string;
  full_name: string;
  searches_today: number;
  last_search_date: string | null;
}

export default function Dashboard() {
  const { user, supabase, loading: authLoading } = useAuthGuard();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("plan, full_name, searches_today, last_search_date")
        .eq("id", user.id)
        .single();

      setProfile(data);

      const params = new URLSearchParams(window.location.search);
      if (params.get("upgraded") === "true") {
        toast.success("Welcome to Pro! Enjoy unlimited generations 🎉");
        window.history.replaceState({}, "", "/dashboard");
      }
      if (params.get("cancelled") === "true") {
        toast.info("Upgrade cancelled — you can upgrade anytime");
        window.history.replaceState({}, "", "/dashboard");
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
        searches_today: isNewDay ? 1 : prev.searches_today + 1,
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

  const searchesLeft = getSearchesLeft();

  if (authLoading || !profile) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="t-small t-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar
        plan={profile.plan ?? "free"}
        searchesLeft={searchesLeft}
        fullName={profile.full_name ?? ""}
        onUpgrade={handleUpgrade}
        onSignOut={handleSignOut}
        upgrading={upgrading}
      />

      <main>
        <div className="shell-app">
          <header className="app-head">
            <h1>Find your handle</h1>
            <p className="t-sec">
              Check one name across 15 platforms, or generate candidates with AI.
            </p>
          </header>

          <div className="app-content">
            <SearchForm
              plan={profile.plan ?? "free"}
              searchesLeft={searchesLeft}
              onSearchUsed={handleSearchUsed}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
