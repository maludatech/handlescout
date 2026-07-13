"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import Navbar from "@/components/shared/Navbar";

interface Profile {
  full_name: string;
  email: string;
  plan: string;
  created_at: string;
  searches_today: number;
  last_search_date: string | null;
}

function InlineMessage({ msg }: { msg: { type: "success" | "error"; text: string } | null }) {
  if (!msg) return null;
  return (
    <p
      className="hint t-small"
      style={{
        marginTop: 0,
        marginBottom: "16px",
        color: msg.type === "success" ? "var(--success-text)" : "var(--danger-text)",
      }}
    >
      {msg.text}
    </p>
  );
}

export default function Profile() {
  const { user, supabase, loading: authLoading } = useAuthGuard();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, plan, created_at, searches_today, last_search_date")
        .eq("id", user.id)
        .single();
      if (data) {
        setProfile(data);
        setFullName(data.full_name ?? "");
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSaveProfile = async () => {
    if (!profile || !user) return;
    setSaving(true);
    setProfileMsg(null);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user.id);

    if (error) {
      setProfileMsg({ type: "error", text: error.message });
    } else {
      setProfileMsg({ type: "success", text: "Profile updated successfully" });
      setProfile((prev) => (prev ? { ...prev, full_name: fullName } : prev));
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    setChangingPassword(true);
    setPasswordMsg(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMsg({ type: "error", text: error.message });
    } else {
      setPasswordMsg({ type: "success", text: "Password updated successfully" });
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error("Failed to start checkout. Try again.");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setUpgrading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const getSearchesLeft = () => {
    if (!profile || profile.plan !== "free") return null;
    const today = new Date().toISOString().split("T")[0];
    const isNewDay = profile.last_search_date !== today;
    if (isNewDay) return 3;
    return Math.max(0, 3 - (profile.searches_today ?? 0));
  };

  if (authLoading || !profile) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="t-small t-muted">Loading…</p>
      </div>
    );
  }

  const searchesLeft = getSearchesLeft();

  return (
    <div>
      <Navbar
        plan={profile.plan}
        searchesLeft={searchesLeft}
        fullName={profile.full_name ?? ""}
        onUpgrade={handleUpgrade}
        onSignOut={handleSignOut}
        upgrading={upgrading}
      />

      <main>
        <div className="shell-narrow">
          <header className="app-head">
            <h1>Profile</h1>
            <p className="t-sec">Your account, plan, and security settings.</p>
          </header>

          <div className="app-content card-stack">
            <div className="card">
              <h3>Account</h3>
              <dl style={{ margin: 0 }}>
                <div className="kv">
                  <dt>Name</dt>
                  <dd>{profile.full_name || "—"}</dd>
                </div>
                <div className="kv">
                  <dt>Email</dt>
                  <dd className="t-mono">{profile.email}</dd>
                </div>
                <div className="kv">
                  <dt>Plan</dt>
                  <dd>
                    <span className={profile.plan === "pro" ? "badge badge-accent" : "badge badge-neutral"}>
                      {profile.plan === "pro" ? "Pro" : "Free"}
                    </span>
                  </dd>
                </div>
                {profile.plan === "free" && (
                  <div className="kv">
                    <dt>AI generations</dt>
                    <dd className="t-mono">{searchesLeft}/3 left today</dd>
                  </div>
                )}
                <div className="kv">
                  <dt>Member since</dt>
                  <dd className="t-mono">
                    {new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              </dl>

              {profile.plan === "free" ? (
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleUpgrade}
                    disabled={upgrading}
                  >
                    {upgrading ? "Redirecting…" : "Upgrade — $9/mo"}
                  </button>
                </div>
              ) : (
                <a
                  href="https://app.lemonsqueezy.com/billing"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: "20px", color: "var(--accent)", textDecoration: "none", fontSize: "14px" }}
                >
                  Manage subscription →
                </a>
              )}
            </div>

            <div className="card">
              <h3>Edit profile</h3>
              <InlineMessage msg={profileMsg} />
              <div className="form-stack">
                <div className="field">
                  <label htmlFor="p-name">Name</label>
                  <input
                    className="input"
                    id="p-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <button type="button" className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Change password</h3>
              <InlineMessage msg={passwordMsg} />
              <div className="form-stack">
                <div className="field">
                  <label htmlFor="p-new">New password</label>
                  <input
                    className="input"
                    id="p-new"
                    type="password"
                    placeholder="8+ characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <div className="field">
                  <label htmlFor="p-confirm">Confirm new password</label>
                  <input
                    className="input"
                    id="p-confirm"
                    type="password"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleChangePassword}
                    disabled={changingPassword || !newPassword || !confirmPassword}
                  >
                    {changingPassword ? "Updating…" : "Update password"}
                  </button>
                </div>
              </div>
            </div>

            <div className="card card-danger">
              <h3 style={{ color: "var(--danger-text)" }}>Danger zone</h3>
              <p className="t-small t-sec">Signing out ends this session on this device.</p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
                <button type="button" className="btn btn-secondary" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
