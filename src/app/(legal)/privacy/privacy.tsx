"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Information we collect",
    content: `We collect information you provide directly to us, including your name, email address, and password when you create an account. We also collect usage data such as search queries, generated usernames, and platform interaction data to improve the Service.`,
  },
  {
    title: "2. How we use your information",
    content: `We use the information we collect to provide and improve the Service, process payments, send transactional emails (such as email confirmation and password resets), enforce our Terms of Service, and respond to your support requests.`,
  },
  {
    title: "3. Data storage",
    content: `Your data is stored securely using Supabase, a PostgreSQL-based database platform with enterprise-grade security. All data is encrypted at rest and in transit. We retain your data for as long as your account is active or as needed to provide the Service.`,
  },
  {
    title: "4. Third-party services",
    content: `We use the following third-party services: Supabase (database and authentication), Groq (AI username generation), Lemon Squeezy (payment processing), and Vercel (hosting). Each service has its own privacy policy governing the data they process.`,
  },
  {
    title: "5. Cookies",
    content: `We use cookies and similar technologies to maintain your session and remember your preferences. These are essential for the Service to function. We do not use cookies for advertising or third-party tracking.`,
  },
  {
    title: "6. Data sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist in operating the Service, subject to confidentiality agreements.`,
  },
  {
    title: "7. Username availability checks",
    content: `When you check username availability, we make requests to third-party platforms using the username you provide. These requests do not include your personal information. Results may be cached temporarily to improve performance.`,
  },
  {
    title: "8. Your rights",
    content: `You have the right to access, update, or delete your personal information at any time. You can update your profile information from your account settings. To request account deletion, contact us at support@handlescout.app and we will process your request within 30 days.`,
  },
  {
    title: "9. Security",
    content: `We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.`,
  },
  {
    title: "10. Children's privacy",
    content: `The Service is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.`,
  },
  {
    title: "11. Changes to this policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email. Your continued use of the Service after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "12. Contact",
    content: `If you have any questions about this Privacy Policy or how we handle your data, please contact us at support@handlescout.app`,
  },
];

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 280,
      damping: 26,
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

export default function Privacy() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "80px 24px 120px",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ marginBottom: "48px" }}
      >
        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "40px",
            fontWeight: 800,
            marginBottom: "12px",
            letterSpacing: "-0.02em",
          }}
        >
          Privacy Policy
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </motion.div>

      {/* Sections */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{ display: "flex", flexDirection: "column", gap: "32px" }}
      >
        {sections.map((section) => (
          <motion.div
            key={section.title}
            variants={fadeUp}
            style={{ scrollMarginTop: "80px" }}
          >
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "10px",
                color: "var(--text-primary)",
              }}
            >
              {section.title}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--text-secondary)",
                lineHeight: 1.8,
              }}
            >
              {section.content}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          marginTop: "80px",
          textAlign: "center",
          fontSize: "13px",
          color: "var(--text-muted)",
        }}
      >
        This Privacy Policy is subject to change. Please review it periodically.
      </motion.p>
    </div>
  );
}
