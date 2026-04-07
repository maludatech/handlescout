import { Metadata } from "next";
import FAQ from "./faq";

export const metadata: Metadata = {
  title: "FAQ",
};

export default async function Page() {
  return <FAQ />;
}
