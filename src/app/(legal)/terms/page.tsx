import { Metadata } from "next";
import Terms from "./terms";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "Read the HandleScout Terms of Service.",
};

export default async function Page() {
  return <Terms />;
}
