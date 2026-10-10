"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/lib/site";
import { getLenis } from "@/lib/scroll";
import { AnchorLink } from "./ui/AnchorLink";

// Studio local time, as a small live readout. Empty during SSR.
const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 1000);
  return () => clearInterval(t);
};
const getTime = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Lisbon" });

/** A floating glass control strip, docked at the top left like an instrument panel. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const time = useSyncExternalStore(subscribe, getTime, () => "");

  useEffect(() => {
    const lenis = getLenis();
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-3 z-50">
      <div className="frame flex items-start justify-between gap-3">
        <nav aria-label="Main" className="glass flex h-12 items-center gap-1 rounded-xl pl-4 pr-1.5">
          <AnchorLink href="#top" onClick={() => setOpen(false)} className="mr-3 flex items-center gap-2 font-bold tracking-[-0.03em]" aria-label="NOVA, back to top">
            <span aria-hidden className="grid h-4 w-4 grid-cols-2 gap-[2px]">
              <span className="bg-signal" />
              <span className="bg-ice" />
              <span className="bg-ice" />
              <span className="bg-ice/30" />
            </span>
            NOVA
          </AnchorLink>
          <ul className="hidden items-center md:flex">
            {nav.map((l) => (
              <li key={l.href}>
                <AnchorLink href={l.href} className="rounded-lg px-3 py-2 text-[0.875rem] text-mist transition-colors hover:bg-white/[0.06] hover:text-ice">
                  {l.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="nova-menu" className="mono h-9 rounded-lg px-3 text-mist hover:text-ice md:hidden">
            {open ? "close" : "menu"}
          </button>
        </nav>

        <div className="glass mono hidden h-12 items-center gap-4 rounded-xl px-4 text-mist lg:flex" aria-label="Studio status">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />
            Booking Q1 2027
          </span>
          <span className="text-dim">|</span>
          <span>
            {site.location.split(" /")[0]} <span className="tabular-nums text-ice">{time}</span>
          </span>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="nova-menu"
            data-lenis-prevent
            className="grid-bg fixed inset-0 -z-10 flex flex-col overflow-y-auto bg-void px-5 pb-8 pt-24 md:hidden"
            initial={{ clipPath: "circle(0% at 24% 2.5rem)" }}
            animate={{ clipPath: "circle(160% at 24% 2.5rem)" }}
            exit={{ clipPath: "circle(0% at 24% 2.5rem)" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <div aria-hidden className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-signal/15 blur-[90px]" />
            <motion.ul
              className="relative"
              initial="hide"
              animate="show"
              exit="hide"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.22 } }, hide: { transition: { staggerChildren: 0.03, staggerDirection: -1 } } }}
            >
              {nav.map((l, i) => (
                <li key={l.href} className="overflow-hidden border-b border-white/10">
                  <motion.div variants={{ hide: { y: "110%" }, show: { y: "0%" } }} transition={{ duration: 0.7, ease: [0.2, 0.9, 0.1, 1] }}>
                    <AnchorLink
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="group wide flex items-baseline justify-between py-4 text-[clamp(2.4rem,12vw,3.6rem)] leading-none active:text-signal [@media(max-height:560px)]:py-2 [@media(max-height:560px)]:text-[2rem]"
                    >
                      {l.label}
                      <span className="mono text-signal">0{i + 1}</span>
                    </AnchorLink>
                  </motion.div>
                </li>
              ))}
            </motion.ul>
            <motion.div
              className="mono relative mt-auto space-y-3 pt-10 text-mist"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.55, duration: 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <AnchorLink href="#contact" onClick={() => setOpen(false)} className="flex h-12 items-center justify-center rounded-xl bg-signal font-bold text-void">
                start a project →
              </AnchorLink>
              <p className="flex items-center justify-between">
                <a href={`mailto:${site.email}`} className="text-ice">
                  {site.email}
                </a>
                <span>
                  {site.location.split(" /")[0]} <span className="tabular-nums text-ice">{time}</span>
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
