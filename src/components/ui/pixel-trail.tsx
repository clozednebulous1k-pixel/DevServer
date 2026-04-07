"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDimensions } from "@/components/hooks/use-debounced-dimensions";

interface PixelTrailProps {
  pixelSize: number;
  fadeDuration?: number;
  delay?: number;
  className?: string;
  pixelClassName?: string;
  /** Limita eventos de ponteiro (ms). Reduz CPU em páginas com muitos pixels. */
  pointerThrottleMs?: number;
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  pixelSize = 20,
  fadeDuration = 500,
  delay = 0,
  className,
  pixelClassName,
  pointerThrottleMs = 0,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);
  const trailId = useId().replace(/:/g, "");

  const paintAtPointer = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.floor((clientX - rect.left) / pixelSize);
      const y = Math.floor((clientY - rect.top) / pixelSize);

      const pixelElement = document.getElementById(`${trailId}-pixel-${x}-${y}`);
      if (pixelElement) {
        const animatePixel = (pixelElement as HTMLElement & { __animatePixel?: () => void }).__animatePixel;
        if (animatePixel) animatePixel();
      }
    },
    [pixelSize],
  );

  useEffect(() => {
    let last = 0;
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerThrottleMs > 0) {
        const now = performance.now();
        if (now - last < pointerThrottleMs) return;
        last = now;
      }
      paintAtPointer(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [paintAtPointer, pointerThrottleMs]);

  const columns = useMemo(() => Math.ceil(dimensions.width / pixelSize), [dimensions.width, pixelSize]);
  const rows = useMemo(() => Math.ceil(dimensions.height / pixelSize), [dimensions.height, pixelSize]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 h-full w-full pointer-events-none", className)}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <PixelDot
              key={`${colIndex}-${rowIndex}`}
              id={`${trailId}-pixel-${colIndex}-${rowIndex}`}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
              className={pixelClassName}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

interface PixelDotProps {
  id: string;
  size: number;
  fadeDuration: number;
  delay: number;
  className?: string;
}

const PixelDot: React.FC<PixelDotProps> = React.memo(({ id, size, fadeDuration, delay, className }) => {
  const controls = useAnimationControls();

  const animatePixel = useCallback(() => {
    controls.start({
      opacity: [1, 0],
      transition: { duration: fadeDuration / 1000, delay: delay / 1000 },
    });
  }, [controls, delay, fadeDuration]);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        (node as HTMLDivElement & { __animatePixel?: () => void }).__animatePixel = animatePixel;
      }
    },
    [animatePixel],
  );

  return (
    <motion.div
      id={id}
      ref={ref}
      className={cn("cursor-pointer-none", className)}
      style={{ width: `${size}px`, height: `${size}px` }}
      initial={{ opacity: 0 }}
      animate={controls}
      exit={{ opacity: 0 }}
    />
  );
});

PixelDot.displayName = "PixelDot";
export { PixelTrail };
