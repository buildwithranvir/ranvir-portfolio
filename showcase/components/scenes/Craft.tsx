"use client";

import { useRef } from "react";
import { sceneNo, services } from "@/lib/site";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Mark } from "@/components/ui/Mark";

function Holes() {
  return <div aria-hidden className="sprockets h-3 w-full rounded-[1px] opacity-90 md:h-3.5" />;
}

/**
 * Scene 03 - the craft. What Ranvir makes, printed frame by frame on a strip
 * of film. On larger screens the frames are dealt onto the table as you arrive
 * and each one lights up as it crosses the middle of the screen; on phones it
 * is a strip you swipe.
 */
export function Craft() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        // the frames are dealt onto the table as the section scrolls in (no pinning: the page keeps an even pace)
        gsap.from(".cr-frame", {
          y: 90,
          rotateX: -18,
          rotate: (i) => (i % 2 ? 2.5 : -2.5),
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: {
            trigger: ".cr-strip",
            start: "clamp(top 82%)",
            once: true,
          },
        });
        // each frame lights up while it crosses the middle of the screen
        gsap.utils.toArray<HTMLElement>(".cr-frame").forEach((f) => {
          ScrollTrigger.create({
            trigger: f,
            start: "top 68%",
            end: "bottom 32%",
            toggleClass: "is-lit",
          });
        });
      });
      mm.add(MOTION_OK, () => {
        gsap.from(".cr-head > *", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ref.current,
            start: "clamp(top 75%)",
            once: true,
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="craft" aria-labelledby="craft-title" className="wash tone-sky relative overflow-hidden bg-reel text-tungsten">
      <div className="flex flex-col py-20 md:py-28">
        <div className="cr-head frame mb-10 flex flex-col items-center gap-4 text-center md:flex-row md:items-end md:justify-between md:text-left lg:mb-14">
          <div>
            <p className="hud text-dust">{sceneNo("craft")} · Services</p>
            <h2 id="craft-title" className="credit mt-4 text-[clamp(1.98rem,min(3.96vw,7.2vh),3.6rem)] [--w:80]">
              What I{" "}
              <span className="voice normal-case text-amber [font-variation-settings:normal]">
                <Mark kind="under" tone="teal">
                  make
                </Mark>
              </span>
            </h2>
          </div>
          <p className="voice max-w-[30ch] text-[1.15rem] leading-snug text-dust">
            One person for the whole build: the design, the code and the automation behind it.
          </p>
        </div>

        <div className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {/* phones: a strip you swipe · desktop: the frames laid out on the table */}
          <ol className="cr-strip flex w-max snap-x snap-mandatory gap-0 px-5 md:px-10 lg:mx-auto lg:grid lg:max-w-[1560px] lg:w-full lg:snap-none lg:grid-cols-6 lg:gap-4 lg:[perspective:1400px]">
            {services.map((s, i) => (
              <li
                key={s.title}
                className="cr-frame stay-dark group w-[84vw] shrink-0 snap-center border-x border-black/60 bg-[#0e0c0a] px-3 py-3 sm:w-[62vw] lg:col-span-2 lg:w-auto lg:[&:nth-child(4)]:col-start-2"
              >
                <Holes />
                <div className="relative my-3 flex min-h-[clamp(15rem,34vh,21rem)] flex-col justify-between gap-10 overflow-hidden rounded-[3px] bg-[#1b1714] p-5 transition-[background-color] duration-700 md:p-8 lg:group-[.is-lit]:bg-[#2a221b]">
                  {/* the projector light in the gate */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgb(var(--glow-a)/0.22),transparent_65%)] opacity-60 transition-opacity duration-700 lg:opacity-0 lg:group-[.is-lit]:opacity-100"
                  />
                  <div className="hud relative flex justify-between text-dust">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>
                      {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="relative">
                    <h3 className="credit text-[clamp(1.53rem,2.52vw,2.52rem)] leading-[0.92] transition-colors duration-700 [--w:96] lg:group-[.is-lit]:text-amber">
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-[42ch] text-[0.98rem] leading-relaxed text-tungsten/80 md:text-[1.0625rem]">{s.body}</p>
                  </div>
                </div>
                <Holes />
              </li>
            ))}
          </ol>
        </div>
        <p className="hud frame mt-6 text-center text-dust lg:hidden">Swipe for more →</p>
      </div>
    </section>
  );
}
