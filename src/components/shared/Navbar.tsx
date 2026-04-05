"use client";

import { useState } from "react";
import Link from "next/link";

interface NavbarProps {
  plan: string;
  searchesLeft: number | null;
  fullName: string;
  onUpgrade: () => void;
  onSignOut: () => void;
  upgrading: boolean;
}

export default function Navbar({
  plan,
  searchesLeft,
  fullName,
  onUpgrade,
  onSignOut,
  upgrading,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
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
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
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

          {/* Desktop nav */}
          <div
            className="navbar-desktop"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            {plan === "free" && searchesLeft !== null && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#ffffff06",
                  border: "1px solid var(--border)",
                  borderRadius: "100px",
                  padding: "6px 14px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background:
                      searchesLeft === 0
                        ? "var(--danger)"
                        : searchesLeft === 1
                          ? "var(--warning)"
                          : "var(--success)",
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {searchesLeft}/3 AI generations
                </span>
              </div>
            )}

            <span
              className={
                plan === "pro" ? "badge badge-pro" : "badge badge-free"
              }
            >
              {plan}
            </span>

            {plan === "free" ? (
              <button
                className="btn-primary"
                onClick={onUpgrade}
                disabled={upgrading}
                style={{ padding: "8px 18px", fontSize: "14px" }}
              >
                {upgrading ? "Redirecting..." : "Upgrade to Pro"}
              </button>
            ) : (
              <a
                href="https://app.lemonsqueezy.com/billing"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                }}
              >
                Manage plan
              </a>
            )}

            <Link
              href="/dashboard/profile"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#6366f120",
                border: "1px solid #6366f130",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 600,
                color: "#818cf8",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              {fullName?.charAt(0)?.toUpperCase() ?? "U"}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="navbar-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "8px",
              cursor: "pointer",
              color: "var(--text-primary)",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              width: "40px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                display: "block",
                width: "18px",
                height: "2px",
                background: "var(--text-primary)",
                borderRadius: "1px",
                transition: "all 0.2s",
                transform: mobileOpen
                  ? "rotate(45deg) translate(5px, 5px)"
                  : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: "18px",
                height: "2px",
                background: "var(--text-primary)",
                borderRadius: "1px",
                transition: "all 0.2s",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: "18px",
                height: "2px",
                background: "var(--text-primary)",
                borderRadius: "1px",
                transition: "all 0.2s",
                transform: mobileOpen
                  ? "rotate(-45deg) translate(5px, -5px)"
                  : "none",
              }}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="navbar-mobile-menu"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "16px 24px 24px",
              borderTop: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              gap: "16px",
            }}
          >
            {/* AI generations */}
            {plan === "free" && searchesLeft !== null && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  background: "#ffffff06",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background:
                      searchesLeft === 0
                        ? "var(--danger)"
                        : searchesLeft === 1
                          ? "var(--warning)"
                          : "var(--success)",
                  }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  {searchesLeft}/3 AI generations left today
                </span>
              </div>
            )}

            {/* Plan */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                Current plan
              </span>
              <span
                className={
                  plan === "pro" ? "badge badge-pro" : "badge badge-free"
                }
              >
                {plan}
              </span>
            </div>

            {/* Profile link */}
            <Link
              href="/dashboard/profile"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                background: "#ffffff06",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                color: "var(--text-primary)",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "#6366f120",
                  border: "1px solid #6366f130",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#818cf8",
                }}
              >
                {fullName?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              {fullName || "Profile"}
            </Link>

            {/* Upgrade / Manage */}
            {plan === "free" ? (
              <button
                className="btn-primary"
                onClick={() => {
                  onUpgrade();
                  setMobileOpen(false);
                }}
                disabled={upgrading}
                style={{ width: "100%", padding: "12px" }}
              >
                {upgrading ? "Redirecting..." : "Upgrade to Pro"}
              </button>
            ) : (
              <a
                href="https://app.lemonsqueezy.com/billing"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px",
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                Manage subscription
              </a>
            )}

            {/* Sign out */}
            <button
              onClick={() => {
                onSignOut();
                setMobileOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "14px",
                cursor: "pointer",
                textAlign: "left",
                padding: "4px 0",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
