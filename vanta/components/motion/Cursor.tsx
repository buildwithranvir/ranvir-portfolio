"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * An acid dot that trails the pointer. It grows into a labelled disc wherever
 * an element sets data-cursor ("View", "Drag", "Open"), and shrinks to a ring
 * over plain links. Precise pointers only; never under reduced motion.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const el = dot.current!;
    gsap.set(el, { scale: 0.22 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
      x(e.clientX);
      y(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      const link = t.closest("a, button, [role=radio], input, select");
      setLabel(tagged?.dataset.cursor ?? "");
      gsap.to(el, { scale: tagged ? 1 : link ? 0.45 : 0.22, duration: 0.45, ease: "expo.out" });
    };
    const hide = () => gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    const show = () => shown && gsap.to(el, { autoAlpha: 1, duration: 0.2 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", hide);
    document.documentElement.addEventListener("pointerenter", show);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.documentElement.removeEventListener("pointerenter", show);
    };
  }, []);

  return (
    <div aria-hidden className="cursor-ui">
      <div
        ref={dot}
        className="pointer-events-none invisible fixed left-0 top-0 z-[250] -ml-12 -mt-12 flex h-24 w-24 items-center justify-center rounded-full bg-acid text-ink"
      >
        <span className="mono text-[0.75rem] font-semibold">{label}</span>
      </div>
    </div>
  );
}
