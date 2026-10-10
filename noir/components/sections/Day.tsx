"use client";

import { useRef } from "react";
import { day } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Drift, Photo } from "../motion/Reveal";
import { Eyebrow } from "../ui/Eyebrow";

// A gentle up-and-down rhythm along the row, so it reads like a timeline, not a grid.
const offset = ["", "lg:mt-16", "lg:mt-6", "lg:mt-20", "lg:mt-2"];

export function Day() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".day-line",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".day-list", start: "top 85%", end: "bottom 60%", scrub: true } },
        );
        gsap.from(".day-dot", {
          scale: 0,
          duration: 0.8,
          ease: "back.out(2)",
          stagger: 0.15,
          scrollTrigger: { trigger: ".day-list", start: "top 80%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="day" aria-labelledby="day-title" className="relative pb-24 pt-24 md:pb-32 md:pt-32">
      <div className="wrap">
        <Eyebrow n="01">The day</Eyebrow>
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <Drift as="h2" id="day-title" className="text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05] lg:col-span-6">
            A day at Noir, from the first roast to the last pour.
          </Drift>
          <Drift className="max-w-[38ch] self-end text-ink-soft lg:col-span-4 lg:col-start-9">
            Most of what happens here happens before you arrive. Here&rsquo;s a Tuesday, roughly as it goes.
          </Drift>
        </div>

        <div className="relative mt-16 md:mt-20">
          <span aria-hidden className="day-line absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-ink/25 lg:block" />
          <ol className="day-list grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-6 md:gap-y-14 lg:grid-cols-5 lg:gap-x-5">
            {day.map((m, i) => (
              <li key={m.time} className={`${i === 4 ? "col-span-2" : ""} ${i < 3 ? "md:col-span-2" : "md:col-span-3"} lg:col-span-1`}>
                <span aria-hidden className="day-dot relative mb-6 hidden h-[15px] w-[15px] rounded-full border-2 border-ink/40 bg-paper lg:block">
                  <span className="absolute inset-[3px] rounded-full bg-burgundy" />
                </span>
                <figure className={offset[i]}>
                  <Photo src={m.photo.src} alt={m.photo.alt} sizes="(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 50vw" className={i === 4 ? "aspect-[16/10] md:aspect-[4/3] lg:aspect-[4/5]" : i > 2 ? "aspect-[4/5] md:aspect-[4/3] lg:aspect-[4/5]" : "aspect-[4/5]"}>
                    <time className="glass absolute left-2 top-2 rounded-full px-2.5 py-1 font-display text-[0.95rem] sm:left-3 sm:top-3 sm:px-3 sm:text-[1.05rem] leading-none tabular-nums">
                      {m.time}
                    </time>
                  </Photo>
                  <figcaption className="mt-4">
                    <span className="block font-semibold">{m.title}</span>
                    <span className="mt-1 block max-w-[40ch] text-[0.8125rem] leading-relaxed text-ink-soft sm:text-[0.9rem]">{m.text}</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
