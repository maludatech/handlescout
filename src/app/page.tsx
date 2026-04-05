import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const PLATFORMS = [
  "Instagram",
  "X (Twitter)",
  "TikTok",
  "YouTube",
  "GitHub",
  "Reddit",
  "Pinterest",
  "LinkedIn",
  "Twitch",
  "Snapchat",
  "Medium",
  "Tumblr",
  "SoundCloud",
  "Telegram",
  "Dev.to",
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <div className="dot-grid min-h-screen">
      {/* Navbar */}
      <nav
        style={{
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "#0a0a0f99",
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
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            Handle<span style={{ color: "var(--accent)" }}>Scout</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/login">
              <button
                className="btn-ghost"
                style={{ padding: "8px 20px", fontSize: "14px" }}
              >
                Sign in
              </button>
            </Link>
            <Link href="/signup">
              <button
                className="btn-primary"
                style={{ padding: "8px 20px", fontSize: "14px" }}
              >
                Get started free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "100px 24px 80px",
          textAlign: "center",
        }}
      >
        {/* Pill badge */}
        <div
          className="animate-fade-up"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "#6366f115",
            border: "1px solid #6366f130",
            borderRadius: "100px",
            padding: "6px 16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--accent)",
              animation: "pulse-glow 2s infinite",
            }}
          />
          <span style={{ fontSize: "13px", color: "#818cf8", fontWeight: 500 }}>
            15 platforms checked instantly
          </span>
        </div>

        <h1
          className="animate-fade-up stagger-1"
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(48px, 8vw, 80px)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "24px",
            letterSpacing: "-0.03em",
          }}
        >
          Find your perfect
          <br />
          <span className="gradient-text">username</span>
        </h1>

        <p
          className="animate-fade-up stagger-2"
          style={{
            fontSize: "18px",
            color: "var(--text-secondary)",
            maxWidth: "560px",
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          AI generates unique, letters-only handles and checks availability
          across every major platform — in seconds.
        </p>

        <div
          className="animate-fade-up stagger-3"
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/signup">
            <button
              className="btn-primary"
              style={{ padding: "14px 32px", fontSize: "16px" }}
            >
              Start for free →
            </button>
          </Link>
          <Link href="/login">
            <button
              className="btn-ghost"
              style={{ padding: "14px 32px", fontSize: "16px" }}
            >
              Sign in
            </button>
          </Link>
        </div>

        <p
          className="animate-fade-up stagger-4"
          style={{
            marginTop: "16px",
            fontSize: "13px",
            color: "var(--text-muted)",
          }}
        >
          Free to start · No credit card required
        </p>
      </section>

      {/* Platform pills */}
      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            color: "var(--text-muted)",
            marginBottom: "20px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 500,
          }}
        >
          Checks availability across
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {PLATFORMS.map((p) => (
            <span
              key={p}
              className="glass"
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                color: "var(--text-secondary)",
                borderRadius: "100px",
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {[
            {
              icon: "⚡",
              title: "Instant availability check",
              desc: "Type any username and see its availability across 15 platforms in real time. No waiting, no guessing.",
            },
            {
              icon: "✦",
              title: "AI-powered generation",
              desc: "Describe your vibe and let AI generate 15 unique, letters-only usernames — then checks them all automatically.",
            },
            {
              icon: "🎯",
              title: "Availability score",
              desc: "Every username gets a score based on how many platforms it's available on. Find the ones that matter.",
            },
          ].map((f) => (
            <div key={f.title} className="glass" style={{ padding: "32px" }}>
              <div
                style={{
                  fontSize: "28px",
                  marginBottom: "16px",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "10px",
                  color: "var(--text-primary)",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 100px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Simple pricing
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "48px",
            fontSize: "17px",
          }}
        >
          Start free, upgrade when you need more.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          {/* Free */}
          <div className="glass" style={{ padding: "36px", textAlign: "left" }}>
            <div
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                fontWeight: 500,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Free
            </div>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "40px",
                fontWeight: 700,
                marginBottom: "24px",
              }}
            >
              $0
            </div>
            {[
              "Unlimited username checks",
              "15 platforms",
              "3 AI generations / day",
            ].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ color: "var(--success)" }}>✓</span>
                {f}
              </div>
            ))}
            <Link href="/signup">
              <button
                className="btn-ghost"
                style={{
                  width: "100%",
                  marginTop: "24px",
                }}
              >
                Get started
              </button>
            </Link>
          </div>

          {/* Pro */}
          <div
            style={{
              background: "linear-gradient(135deg, #1a1a2e, #16162a)",
              border: "1px solid #6366f140",
              borderRadius: "var(--radius)",
              padding: "36px",
              textAlign: "left",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: "linear-gradient(90deg, #6366f1, #818cf8)",
              }}
            />
            <div
              style={{
                fontSize: "14px",
                color: "#818cf8",
                fontWeight: 500,
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Pro
            </div>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "40px",
                fontWeight: 700,
                marginBottom: "4px",
              }}
            >
              $9
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "var(--text-muted)",
                marginBottom: "24px",
              }}
            >
              per month
            </div>
            {[
              "Everything in Free",
              "Unlimited AI generations",
              "Search history",
              "Save usernames",
              "Priority support",
            ].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "12px",
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ color: "var(--accent)" }}>✓</span>
                {f}
              </div>
            ))}
            <Link href="/signup">
              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  marginTop: "24px",
                }}
              >
                Get started →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 120px",
          textAlign: "center",
        }}
      >
        <div
          className="glass"
          style={{
            padding: "80px 40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "#6366f108",
              top: "-200px",
              left: "50%",
              transform: "translateX(-50%)",
              filter: "blur(60px)",
            }}
          />
          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Ready to claim your handle?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "32px",
              fontSize: "17px",
            }}
          >
            Join thousands of creators finding their perfect username.
          </p>
          <Link href="/signup">
            <button
              className="btn-primary"
              style={{ padding: "14px 40px", fontSize: "16px" }}
            >
              Start for free →
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          © {new Date().getFullYear()} HandleScout. Built for creators.
        </p>
      </footer>
    </div>
  );
}
