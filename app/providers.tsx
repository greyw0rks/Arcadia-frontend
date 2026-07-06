"use client";

import { ReactNode, useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig, stacksWagmiConfig } from "../lib/wagmi";
import { ChainProvider } from "../lib/chainContext";
import { LOCKED_CHAIN } from "../lib/contract";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // On the Stacks deployment, use a no-connector wagmi config and skip
  // RainbowKitProvider entirely — no EVM wallet scanning, no interference
  // with window.StacksProvider from Leather/Xverse extensions.
  // WagmiProvider itself must stay to satisfy wagmi hooks used across pages.
  if (LOCKED_CHAIN === "stacks") {
    return (
      <ChainProvider>
        <WagmiProvider config={stacksWagmiConfig}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </WagmiProvider>
      </ChainProvider>
    );
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
