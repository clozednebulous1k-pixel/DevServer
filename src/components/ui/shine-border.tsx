"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Check, Download, Layers, Repeat, Send } from "lucide-react";

type TColorProp = string | string[];

function shineGradient(color: TColorProp): string {
  if (Array.isArray(color)) {
    const [a, b, c] = [color[0] ?? "#fff", color[1] ?? color[0], color[2] ?? color[0]];
    return `radial-gradient(transparent,transparent,${a},${b},${c},transparent,transparent)`;
  }
  return `radial-gradient(transparent,transparent,${color},transparent,transparent)`;
}

export interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  children,
}: ShineBorderProps) {
  return (
    <div
      style={{ "--border-radius": `${borderRadius}px` } as React.CSSProperties}
      className={cn(
        "relative grid h-full w-full place-items-center rounded-3xl bg-white p-3 text-black dark:bg-black dark:text-white",
        className,
      )}
    >
      <div
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--border-radius": `${borderRadius}px`,
            "--shine-pulse-duration": `${duration}s`,
            "--mask-linear-gradient": "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            "--background-radial-gradient": shineGradient(color),
          } as React.CSSProperties
        }
        className={cn(
          "pointer-events-none absolute inset-0 rounded-3xl before:absolute before:inset-0 before:aspect-square before:size-full",
          "before:rounded-3xl before:p-[length:var(--border-width)] before:will-change-[background-position] before:content-['']",
          "before:bg-[length:300%_300%] before:[-webkit-mask-composite:xor] before:[background-image:var(--background-radial-gradient)]",
          "before:[mask-composite:exclude] before:[mask:var(--mask-linear-gradient)]",
          "motion-safe:before:animate-[shine-pulse_var(--shine-pulse-duration)_linear_infinite]",
        )}
        aria-hidden
      />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}

const iconMap = {
  Shapes: Layers,
  Send,
  Check,
  Repeat,
  Download,
} satisfies Record<string, LucideIcon>;

export type ShineTimelineIconName = keyof typeof iconMap;

export interface ShineTimelineEventData {
  label: string;
  message: string;
  icon: {
    name: ShineTimelineIconName;
    textColor: string;
    borderColor: string;
  };
}

export function ShineTimelineContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex max-w-md flex-col justify-center gap-3 md:order-2">{children}</div>;
}

export function ShineTimelineEvent({
  label,
  message,
  icon,
  isLast = false,
}: ShineTimelineEventData & { isLast?: boolean }) {
  const Icon = iconMap[icon.name];
  return (
    <div className="group relative -m-2 flex gap-4 border border-transparent p-2">
      <div className="relative">
        <div className={cn("rounded-full border bg-background p-2", icon.borderColor)}>
          <Icon className={cn("h-4 w-4", icon.textColor)} aria-hidden />
        </div>
        {!isLast ? <div className="absolute inset-x-0 mx-auto h-full w-0.5 bg-muted" /> : null}
      </div>
      <div className="mt-1 flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-lg font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

const defaultTimeline: ShineTimelineEventData[] = [
  {
    label: "Choose Your Design",
    message: "Browse and select a design that fits your needs, then access your personalized dashboard.",
    icon: { name: "Shapes", textColor: "text-orange-500", borderColor: "border-orange-500/40" },
  },
  {
    label: "Provide Your Brief",
    message: "Share your design preferences and requirements with us.",
    icon: { name: "Send", textColor: "text-amber-500", borderColor: "border-amber-500/40" },
  },
  {
    label: "Receive Your Designs",
    message: "Get your initial designs within 48 hours.",
    icon: { name: "Check", textColor: "text-blue-500", borderColor: "border-blue-500/40" },
  },
  {
    label: "Request Revisions",
    message: "We're committed to perfection - request revisions until you're satisfied.",
    icon: { name: "Repeat", textColor: "text-green-500", borderColor: "border-green-500/40" },
  },
  {
    label: "Get Final Files",
    message: "Once approved, we'll deliver the final files to you.",
    icon: { name: "Download", textColor: "text-green-500", borderColor: "border-green-500/40" },
  },
];

export function ShineTimeline({ events = defaultTimeline }: { events?: ShineTimelineEventData[] }) {
  return (
    <div className="w-full max-w-xl">
      <ShineTimelineContainer>
        {events.map((event, i) => (
          <ShineTimelineEvent key={event.message} isLast={i === events.length - 1} {...event} />
        ))}
      </ShineTimelineContainer>
    </div>
  );
}
