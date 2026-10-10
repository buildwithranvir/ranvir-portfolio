"use client";

import { useSyncExternalStore } from "react";
import { site } from "./site";

// Re-check once a minute so the "open now" badge stays honest.
const subscribe = (cb: () => void) => {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
};

const snapshot = () => {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // Monday = 0
  const mins = now.getHours() * 60 + now.getMinutes();
  return `${day}:${mins}`;
};

/**
 * Today's weekday (Monday = 0) and whether the café is open right now.
 * Returns day -1 on the server so nothing time-dependent is pre-rendered.
 */
export function useToday() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "-1:0");
  const [d, m] = value.split(":").map(Number);
  if (d < 0) return { day: -1, open: false, closes: "", opens: "" };
  const h = site.hours[d];
  const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
  const open = m >= toMin(h.open) && m < toMin(h.close);
  return { day: d, open, closes: h.close, opens: h.open };
}
