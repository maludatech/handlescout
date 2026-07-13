"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

import { AuthCard, AuthSuccessCard } from "@/components/shared/AuthCard";

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

  if (success) {
    return (
      <AuthSuccessCard
        icon="✉"
        title="Reset link sent"
        description={
          <>
            If an account exists for <span className="t-mono">{email}</span>, a reset link is on
            its way.
          </>
        }
        footer={
          <Link href="/login" className="btn btn-secondary btn-block">
            Back to sign in
          </Link>
        }
      />
    );
  }

  return (
    <AuthCard title="Reset your password" subtitle="Enter your account email and we'll send you a reset link." error={error}>
      <div className="form-stack">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            className="input"
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleReset()}
            autoComplete="email"
          />
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={handleReset}
          disabled={loading || !email}
        >
          {loading ? "Sending…" : "Send reset link"}
        </button>
      </div>

      <p className="auth-alt t-small t-sec">
        Remembered it? <Link href="/login">Back to sign in</Link>
      </p>
    </AuthCard>
  );
}
