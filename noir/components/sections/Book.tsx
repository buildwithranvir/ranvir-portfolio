"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/lib/site";
import { Drift } from "../motion/Reveal";
import { Eyebrow } from "../ui/Eyebrow";

type Fields = { name: string; email: string; date: string; time: string; note: string };
type Errors = Partial<Record<keyof Fields, string>>;
const empty: Fields = { name: "", email: "", date: "", time: "", note: "" };
const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];
const ease = [0.45, 0.05, 0.25, 1] as const;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "We'll need a name for the table.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "That email doesn't look right.";
  if (!f.date) e.date = "Pick a day.";
  else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${f.date}T00:00:00`) < today) e.date = "That day has already been.";
  }
  if (!f.time) e.time = "Pick a time.";
  return e;
}

/** Booking request on a paper slip with a torn edge. Simulated — nothing is sent. */
export function Book() {
  const [f, setF] = useState<Fields>(empty);
  const [guests, setGuests] = useState(2);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const form = useRef<HTMLFormElement>(null);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setF((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(f);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setTimeout(() => setStatus("done"), 1000);
  };

  const input = (k: keyof Fields) =>
    `w-full border-0 border-b bg-transparent px-0 pb-2 pt-1 text-[1.0625rem] outline-none transition-colors placeholder:text-ink-soft/50 focus:border-ink ${
      errors[k] ? "border-burgundy" : "border-ink/30"
    }`;

  const dateLabel = f.date
    ? new Date(`${f.date}T00:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <section id="book" aria-labelledby="book-title" className="panel relative mx-2 overflow-hidden rounded-[24px] bg-burgundy py-24 text-milk md:mx-4 md:rounded-[28px] md:py-32">
      <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-oat/20 blur-3xl" />
      <div className="wrap relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <Eyebrow n="06" tone="light">Book</Eyebrow>
          <Drift as="h2" id="book-title" className="mt-6 text-[clamp(2rem,3.4vw,3rem)] leading-[1.05]">
            Keep a seat at the long table.
          </Drift>
          <Drift className="mt-6 max-w-[34ch] text-milk/75">
            Most days you can just walk in. For four or more, or a slow Saturday breakfast, leave us a note and we&rsquo;ll
            hold the table for fifteen minutes.
          </Drift>
          <p className="mt-8 text-[0.9375rem] text-milk/75">
            Bigger group or a private morning?{" "}
            <a href={`mailto:${site.email}`} className="ink-link text-milk">
              {site.email}
            </a>
          </p>
          <ul className="glass-dark mt-10 max-w-[24rem] space-y-3 rounded-[18px] p-5 text-[0.9rem]">
            {[
              ["15 min", "We hold the table this long, then it goes to the queue."],
              ["1 – 8", "Guests per request. Bigger groups, email us."],
              ["€0", "No deposit and no card details."],
            ].map(([k, v]) => (
              <li key={k} className="flex gap-4">
                <span className="w-16 shrink-0 font-display text-lg leading-tight">{k}</span>
                <span className="text-milk/75">{v}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The slip */}
        <div className="relative lg:col-span-7 lg:col-start-6">
          <div className="relative rotate-[0.6deg] rounded-[20px] bg-milk text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
            <div className="p-6 md:p-10">
              <div className="flex items-baseline justify-between border-b border-dashed border-ink/30 pb-4">
                <p className="font-display text-2xl">Table request</p>
                <p className="label text-ink-soft">Nº {new Date().getFullYear()}-027</p>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {status !== "done" ? (
                  <motion.form key="form" ref={form} noValidate onSubmit={submit} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease }} className="mt-6 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2" aria-describedby="slip-note">
                    <Field id="b-name" label="Name" error={errors.name}>
                      <input id="b-name" name="name" autoComplete="name" value={f.name} onChange={set("name")} className={input("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "b-name-err" : undefined} />
                    </Field>
                    <Field id="b-email" label="Email" error={errors.email}>
                      <input id="b-email" name="email" type="email" autoComplete="email" value={f.email} onChange={set("email")} className={input("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "b-email-err" : undefined} />
                    </Field>
                    <Field id="b-date" label="Day" error={errors.date}>
                      <input id="b-date" name="date" type="date" value={f.date} onChange={set("date")} className={input("date")} aria-invalid={!!errors.date} aria-describedby={errors.date ? "b-date-err" : undefined} />
                    </Field>
                    <Field id="b-time" label="Time" error={errors.time}>
                      <select id="b-time" name="time" value={f.time} onChange={set("time")} className={input("time")} aria-invalid={!!errors.time} aria-describedby={errors.time ? "b-time-err" : undefined}>
                        <option value="">Choose…</option>
                        {times.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <fieldset className="sm:col-span-2">
                      <legend className="label mb-2 text-ink-soft">How many of you?</legend>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <button
                            key={n}
                            type="button"
                            aria-pressed={guests === n}
                            onClick={() => setGuests(n)}
                            className={`h-10 w-10 rounded-full border text-[0.9375rem] transition-colors duration-300 ${guests === n ? "border-ink bg-ink text-milk" : "border-ink/25 hover:border-ink"}`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <Field id="b-note" label="Anything else? (optional)" wide>
                      <input id="b-note" name="note" value={f.note} onChange={set("note")} placeholder="Birthday, high chair, window seat…" className={input("note")} />
                    </Field>
                    <div className="flex flex-col gap-4 border-t border-dashed border-ink/30 pt-6 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                      <p id="slip-note" className="text-[0.8125rem] text-ink-soft">
                        Demo form: your details stay in this browser and are never sent.
                      </p>
                      <button type="submit" disabled={status === "sending"} className="h-12 shrink-0 whitespace-nowrap rounded-full bg-ink px-7 text-[0.9375rem] text-milk shadow-[0_10px_24px_-12px_rgba(34,22,15,0.7)] transition-colors duration-500 hover:bg-burgundy disabled:cursor-wait">
                        {status === "sending" ? "Writing it in the book…" : "Request the table"}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div key="done" role="status" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="mt-8">
                    <p className="note !text-[2.2rem]">See you soon, {f.name.trim().split(" ")[0]}.</p>
                    <p className="mt-4 max-w-[46ch] text-ink-soft">
                      A table for {guests} on {dateLabel} at {f.time}. In a live site this note would land in our booking book
                      and a confirmation would go to {f.email}. This demo didn&rsquo;t send anything.
                    </p>
                    <button type="button" onClick={() => { setF(empty); setStatus("idle"); setGuests(2); }} className="ink-link mt-6 text-[0.9375rem]">
                      Write another request
                    </button>
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

function Field({ id, label, error, wide, children }: { id: string; label: string; error?: string; wide?: boolean; children: ReactNode }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="label block text-ink-soft">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p id={`${id}-err`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="note mt-1 !text-[1.2rem]">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
