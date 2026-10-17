import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Hanken_Grotesk, Space_Grotesk } from "next/font/google";
import "./gildedglow.css";

const display = Space_Grotesk({ subsets: ["latin"] });
const body = Hanken_Grotesk({ subsets: ["latin"] });

// gildedglow.css references the fonts by family name in --font-display/--font-body.
// next/font self-hosts them under generated names, so point the tokens at those.
const fontTokens = {
  "--font-display": `${display.style.fontFamily}, "Segoe UI", system-ui, sans-serif`,
  "--font-body": `${body.style.fontFamily}, "Segoe UI", system-ui, sans-serif`,
} as CSSProperties;

export const metadata: Metadata = {
  title: { template: "GildedGlow · %s", default: "GildedGlow" },
  description: "Inventory and POS",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" style={fontTokens}>
      <body>{children}</body>
    </html>
  );
}
