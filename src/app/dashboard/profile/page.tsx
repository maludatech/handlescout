import { Metadata } from "next";
import Profile from "./profile";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function Page() {
  return <Profile />;
}
