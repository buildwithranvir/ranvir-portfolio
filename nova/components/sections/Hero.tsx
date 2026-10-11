"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { DotField } from "../DotField";
import { AnchorLink } from "../ui/AnchorLink";

const readout = [
  ["field", "4,212 nodes"],
  ["input", "pointer"],
  ["latency", "16 ms"],
];

/**
 * The hero is an instrument: a live dot field, a headline set in two widths,
 * and glass readouts layered on top. Nothing here is a stock gradient blob.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".hero-line", { type: "chars", mask: "chars" });
        const tl = gsap.timeline();
        tl.from(".hero-field", { opacity: 0, duration: 1.2, ease: "power2.out" }, 0)
          .from(split.chars, { yPercent: 105, duration: 0.7, ease: "power4.out", stagger: { each: 0.018, from: "random" } }, 0.15)
          .from(".hero-panel", { y: 24, opacity: 0, filter: "blur(10px)", duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.6)
          .to(".hero-scramble", { duration: 1.2, scrambleText: { text: "{original}", chars: "01/<>_", speed: 0.6 } }, 0.5);

        gsap.to(".hero-type", {
          yPercent: -18,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div className="hero-field absolute inset-0 -z-10">
        <DotField />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-void to-transparent" />

      <div className="frame flex min-h-[100svh] flex-col justify-end pb-10 pt-28 md:pb-14">
        <p className="hero-scramble mono mb-6 text-signal">Design & creative technology studio · est. 2015</p>
        <h1 id="hero-title" className="hero-type pointer-events-none leading-[0.84]">
          <span className="hero-line wide block text-[clamp(3.4rem,12.5vw,13rem)]">Curious</span>
          <span className="hero-line condensed block text-[clamp(2.6rem,9vw,9.5rem)] text-mist">
            software, <span className="text-ice">made by hand.</span>
          </span>
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-12">
          <div className="hero-panel glass rounded-2xl p-5 md:col-span-8 lg:col-span-5">
            <p className="text-[1.0625rem] leading-relaxed text-ice/85">
              We&rsquo;re fourteen designers and engineers in one room. We make websites, brand systems and interactive
              work for companies that would rather be specific than safe.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <AnchorLink href="#work" data-cursor="Work" className="flex h-11 items-center gap-2 rounded-lg bg-signal px-4 font-semibold text-void transition-transform duration-300 ease-snap hover:-translate-y-0.5">
                See selected work ↓
              </AnchorLink>
              <AnchorLink href="#contact" className="flex h-11 items-center rounded-lg border border-white/15 px-4 transition-colors hover:bg-white/[0.06]">
                Start a project
              </AnchorLink>
            </div>
          </div>
          <dl className="hero-panel glass mono hidden self-end rounded-2xl p-5 text-mist lg:col-span-3 lg:col-start-10 lg:block">
            {readout.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-white/10 py-1.5 last:border-0">
                <dt>{k}</dt>
                <dd className="text-ice">{v}</dd>
              </div>
            ))}
            <p className="mt-3 text-dim">
              move your cursor <span className="blink text-signal">▌</span>
            </p>
          </dl>
        </div>
      </div>
    </section>
  );
}
