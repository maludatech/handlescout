"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import SearchForm from "@/components/shared/SearchForm";
import Navbar from "@/components/shared/Navbar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Profile {
  plan: string;
  full_name: string;
  searches_today: number;
  last_search_date: string | null;
}

// Animation Variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 28,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export default function Dashboard() {
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
        .select("plan, full_name, searches_today, last_search_date")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setLoading(false);

      // Show upgrade success toast
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
  }, [router, supabase]);

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

  // Loading State
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
        <motion.div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
        </motion.div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }} className="dot-grid">
      <Navbar
        plan={profile?.plan ?? "free"}
        searchesLeft={searchesLeft}
        fullName={profile?.full_name ?? ""}
        onUpgrade={handleUpgrade}
        onSignOut={handleSignOut}
        upgrading={upgrading}
      />

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "64px 24px",
        }}
      >
        <motion.div
          style={{ textAlign: "center", marginBottom: "48px" }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="hero-title"
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(32px, 6vw, 52px)",
              fontWeight: 800,
              marginBottom: "16px",
              letterSpacing: "-0.03em",
            }}
            variants={fadeUpVariants}
          >
            Find your perfect <span className="gradient-text">username</span>
          </motion.h1>

          <motion.p
            style={{
              fontSize: "17px",
              color: "var(--text-secondary)",
              maxWidth: "500px",
              margin: "0 auto",
            }}
            variants={fadeUpVariants}
          >
            Check if a handle is free, or let AI generate unique ones — across
            15 platforms instantly
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <SearchForm
            plan={profile?.plan ?? "free"}
            searchesLeft={searchesLeft}
            onSearchUsed={handleSearchUsed}
          />
        </motion.div>
      </main>
    </div>
  );
}
