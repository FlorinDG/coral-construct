import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coral Construct — ^Free quote",
  description: "^General contractor in Belgium — new builds, renovations and extensions. Call or request a free quote.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
