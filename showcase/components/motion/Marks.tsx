"use client";

import { useEffect } from "react";
import { marks } from "@/components/ui/Mark";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { afterIntro } from "@/lib/intro";

/**
 * Re-draws a mark's stroke in the pixel size its word actually has, so the
 * pencil line is never stretched: an even line weight, and a path length the
 * draw-in can trace exactly (a stretched path traces short - the ring stopped
 * part of the way round). Sizes are read without the page's own transforms
 * (a mark inside a scaling headline still gets its real size).
 */
function fit(mk: HTMLElement) {
  const svg = mk.querySelector("svg");
  const path = svg?.querySelector("path");
  const m = marks[mk.dataset.mk as keyof typeof marks];
  if (!svg || !path || !m) return;
  const box = mk.getBoundingClientRect();
  const r = svg.getBoundingClientRect();
  if (!box.width || !r.width) return;
  const k = mk.offsetWidth / box.width; // undo any transform scale on the way
  const w = Math.max(1, r.width * k);
  const h = Math.max(1, r.height * k);
  const sx = w / m.box[0];
  const sy = h / m.box[1];
  let i = 0;
  const d = m.d.replace(/-?\d*\.?\d+/g, (n) => (+n * (i++ % 2 ? sy : sx)).toFixed(1));
  svg.setAttribute("viewBox", `0 0 ${w.toFixed(1)} ${h.toFixed(1)}`);
  path.setAttribute("d", d);
  path.removeAttribute("vector-effect");
}

/**
 * Draws every pencil mark (.mk) the first time it scrolls into view - the
 * hero's once the intro has landed. The boot script hides the strokes
 * (html.marks-live) only when motion is allowed, so with reduced motion they
 * are simply there.
 */
export function Marks() {
  // fit every stroke now, once the fonts are in, and after any resize or rotation
  // (re-queried each time: the About headline re-splits its lines on resize, making new nodes)
  useEffect(() => {
    const all = () => document.querySelectorAll<HTMLElement>(".mk").forEach(fit);
    let t = 0;
    const later = () => {
      clearTimeout(t);
      t = window.setTimeout(all, 180);
    };
    all();
    document.fonts?.ready.then(all);
    window.addEventListener("resize", later);
    const ro = new ResizeObserver(later);
    document.querySelectorAll(".mk").forEach((el) => ro.observe(el));
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", later);
      ro.disconnect();
    };
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      document.documentElement.classList.add("marks-live");
      // each mark is watched through its line of text (a headline that re-splits replaces the mark's own node)
      const holders = [...new Set(gsap.utils.toArray<HTMLElement>(".mk").map((el) => el.closest<HTMLElement>("p, h1, h2, h3") ?? el))];
      const timers: number[] = [];
      const draw = (holder: Element, ms: number) =>
        timers.push(
          window.setTimeout(() => {
            holder.querySelectorAll<HTMLElement>(".mk").forEach((el, i) => {
              fit(el);
              setTimeout(() => el.classList.add("is-on"), i * 260);
            });
            if (holder.matches(".mk")) {
              fit(holder as HTMLElement);
              holder.classList.add("is-on");
            }
          }, ms),
        );
      const stop = afterIntro(() => holders.filter((el) => el.closest("#top")).forEach((el, i) => draw(el, 1500 + i * 250)));
      const triggers = ScrollTrigger.batch(
        holders.filter((el) => !el.closest("#top")),
        { start: "clamp(top 80%)", once: true, onEnter: (batch) => batch.forEach((el, i) => draw(el, 500 + i * 220)) },
      );
      return () => {
        stop();
        timers.forEach(clearTimeout);
        triggers.forEach((t) => t.kill());
        document.querySelectorAll(".mk").forEach((el) => el.classList.remove("is-on"));
        document.documentElement.classList.remove("marks-live");
      };
    });
  });
  return null;
}
