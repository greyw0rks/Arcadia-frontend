"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChain } from "../lib/chainContext";
import { CELO_TOKENS, type CeloToken } from "../lib/contract";

export function TokenSwitcher() {
  const { token, setToken } = useChain();
  const ids = Object.keys(CELO_TOKENS) as CeloToken[];
  return (
    <div style={{ display: "inline-flex", border: "3px solid #000", background: "#fff" }}>
      {ids.map((id, i) => {
        const active = token === id;
        return (
          <button
            key={id}
            onClick={() => setToken(id)}
            style={{
              padding: "6px 12px",
              border: "none",
              borderRight: i < ids.length - 1 ? "3px solid #000" : "none",
              background: active ? "#7c5cff" : "#fff",
              color: active ? "#fff" : "#000",
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
