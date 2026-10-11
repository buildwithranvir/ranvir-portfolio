"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { markLoaded } from "@/lib/loader";
import { shots, templates } from "@/lib/templates";

const WORD = "Ranvir’s Templates";

/**
 * The opening: the name rises letter by letter while a counter follows the
 * real loading (fonts in, first preview decoded, never more than 2.5s), then
 * the two halves of the screen part to show the page. A tap or key skips it;
 * a second visit in the same session gets a short version.
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

      const img = new Image();
      img.src = shots(templates[0]).desktop.src;
      const ready = Promise.race([
        Promise.all([document.fonts.ready, img.decode().catch(() => {})]),
        new Promise((r) => setTimeout(r, 2500)),
      ]);

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        try {
          sessionStorage.setItem("rk-seen", "1");
        } catch {}
        gsap.set(root, { autoAlpha: 0, pointerEvents: "none" });
      };

      if (reduce) {
        ready.then(() => {
          markLoaded();
          gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: finish });
        });
        return;
      }

      const p = { v: 0 };
      const print = () => (count.textContent = String(Math.round(p.v)).padStart(3, "0"));
      gsap.set(".ld-ch", { yPercent: 115 });
      gsap.set(".ld-bar", { scaleX: 0 });

      const intro = gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .to(".ld-ch", { yPercent: 0, duration: 1, stagger: 0.03 }, 0.1)
        .from(".ld-meta", { opacity: 0, y: 10, duration: 0.8, stagger: 0.08 }, 0.3);
      const meter = gsap.to(p, {
        v: 86,
        duration: 1.3,
        ease: "power1.out",
        onUpdate: () => {
          print();
          gsap.set(".ld-bar", { scaleX: p.v / 100 });
        },
      });
      if (seen) {
        intro.timeScale(3);
        meter.timeScale(3);
      }

      let closing = false;
      const close = () => {
        if (closing) return;
        closing = true;
        intro.progress(1);
        meter.kill();
        gsap
          .timeline({ defaults: { ease: "expo.inOut" } })
          .to(p, {
            v: 100,
            duration: 0.25,
            ease: "power1.out",
            onUpdate: () => {
              print();
              gsap.set(".ld-bar", { scaleX: p.v / 100 });
            },
          })
          .to(".ld-ch", { yPercent: -115, duration: 0.55, ease: "expo.in", stagger: 0.012 }, 0.2)
          .to(".ld-meta, .ld-bar-wrap", { opacity: 0, duration: 0.3 }, 0.2)
          .add(markLoaded, 0.75)
          .to(".ld-top", { yPercent: -100, duration: 1 }, 0.7)
          .to(".ld-bottom", { yPercent: 100, duration: 1 }, 0.7)
          .call(finish);
      };

      Promise.all([ready, new Promise((r) => intro.eventCallback("onComplete", r))]).then(() => gsap.delayedCall(seen ? 0 : 0.2, close));
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
    <div ref={ref} role="status" aria-label="Loading Ranvir's Templates" className="loader fixed inset-0 z-[100] cursor-pointer select-none">
      {/* the two halves that part at the end */}
      <div className="ld-top absolute inset-x-0 top-0 h-1/2 bg-raised" />
      <div className="ld-bottom absolute inset-x-0 bottom-0 h-1/2 bg-raised" />

      <div className="absolute inset-0 flex flex-col justify-between p-5 md:p-10">
        <div className="ld-meta label flex justify-between text-muted">
          <span>Website templates</span>
          <span>Delhi, India</span>
        </div>

        <div>
          <p className="h-display overflow-hidden pb-[0.08em] text-[min(12.5vw,9rem)]" aria-hidden>
            {WORD.split("").map((c, i) => (
              <span key={i} className="ld-ch inline-block will-change-transform">
                {c === " " ? " " : c}
              </span>
            ))}
          </p>
          <div className="mt-6 flex items-end justify-between gap-6">
            <div className="ld-bar-wrap h-px flex-1 bg-white/10">
              <div className="ld-bar h-px origin-left bg-accent" />
            </div>
            <span className="ld-count label tabular-nums text-muted" aria-hidden>
              000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
