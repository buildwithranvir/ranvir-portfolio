"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { plates } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const size = {
  tall: "h-[60vh] lg:h-[68vh]",
  square: "h-[46vh] lg:h-[54vh]",
  wide: "h-[42vh] lg:h-[48vh]",
};

/**
 * The campaign as a horizontal film strip. On large screens the page pins and
 * scrolls sideways: plates lean with the speed of the scroll, each photograph
 * settles out of a zoom as it crosses, and a ghosted title drifts behind at
 * half speed. Phones and reduced motion get a native swipe strip.
 */
export function Lookbook() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const el = track.current!;
        gsap.set(".lb-viewport", { overflowX: "hidden" });
        const distance = () => el.scrollWidth - window.innerWidth;
        const skew = gsap.quickTo(".lb-plate", "skewX", { duration: 0.5, ease: "power3.out" });
        const clamp = gsap.utils.clamp(-3.5, 3.5);

        const move = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => skew(clamp(self.getVelocity() / -400)),
            onScrubComplete: () => skew(0),
          },
        });

        gsap.to(".lb-ghost", { xPercent: -35, ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        gsap.to(".lb-progress", { scaleX: 1, ease: "none", scrollTrigger: { trigger: section.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });

        gsap.utils.toArray<HTMLElement>(".lb-plate").forEach((plate, i) => {
          gsap.fromTo(
            plate.querySelector("img"),
            { scale: 1.12, xPercent: 5 },
            { scale: 1, xPercent: 0, ease: "none", scrollTrigger: { trigger: plate, containerAnimation: move, start: "left right", end: "center center", scrub: true } },
          );
          gsap.from(plate.querySelector("figcaption"), {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: plate, containerAnimation: move, start: "left 70%", toggleActions: "play none none reverse" },
          });
          ScrollTrigger.create({ trigger: plate, containerAnimation: move, start: "left center", end: "right center", onToggle: (self) => self.isActive && setCurrent(i) });
        });
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} id="lookbook" data-theme="plum" aria-label="Hard light, the campaign" className="relative overflow-hidden">
      <p aria-hidden className="lb-ghost display pointer-events-none absolute will-change-transform left-0 top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-[30vh] text-fg/[0.05] [--w:150] lg:block">
        Hard light · Hard light · Hard light
      </p>

      {/* Phones and tablets: heading sits above a swipe strip */}
      <div className="wrap pt-24 lg:hidden">
        <p className="mono text-fg/50">03 / The campaign</p>
        <h2 className="display mt-4 text-[clamp(3rem,13vw,5.5rem)] [--w:120]">
          Hard <span className="serif-i normal-case text-acid">light</span>
        </h2>
        <p className="mt-5 max-w-[40ch] text-[1.0625rem] leading-relaxed text-fg/70">
          Eight plates, one afternoon, an empty plaster studio and a <mark className="hl">single window</mark>. Nothing retouched beyond the grade.
        </p>
        <p className="mono mt-6 text-fg/45">Swipe the plates →</p>
      </div>

      <div className="lb-viewport relative snap-x snap-mandatory scroll-pl-5 overflow-x-auto [scrollbar-width:none] md:scroll-pl-10 lg:flex lg:h-[100svh] lg:snap-none lg:items-center">
        <div ref={track} className="flex w-max will-change-transform items-center gap-5 px-5 pb-24 pt-8 md:px-10 lg:gap-16 lg:py-0 lg:pr-[12vw]">
          <header className="hidden w-[34vw] shrink-0 flex-col justify-between gap-10 self-stretch py-[14vh] lg:flex">
            <p className="mono text-fg/50">03 / The campaign</p>
            <div>
              <h2 className="display text-[clamp(3.4rem,7vw,7rem)] [--w:120]">
                Hard <span className="serif-i normal-case text-acid">light</span>
              </h2>
              <p className="mt-6 max-w-[34ch] text-[1.0625rem] leading-relaxed text-fg/70">
                Eight plates, one afternoon, an empty plaster studio and a <mark className="hl">single window</mark>. Nothing
                retouched beyond the grade.
              </p>
            </div>
            <p className="mono hidden items-center gap-3 text-fg/50 lg:flex">
              <span className="tabular-nums text-fg">{String(current + 1).padStart(2, "0")}</span>
              <span className="block h-px w-10 bg-fg/30" />
              <span className="tabular-nums">{String(plates.length).padStart(2, "0")}</span>
              <span className="ml-3">Keep scrolling →</span>
            </p>
          </header>

          {plates.map((p, i) => (
            <figure
              key={p.credit}
              data-cursor="Look"
              className={`lb-plate relative shrink-0 snap-start overflow-hidden rounded-[4px] will-change-transform [&_img]:will-change-transform ${i % 2 ? "lg:mb-[10vh] lg:self-end" : "lg:mt-[10vh] lg:self-start"}`}
            >
              <Image src={p.src} alt={p.alt} placeholder="blur" sizes="(min-width: 1024px) 34vw, 80vw" className={`grade w-auto max-w-none ${size[p.shape]}`} />
              <figcaption className="glass absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-full px-4 py-2 text-porcelain">
                <span className="serif-i text-[1rem]">{p.caption}</span>
                <span className="mono shrink-0 text-porcelain/60">{p.credit}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div aria-hidden className="absolute inset-x-10 bottom-10 hidden h-px bg-fg/15 lg:block">
        <div className="lb-progress h-px origin-left scale-x-0 bg-acid" />
      </div>
    </section>
  );
}
