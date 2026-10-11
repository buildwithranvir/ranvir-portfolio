"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { demos, sceneNo, studio, type Demo } from "@/lib/site";
import { previews } from "@/lib/previews";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { AnchorLink } from "../ui/AnchorLink";
import { ProjectDetail } from "./ProjectDetail";
import { Mark } from "@/components/ui/Mark";

type Opener = (id: Demo["id"], from: HTMLElement | null, shot?: number) => void;
const OpenCtx = createContext<Opener>(() => {});

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");
const onAccent = (d: Demo) => (d.id === "vanta" ? "#140f12" : "#fff");

/** A real screenshot in browser chrome. Hovering scrolls the page inside it. */
function Browser({ d, dark, sizes, priority }: { d: Demo; dark?: boolean; sizes: string; priority?: boolean }) {
  const p = previews[d.id];
  return (
    <div
      className={`overflow-hidden rounded-[12px] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.65)] ring-1 ${dark ? "bg-[#1a1b1e] ring-white/10" : "bg-white ring-black/10"}`}
    >
      <div className={`flex h-8 items-center gap-1.5 px-3.5 ${dark ? "border-b border-white/10" : "border-b border-black/5"}`}>
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span
          className={`hud ml-3 hidden truncate rounded px-2.5 py-0.5 text-[0.625rem] normal-case tracking-normal sm:block ${dark ? "bg-white/5 text-white/50" : "bg-black/[0.04] text-black/45"}`}
        >
          {host(d.url)}
        </span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-x-0 top-0 transition-transform duration-[1.8s] ease-out-expo group-hover:-translate-y-1/2 group-focus-visible:-translate-y-1/2">
          <Image
            src={p.desktop}
            alt={`The ${d.name} website (${d.industry.toLowerCase()}), home page`}
            placeholder="blur"
            sizes={sizes}
            priority={priority}
            className="block h-auto w-full"
          />
          <Image src={p.section} alt="" placeholder="blur" sizes={sizes} className="block h-auto w-full" />
        </div>
      </div>
    </div>
  );
}

function Phone({ d, className = "" }: { d: Demo; className?: string }) {
  return (
    <div className={`rounded-[1.9rem] bg-[#111] p-[6px] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)] ring-1 ring-black/40 ${className}`}>
      <div className="relative overflow-hidden rounded-[1.55rem]">
        <Image src={previews[d.id].mobile} alt={`The ${d.name} website on a phone`} placeholder="blur" sizes="240px" className="block h-auto w-full" />
        <span aria-hidden className="absolute left-1/2 top-1.5 h-3.5 w-14 -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

/** Wraps a preview so clicking it opens the project, zooming out of where it was. */
function OpenPreview({ d, children, className = "", frame = true }: { d: Demo; children: ReactNode; className?: string; frame?: boolean }) {
  const open = useContext(OpenCtx);
  const btn = useRef<HTMLButtonElement>(null);
  return (
    <button
      ref={btn}
      type="button"
      onClick={() => open(d.id, btn.current)}
      className={`group block w-full text-left ${className}`}
      aria-label={`Explore ${d.name}`}
      data-frame={frame || undefined}
    >
      {children}
    </button>
  );
}

function Actions({ d }: { d: Demo }) {
  const open = useContext(OpenCtx);
  const btn = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
      <button
        ref={btn}
        type="button"
        data-frame-hover
        onClick={() => open(d.id, btn.current?.closest("section")?.querySelector<HTMLElement>("[data-frame]") ?? btn.current)}
        className="hud group flex h-12 items-center gap-3 rounded-full pl-5 pr-2 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.5)] transition-[filter,transform] duration-300 hover:-translate-y-0.5 hover:brightness-110"
        style={{ background: d.scene.accent, color: onAccent(d) }}
      >
        Explore the project
        <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-black/20 transition-transform duration-500 group-hover:translate-x-0.5">
          →
        </span>
      </button>
      <a href={d.url} target="_blank" rel="noreferrer" className="hud link-draw flex h-12 items-center px-1">
        Visit the live site ↗<span className="sr-only"> (opens {d.name} in a new tab)</span>
      </a>
    </div>
  );
}

function Label({ d, index }: { d: Demo; index: number }) {
  return (
    <div className="hud flex justify-between gap-4 opacity-70">
      <span>
        {sceneNo(d.id)} · Project {String(index + 1).padStart(2, "0")}
      </span>
      <span>{d.industry}</span>
    </div>
  );
}

function Chips({ items, glass = "glass" }: { items: string[]; glass?: string }) {
  return (
    <ul className="flex flex-wrap justify-center gap-1.5 lg:justify-start">
      {items.map((f) => (
        <li key={f} className={`hud rounded-full px-3 py-1.5 normal-case tracking-[0.02em] ${glass}`}>
          {f}
        </li>
      ))}
    </ul>
  );
}

/**
 * Five real screens from across the site, rolling slowly past (paused on
 * hover). Each one opens the project at that screen.
 */
function Tour({ d, light = false }: { d: Demo; light?: boolean }) {
  const open = useContext(OpenCtx);
  const ref = useRef<HTMLDivElement>(null);
  // only roll while on screen
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-on", e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const shots = previews[d.id].tour;
  const fade = d.scene.bg;
  return (
    <div ref={ref} className="tour mt-12 md:mt-16" style={{ "--tour-speed": "75s" } as CSSProperties}>
      <p className="hud mb-5 text-center opacity-70 lg:text-left">
        Inside {d.name}: {shots.length} screens from the live site
      </p>
      <div className="relative -mx-5 overflow-hidden md:-mx-10">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 md:w-24"
          style={{ background: `linear-gradient(90deg, ${fade}, transparent)` }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 md:w-24"
          style={{ background: `linear-gradient(270deg, ${fade}, transparent)` }}
        />
        <ul className="tour-track flex w-max gap-4 pl-5 will-change-transform md:gap-5 md:pl-10">
          {[0, 1].map((loop) =>
            shots.map((s, i) => (
              <li key={`${loop}-${i}`} className="w-[min(76vw,460px)] shrink-0" aria-hidden={loop === 1 || undefined}>
                <button
                  type="button"
                  tabIndex={loop === 1 ? -1 : 0}
                  onClick={(e) => open(d.id, e.currentTarget, i)}
                  className="group relative block w-full overflow-hidden rounded-[12px] text-left ring-1 ring-black/10"
                  aria-label={`${d.name}: ${d.tour[i]}. Open the project`}
                >
                  <span className="relative block aspect-[16/10]">
                    <Image
                      src={s}
                      alt={`${d.name}: ${d.tour[i]}`}
                      fill
                      sizes="(min-width: 768px) 460px, 76vw"
                      className="object-cover object-top transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
                    />
                  </span>
                  <span
                    className={`hud absolute bottom-3 left-3 rounded-full px-3 py-1.5 normal-case tracking-[0.02em] ${light ? "glass-light text-ink" : "glass text-tungsten"}`}
                  >
                    {String(i + 1).padStart(2, "0")} · {d.tour[i]}
                  </span>
                </button>
              </li>
            )),
          )}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────── Selected work - every site at a glance ─────────────────── */
function Overview() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".ov-head > *", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "clamp(top 78%)", once: true },
        });
        gsap.utils.toArray<HTMLElement>(".ov-tile").forEach((t, i) => {
          gsap.fromTo(
            t,
            { y: 70, scale: 0.96, opacity: 0 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 1.3,
              ease: "expo.out",
              delay: (i % 2) * 0.12,
              scrollTrigger: { trigger: t, start: "clamp(top 90%)", once: true },
            },
          );
        });
      });
      // touch screens: a tap scrolls the card through its site; it stops once it leaves the screen
      if (window.matchMedia("(hover: none)").matches) {
        const io = new IntersectionObserver((entries) => entries.forEach((e) => !e.isIntersecting && e.target.classList.remove("is-playing")), {
          threshold: 0.2,
        });
        ref.current!.querySelectorAll(".ov-tile").forEach((t) => io.observe(t));
        return () => io.disconnect();
      }
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="work" aria-labelledby="work-title" className="wash tone-cream relative overflow-hidden bg-void py-20 text-tungsten md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-10 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgb(var(--glow-a)/0.09),transparent_68%)] [[data-theme=light]_&]:bg-[radial-gradient(circle,rgb(var(--glow-a)/0.2),transparent_68%)]"
      />
      <div className="frame relative">
        <div className="ov-head grid grid-cols-1 gap-6 text-center lg:grid-cols-12 lg:items-end lg:text-left">
          <div className="lg:col-span-7">
            <p className="hud text-dust">{sceneNo("work")} · Selected work</p>
            <h2 id="work-title" className="credit mt-4 text-[clamp(1.98rem,4.14vw,3.96rem)] [--w:84]">
              Every site,{" "}
              <span className="voice normal-case text-amber [font-variation-settings:normal]">
                its{" "}
                <Mark kind="double" tone="pink">
                  own world.
                </Mark>
              </span>
            </h2>
          </div>
          <p className="voice mx-auto max-w-[40ch] text-[1.15rem] leading-[1.6] text-dust lg:col-span-5 lg:mx-0 lg:justify-self-end lg:text-right">
            Concept sites, each designed and built end to end:{" "}
            {demos.map((d, i) => (
              <span key={d.id}>
                <span
                  className="credit mx-0.5 inline-block rounded-md px-2 py-1 align-[0.08em] text-[0.8em] not-italic ring-1 ring-tungsten/10 [--w:105]"
                  style={{ background: d.scene.bg, color: d.scene.accent }}
                >
                  {d.name}
                </span>{" "}
                {d.industry.toLowerCase()}
                {i < demos.length - 2 ? ", " : i === demos.length - 2 ? " and " : ""}
              </span>
            ))}
            . New type, colour and motion every time, because no two businesses should look alike.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-5 md:mt-20 md:grid-cols-2 md:gap-6">
          {demos.map((d, i) => {
            const p = previews[d.id];
            return (
              <li key={d.id}>
                <article className="ov-tile group relative overflow-hidden rounded-[18px] ring-1 ring-tungsten/10" style={{ background: d.scene.bg }}>
                  <div className="relative aspect-[16/11] overflow-hidden [container-type:size]">
                    {/* the site scrolls past inside the card */}
                    <div className="ov-scroll absolute inset-x-0 top-0 transition-transform duration-[7s] ease-in-out group-hover:[transform:translateY(calc(-100%+100cqh))] [.is-playing_&]:[transform:translateY(calc(-100%+100cqh))]">
                      {[p.desktop, ...p.tour.slice(0, 3)].map((src, k) => (
                        <Image
                          key={k}
                          src={src}
                          alt={k ? "" : `The ${d.name} website`}
                          sizes="(min-width: 768px) 46vw, 92vw"
                          placeholder={k ? "empty" : "blur"}
                          className="block h-auto w-full"
                        />
                      ))}
                    </div>
                    <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    <button
                      type="button"
                      onClick={(e) => e.currentTarget.closest(".ov-tile")?.classList.toggle("is-playing")}
                      aria-label={`Scroll through the ${d.name} website`}
                      className="glass hud absolute left-3 top-3 flex h-9 items-center gap-2 rounded-full px-3.5 text-tungsten transition-opacity duration-500 group-hover:opacity-0 md:left-4 md:top-4 [.is-playing_&]:opacity-0"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-amber opacity-70" />
                        <span className="relative h-2 w-2 rounded-full bg-amber" />
                      </span>
                      <span className="[@media(hover:none)]:hidden">Hover to scroll through</span>
                      <span className="hidden [@media(hover:none)]:inline">Tap to scroll through</span>
                    </button>
                  </div>
                  <div className="glass absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-[14px] py-2.5 pl-4 pr-2.5 text-tungsten md:inset-x-4 md:bottom-4">
                    <div className="min-w-0">
                      <p className="hud truncate text-dust">
                        0{i + 1} · {d.industry}
                      </p>
                      <h3 className="credit mt-0.5 text-[clamp(1.22rem,1.8vw,1.62rem)] [--w:110]">{d.name}</h3>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <AnchorLink
                        href={`#${d.id}`}
                        className="hud flex h-10 items-center rounded-full bg-tungsten px-4 text-void transition-colors hover:bg-amber"
                        aria-label={`See the ${d.name} details`}
                      >
                        Details
                      </AnchorLink>
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hud grid h-10 w-10 place-items-center rounded-full border border-tungsten/30 transition-colors hover:border-tungsten"
                        aria-label={`Visit the live ${d.name} site (new tab)`}
                      >
                        ↗
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        <div className="mt-10 flex justify-center md:mt-14">
          <a
            href={studio.templatesUrl}
            target="_blank"
            rel="noreferrer"
            data-frame-hover
            className="hud group flex h-12 items-center gap-3 rounded-full bg-tungsten pl-5 pr-2 text-void transition-colors duration-300 hover:bg-amber"
          >
            See all templates
            <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-void text-tungsten transition-transform duration-500 group-hover:rotate-45">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── Project 1 · NOIR - the cinematic reveal ─────────────────── */
function Noir({ d }: { d: Demo }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".nr-stage", start: "top 92%", end: "top 8%", scrub: 0.6 } })
          .fromTo(".nr-shot", { rotateX: 40, scale: 0.58, yPercent: 4 }, { rotateX: 0, scale: 1, yPercent: 0, ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(".nr-bar-t", { yPercent: 0 }, { yPercent: -100, ease: "power2.inOut", duration: 0.8 }, 0.1)
          .fromTo(".nr-bar-b", { yPercent: 0 }, { yPercent: 100, ease: "power2.inOut", duration: 0.8 }, 0.1)
          .fromTo(".nr-title", { yPercent: 105 }, { yPercent: 0, ease: "expo.out", duration: 0.5 }, 0.45)
          .fromTo(".nr-meta", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, 0.62);
      });
      mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".nr-shot", start: "clamp(top 85%)", once: true } })
          .from(".nr-shot", { rotateX: 26, scale: 0.88, opacity: 0, duration: 1.3, ease: "expo.out" })
          .from(".nr-title", { yPercent: 105, duration: 1, ease: "expo.out" }, 0.2);
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="noir"
      aria-labelledby="noir-title"
      className="stay-dark relative overflow-hidden pb-20 md:pb-28"
      style={{ background: d.scene.bg, color: d.scene.fg }}
    >
      <div className="nr-stage relative flex min-h-[100svh] flex-col justify-center pt-24 lg:h-[100svh] lg:pt-20">
        <span aria-hidden className="nr-bar-t absolute inset-x-0 top-0 z-10 hidden h-[16vh] lg:block" style={{ background: d.scene.fg }} />
        <span aria-hidden className="nr-bar-b absolute inset-x-0 bottom-0 z-10 hidden h-[16vh] lg:block" style={{ background: d.scene.fg }} />
        <div className="frame">
          <Label d={d} index={0} />
        </div>
        <div className="frame relative mt-8 [perspective:1600px] lg:mt-6">
          <div className="nr-shot mx-auto w-full max-w-[880px] origin-center will-change-transform lg:w-[min(54vw,880px)]">
            <OpenPreview d={d}>
              <Browser d={d} sizes="(min-width: 1024px) 60vw, 92vw" />
            </OpenPreview>
          </div>
          <div className="mt-8 grid grid-cols-1 items-end gap-6 text-center lg:absolute lg:inset-x-10 lg:-bottom-4 lg:mt-0 lg:grid-cols-12 lg:text-left">
            <div className="-mt-[0.2em] overflow-hidden pb-[0.08em] pt-[0.2em] lg:col-span-5">
              <h3 id="noir-title" className="nr-title credit text-[clamp(2.88rem,8.1vw,7.2rem)] [--w:115]" style={{ color: d.scene.accent }}>
                {d.name}
              </h3>
            </div>
            <div className="nr-meta glass-light space-y-5 rounded-2xl p-5 md:p-6 lg:col-span-4 lg:col-start-9">
              <p className="voice text-[1.2rem] leading-snug">{d.description}</p>
              <Actions d={d} />
            </div>
          </div>
        </div>
      </div>
      <div className="frame">
        <Tour d={d} light />
      </div>
    </section>
  );
}

/* ─────────────────── Project 2 · VANTA - the editorial spread ─────────────────── */
function Vanta({ d }: { d: Demo }) {
  const ref = useRef<HTMLElement>(null);
  const [info, setInfo] = useState(false);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // the title stretches to full width on mouse-driven screens; on phones it just rises (no per-frame text re-layout)
        const stretch = window.matchMedia("(pointer: fine)").matches;
        gsap.fromTo(
          ".vt-title",
          { "--w": stretch ? 62 : 125, yPercent: 30, opacity: 0 },
          {
            "--w": 125,
            yPercent: 0,
            opacity: 1,
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: ".vt-title", start: "clamp(top 85%)", once: true },
          },
        );
        gsap
          .timeline({ scrollTrigger: { trigger: ".vt-stage", start: "clamp(top 80%)", once: true } })
          .fromTo(".vt-shot", { x: 90, opacity: 0 }, { x: 0, opacity: 1, duration: 1.4, ease: "expo.out" }, 0)
          .from(".vt-phone", { y: 120, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.3)
          .from(".vt-copy > *", { y: 24, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08 }, 0.5);
        gsap.to(".vt-phone-wrap", { yPercent: -18, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 } });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="vanta"
      aria-labelledby="vanta-title"
      className="stay-dark relative overflow-hidden py-20 md:py-28"
      style={{ background: d.scene.bg, color: d.scene.fg }}
    >
      <div className="frame">
        <Label d={d} index={1} />
        <h3
          id="vanta-title"
          className="vt-title credit mt-10 whitespace-nowrap text-center text-[clamp(3.24rem,13.5vw,13.5rem)] leading-[0.8] [--w:125] lg:text-left"
        >
          {d.name}
        </h3>

        <div className="vt-stage relative mt-8 grid grid-cols-1 gap-12 lg:-mt-[3vw] lg:grid-cols-12 lg:gap-8">
          <div className="order-2 flex flex-col gap-10 lg:order-1 lg:col-span-4 lg:pt-[12vw]">
            <div className="vt-phone-wrap hidden w-[62%] self-start lg:block">
              <div className="vt-phone -rotate-6">
                <Phone d={d} />
              </div>
            </div>
            <div className="vt-copy space-y-6 text-center lg:text-left">
              <p className="voice text-[1.3rem] leading-snug opacity-90">{d.description}</p>
              <Chips items={d.features} />
              <Actions d={d} />
            </div>
          </div>

          <div className="relative order-1 lg:order-2 lg:col-span-8">
            <div className="vt-shot relative">
              <OpenPreview d={d}>
                <Browser d={d} dark sizes="(min-width: 1024px) 60vw, 92vw" />
              </OpenPreview>
              {/* design notes slide out from under the preview (hover / focus / tap) */}
              <aside
                className={`absolute -bottom-6 left-4 z-10 w-[min(20rem,80%)] rounded-2xl p-5 text-[#140f12] shadow-2xl transition-all duration-700 ease-out-expo lg:-left-10 lg:bottom-10 ${
                  info ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
                } lg:[.vt-shot:hover_&]:pointer-events-auto lg:[.vt-shot:hover_&]:translate-y-0 lg:[.vt-shot:hover_&]:opacity-100`}
                style={{ background: d.scene.accent }}
                aria-label={`${d.name} design notes`}
              >
                <p className="hud opacity-60">Design notes</p>
                <p className="mt-2 font-medium">{d.fonts}</p>
                <div className="mt-3 flex gap-1.5">
                  {d.palette.map((c) => (
                    <span key={c} title={c} className="h-6 w-6 rounded-full ring-1 ring-black/20" style={{ background: c }} />
                  ))}
                </div>
              </aside>
            </div>
            <div className="mt-10 text-center lg:hidden">
              <button type="button" onClick={() => setInfo((v) => !v)} aria-expanded={info} className="glass hud rounded-full px-4 py-2.5">
                {info ? "Hide" : "Show"} design notes
              </button>
            </div>
          </div>
        </div>
        <Tour d={d} />
      </div>
    </section>
  );
}

/* ─────────────────── Project 3 · ATELIER - the full-screen print ─────────────────── */
function Atelier({ d }: { d: Demo }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        // how much the framed print must grow (and shift) to fill the whole stage
        const cover = () => {
          const stage = ref.current!.querySelector<HTMLElement>(".at-stage")!;
          const box = ref.current!.querySelector<HTMLElement>(".at-clip")!;
          const W = stage.clientWidth,
            H = stage.clientHeight,
            w = box.offsetWidth,
            h = box.offsetHeight;
          return { s: Math.max(W / w, H / h) * 1.02, x: W / 2 - (box.offsetLeft + w / 2), y: H / 2 - (box.offsetTop + h / 2) };
        };
        gsap
          .timeline({ scrollTrigger: { trigger: ".at-stage", start: "top 75%", end: "top 5%", scrub: 0.6, invalidateOnRefresh: true } })
          // the print starts scaled up to fill the room, then settles into its frame (transform only)
          .fromTo(
            ".at-clip",
            { scale: () => cover().s, x: () => cover().x, y: () => cover().y },
            { scale: 1, x: 0, y: 0, ease: "power2.inOut", duration: 1 },
            0,
          )
          .fromTo(".at-img", { scale: 1.08 }, { scale: 1, ease: "none", duration: 1 }, 0)
          .to(".at-over", { opacity: 0, y: -40, duration: 0.4 }, 0.05)
          .fromTo(".at-panel", { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, 0.55);
      });
      mm.add(`${MOTION_OK} and (max-width: 1023px)`, () => {
        gsap.from(".at-card", {
          y: 60,
          scale: 0.96,
          opacity: 0,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: { trigger: ".at-card", start: "clamp(top 85%)", once: true },
        });
      });
    },
    { scope: ref },
  );

  const panel = (
    <div className="glass-light space-y-6 rounded-2xl p-6 text-center md:p-8 lg:text-left">
      <Label d={d} index={2} />
      <h3 id="atelier-title" className="credit text-[clamp(2.34rem,4.32vw,4.14rem)] [--w:96]" style={{ color: d.scene.accent }} data-frame>
        {d.name}
      </h3>
      <p className="voice text-[1.25rem] leading-snug">{d.description}</p>
      <dl className="grid grid-cols-2 gap-4 border-t pt-5 text-left" style={{ borderColor: "rgb(23 24 43 / 0.15)" }}>
        <div>
          <dt className="hud opacity-60">Type</dt>
          <dd className="mt-1 text-[0.95rem]">{d.fonts}</dd>
        </div>
        <div>
          <dt className="hud opacity-60">Palette</dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {d.palette.map((c) => (
              <span key={c} title={c} className="h-5 w-5 rounded-full ring-1 ring-black/15" style={{ background: c }} />
            ))}
          </dd>
        </div>
      </dl>
      <Actions d={d} />
    </div>
  );

  return (
    <section
      ref={ref}
      id="atelier"
      aria-labelledby="atelier-title"
      className="stay-dark relative overflow-hidden pb-20 md:pb-28"
      style={{ background: d.scene.bg, color: d.scene.fg }}
    >
      <div
        aria-hidden
        className="absolute inset-0 [background-image:linear-gradient(rgb(27_44_120/0.07)_1px,transparent_1px),linear-gradient(90deg,rgb(27_44_120/0.07)_1px,transparent_1px)] [background-size:48px_48px]"
      />
      {/* Desktop: the site fills the room, then settles into a framed print */}
      <div className="at-stage relative hidden h-[100svh] lg:block">
        <div className="at-clip absolute left-[4%] top-[15%] h-[70%] w-[49%] overflow-hidden rounded-[14px] will-change-transform">
          <OpenPreview d={d} className="h-full" frame={false}>
            <Image
              src={previews[d.id].desktop}
              alt={`The ${d.name} website, home page`}
              fill
              placeholder="blur"
              sizes="60vw"
              className="at-img object-cover object-left-top"
            />
          </OpenPreview>
        </div>
        <div className="pointer-events-none absolute inset-0">
          <div className="at-over pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-10 text-white motion-reduce:hidden">
            <p className="hud opacity-80">
              {sceneNo("atelier")} · Project 03 · {d.industry}
            </p>
            <p className="credit mt-3 text-[clamp(3.6rem,8.1vw,7.65rem)] [--w:96]">{d.name}</p>
          </div>
        </div>
        <div className="at-panel absolute inset-y-0 right-0 flex w-[45%] items-center pr-10">{panel}</div>
      </div>

      {/* Phones and tablets */}
      <div className="frame relative pt-24 lg:hidden">
        <div className="at-card relative aspect-[16/10] overflow-hidden rounded-[12px] ring-1 ring-black/10">
          <OpenPreview d={d} className="h-full">
            <Image
              src={previews[d.id].desktop}
              alt={`The ${d.name} website, home page`}
              fill
              placeholder="blur"
              sizes="92vw"
              className="object-cover object-top"
            />
          </OpenPreview>
        </div>
        <div className="mx-auto mt-8 max-w-xl">{panel}</div>
      </div>
      <div className="frame relative">
        <Tour d={d} light />
      </div>
    </section>
  );
}

/* ─────────────────── Project 4 · NOVA - the layered experiment ─────────────────── */
function Nova({ d }: { d: Demo }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: ".nv-stage", start: "clamp(top 78%)", once: true }, defaults: { duration: 1.5, ease: "expo.out" } })
          .from(".nv-l1 .nv-in", { x: -120, y: -60, rotate: -14, opacity: 0 }, 0)
          .from(".nv-type", { scale: 1.3, opacity: 0 }, 0.1)
          .from(".nv-l2 .nv-in", { x: 140, y: 40, rotate: 8, opacity: 0 }, 0.15)
          .from(".nv-l3 .nv-in", { y: 160, rotate: -20, opacity: 0 }, 0.3)
          .from(".nv-copy > *", { y: 24, opacity: 0, duration: 1, stagger: 0.08 }, 0.5);
        (
          [
            [".nv-l1", 22],
            [".nv-type", 10],
            [".nv-l2", -6],
            [".nv-l3", -28],
          ] as const
        ).forEach(([sel, amt]) =>
          gsap.fromTo(
            sel,
            { yPercent: -amt / 2 },
            { yPercent: amt / 2, ease: "none", scrollTrigger: { trigger: ".nv-stage", start: "top bottom", end: "bottom top", scrub: 1 } },
          ),
        );
      });
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const stage = ref.current!.querySelector<HTMLElement>(".nv-stage")!;
        const layers = (
          [
            [".nv-l1 .nv-move", 12],
            [".nv-type", 24],
            [".nv-l2 .nv-move", -18],
            [".nv-l3 .nv-move", -40],
          ] as const
        ).map(([sel, k]) => ({ el: stage.querySelector<HTMLElement>(sel)!, k }));
        const setters = layers.map((l) => ({
          x: gsap.quickTo(l.el, "x", { duration: 1, ease: "power3" }),
          y: gsap.quickTo(l.el, "y", { duration: 1, ease: "power3" }),
          k: l.k,
        }));
        const move = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          setters.forEach((s) => {
            s.x(nx * s.k);
            s.y(ny * s.k);
          });
        };
        stage.addEventListener("pointermove", move);
        return () => stage.removeEventListener("pointermove", move);
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="nova"
      aria-labelledby="nova-title"
      className="stay-dark relative overflow-hidden py-20 md:py-28"
      style={{ background: d.scene.bg, color: d.scene.fg }}
    >
      <div className="frame">
        <Label d={d} index={3} />
        <div className="nv-stage relative mt-10 h-[118vw] sm:h-[78vw] lg:h-[min(46vw,720px)]">
          <div className="nv-l1 absolute left-0 top-[2%] w-[70%] lg:w-[46%]">
            <div className="nv-move">
              <div className="nv-in overflow-hidden rounded-[12px] opacity-50 ring-1 ring-white/10">
                <Image src={previews[d.id].section} alt="" placeholder="blur" sizes="(min-width: 1024px) 46vw, 70vw" className="block h-auto w-full" />
              </div>
            </div>
          </div>
          <p
            id="nova-title"
            className="nv-type credit pointer-events-none absolute inset-x-0 top-[28%] text-center text-[clamp(3.6rem,18vw,16.2rem)] leading-none text-transparent [--w:125] lg:top-[16%]"
            style={{ WebkitTextStroke: `1.5px ${d.scene.accent}` }}
          >
            {d.name}
          </p>
          <div className="nv-l2 absolute right-0 top-[34%] w-[92%] sm:top-[26%] lg:top-[14%] lg:w-[58%]">
            <div className="nv-move">
              <div className="nv-in">
                <OpenPreview d={d}>
                  <Browser d={d} dark sizes="(min-width: 1024px) 58vw, 92vw" />
                </OpenPreview>
              </div>
            </div>
          </div>
          <div className="nv-l3 absolute bottom-[2%] left-[4%] w-[34%] sm:w-[22%] lg:bottom-[-2%] lg:left-[30%] lg:w-[14%]">
            <div className="nv-move">
              <div className="nv-in rotate-[-6deg]">
                <Phone d={d} />
              </div>
            </div>
          </div>
        </div>

        <div className="nv-copy mt-16 grid grid-cols-1 gap-6 text-center lg:mt-20 lg:grid-cols-12 lg:text-left">
          <p className="voice mx-auto max-w-[36ch] text-[1.3rem] leading-snug opacity-90 lg:col-span-5 lg:mx-0">{d.description}</p>
          <div className="space-y-6 lg:col-span-5 lg:col-start-8">
            <Chips items={d.features} />
            <Actions d={d} />
          </div>
        </div>
        <Tour d={d} />
      </div>
    </section>
  );
}

/* ─────────────────── All of the work + the project view ─────────────────── */
export function Projects() {
  const [open, setOpen] = useState<{ id: Demo["id"]; rect: DOMRect | null; from: HTMLElement | null; shot?: number } | null>(null);
  const pushed = useRef(false);

  const openProject = useCallback<Opener>((id, from, shot) => {
    setOpen({ id, rect: from?.getBoundingClientRect() ?? null, from, shot });
    if (!pushed.current) {
      history.pushState({ project: id }, "", `#project-${id}`);
      pushed.current = true;
    } else history.replaceState({ project: id }, "", `#project-${id}`);
  }, []);

  const close = useCallback(() => {
    if (pushed.current) history.back();
    else setOpen(null);
  }, []);

  useEffect(() => {
    const onPop = () => {
      pushed.current = false;
      setOpen((o) => {
        o?.from?.focus({ preventScroll: true });
        return null;
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const [noir, vanta, atelier, nova] = demos;
  return (
    <OpenCtx.Provider value={openProject}>
      <Overview />
      <Noir d={noir} />
      <Vanta d={vanta} />
      <Atelier d={atelier} />
      <Nova d={nova} />
      <ProjectDetail state={open} onClose={close} onSwitch={(id) => openProject(id, null)} />
    </OpenCtx.Provider>
  );
}
