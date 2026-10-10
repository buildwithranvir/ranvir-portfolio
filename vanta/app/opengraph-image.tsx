import { ImageResponse } from "next/og";

export const alt = "VANTA — an independent fashion studio. Issue 07, Quiet Armour";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, background: "#140f12", color: "#f2eee7", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 2, color: "#8e858a" }}>
          <span>EST. 2014 · PORT DISTRICT</span>
          <span>ISSUE 07 · QUIET ARMOUR</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 64, lineHeight: 1.1 }}>
            Nine people. One cutting table.
          </span>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 24 }}>
            <span style={{ fontSize: 230, fontWeight: 900, letterSpacing: -6, lineHeight: 0.8 }}>VANTA</span>
            <span style={{ display: "flex", width: 150, height: 150, borderRadius: 150, background: "#d6f34b", color: "#140f12", fontSize: 64, fontStyle: "italic", alignItems: "center", justifyContent: "center" }}>07</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
