"use client";

import { useRouter } from "next/navigation";
import { ConnectControl } from "../../components/ConnectControl";
import { BottomNav } from "../../components/BottomNav";

export default function TournamentPage() {
  const router = useRouter();

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

      <div className="panel center">
        <h1 style={{ fontSize: "clamp(28px, 9vw, 44px)", marginBottom: 16 }}>🏆 Tournament</h1>
        <span className="badge soon">Coming soon</span>
        <p className="muted" style={{ marginTop: 20, maxWidth: 460, marginInline: "auto" }}>
          Weekly tournaments are not live yet. Keep playing — your games will count
          towards the leaderboard when they open.
        </p>
        <button
          className="btn"
          onClick={() => router.push("/games")}
          style={{ marginTop: 28 }}
        >
          Back to games
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
