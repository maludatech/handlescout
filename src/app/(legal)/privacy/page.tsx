import { Metadata } from "next";
import Privacy from "./privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the HandleScout Privacy Policy. We take your privacy seriously.",
};

export default async function Page() {
  return <Privacy />;
}
