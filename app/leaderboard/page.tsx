"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectControl } from "../../components/ConnectControl";
import { BottomNav } from "../../components/BottomNav";

interface XpLeader {
  rank: number;
  address: string;
  username?: string | null;
  avatar?: string | null;
  points: number;
  games: number;
}

const shortAddr = (a: string) =>
  a.startsWith("0x") ? `${a.slice(0, 6)}...${a.slice(-4)}` : `${a.slice(0, 8)}...${a.slice(-6)}`;

export default function LeaderboardPage() {
  const router = useRouter();
  const { address } = useAccount();
  const [leaders, setLeaders] = useState<XpLeader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetch("/api/xp/leaderboard?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setLeaders(d.leaderboard ?? []);
      })
      .catch(() => {
        if (alive) setLeaders([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const me = address ? leaders.find((l) => l.address.toLowerCase() === address.toLowerCase()) : null;

  return (
    <div className="container">
      <div className="topbar compact">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            className="btn ghost back-btn"
            onClick={() => router.push("/games")}
            style={{ padding: "12px 16px", fontSize: "20px" }}
            title="Back to games"
          >
            ←
          </button>
          <div className="brand" style={{ cursor: "pointer" }} onClick={() => router.push("/games")}>
            Arcadia
          </div>
        </div>
        <ConnectControl />
      </div>

      <div className="hero" style={{ marginTop: 24 }}>
        <h1>XP Leaderboard</h1>
        <p className="tagline">
          Every correct answer and every finished round earns XP. Keep playing to climb the ranks.
        </p>
      </div>

      {me && (
        <div className="panel" style={{ marginBottom: 24 }}>
          <div className="row tight">
            <span style={{ fontWeight: 900 }}>Your rank: #{me.rank}</span>
            <span className="up" style={{ fontWeight: 900, fontSize: 20 }}>
              {me.points} XP
            </span>
          </div>
          <p className="muted" style={{ marginTop: 4, fontSize: 13 }}>
            {me.games} game{me.games === 1 ? "" : "s"} played
          </p>
        </div>
      )}

      <div className="panel">
        {loading ? (
          <p className="muted center">Loading leaderboard…</p>
        ) : leaders.length === 0 ? (
          <p className="muted center">No players yet — be the first to earn XP.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {leaders.map((l) => {
              const isMe = address && l.address.toLowerCase() === address.toLowerCase();
              return (
                <div
                  key={l.address}
                  onClick={() => router.push(`/profile/${l.address}`)}
                  className="row tight"
                  style={{
                    cursor: "pointer",
                    padding: "14px 16px",
                    background: isMe ? "var(--accent)" : "var(--card)",
                    border: "4px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                    <span
                      style={{
                        fontWeight: 900,
                        fontSize: 18,
                        minWidth: 36,
                        textAlign: "center",
                      }}
                    >
                      {l.rank <= 3 ? ["🥇", "🥈", "🥉"][l.rank - 1] : `#${l.rank}`}
                    </span>
                    <span style={{ fontSize: 28 }}>{l.avatar || "👤"}</span>
                    <span
                      style={{
                        fontWeight: 700,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {l.username || shortAddr(l.address)}
                    </span>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div className="up" style={{ fontWeight: 900, fontSize: 18 }}>
                      {l.points} XP
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {l.games} game{l.games === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
