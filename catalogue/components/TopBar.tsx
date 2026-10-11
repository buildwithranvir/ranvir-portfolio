"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { afterLoad } from "@/lib/loader";
import { site, whatsapp } from "@/lib/site";
import { AnchorLink } from "./ui/AnchorLink";

/** A tiny fan of three chips, the site's mark. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <g transform="translate(16 27)">
        <rect x="-5" y="-22" width="10" height="20" rx="2" fill="#1F4FD8" transform="rotate(-24)" />
        <rect x="-5" y="-22" width="10" height="20" rx="2" fill="#F6C12E" transform="rotate(24)" />
        <rect x="-5" y="-23" width="10" height="21" rx="2" fill="#F2542D" />
        <rect x="-5" y="-8" width="10" height="6" rx="1" fill="#FBF8F2" />
        <circle r="1.4" cy="-4.6" fill="#151310" />
      </g>
    </svg>
  );
}

/** The bar across the top: the wordmark, a link back to the portfolio, and a chat button. */
export function TopBar() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(".tb-part", { y: -16, opacity: 0 });
        return afterLoad(() => gsap.to(".tb-part", { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.25 }));
      });
    },
    { scope: ref },
  );

  return (
    <header ref={ref} className="pointer-events-none fixed inset-x-0 top-0 z-[80]">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 md:h-20 md:px-8">
        <AnchorLink
          href="#top"
          className="tb-part pointer-events-auto flex h-11 items-center gap-2 rounded-full bg-card py-1 pl-1.5 pr-4 shadow-[0_10px_30px_-18px_rgb(21_19_16/0.6)] ring-1 ring-ink/10"
        >
          <Mark className="h-8 w-8" />
          <span className="display text-[1.35rem] leading-none">Ranvir&rsquo;s Templates</span>
        </AnchorLink>
        <div className="flex items-center gap-2">
          <a
            href={site.portfolio}
            target="_blank"
            rel="noreferrer"
            className="tb-part btn pointer-events-auto hidden h-11 bg-card shadow-[0_10px_30px_-18px_rgb(21_19_16/0.6)] ring-1 ring-ink/10 sm:inline-flex"
          >
            Portfolio <span aria-hidden>↗</span>
          </a>
          <a
            href={whatsapp()}
            target="_blank"
            rel="noreferrer"
            className="tb-part btn pointer-events-auto h-11 bg-ink px-4 text-card shadow-[0_10px_30px_-14px_rgb(21_19_16/0.7)] ring-1 ring-card/25"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-tomato opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-tomato" />
            </span>
            Chat
          </a>
        </div>
      </div>
    </header>
  );
}
