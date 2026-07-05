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
        {chain === "celo" && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.82)",
            backdropFilter: "blur(4px)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 20, padding: "0 24px", textAlign: "center",
            fontFamily: "'Space Grotesk', monospace",
          }}>
            <div style={{
              fontSize: "0.72rem", fontWeight: 900, textTransform: "uppercase",
              letterSpacing: "0.15em", padding: "7px 18px",
              border: "3px solid #FFD93D", color: "#FFD93D",
            }}>
              🔧 Upgrading contracts
            </div>
            <div style={{
              fontSize: "clamp(2.4rem, 8vw, 5rem)", fontWeight: 900,
              textTransform: "uppercase", letterSpacing: "-2px",
              color: "#fff", lineHeight: 1,
            }}>
              Coming<br />Soon
            </div>
            <p style={{
              fontSize: "1rem", fontWeight: 500, color: "#9CA3AF",
              maxWidth: 360, lineHeight: 1.6, margin: 0,
            }}>
              Celo Arcadia is being upgraded to a new multi-token contract.
              Back shortly.
            </p>
            <a href="https://twitter.com/arcadia_uno" target="_blank" rel="noopener noreferrer" style={{
              fontSize: "0.82rem", fontWeight: 900, textTransform: "uppercase",
              letterSpacing: "0.08em", textDecoration: "none", color: "#0F0F0F",
              background: "#FFD93D", padding: "12px 24px",
              border: "3px solid #fff", marginTop: 8,
            }}>
              Follow @arcadia_uno →
            </a>
          </div>
        )}
      </body>
    </html>
  );
}
