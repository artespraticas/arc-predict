"use client";

import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { ARC_TESTNET } from "@/lib/contract";
import "@rainbow-me/rainbowkit/styles.css";

const arcChain = {
  ...ARC_TESTNET,
  iconUrl: "https://www.circle.com/hubfs/Brand/Circle-icon-RGB.svg",
} as const;

const config = createConfig({
  chains: [arcChain],
  transports: {
    [ARC_TESTNET.id]: http("https://rpc.testnet.arc.network"),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#00E5FF",
            accentColorForeground: "#080B14",
            borderRadius: "small",
            fontStack: "system",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
