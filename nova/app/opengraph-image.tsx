import { ImageResponse } from "next/og";

export const alt = "NOVA — Curious software, made by hand.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const dots = [];
  for (let y = 0; y < 14; y++) for (let x = 0; x < 26; x++) dots.push([x, y]);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0b0c0e", color: "#e9edf1", fontFamily: "sans-serif" }}>
        {dots.map(([x, y]) => (
          <div key={`${x}-${y}`} style={{ position: "absolute", left: 24 + x * 46, top: 20 + y * 44, width: 4, height: 4, borderRadius: 4, background: x > 16 && y < 7 ? "#ff5a1f" : "rgba(233,237,241,0.15)" }} />
        ))}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 64, width: "100%" }}>
          <div style={{ fontSize: 26, color: "#ff5a1f", fontFamily: "monospace" }}>NOVA — design &amp; creative technology</div>
          <div style={{ fontSize: 128, fontWeight: 800, letterSpacing: -6, lineHeight: 0.9, marginTop: 16 }}>Curious software,</div>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3, color: "#8c949e" }}>made by hand.</div>
        </div>
      </div>
    ),
    size,
  );
}
