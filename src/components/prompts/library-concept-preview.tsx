"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LibraryConceptTone = "hero" | "background" | "border" | "carousel" | "image" | "navigation" | "default";

/** Previews mais fiéis ao tipo de prompt (UI wireframes, não placeholders abstratos). */
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const GRADIENT_CLASS = [
  "from-primary/20 via-slate-700/30 to-background",
  "from-cyan-500/20 via-slate-800/35 to-background",
  "from-indigo-500/22 via-slate-800/35 to-background",
  "from-emerald-500/18 via-slate-800/35 to-background",
  "from-violet-500/20 via-slate-800/35 to-background",
  "from-sky-500/20 via-slate-800/35 to-background",
] as const;

const TONE_NUDGE: Record<LibraryConceptTone, number> = {
  hero: 0,
  background: 3,
  border: 6,
  carousel: 9,
  image: 12,
  navigation: 15,
  default: 0,
};

export function isAbstractPreviewId(id: string): boolean {
  return id.startsWith("abstract-");
}

function UiBar({ w }: { w: string }) {
  return <div className={cn("h-2 rounded-full bg-foreground/20", w)} />;
}

function HeroLayout({ variant }: { variant: number }) {
  return (
    <div className="absolute inset-0 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-2 w-14 rounded-full bg-foreground/25" />
        <div className="flex gap-1.5">
          <div className="h-1.5 w-8 rounded-full bg-foreground/15" />
          <div className="h-1.5 w-8 rounded-full bg-foreground/15" />
          <div className="h-1.5 w-8 rounded-full bg-foreground/15" />
        </div>
      </div>
      <div className="grid h-[calc(100%-20px)] grid-cols-[1.2fr_1fr] gap-3">
        <div className="space-y-2 rounded-md border border-foreground/10 bg-background/30 p-3">
          <UiBar w={variant % 2 ? "w-3/4" : "w-5/6"} />
          <UiBar w={variant % 3 ? "w-2/3" : "w-3/5"} />
          <UiBar w="w-1/2" />
          <div className="mt-2 h-6 w-24 rounded-md bg-primary/35" />
        </div>
        <div className="rounded-md border border-foreground/10 bg-background/25" />
      </div>
    </div>
  );
}

function CarouselLayout({ variant }: { variant: number }) {
  const widths = variant % 2 ? ["w-20", "w-24", "w-16"] : ["w-16", "w-20", "w-24"];
  return (
    <div className="absolute inset-0 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="h-2 w-20 rounded-full bg-foreground/20" />
        <div className="flex gap-1">
          <span className="size-1.5 rounded-full bg-foreground/35" />
          <span className="size-1.5 rounded-full bg-foreground/20" />
          <span className="size-1.5 rounded-full bg-foreground/20" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {widths.map((w, i) => (
          <div key={i} className="rounded-md border border-foreground/10 bg-background/28 p-2">
            <div className="mb-2 h-10 rounded bg-foreground/10" />
            <div className={cn("h-1.5 rounded bg-foreground/20", w)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ImageLayout() {
  return (
    <div className="absolute inset-0 p-3">
      <div className="mb-2 h-2 w-24 rounded-full bg-foreground/20" />
      <div className="grid h-[calc(100%-14px)] grid-cols-3 gap-2">
        <div className="col-span-2 rounded-md border border-foreground/10 bg-foreground/12" />
        <div className="space-y-2">
          <div className="h-[48%] rounded-md border border-foreground/10 bg-foreground/10" />
          <div className="h-[48%] rounded-md border border-foreground/10 bg-foreground/10" />
        </div>
      </div>
    </div>
  );
}

function NavigationLayout({ variant }: { variant: number }) {
  return (
    <div className="absolute inset-0 p-3">
      <div className="mb-2 flex items-center justify-between rounded-md border border-foreground/10 bg-background/28 px-2 py-1.5">
        <div className="h-2 w-12 rounded-full bg-foreground/25" />
        <div className="flex gap-1.5">
          <div className="h-1.5 w-6 rounded-full bg-foreground/15" />
          <div className="h-1.5 w-6 rounded-full bg-foreground/15" />
          <div className="h-1.5 w-6 rounded-full bg-foreground/15" />
        </div>
      </div>
      <div className="grid h-[calc(100%-34px)] grid-cols-[72px_1fr] gap-2">
        <div className="space-y-1.5 rounded-md border border-foreground/10 bg-background/25 p-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn("h-1.5 rounded-full", i === (variant % 4) ? "bg-primary/45" : "bg-foreground/16")}
            />
          ))}
        </div>
        <div className="rounded-md border border-foreground/10 bg-background/22 p-2">
          <div className="mb-2 h-2 w-2/5 rounded-full bg-foreground/22" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 rounded bg-foreground/10" />
            <div className="h-8 rounded bg-foreground/10" />
            <div className="h-8 rounded bg-foreground/10" />
            <div className="h-8 rounded bg-foreground/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BorderLayout({ variant }: { variant: number }) {
  return (
    <div className="absolute inset-0 p-3">
      <div className="mb-2 h-2 w-16 rounded-full bg-foreground/20" />
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-primary/45 bg-background/26 p-2">
          <UiBar w="w-4/5" />
        </div>
        <div className="rounded-xl border border-dashed border-foreground/35 bg-background/26 p-2">
          <UiBar w="w-3/5" />
        </div>
        <div className="rounded-xl border border-foreground/20 bg-background/26 p-2 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.35)]">
          <UiBar w={variant % 2 ? "w-2/3" : "w-4/6"} />
        </div>
        <div className="rounded-xl border border-foreground/20 bg-background/26 p-2">
          <div className="h-6 rounded-md bg-gradient-to-r from-primary/40 to-cyan-400/30" />
        </div>
      </div>
    </div>
  );
}

function BackgroundLayout({ variant }: { variant: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)/0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)/0.06) 1px, transparent 1px)",
          backgroundSize: variant % 2 ? "16px 16px" : "22px 22px",
        }}
      />
      <div className="absolute -left-8 top-6 size-24 rounded-full bg-primary/26 blur-2xl" />
      <div className="absolute bottom-0 right-0 size-28 rounded-full bg-cyan-400/24 blur-2xl" />
      <div className="absolute inset-x-6 top-8 h-16 rounded-xl border border-foreground/10 bg-background/20" />
    </div>
  );
}

function DefaultLayout({ variant }: { variant: number }) {
  return (
    <div className="absolute inset-0 p-3">
      <div className="mb-2 h-2 w-20 rounded-full bg-foreground/20" />
      <div className="space-y-2 rounded-md border border-foreground/10 bg-background/26 p-3">
        <UiBar w={variant % 2 ? "w-4/5" : "w-3/4"} />
        <UiBar w="w-2/3" />
        <UiBar w="w-1/2" />
      </div>
    </div>
  );
}

export function LibraryConceptPreview({
  seed,
  tone = "default",
  className,
}: {
  seed: string;
  tone?: LibraryConceptTone;
  className?: string;
}) {
  const h = hashSeed(seed) + TONE_NUDGE[tone];
  const gi = h % GRADIENT_CLASS.length;
  const variant = (h >> 5) % 7;

  let previewLayout: ReactNode;
  if (tone === "hero") previewLayout = <HeroLayout variant={variant} />;
  else if (tone === "carousel") previewLayout = <CarouselLayout variant={variant} />;
  else if (tone === "image") previewLayout = <ImageLayout />;
  else if (tone === "navigation") previewLayout = <NavigationLayout variant={variant} />;
  else if (tone === "border") previewLayout = <BorderLayout variant={variant} />;
  else if (tone === "background") previewLayout = <BackgroundLayout variant={variant} />;
  else previewLayout = <DefaultLayout variant={variant} />;

  return (
    <div
      className={cn(
        "relative h-[168px] overflow-hidden rounded-lg border border-border/70 bg-muted/20 sm:h-[180px]",
        className,
      )}
      aria-hidden
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-95", GRADIENT_CLASS[gi])} />
      {previewLayout}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background/70 to-transparent" />
    </div>
  );
}
