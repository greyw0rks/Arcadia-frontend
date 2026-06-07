# Arcadia Frontend — Deployment (Vercel)

The frontend is the **public** half of the Arcadia Next.js app: the UI, the Celo⇄Stacks chain
switcher, and the game screens. It is the **same codebase** as `arcadia-backend`, but deployed with
`BACKEND_URL` set so every `/api/*` request is **proxied to the always-on backend** instead of
running its own (stateless, session-dropping) API on Vercel.

> Why the split: the API holds server-authoritative game state in process memory, which Vercel's
> stateless functions can't keep. See `next.config.js` — when `BACKEND_URL` is set, a `beforeFiles`
> rewrite sends `/api/:path*` to the backend, so the browser still calls same-origin `/api/...`
> (no CORS) and all stateful endpoints land on the one backend process.

## Steps

1. Push `arcadia-frontend/` as its own Git repo.
2. Vercel → **Add New** → **Project** → import the repo. Framework auto-detects as **Next.js**.
   (Root Directory = `.` — this folder is the app root.)
3. Set environment variables (below).
4. Deploy. Add a custom domain if desired, then **redeploy after any env change**.

## Environment variables

Set the public chain config (same mainnet values as the backend) **plus** `BACKEND_URL`:

| Var | Value |
|---|---|
| `BACKEND_URL` | The Render backend URL, e.g. `https://arcadia-api.onrender.com` — **the flag that enables the proxy** |
| `NEXT_PUBLIC_ARCADE_ADDRESS` | Deployed Celo `QuizArcade` address |
| `NEXT_PUBLIC_STACKS_ARCADE_CONTRACT` | `<deployer>.quiz-arcade` |
| `NEXT_PUBLIC_CELO_NETWORK` | `mainnet` |
| `NEXT_PUBLIC_STACKS_NETWORK` | `mainnet` |
| `NEXT_PUBLIC_CUSD_ADDRESS` | `0x765DE816845861e75A25fCA122bb6898B8B1282a` |
| `NEXT_PUBLIC_RPC_URL` | `https://forno.celo.org` |
| `NEXT_PUBLIC_STACKS_API_URL` | `https://api.mainnet.hiro.so` |
| `NEXT_PUBLIC_WC_PROJECT_ID` | WalletConnect Cloud project id |

> **Do NOT set the signer secrets** (`SETTLEMENT_SIGNER_PRIVATE_KEY`, `STACKS_SIGNER_PRIVATE_KEY`)
> on Vercel. They live only on the backend. The frontend never signs settlements — it proxies to the
> backend that does.

## Smoke test

1. Load the site, connect a wallet, switch Celo⇄Stacks.
2. Play a round. In the browser network tab, confirm `/api/*` requests resolve (proxied to Render).
3. Sessions persist across requests (same backend process) — a game completes and `settle` succeeds.
