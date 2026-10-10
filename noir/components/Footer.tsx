import { nav, site } from "@/lib/site";
import { FooterWord } from "./FooterWord";
import { AnchorLink } from "./ui/AnchorLink";

// A pseudo-barcode built from the address, purely decorative.
const bars = Array.from("27ALDERLANENOIRKAFFEBAR").map((c) => (c.charCodeAt(0) % 4) + 1);

/** The footer is the café's receipt: links as line items, details as the small print. */
export function Footer() {
  return (
    <footer className="relative overflow-hidden pb-6 pt-20 md:pt-28">
      <div className="wrap grid grid-cols-1 items-center gap-14 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-display text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]">Thanks for stopping by.</p>
          <p className="note mt-3">come back tomorrow — the knots are better warm</p>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="ink-link">
                  {s.label} ↗
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className="ink-link">
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <div className="mx-auto max-w-[22rem] rotate-[1.5deg] rounded-[14px] bg-milk px-7 pb-8 pt-7 text-[0.875rem] shadow-[0_24px_40px_-24px_rgba(34,22,15,0.55)]">
            <p className="text-center font-display text-2xl">Noir</p>
            <p className="label mt-1 text-center text-[0.5625rem] text-ink-soft">Kaffebar &amp; Bageri</p>
            <address className="mt-3 text-center text-[0.8125rem] not-italic text-ink-soft">
              {site.address.line1}, {site.address.line2}
            </address>
            <div className="my-4 border-t border-dashed border-ink/40" />
            <nav aria-label="Footer">
              <ul className="space-y-1.5">
                {nav.map((l, i) => (
                  <li key={l.href}>
                    <AnchorLink href={l.href} className="flex items-baseline gap-2 hover:text-burgundy">
                      <span>{l.label}</span>
                      <span aria-hidden className="dots" />
                      <span aria-hidden className="tabular-nums text-ink-soft">{(i + 1).toFixed(2)}</span>
                    </AnchorLink>
                  </li>
                ))}
                <li>
                  <AnchorLink href="#top" className="flex items-baseline gap-2 hover:text-burgundy">
                    <span>Back to the top</span>
                    <span aria-hidden className="dots" />
                    <span aria-hidden className="tabular-nums text-ink-soft">0.00</span>
                  </AnchorLink>
                </li>
              </ul>
            </nav>
            <div className="my-4 border-t border-dashed border-ink/40" />
            <p className="flex justify-between font-semibold">
              <span>Total</span>
              <span>One good morning</span>
            </p>
            <div aria-hidden className="mt-6 flex h-10 items-stretch justify-center gap-[2px]">
              {bars.map((w, i) => (
                <span key={i} className="bg-ink" style={{ width: w }} />
              ))}
            </div>
            <p className="mt-4 text-center text-[0.6875rem] text-ink-soft">
              © {new Date().getFullYear()} Noir. A fictional café for a website template demo.
            </p>
          </div>
        </div>
      </div>
      <FooterWord />
    </footer>
  );
}
