"use client";

import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ElementType } from "react";

type TimelineContentProps<T extends ElementType> = {
  as?: T;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement | null>;
  customVariants?: {
    visible: (i: number) => Record<string, unknown>;
    hidden: Record<string, unknown>;
  };
} & Omit<HTMLMotionProps<"div">, "as">;

export function TimelineContent<T extends ElementType = "div">({
  as,
  animationNum = 0,
  timelineRef: _timelineRef,
  customVariants,
  children,
  ...props
}: TimelineContentProps<T>) {
  const Comp = motion.create((as || "div") as ElementType);

  return (
    <Comp
      variants={customVariants}
      custom={animationNum}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      {...props}
    >
      {children}
    </Comp>
  );
}
