"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { brands } from "@/lib/brands";
import { shop, site, wantThis, whatsapp } from "@/lib/site";
import { code, onColor, templates } from "@/lib/templates";
import { Mark } from "./TopBar";

const stripe = [shop.tomato, shop.sun, shop.cobalt, shop.mint, shop.bubble, shop.tangerine, shop.teal];
// the drips hanging from each stripe: [position inside the stripe %, width px, length px]
const drips: [number, number, number][][] = [
  [[22, 16, 120], [70, 11, 60]],
  [[35, 14, 180], [80, 9, 70]],
  [[15, 10, 80], [55, 18, 140]],
  [[40, 12, 100], [85, 15, 210]],
  [[25, 17, 150], [68, 10, 60]],
  [[18, 9, 70], [60, 14, 190]],
  [[45, 16, 130], [74, 10, 80]],
];

const names = templates.map((t) => t.name);
const brandList = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];

/** The last word: a stripe of paint runs down, then the ways to reach Ranvir. */
export function Finale() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".fn-drip",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "power1.in",
            stagger: 0.03,
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "top 25%", scrub: 0.6 },
          },
        );
        gsap.from(".fn-word", {
          yPercent: 110,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".fn-title", start: "clamp(top 85%)", once: true },
        });
        gsap.from(".fn-in", {
          y: 26,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".fn-title", start: "clamp(top 80%)", once: true },
        });
        gsap.from(".fn-pick", {
          y: 50,
          rotate: (i) => (i % 2 ? 9 : -9),
          opacity: 0,
          duration: 1,
          ease: "back.out(1.5)",
          stagger: 0.06,
          scrollTrigger: { trigger: ".fn-picks", start: "clamp(top 92%)", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative overflow-x-clip bg-counter">
      {/* the paint stripe and its drips */}
      <div aria-hidden className="flex h-4 w-full md:h-5">
        {stripe.map((c, i) => (
          <div key={c} className="relative flex-1" style={{ background: c }}>
            {drips[i].map(([x, w, h], k) => (
              <span
                key={k}
                className="fn-drip absolute top-full origin-top rounded-b-full"
                style={{ left: `${x}%`, width: w, height: `min(${h}px, ${h / 6}vw + 30px)`, background: c }}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-[1600px] px-4 pb-24 pt-32 md:px-8 md:pb-28 md:pt-44">
        <h2 id="contact-title" className="fn-title display text-[min(19vw,13rem,26svh)]">
          <span className="block overflow-hidden pb-[0.05em]">
            <span className="fn-word inline-block">Found your</span>
          </span>
          <span className="block overflow-hidden pb-[0.05em]">
            <span className="fn-word inline-block text-cobalt">colour?</span>
          </span>
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="fn-in max-w-[40ch] text-[1.15rem] leading-relaxed text-ink/80 md:text-[1.3rem]">
              Tell me which one you like and a little about your business. I read and answer every message myself.
            </p>
            <div className="fn-in mt-7 flex flex-wrap gap-3">
              <a href={whatsapp()} target="_blank" rel="noreferrer" className="btn bg-mint text-ink shadow-[0_14px_30px_-16px_rgb(0_0_0/0.5)]">
                Chat on WhatsApp <span aria-hidden>↗</span>
              </a>
              <a href={site.phoneHref} className="btn bg-ink text-card">
                Call {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="btn bg-card ring-1 ring-ink/20">
                Email me
              </a>
            </div>
          </div>

          <div className="fn-in lg:col-span-6">
            <p className="mono text-dust">Or pick one straight from here</p>
            <ul className="fn-picks mt-4 flex flex-wrap gap-3">
              {templates.map((t, i) => (
                <li key={t.id} className="fn-pick">
                  <a
                    href={wantThis(t.name)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`I want ${t.name}, on WhatsApp`}
                    className="chip block w-[7.5rem] transition-transform duration-500 ease-out-expo hover:-translate-y-2 active:scale-95"
                    style={{ "--paint": t.colors.paint } as CSSProperties}
                  >
                    <span className="mono block h-16 px-2.5 pt-2 text-[0.6rem]" style={{ color: onColor(t.colors.paint) }}>
                      {code(i)}
                    </span>
                    <span className="chip-label block px-2.5 pb-2.5 pt-2">
                      <span className="flex items-center justify-between gap-1">
                        <span className="display truncate text-[1.35rem] leading-none">{t.name}</span>
                        <span aria-hidden className="chip-hole shrink-0" />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="mt-24 flex flex-col gap-6 border-t border-ink/15 pt-8 md:mt-32 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[60ch]">
            <p className="flex items-center gap-2">
              <Mark className="h-7 w-7" />
              <span className="display text-[1.4rem] leading-none">Ranvir&rsquo;s Templates</span>
            </p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">
              © {new Date().getFullYear()} {site.owner}. Designed and built in Delhi. {brandList} are fictional brands, designed as website
              templates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href={site.portfolio} target="_blank" rel="noreferrer" className="btn h-11 bg-card ring-1 ring-ink/20">
              Portfolio <span aria-hidden>↗</span>
            </a>
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${s.label} (opens in a new tab)`}
                className="grid h-11 w-11 place-items-center rounded-full bg-card ring-1 ring-ink/20 transition-colors hover:bg-ink active:bg-ink [&:hover>svg]:fill-card"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-[1.05rem] w-[1.05rem] fill-ink transition-colors">
                  <path d={brands[s.label].path} />
                </svg>
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
