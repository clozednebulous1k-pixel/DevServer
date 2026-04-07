"use client";

import { motion, type Variants } from "framer-motion";

export interface ImageRevealProps {
  leftImage: string;
  middleImage: string;
  rightImage: string;
}

export default function ImageReveal({ leftImage, middleImage, rightImage }: ImageRevealProps) {
  const containerVariants: Variants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        delay: 0.2,
        staggerChildren: 0.2,
      },
    },
  };

  const leftImageVariants: Variants = {
    initial: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: -8,
      x: -150,
      y: 10,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      rotate: 1,
      x: -160,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const middleImageVariants: Variants = {
    initial: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: 6,
      x: 0,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      rotate: 0,
      x: 0,
      y: -10,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const rightImageVariants: Variants = {
    initial: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: -6,
      x: 200,
      y: 20,
      transition: {
        type: "spring" as const,
        stiffness: 120,
        damping: 12,
      },
    },
    hover: {
      rotate: 3,
      x: 200,
      y: 10,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <motion.div
      className="relative my-12 flex h-64 w-64 items-center justify-center"
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="absolute z-30 h-48 w-48 origin-bottom-right overflow-hidden rounded-xl bg-card shadow-lg"
        variants={leftImageVariants}
        whileHover="hover"
        animate="animate"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={leftImage} alt="" className="rounded-xl object-cover p-2" />
      </motion.div>

      <motion.div
        className="absolute z-20 h-48 w-48 origin-bottom-left overflow-hidden rounded-xl bg-card shadow-lg"
        variants={middleImageVariants}
        whileHover="hover"
        animate="animate"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={middleImage} alt="" className="rounded-2xl object-cover p-2" />
      </motion.div>

      <motion.div
        className="absolute z-10 h-48 w-48 origin-bottom-right overflow-hidden rounded-xl bg-card shadow-lg"
        variants={rightImageVariants}
        whileHover="hover"
        animate="animate"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={rightImage} alt="" className="rounded-2xl object-cover p-2" />
      </motion.div>
    </motion.div>
  );
}
