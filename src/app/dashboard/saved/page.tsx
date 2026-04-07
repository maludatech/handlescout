import { Metadata } from "next";
import Saved from "./saved";

export const metadata: Metadata = {
  title: "Saved usernames",
};

export default async function Page() {
  return <Saved />;
}
