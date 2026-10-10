"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, useGSAP);

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Seconds the counter intro runs before the hero plays. */
export const INTRO_DELAY = 1.8;

export { gsap, ScrollTrigger, SplitText, useGSAP };
