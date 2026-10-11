"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { getLenis } from "@/lib/scroll";
import { wantThis } from "@/lib/site";
import { templates, type Template } from "@/lib/templates";

type Open = (id: string) => void;
const LiveCtx = createContext<Open>(() => {});
export const useLive = () => useContext(LiveCtx);

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * "Live preview": the real template in a laptop or phone view, loaded only when
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
      aria-label={`${t.name}, live preview`}
      data-lenis-prevent
      className="fixed inset-0 z-[95] flex flex-col bg-bg"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24, transition: { duration: 0.3 } }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="wrap flex shrink-0 items-center justify-between gap-3 py-3">
        <p className="flex items-baseline gap-3">
          <span className="text-[1.4rem] font-semibold tracking-[-0.03em]">{t.name}</span>
          <span className="label hidden text-muted sm:inline">{t.industry}</span>
        </p>
        <div className="flex items-center gap-2">
          <div role="tablist" aria-label="Device" className="hidden rounded-full border border-white/15 p-1 sm:flex">
            {(["laptop", "phone"] as const).map((d) => (
              <button
                key={d}
                type="button"
                role="tab"
                aria-selected={device === d}
                onClick={() => setDevice(d)}
                className={`h-8 rounded-full px-4 text-[0.85rem] transition-colors ${device === d ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}
              >
                {d === "laptop" ? "Laptop" : "Phone"}
              </button>
            ))}
          </div>
          <button ref={closeBtn} type="button" onClick={onClose} className="btn btn-ghost h-10 px-4 text-[0.9rem]">
            Close
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-2 md:px-10 md:pb-4">
        <div
          className={`relative h-full overflow-hidden bg-white ${
            device === "phone" ? "aspect-[390/844] max-h-full w-auto max-w-full rounded-[1.6rem] border-[7px] border-[#1a1a1a]" : "w-full rounded-xl border border-white/10"
          }`}
        >
          {!loaded && <p className="label absolute inset-0 grid place-items-center bg-raised text-muted">Opening {t.name}…</p>}
          <iframe title={`${t.name} live website`} src={t.url} onLoad={() => setLoaded(true)} className="h-full w-full" />
        </div>
      </div>

      <div className="wrap flex shrink-0 flex-wrap items-center justify-center gap-2 pb-4 md:justify-end">
        <a href={t.url} target="_blank" rel="noreferrer" className="btn btn-ghost h-11 text-[0.9rem]">
          Open in a new tab <span aria-hidden>↗</span>
        </a>
        <a href={wantThis(t.name)} target="_blank" rel="noreferrer" className="btn btn-accent h-11 text-[0.9rem]">
          I want this one <span aria-hidden>↗</span>
        </a>
      </div>
    </motion.div>
  );
}
