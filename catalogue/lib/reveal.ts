"use client";

import { gsap, MOTION_OK, SplitText } from "@/lib/gsap";

/**
 * Scroll entrances for one section (call inside useGSAP with the section as scope):
 *  [data-split]  headings rise line by line out of a mask
 *  [data-fade]   blocks fade up, in order
 * Everything plays once, and only when motion is welcome.
 */
export function reveal(root: HTMLElement) {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.15,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: el, start: "clamp(top 88%)", once: true },
          }),
      });
    });
    root.querySelectorAll<HTMLElement>("[data-fade]").forEach((el) => {
      gsap.from(el, {
        y: 28,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        delay: Number(el.dataset.fade || 0),
        scrollTrigger: { trigger: el, start: "clamp(top 92%)", once: true },
      });
    });
  });
  return mm;
}

/** Buttons that lean towards the mouse (mouse only, never on touch). */
export function magnetic(root: HTMLElement) {
  const mm = gsap.matchMedia();
  mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
    const offs = Array.from(root.querySelectorAll<HTMLElement>("[data-magnetic]")).map((el) => {
      const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
      const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * 0.25);
        y((e.clientY - (r.top + r.height / 2)) * 0.35);
      };
      const leave = () => {
        x(0);
        y(0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    });
    return () => offs.forEach((o) => o());
  });
  return mm;
}
