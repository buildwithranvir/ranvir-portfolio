"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger
 * and Lenis never disagree about the scroll position.
 * Skipped entirely for visitors who prefer reduced motion.
 */
export function SmoothScroll() {
  // Accordions, filters and form messages change the page height after
  // ScrollTrigger has measured it — re-measure (debounced) whenever that happens.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let lastHeight = document.body.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastHeight) < 2) return;
      lastHeight = h;
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 250);
    });
    ro.observe(document.body);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // One constant smoothing factor: the page follows the wheel at an even,
    // predictable pace, with no long tail. Touch keeps the phone's own native scroll.
    const lenis = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 0.95,
      touchMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
