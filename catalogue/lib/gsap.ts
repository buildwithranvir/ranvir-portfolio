"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, ScrambleTextPlugin, useGSAP);
// Phones: the address bar sliding in and out resizes the viewport - don't re-measure every trigger for it (it causes jumps).
ScrollTrigger.config({ ignoreMobileResize: true });

/** Media query used with gsap.matchMedia() so every effect respects reduced motion. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { Flip, gsap, ScrollTrigger, SplitText, useGSAP };
