"use client";

import { motion, useScroll, useTransform } from "motion/react";

/**
 * Linha neon de fundo que desce com o scroll.
 * Dark: branca | Light: preta.
 */
export function GlobalScrollLine() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["-35%", "130%"]);
  const xDrift = useTransform(
    scrollYProgress,
    [0, 0.12, 0.24, 0.38, 0.52, 0.66, 0.8, 0.92, 1],
    [0, 52, -38, 66, -54, 40, -28, 18, 0],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.45, 1, 1, 0.6]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex justify-center">
      <div className="relative h-full w-px bg-black/10 dark:bg-white/15" />
      <motion.div
        style={{ y, x: xDrift, opacity }}
        animate={{
          x: [0, 10, -18, 22, -12, 8, 0],
          rotate: [0, 8, -14, 18, -10, 6, 0],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-1/2 h-44 w-[2px] -translate-x-1/2 rounded-full bg-black shadow-[0_0_10px_rgba(0,0,0,0.65),0_0_28px_rgba(0,0,0,0.35)] dark:bg-white dark:shadow-[0_0_12px_rgba(255,255,255,0.95),0_0_34px_rgba(255,255,255,0.55)]"
      />
    </div>
  );
}
