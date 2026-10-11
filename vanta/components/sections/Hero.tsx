"use client";

import Image from "next/image";
import { useRef } from "react";
import { intro, team } from "@/lib/content";
import { gsap, INTRO_DELAY, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";
import { AnchorLink } from "../ui/AnchorLink";

/**
 * The opening is the people, not the product: who we are, a wall of studio
 * photographs, and the wordmark stretching open across the page.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const words = SplitText.create(".hero-statement", { type: "words", wordsClass: "inline-block" });
        const tl = gsap.timeline({ delay: INTRO_DELAY - 0.15, defaults: { ease: "expo.out" } });
        tl.fromTo(".hero-char", { "--w": 50, yPercent: 100 }, { "--w": 150, yPercent: 0, duration: 1.6, stagger: 0.07 }, 0)
          // each photograph arrives its own way
          .fromTo(".ph-lead", { clipPath: "inset(50% 50% 50% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5 }, 0.2)
          .from(".ph-lead img", { scale: 1.15, duration: 2 }, 0.2)
          .from(".ph-hands", { yPercent: 40, opacity: 0, duration: 1.4 }, 0.45)
          .fromTo(".ph-tailor", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.inOut" }, 0.5)
          .from(".ph-light", { xPercent: 40, opacity: 0, duration: 1.4 }, 0.6)
          .from(words.words, { yPercent: 55, opacity: 0, duration: 1, stagger: 0.035 }, 0.7)
          .from(".hero-pill", { scale: 0, duration: 1.1, ease: "back.out(1.5)", stagger: 0.12 }, 1)
          .from(".hero-sub > *", { y: 18, opacity: 0, duration: 1, stagger: 0.1 }, 1.1)
          .from(".hero-cta > *", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.95)
          .from(".hero-meta > *", { opacity: 0, duration: 0.8, stagger: 0.1 }, 0.9)
          .from(".hero-badge", { scale: 0, rotate: -120, duration: 1.4, ease: "back.out(1.6)" }, 1.1)
          .add(() => ref.current?.querySelectorAll(".hero-sub .hl").forEach((h) => h.classList.add("is-on")), 1.6);

        // Scroll: the letters drift apart
        gsap.to(".hero-char", { xPercent: (i) => (i - 2) * 22, opacity: 0.15, ease: "none", scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } });
      });

      // Large screens only: the photographs separate at different speeds (on small screens they'd slide over the text)
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const st = { trigger: ref.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".w-lead", { yPercent: -8, ease: "none", scrollTrigger: st });
        gsap.to(".w-hands", { yPercent: -30, ease: "none", scrollTrigger: st });
        gsap.to(".w-right", { yPercent: -20, ease: "none", scrollTrigger: st });
      });

      // Pointer depth: each layer leans a different amount
      mm.add(`${MOTION_OK} and (pointer: fine) and (min-width: 1024px)`, () => {
        const layers = gsap.utils.toArray<HTMLElement>(".depth");
        const movers = layers.map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
          d: Number(el.dataset.depth),
        }));
        const onMove = contextSafe!((e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          movers.forEach((m) => {
            m.x(nx * m.d);
            m.y(ny * m.d);
          });
        });
        window.addEventListener("pointermove", onMove);
        return () => window.removeEventListener("pointermove", onMove);
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="top" data-theme="dark" aria-labelledby="hero-title" className="relative overflow-x-clip pb-20 pt-24 md:pt-28 lg:pb-28">
      <div className="wrap">
        <div className="hero-meta mono flex items-center justify-between border-b border-fg/15 pb-3 text-fg/60">
          <span>{intro.kicker}</span>
          <span className="hidden sm:inline">Independent studio · 9 people</span>
          <span>Issue 07 out now</span>
        </div>

        {/* Wordmark - five letters stretching from narrow to wide */}
        <h1 id="hero-title" className="display relative z-0 mt-4 flex justify-between overflow-hidden text-[min(calc((100vw_-_2.5rem)/5.8),248px)] leading-[0.8] md:text-[min(calc((100vw_-_5rem)/5.8),248px)]" style={{ ["--w" as string]: 150 }}>
          <span className="sr-only">VANTA, an independent fashion studio</span>
          {"VANTA".split("").map((c, i) => (
            <span key={i} aria-hidden className="hero-char inline-block">
              {c}
            </span>
          ))}
        </h1>

        {/* Studio wall - natural photo proportions, nothing cropped tight. Phones and tablets stack it cleanly;
            large screens let it overlap the wordmark. */}
        <div className="relative z-10 mt-5 grid grid-cols-2 gap-3 md:gap-4 lg:mt-8 lg:grid-cols-12">
          <div className="depth w-lead col-span-2 lg:col-span-6 lg:col-start-4 lg:row-start-1" data-depth="14">
            <figure className="ph-lead relative aspect-[16/9] overflow-hidden rounded-[4px]">
              <Image src={intro.lead.src} alt={intro.lead.alt} fill priority placeholder="blur" sizes="(min-width: 1024px) 46vw, 100vw" className="grade object-cover" />
              <figcaption className="glass mono absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-porcelain">Ines &amp; Rosa, studio floor</figcaption>
            </figure>
          </div>

          <div className="depth w-hands col-span-1 lg:col-span-3 lg:col-start-1 lg:row-start-1 lg:pt-[30%]" data-depth="-26">
            <figure className="ph-hands relative aspect-[4/3] overflow-hidden rounded-[4px] lg:aspect-[3/2]">
              <Image src={intro.hands.src} alt={intro.hands.alt} fill placeholder="blur" sizes="(min-width: 1024px) 22vw, 50vw" className="grade object-cover" />
            </figure>
            <p className="mono mt-2 text-fg/50">Pattern 07/14, the coat</p>
          </div>

          <div className="depth w-right col-span-1 lg:col-span-3 lg:col-start-10 lg:row-start-1" data-depth="-40">
            <figure className="ph-tailor relative aspect-[4/3] overflow-hidden rounded-[4px]">
              <Image src={intro.tailor.src} alt={intro.tailor.alt} fill placeholder="blur" sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover grayscale" />
            </figure>
            <p className="mono mt-2 text-fg/50 lg:hidden">Teodor, 41 years at the bench</p>
            <figure className="ph-light relative ml-auto mt-4 hidden aspect-[3/2] w-[82%] overflow-hidden rounded-[4px] lg:block">
              <Image src={intro.light.src} alt={intro.light.alt} fill placeholder="blur" sizes="18vw" className="grade object-cover" />
            </figure>
          </div>

        </div>

        {/* Who we are - a statement set in the display face, with the studio dropped in as tiny photographs */}
        <p className="hero-statement display mt-16 text-[clamp(2rem,5.6vw,5.4rem)] leading-[1.02] tracking-[-0.025em] [--w:76] md:mt-24">
          We&rsquo;re <span className="serif-i normal-case text-acid">nine people</span>{" "}
          <span aria-hidden className="hero-pill inline-flex translate-y-[-0.06em] align-middle">
            {team.map((t, i) => (
              <span key={t.name} className={`relative inline-block h-[0.86em] w-[0.86em] overflow-hidden rounded-full border-[0.06em] border-bg ${i ? "-ml-[0.26em]" : ""}`}>
                <Image src={t.image.src} alt="" fill sizes="80px" className="object-cover grayscale" style={{ objectPosition: t.focus }} />
              </span>
            ))}
          </span>{" "}
          and one long cutting table{" "}
          <span aria-hidden className="hero-pill relative inline-block h-[0.86em] w-[2em] translate-y-[-0.06em] overflow-hidden rounded-full align-middle">
            <Image src={intro.hands.src} alt="" fill sizes="160px" className="grade object-cover" />
          </span>{" "}
          in the Port District, <span className="serif-i normal-case">making clothes</span> to be worn for a decade.
        </p>

        <div className="hero-sub mt-10 grid grid-cols-1 gap-8 border-t border-fg/15 pt-8 md:mt-14 lg:grid-cols-12 lg:items-center">
          <p className="mono text-fg/50 lg:col-span-2">About the studio</p>
          <p className="max-w-[46ch] text-[1.0625rem] leading-relaxed text-fg/75 lg:col-span-5">
            Since 2014 every VANTA piece has been drawn, cut and sewn by us, in the same room, in runs small enough to{" "}
            <mark className="hl hl-manual">know every workshop by name</mark>. No factory, no seasonal sale.
          </p>
          <div className="hero-cta flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
            <AnchorLink href="#studio" className="group mono flex h-12 items-center gap-3 rounded-full bg-fg pl-5 pr-1.5 text-bg">
              Meet the studio
              <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-acid text-ink transition-transform duration-500 group-hover:rotate-90">↓</span>
            </AnchorLink>
            <AnchorLink href="#lookbook" className="mono flex h-12 items-center rounded-full border border-fg/30 px-5 transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-bg">
              See Issue 07
            </AnchorLink>
            <Badge className="relative ml-auto grid h-20 w-20 sm:h-24 sm:w-24 lg:ml-2" small />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Spinning "Issue 07" roundel that links to the shop. */
function Badge({ className = "", small }: { className?: string; small?: boolean }) {
  return (
    <AnchorLink href="#edit" data-cursor="Shop" aria-label="Shop Issue 07" className={`hero-badge shrink-0 place-items-center rounded-full bg-acid text-ink ${className}`}>
      <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite]">
        <defs>
          <path id={small ? "badge-circle-s" : "badge-circle"} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="mono" style={{ fontSize: 9.5, letterSpacing: "0.12em" }} fill="currentColor">
          <textPath href={small ? "#badge-circle-s" : "#badge-circle"}>ISSUE 07 ✶ QUIET ARMOUR ✶ SHOP ✶</textPath>
        </text>
      </svg>
      <span className={`serif-i ${small ? "text-[1.4rem]" : "text-[2rem]"}`}>07</span>
    </AnchorLink>
  );
}
