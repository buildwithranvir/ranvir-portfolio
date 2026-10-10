"use client";

import { useRef } from "react";
import { projects, sceneNo, studio } from "@/lib/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Mark } from "@/components/ui/Mark";

const ask = (name: string) =>
  `https://wa.me/${studio.phoneHref.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi Ranvir, could you walk me through the ${name} project?`)}`;

/**
 * Client work, set out as a simple schedule. Rows are slated in one by one; each links to the live site
 * (or, while a link isn't public, offers a walkthrough).
 */
export function Offscreen() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".os-head > *", {
          y: 30,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "clamp(top 78%)", once: true },
        });
        // each row is "slated": a bar sweeps across, then the row is printed
        gsap.utils.toArray<HTMLElement>(".os-row").forEach((row) => {
          gsap
            .timeline({ scrollTrigger: { trigger: row, start: "clamp(top 90%)", once: true } })
            .fromTo(row.querySelector(".os-slate"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.45, ease: "power3.in" })
            .set(row.querySelector(".os-body"), { opacity: 1 })
            .to(row.querySelector(".os-slate"), { scaleX: 0, transformOrigin: "100% 50%", duration: 0.5, ease: "power3.out" });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="offscreen" aria-labelledby="offscreen-title" className="wash tone-mint bg-paper py-20 text-ink md:py-28">
      <div className="frame">
        <div className="os-head grid grid-cols-1 gap-6 text-center md:grid-cols-12 md:items-end md:text-left">
          <div className="md:col-span-7">
            <p className="hud text-smoke">{sceneNo("offscreen")} — Client work</p>
            <h2 id="offscreen-title" className="voice mt-5 text-[clamp(1.98rem,3.78vw,3.6rem)] leading-[1]">
              The work that{" "}
              <Mark kind="circle" tone="coral">
                <span className="credit not-italic [--w:100]">ships</span>
              </Mark>{" "}
              for clients.
            </h2>
          </div>
          <p className="mx-auto max-w-[38ch] text-[1.0625rem] leading-relaxed text-ink/75 md:col-span-4 md:col-start-9 md:mx-0">
            Projects built for real clients, live on the web. Open any of them — or ask me to walk you through how it was built.
          </p>
        </div>

        <div className="mt-14 md:mt-20">
          <div className="hud hidden grid-cols-12 gap-4 border-b border-ink pb-3 text-smoke md:grid">
            <span className="col-span-1">No.</span>
            <span className="col-span-4">Project</span>
            <span className="col-span-4">About</span>
            <span className="col-span-3 text-right">Link</span>
          </div>
          <ol>
            {projects.map((p, i) => (
              <li key={p.id} className="os-row relative border-b border-ink/20">
                <span aria-hidden className="os-slate pointer-events-none absolute inset-0 z-10 bg-ink" style={{ transform: "scaleX(0)" }} />
                <div className="os-body grid grid-cols-1 gap-3 py-7 md:grid-cols-12 md:items-baseline md:gap-4 md:py-9 [html.js_&]:opacity-0 motion-reduce:!opacity-100">
                  <span className="hud text-smoke md:col-span-1">0{i + 1}</span>
                  <div className="md:col-span-4">
                    <h3 className="credit text-[clamp(1.62rem,2.7vw,2.52rem)] [--w:96]">{p.name}</h3>
                    <p className="hud mt-2 text-rec">{p.kind}</p>
                  </div>
                  <p className="text-[1.0625rem] leading-relaxed text-ink/80 md:col-span-4">{p.summary}</p>
                  <div className="md:col-span-3 md:text-right">
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        data-frame-hover
                        className="group inline-flex flex-col items-start gap-1.5 md:items-end"
                        aria-label={`Visit ${p.name} live (new tab)`}
                      >
                        <span className="hud inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-paper transition-colors group-hover:bg-rec">
                          View it live
                          <span aria-hidden className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                            ↗
                          </span>
                        </span>
                        <span className="hud text-smoke">{new URL(p.url).hostname.replace(/^www\./, "")}</span>
                      </a>
                    ) : (
                      <a
                        href={ask(p.name)}
                        target="_blank"
                        rel="noreferrer"
                        data-frame-hover
                        className="hud inline-flex h-10 items-center gap-2 rounded-full border border-ink/30 px-4 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        Ask for a walkthrough →
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
