/** @type {import('next').NextConfig} */

// FRONTEND-ONLY deployment. All /api/* calls are proxied to the always-on backend
// (arcadia-backend on Render/Railway). BACKEND_URL is REQUIRED — without it every
// game API call will 404. Set it in Vercel env vars or your local .env.local.
//
// Architecture:
//   arcadia-frontend  (this repo)  → Vercel, stateless, no secrets, no question banks
//   arcadia-backend                → Render/Railway, always-on, holds session state + signer keys
//
// The browser always calls same-origin /api/... — Next.js rewrites them before they
// leave the server, so there are no CORS headers to manage and the backend URL stays
// server-side only (never reaches the browser bundle).
//
// Static game images (/geo/*, /movies/*, /logos/*) also live on the backend — the
// frontend only carries a small seed set. Rewriting these paths ensures the full image
// bank is always available without copying files into this repo.

const backendUrl = process.env.BACKEND_URL;

if (!backendUrl && process.env.NODE_ENV === "production") {
  throw new Error(
    "[arcadia-frontend] BACKEND_URL is not set. " +
    "This frontend has no API routes of its own — it must proxy to the backend. " +
    "Set BACKEND_URL=https://your-backend.up.railway.app in your Vercel environment variables."
  );
}

if (!backendUrl && process.env.NODE_ENV !== "production") {
  console.warn(
    "\n⚠  [arcadia-frontend] BACKEND_URL is not set.\n" +
    "   All /api/* calls will 404. Point BACKEND_URL at your local backend:\n" +
    "   BACKEND_URL=http://localhost:3001\n"
  );
}

const nextConfig = {
  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  async rewrites() {
    if (!backendUrl) return [];
    const base = backendUrl.replace(/\/$/, "");
    return {
      // beforeFiles rewrites run before Next.js checks its own public/ folder, so a
      // locally-present file always wins and the rewrite only fires for missing assets.
      beforeFiles: [
        // Proxy every /api/* call to the backend — no local /api routes exist in this repo.
        { source: "/api/:path*", destination: `${base}/api/:path*` },
        // Proxy game image banks. The frontend ships a small seed set; the full library
        // lives on the backend. These rewrites pull any missing image transparently.
        { source: "/geo/:path*",    destination: `${base}/geo/:path*` },
        { source: "/movies/:path*", destination: `${base}/movies/:path*` },
        { source: "/logos/:path*",  destination: `${base}/logos/:path*` },
      ],
    };
  },

  experimental: {
    optimizePackageImports: ["@rainbow-me/rainbowkit", "wagmi", "viem"],
  },

  // NOTE: webpack pinned — Turbopack miscompiles @stacks/connect dynamic-import chunks.
  // Revisit once the upstream Turbopack bug is fixed.
};

module.exports = nextConfig;
