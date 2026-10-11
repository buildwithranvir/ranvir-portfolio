"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { reveal } from "@/lib/reveal";
import { site } from "@/lib/site";

const steps = [
  { title: "Choose a template", body: "Browse the templates above, open them live, and pick the one that feels closest to your business." },
  { title: "Send your details", body: "Message me on WhatsApp with what you do, who it is for, and the words and photos you want on the site." },
  { title: "I rebuild it and put it live", body: "I make it yours: your name, colours, content and pages. You check it, and then it goes live." },
];

const included = [
  "Your name, words and photos throughout",
  "Layouts that work on every phone, tablet and laptop",
  "Contact, WhatsApp and enquiry links that reach you",
  "Fast pages and clean, searchable text",
  "Set up and put live on the web",
  "Changes to colours, sections and type to fit your brand",
];

/** How a template becomes your site, and what comes with it. */
export function How() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => void reveal(ref.current!), { scope: ref });

  return (
    <section ref={ref} id="how" aria-labelledby="how-title" className="relative pt-28 md:pt-44">
      <div className="wrap">
        <p data-fade className="label text-muted">
          How it works
        </p>
        <h2 id="how-title" data-split className="h-display mt-4 max-w-[16ch] text-[clamp(2.4rem,6vw,5.5rem)]">
          From template to your site in <span className="serif text-accent">three</span> steps.
        </h2>

        <ol className="mt-14 grid grid-cols-1 gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <li key={s.title} data-fade={i * 0.08} className="border-t border-white/10 pt-6">
              <span className="label text-accent">0{i + 1}</span>
              <h3 className="mt-6 text-[1.6rem] font-semibold leading-tight tracking-[-0.03em] md:text-[1.9rem]">{s.title}</h3>
              <p className="mt-3 max-w-[38ch] text-[1.02rem] leading-relaxed text-muted">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid grid-cols-1 gap-8 rounded-2xl border border-white/10 bg-raised p-6 md:mt-28 md:p-10 lg:grid-cols-12">
          <div data-fade className="lg:col-span-4">
            <p className="label text-muted">Included</p>
            <p className="mt-4 text-[1.5rem] font-semibold leading-tight tracking-[-0.03em]">Everything a business site needs on day one.</p>
          </div>
          <ul data-fade className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:col-span-8">
            {included.map((x) => (
              <li key={x} className="flex gap-3 border-b border-white/10 pb-4 text-[1.02rem] leading-snug">
                <span aria-hidden className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {x}
              </li>
            ))}
          </ul>
        </div>

        <p data-fade className="mt-10 text-[1.05rem] text-muted md:mt-14">
          Not seeing the right one? I also design sites from scratch.{" "}
          <a href={site.portfolio} target="_blank" rel="noreferrer" className="-my-2 inline-block py-2 text-fg underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-accent">
            See my portfolio ↗
          </a>
        </p>
      </div>
    </section>
  );
}
