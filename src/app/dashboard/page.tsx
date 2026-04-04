"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import SearchForm from "@/components/shared/SearchForm";
import { Badge } from "@/components/ui/badge";

interface Profile {
  plan: string;
  searches_today: number;
  last_search_date: string | null;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
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
        .select("plan, searches_today, last_search_date")
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-semibold text-slate-900 text-lg">
            HandleScout
          </span>
          <div className="flex items-center gap-4">
            {profile?.plan === "free" && searchesLeft !== null && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">AI generations:</span>
                <span
                  className={`text-sm font-semibold ${
                    searchesLeft === 0
                      ? "text-red-500"
                      : searchesLeft === 1
                        ? "text-amber-500"
                        : "text-green-600"
                  }`}
                >
                  {searchesLeft}/3 left today
                </span>
              </div>
            )}

            {profile?.plan === "free" ? (
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium disabled:opacity-50"
              >
                {upgrading ? "Redirecting..." : "Upgrade to Pro"}
              </button>
            ) : (
              <Link
                href="https://app.lemonsqueezy.com/billing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                Manage subscription
              </Link>
            )}

            <Badge
              variant={profile?.plan === "free" ? "secondary" : "default"}
              className="capitalize"
            >
              {profile?.plan ?? "free"}
            </Badge>

            <button
              onClick={handleSignOut}
              className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-slate-900 mb-3">
            Find your perfect username
          </h1>
          <p className="text-slate-500 text-lg">
            Check if a handle is free, or let AI generate unique ones — across
            15 platforms instantly
          </p>
        </div>

        <SearchForm
          plan={profile?.plan ?? "free"}
          searchesLeft={searchesLeft}
          onSearchUsed={handleSearchUsed}
        />
      </main>
    </div>
  );
}
