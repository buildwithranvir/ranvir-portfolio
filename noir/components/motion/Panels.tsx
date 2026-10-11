"use client";

import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * The dark sections are rounded cards inset from the page edge. As one scrolls
 * in, it widens to fill the frame - a quiet transition between moods.
 */
export function Panels() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (min-width: 768px)`, () => {
      gsap.utils.toArray<HTMLElement>(".panel").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.94, borderRadius: 56 },
          { scale: 1, borderRadius: 28, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 35%", scrub: true } },
        );
      });
    });
  });
  return null;
}
