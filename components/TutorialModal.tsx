"use client";

import { useState } from "react";
import { useAppConfig } from "../lib/config";

interface TutorialModalProps {
  onClose: () => void;
}

export function TutorialModal({ onClose }: TutorialModalProps) {
  const [step, setStep] = useState(0);
  const config = useAppConfig();
  const isFree = config?.playMode !== "stake";

  const freeSteps = [
    {
      title: "Welcome to Arcadia! 🎮",
      content: "Arcadia is an on-chain arcade of skill-based games. Play, answer questions, and earn XP — it's free!",
    },
    {
      title: "How It Works ⚡",
      content: "Each game is one round of 12 hard questions. Every question you get right earns XP, and finishing the round earns a completion bonus on top.",
    },
    {
      title: "Climb the Leaderboard 🏆",
      content: "Your XP is tracked per wallet and shown on your profile and the Ranks leaderboard. The more you play and the more you get right, the higher you climb.",
    },
    {
      title: "Free to Play 🎉",
      content: "There's no stake and no entry fee — nothing to lose. Just connect your wallet so your XP is tracked across sessions.",
    },
    {
      title: "Ready to Play? 🚀",
      content: "Connect your wallet, choose a game, and test your skills. Good luck!",
    },
  ];

  const stakeSteps = [
    {
      title: "Welcome to Arcadia! 🎮",
      content: "Arcadia is an on-chain arcade where you stake stablecoins and play skill-based games. Your payout depends on your performance!",
    },
    {
      title: "How It Works 💰",
      content: "Each game is one round of 12 questions. Answer 9+ right to win — 1.1x at 9, up to 1.4x for a perfect 12. Get 5–8 and your stake holds at 1.0x. Get 4 or fewer and you lose — 0.9x down to 0.5x. Payout = stake × multiplier.",
    },
    {
      title: "You Can Lose Money! ⚠️",
      content: "Land in the loss zone (4 or fewer of 12 correct) and the round settles at 0.9x, so you get back less than you staked. Play carefully!",
    },
    {
      title: "Entry Fee 💸",
      content: "There's a 3% rake on your stake. So if you stake 10 USDm, 9.7 USDm goes into play. This funds the house treasury.",
    },
    {
      title: "Refund Protection 🛡️",
      content: "If the game crashes or fails, you can request a refund after 1 hour. Your stake is always safe on-chain!",
    },
    {
      title: "Ready to Play? 🚀",
      content: "Connect your wallet, choose a game, stake some stablecoins, and test your skills. Good luck!",
    },
  ];

  const steps = isFree ? freeSteps : stakeSteps;

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 15, 15, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        className="panel"
        style={{
          maxWidth: "600px",
          width: "100%",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            minWidth: 44,
            minHeight: 44,
            background: "transparent",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            padding: "8px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        <h2 style={{ marginTop: 0, fontSize: "28px" }}>{currentStep.title}</h2>
        <p style={{ fontSize: "18px", lineHeight: 1.6, marginBottom: "32px" }}>
          {currentStep.content}
        </p>

        <div className="progress-dots">
          {steps.map((_, i) => (
            <div key={i} className={`progress-dot ${i === step ? "active" : ""}`} />
          ))}
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          {step > 0 && (
            <button className="btn ghost" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <button
            className="btn"
            onClick={() => {
              if (isLastStep) {
                onClose();
              } else {
                setStep(step + 1);
              }
            }}
          >
            {isLastStep ? "Let's Play!" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
