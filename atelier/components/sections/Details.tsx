"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { details } from "@/lib/content";
import { getLenis } from "@/lib/scroll";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { FoldText, Mark, Seam } from "../motion/Fold";

const filters = ["All", "Residential", "Interior", "Commercial", "Cultural"] as const;
const ease = [0.7, 0, 0.2, 1] as const;

/**
 * Details on a blueprint: small prints on paper mats. Each mat is first
 * outlined in pencil, then the print drops into it. On hover a mat lifts
 * into an axonometric view and casts a hard ochre shadow.
 */
export function Details() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [view, setView] = useState<number | null>(null);
  const items = details.filter((d) => filter === "All" || d.typology === filter);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const prints = gsap.utils.toArray<HTMLElement>(".print");
        gsap.set(prints.map((e) => e.querySelector(".print-drop")), { rotateX: 45, y: -16, opacity: 0, transformOrigin: "50% 0%", transformPerspective: 1600 });
        ScrollTrigger.batch(prints, {
          start: "clamp(top 90%)",
          once: true,
          onEnter: (els) => {
            const tl = gsap.timeline();
            tl.set(els.map((e) => e.querySelector(".print-outline")), { opacity: 1 }, 0)
              .fromTo(els.map((e) => e.querySelector(".print-outline rect")), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.1 }, 0)
              .to(els.map((e) => e.querySelector(".print-drop")), { rotateX: 0, y: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.1 }, 0.45)
              .to(els.map((e) => e.querySelector(".print-outline")), { opacity: 0, duration: 0.5, stagger: 0.1 }, 1.1);
          },
        });
      });
    },
    { scope: ref },
  );

  const close = useCallback(() => setView(null), []);
  const step = useCallback((d: number) => setView((v) => (v === null ? v : (v + d + items.length) % items.length)), [items.length]);
  const isOpen = view !== null;

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    document.getElementById("viewer-close")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen, close, step]);

  const current = view !== null ? items[view] : null;

  return (
    <section ref={ref} id="details" aria-labelledby="details-title" className="blueprint relative py-24 text-paper md:py-32">
      <Seam className="fill-blueprint" />
      <div className="sheet">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label text-ochre">02 / Details</p>
            <FoldText as="h2" id="details-title" by="chars" className="display mt-5 text-[clamp(2.4rem,5vw,5.2rem)]">
              Drawn at <Mark kind="circle" tone="text-ochre">1:20</Mark>, <span className="serif font-normal text-blush">built</span> to last.
            </FoldText>
            <p className="mt-6 max-w-[48ch] text-[1.0625rem] text-paper/80">
              A stair, a façade module, a window reveal. Most of architecture happens at this scale, so we draw every one of them.
            </p>
          </div>
          <div role="group" aria-label="Filter details by typology" className="flex flex-wrap gap-2 lg:col-span-5 lg:justify-end">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={f === filter}
                onClick={() => setFilter(f)}
                className={`label relative h-9 px-3.5 transition-colors duration-300 ${f === filter ? "text-ink" : "text-paper/85 hover:text-paper"}`}
              >
                {f === filter && <motion.span layoutId="detail-pill" className="absolute inset-0 bg-ochre" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className={`absolute inset-0 border ${f === filter ? "border-transparent" : "border-paper/30"}`} />
                <span className="relative">{f}</span>
              </button>
            ))}
          </div>
        </div>

        <motion.ul layout className="mt-14 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 md:gap-x-6 md:gap-y-8 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((d, i) => (
              <motion.li
                key={d.ref}
                layout
                className="print fold-stage"
                initial={{ opacity: 0, rotateY: -60 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 60 }}
                transition={{ duration: 0.6, ease }}
              >
                <button type="button" onClick={() => setView(i)} className="group block w-full text-left" aria-label={`View larger: ${d.title}`}>
                  <span className="relative block">
                    <svg aria-hidden className="print-outline pointer-events-none absolute inset-0 h-full w-full overflow-visible fill-none stroke-ochre opacity-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <rect x="0" y="0" width="100" height="100" pathLength={1} strokeDasharray={1} strokeWidth={1.2} />
                    </svg>
                    <span className="print-drop block">
                    <span className="print-mat block bg-paper p-2.5 sm:p-3 shadow-[0_0_0_0_var(--color-ochre)] transition-[transform,box-shadow] duration-700 ease-out-expo group-hover:[box-shadow:10px_10px_0_0_var(--color-ochre)] group-hover:[transform:perspective(900px)_rotateX(10deg)_rotateZ(-2deg)_translateY(-8px)] md:p-4">
                      <span className="relative block aspect-[4/5]">
                        <Image src={d.src} alt={d.alt} fill placeholder="blur" sizes="(min-width: 1024px) 20vw, (min-width: 768px) 28vw, 44vw" className="grade object-contain" />
                      </span>
                      <span className="label mt-3 flex items-start justify-between gap-2 text-ink">
                        <span className="min-w-0 text-[0.625rem] leading-snug sm:text-[0.6875rem]">{d.title}</span>
                        <span className="shrink-0 text-rust">{d.ref}</span>
                      </span>
                    </span>
                    </span>
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Image viewer: ${current.title}`}
            className="fixed inset-0 z-[110] flex flex-col bg-ink text-paper"
            initial={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 0%)" }}
            animate={{ clipPath: "polygon(0% 0%, 250% 0%, 0% 250%)" }}
            exit={{ clipPath: "polygon(0% 0%, 0% 0%, 0% 0%)" }}
            transition={{ duration: 0.8, ease }}
          >
            <div className="sheet flex h-16 items-center justify-between border-b border-paper/15">
              <p className="label" aria-live="polite">
                <span className="text-ochre">{current.ref}</span> — {current.title}
              </p>
              <button id="viewer-close" type="button" onClick={close} className="label h-10 px-3 hover:text-ochre">
                Close ✕
              </button>
            </div>
            <div className="fold-stage relative flex-1" onClick={close}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.ref}
                  className="absolute inset-6 md:inset-x-24 md:inset-y-10"
                  initial={{ rotateX: -80, opacity: 0, transformOrigin: "50% 0%" }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: 80, opacity: 0, transformOrigin: "50% 100%" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="sheet label flex h-16 items-center justify-between border-t border-paper/15">
              <button type="button" onClick={() => step(-1)} className="h-10 hover:text-ochre">← Previous</button>
              <span className="hidden text-paper/60 md:inline">← → to browse · Esc to close</span>
              <button type="button" onClick={() => step(1)} className="h-10 hover:text-ochre">Next →</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
