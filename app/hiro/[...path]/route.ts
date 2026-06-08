import { NextRequest, NextResponse } from "next/server";

// Same-origin proxy for Hiro Stacks API reads. The browser calls /hiro/v2/... (no CORS, same origin)
// and this server route forwards to Hiro with a server-only HIRO_API_KEY — which lifts the
// unauthenticated per-IP rate limit that was producing 429s (surfaced in the browser as a CORS error,
// since Hiro's 429 response carries no Access-Control-Allow-Origin header).
//
// Mounted at /hiro (NOT /api) on purpose: next.config.js rewrites /api/* to BACKEND_URL on the Vercel
// deployment, which would otherwise swallow this route before Next handles it.

const HIRO_BASE = (
  process.env.STACKS_API_URL ??
  (process.env.NEXT_PUBLIC_STACKS_NETWORK === "testnet"
    ? "https://api.testnet.hiro.so"
    : "https://api.mainnet.hiro.so")
).replace(/\/$/, "");

const HIRO_API_KEY = process.env.HIRO_API_KEY;

async function forward(req: NextRequest, path: string[]) {
  const url = `${HIRO_BASE}/${path.join("/")}${req.nextUrl.search}`;

  const headers: Record<string, string> = {
    accept: req.headers.get("accept") ?? "application/json",
  };
  const contentType = req.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;
  if (HIRO_API_KEY) headers["x-api-key"] = HIRO_API_KEY;

  const init: RequestInit = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD") init.body = await req.text();

  try {
    const upstream = await fetch(url, init);
    const body = await upstream.text();
    return new NextResponse(body, {
      status: upstream.status,
      headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
    });
  } catch (e) {
    return NextResponse.json(
      { error: "hiro proxy fetch failed", detail: (e as Error).message },
      { status: 502 },
    );
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return forward(req, (await ctx.params).path);
}
