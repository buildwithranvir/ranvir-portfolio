"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { scrollToHash } from "@/lib/scroll";
import { site } from "@/lib/site";
import { code, onColor, shots, templates } from "@/lib/templates";

const n = templates.length + 1; // the templates plus the "next colour" chip
const mid = (n - 1) / 2;

/**
 * The deck: every template as a big paint chip, each with its site rolling
 * slowly inside a little window.
 * Laptops: the chips are fanned across the counter; pointing at one lifts it
 * and nudges its neighbours aside.
 * Phones and tablets: a strip you swipe; the chip in the middle stands up
 * straight, the others lean away.
 */
export function Deck() {
  const ref = useRef<HTMLElement>(null);
  const strip = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".dk-head > *", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "clamp(top 78%)", once: true },
        });
        // the chips are dealt onto the counter
        gsap.from(".dk-deal", {
          y: 220,
          rotate: (i) => (i % 2 ? 18 : -18),
          opacity: 0,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.07,
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: strip.current, start: "clamp(top 88%)", once: true },
        });
      });
    },
    { scope: ref },
  );

  // the thumbnails only roll while the deck is on screen
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-off", !e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // phones and tablets: lean the chips by their distance from the middle of the strip
  useEffect(() => {
    const list = strip.current!;
    const items = Array.from(list.querySelectorAll<HTMLElement>(".dk-tilt"));
    const wide = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const update = () => {
      raf = 0;
      if (wide.matches || reduce.matches) {
        items.forEach((it) => (it.style.transform = ""));
        return;
      }
      const c = list.getBoundingClientRect().left + list.clientWidth / 2;
      items.forEach((it) => {
        const r = it.getBoundingClientRect();
        const d = Math.max(-1, Math.min(1, (r.left + r.width / 2 - c) / r.width));
        it.style.transform = `translateY(${Math.abs(d) * 18}px) rotate(${d * 7}deg) scale(${1 - Math.abs(d) * 0.06})`;
      });
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    list.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      cancelAnimationFrame(raf);
      list.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={ref} id="deck" aria-labelledby="deck-title" className="relative overflow-hidden bg-counter pb-20 pt-10 md:pb-28">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="dk-head flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mono text-dust">The deck</p>
            <h2 id="deck-title" className="display mt-3 text-[min(13vw,6.5rem,16svh)]">
              Every template,
              <br />
              <span className="text-tomato">at a glance.</span>
            </h2>
          </div>
          <p className="max-w-[34ch] text-[1.1rem] leading-relaxed text-ink/75">
            <span className="[@media(hover:none)]:hidden">Point at a chip to lift it, then click to step inside.</span>
            <span className="hidden [@media(hover:none)]:inline">Swipe through the chips and tap one to step inside.</span>
          </p>
        </div>
      </div>

      <ol
        ref={strip}
        aria-label="Templates"
        className="dk-strip no-bar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[14vw] pb-10 pt-6 sm:px-[27vw] md:mt-16 lg:justify-center lg:gap-0 lg:overflow-visible lg:px-8 lg:pb-16 lg:pt-14"
        style={{ "--n": n } as CSSProperties}
      >
        {templates.map((t, i) => {
          const s = shots(t);
          return (
            <li
              key={t.id}
              className="dk-chip shrink-0 snap-center"
              style={{ "--i": i - mid, zIndex: i } as CSSProperties}
            >
              <div className="dk-deal"><div className="dk-tilt will-change-transform">
                <button
                  type="button"
                  onClick={() => scrollToHash(`#${t.id}`)}
                  aria-label={`${t.name}, ${t.industry}. Step inside`}
                  className="dk-lift chip block w-full text-left"
                  style={{ "--paint": t.colors.paint } as CSSProperties}
                >
                  <div className="flex items-center justify-between px-4 pt-3.5" style={{ color: onColor(t.colors.paint) }}>
                    <span className="mono text-[0.68rem]">{code(i)}</span>
                    <span className="mono text-[0.68rem]">{t.finish}</span>
                  </div>
                  {/* the window onto the site */}
                  <div className="relative mx-3.5 mb-3.5 mt-3 aspect-[5/6] overflow-hidden rounded-[8px] bg-white shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)] [container-type:size]">
                    <Image
                      src={s.desktopFull.src}
                      width={s.desktopFull.width}
                      height={s.desktopFull.height}
                      alt={`The ${t.name} website`}
                      sizes="(min-width: 1024px) 260px, 70vw"
                      className="thumb-roll block h-auto w-full"
                      style={{ "--roll-time": `${30 + i * 4}s` } as CSSProperties}
                    />
                  </div>
                  <div className="chip-label px-4 pb-4 pt-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="display truncate text-[2.1rem] leading-[0.9]">{t.name}</span>
                      <span aria-hidden className="chip-hole shrink-0" />
                    </div>
                    <div className="mt-1.5 flex items-center justify-between gap-3">
                      <span className="mono truncate text-[0.66rem] text-dust">{t.industry}</span>
                      <span data-palette className="flex shrink-0 gap-1">
                        {t.palette.slice(0, 4).map((c) => (
                          <span key={c} className="h-3 w-3 rounded-full ring-1 ring-ink/15" style={{ background: c }} />
                        ))}
                      </span>
                    </div>
                  </div>
                </button>
              </div></div>
            </li>
          );
        })}

        {/* the honest last chip: more to come, or something made from scratch */}
        <li className="dk-chip shrink-0 snap-center" style={{ "--i": n - 1 - mid, zIndex: n } as CSSProperties}>
          <div className="dk-deal"><div className="dk-tilt will-change-transform">
            <a
              href={site.portfolio}
              target="_blank"
              rel="noreferrer"
              className="dk-lift chip block w-full bg-card text-left"
              style={{ "--paint": "var(--color-card)" } as CSSProperties}
            >
              <div className="flex aspect-[5/7.4] flex-col justify-between rounded-[14px] border-2 border-dashed border-ink/25 p-5">
                <span className="mono text-[0.68rem] text-dust">{code(n - 1)}</span>
                <div>
                  <p className="display text-[2.4rem] leading-[0.9]">
                    Next colour
                    <br />
                    in the mixer.
                  </p>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-ink/75">Need something none of these do? I design from scratch too.</p>
                  <p className="mono mt-4 text-[0.7rem] text-cobalt">See my portfolio ↗</p>
                </div>
              </div>
            </a>
          </div></div>
        </li>
      </ol>
    </section>
  );
}
