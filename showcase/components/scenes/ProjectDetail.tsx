"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { demos, type Demo } from "@/lib/site";
import { previews } from "@/lib/previews";
import { getLenis } from "@/lib/scroll";

type State = { id: Demo["id"]; rect: DOMRect | null; shot?: number } | null;
const ease = [0.7, 0, 0.2, 1] as const;

const insetFrom = (r: DOMRect | null) =>
  r
    ? `inset(${Math.max(0, r.top)}px ${Math.max(0, window.innerWidth - r.right)}px ${Math.max(0, window.innerHeight - r.bottom)}px ${Math.max(0, r.left)}px round 14px)`
    : "inset(50% 50% 50% 50% round 14px)";

/**
 * The project view. It grows out of whatever was clicked, takes on the
 * project's own colours, and shows the site properly: a gallery of real
 * screens, the phone version, and the live site (loaded only when asked).
 * Esc, the close button and the browser's Back button all return to the page.
 */
export function ProjectDetail({ state, onClose, onSwitch }: { state: State; onClose: () => void; onSwitch: (id: Demo["id"]) => void }) {
  const [mode, setMode] = useState<"gallery" | "live">("gallery");
  const [loaded, setLoaded] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const isOpen = !!state;
  const d = state ? demos.find((x) => x.id === state.id)! : null;
  const idx = d ? demos.indexOf(d) : 0;
  const next = demos[(idx + 1) % demos.length];

  // switching projects resets the view (state adjusted during render, keyed on the project)
  const [shown, setShown] = useState(state?.id);
  if (state?.id !== shown) {
    setShown(state?.id);
    setMode("gallery");
    setLoaded(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // open at the top — or at the screen that was clicked in a tour
  useEffect(() => {
    if (!state) return;
    const t = window.setTimeout(() => {
      if (state.shot === undefined) panel.current?.scrollTo({ top: 0 });
      else panel.current?.querySelector<HTMLElement>(`[data-shot="${state.shot}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 650);
    return () => window.clearTimeout(t);
  }, [state]);

  return (
    <AnimatePresence>
      {d && state && (
        <motion.div
          key="project"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pd-title"
          data-lenis-prevent
          className="stay-dark fixed inset-0 z-[95] overflow-y-auto overscroll-contain"
          style={{ background: d.scene.bg, color: d.scene.fg }}
          initial={{ clipPath: insetFrom(state.rect) }}
          animate={{ clipPath: "inset(0px 0px 0px 0px round 0px)" }}
          exit={{ clipPath: "inset(0px 0px 100% 0px round 0px)", transition: { duration: 0.7, ease } }}
          transition={{ duration: 0.85, ease }}
        >
          <header className="sticky top-0 z-10 px-3 pt-3 md:px-5 md:pt-4">
            <div
              className={`${d.scene.bg === "#efe7da" || d.scene.bg === "#eee6d8" ? "glass-light" : "glass"} mx-auto flex h-14 max-w-[1520px] items-center justify-between gap-3 rounded-full pl-5 pr-2`}
            >
              <p className="hud truncate">
                <span style={{ color: d.scene.accent }}>Project {String(idx + 1).padStart(2, "0")}</span> · {d.industry}
              </p>
              <button
                ref={closeBtn}
                type="button"
                onClick={onClose}
                className="hud flex h-10 shrink-0 items-center gap-2 rounded-full px-4 transition-colors"
                style={{ background: d.scene.fg, color: d.scene.bg }}
              >
                Close · Esc
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.article
              key={d.id}
              className="frame pb-24 pt-10 md:pt-14"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
            >
              <div className="grid grid-cols-1 gap-6 text-center lg:grid-cols-12 lg:items-end lg:text-left">
                <h2 id="pd-title" className="credit text-[clamp(2.7rem,7.2vw,6.3rem)] [--w:118] lg:col-span-7" style={{ color: d.scene.accent }}>
                  {d.name}
                </h2>
                <p className="voice mx-auto max-w-[38ch] text-[1.35rem] leading-snug lg:col-span-5 lg:mx-0">{d.description}</p>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-8">
                  <div className="mb-4 flex justify-center lg:justify-start">
                    <div role="tablist" aria-label="View" className="inline-flex rounded-full border p-1" style={{ borderColor: `${d.scene.fg}33` }}>
                      {(["gallery", "live"] as const).map((m) => (
                        <button
                          key={m}
                          role="tab"
                          type="button"
                          aria-selected={mode === m}
                          onClick={() => setMode(m)}
                          className="hud rounded-full px-4 py-2 transition-colors"
                          style={mode === m ? { background: d.scene.fg, color: d.scene.bg } : undefined}
                        >
                          {m === "gallery" ? "Gallery" : "Live site"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {mode === "gallery" ? (
                    <div className="space-y-5">
                      <figure className="overflow-hidden rounded-[12px] ring-1 ring-black/10">
                        <Image
                          src={previews[d.id].desktop}
                          alt={`${d.name} — home page`}
                          placeholder="blur"
                          sizes="(min-width: 1024px) 62vw, 94vw"
                          className="block h-auto w-full"
                        />
                      </figure>
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {previews[d.id].tour.map((src, i) => (
                          <figure
                            key={i}
                            data-shot={i}
                            className={`overflow-hidden rounded-[12px] ring-1 ring-black/10 ${state.shot === i ? "ring-2" : ""}`}
                            style={state.shot === i ? { boxShadow: `0 0 0 2px ${d.scene.accent}` } : undefined}
                          >
                            <Image
                              src={src}
                              alt={`${d.name} — ${d.tour[i]}`}
                              placeholder="blur"
                              sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 94vw"
                              className="block h-auto w-full"
                            />
                            <figcaption className="hud px-4 py-3 opacity-75">
                              {String(i + 1).padStart(2, "0")} · {d.tour[i]}
                            </figcaption>
                          </figure>
                        ))}
                        <figure className="flex items-center justify-center rounded-[12px] p-5 ring-1 ring-black/10" style={{ background: `${d.scene.fg}0d` }}>
                          <div className="w-[52%] rounded-[1.6rem] bg-[#111] p-1.5 ring-1 ring-black/30">
                            <Image
                              src={previews[d.id].mobile}
                              alt={`${d.name} on a phone`}
                              placeholder="blur"
                              sizes="(min-width: 1024px) 14vw, 40vw"
                              className="block h-auto w-full rounded-[1.2rem]"
                            />
                          </div>
                        </figure>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-[12px] bg-white ring-1 ring-black/10">
                      <div className="flex h-9 items-center gap-1.5 border-b border-black/5 px-3.5 text-black/50">
                        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
                        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
                        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
                        <span className="hud ml-3 truncate normal-case tracking-normal">{d.url.replace(/^https?:\/\//, "")}</span>
                      </div>
                      <div className="relative h-[72svh] bg-[#f4f4f4]">
                        {!loaded && <p className="hud absolute inset-0 grid place-items-center text-black/50">Loading the live site…</p>}
                        <iframe title={`${d.name} — live website`} src={d.url} onLoad={() => setLoaded(true)} className="relative h-full w-full" />
                      </div>
                    </div>
                  )}
                </div>

                <aside className="lg:col-span-4">
                  <div
                    className={`${d.scene.bg === "#efe7da" || d.scene.bg === "#eee6d8" ? "glass-light" : "glass"} space-y-7 rounded-2xl p-6 lg:sticky lg:top-24`}
                  >
                    <dl className="space-y-5">
                      <div>
                        <dt className="hud opacity-60">Built for</dt>
                        <dd className="mt-1">{d.industry}</dd>
                      </div>
                      <div>
                        <dt className="hud opacity-60">Type</dt>
                        <dd className="mt-1">{d.fonts}</dd>
                      </div>
                      <div>
                        <dt className="hud opacity-60">Palette</dt>
                        <dd className="mt-2 flex flex-wrap gap-x-3 gap-y-2">
                          {d.palette.map((c) => (
                            <span key={c} className="flex items-center gap-1.5">
                              <span className="h-5 w-5 rounded-full" style={{ background: c, boxShadow: `0 0 0 1px ${d.scene.fg}40` }} />
                              <span className="hud normal-case tracking-normal opacity-70">{c}</span>
                            </span>
                          ))}
                        </dd>
                      </div>
                      <div>
                        <dt className="hud opacity-60">Highlights</dt>
                        <dd className="mt-2 flex flex-wrap gap-1.5">
                          {d.features.map((f) => (
                            <span key={f} className="hud rounded-full px-3 py-1.5 normal-case tracking-[0.02em]" style={{ background: `${d.scene.fg}14` }}>
                              {f}
                            </span>
                          ))}
                        </dd>
                      </div>
                    </dl>
                    <div className="flex flex-col gap-3">
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hud flex h-12 items-center justify-between rounded-full px-5 transition-[filter] hover:brightness-110"
                        style={{ background: d.scene.accent, color: d.id === "vanta" ? "#140f12" : "#fff" }}
                      >
                        Visit the live site <span aria-hidden>↗</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => onSwitch(next.id)}
                        className="hud flex h-12 items-center justify-between rounded-full border px-5 transition-opacity hover:opacity-70"
                        style={{ borderColor: `${d.scene.fg}44` }}
                      >
                        Next project — {next.name} <span aria-hidden>→</span>
                      </button>
                    </div>
                  </div>
                </aside>
              </div>
            </motion.article>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
