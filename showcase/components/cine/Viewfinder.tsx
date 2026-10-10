"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { afterIntro } from "@/lib/intro";

const PAD = 14;

/**
 * The signature of the site: a focus frame that travels with the visitor.
 * Four corner brackets glide to whatever the current scene frames
 * ([data-frame] - the name, then each project, then the closing button), and
 * pull tight around anything marked [data-frame-hover] while it's hovered.
 * Corners move with transforms only; positions are read once per frame,
 * before anything is written.
 */
export function Viewfinder() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const root = ref.current!;
        const corners = Array.from(root.querySelectorAll<HTMLElement>(".vf-c"));
        const setters = corners.map((c) => ({
          x: gsap.quickTo(c, "x", { duration: 0.75, ease: "power3" }),
          y: gsap.quickTo(c, "y", { duration: 0.75, ease: "power3" }),
        }));

        let hover: HTMLElement | null = null;
        let last = "";
        const coarse = window.matchMedia("(pointer: coarse)").matches;

        const pick = () => {
          if (hover && hover.isConnected) return hover.getBoundingClientRect();
          const vh = window.innerHeight;
          let best: DOMRect | null = null;
          let bestD = Infinity;
          document.querySelectorAll<HTMLElement>("[data-frame]").forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.bottom < vh * 0.12 || r.top > vh * 0.88 || r.width < 2) return;
            const d = Math.abs(r.top + r.height / 2 - vh / 2);
            if (d < bestD) {
              bestD = d;
              best = r;
            }
          });
          return best as DOMRect | null;
        };

        // only re-measure when the page scrolled, resized or the hover target changed
        let dirty = 8;
        const touch = () => (dirty = 8);
        const tick = () => {
          if (dirty <= 0) return;
          dirty--;
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const r = pick();
          // nothing to frame: the corners rest on the edges of the screen
          const m = coarse ? 10 : 18;
          let L = m,
            T = 64,
            R = vw - m,
            B = vh - 64;
          if (r) {
            L = Math.max(m, r.left - PAD);
            T = Math.max(m + 46, r.top - PAD);
            R = Math.min(vw - m, r.right + PAD);
            B = Math.min(vh - m - 40, r.bottom + PAD);
          }
          const key = `${L | 0}|${T | 0}|${R | 0}|${B | 0}`;
          if (key === last) return;
          last = key;
          const pts = [
            [L, T],
            [R, T],
            [L, B],
            [R, B],
          ];
          setters.forEach((s, i) => {
            s.x(pts[i][0]);
            s.y(pts[i][1]);
          });
        };

        const over = (e: PointerEvent) => {
          if (e.pointerType !== "mouse") return;
          const t = (e.target as HTMLElement).closest<HTMLElement>("[data-frame-hover]");
          if (t !== hover) {
            hover = t;
            touch();
          }
        };

        let started = false;
        const stop = afterIntro(() => {
          started = true;
          gsap.to(root, { opacity: 1, duration: 0.8, delay: 0.3 });
        });
        gsap.ticker.add(tick, false, true);
        window.addEventListener("pointerover", over, { passive: true });
        window.addEventListener("scroll", touch, { passive: true });
        window.addEventListener("resize", touch);
        return () => {
          stop();
          gsap.ticker.remove(tick);
          window.removeEventListener("pointerover", over);
          window.removeEventListener("scroll", touch);
          window.removeEventListener("resize", touch);
          if (!started) gsap.set(root, { opacity: 0 });
        };
      });
    },
    { scope: ref },
  );

  const arm = "absolute bg-current";
  return (
    <div ref={ref} aria-hidden className="pointer-events-none text-white opacity-0">
      {["", "-scale-x-100", "-scale-y-100", "-scale-100"].map((flip, i) => (
        <span key={i} className="vf-c fixed left-0 top-0 z-[60] h-0 w-0 mix-blend-difference">
          <span className={`absolute -left-px -top-px block h-5 w-5 ${flip}`} style={{ transformOrigin: "1px 1px" }}>
            <span className={`${arm} left-0 top-0 h-[1.5px] w-full`} />
            <span className={`${arm} left-0 top-0 h-full w-[1.5px]`} />
          </span>
        </span>
      ))}
    </div>
  );
}
