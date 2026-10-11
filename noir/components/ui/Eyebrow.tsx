"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

/** Numbered section label - "01 - The day" - with a hairline that draws in. */
export function Eyebrow({ n, children, tone = "ink" }: { n: string; children: string; tone?: "ink" | "light" }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } });
        tl.fromTo(".eb-line", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power3.inOut" }).from(".eb-text", { opacity: 0, x: -8, duration: 0.8, ease: "power3.out" }, 0.35);
      });
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={`label flex items-center gap-3 ${tone === "light" ? "text-oat" : "text-ink-soft"}`}>
      <span className="eb-text tabular-nums">{n}</span>
      <span aria-hidden className={`eb-line block h-px w-10 origin-left ${tone === "light" ? "bg-oat/60" : "bg-ink/40"}`} />
      <span className="eb-text">{children}</span>
    </p>
  );
}
