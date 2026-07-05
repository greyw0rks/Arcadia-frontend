"use client";

// Direct Stacks wallet connection via window.StacksProvider (SIP-030 / WBIPs).
// Leather and Xverse both inject this provider. This avoids the @stacks/connect-ui
// web-component modal which breaks silently under Next.js 16 + Turbopack.

import { useCallback, useEffect, useState } from "react";
import { STACKS_NETWORK_NAME } from "./contract";

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const STORAGE_KEY = "arcadia:stacks:address";

function getProvider(): any | null {
  if (typeof window === "undefined") return null;
  return (window as any).StacksProvider ?? (window as any).LeatherProvider ?? null;
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
