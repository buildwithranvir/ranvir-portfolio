import { ImageResponse } from "next/og";
import { shop } from "@/lib/site";
import { templates } from "@/lib/templates";

export const alt = "Ranvir's Templates: website designs by Ranvir Kawatra";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The share card: a fan of the real template colours and the wordmark.
export default async function OpengraphImage() {
  const colors = [...templates.map((t) => t.colors.paint), shop.tomato, shop.sun, shop.mint, shop.bubble].slice(0, 8);
  const spread = 56;
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#F3EEE4", position: "relative", fontFamily: "sans-serif" }}>
      {colors.map((c, i) => {
        const a = -spread + (i * spread * 2) / (colors.length - 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 820,
              top: 120,
              width: 150,
              height: 260,
              borderRadius: 16,
              background: c,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              transform: `rotate(${a}deg)`,
              transformOrigin: "50% 90%",
              boxShadow: "0 18px 40px -20px rgba(21,19,16,0.6)",
            }}
          >
            <div style={{ height: 64, background: "#FBF8F2", borderBottomLeftRadius: 16, borderBottomRightRadius: 16, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 14 }}>
              <div style={{ width: 14, height: 14, borderRadius: 14, background: "#E7E0D2" }} />
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 72, top: 80, display: "flex", flexDirection: "column", color: "#151310" }}>
        <div style={{ fontSize: 22, letterSpacing: 4, color: "#6B645A" }}>WEBSITE DESIGNS BY RANVIR KAWATRA</div>
        <div style={{ fontSize: 132, fontWeight: 900, lineHeight: 0.92, marginTop: 26, letterSpacing: -3 }}>RANVIR&apos;S</div>
        <div style={{ fontSize: 132, fontWeight: 900, lineHeight: 0.92, letterSpacing: -3, color: "#F2542D" }}>TEMPLATES</div>
        <div style={{ fontSize: 30, marginTop: 34, color: "#3B3630" }}>Pick a colour. Get a website.</div>
      </div>
    </div>,
    size,
  );
}
