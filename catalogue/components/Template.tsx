"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { magnetic, reveal } from "@/lib/reveal";
import { wantThis } from "@/lib/site";
import { num, onColor, type Template as T } from "@/lib/templates";
import { DevicePreview } from "./DevicePreview";
import { useLive } from "./LiveViewer";

/**
 * One template, laid out like a short case study: its name, the live pages
 * scrolling on a laptop and a phone, what it is made for and what is inside,
 * and the ways to take it. Generated from its entry in lib/templates.ts.
 */
export function Template({ t, index }: { t: T; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const live = useLive();
  // the template's own colour marks its number, unless it is too dark to read on black
  const tint = onColor(t.colors.paint) === "#0A0A0A" ? t.colors.paint : "var(--color-accent)";

  useGSAP(
    () => {
      reveal(ref.current!);
      magnetic(ref.current!);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".dp", start: "clamp(top 85%)", once: true } })
          .from(".dp-laptop", { y: 80, scale: 0.97, opacity: 0, duration: 1.4, ease: "expo.out" })
          .from(".dp-phone", { y: 120, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.2);
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id={t.id} aria-labelledby={`${t.id}-title`} className="relative overflow-x-clip pt-24 md:pt-36">
      <div className="wrap">
        <div className="flex items-end justify-between gap-6 border-t border-white/10 pt-6">
          <div className="flex items-baseline gap-4 md:gap-6">
            <span data-fade className="label" style={{ color: tint }}>
              {num(index)}
            </span>
            <h2 id={`${t.id}-title`} data-split className="h-display text-[clamp(3rem,11vw,9.5rem)]">
              {t.name}
            </h2>
          </div>
          <p data-fade className="label hidden pb-3 text-right text-muted sm:block">
            {t.industry}
          </p>
        </div>
        <p data-fade className="label mt-3 text-muted sm:hidden">
          {t.industry}
        </p>

        <div className="mt-10 md:mt-14">
          <DevicePreview t={t} />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p data-fade className="text-[1.25rem] leading-snug tracking-[-0.01em] md:text-[1.5rem]">
              {t.story}
            </p>
            <div data-fade className="mt-8 flex flex-wrap items-center gap-3">
              <a href={wantThis(t.name)} target="_blank" rel="noreferrer" data-magnetic className="btn btn-accent">
                I want this one <span aria-hidden>↗</span>
              </a>
              <button type="button" onClick={() => live(t.id)} data-magnetic className="btn btn-ghost">
                Live preview
              </button>
              <a href={t.url} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center px-2 text-[0.95rem] text-muted underline-offset-4 transition-colors hover:text-fg hover:underline">
                Open site <span aria-hidden className="ml-1.5">↗</span>
              </a>
            </div>
          </div>

          <dl data-fade className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            <div className="border-t border-white/10 pt-4">
              <dt className="label text-faint">Made for</dt>
              <dd className="mt-2 text-[1rem] leading-relaxed">{t.goodFor}</dd>
            </div>
            <div className="border-t border-white/10 pt-4">
              <dt className="label text-faint">Type</dt>
              <dd className="mt-2 text-[1rem] leading-relaxed">{t.fonts}</dd>
            </div>
            <div className="border-t border-white/10 pt-4">
              <dt className="label text-faint">What&rsquo;s inside</dt>
              <dd className="mt-2">
                <ul className="space-y-1.5 text-[1rem]">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div className="border-t border-white/10 pt-4">
              <dt className="label text-faint">Palette</dt>
              <dd data-palette className="mt-3 flex flex-wrap gap-2">
                {t.palette.map((c) => (
                  <span key={c} className="flex items-center gap-2 rounded-full border border-white/10 py-1 pl-1 pr-3">
                    <span className="h-5 w-5 rounded-full border border-white/15" style={{ background: c }} />
                    <span className="label text-[0.66rem] text-muted">{c}</span>
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
