import { Metadata } from "next";
import History from "./history";

export const metadata: Metadata = {
  title: "History",
};

export default async function Page() {
  return <History />;
}
