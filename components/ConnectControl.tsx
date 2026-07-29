"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChain } from "../lib/chainContext";
import { CELO_TOKENS, type CeloToken } from "../lib/contract";

export function TokenSwitcher() {
  const { token, setToken } = useChain();
  const ids = Object.keys(CELO_TOKENS) as CeloToken[];
  return (
    <div className="token-switcher">
      {ids.map((id) => (
        <button key={id} onClick={() => setToken(id)} aria-pressed={token === id}>
          {CELO_TOKENS[id].label}
        </button>
      ))}
    </div>
  );
}

export function ConnectControl() {
  return (
    <div className="connect-control">
      <TokenSwitcher />
      <ConnectButton showBalance={false} chainStatus="icon" />
    </div>
  );
}
