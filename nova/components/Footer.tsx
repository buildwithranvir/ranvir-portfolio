"use client";

import { useRef } from "react";
import { nav, site } from "@/lib/site";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { AnchorLink } from "./ui/AnchorLink";

/**
 * Footer as a status bar, then the wordmark. The letters rise into place,
 * and a "flashlight" lights them up in signal orange around the pointer.
 * On touch screens the light sweeps across by itself.
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mark = ref.current!.querySelector<HTMLElement>(".fw-mark")!;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".fw-base", { type: "chars", mask: "chars", charsClass: "fw-ch fw-ch-base" });
        const lit = SplitText.create(".fw-lit", { type: "chars", mask: "chars", charsClass: "fw-ch fw-ch-lit" });
        gsap.from([split.chars, lit.chars], {
          yPercent: 105,
          duration: 1.1,
          ease: "power4.out",
          stagger: (i) => (i % 4) * 0.09,
          scrollTrigger: { trigger: mark, start: "clamp(top 95%)", once: true },
        });

        const setX = gsap.quickTo(mark, "--lx", { duration: 0.6, ease: "power3" });
        const setY = gsap.quickTo(mark, "--ly", { duration: 0.6, ease: "power3" });
        const setR = gsap.quickTo(mark, "--lr", { duration: 0.5, ease: "power3" });

        if (window.matchMedia("(pointer: fine)").matches) {
          const move = (e: PointerEvent) => {
            const r = mark.getBoundingClientRect();
            setX(e.clientX - r.left);
            setY(e.clientY - r.top);
            setR(Math.min(240, r.width * 0.2));
          };
          const leave = () => setR(0);
          mark.addEventListener("pointermove", move);
          mark.addEventListener("pointerleave", leave);
          return () => {
            mark.removeEventListener("pointermove", move);
            mark.removeEventListener("pointerleave", leave);
          };
        }
        // touch: a slow sweep, only while the wordmark is on screen
        const sweep = gsap.timeline({ repeat: -1, yoyo: true, paused: true, defaults: { ease: "sine.inOut" } });
        sweep.set(mark, { "--lr": () => `${mark.offsetWidth * 0.22}px`, "--ly": () => `${mark.offsetHeight * 0.5}px` }).fromTo(mark, { "--lx": "0px" }, { "--lx": () => `${mark.offsetWidth}px`, duration: 3.6 });
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? sweep.play() : sweep.pause()));
        io.observe(mark);
        return () => io.disconnect();
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-white/10 bg-graphite">
      <div className="frame mono flex flex-col gap-6 py-6 text-mist lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {nav.map((l) => (
              <li key={l.href}>
                <AnchorLink href={l.href} className="hover:text-signal">
                  {l.label.toLowerCase()}
                </AnchorLink>
              </li>
            ))}
            <li>
              <AnchorLink href="#top" className="hover:text-signal">
                top ↑
              </AnchorLink>
            </li>
          </ul>
        </nav>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-signal">
                {s.label.toLowerCase()} ↗
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${site.email}`} className="text-ice hover:text-signal">
              {site.email}
            </a>
          </li>
        </ul>
      </div>

      <div className="frame">
        <div
          aria-hidden
          className="fw-mark relative select-none pt-4 [--lr:0px] [--lx:-999px] [--ly:0px]"
        >
          {/* base: a cool steel gradient, clearly visible on graphite */}
          <p className="fw-base wide whitespace-nowrap text-center text-[27.5vw] leading-[0.82] xl:text-[26rem]">
            NOVA
          </p>
          {/* lit: the same word in signal orange, shown only inside the flashlight */}
          <p
            className="fw-lit wide pointer-events-none absolute inset-x-0 top-4 whitespace-nowrap text-center text-[27.5vw] leading-[0.82] xl:text-[26rem]"
            style={{
              WebkitMaskImage: "radial-gradient(circle var(--lr) at var(--lx) var(--ly), #000 35%, transparent 100%)",
              maskImage: "radial-gradient(circle var(--lr) at var(--lx) var(--ly), #000 35%, transparent 100%)",
            }}
          >
            NOVA
          </p>
        </div>
      </div>
      <p className="frame mono relative border-t border-white/10 py-4 text-mist">© 2026 NOVA studio · {site.location} · a fictional studio for a website template demo</p>
    </footer>
  );
}
