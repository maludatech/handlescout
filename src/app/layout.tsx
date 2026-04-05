import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "HandleScout — Find your perfect username",
  description: "AI-generated usernames checked across 15 platforms instantly.",
  openGraph: {
    title: "HandleScout — Find your perfect username",
    description:
      "AI-generated usernames checked across 15 platforms instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}
