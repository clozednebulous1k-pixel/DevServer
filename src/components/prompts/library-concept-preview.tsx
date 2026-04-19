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
    <div className="absolute inset-0 overflow-hidden p-3">
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
      <div className="relative z-10 space-y-2 rounded-lg border border-foreground/12 bg-background/28 p-2.5">
        <div className="flex items-center justify-between">
          <div className="h-2 w-14 rounded-full bg-foreground/22" />
          <div className="h-1.5 w-10 rounded-full bg-foreground/18" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 h-10 rounded-md bg-foreground/10" />
          <div className="h-10 rounded-md bg-foreground/12" />
        </div>
      </div>
      <div className="relative z-10 mt-2 grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-6 rounded-md border border-foreground/10 bg-background/22",
              i === variant % 4 && "border-primary/40 bg-primary/15",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function DefaultLayout({ variant }: { variant: number }) {
  return (
    <div className="absolute inset-0 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="h-2 w-20 rounded-full bg-foreground/20" />
        <div className="h-5 w-14 rounded-full bg-primary/25" />
      </div>
      <div className="space-y-2 rounded-md border border-foreground/10 bg-background/26 p-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 rounded-md bg-foreground/10" />
          <div className="h-8 rounded-md bg-foreground/12" />
        </div>
        <UiBar w={variant % 2 ? "w-4/5" : "w-3/4"} />
        <UiBar w="w-2/3" />
        <UiBar w="w-1/2" />
      </div>
    </div>
  );
}

type SeedMode =
  | "hero-metrics"
  | "hero-podcast"
  | "hero-countdown"
  | "hero-hotspots"
  | "hero-crypto"
  | "hero-fitness"
  | "hero-onboarding"
  | "carousel-testimonial"
  | "carousel-logo"
  | "carousel-team"
  | "carousel-timeline"
  | "carousel-product"
  | "image-masonry"
  | "image-compare"
  | "image-kanban"
  | "image-polaroid"
  | "image-map"
  | "image-device"
  | "image-avatar"
  | "nav-sidebar"
  | "nav-tabs"
  | "nav-footer"
  | "nav-search"
  | "nav-notifications"
  | "nav-mobile"
  | "nav-wizard"
  | "border-double"
  | "border-dashed"
  | "border-glow"
  | "border-divided"
  | "border-neumorphic";

function resolveSeedMode(seed: string): SeedMode | null {
  if (seed.includes("hero-saas-metrics")) return "hero-metrics";
  if (seed.includes("hero-podcast-wave")) return "hero-podcast";
  if (seed.includes("hero-event-countdown")) return "hero-countdown";
  if (seed.includes("hero-product-hotspots")) return "hero-hotspots";
  if (seed.includes("hero-crypto-ticker")) return "hero-crypto";
  if (seed.includes("hero-fitness-rings")) return "hero-fitness";
  if (seed.includes("hero-onboarding-steps")) return "hero-onboarding";
  if (seed.includes("carousel-testimonial")) return "carousel-testimonial";
  if (seed.includes("carousel-logo") || seed.includes("carousel-partner") || seed.includes("carousel-press"))
    return "carousel-logo";
  if (seed.includes("carousel-team")) return "carousel-team";
  if (seed.includes("carousel-timeline") || seed.includes("carousel-certifications")) return "carousel-timeline";
  if (seed.includes("carousel-product") || seed.includes("carousel-before-after")) return "carousel-product";
  if (seed.includes("image-masonry")) return "image-masonry";
  if (seed.includes("image-compare") || seed.includes("image-story")) return "image-compare";
  if (seed.includes("image-kanban")) return "image-kanban";
  if (seed.includes("image-polaroid") || seed.includes("image-caption")) return "image-polaroid";
  if (seed.includes("image-map")) return "image-map";
  if (seed.includes("image-device")) return "image-device";
  if (seed.includes("image-avatar") || seed.includes("image-neon")) return "image-avatar";
  if (seed.includes("nav-sidebar")) return "nav-sidebar";
  if (seed.includes("nav-tabs")) return "nav-tabs";
  if (seed.includes("nav-footer") || seed.includes("nav-breadcrumb")) return "nav-footer";
  if (seed.includes("nav-search") || seed.includes("nav-command") || seed.includes("nav-lang")) return "nav-search";
  if (seed.includes("nav-notifications")) return "nav-notifications";
  if (seed.includes("nav-mobile-bottom")) return "nav-mobile";
  if (seed.includes("nav-step-wizard")) return "nav-wizard";
  if (seed.includes("border-double") || seed.includes("border-notched") || seed.includes("border-chamfer"))
    return "border-double";
  if (seed.includes("border-sketch") || seed.includes("border-stitched") || seed.includes("border-dashed"))
    return "border-dashed";
  if (seed.includes("border-inner-glow") || seed.includes("border-brass")) return "border-glow";
  if (seed.includes("border-divided")) return "border-divided";
  if (seed.includes("border-neumorphic")) return "border-neumorphic";
  return null;
}

function SeedSpecificLayout({ mode }: { mode: SeedMode }) {
  if (mode === "hero-metrics") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="mb-2 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((n) => (
            <div key={n} className="rounded-md border border-foreground/10 bg-background/25 p-2">
              <div className="h-1.5 w-8 rounded-full bg-foreground/20" />
              <div className="mt-2 h-4 w-10 rounded bg-primary/25" />
            </div>
          ))}
        </div>
        <div className="h-12 rounded-md border border-foreground/10 bg-background/20" />
      </div>
    );
  }
  if (mode === "hero-podcast") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="mb-2 h-2 w-24 rounded-full bg-foreground/20" />
        <div className="flex h-12 items-end gap-1 rounded-md border border-foreground/10 bg-background/20 px-2">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="w-1 rounded-t bg-primary/35" style={{ height: `${18 + ((i * 7) % 20)}px` }} />
          ))}
        </div>
      </div>
    );
  }
  if (mode === "hero-countdown") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="mb-2 h-2 w-28 rounded-full bg-foreground/20" />
        <div className="grid grid-cols-4 gap-2">
          {["12", "08", "43", "21"].map((t) => (
            <div key={t} className="rounded-md border border-foreground/10 bg-background/26 p-2 text-center text-xs font-semibold">
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (mode === "hero-hotspots") return <ImageLayout />;
  if (mode === "hero-crypto") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="space-y-2 rounded-md border border-foreground/10 bg-background/24 p-2">
          {["BTC +2.4%", "ETH +1.1%", "SOL -0.7%"].map((t) => (
            <div key={t} className="flex items-center justify-between text-[10px] text-foreground/80">
              <span>{t.split(" ")[0]}</span>
              <span className={cn(t.includes("-") ? "text-rose-300/80" : "text-emerald-300/80")}>{t.split(" ")[1]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (mode === "hero-fitness") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative size-20 rounded-full border border-primary/30">
          <div className="absolute inset-2 rounded-full border border-cyan-300/35" />
          <div className="absolute inset-4 rounded-full border border-emerald-300/35" />
        </div>
      </div>
    );
  }
  if (mode === "hero-onboarding") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="space-y-2 rounded-md border border-foreground/10 bg-background/24 p-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="flex size-4 items-center justify-center rounded-full bg-primary/30 text-[9px]">{i}</span>
              <div className="h-1.5 w-20 rounded-full bg-foreground/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (mode === "carousel-testimonial") return <CarouselLayout variant={1} />;
  if (mode === "carousel-logo") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-6 rounded border border-foreground/10 bg-background/24" />
          ))}
        </div>
      </div>
    );
  }
  if (mode === "carousel-team") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-md border border-foreground/10 bg-background/24 p-2">
              <div className="mx-auto size-7 rounded-full bg-foreground/18" />
              <div className="h-1.5 rounded bg-foreground/16" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (mode === "carousel-timeline") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="mt-5 h-px bg-foreground/20" />
        <div className="mt-2 flex justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="size-3 rounded-full border border-primary/40 bg-background/70" />
          ))}
        </div>
      </div>
    );
  }
  if (mode === "carousel-product") return <CarouselLayout variant={0} />;
  if (mode === "image-masonry") return <ImageLayout />;
  if (mode === "image-compare") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="relative h-full overflow-hidden rounded-md border border-foreground/10">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-foreground/12" />
          <div className="absolute inset-y-0 right-0 w-1/2 bg-foreground/6" />
          <div className="absolute inset-y-0 left-1/2 w-px bg-primary/60" />
        </div>
      </div>
    );
  }
  if (mode === "image-kanban") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="grid h-full grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-md border border-foreground/10 bg-background/24 p-2">
              <div className="h-1.5 w-10 rounded bg-foreground/20" />
              <div className="h-6 rounded bg-foreground/12" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (mode === "image-polaroid") {
    return (
      <div className="absolute inset-0 p-4">
        <div className="absolute left-8 top-6 h-16 w-14 rotate-[-7deg] rounded-sm border border-foreground/15 bg-background/80 p-1" />
        <div className="absolute left-16 top-8 h-16 w-14 rotate-[6deg] rounded-sm border border-foreground/15 bg-background/80 p-1" />
      </div>
    );
  }
  if (mode === "image-map") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="relative h-full rounded-md border border-foreground/10 bg-background/24">
          {[0, 1, 2].map((i) => (
            <span key={i} className="absolute size-2 rounded-full bg-rose-300/80" style={{ left: `${20 + i * 25}%`, top: `${35 + (i % 2) * 20}%` }} />
          ))}
        </div>
      </div>
    );
  }
  if (mode === "image-device") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="mx-auto h-full w-20 rounded-xl border border-foreground/15 bg-background/26 p-2">
          <div className="h-2 w-8 rounded-full bg-foreground/18" />
          <div className="mt-2 h-12 rounded bg-foreground/10" />
        </div>
      </div>
    );
  }
  if (mode === "image-avatar") return <CarouselLayout variant={2} />;
  if (mode === "nav-sidebar") return <NavigationLayout variant={0} />;
  if (mode === "nav-tabs") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="mb-2 flex gap-2">
          {["Tab1", "Tab2", "Tab3"].map((t, i) => (
            <div key={t} className={cn("h-5 w-12 rounded-full border", i === 1 ? "border-primary/40 bg-primary/20" : "border-foreground/15 bg-background/24")} />
          ))}
        </div>
        <div className="h-10 rounded-md border border-foreground/10 bg-background/20" />
      </div>
    );
  }
  if (mode === "nav-footer") return <NavigationLayout variant={2} />;
  if (mode === "nav-search") return <NavigationLayout variant={1} />;
  if (mode === "nav-notifications") {
    return (
      <div className="absolute inset-0 p-3">
        <div className="space-y-2 rounded-md border border-foreground/10 bg-background/24 p-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary/60" />
              <div className="h-1.5 w-24 rounded bg-foreground/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (mode === "nav-mobile") return <NavigationLayout variant={3} />;
  if (mode === "nav-wizard") return <HeroLayout variant={1} />;
  if (mode === "border-double") return <BorderLayout variant={0} />;
  if (mode === "border-dashed") return <BorderLayout variant={1} />;
  if (mode === "border-glow") return <BorderLayout variant={2} />;
  if (mode === "border-divided") return <BorderLayout variant={3} />;
  return <BorderLayout variant={4} />;
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
  const specificMode = resolveSeedMode(seed);

  let previewLayout: ReactNode;
  if (specificMode) previewLayout = <SeedSpecificLayout mode={specificMode} />;
  else if (tone === "hero") previewLayout = <HeroLayout variant={variant} />;
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
