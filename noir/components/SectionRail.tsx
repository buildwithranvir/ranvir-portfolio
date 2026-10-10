"use client";

import { useState } from "react";
import { nav } from "@/lib/site";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { AnchorLink } from "./ui/AnchorLink";

const items = [...nav, { label: "Book", href: "#book" as const }];

/** A frosted rail on the right edge that follows you through the page. Wide screens only. */
export function SectionRail() {
  const [active, setActive] = useState(-1);

  useGSAP(() => {
    items.forEach((it, i) => {
      ScrollTrigger.create({
        trigger: it.href,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
          else if (i === 0 && self.direction < 0) setActive(-1);
        },
      });
    });
  });

  return (
    <nav
      aria-label="Sections"
      className={`glass fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 rounded-full px-2 py-3 transition-opacity duration-700 xl:flex ${active < 0 ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      {items.map((it, i) => (
        <AnchorLink key={it.href} href={it.href} className="group relative flex h-7 w-7 items-center justify-center" aria-current={i === active ? "true" : undefined}>
          <span className={`block rounded-full transition-all duration-500 ${i === active ? "h-2.5 w-2.5 bg-burgundy" : "h-1.5 w-1.5 bg-ink/35 group-hover:bg-ink"}`} />
          <span className="glass pointer-events-none absolute right-10 whitespace-nowrap rounded-full px-3 py-1 text-[0.75rem] opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100 group-focus-visible:opacity-100">
            {it.label}
          </span>
        </AnchorLink>
      ))}
    </nav>
  );
}
