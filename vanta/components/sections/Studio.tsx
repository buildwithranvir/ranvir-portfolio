"use client";

import Image from "next/image";
import { useRef } from "react";
import { stats, team, workshop } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { Lines, Stretch } from "../motion/Reveal";

/** The people behind the label — each portrait develops in its own way. */
export function Studio() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".person");
        const on = (el: HTMLElement) => ({ trigger: el, start: "top 82%", once: true });

        // 0 — venetian blinds lift
        gsap.to(cards[0].querySelectorAll(".blind"), { scaleY: 0, duration: 1.1, ease: "power4.inOut", stagger: 0.07, scrollTrigger: on(cards[0]) });
        // 1 — iris opens from the centre
        gsap.fromTo(cards[1].querySelector(".frame"), { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 1.5, ease: "expo.out", scrollTrigger: on(cards[1]) });
        // 2 — a diagonal blade cuts across
        gsap.fromTo(
          cards[2].querySelector(".frame"),
          { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" },
          { clipPath: "polygon(0% 0%, 140% 0%, 100% 100%, 0% 100%)", duration: 1.3, ease: "power4.inOut", scrollTrigger: on(cards[2]) },
        );
        // 3 — rises from below while the photo settles out of a zoom
        gsap.fromTo(cards[3].querySelector(".frame"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", scrollTrigger: on(cards[3]) });
        gsap.from(cards[3].querySelector("img"), { scale: 1.1, duration: 1.3, ease: "expo.out", scrollTrigger: on(cards[3]) });

        // Each portrait develops from black-and-white into colour while it crosses the middle of the screen (works on touch too)
        cards.forEach((card) =>
          ScrollTrigger.create({ trigger: card.querySelector(".frame"), start: "top 70%", end: "bottom 30%", toggleClass: { targets: card, className: "is-colour" } }),
        );

        gsap.from(".person-meta", { y: 20, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: ".team", start: "top 75%", once: true } });

        // Counters whose digits stretch as they count
        gsap.utils.toArray<HTMLElement>(".stat-n").forEach((el) => {
          const target = Number(el.dataset.value);
          const o = { v: 0 };
          gsap
            .timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } })
            .to(o, { v: target, duration: 1.6, ease: "power3.out", onUpdate: () => (el.textContent = String(Math.round(o.v)).padStart(2, "0")) }, 0)
            .fromTo(el, { "--w": 50 }, { "--w": 140, duration: 1.6, ease: "expo.out" }, 0);
        });

        // Workshop strip: each frame opens from a slit once, as it arrives (plays, rather than repainting on every scroll frame)
        ScrollTrigger.batch(".shop-frame", {
          start: "top 92%",
          once: true,
          onEnter: (els) => {
            gsap.fromTo(els, { clipPath: "inset(0% 42% 0% 42%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut", stagger: 0.1 });
            gsap.fromTo(els.map((e) => e.querySelector("img")), { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "expo.out", stagger: 0.1 });
          },
        });
      });

    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="studio" data-theme="light" aria-labelledby="studio-title" className="relative py-24 md:py-36">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12">
          <p className="mono text-fg/60 lg:col-span-2">01 / The studio</p>
          <div className="lg:col-span-10">
            <Stretch id="studio-title" width={78} className="text-[clamp(2.7rem,7.2vw,7.4rem)]">
              One cutting table, <span className="serif-i normal-case">nine</span> pairs of hands
            </Stretch>
            <Lines className="mt-8 max-w-[52ch] text-[1.125rem] leading-relaxed text-fg/75">
              No factory, no outsourcing, no seasonal sale. The people below draw the patterns, cut the cloth and sign the label
              inside every piece. When you write to VANTA, one of them writes back.
            </Lines>
          </div>
        </div>

        {/* The team */}
        <ul className="team mt-16 grid grid-cols-2 gap-x-3 gap-y-10 md:mt-24 md:gap-x-5 lg:grid-cols-4">
          {team.map((p, i) => (
            <li key={p.name} className={`person group ${i % 2 ? "lg:mt-24" : ""}`}>
              <div className="frame relative aspect-square overflow-hidden rounded-[4px] bg-fg/10">
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 24vw, 50vw"
                  className="mono-grade object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.07]"
                  style={{ objectPosition: p.focus }}
                />
                {i === 0 && (
                  <div aria-hidden className="absolute inset-0 flex">
                    {Array.from({ length: 6 }).map((_, k) => (
                      <span key={k} className="blind h-full flex-1 origin-top bg-bone" />
                    ))}
                  </div>
                )}
                <span className="mono absolute left-2 top-2 rounded-full bg-porcelain/85 px-2 py-1 text-ink">Since {p.since}</span>
                {/* Hover: a chartreuse slip slides up with their favourite piece */}
                <div aria-hidden className="absolute inset-x-2 bottom-2 translate-y-[calc(100%+0.75rem)] rounded-[4px] bg-acid px-3 py-2.5 text-ink transition-transform duration-700 ease-out-expo group-hover:translate-y-0">
                  <p className="mono text-ink/60">Favourite piece</p>
                  <p className="display mt-1 text-[clamp(1rem,1.6vw,1.35rem)] [--w:110]">{p.favourite}</p>
                </div>
              </div>
              <div className="person-meta mt-4">
                <p className="person-name display text-[clamp(1.1rem,2vw,1.6rem)] [--w:95] transition-[font-variation-settings] duration-700 ease-out-expo group-hover:[--w:125]">{p.name}</p>
                <p className="mono mt-1.5 text-fg/60">{p.role}</p>
                <p className="serif-i mt-2 text-[1.05rem] leading-snug text-fg/80">{p.note}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Numbers */}
        <dl className="mt-24 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-fg/15 bg-fg/15 md:mt-32 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-bg p-5 md:p-7">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="stat-n display block text-[clamp(3.5rem,8vw,7rem)] tabular-nums [--w:140]" data-value={s.value}>
                  {String(s.value).padStart(2, "0")}
                </span>
                <span className="mt-3 block max-w-[22ch] text-[0.9375rem] text-fg/70">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Inside the workshop */}
      <div className="workshop mt-24 md:mt-32">
        <div className="wrap mb-6 flex items-end justify-between gap-6">
          <p className="mono text-fg/60">Inside the workshop</p>
          <p className="mono hidden text-fg/40 sm:block lg:hidden">Swipe →</p>
        </div>
        <ul className="flex snap-x snap-mandatory items-end gap-3 overflow-x-auto scroll-pl-5 px-5 pb-2 [scrollbar-width:none] md:gap-4 md:px-10 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:pb-0">
          {workshop.map((w, i) => (
            <li key={w.caption} className="shrink-0 snap-start lg:w-auto">
              <figure>
                {/* Natural proportions; the row bottom-aligns so every caption sits on one line */}
                <div className="shop-frame overflow-hidden rounded-[4px]">
                  <Image
                    src={w.src}
                    alt={w.alt}
                    placeholder="blur"
                    sizes="(min-width: 1024px) 19vw, 60vw"
                    className="grade h-[clamp(13rem,38svh,21rem)] w-auto max-w-none lg:h-auto lg:w-full lg:max-w-full"
                  />
                </div>
                <figcaption className="mt-3 flex items-baseline gap-2">
                  <span className="mono shrink-0 rounded-full bg-fg px-1.5 py-0.5 text-[0.625rem] text-bg">0{i + 1}</span>
                  <span className="text-[0.9375rem] leading-snug text-fg/75">{w.caption}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
