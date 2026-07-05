"use client";

import { useCallback, useEffect, useState } from "react";

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  noWallet: boolean;
}

const STORAGE_KEY = "arcadia:stacks:address";

// Provider detection — check function existence ONLY.
// Never call request() here; every call sends a real message to the wallet.
function getProvider(): any | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  if (typeof w.LeatherProvider?.request === "function")              return w.LeatherProvider;
  if (typeof w.XverseProviders?.StacksProvider?.request === "function") return w.XverseProviders.StacksProvider;
  if (typeof w.StacksProvider?.request === "function")               return w.StacksProvider;
  return null;
}

function pickStxAddress(res: any): string | null {
  const addrs: any[] = res?.result?.addresses ?? res?.addresses ?? [];
  return addrs.find((a: any) => a?.symbol === "STX" || a?.address?.startsWith("S"))?.address ?? null;
}

export function useStacksWallet(): StacksWallet {
  const [address, setAddress]   = useState<string | null>(null);
  const [noWallet, setNoWallet] = useState(false);

  useEffect(() => {
    // Restore cached address — no wallet request needed on mount.
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) { setAddress(cached); return; }
    // Only flag noWallet if provider check on mount shows nothing.
    if (!getProvider()) setNoWallet(true);
  }, []);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setNoWallet(true);
      window.open("https://leather.io/install-extension", "_blank");
      return;
    }
    setNoWallet(false);
    try {
      // request() may throw synchronously (stub) or return a rejected Promise.
      // Wrapping in Promise.resolve handles both.
      const res = await Promise.resolve(provider.request({ method: "getAddresses" }));
      const addr = pickStxAddress(res);
      if (addr) { localStorage.setItem(STORAGE_KEY, addr); setAddress(addr); }
    } catch {
      // Wallet rejected or user cancelled — do nothing.
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
    setNoWallet(false);
  }, []);

  return { address, isConnected: !!address, connect, disconnect, noWallet };
}
