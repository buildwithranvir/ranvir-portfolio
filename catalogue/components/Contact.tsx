"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";
import { brands } from "@/lib/brands";
import { magnetic, reveal } from "@/lib/reveal";
import { site, wantThis, whatsapp } from "@/lib/site";
import { templates } from "@/lib/templates";
import { Mark } from "./Nav";

const names = templates.map((t) => t.name);
const brandList = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];

/** The close: one clear invitation, the ways to reach Ranvir, and the footer. */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      reveal(ref.current!);
      magnetic(ref.current!);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pt-28 md:pt-44">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-30vmax] left-1/2 -z-10 h-[80vmax] w-[80vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(255_91_46/0.09),transparent_60%)]"
      />
      <div className="wrap">
        <p data-fade className="label text-muted">
          Contact
        </p>
        <h2 id="contact-title" data-split className="h-display mt-4 text-[clamp(3rem,10vw,9.5rem)]">
          Pick one. I&rsquo;ll make it <span className="serif text-accent">yours.</span>
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p data-fade className="max-w-[42ch] text-[1.1rem] leading-relaxed text-muted md:text-[1.2rem]">
              Tell me which template you like and a little about your business. I read and answer every message myself.
            </p>
            <div data-fade className="mt-8 flex flex-wrap gap-3">
              <a href={whatsapp()} target="_blank" rel="noreferrer" data-magnetic className="btn btn-accent">
                Message on WhatsApp <span aria-hidden>↗</span>
              </a>
              <a href={site.phoneHref} data-magnetic className="btn btn-ghost">
                Call {site.phone}
              </a>
              <a href={`mailto:${site.email}`} data-magnetic className="btn btn-ghost">
                Email
              </a>
            </div>
          </div>
          <div data-fade className="lg:col-span-5 lg:col-start-8">
            <p className="label text-faint">Or ask about one</p>
            <ul className="mt-3 border-t border-white/10">
              {templates.map((t) => (
                <li key={t.id} className="border-b border-white/10">
                  <a
                    href={wantThis(t.name)}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Ask about ${t.name} on WhatsApp`}
                    className="group flex items-center justify-between py-4"
                  >
                    <span className="text-[1.15rem] font-medium tracking-[-0.02em]">
                      {t.name} <span className="ml-2 text-[0.95rem] font-normal text-muted">{t.industry}</span>
                    </span>
                    <span aria-hidden className="text-muted transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:text-accent">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="mt-28 flex flex-col gap-8 border-t border-white/10 py-10 md:mt-40 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[56ch]">
            <p className="flex items-center gap-2.5">
              <Mark className="h-7 w-7 text-fg" />
              <span className="font-semibold tracking-[-0.02em]">Ranvir&rsquo;s Templates</span>
            </p>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-faint">
              © {new Date().getFullYear()} {site.owner}. Designed and built in Delhi. {brandList} are fictional brands, designed as website
              templates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a href={site.portfolio} target="_blank" rel="noreferrer" className="btn btn-ghost h-11 text-[0.9rem]">
              Portfolio <span aria-hidden>↗</span>
            </a>
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${s.label} (opens in a new tab)`}
                className="group grid h-11 w-11 place-items-center rounded-full border border-white/15 transition-colors hover:border-white/50"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-[1.05rem] w-[1.05rem] fill-muted transition-colors group-hover:fill-fg">
                  <path d={brands[s.label].path} />
                </svg>
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
