"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const themes = [
  ["dark", "#140f12"],
  ["plum", "#2b1b26"],
  ["light", "#f2eee7"],
  ["acid", "#d6f34b"],
] as const;

/**
 * Page-wide motion.
 * - Page colour: four fixed colour layers sit behind the page and cross-fade
 *   by opacity only (GPU work, no re-styling), switching as each section's
 *   middle crosses the screen. Each section already carries its own text colours.
 * - Every .hl highlighter sweeps in the first time it scrolls into view.
 */
export function PageMotion() {
  const layers = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const root = document.documentElement;
    root.classList.add("bg-live");
    const show = (name: string) => {
      if (root.dataset.page === name) return;
      root.dataset.page = name;
      layers.current?.querySelectorAll<HTMLElement>("[data-layer]").forEach((l) => l.classList.toggle("is-on", l.dataset.layer === name));
    };

    gsap.utils.toArray<HTMLElement>("[data-theme]").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && show(el.dataset.theme!),
      });
    });

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      ScrollTrigger.batch(".hl:not(.hl-manual)", {
        start: "top 88%",
        once: true,
        onEnter: (els) => els.forEach((el, i) => setTimeout(() => el.classList.add("is-on"), i * 140)),
      });
    });

    return () => root.classList.remove("bg-live");
  });

  return (
    <div ref={layers} aria-hidden className="page-bg pointer-events-none fixed inset-0 -z-10">
      {themes.map(([name, color]) => (
        <div key={name} data-layer={name} className={name === "dark" ? "is-on" : ""} style={{ background: color }} />
      ))}
    </div>
  );
}
