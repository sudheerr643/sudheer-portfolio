"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { GlassButton, Icon } from "./ui";
import { interests, profile } from "@/lib/content";

const VISIBLE = 4;
// resting / fanned-out pose for each depth in the stack (0 = top)
const REST = [
  { x: 0, rotate: 0 },
  { x: -10, rotate: -8 },
  { x: 10, rotate: 8 },
  { x: 0, rotate: -3 },
];
const FAN = [
  { x: 0, rotate: 0 },
  { x: -34, rotate: -14 },
  { x: 34, rotate: 14 },
  { x: 0, rotate: -6 },
];

/** "Beyond the screen" — a swipeable photo stack of interests. */
export function InterestsCard() {
  const [order, setOrder] = useState(() => interests.map((_, i) => i));
  const [fanned, setFanned] = useState(false);
  const [dragging, setDragging] = useState(false);
  const handle = profile.instagram.replace(/\/$/, "").split("/").pop();
  const active = interests[order[0]];

  const next = () => setOrder((o) => [...o.slice(1), o[0]]);

  return (
    <div className="grid h-[248px] grid-cols-[44%_1fr]" onMouseEnter={() => setFanned(true)} onMouseLeave={() => setFanned(false)}>
      <div className="relative overflow-hidden bg-chip">
        {order
          .slice(0, VISIBLE)
          .map((idx, depth) => ({ idx, depth }))
          .reverse()
          .map(({ idx, depth }) => {
            const pose = (fanned ? FAN : REST)[depth];
            const top = depth === 0;
            return (
              <motion.button
                key={interests[idx].label}
                type="button"
                aria-label={top ? `${interests[idx].label} — show next interest` : undefined}
                tabIndex={top ? 0 : -1}
                className={`absolute top-1/2 left-1/2 aspect-[3/4] h-[70%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-card shadow-[0_10px_24px_-10px_rgba(0,0,0,.5)] ring-[3px] ring-white outline-none focus-visible:ring-orange dark:ring-[#2a2a2a] ${
                  top ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
                }`}
                style={{ zIndex: VISIBLE - depth }}
                initial={false}
                animate={{ x: pose.x, rotate: pose.rotate, scale: 1 - depth * 0.04, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                drag={top ? "x" : false}
                dragSnapToOrigin
                dragElastic={0.6}
                whileHover={top ? { scale: 1.04, y: -4 } : undefined}
                whileTap={top ? { scale: 0.97 } : undefined}
                onDragStart={() => setDragging(true)}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 400) next();
                  setTimeout(() => setDragging(false), 0);
                }}
                onClick={() => {
                  if (!dragging) next();
                }}
              >
                <Image src={interests[idx].img} alt={interests[idx].label} fill sizes="360px" quality={90} className="pointer-events-none object-cover" draggable={false} />
              </motion.button>
            );
          })}
        <span className="pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-2 py-0.5 text-[11px] font-medium text-white tabular-nums backdrop-blur-sm">
          {order[0] + 1}/{interests.length}
        </span>
      </div>

      <div className="flex min-w-0 flex-col justify-between p-6">
        <div>
          <p className="text-[20px] leading-tight font-semibold tracking-[-0.02em]">Beyond the screen</p>
          <div className="mt-2 h-[22px] overflow-hidden text-[14px] text-muted">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={active.label}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                Into <span className="font-medium text-ink">{active.label.toLowerCase()}</span> lately
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="mt-1 text-[12px] text-muted/80">← Swipe or tap the stack</p>
        </div>
        <div className="flex items-center gap-2">
          <GlassButton size="sm" href={profile.instagram} external className="self-start">
            <Icon.instagram className="size-4" />@{handle}
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
