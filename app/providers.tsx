"use client";

import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "../lib/wagmi";
import { ChainProvider } from "../lib/chainContext";
import { LOCKED_CHAIN } from "../lib/contract";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // On the Stacks deployment, don't mount Wagmi or RainbowKit at all.
  // Their wallet-detection code touches window.StacksProvider, which conflicts
  // with Leather/Xverse extension injection and breaks the Stacks connect flow.
  if (LOCKED_CHAIN === "stacks") {
    return <ChainProvider>{children}</ChainProvider>;
  }

  return (
    <ChainProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme({ accentColor: "#7c5cff", borderRadius: "medium" })}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ChainProvider>
  );
}
