"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { GlassButton, Icon } from "./ui";
import { experience, profile } from "@/lib/content";

/* ---------------- Theme toggle ---------------- */
export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);

  const set = (v: boolean) => {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    try {
      localStorage.setItem("theme", v ? "dark" : "light");
    } catch {}
  };

  // warm light that follows the pointer across the card (reference "Dark Mode" tile)
  const [glow, setGlow] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      className="absolute inset-0 flex items-center justify-between p-6"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setGlow({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setGlow(null)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: glow ? 1 : 0,
          background: glow
            ? `radial-gradient(circle 80px at ${glow.x}px ${glow.y}px, rgba(255,250,200,${dark ? 0.35 : 0.6}) 0%, rgba(255,250,200,0.1) 60%, transparent 100%)`
            : undefined,
        }}
      />
      <span className="relative z-10 text-[20px] font-semibold tracking-[-0.02em]">Dark Mode</span>

      {/* Glass switch: 84×48 pill, sun / moon at the ends, white knob springs across */}
      <span className="glass glass-btn relative z-10 h-12 w-[84px] shrink-0">
        <span className="glass-shadow" />
        <button
          type="button"
          role="switch"
          aria-checked={dark === true}
          aria-label="Dark mode"
          onClick={() => set(!dark)}
          className="glass-surface"
        >
          <span className="glass-content relative block h-full w-full">
            <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-between px-3">
              <Icon.sun className="size-4 text-[#666]" />
              <Icon.moon className="size-4 text-[#9e9e9e]" />
            </span>
            <motion.span
              aria-hidden
              className="absolute top-[9px] left-[9px] z-10 grid size-[30px] place-items-center rounded-full bg-white text-[#121212] shadow-md"
              initial={false}
              animate={{ x: dark ? 36 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              {dark ? <Icon.moon className="size-3" /> : <Icon.sun className="size-3" />}
            </motion.span>
          </span>
        </button>
      </span>
    </div>
  );
}

/* ---------------- Live clock ---------------- */
function useNow(interval = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), interval);
    return () => clearInterval(id);
  }, [interval]);
  return now;
}

function zoned(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "numeric", second: "numeric", hour12: false }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return { h: get("hour") % 24, m: get("minute"), s: get("second") };
}

export function Clock() {
  const now = useNow();
  const t = now ? zoned(now, profile.timeZone) : { h: 10, m: 10, s: 0 };
  const hourDeg = (t.h % 12) * 30 + t.m * 0.5;
  const minDeg = t.m * 6 + t.s * 0.1;
  const secDeg = t.s * 6;
  const h12 = t.h % 12 || 12;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 120 120" className="size-[120px] shrink-0 drop-shadow-[0_6px_12px_rgba(0,0,0,.14)]" aria-hidden>
        <circle cx="60" cy="60" r="57" className="fill-card stroke-line" strokeWidth="3" />
        <circle cx="60" cy="60" r="51" className="fill-card" />
        {Array.from({ length: 60 }).map((_, i) => (
          <line
            key={i}
            x1="60"
            y1={i % 5 ? 12 : 11}
            x2="60"
            y2={i % 5 ? 15 : 18}
            transform={`rotate(${i * 6} 60 60)`}
            className={i % 5 ? "stroke-muted/50" : "stroke-ink"}
            strokeWidth={i % 5 ? 0.8 : 1.8}
            strokeLinecap="round"
          />
        ))}
        {[12, 3, 6, 9].map((n) => {
          const a = (n / 12) * Math.PI * 2;
          return (
            <text key={n} x={60 + Math.sin(a) * 34} y={60 - Math.cos(a) * 34 + 3.5} textAnchor="middle" className="fill-ink text-[10px] font-semibold">
              {n}
            </text>
          );
        })}
        <line x1="60" y1="60" x2="60" y2="33" transform={`rotate(${hourDeg} 60 60)`} className="stroke-ink" strokeWidth="4" strokeLinecap="round" />
        <line x1="60" y1="60" x2="60" y2="22" transform={`rotate(${minDeg} 60 60)`} className="stroke-ink" strokeWidth="2.6" strokeLinecap="round" />
        <g transform={`rotate(${secDeg} 60 60)`} className={now ? "" : "opacity-0"}>
          <line x1="60" y1="70" x2="60" y2="16" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="60" cy="16" r="2.4" fill="#ef4444" />
        </g>
        <circle cx="60" cy="60" r="3.6" className="fill-ink" />
      </svg>
      <div className="ml-auto self-stretch text-right">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">Time zone • {profile.timeZoneLabel.split(" • ")[0]}</p>
        <p className="mt-1 text-[20px] font-semibold tracking-[-0.02em]">Time in India</p>
        <p className="mt-6 font-semibold tracking-[-0.02em] tabular-nums" suppressHydrationWarning>
          <span className="text-[36px] leading-none">{now ? `${pad(h12)}:${pad(t.m)}:${pad(t.s)}` : "--:--:--"}</span>
          <span className="ml-1 text-xs text-muted">{t.h >= 12 ? "PM" : "AM"}</span>
        </p>
      </div>
    </div>
  );
}

/* ---------------- Experience slider ---------------- */
const YEAR_MS = 365.25 * 24 * 3600 * 1000;
const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const ym = (s: string) => {
  const [y, m] = s.split("-").map(Number);
  return new Date(y, m - 1, 1).getTime();
};

/** Role held at a given moment; during a gap, the most recent role before it. */
function roleAt(t: number) {
  return experience.find((r) => ym(r.start) <= t) ?? experience[experience.length - 1];
}

export function ExperienceRuler() {
  const startMs = new Date(profile.careerStart).getTime();
  const now = useNow(60_000);
  const total = now ? round1((now.getTime() - startMs) / YEAR_MS) : 0;

  // null = "now" (follows total). Starts at 0 so it sweeps in on load.
  const [value, setValue] = useState<number | null>(0);
  const [dragging, setDragging] = useState(false);
  const step = 60; // px per year — 6px between tenth-of-a-year ticks, like the reference
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; v: number } | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setValue(null), 350);
    return () => clearTimeout(id);
  }, []);

  const v = value ?? total;
  const at = startMs + v * YEAR_MS;
  const role = roleAt(at);
  const year = new Date(at).getFullYear();
  const maxYears = Math.ceil(total) + 5;
  const ticks = Array.from({ length: maxYears * 10 + 1 }, (_, i) => i / 10);
  const moved = Math.abs(v - total) > 0.05;

  const onDown = (e: ReactPointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, v };
    setDragging(true);
  };
  const onMove = (e: ReactPointerEvent) => {
    if (!drag.current) return;
    setValue(clamp(drag.current.v - (e.clientX - drag.current.x) / step, 0, total));
  };
  const onUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    setValue(round1(v));
  };
  const onKey = (e: ReactKeyboardEvent) => {
    const map: Record<string, number> = { ArrowLeft: -0.1, ArrowDown: -0.1, ArrowRight: 0.1, ArrowUp: 0.1, PageDown: -1, PageUp: 1 };
    if (e.key in map) setValue(clamp(round1(v + map[e.key]), 0, total));
    else if (e.key === "Home") setValue(0);
    else if (e.key === "End") setValue(null);
    else return;
    e.preventDefault();
  };

  return (
    <div className="relative">
      <div
        ref={box}
        role="slider"
        tabIndex={0}
        aria-label="Years of experience"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={round1(v)}
        aria-valuetext={`${v.toFixed(1)} years — ${role.title} at ${role.company}, ${year}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
        className={`relative h-[62px] touch-none overflow-hidden rounded-lg outline-none select-none focus-visible:ring-2 focus-visible:ring-orange/40 ${
          dragging ? "cursor-grabbing" : "cursor-ew-resize"
        }`}
        style={{
          maskImage: "linear-gradient(to right,transparent 0%,#000 15%,#000 85%,transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right,transparent 0%,#000 15%,#000 85%,transparent 100%)",
        }}
      >
        <div
          className={`absolute top-0 left-1/2 h-full ${dragging ? "" : "transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]"}`}
          style={{ transform: `translateX(${-v * step}px)` }}
        >
          {ticks.map((t) => {
            const tenth = Math.round(t * 10);
            const major = tenth % 10 === 0;
            const half = tenth % 5 === 0 && !major;
            const lit = t <= total + 1e-6;
            return (
              <div key={tenth} className="absolute top-0 flex h-[62px] w-[6px] -translate-x-1/2 flex-col items-center justify-end" style={{ left: t * step }}>
                {major && (
                  <span className={`absolute top-0 text-[14px] leading-none font-semibold tabular-nums ${lit ? "text-orange" : "text-muted/50"}`}>{t}</span>
                )}
                <span
                  className={`rounded-full ${lit ? "bg-orange" : "bg-tick-off"}`}
                  style={{
                    width: major ? 2.5 : 2,
                    height: major ? 42 : half ? 30 : 20,
                    opacity: major ? 1 : half ? 0.7 : 0.4,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
      <span aria-hidden className="absolute top-[68px] left-1/2 -translate-x-1/2 border-x-[6px] border-b-[8px] border-x-transparent border-b-orange" />

      <div className={`absolute top-1 right-0 z-10 transition-all duration-300 ${moved ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"}`}>
        <GlassButton size="icon" label="Reset to today" onClick={() => setValue(null)}>
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4" />
          </svg>
        </GlassButton>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4">
        <a href="#experience" className="group min-w-0">
          <p className="truncate text-[14px] text-muted">{role.company}</p>
          <p className="truncate text-[20px] font-semibold tracking-[-0.02em] group-hover:underline group-hover:underline-offset-4">{role.title}</p>
        </a>
        <div className="shrink-0 text-right leading-none">
          <p className="font-semibold text-orange tabular-nums">
            <span className="text-[32px] tracking-[-0.02em]">{now ? v.toFixed(1) : "–"}</span>
            <span className="ml-0.5 text-[13px]">yr</span>
          </p>
          <p className="mt-1.5 text-[13px] font-medium text-muted tabular-nums" suppressHydrationWarning>
            {now ? year : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Copy email ---------------- */
export function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return (
    <GlassButton onClick={copy}>
      {copied ? <Icon.check className="size-4 text-green-600" /> : <Icon.mail className="size-4" />}
      <span aria-live="polite">{copied ? "Copied!" : "Copy email"}</span>
    </GlassButton>
  );
}
