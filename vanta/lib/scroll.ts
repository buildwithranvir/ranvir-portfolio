"use client";

import type Lenis from "lenis";

// The active Lenis instance (null when reduced motion is on).
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Smoothly scroll to an in-page anchor like "#menu", with or without Lenis. */
export function scrollToHash(hash: string) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  // A link inside the mobile menu fires while the page is still locked.
  document.documentElement.style.overflow = "";
  if (lenis) {
    // Resume first: start() on a stopped instance resets any in-flight scroll.
    lenis.start();
    // Lenis honours the target's CSS scroll-margin-top, so no extra offset here.
    // Images above may finish loading mid-scroll and shift the page; re-aim once it lands.
    const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    lenis.scrollTo(target, {
      duration: 1.4,
      onComplete: () => {
        if (Math.abs(target.getBoundingClientRect().top - margin) > 4) lenis?.scrollTo(target, { duration: 0.5 });
      },
    });
  } else {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  }
  history.replaceState(null, "", hash);
}
