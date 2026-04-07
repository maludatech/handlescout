import { Metadata } from "next";
import Terms from "./terms";

export const metadata: Metadata = {
  title: "Terms of service",
};

export default async function Page() {
  return <Terms />;
}
