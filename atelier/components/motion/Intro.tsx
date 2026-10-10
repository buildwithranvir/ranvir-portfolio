"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

const STRIPS = 6;

// A small floor plan: walls, a stair and two door swings.
const plan = [
  "M10 10 H190 V130 H10 Z",
  "M10 70 H86 M114 70 H190",
  "M100 10 V52 M100 88 V130",
  "M130 70 V130",
  "M140 84 H180 M140 94 H180 M140 104 H180 M140 114 H180",
  "M86 70 A 20 20 0 0 1 100 52",
  "M114 70 A 18 18 0 0 0 100 88",
  "M40 130 V118 M70 130 V118",
];

/**
 * Opening sequence: a floor plan draws itself on a blueprint screen, then
 * the screen folds away like an accordion partition, strip by strip.
 * It never blocks the page (pointer-events: none) and runs once.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const strips = gsap.utils.toArray<HTMLElement>(".intro-strip");
        gsap
          .timeline({ onComplete: () => gsap.set(ref.current, { display: "none" }) })
          .fromTo(".intro-plan path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.04 }, 0)
          .fromTo(".intro-word", { yPercent: 100, opacity: 1 }, { yPercent: 0, duration: 0.7, ease: "expo.out" }, 0.15)
          .to(".intro-cap", { opacity: 1, duration: 0.5 }, 0.35)
          .to(".intro-content", { opacity: 0, duration: 0.25, ease: "power1.in" }, 0.85)
          .to(
            strips,
            {
              rotateY: (i) => (i % 2 ? -92 : 92),
              transformOrigin: (i) => (i % 2 ? "100% 50%" : "0% 50%"),
              transformPerspective: 2600,
              duration: 0.8,
              ease: "power3.in",
              stagger: { each: 0.05, from: "center" },
            },
            0.9,
          )
          // the last few degrees: fade so no strip lingers as a hairline when it is edge-on
          .to(strips, { opacity: 0, duration: 0.25, ease: "power1.in", stagger: { each: 0.05, from: "center" } }, 1.45);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className="intro pointer-events-none fixed inset-0 z-[100]">
      <div className="flex h-full w-full">
        {Array.from({ length: STRIPS }).map((_, i) => (
          <div key={i} className={`intro-strip h-full flex-1 ${i % 2 ? "bg-cobalt" : "bg-blueprint"}`} />
        ))}
      </div>
      <div className="intro-content absolute inset-0 grid place-items-center text-paper">
        <div className="flex flex-col items-center gap-6">
          <svg viewBox="0 0 200 140" className="intro-plan w-[min(60vw,300px)] fill-none stroke-paper" strokeWidth={1.2}>
            {plan.map((d) => (
              <path key={d} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
            ))}
          </svg>
          <div className="overflow-hidden">
            <p className="intro-word display text-[clamp(2rem,6vw,3.5rem)]" style={{ opacity: 0 }}>
              Atelier
            </p>
          </div>
          <p className="intro-cap label text-paper/70" style={{ opacity: 0 }}>
            Morrow &amp; Vale · Sheet A-000
          </p>
        </div>
      </div>
    </div>
  );
}
