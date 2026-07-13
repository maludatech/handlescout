"use client";

import Link from "next/link";

import { MarketingNav } from "@/components/shared/MarketingNav";
import { PLATFORM_META } from "@/lib/platform-meta";

const FEATURES = [
  {
    glyph: "⚡",
    title: "Live availability checks",
    desc: "Each platform is checked directly, not against a stale index. What you see is what you can register right now.",
  },
  {
    glyph: "Ai",
    title: "AI handle generation",
    desc: "Give it your keywords and get candidate handles checked across all 15 platforms automatically.",
  },
  {
    glyph: "%",
    title: "Availability score",
    desc: "One number that tells you how claimable a handle is overall, so you can compare candidates at a glance.",
  },
  {
    glyph: "★",
    title: "Save shortlists",
    desc: "Bookmark the handles you're considering and come back to them before someone else does.",
  },
  {
    glyph: "⌕",
    title: "Search history",
    desc: "Every AI search is kept — the keywords you used and every handle it produced — so no idea gets lost.",
  },
  {
    glyph: "→",
    title: "Direct claim links",
    desc: "Every available result links straight to that platform's sign-up, so claiming takes seconds, not tabs.",
  },
];

export default function LandingPage() {
  return (
    <>
      <MarketingNav />

      <main>
        <div className="shell-landing">
          <section className="hero">
            <h1 className="t-display">
              Claim your name
              <br />
              everywhere.
            </h1>
            <p className="lede">
              Check a username across 15 platforms in one search — or let AI generate handles from
              your keywords and check those too.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/signup">
                Check a username
              </Link>
              <a className="btn btn-secondary" href="#pricing">
                See pricing
              </a>
            </div>

            <div className="hero-demo" aria-hidden="true">
              <div className="demo-input">
                <span className="t-mono t-muted">@</span>
                <span className="t-mono">maludatech</span>
                <span className="t-mono caret">|</span>
                <div className="nav-spacer" />
                <span className="badge badge-accent">15 platforms</span>
              </div>
              <div className="result-list">
                <div className="result-row">
                  <span className="tile">Gh</span>
                  <span className="name">
                    <span className="t-small" style={{ fontWeight: 600 }}>
                      GitHub
                    </span>
                  </span>
                  <span className="visit" />
                  <span className="badge badge-danger">Taken</span>
                </div>
                <div className="result-row">
                  <span className="tile">Ig</span>
                  <span className="name">
                    <span className="t-small" style={{ fontWeight: 600 }}>
                      Instagram
                    </span>
                  </span>
                  <span className="visit" />
                  <span className="badge badge-success">Available</span>
                </div>
                <div className="result-row">
                  <span className="tile">Tt</span>
                  <span className="name">
                    <span className="t-small" style={{ fontWeight: 600 }}>
                      TikTok
                    </span>
                  </span>
                  <span className="visit" />
                  <span className="badge badge-success">Available</span>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="section-head">
              <span className="t-eyebrow">Coverage</span>
              <h2>One search, 15 answers</h2>
              <p>Every platform that matters for a personal brand or a product launch, checked in seconds.</p>
            </div>
            <div className="platform-strip">
              {PLATFORM_META.map((p) => (
                <span className="chip" key={p.key}>
                  <span className="tile">{p.mono}</span>
                  {p.name}
                </span>
              ))}
            </div>
          </section>

          <section className="section" id="features">
            <div className="section-head">
              <span className="t-eyebrow">Features</span>
              <h2>Built for the moment before launch</h2>
              <p>The name is the first decision. Make it with real information.</p>
            </div>
            <div className="feature-grid">
              {FEATURES.map((f) => (
                <div className="card feature" key={f.title}>
                  <span className="tile tile-lg">{f.glyph}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section" id="pricing">
            <div className="section-head">
              <span className="t-eyebrow">Pricing</span>
              <h2>Free to check. Pro to keep.</h2>
              <p>Start with unlimited manual checks. Upgrade when you want AI generation, history, and saved shortlists.</p>
            </div>
            <div className="pricing-grid">
              <div className="card price-card">
                <div className="plan-name">
                  <h3>Free</h3>
                  <span className="badge badge-neutral">Forever</span>
                </div>
                <div className="price">
                  <span className="amount">$0</span>
                  <span className="t-small t-muted">/ month</span>
                </div>
                <ul>
                  <li>Unlimited username checks</li>
                  <li>All 15 platforms</li>
                  <li>Availability score</li>
                  <li>3 AI generations per day</li>
                </ul>
                <Link className="btn btn-secondary btn-block" href="/signup">
                  Create free account
                </Link>
              </div>
              <div className="card price-card featured">
                <div className="plan-name">
                  <h3>Pro</h3>
                  <span className="badge badge-accent">Most popular</span>
                </div>
                <div className="price">
                  <span className="amount">$9</span>
                  <span className="t-small t-muted">/ month</span>
                </div>
                <ul>
                  <li>Everything in Free</li>
                  <li>Unlimited AI handle generation</li>
                  <li>Full search history</li>
                  <li>Saved handles with platform tracking</li>
                  <li>Priority support</li>
                </ul>
                <Link className="btn btn-primary btn-block" href="/signup">
                  Upgrade to Pro
                </Link>
              </div>
            </div>
          </section>

          <section className="section cta-final">
            <h2>The name you want is still out there.</h2>
            <p>Find out in one search — before someone else does.</p>
            <Link className="btn btn-primary" href="/signup">
              Check a username
            </Link>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner" style={{ maxWidth: "1120px" }}>
          <span className="t-caption t-muted">© {new Date().getFullYear()} HandleScout</span>
          <div className="footer-links">
            <Link href="/faq">FAQ</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/login">Sign in</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
