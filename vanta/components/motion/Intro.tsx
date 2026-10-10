"use client";

import Image from "next/image";
import { useRef } from "react";
import { intro, team, workshop } from "@/lib/content";
import { getLenis } from "@/lib/scroll";
import { gsap, INTRO_DELAY, MOTION_OK, useGSAP } from "@/lib/gsap";

const frames = [workshop[1], team[0].image, workshop[0], intro.hands, team[3].image, intro.light];

/**
 * Opening sequence, like flicking through a contact sheet: frames from the
 * studio flash in a small window while a counter runs to 100, the wordmark
 * stretches out, then the whole panel lifts away.
 */
export function Intro() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        getLenis()?.stop();
        const count = { v: 0 };
        const shots = gsap.utils.toArray<HTMLElement>(".intro-frame");
        const tl = gsap.timeline({
          onComplete: () => {
            getLenis()?.start();
            gsap.set(ref.current, { display: "none" });
          },
        });
        tl.to(count, {
          v: 100,
          duration: INTRO_DELAY - 0.5,
          ease: "power2.inOut",
          onUpdate: () => {
            const el = ref.current?.querySelector(".intro-count");
            if (el) el.textContent = String(Math.round(count.v)).padStart(3, "0");
          },
        }, 0);
        shots.forEach((s, i) => tl.set(s, { autoAlpha: 1, zIndex: i + 1 }, 0.15 + i * 0.2));
        tl.from(".intro-window", { scale: 0.6, duration: 1.2, ease: "expo.out" }, 0)
          .fromTo(".intro-word", { "--w": 50, yPercent: 40, autoAlpha: 0 }, { "--w": 150, yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out" }, 0.4)
          .to(".intro-window", { scale: 1.08, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, INTRO_DELAY - 0.55)
          .to(".intro-word, .intro-meta", { yPercent: -60, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, INTRO_DELAY - 0.5)
          .to(ref.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, INTRO_DELAY - 0.3);
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(ref.current, { display: "none" });
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="intro pointer-events-none fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden bg-ink text-porcelain"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div className="intro-window relative aspect-[3/4] w-[38vw] max-w-[13rem] overflow-hidden bg-plum md:w-[16vw]">
        {frames.map((f, i) => (
          <Image key={i} src={f.src} alt="" fill sizes="220px" priority={i < 2} className="intro-frame invisible object-cover grade" />
        ))}
      </div>
      <p className="intro-word display absolute bottom-[12vh] text-[clamp(3.5rem,13vw,10rem)] text-porcelain mix-blend-difference" style={{ ["--w" as string]: 50 }}>
        Vanta
      </p>
      <div className="intro-meta mono absolute inset-x-5 top-6 flex justify-between text-porcelain/60 md:inset-x-10">
        <span>Loading the studio</span>
        <span className="intro-count tabular-nums">000</span>
      </div>
    </div>
  );
}
