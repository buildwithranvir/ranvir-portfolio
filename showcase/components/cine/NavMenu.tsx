"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { about, studio, tools } from "@/lib/site";
import { brands } from "@/lib/brands";
import { playIntro } from "@/lib/intro";
import { getLenis } from "@/lib/scroll";

const expo = [0.16, 1, 0.3, 1] as const;
const toolCount = tools.reduce((n, g) => n + g.items.length, 0);

// the quick jumps: a section id, a label, a line about it, and which scenes count as "here"
const rows = [
  { id: "top", label: "Home", note: "Start here", match: ["top"] },
  { id: "about", label: "About", note: "Who I am", match: ["about"] },
  { id: "craft", label: "Services", note: "What I make", match: ["craft"] },
  { id: "work", label: "Work", note: "Every site, its own world", match: ["work", "noir", "vanta", "atelier", "nova"] },
  { id: "offscreen", label: "Client work", note: "Live, for real clients", match: ["offscreen"] },
  { id: "kit", label: "Toolkit", note: `${toolCount} tools`, match: ["kit"] },
  { id: "method", label: "Process", note: "How I work", match: ["method"] },
  { id: "contact", label: "Contact", note: "Start a project", match: ["contact"] },
];

/** Delhi's time, ticking - mounted only while the card is open. */
function DelhiTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);
  return <>{new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).format(now)}</>;
}

/**
 * The top-left of the site: Ranvir's name as a pill (his photo, name, chevron)
 * that opens a small ID card - jump to any section, reach him in one tap
 * (WhatsApp, call, copy email), follow him, or replay the intro.
 */
export function NavMenu({ current, onGo, onIndex }: { current: string; onGo: (id: string) => void; onIndex: () => void }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pill = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 1;

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) pill.current?.focus({ preventScroll: true });
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    // the first link takes focus, so a keyboard visitor lands inside the card
    const id = setTimeout(() => document.getElementById("nav-first")?.focus({ preventScroll: true }), 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(id);
    };
  }, [open]);

  const jump = (id: string) => {
    close(false);
    onGo(id);
  };
  const copyEmail = () => {
    navigator.clipboard?.writeText(studio.email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative z-10">
      <button
        ref={pill}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="nav-card"
        aria-label={`Menu: ${studio.name}`}
        className="chrome-part glass glass-blur pointer-events-auto group flex h-11 items-center gap-2.5 rounded-full py-1 pl-1 pr-3.5 text-tungsten transition-colors hover:text-amber"
      >
        {about.photo && (
          <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-amber/70 transition-shadow duration-500 group-hover:ring-2 group-aria-expanded:ring-2">
            <Image src={about.photo} alt="" width={72} height={72} quality={70} className="h-full w-full object-cover [object-position:68%_38%]" />
          </span>
        )}
        <span className="hud hidden whitespace-nowrap min-[380px]:inline">{studio.name}</span>
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          className="h-3 w-3 shrink-0 text-dust transition-transform duration-500 ease-out-expo group-hover:text-amber group-aria-expanded:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 4.5 6 8.5 10 4.5" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.button
            key="scrim"
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => close(false)}
            className="pointer-events-auto fixed inset-0 -z-10 cursor-default bg-void/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 * dur }}
          />
        )}
        {open && (
          <motion.div
            key="card"
            id="nav-card"
            role="navigation"
            aria-label="Quick menu"
            data-lenis-prevent
            className="pointer-events-auto absolute left-0 top-full mt-2 max-h-[calc(100svh-5.5rem)] w-[min(23rem,calc(100vw-2.5rem))] overflow-y-auto overscroll-contain rounded-2xl border border-tungsten/15 bg-card text-tungsten shadow-[0_40px_90px_-20px_rgb(var(--shade)/calc(0.9*var(--shade-k))),inset_0_1px_0_var(--glass-hi)]"
            style={{ transformOrigin: "0% 0%" }}
            initial={{ opacity: 0, scale: 0.92, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6, transition: { duration: 0.2 * dur } }}
            transition={{ duration: 0.55 * dur, ease: expo }}
          >
            {/* the banner: the photo, the name, the status */}
            <div className="relative h-[7.25rem] overflow-hidden rounded-t-2xl [@media(max-height:700px)]:h-[5.5rem]">
              {about.photo && (
                <Image src={about.photo} alt="" fill sizes="(max-width: 420px) 90vw, 368px" quality={75} className="object-cover [object-position:62%_30%]" />
              )}
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-card via-card/55 to-transparent" />
              {/* phones: an explicit way out (laptops just click the name again) */}
              <button
                type="button"
                onClick={() => close()}
                aria-label="Close menu"
                className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-void/70 text-tungsten transition-colors active:bg-tungsten active:text-void md:hidden"
              >
                <svg aria-hidden viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M2 2l8 8M10 2l-8 8" />
                </svg>
              </button>
              <span className="hud absolute right-3 top-3 flex items-center gap-2 rounded-full bg-void/70 px-2.5 py-1 text-[0.625rem] text-tungsten">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-go opacity-70" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-go" />
                </span>
                Open for projects
              </span>
              <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="credit truncate text-[1.35rem] [--w:105]">{studio.name}</p>
                  <p className="voice truncate text-[0.95rem] text-amber">{studio.role}</p>
                </div>
                <p className="hud shrink-0 text-right text-[0.625rem] text-dust">
                  Delhi
                  <br />
                  <span className="text-tungsten">
                    <DelhiTime />
                  </span>
                </p>
              </div>
            </div>

            {/* the sections */}
            <ul className="px-2 pb-1 pt-2">
              {rows.map((r, i) => {
                const here = r.match.includes(current);
                return (
                  <motion.li
                    key={r.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 * dur, ease: expo, delay: (0.1 + i * 0.03) * dur }}
                  >
                    <button
                      id={i === 0 ? "nav-first" : undefined}
                      type="button"
                      onClick={() => jump(r.id)}
                      aria-current={here ? "true" : undefined}
                      className="group/row grid w-full grid-cols-[1.75rem_1fr_auto] items-center gap-x-2 rounded-xl px-2.5 py-2 text-left [@media(max-height:700px)]:py-1 transition-colors duration-300 hover:bg-tungsten/[0.06] focus-visible:bg-tungsten/[0.06] active:bg-tungsten/10"
                    >
                      <span className={`hud transition-colors ${here ? "text-amber" : "text-dust group-hover/row:text-amber"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`credit block truncate text-[1.05rem] transition-[color,transform] duration-500 ease-out-expo [--w:100] group-hover/row:translate-x-1 ${here ? "text-amber" : ""}`}
                        >
                          {r.label}
                        </span>
                        <span className="block truncate text-[0.75rem] text-dust max-sm:hidden">{r.note}</span>
                      </span>
                      <span className="hud flex items-center gap-1.5 text-dust">
                        {here ? (
                          <span className="flex items-center gap-1.5 text-amber">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber" /> Here
                          </span>
                        ) : (
                          <span
                            aria-hidden
                            className="-translate-x-1.5 opacity-0 transition-all duration-500 group-hover/row:translate-x-0 group-hover/row:opacity-100"
                          >
                            →
                          </span>
                        )}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
            <div className="px-4 pb-3 [@media(max-height:700px)]:hidden">
              <button
                type="button"
                onClick={() => {
                  close(false);
                  onIndex();
                }}
                className="hud text-dust transition-colors hover:text-amber"
              >
                Open the full index →
              </button>
            </div>

            {/* reach him */}
            <motion.div
              className="border-t border-tungsten/10 px-4 pb-4 pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 * dur, ease: expo, delay: 0.36 * dur }}
            >
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={studio.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hud flex h-11 items-center justify-center gap-2 rounded-full bg-tungsten text-void transition-colors hover:bg-go active:bg-go"
                >
                  WhatsApp <span aria-hidden>↗</span>
                </a>
                <a
                  href={studio.phoneHref}
                  className="hud flex h-11 items-center justify-center gap-2 rounded-full border border-tungsten/30 transition-colors hover:border-amber hover:text-amber active:border-amber active:text-amber"
                >
                  Call
                </a>
              </div>
              {studio.email && (
                <button
                  type="button"
                  onClick={copyEmail}
                  className={`mt-2 flex h-11 w-full items-center justify-between gap-3 rounded-full border px-4 text-left transition-colors ${copied ? "border-go bg-go text-void" : "border-tungsten/20 hover:border-tungsten/50"}`}
                  aria-label={`Copy email address ${studio.email}`}
                >
                  <span className="truncate font-mono text-[0.78rem]">{copied ? "Copied to clipboard" : studio.email}</span>
                  <span className="hud shrink-0">{copied ? "✓" : "Copy"}</span>
                </button>
              )}

              <div className="mt-4 flex items-center justify-between gap-3">
                <ul className="flex items-center gap-1.5 sm:gap-2" aria-label="Follow">
                  {studio.socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${s.label} (opens in a new tab)`}
                        className="group/s grid h-9 w-9 place-items-center sm:h-10 sm:w-10 rounded-full border border-tungsten/20 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-[var(--c)] active:scale-90 active:bg-[var(--c)]"
                        style={{ "--c": brands[s.label].color } as React.CSSProperties}
                      >
                        <svg aria-hidden viewBox="0 0 24 24" className="h-[1.05rem] w-[1.05rem] fill-tungsten transition-colors group-hover/s:fill-white">
                          <path d={brands[s.label].path} />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    close(false);
                    playIntro();
                    getLenis()?.scrollTo(0, { immediate: true, force: true });
                  }}
                  className="hud group/p flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full pl-1.5 pr-2.5 sm:pr-3.5 transition-colors hover:text-amber active:text-amber"
                >
                  <span
                    aria-hidden
                    className="grid h-7 w-7 place-items-center rounded-full bg-rec pl-[1px] text-[0.55rem] text-void transition-transform duration-500 group-hover/p:scale-110"
                  >
                    ▶
                  </span>
                  Play intro
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
