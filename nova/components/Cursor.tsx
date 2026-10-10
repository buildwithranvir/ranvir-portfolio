"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Custom cursor for precise pointers only (never on touch). A dot that
 * swells into a labelled ring over anything marked with data-cursor.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!fine.matches) return;
    document.documentElement.classList.add("has-cursor");
    let shown = false;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!shown) {
        shown = true;
        setEnabled(true);
      }
      const el = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor], input, textarea, select, label");
      setHovering(!!el);
      setLabel(el?.dataset.cursor ?? null);
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center rounded-full mix-blend-difference"
      style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      animate={{
        width: label ? 96 : hovering ? 44 : 12,
        height: label ? 96 : hovering ? 44 : 12,
        backgroundColor: label ? "rgba(233,237,241,1)" : hovering ? "rgba(233,237,241,0)" : "rgba(233,237,241,1)",
        borderWidth: hovering && !label ? 1 : 0,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {label && <span className="mono text-[0.625rem] text-void">{label}</span>}
      <span className="absolute inset-0 rounded-full border border-haze" style={{ opacity: hovering && !label ? 1 : 0 }} />
    </motion.div>
  );
}
