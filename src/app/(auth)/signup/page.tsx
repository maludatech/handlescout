import { Metadata } from "next";
import Signup from "./signup";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Start finding your perfect username for free. No credit card required.",
};

export default async function Page() {
  return <Signup />;
}
