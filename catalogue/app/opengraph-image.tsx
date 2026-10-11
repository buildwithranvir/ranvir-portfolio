import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { shots, templates } from "@/lib/templates";

export const alt = "Ranvir's Templates: website designs by Ranvir Kawatra";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The share card: the name, the promise, and the first template in a browser window.
export default async function OpengraphImage() {
  const first = shots(templates[0]).desktop.src;
  const shot = await readFile(path.join(process.cwd(), "public", first))
    .then((b) => `data:image/jpeg;base64,${b.toString("base64")}`)
    .catch(() => null);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0A0A0A", color: "#EDEBE6", fontFamily: "sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", left: 64, top: 64, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 20, letterSpacing: 3, color: "#8A8780" }}>WEBSITE TEMPLATES BY RANVIR KAWATRA</div>
        <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 0.95, marginTop: 28, display: "flex", flexDirection: "column" }}>
          <span>Ranvir&apos;s</span>
          <span>Templates</span>
        </div>
        <div style={{ fontSize: 28, marginTop: 30, color: "#8A8780", maxWidth: 460 }}>Websites ready to launch, rebuilt around your business.</div>
        <div style={{ marginTop: 34, width: 64, height: 6, borderRadius: 6, background: "#FF5B2E" }} />
      </div>
      {shot && (
        <div
          style={{
            position: "absolute",
            right: -80,
            top: 110,
            width: 640,
            display: "flex",
            flexDirection: "column",
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#121212",
          }}
        >
          <div style={{ height: 34, display: "flex", alignItems: "center", gap: 8, paddingLeft: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: 10, background: "rgba(255,255,255,0.18)" }} />
            <div style={{ width: 10, height: 10, borderRadius: 10, background: "rgba(255,255,255,0.18)" }} />
            <div style={{ width: 10, height: 10, borderRadius: 10, background: "rgba(255,255,255,0.18)" }} />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot} alt="" width={640} height={400} style={{ width: 640, height: 400, objectFit: "cover", objectPosition: "top" }} />
        </div>
      )}
    </div>,
    size,
  );
}
