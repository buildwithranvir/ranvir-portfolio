"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { budgets, contactServices } from "@/lib/content";
import { site } from "@/lib/site";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/lib/gsap";

type Errors = Partial<Record<"name" | "email" | "kind" | "message", string>>;
const snap = [0.2, 0.9, 0.1, 1] as const;
const MAX = 600;

const next = [
  { n: "01", t: "We reply", d: "A real person answers within two working days — usually sooner." },
  { n: "02", t: "A 30-minute call", d: "We ask a lot of questions and tell you honestly if we're the right studio." },
  { n: "03", t: "A one-page plan", d: "Scope, timeline and a fixed price, within a week of the call." },
];

/** Lisbon time, ticking once a minute (rendered on the client only). */
function useLisbonTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon" });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/**
 * Contact, set out as the studio's workbench: the pitch, a copyable address and
 * what happens next on the left; the brief itself on the right, written like a
 * small program — line numbers, flags, a progress bar and a run log on send.
 */
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [kind, setKind] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [copied, setCopied] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const time = useLisbonTime();

  const done = [kind.length > 0, name.trim().length > 1, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()), message.trim().length >= 10];
  const progress = done.filter(Boolean).length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".ct-title", { type: "chars", mask: "chars" });
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "clamp(top 70%)", once: true } });
        tl.from(split.chars, { yPercent: 110, duration: 0.8, ease: "power4.out", stagger: 0.025 }, 0)
          .from(".ct-fade", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, 0.25)
          .from(".ct-step", { x: -20, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.1 }, 0.5)
          .from(".ct-spine", { scaleY: 0, transformOrigin: "50% 0%", duration: 1.1, ease: "power3.inOut" }, 0.5)
          .from(".ct-console", { y: 50, opacity: 0, rotateX: 8, transformPerspective: 1400, transformOrigin: "50% 100%", duration: 1.1, ease: "power3.out" }, 0.15)
          .from(".ct-line", { x: 14, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 }, 0.55);
      });
    },
    { scope: ref },
  );

  const toggle = (s: string) => {
    setKind((k) => (k.includes(s) ? k.filter((x) => x !== s) : [...k, s]));
    setErrors((e) => ({ ...e, kind: undefined }));
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const found: Errors = {};
    if (!kind.length) found.kind = "pick at least one";
    if (name.trim().length < 2) found.name = "name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) found.email = "email looks invalid";
    if (message.trim().length < 10) found.message = "tell us a little more (10+ chars)";
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1100); // Demo: nothing is transmitted.
  };

  // ⌘/Ctrl + Enter sends from anywhere in the form
  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
  };

  const chip = (on: boolean, accent = "signal") =>
    `mono relative h-9 rounded-full border px-3.5 transition-[color,background-color,border-color,scale] duration-300 ease-snap active:scale-95 ${
      on ? (accent === "signal" ? "border-signal bg-signal text-void" : "border-ice bg-ice text-void") : "border-white/15 text-mist hover:border-white/40 hover:text-ice"
    }`;
  const lineNo = (n: number) => (
    <span aria-hidden className="mono w-6 shrink-0 select-none pt-[0.55rem] text-right text-dim/80">
      {String(n).padStart(2, "0")}
    </span>
  );
  const input = (err?: string) =>
    `w-full rounded-lg border bg-void/50 px-3 py-2.5 text-[1.0625rem] text-ice outline-none transition-colors placeholder:text-dim focus:border-signal ${err ? "border-signal/70" : "border-white/10 hover:border-white/20"}`;

  return (
    <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden py-24 md:py-32">
      {/* ground: engineering grid fading out, one warm glow behind the console */}
      <div aria-hidden className="grid-bg absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" />
      <div aria-hidden className="absolute right-[-10%] top-[10%] -z-10 h-[38rem] w-[38rem] rounded-full bg-signal/[0.09] blur-[120px]" />

      <div className="frame">
        <div className="ct-fade mono flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 text-mist">
          <span>~/nova/contact</span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            booking projects from january · {site.location}
            {time && <span className="text-ice"> · {time} local</span>}
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          {/* Pitch */}
          <div className="flex flex-col lg:col-span-5">
            <h2 id="contact-title" className="ct-title wide text-[clamp(3rem,7.4vw,7rem)] leading-[0.86]">
              Got a <span className="text-signal">brief?</span>
            </h2>
            <p className="ct-fade mt-6 max-w-[36ch] text-lg leading-relaxed text-ice/80">
              Tell us what you&rsquo;re trying to make — a sentence is enough to start. We reply to every message within two working days.
            </p>

            {/* email as a control: copy, or open the mail app */}
            <div className="ct-fade glass mt-8 flex items-center gap-2 rounded-2xl p-2 pl-5">
              <a href={`mailto:${site.email}`} className="condensed min-w-0 flex-1 truncate text-[clamp(1.4rem,2.4vw,1.9rem)] transition-colors hover:text-signal">
                {site.email}
              </a>
              <button type="button" onClick={copy} className="mono relative h-10 shrink-0 overflow-hidden rounded-xl bg-white/[0.06] px-4 text-ice transition-colors hover:bg-white/[0.12]" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "y" : "n"}
                    className={`block ${copied ? "text-emerald-300" : ""}`}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {copied ? "copied ✓" : "copy"}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

            {/* what happens next */}
            <div className="mt-12">
              <p className="ct-fade mono text-mist">what happens next</p>
              <ol className="relative mt-5 space-y-6 pl-8">
                <span aria-hidden className="ct-spine absolute bottom-3 left-[0.6875rem] top-3 w-px bg-gradient-to-b from-signal via-white/20 to-transparent" />
                {next.map((s) => (
                  <li key={s.n} className="ct-step relative">
                    <span aria-hidden className="mono absolute -left-8 top-0.5 grid h-6 w-6 place-items-center rounded-full border border-white/20 bg-void text-[0.625rem] text-signal">
                      {s.n}
                    </span>
                    <p className="condensed text-[1.35rem] leading-tight">{s.t}</p>
                    <p className="mt-1 max-w-[38ch] text-ice/65">{s.d}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Console */}
          <div className="lg:col-span-7">
            <div className="ct-console glass glass-solid overflow-hidden rounded-3xl">
              <div className="mono flex items-center gap-2 border-b border-white/10 px-4 py-3 text-mist">
                <span className="h-2.5 w-2.5 rounded-full bg-signal" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" aria-hidden />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" aria-hidden />
                <span className="ml-2 rounded-md bg-white/[0.06] px-2 py-0.5 text-ice">new-brief.sh</span>
                <span className="ml-auto tabular-nums" aria-live="polite">
                  {status === "sent" ? "exit 0" : `${progress}/4 ready`}
                </span>
              </div>
              {/* progress */}
              <div aria-hidden className="h-[2px] bg-white/[0.06]">
                <motion.div className="h-full bg-signal" animate={{ width: status === "sent" ? "100%" : `${(progress / 4) * 100}%` }} transition={{ duration: 0.6, ease: snap }} />
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {status !== "sent" ? (
                  <motion.form key="f" ref={form} noValidate onSubmit={submit} onKeyDown={onKeyDown} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6 p-5 md:p-7">
                    <fieldset className="ct-line flex gap-3" aria-describedby={errors.kind ? "c-kind-err" : undefined}>
                      {lineNo(1)}
                      <div className="min-w-0 flex-1">
                        <legend className="mono mb-2.5 text-mist">
                          <span className="text-signal">$</span> brief --type <span className="text-dim">(pick any)</span>
                        </legend>
                        <div className="flex flex-wrap gap-2" data-field="kind" tabIndex={-1}>
                          {contactServices.map((s) => {
                            const on = kind.includes(s);
                            return (
                              <button key={s} type="button" aria-pressed={on} onClick={() => toggle(s)} className={chip(on)}>
                                <AnimatePresence initial={false}>
                                  {on && (
                                    <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="inline-block overflow-hidden align-bottom">
                                      ✓&nbsp;
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                                {s}
                              </button>
                            );
                          })}
                        </div>
                        {errors.kind && <p id="c-kind-err" className="mono mt-2 text-signal">! {errors.kind}</p>}
                      </div>
                    </fieldset>

                    <fieldset className="ct-line flex gap-3">
                      {lineNo(2)}
                      <div className="min-w-0 flex-1">
                        <legend className="mono mb-2.5 text-mist">
                          <span className="text-signal">$</span> brief --budget <span className="text-dim">(optional, EUR)</span>
                        </legend>
                        <div className="flex flex-wrap gap-2">
                          {budgets.map((b) => (
                            <button key={b} type="button" aria-pressed={budget === b} onClick={() => setBudget(budget === b ? "" : b)} className={chip(budget === b, "ice")}>
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    </fieldset>

                    <div className="ct-line flex gap-3">
                      {lineNo(3)}
                      <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="c-name" className="mono mb-1.5 block text-mist">
                            <span className="text-signal">$</span> --name
                          </label>
                          <input id="c-name" data-field="name" autoComplete="name" placeholder="Ada Lovelace" value={name} onChange={(e) => { setName(e.target.value); setErrors((x) => ({ ...x, name: undefined })); }} className={input(errors.name)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-err" : undefined} />
                          {errors.name && <p id="c-name-err" className="mono mt-1.5 text-signal">! {errors.name}</p>}
                        </div>
                        <div>
                          <label htmlFor="c-email" className="mono mb-1.5 block text-mist">
                            <span className="text-signal">$</span> --email
                          </label>
                          <input id="c-email" data-field="email" type="email" autoComplete="email" placeholder="ada@company.com" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((x) => ({ ...x, email: undefined })); }} className={input(errors.email)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-err" : undefined} />
                          {errors.email && <p id="c-email-err" className="mono mt-1.5 text-signal">! {errors.email}</p>}
                        </div>
                      </div>
                    </div>

                    <div className="ct-line flex gap-3">
                      {lineNo(4)}
                      <div className="min-w-0 flex-1">
                        <label htmlFor="c-msg" className="mono mb-1.5 flex justify-between text-mist">
                          <span>
                            <span className="text-signal">$</span> --message
                          </span>
                          <span className={`tabular-nums ${message.length > MAX * 0.9 ? "text-signal" : "text-dim"}`}>
                            {message.length}/{MAX}
                          </span>
                        </label>
                        <textarea
                          id="c-msg"
                          data-field="message"
                          rows={4}
                          maxLength={MAX}
                          value={message}
                          onChange={(e) => { setMessage(e.target.value); setErrors((x) => ({ ...x, message: undefined })); }}
                          placeholder="What are you making, for whom, and by when? Links welcome."
                          className={`${input(errors.message)} resize-none leading-relaxed`}
                          aria-invalid={!!errors.message}
                          aria-describedby={errors.message ? "c-msg-err" : undefined}
                        />
                        {errors.message && <p id="c-msg-err" className="mono mt-1.5 text-signal">! {errors.message}</p>}
                      </div>
                    </div>

                    <div className="ct-line flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <p className="mono min-w-0 text-dim">
                        demo form · nothing is sent <span className="hidden xl:inline">· ctrl/⌘ + ↵ to send</span>
                      </p>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="group mono relative flex h-12 shrink-0 items-center justify-center gap-3 overflow-hidden rounded-xl bg-signal px-6 font-bold text-void transition-transform duration-300 ease-snap hover:-translate-y-0.5 disabled:cursor-wait"
                      >
                        <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        {status === "sending" ? (
                          <>
                            <span aria-hidden className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-void border-t-transparent" />
                            sending…
                          </>
                        ) : (
                          <>run brief ↵</>
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div key="s" role="status" className="mono space-y-2 p-6 text-mist md:p-8" initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.28 } } }}>
                    {[
                      <>
                        <span className="text-signal">$</span> ./new-brief.sh --run
                      </>,
                      <>→ packing {kind.length} type(s){budget ? `, budget ${budget}` : ""}… <span className="text-emerald-300">ok</span></>,
                      <>→ routing to {site.email}… <span className="text-ice">simulated</span></>,
                      <>→ exit 0</>,
                    ].map((line, i) => (
                      <motion.p key={i} variants={{ h: { opacity: 0, x: -8 }, s: { opacity: 1, x: 0 } }}>
                        {line}
                      </motion.p>
                    ))}
                    <motion.div variants={{ h: { opacity: 0, y: 12 }, s: { opacity: 1, y: 0 } }} className="!mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <p className="condensed text-[1.75rem] text-ice" style={{ fontFamily: "var(--font-display)" }}>Thanks, {name.trim().split(" ")[0]}.</p>
                      <p className="mt-1 text-base text-ice/70" style={{ fontFamily: "var(--font-display)" }}>
                        In a live site we&rsquo;d reply to {email} within two working days.
                      </p>
                      <button type="button" onClick={() => { setStatus("idle"); setKind([]); setMessage(""); setBudget(""); }} className="mt-4 rounded-lg border border-white/15 px-3 py-2 text-ice transition-colors hover:border-signal">
                        $ new brief
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
