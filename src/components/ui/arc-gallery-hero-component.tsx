"use client";

import React, { useEffect, useState } from "react";

export type ArcGalleryHeroProps = {
  images: string[];
  startAngle?: number;
  endAngle?: number;
  radiusLg?: number;
  radiusMd?: number;
  radiusSm?: number;
  cardSizeLg?: number;
  cardSizeMd?: number;
  cardSizeSm?: number;
  className?: string;
};

export function ArcGalleryHero({
  images,
  startAngle = 20,
  endAngle = 160,
  radiusLg = 480,
  radiusMd = 360,
  radiusSm = 260,
  cardSizeLg = 120,
  cardSizeMd = 100,
  cardSizeSm = 80,
  className = "",
}: ArcGalleryHeroProps) {
  const [dimensions, setDimensions] = useState({
    radius: radiusLg,
    cardSize: cardSizeLg,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({ radius: radiusSm, cardSize: cardSizeSm });
      } else if (width < 1024) {
        setDimensions({ radius: radiusMd, cardSize: cardSizeMd });
      } else {
        setDimensions({ radius: radiusLg, cardSize: cardSizeLg });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

  const count = Math.max(images.length, 2);
  const step = (endAngle - startAngle) / (count - 1);

  return (
    <section
      className={`relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground ${className}`}
    >
      <div
        className="relative mx-auto"
        style={{
          width: "100%",
          height: dimensions.radius * 1.2,
        }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
          {images.map((src, i) => {
            const angle = startAngle + step * i;
            const angleRad = (angle * Math.PI) / 180;

            const x = Math.cos(angleRad) * dimensions.radius;
            const y = Math.sin(angleRad) * dimensions.radius;

            return (
              <div
                key={i}
                className="animate-fade-in-up absolute opacity-0"
                style={{
                  width: dimensions.cardSize,
                  height: dimensions.cardSize,
                  left: `calc(50% + ${x}px)`,
                  bottom: `${y}px`,
                  transform: `translate(-50%, 50%)`,
                  animationDelay: `${i * 100}ms`,
                  animationFillMode: "forwards",
                  zIndex: count - i,
                }}
              >
                <div
                  className="h-full w-full overflow-hidden rounded-2xl bg-card shadow-xl ring-1 ring-border transition-transform hover:scale-105"
                  style={{ transform: `rotate(${angle / 4}deg)` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Memory ${i + 1}`}
                    className="block h-full w-full object-cover"
                    draggable={false}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x400/334155/e2e8f0?text=Memory";
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative z-10 -mt-40 flex flex-1 items-center justify-center px-6 md:-mt-52 lg:-mt-64">
        <div
          className="animate-fade-in max-w-2xl px-6 text-center opacity-0"
          style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Rediscover Your Memories with AI
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Our intelligent platform finds, organizes, and brings your most cherished moments back to life.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              className="w-full rounded-full bg-indigo-600 px-6 py-3 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl sm:w-auto dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Explore Your Past
            </button>
            <button
              type="button"
              className="w-full rounded-full border border-border px-6 py-3 transition-all duration-200 hover:bg-muted sm:w-auto dark:hover:text-white"
            >
              How It Works
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translate(-50%, 60%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 50%);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation-name: fade-in-up;
          animation-duration: 0.8s;
          animation-timing-function: ease-out;
        }
        .animate-fade-in {
          animation-name: fade-in;
          animation-duration: 0.8s;
          animation-timing-function: ease-out;
        }
      `}</style>
    </section>
  );
}
