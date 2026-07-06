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
  // stx_requestAccounts returns { result: [{ address, publicKey }] }
  // getAddresses returns { result: { addresses: [...] } } or { addresses: [...] }
  const flat: any[] =
    res?.result?.addresses ??
    res?.addresses ??
    (Array.isArray(res?.result) ? res.result : []);
  return (
    flat.find(
      (a: any) =>
        a?.address?.startsWith("S") && (!a?.symbol || a?.symbol === "STX")
    )?.address ?? null
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

    // Try stx_requestAccounts first — this is the method that triggers the
    // wallet permission popup on domains the user hasn't connected yet.
    // Fall back to getAddresses for wallets that don't implement the former.
    const methods = ["stx_requestAccounts", "getAddresses"];
    let lastErr: any;

    for (const method of methods) {
      try {
        const res = await provider.request({ method });
        const addr = pickStxAddress(res);
        if (addr) {
          localStorage.setItem(STORAGE_KEY, addr);
          setAddress(addr);
          return;
        }
      } catch (err) {
        lastErr = err;
        // try next method
      }
    }

    const msg = lastErr?.message ?? lastErr?.toString() ?? "No STX address returned";
    setError(msg);
    console.error("[Stacks] connect failed:", lastErr ?? "no address");
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
    setError(null);
  }, []);

  return { address, isConnected: !!address, connect, disconnect, error };
}
