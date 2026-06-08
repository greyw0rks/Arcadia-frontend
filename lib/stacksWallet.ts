"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { STACKS_NETWORK_NAME } from "./contract";

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export function useStacksWallet(): StacksWallet {
  const [address, setAddress] = useState<string | null>(null);
  const modRef = useRef<any>(null);
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    // Pre-load @stacks/connect on mount so connect() can call showConnect
    // synchronously inside the click handler — browsers block popups that are
    // opened after an awaited import (the user-gesture context is gone by then).
    import("@stacks/connect").then((mod) => {
      modRef.current = mod;
      const { AppConfig, UserSession } = mod;
      const appConfig = new AppConfig(["store_write"]);
      const userSession = new UserSession({ appConfig });
      sessionRef.current = userSession;

      if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn().then(() => setAddress(getAddress(userSession)));
      } else {
        setAddress(getAddress(userSession));
      }
    }).catch(console.error);
  }, []);

  function getAddress(userSession: any): string | null {
    if (!userSession?.isUserSignedIn()) return null;
    const data = userSession.loadUserData();
    return STACKS_NETWORK_NAME === "mainnet"
      ? data.profile.stxAddress.mainnet
      : data.profile.stxAddress.testnet;
  }

  const connect = useCallback(() => {
    const mod = modRef.current;
    const userSession = sessionRef.current;
    if (!mod || !userSession) return;
    mod.showConnect({
      userSession,
      appDetails: {
        name: "QuizArcade",
        icon: typeof window !== "undefined"
          ? `${window.location.origin}/favicon.ico`
          : "/favicon.ico",
      },
      onFinish: () => setAddress(getAddress(userSession)),
    });
  }, []);

  const disconnect = useCallback(() => {
    sessionRef.current?.signUserOut();
    setAddress(null);
  }, []);

  return { address, isConnected: !!address, connect, disconnect };
}
