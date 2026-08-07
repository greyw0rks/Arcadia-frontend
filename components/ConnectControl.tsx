"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useConnect, usePublicClient } from "wagmi";
import { injected } from "wagmi/connectors";
import { useChain } from "../lib/chainContext";
import { CELO_TOKENS, celoTokenMeta, type CeloToken } from "../lib/contract";
import { ERC20_ABI } from "../lib/abi";
import { isMiniPay } from "../lib/useArcade";

export function TokenSwitcher() {
  const { token, setToken } = useChain();
  const ids = Object.keys(CELO_TOKENS) as CeloToken[];
  return (
    <div className="token-switcher">
      {ids.map((id) => (
        <button key={id} onClick={() => setToken(id)} aria-pressed={token === id}>
          {CELO_TOKENS[id].label}
        </button>
      ))}
    </div>
  );
}

export function ConnectControl() {
  const { connect } = useConnect();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { setToken } = useChain();
  const [inMiniPay, setInMiniPay] = useState(false);

  // MiniPay requires zero-click connect: auto-connect and hide the connect button.
  useEffect(() => {
    if (isMiniPay()) {
      setInMiniPay(true);
      connect({ connector: injected() });
    }
  }, [connect]);

  // Default to whichever stablecoin the player actually holds the most of.
  useEffect(() => {
    if (!inMiniPay || !address || !publicClient) return;
    const tokens = Object.keys(CELO_TOKENS) as CeloToken[];
    Promise.all(
      tokens.map(async (t) => {
        const { tokenAddress } = celoTokenMeta(t);
        const balance = (await publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address],
        })) as bigint;
        return { token: t, balance };
      })
    ).then((balances) => {
      const best = balances.reduce((a, b) => (a.balance >= b.balance ? a : b));
      if (best.balance > 0n) setToken(best.token);
    });
  }, [inMiniPay, address, publicClient, setToken]);

  return (
    <div className="connect-control">
      <TokenSwitcher />
      {!inMiniPay && <ConnectButton showBalance={false} chainStatus="icon" />}
    </div>
  );
}
