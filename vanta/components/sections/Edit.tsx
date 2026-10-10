"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { collections, products } from "@/lib/content";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Lines, Stretch } from "../motion/Reveal";
import { useShop } from "../ShopContext";

const snap = [0.76, 0, 0.24, 1] as const;
export const formatPrice = (n: number) => `€${n.toLocaleString("en-US")}`;

/**
 * The Edit as a catalogue index. Pointing at a row stretches the name wide and
 * a print of the piece follows the cursor, leaning with its movement. Touch
 * screens get a thumbnail in every row instead.
 */
export function Edit() {
  const { filter, setFilter, openQuickView } = useShop();
  const visible = products.filter((p) => filter === "All" || p.collection === filter);
  const [hover, setHover] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (pointer: fine) and (min-width: 1024px)`, () => {
        const el = preview.current!;
        gsap.set(el, { scale: 0.7 });
        const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
        const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
        const r = gsap.quickTo(el, "rotate", { duration: 0.8, ease: "power3.out" });
        let lastX = 0;
        const list = ref.current!.querySelector<HTMLElement>(".edit-list")!;
        const move = contextSafe!((e: PointerEvent) => {
          x(e.clientX);
          y(e.clientY);
          r(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
          lastX = e.clientX;
        });
        const enter = contextSafe!((e: PointerEvent) => {
          gsap.set(el, { x: e.clientX, y: e.clientY });
          lastX = e.clientX;
          gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" });
        });
        const leave = contextSafe!(() => gsap.to(el, { autoAlpha: 0, scale: 0.7, duration: 0.4, ease: "power3.in" }));
        list.addEventListener("pointermove", move);
        list.addEventListener("pointerenter", enter);
        list.addEventListener("pointerleave", leave);
        return () => {
          list.removeEventListener("pointermove", move);
          list.removeEventListener("pointerenter", enter);
          list.removeEventListener("pointerleave", leave);
        };
      });
      mm.add(MOTION_OK, () => {
        gsap.from(".edit-row", { y: 18, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: ".edit-list", start: "top 85%", once: true } });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="edit" data-theme="light" aria-labelledby="edit-title" className="relative py-24 md:py-36">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="mono text-fg/60">04 / The Edit</p>
            <Stretch id="edit-title" width={135} className="mt-4 text-[clamp(3.6rem,11vw,10.5rem)]">
              The <span className="serif-i normal-case">edit</span>
            </Stretch>
          </div>
          <Lines className="max-w-[36ch] text-[1.0625rem] leading-relaxed text-fg/75 lg:col-span-4">
            Nine pieces chosen by the studio from three issues. Everything here is still made, in the same workshops, to order.
          </Lines>
        </div>

        {/* Collection filter */}
        <div role="radiogroup" aria-label="Filter by collection" className="mt-12 flex flex-wrap gap-2">
          {collections.map((c) => {
            const on = c === filter;
            const count = c === "All" ? products.length : products.filter((p) => p.collection === c).length;
            return (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setFilter(c)}
                className={`relative h-11 rounded-full border px-4 text-[0.9375rem] transition-colors duration-300 ${on ? "border-transparent text-ink" : "border-fg/20 text-fg/70 hover:border-fg/60 hover:text-fg"}`}
              >
                {on && <motion.span layoutId="edit-pill" aria-hidden className="absolute inset-0 rounded-full bg-acid" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">
                  {c} <sup className="mono text-[0.5625rem] opacity-60">{count}</sup>
                </span>
              </button>
            );
          })}
        </div>

        <ol aria-live="polite" className="edit-list mt-8 border-t border-fg/20" data-cursor="View">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((p, i) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: snap }}
                className="overflow-hidden border-b border-fg/20"
              >
                <button
                  type="button"
                  onPointerEnter={() => setHover(p.id)}
                  onFocus={() => setHover(p.id)}
                  onClick={() => openQuickView(p)}
                  aria-label={`${p.name}, ${formatPrice(p.price)}. Open details`}
                  className="edit-row group relative grid w-full grid-cols-[4rem_1fr_auto] items-center gap-4 py-4 text-left md:grid-cols-[3rem_1fr_12rem_6rem_2rem] md:py-6"
                >
                  {/* hover wash */}
                  <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-fg/[0.04] transition-transform duration-500 ease-out-expo group-hover:scale-y-100" />
                  <span className="relative block aspect-[4/5] w-16 overflow-hidden rounded-[3px] bg-bone lg:hidden pointer-coarse:block">
                    <Image src={p.image.src} alt="" fill sizes="64px" className="grade object-cover" />
                  </span>
                  <span className="mono relative hidden text-fg/40 lg:block pointer-coarse:hidden">{String(i + 1).padStart(2, "0")}</span>
                  <span className="relative">
                    <span className="display block text-[clamp(1.5rem,3.8vw,3rem)] [--w:68] transition-[font-variation-settings,color] duration-700 ease-out-expo group-hover:[--w:108] group-focus-visible:[--w:108]">
                      {p.name}
                    </span>
                    <span className="mono mt-1 block text-fg/50 md:hidden">{p.collection}</span>
                  </span>
                  <span className="serif-i relative hidden text-[1.15rem] text-fg/70 md:block">{p.collection}</span>
                  <span className="mono relative text-right text-[0.8125rem] tabular-nums md:text-[0.875rem]">{formatPrice(p.price)}</span>
                  <span aria-hidden className="relative hidden h-8 w-8 place-items-center rounded-full border border-fg/25 transition-all duration-500 group-hover:rotate-45 group-hover:border-acid group-hover:bg-acid group-hover:text-ink md:grid">
                    +
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
        <p className="mono mt-6 text-fg/50">Demo storefront: fictional pieces, no checkout. Enquiries open your email.</p>
      </div>

      {/* Cursor-following print (desktop with a mouse) */}
      <div ref={preview} aria-hidden className="pointer-events-none fixed left-0 top-0 z-40 invisible -ml-[8.5rem] -mt-[11rem] hidden w-[17rem] lg:block pointer-coarse:!hidden">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-bone shadow-[0_30px_60px_-30px_rgba(20,15,18,0.6)]">
          {products.map((p) => (
            <Image
              key={p.id}
              src={p.image.src}
              alt=""
              fill
              loading="eager"
              sizes="272px"
              className="grade object-cover transition-[clip-path] duration-500 ease-out-expo"
              style={{ clipPath: hover === p.id ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
