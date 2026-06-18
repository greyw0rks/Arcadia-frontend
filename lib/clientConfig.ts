// Client-safe constants that mirror the backend's difficulty.ts.
// Used for UI preview only (round-count estimate, stake slider).
// The server ALWAYS re-derives these from real on-chain data and never trusts
// any value the client sends — so exposing these here leaks nothing exploitable.

import type { ChainId } from "./contract";

export const MAX_STAKE: Record<ChainId, number> = { celo: 1, stacks: 1 };
export const MIN_ROUNDS = 7;
export const MAX_ROUNDS = 15;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function difficultyFromStake(stake: number, chain: ChainId): number {
  return clamp((stake || 0) / MAX_STAKE[chain], 0, 1);
}

export function roundsFor(d: number, bankSize: number): number {
  const scaled = Math.round(MIN_ROUNDS + clamp(d, 0, 1) * (MAX_ROUNDS - MIN_ROUNDS));
  const ceiling = Math.min(MAX_ROUNDS, 20, Math.max(MIN_ROUNDS, bankSize));
  return clamp(scaled, MIN_ROUNDS, ceiling);
}
