"use client";

import Image from "next/image";
import { useRef } from "react";
import { backIssues } from "@/lib/content";
import { scrollToHash } from "@/lib/scroll";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Stretch } from "../motion/Reveal";
import { useShop } from "../ShopContext";

/**
 * Back issues as a deck of covers. On large screens the deck sits stacked in
 * the middle and deals itself out into a row as you scroll. Choosing an issue
 * filters The Edit.
 */
export function Issues() {
  const { setFilter } = useShop();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".cover");
        const row = ref.current!.querySelector<HTMLElement>(".covers")!;
        // offsetLeft ignores transforms, so this stays right after a refresh mid-animation
        const toCentre = (el: HTMLElement) => row.offsetWidth / 2 - (el.offsetLeft + el.offsetWidth / 2);
        gsap.from(cards, {
          x: (_, el) => toCentre(el as HTMLElement),
          y: (i) => i * -10,
          rotate: (i) => (i - 1.5) * 7,
          ease: "none",
          scrollTrigger: { trigger: row, start: "top 100%", end: "top 72%", scrub: 0.5, invalidateOnRefresh: true },
        });
      });
      mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => {
        gsap.from(".cover", { y: 60, rotate: (i) => (i % 2 ? 6 : -6), opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".covers", start: "top 85%", once: true } });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="issues" data-theme="dark" aria-labelledby="issues-title" className="relative py-24 md:py-36">
      <div className="wrap">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mono text-fg/50">05 / The archive</p>
            <Stretch id="issues-title" width={92} className="mt-4 text-[clamp(2.8rem,7vw,6.8rem)]">
              Still <span className="serif-i normal-case">in print</span>
            </Stretch>
          </div>
          <p className="max-w-[36ch] text-[1.0625rem] leading-relaxed text-fg/70">
            We never retire a piece. Pick an issue to see what&rsquo;s <mark className="hl">still made</mark> from it.
          </p>
        </div>

        <ul className="covers relative mt-14 grid grid-cols-2 max-[359px]:grid-cols-1 gap-x-4 gap-y-10 md:mt-20 lg:grid-cols-4 lg:gap-6">
          {backIssues.map((b, i) => (
            <li key={b.n} className="cover relative" style={{ zIndex: backIssues.length - i }}>
              <button
                type="button"
                data-cursor="Filter"
                onClick={() => {
                  setFilter(b.filter);
                  scrollToHash("#edit");
                }}
                className="group block w-full text-left"
                aria-label={`Issue ${b.n}, ${b.title}: show pieces from this collection`}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-plum shadow-[0_30px_50px_-30px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out-expo group-hover:-translate-y-3 group-hover:rotate-[-1.5deg]">
                  <Image src={b.image.src} alt={b.image.alt} fill placeholder="blur" sizes="(min-width: 1024px) 24vw, 50vw" className="mono-grade object-cover object-top transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105" />
                  <div aria-hidden className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-ink/70 to-transparent" />
                  <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-between p-3 text-porcelain md:p-4">
                    <div className="flex items-start justify-between">
                      <span className="display text-[clamp(1.3rem,2.6vw,2.2rem)] [--w:150] transition-[font-variation-settings] duration-700 group-hover:[--w:60]">Vanta</span>
                      <span className="mono">Nº {b.n}</span>
                    </div>
                    <span className="serif-i text-[clamp(1.4rem,2.6vw,2.3rem)] leading-none">{b.title}</span>
                  </div>
                </div>
                <p className="mono mt-3 flex justify-between text-fg/60">
                  <span>{b.season}</span>
                  <span className="draw-link">{b.pieces} pieces →</span>
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
