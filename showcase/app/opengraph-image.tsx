import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { studio } from "@/lib/site";

export const alt = `${studio.name} — ${studio.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // the portrait, embedded (read at build time)
  const photo = await readFile(path.join(process.cwd(), "public", "ranvir.jpg"))
    .then((b) => `data:image/jpeg;base64,${b.toString("base64")}`)
    .catch(() => null);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "#0b0a09",
        color: "#f1e8d8",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, letterSpacing: 3, color: "#a39a8d" }}>
        <span>SC 01 — TITLE</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 12, height: 12, borderRadius: 12, background: "#ff3d2e" }} />
          REC
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: photo ? 118 : 150, fontWeight: 900, lineHeight: 0.86, letterSpacing: -4 }}>
          <span>RANVIR</span>
          <span style={{ alignSelf: photo ? "flex-start" : "flex-end" }}>KAWATRA</span>
        </div>
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt=""
            width={290}
            height={364}
            style={{ width: 290, height: 364, objectFit: "cover", borderRadius: 14, border: "3px solid #ffb45a" }}
          />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#a39a8d" }}>
        <span style={{ color: "#ffb45a", fontStyle: "italic" }}>Websites, apps & AI agents.</span>
        <span>Delhi · worldwide</span>
      </div>
    </div>,
    size,
  );
}
