"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

/*
 * VANTA's motion vocabulary. Each kind of thing moves its own way:
 * - Lines:   reading text rises out of a mask, line by line
 * - Stretch: display type squeezes in narrow, then stretches to full width
 * Images each get their own entrance inside the section that owns them.
 */

/** Text that rises line by line from behind a mask. */
export function Lines({
  as: Tag = "p",
  id,
  className,
  children,
  delay = 0,
}: {
  as?: ElementType;
  id?: string;
  className?: string;
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        SplitText.create(ref.current, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.08,
              delay,
              scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
            }),
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Display heading whose letters arrive squeezed to the narrowest width and
 * stretch out to their set width (--w) as they land. Children can mix plain
 * text with <em> accents; only the text nodes are split into letters.
 */
export function Stretch({
  as: Tag = "h2",
  id,
  className = "",
  children,
  width = 100,
}: {
  as?: ElementType;
  id?: string;
  className?: string;
  children: ReactNode;
  width?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current, { type: "words,chars", charsClass: "inline-block", ignore: ".serif-i" });
        gsap.fromTo(
          split.chars,
          { "--w": 50, yPercent: 60, opacity: 0 },
          {
            "--w": width,
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            stagger: { each: 0.025, from: "start" },
            scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
          },
        );
        const accents = ref.current!.querySelectorAll(".serif-i");
        if (accents.length)
          gsap.from(accents, {
            opacity: 0,
            rotate: -6,
            yPercent: 30,
            duration: 1.3,
            ease: "expo.out",
            delay: 0.3,
            scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
          });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={`display ${className}`} style={{ ["--w" as string]: width }}>
      {children}
    </Tag>
  );
}
