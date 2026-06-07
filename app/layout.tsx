import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Arcadia — stake-to-play games Onchain",
  description: "An arcade of skill games where your stake rides a live multiplier. Built onchain.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/logo.svg",
  },
  other: {
    // Talent Protocol verification (update with your actual meta tag)
    "talentapp:project_verification":
      "e9fe66e1565442422ba268d40f55c48dfdd3d03df673083108e93cb734e7450bd510dbc88ac2147957f584848222f449bf709d54d438862782de61ae9b768756",
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
