"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/**
 * Phones: the work as a swipeable deck. Cards snap to the centre; the ones
 * either side lean back and dim, so swiping feels like turning through
 * physical cards. Tap a card to open its case study.
 */
export function WorkCarousel({ onOpen }: { onOpen: (p: Project) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Per-card depth from its distance to the centre (transforms only, once per frame at most)
  useEffect(() => {
    const el = track.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestD = Infinity;
      Array.from(el.children).forEach((c, i) => {
        const card = c as HTMLElement;
        const center = card.offsetLeft + card.offsetWidth / 2;
        const d = (center - mid) / card.offsetWidth; // -1 … 1 for neighbours
        if (Math.abs(d) < bestD) {
          bestD = Math.abs(d);
          best = i;
        }
        if (reduce) return;
        const k = Math.min(1, Math.abs(d));
        card.style.transform = `perspective(900px) rotateY(${(-d * 14).toFixed(2)}deg) scale(${(1 - k * 0.09).toFixed(3)})`;
        (card.querySelector(".wc-dim") as HTMLElement).style.opacity = String((k * 0.55).toFixed(2));
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "clamp(top 85%)", once: true } })
          .from(".wc-inner", { xPercent: 40, opacity: 0, duration: 1.1, ease: "power4.out", stagger: 0.1 }, 0)
          .from(".wc-img", { scale: 1.25, duration: 1.6, ease: "power3.out", stagger: 0.1 }, 0)
          .from(".wc-meta", { y: 16, opacity: 0, duration: 0.7, ease: "power3.out" }, 0.5);
      });
    },
    { scope: ref },
  );

  const go = (i: number) => {
    const el = track.current!;
    const card = el.children[i] as HTMLElement;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: "smooth" });
  };

  return (
    <div ref={ref} className="-mx-5 mt-8 md:hidden">
      <div
        ref={track}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-[14vw] pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Selected work, swipe to browse"
      >
        {projects.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onOpen(p)}
            aria-label={`Open case study: ${p.name}`}
            className="relative w-[72vw] max-w-[21rem] shrink-0 snap-center will-change-transform"
          >
            <span className="wc-inner relative block aspect-[4/5] overflow-hidden rounded-3xl bg-graphite ring-1 ring-white/10">
              <Image src={p.image.src} alt={p.image.alt} fill placeholder="blur" loading={i < 2 ? "eager" : "lazy"} sizes="80vw" className="wc-img object-cover" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-void via-void/55 via-35% to-transparent to-70%" />
              <span aria-hidden className="wc-dim absolute inset-0 bg-void opacity-0" />
              <span className="absolute inset-x-4 bottom-4 text-left">
                <span className="mono inline-block rounded-md bg-void/70 px-2 py-1 text-signal backdrop-blur-sm">
                  {p.code} · {p.discipline}
                </span>
                <span className="wide mt-1 block text-[2.6rem] leading-[0.9]">{p.name}</span>
                <span className="mt-2 block text-[0.95rem] leading-snug text-ice/80">{p.line}</span>
                <span className="mono mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-ice backdrop-blur-sm">
                  open case <span aria-hidden>→</span>
                </span>
              </span>
              <span className="mono absolute right-4 top-4 rounded-full bg-void/60 px-2.5 py-1 text-mist backdrop-blur-sm">{p.year}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="wc-meta flex items-center justify-between px-5">
        <div className="flex items-center gap-4" role="tablist" aria-label="Choose a project">
          {projects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={p.name}
              onClick={() => go(i)}
              // the dot stays small; padding (clipped from the paint) makes it a comfortable tap target
              className={`-mx-2.5 -my-3 box-content h-1.5 rounded-full bg-clip-content px-2.5 py-3 transition-all duration-500 ease-snap ${i === active ? "w-8 bg-signal" : "w-1.5 bg-white/25"}`}
            />
          ))}
        </div>
        <p className="mono text-mist" aria-live="polite">
          <span className="text-ice">{String(active + 1).padStart(2, "0")}</span> / {String(projects.length).padStart(2, "0")} · swipe
        </p>
      </div>
    </div>
  );
}
