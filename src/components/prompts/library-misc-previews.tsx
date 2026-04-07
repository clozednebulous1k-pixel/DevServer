"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BarChart3,
  CircleDollarSign,
  ClipboardList,
  FileCheck2,
  FileStack,
  FileText,
  Upload,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { FallingPattern } from "@/components/ui/falling-pattern";
import { Radar, RadarIconContainer } from "@/components/ui/radar-effect";
import { NeonButton } from "@/components/ui/neon-button";
import { ShineBorder, ShineTimeline } from "@/components/ui/shine-border";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/lamp-tooltip";
import { RippleButton } from "@/components/ui/multi-type-ripple-buttons";
import { GlowCard, GlowCardCanvas } from "@/components/ui/animated-glow-card";
import { XCard } from "@/components/ui/x-gradient-card";
import { GlowCardSpotlight } from "@/components/ui/spotlight-card";
import { BorderRotate } from "@/components/ui/animated-gradient-border";
import GlowingSearchBar from "@/components/ui/animated-glowing-search-bar";
import { BauhausCard } from "@/components/ui/bauhaus-card";
import { RainbowBordersButton } from "@/components/ui/rainbow-borders-button";
import { WavePath } from "@/components/ui/wave-path";
import { MovingBorder } from "@/components/ui/moving-border";
import { OmniCommandPalette, type OmniItem, type OmniSource } from "@/components/ui/omni-command-palette";
import { Logos3 } from "@/components/ui/logos3";
import { Gallery4 } from "@/components/ui/gallery4";
import { LogoCloud3 } from "@/components/ui/logo-cloud-3";
import { LogoCloud4 } from "@/components/ui/logo-cloud-4";
import { CustomersSection } from "@/components/ui/customers-section";
import { SpinningLogos } from "@/components/ui/spinning-logos";
import StackFeatureSection from "@/components/ui/stack-feature-section";
import { InfiniteSlider } from "@/components/ui/infinite-slider";

const BeamsBackgroundClient = dynamic(
  () => import("@/components/ui/beams-background").then((m) => m.BeamsBackground),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[168px] items-center justify-center rounded-lg border border-border bg-neutral-950 text-xs text-muted-foreground">
        Carregando beams…
      </div>
    ),
  },
);

const SmokeBackgroundClient = dynamic(
  () => import("@/components/ui/spooky-smoke-animation").then((m) => m.SmokeBackground),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[168px] items-center justify-center rounded-lg border border-border bg-black text-xs text-muted-foreground">
        Carregando fumaça…
      </div>
    ),
  },
);

const ParticleTextClient = dynamic(
  () => import("@/components/ui/particle-text-effect").then((m) => m.ParticleTextEffect),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[168px] items-center justify-center rounded-lg border border-border bg-black text-xs text-muted-foreground">
        Carregando partículas…
      </div>
    ),
  },
);

const SpiralAnimationClient = dynamic(
  () => import("@/components/ui/spiral-animation").then((m) => m.SpiralAnimation),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[168px] items-center justify-center rounded-lg border border-border bg-black text-xs text-muted-foreground">
        Carregando espiral…
      </div>
    ),
  },
);

const PaperShaderShowcaseClient = dynamic(() => import("@/components/ui/paper-shader-showcase"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[168px] items-center justify-center rounded-lg border border-border bg-black text-xs text-muted-foreground">
      Carregando shaders…
    </div>
  ),
});

const libraryLogoCloudSvgs = [
  { src: "https://svgl.app/library/vercel_wordmark.svg", alt: "Vercel" },
  { src: "https://svgl.app/library/github_wordmark_light.svg", alt: "GitHub" },
  { src: "https://svgl.app/library/supabase_wordmark_light.svg", alt: "Supabase" },
  { src: "https://svgl.app/library/openai_wordmark_light.svg", alt: "OpenAI" },
];

const libraryCustomersLogos = [
  { src: "https://html.tailus.io/blocks/customers/github.svg", alt: "GitHub", height: 16 },
  { src: "https://html.tailus.io/blocks/customers/nike.svg", alt: "Nike", height: 20 },
  { src: "https://html.tailus.io/blocks/customers/openai.svg", alt: "OpenAI", height: 24 },
  { src: "https://html.tailus.io/blocks/customers/laravel.svg", alt: "Laravel", height: 16 },
];

function PreviewGeometricBg() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#030303] sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[min(1200px,240vw)] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.2)" }}
      >
        <HeroGeometric badge="Preview" title1="Eleve sua" title2="visão digital" />
      </div>
    </div>
  );
}

function PreviewPathsBg() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-white dark:bg-neutral-950 sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[800px] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.28) translateY(-12px)" }}
      >
        <BackgroundPaths title="Background" ctaLabel="Explorar" className="min-h-[560px]" />
      </div>
    </div>
  );
}

function PreviewBeamsBg() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-neutral-950 sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 w-[100vw] max-w-none origin-center"
        style={{ transform: "translate(-50%, -50%) scale(0.35)" }}
      >
        <BeamsBackgroundClient className="min-h-[480px]" />
      </div>
    </div>
  );
}

function PreviewSmokeBg() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <SmokeBackgroundClient className="min-h-[168px] sm:min-h-[180px]" />
    </div>
  );
}

function PreviewFallingBg() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <FallingPattern className="h-full min-h-[168px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,var(--background)_75%)] sm:min-h-[180px]" />
      <p className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-center font-mono text-lg font-extrabold tracking-tighter text-foreground">
        Falling
      </p>
    </div>
  );
}

function PreviewParticleBg() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[1000px] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.22) translateY(-24px)" }}
      >
        <ParticleTextClient words={["DEV", "SERVER"]} className="min-h-0 flex-col gap-0 bg-transparent p-0" />
      </div>
    </div>
  );
}

function PreviewSpiralBg() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <SpiralAnimationClient className="absolute inset-0 min-h-[168px] sm:min-h-[180px]" />
    </div>
  );
}

function PreviewNeonBorder() {
  return (
    <div className="flex h-[168px] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-border bg-background px-2 sm:h-[180px]">
      <NeonButton type="button">Neon</NeonButton>
      <NeonButton type="button" neon={false} variant="ghost">
        Sem neon
      </NeonButton>
      <NeonButton type="button" variant="solid">
        Sólido
      </NeonButton>
    </div>
  );
}

function PreviewShineBorder() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div
        className="absolute left-1/2 top-0 w-[420px] max-w-none origin-top -translate-x-1/2 scale-[0.38]"
        style={{ marginTop: "-8px" }}
      >
        <ShineBorder borderWidth={2} color={["#ec4899", "#22d3ee", "#a78bfa"]} className="rounded-2xl border bg-card/80">
          <div className="px-4 py-3 text-left">
            <p className="text-sm font-semibold">Como funciona</p>
            <div className="mt-2 scale-90">
              <ShineTimeline />
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Link href="#" className={cn(buttonVariants({ size: "sm" }), "rounded-full")}>
                CTA
              </Link>
            </div>
          </div>
        </ShineBorder>
      </div>
    </div>
  );
}

function PreviewLampBorder() {
  return (
    <div className="flex h-[168px] flex-wrap items-center justify-center gap-4 overflow-hidden rounded-lg border border-border bg-zinc-900 p-2 sm:h-[180px]">
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger className="rounded border border-white/20 bg-[#1f1f1f] px-3 py-1.5 text-xs text-white">
            Topo
          </TooltipTrigger>
          <TooltipContent>Tooltip topo</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger className="rounded border border-white/20 bg-[#1f1f1f] px-3 py-1.5 text-xs text-white">
            Base
          </TooltipTrigger>
          <TooltipContent side="bottom">Tooltip base</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function PreviewRippleBorder() {
  return (
    <div className="flex h-[168px] flex-wrap items-center justify-center gap-2 overflow-hidden rounded-lg border border-border bg-muted/30 p-2 sm:h-[180px]">
      <RippleButton>Default</RippleButton>
      <RippleButton variant="hover">
        Hover grid
      </RippleButton>
      <RippleButton variant="hoverborder" className="text-sm">
        Borda
      </RippleButton>
    </div>
  );
}

function PreviewGlowXBorder() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 w-[520px] max-w-none origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.28]"
      >
        <GlowCardCanvas>
          <GlowCard className="p-3">
            <XCard
              link="#"
              authorName="DevServer"
              authorHandle="devserver"
              content={["Card com moldura luminosa."]}
              timestamp="Agora"
              reply={undefined}
            />
          </GlowCard>
        </GlowCardCanvas>
      </div>
    </div>
  );
}

function PreviewSpotlightBorder() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-zinc-950 p-4 sm:h-[180px]">
      <GlowCardSpotlight size="sm" glowColor="blue" className="text-sm text-white">
        <p className="font-medium">Spotlight</p>
        <p className="text-xs text-white/70">Mova o rato</p>
      </GlowCardSpotlight>
    </div>
  );
}

function PreviewGradBorder() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-zinc-900 p-3 sm:h-[180px]">
      <BorderRotate className="min-h-[100px] min-w-[140px] p-4 text-center text-sm text-white" animationSpeed={4}>
        Gradiente
      </BorderRotate>
    </div>
  );
}

function PreviewSearchBorder() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <div className="origin-center scale-[0.55]">
        <GlowingSearchBar />
      </div>
    </div>
  );
}

function PreviewBauhausBorder() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-zinc-900 p-2 sm:h-[180px]">
      <div className="origin-center scale-[0.42]">
        <BauhausCard
          id="demo"
          accentColor="#156ef6"
          backgroundColor="#151419"
          topInscription="12/03/2026"
          mainText="Relatório.zip"
          subMainText="A transferir…"
          progressBarInscription="Progresso"
          progress={72}
          progressValue="72%"
          filledButtonInscription="Partilhar"
          outlinedButtonInscription="Guardar"
          onFilledButtonClick={() => {}}
          onOutlinedButtonClick={() => {}}
          onMoreOptionsClick={() => {}}
        />
      </div>
    </div>
  );
}

function PreviewRainbowBorder() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <div className="scale-90">
        <RainbowBordersButton type="button" label="Arco-íris" />
      </div>
    </div>
  );
}

function PreviewOmniBorder() {
  const [open, setOpen] = useState(false);
  const demoSource: OmniSource = useMemo(
    () => ({
      id: "p",
      label: "Atalhos",
      fetch: (q) => {
        const all: OmniItem[] = [
          { id: "1", label: "Biblioteca", groupId: "p", href: "/biblioteca" },
          { id: "2", label: "Contato", groupId: "p", href: "/contato" },
        ];
        const t = q.trim().toLowerCase();
        return t ? all.filter((i) => i.label.toLowerCase().includes(t)) : all;
      },
    }),
    [],
  );
  return (
    <div className="relative flex h-[168px] flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-border bg-background p-2 sm:h-[180px]">
      <Button type="button" size="sm" variant="secondary" onClick={() => setOpen(true)}>
        Paleta
      </Button>
      <OmniCommandPalette
        open={open}
        onOpenChange={setOpen}
        sources={[demoSource]}
        showRecents={false}
        showPinnedFirst={false}
        storageKey="lib:omni:demo"
      />
    </div>
  );
}

function PreviewPaperBorder() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[900px] max-w-none origin-top -translate-x-1/2 scale-[0.14]"
      >
        <PaperShaderShowcaseClient />
      </div>
    </div>
  );
}

function PreviewWaveBorder() {
  return (
    <div className="flex h-[168px] flex-col items-center justify-center overflow-hidden rounded-lg border border-border bg-background px-2 sm:h-[180px]">
      <WavePath className="text-primary" />
      <p className="mt-2 text-center text-[10px] text-muted-foreground">Passe o rato na faixa</p>
    </div>
  );
}

function PreviewMovingBorder() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-emerald-950/40 p-4 sm:h-[180px]">
      <MovingBorder radius={10} borderWidth={2} gradientWidth={48} duration={3} colors={["#34d399", "#10b981", "#6ee7b7"]}>
        <div className="flex aspect-video w-[88px] items-center justify-center rounded-[10px] bg-emerald-200 text-xs font-medium text-emerald-950">
          GSAP
        </div>
      </MovingBorder>
    </div>
  );
}

function PreviewLogos3Carousel() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div className="pointer-events-none absolute left-1/2 top-0 w-[min(900px,240vw)] max-w-none origin-top -translate-x-1/2 scale-[0.22]">
        <Logos3 className="py-0" heading="" />
      </div>
      <p className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-muted-foreground">Embla + auto-scroll</p>
    </div>
  );
}

function PreviewGallery4Carousel() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div className="pointer-events-none absolute left-0 top-0 w-[200%] max-w-none origin-top-left scale-[0.28]">
        <Gallery4
          title=""
          description=""
          items={[
            {
              id: "a",
              title: "Exemplo",
              description: "Card de prévia na biblioteca.",
              href: "https://nextjs.org",
              image:
                "https://images.unsplash.com/photo-1550070881-a5d71eda5800?auto=format&fit=crop&w=600&q=70",
            },
            {
              id: "b",
              title: "Slide 2",
              description: "Segundo item para o carrossel.",
              href: "https://react.dev",
              image:
                "https://images.unsplash.com/photo-1548324215-9133768e4094?auto=format&fit=crop&w=600&q=70",
            },
          ]}
        />
      </div>
    </div>
  );
}

function PreviewLogoCloud3Lib() {
  return (
    <div className="flex h-[168px] items-center overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <LogoCloud3 logos={libraryLogoCloudSvgs} className="py-1" />
    </div>
  );
}

function PreviewLogoCloud4Lib() {
  return (
    <div className="flex h-[168px] items-center overflow-hidden rounded-lg border border-border bg-muted/20 sm:h-[180px]">
      <LogoCloud4 logos={libraryLogoCloudSvgs} className="my-auto border-0 py-2" />
    </div>
  );
}

function PreviewCustomersLib() {
  return (
    <div className="h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div className="pointer-events-none origin-top scale-[0.55]">
        <CustomersSection customers={libraryCustomersLogos} className="py-6 pb-8 pt-6" />
      </div>
    </div>
  );
}

function PreviewSpinningLogosLib() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div className="pointer-events-none scale-[0.35]">
        <SpinningLogos />
      </div>
    </div>
  );
}

function PreviewStackOrbitLib() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-card sm:h-[180px]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(1200px,400vw)] max-w-none origin-center -translate-x-1/2 -translate-y-1/2 scale-[0.2]">
        <StackFeatureSection />
      </div>
    </div>
  );
}

function PreviewInfiniteSliderLib() {
  return (
    <div className="flex h-[168px] flex-col justify-center overflow-hidden rounded-lg border border-border bg-muted/30 px-2 sm:h-[180px]">
      <InfiniteSlider gap={24} speed={50} className="py-2">
        <span className="shrink-0 rounded-md bg-primary/15 px-3 py-1 text-xs font-medium text-primary">Next.js</span>
        <span className="shrink-0 rounded-md bg-primary/15 px-3 py-1 text-xs font-medium text-primary">React</span>
        <span className="shrink-0 rounded-md bg-primary/15 px-3 py-1 text-xs font-medium text-primary">Tailwind</span>
        <span className="shrink-0 rounded-md bg-primary/15 px-3 py-1 text-xs font-medium text-primary">TypeScript</span>
      </InfiniteSlider>
    </div>
  );
}

function PreviewRadarBg() {
  return (
    <div className="relative flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <div className="pointer-events-none relative flex w-full max-w-xl scale-[0.42] flex-col items-center gap-3">
        <div className="flex w-full justify-between gap-6 px-2">
          <RadarIconContainer
            delay={0.1}
            text="Web"
            icon={<FileText className="h-8 w-8 text-slate-600" />}
          />
          <RadarIconContainer
            delay={0.15}
            text="Apps"
            icon={<CircleDollarSign className="h-8 w-8 text-slate-600" />}
          />
          <RadarIconContainer
            delay={0.12}
            text="Design"
            icon={<ClipboardList className="h-8 w-8 text-slate-600" />}
          />
        </div>
        <div className="flex w-2/3 justify-between gap-8">
          <RadarIconContainer delay={0.18} text="Dados" icon={<BarChart3 className="h-8 w-8 text-slate-600" />} />
          <RadarIconContainer delay={0.2} text="Deploy" icon={<Upload className="h-8 w-8 text-slate-600" />} />
        </div>
        <div className="flex w-full justify-between gap-10 px-4">
          <RadarIconContainer delay={0.14} text="Docs" icon={<FileCheck2 className="h-8 w-8 text-slate-600" />} />
          <RadarIconContainer delay={0.16} text="CMS" icon={<FileStack className="h-8 w-8 text-slate-600" />} />
        </div>
        <Radar className="absolute -bottom-16 opacity-90" />
      </div>
    </div>
  );
}

/** Prévias de Backgrounds, Borders e Carrosséis — chunk lazy separado da biblioteca. */
export function LibraryMiscPreviewRouter({ id }: { id: string }) {
  switch (id) {
    case "geometric":
      return <PreviewGeometricBg />;
    case "paths":
      return <PreviewPathsBg />;
    case "beams":
      return <PreviewBeamsBg />;
    case "smoke":
      return <PreviewSmokeBg />;
    case "falling":
      return <PreviewFallingBg />;
    case "particle":
      return <PreviewParticleBg />;
    case "spiral":
      return <PreviewSpiralBg />;
    case "radar":
      return <PreviewRadarBg />;
    case "neon":
      return <PreviewNeonBorder />;
    case "shine":
      return <PreviewShineBorder />;
    case "lamp":
      return <PreviewLampBorder />;
    case "ripple":
      return <PreviewRippleBorder />;
    case "glow-x":
      return <PreviewGlowXBorder />;
    case "spotlight":
      return <PreviewSpotlightBorder />;
    case "grad":
      return <PreviewGradBorder />;
    case "search":
      return <PreviewSearchBorder />;
    case "bauhaus":
      return <PreviewBauhausBorder />;
    case "rainbow":
      return <PreviewRainbowBorder />;
    case "omni":
      return <PreviewOmniBorder />;
    case "paper":
      return <PreviewPaperBorder />;
    case "wave":
      return <PreviewWaveBorder />;
    case "moving":
      return <PreviewMovingBorder />;
    case "logos3":
      return <PreviewLogos3Carousel />;
    case "gallery4":
      return <PreviewGallery4Carousel />;
    case "logo-cloud-3":
      return <PreviewLogoCloud3Lib />;
    case "logo-cloud-4":
      return <PreviewLogoCloud4Lib />;
    case "customers":
      return <PreviewCustomersLib />;
    case "spinning":
      return <PreviewSpinningLogosLib />;
    case "stack-orbit":
      return <PreviewStackOrbitLib />;
    case "infinite-slider":
      return <PreviewInfiniteSliderLib />;
    default:
      return null;
  }
}
