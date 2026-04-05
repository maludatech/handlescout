"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
  }, []);

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
        Welcome back
      </h1>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "15px",
          marginBottom: "32px",
        }}
      >
        Sign in to your account
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

      <div style={{ marginBottom: "12px" }}>
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
    </div>
  );
}
