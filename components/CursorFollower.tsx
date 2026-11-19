"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/** Is the first opaque background behind this element light? */
function onLightBackground(el: Element | null) {
  let e: Element | null = el;
  while (e && e !== document.body) {
    const m = getComputedStyle(e).backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (m && (m[4] === undefined ? 1 : parseFloat(m[4])) > 0.1) {
      return (+m[1] * 299 + +m[2] * 587 + +m[3] * 114) / 1000 > 180;
    }
    e = e.parentElement;
  }
  return true;
}

/**
 * 96px glass "View project" chip that springs after the pointer — shown only over
 * elements with `data-cursor-text`. Mouse/trackpad only.
 */
export function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [text, setText] = useState("");
  const [light, setLight] = useState(true);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const x = useSpring(mx, { stiffness: 300, damping: 20 });
  const y = useSpring(my, { stiffness: 300, damping: 20 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    let first = true;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      if (first) {
        x.jump(e.clientX);
        y.jump(e.clientY);
        first = false;
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as Element;
      const hit = t.closest?.("[data-cursor-text]");
      setText(hit ? hit.getAttribute("data-cursor-text") ?? "" : "");
      if (hit) {
        // cards declare their media tone so the chip doesn't follow the site theme
        const tone = hit.getAttribute("data-cursor-tone");
        setLight(tone ? tone === "light" : onLightBackground(t));
      }
    };
    const onLeave = () => setText("");
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [mx, my, x, y]);

  if (!enabled) return null;
  const [first, ...rest] = text.split(" ");

  return (
    <motion.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-[100]" style={{ x, y, translateX: "-50%", translateY: "-50%" }}>
      <AnimatePresence>
        {text && (
          <motion.div
            key="cursor-chip"
            className={`glass glass-chip !size-24 ${light ? "glass-light" : "glass-dark"}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <span className="glass-shadow" />
            <span className="glass-surface">
              <span
                className={`glass-content flex-col p-2 text-center text-[14px] leading-tight font-medium ${
                  light ? "text-[#1a73e8]" : "text-white"
                }`}
              >
                <span>{first}</span>
                {rest.length > 0 && <span>{rest.join(" ")}</span>}
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
