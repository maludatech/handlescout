import { Metadata } from "next";
import Login from "./login";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your HandleScout account.",
};

export default async function Page() {
  return <Login />;
}
