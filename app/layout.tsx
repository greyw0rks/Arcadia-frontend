import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Arcadia — quiz arcade on Celo",
  description: "Stake USDm, USDC or USDT on Celo. Answer questions. Win on-chain.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
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
