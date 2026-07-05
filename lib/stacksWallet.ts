"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export function useStacksWallet(): StacksWallet {
  const [address, setAddress] = useState<string | null>(null);
  const modRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;

    // 1. Register the web component early so it's ready before any connect() call.
    import("@stacks/connect-ui/loader")
      .then(({ defineCustomElements }) => defineCustomElements(window))
      .catch(() => {});

    // 2. Load the connect module and restore any saved address.
    import("@stacks/connect")
      .then((mod) => {
        if (cancelled) return;
        modRef.current = mod;
        const data = mod.getLocalStorage();
        const stxAddr = data?.addresses?.stx?.[0]?.address ?? null;
        if (stxAddr) setAddress(stxAddr);
      })
      .catch((err) => console.error("[Stacks] module load failed:", err));

    return () => { cancelled = true; };
  }, []);

  const connect = useCallback(async () => {
    const mod = modRef.current;
    if (!mod) {
      console.warn("[Stacks] module not ready");
      return;
    }
    try {
      // request('getAddresses') uses the installed wallet directly (native popup).
      // Falls back to the connect-modal picker when no wallet is pre-selected.
      const result = await mod.request("getAddresses");
      const stxAddr =
        result?.addresses?.find((a: any) => a?.address?.startsWith("S"))
          ?.address ?? null;
      if (stxAddr) setAddress(stxAddr);
      else console.warn("[Stacks] no STX address in response:", result);
    } catch (err) {
      console.error("[Stacks] connect failed:", err);
    }
  }, []);

  const disconnect = useCallback(() => {
    modRef.current?.disconnect();
    setAddress(null);
  }, []);

  return {
    address,
    isConnected: !!address,
    connect,
    disconnect,
  };
}
