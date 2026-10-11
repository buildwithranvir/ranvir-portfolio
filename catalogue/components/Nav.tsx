"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { afterLoad } from "@/lib/loader";
import { getLenis, scrollToHash } from "@/lib/scroll";
import { site, whatsapp } from "@/lib/site";
import { magnetic } from "@/lib/reveal";

const links = [
  { href: "#templates", label: "Templates" },
  { href: "#how", label: "How it works" },
  { href: "#contact", label: "Contact" },
];

/** Three overlapping frames: the site's mark. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden className={className}>
      <rect x="1.5" y="1.5" width="17" height="13" rx="2.5" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <rect x="5.5" y="6.5" width="17" height="13" rx="2.5" fill="none" stroke="currentColor" strokeOpacity="0.65" strokeWidth="1.5" />
      <rect x="9.5" y="11.5" width="17" height="13" rx="2.5" fill="#FF5B2E" />
    </svg>
  );
}

/** The bar across the top. On phones the links move into a full-screen menu. */
export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useGSAP(
    () => {
      magnetic(ref.current!);
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(".nv-in", { y: -14, opacity: 0 });
        return afterLoad(() => gsap.to(".nv-in", { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.06, delay: 0.35 }));
      });
    },
    { scope: ref },
  );

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // the phone menu holds the page still while it is open
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToHash(href));
  };

  return (
    <header ref={ref} className="fixed inset-x-0 top-0 z-[80]">
      <div className={`border-b transition-colors duration-500 ${scrolled ? "border-white/10 bg-bg/85" : "border-transparent bg-transparent"}`}>
        <nav className="wrap flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("#top");
            }}
            className="nv-in -my-2 flex items-center gap-2.5 py-2"
          >
            <Mark className="h-7 w-7 text-fg" />
            <span className="text-[1rem] font-semibold tracking-[-0.02em]">Ranvir&rsquo;s Templates</span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.href} className="nv-in">
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.href);
                  }}
                  className="-my-3 inline-block py-3 text-[0.95rem] text-muted transition-colors hover:text-fg"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="nv-in">
              <a href={site.portfolio} target="_blank" rel="noreferrer" className="-my-3 inline-block py-3 text-[0.95rem] text-muted transition-colors hover:text-fg">
                Portfolio <span aria-hidden>↗</span>
              </a>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <a href={whatsapp()} target="_blank" rel="noreferrer" data-magnetic className="nv-in btn btn-accent hidden h-10 px-5 text-[0.9rem] sm:inline-flex">
              Start a project
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="menu"
              className="nv-in btn btn-ghost h-10 px-4 text-[0.9rem] lg:hidden"
            >
              Menu
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            data-lenis-prevent
            className="fixed inset-0 z-[90] flex flex-col bg-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35 }}
          >
            <div className="wrap flex h-16 items-center justify-between">
              <span className="flex items-center gap-2.5">
                <Mark className="h-7 w-7 text-fg" />
                <span className="text-[1rem] font-semibold tracking-[-0.02em]">Ranvir&rsquo;s Templates</span>
              </span>
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost h-10 px-4 text-[0.9rem]" autoFocus>
                Close
              </button>
            </div>
            <ul className="wrap mt-10 flex-1">
              {[...links, { href: site.portfolio, label: "Portfolio" }].map((l, i) => (
                <motion.li
                  key={l.href}
                  className="border-b border-white/10"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 + i * 0.05 }}
                >
                  {l.href.startsWith("#") ? (
                    <a
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault();
                        go(l.href);
                      }}
                      className="flex items-baseline justify-between py-5 text-[2.4rem] font-semibold tracking-[-0.04em]"
                    >
                      {l.label}
                      <span className="label text-muted">0{i + 1}</span>
                    </a>
                  ) : (
                    <a href={l.href} target="_blank" rel="noreferrer" className="flex items-baseline justify-between py-5 text-[2.4rem] font-semibold tracking-[-0.04em]">
                      {l.label}
                      <span aria-hidden className="text-[1.4rem] text-muted">
                        ↗
                      </span>
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
            <div className="wrap pb-8">
              <a href={whatsapp()} target="_blank" rel="noreferrer" className="btn btn-accent w-full">
                Start a project on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
