"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { templates } from "@/lib/templates";

/**
 * The colour flood behind the template rooms. One disc of paint per template
 * sits fixed in the middle of the screen; as a room scrolls in, its disc grows
 * until the whole screen is that colour (a transform, scrubbed with the scroll,
 * so it runs backwards too). The sections around the rooms are opaque, so the
 * paint only shows inside the rooms.
 */
export function Flood() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      // how far a disc of 40vmax must grow to cover the screen corner to corner
      const cover = () => {
        const vmax = Math.max(window.innerWidth, window.innerHeight);
        return (Math.hypot(window.innerWidth, window.innerHeight) / (0.4 * vmax)) * 1.06;
      };
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.utils.toArray<HTMLElement>(".fl-disc").forEach((disc) => {
        const room = document.getElementById(disc.dataset.room!);
        if (!room) return;
        if (reduce) {
          // reduced motion: the colour simply switches when the room arrives
          gsap.set(disc, { scale: cover, autoAlpha: 0 });
          gsap.to(disc, {
            autoAlpha: 1,
            duration: 0.2,
            scrollTrigger: { trigger: room, start: "top 60%", toggleActions: "play none none reverse" },
          });
          return;
        }
        gsap.fromTo(
          disc,
          { scale: 0.001 },
          {
            scale: cover,
            ease: "power2.in",
            scrollTrigger: { trigger: room, start: "top bottom", end: "top 25%", scrub: 0.4, invalidateOnRefresh: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {templates.map((t) => (
        <span
          key={t.id}
          data-room={t.id}
          className="fl-disc absolute left-1/2 top-1/2 h-[40vmax] w-[40vmax] rounded-full will-change-transform"
          style={{ background: t.colors.bg, transform: "scale(0.001)", marginLeft: "-20vmax", marginTop: "-20vmax" }}
        />
      ))}
    </div>
  );
}
