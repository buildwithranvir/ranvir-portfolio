"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { menu, menuPhotos } from "@/lib/content";
import { Drift, Photo } from "../motion/Reveal";
import { Eyebrow } from "../ui/Eyebrow";

const ease = [0.45, 0.05, 0.25, 1] as const;

/** The menu as a printed card on the counter, with pencil notes from the staff. */
export function Menu() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const section = menu[active];

  const onKeyDown = (e: KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (active + dir + menu.length) % menu.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative overflow-x-clip py-28 md:py-36">
      <div aria-hidden className="glow right-[8%] top-40 h-[26rem] w-[26rem] bg-oat" />
      <div aria-hidden className="glow left-[30%] bottom-10 h-[18rem] w-[18rem] bg-olive-soft/50" />
      <div className="wrap relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Eyebrow n="03">The menu</Eyebrow>
          <Drift as="h2" id="menu-title" className="mt-6 text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]">
            The menu, as it&rsquo;s printed on the counter.
          </Drift>
          <Drift className="mt-5 max-w-[34ch] text-ink-soft">
            Short on purpose. Plant milks cost nothing extra, and anything from the oven can be warmed up.
          </Drift>
          <figure className="mt-10 hidden lg:block">
            <Photo src={menuPhotos.side.src} alt={menuPhotos.side.alt} sizes="22vw" className="aspect-[4/5] w-[68%]">
              <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1 text-[0.75rem]">Cold brew · €4.20</span>
            </Photo>
            <figcaption className="note mt-3 -rotate-2">cold brew season isn&rsquo;t over yet →</figcaption>
          </figure>
        </div>

        <div className="lg:col-span-8">
          {/* Frosted segmented control; the ink pill slides to the chosen section */}
          <div role="tablist" aria-label="Menu sections" onKeyDown={onKeyDown} className="glass grid w-full grid-cols-3 gap-1 rounded-full p-1 sm:inline-grid sm:w-auto">
            {menu.map((m, i) => {
              const on = i === active;
              return (
                <button
                  key={m.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${m.id}`}
                  aria-selected={on}
                  aria-controls={`panel-${m.id}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`relative min-h-11 rounded-full px-2 py-2 text-center text-[0.8125rem] leading-tight transition-colors duration-500 sm:px-4 sm:text-[0.875rem] md:px-5 ${on ? "text-milk" : "text-ink-soft hover:text-ink"}`}
                >
                  {on && <motion.span layoutId="menu-pill" aria-hidden className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="relative">{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative mt-5 rounded-[22px] border border-ink/15 bg-milk p-2 shadow-[0_30px_60px_-40px_rgba(34,22,15,0.55)]">
            <div className="rounded-[16px] border border-ink/10 px-5 py-8 md:px-10 md:py-10">
              <header className="flex items-baseline justify-between border-b border-ink/20 pb-4">
                <p className="font-display text-2xl">Noir</p>
                <p className="label text-ink-soft">Served 07:00 to close</p>
              </header>

              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={section.id}
                  role="tabpanel"
                  id={`panel-${section.id}`}
                  aria-labelledby={`tab-${section.id}`}
                  initial="hide"
                  animate="show"
                  exit="hide"
                  variants={{ show: { transition: { staggerChildren: 0.06 } }, hide: { transition: { duration: 0.2 } } }}
                  className="mt-4"
                >
                  {section.items.map((item) => (
                    <motion.li
                      key={item.name}
                      variants={{ hide: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.5, ease }}
                      className="relative py-3.5"
                    >
                      <div className="flex items-baseline gap-3">
                        <h3 className="text-[1.3rem] leading-tight md:text-[1.4rem]">{item.name}</h3>
                        <span aria-hidden className="dots" />
                        <span className="tabular-nums">
                          <span className="sr-only">€</span>
                          {item.price === "0.00" ? "free" : item.price}
                        </span>
                      </div>
                      <p className="text-[0.875rem] text-ink-soft">{item.detail}</p>
                      {item.note && (
                        <span className="note pointer-events-none absolute -top-1 right-16 hidden rotate-[-4deg] text-[1.35rem] sm:block md:right-24">
                          ↙ {item.note}
                        </span>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>

              <footer className="mt-6 flex flex-col gap-2 border-t border-ink/20 pt-4 text-[0.8125rem] text-ink-soft sm:flex-row sm:justify-between">
                <span>Prices in euro. Demo menu, not a real price list.</span>
                <span>Allergies? Ask us, we know every ingredient.</span>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
