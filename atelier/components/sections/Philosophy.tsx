"use client";

import { useRef } from "react";
import { enter, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { FoldText, Mark, Seam } from "../motion/Fold";

/**
 * The method, set large on an ochre ground. The words fold up once as the
 * section arrives (no scroll-scrubbing), and a paper square beside it
 * unfolds along its diagonal.
 */
export function Philosophy() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: enter(".origami", "80%") })
          .from(".origami", { rotate: -45, scale: 0.6, duration: 1.4, ease: "expo.out" }, 0)
          .fromTo(".origami-flap", { transform: "rotate3d(1, -1, 0, 180deg)" }, { transform: "rotate3d(1, -1, 0, 0deg)", duration: 1.6, ease: "expo.inOut" }, 0.2);
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="philosophy-title" className="creases relative bg-ochre py-24 text-ink md:py-36">
      <Seam className="fill-ochre" />
      <div className="sheet grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-row items-center gap-6 lg:col-span-3 lg:flex-col lg:items-start">
          <div className="origami fold-stage relative h-24 w-24 shrink-0 md:h-32 md:w-32" aria-hidden>
            <div className="absolute inset-0 bg-ink [clip-path:polygon(0_0,100%_0,0_100%)]" />
            <div className="origami-flap preserve no-back absolute inset-0 bg-paper [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_49.4%,rgb(23_24_43/0.4)_50%,transparent_50.6%)]" />
          </div>
          <p className="label text-ink/75">
            <span id="philosophy-title" className="block text-ink">Note on method</span>
            <span className="mt-1 block">C. Morrow &amp; J. Vale</span>
          </p>
        </div>

        <FoldText as="p" by="words" className="display text-[clamp(1.9rem,4vw,3.9rem)] leading-[1.02] lg:col-span-9">
          A building should be quiet enough to hear the <span className="serif font-normal">light</span> move through it. We draw{" "}
          <Mark kind="under" tone="text-terracotta">slowly</Mark>, build <Mark kind="circle" tone="text-cobalt">carefully</Mark>, and leave room
          for the people who live there to <span className="serif font-normal text-blueprint">finish the work.</span>
        </FoldText>
      </div>
    </section>
  );
}
