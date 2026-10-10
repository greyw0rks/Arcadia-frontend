"use client";

import { useEffect, useState } from "react";

// Runtime config served by the backend (GET /api/config). `playMode` decides whether the UI runs the
// free XP flow (no stake, no settle) or the paid staking flow. Fail-safe to "free" if the fetch
// fails — the free experience never touches the wallet for money, so it's the safe default.

export type PlayMode = "free" | "stake";

export interface AppConfig {
  playMode: PlayMode;
  xp: { perCorrect: number; completionBonus: number };
}

const FALLBACK: AppConfig = {
  playMode: "free",
  xp: { perCorrect: 10, completionBonus: 50 },
};

export function useAppConfig(): AppConfig | null {
  const [config, setConfig] = useState<AppConfig | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/api/config")
      .then((r) => r.json())
      .then((d: Partial<AppConfig>) => {
        if (!alive) return;
        setConfig({
          playMode: d.playMode === "stake" ? "stake" : "free",
          xp: {
            perCorrect: Number(d.xp?.perCorrect ?? FALLBACK.xp.perCorrect),
            completionBonus: Number(d.xp?.completionBonus ?? FALLBACK.xp.completionBonus),
          },
        });
      })
      .catch(() => {
        if (alive) setConfig(FALLBACK);
      });
    return () => {
      alive = false;
    };
  }, []);
  return config;
}
