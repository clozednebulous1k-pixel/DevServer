"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";

type InfiniteTextMarqueeProps = {
  text?: string;
  link?: string;
  speed?: number;
  showTooltip?: boolean;
  tooltipText?: string;
  fontSize?: string;
  textColor?: string;
  hoverColor?: string;
};

export const InfiniteTextMarquee: React.FC<InfiniteTextMarqueeProps> = ({
  text = "Let's Get Started",
  link = "/",
  speed = 30,
  showTooltip = true,
  tooltipText = "Time to Flex💪",
  fontSize = "8rem",
  textColor = "",
  hoverColor = "",
}) => {
  const [cursorPosition, setCursorPosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const [rotation, setRotation] = React.useState(0);
  const [lineHovered, setLineHovered] = React.useState(false);
  const maxRotation = 8;

  const isExternal = link.startsWith("http://") || link.startsWith("https://");

  React.useEffect(() => {
    if (!showTooltip) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });

      const midpoint = window.innerWidth / 2;
      const distanceFromMidpoint = Math.abs(e.clientX - midpoint);
      const rot = (distanceFromMidpoint / midpoint) * maxRotation;

      setRotation(e.clientX > midpoint ? rot : -rot);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showTooltip]);

  const repeatedText = Array(10).fill(text).join(" - ") + " -";

  const resolvedColor =
    lineHovered && hoverColor ? hoverColor : textColor || undefined;

  const content = (
    <span
      className={`m-0 inline-block cursor-pointer py-10 font-bold tracking-tight transition-colors ${
        textColor || hoverColor ? "" : "text-black dark:text-white"
      }`}
      style={{
        fontSize,
        color: resolvedColor,
      }}
      onMouseEnter={() => setLineHovered(true)}
      onMouseLeave={() => setLineHovered(false)}
    >
      {repeatedText}
    </span>
  );

  return (
    <>
      {showTooltip && (
        <div
          className={`following-tooltip fixed z-[99] rounded-3xl px-12 py-6 font-bold text-nowrap transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          } bg-primary text-primary-foreground`}
          style={{
            top: `${cursorPosition.y}px`,
            left: `${cursorPosition.x}px`,
            transform: `rotateZ(${rotation}deg) translate(-50%, -140%)`,
          }}
        >
          <p>{tooltipText}</p>
        </div>
      )}

      <main className="relative w-full overflow-hidden">
        <motion.div
          className="whitespace-nowrap"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{
            x: [0, -1000],
            transition: {
              repeat: Infinity,
              duration: speed,
              ease: "linear",
            },
          }}
        >
          {isExternal ? (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          ) : (
            <Link href={link}>{content}</Link>
          )}
        </motion.div>
      </main>
    </>
  );
};
