"use client";

// The loading screen tells the rest of the page when the deck has opened.
// Sections wait for it so their entrances play in view, not behind the loader.

const EVENT = "rk:loaded";

export const isLoaded = () => typeof document !== "undefined" && document.documentElement.classList.contains("loaded");

export function markLoaded() {
  if (isLoaded()) return;
  document.documentElement.classList.add("loaded");
  window.dispatchEvent(new Event(EVENT));
}

/** Runs `fn` once the loader is done (right away if it already is). Returns a cleanup. */
export function afterLoad(fn: () => void) {
  if (isLoaded()) {
    fn();
    return () => {};
  }
  const run = () => fn();
  window.addEventListener(EVENT, run, { once: true });
  return () => window.removeEventListener(EVENT, run);
}
