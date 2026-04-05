"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Supabase handles the token from the URL automatically
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User is now in password recovery mode
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  };

  if (success) {
    return (
      <div
        className="glass animate-fade-up"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
          textAlign: "center",
        }}
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
          ✓
        </div>
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            marginBottom: "10px",
          }}
        >
          Password updated
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          Redirecting you to the dashboard...
        </p>
      </div>
    );
  }

  return (
    <div
      className="glass animate-fade-up"
      style={{
        width: "100%",
        maxWidth: "420px",
        padding: "40px",
      }}
    >
      <h1
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "26px",
          fontWeight: 700,
          marginBottom: "8px",
        }}
      >
        New password
      </h1>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "15px",
          marginBottom: "32px",
        }}
      >
        Choose a strong password for your account
      </p>

      {error && (
        <div
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
        </div>
      )}

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
          New password
        </label>
        <input
          className="input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "8px" }}>
        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--text-secondary)",
            marginBottom: "8px",
          }}
        >
          Confirm password
        </label>
        <input
          className="input"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleReset()}
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleReset}
        disabled={loading || !password || !confirm}
        style={{ width: "100%", marginTop: "16px" }}
      >
        {loading ? "Updating..." : "Update password →"}
      </button>
    </div>
  );
}
