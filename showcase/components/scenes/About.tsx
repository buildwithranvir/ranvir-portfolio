"use client";

import Image from "next/image";
import { useRef } from "react";
import { about, sceneNo, studio } from "@/lib/site";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { Mark } from "@/components/ui/Mark";

/** A single frame of film: sprocket holes either side, frame number below. */
function FilmFrame() {
  return (
    <figure className="ab-frame relative">
      <div className="flex gap-2 rounded-[4px] bg-ink p-2 md:gap-3 md:p-3">
        <span aria-hidden className="flex w-3 flex-col justify-around md:w-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="block h-2.5 rounded-[2px] bg-paper/80 md:h-3" />
          ))}
        </span>
        <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-[2px] bg-[#2a2420]">
          {about.photo ? (
            <>
              <Image
                src={about.photo}
                alt={`Portrait of ${studio.name}`}
                fill
                sizes="(min-width: 1024px) 26vw, 70vw"
                quality={80}
                className="ab-img object-cover object-top"
              />
              {/* the projector's light falls on the frame; a soft vignette ties it to the strip */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgb(255_180_90/0.14),transparent_55%),radial-gradient(ellipse_at_center,transparent_62%,rgb(0_0_0/0.35))]"
              />
            </>
          ) : (
            // Until the portrait arrives, the frame holds a projected monogram
            <div aria-hidden className="ab-img absolute inset-0 flex flex-col justify-between p-5 text-paper">
              <span className="hud text-paper/50">Portrait</span>
              <span className="credit text-[clamp(4.05rem,9vw,7.2rem)] leading-[0.8] [--w:70]">
                R<br />K
              </span>
              <span className="voice text-lg text-amber">Delhi, India</span>
              <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgb(255_180_90/0.35),transparent_60%)]" />
            </div>
          )}
        </div>
        <span aria-hidden className="flex w-3 flex-col justify-around md:w-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="block h-2.5 rounded-[2px] bg-paper/80 md:h-3" />
          ))}
        </span>
      </div>
      <figcaption className="hud mt-3 flex justify-between text-smoke">
        <span>{studio.name}</span>
        <span>Delhi, IN</span>
      </figcaption>
    </figure>
  );
}

/**
 * Section 02 — about. A light, still page after the dark opening:
 * an editorial spread with a large statement, a single frame of film,
 * the bio, and production notes (facts only).
 */
export function About() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        SplitText.create(".ab-statement", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 105,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: { trigger: ".ab-statement", start: "clamp(top 82%)", once: true },
            }),
        });
        // the frame advances into the gate, like film pulled down a projector
        gsap
          .timeline({ scrollTrigger: { trigger: ".ab-frame", start: "clamp(top 85%)", once: true } })
          .from(".ab-frame", { yPercent: 18, opacity: 0, duration: 1.2, ease: "expo.out" })
          .from(".ab-img", { yPercent: -100, duration: 0.9, ease: "steps(6)" }, 0.15);
        gsap.from(".ab-copy > *", {
          y: 24,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".ab-copy", start: "clamp(top 85%)", once: true },
        });
        gsap.from(".ab-note", {
          x: -24,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".ab-notes", start: "clamp(top 88%)", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="about" aria-labelledby="about-title" className="wash tone-peach relative bg-paper py-20 text-ink md:py-28">
      <div className="frame">
        <div className="hud flex justify-between border-b border-ink/15 pb-4 text-smoke">
          <span>{sceneNo("about")} — About</span>
          <span>Delhi · Worldwide</span>
        </div>

        <h2 id="about-title" className="sr-only">
          About {studio.name}
        </h2>
        <p className="ab-statement voice mx-auto mt-14 max-w-[22ch] text-center text-[clamp(1.8rem,3.6vw,3.6rem)] leading-[1.04] md:mx-0 md:mt-20 md:text-left">
          Three years of building{" "}
          <Mark kind="box" tone="sun">
            <span className="credit not-italic [--w:105]">websites</span>
          </Mark>
          , apps and <span className="credit not-italic text-rec [--w:105]">AI agents</span> — from Delhi, for anyone, anywhere.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-12 md:gap-8">
          <div className="mx-auto w-full max-w-[22rem] md:col-span-5 md:max-w-none lg:col-span-4">
            <FilmFrame />
          </div>
          <div className="ab-copy mx-auto max-w-[36rem] space-y-5 text-[1.0625rem] leading-relaxed text-ink/80 md:col-span-7 md:mx-0 lg:col-span-4 lg:col-start-6">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="ab-notes glass-light mx-auto w-full max-w-[36rem] self-start rounded-2xl p-5 md:col-span-12 md:mx-0 md:max-w-none lg:col-span-3 lg:col-start-10">
            <p className="hud mb-3 text-smoke">At a glance</p>
            {about.notes.map(([k, v]) => (
              <div key={k} className="ab-note grid grid-cols-[6rem_1fr] gap-3 border-t border-ink/15 py-3 last:border-b">
                <dt className="hud pt-0.5 text-smoke">{k}</dt>
                <dd className="text-[0.975rem]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
