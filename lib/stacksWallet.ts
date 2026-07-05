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
    // Pre-load @stacks/connect so connect() is available synchronously on click.
    // Also restores any address already in localStorage from a prior session.
    import("@stacks/connect").then((mod) => {
      modRef.current = mod;
      const data = mod.getLocalStorage();
      const stxAddr =
        data?.addresses?.stx?.[0]?.address ??
        data?.addresses?.stx?.[1]?.address ??
        null;
      if (stxAddr) setAddress(stxAddr);
    }).catch(() => {});
  }, []);

  const connect = useCallback(async () => {
    const mod = modRef.current;
    if (!mod) return;
    try {
      const result = await mod.connect();
      // Prefer the first address that starts with "S" (mainnet STX).
      const stxAddr =
        result?.addresses?.find((a: any) => a?.address?.startsWith("S"))
          ?.address ?? null;
      if (stxAddr) setAddress(stxAddr);
    } catch {
      // User cancelled or wallet rejected — do nothing.
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
