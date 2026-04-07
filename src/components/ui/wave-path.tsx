"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, type ComponentProps } from "react";

type WavePathProps = ComponentProps<"div">;

export function WavePath({ className, ...props }: WavePathProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef(0);
  const xRef = useRef(0.2);
  const timeRef = useRef(Math.PI / 2);
  const reqIdRef = useRef<number | null>(null);

  const setPath = (p: number) => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth * 0.7;
    const el = pathRef.current;
    if (el) {
      el.setAttributeNS(null, "d", `M0 100 Q${width * xRef.current} ${100 + p * 0.6}, ${width} 100`);
    }
  };

  useEffect(() => {
    setPath(0);
  }, []);

  const resetAnimation = () => {
    timeRef.current = Math.PI / 2;
    progressRef.current = 0;
    if (reqIdRef.current != null) {
      cancelAnimationFrame(reqIdRef.current);
      reqIdRef.current = null;
    }
  };

  const animateOut = () => {
    progressRef.current *= 0.94;
    timeRef.current += 0.18;
    const wave = progressRef.current * Math.sin(timeRef.current);
    setPath(wave);
    if (Math.abs(progressRef.current) > 0.08) {
      reqIdRef.current = requestAnimationFrame(animateOut);
    } else {
      resetAnimation();
      setPath(0);
    }
  };

  const manageMouseEnter = () => {
    if (reqIdRef.current != null) {
      cancelAnimationFrame(reqIdRef.current);
      reqIdRef.current = null;
    }
    resetAnimation();
  };

  const manageMouseMove = (e: React.MouseEvent) => {
    const { movementY, clientX } = e;
    const el = pathRef.current;
    if (!el) return;
    const pathBound = el.getBoundingClientRect();
    xRef.current = (clientX - pathBound.left) / pathBound.width;
    progressRef.current += movementY;
    setPath(progressRef.current);
  };

  const manageMouseLeave = () => {
    animateOut();
  };

  return (
    <div className={cn("relative h-px w-[70vw]", className)} {...props}>
      <div
        onMouseEnter={manageMouseEnter}
        onMouseMove={manageMouseMove}
        onMouseLeave={manageMouseLeave}
        className="relative -top-5 z-10 h-10 w-full hover:-top-[150px] hover:h-[300px]"
        role="presentation"
      />
      <svg className="absolute -top-[100px] h-[300px] w-full text-foreground" aria-hidden>
        <path ref={pathRef} className="fill-none stroke-current" strokeWidth={2} />
      </svg>
    </div>
  );
}
