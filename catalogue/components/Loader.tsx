"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markLoaded } from "@/lib/loader";
import { shop } from "@/lib/site";
import { shots, templates } from "@/lib/templates";

// The fan: the templates' own paints first, then the shop colours, ten in all,
// interleaved so neighbouring chips never share a colour family.
const fan = (() => {
  const pool = [...templates.map((t) => t.colors.paint), shop.tomato, shop.sun, shop.cobalt, shop.mint, shop.bubble, shop.tangerine, shop.teal, "#151310"];
  const picks = Array.from(new Set(pool)).slice(0, 10);
  // alternate from both ends of the list for contrast
  const out: string[] = [];
  for (let i = 0; i < picks.length; i++) out.push(picks[i % 2 ? picks.length - 1 - (i >> 1) : i >> 1]);
  return out;
})();
const SPREAD = 64; // degrees either side
const angle = (i: number) => -SPREAD + (i * (SPREAD * 2)) / (fan.length - 1);

const Letters = ({ text }: { text: string }) => (
  <span className="block overflow-hidden pb-[0.04em]">
    {text.split("").map((c, i) => (
      <span key={i} className="ld-ch inline-block will-change-transform">
        {c}
      </span>
    ))}
  </span>
);

/**
 * The loading screen: a paint fan deck. Ten chips fan open around their rivet,
 * the wordmark prints underneath while the counter follows the real loading,
 * then the deck snaps shut and the top chip floods out to become the page.
 * Any click, tap or key skips it. A second visit in the same session gets a
 * short version; reduced motion gets a still deck and a fade.
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current!;
      const html = document.documentElement;
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const seen = html.classList.contains("seen");
      const count = root.querySelector<HTMLElement>(".ld-count")!;
      const chips = gsap.utils.toArray<HTMLElement>(".ld-chip");
      const top = root.querySelector<HTMLElement>(".ld-top")!;

      // ready = fonts in, and the first preview decoded (never longer than 2.5s)
      const first = shots(templates[0]).desktop.src;
      const img = new Image();
      img.src = first;
      const ready = Promise.race([
        Promise.all([document.fonts.ready, img.decode().catch(() => {})]),
        new Promise((r) => setTimeout(r, 2500)),
      ]);

      let done = false;
      let closing = false;
      const finish = () => {
        if (done) return;
        done = true;
        try {
          sessionStorage.setItem("rk-deck", "1");
        } catch {}
        markLoaded();
        gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
      };

      if (reduce) {
        count.textContent = "READY";
        ready.then(() => gsap.to(root, { autoAlpha: 0, duration: 0.3, delay: 0.3, onComplete: finish }));
        return;
      }

      const progress = { p: 0 };
      const print = () => (count.textContent = `MIXING ${String(Math.round(progress.p)).padStart(3, "0")}`);

      const close = () => {
        if (closing) return;
        closing = true;
        open.kill();
        meter.kill();
        const W = window.innerWidth;
        const H = window.innerHeight;
        const r = top.getBoundingClientRect();
        const cover = 2.4 * Math.max(W / r.width, H / r.height) + 2;
        gsap
          .timeline({ defaults: { ease: "power3.inOut" } })
          .to(progress, { p: 100, duration: 0.2, ease: "power1.out", onUpdate: print })
          .to(".ld-ch", { yPercent: -110, duration: 0.4, ease: "power3.in", stagger: 0.012 }, 0.1)
          .to(".ld-count", { opacity: 0, duration: 0.2 }, 0.12)
          .to(chips, { rotate: 0, duration: 0.42, stagger: { each: 0.015, from: "edges" } }, 0.12)
          .to(".ld-top-fx", { opacity: 0, duration: 0.18 }, 0.5)
          .set(top, { transformOrigin: "50% 50%" }, 0.64)
          .to(top, { scale: cover, duration: 0.7, ease: "expo.in" }, 0.64)
          // the chip now covers the screen in the page's own colour: hand over
          .call(finish);
      };

      gsap.set(chips, { rotate: 0, y: 24, opacity: 0 });
      gsap.set(".ld-ch", { yPercent: 110 });
      const open = gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .to(chips, { y: 0, opacity: 1, duration: 0.35, stagger: 0.02, ease: "power2.out" }, 0)
        .to(top, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0.1)
        .to(chips, { rotate: (i) => angle(i), duration: 0.95, stagger: { each: 0.03, from: "center" } }, 0.2)
        .to(".ld-ch", { yPercent: 0, duration: 0.75, stagger: 0.022 }, 0.32);
      gsap.set(top, { opacity: 0, y: 24 });
      const meter = gsap.to(progress, { p: 88, duration: 1.4, delay: 0.2, ease: "power1.out", onUpdate: print });
      if (seen) {
        open.timeScale(2.4);
        meter.timeScale(2.4);
      }

      // close once both the opening and the loading are done
      Promise.all([ready, new Promise((r) => open.eventCallback("onComplete", r))]).then(() => {
        if (!closing) gsap.delayedCall(seen ? 0 : 0.15, close);
      });

      const skip = () => close();
      root.addEventListener("pointerdown", skip);
      window.addEventListener("keydown", skip);
      return () => {
        root.removeEventListener("pointerdown", skip);
        window.removeEventListener("keydown", skip);
      };
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      role="status"
      aria-label="Loading Ranvir's Templates"
      className="loader fixed inset-0 z-[100] flex cursor-pointer select-none flex-col items-center justify-center bg-counter px-5 text-ink"
      style={{ "--cw": "min(22vw, 13svh, 140px)", "--ch": "calc(var(--cw) * 1.72)" } as CSSProperties}
    >
      {/* the fan: every chip turns around the same rivet */}
      <div className="relative w-full" style={{ height: "calc(var(--ch) * 0.96)" }}>
        <div className="absolute left-1/2" style={{ top: "calc(var(--ch) * 0.86)" }}>
          {fan.map((c, i) => (
            <div
              key={i}
              className="ld-chip chip absolute will-change-transform"
              style={
                {
                  "--paint": c,
                  width: "var(--cw)",
                  height: "var(--ch)",
                  left: "calc(var(--cw) / -2)",
                  top: "calc(var(--ch) * -0.86)",
                  transformOrigin: "50% 86%",
                } as CSSProperties
              }
            >
              <div className="chip-label mt-auto flex h-[24%] items-end justify-center pb-[6%]">
                <span className="chip-hole" />
              </div>
            </div>
          ))}
          {/* the top chip: counter coloured, it becomes the page */}
          <div
            className="ld-top chip absolute will-change-transform"
            style={
              {
                "--paint": "var(--color-counter)",
                width: "var(--cw)",
                height: "var(--ch)",
                left: "calc(var(--cw) / -2)",
                top: "calc(var(--ch) * -0.86)",
                transformOrigin: "50% 86%",
                boxShadow: "none",
              } as CSSProperties
            }
          >
            <span aria-hidden className="ld-top-fx absolute inset-0 rounded-[14px] border-[1.5px] border-ink" />
            <span aria-hidden className="ld-top-fx display absolute inset-x-0 top-[18%] text-center text-[calc(var(--cw)*0.42)]">
              RK
            </span>
            <div className="ld-top-fx chip-label mt-auto flex h-[24%] items-end justify-center rounded-b-[14px] pb-[6%]">
              <span className="chip-hole" />
            </div>
          </div>
        </div>
      </div>

      <p className="display mt-[min(5svh,2.2rem)] text-center text-[min(14vw,9svh,8rem)] leading-[0.88]">
        <Letters text="RANVIR'S" />
        <Letters text="TEMPLATES" />
      </p>
      <p className="ld-count mono mt-4 tabular-nums text-dust" aria-hidden>
        MIXING 000
      </p>
    </div>
  );
}
