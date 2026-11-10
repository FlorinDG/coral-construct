import { Inter, Space_Grotesk } from "next/font/google";
import { OnePager } from "@/components/OnePager";
import "@/styles/modern.css";

const head = Space_Grotesk({ subsets: ["latin"], variable: "--font-head", weight: ["500", "700"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata = { title: "Coral Construct — ^Free quote (modern)" };

export default function ModernPage() {
  return <OnePager variant="modern" className={`${head.variable} ${body.variable}`} />;
}
