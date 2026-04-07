"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";

type HlsVideoProps = Omit<React.ComponentPropsWithoutRef<"video">, "src"> & {
  src: string;
  className?: string;
};

/**
 * Vídeo HLS com hls.js; Safari nativo usa src direto no .m3u8.
 */
export function HlsVideo({ src, className, muted = true, playsInline = true, poster, ...rest }: HlsVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      const onMeta = () => {
        video.play().catch(() => {});
      };
      video.addEventListener("loadedmetadata", onMeta);
      return () => video.removeEventListener("loadedmetadata", onMeta);
    }

    return () => {
      hls?.destroy();
      hls = null;
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={cn(className)}
      muted={muted}
      playsInline={playsInline}
      poster={poster}
      loop
      {...rest}
    />
  );
}
