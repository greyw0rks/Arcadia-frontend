"use client";

import { useCallback, useEffect, useState } from "react";

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  error: string | null;
}

const STORAGE_KEY = "arcadia:stacks:address";

// Return the first injected Stacks provider found in the window.
// LeatherProvider / leather are checked first because window.StacksProvider
// can be corrupted by extension conflicts (inpage.js TypeError).
function getProvider(): any | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  if (typeof w.LeatherProvider?.request === "function") return w.LeatherProvider;
  if (typeof w.leather?.request === "function") return w.leather;
  if (typeof w.XverseProviders?.StacksProvider?.request === "function")
    return w.XverseProviders.StacksProvider;
  try {
    if (typeof w.StacksProvider?.request === "function") return w.StacksProvider;
  } catch {
    // ignore redefine conflict errors
  }
  return null;
}

function pickStxAddress(res: any): string | null {
  // Leather: { result: { addresses: [{ symbol, address, publicKey, ... }] } }
  const addrs: any[] = res?.result?.addresses ?? res?.addresses ?? [];
  return (
    addrs.find((a: any) => a?.symbol === "STX" || a?.address?.startsWith("S"))
      ?.address ?? null
  );
}

export function useStacksWallet(): StacksWallet {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) setAddress(cached);
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    const provider = getProvider();

    if (!provider) {
      window.open("https://leather.io/install-extension", "_blank");
      return;
    }

    try {
      // Leather API: request(methodName) — plain string, not { method: "..." }
      const res = await provider.request("getAddresses");
      const addr = pickStxAddress(res);
      if (addr) {
        localStorage.setItem(STORAGE_KEY, addr);
        setAddress(addr);
      } else {
        const msg = "No STX address in response";
        setError(msg);
        console.error("[Stacks]", msg, res);
      }
    } catch (err: any) {
      const msg = err?.error?.message ?? err?.message ?? String(err);
      setError(msg);
      console.error("[Stacks] connect failed:", err);
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
    setError(null);
  }, []);

  return { address, isConnected: !!address, connect, disconnect, error };
}
