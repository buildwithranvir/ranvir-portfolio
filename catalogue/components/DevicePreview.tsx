"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { shots, type Template } from "@/lib/templates";

/**
 * A laptop and a phone, each scrolling slowly through the template's real
 * pages (one long screenshot moved with a transform). They roll only while on
 * screen. Pointing at a screen pauses it; on touch screens a tap pauses and
 * resumes.
 */
export function DevicePreview({ t }: { t: Template }) {
  const ref = useRef<HTMLDivElement>(null);
  const [held, setHeld] = useState<"laptop" | "phone" | null>(null);
  const s = shots(t);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-off", !e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // seconds per screen of scrolling, so long and short pages move at the same pace
  const pace = (img: { width: number; height: number }, aspect: number) => `${Math.max(18, (img.height / (img.width / aspect)) * 4.2)}s`;
  const toggle = (k: "laptop" | "phone") => setHeld((h) => (h === k ? null : k));

  return (
    <div ref={ref} className="dp relative pb-[12%] sm:pb-[8%]">
      {/* laptop */}
      <div className="dp-laptop relative mr-[14%] sm:mr-[10%]">
        <div className="rounded-[14px] bg-[#1b1a18] p-[1.4%] pb-[2.2%] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.75)] ring-1 ring-white/15">
          <div className="mb-[0.9%] flex justify-center">
            <span className="h-1 w-1 rounded-full bg-white/25" />
          </div>
          <button
            type="button"
            onClick={() => toggle("laptop")}
            aria-label={held === "laptop" ? `Resume the ${t.name} preview` : `Pause the ${t.name} preview`}
            className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[5px] bg-white [container-type:size]"
          >
            <Image
              src={s.desktopFull.src}
              width={s.desktopFull.width}
              height={s.desktopFull.height}
              alt={`The ${t.name} website on a laptop`}
              sizes="(min-width: 1024px) 50vw, 88vw"
              className={`thumb-roll block h-auto w-full group-hover:[animation-play-state:paused] ${held === "laptop" ? "is-off" : ""}`}
              style={{ "--roll-time": pace(s.desktopFull, 16 / 10) } as CSSProperties}
            />
          </button>
        </div>
        <div className="mx-auto h-[0.9vw] min-h-2 w-[112%] -translate-x-[5.4%] rounded-b-[14px] bg-gradient-to-b from-[#3a3733] to-[#1f1d1b] shadow-[0_20px_30px_-20px_rgb(0_0_0/0.8)]" />
      </div>

      {/* phone, leaning on the laptop */}
      <div className="dp-phone absolute bottom-0 right-0 w-[30%] sm:w-[24%]">
        <div className="rounded-[1.4rem] bg-[#111] p-[5%] shadow-[0_30px_60px_-24px_rgb(0_0_0/0.8)] ring-1 ring-white/15">
          <button
            type="button"
            onClick={() => toggle("phone")}
            aria-label={held === "phone" ? `Resume the ${t.name} phone preview` : `Pause the ${t.name} phone preview`}
            className="group relative block aspect-[390/844] w-full overflow-hidden rounded-[1rem] bg-white [container-type:size]"
          >
            <Image
              src={s.mobileFull.src}
              width={s.mobileFull.width}
              height={s.mobileFull.height}
              alt={`The ${t.name} website on a phone`}
              sizes="(min-width: 1024px) 12vw, 30vw"
              className={`thumb-roll block h-auto w-full group-hover:[animation-play-state:paused] ${held === "phone" ? "is-off" : ""}`}
              style={{ "--roll-time": pace(s.mobileFull, 390 / 844) } as CSSProperties}
            />
            <span aria-hidden className="absolute left-1/2 top-[1.6%] h-[2.6%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
          </button>
        </div>
      </div>

      {held && (
        <p className="mono absolute left-0 top-full mt-2 opacity-70">
          Paused · tap again to play
        </p>
      )}
    </div>
  );
}
