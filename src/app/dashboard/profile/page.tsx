"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Profile {
  full_name: string;
  email: string;
  plan: string;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("full_name, email, plan, created_at")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setFullName(data.full_name ?? "");
      }
    };
    fetch();
  }, [supabase, router]);

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    setProfileMsg(null);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", profile.email); // Better to use 'id' instead of email if possible

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
      setPasswordMsg({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setChangingPassword(true);
    setPasswordMsg(null);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMsg({ type: "error", text: error.message });
    } else {
      setPasswordMsg({
        type: "success",
        text: "Password updated successfully",
      });
      setNewPassword("");
      setConfirmPassword("");
    }
    setChangingPassword(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!profile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
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
            maxWidth: "900px",
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
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          Profile
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "15px",
            marginBottom: "40px",
          }}
        >
          Manage your account settings
        </p>

        <div style={{ display: "grid", gap: "24px" }}>
          {/* Account info */}
          <div className="glass" style={{ padding: "32px" }}>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              Account info
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  background: "#ffffff06",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Plan
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color:
                      profile.plan === "pro"
                        ? "#818cf8"
                        : "var(--text-primary)",
                    textTransform: "capitalize",
                  }}
                >
                  {profile.plan}
                </div>
              </div>
              <div
                style={{
                  background: "#ffffff06",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Email
                </div>
                <div
                  style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                >
                  {profile.email}
                </div>
              </div>
              <div
                style={{
                  background: "#ffffff06",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Member since
                </div>
                <div
                  style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                >
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            {profile.plan === "free" && (
              <div
                style={{
                  background: "#6366f110",
                  border: "1px solid #6366f120",
                  borderRadius: "var(--radius-sm)",
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      marginBottom: "4px",
                    }}
                  >
                    Upgrade to Pro
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    Unlimited AI generations + search history
                  </div>
                </div>
                <Link href="/dashboard">
                  <button
                    className="btn-primary"
                    style={{ padding: "10px 20px", fontSize: "14px" }}
                  >
                    Upgrade — $9/mo
                  </button>
                </Link>
              </div>
            )}

            {profile.plan === "pro" && (
              <a
                href="https://app.lemonsqueezy.com/billing"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  fontSize: "14px",
                  color: "var(--accent)",
                  textDecoration: "none",
                }}
              >
                Manage subscription →
              </a>
            )}
          </div>

          {/* Edit name */}
          <div className="glass" style={{ padding: "32px" }}>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              Edit profile
            </h2>

            {profileMsg && (
              <div
                style={{
                  background:
                    profileMsg.type === "success" ? "#10b98115" : "#ef444415",
                  border: `1px solid ${profileMsg.type === "success" ? "#10b98130" : "#ef444430"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: profileMsg.type === "success" ? "#34d399" : "#f87171",
                  marginBottom: "20px",
                }}
              >
                {profileMsg.text}
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
                Full name
              </label>
              <input
                className="input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleSaveProfile}
              disabled={saving}
              style={{ padding: "10px 24px" }}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>

          {/* Change password */}
          <div className="glass" style={{ padding: "32px" }}>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "24px",
              }}
            >
              Change password
            </h2>

            {passwordMsg && (
              <div
                style={{
                  background:
                    passwordMsg.type === "success" ? "#10b98115" : "#ef444415",
                  border: `1px solid ${passwordMsg.type === "success" ? "#10b98130" : "#ef444430"}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: passwordMsg.type === "success" ? "#34d399" : "#f87171",
                  marginBottom: "20px",
                }}
              >
                {passwordMsg.text}
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
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
                Confirm new password
              </label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChangePassword()}
              />
            </div>

            <button
              className="btn-primary"
              onClick={handleChangePassword}
              disabled={changingPassword || !newPassword || !confirmPassword}
              style={{ padding: "10px 24px" }}
            >
              {changingPassword ? "Updating..." : "Update password"}
            </button>
          </div>

          {/* Danger zone */}
          <div
            className="glass"
            style={{
              padding: "32px",
              borderColor: "#ef444420",
            }}
          >
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "#f87171",
              }}
            >
              Sign out
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            >
              Sign out of your HandleScout account on this device.
            </p>
            <button
              onClick={handleSignOut}
              style={{
                background: "#ef444415",
                border: "1px solid #ef444430",
                color: "#f87171",
                borderRadius: "var(--radius-sm)",
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
