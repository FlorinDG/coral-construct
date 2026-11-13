import { Exo_2, Inter } from "next/font/google";

// Display: Exo 2 (headings, numbers, brand). Text: Inter (body, form, UI).
const head = Exo_2({ subsets: ["latin", "latin-ext"], variable: "--font-head", weight: ["500", "600", "700", "800"] });
const body = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-body" });

export const fontVars = `${head.variable} ${body.variable}`;
