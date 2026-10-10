"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/** Media query used with gsap.matchMedia() so every effect respects reduced motion. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Seconds the intro curtain stays down. The hero timeline waits for it. */
export const INTRO_DELAY = 1.7;

export { gsap, ScrollTrigger, SplitText, useGSAP };
