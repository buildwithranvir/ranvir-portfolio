"use client";

import { useRef, useState } from "react";
import { capabilities } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Capabilities as four glass columns. The active one widens to show its detail;
 * below desktop width they stack in a grid and every detail is visible.
 */
export function Capabilities() {
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Phones and tablets: the card crossing the middle of the screen is the "active" one
      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>(".cap").forEach((el, i) => {
          ScrollTrigger.create({ trigger: el, start: "top 60%", end: "bottom 40%", onToggle: (self) => self.isActive && setActive(i) });
        });
      });
      mm.add(MOTION_OK, () => {
        gsap.from(".cap-intro", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".cap-intro", start: "clamp(top 88%)", once: true } });
        // each card wipes up into place, then its tags pop in
        gsap.utils.toArray<HTMLElement>(".cap").forEach((el, i) => {
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: "clamp(top 88%)", once: true }, delay: window.innerWidth >= 1024 ? i * 0.08 : 0 })
            .fromTo(el, { clipPath: "inset(100% 0% 0% 0% round 16px)", y: 40 }, { clipPath: "inset(0% 0% 0% 0% round 16px)", y: 0, duration: 1, ease: "power4.out", clearProps: "clipPath" })
            .from(el.querySelectorAll(".cap-tool"), { scale: 0.6, opacity: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.06 }, 0.45);
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="capabilities" aria-labelledby="cap-title" className="grid-bg relative py-24 md:py-32">
      <div className="frame">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="cap-title" className="reveal-title wide text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9]">
            What we make
          </h2>
          <p className="cap-intro max-w-[40ch] text-mist">Four disciplines, one team. Most projects use at least two.</p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:h-[30rem] lg:flex-row">
          {capabilities.map((c, i) => {
            const on = i === active;
            return (
              <li
                key={c.id}
                onMouseEnter={() => setActive(i)}
                className={`cap glass overflow-hidden rounded-2xl transition-[flex-grow,background-color,border-color,box-shadow] duration-700 ease-snap ${on ? "max-lg:border-signal/50 max-lg:shadow-[0_0_40px_-12px_rgb(255_90_31/0.45)]" : ""} lg:min-w-0 ${on ? "lg:grow-[3]" : "lg:grow"}`}
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  aria-expanded={on}
                  className="flex h-full w-full flex-col justify-between p-5 text-left lg:p-6"
                >
                  <span className="flex items-center justify-between">
                    <span className={`mono transition-colors ${on ? "text-signal" : "text-mist"}`}>{c.id}</span>
                    <span aria-hidden className={`h-2 w-2 rounded-full transition-colors ${on ? "bg-signal" : "bg-white/15"}`} />
                  </span>
                  <span className="mt-10 block lg:mt-0">
                    <span className={`condensed block text-[clamp(1.8rem,3vw,2.8rem)] lg:whitespace-nowrap leading-none transition-colors ${on ? "text-ice" : "text-ice/80 lg:text-mist"}`}>{c.name}</span>
                    <span className={`block overflow-hidden transition-[max-height,opacity] duration-700 ease-snap lg:max-h-0 lg:opacity-0 ${on ? "lg:max-h-60 lg:opacity-100" : ""}`}>
                      <span className="mt-4 block max-w-[36ch] text-ice/80">{c.detail}</span>
                      <span className="mono mt-4 flex flex-wrap gap-1.5">
                        {c.tools.map((t) => (
                          <span key={t} className="cap-tool rounded-md border border-white/15 px-2 py-1 text-mist">{t}</span>
                        ))}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
