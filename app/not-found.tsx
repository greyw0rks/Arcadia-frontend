export default function NotFound() {
  return (
    <div className="container">
      <div className="panel center" style={{ marginTop: 48 }}>
        <h1 style={{ fontSize: "clamp(56px, 18vw, 96px)", lineHeight: 1, marginBottom: 12 }}>404</h1>
        <p className="muted" style={{ fontSize: 18, marginBottom: 32 }}>
          This screen isn&apos;t in the arcade.
        </p>
        <a className="btn" href="/games">
          ← Back to lobby
        </a>
      </div>
    </div>
  );
}
