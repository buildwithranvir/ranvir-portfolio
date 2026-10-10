"use client";

import { useRef } from "react";
import { nav, site } from "@/lib/site";
import { enter, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Seam } from "./motion/Fold";
import { AnchorLink } from "./ui/AnchorLink";

const word = "ATELIER".split("");
const tones = ["text-cobalt", "text-terracotta", "text-verdigris", "text-ink", "text-rust", "text-blueprint", "text-cobalt"];

/** The footer is the drawing's title block, under a wordmark whose letters unfold like panels of a screen. */
export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".fw-letter", {
          rotateY: (i) => (i % 2 ? -90 : 90),
          transformOrigin: (i) => (i % 2 ? "100% 50%" : "0% 50%"),
          transformPerspective: 800,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: enter(".fw", "95%"),
        });
        gsap.from(".tb-cell", { opacity: 0, y: 14, duration: 0.8, ease: "expo.out", stagger: 0.05, scrollTrigger: enter(".tb", "92%") });
      });
    },
    { scope: ref },
  );

  const cell = "tb-cell border-b border-r border-ink px-3 py-3";
  const k = "label block text-ink/60";
  return (
    <footer ref={ref} className="relative bg-plaster pb-12 pt-16 md:pt-24">
      <Seam className="fill-plaster" />
      <div className="sheet">
        <p aria-hidden className="fw display flex justify-between text-[calc((min(100vw,1480px)-5rem)/7)] leading-[0.82] tracking-[-0.05em]">
          {word.map((l, i) => (
            <span key={i} className="fw-letter fold-stage inline-block">
              <span className={`inline-block transition-transform duration-700 ease-out-expo hover:[transform:rotateX(-38deg)] ${tones[i]}`}>{l}</span>
            </span>
          ))}
        </p>

        <div className="tb mt-10 grid grid-cols-2 border-l border-t border-ink md:mt-14 md:grid-cols-6">
          <div className={`${cell} col-span-2 md:row-span-2`}>
            <span className={k}>Practice</span>
            <p className="display mt-2 text-[1.6rem] tracking-[-0.03em]">{site.fullName}</p>
            <p className="serif mt-1 text-[1.15rem] text-ink/75">{site.tagline}</p>
          </div>
          <div className={cell}>
            <span className={k}>Drawing title</span>
            <span>Contact sheet</span>
          </div>
          <div className={cell}>
            <span className={k}>Scale</span>
            <span>1:1</span>
          </div>
          <div className={cell}>
            <span className={k}>Sheet</span>
            <span>A-001</span>
          </div>
          <div className={cell}>
            <span className={k}>Revision</span>
            <span className="bg-ochre px-1.5">2026 / C</span>
          </div>
          <div className={`${cell} col-span-2`}>
            <span className={k}>Studio</span>
            <address className="not-italic">{site.address.join(", ")}</address>
          </div>
          <div className={`${cell} col-span-2`}>
            <span className={k}>Correspondence</span>
            <span className="flex flex-wrap gap-x-5">
              <a href={`mailto:${site.email}`} className="draw-link hover:text-cobalt">
                {site.email}
              </a>
              <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="draw-link whitespace-nowrap hover:text-cobalt">
                {site.phone}
              </a>
            </span>
          </div>
          <nav aria-label="Footer" className={`${cell} col-span-2 md:col-span-3`}>
            <span className={k}>Index</span>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              {nav.map((l) => (
                <li key={l.href}>
                  <AnchorLink href={l.href} className="draw-link hover:text-cobalt">
                    {l.label}
                  </AnchorLink>
                </li>
              ))}
              <li>
                <AnchorLink href="#top" className="draw-link hover:text-cobalt">
                  Back to top ↑
                </AnchorLink>
              </li>
            </ul>
          </nav>
          <div className={`${cell} col-span-2 md:col-span-3`}>
            <span className={k}>Elsewhere</span>
            <ul className="flex flex-wrap gap-x-5">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="draw-link hover:text-cobalt">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="label mt-4 text-ink/60">© 2026 {site.fullName}. A fictional practice for a website template demo. Do not scale from this drawing.</p>
      </div>
    </footer>
  );
}
