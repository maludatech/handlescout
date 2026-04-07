"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "1. Acceptance of terms",
    content: `By accessing or using HandleScout ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.`,
  },
  {
    title: "2. Description of service",
    content: `HandleScout is a web-based tool that allows users to check username availability across multiple social media platforms and generate AI-powered username suggestions. The Service is provided on an "as is" and "as available" basis.`,
  },
  {
    title: "3. User accounts",
    content: `You must create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating your account.`,
  },
  {
    title: "4. Free and Pro plans",
    content: `HandleScout offers a free plan with limited AI generations per day and a Pro plan with unlimited access. Pro plan subscriptions are billed monthly and can be cancelled at any time. Refunds are handled on a case-by-case basis.`,
  },
  {
    title: "5. Acceptable use",
    content: `You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service. You may not attempt to gain unauthorised access to any part of the Service or its related systems.`,
  },
  {
    title: "6. Accuracy of results",
    content: `HandleScout checks username availability by querying public platform data. Results are provided for informational purposes only and may not always reflect real-time availability. We do not guarantee the accuracy, completeness, or reliability of any availability results.`,
  },
  {
    title: "7. Intellectual property",
    content: `All content, features, and functionality of the Service are owned by HandleScout and are protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    title: "8. Limitation of liability",
    content: `To the fullest extent permitted by law, HandleScout shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid for the Service in the past 12 months.`,
  },
  {
    title: "9. Termination",
    content: `We reserve the right to suspend or terminate your account at our discretion if you violate these terms. You may also delete your account at any time from your profile settings.`,
  },
  {
    title: "10. Changes to terms",
    content: `We may update these terms from time to time. We will notify users of significant changes via email. Continued use of the Service after changes constitutes acceptance of the new terms.`,
  },
  {
    title: "11. Contact",
    content: `If you have any questions about these Terms of Service, please contact us at support@handlescout.app`,
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

export default function Terms() {
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
          Terms of Service
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

      {/* Optional subtle footer note */}
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
        These Terms of Service are subject to change. Please check back
        periodically.
      </motion.p>
    </div>
  );
}
