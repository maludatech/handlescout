"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface SearchRecord {
  id: string;
  keywords: string;
  generated_usernames: string[];
  created_at: string;
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 26,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
  hover: {
    y: -4,
    scale: 1.01,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
};

function SkeletonRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
    </motion.div>
  );
}

export default function History() {
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
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
        </motion.div>

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
            transition={{ duration: 0.5 }}
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
          </motion.div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <motion.div
            className="glass"
            style={{ overflow: "hidden" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && plan === "pro" && history.length === 0 && (
          <motion.div
            className="glass empty-state"
            style={{ textAlign: "center", padding: "80px 40px" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
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
          </motion.div>
        )}

        {/* History list */}
        {!loading && plan === "pro" && history.length > 0 && (
          <AnimatePresence mode="popLayout">
            <motion.div
              className="glass"
              style={{ overflow: "hidden" }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {history.map((record, index) => (
                <motion.div
                  key={record.id}
                  style={{
                    padding: "20px 24px",
                    borderBottom:
                      index < history.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
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
                      <motion.button
                        key={username}
                        onClick={() => {
                          navigator.clipboard.writeText(`@${username}`);
                          toast.success(`@${username} copied!`);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
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
                      >
                        @{username}
                      </motion.button>
                    ))}
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
