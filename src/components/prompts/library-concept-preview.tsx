"use client";

import { cn } from "@/lib/utils";

export type LibraryConceptTone = "hero" | "background" | "border" | "carousel" | "image" | "navigation" | "default";

/** Estilo biblioteca DevServer: gradientes sóbrios + padrões geométricos; cada seed gera layout distinto. */
function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const GRADIENT_CLASS = [
  "from-primary/30 via-violet-500/12 to-background",
  "from-cyan-500/25 via-primary/8 to-background",
  "from-amber-500/20 via-rose-500/10 to-background",
  "from-emerald-500/22 via-cyan-500/8 to-background",
  "from-violet-500/28 via-fuchsia-500/10 to-background",
  "from-sky-500/24 via-primary/12 to-background",
  "from-orange-500/18 via-amber-500/12 to-background",
  "from-teal-500/22 via-emerald-500/10 to-background",
  "from-primary/25 via-slate-500/15 to-background",
  "from-indigo-500/26 via-violet-500/14 to-background",
  "from-rose-500/18 via-orange-500/10 to-background",
  "from-lime-500/15 via-emerald-500/12 to-background",
] as const;

const PATTERN: readonly ("dots" | "grid" | "diagonal" | "orb" | "rings" | "mesh")[] = [
  "dots",
  "grid",
  "diagonal",
  "orb",
  "rings",
  "mesh",
];

const TONE_NUDGE: Record<LibraryConceptTone, number> = {
  hero: 0,
  background: 2,
  border: 5,
  carousel: 8,
  image: 11,
  navigation: 14,
  default: 0,
};

export function isAbstractPreviewId(id: string): boolean {
  return id.startsWith("abstract-");
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
  const pi = (h >> 5) % PATTERN.length;
  const layoutKind = (h >> 10) % 5;
  const accent = (h >> 14) % 6;

  return (
    <div
      className={cn(
        "relative h-[168px] overflow-hidden rounded-lg border border-border/70 bg-muted/20 sm:h-[180px]",
        className,
      )}
      aria-hidden
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-95", GRADIENT_CLASS[gi])} />

      {/* Padrões overlay */}
      {PATTERN[pi] === "dots" && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.25]"
          style={{
            backgroundImage: `radial-gradient(circle at center, hsl(var(--foreground) / 0.12) 1px, transparent 1px)`,
            backgroundSize: "14px 14px",
          }}
        />
      )}
      {PATTERN[pi] === "grid" && (
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground) / 0.06) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground) / 0.06) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
          }}
        />
      )}
      {PATTERN[pi] === "diagonal" && (
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: `repeating-linear-gradient(
              135deg,
              hsl(var(--foreground) / 0.07) 0,
              hsl(var(--foreground) / 0.07) 1px,
              transparent 1px,
              transparent 10px
            )`,
          }}
        />
      )}
      {PATTERN[pi] === "orb" && (
        <div className="pointer-events-none absolute -right-8 -top-12 size-40 rounded-full bg-primary/25 blur-3xl" />
      )}
      {PATTERN[pi] === "rings" && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/5 opacity-40" />
      )}
      {PATTERN[pi] === "mesh" && (
        <>
          <div className="pointer-events-none absolute -left-10 bottom-0 size-32 rounded-full bg-cyan-500/20 blur-2xl" />
          <div className="pointer-events-none absolute -right-6 top-6 size-28 rounded-full bg-violet-500/20 blur-2xl" />
        </>
      )}

      {/* Ornamentos geométricos (variam por seed) */}
      {layoutKind === 0 && (
        <div className="absolute right-4 top-4 h-10 w-10 rounded-lg border border-foreground/10 bg-background/20 backdrop-blur-sm" />
      )}
      {layoutKind === 1 && (
        <div className="absolute bottom-6 left-4 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-8 w-1.5 rounded-full bg-foreground/15"
              style={{ height: `${40 + ((h >> (i * 3)) % 5) * 8}px` }}
            />
          ))}
        </div>
      )}
      {layoutKind === 2 && (
        <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-dashed border-foreground/10 bg-background/10" />
      )}
      {layoutKind === 3 && (
        <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
      )}
      {layoutKind === 4 && (
        <div className="absolute bottom-8 right-6 flex gap-2">
          <span className="size-2 rounded-full bg-primary/60" />
          <span className="size-2 rounded-full bg-primary/40" />
          <span className="size-2 rounded-full bg-primary/25" />
        </div>
      )}

      {accent === 0 ? (
        <div className="absolute left-3 top-3 h-6 w-px bg-gradient-to-b from-primary/50 to-transparent" />
      ) : accent === 1 ? (
        <div className="absolute bottom-3 right-3 rounded-md border border-foreground/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/80">
          concept
        </div>
      ) : accent === 2 ? (
        <div className="absolute left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-foreground/10 opacity-50" />
      ) : (
        <div className="absolute right-5 top-1/2 flex -translate-y-1/2 flex-col gap-1">
          <div className="h-1 w-8 rounded-full bg-foreground/10" />
          <div className="h-1 w-12 rounded-full bg-foreground/15" />
          <div className="h-1 w-6 rounded-full bg-foreground/10" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background/70 to-transparent" />
    </div>
  );
}
