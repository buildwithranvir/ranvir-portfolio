"use client";

import { useRef, type CSSProperties } from "react";
import { studio } from "@/lib/site";
import { brands } from "@/lib/brands";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

// what each mark turns into when it's pointed at: its brand colour, the mark knocked out in white
const bloom: Record<string, { bg: string; ink: string }> = {
  Instagram: { bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)", ink: "#fff" },
  YouTube: { bg: "#ff0033", ink: "#fff" },
  // GitHub turns light in the dark and dark in daylight (theme variables)
  GitHub: { bg: "var(--gh-bg)", ink: "var(--gh-ink)" },
  LinkedIn: { bg: "#0a66c2", ink: "#fff" },
};

/**
 * Where to follow along - no boxes, just the marks themselves, floating.
 * They drop in when the row arrives. With a mouse, a mark blooms into its brand
 * colour when pointed at, leans towards the pointer and its handle re-types.
 * On touch screens (no hover) they bloom on their own, one after another, as
 * the row comes into view - and a tap squeezes the mark and sends out a ripple.
 */
export function Socials() {
  const ref = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ref.current, start: "clamp(top 88%)", once: true } })
          .from(".so-item", { y: 90, scale: 0.4, rotate: (i) => [-24, 18, -14, 22][i % 4], opacity: 0, duration: 1.1, ease: "back.out(1.7)", stagger: 0.1 })
          .to(".so-handle", { duration: 1, scrambleText: { text: "{original}", chars: "lowerCase", speed: 0.5, revealDelay: 0.3 }, stagger: 0.1 }, 0.3);
      });
      // touch: the marks light up by themselves, one by one, once they've landed; a tap answers with a squeeze and a ripple
      mm.add(`${MOTION_OK} and (hover: none)`, () => {
        const items = gsap.utils.toArray<HTMLElement>(".so-item");
        const timers: gsap.core.Tween[] = [];
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: "clamp(top 70%)",
          once: true,
          onEnter: () =>
            items.forEach((item, i) =>
              timers.push(
                gsap.delayedCall(0.9 + i * 0.35, () => {
                  item.querySelector("a")!.classList.add("is-lit");
                  const handle = item.querySelector<HTMLElement>(".so-handle")!;
                  gsap.to(handle, { duration: 0.6, scrambleText: { text: handle.dataset.text!, chars: "lowerCase", speed: 0.6 } });
                }),
              ),
            ),
        });
        const offs = items.map((item) => {
          const mark = item.querySelector<HTMLElement>(".so-mark")!;
          const ripple = item.querySelector<HTMLElement>(".so-ripple")!;
          const press = () => {
            gsap.fromTo(mark, { scale: 0.86 }, { scale: 1, duration: 0.6, ease: "back.out(3)", overwrite: true });
            gsap.fromTo(ripple, { scale: 1, opacity: 0.7 }, { scale: 1.7, opacity: 0, duration: 0.7, ease: "expo.out", overwrite: true });
          };
          item.addEventListener("pointerdown", press);
          return () => item.removeEventListener("pointerdown", press);
        });
        return () => {
          st.kill();
          timers.forEach((t) => t.kill());
          offs.forEach((o) => o());
          items.forEach((item) => item.querySelector("a")!.classList.remove("is-lit"));
        };
      });
      // touch with reduced motion: simply show the marks in colour
      mm.add("(hover: none) and (prefers-reduced-motion: reduce)", () => {
        const links = gsap.utils.toArray<HTMLElement>(".so-item a");
        links.forEach((a) => a.classList.add("is-lit"));
        return () => links.forEach((a) => a.classList.remove("is-lit"));
      });
      // mouse: each mark leans towards the pointer, and its handle re-types on hover
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const offs = gsap.utils.toArray<HTMLElement>(".so-item").map((item) => {
          const mark = item.querySelector<HTMLElement>(".so-mark")!;
          const handle = item.querySelector<HTMLElement>(".so-handle")!;
          const text = handle.textContent ?? "";
          const x = gsap.quickTo(mark, "x", { duration: 0.6, ease: "power3" });
          const y = gsap.quickTo(mark, "y", { duration: 0.6, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = item.getBoundingClientRect();
            x((e.clientX - (r.left + r.width / 2)) * 0.22);
            y((e.clientY - (r.top + r.height / 2)) * 0.22);
          };
          const enter = () => gsap.to(handle, { duration: 0.6, scrambleText: { text, chars: "lowerCase", speed: 0.6 }, overwrite: true });
          const leave = () => {
            x(0);
            y(0);
          };
          item.addEventListener("pointermove", move);
          item.addEventListener("pointerenter", enter);
          item.addEventListener("pointerleave", leave);
          return () => {
            item.removeEventListener("pointermove", move);
            item.removeEventListener("pointerenter", enter);
            item.removeEventListener("pointerleave", leave);
          };
        });
        return () => offs.forEach((o) => o());
      });
    },
    { scope: ref },
  );

  return (
    <ul ref={ref} aria-label="Follow along" className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-24 md:grid-cols-4">
      {studio.socials.map((s, i) => {
        const b = brands[s.label];
        const c = bloom[s.label];
        return (
          <li key={s.label} className="so-item flex justify-center">
            <a
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${s.label}: ${s.handle} (opens in a new tab)`}
              className="group flex flex-col items-center gap-4 text-center"
              style={{ "--ink": c.ink } as CSSProperties}
            >
              <span className="so-float relative block" style={{ animationDelay: `${i * -1.3}s` }}>
                <span className="so-mark relative grid h-[clamp(5.2rem,10vw,8rem)] w-[clamp(5.2rem,10vw,8rem)] place-items-center will-change-transform">
                  {/* the bloom: the brand colour grows out of the centre */}
                  <span
                    aria-hidden
                    className="absolute inset-0 scale-0 rounded-full transition-transform duration-500 ease-out-expo group-hover:scale-100 group-focus-visible:scale-100 group-[.is-lit]:scale-100"
                    style={{ background: c.bg }}
                  />
                  {/* a tap's ripple (touch screens) */}
                  <span
                    aria-hidden
                    className="so-ripple pointer-events-none absolute inset-0 rounded-full border-2 opacity-0"
                    style={{ borderColor: b.color }}
                  />
                  {/* a ring that ripples out and fades */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full border border-tungsten/20 transition-[transform,opacity] duration-700 ease-out-expo group-hover:scale-125 group-hover:opacity-0 group-[.is-lit]:opacity-0"
                  />
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    className="relative h-[42%] w-[42%] fill-tungsten transition-[fill,transform] duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-110 group-hover:fill-[var(--ink)] group-focus-visible:fill-[var(--ink)] group-[.is-lit]:fill-[var(--ink)]"
                  >
                    <path d={b.path} />
                  </svg>
                </span>
              </span>
              <span className="credit text-[clamp(1rem,1.5vw,1.3rem)] [--w:100]">{s.label}</span>
              <span className="so-handle hud -mt-2 text-dust transition-colors group-hover:text-amber group-[.is-lit]:text-amber" data-text={s.handle}>
                {s.handle}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
