"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/lib/site";
import { getLenis } from "@/lib/scroll";
import { AnchorLink } from "./ui/AnchorLink";

const snap = [0.76, 0, 0.24, 1] as const;

/** Floating bar that takes on the colour of whatever section is behind it. */
export function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Tuck away while reading downwards; return on the way up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 300);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-snap ${hidden && !open ? "-translate-y-full" : ""}`}
      onFocusCapture={() => setHidden(false)}
    >
      <div className="wrap pt-3 md:pt-4">
        <nav
          aria-label="Main"
          className="flex h-14 items-center justify-between gap-4 rounded-full border border-fg/10 bg-bg/70 pl-5 pr-2 text-fg backdrop-blur-md transition-[color,background-color,border-color] duration-700"
        >
          <AnchorLink href="#top" onClick={() => setOpen(false)} aria-label="VANTA, back to top" className="group display text-[1.35rem] [--w:118] transition-[font-variation-settings] duration-500 hover:[--w:150]">
            Vanta
          </AnchorLink>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((l) => (
              <li key={l.href}>
                <AnchorLink href={l.href} className="mono block rounded-full px-3.5 py-2 text-[0.6875rem] text-fg/70 transition-colors duration-300 hover:bg-fg/[0.07] hover:text-fg">
                  {l.label}
                </AnchorLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="mono hidden text-fg/50 md:inline">Issue 07 · SS26</span>
            <a
              href={`mailto:${site.email}?subject=Studio%20appointment`}
              className="mono hidden h-10 items-center rounded-full bg-acid px-4 text-ink transition-transform duration-300 hover:scale-[1.04] sm:flex"
            >
              Book a fitting
            </a>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="vanta-menu"
              className="mono flex h-10 items-center gap-2 rounded-full px-3 lg:hidden"
            >
              <span aria-hidden className="relative block h-2.5 w-4">
                <span className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-500 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-4 bg-current transition-transform duration-500 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
              </span>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="vanta-menu"
            data-lenis-prevent
            className="fixed inset-0 -z-10 overflow-y-auto bg-ink px-5 pb-10 pt-28 text-porcelain md:px-10 lg:hidden"
            initial={{ clipPath: "circle(0% at 95% 4%)" }}
            animate={{ clipPath: "circle(150% at 95% 4%)" }}
            exit={{ clipPath: "circle(0% at 95% 4%)" }}
            transition={{ duration: 0.8, ease: snap }}
          >
            <motion.ul initial="hide" animate="show" variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}>
              {nav.map((l, i) => (
                <motion.li
                  key={l.href}
                  variants={{ hide: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-porcelain/10"
                >
                  <AnchorLink
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display flex items-baseline justify-between py-4 text-[clamp(2.4rem,11vw,4.5rem)] [--w:70] transition-[font-variation-settings,color] duration-500 hover:text-acid hover:[--w:130] [@media(max-height:560px)]:py-2 [@media(max-height:560px)]:text-[2rem]"
                  >
                    {l.label}
                    <span className="mono text-porcelain/40">0{i + 1}</span>
                  </AnchorLink>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <a href={`mailto:${site.email}?subject=Studio%20appointment`} className="mono flex h-12 w-fit items-center rounded-full bg-acid px-6 text-ink">
                Book a fitting →
              </a>
              <p className="mono text-porcelain/50">{site.address.join(" · ")}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
