"use client";

import { useRef } from "react";
import { beans } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Drift } from "../motion/Reveal";
import { Eyebrow } from "../ui/Eyebrow";

const tilt = ["-rotate-[2.5deg]", "rotate-[1.5deg] lg:mt-16", "-rotate-1 lg:mt-6"];

/** This week's coffees as kraft bag labels — the coffee itself, not another cup photo. */
export function Beans() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".bean-label", {
          y: 70,
          opacity: 0,
          rotate: 0,
          duration: 2,
          ease: "sine.out",
          stagger: 0.18,
          scrollTrigger: { trigger: ".bean-labels", start: "top 80%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="beans" aria-labelledby="beans-title" className="panel relative mx-2 overflow-hidden rounded-[24px] bg-olive py-24 text-milk md:mx-4 md:rounded-[28px] md:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-oat/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-burgundy/30 blur-3xl" />
      <div className="wrap relative grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Eyebrow n="02" tone="light">On the bar this week</Eyebrow>
          <Drift as="h2" id="beans-title" className="mt-5 text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]">
            Three coffees, roasted here on Tuesday.
          </Drift>
          <Drift className="mt-6 max-w-[36ch] text-milk/75">
            We buy from three farms at a time and pay them directly. When a lot runs out, it&rsquo;s gone until next harvest. Bags
            are on the shelf by the door.
          </Drift>
          <dl className="glass-dark mt-10 max-w-[22rem] rounded-[16px] px-5 py-4 text-[0.875rem]">
            {[
              ["Bags", "250 g, whole bean"],
              ["Price", "€14 – €19"],
              ["Grind", "Ask us, free"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-milk/10 py-2 last:border-0">
                <dt className="text-milk/60">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="note mt-5 !text-oat">the Huila goes fastest →</p>
        </div>

        <ul className="bean-labels grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-8 lg:gap-6">
          {beans.map((b, i) => (
            <li key={b.name} className={`bean-label mx-auto w-full max-w-[24rem] sm:max-w-none ${tilt[i]}`}>
              <article className="relative rounded-[10px] bg-[#d9c6a2] p-5 text-ink shadow-[0_24px_40px_-22px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-slow hover:-translate-y-2 hover:rotate-0">
                <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                  <span className="font-display text-lg leading-none">Noir</span>
                  <span className="label text-[0.5625rem]">Lot {String(i + 41).padStart(3, "0")}</span>
                </div>
                <p className="label mt-4 text-[0.625rem] text-ink-soft">
                  {b.country} · {b.region}
                </p>
                <h3 className="mt-1 text-[1.75rem] leading-none">{b.name}</h3>
                <dl className="mt-5 grid grid-cols-2 gap-y-2 border-y border-ink/30 py-3 text-[0.8125rem]">
                  <dt className="text-ink-soft">Process</dt>
                  <dd className="text-right">{b.process}</dd>
                  <dt className="text-ink-soft">Altitude</dt>
                  <dd className="text-right">{b.altitude}</dd>
                  <dt className="text-ink-soft">Best as</dt>
                  <dd className="text-right">{b.use}</dd>
                </dl>
                <p className="note mt-4 !text-[1.35rem] !text-ink">{b.notes.join(", ")}</p>
                <p className="label mt-4 text-[0.5625rem] text-ink-soft">Roasted {b.roasted}</p>
                <span aria-hidden className="absolute -bottom-3 -right-2 flex h-12 w-12 rotate-12 items-center justify-center rounded-full border-2 border-burgundy/70 text-center text-[0.5rem] font-semibold uppercase leading-tight tracking-wider text-burgundy/80">
                  Fresh
                  <br />
                  roast
                </span>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
