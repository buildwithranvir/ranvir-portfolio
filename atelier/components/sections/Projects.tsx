"use client";

import { useRef, useState } from "react";
import { projects, type Project } from "@/lib/content";
import { enter, gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { FoldImage, FoldText, Mark, Seam } from "../motion/Fold";
import { ProjectSheet } from "../ProjectSheet";

export const chip: Record<Project["typology"], string> = {
  Residential: "bg-ochre text-ink",
  Cultural: "bg-cobalt text-paper",
  Commercial: "bg-verdigris text-paper",
  Interior: "bg-blush text-ink",
};

const offset = ["", "lg:mt-24", "lg:mt-10", "lg:-mt-6", "lg:mt-16", "lg:mt-2"];

/** Six projects printed on folded cards, then the full schedule. */
export function Projects() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".card-meta", { y: 18, opacity: 0, duration: 0.9, ease: "expo.out", stagger: 0.08, scrollTrigger: enter(".cards", "80%") });
        // The schedule's rows swing down into place like louvres
        gsap.from(".sched-row", {
          rotateX: -90,
          transformOrigin: "50% 0%",
          transformPerspective: 900,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: enter(".sched", "85%"),
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="projects" aria-labelledby="projects-title" className="relative bg-paper pb-24 pt-20 md:pb-32 md:pt-28">
      <Seam className="fill-paper" />
      <div className="sheet">
        <div className="grid gap-8 lg:grid-cols-12">
          <p className="label text-rust lg:col-span-2">01 / Selected work</p>
          <div className="lg:col-span-10">
            <FoldText as="h2" id="projects-title" by="chars" className="display text-[clamp(2.4rem,5vw,5.2rem)]">
              Six buildings, <span className="serif font-normal text-cobalt">folded</span> <Mark kind="circle">open</Mark>.
            </FoldText>
            <p className="mt-6 max-w-[52ch] text-[1.0625rem] text-ink/75">
              Houses, a gallery, a workplace and a tower in design. Select any card to open its{" "}
              <span className="serif text-[1.1em] text-rust">project sheet</span>.
            </p>
          </div>
        </div>

        <ul className="cards mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-x-10">
          {projects.map((p, i) => (
            <li key={p.id} className={offset[i]}>
              <button type="button" onClick={() => setOpen(i)} className="group block w-full text-left" aria-label={`Open project sheet: ${p.name}`}>
                <FoldImage
                  src={p.cover.src}
                  alt={p.cover.alt}
                  axis={i % 2 ? "x" : "y"}
                  sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
                  className="aspect-[5/4] w-full"
                />
                <div className="card-meta mt-4 grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-2">
                  <p className="display text-[clamp(1.35rem,2vw,1.75rem)] tracking-[-0.03em] transition-colors duration-300 group-hover:text-cobalt">
                    {p.name}
                  </p>
                  <span className="label pt-1 text-rust">{p.no}</span>
                  <p className="label flex flex-wrap items-center gap-2 text-ink/65">
                    <span className={`px-1.5 py-0.5 ${chip[p.typology]}`}>{p.typology}</span>
                    {p.location} · {p.year}
                  </p>
                  <span aria-hidden className="label pt-0.5 text-ink/50 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:text-cobalt">
                    Open →
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>

        {/* Schedule */}
        <div className="mt-24 md:mt-32">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink pb-3">
            <h3 className="display text-[1.5rem] tracking-[-0.03em]">Schedule of projects</h3>
            <p className="label text-ink/60">2023 – 2027 · {projects.length} entries</p>
          </div>
          <table className="sched w-full border-collapse text-left">
            <caption className="sr-only">All projects</caption>
            <thead>
              <tr className="label text-ink/60">
                <th scope="col" className="w-20 py-3 font-medium">No.</th>
                <th scope="col" className="py-3 font-medium">Project</th>
                <th scope="col" className="hidden py-3 font-medium md:table-cell">Typology</th>
                <th scope="col" className="hidden py-3 font-medium lg:table-cell">Area</th>
                <th scope="col" className="hidden py-3 font-medium sm:table-cell">Year</th>
                <th scope="col" className="py-3 pr-2 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.id} className="sched-row group cursor-pointer border-t border-ink/15 transition-colors duration-300 hover:bg-ink hover:text-paper" onClick={() => setOpen(i)}>
                  <td className="label py-4 pl-1 align-middle text-rust transition-colors group-hover:text-ochre">{p.no}</td>
                  <td className="py-4 align-middle">
                    <button type="button" onClick={(e) => { e.stopPropagation(); setOpen(i); }} className="display text-left text-[1.15rem] tracking-[-0.02em] md:text-[1.35rem]" aria-label={`Open project sheet: ${p.name}`}>
                      {p.name}
                    </button>
                  </td>
                  <td className="hidden py-4 align-middle md:table-cell">
                    <span className={`label px-1.5 py-0.5 ${chip[p.typology]}`}>{p.typology}</span>
                  </td>
                  <td className="label hidden py-4 align-middle lg:table-cell">{p.area}</td>
                  <td className="label hidden py-4 align-middle sm:table-cell">{p.year}</td>
                  <td className="label py-4 pr-2 text-right align-middle">
                    <span aria-hidden className={`mr-2 inline-block h-2 w-2 rotate-45 align-middle ${p.status === "Completed" ? "bg-verdigris" : p.status === "On site" ? "bg-terracotta" : "bg-cobalt"}`} />
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProjectSheet index={open} onChange={setOpen} />
    </section>
  );
}
