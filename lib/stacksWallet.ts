"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { STACKS_NETWORK_NAME } from "./contract";

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

// @stacks/connect v8 returns STX + BTC entries; pick the STX address for the configured network.
// Mainnet STX addresses start with "SP"/"SM", testnet with "ST"/"SN".
function pickStxAddress(getLocalStorage: () => any): string | null {
  const stx = getLocalStorage()?.addresses?.stx as { address: string }[] | undefined;
  if (!stx?.length) return null;
  const isTestnet = STACKS_NETWORK_NAME !== "mainnet";
  const re = isTestnet ? /^S[TN]/ : /^S[PM]/;
  return (stx.find((e) => re.test(e.address)) ?? stx[0]).address;
}

export function useStacksWallet(): StacksWallet {
  const [address, setAddress] = useState<string | null>(null);
  // Hold the individual v8 functions in refs. We destructure them at mount (rather than reaching
  // for them as properties on the module namespace later) so Turbopack keeps them in the dynamic
  // chunk — property access on a stored namespace gets tree-shaken away, which previously left
  // showConnect undefined at click time.
  const fns = useRef<{
    connect: (opts?: any) => Promise<any>;
    disconnect: () => void;
    getLocalStorage: () => any;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Pre-load @stacks/connect on mount so the click handler can fire connect() immediately.
    import("@stacks/connect")
      .then(({ connect, disconnect, getLocalStorage, isConnected }) => {
        if (cancelled) return;
        fns.current = { connect, disconnect, getLocalStorage };
        // Restore a previously-connected wallet (addresses are cached in localStorage by default).
        if (isConnected()) setAddress(pickStxAddress(getLocalStorage));
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  const connect = useCallback(() => {
    const api = fns.current;
    if (!api) return;
    // connect() opens the Stacks Connect wallet-select modal (forceWalletSelect) and resolves
    // once a wallet returns addresses. Rejection just means the user dismissed it — non-fatal.
    api
      .connect()
      .then(() => setAddress(pickStxAddress(api.getLocalStorage)))
      .catch((e) => console.error("[stacksWallet] connect cancelled/failed:", e));
  }, []);

  const disconnect = useCallback(() => {
    fns.current?.disconnect();
    setAddress(null);
  }, []);

  return { address, isConnected: !!address, connect, disconnect };
}
