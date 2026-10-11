"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "@/lib/scroll";
import { wantThis } from "@/lib/site";
import { onColor, templates, type Template } from "@/lib/templates";

type Open = (id: string) => void;
const LiveCtx = createContext<Open>(() => {});
export const useLive = () => useContext(LiveCtx);

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * "Try it live": the real template in a laptop or phone view, loaded only when
 * asked for. Esc, the close button and the browser's Back button all close it.
 */
export function LiveProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const pushed = useRef(false);

  const open = useCallback<Open>((next) => {
    setId(next);
    if (!pushed.current) {
      history.pushState({ live: next }, "", `#live-${next}`);
      pushed.current = true;
    }
  }, []);
  const close = useCallback(() => {
    if (pushed.current) history.back();
    else setId(null);
  }, []);

  useEffect(() => {
    const onPop = () => {
      pushed.current = false;
      setId(null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const t = templates.find((x) => x.id === id) ?? null;
  return (
    <LiveCtx.Provider value={open}>
      {children}
      <AnimatePresence>{t && <Viewer key={t.id} t={t} onClose={close} />}</AnimatePresence>
    </LiveCtx.Provider>
  );
}

function Viewer({ t, onClose }: { t: Template; onClose: () => void }) {
  const [device, setDevice] = useState<"laptop" | "phone">(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches ? "phone" : "laptop",
  );
  const [loaded, setLoaded] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const ink = t.colors.ink;

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${t.name}, live`}
      data-lenis-prevent
      className="fixed inset-0 z-[95] flex flex-col"
      style={{ background: t.colors.bg, color: ink }}
      initial={{ opacity: 0, scale: 0.96, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 20, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 px-3 py-3 md:px-6">
        <p className="display text-[1.8rem] leading-none" style={{ color: t.colors.paint }}>
          {t.name}
        </p>
        <div className="flex items-center gap-2">
          <div role="tablist" aria-label="Device" className="hidden rounded-full p-1 ring-1 sm:flex" style={{ ["--tw-ring-color" as string]: `${ink}33` }}>
            {(["laptop", "phone"] as const).map((d) => (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={device === d}
                onClick={() => setDevice(d)}
                className="mono h-9 rounded-full px-4 transition-colors"
                style={device === d ? { background: ink, color: t.colors.bg } : undefined}
              >
                {d === "laptop" ? "Laptop" : "Phone"}
              </button>
            ))}
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="btn h-10 px-4"
            style={{ background: ink, color: t.colors.bg }}
          >
            Close · Esc
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-2 md:px-6 md:pb-4">
        <div
          className={`relative h-full overflow-hidden bg-white shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)] transition-[width,border-radius] duration-500 ${
            device === "phone" ? "aspect-[390/844] max-h-full w-auto max-w-full rounded-[1.6rem] ring-[7px] ring-[#111]" : "w-full rounded-[12px]"
          }`}
        >
          {!loaded && (
            <p className="mono absolute inset-0 grid place-items-center text-ink/60" style={{ background: t.colors.bg, color: ink }}>
              Opening {t.name}…
            </p>
          )}
          <iframe title={`${t.name} live website`} src={t.url} onLoad={() => setLoaded(true)} className="h-full w-full" />
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 px-3 pb-4 md:justify-end md:px-6">
        <a href={t.url} target="_blank" rel="noreferrer" className="btn h-11 ring-1" style={{ ["--tw-ring-color" as string]: `${ink}44` }}>
          Open in a new tab <span aria-hidden>↗</span>
        </a>
        <a
          href={wantThis(t.name)}
          target="_blank"
          rel="noreferrer"
          className="btn h-11"
          style={{ background: t.colors.paint, color: onColor(t.colors.paint) }}
        >
          I want this one <span aria-hidden>↗</span>
        </a>
      </div>
    </motion.div>
  );
}
