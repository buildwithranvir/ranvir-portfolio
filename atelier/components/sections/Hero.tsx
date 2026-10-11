"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { facts, hero, type Img } from "@/lib/content";
import { gsap, INTRO_DELAY, MOTION_OK, useGSAP } from "@/lib/gsap";
import { FoldText, Mark } from "../motion/Fold";
import { AnchorLink } from "../ui/AnchorLink";

const swatches = ["bg-cobalt", "bg-terracotta", "bg-ochre", "bg-verdigris"];

/**
 * One leaf of the folding screen. Each leaf hangs off the right edge of the
 * one before it and turns the opposite way, so together they zig-zag like
 * a paper partition. A single --f (degrees) sets how far the screen is folded.
 */
function Leaf({ items, i }: { items: Img[]; i: number }) {
  const img = items[i];
  const turn = i === 0 ? "rotateY(calc(var(--f) * 1deg))" : `rotateY(calc(var(--f) * ${i % 2 ? -2 : 2}deg))`;
  return (
    <div className={`preserve ${i ? "absolute left-full top-0" : "relative"} w-[var(--pw)]`} style={{ transform: turn, transformOrigin: "0% 50%" }}>
      <figure className="relative aspect-[3/4.4] overflow-hidden bg-ink outline outline-1 -outline-offset-1 outline-ink/20">
        <Image src={img.src} alt={img.alt} fill priority sizes="(min-width: 1024px) 10vw, 24vw" className="grade object-cover" />
        {/* light falls differently on each face of the fold */}
        <span aria-hidden className={`absolute inset-0 ${i % 2 ? "bg-gradient-to-l from-ink/35 to-transparent" : "bg-gradient-to-r from-white/10 to-transparent"}`} />
        <figcaption className="label absolute inset-x-0 bottom-0 bg-paper/90 px-1.5 py-1 text-[0.625rem] text-ink">
          0{i + 1} · {img.alt.split(",")[0]}
        </figcaption>
      </figure>
      {i < items.length - 1 && <Leaf items={items} i={i + 1} />}
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rig = ref.current!.querySelector<HTMLElement>(".screen-rig")!;
        const t0 = INTRO_DELAY;
        gsap
          .timeline({ delay: t0, defaults: { ease: "expo.out" } })
          .from(".hero-meta > *", { y: -14, opacity: 0, duration: 0.8, stagger: 0.06 }, 0)
          .fromTo(rig, { "--f": 89, rotateX: 34, y: 60 }, { "--f": 22, rotateX: 10, y: 0, duration: 2, ease: "expo.inOut" }, 0.1)
          .from(".hero-plan path", { strokeDashoffset: 1, duration: 1.8, ease: "power2.inOut", stagger: 0.05 }, 0.2)
          .from(".hero-lead > *", { y: 24, opacity: 0, duration: 1, stagger: 0.1 }, 0.8)
          .from(".hero-fact", { rotateX: -90, transformOrigin: "50% 0%", transformPerspective: 600, duration: 1, stagger: 0.08 }, 1.0)
          .from(".hero-swatch", { scaleX: 0, transformOrigin: "0% 50%", duration: 0.9, stagger: 0.08, ease: "expo.inOut" }, 1.1);

        // On a mouse, the screen turns gently towards the pointer and opens a little wider when touched
        if (window.matchMedia("(pointer: fine)").matches) {
          const ry = gsap.quickTo(rig, "rotateY", { duration: 1.2, ease: "power3" });
          const rx = gsap.quickTo(rig, "rotateX", { duration: 1.2, ease: "power3" });
          const move = contextSafe!((e: PointerEvent) => {
            ry(gsap.utils.mapRange(0, window.innerWidth, -12, 12, e.clientX));
            rx(gsap.utils.mapRange(0, window.innerHeight, 16, 4, e.clientY));
          });
          const screen = ref.current!.querySelector<HTMLElement>(".screen")!;
          const open = contextSafe!(() => gsap.to(rig, { "--f": 8, duration: 1, ease: "expo.out", overwrite: "auto" }));
          const close = contextSafe!(() => gsap.to(rig, { "--f": 22, duration: 1, ease: "expo.out", overwrite: "auto" }));
          ref.current!.addEventListener("pointermove", move);
          screen.addEventListener("pointerenter", open);
          screen.addEventListener("pointerleave", close);
          return () => {
            ref.current?.removeEventListener("pointermove", move);
            screen.removeEventListener("pointerenter", open);
            screen.removeEventListener("pointerleave", close);
          };
        }
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative overflow-hidden pb-20 pt-[5.5rem] md:pb-28">
      <div className="sheet">
        <div className="hero-meta label grid grid-cols-2 gap-y-1 border-b border-ink/15 py-4 text-ink/65 md:grid-cols-4">
          <span>Practice profile</span>
          <span className="text-right md:text-left">Sheet A-000</span>
          <span>Northbank studio</span>
          <span className="text-right">Rev. 2026</span>
        </div>

        <div className="grid grid-cols-1 gap-14 pt-12 md:pt-16 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col lg:col-span-7">
            <FoldText
              as="h1"
              id="hero-title"
              by="chars"
              onLoad
              className="display text-[clamp(2.6rem,5.6vw,6rem)] [@media(max-height:520px)]:text-[2.4rem]"
            >
              Buildings that <Mark kind="under">unfold</Mark> slowly, and grow <span className="serif font-normal text-cobalt">quieter</span> with time.
            </FoldText>

            <div className="hero-lead mt-8 flex flex-col gap-8 md:mt-10">
              <p className="max-w-[48ch] text-[1.0625rem] leading-relaxed text-ink/80 md:text-[1.125rem]">
                Atelier Morrow &amp; Vale is a twelve-person practice for architecture and interiors. We take on{" "}
                <Mark kind="box" tone="text-ochre">a handful of projects</Mark> each year and see every one through, from the first site visit to
                the last brass hinge.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <AnchorLink href="#projects" className="group label flex h-12 items-center gap-3 bg-ink pl-5 pr-2 text-paper">
                  See the work
                  <span aria-hidden className="fold-stage grid h-8 w-8 place-items-center bg-ochre text-ink">
                    <span className="transition-transform duration-700 ease-out-expo group-hover:[transform:rotateX(360deg)]">↓</span>
                  </span>
                </AnchorLink>
                <AnchorLink href="#contact" className="draw-link text-[1rem]">
                  Start a project brief →
                </AnchorLink>
              </div>
            </div>

            <div className="mt-12 lg:mt-auto lg:pt-14">
            <dl className="fold-stage grid grid-cols-2 border-l border-t border-ink/15 sm:grid-cols-4">
              {facts.map((f, i) => (
                <div key={f.k} className="hero-fact relative border-b border-r border-ink/15 px-3 pb-3 pt-4">
                  <span aria-hidden className={`hero-swatch absolute inset-x-0 top-0 h-1 ${swatches[i]}`} />
                  <dt className="label text-ink/60">{f.k}</dt>
                  <dd className="display mt-1 text-[1.15rem] tracking-[-0.02em]">{f.v}</dd>
                </div>
              ))}
            </dl>
            </div>
          </div>

          {/* The folding screen */}
          <div className="relative lg:col-span-5 lg:self-center">
            <svg aria-hidden viewBox="0 0 400 300" className="hero-plan absolute -inset-x-4 top-4 h-auto w-[calc(100%+2rem)] fill-none stroke-cobalt/30" strokeWidth={1}>
              {["M20 40 H380 V260 H20 Z", "M20 150 H160 M220 150 H380", "M200 40 V110 M200 190 V260", "M160 150 A 40 40 0 0 1 200 110", "M280 150 V260", "M300 170 H370 M300 190 H370 M300 210 H370 M300 230 H370"].map((d) => (
                <path key={d} d={d} pathLength={1} strokeDasharray={1} />
              ))}
            </svg>
            <div className="screen fold-stage relative flex justify-center py-10 [perspective:1100px] lg:py-16">
              <div
                className="screen-rig preserve -translate-x-[calc(var(--pw)*1.6)] [--pw:min(23vw,150px)] lg:[--pw:min(9.8vw,158px)]"
                style={{ "--f": 22, transform: "rotateX(10deg)" } as CSSProperties}
              >
                <Leaf items={hero.screen} i={0} />
              </div>
            </div>
            <div className="label mt-2 flex items-center gap-3 text-ink/65">
              <span className="h-3 w-px bg-current" />
              <span className="h-px flex-1 bg-current opacity-50" />
              <span>Fig. 1 · Four houses on a folding screen, 1:50</span>
              <span className="h-px flex-1 bg-current opacity-50" />
              <span className="h-3 w-px bg-current" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
