"use client";

import { useEffect, useRef } from "react";

/**
 * A field of dots that lean away from the pointer and light up near it -
 * the studio's "instrument". Plain 2D canvas, paused when off-screen, and
 * drawn once (static) for reduced-motion visitors.
 */
export function DotField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, gap = 22, raf = 0, visible = true, t = 0, lastMove = 0, tapUntil = 0;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    // Touch screens have no hover, so a "probe" light wanders the field on its own;
    // it also takes over on desktop once the pointer has been still or away for a moment.
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      gap = w < 640 ? 18 : 22;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      const R = Math.min(220, w * 0.25);
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const d = Math.hypot(dx, dy);
          const f = Math.max(0, 1 - d / R);
          // A slow travelling wave keeps the field alive without the pointer.
          const wave = reduce ? 0 : Math.sin(x * 0.012 + y * 0.008 + t) * 0.5 + 0.5;
          const px = x + (d ? (dx / d) * f * 14 : 0);
          const py = y + (d ? (dy / d) * f * 14 : 0);
          const size = 0.8 + f * 2.2 + wave * 0.5;
          if (f > 0.02) {
            ctx.fillStyle = `rgba(255, ${Math.round(90 + 120 * (1 - f))}, ${Math.round(31 + 200 * (1 - f))}, ${0.35 + f * 0.65})`;
          } else {
            ctx.fillStyle = `rgba(233, 237, 241, ${0.08 + wave * 0.1})`;
          }
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = () => {
      t += 0.012;
      const now = performance.now();
      if (now > tapUntil && (coarse || now - lastMove > 2600)) {
        mouse.tx = w * (0.5 + 0.36 * Math.sin(t * 0.55));
        mouse.ty = h * (0.42 + 0.26 * Math.sin(t * 0.83 + 1.2));
      }
      if (visible) draw();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      lastMove = performance.now();
    };
    // A tap pulls the light to that spot for a moment
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      tapUntil = performance.now() + 1600;
    };
    const onLeave = () => {
      lastMove = 0;
    };

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`block h-full w-full ${className}`} />;
}
