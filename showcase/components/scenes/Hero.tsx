"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { demos, sceneNo, studio } from "@/lib/site";
import { previews } from "@/lib/previews";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { afterIntro, introWillPlay, playIntro } from "@/lib/intro";
import { AnchorLink } from "../ui/AnchorLink";
import { Mark } from "@/components/ui/Mark";

/**
 * Dust in the projector light. A warm glow follows the pointer (or drifts on
 * its own on touch screens) and the specks that float through it light up.
 * The glow is a gradient moved with a transform (no painting); the canvas only
 * draws the small specks, 30 times a second, and rests while the hero is off
 * screen or the intro is playing over it.
 */
function Dust() {
  const ref = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const glow = glowRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 1.25);
    const html = document.documentElement;
    let w = 0,
      h = 0,
      raf = 0,
      visible = true,
      t = 0,
      lastDraw = 0;
    const light = { x: 0, y: 0, tx: 0, ty: 0 };
    let specks: { x: number; y: number; r: number; vx: number; vy: number; a: number }[] = [];

    const place = () => (glow.style.transform = `translate3d(${light.x}px, ${light.y}px, 0) translate(-50%, -50%)`);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = w < 700 ? 36 : 80;
      specks = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.5,
        vx: 0.1 + Math.random() * 0.36,
        vy: -0.08 - Math.random() * 0.24,
        a: 0.25 + Math.random() * 0.75,
      }));
      if (!light.x) {
        light.x = light.tx = w * 0.72;
        light.y = light.ty = h * 0.3;
      }
      place();
      draw(false);
    };

    const draw = (move: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const day = html.dataset.theme === "light";
      const s2 = (Math.max(w, h) * 0.25) ** 2;
      for (const p of specks) {
        if (move) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x > w + 4) p.x = -4;
          if (p.y < -4) p.y = h + 4;
        }
        const dx = p.x - light.x;
        const dy = p.y - light.y;
        const lit = Math.exp(-(dx * dx + dy * dy) / (2 * s2));
        const alpha = p.a * (0.06 + 0.9 * lit);
        if (alpha < 0.03) continue;
        ctx.fillStyle = day
          ? `rgba(${(112 + 110 * lit) | 0},${(92 + 20 * lit) | 0},${(200 - 60 * lit) | 0},${(alpha * 0.75).toFixed(2)})`
          : `rgba(255,${(214 + 30 * lit) | 0},${(170 + 60 * lit) | 0},${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || html.classList.contains("intro-playing")) return;
      t += 0.004;
      if (coarse || now - lastMove > 3000) {
        light.tx = w * (0.55 + 0.3 * Math.sin(t * 1.3));
        light.ty = h * (0.35 + 0.18 * Math.sin(t * 2.1 + 1));
      }
      light.x += (light.tx - light.x) * 0.06;
      light.y += (light.ty - light.y) * 0.06;
      place();
      if (now - lastDraw > 32) {
        lastDraw = now;
        draw(true);
      }
    };

    let lastMove = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      light.tx = e.clientX - r.left;
      light.ty = e.clientY - r.top;
      lastMove = performance.now();
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 -z-10 h-[90vmax] w-[90vmax] rounded-full bg-[radial-gradient(circle,rgb(var(--glow-a)/0.16),rgb(var(--glow-c)/0.06)_45%,transparent_70%)] [[data-theme=light]_&]:bg-[radial-gradient(circle,rgb(var(--glow-a)/0.3),rgb(var(--glow-c)/0.16)_45%,transparent_70%)] will-change-transform"
      />
      <canvas ref={ref} aria-hidden className="absolute inset-0 -z-10 block h-full w-full" />
    </>
  );
}

function Letters({ text, className }: { text: string; className: string }) {
  return (
    <span
      aria-hidden
      className={`hn ${className} credit inline-block whitespace-nowrap text-[12.6vw] sm:text-[clamp(2.7rem,8.6vw,8.8rem)]`}
      style={{ "--w": 110 } as CSSProperties}
    >
      {text.split("").map((c, i) => (
        <span key={i} className="inline-block overflow-hidden align-top">
          <span className="ch inline-block">{c}</span>
        </span>
      ))}
    </span>
  );
}

/**
 * Scene 01 — the title. The name is the set: huge, split across the frame,
 * and it pulls focus like a lens — letters near the pointer sharpen and
 * widen, the rest soften. On touch screens the focus sweeps across on its own.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const played = introWillPlay();
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (played) gsap.set(".hn", { opacity: 0 });
        gsap.set(".hero-in", { opacity: 0, y: 24 });
        gsap.set(".hero-reel", { opacity: 0, y: 30 });
      });

      const stop = afterIntro((landed) => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        if (landed) tl.set(".hn", { opacity: 1 });
        else
          tl.set(".hn", { opacity: 1 })
            .from(".hn .ch", { yPercent: 115, duration: 1.1, stagger: 0.035 }, 0)
            .fromTo(".hn", { "--w": 62 }, { "--w": 110, duration: 1.5 }, 0);
        tl.add(() => ref.current?.querySelector(".hero-name")?.classList.add("focus-live"))
          .to(".hero-in", { opacity: 1, y: 0, duration: 1, stagger: 0.09 }, landed ? 0.1 : 0.5)
          .to(".hero-reel", { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, landed ? 0.35 : 0.8);
      });

      // Rack focus
      mm.add(MOTION_OK, () => {
        const name = ref.current!.querySelector<HTMLElement>(".hero-name")!;
        const chars = gsap.utils.toArray<HTMLElement>(".hn .ch");
        let centers: { x: number; y: number }[] = [];
        const measure = () => {
          const base = name.getBoundingClientRect();
          centers = chars.map((c) => {
            const r = c.getBoundingClientRect();
            return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
          });
        };
        const focusAt = (x: number, y: number, radius: number) => {
          chars.forEach((c, i) => {
            const p = centers[i];
            if (!p) return;
            const d = Math.hypot(p.x - x, (p.y - y) * 1.4);
            const f = 1 - Math.min(1, Math.max(0, (d - radius * 0.35) / radius)) * 0.62;
            c.style.setProperty("--f", f.toFixed(3));
          });
        };
        const clear = () => chars.forEach((c) => c.style.setProperty("--f", "1"));
        measure();
        window.addEventListener("resize", measure);

        if (window.matchMedia("(pointer: fine)").matches) {
          let raf = 0;
          const move = (e: PointerEvent) => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
              raf = 0;
              const r = name.getBoundingClientRect();
              focusAt(e.clientX - r.left, e.clientY - r.top, Math.max(260, r.width * 0.32));
            });
          };
          const hero = ref.current!;
          hero.addEventListener("pointermove", move);
          hero.addEventListener("pointerleave", clear);
          return () => {
            cancelAnimationFrame(raf);
            hero.removeEventListener("pointermove", move);
            hero.removeEventListener("pointerleave", clear);
            window.removeEventListener("resize", measure);
          };
        }
        // touch: the focus sweeps slowly along the name
        const sweep = { p: 0 };
        const tw = gsap.to(sweep, {
          p: 1,
          duration: 4.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
          onUpdate: () => {
            const r = name.getBoundingClientRect();
            focusAt(r.width * sweep.p, r.height * (sweep.p < 0.5 ? 0.25 : 0.75), r.width * 0.34);
          },
        });
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tw.play() : tw.pause()));
        io.observe(name);
        return () => {
          io.disconnect();
          window.removeEventListener("resize", measure);
        };
      });

      return stop;
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="wash tone-hero relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-void">
      <Dust />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-void to-transparent" />

      <div className="frame flex flex-1 flex-col pb-20 pt-24 md:pb-24 md:pt-28">
        <div className="hero-in hud grid grid-cols-2 gap-2 text-dust md:grid-cols-4">
          <span>{sceneNo("top")} — Intro</span>
          <span className="text-right md:text-left">Delhi · 28.61° N 77.21° E</span>
          <span className="hidden md:block">{studio.role}</span>
          <span className="hidden text-right md:block">{studio.reach}</span>
        </div>

        <h1 id="hero-title" data-frame className="hero-name focus-name mt-auto flex w-full max-w-[1180px] flex-col self-center pt-10 text-tungsten">
          <span className="sr-only">{studio.name}</span>
          <Letters text="RANVIR" className="hn-1 self-start" />
          <Letters text="KAWATRA" className="hn-2 self-end" />
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12 lg:items-end">
          <p className="hero-in voice mx-auto max-w-[26ch] text-center text-[clamp(1.17rem,1.71vw,1.67rem)] leading-[1.18] lg:col-span-6 lg:mx-0 lg:max-w-none lg:text-left">
            A creative web developer building <span className="text-amber">websites, apps</span> and{" "}
            <Mark kind="circle" tone="coral">
              <span className="text-amber">AI agents</span>
            </Mark>{" "}
            — for clients anywhere in the world.
          </p>
          <div className="flex flex-col items-center gap-6 lg:col-span-5 lg:col-start-8 lg:items-end">
            <div className="hero-in flex flex-wrap justify-center gap-3">
              <AnchorLink
                href="#work"
                data-frame-hover
                className="hud group flex h-12 items-center gap-3 rounded-full bg-tungsten pl-5 pr-2 text-void transition-colors duration-300 hover:bg-amber"
              >
                See the work
                <span
                  aria-hidden
                  className="grid h-8 w-8 place-items-center rounded-full bg-void text-tungsten transition-transform duration-500 group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </AnchorLink>
              <AnchorLink
                href="#about"
                data-frame-hover
                className="hud flex h-12 items-center rounded-full border border-tungsten/30 px-5 transition-colors duration-300 hover:border-tungsten"
              >
                About me
              </AnchorLink>
              <button
                type="button"
                onClick={playIntro}
                data-frame-hover
                className="glass hud group flex h-12 items-center gap-2.5 rounded-full pl-2 pr-5 text-tungsten transition-colors duration-300 hover:text-amber"
              >
                <span
                  aria-hidden
                  className="grid h-8 w-8 place-items-center rounded-full bg-rec text-[0.6rem] text-void transition-transform duration-500 group-hover:scale-110"
                >
                  ▶
                </span>
                Play intro
              </button>
            </div>
            {/* Selected work: a strip of the sites */}
            <div className="w-full lg:w-auto">
              <p className="hero-in hud mb-2.5 text-center text-dust lg:text-right">Selected work</p>
              <ul className="flex gap-2.5">
                {demos.map((d, i) => (
                  <li
                    key={d.id}
                    className="hero-reel min-w-0 flex-1 transition-[flex-grow] duration-500 ease-out-expo hover:grow-[1.8] focus-within:grow-[1.8] lg:w-32 lg:flex-none lg:transition-[width] lg:hover:w-44 lg:focus-within:w-44"
                  >
                    <AnchorLink href={`#${d.id}`} className="group block">
                      <span className="relative block aspect-[16/10] overflow-hidden rounded-[3px] ring-1 ring-tungsten/15">
                        <Image
                          src={previews[d.id].desktop}
                          alt=""
                          fill
                          sizes="160px"
                          className="object-cover object-top opacity-70 transition-[opacity,transform] duration-700 group-hover:scale-105 group-hover:opacity-100"
                        />
                      </span>
                      <span className="hud mt-1.5 flex justify-between gap-2 text-[0.625rem] text-dust transition-colors group-hover:text-tungsten">
                        <span>0{i + 1}</span>
                        <span className="truncate">{d.name}</span>
                      </span>
                    </AnchorLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
