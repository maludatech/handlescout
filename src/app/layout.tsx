import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HandleScout — Find your perfect username",
  description:
    "AI-generated usernames checked across 15 platforms instantly. Find your perfect handle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
