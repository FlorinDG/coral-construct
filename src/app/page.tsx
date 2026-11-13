import { OnePager } from "@/components/OnePager";
import { fontVars } from "@/lib/fonts";
import "@/styles/neu.css";

// The live site: the neumorphism direction. /modern stays as the alternative.
export default function Home() {
  return <OnePager variant="neu" className={fontVars} />;
}
