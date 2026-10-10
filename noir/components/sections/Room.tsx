"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { room } from "@/lib/content";
import { Drift, Photo } from "../motion/Reveal";
import { Eyebrow } from "../ui/Eyebrow";

export function Room() {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const x = useMotionValue(0);
  const [min, setMin] = useState(0);
  const progress = useTransform(x, (v) => (min ? Math.min(1, Math.max(0, v / min)) : 0));

  useEffect(() => {
    const measure = () => {
      if (!viewport.current || !track.current) return;
      const m = Math.min(0, viewport.current.offsetWidth - track.current.scrollWidth);
      setMin(m);
      if (x.get() < m) x.set(m);
    };
    const ro = new ResizeObserver(measure);
    if (viewport.current) ro.observe(viewport.current);
    if (track.current) ro.observe(track.current);
    return () => ro.disconnect();
  }, [x]);

  const step = (dir: 1 | -1) => {
    const w = viewport.current ? viewport.current.offsetWidth * 0.6 : 400;
    animate(x, Math.max(min, Math.min(0, x.get() - dir * w)), { type: "spring", stiffness: 80, damping: 22 });
  };

  return (
    <section id="room" aria-labelledby="room-title" className="panel relative mx-2 overflow-hidden rounded-[24px] bg-ink py-28 text-milk md:mx-4 md:rounded-[28px] md:py-36">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="relative lg:col-span-6">
          <Photo src={room.lead.src} alt={room.lead.alt} sizes="(min-width: 1024px) 46vw, 100vw" className="aspect-[4/3] !bg-ink-soft">
            {/* A note from a regular, on frosted glass over the room */}
            <div className="glass float-soft absolute bottom-4 right-4 hidden w-[15rem] rounded-[14px] px-5 py-4 text-ink md:block">
              <p className="note !text-[1.4rem]">&ldquo;{room.quotes[0].text}&rdquo;</p>
              <p className="label mt-2 text-[0.5625rem] text-ink-soft">{room.quotes[0].who}</p>
            </div>
          </Photo>
        </div>

        <div className="flex flex-col justify-end lg:col-span-5 lg:col-start-8">
          <Eyebrow n="04" tone="light">The room</Eyebrow>
          <Drift as="h2" id="room-title" className="mt-6 text-[clamp(2rem,3.2vw,2.9rem)] leading-[1.06]">
            Forty seats, one long oak table, and nobody in a hurry.
          </Drift>
          <Drift className="mt-6 text-milk/70">
            Laptops are welcome before eleven, dogs always. On Fridays the record player comes out and the music gets a
            little louder after four.
          </Drift>
          <blockquote className="glass-dark mt-10 rounded-[16px] px-5 py-4">
            <p className="note !text-oat">&ldquo;{room.quotes[1].text}&rdquo;</p>
            <footer className="label mt-2 text-milk/50">{room.quotes[1].who}</footer>
          </blockquote>
        </div>
      </div>

      {/* Draggable strip: fixed height, natural widths, so nothing gets cropped */}
      <div className="wrap mt-20 flex items-center justify-between md:mt-28">
        <p className="label text-milk/50">More of the room — drag, or use the arrows</p>
        <div className="flex items-center gap-2">
          <div className="mr-3 hidden h-px w-32 bg-milk/20 sm:block" aria-hidden>
            <motion.div className="h-px origin-left bg-milk" style={{ scaleX: progress }} />
          </div>
          <button type="button" onClick={() => step(-1)} aria-label="Previous photos" className="glass-dark flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-milk hover:text-ink">
            ←
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Next photos" className="glass-dark flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-milk hover:text-ink">
            →
          </button>
        </div>
      </div>
      <div ref={viewport} data-cursor="Drag" className="mt-6 cursor-grab overflow-hidden active:cursor-grabbing">
        <motion.ul
          ref={track}
          aria-label="Photographs of the café"
          className="flex w-max gap-4 px-5 md:px-10"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: min, right: 0 }}
          dragElastic={0.06}
        >
          {room.strip.map((p) => (
            <li key={p.alt} className="photo shrink-0 !rounded-[14px] !bg-ink-soft">
              <Image
                src={p.src}
                alt={p.alt}
                placeholder="blur"
                draggable={false}
                sizes="480px"
                className="pointer-events-none h-[200px] w-auto select-none md:h-[260px]"
              />
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
