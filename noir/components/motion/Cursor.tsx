"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A soft frosted cursor ring with a small dot. It swells over links and buttons
 * and shows a word wherever an element sets data-cursor (e.g. "Drag").
 * Only for precise pointers, and never under reduced motion.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3.out" });
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power2.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power2.out" });

    let shown = false;
    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([ring.current, dot.current], { x: e.clientX, y: e.clientY });
        gsap.to([ring.current, dot.current], { opacity: 1, duration: 0.4 });
      }
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const tagged = t.closest<HTMLElement>("[data-cursor]");
      const interactive = t.closest("a, button, [role=tab], input, select, label");
      setLabel(tagged?.dataset.cursor ?? "");
      gsap.to(ring.current, { scale: tagged ? 2.2 : interactive ? 1.6 : 1, duration: 0.4, ease: "power3.out" });
      gsap.to(dot.current, { scale: tagged || interactive ? 0 : 1, duration: 0.3 });
    };
    const leave = () => gsap.to([ring.current, dot.current], { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to([ring.current, dot.current], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.documentElement.addEventListener("pointerleave", leave);
    document.documentElement.addEventListener("pointerenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.removeEventListener("pointerenter", enter);
    };
  }, []);

  return (
    <div aria-hidden className="cursor-ui">
      <div
        ref={ring}
        className="glass pointer-events-none fixed left-0 top-0 z-[250] -ml-5 opacity-0 -mt-5 flex h-10 w-10 items-center justify-center rounded-full !shadow-none"
      >
        <span className="text-[0.4rem] font-semibold uppercase tracking-[0.14em] text-ink">{label}</span>
      </div>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[251] -ml-[3px] opacity-0 -mt-[3px] h-1.5 w-1.5 rounded-full bg-burgundy" />
    </div>
  );
}
