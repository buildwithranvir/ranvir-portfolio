"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { projects, type Project } from "@/lib/content";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { ProjectModal } from "../ProjectModal";
import { WorkCarousel } from "./WorkCarousel";

const snap = [0.2, 0.9, 0.1, 1] as const;

/**
 * Selected work as an index and a monitor: point at a project and its frame
 * develops in the viewer while the readout re-scrambles. Images stay small
 * and framed; the list does the talking. The viewer cycles on its own while
 * nobody is pointing at it.
 */
export function Work() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Project | null>(null);
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const close = useCallback(() => setOpen(null), []);
  const p = projects[active];

  // Gentle auto-advance while the viewer is on screen and nobody is choosing
  useEffect(() => {
    if (held || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const viewer = ref.current?.querySelector(".viewer");
    let onScreen = false;
    const io = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting), { threshold: 0.4 });
    if (viewer) io.observe(viewer);
    const id = setInterval(() => onScreen && setActive((a) => (a + 1) % projects.length), 4200);
    return () => {
      clearInterval(id);
      io.disconnect();
    };
  }, [held]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>(".work-row button").forEach((row, i) => {
          ScrollTrigger.create({ trigger: row, start: "top 55%", end: "bottom 55%", onToggle: (self) => self.isActive && setActive(i) });
        });
      });
      mm.add(MOTION_OK, () => {
        const enter = { trigger: ".work-list", start: "clamp(top 82%)", once: true };
        gsap.from(".work-head > p", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: ".work-head", start: "clamp(top 85%)", once: true } });
        gsap.from(".work-row", { y: 26, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, scrollTrigger: enter });
        gsap.from(".work-rule", { scaleX: 0, transformOrigin: "0% 50%", duration: 1, ease: "power3.inOut", stagger: 0.08, scrollTrigger: enter });
        gsap.from(".viewer", { y: 40, opacity: 0, scale: 0.96, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: ".viewer", start: "clamp(top 85%)", once: true } });

        // The monitor leans a few degrees towards the pointer
        if (window.matchMedia("(pointer: fine)").matches) {
          const v = ref.current!.querySelector<HTMLElement>(".viewer-tilt")!;
          const rx = gsap.quickTo(v, "rotateX", { duration: 0.8, ease: "power3" });
          const ry = gsap.quickTo(v, "rotateY", { duration: 0.8, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = v.getBoundingClientRect();
            rx(gsap.utils.clamp(-5, 5, ((e.clientY - (r.top + r.height / 2)) / r.height) * -8));
            ry(gsap.utils.clamp(-6, 6, ((e.clientX - (r.left + r.width / 2)) / r.width) * 10));
          };
          const reset = () => {
            rx(0);
            ry(0);
          };
          ref.current!.addEventListener("pointermove", move);
          ref.current!.addEventListener("pointerleave", reset);
          return () => {
            ref.current?.removeEventListener("pointermove", move);
            ref.current?.removeEventListener("pointerleave", reset);
          };
        }
      });
    },
    { scope: ref },
  );

  // Readout values re-scramble whenever the frame changes
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>(".vw-val").forEach((el, i) => {
        gsap.to(el, { duration: 0.8, delay: i * 0.06, scrambleText: { text: el.dataset.text!, chars: "01/<>_#", speed: 0.7 } });
      });
    },
    { scope: ref, dependencies: [active], revertOnUpdate: false },
  );

  return (
    <section ref={ref} id="work" aria-labelledby="work-title" className="relative py-24 md:py-32">
      <div className="frame">
        <div className="work-head flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end md:justify-between">
          <h2 id="work-title" className="reveal-title wide text-[clamp(2.6rem,6vw,5.5rem)] leading-[0.9]">
            Selected work
          </h2>
          <p className="mono max-w-[38ch] text-mist">04 projects · 2024-2026 · all clients here are fictional demo content</p>
        </div>

        <WorkCarousel onOpen={setOpen} />

        <div className="mt-10 hidden grid-cols-1 gap-10 md:grid lg:mt-14 lg:grid-cols-12 lg:gap-12">
          {/* Index */}
          <ol className="work-list lg:col-span-7" onPointerEnter={() => setHeld(true)} onPointerLeave={() => setHeld(false)}>
            {projects.map((proj, i) => {
              const on = active === i;
              return (
                <li key={proj.id} className="work-row relative">
                  <span aria-hidden className="work-rule absolute inset-x-0 top-0 h-px bg-white/10" />
                  <button
                    type="button"
                    onClick={() => setOpen(proj)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    onFocus={() => {
                      setActive(i);
                      setHeld(true);
                    }}
                    onBlur={() => setHeld(false)}
                    data-cursor="Open"
                    aria-label={`Open case study: ${proj.name}`}
                    className="group relative grid w-full grid-cols-[4.5rem_1fr_auto] items-center gap-x-4 py-4 text-left sm:grid-cols-[5.5rem_1fr_auto] md:py-6 lg:grid-cols-[4rem_1fr_auto]"
                  >
                    {on && (
                      <motion.span
                        layoutId="work-hl"
                        aria-hidden
                        className="absolute inset-y-1 -inset-x-3 -z-0 rounded-2xl bg-white/[0.045] ring-1 ring-white/10"
                        transition={{ type: "spring", stiffness: 300, damping: 32 }}
                      />
                    )}
                    {/* Phones and tablets: a small frame instead of the monitor */}
                    <span className="relative block aspect-square w-full overflow-hidden rounded-xl bg-graphite lg:hidden">
                      <Image src={proj.image.src} alt="" fill placeholder="blur" sizes="96px" className="object-cover" />
                    </span>
                    <span className="mono relative hidden text-signal lg:block">{proj.code}</span>

                    <span className="relative min-w-0">
                      <span className={`wide block text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[0.95] transition-[color,translate] duration-500 ease-snap ${on ? "text-ice lg:translate-x-2" : "text-ice/55"}`}>
                        {proj.name}
                      </span>
                      <span className="mono mt-1.5 block truncate text-mist">
                        <span className="text-signal lg:hidden">{proj.code} · </span>
                        {proj.discipline} · {proj.line}
                      </span>
                    </span>

                    <span className="mono relative flex items-center gap-3 text-mist">
                      <span className="hidden sm:inline">{proj.year}</span>
                      <span
                        aria-hidden
                        className={`grid h-9 w-9 place-items-center rounded-full border transition-all duration-500 ease-snap ${on ? "border-signal bg-signal text-void" : "border-white/15"} group-hover:-rotate-45`}
                      >
                        →
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
            <li aria-hidden className="work-row relative h-px bg-white/10" />
          </ol>

          {/* Monitor */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="viewer sticky top-28 [perspective:1200px]">
              <div className="viewer-tilt glass glass-solid rounded-3xl p-3 will-change-transform">
                <div className="mono flex items-center justify-between px-2 pb-3 pt-1 text-mist">
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                    </span>
                    viewer
                  </span>
                  <span>
                    frame {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(p)}
                  data-cursor="Open"
                  aria-label={`Open case study: ${p.name}`}
                  className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-graphite"
                >
                  {/* all frames stay mounted (decoded once); the active one develops over the others */}
                  {projects.map((x, i) => (
                    <motion.div
                      key={x.id}
                      className="absolute inset-0"
                      style={{ zIndex: i === active ? 2 : 1 }}
                      initial={false}
                      animate={{ clipPath: i === active ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", scale: i === active ? 1 : 1.08 }}
                      transition={{ duration: i === active ? 0.85 : 0.01, delay: i === active ? 0 : 0.85, ease: snap }}
                    >
                      <Image src={x.image.src} alt={i === active ? x.image.alt : ""} fill loading="eager" placeholder="blur" sizes="(min-width: 1024px) 38vw, 1px" className="object-cover" />
                    </motion.div>
                  ))}
                  {/* instrument overlays */}
                  <span aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(0_0_0/0.16)_0_1px,transparent_1px_3px)] mix-blend-multiply" />
                  <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />
                  {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((c) => (
                    <span key={c} aria-hidden className={`pointer-events-none absolute h-4 w-4 border-ice/60 ${c}`} />
                  ))}
                  <span className="mono pointer-events-none absolute bottom-4 left-5 text-ice">
                    {p.code} <span className="text-mist">·</span> {p.name}
                  </span>
                </button>

                <dl className="mono mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/10">
                  {[
                    ["client", p.client.replace(" (fictional)", "")],
                    ["year", p.year],
                    ["result", p.outcome.replace(" (demo figure)", "")],
                  ].map(([k, v]) => (
                    <div key={k} className="min-w-0 bg-graphite/90 px-3 py-2.5">
                      <dt className="text-dim">{k}</dt>
                      <dd key={`${k}-${v}`} className="vw-val mt-0.5 truncate text-ice" data-text={v}>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* frame progress */}
                <div aria-hidden className="mt-3 flex gap-1.5 px-1 pb-1">
                  {projects.map((x, i) => (
                    <span key={x.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                      {i === active && (
                        <motion.span
                          key={`${x.id}-${held}`}
                          className="block h-full rounded-full bg-signal"
                          initial={{ width: held ? "100%" : "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: held ? 0 : 4.2, ease: "linear" }}
                        />
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProjectModal project={open} onClose={close} />
    </section>
  );
}
