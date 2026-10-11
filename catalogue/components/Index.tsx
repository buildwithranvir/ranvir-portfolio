"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { reveal } from "@/lib/reveal";
import { scrollToHash } from "@/lib/scroll";
import { num, shots, templates } from "@/lib/templates";

/**
 * The index: one large row per template. With a mouse, a preview of the site
 * follows the pointer over the list; on touch screens every row carries its
 * own small preview instead. A row takes you to that template's section.
 */
export function Index() {
  const ref = useRef<HTMLElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useGSAP(
    () => {
      reveal(ref.current!);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".ix-row", {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".ix-list", start: "clamp(top 85%)", once: true },
        });
      });
      // mouse: the preview card trails the pointer
      mm.add("(pointer: fine)", () => {
        const card = ref.current!.querySelector<HTMLElement>(".ix-card")!;
        const x = gsap.quickTo(card, "x", { duration: 0.6, ease: "power3" });
        const y = gsap.quickTo(card, "y", { duration: 0.6, ease: "power3" });
        const list = ref.current!.querySelector<HTMLElement>(".ix-list")!;
        const move = (e: PointerEvent) => {
          x(e.clientX);
          y(e.clientY);
        };
        list.addEventListener("pointermove", move);
        return () => list.removeEventListener("pointermove", move);
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="templates" aria-labelledby="templates-title" className="relative pt-24 md:pt-36">
      <div className="wrap">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-fade className="label text-muted">
              Index
            </p>
            <h2 id="templates-title" data-split className="h-display mt-4 text-[clamp(2.4rem,6vw,5.5rem)]">
              The templates
            </h2>
          </div>
          <p data-fade className="max-w-[36ch] text-[1.05rem] leading-relaxed text-muted">
            Each one is a complete, working website. Open any of them live, then tell me which one feels like your business.
          </p>
        </div>

        <ul className="ix-list mt-12 border-t border-white/10 md:mt-16" onPointerLeave={() => setHover(null)}>
          {templates.map((t, i) => {
            const s = shots(t);
            return (
              <li key={t.id} className="ix-row border-b border-white/10">
                <a
                  href={`#${t.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHash(`#${t.id}`);
                  }}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHover(i)}
                  className="group grid grid-cols-[2.2rem_1fr_auto] items-center gap-x-4 py-5 md:grid-cols-[4rem_1fr_1fr_auto] md:py-7"
                >
                  <span className="label text-faint transition-colors group-hover:text-accent">{num(i)}</span>
                  <span className="text-[clamp(1.9rem,5vw,4rem)] font-semibold leading-none tracking-[-0.045em] transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                    {t.name}
                  </span>
                  <span className="hidden text-[1rem] text-muted md:block">{t.industry}</span>
                  {/* touch screens: a small preview on the row itself */}
                  <span className="relative block h-12 w-20 overflow-hidden rounded-md border border-white/10 [@media(pointer:fine)]:hidden">
                    <Image src={s.desktop.src} width={s.desktop.width} height={s.desktop.height} alt="" sizes="80px" className="h-full w-full object-cover object-top" />
                  </span>
                  <span className="label hidden items-center gap-2 text-muted transition-colors group-hover:text-fg [@media(pointer:fine)]:flex">
                    View <span aria-hidden>↓</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* mouse only: the preview that trails the pointer */}
      <div
        aria-hidden
        className="ix-card pointer-events-none fixed left-0 top-0 z-[60] hidden [@media(pointer:fine)]:block"
        style={{ transform: "translate(-200px, -200px)" }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] transition-[opacity,scale] duration-300 ease-out-expo ${
            hover === null ? "scale-90 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <div className="relative h-[200px] w-[320px]">
            {templates.map((t, i) => {
              const s = shots(t);
              return (
                <Image
                  key={t.id}
                  src={s.desktop.src}
                  width={s.desktop.width}
                  height={s.desktop.height}
                  alt=""
                  sizes="320px"
                  className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ${hover === i ? "opacity-100" : "opacity-0"}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
