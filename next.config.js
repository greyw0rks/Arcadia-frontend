/** @type {import('next').NextConfig} */

// Split hosting: the game's API holds server-authoritative state (answer keys, deadlines, the running
// multiplier) in an in-memory store, which only survives in a single long-lived process — NOT on
// Vercel's stateless serverless functions. So the API runs on an always-on host (Render) and the
// public frontend runs on Vercel. When BACKEND_URL is set (on the Vercel deployment), every /api/*
// request is proxied to that backend before hitting Vercel's own route handlers, so the browser still
// calls same-origin `/api/...` (no CORS) and all stateful endpoints land on the one stateful process.
// On the Render deployment BACKEND_URL is left unset, so its local /api routes serve directly.
const backendUrl = process.env.BACKEND_URL;

const nextConfig = {
  reactStrictMode: true,

  // Strip console.* from production bundles.
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  async rewrites() {
    if (!backendUrl) return [];
    const base = backendUrl.replace(/\/$/, "");
    return {
      beforeFiles: [{ source: "/api/:path*", destination: `${base}/api/:path*` }],
    };
  },

  experimental: {
    // Pre-optimize large packages.
    optimizePackageImports: ["@rainbow-me/rainbowkit", "wagmi", "viem"],
    // NOTE: turbopackFileSystemCacheForDev (experimental persistent on-disk dev cache) was removed.
    // It held a stale module graph for dynamically-imported packages like @stacks/connect across
    // restarts, surfacing as "Module … was instantiated … but the module factory is not available".
    // Faster cold compiles weren't worth the recurring corruption. Re-evaluate once it's stable.
  },
};

module.exports = nextConfig;
