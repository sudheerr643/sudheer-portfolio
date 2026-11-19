"use client";

import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Bento card with the reference's motion:
 *  - on load, cards start pushed away from the screen centre (60% of their offset) and spring inward
 *  - cards that start below the fold rise in when scrolled to
 *  - hover grows the card 2%, press shrinks it slightly
 */
export function BentoCard({
  children,
  className = "",
  i = 0,
  style,
  pressable = false,
}: {
  children: ReactNode;
  className?: string;
  i?: number;
  style?: CSSProperties;
  pressable?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      controls.set({ opacity: 1, x: 0, y: 0 });
      return;
    }
    const r = el.getBoundingClientRect();
    const spring = { type: "spring", stiffness: 60, damping: 15 } as const;

    if (r.top < window.innerHeight) {
      controls.set({
        x: (r.left + r.width / 2 - window.innerWidth / 2) * 0.6,
        y: (r.top + r.height / 2 - window.innerHeight / 2) * 0.6,
        opacity: 0,
      });
      controls.start({ x: 0, y: 0, opacity: 1, transition: { ...spring, delay: 0.25 + i * 0.04 } });
      return;
    }

    controls.set({ y: 60, opacity: 0 });
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        controls.start({ y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 18 } });
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [controls, i, reduce]);

  return (
    <motion.div
      ref={ref}
      className={`tile relative overflow-hidden p-6 ${className}`}
      style={{ ...style, opacity: 0 }}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      whileTap={pressable ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
