"use client";

// @stacks/connect v8: showConnect/AppConfig/UserSession removed.
// New API: connect() (async), disconnect(), isConnected(), getLocalStorage().
//
// IMPORTANT: connect() must be called synchronously within a user gesture (click
// handler). Pre-load the module in useEffect so the click handler can call
// mod.connect() immediately — no await import() gap that would lose the gesture.

import { useCallback, useEffect, useRef, useState } from "react";

type ConnectMod = typeof import("@stacks/connect");

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

function readAddress(mod: ConnectMod): string | null {
  try {
    if (!mod.isConnected()) return null;
    const data = mod.getLocalStorage();
    return data?.addresses?.stx?.[0]?.address ?? null;
  } catch {
    return null;
  }
}

export function useStacksWallet(): StacksWallet {
  const [address, setAddress] = useState<string | null>(null);
  const modRef = useRef<ConnectMod | null>(null);

  // Pre-load module on mount so connect() can fire synchronously from click.
  // defineCustomElements() must run before connect() or the wallet-picker web
  // component is never registered and the modal silently never appears.
  useEffect(() => {
    Promise.all([
      import("@stacks/connect"),
      import("@stacks/connect-ui/loader").then((m) => m.defineCustomElements(window)),
    ])
      .then(([mod]) => {
        modRef.current = mod;
        setAddress(readAddress(mod));
      })
      .catch(() => {});
  }, []);

  // Called synchronously from click — no await before mod.connect() so the
  // browser preserves the user-gesture context for wallet popup/modal.
  const connect = useCallback(() => {
    const mod = modRef.current;
    if (!mod) return;
    mod
      .connect({ forceWalletSelect: true } as any)
      .then(() => setAddress(readAddress(mod)))
      .catch((err: unknown) => console.error("[Stacks] connect error:", err));
  }, []);

  const disconnect = useCallback(() => {
    const mod = modRef.current;
    if (!mod) return;
    try {
      mod.disconnect();
    } catch {}
    setAddress(null);
  }, []);

  return { address, isConnected: !!address, connect, disconnect };
}
