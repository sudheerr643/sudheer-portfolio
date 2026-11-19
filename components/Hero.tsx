"use client";

import { motion, useAnimation, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { GlassButton, Icon, Logo } from "./ui";
import { CopyEmail } from "./widgets";
import { profile } from "@/lib/content";

const PASTELS = ["#FFD6FF", "#E7C6FF", "#C8B6FF", "#B8C0FF", "#BBD0FF"];
const COLOR_ORDER = [0, 2, 1, 4, 3, 0, 2, 1, 4, 3, 0];
const DELAYS = [0.1, 0.6, 0.2, 1, 0.4, 1.2, 0.15, 0.8, 0.3, 0.9, 0.5];

/** Word whose letters blink through a pastel palette on hover. */
function BlinkWord({ word, dark }: { word: string; dark: boolean }) {
  const controls = useAnimation();
  const base = dark ? "#ffffff" : "#121212";
  // re-apply the resting colour when the theme flips
  useEffect(() => {
    controls.set({ color: base });
  }, [base, controls]);
  return (
    <motion.span onMouseEnter={() => controls.start("blink")} onTouchStart={() => controls.start("blink")} className="inline-block cursor-pointer">
      {word.split("").map((ch, i) => {
        const variants: Variants = {
          rest: { color: base },
          blink: {
            color: [base, PASTELS[COLOR_ORDER[i % COLOR_ORDER.length]], base],
            transition: { duration: 0.6, delay: DELAYS[i % DELAYS.length], ease: "easeInOut", repeat: 1, repeatDelay: 0.1 },
          },
        };
        return (
          <motion.span key={i} variants={variants} initial="rest" animate={controls} className="inline-block" style={{ color: base }}>
            {ch}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

const bounce: Variants = {
  rest: { scale: 1, y: 0 },
  hover: (i: number) => ({ scale: 1.3, y: -5, transition: { delay: i * 0.03, type: "spring", stiffness: 300, damping: 10 } }),
};

/** Word whose letters pop up and grow, springy, on hover. */
function BounceWord({ word }: { word: string }) {
  return (
    <motion.span className="inline-block cursor-pointer" initial="rest" animate="rest" whileHover="hover" whileTap="hover">
      {word.split("").map((ch, i) => (
        <motion.span key={i} custom={i} variants={bounce} className="inline-block origin-bottom">
          {ch}
        </motion.span>
      ))}
      <span>.</span>
    </motion.span>
  );
}

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setDark(el.classList.contains("dark"));
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return dark;
}

const chipSpring = { type: "spring", stiffness: 300, damping: 15 } as const;

export function Hero() {
  const dark = useIsDark();
  return (
    <motion.div
      className="flex flex-col gap-4 pt-[60px] pb-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.4 }}
    >
      <motion.a href="#about" aria-label="About Sudheer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mb-4 inline-block w-fit">
        <Logo className="h-[34px] w-auto" />
      </motion.a>

      <h1 className="text-[clamp(40px,3.9vw,56px)] leading-[1.1] font-semibold tracking-[-0.04em] text-ink">
        <span className="block">{profile.headline[0]}</span>
        <span className="block">
          I design <BlinkWord word="experiences" dark={dark} /> that <BounceWord word="convert" />
        </span>
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px]">
        <span>Currently at</span>
        <motion.span
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white py-1 pr-4 pl-2 tracking-[0.02em] text-[#121212] shadow-sm"
          style={{ rotate: 2 }}
          whileHover={{ rotate: 0, scale: 1.05 }}
          transition={chipSpring}
        >
          <span className="live-dot ml-1 size-2 rounded-full bg-green-500" />
          {profile.currently}
        </motion.span>
        <motion.span
          className="inline-block cursor-pointer rounded-full bg-[#aabfff] px-4 py-1 tracking-[0.02em] text-[#0f3884] shadow-sm dark:bg-[#aec2fe] dark:text-[#283c6f]"
          style={{ rotate: -2 }}
          whileHover={{ rotate: 0, scale: 1.05 }}
          transition={chipSpring}
        >
          {profile.previously}
        </motion.span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <CopyEmail />
        <GlassButton href={profile.resume} download>
          <Icon.download className="size-4" />
          Download resume
        </GlassButton>
      </div>
    </motion.div>
  );
}
