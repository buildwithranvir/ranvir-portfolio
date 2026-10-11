"use client";

import { useRef, useState, type CSSProperties } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setRoom } from "@/lib/room";
import { wantThis } from "@/lib/site";
import { code, onColor, templates, type Template } from "@/lib/templates";
import { DevicePreview } from "./DevicePreview";
import { useLive } from "./LiveViewer";

const clearRoom = () => {
  setRoom(-1);
  document.documentElement.style.removeProperty("--room");
};

/**
 * One template's room. The page floods in its colours as you arrive (see
 * Flood), the name is painted on the wall, and the laptop and phone show the
 * real site scrolling. Everything here is generated from its entry in
 * lib/templates.ts.
 */
export function Room({ t, index }: { t: Template; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const live = useLive();
  const [copied, setCopied] = useState<string | null>(null);
  const ink = t.colors.ink;
  const line = `${ink}2e`; // rule lines in the room's ink at 18%

  useGSAP(
    () => {
      // the bottom bar and the cursor follow the room on screen
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => {
          if (self.isActive) {
            setRoom(index);
            document.documentElement.style.setProperty("--room", t.colors.paint);
          }
        },
        // above the first room or below the last one, no room is on screen
        onLeaveBack: () => index === 0 && clearRoom(),
        onLeave: () => index === templates.length - 1 && clearRoom(),
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const start = "clamp(top 62%)";
        gsap.from(".rm-name", { yPercent: 105, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ref.current, start, once: true } });
        gsap.from(".rm-meta > *", {
          y: 24,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ref.current, start, once: true },
        });
        gsap.from(".dp-laptop", {
          x: -80,
          rotateY: 12,
          opacity: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: ".dp", start: "clamp(top 85%)", once: true },
        });
        gsap.from(".dp-phone", {
          x: 80,
          y: 40,
          rotate: 8,
          opacity: 0,
          duration: 1.4,
          delay: 0.15,
          ease: "expo.out",
          scrollTrigger: { trigger: ".dp", start: "clamp(top 85%)", once: true },
        });
        gsap.from(".rm-swatch", {
          y: 40,
          rotate: (i) => (i % 2 ? 10 : -10),
          opacity: 0,
          duration: 0.9,
          ease: "back.out(1.6)",
          stagger: 0.06,
          scrollTrigger: { trigger: ".rm-swatches", start: "clamp(top 92%)", once: true },
        });
      });
    },
    { scope: ref },
  );

  const copy = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopied(hex);
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1400);
  };

  return (
    <section ref={ref} id={t.id} aria-labelledby={`${t.id}-title`} className="relative overflow-x-clip py-20 md:py-28" style={{ color: ink }}>
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="mono flex flex-wrap justify-between gap-x-6 gap-y-1 border-b pb-3 opacity-80" style={{ borderColor: line }}>
          <span>
            {code(index)} · {t.industry}
          </span>
          <span>Finish · {t.finish}</span>
        </div>

        <div className="overflow-hidden pb-[0.04em] pt-[0.08em]">
          <h2 id={`${t.id}-title`} className="rm-name display mt-4 text-[min(25vw,15rem,34svh)]" style={{ color: t.colors.paint }}>
            {t.name}
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-12 md:mt-12 lg:grid-cols-12 lg:gap-10">
          <div className="[perspective:1400px] lg:order-2 lg:col-span-7">
            <DevicePreview t={t} />
          </div>

          <div className="rm-meta flex flex-col gap-7 lg:order-1 lg:col-span-5">
            <p className="text-[1.15rem] leading-relaxed md:text-[1.25rem]" style={{ color: ink }}>
              {t.story}
            </p>

            {/* the paint-can label */}
            <dl className="mono grid grid-cols-[7.5rem_1fr] border-t text-[0.72rem]" style={{ borderColor: line }}>
              {[
                ["Code", code(index)],
                ["Made for", t.goodFor],
                ["Type", t.fonts],
              ].map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="border-b py-2.5 opacity-60" style={{ borderColor: line }}>
                    {k}
                  </dt>
                  <dd className="border-b py-2.5 normal-case tracking-normal" style={{ borderColor: line }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>

            <div>
              <p className="mono opacity-60">The palette · tap to copy</p>
              <ul data-palette className="rm-swatches mt-3 flex flex-wrap gap-2.5">
                {t.palette.map((c) => (
                  <li key={c} className="rm-swatch">
                    <button
                      type="button"
                      onClick={() => copy(c)}
                      aria-label={`Copy ${c}`}
                      className="group flex w-[4.4rem] flex-col overflow-hidden rounded-[10px] bg-card text-ink shadow-[0_10px_24px_-16px_rgb(0_0_0/0.6)] ring-1 ring-black/10 transition-transform duration-500 ease-out-expo hover:-translate-y-1 active:scale-95"
                    >
                      <span className="block h-14 w-full" style={{ background: c }} />
                      <span className="mono px-1.5 py-1.5 text-center text-[0.6rem]">{copied === c ? "Copied" : c}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mono opacity-60">What&rsquo;s inside</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {t.features.map((f) => (
                  <li key={f} className="rounded-full px-3.5 py-1.5 text-[0.92rem] ring-1" style={{ ["--tw-ring-color" as string]: `${ink}40` } as CSSProperties}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={wantThis(t.name)}
                target="_blank"
                rel="noreferrer"
                className="btn shadow-[0_14px_30px_-16px_rgb(0_0_0/0.6)]"
                style={{ background: t.colors.paint, color: onColor(t.colors.paint) }}
              >
                I want this one <span aria-hidden>↗</span>
              </a>
              <button type="button" onClick={() => live(t.id)} className="btn ring-1" style={{ ["--tw-ring-color" as string]: `${ink}55` } as CSSProperties}>
                Try it live
              </button>
              <a href={t.url} target="_blank" rel="noreferrer" className="mono inline-flex h-12 items-center px-2 underline decoration-1 underline-offset-4">
                Open the site <span aria-hidden className="ml-1.5">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
