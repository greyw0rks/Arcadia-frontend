# Arcadia — Frontend

The **public UI** for Arcadia, a two-chain (Celo + Stacks) house-treasury staking arcade. This is the
Next.js app deployed to **Vercel**. It renders the games and the Celo⇄Stacks switcher, and **proxies
all `/api/*` calls to the always-on backend** (`arcadia-backend`) via the `BACKEND_URL` rewrite in
`next.config.js`.

> This is the same Next.js codebase as `arcadia-backend`, deployed with `BACKEND_URL` **set**. The
> backend is the same code deployed with it **unset** (so it serves the stateful API itself).

## Run locally

```bash
npm install
cp .env.example .env.local      # fill in NEXT_PUBLIC_* + BACKEND_URL (point at your backend)
npm run dev                     # http://localhost:3000
```

Without `BACKEND_URL`, the app serves its own `/api` locally (handy for dev). With it set, `/api/*`
proxies to the backend.

## Deploy

See **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)**.

## Related folders (siblings)

- `arcadia-backend/` — the stateful API + trusted signer (Render).
- `arcadia-stresstest/` — two-chain load tester.
- `arcadia-contracts/` — Celo (`celo/`) + Stacks (`stacks/`) contract source.
