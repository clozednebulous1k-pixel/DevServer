"use client";

import { InteractiveRobotSpline } from "@/components/ui/interactive-3d-robot";

/** Cena Spline usada no hero “galaxy” (gradientes + conteúdo sobreposto). */
export const GALAXY_HERO_SCENE = "https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode";

/**
 * Prévia compacta para cards: Spline + gradientes + título (sem navbar completa).
 */
export function GalaxyHeroSplinePreview() {
  return (
    <div className="relative h-full min-h-[160px] w-full overflow-hidden bg-black">
      <InteractiveRobotSpline
        scene={GALAXY_HERO_SCENE}
        className="absolute inset-0 z-0 h-full min-h-[160px] w-full"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.85), transparent 35%, transparent 65%, rgba(0, 0, 0, 0.85)),
            linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.92))
          `,
        }}
      />
      <div className="pointer-events-none absolute bottom-2 left-3 z-10 max-w-[85%]">
        <p className="text-[10px] font-semibold leading-tight text-white drop-shadow-md sm:text-xs">
          Workflow criativo + cena 3D
        </p>
      </div>
    </div>
  );
}
