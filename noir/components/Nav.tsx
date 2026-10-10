"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav } from "@/lib/site";
import { useToday } from "@/lib/today";
import { getLenis } from "@/lib/scroll";
import { AnchorLink } from "./ui/AnchorLink";

/** Floating frosted bar that sits above the page like a sheet of tracing paper. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Tuck the bar away while reading downwards; bring it back on the way up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 240);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const { day, open: isOpen, closes, opens } = useToday();

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const status = day < 0 ? "" : isOpen ? `Open now · until ${closes}` : `Closed · opens ${opens}`;

  return (
    <header
      className={`fixed inset-x-0 top-3 z-50 transition-transform duration-700 ease-slow md:top-4 ${hidden && !open ? "-translate-y-[130%]" : ""}`}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="wrap">
        <nav aria-label="Main" className="glass flex h-14 items-center justify-between gap-4 rounded-[14px] pl-4 pr-2 md:pl-5">
          <AnchorLink href="#top" onClick={() => setOpen(false)} className="flex items-baseline gap-2.5" aria-label="NOIR, back to top">
            <span className="font-display text-[1.35rem] leading-none tracking-[0.02em]">Noir</span>
            <span className="label hidden text-[0.625rem] text-ink-soft sm:inline">Kaffebar &amp; Bageri</span>
          </AnchorLink>

          <ul className="hidden items-center gap-1 text-[0.9375rem] lg:flex">
            {nav.map((l) => (
              <li key={l.href}>
                <AnchorLink href={l.href} className="rounded-md px-3 py-2 text-ink-soft transition-colors duration-500 hover:bg-ink/[0.06] hover:text-ink">
                  {l.label}
                </AnchorLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {status && (
              <p className="hidden items-center gap-2 text-[0.8125rem] text-ink-soft md:flex" aria-live="polite">
                <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-olive-soft" : "bg-burgundy"}`} aria-hidden />
                {status}
              </p>
            )}
            <AnchorLink
              href="#book"
              className="hidden h-10 items-center rounded-[10px] bg-ink px-4 text-[0.875rem] text-milk transition-colors duration-500 hover:bg-burgundy sm:flex"
            >
              Book a table
            </AnchorLink>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="noir-menu"
              className="flex h-10 items-center rounded-[10px] px-3 text-[0.875rem] lg:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id="noir-menu"
              initial={{ clipPath: "inset(0% 0% 100% 0% round 24px)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0% round 24px)" }}
              exit={{ clipPath: "inset(0% 0% 100% 0% round 24px)" }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              data-lenis-prevent className="glass mt-2 max-h-[calc(100svh-5.5rem)] overflow-y-auto overscroll-contain rounded-[24px] p-3 lg:hidden"
            >
              <motion.ul initial="hide" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } } }}>
                {[...nav, { label: "Book a table", href: "#book" as const }].map((l, i) => (
                  <motion.li key={l.href} variants={{ hide: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                    <AnchorLink
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between border-b border-ink/10 px-3 py-4 font-display text-[2rem] leading-none last:border-0 hover:text-burgundy [@media(max-height:520px)]:py-2.5 [@media(max-height:520px)]:text-[1.5rem]"
                    >
                      {l.label}
                      <span aria-hidden className="label text-ink-soft">0{i + 1}</span>
                    </AnchorLink>
                  </motion.li>
                ))}
              </motion.ul>
              {status && <p className="label px-3 pb-2 pt-4 text-ink-soft">{status}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
