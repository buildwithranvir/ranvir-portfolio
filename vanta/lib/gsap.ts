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

/** Seconds the opening sequence runs. The hero timeline waits for it. */
export const INTRO_DELAY = 2.1;

export { gsap, ScrollTrigger, SplitText, useGSAP };
