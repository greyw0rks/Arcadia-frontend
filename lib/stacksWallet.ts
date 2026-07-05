"use client";

// Direct Stacks wallet connection using the wallet provider globals.
//
// Provider priority:
//   1. window.LeatherProvider  — Leather's own namespace, always supports request()
//   2. window.XverseProviders?.StacksProvider — Xverse's explicit namespace
//   3. window.StacksProvider   — SIP-030 standard, BUT may be claimed by MetaMask's
//                                shim which throws "request not implemented"
//
// We try each in order and skip providers where request() throws synchronously.

import { useCallback, useEffect, useState } from "react";

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const STORAGE_KEY = "arcadia:stacks:address";

function getProvider(): any | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  // Leather's own global is the most reliable — always implements request().
  if (w.LeatherProvider?.request) return w.LeatherProvider;
  // Xverse's dedicated namespace.
  if (w.XverseProviders?.StacksProvider?.request) return w.XverseProviders.StacksProvider;
  // Generic SIP-030 — only use if request is a real function (not a stub).
  if (w.StacksProvider?.request && typeof w.StacksProvider.request === "function") {
    // Quick check: if the provider is MetaMask's stub it will throw synchronously.
    try { w.StacksProvider.request({ method: "__ping__" }); } catch (e: any) {
      if (e?.message?.includes("not implemented")) return null;
    }
    return w.StacksProvider;
  }
  return null;
}

function pickStxAddress(addresses: any[]): string | null {
  if (!Array.isArray(addresses)) return null;
  // SIP-030 format: [{ symbol: "STX", address: "SP..." }]
  const stx = addresses.find(
    (a: any) => a?.symbol === "STX" || a?.address?.startsWith("S")
  );
  return stx?.address ?? null;
}

export function useStacksWallet(): StacksWallet {
  const [address, setAddress] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });

  // Verify cached address is still valid on mount (wallet might have disconnected).
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return;
    const provider = getProvider();
    if (!provider) { localStorage.removeItem(STORAGE_KEY); setAddress(null); return; }
    // Silently re-request to confirm the wallet is still connected.
    provider.request({ method: "getAddresses" })
      .then((res: any) => {
        const addrs = res?.result?.addresses ?? res?.addresses ?? [];
        const addr = pickStxAddress(addrs);
        if (!addr || addr !== cached) { localStorage.removeItem(STORAGE_KEY); setAddress(null); }
      })
      .catch(() => { /* wallet locked / not responding — keep cached address */ });
  }, []);

  const connect = useCallback(() => {
    const provider = getProvider();
    if (!provider) {
      window.open("https://leather.io/install-extension", "_blank");
      return;
    }
    provider
      .request({ method: "getAddresses" })
      .then((res: any) => {
        const addrs = res?.result?.addresses ?? res?.addresses ?? [];
        const addr = pickStxAddress(addrs);
        if (addr) { localStorage.setItem(STORAGE_KEY, addr); setAddress(addr); }
      })
      .catch(() => {});
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
  }, []);

  return { address, isConnected: !!address, connect, disconnect };
}
