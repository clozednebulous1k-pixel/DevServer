"use client";

import { Camera, Code, Gamepad2, Globe, Palette, PlayCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const toRadians = (degrees: number): number => (Math.PI / 180) * degrees;

export function SpinningLogos() {
  const radiusToCenterOfIcons = 180;
  const iconWrapperWidth = 60;
  const ringPadding = 40;

  const logos = [
    { Icon: Code, className: "bg-purple-600 text-white", name: "Dev" },
    { Icon: Palette, className: "bg-red-600 text-white", name: "Design" },
    { Icon: Camera, className: "bg-orange-600 text-white", name: "Mídia" },
    { Icon: Zap, className: "bg-blue-600 text-white", name: "Performance" },
    { Icon: Gamepad2, className: "bg-indigo-600 text-white", name: "Produto" },
    { Icon: Globe, className: "bg-blue-500 text-white", name: "Web" },
    { Icon: PlayCircle, className: "bg-red-500 text-white", name: "Vídeo" },
  ];

  return (
    <div className="flex min-h-[420px] items-center justify-center overflow-hidden bg-background p-8">
      <div
        style={{
          width: radiusToCenterOfIcons * 2 + iconWrapperWidth + ringPadding,
          height: radiusToCenterOfIcons * 2 + iconWrapperWidth + ringPadding,
        }}
        className="relative rounded-full border border-border bg-muted/50 shadow-lg"
      >
        <div className="animate-spin-slow absolute inset-0">
          {logos.map((logo, index) => {
            const angle = (360 / logos.length) * index;
            return (
              <div
                key={index}
                style={{
                  top: `calc(50% - ${iconWrapperWidth / 2}px + ${radiusToCenterOfIcons * Math.sin(toRadians(angle))}px)`,
                  left: `calc(50% - ${iconWrapperWidth / 2}px + ${radiusToCenterOfIcons * Math.cos(toRadians(angle))}px)`,
                  width: iconWrapperWidth,
                  height: iconWrapperWidth,
                }}
                className={cn(
                  "animate-spin-reverse absolute flex items-center justify-center rounded-full border-2 border-white shadow-md dark:border-gray-800",
                  logo.className,
                )}
                aria-label={logo.name}
              >
                <logo.Icon className="h-6 w-6" aria-hidden />
              </div>
            );
          })}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-3/5 w-3/5 items-center justify-center rounded-full border-4 border-border bg-background shadow-inner">
            <span className="px-4 text-center text-2xl font-bold text-foreground sm:text-3xl">DevServer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
