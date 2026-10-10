"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence } from "motion/react";
import { scenes, studio } from "@/lib/site";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { afterIntro, playIntro } from "@/lib/intro";
import { getLenis, scrollToHash } from "@/lib/scroll";
import { isSoundOn, setSound, shutter, subscribeSound, uiClick, uiHover } from "@/lib/sound";
import { IndexMenu } from "./IndexMenu";
import { LampSwitch } from "./LampSwitch";
import { NavMenu } from "./NavMenu";

const no = (i: number) => String(i + 1).padStart(2, "0");

/**
 * The page's frame: a glass top bar (the name menu, start a project), a glass HUD
 * at the bottom (current section, reading progress, sound, index) and the
 * index menu it opens.
 */
export function Chrome() {
  const ref = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [scene, setScene] = useState(0);
  const [menu, setMenu] = useState(false);
  const sound = useSyncExternalStore(subscribeSound, isSoundOn, () => false);

  useGSAP(
    () => {
      // which section is on screen - created once every section (and its pin spacing) exists
      const triggers: ScrollTrigger[] = [];
      const id = window.setTimeout(() => {
        scenes.forEach((s, i) => {
          const el = document.getElementById(s.id);
          if (!el) return;
          triggers.push(
            ScrollTrigger.create({
              trigger: el.closest(".pin-spacer") ?? el,
              start: "top 50%",
              end: "bottom 50%",
              refreshPriority: -1,
              onToggle: (self) => {
                if (!self.isActive) return;
                setScene(i);
                shutter();
              },
            }),
          );
        });
        ScrollTrigger.sort();
      }, 0);
      // reading progress (a transform, so it costs nothing)
      const setBar = gsap.quickSetter(bar.current, "scaleX");
      const progress = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => setBar(self.progress) });
      // the top bar drops in from above, the HUD rises from below
      gsap.set(".chrome-part", { opacity: 0, y: (_, el: Element) => (el.getBoundingClientRect().top < window.innerHeight / 2 ? -12 : 12) });
      const stop = afterIntro(() => gsap.to(".chrome-part", { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "expo.out" }));
      return () => {
        window.clearTimeout(id);
        triggers.forEach((t) => t.kill());
        progress.kill();
        stop();
      };
    },
    { scope: ref },
  );

  // small sounds for links and buttons (silent unless sound is on)
  useEffect(() => {
    let last: Element | null = null;
    const over = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as Element).closest?.("a, button");
      if (el && el !== last) uiHover();
      last = el ?? null;
    };
    const click = (e: MouseEvent) => (e.target as Element).closest?.("a, button") && uiClick();
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("pointerover", over);
      window.removeEventListener("click", click, true);
    };
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (menu) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    document.getElementById("scene-0")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const go = (id: string) => {
    setMenu(false);
    requestAnimationFrame(() => scrollToHash(`#${id}`));
  };

  const s = scenes[scene];
  return (
    <div ref={ref}>
      {/* Top bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[81]">
        <div className="frame flex h-16 items-center justify-between md:h-20">
          <NavMenu current={s.id} onGo={go} onIndex={() => setMenu(true)} />
          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3.5">
            <LampSwitch />
            <a
            href={studio.contactHref}
            target="_blank"
            rel="noreferrer"
            data-frame-hover
            className="chrome-part hud pointer-events-auto group relative z-10 flex h-11 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full bg-tungsten pl-3 pr-3.5 text-void sm:pl-3.5 sm:pr-4 shadow-[0_10px_30px_-12px_rgb(var(--shade)/calc(0.55*var(--shade-k)))] transition-colors duration-300 hover:bg-rec"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-rec opacity-60 group-hover:bg-void" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-rec group-hover:bg-void" />
            </span>
            {/* the narrowest phones share the bar with the name and the lamp */}
            <span className="min-[440px]:hidden">Chat</span>
            <span className="hidden min-[440px]:inline sm:hidden">Let&rsquo;s talk</span>
            <span className="hidden sm:inline">Start a project</span>
            </a>
          </div>
        </div>
      </div>

      {/* HUD */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80]">
        <div className="frame flex items-end justify-between gap-3 pb-3 md:pb-4">
          <div className="chrome-part glass glass-blur pointer-events-auto min-w-0 overflow-hidden rounded-full text-tungsten">
            <p className="hud flex h-10 min-w-0 items-center gap-2.5 px-4" data-hud-scene>
              <span className="shrink-0 text-amber">{no(scene)}</span>
              <span className="truncate">{s.title}</span>
            </p>
            <span aria-hidden className="block h-[2px] w-full bg-tungsten/10">
              <span ref={bar} className="block h-full origin-left bg-amber" style={{ transform: "scaleX(0)" }} />
            </span>
          </div>
          <div className="chrome-part glass glass-blur pointer-events-auto flex shrink-0 items-center gap-1 rounded-full p-1 text-tungsten">
            <button
              type="button"
              onClick={playIntro}
              aria-label="Play intro"
              className="hud flex h-9 items-center gap-2 rounded-full px-3 transition-colors hover:bg-tungsten/10 hover:text-amber"
            >
              <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-rec pl-[1px] text-[0.5rem] text-void">
                ▶
              </span>
              <span className="hidden sm:inline">Intro</span>
            </button>
            <button
              type="button"
              onClick={() => setSound(!sound)}
              aria-pressed={sound}
              aria-label={`Sound ${sound ? "on" : "off"}`}
              className="hud flex h-9 items-center gap-2 rounded-full px-3 transition-colors hover:bg-tungsten/10"
            >
              <span aria-hidden className="flex h-3 items-end gap-[2px]">
                {[0.5, 1, 0.7, 0.9].map((h, i) => (
                  <span
                    key={i}
                    className="w-[2px] bg-current transition-transform duration-500"
                    style={{
                      height: "100%",
                      transformOrigin: "bottom",
                      transform: `scaleY(${sound ? h : 0.2})`,
                      animation: sound ? `rec-blink ${0.6 + i * 0.17}s steps(2) infinite` : undefined,
                    }}
                  />
                ))}
              </span>
              <span className="hidden sm:inline">{sound ? "Sound on" : "Sound off"}</span>
            </button>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-expanded={menu}
              aria-controls="scenes"
              className="hud flex h-9 items-center gap-2 rounded-full bg-tungsten px-4 text-void transition-colors hover:bg-amber"
            >
              <span aria-hidden className="grid grid-cols-2 gap-[2px]">
                {[0, 1, 2, 3].map((k) => (
                  <span key={k} className="h-[4px] w-[4px] bg-current" />
                ))}
              </span>
              Index
            </button>
          </div>
        </div>
      </div>

      {/* Index menu */}
      <AnimatePresence>{menu && <IndexMenu current={scene} onGo={go} onClose={() => setMenu(false)} />}</AnimatePresence>
    </div>
  );
}
