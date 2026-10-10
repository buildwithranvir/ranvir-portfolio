"use client";

import Image from "next/image";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/lib/content";
import { getLenis } from "@/lib/scroll";
import { AnchorLink } from "./ui/AnchorLink";

const noop = () => () => {};

/** Case-study sheet on glass, portalled to <body>. Escape closes; focus returns to the card. */
export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);
  const mounted = useSyncExternalStore(noop, () => true, () => false);

  useEffect(() => {
    if (!project) return;
    const trigger = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      trigger?.focus({ preventScroll: true });
    };
  }, [project, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div className="fixed inset-0 z-[80] flex items-end justify-center p-3 md:items-center md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-void/70 backdrop-blur-md" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="pm-title"
            data-lenis-prevent
            className="glass relative max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-3xl"
            initial={{ y: 60, opacity: 0, filter: "blur(12px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: 30, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.2, 0.9, 0.1, 1] }}
          >
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto">
                <Image src={project.image.src} alt={project.image.alt} fill placeholder="blur" sizes="(min-width: 768px) 512px, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <p className="mono text-signal">
                    {project.code} — {project.discipline}
                  </p>
                  <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close case study" className="mono -mr-2 -mt-2 h-10 rounded-lg px-3 text-mist hover:bg-white/[0.06] hover:text-ice">
                    esc ✕
                  </button>
                </div>
                <h3 id="pm-title" className="wide mt-3 text-5xl leading-none">
                  {project.name}
                </h3>
                <p className="mt-5 text-lg leading-relaxed text-ice/85">{project.summary}</p>
                <dl className="mono mt-6 space-y-1.5 text-mist">
                  <div className="flex justify-between gap-4"><dt>client</dt><dd className="text-right text-ice">{project.client}</dd></div>
                  <div className="flex justify-between gap-4"><dt>year</dt><dd className="text-ice">{project.year}</dd></div>
                  <div className="flex justify-between gap-4"><dt>result</dt><dd className="text-right text-ice">{project.outcome}</dd></div>
                </dl>
                <ul className="mono mt-5 flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <li key={s} className="rounded-md border border-white/15 px-2 py-1 text-mist">{s}</li>
                  ))}
                </ul>
                <AnchorLink href="#contact" onClick={onClose} className="mt-8 flex h-11 items-center justify-center rounded-lg bg-signal font-semibold text-void">
                  Start something similar →
                </AnchorLink>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
