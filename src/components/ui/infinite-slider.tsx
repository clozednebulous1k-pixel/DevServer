"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { cn } from "@/lib/utils";

function speedToDuration(speed: number): number {
  const s = Math.max(1, speed);
  return Math.min(80, Math.max(4, 240 / s));
}

type InfiniteSliderProps = {
  children: React.ReactNode;
  gap?: number;
  /** Duração em segundos para um ciclo (quanto maior, mais lento). */
  duration?: number;
  durationOnHover?: number;
  /** Atalho: número maior = scroll mais rápido (mapeado para duration). */
  speed?: number;
  speedOnHover?: number;
  direction?: "horizontal" | "vertical";
  reverse?: boolean;
  className?: string;
};

export function InfiniteSlider({
  children,
  gap = 16,
  duration: durationProp,
  durationOnHover: durationOnHoverProp,
  speed,
  speedOnHover,
  direction = "horizontal",
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const duration = durationProp ?? (speed !== undefined ? speedToDuration(speed) : 25);
  const durationOnHover =
    durationOnHoverProp ?? (speedOnHover !== undefined ? speedToDuration(speedOnHover) : undefined);

  const [currentDuration, setCurrentDuration] = useState(duration);
  const [ref, { width, height }] = useMeasure();
  const translation = useMotionValue(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setCurrentDuration(duration);
  }, [duration]);

  useEffect(() => {
    let controls: ReturnType<typeof animate> | undefined;
    const size = direction === "horizontal" ? width : height;
    const contentSize = size + gap;
    const from = reverse ? -contentSize / 2 : 0;
    const to = reverse ? 0 : -contentSize / 2;

    if (size === 0) return;

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: "linear",
        duration: currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => {
          setIsTransitioning(false);
          setKey((k) => k + 1);
        },
      });
    } else {
      controls = animate(translation, [from, to], {
        ease: "linear",
        duration: currentDuration,
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 0,
        onRepeat: () => {
          translation.set(from);
        },
      });
    }

    return () => controls?.stop();
  }, [key, translation, currentDuration, width, height, gap, isTransitioning, direction, reverse]);

  const hoverProps =
    durationOnHover !== undefined
      ? {
          onHoverStart: () => {
            setIsTransitioning(true);
            setCurrentDuration(durationOnHover);
          },
          onHoverEnd: () => {
            setIsTransitioning(true);
            setCurrentDuration(duration);
          },
        }
      : {};

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        ref={ref}
        className="flex w-max"
        style={{
          ...(direction === "horizontal" ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
