"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthCard, AuthSuccessCard } from "@/components/shared/AuthCard";

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

  if (success) {
    return (
      <AuthSuccessCard
        icon="✉"
        title="Check your email"
        description={
          <>
            We sent a confirmation link to <span className="t-mono">{email}</span>. Open it to
            activate your account.
          </>
        }
      />
    );
  }

  return (
    <AuthCard title="Create your account" subtitle="Free forever. Unlimited username checks." error={error}>
      <div className="form-stack">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            className="input"
            id="name"
            type="text"
            placeholder="Your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            className="input"
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            className="input"
            id="password"
            type="password"
            placeholder="8+ characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            autoComplete="new-password"
          />
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={handleSignup}
          disabled={loading || !email || !password || !fullName}
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </div>

      <p className="auth-alt t-small t-sec">
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
    </AuthCard>
  );
}
