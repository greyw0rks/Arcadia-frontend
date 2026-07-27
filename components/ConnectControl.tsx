"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChain } from "../lib/chainContext";
import { CELO_TOKENS, type CeloToken } from "../lib/contract";

export function TokenSwitcher() {
  const { token, setToken } = useChain();
  const ids = Object.keys(CELO_TOKENS) as CeloToken[];
  return (
    <div style={{ display: "inline-flex", border: "4px solid var(--border)", background: "var(--card)", boxShadow: "var(--shadow-sm)" }}>
      {ids.map((id, i) => {
        const active = token === id;
        return (
          <button
            key={id}
            onClick={() => setToken(id)}
            style={{
              padding: "6px 14px",
              minHeight: 44,
              border: "none",
              borderRight: i < ids.length - 1 ? "4px solid var(--border)" : "none",
              background: active ? "var(--accent)" : "var(--card)",
              color: "var(--text)",
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            aria-pressed={active}
          >
            {CELO_TOKENS[id].label}
          </button>
        );
      })}
    </div>
  );
}

export function ConnectControl() {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <TokenSwitcher />
      <ConnectButton showBalance={false} chainStatus="icon" />
    </div>
  );
}
