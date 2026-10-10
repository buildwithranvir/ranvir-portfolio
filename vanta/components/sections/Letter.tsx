"use client";

import Image from "next/image";
import { useRef } from "react";
import { letter } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * Letter from the founder, set as an actual letter: a sheet of paper on the
 * dark page, a drop cap, a pull quote, and a signature that writes itself in.
 * It plays once as it arrives; nothing is tied to the scroll position.
 */
export function Letter() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The portrait reveals on its own (on phones it sits above the letter)
        gsap
          .timeline({ scrollTrigger: { trigger: ".letter-portrait", start: "top 82%", once: true } })
          .from(".letter-portrait", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 0)
          .from(".letter-portrait img", { scale: 1.12, duration: 1.8, ease: "expo.out" }, 0);
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: ".letter-card", start: "top 78%", once: true } });
        tl.from(".letter-card", { y: 90, rotate: 2.5, opacity: 0, duration: 1.4 }, 0)
          .from(".letter-body > *", { y: 22, opacity: 0, duration: 1, stagger: 0.12 }, 0.35)
          .fromTo(".letter-sign", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power2.inOut" }, 1.1)
          .from(".letter-stamp", { scale: 0, rotate: -90, duration: 1.2, ease: "back.out(1.7)" }, 1.3);
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="letter" data-theme="dark" aria-labelledby="letter-title" className="relative py-24 md:py-36">
      <div className="wrap grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-8">
        <figure className="lg:sticky lg:top-28 lg:col-span-4">
          <div className="letter-portrait relative mx-auto aspect-[4/5] w-[72%] max-w-[22rem] overflow-hidden rounded-[4px] lg:w-full lg:max-w-none">
            <Image src={letter.portrait.src} alt={letter.portrait.alt} fill placeholder="blur" sizes="(min-width: 1024px) 30vw, 72vw" className="object-cover grayscale" />
          </div>
          <figcaption className="mono mt-4 flex items-center justify-center gap-3 text-fg/55 lg:justify-start">
            <span aria-hidden className="letter-stamp grid h-9 w-9 shrink-0 place-items-center rounded-full bg-acid text-ink">✶</span>
            {letter.signature}
          </figcaption>
        </figure>

        <article className="letter-card relative rounded-[6px] bg-porcelain p-6 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:p-9 md:p-12 lg:col-span-8">
          <header className="mono flex flex-wrap justify-between gap-2 border-b border-ink/15 pb-4 text-ink/55">
            <span>02 / A letter from the founder</span>
            <span>Port District, spring 2026</span>
          </header>

          <h2 id="letter-title" className="serif-i mt-7 text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95]">
            {letter.title}
          </h2>

          <div className="letter-body mt-7 space-y-5 text-[1.0625rem] leading-[1.7] text-ink/80 md:text-[1.125rem]">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-[family-name:var(--font-display)] first-letter:text-[4.6rem] first-letter:font-extrabold first-letter:leading-[0.78] first-letter:text-ink first-letter:[font-variation-settings:'wdth'_120]">
              We started VANTA in 2014 with one black coat and a promise to ourselves: make <mark className="hl">fewer things</mark>, make them{" "}
              <mark className="hl">slowly</mark>, and make them to be worn for a decade.
            </p>
            <p>
              Twelve years later, every piece still begins on the same cutting table. We sample <mark className="hl">by hand</mark>, produce
              in runs small enough to know every workshop by name, and never put anything on sale. If a piece sells out, we make it again.
            </p>
            <blockquote className="my-8 border-l-[3px] border-ink py-1 pl-5">
              <p className="serif-i text-[clamp(1.5rem,2.6vw,2.2rem)] leading-[1.15] text-ink">&ldquo;{letter.pull}&rdquo;</p>
            </blockquote>
            <p>{letter.paragraphs[2]}</p>
            <div className="flex flex-wrap items-end justify-between gap-4 pt-4">
              <div>
                <p className="mono text-ink/50">With love from the cutting table,</p>
                <p className="letter-sign serif-i mt-1 text-[clamp(2.6rem,5vw,3.6rem)] leading-none text-ink">Mara</p>
              </div>
              <p className="mono text-ink/50">Mara Okonkwo · Founder</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
