"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type VideoFadeMp4Props = React.ComponentPropsWithoutRef<"video"> & {
  src: string;
  fadeInSec?: number;
  fadeOutSec?: number;
  restartDelayMs?: number;
  className?: string;
};

/**
 * Loop com fade-in no início e fade-out no fim (requestAnimationFrame).
 */
export function VideoFadeMp4({
  src,
  fadeInSec = 0.5,
  fadeOutSec = 0.5,
  restartDelayMs = 100,
  className,
  muted = true,
  playsInline = true,
  autoPlay = true,
  ...rest
}: VideoFadeMp4Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const tick = () => {
      const v = ref.current;
      if (!v || !v.duration || !Number.isFinite(v.duration)) {
        raf.current = requestAnimationFrame(tick);
        return;
      }
      const t = v.currentTime;
      const d = v.duration;
      const fi = fadeInSec;
      const fo = fadeOutSec;
      let o = 1;
      if (t < fi) o = t / fi;
      else if (t > d - fo) o = Math.max(0, (d - t) / fo);
      v.style.opacity = String(o);
      raf.current = requestAnimationFrame(tick);
    };

    const onEnded = () => {
      const v = ref.current;
      if (!v) return;
      v.style.opacity = "0";
      window.setTimeout(() => {
        v.currentTime = 0;
        v.play().catch(() => {});
      }, restartDelayMs);
    };

    video.addEventListener("ended", onEnded);
    raf.current = requestAnimationFrame(tick);

    if (autoPlay) video.play().catch(() => {});

    return () => {
      video.removeEventListener("ended", onEnded);
      cancelAnimationFrame(raf.current);
    };
  }, [src, fadeInSec, fadeOutSec, restartDelayMs, autoPlay]);

  return (
    <video
      ref={ref}
      src={src}
      className={cn(className)}
      muted={muted}
      playsInline={playsInline}
      {...rest}
    />
  );
}
