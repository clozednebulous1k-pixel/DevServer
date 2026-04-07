"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type LazyPreviewProps = {
  children: React.ReactNode;
  className?: string;
  minHeight?: number;
  /** Margem extra antes de montar a prévia (px) */
  rootMargin?: string;
};

/**
 * Só monta `children` quando o bloco entra no viewport — evita 10+ WebGL/canvas/Spline ao mesmo tempo.
 */
export function LazyPreview({
  children,
  className,
  minHeight = 168,
  rootMargin = "100px 0px",
}: LazyPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [visible, rootMargin]);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ minHeight }}
    >
      {!visible && (
        <div
          className="absolute inset-0 z-[1] flex items-center justify-center bg-muted/25 text-xs text-muted-foreground"
          style={{ minHeight }}
        >
          Prévia ao rolar…
        </div>
      )}
      {visible ? children : null}
    </div>
  );
}
