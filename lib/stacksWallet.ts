"use client";

// @stacks/connect v8 migration notes:
//   showConnect / AppConfig / UserSession → removed
//   connect()       — async, opens wallet modal, caches addresses in localStorage
//   disconnect()    — clears localStorage cache
//   isConnected()   — checks localStorage for a cached address
//   getLocalStorage() — { addresses: { stx: [{address, ...}], btc: [...] } }

import { useCallback, useEffect, useState } from "react";

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

function getCachedStxAddress(mod: any): string | null {
  const data = mod.getLocalStorage?.();
  return data?.addresses?.stx?.[0]?.address ?? null;
}

export function useStacksWallet(): StacksWallet {
  const [address, setAddress] = useState<string | null>(null);

  // Restore cached connection on mount.
  useEffect(() => {
    import("@stacks/connect")
      .then((mod) => {
        if (mod.isConnected()) setAddress(getCachedStxAddress(mod));
      })
      .catch(() => {});
  }, []);

  const connect = useCallback(async () => {
    try {
      const mod = await import("@stacks/connect");
      await mod.connect({
        appDetails: {
          name: "Arcadia",
          icon: typeof window !== "undefined"
            ? `${window.location.origin}/favicon.ico`
            : "/favicon.ico",
        } as any, // appDetails accepted at runtime but not in current type defs
      } as any);
      // After connect(), addresses are cached in localStorage via the library.
      setAddress(getCachedStxAddress(mod));
    } catch {
      // User cancelled or no wallet installed — stay disconnected.
    }
  }, []);

  const disconnect = useCallback(() => {
    import("@stacks/connect")
      .then((mod) => {
        mod.disconnect();
        setAddress(null);
      })
      .catch(() => {});
  }, []);

  return { address, isConnected: !!address, connect, disconnect };
}
