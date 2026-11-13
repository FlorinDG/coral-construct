import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coral Atelier — ^Free quote",
  description: "^Painting and decoration in Belgium — paint, plastering, wallpapers and custom decorations. Call or request a free quote.",
  // Placeholder copy and contact details are still live: keep search engines
  // out until the real content is in. Remove this to go public.
  robots: { index: false, follow: false },
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
