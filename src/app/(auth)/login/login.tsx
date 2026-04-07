"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) router.replace("/dashboard");
    };
    checkSession();
  }, [router, supabase]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <motion.div
      className="glass"
      style={{
        width: "100%",
        maxWidth: "420px",
        padding: "40px",
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "26px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        Welcome back
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          color: "var(--text-muted)",
          fontSize: "15px",
          marginBottom: "32px",
        }}
      >
        Sign in to your account
      </motion.p>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: "#ef444415",
              border: "1px solid #ef444430",
              borderRadius: "var(--radius-sm)",
              padding: "12px 16px",
              fontSize: "14px",
              color: "#f87171",
              marginBottom: "20px",
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ marginBottom: "16px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--text-secondary)",
            marginBottom: "8px",
          }}
        >
          Email
        </label>
        <input
          className="input"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <label
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text-secondary)",
            }}
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            style={{
              fontSize: "13px",
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            Forgot password?
          </Link>
        </div>
        <input
          className="input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleLogin}
        disabled={loading || !email || !password}
        style={{ width: "100%", marginTop: "8px" }}
      >
        {loading ? "Signing in..." : "Sign in →"}
      </button>

      <p
        style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "14px",
          color: "var(--text-muted)",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          style={{
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
