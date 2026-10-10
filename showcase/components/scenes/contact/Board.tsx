"use client";

import { useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { studio } from "@/lib/site";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { flapTick } from "@/lib/sound";

type Line = { k: string; code: string; v: string; href: string; ext?: boolean; action: string; copy?: boolean };

const lines: Line[] = [
  { k: "Call", code: "TEL", v: studio.phone, href: studio.phoneHref, action: "Call now" },
  { k: "WhatsApp", code: "MSG", v: "Chat on WhatsApp", href: studio.whatsappHref, ext: true, action: "Open chat" },
  ...(studio.email ? [{ k: "Email", code: "MAIL", v: studio.email, href: `mailto:${studio.email}`, action: "Copy", copy: true }] : []),
];

// a line only ever breaks between words or just before the "@" - never mid-word
const groups = (v: string) =>
  v.split(" ").flatMap((w, i, all) => {
    const parts = w.split(/(?=@)/);
    if (i < all.length - 1) parts[parts.length - 1] += " ";
    return parts;
  });
// one size for the whole board (1 flap + its gap ≈ 1.12em):
// phones fit the longest unbreakable piece; wider screens fit the longest whole line
const EM = 1.12;
const longestPiece = Math.max(...lines.flatMap((l) => groups(l.v).map((g) => g.trim().length)));
const longestLine = Math.max(...lines.map((l) => l.v.length));
const boardSize = {
  "--bd-sm": `calc(82vw / ${(longestPiece * EM).toFixed(2)})`,
  "--bd-md": `calc((100vw - 21rem) / ${(longestLine * EM).toFixed(2)})`,
  "--bd-lg": `calc((min(100vw, 1560px) * 0.58 - 19rem) / ${(longestLine * EM).toFixed(2)})`,
} as CSSProperties;

const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const LOWER = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * The ways to reach Ranvir, set like a split-flap departure board: every
 * character clatters through the alphabet before it lands. The board flips in
 * when it scrolls into view, and each line re-flips when it's pointed at.
 */
export function Board() {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>(".bd-row");
        // every flap starts on a random character, then the board flips in, line by line
        rows.forEach((row) => row.querySelectorAll<HTMLElement>(".flap").forEach((f) => (f.textContent = glyph(f.dataset.c!))));
        gsap.from(".bd-head > *", {
          y: 14,
          opacity: 0,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ref.current, start: "clamp(top 88%)", once: true },
        });
        const triggers = rows.map((row, i) =>
          ScrollTrigger.create({
            trigger: row,
            start: "clamp(top 90%)",
            once: true,
            onEnter: () => {
              gsap.fromTo(row.querySelector(".bd-rule"), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "expo.inOut", delay: i * 0.12 });
              gsap.from(row.querySelectorAll(".bd-side"), { opacity: 0, x: (k) => (k ? 16 : -16), duration: 0.7, ease: "expo.out", delay: 0.2 + i * 0.12 });
              gsap.delayedCall(0.25 + i * 0.18, () => flip(row));
            },
          }),
        );
        return () => {
          triggers.forEach((t) => t.kill());
          // leave the real characters behind (e.g. if reduced motion is switched on mid-visit)
          rows.forEach((row) => row.querySelectorAll<HTMLElement>(".flap").forEach((f) => (f.textContent = f.dataset.c!)));
        };
      });
      // re-flip a line when it's pointed at
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const rows = gsap.utils.toArray<HTMLElement>(".bd-row");
        const offs = rows.map((row) => {
          const on = () => flip(row);
          row.addEventListener("pointerenter", on);
          return () => row.removeEventListener("pointerenter", on);
        });
        return () => offs.forEach((o) => o());
      });
    },
    { scope: ref },
  );

  const copy = contextSafe((e: MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard?.writeText(studio.email).catch(() => {});
    setCopied(true);
    gsap.fromTo(e.currentTarget, { scale: 1.25, rotate: -8 }, { scale: 1, rotate: 0, duration: 0.6, ease: "back.out(3)" });
    setTimeout(() => setCopied(false), 1800);
  });

  return (
    <div ref={ref} className="mt-10 text-left" style={boardSize}>
      <div className="bd-head hud flex items-center justify-between border-b border-tungsten/25 pb-3 text-dust">
        <span>Line</span>
        <span className="hidden md:inline">Ways to reach me</span>
        <span className="flex items-center gap-2 text-go">
          <span className="rec-blink h-1.5 w-1.5 rounded-full bg-go" /> Open
        </span>
      </div>
      <ul>
        {lines.map((l) => {
          // as large as the column allows, never wider than the screen
          return (
            <li
              key={l.k}
              className="bd-row group relative grid overflow-hidden [container-type:inline-size] grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 py-4 md:grid-cols-[5.5rem_1fr_auto] md:py-5"
            >
              <span aria-hidden className="bd-rule absolute inset-x-0 bottom-0 h-px origin-left bg-tungsten/15" />
              {/* an amber scan passes along the line when it's pointed at */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-24 -translate-x-full bg-gradient-to-r from-transparent via-amber/10 to-transparent opacity-0 transition-none group-hover:translate-x-[calc(100cqw)] group-hover:opacity-100 group-hover:transition-[transform,opacity] group-hover:duration-700"
              />
              <span className="bd-side hud order-1 flex items-center gap-2 text-dust md:order-none">
                <span className="rounded-sm border border-tungsten/20 px-1.5 py-0.5 text-[0.6rem] text-amber">{l.code}</span>
                {l.k}
              </span>
              <a
                href={l.href}
                {...(l.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                aria-label={`${l.k}: ${l.v}`}
                data-frame-hover
                className="order-3 col-span-2 -my-3 flex min-w-0 flex-wrap gap-y-[0.2em] py-3 md:order-none md:col-span-1 font-mono font-medium text-[length:min(1.6rem,var(--bd-sm))] [perspective:500px] md:text-[length:min(1.75rem,var(--bd-md))] lg:text-[length:min(1.75rem,var(--bd-lg))]"
              >
                {groups(l.v).map((g, gi) => (
                  <span key={gi} className="inline-flex gap-[0.1em] whitespace-nowrap pr-[0.1em]">
                    {g.split("").map((c, i) => (
                      <span key={i} aria-hidden data-c={c} className={`flap ${c === " " ? "flap-space" : ""} ${l.copy ? "" : "uppercase"}`}>
                        {c}
                      </span>
                    ))}
                  </span>
                ))}
              </a>
              {l.copy ? (
                <button
                  type="button"
                  onClick={copy}
                  className={`bd-side hud order-2 flex h-10 shrink-0 items-center gap-2 justify-self-end rounded-full border px-4 md:order-none transition-colors ${copied ? "border-go bg-go text-void" : "border-tungsten/30 hover:border-amber hover:text-amber"}`}
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              ) : (
                <a
                  href={l.href}
                  {...(l.ext ? { target: "_blank", rel: "noreferrer" } : {})}
                  tabIndex={-1}
                  className="bd-side hud order-2 flex h-10 shrink-0 items-center gap-2 justify-self-end rounded-full bg-tungsten px-4 md:order-none text-void transition-colors hover:bg-amber"
                >
                  {l.action} <span aria-hidden>↗</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const glyph = (c: string) => (c === " " ? " " : (c === c.toLowerCase() && /[a-z]/.test(c) ? LOWER : UPPER)[(Math.random() * 36) | 0]);

/** Flips every character of a line through a few random letters before it lands. */
function flip(row: HTMLElement) {
  if (row.dataset.busy) return;
  row.dataset.busy = "1";
  const flaps = row.querySelectorAll<HTMLElement>(".flap");
  const tl = gsap.timeline({ onComplete: () => delete row.dataset.busy });
  const STEP = 0.075;
  // phones: fewer letters per flap (same clatter, a fraction of the work)
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  flaps.forEach((f, i) => {
    const final = f.dataset.c!;
    if (final === " ") return;
    const steps = coarse ? 2 : 3 + ((i * 7) % 4);
    const at = i * 0.03;
    for (let s = 0; s < steps; s++) {
      const t = at + s * STEP;
      const last = s === steps - 1;
      tl.to(f, { rotateX: -90, duration: STEP / 2, ease: "power1.in" }, t)
        .call(() => void (f.textContent = last ? final : glyph(final)), [], t + STEP / 2)
        .fromTo(f, { rotateX: 90 }, { rotateX: 0, duration: STEP / 2, ease: "power1.out", immediateRender: false }, t + STEP / 2);
    }
    tl.call(flapTick, [], at + steps * STEP);
  });
}
