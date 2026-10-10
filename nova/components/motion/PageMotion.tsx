"use client";

import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Shared entrances: every section title (.reveal-title) rises letter by letter
 * out of its own baseline the first time it scrolls into view.
 */
export function PageMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>(".reveal-title").forEach((el) => {
        const split = SplitText.create(el, { type: "chars", mask: "chars" });
        gsap.from(split.chars, {
          yPercent: 115,
          rotate: 6,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.025,
          scrollTrigger: { trigger: el, start: "clamp(top 88%)", once: true },
        });
      });
    });
  });
  return null;
}
