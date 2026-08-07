"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectControl } from "../../components/ConnectControl";
import { GameIcon } from "../../components/GameIcons";
import { TutorialModal } from "../../components/TutorialModal";
import { SocialLinks } from "../../components/SocialLinks";
import { BottomNav } from "../../components/BottomNav";

interface GameMeta {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  maxRounds: number;
  available: boolean;
}

export default function GamesPage() {
  const router = useRouter();
  const { address } = useAccount();
  const [games, setGames] = useState<GameMeta[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);
  // Ranked (the weekly pooled mode) is built but not open to players yet, so the toggle shows a
  // coming-soon panel instead of routing into /v2. Flip this to a router.push when Ranked launches.
  const [showRankedSoon, setShowRankedSoon] = useState(false);
  // The game list only renders once the player picks Casual — keeps the menu page short.
  const [showCasualGames, setShowCasualGames] = useState(false);

  useEffect(() => {
    // Show tutorial for first-time users
    const hasSeenTutorial = localStorage.getItem('arcadia_tutorial_seen');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }

    fetch("/api/games")
      .then((r) => r.json())
      .then((d) => setGames(d.games ?? []))
      .catch(() => setGames([]));
  }, []);

  const handleTutorialClose = () => {
    setShowTutorial(false);
    localStorage.setItem('arcadia_tutorial_seen', 'true');
  };

  return (
    <div className="container">
      <div className="topbar">
        <div className="brand">Arcadia</div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {address && (
            <button
              className="btn ghost desktop-only"
              onClick={() => router.push(`/profile/${address}`)}
              style={{ padding: "12px 16px", fontSize: "14px" }}
              title="View my profile"
            >
              👤 Profile
            </button>
          )}
          <ConnectControl />
        </div>
      </div>

      <div className="hero">
        <h1>Stake. Play. Win.</h1>
        <p className="tagline">
          An on-chain arcade. Each game is one round of 12 questions — answer 9 or more to win, 4 or
          fewer to lose, anything between keeps your stake. Cash out at stake × multiplier.
        </p>
        <div className="mechanic">
          <span className="up">9+ correct → ×1.1–1.4</span>
          <span>·</span>
          <span>5–8 → ×1.0</span>
          <span>·</span>
          <span className="down">4 or fewer → ×0.9–0.5</span>
        </div>
      </div>

      <div className="mode-switch">
        <button
          className={`mode-option ${showCasualGames ? "active" : ""}`}
          type="button"
          aria-pressed={showCasualGames}
          onClick={() => {
            setShowCasualGames(true);
            setShowRankedSoon(false);
          }}
        >
          <span className="mode-name">Casual</span>
          <span className="badge live">Live</span>
          <span className="mode-blurb">Play now, win now. Stake per game, settle instantly.</span>
        </button>
        <button
          className="mode-option"
          type="button"
          aria-pressed="false"
          onClick={() => {
            setShowCasualGames(false);
            setShowRankedSoon(true);
          }}
        >
          <span className="mode-name">Ranked</span>
          <span className="badge soon">Coming soon</span>
          <span className="mode-blurb">One weekly buy-in, a shared pot, and a leaderboard payout.</span>
        </button>
      </div>

      {showRankedSoon && (
        <div className="panel center" style={{ marginBottom: 32 }}>
          <h2 style={{ marginBottom: 12 }}>Ranked is coming soon</h2>
          <p className="muted" style={{ maxWidth: 460, marginInline: "auto" }}>
            Ranked is the weekly mode: one buy-in, play through the week, and the pot is shared out
            by the leaderboard at the weekend. It is not open yet — pick Casual to play now.
          </p>
          <button
            className="btn"
            style={{ marginTop: 20 }}
            onClick={() => {
              setShowRankedSoon(false);
              setShowCasualGames(true);
            }}
          >
            Got it
          </button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
        <button className="btn" onClick={() => setShowTutorial(true)}>
          📚 How to Play
        </button>
        <button className="btn ghost" onClick={() => router.push("/faq")}>
          ❓ FAQ
        </button>
        <a href="mailto:play@arcadia.uno" className="btn ghost">
          💬 Support
        </a>
      </div>

      {!showCasualGames && !showRankedSoon && (
        <div className="panel center" style={{ marginBottom: 32 }}>
          <p className="muted" style={{ maxWidth: 460, marginInline: "auto" }}>
            Pick a mode above to see the games.
          </p>
        </div>
      )}

      {showCasualGames && (
        <div className="grid">
          {games.map((g) => (
            <div
              key={g.id}
              className={`card ${g.available ? "playable" : ""}`}
              onClick={() => {
                if (g.available) {
                  router.push(`/play/${g.id}`);
                }
              }}
            >
              <div className="game-icon-wrapper">
                <GameIcon gameId={g.id} />
              </div>
              <h3>{g.title}</h3>
              <p>{g.description}</p>
              <span className={`badge ${g.available ? "live" : "soon"}`}>
                {g.available ? "Live" : "Coming soon"}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 64, textAlign: "center" }}>
        <h2 style={{ marginBottom: 24 }}>Join the Community</h2>
        <SocialLinks />
      </div>

      <div style={{ marginTop: 48, textAlign: "center", paddingBottom: 40 }}>
        <p className="muted" style={{ fontSize: 14, marginBottom: 12 }}>
          Built on Celo · <a href="/faq" style={{ textDecoration: "underline" }}>FAQ</a> ·{" "}
          <a href="/terms" style={{ textDecoration: "underline" }}>Terms</a> ·{" "}
          <a href="/privacy" style={{ textDecoration: "underline" }}>Privacy</a> ·{" "}
          <a href="mailto:play@arcadia.uno" style={{ textDecoration: "underline" }}>Support</a>
        </p>
        <p className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
          &copy; {new Date().getFullYear()} greyw0rks. All rights reserved.
        </p>
        <p className="muted" style={{ fontSize: 11, opacity: 0.6 }}>
          Arcadia, its game mechanics, question banks, and scoring engine are proprietary.
          Unauthorised copying, cloning, or redistribution is strictly prohibited.
          <a href="/terms" style={{ marginLeft: 6, textDecoration: "underline" }}>Terms &amp; IP</a>
        </p>
      </div>

      {showTutorial && <TutorialModal onClose={handleTutorialClose} />}

      <BottomNav />
    </div>
  );
}
