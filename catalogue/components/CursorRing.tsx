"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A colour-picker ring that follows the mouse and takes the paint of the
 * room you are in. It grows over anything you can click. Mouse only: touch
 * screens never see it.
 */
export function CursorRing() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;
    const el = ref.current!;
    el.style.display = "block";
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const s = gsap.quickTo(el, "scale", { duration: 0.4, ease: "power3" });
    let shown = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { opacity: 1, duration: 0.3 });
      }
      x(e.clientX);
      y(e.clientY);
      s((e.target as Element).closest?.("a, button") ? 1.9 : 1);
    };
    const leave = () => {
      shown = false;
      gsap.to(el, { opacity: 0, duration: 0.3 });
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-7 w-7 rounded-full border-2 opacity-0 transition-[border-color] duration-500"
      style={{ borderColor: "var(--room)", marginLeft: -14, marginTop: -14, transform: "none" }}
    />
  );
}
