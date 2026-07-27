"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Arcadia Awaits",
      subtitle: "A new era of gaming is here",
      icon: "🎮",
      description: "Welcome to Arcadia, where skill meets stake"
    },
    {
      title: "Stake & Play",
      subtitle: "Your stake rides a live multiplier",
      icon: "💰",
      description: "Every correct answer grows your payout"
    },
    {
      title: "Win Big",
      subtitle: "Cash out at stake × multiplier",
      icon: "🏆",
      description: "13 games, endless possibilities"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      localStorage.setItem('arcadia_welcome_seen', 'true');
      router.replace("/games");
    }
  };

  const handleSkip = () => {
    localStorage.setItem('arcadia_welcome_seen', 'true');
    router.replace("/games");
  };

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        {/* Large monochrome illustration */}
        <div className="welcome-illustration">
          <div className="welcome-icon">{slides[currentSlide].icon}</div>
        </div>

        {/* Headline */}
        <h1 className="welcome-title">{slides[currentSlide].title}</h1>

        {/* Supporting text */}
        <p className="welcome-subtitle">{slides[currentSlide].subtitle}</p>
        <p className="welcome-description">{slides[currentSlide].description}</p>

        {/* Progress dots */}
        <div className="welcome-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`welcome-dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="welcome-navigation">
          <button className="btn ghost" onClick={handleSkip}>
            Skip
          </button>
          <button className="btn welcome-next" onClick={handleNext}>
            {currentSlide < slides.length - 1 ? "Next →" : "Get Started"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .welcome-screen {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          padding: 40px 20px;
        }

        .welcome-content {
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .welcome-illustration {
          margin-bottom: 48px;
          animation: fadeIn 0.6s ease-out;
        }

        .welcome-icon {
          font-size: 140px;
          filter: grayscale(100%);
          opacity: 0.9;
        }

        .welcome-title {
          font-size: 56px;
          font-weight: 900;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: -0.04em;
          animation: fadeIn 0.6s ease-out 0.1s both;
        }

        .welcome-subtitle {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 12px;
          font-style: italic;
          opacity: 0.8;
          animation: fadeIn 0.6s ease-out 0.2s both;
        }

        .welcome-description {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 48px;
          opacity: 0.7;
          line-height: 1.6;
          animation: fadeIn 0.6s ease-out 0.3s both;
        }

        .welcome-dots {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 48px;
          animation: fadeIn 0.6s ease-out 0.4s both;
        }

        /* 44px tap target, 20px painted square via ::before */
        .welcome-dot {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .welcome-dot::before {
          content: "";
          width: 20px;
          height: 20px;
          background: var(--bg-alt);
          border: 5px solid var(--border);
          box-shadow: var(--shadow-badge);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .welcome-dot.active::before {
          background: var(--accent);
          transform: scale(1.3) rotate(45deg);
        }

        .welcome-navigation {
          display: flex;
          gap: 16px;
          justify-content: center;
          animation: fadeIn 0.6s ease-out 0.5s both;
        }

        .welcome-next {
          min-width: 160px;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .welcome-screen {
            padding: 32px 20px;
          }

          .welcome-icon {
            font-size: 120px;
          }

          .welcome-title {
            font-size: 40px;
          }

          .welcome-subtitle {
            font-size: 18px;
          }

          .welcome-description {
            font-size: 15px;
          }

          .welcome-navigation {
            flex-direction: column;
            width: 100%;
          }

          .welcome-navigation .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .welcome-icon {
            font-size: 88px;
          }

          .welcome-title {
            font-size: 30px;
          }
        }
      `}</style>
    </div>
  );
}
