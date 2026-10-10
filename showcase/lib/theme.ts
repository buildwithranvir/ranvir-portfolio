"use client";

import { gsap } from "./gsap";

/**
 * The site's two lightings. Dark is the default (the projection room); light is
 * "house lights up". The choice is remembered, and set before the first paint
 * by the boot script in app/layout.tsx.
 */
export type Theme = "dark" | "light";

export const THEME_KEY = "rk-theme";
const BG: Record<Theme, string> = { dark: "#0b0a09", light: "#f6f1e9" };
const listeners = new Set<() => void>();

export const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");
export const subscribeTheme = (cb: () => void) => {
  listeners.add(cb);
  return () => void listeners.delete(cb);
};

/** Keeps the browser's own chrome (the phone's status bar) in the same lighting. */
export function syncThemeColor(t: Theme = getTheme()) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", BG[t]));
}

function apply(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {}
  syncThemeColor(t);
  listeners.forEach((l) => l());
}

// the flood: a small soft-edged disc, rasterised once and then only scaled and faded
const DISC = 240;
const SOLID = 0.56; // the share of the radius that is fully opaque
const FLOOD: Record<Theme, string> = {
  light: `radial-gradient(circle, #fff3d4 0%, ${BG.light} 32%, ${BG.light} ${SOLID * 100}%, rgb(246 241 233 / 0) 71%)`,
  dark: `radial-gradient(circle, #1a1410 0%, ${BG.dark} 28%, ${BG.dark} ${SOLID * 100}%, rgb(11 10 9 / 0) 71%)`,
};
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

/**
 * Switches the lighting from the lamp at (x, y): the new light floods out of the
 * bulb until it fills the screen, the page changes underneath it, and then the
 * flood dissolves to show the page in its new lighting - like film exposing.
 * Only a transform and an opacity move, so it stays smooth on phones. The flood
 * sits just under the top bar, so the lamp stays in view as the source.
 */
export function switchTheme(x: number, y: number): Promise<void> {
  const next: Theme = getTheme() === "light" ? "dark" : "light";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply(next);
    return Promise.resolve();
  }
  const disc = document.createElement("div");
  disc.setAttribute("aria-hidden", "true");
  Object.assign(disc.style, {
    position: "fixed",
    left: `${x - DISC / 2}px`,
    top: `${y - DISC / 2}px`,
    width: `${DISC}px`,
    height: `${DISC}px`,
    borderRadius: "50%",
    background: FLOOD[next],
    pointerEvents: "none",
    zIndex: "80", // above the page and the HUD, below the top bar (81)
    willChange: "transform, opacity",
  });
  document.body.appendChild(disc);
  const far = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 24;
  const scale = far / ((DISC / 2) * SOLID);
  const phone = window.innerWidth < 768;

  return new Promise<void>((done) => {
    const html = document.documentElement;
    const tl = gsap.timeline({
      onComplete: () => {
        disc.remove();
        // colour transitions come back once nothing is moving (it costs one style pass)
        html.classList.remove("theme-swap");
        done();
      },
    });
    tl.fromTo(disc, { scale: 0.05 }, { scale, duration: phone ? 0.6 : 0.7, ease: "power3.in" })
      .call(() => {
        // the screen is covered: change the lighting, and hold for a beat of full light while the
        // page repaints underneath (phones need a little longer), then dissolve
        // (colour transitions are held off for the swap - hundreds of buttons fading their colours at once would stutter)
        tl.pause();
        html.classList.add("theme-swap");
        apply(next);
        nextFrame().then(() => gsap.delayedCall(phone ? 0.1 : 0.04, () => tl.resume()));
      })
      .to(disc, { opacity: 0, duration: phone ? 0.55 : 0.65, ease: "power2.out" });
  });
}
