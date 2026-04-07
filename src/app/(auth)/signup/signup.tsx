"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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

  const handleSignup = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
  };

  // Success State
  if (success) {
    return (
      <motion.div
        className="glass"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
          textAlign: "center",
        }}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "#10b98120",
            border: "1px solid #10b98130",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            margin: "0 auto 20px",
          }}
        >
          ✉️
        </div>
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            marginBottom: "10px",
          }}
        >
          Check your email
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "15px",
            lineHeight: 1.7,
          }}
        >
          We sent a confirmation link to{" "}
          <strong style={{ color: "var(--text-secondary)" }}>{email}</strong>.
          Click it to activate your account.
        </p>
      </motion.div>
    );
  }

  // Signup Form
  return (
    <motion.div
      className="glass"
      style={{
        width: "100%",
        maxWidth: "420px",
        padding: "40px",
      }}
      initial={{ opacity: 0, y: 30 }}
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
        Create an account
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
        Start finding your perfect username
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
          Full name
        </label>
        <input
          className="input"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>

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
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--text-secondary)",
            marginBottom: "8px",
          }}
        >
          Password
        </label>
        <input
          className="input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSignup()}
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleSignup}
        disabled={loading || !email || !password || !fullName}
        style={{ width: "100%", marginBottom: "16px" }}
      >
        {loading ? "Creating account..." : "Create account →"}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: "14px",
          color: "var(--text-muted)",
        }}
      >
        Already have an account?{" "}
        <Link
          href="/login"
          style={{
            color: "var(--accent)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
