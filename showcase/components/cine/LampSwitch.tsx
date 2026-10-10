"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { afterIntro } from "@/lib/intro";
import { lampPull, lightSwitch } from "@/lib/sound";
import { getTheme, subscribeTheme, switchTheme, syncThemeColor } from "@/lib/theme";

const isLight = () => getTheme() === "light";

/**
 * The house lights. A small lamp hangs by its cord from the top edge of the
 * screen. Pull it (click / tap) and it drops with a clack, the new light floods
 * out of the bulb across the screen, and the lamp springs back and swings.
 * With a mouse it sways when nudged; on touch screens it
 * swings once after the intro and shows its label, so it reads as pullable.
 */
export function LampSwitch() {
  const light = useSyncExternalStore(subscribeTheme, isLight, () => false);
  const swing = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  useGSAP(() => {
    syncThemeColor();
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const el = swing.current!;
      const touch = window.matchMedia("(hover: none)").matches;
      // once the film is over: one swing, so it reads as something hanging there to pull
      const timers: gsap.core.Tween[] = [];
      const stop = afterIntro(() => {
        gsap.fromTo(el, { rotate: 16 }, { rotate: 0, duration: 2.8, ease: "elastic.out(1, 0.2)", delay: 1.1 });
        if (touch) {
          timers.push(gsap.delayedCall(1.4, () => tip.current?.classList.add("is-on")));
          timers.push(gsap.delayedCall(4.6, () => tip.current?.classList.remove("is-on")));
        }
      });
      // mouse: nudging it sets it swinging the way the pointer came from
      const nudge = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || busy.current) return;
        const r = el.getBoundingClientRect();
        const dir = e.clientX < r.left + r.width / 2 ? 1 : -1;
        gsap
          .timeline({ overwrite: true })
          .to(el, { rotate: dir * 9, duration: 0.22, ease: "power2.out" })
          .to(el, { rotate: 0, duration: 2, ease: "elastic.out(1, 0.22)" });
      };
      el.addEventListener("pointerenter", nudge);
      return () => {
        stop();
        timers.forEach((t) => t.kill());
        el.removeEventListener("pointerenter", nudge);
      };
    });
  });

  // (a click handler: the chrome is never unmounted, so these tweens need no context)
  const pull = () => {
    if (busy.current) return;
    busy.current = true;
    const el = swing.current!;
    const r = btn.current!.getBoundingClientRect();
    const up = !isLight();
    const go = (drop: number) => {
      lightSwitch(up);
      // the light pours out of the bulb (just below the lamp's centre)
      switchTheme(r.left + r.width / 2, r.top + r.height / 2 + 3 + drop).then(() => (busy.current = false));
    };
    lampPull();
    if (!window.matchMedia(MOTION_OK).matches) return go(0);
    // the cord is pulled down; the light changes as it bottoms out, and the lamp springs back and swings
    gsap
      .timeline({ overwrite: true })
      .to(el, { y: 12, rotate: 0, duration: 0.16, ease: "power2.in" })
      .call(go, [12])
      .to(el, { y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" })
      .to(el, { rotate: up ? -9 : 9, duration: 0.25, ease: "power2.out" }, 0.2)
      .to(el, { rotate: 0, duration: 2.2, ease: "elastic.out(1, 0.22)" }, 0.45);
  };

  return (
    <div className="chrome-part pointer-events-auto relative h-11 w-11 shrink-0">
      {/* swings from the top edge of the screen (the bar is 4rem tall on phones, 5rem from md) */}
      <div ref={swing} className="absolute inset-0 origin-[50%_-10px] will-change-transform md:origin-[50%_-18px]">
        {/* the cord, running up off the top of the screen */}
        <span aria-hidden className="absolute bottom-full left-1/2 h-28 w-px -translate-x-1/2 bg-tungsten/45" />
        {/* the light it throws once the lights are up */}
        <span
          aria-hidden
          className="lamp-beam pointer-events-none absolute left-1/2 top-[60%] h-20 w-28 -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_200_90/0.34),rgb(255_200_90/0.08)_45%,transparent_72%)] md:h-28 md:w-36 [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]"
        />
        <button
          ref={btn}
          type="button"
          onClick={pull}
          aria-label="Light mode"
          aria-pressed={light}
          className="lamp glass glass-blur relative grid h-11 w-11 place-items-center rounded-full text-tungsten"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="h-[1.4rem] w-[1.4rem] overflow-visible">
            <path d="M12 2.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M5 12.6a7 7 0 0 1 14 0z" fill="currentColor" />
            <circle className="lamp-bulb" cx="12" cy="15.3" r="2.3" strokeWidth="1.4" />
            <g className="lamp-rays" stroke="#d6941a" strokeWidth="1.5" strokeLinecap="round">
              <path d="M12 19.4v2.4M8 18.4l-1.4 1.9M16 18.4l1.4 1.9" />
            </g>
          </svg>
          <span ref={tip} aria-hidden className="lamp-tip glass hud pointer-events-none absolute left-1/2 top-[calc(100%+0.7rem)] whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6rem]">
            {light ? "Lights down" : "Lights up"}
          </span>
        </button>
      </div>
    </div>
  );
}
