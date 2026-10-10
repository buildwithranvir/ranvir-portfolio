import { ImageResponse } from "next/og";

export const alt = "Noir — Kaffebar & Bageri. Slow coffee for long mornings.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#efe7da", color: "#22160f", fontFamily: "serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 4, borderTop: "2px solid #22160f", borderBottom: "2px solid #22160f", padding: "14px 0" }}>
          <span>Nº 27 ALDER LANE</span>
          <span>KAFFEBAR &amp; BAGERI</span>
          <span>EST. 2017</span>
        </div>
        <div style={{ fontSize: 112, lineHeight: 1 }}>Slow coffee for long mornings.</div>
        <div style={{ fontSize: 30, color: "#6e1f25" }}>Noir — a demo café template</div>
      </div>
    ),
    size,
  );
}
