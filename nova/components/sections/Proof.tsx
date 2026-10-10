"use client";

import { useRef } from "react";
import { quotes, stats } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Numbers that count up once, then a slow ribbon of client quotes. */
export function Proof() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".stat", { y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: ".stat", start: "clamp(top 88%)", once: true } });
        gsap.from(".stat-rule", { scaleY: 0, transformOrigin: "50% 100%", duration: 0.9, ease: "power3.inOut", stagger: 0.1, scrollTrigger: { trigger: ".stat", start: "clamp(top 88%)", once: true } });
        gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
          const target = Number(el.dataset.value);
          const decimals = Number(el.dataset.decimals ?? 0);
          const n = { v: 0 };
          el.textContent = (0).toFixed(decimals);
          gsap.to(n, {
            v: target,
            duration: 1.8,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = n.v.toFixed(decimals);
            },
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="proof-title" className="border-y border-white/10 py-20 md:py-24">
      <h2 id="proof-title" className="sr-only">
        Studio in numbers and client quotes (demo content)
      </h2>
      <dl className="frame grid grid-cols-2 gap-y-10 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="stat relative flex flex-col-reverse pl-5">
            <span aria-hidden className="stat-rule absolute inset-y-0 left-0 w-px bg-gradient-to-b from-signal/70 to-white/10" />
            <dt className="mono mt-2 text-mist">{s.label}</dt>
            <dd className="wide text-[clamp(3rem,6vw,5.5rem)] leading-none">
              <span className="stat-num" data-value={s.value} data-decimals={s.decimals ?? 0}>
                {s.decimals ? s.value.toFixed(s.decimals) : s.value}
              </span>
              <span className="text-signal">{s.suffix}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="frame mono mt-6 text-dim">Illustrative demo figures, not real metrics.</p>

      <div className="pause-on-hover mt-16 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 gap-3 pr-3" aria-hidden={k === 1 ? true : undefined}>
              {quotes.map((q) => (
                <li key={q.who} className="glass w-[20rem] shrink-0 rounded-2xl p-5 md:w-[24rem]">
                  <blockquote className="text-lg leading-snug">&ldquo;{q.quote}&rdquo;</blockquote>
                  <p className="mono mt-4 text-mist">{q.who}</p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <p className="frame mono mt-4 text-dim">Fictional testimonials · hover to pause</p>
    </section>
  );
}
