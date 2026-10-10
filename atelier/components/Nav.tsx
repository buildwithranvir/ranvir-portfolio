"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/lib/site";
import { getLenis } from "@/lib/scroll";
import { gsap, useGSAP } from "@/lib/gsap";
import { AnchorLink } from "./ui/AnchorLink";

const fold = [0.7, 0, 0.2, 1] as const;

/** The practice's mark: a square sheet with one corner folded over. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={className}>
      <path d="M3 3h26v16L19 29H3z" className="fill-ink" />
      <path d="M29 19H19v10z" className="fill-ochre" />
      <path d="M8 23V13a5 5 0 0 1 10 0v10" className="fill-none stroke-paper" strokeWidth={2} />
    </svg>
  );
}

/**
 * A slim drawing-board header. Its bottom edge is a scale bar (0 — 10 — 20 m)
 * that fills in cobalt as you scroll down the page.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(".scale-fill", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.4 } });
    },
    { scope: ref },
  );

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
    <header ref={ref} className="fixed inset-x-0 top-0 z-50">
      <div className="bg-plaster/88 backdrop-blur-[6px]">
        <nav aria-label="Main" className="sheet flex h-16 items-center justify-between gap-4">
          <AnchorLink href="#top" onClick={() => setOpen(false)} className="group flex items-center gap-3" aria-label={`${site.fullName}, back to top`}>
            <span className="fold-stage">
              <Logo className="block h-8 w-8 transition-transform duration-700 ease-out-expo group-hover:[transform:rotateY(180deg)]" />
            </span>
            <span className="display whitespace-nowrap text-[0.95rem] tracking-[-0.02em] min-[380px]:text-[1.05rem]">
              Morrow <span className="serif text-[1.15em] text-rust">&amp;</span> Vale
            </span>
          </AnchorLink>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((l, i) => (
              <li key={l.href}>
                <AnchorLink href={l.href} className="group flex items-baseline gap-1.5 px-3 py-2 text-[0.9375rem] transition-colors hover:text-cobalt">
                  <span className="label text-ink/50 transition-colors group-hover:text-cobalt">{String(i + 1).padStart(2, "0")}</span>
                  <span className="draw-link">{l.label}</span>
                </AnchorLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <AnchorLink
              href="#contact"
              className="label hidden h-10 items-center bg-rust px-4 text-paper transition-colors duration-300 [clip-path:polygon(0_0,100%_0,100%_68%,calc(100%-12px)_100%,0_100%)] hover:bg-ink sm:flex"
            >
              Start a brief →
            </AnchorLink>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="atelier-menu"
              className="label flex h-10 items-center gap-2 px-2 lg:hidden"
            >
              <span aria-hidden className="relative block h-2.5 w-5">
                <span className={`absolute left-0 top-0 h-[1.5px] w-5 bg-current transition-transform duration-500 ${open ? "translate-y-[4.5px] rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-[1.5px] w-5 bg-current transition-transform duration-500 ${open ? "-translate-y-[4.5px] -rotate-45" : ""}`} />
              </span>
              {open ? "Close" : "Index"}
            </button>
          </div>
        </nav>
      </div>

      {/* Scale bar / reading progress */}
      <div aria-hidden className="relative h-[5px] bg-plaster/88">
        <div className="absolute inset-0 [background:repeating-linear-gradient(90deg,rgb(23_24_43/0.75)_0_40px,transparent_40px_80px)] opacity-30" />
        <div className="scale-fill absolute inset-0 origin-left bg-cobalt" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="atelier-menu"
            data-lenis-prevent
            className="fixed inset-0 -z-10 overflow-y-auto bg-ochre px-5 pb-10 pt-28 text-ink md:px-10 lg:hidden [@media(max-height:560px)]:pt-24"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.7, ease: fold }}
          >
            <motion.ul
              className="fold-stage"
              initial="hide"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
            >
              {nav.map((l, i) => (
                <motion.li
                  key={l.href}
                  variants={{ hide: { rotateX: -90, opacity: 0 }, show: { rotateX: 0, opacity: 1 } }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "50% 0%" }}
                  className="border-b border-ink/20"
                >
                  <AnchorLink
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="display flex items-baseline justify-between py-4 text-[clamp(2.4rem,11vw,4.5rem)] [@media(max-height:560px)]:py-2 [@media(max-height:560px)]:text-[2rem]"
                  >
                    {l.label}
                    <span className="label text-ink/60">{String(i + 1).padStart(2, "0")}</span>
                  </AnchorLink>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }} className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <AnchorLink href="#contact" onClick={() => setOpen(false)} className="label flex h-12 w-fit items-center bg-ink px-6 text-paper">
                Start a project brief →
              </AnchorLink>
              <p className="label text-ink/70">{site.address.join(" · ")}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
