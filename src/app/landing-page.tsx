"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 28,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const platformContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const platformItem = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 350,
      damping: 25,
    },
  },
};

export default function LandingPage() {
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

      {/* Hero Section */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "100px 24px 80px",
          textAlign: "center",
        }}
      >
        {/* Pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
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
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.15 }}
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
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
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
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.45 }}
          style={{
            marginTop: "16px",
            fontSize: "13px",
            color: "var(--text-muted)",
          }}
        >
          Free to start · No credit card required
        </motion.p>
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

        <motion.div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            justifyContent: "center",
          }}
          variants={platformContainer}
          initial="hidden"
          animate="visible"
        >
          {PLATFORMS.map((p) => (
            <motion.span
              key={p}
              className="glass"
              variants={platformItem}
              whileHover={{
                scale: 1.08,
                y: -2,
                transition: { type: "spring", stiffness: 400 },
              }}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                color: "var(--text-secondary)",
                borderRadius: "100px",
                cursor: "default",
              }}
            >
              {p}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
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
          ].map((f, index) => (
            <motion.div
              key={f.title}
              className="glass"
              variants={fadeUp}
              style={{ padding: "32px" }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div style={{ fontSize: "28px", marginBottom: "16px" }}>
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
            </motion.div>
          ))}
        </motion.div>
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
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Simple pricing
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          style={{
            color: "var(--text-secondary)",
            marginBottom: "48px",
            fontSize: "17px",
          }}
        >
          Start free, upgrade when you need more.
        </motion.p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          {/* Free Card */}
          <motion.div
            className="glass"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -6 }}
            style={{ padding: "36px", textAlign: "left" }}
          >
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
                style={{ width: "100%", marginTop: "24px" }}
              >
                Get started
              </button>
            </Link>
          </motion.div>

          {/* Pro Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            whileHover={{ y: -8 }}
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
                style={{ width: "100%", marginTop: "24px" }}
              >
                Get started →
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 120px",
          textAlign: "center",
        }}
      >
        <motion.div
          className="glass"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            Handle<span style={{ color: "var(--accent)" }}>Scout</span>
          </span>
          <div
            style={{
              display: "flex",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "FAQ", href: "/faq" },
              { label: "Terms", href: "/terms" },
              { label: "Privacy", href: "/privacy" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} HandleScout. Built for creators.
          </p>
        </div>
      </footer>
    </div>
  );
}
