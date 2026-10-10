"use client";

import { gsap, INTRO_DELAY, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Page-wide motion: every hand-drawn mark (.mk) draws its stroke the first
 * time it scrolls into view. Marks are drawn by default in CSS; this only
 * hides the strokes once it is ready to draw them, so nothing can get stuck.
 */
export function PageMotion() {
  useGSAP(() => {
    const root = document.documentElement;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      root.classList.add("marks-live");
      const marks = gsap.utils.toArray<HTMLElement>(".mk");
      // Marks in the hero are drawn once the intro and the headline have finished folding up
      const timers = marks
        .filter((el) => el.closest("#top"))
        .map((el, i) => setTimeout(() => el.classList.add("is-on"), INTRO_DELAY * 1000 + 1300 + i * 250));
      ScrollTrigger.batch(
        marks.filter((el) => !el.closest("#top")),
        {
          start: "clamp(top 86%)",
          once: true,
          onEnter: (els) => els.forEach((el, i) => setTimeout(() => el.classList.add("is-on"), 350 + i * 180)),
        },
      );
      return () => {
        timers.forEach(clearTimeout);
        root.classList.remove("marks-live");
      };
    });
  });

  return null;
}
