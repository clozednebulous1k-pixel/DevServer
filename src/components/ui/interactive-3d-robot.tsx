"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

export interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  return (
    <Suspense
      fallback={
        <div
          className={`flex h-full w-full items-center justify-center bg-zinc-900 text-muted-foreground ${className ?? ""}`}
        >
          <svg
            className="mr-3 h-5 w-5 animate-spin text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
            />
          </svg>
          Carregando cena 3D…
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}

export const DEFAULT_ROBOT_SCENE = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";
