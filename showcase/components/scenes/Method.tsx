"use client";

import { useRef } from "react";
import { principles, sceneNo } from "@/lib/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Mark } from "@/components/ui/Mark";

/**
 * Process. The quietest section on the page: no images, no effects,
 * just six principles read one at a time on a warm page.
 */
export function Method() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>(".mt-row").forEach((row) => {
          gsap.from(row, { opacity: 0, y: 18, duration: 1.4, ease: "power2.out", scrollTrigger: { trigger: row, start: "clamp(top 88%)", once: true } });
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="method" aria-labelledby="method-title" className="wash tone-lilac bg-paper-2 py-20 text-ink md:py-28">
      <div className="frame grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="text-center lg:sticky lg:top-28 lg:text-left">
            <p className="hud text-smoke">{sceneNo("method")} — Process</p>
            <h2 id="method-title" className="voice mt-5 text-[clamp(1.98rem,3.42vw,3.24rem)] leading-[1]">
              How I{" "}
              <Mark kind="box" tone="sun">
                work.
              </Mark>
            </h2>
            <p className="mx-auto mt-6 max-w-[30ch] text-[1.0625rem] leading-relaxed text-ink/75 lg:mx-0">
              Every concept on this page started from a blank page. Yours would too.
            </p>
          </div>
        </div>
        <ol className="lg:col-span-7 lg:col-start-6">
          {principles.map((p, i) => (
            <li key={p.title} className="mt-row grid grid-cols-[3rem_1fr] gap-x-4 border-t border-ink/20 py-6 last:border-b md:grid-cols-[4rem_1fr] md:py-8">
              <span className="hud pt-2 text-rec">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="credit text-[clamp(1.22rem,1.8vw,1.71rem)] [--w:92]">{p.title}</h3>
                <p className="mt-3 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink/75">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
