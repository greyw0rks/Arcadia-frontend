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
    import("@stacks/connect").then((mod) => {
      modRef.current = mod;
      const appConfig = new mod.AppConfig(["store_write"]);
      const userSession = new mod.UserSession({ appConfig });
      sessionRef.current = userSession;
      console.log("[stacksWallet] module loaded, session ready");

      if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn().then(() => {
          setAddress(getAddress(userSession));
        });
      } else {
        setAddress(getAddress(userSession));
      }
    }).catch((e) => {
      console.error("[stacksWallet] failed to load @stacks/connect:", e);
    });
  }, []);

  function getAddress(userSession: any): string | null {
    if (!userSession.isUserSignedIn()) return null;
    const data = userSession.loadUserData();
    return STACKS_NETWORK_NAME === "mainnet"
      ? data.profile.stxAddress.mainnet
      : data.profile.stxAddress.testnet;
  }

  const connect = useCallback(() => {
    console.log("[stacksWallet] connect clicked, mod:", !!modRef.current, "session:", !!sessionRef.current);
    const mod = modRef.current;
    const userSession = sessionRef.current;
    if (!mod || !userSession) {
      console.error("[stacksWallet] module not loaded yet — cannot open popup");
      return;
    }
    console.log("[stacksWallet] calling showConnect...");
    mod.showConnect({
      userSession,
      appDetails: {
        name: "QuizArcade",
        icon: typeof window !== "undefined"
          ? `${window.location.origin}/favicon.ico`
          : "/favicon.ico",
      },
      onFinish: () => {
        console.log("[stacksWallet] connected!");
        setAddress(getAddress(userSession));
      },
    });
  }, []);

  const disconnect = useCallback(() => {
    const userSession = sessionRef.current;
    if (!userSession) return;
    userSession.signUserOut();
    setAddress(null);
  }, []);

  return { address, isConnected: !!address, connect, disconnect };
}
