"use client";

import { useRef } from "react";
import { nav, site } from "@/lib/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { AnchorLink } from "./ui/AnchorLink";

const credits = [
  ["Founder & creative direction", "Mara Okonkwo"],
  ["Pattern & cutting", "Ines Marr, Jonah Vell"],
  ["Photography", "Unsplash contributors"],
  ["Typefaces", "Anybody, Bodoni Moda, Albert Sans, Martian Mono"],
];

/**
 * Colophon, then the wordmark. With a mouse, each letter widens as the
 * pointer comes near it, like a lens passing over the page.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(".fw-char", { "--w": 50, yPercent: 50 }, { "--w": 100, yPercent: 0, ease: "expo.out", duration: 1.4, stagger: 0.06, scrollTrigger: { trigger: ".fw", start: "top 95%", once: true } });
      });
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const word = ref.current!.querySelector<HTMLElement>(".fw")!;
        const chars = gsap.utils.toArray<HTMLElement>(".fw-char");
        const move = contextSafe!((e: PointerEvent) => {
          chars.forEach((c) => {
            const r = c.getBoundingClientRect();
            const d = Math.abs(e.clientX - (r.left + r.width / 2));
            gsap.to(c, { "--w": 50 + 100 * Math.max(0, 1 - d / 420), duration: 0.5, ease: "power3.out", overwrite: "auto" });
          });
        });
        const leave = contextSafe!(() => gsap.to(chars, { "--w": 100, duration: 0.8, ease: "expo.out", overwrite: "auto" }));
        word.addEventListener("pointermove", move);
        word.addEventListener("pointerleave", leave);
        return () => {
          word.removeEventListener("pointermove", move);
          word.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} data-theme="dark" className="relative overflow-hidden pt-20 md:pt-28">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-10 border-t border-fg/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <dl className="space-y-4">
            {credits.map(([k, v]) => (
              <div key={k}>
                <dt className="mono text-fg/45">{k}</dt>
                <dd className="mt-1 text-fg/85">{v}</dd>
              </div>
            ))}
          </dl>
          <div>
            <p className="mono text-fg/45">Stockists</p>
            <ul className="mt-2 space-y-1.5 text-fg/85">
              {site.stockists.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono text-fg/45">Write to us</p>
            <ul className="mt-2 space-y-1.5">
              <li>
                <a href={`mailto:${site.email}`} className="draw-link">
                  {site.email}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.press}`} className="draw-link">
                  {site.press}
                </a>
              </li>
            </ul>
            <address className="mt-4 not-italic text-fg/60">
              {site.address.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
          </div>
          <nav aria-label="Footer">
            <p className="mono text-fg/45">Sections</p>
            <ul className="mt-2 space-y-1.5">
              {nav.map((l) => (
                <li key={l.href}>
                  <AnchorLink href={l.href} className="draw-link">
                    {l.label}
                  </AnchorLink>
                </li>
              ))}
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="draw-link">
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mono mt-14 flex flex-col gap-2 text-fg/45 md:flex-row md:justify-between">
          <span>© 2026 VANTA. A fictional label, made as a website template demo.</span>
          <AnchorLink href="#top" className="draw-link w-fit">
            Back to the top ↑
          </AnchorLink>
        </div>
      </div>

      <p aria-hidden className="fw display mt-6 flex select-none justify-between px-3 text-[25.5vw] leading-[0.74] text-fg [--w:100] md:px-6">
        {"VANTA".split("").map((c, i) => (
          <span key={i} className="fw-char inline-block">
            {c}
          </span>
        ))}
      </p>
    </footer>
  );
}
