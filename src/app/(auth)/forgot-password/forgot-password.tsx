"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleReset = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
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
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
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
            marginBottom: "24px",
          }}
        >
          We sent a password reset link to{" "}
          <strong style={{ color: "var(--text-secondary)" }}>{email}</strong>.
        </p>
        <Link
          href="/login"
          style={{
            color: "var(--accent)",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ← Back to sign in
        </Link>
      </motion.div>
    );
  }

  // Form State
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
        Reset password
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
        {"Enter your email and we'll send you a reset link"}
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
          onKeyDown={(e) => e.key === "Enter" && handleReset()}
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleReset}
        disabled={loading || !email}
        style={{ width: "100%", marginTop: "8px" }}
      >
        {loading ? "Sending..." : "Send reset link →"}
      </button>

      <p
        style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "14px",
          color: "var(--text-muted)",
        }}
      >
        <Link
          href="/login"
          style={{
            color: "var(--accent)",
            textDecoration: "none",
          }}
        >
          ← Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}
