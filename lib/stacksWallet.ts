"use client";
import { useCallback, useEffect, useState } from "react";
import { STACKS_NETWORK_NAME } from "./contract";

type StacksConnectModule = {
  AppConfig: any;
  UserSession: any;
  showConnect: any;
};

let _module: StacksConnectModule | null = null;

async function loadConnect(): Promise<StacksConnectModule> {
  if (_module) return _module;
  _module = await import("@stacks/connect") as any;
  return _module!;
}

function getSession(mod: StacksConnectModule) {
  const appConfig = new mod.AppConfig(["store_write"]);
  return new mod.UserSession({ appConfig });
}

function addressFromSession(userSession: any): string | null {
  if (!userSession.isUserSignedIn()) return null;
  const data = userSession.loadUserData();
  return STACKS_NETWORK_NAME === "mainnet"
    ? data.profile.stxAddress.mainnet
    : data.profile.stxAddress.testnet;
}

export interface StacksWallet {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

export function useStacksWallet(): StacksWallet {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    loadConnect().then(mod => {
      const userSession = getSession(mod);
      if (userSession.isSignInPending()) {
        userSession.handlePendingSignIn().then(() => setAddress(addressFromSession(userSession)));
      } else {
        setAddress(addressFromSession(userSession));
      }
    }).catch(() => {});
  }, []);

  const connect = useCallback(() => {
    loadConnect().then(mod => {
      const userSession = getSession(mod);
      mod.showConnect({
        userSession,
        appDetails: {
          name: "QuizArcade",
          icon: typeof window !== "undefined"
            ? `${window.location.origin}/favicon.ico`
            : "/favicon.ico",
        },
        onFinish: () => setAddress(addressFromSession(userSession)),
      });
    }).catch(() => {});
  }, []);

  const disconnect = useCallback(() => {
    loadConnect().then(mod => {
      const userSession = getSession(mod);
      userSession.signUserOut();
      setAddress(null);
    }).catch(() => {});
  }, []);

  return { address, isConnected: !!address, connect, disconnect };
}
