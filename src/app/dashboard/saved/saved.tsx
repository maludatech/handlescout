"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SavedUsername {
  id: string;
  username: string;
  available_on: string[];
  created_at: string;
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
  hover: {
    y: -6,
    scale: 1.015,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

function SkeletonCard() {
  return (
    <motion.div
      className="glass"
      style={{ padding: "20px" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="skeleton"
        style={{ height: "20px", width: "60%", marginBottom: "12px" }}
      />
      <div
        style={{
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
          marginBottom: "16px",
        }}
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: "22px", width: "70px", borderRadius: "100px" }}
          />
        ))}
      </div>
      <div
        className="skeleton"
        style={{ height: "32px", width: "80px", borderRadius: "8px" }}
      />
    </motion.div>
  );
}

export default function Saved() {
  const [saved, setSaved] = useState<SavedUsername[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<string>("free");
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchSaved = async () => {
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

      setPlan(profile?.plan ?? "free");

      if (profile?.plan !== "pro") {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/saved-usernames");
      const data = await res.json();
      if (data.saved) setSaved(data.saved);
      setLoading(false);
    };

    fetchSaved();
  }, [router, supabase]);

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
          <motion.h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Saved usernames
          </motion.h1>
          <motion.p
            style={{ color: "var(--text-muted)", fontSize: "15px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Your bookmarked handles — available across platforms
          </motion.p>
        </div>

        {/* Pro gate */}
        {!loading && plan !== "pro" && (
          <motion.div
            className="glass"
            style={{
              padding: "64px 40px",
              textAlign: "center",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div
              style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}
            >
              🔖
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
              Upgrade to Pro to save and manage your favourite usernames across
              all platforms.
            </p>
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: "12px 28px" }}>
                Upgrade to Pro — $9/mo
              </button>
            </Link>
          </motion.div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <motion.div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px",
            }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && plan === "pro" && saved.length === 0 && (
          <motion.div
            className="glass empty-state"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="empty-state-icon">🔖</div>
            <h3
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "var(--text-secondary)",
              }}
            >
              No saved usernames yet
            </h3>
            <p style={{ fontSize: "14px", marginBottom: "24px" }}>
              Save usernames from your search results to find them here
            </p>
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: "10px 24px" }}>
                Start searching
              </button>
            </Link>
          </motion.div>
        )}

        {/* Saved usernames grid */}
        {!loading && plan === "pro" && saved.length > 0 && (
          <AnimatePresence mode="popLayout">
            <motion.div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "16px",
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {saved.map((item) => (
                <motion.div
                  key={item.id}
                  className="glass"
                  style={{ padding: "20px" }}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover="hover"
                  layout
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "12px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#818cf8",
                      }}
                    >
                      @{item.username}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {new Date(item.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {item.available_on.length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginBottom: "16px",
                      }}
                    >
                      {item.available_on.map((platform) => (
                        <span
                          key={platform}
                          className="badge badge-available"
                          style={{ fontSize: "11px" }}
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.username);
                        toast.success(`@${item.username} copied!`);
                      }}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                        background: "#ffffff06",
                        color: "var(--text-secondary)",
                        fontSize: "13px",
                        cursor: "pointer",
                        fontFamily: "DM Sans, sans-serif",
                        transition: "all 0.2s",
                      }}
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.username)}
                      disabled={deleting === item.id}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid #ef444430",
                        background: "#ef444415",
                        color: "#f87171",
                        fontSize: "13px",
                        cursor: "pointer",
                        fontFamily: "DM Sans, sans-serif",
                        transition: "all 0.2s",
                        opacity: deleting === item.id ? 0.5 : 1,
                      }}
                    >
                      {deleting === item.id ? "..." : "Remove"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
