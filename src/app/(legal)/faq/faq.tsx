"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is HandleScout?",
    answer:
      "HandleScout is a username availability checker and AI-powered generator. You can check if a specific username is available across 15 major social media platforms, or let our AI generate unique, letters-only usernames based on your keywords — then check them all automatically.",
  },
  {
    question: "How does the availability checker work?",
    answer:
      'We check username availability by querying public profile pages on each platform. When a platform returns a "not found" response, we mark the username as available. Note that some platforms like X (Twitter), LinkedIn, and Snapchat are harder to check reliably, so we provide a direct link to verify manually on those.',
  },
  {
    question: "Are the results accurate?",
    answer:
      'Results are generally accurate but not guaranteed. Platform availability can change in real time, and some platforms actively block automated checks. We always recommend confirming directly on the platform before committing to a username.',
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
      "You provide keywords or a name idea, choose a vibe, and our AI generates unique username candidates. We then automatically check all of them across every platform and rank them by availability score.",
  },
  {
    question: "What platforms do you check?",
    answer:
      'We check Instagram, X (Twitter), TikTok, GitHub, Reddit, Pinterest, Twitch, YouTube, LinkedIn, Snapchat, Medium, Tumblr, SoundCloud, Telegram, and Dev.to. A few of these are shown with a "Check manually" link due to technical limitations on that platform.',
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
      "We accept all major credit and debit cards as well as PayPal, processed securely through Lemon Squeezy.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item" data-open={open}>
      <button
        type="button"
        className="faq-q"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {question}
        <svg
          className="chev"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && <div className="faq-a">{answer}</div>}
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      <header className="doc-head">
        <h1>Frequently asked questions</h1>
        <p className="doc-meta t-small t-muted">
          Can&apos;t find an answer? Write to{" "}
          <a href="mailto:support@handlescout.app" style={{ color: "var(--accent)" }}>
            support@handlescout.app
          </a>
          .
        </p>
      </header>

      <div className="doc-body">
        <div className="faq-list">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </>
  );
}
