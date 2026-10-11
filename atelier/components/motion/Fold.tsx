"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type ElementType, type ReactNode } from "react";
import { enter, gsap, INTRO_DELAY, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

/*
 * ATELIER's motion vocabulary: everything arrives the way a card model is
 * put together - flat pieces fold up along a crease and lock in place.
 * Each animation plays through to the end once it starts; none of them is
 * tied to the scroll position, so nothing is ever left half-folded.
 */

/** Text whose letters (or words) fold up from flat, hinged on their baseline. */
export function FoldText({
  as: Tag = "p",
  by = "words",
  id,
  className,
  children,
  onLoad = false,
  delay = 0,
}: {
  as?: ElementType;
  by?: "chars" | "words";
  id?: string;
  className?: string;
  children: ReactNode;
  /** Play after the intro instead of on scroll (for the hero). */
  onLoad?: boolean;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Marked words stay whole (so their pencil stroke spans the word) and fold up as one piece, in reading order
        const split = SplitText.create(ref.current, { type: by === "chars" ? "words,chars" : "words", ignore: ".mk" });
        const marked = Array.from(ref.current!.querySelectorAll<HTMLElement>(".mk"));
        const targets = [...(by === "chars" ? split.chars : split.words), ...marked].sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        );
        gsap.from(targets, {
          rotateX: -80,
          yPercent: 40,
          opacity: 0,
          transformOrigin: "50% 100%",
          transformPerspective: 1600,
          duration: by === "chars" ? 1 : 0.9,
          ease: "expo.out",
          stagger: by === "chars" ? 0.022 : 0.03,
          delay: onLoad ? INTRO_DELAY + delay : delay,
          scrollTrigger: onLoad ? undefined : enter(ref.current),
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

const marks = {
  under: { box: "0 0 100 10", d: "M1 6.5 C 18 3.6, 40 8.2, 60 5.2 S 88 3.6, 99 5.8", w: 2.6 },
  circle: { box: "0 0 100 40", d: "M54 3.5 C 24 2, 3 9, 4 21 C 5 33, 34 38.5, 60 37 C 84 35.6, 98 28, 96 17 C 94 7, 72 1.6, 38 5", w: 2.2 },
  box: { box: "0 0 100 20", d: "M2 11 C 28 9.5, 62 12, 98 10", w: 0 },
} as const;

/**
 * A key word, marked the way an architect marks up a print: underlined,
 * ringed, or washed with a highlighter. The word itself never hides - only
 * the pencil stroke draws in when it scrolls into view.
 */
export function Mark({ kind = "under", tone = "text-terracotta", children }: { kind?: keyof typeof marks; tone?: string; children: ReactNode }) {
  const m = marks[kind];
  return (
    <span className={`mk mk-${kind}`}>
      {children}
      <svg aria-hidden viewBox={m.box} preserveAspectRatio="none" className={tone}>
        <path d={m.d} strokeWidth={m.w || undefined} vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}

/**
 * A photograph printed on a card that is folded in half. It arrives folded,
 * then the second half swings open on its crease. On hover the crease gives
 * a little, as if the card were being opened again.
 */
export function FoldImage({
  src,
  alt,
  sizes,
  axis = "y",
  className = "",
  imgClassName = "",
  priority = false,
}: {
  src: StaticImageData;
  alt: string;
  sizes: string;
  /** y: a horizontal crease (the lower half folds down); x: a vertical crease. */
  axis?: "x" | "y";
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const firstHalf = axis === "y" ? "inset(0% 0% 50% 0%)" : "inset(0% 50% 0% 0%)";
  const secondHalf = axis === "y" ? "inset(50% 0% 0% 0%)" : "inset(0% 0% 0% 50%)";
  const rot = axis === "y" ? "rotateX" : "rotateY";

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const leaf = ref.current!.querySelector(".fold-leaf");
        gsap
          .timeline({ scrollTrigger: enter(ref.current, "85%"), defaults: { ease: "expo.inOut" } })
          .from(ref.current, { y: 40, duration: 1, ease: "expo.out" }, 0)
          .fromTo(leaf, { [rot]: axis === "y" ? 180 : -180 }, { [rot]: 0, duration: 1.5, clearProps: "transform", onComplete: () => leaf?.classList.add("is-ready") }, 0.1)
          .fromTo(ref.current!.querySelector(".fold-shade"), { opacity: 0.6 }, { opacity: 0, duration: 1.5 }, 0.1);
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        ref.current!.querySelector(".fold-leaf")?.classList.add("is-ready");
      });
    },
    { scope: ref },
  );

  const hover = axis === "y" ? "group-hover:[transform:rotateX(14deg)]" : "group-hover:[transform:rotateY(-14deg)]";

  return (
    <div ref={ref} className={`fold-stage relative ${className}`}>
      <div className="absolute inset-0" style={{ clipPath: firstHalf }}>
        <Image src={src} alt={alt} fill placeholder="blur" priority={priority} sizes={sizes} className={`grade object-cover ${imgClassName}`} />
      </div>
      <div
        className={`fold-leaf no-back absolute inset-0 ${hover}`}
        style={{ clipPath: secondHalf, transformOrigin: "50% 50%" }}
      >
        <Image src={src} alt="" aria-hidden fill placeholder="blur" priority={priority} sizes={sizes} className={`grade object-cover ${imgClassName}`} />
        <div
          className="fold-shade absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-25"
          style={{ background: axis === "y" ? "linear-gradient(to bottom, #17182b, transparent 70%)" : "linear-gradient(to right, #17182b, transparent 70%)" }}
        />
      </div>
      {/* the crease */}
      <span aria-hidden className={`pointer-events-none absolute bg-white/25 ${axis === "y" ? "inset-x-0 top-1/2 h-px" : "inset-y-0 left-1/2 w-px"}`} />
    </div>
  );
}

/**
 * A folded seam between two grounds: a row of paper facets that fold up
 * into the next section's colour.
 */
export function Seam({ className = "fill-plaster", count = 28 }: { className?: string; count?: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current!.querySelectorAll("polygon"), {
          scaleY: 0,
          transformOrigin: "50% 100%",
          duration: 0.9,
          ease: "expo.out",
          stagger: { each: 0.025, from: "center" },
          scrollTrigger: enter(ref.current, "95%"),
        });
      });
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} aria-hidden viewBox={`0 0 ${count * 2} 10`} preserveAspectRatio="none" className={`pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-3 w-full md:h-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <polygon key={i} points={`${i * 2},10 ${i * 2 + 1},0 ${i * 2 + 2},10`} style={{ transformBox: "fill-box" }} />
      ))}
    </svg>
  );
}
