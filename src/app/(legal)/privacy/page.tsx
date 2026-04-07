import { Metadata } from "next";
import Privacy from "./privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default async function Page() {
  return <Privacy />;
}
