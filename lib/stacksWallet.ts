"use client";

import { useCallback, useEffect, useState } from "react";

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  noWallet: boolean; // true when no working Stacks provider is found
}

const STORAGE_KEY = "arcadia:stacks:address";

// Test whether a provider's request() is real by calling it.
// Returns the provider if usable, null if it throws "not implemented".
// NOTE: request() may throw SYNCHRONOUSLY, so we must use try/catch, not .catch().
function testProvider(p: any): any | null {
  if (!p || typeof p.request !== "function") return null;
  try {
    // A real provider returns a Promise; a stub throws synchronously.
    const ret = p.request({ method: "getAddresses" });
    // If we got here without throwing, the provider is real — return it.
    // The returned promise may still reject (e.g. user cancelled), but that's fine.
    if (ret && typeof ret.then === "function") return p;
    return null;
  } catch (e: any) {
    // Stub throws "request function is not implemented" or similar.
    return null;
  }
}

function getProvider(): any | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return (
    testProvider(w.LeatherProvider) ??
    testProvider(w.XverseProviders?.StacksProvider) ??
    testProvider(w.StacksProvider) ??
    null
  );
}

// Safely call provider.request — handles both sync throws and async rejections.
async function safeRequest(provider: any, method: string): Promise<any> {
  try {
    return await Promise.resolve(provider.request({ method }));
  } catch {
    return null;
  }
}

function pickStxAddress(res: any): string | null {
  if (!res) return null;
  const addrs: any[] =
    res?.result?.addresses ?? res?.addresses ?? [];
  const stx = addrs.find(
    (a: any) => a?.symbol === "STX" || a?.address?.startsWith("S")
  );
  return stx?.address ?? null;
}

export function useStacksWallet(): StacksWallet {
  const [address, setAddress] = useState<string | null>(null);
  const [noWallet, setNoWallet] = useState(false);

  useEffect(() => {
    // Restore cached address on mount.
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) setAddress(cached);

    // Check if any working provider exists.
    const p = getProvider();
    if (!p && !cached) setNoWallet(true);
  }, []);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setNoWallet(true);
      window.open("https://leather.io/install-extension", "_blank");
      return;
    }
    setNoWallet(false);
    const res = await safeRequest(provider, "getAddresses");
    const addr = pickStxAddress(res);
    if (addr) {
      localStorage.setItem(STORAGE_KEY, addr);
      setAddress(addr);
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
    setNoWallet(false);
  }, []);

  return { address, isConnected: !!address, connect, disconnect, noWallet };
}
