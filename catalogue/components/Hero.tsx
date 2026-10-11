"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { afterLoad } from "@/lib/loader";
import { magnetic } from "@/lib/reveal";
import { scrollToHash } from "@/lib/scroll";
import { whatsapp } from "@/lib/site";
import { num, shots, templates } from "@/lib/templates";

const SLIDE = 5.5; // seconds each template stays in the hero window
const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * The opening: the promise in two lines, and a browser window that cycles
 * through every template, each one slowly scrolling. The numbered tabs show
 * which one is on screen; tapping a tab switches to it.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [onScreen, setOnScreen] = useState(true);
  // only the slide on screen and the one fading out hold their (very tall) screenshots
  const show = (i: number) => {
    if (i === active) return;
    setPrev(active);
    setActive(i);
  };

  useGSAP(
    () => {
      magnetic(ref.current!);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".hr-title", { type: "lines", mask: "lines" });
        gsap.set(split.lines, { yPercent: 110 });
        gsap.set(".hr-in", { y: 24, opacity: 0 });
        gsap.set(".hr-frame", { y: 60, scale: 0.96, opacity: 0 });
        const stop = afterLoad(() =>
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .to(split.lines, { yPercent: 0, duration: 1.3, stagger: 0.1 }, 0.1)
            .to(".hr-in", { y: 0, opacity: 1, duration: 1.1, stagger: 0.08 }, 0.45)
            .to(".hr-frame", { y: 0, scale: 1, opacity: 1, duration: 1.5 }, 0.55),
        );
        return () => {
          stop();
          split.revert();
        };
      });
    },
    { scope: ref },
  );

  // only cycle while the window is on screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(ref.current!.querySelector(".hr-frame")!);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!onScreen || templates.length < 2) return;
    const id = setTimeout(() => {
      setPrev(active);
      setActive((active + 1) % templates.length);
    }, SLIDE * 1000);
    return () => clearTimeout(id);
  }, [active, onScreen]);
  // the slide that faded out lets go of its image once the fade is done
  useEffect(() => {
    if (prev === null) return;
    const id = setTimeout(() => setPrev(null), 1000);
    return () => clearTimeout(id);
  }, [prev]);

  const t = templates[active];

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative overflow-hidden pt-28 md:pt-36">
      {/* a faint warm light behind the window */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] -z-10 h-[70vmax] w-[70vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_91_46/0.07),transparent_60%)]"
      />
      <div className="wrap">
        <p className="hr-in label flex flex-wrap justify-between gap-2 text-muted">
          <span>Website templates by Ranvir Kawatra</span>
          <span className="hidden sm:inline">Built in Delhi, for anywhere</span>
        </p>

        <h1 id="hero-title" className="hr-title h-display mt-8 max-w-[15ch] text-[clamp(2.7rem,7.4vw,7.6rem)] md:mt-10">
          Websites ready to launch, <span className="serif text-accent">rebuilt</span> around your business.
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between">
          <p className="hr-in max-w-[44ch] text-[1.08rem] leading-relaxed text-muted md:text-[1.2rem]">
            Ready-made designs, each one built from a blank page. Pick the one that fits, send me your details, and I turn it into your
            site.
          </p>
          <div className="hr-in flex flex-wrap gap-3">
            <a
              href="#templates"
              onClick={(e) => {
                e.preventDefault();
                scrollToHash("#templates");
              }}
              data-magnetic
              className="btn btn-light"
            >
              Browse templates <span aria-hidden>↓</span>
            </a>
            <a href={whatsapp()} target="_blank" rel="noreferrer" data-magnetic className="btn btn-ghost">
              Talk on WhatsApp
            </a>
          </div>
        </div>

        {/* the window onto the templates */}
        <div className="hr-frame mt-12 md:mt-16">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-raised shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9)]">
            <div className="flex h-10 items-center gap-3 border-b border-white/10 px-4">
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </span>
              <span className="label truncate rounded-md bg-white/5 px-3 py-1 normal-case tracking-normal text-muted">{host(t.url)}</span>
              <button
                type="button"
                onClick={() => scrollToHash(`#${t.id}`)}
                className="label -my-2 ml-auto hidden shrink-0 py-3 text-muted transition-colors hover:text-fg sm:block"
              >
                Details <span aria-hidden>↓</span>
              </button>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden bg-raised-2 [container-type:size] md:aspect-[16/8]">
              {templates.map((x, i) => {
                const s = shots(x);
                const here = i === active;
                if (!here && i !== prev) return null;
                return (
                  <div
                    key={x.id}
                    aria-hidden={!here}
                    className={`absolute inset-0 ${here ? "z-[1] animate-[fade-in_900ms_ease-out_both]" : "is-off"}`}
                  >
                    <Image
                      src={s.desktopFull.src}
                      width={s.desktopFull.width}
                      height={s.desktopFull.height}
                      alt={`The ${x.name} template`}
                      sizes="(min-width: 1024px) 960px, 100vw"
                      priority={i === 0}
                      className="roll block h-auto w-full"
                      style={{ "--roll-time": "40s" } as CSSProperties}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div role="tablist" aria-label="Templates in the window" className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
            {templates.map((x, i) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => show(i)}
                className="group relative py-3 text-left"
              >
                <span className="absolute inset-x-0 top-0 h-px bg-white/10">
                  {i === active && (
                    <span
                      key={`${active}-${onScreen}`}
                      className="tab-progress block h-px origin-left bg-accent"
                      style={{ animationDuration: `${SLIDE}s`, animationPlayState: onScreen ? "running" : "paused" }}
                    />
                  )}
                </span>
                <span className="label text-faint">{num(i)}</span>
                <span className={`ml-2 text-[0.95rem] font-medium transition-colors ${i === active ? "text-fg" : "text-muted group-hover:text-fg"}`}>
                  {x.name}
                </span>
                <span className="mt-0.5 hidden truncate text-[0.85rem] text-faint md:block">{x.industry}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
