"use client";

import { unlock } from "./sound";

/** The opening titles and the hero coordinate through these two signals. */
export const INTRO_DONE = "rk:intro-done";
/** Fired by the "Play intro" button: the film plays again. */
export const PLAY_INTRO = "rk:play-intro";
export const playIntro = () => {
  unlock(); // the click that replays the film also lets its sound play
  window.dispatchEvent(new Event(PLAY_INTRO));
};

/** True when the opening titles are about to play on this page load. */
export function introWillPlay() {
  if (typeof window === "undefined") return false;
  const html = document.documentElement;
  return html.classList.contains("js") && !html.classList.contains("intro-seen") && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let done = false;
let landed = false;
/** `flew`: the title words flew into the hero (desktop). On phones the film ends on its own and the hero sets its title itself. */
export function markIntroDone(flew = true) {
  done = true;
  landed = flew;
  // next tick: GSAP runs tween callbacks inside the scope of the animation that
  // fired them, and the listeners must resolve their selectors page-wide
  setTimeout(() => window.dispatchEvent(new Event(INTRO_DONE)), 0);
}
/** Runs `fn` once the titles have finished (or straight away if they're not playing). `landed`: the title is already in place. */
export function afterIntro(fn: (landed: boolean) => void) {
  if (done || !introWillPlay()) {
    fn(done && landed);
    return () => {};
  }
  const h = () => fn(landed);
  window.addEventListener(INTRO_DONE, h, { once: true });
  return () => window.removeEventListener(INTRO_DONE, h);
}
