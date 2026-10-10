"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { demos } from "@/lib/site";
import { previews } from "@/lib/previews";
import { gsap, useGSAP } from "@/lib/gsap";
import { introWillPlay, markIntroDone, PLAY_INTRO } from "@/lib/intro";
import { getLenis } from "@/lib/scroll";
import { intro as sx, setSoundPreferred, soundPreferred, subscribeSound, unlock } from "@/lib/sound";

const W1 = "RANVIR";
const W2 = "KAWATRA";

// The montage: four slides, slow enough to read — a big word, its line, and a
// different picture trick on each. `from`: the side the slide comes in from
// (a moving mask: transforms only, no clip-path).
type Slide = {
  word: string;
  line: string;
  site: string;
  layout: "full" | "split" | "window" | "loop";
  imgs: StaticImageData[];
  from: [number, number];
};
const slides: Slide[] = [
  { word: "Websites", line: "that move.", site: "NOIR · Café & bakery", layout: "full", imgs: [previews.noir.tour[0]], from: [100, 0] },
  { word: "Apps", line: "that work.", site: "ATELIER · NOVA", layout: "split", imgs: [previews.atelier.tour[0], previews.nova.tour[1]], from: [0, 100] },
  { word: "AI agents", line: "that think.", site: "NOVA · Creative studio", layout: "window", imgs: [previews.nova.tour[0]], from: [-100, 0] },
  { word: "Automation", line: "that runs itself.", site: "VANTA · Fashion studio", layout: "loop", imgs: [previews.vanta.tour[0]], from: [0, -100] },
];
const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=?";

function Word({ text, className }: { text: string; className: string }) {
  return (
    <span className={`${className} credit inline-block whitespace-nowrap`} style={{ "--w": 110 } as CSSProperties}>
      {text.split("").map((c, i) => (
        <span key={i} className="in-ch inline-block will-change-transform">
          {c}
        </span>
      ))}
    </span>
  );
}

/** A phone outline: `side` tips it both ways, `up` stands it upright, `still` upright, `flat` sideways. */
function PhoneIcon({ turn, className = "" }: { turn: "side" | "up" | "still" | "flat"; className?: string }) {
  const anim = turn === "side" ? "turn-either" : turn === "up" ? "turn-up" : "";
  return (
    <span
      className={`relative block h-[4.6rem] w-[2.6rem] rounded-[0.6rem] border-2 border-current ${anim} ${turn === "flat" ? "rotate-90" : ""} ${className}`}
    >
      <span className="absolute left-1/2 top-1 h-[3px] w-3 -translate-x-1/2 rounded-full bg-current opacity-60" />
      <span className="absolute inset-[5px] top-3 rounded-[0.3rem] bg-amber/25" />
    </span>
  );
}

/** Sound on/off, chosen before the film starts (tapping it doesn't start the film). */
function SoundChip() {
  const pref = useSyncExternalStore(subscribeSound, soundPreferred, () => true);
  return (
    <button
      type="button"
      aria-pressed={pref}
      onClick={(e) => {
        e.stopPropagation();
        setSoundPreferred(!pref);
      }}
      className={`hud flex h-10 items-center gap-2.5 rounded-full border px-4 transition-colors ${pref ? "border-amber/60 text-amber" : "border-tungsten/25 text-dust"}`}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" stroke="none" />
        {pref ? <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" /> : <path d="M17 9l5 6M22 9l-5 6" strokeLinecap="round" />}
      </svg>
      {pref ? "Sound on" : "Sound off"}
    </button>
  );
}

let decided: boolean | null = null;
const willPlay = () => (decided ??= introWillPlay());
// Phones only (not tablets or laptops): a small touch screen.
let phoneDecided: boolean | null = null;
const isPhone = () => (phoneDecided ??= window.matchMedia("(pointer: coarse)").matches && Math.min(screen.width, screen.height) < 600);
const noop = () => () => {};

const tc = (s: number) => {
  const f = Math.floor((s % 1) * 24);
  return `00:00:${String(Math.floor(s)).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
};

/**
 * The opening film — about ten seconds, played on every visit and again from
 * the "Play intro" button. Skippable at any moment (button, Esc, Enter, Space).
 *  1. Leader: a film countdown, 3 · 2 · 1, the hand sweeping round.
 *  2. Montage: four slides, each a word and its line over the real sites.
 *  3. Assembly: the sites fly in from every side and lock into a grid.
 *  4. Title: the name's letters fly in out of the dark and stretch to width.
 *  5. Pull-back: the shutters open and the name lands in the hero.
 * Phones: tilt the phone either way and the film starts by itself (or, if it
 * stays upright, it plays upright after a few seconds). Replaying asks:
 * portrait or landscape?
 */
export function Intro() {
  const first = useSyncExternalStore(noop, willPlay, () => false);
  const phone = useSyncExternalStore(noop, isPhone, () => false);
  const [run, setRun] = useState(0);

  // "Play intro": mount a fresh film
  useEffect(() => {
    const replay = () => {
      document.documentElement.classList.remove("intro-seen");
      setRun((r) => r + 1);
    };
    window.addEventListener(PLAY_INTRO, replay);
    return () => window.removeEventListener(PLAY_INTRO, replay);
  }, []);

  return (
    <>
      <div className="intro stay-dark fixed inset-0 z-[100] overflow-hidden">
        {/* the shutters: two halves of the dark that open at the end */}
        <div className="in-shut-t absolute inset-x-0 top-0 h-1/2 bg-void" />
        <div className="in-shut-b absolute inset-x-0 bottom-0 h-1/2 bg-void" />
        {/* the projector lamp warming up while the page loads */}
        <span
          aria-hidden
          className="in-boot absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-amber shadow-[0_0_50px_18px_rgb(255_180_90/0.45)]"
        />
        {(first || run > 0) && <Film key={run} phone={phone} replay={run > 0} />}
      </div>
      {/* after a sideways film: a gentle nudge to hold the phone upright again */}
      {phone && (
        <p
          role="status"
          className="rk-upright glass hud pointer-events-none invisible fixed inset-x-4 top-20 z-[95] mx-auto flex max-w-xs items-center justify-center gap-3 rounded-full px-4 py-3 text-tungsten opacity-0"
        >
          <PhoneIcon turn="up" className="!h-6 !w-3.5 !rounded-[0.25rem] !border-[1.5px] [&>span]:hidden" />
          Turn your phone back upright
        </p>
      )}
    </>
  );
}

function Film({ phone, replay }: { phone: boolean; replay: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  // the prompt buttons and the skip button call into the running film
  const act = useRef<{ choose?: (m: "portrait" | "landscape") => void; skip?: () => void; begin?: () => void }>({});

  useGSAP(
    () => {
      const root = ref.current!;
      const overlay = root.parentElement!;
      const html = document.documentElement;
      const q = gsap.utils.selector(root);
      const land = window.matchMedia("(orientation: landscape)");
      const lenis = getLenis();
      const cleanups: (() => void)[] = [];
      const shutT = overlay.querySelector(".in-shut-t");
      const shutB = overlay.querySelector(".in-shut-b");
      const boot = overlay.querySelector(".in-boot");

      // reset the overlay's shared parts (a replay reuses them)
      gsap.set([shutT, shutB], { yPercent: 0 });
      gsap.set(boot, { autoAlpha: 1, scale: 1 });
      if (replay) {
        lenis?.scrollTo(0, { immediate: true, force: true });
        window.scrollTo(0, 0);
      }
      html.style.overflow = "hidden";
      lenis?.stop();
      html.classList.add("intro-playing"); // pauses the hero's dust while the film runs

      let ended = false;
      const finish = (flew: boolean) => {
        if (ended) return;
        ended = true;
        markIntroDone(flew);
        sx.end();
        if (replay) gsap.set(document.querySelectorAll(".hn"), { opacity: 1 });
        html.classList.add("intro-seen"); // hides the overlay (CSS)
        html.classList.remove("intro-playing");
        html.style.overflow = "";
        lenis?.start();
        // finished sideways on a phone: suggest turning back
        if (phone && land.matches) {
          const tip = document.querySelector(".rk-upright");
          gsap.fromTo(tip, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out" });
          const off = () => gsap.to(tip, { autoAlpha: 0, duration: 0.4 });
          setTimeout(off, 5000);
          land.addEventListener("change", off, { once: true });
        }
      };

      // Where each title word has to land in the hero (measured when the pull-back starts)
      const flight = (sel: string, target: string) => {
        const a = root.querySelector<HTMLElement>(sel)!;
        const b = document.querySelector<HTMLElement>(target);
        let cache: { x: number; y: number; scale: number } | null = null;
        const v = () => {
          if (cache) return cache;
          if (!b) return (cache = { x: 0, y: -80, scale: 0.6 });
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          return (cache = { x: rb.left - ra.left, y: rb.top - ra.top, scale: rb.height / ra.height });
        };
        return { x: () => v().x, y: () => v().y, scale: () => v().scale };
      };

      let t: gsap.core.Timeline | null = null;

      /** Builds the film for the screen as it is now (so a sideways phone gets sideways measurements). */
      const build = (landsOnHero: boolean) => {
        const small = window.innerWidth < 768;
        const timecode = q(".in-tc")[0];
        const bar = q(".in-progress")[0];
        let frame = 0;
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          onUpdate() {
            bar.style.transform = `scaleX(${this.progress()})`;
            if (frame++ % 2 === 0) timecode.textContent = tc(this.time());
          },
        });

        /* ── 1 · Leader (0 – 2.4s) ── */
        tl.set(".in-w1, .in-w2", { transformOrigin: "0% 0%" })
          .set(".in-stage", { autoAlpha: 1 })
          .to(boot, { scale: 14, autoAlpha: 0, duration: 0.5, ease: "power2.in" }, 0)
          .fromTo(".in-leader", { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, 0)
          .from(".in-hud > *", { opacity: 0, y: 8, duration: 0.6, stagger: 0.06 }, 0.1)
          .call(sx.leader, [], 0);
        [0, 1, 2].forEach((i) => {
          const at = 0.15 + i * 0.85;
          tl.set(".in-num", { autoAlpha: 0 }, at)
            .set(`.in-num-${i}`, { autoAlpha: 1 }, at)
            .fromTo(`.in-num-${i}`, { scale: 1.25 }, { scale: 1, duration: 0.6, ease: "power3.out" }, at)
            .fromTo(".in-hand", { rotate: 0 }, { rotate: 360, duration: 0.82, ease: "none", immediateRender: false }, at)
            .fromTo(".in-glow", { opacity: 0.9, scale: 0.9 }, { opacity: 0.25, scale: 1, duration: 0.7, ease: "power2.out", immediateRender: false }, at)
            .fromTo(".in-flash", { opacity: 0.14 }, { opacity: 0, duration: 0.25, ease: "power1.out", immediateRender: false }, at)
            .call(sx.count, [i], at);
        });
        tl.to(".in-leader", { scale: 0.35, autoAlpha: 0, duration: 0.45, ease: "power3.in" }, 2.65).call(sx.out, [], 2.65);

        /* ── 2 · Montage (2.95 – 8.35s): four slides, about 1.35s each ── */
        const M = 2.95;
        const D = 1.35;
        q(".in-cut").forEach((cut, i) => {
          const at = M + i * D;
          const sl = slides[i];
          const [fx, fy] = sl.from;
          const chars = cut.querySelectorAll<HTMLElement>(".in-cut-ch");
          tl.set(cut, { visibility: "visible" }, at)
            .fromTo(cut, { xPercent: fx, yPercent: fy }, { xPercent: 0, yPercent: 0, duration: 0.6, ease: "expo.out" }, at)
            .call(sx.slide, [i], at)
            .from(chars, { yPercent: 110, opacity: 0, duration: 0.75, ease: "expo.out", stagger: 0.04 }, at + 0.15)
            .from(cut.querySelector(".in-cut-tag"), { opacity: 0, y: 10, duration: 0.5, ease: "power2.out" }, at + 0.2)
            .from(cut.querySelector(".in-cut-line"), { opacity: 0, y: 26, duration: 0.75, ease: "expo.out" }, at + 0.5);
          const media = cut.querySelector(".in-media");
          if (sl.layout === "full" || sl.layout === "loop")
            tl.fromTo(
              media,
              { scale: 1.25, xPercent: -fx * 0.3, yPercent: -fy * 0.3 },
              { scale: 1.04, xPercent: 0, yPercent: 0, duration: D + 0.4, ease: "power2.out" },
              at,
            );
          if (sl.layout === "split")
            // the screen tears in two: one half drops in, the other rises to meet it
            tl.fromTo(cut.querySelector(".in-half-0"), { yPercent: -100 }, { yPercent: 0, duration: 0.85, ease: "expo.out" }, at)
              .fromTo(cut.querySelector(".in-half-1"), { yPercent: 100 }, { yPercent: 0, duration: 0.85, ease: "expo.out" }, at + 0.1)
              .fromTo(cut.querySelectorAll(".in-half img"), { scale: 1.2 }, { scale: 1, duration: D + 0.3, ease: "power2.out" }, at);
          if (sl.layout === "window") {
            // a window opens on the dark, a scan line reads it, and the word decodes itself
            tl.fromTo(
              cut.querySelector(".in-window"),
              { scale: 0.35, rotate: -6, opacity: 0 },
              { scale: 1, rotate: 0, opacity: 1, duration: 0.95, ease: "expo.out" },
              at + 0.05,
            ).fromTo(cut.querySelector(".in-scan"), { yPercent: -120 }, { yPercent: 620, duration: 1.2, ease: "none" }, at + 0.3);
            const real = sl.word.split("");
            tl.to(
              { p: 0 },
              {
                p: 1,
                duration: 0.95,
                ease: "none",
                onUpdate() {
                  const p = this.progress();
                  chars.forEach((c, k) => {
                    if (real[k] === " ") return;
                    c.textContent = p >= ((k + 1) / real.length) * 0.9 ? real[k] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
                  });
                },
              },
              at + 0.15,
            );
          }
          if (sl.layout === "loop")
            // the line itself, running on a loop behind the word
            tl.fromTo(cut.querySelectorAll(".in-loop-0"), { xPercent: 0 }, { xPercent: -22, duration: D + 0.4, ease: "none" }, at).fromTo(
              cut.querySelectorAll(".in-loop-1"),
              { xPercent: -22 },
              { xPercent: 0, duration: D + 0.4, ease: "none" },
              at,
            );
        });
        tl.call(sx.montage, [slides.length * 4, D / 4, 4], M);
        const montageEnd = M + slides.length * D;
        tl.to(".in-montage", { scale: 0.92, autoAlpha: 0, duration: 0.35, ease: "power2.in" }, montageEnd).fromTo(
          ".in-flash",
          { opacity: 0.45 },
          { opacity: 0, duration: 0.5, ease: "power2.out", immediateRender: false },
          montageEnd + 0.3,
        );

        /* ── 3 · Assembly (5.1 – 7.1s) ── */
        const A = montageEnd + 0.3;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const from = [
          { x: -0.7 * W, y: -0.5 * H, rotate: -24 },
          { x: 0.7 * W, y: -0.5 * H, rotate: 20 },
          { x: -0.7 * W, y: 0.6 * H, rotate: 18 },
          { x: 0.7 * W, y: 0.6 * H, rotate: -22 },
        ];
        tl.call(sx.assembly, [], A)
          .call(sx.claim, [], A + 0.95)
          .call(sx.rise, [A + 2.15 - (A + 1.35)], A + 1.35)
          .set(".in-grid", { visibility: "visible" }, A)
          .fromTo(
            ".in-tile",
            { x: (i) => from[i % 4].x, y: (i) => from[i % 4].y, rotate: (i) => from[i % 4].rotate, rotateX: 55, scale: 0.5, opacity: 0 },
            { x: 0, y: 0, rotate: 0, rotateX: 0, scale: 1, opacity: 1, duration: 1.05, ease: "expo.out", stagger: 0.09 },
            A,
          )
          .from(".in-tile-cap", { opacity: 0, y: 10, duration: 0.5, stagger: 0.06 }, A + 0.55)
          .fromTo(
            ".in-grid-in",
            { rotateX: 0, rotateZ: 0, scale: 1 },
            { rotateX: small ? 38 : 48, rotateZ: small ? -8 : -14, scale: small ? 0.9 : 0.82, duration: 1.4, ease: "power2.inOut" },
            A + 0.75,
          )
          .to(".in-dim", { opacity: 1, duration: 0.5, ease: "power2.out" }, A + 0.8)
          .from(".in-claim > * > *", { yPercent: 110, duration: 0.8, stagger: 0.08 }, A + 0.95)
          .to(".in-claim > * > *", { yPercent: -110, duration: 0.45, ease: "power3.in", stagger: 0.05 }, A + 1.85)
          .set(".in-claim", { autoAlpha: 0 }, A + 2.4)
          .to(".in-dim", { opacity: 0, duration: 0.4, ease: "power2.in" }, A + 1.95)
          .to(".in-grid-in", { scale: 0.2, rotateZ: 30, opacity: 0, duration: 0.6, ease: "power3.in" }, A + 1.9);

        /* ── 4 · Title (7.2 – 9.0s) ── */
        const T = A + 2.15;
        tl.fromTo(".in-rule", { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "expo.inOut" }, T - 0.25)
          .fromTo(".in-flash", { opacity: 0.3 }, { opacity: 0, duration: 0.6, immediateRender: false }, T)
          .fromTo(
            ".in-ch",
            {
              x: () => gsap.utils.random(-0.45, 0.45) * W,
              y: () => gsap.utils.random(-0.45, 0.45) * H,
              rotate: () => gsap.utils.random(-180, 180),
              scale: () => gsap.utils.random(1.6, 3),
              opacity: 0,
            },
            { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, duration: 1.15, ease: "expo.out", stagger: { each: 0.03, from: "random" } },
            T,
          )
          .call(sx.title, [], T)
          .call(sx.stretch, [], T + 0.35)
          .fromTo(".in-w1, .in-w2", { "--w": 62 }, { "--w": 110, duration: 1.4, ease: "expo.out" }, T + 0.35)
          .from(".in-line > *", { opacity: 0, y: 14, duration: 0.6, stagger: 0.05 }, T + 0.7)
          .to(".in-rule", { scaleX: 0, transformOrigin: "100% 50%", duration: 0.6, ease: "expo.inOut" }, T + 1.3);

        /* ── 5 · Pull-back (9.0 – 10.2s) ── */
        const P = T + 1.75;
        tl.addLabel("pull", P)
          .call(sx.land, [], P)
          .to(".in-line, .in-hud", { opacity: 0, duration: 0.35, ease: "power2.out" }, "pull")
          .to(".in-skip", { autoAlpha: 0, duration: 0.3 }, "pull");
        if (landsOnHero) {
          const heroInk = getComputedStyle(document.querySelector(".hero-name") ?? document.body).color;
          tl.to(".in-w1, .in-w2", { color: heroInk, duration: 1.15, ease: "expo.inOut" }, "pull")
            .to(".in-w1", { ...flight(".in-w1", ".hn-1"), duration: 1.15, ease: "expo.inOut" }, "pull")
            .to(".in-w2", { ...flight(".in-w2", ".hn-2"), duration: 1.15, ease: "expo.inOut" }, "pull+=0.05")
            .to(shutT, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, "pull+=0.15")
            .to(shutB, { yPercent: 100, duration: 1.05, ease: "expo.inOut" }, "pull+=0.15")
            .call(() => finish(true));
        } else {
          // phones: the title steps back and the shutters open on the site
          tl.to(".in-w1, .in-w2", { scale: 0.9, opacity: 0, duration: 0.5, ease: "power2.in", stagger: 0.05 }, "pull")
            .to(shutT, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "pull+=0.3")
            .to(shutB, { yPercent: 100, duration: 1, ease: "expo.inOut" }, "pull+=0.3")
            .call(() => finish(false));
        }
        return tl;
      };

      // the film only rolls once its screenshots are decoded (no stutter on the first cuts) — never waiting more than 2.5s
      const ready = Promise.race([
        Promise.all(Array.from(root.querySelectorAll<HTMLImageElement>(".in-film img")).map((img) => img.decode().catch(() => {}))),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
      let state: "prompt" | "film" | "out" = "prompt";
      gsap.set(boot, { autoAlpha: 0 });
      const show = (sel: string) => gsap.to(sel, { autoAlpha: 1, duration: 0.5, ease: "power2.out", overwrite: true });
      const hide = (sel: string) => gsap.to(sel, { autoAlpha: 0, duration: 0.35, ease: "power2.out", overwrite: true });
      const start = () => {
        if (state !== "prompt") return;
        state = "film";
        hide(".in-turn, .in-choose, .in-gate");
        gsap.set(boot, { autoAlpha: 1, scale: 1 });
        sx.begin();
        sx.power();
        if (replay && !phone) gsap.set(document.querySelectorAll(".hn"), { opacity: 0 });
        ready.then(() => {
          if (state !== "film" || !ref.current) return;
          t = build(!phone);
          if (document.hidden) t.pause();
        });
      };

      // a tab opened in the background holds the film until someone is watching
      const onVis = () => {
        if (!t || state !== "film") return;
        if (document.hidden) t.pause();
        else t.play();
      };
      document.addEventListener("visibilitychange", onVis);

      const skip = () => {
        if (state === "out" || ended) return;
        if (state === "prompt") unlock(); // skipping is a click too: the site's sound can start
        sx.skip();
        if (!phone && t) {
          t.progress(1);
          return;
        }
        state = "out";
        t?.pause();
        hide(".in-turn, .in-choose, .in-gate");
        if (replay) gsap.set(document.querySelectorAll(".hn"), { opacity: 1 });
        gsap
          .timeline({ onComplete: () => finish(false) })
          .set(boot, { autoAlpha: 0 })
          .to(".in-stage, .in-skip", { opacity: 0, duration: 0.35, ease: "power2.in" }, 0)
          .to(shutT, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, 0.2)
          .to(shutB, { yPercent: 100, duration: 0.9, ease: "expo.inOut" }, 0.2);
      };

      // the click/tap that starts the film also switches the sound on
      // (a replay is started from its own button or the portrait/landscape choice instead)
      const begin = () => {
        if (state !== "prompt" || replay) return;
        unlock();
        start();
      };

      if (!phone) {
        act.current = { skip, begin };
        if (replay) start();
        else show(".in-gate");
      } else {
        // tilting either way starts the film
        let waitingForTurn = false;
        const onTurn = () => {
          if (state === "prompt" && waitingForTurn && land.matches) start();
        };
        land.addEventListener("change", onTurn);
        cleanups.push(() => land.removeEventListener("change", onTurn));
        // first visit: the card asks for a tilt and a tap (the tap is what lets the sound play)
        // replay, landscape chosen: sound is already allowed, so the tilt alone starts it
        const askToTurn = (tiltStarts: boolean) => {
          if (tiltStarts && land.matches) return start();
          waitingForTurn = tiltStarts;
          show(".in-turn");
        };
        act.current = {
          skip,
          begin,
          choose: (m) => {
            hide(".in-choose");
            if (m === "portrait") start();
            else setTimeout(() => askToTurn(true), 300);
          },
        };
        if (replay) show(".in-choose");
        else askToTurn(false);
      }

      // keyboard: Enter or Space begins the film from the first card; Esc (or either, mid-film) skips it
      const onKey = (e: KeyboardEvent) => {
        if (!["Escape", "Enter", " "].includes(e.key)) return;
        if ((e.target as HTMLElement).closest?.("button")) return;
        e.preventDefault();
        if (state === "prompt" && e.key !== "Escape") begin();
        else skip();
      };
      window.addEventListener("keydown", onKey);

      return () => {
        window.removeEventListener("keydown", onKey);
        document.removeEventListener("visibilitychange", onVis);
        cleanups.forEach((c) => c());
        t?.kill();
        if (!ended) {
          html.classList.remove("intro-playing");
          html.style.overflow = "";
          lenis?.start();
        }
      };
    },
    { scope: ref },
  );

  return (
    // a click or tap anywhere on the first card begins the film — even in the instant before the card has faded in
    <div ref={ref} className="absolute inset-0" onClick={() => act.current.begin?.()}>
      <div aria-hidden className="in-stage in-film pointer-events-none invisible absolute inset-0">
        {/* 1 · leader */}
        <div className="in-leader invisible absolute inset-0 grid place-items-center">
          <div className="relative aspect-square w-[min(60vw,50vh)]">
            <div className="in-glow absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(255_180_90/0.32),rgb(255_180_90/0.08)_70%,transparent_72%)] will-change-transform" />
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full overflow-visible">
              <circle cx="100" cy="100" r="98" fill="none" className="stroke-tungsten/30" strokeWidth="1" />
              <circle cx="100" cy="100" r="80" fill="none" className="stroke-tungsten/20" strokeWidth="1" />
              <line x1="-60" y1="100" x2="260" y2="100" className="stroke-tungsten/20" strokeWidth="1" />
              <line x1="100" y1="-30" x2="100" y2="230" className="stroke-tungsten/20" strokeWidth="1" />
            </svg>
            {/* the sweep hand: a rotating line (transform only) */}
            <div className="in-hand absolute bottom-1/2 left-1/2 h-[49%] w-[2px] -translate-x-1/2 origin-bottom bg-amber shadow-[0_0_14px_2px_rgb(255_180_90/0.6)] will-change-transform" />
            {["3", "2", "1"].map((n, i) => (
              <span
                key={n}
                className={`in-num in-num-${i} credit invisible absolute inset-0 grid place-items-center text-[min(32vw,26vh)] text-tungsten will-change-transform [--w:70]`}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* 2 · montage */}
        <div className="in-montage absolute inset-0">
          {slides.map((sl, i) => (
            <div key={i} className="in-cut invisible absolute inset-0 overflow-hidden bg-void will-change-transform" style={{ zIndex: i + 1 }}>
              {(sl.layout === "full" || sl.layout === "loop") && (
                <div className={`in-media absolute inset-0 will-change-transform ${sl.layout === "loop" ? "opacity-30 grayscale" : ""}`}>
                  <Image src={sl.imgs[0]} alt="" fill sizes="(max-width: 900px) 80vw, 70vw" quality={55} loading="eager" className="object-cover object-top" />
                </div>
              )}
              {sl.layout === "split" && (
                <div className="absolute inset-0 flex portrait:flex-col">
                  {sl.imgs.map((img, k) => (
                    <div
                      key={k}
                      className={`in-half in-half-${k} relative flex-1 overflow-hidden will-change-transform ${k ? "" : "border-r border-amber/50 portrait:border-b portrait:border-r-0"}`}
                    >
                      <Image src={img} alt="" fill sizes="50vw" quality={55} loading="eager" className="object-cover object-top will-change-transform" />
                    </div>
                  ))}
                </div>
              )}
              {sl.layout === "window" && (
                <div className="absolute inset-0 grid place-items-center [background-image:radial-gradient(rgb(241_232_216/0.14)_1px,transparent_1px)] [background-size:22px_22px]">
                  <div className="in-window relative aspect-[16/10] w-[min(80vw,105vh,980px)] overflow-hidden rounded-xl shadow-[0_40px_80px_-20px_rgb(0_0_0/0.9)] ring-1 ring-tungsten/20 will-change-transform">
                    <Image
                      src={sl.imgs[0]}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 80vw, 60vw"
                      quality={55}
                      loading="eager"
                      className="object-cover object-top"
                    />
                    <span className="in-scan absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-amber/0 via-amber/30 to-amber/0 will-change-transform" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(11_10_9/0.62),rgb(11_10_9/0.9))]" />
              {sl.layout === "loop" && (
                <div className="absolute inset-0 flex flex-col justify-center gap-1 overflow-hidden opacity-50">
                  {[0, 1, 2, 3, 4].map((r) => (
                    <p
                      key={r}
                      className={`in-loop-${r % 2} credit whitespace-nowrap text-[clamp(2rem,7vw,6rem)] text-transparent will-change-transform [--w:100] [-webkit-text-stroke:1px_rgb(255_180_90/0.55)]`}
                    >
                      {"Runs itself · ".repeat(8)}
                    </p>
                  ))}
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
                <p className="in-cut-tag hud mb-4 text-tungsten/75">
                  {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")} — {sl.site}
                </p>
                <p
                  className="in-cut-word credit overflow-hidden whitespace-nowrap pb-[0.04em] pt-[0.1em] leading-[0.9] text-tungsten [--w:110] [text-shadow:0_6px_30px_rgb(0_0_0/0.6)]"
                  // as big as it can be, but a long word (AUTOMATION) always fits on one line, even on a narrow phone
                  style={{ fontSize: `min(clamp(2.6rem, 10.5vw, 9.5rem), calc(88vw / ${(sl.word.length * 0.78).toFixed(2)}))` }}
                >
                  {sl.word.split("").map((c, k) => (
                    <span key={k} className="in-cut-ch inline-block will-change-transform">
                      {c === " " ? "\u00a0" : c}
                    </span>
                  ))}
                </p>
                <p className="in-cut-line voice mt-3 text-[clamp(1.8rem,5.4vw,4.4rem)] leading-none text-amber [text-shadow:0_4px_24px_rgb(0_0_0/0.7)]">
                  {sl.line}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 3 · assembly */}
        <div className="in-grid invisible absolute inset-0 grid place-items-center [perspective:1400px]">
          <div className="in-grid-in grid w-[min(84vw,110vh,960px)] grid-cols-2 gap-3 [transform-style:preserve-3d] md:gap-5">
            {demos.map((d, i) => (
              <figure key={d.id} className="in-tile will-change-transform">
                <div className="relative aspect-[16/10] overflow-hidden rounded-md shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] ring-1 ring-tungsten/15">
                  <Image
                    src={previews[d.id].desktop}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 40vw, 42vw"
                    quality={55}
                    loading="eager"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="in-tile-cap hud mt-2 flex justify-between text-[0.625rem] text-dust md:text-[0.6875rem]">
                  <span>
                    {String(i + 1).padStart(2, "0")} · {d.name}
                  </span>
                  <span className="hidden sm:inline">{d.industry}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          {/* a dark veil behind the line, so it reads over light screenshots */}
          <div className="in-dim absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(11_10_9/0.9)_0%,rgb(11_10_9/0.78)_45%,rgb(11_10_9/0.35)_80%)] opacity-0 will-change-[opacity]" />
          <p className="in-claim voice absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center text-center text-[clamp(2.2rem,6.4vw,5.4rem)] leading-[1.02] text-tungsten [text-shadow:0_4px_24px_rgb(0_0_0/0.85)]">
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="block">Infinite sites.</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span className="block text-amber">One developer.</span>
            </span>
          </p>
        </div>

        {/* 4 · title */}
        <div className="absolute inset-0 flex items-center justify-center px-[9%]">
          <div className="relative flex w-full max-w-[1180px] flex-col text-tungsten">
            <span className="in-rule absolute inset-x-0 top-1/2 h-px origin-left scale-x-0 bg-amber shadow-[0_0_24px_4px_rgb(255_180_90/0.5)]" />
            <Word text={W1} className="in-w1 self-start text-[12.6vw] sm:text-[clamp(2.7rem,8.6vw,8.8rem)]" />
            <Word text={W2} className="in-w2 self-end text-[12.6vw] sm:text-[clamp(2.7rem,8.6vw,8.8rem)]" />
            <p className="in-line voice mt-5 flex flex-wrap gap-x-[0.3em] self-start text-[clamp(1rem,1.8vw,1.45rem)] text-dust">
              {"Creative web developer — websites, apps & AI agents.".split(" ").map((w, i) => (
                <span key={i} className="inline-block">
                  {w}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* the projector's light and the camera's readout, over everything */}
        <div className="in-flash absolute inset-0 bg-tungsten opacity-0 will-change-[opacity]" style={{ zIndex: 20 }} />
        <div className="in-hud hud absolute inset-0 p-4 text-tungsten/75 md:p-6" style={{ zIndex: 21 }}>
          <span className="absolute left-4 top-4 flex items-center gap-2 md:left-6 md:top-6">
            <span className="rec-blink h-2 w-2 rounded-full bg-rec" /> Ranvir Kawatra · Portfolio
          </span>
          <span className="in-tc absolute right-4 top-4 tabular-nums md:right-6 md:top-6">00:00:00:00</span>
          <span className="absolute bottom-4 left-4 hidden sm:block md:bottom-6 md:left-6">Delhi, India · {new Date().getFullYear()}</span>
          {[
            "left-3 top-12 border-l border-t",
            "right-3 top-12 border-r border-t",
            "bottom-16 left-3 border-b border-l",
            "bottom-16 right-3 border-b border-r",
          ].map((c) => (
            <span key={c} className={`absolute h-6 w-6 border-tungsten/40 md:h-8 md:w-8 ${c}`} />
          ))}
        </div>
      </div>

      {/* laptops and tablets: click anywhere to begin */}
      {!phone && (
        <div
          role="button"
          tabIndex={-1}
          aria-label="Begin the intro"
          onClick={() => act.current.begin?.()}
          className="in-gate invisible absolute inset-0 z-40 flex cursor-pointer items-center justify-center p-6 text-center opacity-0"
        >
          <div className="flex flex-col items-center gap-6">
            <span aria-hidden className="relative grid h-16 w-16 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full border border-amber/50 [animation-duration:2.2s]" />
              <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_40px_14px_rgb(255_180_90/0.5)]" />
            </span>
            <p className="hud flex items-center gap-2 text-dust">
              <span className="rec-blink h-1.5 w-1.5 rounded-full bg-rec" /> Ranvir Kawatra · Portfolio
            </p>
            <p className="voice text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.02] text-tungsten">Click anywhere to begin</p>
            <p className="max-w-[40ch] text-[1rem] leading-relaxed text-dust">A ten-second film — best with the sound up.</p>
            <SoundChip />
          </div>
        </div>
      )}

      {phone && (
        <>
          {/* tilt, then tap anywhere (the tap is what lets the sound play) */}
          <div
            role="button"
            tabIndex={-1}
            aria-label="Begin the intro"
            onClick={() => act.current.begin?.()}
            className="in-turn invisible absolute inset-0 z-40 flex cursor-pointer items-center justify-center bg-void p-6 text-center opacity-0"
          >
            <div className="flex max-w-sm flex-col items-center gap-5 landscape:max-w-lg landscape:gap-3">
              <div className="grid h-28 w-28 shrink-0 place-items-center text-tungsten landscape:hidden">
                <PhoneIcon turn="side" />
              </div>
              <span aria-hidden className="relative hidden h-14 w-14 place-items-center landscape:grid">
                <span className="absolute inset-0 animate-ping rounded-full border border-amber/60 [animation-duration:1.8s]" />
                <span className="h-3 w-3 rounded-full bg-amber shadow-[0_0_30px_10px_rgb(255_180_90/0.5)]" />
              </span>
              <p className="hud flex items-center gap-2 text-dust">
                <span className="rec-blink h-1.5 w-1.5 rounded-full bg-rec" /> Ranvir Kawatra · Portfolio
              </p>
              <p className="voice text-[clamp(1.9rem,8.5vw,2.6rem)] leading-[1.05] text-tungsten landscape:text-[2.4rem]">
                <span className="landscape:hidden">Tilt your phone sideways</span>
                <span className="hidden landscape:inline">Tap anywhere to start</span>
              </p>
              <p className="max-w-[30ch] text-[0.95rem] leading-relaxed text-dust">
                <span className="landscape:hidden">Either way — then tap anywhere to start. Sound up!</span>
                <span className="hidden landscape:inline">Turn the sound up — it&rsquo;s a loud one.</span>
              </p>
              <SoundChip />
              <p className="hud text-dust/70 landscape:hidden">Or just tap now to watch it upright</p>
            </div>
          </div>

          {/* replay: portrait or landscape? */}
          <div
            role="dialog"
            aria-label="How do you want to watch the intro?"
            className="in-choose invisible absolute inset-0 z-40 flex items-center justify-center bg-void p-6 text-center opacity-0"
          >
            <div className="flex w-full max-w-sm flex-col items-center gap-6">
              <p className="hud flex items-center gap-2 text-dust">
                <span className="rec-blink h-1.5 w-1.5 rounded-full bg-rec" /> Play the intro
              </p>
              <p className="voice text-[clamp(1.9rem,8.5vw,2.6rem)] leading-[1.05] text-tungsten">How do you want to watch it?</p>
              <div className="grid w-full grid-cols-2 gap-3">
                {(
                  [
                    ["portrait", "Portrait", "Hold it upright"],
                    ["landscape", "Landscape", "Turn it sideways"],
                  ] as const
                ).map(([m, label, hint]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => act.current.choose?.(m)}
                    className="glass flex flex-col items-center gap-4 rounded-2xl px-3 py-6 text-tungsten transition-colors hover:text-amber active:bg-tungsten/10"
                  >
                    <span className="grid h-20 place-items-center">
                      <PhoneIcon turn={m === "portrait" ? "still" : "flat"} />
                    </span>
                    <span className="credit text-[1.15rem] [--w:100]">{label}</span>
                    <span className="hud -mt-2 text-dust">{hint}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => act.current.skip?.()}
        className="in-skip hud absolute bottom-4 right-4 z-50 overflow-hidden rounded-full border border-tungsten/25 bg-void/40 px-4 py-2.5 text-tungsten/85 backdrop-blur-md transition-colors hover:border-tungsten hover:text-tungsten md:bottom-6 md:right-6"
      >
        Skip intro ↵
        <span aria-hidden className="in-progress absolute inset-x-0 bottom-0 h-[2px] origin-left bg-amber" style={{ transform: "scaleX(0)" }} />
      </button>
    </div>
  );
}
