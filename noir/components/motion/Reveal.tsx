"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

/*
 * NOIR's motion language is slow and organic: things settle into place
 * the way steam drifts, never snap. Long durations, soft sine easing,
 * small distances. Only transforms and opacity are animated, so scrolling
 * stays smooth.
 */

/** Text that drifts up line by line. */
export function Drift({
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
          linesClass: "split-line",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              opacity: 0,
              duration: 1.3,
              ease: "power3.out",
              stagger: 0.1,
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

/** Children that rise in one after another when the group scrolls into view. */
export function Stagger({ as: Tag = "div", className, children, y = 28 }: { as?: ElementType; className?: string; children: ReactNode; y?: number }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current!.children, {
          y,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * A framed photograph with soft corners. It rises into place, the picture
 * inside pans gently with the scroll, and it zooms a touch on hover.
 */
export function Photo({
  src,
  alt,
  sizes,
  className = "",
  imgClassName = "",
  priority,
  reveal = true,
  children,
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Set false when a parent timeline animates the entrance instead. */
  reveal?: boolean;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (reveal) gsap.from(ref.current, {
          y: 40,
          opacity: 0,
          scale: 0.97,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        });
        gsap.fromTo(
          ".photo-pan",
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`photo ${className}`}>
      <div className="photo-pan absolute -inset-y-[5%] inset-x-0">
        <Image src={src} alt={alt} fill priority={priority} placeholder="blur" sizes={sizes} className={`object-cover ${imgClassName}`} />
      </div>
      {children}
    </div>
  );
}
