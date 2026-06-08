"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CELO_TOKENS, DEFAULT_CELO_TOKEN, type ChainId, type CeloToken } from "./contract";

// Holds the user's selected network (Celo / Stacks) and — when on Celo — the stake token
// (cUSD / USDC / USDT). The play flow, the header switcher, and the connect button all read from
// here. The token is a Celo sub-dimension that picks which QuizArcade instance the session stakes +
// settles against, and is persisted across reloads. The chain itself is intentionally NOT persisted:
// QuizArcade is a Celo-first product, so every fresh entry defaults to Celo. Switching to Stacks
// lasts for the session (survives client-side navigation) but resets to Celo on a full reload.
interface ChainContextValue {
  chain: ChainId;
  setChain: (c: ChainId) => void;
  token: CeloToken;
  setToken: (t: CeloToken) => void;
}

const ChainContext = createContext<ChainContextValue>({
  chain: "celo",
  setChain: () => {},
  token: DEFAULT_CELO_TOKEN,
  setToken: () => {},
});

const TOKEN_STORAGE_KEY = "quizarcade.celoToken";

function isCeloToken(v: unknown): v is CeloToken {
  return typeof v === "string" && v in CELO_TOKENS;
}

export function ChainProvider({ children }: { children: ReactNode }) {
  // Always start on Celo (the chain is not persisted — see note above).
  const [chain, setChainState] = useState<ChainId>("celo");
  const [token, setTokenState] = useState<CeloToken>(DEFAULT_CELO_TOKEN);

  // Hydrate the stake token from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (isCeloToken(savedToken)) setTokenState(savedToken);
  }, []);

  const setChain = (c: ChainId) => {
    setChainState(c);
  };

  const setToken = (t: CeloToken) => {
    setTokenState(t);
    window.localStorage.setItem(TOKEN_STORAGE_KEY, t);
  };

  return (
    <ChainContext.Provider value={{ chain, setChain, token, setToken }}>
      {children}
    </ChainContext.Provider>
  );
}

export function useChain() {
  return useContext(ChainContext);
}
