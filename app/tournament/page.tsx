"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectControl } from "../../components/ConnectControl";
import { BottomNav } from "../../components/BottomNav";

interface TournamentEntry {
  rank: number;
  address: string;
  unit: string;
  qualifyingGames: number;
  wins: number;
  winRate: number;
  totalStaked: number;
  totalWinnings: number;
  netProfit: number;
  eligible: boolean;
}

interface TournamentData {
  weekStartMs: number;
  weekEndMs: number;
  prizePoolUsd: number;
  leaderboard: TournamentEntry[];
  viewerEntry: TournamentEntry | null;
}

function shortAddr(addr: string): string {
  if (addr.startsWith("0x")) return addr.slice(0, 6) + "…" + addr.slice(-4);
  if (addr.length > 16) return addr.slice(0, 8) + "…" + addr.slice(-6);
  return addr;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "ended";
  const s = Math.floor(ms / 1000);
  const days = Math.floor(s / 86400);
  const hrs = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (days > 0) return `${days}d ${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  return `${mins}m ${secs}s`;
}

const RULES = [
  "Play on medium difficulty or higher — stake ≥ $0.50",
  "Maintain a 95%+ win rate across all qualifying games this week",
  "Up to 20 qualifying games count per week — first 20 by time",
  "All tokens count: USDm, USDC, and USDT games all contribute",
  "Prize pool split among all eligible players at week end",
];

export default function TournamentPage() {
  const router = useRouter();
  const { address } = useAccount();

  const [data, setData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  const load = useCallback(async () => {
    try {
      const url = address ? `/api/tournament?viewer=${address}` : "/api/tournament";
      const res = await fetch(url);
      if (!res.ok) throw new Error(await res.text());
      setData(await res.json());
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => { load(); }, [load]);

  // Countdown tick
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeLeft = data ? data.weekEndMs - now : 0;

  return (
    <div className="container">
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            className="btn ghost"
            onClick={() => router.back()}
            style={{ padding: "12px 16px", fontSize: 20 }}
            title="Back"
          >
            ←
          </button>
          <div className="brand" style={{ cursor: "pointer" }} onClick={() => router.push("/games")}>
            Arcadia
          </div>
        </div>
        <ConnectControl />
      </div>

      <div className="panel center mobile-only">
        <h1 style={{ fontSize: "clamp(28px, 9vw, 40px)", marginBottom: 12 }}>🏆 Tournament</h1>
        <span className="badge soon">Coming soon</span>
        <p className="muted" style={{ marginTop: 16 }}>
          Weekly tournaments are not live yet. Keep playing — your games will count when they open.
        </p>
      </div>

      <div className="desktop-only-block">
      <div className="hero">
        <h1>🏆 Weekly Tournament</h1>
        <div className="row">
          <div>
            <div style={{ fontSize: "clamp(40px, 12vw, 64px)", fontWeight: 900, lineHeight: 1 }}>
              ${data?.prizePoolUsd ?? 50}
            </div>
            <p className="tagline" style={{ marginBottom: 0 }}>
              Prize pool — distributed weekly
            </p>
          </div>
          <div className="mechanic">
            <span>{data ? formatCountdown(timeLeft) : "--:--"}</span>
            <span>·</span>
            <span>until Monday UTC reset</span>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2 style={{ fontSize: "clamp(20px, 6vw, 28px)", marginBottom: 20 }}>How to qualify</h2>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
          {RULES.map((rule) => (
            <li key={rule} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ color: "var(--accent)", flexShrink: 0 }}>▸</span>
              <span className="muted">{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      {address && data && (
        <div className="panel">
          <h2 style={{ fontSize: "clamp(18px, 5vw, 24px)", marginBottom: 16 }}>Your status this week</h2>
          {data.viewerEntry ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
              <span style={{ fontSize: 28, fontWeight: 900 }}>#{data.viewerEntry.rank}</span>
              <span className={`badge ${data.viewerEntry.eligible ? "live" : "soon"}`}>
                {data.viewerEntry.eligible ? "Eligible" : "Not eligible"}
              </span>
              <span className="muted">
                {data.viewerEntry.qualifyingGames} games · {data.viewerEntry.wins} wins ·{" "}
                {data.viewerEntry.winRate}% win rate
              </span>
              {!data.viewerEntry.eligible && (
                <span className="muted">
                  Need{" "}
                  {Math.max(
                    0,
                    Math.ceil(data.viewerEntry.qualifyingGames * 0.95) - data.viewerEntry.wins
                  )}{" "}
                  more win{data.viewerEntry.wins === 0 ? "s" : ""} to reach 95%
                </span>
              )}
            </div>
          ) : (
            <p className="muted">
              No qualifying games yet this week. Play on medium difficulty or higher to appear here.
            </p>
          )}
        </div>
      )}

      <h2 style={{ fontSize: "clamp(20px, 6vw, 28px)", margin: "40px 0 20px" }}>Leaderboard</h2>

      {loading && <div className="panel center"><p className="muted">Loading…</p></div>}
      {error && <div className="panel center"><p className="error">{error}</p></div>}
      {!loading && !error && data && data.leaderboard.length === 0 && (
        <div className="panel center">
          <p className="muted">
            No games yet this week.<br />Be the first to play and claim the top spot.
          </p>
        </div>
      )}

      {!loading && !error && data && data.leaderboard.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th className="hide-sm">Games</th>
                <th>Win Rate</th>
                <th>Winnings</th>
                <th className="hide-sm">Net Profit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.leaderboard.map((e) => {
                const isViewer = address && e.address.toLowerCase() === address.toLowerCase();
                return (
                  <tr
                    key={e.address}
                    className={isViewer ? "is-viewer" : ""}
                    style={{ cursor: "pointer" }}
                    onClick={() => router.push(`/profile/${e.address}`)}
                  >
                    <td style={{ fontSize: 18, fontWeight: 900 }}>
                      {e.rank === 1 ? "🥇" : e.rank === 2 ? "🥈" : e.rank === 3 ? "🥉" : `#${e.rank}`}
                    </td>
                    <td>
                      {shortAddr(e.address)}
                      {isViewer && (
                        <span style={{ marginLeft: 6, fontSize: 11, color: "var(--accent)" }}>you</span>
                      )}
                    </td>
                    <td className="hide-sm">{e.qualifyingGames} / 20</td>
                    <td style={{ color: e.winRate >= 95 ? "var(--green)" : "var(--text)" }}>
                      {e.winRate}%
                    </td>
                    <td>{e.totalWinnings.toFixed(2)} {e.unit}</td>
                    <td
                      className="hide-sm"
                      style={{ color: e.netProfit >= 0 ? "var(--green)" : "var(--red)" }}
                    >
                      {e.netProfit >= 0 ? "+" : ""}{e.netProfit.toFixed(2)} {e.unit}
                    </td>
                    <td>
                      <span
                        className="badge sm"
                        style={{ background: e.eligible ? "var(--green)" : "var(--bg-alt)" }}
                      >
                        {e.eligible ? "✓" : "✗"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      </div>

      <BottomNav />
    </div>
  );
}
