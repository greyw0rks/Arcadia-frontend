"use client";

import { useCallback, useEffect, useState } from "react";

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const STORAGE_KEY = "arcadia:stacks:address";

// Return the first injected Stacks provider, trying known keys in safe order.
// window.StacksProvider is checked last because inpage.js extension conflicts
// can leave it in a broken state while LeatherProvider / leather remain intact.
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
    // ignore redefine errors from extension conflicts
  }
  return null;
}

function pickStxAddress(res: any): string | null {
  const addrs: any[] = res?.result?.addresses ?? res?.addresses ?? [];
  return (
    addrs.find(
      (a: any) =>
        a?.address?.startsWith("S") && (!a?.symbol || a?.symbol === "STX")
    )?.address ?? null
  );
}

export function useStacksWallet(): StacksWallet {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) setAddress(cached);
  }, []);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      window.open("https://leather.io/install-extension", "_blank");
      return;
    }
    try {
      const res = await provider.request({ method: "getAddresses" });
      const addr = pickStxAddress(res);
      if (addr) {
        localStorage.setItem(STORAGE_KEY, addr);
        setAddress(addr);
      } else {
        console.error("[Stacks] no STX address in response:", res);
      }
    } catch (err) {
      console.error("[Stacks] connect failed:", err);
    }
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
  }, []);

  return { address, isConnected: !!address, connect, disconnect };
}
