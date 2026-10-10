"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Phones show/hide their address bar while scrolling; don't re-measure the page for that (it causes a jump).
ScrollTrigger.config({ ignoreMobileResize: true });

/** Media query used with gsap.matchMedia() so every effect respects reduced motion. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Seconds the intro (the folding screen) runs. The hero timeline waits for it. */
export const INTRO_DELAY = 1.55;

/**
 * Standard entrance trigger. clamp() keeps the start inside the scrollable range,
 * so something at the very bottom of the page still plays and never stays hidden.
 */
export const enter = (trigger: Element | string | null, at = "88%") => ({ trigger, start: `clamp(top ${at})`, once: true });

export { gsap, ScrollTrigger, SplitText, useGSAP };
