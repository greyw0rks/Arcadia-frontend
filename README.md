# Arcadia — Frontend

The **public UI** for [Arcadia](https://github.com/greyw0rks/Arcadia-backend), a skill-based quiz
arcade on Celo. Next.js app deployed to **Vercel**. It renders the games and the USDm/USDC/USDT
switcher, and **proxies all `/api/*` calls to the always-on backend** via the `BACKEND_URL` rewrite
in `next.config.js`.

> Same Next.js codebase as `arcadia-backend`, deployed with `BACKEND_URL` **set**. The backend is the
> same code with it **unset**, so it serves the stateful API itself.

Design language is neo-brutalism — hard offset shadows, heavy borders, no gradients. The
`universal-neo-brutalist-ui` branch unifies it across all viewports: no separate mobile theme and no
JS breakpoint detection, just CSS media queries in `app/globals.css`, which avoids the hydration
flashes the old `innerWidth` checks caused. `main` still carries the older split `mobile.css` until
that branch lands.

## Run locally

```bash
npm install
cp .env.example .env.local      # NEXT_PUBLIC_* + BACKEND_URL (point at your backend)
npm run dev                     # http://localhost:3000
```

Without `BACKEND_URL` the app serves its own `/api` locally, which is handy for dev. With it set,
`/api/*` proxies to the backend.

CI runs typecheck and build on every push and PR.

## Where things are

```
app/
  games/           lobby
  play/[game]/     the game loop
  tournament/      weekly leaderboard
  profile/[addr]/  player history
  kit/             brand kit
  globals.css      the whole design system, incl. responsive scaling
components/        ConnectControl, BottomNav, game UI
lib/contract.ts    chain/token/contract constants — mirrors the backend's copy
```

`lib/contract.ts` is duplicated in the backend on purpose: both halves must compute identical
difficulty and round counts, so the constants can't drift behind an import boundary.

## Siblings

- **[Arcadia-backend](https://github.com/greyw0rks/Arcadia-backend)** — API, game engine, trusted signer. **Start there for the full picture.**
- **[arcadia-contracts](https://github.com/greyw0rks/arcadia-contracts)** — `QuizArcade.sol` on Celo.

---

**Proprietary.** Copyright © 2024–2026 greyw0rks. All rights reserved.
