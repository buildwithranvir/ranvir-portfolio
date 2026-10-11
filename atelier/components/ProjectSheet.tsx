"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { projects } from "@/lib/content";
import { getLenis } from "@/lib/scroll";
import { AnchorLink } from "./ui/AnchorLink";
import { chip } from "./sections/Projects";

const ease = [0.7, 0, 0.2, 1] as const;

/** A project opens as a drawing sheet: title block first, then plates. */
export function ProjectSheet({ index, onChange }: { index: number | null; onChange: (i: number | null) => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const p = open ? projects[index] : null;

  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onChange(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      trigger?.focus({ preventScroll: true });
    };
  }, [open, onChange]);

  const step = (d: number) => {
    if (index === null) return;
    onChange((index + d + projects.length) % projects.length);
    panel.current?.scrollTo({ top: 0 });
  };

  const images = p ? [p.cover, ...p.gallery] : [];

  return (
    <AnimatePresence>
      {p && (
        <motion.div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sheet-title"
          data-lenis-prevent
          className="fixed inset-0 z-[110] overflow-y-auto bg-paper"
          initial={{ clipPath: "polygon(100% 0%, 100% 0%, 100% 0%)" }}
          animate={{ clipPath: "polygon(100% 0%, -150% 0%, 100% 250%)" }}
          exit={{ clipPath: "polygon(100% 0%, 100% 0%, 100% 0%)" }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="sticky top-0 z-10 border-b border-ink/15 bg-paper/85 backdrop-blur-[6px]">
            <div className="sheet flex h-16 items-center justify-between gap-3">
              <p className="label text-ink/65">
                Sheet {p.no} · {String(index! + 1).padStart(2, "0")} of {String(projects.length).padStart(2, "0")}
              </p>
              <div className="label flex items-center gap-1">
                <button type="button" onClick={() => step(-1)} className="h-10 px-2 hover:text-cobalt sm:px-3">← Prev</button>
                <button type="button" onClick={() => step(1)} className="h-10 px-2 hover:text-cobalt sm:px-3">Next →</button>
                <button type="button" data-autofocus onClick={() => onChange(null)} className="ml-2 h-10 bg-ink px-4 text-paper transition-colors hover:bg-cobalt">
                  Close ✕
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.article key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.25, duration: 0.6 } }} exit={{ opacity: 0, transition: { duration: 0.2 } }} className="sheet py-12 md:py-16">
              <p className="label text-rust">{p.no}</p>
              <h2 id="sheet-title" className="display mt-3 text-[clamp(2.4rem,5.4vw,5rem)]">
                {p.name}
              </h2>

              {/* Title block */}
              <dl className="mt-8 grid grid-cols-2 border-l border-t border-ink sm:grid-cols-3 lg:grid-cols-6">
                {[
                  ["Drawing no.", p.no],
                  ["Typology", p.typology],
                  ["Location", p.location],
                  ["Year", p.year],
                  ["Area", p.area],
                  ["Status", p.status],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-r border-ink px-3 py-2.5">
                    <dt className="label text-ink/55">{k}</dt>
                    <dd className="mt-0.5">{k === "Typology" ? <span className={`label px-1.5 py-0.5 ${chip[p.typology]}`}>{v}</span> : v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-12 grid gap-10 lg:grid-cols-12">
                <p className="serif text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.3] lg:col-span-5">{p.summary}</p>
                <div className="space-y-12 lg:col-span-6 lg:col-start-7">
                  {images.map((img, i) => (
                    <figure key={img.alt} className="max-w-[34rem]">
                      {/* Natural proportions - no cropping on the project sheet */}
                      <Image src={img.src} alt={img.alt} placeholder="blur" sizes="(min-width: 1024px) 50vw, 100vw" className="grade h-auto w-full outline outline-1 outline-offset-4 outline-ink/20" />
                      <figcaption className="label mt-3 text-ink/65">
                        Fig. {i + 1} · {img.alt}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>

              <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t-2 border-ink pt-8 sm:flex-row sm:items-center">
                <p className="display text-[1.5rem] tracking-[-0.03em]">Planning something <span className="serif font-normal text-cobalt">similar</span>?</p>
                <AnchorLink href="#contact" onClick={() => onChange(null)} className="label bg-rust px-5 py-3 text-paper transition-colors hover:bg-ink">
                  Start a project brief →
                </AnchorLink>
              </div>
            </motion.article>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
