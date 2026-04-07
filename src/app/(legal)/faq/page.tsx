import { Metadata } from "next";
import FAQ from "./faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about HandleScout — the AI-powered username checker.",
};

export default async function Page() {
  return <FAQ />;
}
