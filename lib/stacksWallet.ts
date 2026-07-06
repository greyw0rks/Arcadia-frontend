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

type WalletType = "leather" | "xverse" | "generic";

type DetectedProvider = {
  provider: any;
  wallet: WalletType;
};

function getProvider(): DetectedProvider | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  // Check Leather first — its window.StacksProvider injection may conflict
  // with other extensions (inpage.js redefine error), so prefer the named key.
  if (typeof w.LeatherProvider?.request === "function")
    return { provider: w.LeatherProvider, wallet: "leather" };
  if (typeof w.leather?.request === "function")
    return { provider: w.leather, wallet: "leather" };
  if (typeof w.XverseProviders?.StacksProvider?.request === "function")
    return { provider: w.XverseProviders.StacksProvider, wallet: "xverse" };
  try {
    if (typeof w.StacksProvider?.request === "function")
      return { provider: w.StacksProvider, wallet: "generic" };
  } catch {
    // ignore redefine conflict errors from extension injection
  }
  return null;
}

async function fetchStxAddress(detected: DetectedProvider): Promise<string | null> {
  const { provider, wallet } = detected;

  if (wallet === "leather") {
    // Leather API: request(methodName) — plain string, no wrapper object.
    // Docs: https://leather.gitbook.io/developers/methods/getaddresses
    const res = await provider.request("getAddresses");
    return (
      (res?.result?.addresses as any[])?.find((a: any) => a?.symbol === "STX")
        ?.address ?? null
    );
  }

  if (wallet === "xverse") {
    // Xverse Stacks API: request("stx_getAccounts", {})
    // Docs: https://docs.xverse.app/sats-connect/stacks-methods/stx_getaccounts
    // Returns { status: "success", result: [{ address, publicKey, network }] }
    const res = await provider.request("stx_getAccounts", {});
    if (res?.status === "success") {
      const accounts: any[] = Array.isArray(res.result) ? res.result : [];
      return (
        accounts.find(
          (a: any) => a?.network === "mainnet" && a?.address?.startsWith("S")
        )?.address ??
        accounts.find((a: any) => a?.address?.startsWith("S"))?.address ??
        null
      );
    }
    return null;
  }

  // Generic: unknown wallet — try both conventions and collect addresses
  // from whichever format succeeds.
  const attempts: Array<() => Promise<any>> = [
    () => provider.request("getAddresses"),
    () => provider.request({ method: "getAddresses" }),
    () => provider.request("stx_getAccounts", {}),
  ];

  for (const attempt of attempts) {
    try {
      const res = await attempt();
      // Try Leather-style response
      const leather = (res?.result?.addresses as any[])?.find(
        (a: any) => a?.symbol === "STX"
      )?.address;
      if (leather) return leather;
      // Try Xverse-style response
      const xverse = (Array.isArray(res?.result) ? res.result : []).find(
        (a: any) => a?.address?.startsWith("S")
      )?.address;
      if (xverse) return xverse;
      // Try flat array
      const flat = (res?.addresses as any[])?.find((a: any) =>
        a?.address?.startsWith("S")
      )?.address;
      if (flat) return flat;
    } catch {
      // try next
    }
  }

  return null;
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
    const detected = getProvider();

    if (!detected) {
      window.open("https://leather.io/install-extension", "_blank");
      return;
    }

    try {
      const addr = await fetchStxAddress(detected);
      if (addr) {
        localStorage.setItem(STORAGE_KEY, addr);
        setAddress(addr);
      } else {
        const msg = "No STX address returned by wallet";
        setError(msg);
        console.error("[Stacks]", msg);
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
