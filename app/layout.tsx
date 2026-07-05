import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";
import { Providers } from "./providers";

const chain = process.env.NEXT_PUBLIC_CHAIN;

const CHAIN_META: Record<string, { title: string; description: string }> = {
  celo:    { title: "Arcadia — quiz arcade on Celo",   description: "Stake USDM, USDC or USDT. Answer questions. Win on-chain." },
  base:    { title: "Arcadia — quiz arcade on Base",   description: "Stake USDC on Base. Answer questions. Win on-chain." },
  stacks:  { title: "Arcadia — quiz arcade on Stacks", description: "Stake STX on Stacks. Answer questions. Win on-chain." },
  landing: { title: "Arcadia — the multi-chain quiz arcade", description: "Skill-based on-chain gaming across Celo, Base and Stacks." },
};

const meta = CHAIN_META[chain ?? "landing"] ?? CHAIN_META.landing;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
  // Base AppChain verification — only active on base.arcadia.uno
  ...(chain === "base" && {
    other: { "base:app_id": "6a459c492876ee6c1138a55e" },
  }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
