"use client";

import shopfront from "@/public/images/n-shopfront.jpg";
import terrace from "@/public/images/n-terrace.jpg";
import { site } from "@/lib/site";
import { useToday } from "@/lib/today";
import { Drift, Photo } from "../motion/Reveal";
import { Eyebrow } from "../ui/Eyebrow";

export function Visit() {
  const { day } = useToday();
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.mapsQuery)}`;

  return (
    <section id="visit" aria-labelledby="visit-title" className="relative py-28 md:py-36">
      <div className="wrap grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col lg:col-span-4">
          <Eyebrow n="05">Visit</Eyebrow>
          <Drift as="h2" id="visit-title" className="mt-6 text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]">
            Look for the blue shopfront on Alder Lane.
          </Drift>
          <Drift className="mt-6 max-w-[34ch] text-ink-soft">
            Two minutes from the market square, next to the bike shop. If you reach the canal, you&rsquo;ve gone too far.
          </Drift>
          <figure className="mt-14 hidden lg:block">
            <Photo src={terrace} alt="Tables on a cobbled street outside a café, under an awning" sizes="26vw" className="aspect-[4/3] w-[88%]" />
            <figcaption className="mt-3 text-[0.875rem] text-ink-soft">
              <span className="note mr-2">six tables outside</span>April to October, dogs welcome.
            </figcaption>
          </figure>
        </div>

        <div className="relative lg:col-span-7 lg:col-start-6">
          <Photo
            src={shopfront}
            alt="A café shopfront with blue window frames, warm lamps inside and a bicycle parked by the door"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="aspect-[4/3] xl:w-[82%]"
          />

          {/* Address and hours on frosted glass, floating over the street */}
          <div className="glass relative mx-auto -mt-16 w-[94%] rounded-[20px] p-5 sm:-mt-20 sm:p-6 md:ml-auto md:mr-4 md:w-[24rem] xl:absolute xl:-bottom-10 xl:right-0 xl:mx-0 xl:mt-0 xl:p-7">
            <div className="flex flex-col items-start gap-4 min-[400px]:flex-row min-[400px]:justify-between min-[400px]:gap-6">
              <address className="not-italic">
                <p className="label text-ink-soft">Address</p>
                <p className="mt-2 font-display text-xl leading-snug">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </p>
              </address>
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-full border border-ink px-3.5 py-2 text-[0.8125rem] transition-colors duration-500 hover:bg-ink hover:text-milk"
              >
                Directions ↗
              </a>
            </div>
            <table className="mt-6 w-full text-[0.875rem]">
              <caption className="label mb-2 text-left text-ink-soft">Opening hours</caption>
              <tbody>
                {site.hours.map((h, i) => (
                  <tr key={h.day} className={`border-t border-ink/10 ${i === day ? "font-semibold" : "text-ink-soft"}`}>
                    <th scope="row" className="py-1.5 text-left font-[inherit]">
                      {h.day}
                      {i === day && <span className="note ml-2 !text-[1.1rem]">today</span>}
                    </th>
                    <td className="py-1.5 text-right tabular-nums">
                      {h.open} – {h.close}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 text-[0.8125rem] text-ink-soft">
              <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="ink-link">
                {site.phone}
              </a>
              <span className="mx-2">·</span>
              <a href={`mailto:${site.email}`} className="ink-link">
                {site.email}
              </a>
            </p>
            <p className="mt-3 text-[0.75rem] text-ink-soft/80">Illustrative demo address, not a real location.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
