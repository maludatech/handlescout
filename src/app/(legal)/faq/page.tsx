"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "What is HandleScout?",
    answer:
      "HandleScout is a username availability checker and AI-powered generator. You can check if a specific username is available across 15 major social media platforms, or let our AI generate unique, letters-only usernames based on your keywords and vibe — then check them all automatically.",
  },
  {
    question: "How does the availability checker work?",
    answer:
      'We check username availability by querying public profile pages on each platform. When a platform returns a "not found" response, we mark the username as available. Note that some platforms like X (Twitter), LinkedIn, and Snapchat are harder to check reliably, so we provide a direct link to verify manually on those.',
  },
  {
    question: "Are the results accurate?",
    answer:
      'Results are generally accurate but not guaranteed. Platform availability can change in real time, and some platforms actively block automated checks. We always recommend clicking "Visit →" to confirm availability directly on the platform before committing to a username.',
  },
  {
    question: 'What does "letters only" mean?',
    answer:
      "HandleScout generates and checks usernames containing only letters — no numbers, underscores, or special characters. This is intentional: clean, letters-only usernames are more brandable, easier to remember, and look more professional across platforms.",
  },
  {
    question: "What is the free plan?",
    answer:
      "The free plan gives you unlimited direct username checks across all 15 platforms, plus 3 AI generations per day. This is enough to explore the tool and find great usernames without spending anything.",
  },
  {
    question: "What does Pro include?",
    answer:
      "Pro ($9/month) gives you unlimited AI generations, full search history so you never lose a great idea, the ability to save and bookmark your favourite usernames, and priority support.",
  },
  {
    question: "Can I cancel my Pro subscription?",
    answer:
      "Yes, you can cancel anytime from your billing portal — no questions asked. You will retain Pro access until the end of your current billing period.",
  },
  {
    question: "How does AI generation work?",
    answer:
      "You provide keywords or a name idea, choose a vibe (creative, professional, playful, minimal, or bold), and our AI generates 15 unique username candidates. We then automatically check all of them across every platform and rank them by availability score.",
  },
  {
    question: "What platforms do you check?",
    answer:
      'We currently check Instagram, TikTok, GitHub, Reddit, Pinterest, Twitch, YouTube, Medium, Tumblr, SoundCloud, Telegram, and Dev.to. X (Twitter), LinkedIn, and Snapchat are shown with a "Check manually" link due to technical limitations with those platforms.',
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. Your data is stored securely using Supabase with encryption at rest and in transit. We never sell your data or share it with third parties beyond what is necessary to operate the service. Read our full Privacy Policy for details.",
  },
  {
    question: "Do I need an account to use HandleScout?",
    answer:
      "Yes, an account is required to use the checker and generator. This allows us to enforce fair usage limits on the free tier and save your history and preferences on Pro.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, Mastercard, American Express) as well as PayPal and Cash App Pay, processed securely through Lemon Squeezy.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="glass"
      style={{
        overflow: "hidden",
        transition: "all 0.2s",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "DM Sans, sans-serif",
          textAlign: "left",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.5,
          }}
        >
          {question}
        </span>
        <span
          style={{
            color: "var(--accent)",
            fontSize: "20px",
            fontWeight: 300,
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          +
        </span>
      </button>

      {open && (
        <div
          style={{
            padding: "0 24px 20px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              color: "var(--text-secondary)",
              lineHeight: 1.8,
              paddingTop: "16px",
            }}
          >
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div>
      <div style={{ marginBottom: "48px", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "40px",
            fontWeight: 800,
            marginBottom: "12px",
            letterSpacing: "-0.02em",
          }}
        >
          Frequently asked questions
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "16px",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          Everything you need to know about HandleScout. Can&apos;t find an
          answer?{" "}
          <a
            href="mailto:support@handlescout.app"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            Email us
          </a>
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {faqs.map((faq) => (
          <FAQItem
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>

      {/* CTA */}
      <div
        className="glass"
        style={{
          marginTop: "64px",
          padding: "48px 40px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "28px",
            fontWeight: 700,
            marginBottom: "12px",
          }}
        >
          Ready to find your handle?
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "24px",
            fontSize: "15px",
          }}
        >
          Start for free — no credit card required.
        </p>
        <Link href="/signup">
          <button className="btn-primary" style={{ padding: "12px 32px" }}>
            Get started free →
          </button>
        </Link>
      </div>
    </div>
  );
}
