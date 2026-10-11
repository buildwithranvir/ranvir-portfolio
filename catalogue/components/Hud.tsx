"use client";

import { useRef, useSyncExternalStore } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { afterLoad } from "@/lib/loader";
import { getRoom, getServerRoom, subscribeRoom } from "@/lib/room";
import { scrollToHash } from "@/lib/scroll";
import { code, templates } from "@/lib/templates";

/** The bottom bar: which template you are looking at, and a dot for each one. */
export function Hud() {
  const ref = useRef<HTMLDivElement>(null);
  const room = useSyncExternalStore(subscribeRoom, getRoom, getServerRoom);
  const t = room >= 0 ? templates[room] : null;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(ref.current, { y: 24, opacity: 0 });
        return afterLoad(() => gsap.to(ref.current, { y: 0, opacity: 1, duration: 1, ease: "expo.out", delay: 0.6 }));
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="pointer-events-none fixed inset-x-0 bottom-0 z-[80]">
      <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-3 px-4 pb-3 md:px-8 md:pb-4">
        <p className="pointer-events-auto flex h-10 min-w-0 items-center gap-2.5 rounded-full bg-card px-4 shadow-[0_10px_30px_-16px_rgb(21_19_16/0.6)] ring-1 ring-ink/10">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full transition-colors duration-500" style={{ background: t ? t.colors.paint : "var(--color-tomato)" }} />
          <span className="mono truncate text-[0.68rem]">{t ? `${code(room)} · ${t.name}` : "Ranvir's Templates"}</span>
        </p>
        <nav aria-label="Templates" className="pointer-events-auto flex h-10 items-center gap-0.5 rounded-full bg-card px-1.5 shadow-[0_10px_30px_-16px_rgb(21_19_16/0.6)] ring-1 ring-ink/10">
          {templates.map((x, i) => (
            <button
              key={x.id}
              type="button"
              onClick={() => scrollToHash(`#${x.id}`)}
              aria-label={`Go to ${x.name}`}
              aria-current={i === room ? "true" : undefined}
              className="grid h-8 w-7 place-items-center"
            >
              <span
                className="block h-3 rounded-full ring-1 ring-ink/20 transition-[width] duration-500 ease-out-expo"
                style={{ background: x.colors.paint, width: i === room ? 22 : 12 }}
              />
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
