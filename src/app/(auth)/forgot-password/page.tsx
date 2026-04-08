import { Metadata } from "next";
import ForgotPassword from "./forgot-password";

export const metadata: Metadata = {
  title: "Forgot password",
};
export default async function Page() {
  return <ForgotPassword />;
}
