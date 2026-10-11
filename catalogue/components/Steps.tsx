"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { shop } from "@/lib/site";
import { onColor } from "@/lib/templates";

const steps = [
  {
    paint: shop.tomato,
    title: "Pick a colour",
    body: "Browse the deck below and choose the template that feels most like your business.",
  },
  {
    paint: shop.sun,
    title: "Tell me about your business",
    body: "Send me a message on WhatsApp: what you do, who it is for, and what the site needs to do.",
  },
  {
    paint: shop.mint,
    title: "I rebuild it for you",
    body: "Your name, words, colours and photos, on pages that work on every phone. You check it before it goes live.",
  },
];
const tilt = [-3, 2, -1.5];

/** How it works: three chips dropped on the counter as you arrive. */
export function Steps() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".st-head > *", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "clamp(top 78%)", once: true },
        });
        gsap.utils.toArray<HTMLElement>(".st-card").forEach((card, i) => {
          gsap.from(card, {
            x: i % 2 ? 140 : -140,
            y: 60,
            rotate: i % 2 ? 14 : -14,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
            delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: card, start: "clamp(top 90%)", once: true },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="how" aria-labelledby="how-title" className="relative overflow-x-clip bg-counter py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="st-head flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mono text-dust">How it works</p>
            <h2 id="how-title" className="display mt-3 text-[min(13vw,6.5rem,16svh)]">
              Three steps,
              <br />
              <span className="text-cobalt">one new site.</span>
            </h2>
          </div>
          <p className="max-w-[36ch] text-[1.1rem] leading-relaxed text-ink/75">
            Every template here is a starting point. The finished site is yours: your business, your story, your colours.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} className="st-card" style={{ transform: `rotate(${tilt[i]}deg)` }}>
              <div className="chip min-h-[19rem] md:min-h-[23rem]" style={{ "--paint": s.paint } as CSSProperties}>
                <div className="flex flex-1 flex-col justify-between p-5 md:p-6" style={{ color: onColor(s.paint) }}>
                  <span className="mono">Step</span>
                  <span className="display text-[6.5rem] leading-[0.8] md:text-[7.5rem]">0{i + 1}</span>
                </div>
                <div className="chip-label px-5 pb-5 pt-4 md:px-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="display text-[1.9rem] leading-[0.95]">{s.title}</h3>
                    <span aria-hidden className="chip-hole mt-1 shrink-0" />
                  </div>
                  <p className="mt-2 text-[1rem] leading-relaxed text-ink/75">{s.body}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
