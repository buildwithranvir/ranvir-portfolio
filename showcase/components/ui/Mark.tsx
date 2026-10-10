import type { CSSProperties, ReactNode } from "react";

// hand-drawn strokes, each a single pencil line, drawn in a 100-wide box (heights vary)
export const marks = {
  under: { box: [100, 10], d: "M1 6.5 C 18 3.6, 40 8.2, 60 5.2 S 88 3.6, 99 5.8" },
  // two passes, the second a little looser — the way you underline something twice
  double: { box: [100, 14], d: "M1 5 C 22 2.6, 48 7, 70 4.4 S 92 3.4, 99 4.6 M6 11 C 30 8.6, 58 12.4, 96 9.6" },
  circle: { box: [100, 40], d: "M54 3.5 C 24 2, 3 9, 4 21 C 5 33, 34 38.5, 60 37 C 84 35.6, 98 28, 96 17 C 94 7, 72 1.6, 38 5" },
  box: { box: [100, 20], d: "M2 11 C 28 9.5, 62 12, 98 10" },
} as const;

export type MarkTone = "coral" | "blue" | "teal" | "pink" | "violet" | "sun";

/**
 * A word marked up by hand, like a pencil on a print: underlined, underlined
 * twice, ringed, or washed with a highlighter. The word never hides; only the
 * stroke draws in. `Marks` (components/motion) re-draws each stroke at the
 * word's real pixel size, so it is never stretched and traces exactly; until
 * then (or without scripts) the stretched stroke shows as a fallback. Each tone
 * is a theme variable, so the marks re-ink themselves in daylight.
 */
export function Mark({ kind = "under", tone = "coral", children }: { kind?: keyof typeof marks; tone?: MarkTone; children: ReactNode }) {
  const m = marks[kind];
  return (
    <span className={`mk mk-${kind}`} data-mk={kind} style={{ "--mk": `var(--mk-${tone})` } as CSSProperties}>
      {children}
      <svg aria-hidden viewBox={`0 0 ${m.box[0]} ${m.box[1]}`} preserveAspectRatio="none">
        <path d={m.d} pathLength={1} vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}
