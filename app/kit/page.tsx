"use client";

import { useRouter } from "next/navigation";

const YEAR = new Date().getFullYear();

const COLORS: { name: string; hex: string; role: string; text?: string }[] = [
  { name: "Accent Pink", hex: "#FF6B9D", role: "Primary action · hero · buttons" },
  { name: "Ink Black", hex: "#0F0F0F", role: "All borders, shadows & text", text: "#FFFFFF" },
  { name: "Zap Yellow", hex: "#FFD93D", role: "Highlights · badges · diamonds" },
  { name: "Cyan", hex: "#6BCDCF", role: "Secondary · timers" },
  { name: "Win Green", hex: "#6BCF7F", role: "Correct · up · live status" },
  { name: "Loss Red", hex: "#FF6B6B", role: "Wrong · down · errors" },
  { name: "Purple", hex: "#A78BFA", role: "Accents · panels" },
  { name: "Orange", hex: "#FF9B71", role: "Tertiary accent" },
  { name: "Lilac BG", hex: "#F5F3FF", role: "Page background", text: "#0F0F0F" },
  { name: "Periwinkle", hex: "#E0E7FF", role: "Alt BG · tracks · inset", text: "#0F0F0F" },
  { name: "Card White", hex: "#FFFFFF", role: "Card & panel surfaces", text: "#0F0F0F" },
  { name: "Dim Gray", hex: "#4B5563", role: "Muted / secondary text", text: "#FFFFFF" },
];

const PRINCIPLES = [
  { n: "P1", t: "Ink & Offset", d: "Everything wears a 6–8px black border with a hard drop shadow. No blur. Depth comes from displacement, not softness." },
  { n: "P2", t: "Loud but Legible", d: "Saturated pastels carry energy; ink keeps it readable. Color signals meaning — pink = action, green = win, red = loss." },
  { n: "P3", t: "Tilt & Play", d: "Slight rotations, diamond accents and dashed inner frames keep it kinetic. Nothing sits perfectly square." },
  { n: "P4", t: "Pressable", d: "Hover lifts, active presses down. The UI behaves like arcade buttons — physical and satisfying." },
];

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 24 }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, opacity: 0.5 }}>{num}</span>
      <div
        style={{
          display: "inline-block", background: "var(--yellow)", border: "6px solid var(--border)",
          boxShadow: "var(--shadow)", padding: "10px 22px", transform: "rotate(-1deg)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 24, textTransform: "uppercase", letterSpacing: "-0.02em" }}>{title}</h2>
      </div>
    </div>
  );
}

function LogoMark({ size = 140 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#FF6B9D" />
      <rect x="10" y="10" width="180" height="180" fill="none" stroke="#0F0F0F" strokeWidth="8" />
      <rect x="20" y="20" width="160" height="160" fill="none" stroke="#0F0F0F" strokeWidth="3" strokeDasharray="8,8" opacity="0.3" />
      <path d="M 100 50 L 70 130 L 85 130 L 90 115 L 110 115 L 115 130 L 130 130 Z" fill="#FFD93D" stroke="#0F0F0F" strokeWidth="6" strokeLinejoin="miter" />
      <rect x="92" y="100" width="16" height="10" fill="#0F0F0F" />
      <path d="M 100 50 L 95 65 L 105 65 Z" fill="#0F0F0F" />
      <circle cx="60" cy="155" r="8" fill="#6BCDCF" stroke="#0F0F0F" strokeWidth="4" />
      <circle cx="80" cy="155" r="8" fill="#6BCF7F" stroke="#0F0F0F" strokeWidth="4" />
      <circle cx="120" cy="155" r="8" fill="#FF6B6B" stroke="#0F0F0F" strokeWidth="4" />
      <circle cx="140" cy="155" r="8" fill="#A78BFA" stroke="#0F0F0F" strokeWidth="4" />
      <rect x="15" y="15" width="12" height="12" fill="#FFD93D" stroke="#0F0F0F" strokeWidth="3" transform="rotate(45 21 21)" />
      <rect x="173" y="15" width="12" height="12" fill="#6BCDCF" stroke="#0F0F0F" strokeWidth="3" transform="rotate(45 179 21)" />
      <rect x="15" y="173" width="12" height="12" fill="#6BCF7F" stroke="#0F0F0F" strokeWidth="3" transform="rotate(45 21 179)" />
      <rect x="173" y="173" width="12" height="12" fill="#A78BFA" stroke="#0F0F0F" strokeWidth="3" transform="rotate(45 179 179)" />
    </svg>
  );
}

const label: React.CSSProperties = {
  fontFamily: "'Space Mono', monospace", fontSize: 11, textTransform: "uppercase",
  letterSpacing: "0.1em", color: "var(--text-dim)", marginBottom: 12,
};
const cardBox: React.CSSProperties = {
  background: "var(--card)", border: "6px solid var(--border)", boxShadow: "var(--shadow)", padding: 24,
};

export default function KitPage() {
  const router = useRouter();

  return (
    <div className="container">
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="btn ghost" onClick={() => router.back()} style={{ padding: "12px 16px", fontSize: 20 }} title="Go back">←</button>
          <div className="brand" style={{ cursor: "pointer" }} onClick={() => router.push("/")}>Arcadia</div>
        </div>
      </div>

      {/* MASTHEAD */}
      <div className="hero" style={{ marginBottom: 56 }}>
        <span style={{ display: "inline-block", background: "var(--card)", border: "5px solid var(--border)", boxShadow: "var(--shadow-brutal)", padding: "8px 18px", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 20 }}>
          Brand Kit · v1.0
        </span>
        <h1>Arcadia Brand Kit</h1>
        <p className="tagline">
          The quiz arcade on Celo. This page is the single source of truth for how Arcadia
          looks, sounds and feels — colors, type, logo, components and voice.
        </p>
      </div>

      {/* 01 OVERVIEW */}
      <section style={{ marginBottom: 64 }}>
        <SectionHead num="01" title="Overview" />
        <p className="muted" style={{ maxWidth: 720, marginBottom: 28, fontSize: 16 }}>
          Arcadia looks like a coin-op cabinet reimagined for the on-chain era: loud color, thick
          ink-black borders, hard offset shadows and zero gloss. Every surface feels tactile and
          pressable. Playful, confident, a little chaotic — never corporate, never flat.
        </p>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          {PRINCIPLES.map((p) => (
            <div key={p.n} style={{ ...cardBox, minHeight: 0, alignItems: "flex-start", textAlign: "left" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, background: "var(--purple)", border: "4px solid var(--border)", padding: "4px 10px", display: "inline-block", marginBottom: 14 }}>{p.n}</span>
              <h3 style={{ fontSize: 17, textTransform: "uppercase", marginBottom: 8 }}>{p.t}</h3>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-dim)", lineHeight: 1.5 }}>{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 02 WORDMARK */}
      <section style={{ marginBottom: 64 }}>
        <SectionHead num="02" title="Wordmark" />
        <p className="muted" style={{ maxWidth: 720, marginBottom: 28, fontSize: 16 }}>
          The wordmark is set in Space Grotesk, heavy weight, uppercase, tight tracking (-0.05em),
          on a Zap Yellow tile with the signature ink border and offset shadow. Never stretch,
          recolor the tile, or drop the border.
        </p>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", alignItems: "center" }}>
          <div className="brand" style={{ cursor: "default" }}>Arcadia</div>
          <div className="brand" style={{ cursor: "default", background: "var(--card)" }}>Arcadia</div>
        </div>
      </section>

      {/* 03 SYMBOL */}
      <section style={{ marginBottom: 64 }}>
        <SectionHead num="03" title="Symbol" />
        <p className="muted" style={{ maxWidth: 720, marginBottom: 28, fontSize: 16 }}>
          The mark is a bordered pink tile holding a chiseled yellow <strong>A</strong>, four
          arcade-button dots and corner diamonds. Keep clear space equal to the border width. Never
          rotate the mark itself or recolor the A.
        </p>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          <div style={{ ...cardBox, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, background: "var(--bg)" }}>
            <LogoMark size={150} />
            <span style={label}>Primary · on light</span>
          </div>
          <div style={{ ...cardBox, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, background: "var(--border)" }}>
            <LogoMark size={150} />
            <span style={{ ...label, color: "#fff" }}>On ink · dark</span>
          </div>
        </div>
      </section>

      {/* 04 COLOR */}
      <section style={{ marginBottom: 64 }}>
        <SectionHead num="04" title="Color" />
        <p className="muted" style={{ maxWidth: 720, marginBottom: 28, fontSize: 16 }}>
          Ink black is the constant — it borders and shadows everything. Pink is the primary action
          color. Semantic green/red are reserved for win/loss states and must not be used decoratively.
        </p>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {COLORS.map((c) => (
            <div key={c.hex} style={{ border: "6px solid var(--border)", boxShadow: "var(--shadow)", background: "var(--card)" }}>
              <div style={{ height: 88, background: c.hex, borderBottom: "6px solid var(--border)" }} />
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 14, textTransform: "uppercase" }}>{c.name}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--text-dim)" }}>{c.hex}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginTop: 6, lineHeight: 1.35 }}>{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 05 TYPOGRAPHY */}
      <section style={{ marginBottom: 64 }}>
        <SectionHead num="05" title="Typography" />
        <p className="muted" style={{ maxWidth: 720, marginBottom: 28, fontSize: 16 }}>
          <strong>Space Grotesk</strong> is the voice — geometric, quirky, tech-forward. Headlines run
          heavy, uppercase, tight tracking. <strong>Space Mono</strong> handles numbers, labels and
          addresses. Body weight never drops below 500.
        </p>
        <div style={{ ...cardBox, marginBottom: 20, textAlign: "left", alignItems: "flex-start" }}>
          <div style={label}>Display · Space Grotesk · uppercase · -0.04em</div>
          <div style={{ fontSize: 52, fontWeight: 700, textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.9 }}>Stake. Answer.<br />Ride the multiplier.</div>
        </div>
        <div style={{ ...cardBox, marginBottom: 20, textAlign: "left", alignItems: "flex-start" }}>
          <div style={label}>Body · Space Grotesk 500</div>
          <div style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6 }}>Pick your chain, set your stake and answer fast. Every correct answer pushes your multiplier up — a wrong one sends it crashing down. Cash out before the timer runs.</div>
        </div>
        <div style={{ ...cardBox, textAlign: "left", alignItems: "flex-start" }}>
          <div style={label}>Data / Mono · Space Mono 700</div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 15, fontWeight: 700 }}>0x678Ce8fF…aaDD89F &nbsp;·&nbsp; 3.75× &nbsp;·&nbsp; $0.50 STAKE</div>
        </div>
      </section>

      {/* 06 GRAPHIC ELEMENTS */}
      <section style={{ marginBottom: 64 }}>
        <SectionHead num="06" title="Graphic Elements" />
        <p className="muted" style={{ maxWidth: 720, marginBottom: 28, fontSize: 16 }}>
          The building blocks: hard offset shadows (0 blur), 6–8px borders, square corners, floating
          yellow diamonds, dashed inner frames and a springy easing on every interaction.
        </p>
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
          <div style={cardBox}>
            <div style={label}>Buttons</div>
            <button className="btn" style={{ marginBottom: 12 }}>Play now</button>
            <button className="btn ghost">Cash out</button>
          </div>
          <div style={cardBox}>
            <div style={label}>Badges</div>
            <span className="badge live">Live</span> <span className="badge soon">Soon</span>
            <div style={{ marginTop: 12 }}><span className="badge">3% Rake</span></div>
          </div>
          <div style={cardBox}>
            <div style={label}>Answer options</div>
            <button className="option correct" disabled>Ethereum</button>
            <button className="option wrong" disabled>Litecoin</button>
          </div>
          <div style={cardBox}>
            <div style={label}>Multiplier</div>
            <div className="multiplier up" style={{ fontSize: 56 }}>3.75×</div>
          </div>
          <div style={cardBox}>
            <div style={label}>Timer</div>
            <div className="timer-track"><div className="timer-fill" style={{ width: "62%" }} /></div>
          </div>
          <div style={cardBox}>
            <div style={label}>Shadows & borders</div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, lineHeight: 2 }}>sm 4px · brutal 6px<br />base 8px · xl 16px<br />radius: 0 (always square)</div>
          </div>
        </div>
      </section>

      {/* 07 BUILT ON CELO */}
      <section style={{ marginBottom: 64 }}>
        <SectionHead num="07" title="Built on Celo" />
        <p className="muted" style={{ maxWidth: 720, marginBottom: 28, fontSize: 16 }}>
          Arcadia runs exclusively on <strong>Celo</strong>. When representing the Celo relationship,
          use Celo&apos;s own brand assets and colors from{" "}
          <a href="https://celo.org/brand-kit" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>celo.org/brand-kit</a>
          {" "}— never restyle the Celo logo in Arcadia&apos;s palette.
        </p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { name: "Celo Yellow", hex: "#FCFF52", text: "#1A0329" },
            { name: "Forest Green", hex: "#4E632A", text: "#FFFFFF" },
            { name: "Dark Purple", hex: "#1A0329", text: "#FFFFFF" },
            { name: "Tan", hex: "#FBF6F1", text: "#1A0329" },
          ].map((c) => (
            <div key={c.hex} style={{ border: "6px solid var(--border)", boxShadow: "var(--shadow)", minWidth: 150 }}>
              <div style={{ height: 72, background: c.hex, borderBottom: "6px solid var(--border)" }} />
              <div style={{ padding: "10px 14px", background: "var(--card)" }}>
                <div style={{ fontSize: 13, textTransform: "uppercase" }}>{c.name}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--text-dim)" }}>{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 08 BRAND POLICY */}
      <section style={{ marginBottom: 40 }}>
        <SectionHead num="08" title="Brand Policy" />
        <div className="panel" style={{ marginTop: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.7, marginBottom: 16 }}>
            The Arcadia name, logo, wordmark and all associated creative works are the exclusive
            property of greyw0rks. You may reference Arcadia and use the assets on this page to
            indicate an integration or partnership, provided you don&apos;t alter the logo, change its
            colors, or imply endorsement without permission.
          </p>
          <p style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.7, color: "var(--text-dim)" }}>
            Do not clone, fork for deployment, or build competing products based on Arcadia&apos;s
            design. See the{" "}
            <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => router.push("/terms")}>Terms &amp; IP</span>{" "}
            page for full details.
          </p>
        </div>
      </section>

      <div style={{ borderTop: "6px solid var(--border)", paddingTop: 24, marginTop: 40, fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--text-dim)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span>ARCADIA BRAND KIT · v1.0 · {YEAR}</span>
        <span>arcadia.uno/kit · @arcadia_uno</span>
      </div>
    </div>
  );
}
