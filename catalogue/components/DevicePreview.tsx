"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { shots, type Template } from "@/lib/templates";

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/**
 * A browser window and a phone, each scrolling slowly through the template's
 * real pages (one long screenshot moved with a transform). They roll only
 * while on screen. Pointing at a screen pauses it; on touch screens a tap
 * pauses and resumes.
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
    <div ref={ref} className="dp relative pb-[16%] sm:pb-[9%]">
      <div className="dp-laptop mr-[12%] overflow-hidden rounded-xl border border-white/10 bg-raised shadow-[0_50px_100px_-40px_rgb(0_0_0/0.9)] sm:mr-[9%] md:rounded-2xl">
        <div className="flex h-9 items-center gap-3 border-b border-white/10 px-3.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
          </span>
          <span className="label truncate text-[0.66rem] normal-case tracking-normal text-faint">{host(t.url)}</span>
        </div>
        <button
          type="button"
          onClick={() => toggle("laptop")}
          aria-label={held === "laptop" ? `Resume the ${t.name} preview` : `Pause the ${t.name} preview`}
          className="group relative block aspect-[16/10] w-full overflow-hidden bg-white [container-type:size]"
        >
          <Image
            src={s.desktopFull.src}
            width={s.desktopFull.width}
            height={s.desktopFull.height}
            alt={`The ${t.name} website on a laptop`}
            sizes="(min-width: 1024px) 960px, 90vw"
            className={`roll block h-auto w-full group-hover:[animation-play-state:paused] ${held === "laptop" ? "is-off" : ""}`}
            style={{ "--roll-time": pace(s.desktopFull, 16 / 10) } as CSSProperties}
          />
        </button>
      </div>

      <div className="dp-phone absolute bottom-0 right-0 w-[30%] sm:w-[21%]">
        <div className="rounded-[1.6rem] border border-white/15 bg-[#0d0d0d] p-[4.5%] shadow-[0_40px_70px_-24px_rgb(0_0_0/0.95)]">
          <button
            type="button"
            onClick={() => toggle("phone")}
            aria-label={held === "phone" ? `Resume the ${t.name} phone preview` : `Pause the ${t.name} phone preview`}
            className="group relative block aspect-[390/844] w-full overflow-hidden rounded-[1.15rem] bg-white [container-type:size]"
          >
            <Image
              src={s.mobileFull.src}
              width={s.mobileFull.width}
              height={s.mobileFull.height}
              alt={`The ${t.name} website on a phone`}
              sizes="(min-width: 1024px) 18vw, 30vw"
              className={`roll block h-auto w-full group-hover:[animation-play-state:paused] ${held === "phone" ? "is-off" : ""}`}
              style={{ "--roll-time": pace(s.mobileFull, 390 / 844) } as CSSProperties}
            />
            <span aria-hidden className="absolute left-1/2 top-[1.8%] h-[2.6%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
