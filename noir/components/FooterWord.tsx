"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** The closing wordmark: each letter rises out of the page edge as you reach the bottom. */
export function FooterWord() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".fw-char", {
          yPercent: 70,
          opacity: 0,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="wrap relative mt-16 md:mt-24">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink/15 pt-5 text-[0.8125rem] text-ink-soft">
        <p className="glass flex items-center gap-2 rounded-full px-4 py-2 text-ink">
          <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-burgundy" />
          Kaffebar &amp; Bageri · 27 Alder Lane
        </p>
        <p>Roasted on Tuesdays since 2017</p>
      </div>
      <p aria-hidden className="mt-6 flex justify-center overflow-hidden font-display text-[36vw] leading-[0.8] tracking-[-0.04em] text-ink lg:text-[26rem]">
        {"Noir".split("").map((c, i) => (
          <span key={i} className="fw-char inline-block">
            {c}
          </span>
        ))}
      </p>
    </div>
  );
}
