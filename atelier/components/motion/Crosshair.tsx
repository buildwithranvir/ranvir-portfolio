"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * A drafting-table crosshair: two hairlines that follow the pointer with a
 * live coordinate readout. Mouse/trackpad only; transforms only, set directly
 * (no tweens), so it costs almost nothing per frame.
 */
export function Crosshair() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const root = ref.current!;
        const v = root.querySelector<HTMLElement>(".ch-v")!;
        const h = root.querySelector<HTMLElement>(".ch-h")!;
        const tag = root.querySelector<HTMLElement>(".ch-tag")!;
        const setVx = gsap.quickSetter(v, "x", "px");
        const setHy = gsap.quickSetter(h, "y", "px");
        const setTx = gsap.quickSetter(tag, "x", "px");
        const setTy = gsap.quickSetter(tag, "y", "px");
        let raf = 0;
        let px = 0;
        let py = 0;
        const draw = () => {
          raf = 0;
          setVx(px);
          setHy(py);
          setTx(px + 12);
          setTy(py + 12);
          tag.textContent = `X ${String(Math.round(px)).padStart(4, "0")} · Y ${String(Math.round(py + window.scrollY)).padStart(5, "0")}`;
        };
        const move = (e: PointerEvent) => {
          px = e.clientX;
          py = e.clientY;
          root.style.opacity = "1";
          if (!raf) raf = requestAnimationFrame(draw);
        };
        const leave = () => (root.style.opacity = "0");
        window.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", leave);
        return () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("pointermove", move);
          document.documentElement.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className="crosshair pointer-events-none fixed inset-0 z-[90] opacity-0 transition-opacity duration-300">
      <span className="ch-v absolute left-0 top-0 h-full w-px bg-white/35" />
      <span className="ch-h absolute left-0 top-0 h-px w-full bg-white/35" />
      <span className="ch-tag label absolute left-0 top-0 whitespace-nowrap text-[0.625rem] text-white/80">X 0000 · Y 00000</span>
    </div>
  );
}
