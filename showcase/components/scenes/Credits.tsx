"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { about, demos, sceneNo, studio } from "@/lib/site";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { scrollToHash } from "@/lib/scroll";
import { Board } from "./contact/Board";
import { Socials } from "./contact/Socials";
import { Mark } from "@/components/ui/Mark";

const roll: [string, string][] = [
  ["Designed & developed by", studio.name],
  ["AI agents & automation", studio.name],
  ["Based in", studio.location],
  ["Working with", "Clients worldwide"],
  ["Selected work", demos.map((d) => d.name).join(" · ")],
  ["Also on", "YouTube"],
  ["Typefaces", "Archivo, Newsreader & IBM Plex Mono"],
  ["Built with", "Next.js, GSAP & Lenis"],
];

const kinds = ["A website", "An app", "An AI agent", "An automation", "Something stranger"];
const whens = ["As soon as possible", "In the next month or two", "Just exploring"];

/** Splits a line into letters for the scroll-lit headline. */
function Chars({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`block ${className}`}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {w.split("").map((c, k) => (
            <span key={k} className="cr-ch inline-block">
              {c}
            </span>
          ))}
          {i < text.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/** Delhi's local time, ticking - so visitors anywhere know when they'll hear back. */
function DelhiClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    now
      ? new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          ...o,
        }).format(now)
      : "";
  const hour = now ? Number(fmt({ hour: "2-digit", hour12: false })) : 12;
  const awake = hour >= 9 && hour < 23;
  return (
    <div className="flex flex-col gap-1">
      <span className="hud text-dust">Local time · Delhi</span>
      <span className="credit text-[clamp(1.8rem,3.06vw,2.7rem)] tabular-nums [--w:90]" suppressHydrationWarning>
        {now ? fmt({ hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--"}
        <span className="text-dust">:{now ? fmt({ second: "2-digit" }).padStart(2, "0") : "--"}</span>
      </span>
      <span className="hud flex items-center gap-2 text-dust">
        <span className={`h-1.5 w-1.5 rounded-full ${awake ? "rec-blink bg-go" : "bg-amber"}`} />
        {now ? (awake ? "Daytime in Delhi" : "Night in Delhi. I’ll reply in the morning") : " "}
      </span>
    </div>
  );
}

/**
 * Contact - the finale. A marquee that races with the scroll, a headline that
 * lights up letter by letter, a record button orbited by its own caption, a
 * brief you put together by tapping (it becomes a ready-to-send WhatsApp
 * message), Delhi's clock, the channels, the credits roll - and an iris that
 * opens on "Thank you."
 */
export function Credits() {
  const ref = useRef<HTMLElement>(null);
  const [pick, setPick] = useState<string[]>([]);
  const [when, setWhen] = useState<string | null>(null);
  const [name, setName] = useState("");

  const message = useMemo(() => {
    const what = pick.length
      ? pick
          .map((p) => p.toLowerCase())
          .join(", ")
          .replace(/, ([^,]*)$/, " and $1")
      : "a project";
    return `Hi Ranvir,${name.trim() ? ` I'm ${name.trim()}.` : ""} I'd like to talk about ${what}.${when ? ` Timing: ${when.toLowerCase()}.` : ""}`;
  }, [pick, when, name]);
  const waHref = `https://wa.me/${studio.phoneHref.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current!;
        // the marquee: carried by the scroll, leaning with its speed
        const skew = gsap.quickTo(".cr-marquee", "skewX", {
          duration: 0.5,
          ease: "power3",
        });
        gsap.fromTo(
          ".cr-marquee-track",
          { xPercent: 0 },
          {
            xPercent: -50,
            ease: "none",
            scrollTrigger: {
              trigger: ".cr-marquee",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.4,
              onUpdate: (self) => skew(gsap.utils.clamp(-12, 12, self.getVelocity() / -260)),
            },
          },
        );

        gsap.from(".cr-top > *", {
          y: 20,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: "clamp(top 85%)", once: true },
        });

        // the headline lights up, letter by letter, as you scroll into it
        gsap.fromTo(
          ".cr-ch",
          { opacity: 0.12, yPercent: 30, rotate: 8 },
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            ease: "power2.out",
            stagger: 0.04,
            scrollTrigger: {
              trigger: ".cr-say",
              start: "top 88%",
              end: "top 38%",
              scrub: 0.5,
            },
          },
        );

        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".cr-stage",
              start: "clamp(top 70%)",
              once: true,
            },
          })
          .from(".cr-rec", { scale: 0, rotate: -120, duration: 1.3, ease: "back.out(1.5)" }, 0)
          .from(
            ".cr-orbit",
            {
              scale: 0.4,
              opacity: 0,
              rotate: -180,
              duration: 1.6,
              ease: "expo.out",
            },
            0.1,
          )
          .from(
            ".cr-sub > *",
            {
              y: 24,
              opacity: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.08,
            },
            0.2,
          );

        // the brief: the card rises, then its options pop in
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".cr-brief",
              start: "clamp(top 82%)",
              once: true,
            },
          })
          .from(".cr-brief", {
            y: 80,
            rotateX: -10,
            opacity: 0,
            duration: 1.2,
            ease: "expo.out",
          })
          .from(
            ".cr-chip",
            {
              scale: 0.5,
              opacity: 0,
              duration: 0.55,
              ease: "back.out(2.2)",
              stagger: 0.04,
            },
            0.3,
          )
          .from(
            ".cr-bubble",
            {
              scale: 0.85,
              y: 20,
              opacity: 0,
              transformOrigin: "0% 100%",
              duration: 0.8,
              ease: "back.out(1.6)",
            },
            0.6,
          );

        gsap.from(".cr-info > *", {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".cr-info",
            start: "clamp(top 88%)",
            once: true,
          },
        });

        // the credits roll with the scroll
        gsap.fromTo(
          ".cr-roll-track",
          { yPercent: 35 },
          {
            yPercent: -45,
            ease: "none",
            scrollTrigger: {
              trigger: ".cr-roll",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );

        // the iris opens on the last card (a scaling disc: transform only, no repaint)
        const end = { trigger: ".cr-end", start: "top 95%", end: "top 25%", scrub: 0.5 };
        gsap.fromTo(".cr-disc", { scale: 0.05 }, { scale: 1, ease: "none", scrollTrigger: end });
        gsap.fromTo(".cr-thanks", { scale: 0.6 }, { scale: 1, ease: "none", scrollTrigger: end });
        gsap.fromTo(".cr-thanks-photo", { scale: 0.2, rotate: -40, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, ease: "none", scrollTrigger: end });
      });

      // pointer-only: the spotlight and the magnetic record button
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const root = ref.current!;
        const light = root.querySelector<HTMLElement>(".cr-spot")!;
        gsap.set(light, {
          xPercent: -50,
          yPercent: -50,
          x: root.offsetWidth * 0.7,
          y: 320,
        });
        const sx = gsap.quickTo(light, "x", { duration: 0.9, ease: "power3" });
        const sy = gsap.quickTo(light, "y", { duration: 0.9, ease: "power3" });
        const spot = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          sx(e.clientX - r.left);
          sy(e.clientY - r.top);
        };
        root.addEventListener("pointermove", spot);

        const btn = root.querySelector<HTMLElement>(".cr-rec")!;
        const x = gsap.quickTo(btn, "x", { duration: 0.6, ease: "power3" });
        const y = gsap.quickTo(btn, "y", { duration: 0.6, ease: "power3" });
        const zone = root.querySelector<HTMLElement>(".cr-rec-zone")!;
        const move = (e: PointerEvent) => {
          const r = btn.getBoundingClientRect();
          x((e.clientX - (r.left + r.width / 2)) * 0.3);
          y((e.clientY - (r.top + r.height / 2)) * 0.3);
        };
        const leave = () => {
          x(0);
          y(0);
        };
        zone.addEventListener("pointermove", move);
        zone.addEventListener("pointerleave", leave);

        return () => {
          root.removeEventListener("pointermove", spot);
          zone.removeEventListener("pointermove", move);
          zone.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: ref },
  );

  // the bubble re-types itself whenever the brief changes
  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    gsap.fromTo(".cr-bubble-text", { opacity: 0.35 }, { opacity: 1, duration: 0.5, ease: "power2.out" });
  }, [message]);

  const toggle = (k: string) => setPick((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  const marquee = (
    <span className="flex shrink-0 items-center">
      {["Let's talk", "Start a project", "Say hello", "Build something"].map((t, i) => (
        <span key={t} className="flex items-center">
          <span className={i % 2 ? "voice px-[0.3em] normal-case text-amber" : "px-[0.3em]"}>{t}</span>
          <span className="px-[0.2em] text-rec">✦</span>
        </span>
      ))}
    </span>
  );

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="wash tone-blush relative overflow-hidden bg-void text-tungsten">
      {/* a soft red light that follows the pointer */}
      <div
        aria-hidden
        className="cr-spot pointer-events-none absolute left-0 top-0 hidden h-[44rem] w-[44rem] rounded-full bg-[radial-gradient(circle,rgb(var(--glow-b)/0.11),transparent_65%)] [[data-theme=light]_&]:bg-[radial-gradient(circle,rgb(var(--glow-b)/0.2),transparent_65%)] will-change-transform [@media(pointer:fine)]:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[6%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgb(var(--glow-b)/0.12),transparent_68%)] [[data-theme=light]_&]:bg-[radial-gradient(circle,rgb(var(--glow-a)/0.22),transparent_68%)]"
      />

      <div className="frame relative pt-20 md:pt-28">
        <div className="cr-top hud flex justify-between border-b border-tungsten/15 pb-4 text-dust">
          <span>{sceneNo("contact")} · Contact</span>
          <span className="flex items-center gap-2">
            <span className="rec-blink h-1.5 w-1.5 rounded-full bg-rec" /> Open for new projects
          </span>
        </div>
      </div>

      {/* the marquee */}
      <div aria-hidden className="cr-marquee credit relative mt-12 overflow-hidden whitespace-nowrap py-2 text-[clamp(3.06rem,9.9vw,9rem)] [--w:110] md:mt-16">
        <div className="cr-marquee-track flex w-max will-change-transform">
          {marquee}
          {marquee}
        </div>
      </div>

      <div className="frame relative">
        {/* the headline and the record button */}
        <div className="cr-stage mt-14 grid grid-cols-1 items-center gap-12 text-center md:mt-20 lg:grid-cols-12 lg:text-left">
          <div className="lg:col-span-7">
            <h2 id="contact-title" className="cr-say credit text-[clamp(2.34rem,5.76vw,5.58rem)] leading-[0.92] [--w:118]">
              <Chars text="Let's make" />
              <Mark kind="double" tone="teal">
                <Chars text="the next one." className="text-amber" />
              </Mark>
            </h2>
            <div className="cr-sub mx-auto mt-8 flex max-w-[52ch] flex-col items-center gap-5 sm:flex-row sm:items-start lg:mx-0">
              {about.photo && (
                <span className="relative shrink-0">
                  <span className="relative block h-16 w-16 overflow-hidden rounded-full ring-2 ring-amber/70 ring-offset-2 ring-offset-void">
                    <Image src={about.photo} alt="" width={128} height={128} quality={75} className="h-full w-full object-cover [object-position:68%_38%]" />
                  </span>
                  <span aria-hidden className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-void bg-go" />
                </span>
              )}
              <p className="voice text-[clamp(1.03rem,1.53vw,1.35rem)] leading-snug text-dust">
                Tell me what you&rsquo;re building: a website, an app, an agent or something stranger. No sales team in between. I reply{" "}
                <Mark kind="circle" tone="pink">
                  personally.
                </Mark>
              </p>
            </div>
            <Board />
          </div>

          <div className="cr-rec-zone flex justify-center lg:col-span-5">
            <div className="relative grid place-items-center p-12 md:p-16">
              {/* the caption orbiting the button */}
              <div aria-hidden className="cr-orbit pointer-events-none absolute inset-0 m-auto h-[17rem] w-[17rem] md:h-[21rem] md:w-[21rem]">
                <svg viewBox="0 0 300 300" className="h-full w-full animate-[spin_22s_linear_infinite] will-change-transform motion-reduce:animate-none">
                  <defs>
                    <path id="cr-ring" d="M150,150 m-128,0 a128,128 0 1,1 256,0 a128,128 0 1,1 -256,0" />
                  </defs>
                  <text className="fill-dust font-mono text-[13px] uppercase tracking-[0.32em]">
                    <textPath href="#cr-ring">Start a project ✦ Let&rsquo;s talk ✦ Start a project ✦ Let&rsquo;s talk ✦</textPath>
                  </text>
                </svg>
              </div>
              <a
                href={studio.contactHref}
                target="_blank"
                rel="noreferrer"
                data-frame
                data-frame-hover
                className="cr-rec group relative grid h-40 w-40 place-items-center rounded-full bg-rec text-void shadow-[0_30px_80px_-20px_rgb(var(--glow-b)/0.6)] md:h-48 md:w-48"
              >
                <span aria-hidden className="absolute -inset-3 animate-ping rounded-full border border-rec/60 [animation-duration:2.6s]" />
                <span
                  aria-hidden
                  className="absolute inset-0 scale-0 rounded-full bg-tungsten transition-transform duration-500 ease-out-expo group-hover:scale-100"
                />
                <span className="relative text-center">
                  <span className="hud flex items-center justify-center gap-1.5">
                    <span className="rec-blink h-2 w-2 rounded-full bg-rec group-hover:bg-rec" /> Let&rsquo;s talk
                  </span>
                  <span className="credit mt-2 block text-[1.6rem] leading-[0.95] [--w:90] transition-[font-variation-settings] duration-500 group-hover:[--w:120] md:text-[2rem]">
                    Start a<br />
                    project
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* the brief builder */}
        <div className="mt-20 [perspective:1400px] md:mt-28">
          <div className="cr-brief glass relative overflow-hidden rounded-3xl p-5 md:p-10">
            <span
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgb(var(--glow-a)/0.15),transparent_68%)]"
            />
            <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <p className="hud text-amber">Build your brief · 3 taps</p>
                <h3 className="voice mt-3 text-[clamp(1.62rem,2.7vw,2.52rem)] leading-tight">What are we making?</h3>
                <div role="group" aria-label="What are we making" className="mt-5 flex flex-wrap gap-2">
                  {kinds.map((k) => {
                    const on = pick.includes(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(k)}
                        className={`cr-chip h-11 rounded-full border px-4 text-[0.95rem] transition-colors duration-300 ${on ? "border-amber bg-amber text-void" : "border-tungsten/20 hover:border-tungsten/60"}`}
                      >
                        {on ? "✓ " : "+ "}
                        {k}
                      </button>
                    );
                  })}
                </div>
                <p className="hud mt-8 text-dust">When?</p>
                <div role="radiogroup" aria-label="When do you want to start" className="mt-3 flex flex-wrap gap-2">
                  {whens.map((w) => (
                    <button
                      key={w}
                      type="button"
                      role="radio"
                      aria-checked={when === w}
                      onClick={() => setWhen(when === w ? null : w)}
                      className={`cr-chip h-11 rounded-full border px-4 text-[0.95rem] transition-colors duration-300 ${when === w ? "border-tungsten bg-tungsten text-void" : "border-tungsten/20 hover:border-tungsten/60"}`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <label className="mt-8 block">
                  <span className="hud text-dust">Your name (optional)</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 40))}
                    placeholder="Type your name"
                    className="cr-chip mt-3 block h-12 w-full max-w-sm rounded-full border border-tungsten/20 bg-transparent px-5 text-[1rem] text-tungsten placeholder:text-dust/70 focus:border-amber focus:outline-none"
                  />
                </label>
              </div>

              <div className="flex flex-col justify-end lg:col-span-5">
                <p className="hud text-dust">Your message</p>
                <div className="cr-bubble relative mt-3 rounded-2xl rounded-bl-sm bg-[var(--bubble)] p-5 text-[1.0625rem] leading-relaxed text-[var(--bubble-ink)] shadow-[0_20px_50px_-20px_rgb(var(--shade)/calc(0.7*var(--shade-k)))]">
                  <p className="cr-bubble-text" aria-live="polite">
                    {message}
                    <span aria-hidden className="rec-blink ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] bg-current" />
                  </p>
                  <span className="hud mt-3 block text-right text-[0.625rem] opacity-60">To {studio.name} · WhatsApp</span>
                </div>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  data-frame-hover
                  className="group relative mt-5 flex h-14 items-center justify-between overflow-hidden rounded-full bg-tungsten pl-6 pr-2 text-void"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-go transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                  />
                  <span className="hud relative">Send it on WhatsApp</span>
                  <span
                    aria-hidden
                    className="relative grid h-10 w-10 place-items-center rounded-full bg-void text-tungsten transition-transform duration-500 group-hover:rotate-45"
                  >
                    ↗
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* time, place, reach */}
        <div className="cr-info mt-16 grid grid-cols-1 gap-8 border-t border-tungsten/15 pt-10 text-center sm:grid-cols-3 sm:text-left md:mt-20">
          <DelhiClock />
          <div className="flex flex-col gap-1">
            <span className="hud text-dust">Based in</span>
            <span className="credit text-[clamp(1.8rem,3.06vw,2.7rem)] [--w:90]">Delhi</span>
            <span className="hud text-dust">India · GMT +5:30</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="hud text-dust">Working with</span>
            <span className="credit text-[clamp(1.8rem,3.06vw,2.7rem)] [--w:90]">Worldwide</span>
            <span className="hud text-dust">Calls &amp; chats in any time zone</span>
          </div>
        </div>

        {/* channels: the marks themselves */}
        <Socials />
      </div>

      {/* The credits roll */}
      <div className="cr-roll relative mt-10 h-[60svh] overflow-hidden" aria-label="Colophon">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/4 bg-gradient-to-b from-void to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/4 bg-gradient-to-t from-void to-transparent" />
        <dl className="cr-roll-track mx-auto flex max-w-xl flex-col items-center gap-7 px-5 py-10 text-center will-change-transform">
          {roll.map(([k, v]) => (
            <div key={k}>
              <dt className="hud text-dust">{k}</dt>
              <dd className="credit mt-1.5 text-[clamp(1.03rem,1.71vw,1.44rem)] [--w:100]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* the iris opens on the last card */}
      <div className="cr-end tone-butter relative overflow-hidden">
        <span
          aria-hidden
          className="cr-disc absolute left-1/2 top-1/2 h-[150vmax] w-[150vmax] -translate-x-1/2 -translate-y-1/2 wash rounded-full bg-paper will-change-transform"
        />
        <div className="relative flex min-h-[80svh] flex-col items-center justify-center px-5 pb-24 pt-20 text-center text-ink">
          <p className="hud text-smoke">Fin · {sceneNo("contact")} / 12</p>
          {about.photo && (
            <span className="cr-thanks-photo relative mt-8 block h-24 w-24 overflow-hidden rounded-full ring-2 ring-ink/80 ring-offset-4 ring-offset-paper md:h-28 md:w-28">
              <Image
                src={about.photo}
                alt={`Portrait of ${studio.name}`}
                width={224}
                height={224}
                quality={80}
                className="h-full w-full object-cover [object-position:68%_38%]"
              />
            </span>
          )}
          <p className="cr-thanks credit mt-6 text-[clamp(3.06rem,10.8vw,9.9rem)] [--w:115]">Thank you.</p>
          <p className="voice mt-5 max-w-[34ch] text-[clamp(1.03rem,1.53vw,1.35rem)] leading-snug text-smoke">
            That&rsquo;s the end of this one. The next one could be{" "}
            <Mark kind="circle" tone="coral">
              yours.
            </Mark>
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={studio.contactHref}
              target="_blank"
              rel="noreferrer"
              data-frame-hover
              className="hud flex h-12 items-center rounded-full bg-ink px-6 text-paper transition-colors hover:bg-rec"
            >
              Start a project ↗
            </a>
            <button
              type="button"
              onClick={() => scrollToHash("#top")}
              data-frame-hover
              className="hud flex h-12 items-center gap-2 rounded-full border border-ink/30 px-6 transition-colors hover:border-ink"
            >
              Back to top ↑
            </button>
          </div>
          <p className="hud mt-14 max-w-[60ch] text-smoke">
            © {new Date().getFullYear()} {studio.name}. NOIR, VANTA, ATELIER and NOVA are fictional brands, designed and built as website concepts.
          </p>
        </div>
      </div>
    </section>
  );
}
