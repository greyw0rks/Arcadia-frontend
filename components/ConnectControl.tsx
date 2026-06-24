"use client";

import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { useChain } from "../lib/chainContext";
import { useStacksWallet } from "../lib/stacksWallet";
import { CHAINS, CELO_TOKENS, type ChainId, type CeloToken } from "../lib/contract";

// Header control: a Celo/Stacks switcher plus the connect button for whichever chain is active.
// RainbowKit handles Celo; Stacks Connect (Leather/Xverse) handles Stacks.
export function ChainSwitcher() {
  const { chain, setChain } = useChain();
  return (
    <div style={{ display: "inline-flex", border: "3px solid #000", background: "#fff" }}>
      {(Object.keys(CHAINS) as ChainId[]).map((id) => {
        const active = chain === id;
        return (
          <button
            key={id}
            onClick={() => setChain(id)}
            style={{
              padding: "6px 12px",
              border: "none",
              borderRight: id === "celo" ? "3px solid #000" : "none",
              background: active ? "#7c5cff" : "#fff",
              color: active ? "#fff" : "#000",
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
            aria-pressed={active}
          >
            {CHAINS[id].label}
          </button>
        );
      })}
    </div>
  );
}

// Stake-token picker, shown only on Celo. Mirrors the chain switcher: each option selects which
// QuizArcade instance (cUSD / USDC / USDT) the next session stakes + settles against.
export function TokenSwitcher() {
  const { token, setToken, isMiniPay } = useChain();
  const ids = Object.keys(CELO_TOKENS) as CeloToken[];

  if (isMiniPay) {
    return (
      <div
        style={{
          display: "inline-flex",
          border: "1px solid #322E27",
          borderRadius: "999px",
          background: "#1C1A16",
          overflow: "hidden",
        }}
      >
        {ids.map((id, i) => {
          const active = token === id;
          return (
            <button
              key={id}
              onClick={() => setToken(id)}
              style={{
                padding: "6px 11px",
                border: "none",
                borderRight: i < ids.length - 1 ? "1px solid #322E27" : "none",
                background: active ? "#EDE8DF" : "transparent",
                color: active ? "#14120F" : "#A39C8E",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "12px",
                letterSpacing: "0.02em",
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


function StacksConnectButton() {
  const { address, isConnected, connect, disconnect } = useStacksWallet();
  const short = address ? `${address.slice(0, 5)}…${address.slice(-4)}` : "";
  return (
    <button
      onClick={isConnected ? disconnect : connect}
      style={{
        padding: "8px 14px",
        border: "3px solid #000",
        background: isConnected ? "#fff" : "#7c5cff",
        color: isConnected ? "#000" : "#fff",
        fontWeight: 800,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {isConnected ? short : "Connect Stacks Wallet"}
    </button>
  );
}

// Detects MiniPay via context, auto-connects via plain injected() connector (not MetaMask-targeted),
// and shows a compact address pill. Falls back to RainbowKit for normal browser sessions.
function CeloConnectButton() {
  const { isMiniPay } = useChain();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  useEffect(() => {
    if (isMiniPay && !isConnected) {
      connect({ connector: injected() });
    }
  }, [isMiniPay, isConnected, connect]);

  if (isMiniPay && isConnected && address) {
    return (
      <div
        style={{
          padding: "6px 14px",
          border: "1px solid #322E27",
          borderRadius: "999px",
          background: "#1C1A16",
          color: "#EDE8DF",
          fontWeight: 500,
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: "13px",
          letterSpacing: "0.01em",
        }}
      >
        {address.slice(0, 6)}…{address.slice(-4)}
      </div>
    );
  }

  // Not MiniPay (or still connecting) — show RainbowKit button as normal.
  return <ConnectButton showBalance={false} chainStatus="icon" />;
}

export function ConnectControl() {
  const { chain, isMiniPay } = useChain();
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      {!isMiniPay && <ChainSwitcher />}
      {chain === "celo" && <TokenSwitcher />}
      {chain === "stacks" ? (
        <StacksConnectButton />
      ) : (
        <CeloConnectButton />
      )}
    </div>
  );
}
