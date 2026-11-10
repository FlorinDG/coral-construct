import { Manrope } from "next/font/google";
import { OnePager } from "@/components/OnePager";
import "@/styles/neu.css";

const font = Manrope({ subsets: ["latin"], variable: "--font-head", weight: ["400", "600", "700", "800"] });

export const metadata = { title: "Coral Construct — ^Free quote (neumorphism)" };

export default function NeumorphismPage() {
  // One family for heads and body; neumorphism reads best soft and rounded.
  return <OnePager variant="neu" className={`${font.variable} [--font-body:var(--font-head)]`} />;
}
