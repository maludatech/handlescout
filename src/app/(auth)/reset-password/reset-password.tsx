"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import { AuthCard, AuthSuccessCard } from "@/components/shared/AuthCard";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User is now in password recovery mode
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

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
      <AuthSuccessCard icon="✓" title="Password saved" description="Redirecting you to the dashboard…" />
    );
  }

  return (
    <AuthCard title="Choose a new password" subtitle="Set a new password for your account." error={error}>
      <div className="form-stack">
        <div className="field">
          <label htmlFor="new-password">New password</label>
          <input
            className="input"
            id="new-password"
            type="password"
            placeholder="8+ characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <span className="hint">Use at least 6 characters.</span>
        </div>
        <div className="field">
          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            className="input"
            id="confirm-password"
            type="password"
            placeholder="Repeat password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleReset()}
            autoComplete="new-password"
          />
        </div>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={handleReset}
          disabled={loading || !password || !confirm}
        >
          {loading ? "Updating…" : "Save new password"}
        </button>
      </div>
    </AuthCard>
  );
}
