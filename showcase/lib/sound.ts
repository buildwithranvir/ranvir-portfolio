"use client";

/*
 * The site's sound, synthesised in the browser (no audio files, nothing to
 * download): a loud, cinematic score for the opening film — every hit is
 * scheduled by the film's own timeline, so it stays in sync — a soft ambient
 * bed for the rest of the site, and quiet UI ticks.
 *
 * Browsers only allow sound after a click or tap, so nothing plays until the
 * visitor begins the film (or turns sound on). The on/off choice is remembered.
 */

let ctx: AudioContext | null = null;
let master: GainNode;
let fxBus: GainNode; // UI ticks, scene shutters
let introBus: GainNode; // the opening film
let musicBus: GainNode; // the ambient bed
let verbSend: GainNode;
let noise: AudioBuffer;
let on = false;
const listeners = new Set<(v: boolean) => void>();

export const isSoundOn = () => on;
/** The visitor's choice (default: sound on). */
export function soundPreferred() {
  try {
    return localStorage.getItem("rk-sound") !== "0";
  } catch {
    return true;
  }
}
export function setSoundPreferred(v: boolean) {
  try {
    localStorage.setItem("rk-sound", v ? "1" : "0");
  } catch {}
  listeners.forEach((cb) => cb(on));
}

export function subscribeSound(cb: (v: boolean) => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const bus = (v: number, to: AudioNode) => {
  const g = ctx!.createGain();
  g.gain.value = v;
  g.connect(to);
  return g;
};

/** A stereo reverb tail made from decaying noise. */
function impulse(seconds: number, decay: number) {
  const len = Math.floor(ctx!.sampleRate * seconds);
  const buf = ctx!.createBuffer(2, len, ctx!.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** decay;
  }
  return buf;
}

function build() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC({ latencyHint: "interactive" });
  // a limiter on the way out: loud, never clipping
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -10;
  comp.knee.value = 4;
  comp.ratio.value = 12;
  comp.attack.value = 0.003;
  comp.release.value = 0.2;
  master = ctx.createGain();
  master.gain.value = 0;
  comp.connect(master).connect(ctx.destination);
  fxBus = bus(0.5, comp);
  introBus = bus(1, comp);
  musicBus = bus(0, comp);
  const verb = ctx.createConvolver();
  verb.buffer = impulse(3, 2.6);
  verb.connect(comp);
  verbSend = bus(0.5, verb);

  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

  // a tab in the background goes quiet (and stops using the CPU)
  document.addEventListener("visibilitychange", () => {
    if (!ctx) return;
    if (document.hidden) void ctx.suspend();
    else if (on) void ctx.resume();
  });
}

/**
 * Call from inside a click/tap/keypress: creates and wakes the audio (iPhones
 * included — also past the silent switch) and applies the visitor's choice.
 */
export function unlock(wantSound = soundPreferred()) {
  try {
    const nav = navigator as Navigator & { audioSession?: { type: string } };
    if (nav.audioSession) nav.audioSession.type = "playback";
  } catch {}
  if (!ctx) build();
  void ctx!.resume();
  // a silent blip: older iOS only unlocks once something has actually played
  const s = ctx!.createBufferSource();
  s.buffer = ctx!.createBuffer(1, 1, 22050);
  s.connect(ctx!.destination);
  s.start(0);
  setSound(wantSound);
}

export function setSound(v: boolean) {
  if (v && !ctx) {
    unlock(true);
    return;
  }
  setSoundPreferred(v);
  if (!ctx) return;
  on = v;
  const t = ctx.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setTargetAtTime(v ? 0.9 : 0, t, 0.12);
  if (v) {
    void ctx.resume();
    if (!document.documentElement.classList.contains("intro-playing")) ambient.start();
  }
  listeners.forEach((cb) => cb(v));
}

/* ─────────────────────────── voices ─────────────────────────── */

type Out = AudioNode;
const now = () => ctx!.currentTime;
const live = () => !!ctx && on;

function env(g: AudioParam, t: number, peak: number, attack: number, decay: number) {
  g.setValueAtTime(0.0001, t);
  g.exponentialRampToValueAtTime(peak, t + attack);
  g.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function noiseSrc(t: number, dur: number) {
  const s = ctx!.createBufferSource();
  s.buffer = noise;
  s.loop = true;
  s.start(t, Math.random() * 1.5);
  s.stop(t + dur + 0.05);
  return s;
}

function filter(type: BiquadFilterType, f: number, q = 0.7) {
  const b = ctx!.createBiquadFilter();
  b.type = type;
  b.frequency.value = f;
  b.Q.value = q;
  return b;
}

function pan(v: number, out: Out) {
  const p = "createStereoPanner" in ctx! ? ctx!.createStereoPanner() : null;
  if (!p) return out;
  p.pan.value = v;
  p.connect(out);
  return p;
}

function kick(t: number, out: Out, vol = 1) {
  const o = ctx!.createOscillator();
  const g = ctx!.createGain();
  o.frequency.setValueAtTime(165, t);
  o.frequency.exponentialRampToValueAtTime(42, t + 0.13);
  env(g.gain, t, vol, 0.004, 0.4);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 0.5);
}

function hat(t: number, out: Out, vol = 0.16, decay = 0.05) {
  const g = ctx!.createGain();
  env(g.gain, t, vol, 0.002, decay);
  noiseSrc(t, decay + 0.05)
    .connect(filter("highpass", 7500))
    .connect(g)
    .connect(out);
}

function clap(t: number, out: Out, vol = 0.5) {
  const g = ctx!.createGain();
  env(g.gain, t, vol, 0.003, 0.2);
  const f = filter("bandpass", 1600, 0.9);
  noiseSrc(t, 0.3).connect(f).connect(g);
  g.connect(out);
  g.connect(verbSend);
}

function tone(t: number, f: number, dur: number, out: Out, vol = 0.4, type: OscillatorType = "sine", attack = 0.01) {
  const o = ctx!.createOscillator();
  const g = ctx!.createGain();
  o.type = type;
  o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.setValueAtTime(vol, t + Math.max(attack, dur - 0.08));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.05);
  return g;
}

function whoosh(t: number, dur: number, out: Out, vol = 0.55, up = true, from = -0.8) {
  const f = filter("bandpass", up ? 300 : 5000, 1.3);
  f.frequency.setValueAtTime(up ? 300 : 5000, t);
  f.frequency.exponentialRampToValueAtTime(up ? 5200 : 260, t + dur);
  const g = ctx!.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.6);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const p = ctx!.createStereoPanner?.();
  noiseSrc(t, dur).connect(f).connect(g);
  if (p) {
    p.pan.setValueAtTime(from, t);
    p.pan.linearRampToValueAtTime(-from, t + dur);
    g.connect(p).connect(out);
  } else g.connect(out);
  g.connect(verbSend);
}

function impact(t: number, out: Out, power = 1) {
  // the boom
  const o = ctx!.createOscillator();
  const g = ctx!.createGain();
  o.frequency.setValueAtTime(120, t);
  o.frequency.exponentialRampToValueAtTime(26, t + 0.7);
  env(g.gain, t, 1.1 * power, 0.005, 1.5);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + 1.7);
  // the crack
  const n = ctx!.createGain();
  env(n.gain, t, 0.8 * power, 0.002, 0.45);
  noiseSrc(t, 0.6).connect(filter("lowpass", 1400)).connect(n);
  n.connect(out);
  n.connect(verbSend);
}

const shaper = () => {
  const ws = ctx!.createWaveShaper();
  const c = new Float32Array(1024);
  for (let i = 0; i < 1024; i++) {
    const x = (i / 1023) * 2 - 1;
    c[i] = Math.tanh(x * 3);
  }
  ws.curve = c;
  return ws;
};

/** The cinematic "braam": detuned saws through a filter that opens and closes. */
function braam(t: number, out: Out, dur = 2.4, root = 49, vol = 0.42) {
  const lp = filter("lowpass", 140, 1.2);
  lp.frequency.setValueAtTime(140, t);
  lp.frequency.exponentialRampToValueAtTime(1300, t + 0.22);
  lp.frequency.exponentialRampToValueAtTime(220, t + dur);
  const g = ctx!.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.06);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const ws = shaper();
  ws.connect(lp).connect(g);
  g.connect(out);
  g.connect(verbSend);
  [1, 1.007, 2.003, 1.498, 0.5].forEach((m, i) => {
    const o = ctx!.createOscillator();
    o.type = i === 4 ? "sine" : "sawtooth";
    o.frequency.value = root * m;
    const og = ctx!.createGain();
    og.gain.value = i === 4 ? 0.9 : 0.35;
    o.connect(og).connect(ws);
    o.start(t);
    o.stop(t + dur + 0.1);
  });
}

function riser(t: number, dur: number, out: Out, vol = 0.4) {
  const o = ctx!.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(110, t);
  o.frequency.exponentialRampToValueAtTime(1600, t + dur);
  const lp = filter("lowpass", 600, 4);
  lp.frequency.setValueAtTime(400, t);
  lp.frequency.exponentialRampToValueAtTime(6000, t + dur);
  const g = ctx!.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + dur);
  g.gain.setValueAtTime(vol, t + dur);
  g.gain.linearRampToValueAtTime(0, t + dur + 0.03);
  o.connect(lp).connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.05);
  // the hiss climbing with it
  const n = ctx!.createGain();
  n.gain.setValueAtTime(0.0001, t);
  n.gain.exponentialRampToValueAtTime(vol * 0.7, t + dur);
  n.gain.linearRampToValueAtTime(0, t + dur + 0.03);
  const hp = filter("highpass", 800);
  hp.frequency.setValueAtTime(800, t);
  hp.frequency.exponentialRampToValueAtTime(9000, t + dur);
  noiseSrc(t, dur).connect(hp).connect(n).connect(out);
}

function glitch(t: number, out: Out, n = 8, vol = 0.22) {
  const o = ctx!.createOscillator();
  o.type = "square";
  const g = ctx!.createGain();
  g.gain.value = 0;
  for (let i = 0; i < n; i++) {
    const at = t + i * 0.035;
    o.frequency.setValueAtTime(200 + Math.random() * 2200, at);
    g.gain.setValueAtTime(Math.random() > 0.3 ? vol : 0, at);
  }
  g.gain.setValueAtTime(0, t + n * 0.035);
  o.connect(filter("lowpass", 4000))
    .connect(g)
    .connect(pan(Math.random() * 1.2 - 0.6, out));
  o.start(t);
  o.stop(t + n * 0.035 + 0.05);
}

function shimmer(t: number, notes: number[], step: number, out: Out, vol = 0.18) {
  notes.forEach((f, i) => {
    const g = tone(t + i * step, f, 1.4, out, vol, "triangle", 0.006);
    g.connect(verbSend);
  });
}

function tick(t: number, out: Out, vol = 0.22) {
  const g = ctx!.createGain();
  env(g.gain, t, vol, 0.001, 0.012);
  noiseSrc(t, 0.03)
    .connect(filter("bandpass", 3200, 2))
    .connect(g)
    .connect(out);
}

const note = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/* ─────────────────────────── the opening film's score ─────────────────────────── */

let silenced = false;
const cue =
  <A extends unknown[]>(fn: (t: number, ...a: A) => void) =>
  (...a: A) => {
    if (!live() || silenced) return;
    fn(now(), ...a);
  };

export const intro = {
  /** Called when the film starts rolling. */
  begin() {
    silenced = false;
    if (!ctx) return;
    introBus.gain.cancelScheduledValues(now());
    introBus.gain.setValueAtTime(1, now());
    ambient.stop();
  },
  /** the click that begins it: an instant thump and the projector motor spinning up */
  power: cue((t) => {
    kick(t, introBus, 0.9);
    const o = ctx!.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(30, t);
    o.frequency.exponentialRampToValueAtTime(110, t + 1.2);
    const g = ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    o.connect(filter("lowpass", 500)).connect(g).connect(introBus);
    o.start(t);
    o.stop(t + 1.7);
  }),
  /** 0s: the projector starts — gate clatter and a drone that climbs. */
  leader: cue((t) => {
    for (let i = 0; i < 28; i++) tick(t + i * 0.083, introBus, 0.08 + (i % 2) * 0.05);
    const g = tone(t, note(33), 2.4, introBus, 0.32, "sawtooth", 0.6);
    const lp = filter("lowpass", 200);
    g.disconnect();
    g.connect(lp).connect(introBus);
  }),
  /** each count: the classic leader beep, a thump */
  count: cue((t, i: number) => {
    tone(t, 1000, 0.1, introBus, 0.32, "sine", 0.003);
    kick(t, introBus, 0.55 + i * 0.15);
  }),
  /** 2.3s: the leader zooms away */
  out: cue((t) => whoosh(t, 0.45, introBus, 0.6, false, 0)),
  /** 2.6s: the montage's beat — scheduled in one go, one bar per cut */
  montage: cue((t, cuts: number, step: number, every: number) => {
    const bass = [33, 33, 29, 29, 36, 36, 31, 31];
    for (let i = 0; i < cuts; i++) {
      const at = t + i * step;
      kick(at, introBus, 1);
      hat(at + step / 2, introBus, 0.2);
      hat(at + step * 0.75, introBus, 0.1);
      if (i % 2) clap(at, introBus, 0.45);
      const b = tone(at, note(bass[Math.floor(i / 2) % 8]), step * 0.95, introBus, 0.45, "sawtooth", 0.005);
      b.disconnect();
      b.connect(filter("lowpass", 420, 2)).connect(introBus);
      if (i % every === 0) whoosh(at - 0.04, 0.4, introBus, 0.4, (i / every) % 2 === 0, (i / every) % 2 ? 0.7 : -0.7);
    }
    // the reverse swell into the drop
    const end = t + cuts * step;
    const n = ctx!.createGain();
    n.gain.setValueAtTime(0.0001, end - 0.7);
    n.gain.exponentialRampToValueAtTime(0.5, end + 0.25);
    n.gain.linearRampToValueAtTime(0, end + 0.28);
    noiseSrc(end - 0.7, 1)
      .connect(filter("highpass", 3500))
      .connect(n)
      .connect(introBus);
  }),
  /** each slide lands: a hit — and a glitch as the AI slide decodes its word */
  slide: cue((t, i: number) => {
    impact(t + 0.05, introBus, 0.4);
    if (i === 2) glitch(t + 0.15, introBus, 14, 0.16);
    else
      shimmer(
        t + 0.5,
        [64, 69, 72].map((m) => note(m + i * 2)),
        0.05,
        introBus,
        0.1,
      );
  }),
  /** the drop — the sites fly in */
  assembly: cue((t) => {
    impact(t, introBus, 1.1);
    braam(t, introBus, 2.6, 41);
    [0, 0.09, 0.18, 0.27].forEach((d, i) => whoosh(t + d, 0.5, introBus, 0.35, true, i % 2 ? 0.8 : -0.8));
  }),
  /** "Infinite sites. One developer." */
  claim: cue((t) => {
    shimmer(t, [69, 72, 76, 79, 84].map(note), 0.07, introBus, 0.16);
    tone(t, note(45), 1.1, introBus, 0.25, "sine", 0.2);
  }),
  /** the climb into the title */
  rise: cue((t, dur: number) => riser(t, dur, introBus, 0.45)),
  /** the name: impact, braam, the letters glitching into place */
  title: cue((t) => {
    impact(t, introBus, 1.3);
    braam(t, introBus, 3, 36, 0.5);
    glitch(t + 0.05, introBus, 10);
    for (let i = 0; i < 13; i++) tick(t + 0.08 + i * 0.045, introBus, 0.18);
  }),
  /** the name stretching to full width */
  stretch: cue((t) => shimmer(t, [57, 64, 69, 71, 76, 81, 88].map(note), 0.05, introBus, 0.14)),
  /** the pull-back into the site */
  land: cue((t) => {
    whoosh(t, 0.9, introBus, 0.7, false, 0);
    impact(t + 0.75, introBus, 0.9);
    tone(t + 0.75, note(33), 2.5, introBus, 0.3, "sine", 0.01);
  }),
  /** skipped: the score fades out at once */
  skip() {
    silenced = true;
    if (!ctx) return;
    const t = now();
    introBus.gain.cancelScheduledValues(t);
    introBus.gain.setTargetAtTime(0, t, 0.06);
    if (live()) whoosh(t, 0.5, fxBus, 0.5, false, 0);
  },
  /** the film is over: the site's ambient bed fades in */
  end() {
    if (live()) setTimeout(() => ambient.start(), 900);
  },
};

/* ─────────────────────────── the ambient bed ─────────────────────────── */

// slow minor-key chords, a few voices each; sparse bell notes on top
const chords = [
  [45, 52, 55, 59, 64],
  [41, 48, 52, 57, 60],
  [36, 43, 52, 55, 59],
  [43, 50, 55, 59, 62],
];
const bells = [69, 72, 74, 76, 79, 81, 84];

export const ambient = {
  timer: 0 as ReturnType<typeof setInterval> | 0,
  bellTimer: 0 as ReturnType<typeof setTimeout> | 0,
  start() {
    if (!ctx || ambient.timer) return;
    const t = now();
    musicBus.gain.cancelScheduledValues(t);
    musicBus.gain.setValueAtTime(Math.max(0.0001, musicBus.gain.value), t);
    musicBus.gain.linearRampToValueAtTime(0.2, t + 4);
    let k = 0;
    const LEN = 8;
    const chord = (at: number) => {
      const lp = filter("lowpass", 700, 0.6);
      // a slow sweep, so no two bars sound quite alike
      lp.frequency.setValueAtTime(500, at);
      lp.frequency.linearRampToValueAtTime(900 + Math.random() * 500, at + LEN / 2);
      lp.frequency.linearRampToValueAtTime(500, at + LEN + 3);
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(0.16, at + 3);
      g.gain.setValueAtTime(0.16, at + LEN);
      g.gain.exponentialRampToValueAtTime(0.0001, at + LEN + 3);
      lp.connect(g).connect(musicBus);
      g.connect(verbSend);
      chords[k++ % chords.length].forEach((m, i) => {
        [-6, 6].forEach((cents) => {
          const o = ctx!.createOscillator();
          o.type = i === 0 ? "sine" : "triangle";
          o.frequency.value = note(m);
          o.detune.value = cents;
          const og = ctx!.createGain();
          og.gain.value = i === 0 ? 0.5 : 0.18;
          o.connect(og).connect(lp);
          o.start(at);
          o.stop(at + LEN + 3.2);
        });
      });
    };
    chord(t + 0.05);
    ambient.timer = setInterval(() => {
      if (ctx && ctx.state === "running") chord(now() + 0.05);
    }, LEN * 1000);
    const bell = () => {
      if (ctx && ctx.state === "running" && on) {
        const g = tone(now(), note(bells[Math.floor(Math.random() * bells.length)]), 2.6, musicBus, 0.07, "sine", 0.004);
        g.connect(verbSend);
      }
      ambient.bellTimer = setTimeout(bell, 1800 + Math.random() * 2600);
    };
    ambient.bellTimer = setTimeout(bell, 2500);
  },
  stop() {
    if (!ctx) return;
    clearInterval(ambient.timer as ReturnType<typeof setInterval>);
    clearTimeout(ambient.bellTimer as ReturnType<typeof setTimeout>);
    ambient.timer = 0;
    ambient.bellTimer = 0;
    musicBus.gain.cancelScheduledValues(now());
    musicBus.gain.setTargetAtTime(0, now(), 0.4);
  },
};

/* ─────────────────────────── the site's small sounds ─────────────────────────── */

/** A short shutter tick for scene cuts. */
export function shutter() {
  if (!live() || document.documentElement.classList.contains("intro-playing")) return;
  tick(now(), fxBus, 0.3);
}
/** One split-flap character landing on the contact board. */
export function flapTick() {
  if (!live()) return;
  tick(now(), fxBus, 0.1);
}
/** The lamp's cord being pulled: a short zip of the chain. */
export function lampPull() {
  if (!live()) return;
  const t = now();
  for (let i = 0; i < 4; i++) tick(t + i * 0.022, fxBus, 0.12 + i * 0.03);
}
/** The house lights: a switch clacks, then the light hums up (a bright little chime) or fades down. */
export function lightSwitch(up: boolean) {
  if (!live()) return;
  const t = now();
  // the clack
  tick(t, fxBus, 0.45);
  tick(t + 0.035, fxBus, 0.3);
  kick(t, fxBus, 0.22);
  if (up) {
    // a lamp striking, then a warm major chime
    hat(t + 0.06, fxBus, 0.08, 0.03);
    hat(t + 0.11, fxBus, 0.06, 0.03);
    shimmer(t + 0.12, [note(72), note(76), note(79), note(84)], 0.06, fxBus, 0.09);
  } else {
    // the light sinks away
    const o = ctx!.createOscillator();
    const g = ctx!.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(note(76), t + 0.05);
    o.frequency.exponentialRampToValueAtTime(note(52), t + 0.6);
    env(g.gain, t + 0.05, 0.12, 0.02, 0.6);
    o.connect(g).connect(fxBus);
    g.connect(verbSend);
    o.start(t + 0.05);
    o.stop(t + 0.75);
  }
}
/** Hovering a link or button. */
export function uiHover() {
  if (!live()) return;
  tone(now(), 2400, 0.03, fxBus, 0.05, "sine", 0.002);
}
/** Clicking a link or button. */
export function uiClick() {
  if (!live()) return;
  const t = now();
  const o = ctx!.createOscillator();
  const g = ctx!.createGain();
  o.frequency.setValueAtTime(900, t);
  o.frequency.exponentialRampToValueAtTime(320, t + 0.07);
  env(g.gain, t, 0.18, 0.002, 0.09);
  o.connect(g).connect(fxBus);
  o.start(t);
  o.stop(t + 0.12);
}
