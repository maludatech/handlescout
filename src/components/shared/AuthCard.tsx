import { motion, AnimatePresence } from "framer-motion";

export function AuthCard({
  title,
  subtitle,
  error,
  children,
}: {
  title: string;
  subtitle: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="card auth-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1>{title}</h1>
      <p className="lede t-small t-sec">{subtitle}</p>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="hint t-small"
            style={{ marginTop: 0, marginBottom: "16px", color: "var(--danger-text)" }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {children}
    </motion.div>
  );
}

export function AuthSuccessCard({
  icon,
  title,
  description,
  footer,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <motion.div
      className="card auth-card auth-success"
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span
        className="glyph tile tile-lg"
        style={{ color: "var(--success-text)", background: "var(--success-dim)", borderColor: "transparent" }}
      >
        {icon}
      </span>
      <h1>{title}</h1>
      <p className="lede t-small t-sec">{description}</p>
      {footer}
    </motion.div>
  );
}
