"use client";

import { ArrowRight } from "lucide-react";
import { useState, Suspense, lazy } from "react";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering })),
);

interface CTASectionProps {
  /** Modo compacto para prévias em cards */
  preview?: boolean;
  className?: string;
}

export function CTASection({ preview = false, className }: CTASectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className={`flex w-full justify-center px-3 py-6 md:px-4 ${preview ? "py-0" : "py-12"} ${className ?? ""}`}
    >
      <div
        className="relative w-full max-w-7xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`relative flex flex-col items-center justify-center overflow-hidden border border-border bg-card shadow-sm duration-500 ${
            preview
              ? "min-h-[220px] rounded-2xl md:min-h-[240px]"
              : "min-h-[480px] rounded-[32px] md:min-h-[560px] md:rounded-[48px]"
          }`}
        >
          <Suspense fallback={<div className="absolute inset-0 bg-muted/30" />}>
            <div className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply dark:opacity-30 dark:mix-blend-screen">
              <Dithering
                colorBack="#00000000"
                colorFront="hsl(142 71% 45%)"
                shape="warp"
                type="4x4"
                speed={isHovered ? 0.6 : 0.2}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>

          <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center md:max-w-4xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm md:mb-6 md:px-4 md:text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              IA para o seu produto
            </div>

            <h2
              className={`font-serif font-medium tracking-tight text-foreground md:leading-[1.05] ${
                preview ? "mb-3 text-2xl md:text-3xl" : "mb-6 text-4xl md:mb-8 md:text-6xl lg:text-7xl"
              }`}
            >
              Suas ideias, <br />
              <span className="text-foreground/80">entregues com precisão.</span>
            </h2>

            <p
              className={`mb-6 max-w-2xl leading-relaxed text-muted-foreground md:mb-10 md:text-lg ${
                preview ? "text-xs md:text-sm" : "text-base md:text-xl"
              }`}
            >
              Hero com shader dithering animado (Paper Design), CTA e tipografia editorial - combine com tema claro/escuro.
            </p>

            <button
              type="button"
              className="group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-all duration-300 hover:bg-primary/90 hover:ring-4 hover:ring-primary/20 active:scale-95 md:h-14 md:gap-3 md:px-12 md:text-base"
            >
              <span className="relative z-10">Começar agora</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
