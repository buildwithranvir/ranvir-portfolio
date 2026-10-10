"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/lib/gsap";

const snap = [0.76, 0, 0.24, 1] as const;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

/** The one band in full chartreuse. The marquee runs with your scroll: faster when you scroll, backwards when you go up. */
export function Subscribe() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>(".mq-track").map((el, i) =>
          gsap.fromTo(el, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 26, ease: "none", repeat: -1 }),
        );
        // Start deep into the loop so a negative timeScale (scrolling up) has room to run backwards
        rows.forEach((t) => t.totalTime(t.duration() * 200));
        let dir = 1;
        ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            dir = self.direction;
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 350, 6);
            rows.forEach((t) => {
              t.timeScale(dir * boost);
              gsap.to(t, { timeScale: dir, duration: 1.2, ease: "power2.out", overwrite: true });
            });
          },
        });
      });
    },
    { scope: ref },
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return setError("Add your email address.");
    if (!isEmail(email)) return setError("That doesn't look like an email. Try name@domain.com.");
    setError("");
    setDone(true); // Demo only: nothing leaves the browser.
  };

  const row = (word: string) =>
    Array.from({ length: 4 }).map((_, k) => (
      <span key={k} className="flex shrink-0 items-center gap-[3vw] pr-[3vw]">
        {word}
        <span className="serif-i normal-case">✶</span>
      </span>
    ));

  return (
    <section ref={ref} id="subscribe" data-theme="acid" aria-labelledby="sub-title" className="relative overflow-hidden py-20 md:py-28">
      <div aria-hidden className="display select-none text-[clamp(4rem,12vw,11rem)] leading-[0.9]">
        <div className="mq-track flex w-max [--w:150]">{row("Next issue")}</div>
        <div className="mq-track flex w-max text-transparent [--w:60] [-webkit-text-stroke:1.5px_var(--color-ink)]">{row("Before anyone")}</div>
      </div>

      <div className="wrap mt-14 grid grid-cols-1 gap-10 md:mt-20 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <h2 id="sub-title" className="serif-i text-[clamp(2.2rem,3.8vw,3.6rem)] leading-[0.98]">
            One letter per issue. Nothing else.
          </h2>
          <p className="mt-4 max-w-[40ch] text-fg/75">First look at new pieces, notes from the workshops and the occasional invitation to the studio.</p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <AnimatePresence mode="wait" initial={false}>
            {!done ? (
              <motion.form key="f" noValidate onSubmit={submit} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                <label htmlFor="sub-email" className="mono block text-fg/70">
                  Email address
                </label>
                <motion.div
                  animate={error ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
                  transition={{ duration: 0.45 }}
                  className={`mt-3 flex items-center gap-2 rounded-full border-2 bg-porcelain/50 p-1.5 pl-5 ${error ? "border-rouge" : "border-ink"}`}
                >
                  <input
                    id="sub-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    aria-invalid={!!error}
                    aria-describedby={error ? "sub-error" : "sub-note"}
                    placeholder="you@studio.com"
                    className="min-w-0 flex-1 bg-transparent py-2 text-[1.125rem] outline-none placeholder:text-ink/40"
                  />
                  <button type="submit" className="group mono flex h-12 shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-porcelain">
                    Subscribe
                    <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </motion.div>
                <AnimatePresence>
                  {error && (
                    <motion.p id="sub-error" role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3 text-[0.9375rem] font-medium text-rouge">
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
                <p id="sub-note" className="mono mt-3 text-fg/60">
                  Demo sign-up. Nothing is stored or sent.
                </p>
              </motion.form>
            ) : (
              <motion.div key="d" role="status" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ duration: 0.9, ease: snap }}>
                <p className="display text-[clamp(2.4rem,5vw,4rem)] [--w:120]">You&rsquo;re in.</p>
                <p className="mt-3 text-fg/75">In a live store, Issue 08 would arrive at {email}.</p>
                <button type="button" onClick={() => { setDone(false); setEmail(""); }} className="mono mt-4 underline underline-offset-4">
                  Use another address
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
