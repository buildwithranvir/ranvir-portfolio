import { ImageResponse } from "next/og";

export const alt = "Atelier Morrow & Vale, Architecture & Interiors";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const tones = ["#2a47c2", "#d2532f", "#ebb13b", "#2e6b5e", "#f0cdbf"];

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#eee6d8", color: "#17182b", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 18, letterSpacing: 2, opacity: 0.7 }}>ATELIER MORROW &amp; VALE · SHEET A-000</div>
        <div style={{ fontSize: 84, lineHeight: 1, letterSpacing: -3, fontWeight: 800, maxWidth: 980 }}>Buildings that unfold slowly, and grow quieter with time.</div>
        <div style={{ display: "flex", gap: 0 }}>
          {tones.map((c) => (
            <div key={c} style={{ width: 120, height: 28, background: c }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
