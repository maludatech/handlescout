"use client";

import { useState } from "react";
import Link from "next/link";

import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function MarketingNav({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-inner" style={{ maxWidth: "1120px" }}>
        <Link href={isAuthenticated ? "/dashboard" : "/"} className="nav-logo">
          <span className="mark">@</span>HandleScout
        </Link>
        <div className="nav-links">
          <Link href="/#features">Features</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/faq">FAQ</Link>
        </div>

        <div className="nav-spacer" />

        <div className="nav-desktop-actions">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link href="/dashboard" className="btn btn-secondary btn-sm">
              Back to dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Sign in
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="btn btn-icon btn-ghost nav-menu-btn"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="nav-mobile-menu">
          <Link href="/#features" onClick={() => setOpen(false)}>
            Features
          </Link>
          <Link href="/#pricing" onClick={() => setOpen(false)}>
            Pricing
          </Link>
          <Link href="/faq" onClick={() => setOpen(false)}>
            FAQ
          </Link>
          <div className="nav-mobile-sep" />
          <div className="nav-mobile-row">
            <span className="t-small t-muted">Theme</span>
            <ThemeToggle />
          </div>
          {isAuthenticated ? (
            <Link href="/dashboard" className="btn btn-secondary btn-block" onClick={() => setOpen(false)}>
              Back to dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary btn-block" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link href="/signup" className="btn btn-primary btn-block" onClick={() => setOpen(false)}>
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
