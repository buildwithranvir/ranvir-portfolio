"use client";

import Image from "next/image";
import { useRef } from "react";
import hero from "@/public/images/n-hero.jpg";
import pourover from "@/public/images/n-pourover.jpg";
import { specials } from "@/lib/content";
import { gsap, INTRO_DELAY, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { useToday } from "@/lib/today";
import { Photo } from "../motion/Reveal";
import { AnchorLink } from "../ui/AnchorLink";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { day } = useToday();
  const special = day >= 0 ? specials[day] : null;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".hero-title", { type: "lines", linesClass: "split-line", mask: "lines" });
        const tl = gsap.timeline({ delay: INTRO_DELAY - 0.2, defaults: { ease: "power3.out" } });
        tl.from(".masthead > *", { opacity: 0, y: -8, duration: 1, stagger: 0.08 }, 0)
          .from(split.lines, { yPercent: 100, opacity: 0, duration: 1.3, stagger: 0.12 }, 0.15)
          .from(".hero-photo", { y: 50, opacity: 0, scale: 0.96, duration: 1.6 }, 0.2)
          .from(".hero-inset", { y: 50, opacity: 0, rotate: -6, duration: 1.4 }, 0.9)
          .from(".hero-chip", { opacity: 0, y: 12, duration: 1, stagger: 0.15 }, 1.2)
          .from(".hero-copy", { opacity: 0, y: 14, duration: 1.2, stagger: 0.12 }, 0.6)
          .from(".hero-note", { opacity: 0, rotate: -9, y: -16, duration: 1.4, ease: "back.out(1.4)" }, 1.3)
          .from(".hero-fact", { opacity: 0, y: 16, duration: 1, stagger: 0.1 }, 1.1)
          .from(".hero-cue", { opacity: 0, duration: 1 }, 1.8);

        // The small print drifts slower than the page — a quiet, papery parallax.
        gsap.to(".hero-inset", {
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative overflow-x-clip pt-24 md:pt-28">
      <div aria-hidden className="glow -right-20 top-24 h-[28rem] w-[28rem] bg-oat" />
      <div aria-hidden className="glow -left-32 top-[55%] h-[22rem] w-[22rem] bg-burgundy/40" />
      <div className="wrap relative">
        {/* Masthead — reads like the top of a printed menu */}
        <div className="masthead label grid grid-cols-2 gap-y-2 border-y border-ink/20 py-3 text-ink-soft max-[360px]:text-[0.625rem] max-[360px]:tracking-[0.06em] md:grid-cols-4">
          <span>Nº 27 Alder Lane</span>
          <span className="text-right md:text-left">Kaffebar &amp; Bageri</span>
          <span>Est. 2017</span>
          <span className="text-right">Roast day · Tuesday</span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-12 md:mt-14 lg:grid-cols-12 lg:items-start lg:gap-x-10 lg:gap-y-8">
          <div className="flex flex-col lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:pt-2">
            <h1 id="hero-title" className="hero-title text-[clamp(2.6rem,5vw,4.6rem)] leading-[1.02] tracking-[-0.015em]">
              Slow coffee for long mornings.
            </h1>
            <p className="hero-copy mt-6 max-w-[34ch] text-[1.0625rem] leading-relaxed text-ink-soft">
              A small café and bakery in the Old Market Quarter. We roast on Tuesdays, bake before sunrise, and keep the long
              table by the window free for anyone who wants it.
            </p>
            <div className="hero-copy mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <AnchorLink href="#menu" className="ink-link text-[1.0625rem]">
                See today&rsquo;s menu
              </AnchorLink>
              <AnchorLink href="#book" className="btn">
                Book the long table
                <span aria-hidden className="btn-arrow">
                  <span>→</span>
                </span>
              </AnchorLink>
            </div>

          </div>

          <div className="relative w-full lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center lg:pl-6">
            <Photo
              src={hero}
              alt="Inside the café: a concrete floor, bicycles hung on the wall and a blackboard menu above the bar"
              priority
              reveal={false}
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="hero-photo aspect-[5/4] !rounded-[22px] md:aspect-[16/10] lg:aspect-[5/4]"
              imgClassName="object-[60%_50%]"
            >
              <p className="hero-chip glass absolute right-3 top-3 max-w-[14rem] rounded-[12px] px-3.5 py-2.5 text-[0.8125rem] leading-snug md:right-4 md:top-4">
                <span className="label block text-[0.625rem] text-ink-soft">Saturday, 08:40</span>
                The brew bar, ten minutes before the queue.
              </p>
              <p className="hero-chip glass absolute bottom-3 right-3 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.75rem] md:bottom-4 md:right-4">
                <span aria-hidden className="h-1.5 w-1.5 animate-pulse rounded-full bg-olive-soft" />
                Roasted here, every Tuesday
              </p>
            </Photo>
            <figure className="hero-inset photo absolute -bottom-10 left-2 w-[36%] !rounded-[16px] border-[5px] border-milk md:-bottom-12 md:-left-4 md:w-[30%]">
              <Image src={pourover} alt="A barista preparing a row of pour-over coffees" placeholder="blur" sizes="(min-width: 1024px) 14vw, 36vw" className="h-auto w-full" />
              <figcaption className="sr-only">Pour-overs on the bar</figcaption>
            </figure>
          </div>

          {/* Today's special — a pencil note pinned to the page */}
          <aside
            aria-label="Today's special"
            className="hero-note relative mt-14 w-full max-w-[19rem] -rotate-2 self-start rounded-[6px] md:mt-16 lg:col-start-1 lg:row-start-2 lg:mt-0 bg-milk px-6 pb-5 pt-6 shadow-[0_14px_30px_-18px_rgba(34,22,15,0.5)]"
          >
            <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-2 bg-oat/70" />
            <p className="label text-ink-soft">{special ? `${special.day}'s special` : "Today's special"}</p>
            <p className="note mt-2">{special ? special.item : "Ask at the bar — it changes daily"}</p>
            {special && special.price !== "—" && special.price !== "0.00" && <p className="mt-3 text-sm tabular-nums">€{special.price}</p>}
          </aside>
        </div>

        {/* House facts on frosted glass, with a quiet scroll cue */}
        <div className="mt-14 flex flex-col gap-6 md:mt-24 md:flex-row md:items-end md:justify-between">
          <dl className="grid grid-cols-3 gap-2 sm:gap-3 md:w-[34rem]">
            {[
              ["40", "seats, one long table"],
              ["3", "farms, paid directly"],
              ["05:40", "first roast, Tuesdays"],
            ].map(([k, v]) => (
              <div key={v} className="hero-fact glass rounded-[18px] px-3 py-3.5 sm:px-4">
                <dt className="sr-only">{v}</dt>
                <dd>
                  <span className="block font-display text-[1.4rem] leading-none tabular-nums max-[340px]:text-[1.05rem] sm:text-[1.6rem]">{k}</span>
                  <span className="mt-1.5 block text-[0.75rem] leading-snug text-ink-soft max-[340px]:text-[0.6875rem]">{v}</span>
                </dd>
              </div>
            ))}
          </dl>
          <AnchorLink href="#day" className="hero-cue label hidden items-center gap-3 text-ink-soft md:flex">
            <span className="relative block h-10 w-6 rounded-full border border-ink/30">
              <span className="float-soft absolute left-1/2 top-2 block h-2 w-0.5 -translate-x-1/2 rounded-full bg-ink/60" />
            </span>
            Scroll for the day
          </AnchorLink>
        </div>
      </div>
    </section>
  );
}
