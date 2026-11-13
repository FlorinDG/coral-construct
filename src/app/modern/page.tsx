import { OnePager } from "@/components/OnePager";
import { fontVars } from "@/lib/fonts";
import "@/styles/modern.css";

export const metadata = { title: "Coral Atelier — ^Free quote (modern)" };

export default function ModernPage() {
  return <OnePager variant="modern" className={fontVars} />;
}
