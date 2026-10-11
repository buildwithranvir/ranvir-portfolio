"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { afterLoad } from "@/lib/loader";
import { scrollToHash } from "@/lib/scroll";
import { shop, whatsapp } from "@/lib/site";
import { code, onColor, templates } from "@/lib/templates";
import { AnchorLink } from "./ui/AnchorLink";

const Letters = ({ text, className = "" }: { text: string; className?: string }) => (
  <span className={`block overflow-hidden pb-[0.06em] ${className}`}>
    {text.split("").map((c, i) => (
      <span key={i} className="hr-ch inline-block will-change-transform">
        {c === " " ? " " : c}
      </span>
    ))}
  </span>
);

// the hero's fan: every template, padded with shop colours so it always looks full
const fanChips = (() => {
  const real = templates.map((t, i) => ({ paint: t.colors.paint, id: t.id, code: code(i), name: t.name }));
  const fill = [shop.sun, shop.mint, shop.bubble, shop.cobalt, shop.tangerine, shop.teal].map((paint) => ({ paint, id: "", code: "", name: "" }));
  const all = [...real, ...fill].slice(0, Math.max(7, real.length));
  // templates in the middle of the fan, the colour chips at the edges
  const out: typeof all = [];
  all.forEach((c, i) => (i % 2 ? out.push(c) : out.unshift(c)));
  return out;
})();
const SPREAD = 42;
const fanAngle = (i: number) => -SPREAD + (i * SPREAD * 2) / Math.max(1, fanChips.length - 1);

/**
 * The opening: "Pick a colour. Get a website." A fan of the real templates
 * opens behind the words. With a mouse the fan leans towards the pointer and a
 * chip lifts when pointed at; on touch screens it sways on its own, and a tap
 * on a chip goes straight to that template.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(".hr-ch", { yPercent: 110 });
        gsap.set(".hr-in", { y: 24, opacity: 0 });
        gsap.set(".hr-chip", { rotate: 0, opacity: 0, y: 40 });
        gsap.set(".hr-drip", { scaleY: 0 });
        return afterLoad(() => {
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .to(".hr-ch", { yPercent: 0, duration: 1.1, stagger: 0.028 }, 0)
            .to(".hr-in", { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 0.45)
            .to(".hr-chip", { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: "power2.out" }, 0.2)
            .to(".hr-chip", { rotate: (i) => fanAngle(i), duration: 1.4, stagger: { each: 0.04, from: "center" } }, 0.35)
            .to(".hr-drip", { scaleY: 1, duration: 1.6, ease: "power2.in", stagger: 0.25 }, 0.9);
        });
      });
      // reduced motion: the fan is simply open
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hr-chip", { rotate: (i) => fanAngle(i) });
      });

      // mouse: the whole fan leans towards the pointer
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const fanEl = ref.current!.querySelector<HTMLElement>(".hr-fan")!;
        const lean = gsap.quickTo(fanEl, "rotate", { duration: 1.2, ease: "power3" });
        const move = (e: PointerEvent) => lean((e.clientX / window.innerWidth - 0.5) * 12);
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
      // touch: a slow sway
      mm.add(`${MOTION_OK} and (pointer: coarse)`, () => {
        gsap.fromTo(".hr-fan", { rotate: -4 }, { rotate: 4, duration: 3.6, ease: "sine.inOut", repeat: -1, yoyo: true });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-counter">
      <div className="mx-auto flex min-h-[100svh] max-w-[1600px] flex-col px-4 pb-10 pt-24 md:px-8 md:pt-28">
        <p className="hr-in mono text-dust">Website designs by Ranvir Kawatra · Delhi</p>

        <h1 id="hero-title" className="display isolate mt-4 text-[min(15vw,11.5rem,19svh)] md:mt-6">
          <Letters text="PICK A" className="inline-block align-top" />{" "}
          <span className="relative inline-block align-top text-tomato">
            <Letters text="COLOUR." />
            {/* wet paint running off the word */}
            {[
              ["8%", "0.2em"],
              ["43%", "0.32em"],
              ["71%", "0.14em"],
              ["88%", "0.26em"],
            ].map(([left, h], i) => (
              <span
                key={i}
                aria-hidden
                className="hr-drip absolute top-[84%] z-10 w-[0.055em] origin-top rounded-b-full bg-tomato"
                style={{ left, height: h }}
              />
            ))}
          </span>
          <Letters text="GET A WEBSITE." />
        </h1>

        <div className="relative mt-8 grid flex-1 grid-cols-1 gap-10 md:mt-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="hr-in max-w-[34ch] text-[1.15rem] leading-relaxed text-ink/80 md:text-[1.25rem]">
              Ready-made website designs, each one built from a blank page. Pick the one that feels like your business, and I rebuild it
              around your name, your words and your photos.
            </p>
            <div className="hr-in mt-7 flex flex-wrap gap-3">
              <AnchorLink href="#deck" className="btn bg-ink text-card">
                Browse the deck <span aria-hidden>↓</span>
              </AnchorLink>
              <a href={whatsapp()} target="_blank" rel="noreferrer" className="btn bg-card ring-1 ring-ink/20">
                Ask on WhatsApp <span aria-hidden>↗</span>
              </a>
            </div>
          </div>

          {/* the fan */}
          <div
            className="relative min-h-[min(62vw,22rem)] lg:col-span-7 lg:min-h-[calc(var(--ch)*1.05)]"
            style={{ "--cw": "clamp(78px, min(10.5vw, 15svh), 158px)", "--ch": "calc(var(--cw) * 1.62)" } as CSSProperties}
          >
            <div className="hr-fan absolute bottom-[calc(var(--ch)*0.1)] left-1/2 will-change-transform" style={{ transformOrigin: "50% 50%" }}>
              {fanChips.map((c, i) => {
                const body = (
                  <div
                    className="chip h-full w-full transition-transform duration-500 ease-out-expo group-hover:-translate-y-[14%]"
                    style={{ "--paint": c.paint } as CSSProperties}
                  >
                    {c.name && (
                      <span className="mono absolute left-2.5 top-2.5 text-[0.58rem]" style={{ color: onColor(c.paint) }}>
                        {c.code}
                      </span>
                    )}
                    <div className="chip-label mt-auto px-2.5 pb-2 pt-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <span className="display truncate text-[calc(var(--cw)*0.16)] leading-none">{c.name || " "}</span>
                        <span className="chip-hole shrink-0" />
                      </div>
                    </div>
                  </div>
                );
                const style = {
                  width: "var(--cw)",
                  height: "var(--ch)",
                  left: "calc(var(--cw) / -2)",
                  top: "calc(var(--ch) * -0.9)",
                  transformOrigin: "50% 90%",
                } as CSSProperties;
                return c.id ? (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to ${c.name}`}
                    onClick={() => scrollToHash(`#${c.id}`)}
                    className="hr-chip group absolute block will-change-transform"
                    style={style}
                  >
                    {body}
                  </button>
                ) : (
                  <div key={i} aria-hidden className="hr-chip absolute will-change-transform" style={style}>
                    {body}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
