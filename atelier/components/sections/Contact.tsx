"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";
import { FoldText, Mark, Seam } from "../motion/Fold";

const types = ["New build", "Renovation", "Interior", "Commercial", "Consultation"];
const budgets = ["Under 250k", "250k – 750k", "750k – 2M", "Over 2M", "Not sure yet"];

type F = { name: string; email: string; type: string; budget: string; site: string; brief: string };
type E = Partial<Record<keyof F, string>>;
const empty: F = { name: "", email: "", type: "", budget: "", site: "", brief: "" };

function validate(f: F): E {
  const e: E = {};
  if (f.name.trim().length < 2) e.name = "Required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "A valid email, please.";
  if (!f.type) e.type = "Choose a type of project.";
  if (f.brief.trim().length < 20) e.brief = "A few sentences — at least 20 characters.";
  return e;
}

/** The inquiry form, set out like a numbered project brief. */
export function Contact() {
  const [f, setF] = useState<F>(empty);
  const [errors, setErrors] = useState<E>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const form = useRef<HTMLFormElement>(null);

  const set = (k: keyof F, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(f);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 900); // Demo: simulated only.
  };

  const input = (k: keyof F) =>
    `w-full border-0 border-b-2 bg-transparent py-2.5 text-[1.0625rem] text-paper outline-none transition-colors placeholder:text-paper/40 focus:border-ochre ${errors[k] ? "border-blush" : "border-paper/25"}`;

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-ink py-24 text-paper md:py-32">
      <Seam className="fill-ink" />
      <div className="sheet">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="label text-ochre">05 / Project brief</p>
            <FoldText as="h2" id="contact-title" by="chars" className="display mt-5 text-[clamp(2.4rem,4.6vw,4.6rem)]">
              Start with the <span className="serif font-normal text-ochre">site</span>, we&rsquo;ll draw the <Mark kind="under" tone="text-terracotta">rest</Mark>.
            </FoldText>
            <p className="mt-6 max-w-[40ch] text-[1.0625rem] text-paper/80">
              Tell us about the site, the brief and the timeline. A partner reads every brief and replies within{" "}
              <Mark kind="box" tone="text-cobalt">three working days</Mark>.
            </p>
            <dl className="mt-10 border-t border-paper/20">
              {[
                ["Email", <a key="e" href={`mailto:${site.email}`} className="draw-link hover:text-ochre">{site.email}</a>],
                ["Telephone", <a key="t" href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="draw-link hover:text-ochre">{site.phone}</a>],
                ["Studio", site.address.join(", ")],
              ].map(([k, v]) => (
                <div key={k as string} className="grid grid-cols-[6.5rem_1fr] border-b border-paper/20 py-3.5">
                  <dt className="label pt-1 text-paper/60">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <AnimatePresence mode="wait" initial={false}>
              {status !== "sent" ? (
                <motion.form key="f" ref={form} noValidate onSubmit={submit} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                  <Field n="01" id="c-name" label="Name" error={errors.name}>
                    <input id="c-name" data-field="name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} className={input("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-err" : undefined} />
                  </Field>
                  <Field n="02" id="c-email" label="Email" error={errors.email}>
                    <input id="c-email" data-field="email" type="email" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} className={input("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-err" : undefined} />
                  </Field>
                  <fieldset className="sm:col-span-2" aria-describedby={errors.type ? "c-type-err" : undefined}>
                    <legend className="label mb-3 text-paper/70">
                      <span className="mr-2 text-ochre">03</span>Type of project
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {types.map((t, k) => (
                        <label key={t} className={`label cursor-pointer whitespace-nowrap border px-3.5 py-2.5 text-center transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ochre ${f.type === t ? "border-ochre bg-ochre text-ink" : "border-paper/30 hover:border-paper"}`}>
                          <input type="radio" name="type" value={t} data-field={k === 0 ? "type" : undefined} checked={f.type === t} onChange={() => set("type", t)} className="sr-only" />
                          {t}
                        </label>
                      ))}
                    </div>
                    <Err id="c-type-err" msg={errors.type} />
                  </fieldset>
                  <Field n="04" id="c-budget" label="Budget (optional)">
                    <select id="c-budget" value={f.budget} onChange={(e) => set("budget", e.target.value)} className={`${input("budget")} [&>option]:bg-ink`}>
                      <option value="">Select a range</option>
                      {budgets.map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </Field>
                  <Field n="05" id="c-site" label="Site location (optional)">
                    <input id="c-site" value={f.site} onChange={(e) => set("site", e.target.value)} className={input("site")} />
                  </Field>
                  <Field n="06" id="c-brief" label="The brief" error={errors.brief} wide>
                    <textarea id="c-brief" data-field="brief" rows={4} value={f.brief} onChange={(e) => set("brief", e.target.value)} className={`${input("brief")} resize-none`} aria-invalid={!!errors.brief} aria-describedby={errors.brief ? "c-brief-err" : undefined} />
                  </Field>
                  <div className="flex flex-col gap-4 border-t border-paper/20 pt-6 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="label text-paper/60">Demo form — nothing is sent or stored.</p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="label h-12 bg-ochre px-6 text-ink transition-colors duration-300 [clip-path:polygon(0_0,100%_0,100%_65%,calc(100%-14px)_100%,0_100%)] hover:bg-paper disabled:cursor-wait"
                    >
                      {status === "sending" ? "Filing…" : "Submit brief →"}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div key="s" role="status" className="fold-stage text-ink">
                  {[0, 1, 2].map((k) => (
                    <motion.div
                      key={k}
                      initial={{ rotateX: k ? -100 : 0, opacity: k ? 0 : 1, y: k ? 0 : 20 }}
                      animate={{ rotateX: 0, opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: k * 0.35, ease: [0.16, 1, 0.3, 1] }}
                      style={{ transformOrigin: "50% 0%" }}
                      className={`bg-paper px-7 py-6 md:px-9 ${k ? "border-t border-dashed border-ink/25" : ""}`}
                    >
                      {k === 0 && (
                        <>
                          <p className="label text-rust">Brief received — demo</p>
                          <p className="display mt-3 text-[2rem] tracking-[-0.03em]">Thank you, {f.name.trim().split(" ")[0]}.</p>
                        </>
                      )}
                      {k === 1 && (
                        <p className="max-w-[48ch] text-ink/80">
                          In a live site a partner would reply to <span className="serif text-cobalt">{f.email}</span> about your {f.type.toLowerCase()} project
                          within three working days.
                        </p>
                      )}
                      {k === 2 && (
                        <button type="button" onClick={() => { setF(empty); setStatus("idle"); }} className="label draw-link">
                          File another brief →
                        </button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ n, id, label, error, wide, children }: { n: string; id: string; label: string; error?: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="label block text-paper/70">
        <span className="mr-2 text-ochre">{n}</span>
        {label}
      </label>
      {children}
      <Err id={`${id}-err`} msg={error} />
    </div>
  );
}

function Err({ id, msg }: { id: string; msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p id={id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="label mt-2 text-blush">
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
