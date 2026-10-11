"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";
import { getLenis } from "@/lib/scroll";
import { useShop } from "./ShopContext";
import { formatPrice } from "./sections/Edit";

const sizes = ["XS", "S", "M", "L", "XL"];
const snap = [0.76, 0, 0.24, 1] as const;

/** Product sheet. Escape closes, Tab stays inside, focus returns to the row you came from. */
export function QuickView() {
  const { quickView: p, closeQuickView } = useShop();
  const [size, setSize] = useState("M");
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!p) return;
    const trigger = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickView();
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>("button, a[href]");
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      trigger?.focus({ preventScroll: true });
    };
  }, [p, closeQuickView]);

  const subject = p ? encodeURIComponent(`Enquiry: ${p.name} (${size})`) : "";

  return (
    <AnimatePresence>
      {p && (
        <div className="fixed inset-0 z-[60]">
          <motion.div className="absolute inset-0 bg-ink/60 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeQuickView} />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="qv-title"
            data-lenis-prevent
            className="absolute inset-y-0 right-0 flex w-full max-w-[880px] flex-col overflow-y-auto bg-porcelain text-ink md:flex-row"
            initial={{ clipPath: "inset(0% 0% 0% 100% round 0px)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
            exit={{ clipPath: "inset(0% 0% 0% 100% round 0px)" }}
            transition={{ duration: 0.8, ease: snap }}
          >
            <button type="button" onClick={closeQuickView} aria-label="Close product details" className="mono absolute right-4 top-4 z-10 h-10 rounded-full bg-porcelain/80 px-4 backdrop-blur transition-colors hover:bg-acid">
              Close ✕
            </button>
            <div className="relative aspect-[4/5] w-full shrink-0 bg-bone md:aspect-auto md:w-1/2">
              <Image src={p.image.src} alt={p.image.alt} fill placeholder="blur" sizes="(min-width: 768px) 430px, 100vw" className="grade object-contain p-8" />
            </div>
            <div className="flex flex-1 flex-col p-6 pt-16 md:p-10 md:pt-16">
              <p className="mono text-ink/55">
                {p.collection} · {p.category}
              </p>
              <h3 id="qv-title" className="display mt-3 text-[clamp(2.4rem,5vw,3.6rem)] [--w:90]">
                {p.name}
              </h3>
              <p className="mono mt-3 text-[0.9375rem] tabular-nums">{formatPrice(p.price)}</p>
              <p className="mt-8 text-[1.0625rem] leading-relaxed">{p.description}</p>
              <p className="mono mt-3 text-ink/60">{p.material}</p>

              <fieldset className="mt-10">
                <legend className="mono mb-3">Size</legend>
                <div className="flex gap-1.5" role="radiogroup">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={s === size}
                      onClick={() => setSize(s)}
                      className={`mono h-11 w-11 rounded-full border text-[0.75rem] transition-colors ${s === size ? "border-ink bg-ink text-porcelain" : "border-ink/20 hover:border-ink"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-auto pt-10">
                <a href={`mailto:${site.email}?subject=${subject}`} className="group flex h-14 w-full items-center justify-between rounded-full bg-ink pl-6 pr-2 text-porcelain transition-colors hover:bg-plum">
                  <span>Enquire about size {size}</span>
                  <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-acid text-ink transition-transform duration-500 group-hover:-rotate-45">→</span>
                </a>
                <p className="mt-3 text-[0.8125rem] text-ink/60">No checkout in this demo. The enquiry opens your email app with the piece and size filled in.</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
