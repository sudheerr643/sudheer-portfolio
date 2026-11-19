"use client";

import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./ui";

const H = 30; // height of the flight-path box
const PAD = 5; // inset of the end dots

/** Point + heading on the dashed arc at t∈[0,1] (cubic Bézier). */
function arc(w: number, t: number) {
  const p0 = { x: PAD, y: H - 8 };
  const p1 = { x: w * 0.3, y: 0 };
  const p2 = { x: w * 0.7, y: 0 };
  const p3 = { x: w - PAD, y: H - 8 };
  const u = 1 - t;
  const x = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
  const y = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;
  const dx = 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const dy = 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/**
 * IND → ANY location tile. On hover (or tap) the plane flies along the dashed
 * arc to the destination; on leave it flies back to the start.
 */
export function LocationTile({ from = "IND", fromLabel = "India", to = "ANY", toLabel = "Remote" }) {
  const track = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(120);
  const progress = useMotionValue(0);
  const flying = useRef(false);

  useEffect(() => {
    if (!track.current) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(40, e.contentRect.width)));
    ro.observe(track.current);
    return () => ro.disconnect();
  }, []);

  // keep the plane a little off the dots at both ends
  const t0 = 0.04;
  const t1 = 0.93;
  const x = useTransform(progress, (p) => arc(w, t0 + (t1 - t0) * p).x);
  const y = useTransform(progress, (p) => arc(w, t0 + (t1 - t0) * p).y);
  const rotate = useTransform(progress, (p) => arc(w, t0 + (t1 - t0) * p).angle + 90);

  const fly = (go: boolean) => {
    flying.current = go;
    animate(progress, go ? 1 : 0, { duration: go ? 1.1 : 0.9, ease: [0.45, 0, 0.2, 1] });
  };

  const d = `M ${PAD} ${H - 8} C ${w * 0.3} 0, ${w * 0.7} 0, ${w - PAD} ${H - 8}`;

  return (
    <div
      className="flex h-full flex-col justify-center"
      onMouseEnter={() => fly(true)}
      onMouseLeave={() => fly(false)}
      onClick={() => fly(!flying.current)}
    >
      <div className="flex justify-between text-[24px] leading-none font-semibold tracking-[-0.02em] sm:text-[28px]">
        <span>{from}</span>
        <span>{to}</span>
      </div>
      <div className="mt-1 flex items-end gap-1.5 text-[13px] leading-none text-muted">
        <span className="shrink-0 pb-[4px]">{fromLabel}</span>
        <div ref={track} className="relative min-w-0 flex-1" style={{ height: H }} aria-hidden>
          <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} className="absolute inset-0 overflow-visible">
            <path d={d} fill="none" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 4" strokeLinecap="round" />
            <circle cx={PAD} cy={H - 8} r="2.6" className="fill-muted" />
            <circle cx={w - PAD} cy={H - 8} r="2.6" className="fill-muted" />
          </svg>
          <motion.span
            className="absolute top-0 left-0 grid size-[22px] place-items-center rounded-full bg-card shadow-[0_0_0_1px_var(--line),0_2px_6px_-1px_rgba(0,0,0,.18)]"
            style={{ x, y, translateX: "-50%", translateY: "-50%" }}
          >
            <motion.span style={{ rotate }} className="grid place-items-center">
              <Icon.plane className="size-[13px] text-ink" />
            </motion.span>
          </motion.span>
        </div>
        <span className="shrink-0 pb-[4px]">{toLabel}</span>
      </div>
    </div>
  );
}
