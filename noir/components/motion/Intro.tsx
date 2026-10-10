"use client";

import { useRef } from "react";
import { getLenis } from "@/lib/scroll";
import { gsap, INTRO_DELAY, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * Opening curtain: the wordmark rises, a pour line fills, then the espresso
 * panel lifts away with a soft rounded edge. Skipped for reduced motion,
 * and a CSS fallback removes it even if scripts never run.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        getLenis()?.stop();
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            getLenis()?.start();
            gsap.set(ref.current, { display: "none" });
          },
        });
        tl.from(".intro-char", { yPercent: 110, duration: 0.9, stagger: 0.06 }, 0.1)
          .from(".intro-sub", { opacity: 0, y: 8, duration: 0.7 }, 0.45)
          .fromTo(".intro-line", { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0.3)
          .to(".intro-inner", { y: -30, opacity: 0, duration: 0.5, ease: "power2.in" }, INTRO_DELAY - 0.55)
          .to(ref.current, { yPercent: -100, borderBottomLeftRadius: "50% 12vh", borderBottomRightRadius: "50% 12vh", duration: 1, ease: "power4.inOut" }, INTRO_DELAY - 0.35);
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { display: "none" });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className="intro pointer-events-none fixed inset-0 z-[300] flex items-center justify-center bg-ink text-milk">
      <div className="intro-inner text-center">
        <p className="flex justify-center overflow-hidden font-display text-[clamp(3.5rem,10vw,7rem)] leading-[1.05]">
          {"Noir".split("").map((c, i) => (
            <span key={i} className="intro-char inline-block">
              {c}
            </span>
          ))}
        </p>
        <span className="intro-line mx-auto mt-4 block h-px w-40 origin-left bg-oat/70" />
        <p className="intro-sub label mt-4 text-oat">Kaffebar &amp; Bageri · Est. 2017</p>
      </div>
    </div>
  );
}
