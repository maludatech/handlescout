import { Metadata } from "next";
import ResetPassword from "./reset-password";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your HandleScout account password.",
};

export default async function Page() {
  return <ResetPassword />;
}
