"use client";

// Which template room is on screen (-1 when none). The bottom bar and the
// cursor ring follow it.

let current = -1;
const listeners = new Set<() => void>();

export const getRoom = () => current;
export const getServerRoom = () => -1;

export function setRoom(i: number) {
  if (i === current) return;
  current = i;
  listeners.forEach((l) => l());
}

export function subscribeRoom(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
