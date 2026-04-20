"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { LibraryConceptPreview, isAbstractPreviewId } from "@/components/prompts/library-concept-preview";

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

function PreviewScrollStickyTabs() {
  const [active, setActive] = useState("es6");
  const ref = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "es6", label: "ES6" },
    { id: "flexbox", label: "Flexbox" },
    { id: "react", label: "React" },
    { id: "angular", label: "Angular" },
    { id: "other", label: "Other" },
  ] as const;

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const targets = tabs
      .map((t) => host.querySelector<HTMLElement>(`[data-scroll-id="${t.id}"]`))
      .filter(Boolean) as HTMLElement[];
    if (!targets.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target) setActive((visible.target as HTMLElement).dataset.scrollId ?? "es6");
      },
      { root: host, threshold: [0.55, 0.7] },
    );

    targets.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === active));

  return (
    <div
      ref={ref}
      className="relative h-[168px] overflow-y-auto rounded-lg border border-border bg-[#0b111a] text-white/90 sm:h-[180px]"
    >
      <section className="flex min-h-[108px] items-center justify-center px-3 text-center">
        <div>
          <p className="text-xs font-semibold tracking-wide">STICKY SLIDER NAV</p>
          <p className="mt-1 text-[10px] text-white/70">tabs fixas + slider ativo</p>
        </div>
      </section>
      <div className="sticky top-0 z-10 border-y border-white/10 bg-[#0f1726]/95 backdrop-blur">
        <div className="relative flex h-8 items-center px-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                ref.current
                  ?.querySelector<HTMLElement>(`[data-scroll-id="${tab.id}"]`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="flex-1 text-[9px] text-white/75"
            >
              {tab.label}
            </button>
          ))}
          <span
            className="absolute bottom-0 h-0.5 w-[20%] rounded-full bg-cyan-300 transition-all"
            style={{ left: `${activeIndex * 20}%` }}
          />
        </div>
      </div>
      {tabs.map((tab) => (
        <section
          key={tab.id}
          data-scroll-id={tab.id}
          className="flex min-h-[88px] items-center justify-center border-b border-white/5 px-3"
        >
          <div className="text-center">
            <p className="text-[10px] font-semibold">{tab.label}</p>
            <p className="text-[9px] text-white/60">conteúdo da seção {tab.label.toLowerCase()}</p>
          </div>
        </section>
      ))}
    </div>
  );
}

function PreviewScrollHorizontalPin() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const onScroll = () => {
      const max = host.scrollHeight - host.clientHeight;
      const progress = max > 0 ? host.scrollTop / max : 0;
      setX(progress);
    };

    onScroll();
    host.addEventListener("scroll", onScroll, { passive: true });
    return () => host.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={hostRef}
      className="relative h-[168px] overflow-y-auto rounded-lg border border-border bg-[#111] text-white/90 sm:h-[180px]"
    >
      <div className="h-[300px]">
        <section className="flex h-[76px] items-center justify-center text-center text-[10px] text-white/75">
          Scroll vertical
        </section>
        <section className="sticky top-0 flex h-[92px] items-center overflow-hidden border-y border-white/10 bg-black/70">
          <div
            className="flex w-[180%] items-center gap-3 px-3 transition-transform"
            style={{ transform: `translateX(${-x * 46}%)` }}
          >
            <div className="h-14 w-36 rounded-lg border border-white/10 bg-white/10 p-2">
              <div className="h-2 w-24 rounded-full bg-white/25" />
              <div className="mt-2 h-1.5 w-20 rounded-full bg-white/18" />
            </div>
            <div className="h-14 w-24 rounded-lg bg-amber-200/20" />
            <div className="h-14 w-24 rounded-lg bg-cyan-200/20" />
            <div className="h-14 w-24 rounded-lg bg-fuchsia-200/20" />
            <div className="h-14 w-24 rounded-lg bg-lime-200/20" />
          </div>
        </section>
        <section className="flex h-[132px] items-center justify-center text-center text-[10px] text-white/75">
          ...continua após o pin
        </section>
      </div>
    </div>
  );
}

function PreviewScrollFluidWords() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(0);
  const words = ["design.", "prototype.", "build.", "debug.", "ship."] as const;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onScroll = () => {
      const step = (host.scrollHeight - host.clientHeight) / words.length || 1;
      setFocus(Math.min(words.length - 1, Math.max(0, Math.round(host.scrollTop / step))));
    };
    onScroll();
    host.addEventListener("scroll", onScroll, { passive: true });
    return () => host.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={hostRef} className="relative h-[168px] overflow-y-auto rounded-lg border border-border bg-background sm:h-[180px]">
      <div className="h-[280px] p-3">
        <div className="sticky top-2 rounded-md border border-border bg-card/75 px-2 py-1 text-[10px] font-semibold">
          you can
        </div>
        <div className="mt-6 space-y-5 text-right text-[11px] font-semibold">
          {words.map((word, i) => (
            <p
              key={word}
              className={cn(
                "transition-all",
                i === focus ? "scale-105 text-primary opacity-100" : "opacity-30",
              )}
            >
              {word}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function PreviewScrollAxisToggleMarquee() {
  const [vertical, setVertical] = useState(false);
  const rowA = ["M", "J", "AWS", "SP", "BK", "H", "N", "HU"];
  const rowB = [...rowA].reverse();

  return (
    <div
      className={cn(
        "relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#0f1630] p-2 text-[#f8ecd7] sm:h-[180px]",
        vertical ? "flex flex-row gap-2" : "flex flex-col gap-2",
      )}
    >
      <button
        type="button"
        onClick={() => setVertical((v) => !v)}
        className={cn(
          "absolute left-2 top-2 z-10 inline-flex h-6 items-center justify-center rounded-full bg-[#2c3e90] px-2 text-[9px] font-semibold",
          vertical && "bg-[#4361ee]",
        )}
      >
        Toggle axis
      </button>

      {[rowA, rowB].map((row, idx) => (
        <div
          key={idx}
          className={cn(
            "relative mt-7 overflow-hidden rounded-md bg-[#1b2758]/65",
            vertical ? "h-full w-1/2 mt-8" : "h-1/2 w-full",
          )}
        >
          <div
            className={cn(
              "absolute inset-0 opacity-50",
              vertical
                ? "bg-[linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]"
                : "bg-[linear-gradient(to_right,transparent,#000_20%,#000_80%,transparent)]",
            )}
          />
          <div
            className={cn(
              "marquee-track absolute flex gap-2 px-2 py-2",
              vertical ? "left-0 top-0 flex-col" : "left-0 top-0",
              idx === 1 && !vertical && "marquee-x-reverse",
              idx === 1 && vertical && "marquee-y-reverse",
              idx === 0 && !vertical && "marquee-x",
              idx === 0 && vertical && "marquee-y",
            )}
          >
            {[...row, ...row].map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className={cn(
                  "inline-flex min-h-7 min-w-9 items-center justify-center rounded-md bg-[#2d428f] px-2 text-[9px] font-bold",
                  vertical && "min-h-8 min-w-8",
                )}
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      ))}
      <style jsx>{`
        .marquee-track {
          animation-duration: 12s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .marquee-x {
          animation-name: scroll-x;
        }
        .marquee-x-reverse {
          animation-name: scroll-x-reverse;
        }
        .marquee-y {
          animation-name: scroll-y;
        }
        .marquee-y-reverse {
          animation-name: scroll-y-reverse;
        }
        @keyframes scroll-x {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes scroll-x-reverse {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes scroll-y {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }
        @keyframes scroll-y-reverse {
          from {
            transform: translateY(-50%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function PreviewScrollSkewedOnePage() {
  const [page, setPage] = useState(1);
  const total = 5;

  useEffect(() => {
    const onWheel = (ev: WheelEvent) => {
      setPage((curr) => {
        if (ev.deltaY > 0) return Math.min(total, curr + 1);
        return Math.max(1, curr - 1);
      });
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowDown") setPage((curr) => Math.min(total, curr + 1));
      if (ev.key === "ArrowUp") setPage((curr) => Math.max(1, curr - 1));
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#15181a] sm:h-[180px]">
      {Array.from({ length: total }).map((_, i) => {
        const current = i + 1;
        const active = current === page;
        return (
          <div key={current} className={cn("absolute inset-0 transition-opacity duration-500", active ? "opacity-100" : "opacity-35")}>
            <div className="absolute left-0 top-0 h-full w-1/2 -translate-x-3 skew-x-[18deg] bg-[#232629]" />
            <div className="absolute right-0 top-0 h-full w-1/2 translate-x-3 -skew-x-[18deg] bg-[#2f3438]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-md border border-white/20 bg-black/30 px-3 py-1 text-center text-[10px] text-white">
                <p className="font-semibold">Page {current}</p>
                <p className="text-[9px] text-white/70">Scroll / ArrowUp / ArrowDown</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PreviewScrollInfinitePortraitGallery() {
  const srcDoc = useMemo(
    () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    *{margin:0;padding:0;box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:#fff0}
    html,body{width:100%;height:100%;overflow:hidden;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
    canvas{display:block;position:fixed;inset:0;width:100%;height:100%;cursor:grab}
    canvas:active{cursor:grabbing}
    .loading{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:12px;z-index:6;background:rgb(0 0 0 / .8);padding:8px 12px;border-radius:8px;font-family:monospace}
    .cache{position:fixed;inset:0;background:#000;z-index:5}
    .fullscreen-btn{position:fixed;right:10px;bottom:10px;width:28px;height:28px;border:0;border-radius:999px;background:rgb(0 0 0 / .8);color:#fff;z-index:7;cursor:pointer}
    .hint{position:fixed;left:8px;bottom:8px;z-index:7;background:rgb(0 0 0 / .75);padding:5px 6px;border-radius:8px;font-size:9px;color:#fff;max-width:72%}
    .hint a{color:tomato}
    .copy{position:fixed;left:8px;top:8px;background:rgb(255 255 255 / .9);color:#000;padding:4px 6px;border-radius:6px;font-size:9px;z-index:7}
  </style>
</head>
<body>
  <div class="cache"></div>
  <div class="loading">Loading... 0%</div>
  <button class="fullscreen-btn" aria-label="Fullscreen">⛶</button>
  <div id="ui" class="hint">Photo by <a href="https://unsplash.com/fr/@dynamicwang" target="_blank" rel="noopener nofollow">Dynamic Wang</a> on Unsplash || Scroll / drag / use - or +</div>
  <div class="copy">&amp;Toc</div>
  <script>
    const MES_IMAGES = [
      "https://images.unsplash.com/photo-1698732276362-8a2d4f3c5145?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1698732211807-d42a4879ff74?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1698729855527-5841d0e07c1b?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1698729821290-73bd6aff963b?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1698729821220-a52dca70bb82?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1698729257645-fad43df40e78?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1698729427290-288304ab8ff6?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1698729508209-e3e6f416402e?w=500&h=500&fit=crop"
    ];
    class InfinitePortraitGallery{
      constructor(){
        this.canvas=document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.gl=this.canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false});
        if(!this.gl){document.querySelector('.loading').textContent='WebGL indisponível';return;}
        this.images=[];this.textures=[];this.imageWidth=128;this.imageHeight=128;this.gap=18;
        this.viewOffset={x:0,y:0};this.drag={isDragging:false,lastX:0,lastY:0,velocityX:0,velocityY:0};
        this.inertia=0.95;this.bulgeStrength=0.38;this.bulgeRadius=1.35;this.adjustedBulgeRadius=this.bulgeRadius;
        this.resizeCanvas();window.addEventListener('resize',()=>this.resizeCanvas());
        this.init();this.setupEventListeners();this.setupFullscreen();this.loadPortraitImages();this.animate();
      }
      resizeCanvas(){
        this.canvas.width=window.innerWidth;this.canvas.height=window.innerHeight;
        const min=Math.min(this.canvas.width,this.canvas.height);
        const diagonal=Math.sqrt((this.canvas.width/min)**2+(this.canvas.height/min)**2);
        this.adjustedBulgeRadius=Math.max(this.bulgeRadius,diagonal*0.72);
        if(this.gl)this.gl.viewport(0,0,this.canvas.width,this.canvas.height);
      }
      init(){
        const vsSource=\`
attribute vec2 aPosition;attribute vec2 aTexCoord;varying vec2 vTexCoord;uniform vec2 uResolution;uniform vec2 uOffset;
uniform vec2 uImagePosition;uniform float uBulgeStrength;uniform float uBulgeRadius;
vec2 applyBulgeEffect(vec2 pos){vec2 normalizedPos=pos/uResolution;vec2 center=vec2(0.5,0.5);vec2 delta=normalizedPos-center;
float aspect=uResolution.x/uResolution.y;delta.x*=aspect;float dist=length(delta);
if(dist<uBulgeRadius){float t=dist/uBulgeRadius;float z=sqrt(max(0.05,0.5-t*t));delta*=0.35+uBulgeStrength/z;delta.x/=aspect;normalizedPos=center+delta;pos=normalizedPos*uResolution;}
return pos;}
void main(){vec2 pos=aPosition*vec2(${128},${128});pos+=uImagePosition;pos-=uOffset;pos=applyBulgeEffect(pos);vec2 clip=pos/uResolution*2.0-1.0;gl_Position=vec4(clip,0.0,1.0);vTexCoord=aTexCoord;}\`;
        const fsSource=\`
precision mediump float;varying vec2 vTexCoord;uniform sampler2D uSampler;
void main(){vec2 uv=vec2(vTexCoord.x,1.0-vTexCoord.y);vec4 color=texture2D(uSampler,uv);if(color.a<0.01) discard;gl_FragColor=color;}\`;
        this.program=this.createProgram(vsSource,fsSource);
        const SUBDIV=24,positions=[],texCoords=[],indices=[];
        for(let y=0;y<=SUBDIV;y++){for(let x=0;x<=SUBDIV;x++){positions.push(x/SUBDIV,y/SUBDIV);texCoords.push(x/SUBDIV,y/SUBDIV);}}
        for(let y=0;y<SUBDIV;y++){for(let x=0;x<SUBDIV;x++){const i=y*(SUBDIV+1)+x;indices.push(i,i+1,i+SUBDIV+1,i+1,i+SUBDIV+2,i+SUBDIV+1);}}
        this.indexCount=indices.length;
        this.positionBuffer=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.positionBuffer);this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(positions),this.gl.STATIC_DRAW);
        this.texCoordBuffer=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.texCoordBuffer);this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(texCoords),this.gl.STATIC_DRAW);
        this.indexBuffer=this.gl.createBuffer();this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer);this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices),this.gl.STATIC_DRAW);
        this.gl.enable(this.gl.BLEND);this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA);
      }
      async loadPortraitImages(){
        const loadingElement=document.querySelector('.loading');const cacheElement=document.querySelector('.cache');
        const imageCount=48;let loaded=0;
        for(let i=0;i<imageCount;i++){
          const img=new Image();img.crossOrigin='Anonymous';img.src=MES_IMAGES[i%MES_IMAGES.length];
          await new Promise((resolve)=>{img.onload=resolve;img.onerror=()=>{img.src=\`https://picsum.photos/id/\${(i%80)+1}/256/256\`;img.onload=resolve;img.onerror=resolve;}});
          this.images.push(img);this.textures.push(this.createTexture(img));loaded++;
          loadingElement.textContent=\`Loading... \${Math.round(loaded/imageCount*100)}%\`;
        }
        loadingElement.style.display='none';cacheElement.style.display='none';
      }
      createTexture(img){const tex=this.gl.createTexture();this.gl.bindTexture(this.gl.TEXTURE_2D,tex);
        this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,img);
        this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.gl.LINEAR);return tex;}
      getVisibleTiles(){
        const tiles=[],tileW=this.imageWidth+this.gap,tileH=this.imageHeight+this.gap;
        const left=this.viewOffset.x-this.canvas.width,right=this.viewOffset.x+this.canvas.width*2;
        const top=this.viewOffset.y-this.canvas.height,bottom=this.viewOffset.y+this.canvas.height*2;
        for(let y=Math.floor(top/tileH)-1;y<=Math.ceil(bottom/tileH)+1;y++){
          for(let x=Math.floor(left/tileW)-1;x<=Math.ceil(right/tileW)+1;x++){
            const idx=Math.abs((x*7919+y*7307)%this.images.length);tiles.push({x:x*tileW,y:y*tileH,imageIndex:idx});
          }
        } return tiles;
      }
      render(){
        if(!this.program||!this.images.length)return;
        this.gl.viewport(0,0,this.canvas.width,this.canvas.height);this.gl.clearColor(0,0,0,0);this.gl.clear(this.gl.COLOR_BUFFER_BIT);this.gl.useProgram(this.program);
        const posLoc=this.gl.getAttribLocation(this.program,'aPosition');this.gl.enableVertexAttribArray(posLoc);this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.positionBuffer);this.gl.vertexAttribPointer(posLoc,2,this.gl.FLOAT,false,0,0);
        const texLoc=this.gl.getAttribLocation(this.program,'aTexCoord');this.gl.enableVertexAttribArray(texLoc);this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.texCoordBuffer);this.gl.vertexAttribPointer(texLoc,2,this.gl.FLOAT,false,0,0);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.indexBuffer);
        this.gl.uniform2f(this.gl.getUniformLocation(this.program,'uResolution'),this.canvas.width,this.canvas.height);
        this.gl.uniform1f(this.gl.getUniformLocation(this.program,'uBulgeStrength'),this.bulgeStrength);
        this.gl.uniform1f(this.gl.getUniformLocation(this.program,'uBulgeRadius'),this.adjustedBulgeRadius);
        const offsetLoc=this.gl.getUniformLocation(this.program,'uOffset');
        const imgPosLoc=this.gl.getUniformLocation(this.program,'uImagePosition');
        const samplerLoc=this.gl.getUniformLocation(this.program,'uSampler');
        for(const t of this.getVisibleTiles()){
          this.gl.uniform2f(offsetLoc,this.viewOffset.x,this.viewOffset.y);this.gl.uniform2f(imgPosLoc,t.x,t.y);
          this.gl.activeTexture(this.gl.TEXTURE0);this.gl.bindTexture(this.gl.TEXTURE_2D,this.textures[t.imageIndex]);this.gl.uniform1i(samplerLoc,0);
          this.gl.drawElements(this.gl.TRIANGLES,this.indexCount,this.gl.UNSIGNED_SHORT,0);
        }
      }
      setupEventListeners(){
        this.canvas.addEventListener('mousedown',(e)=>{this.drag.isDragging=true;this.drag.lastX=e.clientX;this.drag.lastY=e.clientY;});
        window.addEventListener('mousemove',(e)=>{if(!this.drag.isDragging)return;const dx=e.clientX-this.drag.lastX,dy=e.clientY-this.drag.lastY;
          this.drag.velocityX=dx*0.3+this.drag.velocityX*0.7;this.drag.velocityY=dy*0.3+this.drag.velocityY*0.7;
          this.viewOffset.x-=this.drag.velocityX;this.viewOffset.y-=this.drag.velocityY;this.drag.lastX=e.clientX;this.drag.lastY=e.clientY;});
        window.addEventListener('mouseup',()=>{this.drag.isDragging=false;});
        this.canvas.addEventListener('wheel',(e)=>{e.preventDefault();this.drag.velocityX+=e.deltaX*0.45;this.drag.velocityY+=e.deltaY*0.45;},{passive:false});
        window.addEventListener('keydown',(e)=>{if(e.key==='+'||e.key==='=')this.bulgeStrength=Math.min(1.5,this.bulgeStrength+0.05);
          if(e.key==='-'||e.key==='_')this.bulgeStrength=Math.max(0,this.bulgeStrength-0.05);});
      }
      setupFullscreen(){
        const btn=document.querySelector('.fullscreen-btn');
        btn.addEventListener('click',()=>{if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();});
      }
      animate(){
        if(!this.drag.isDragging){this.viewOffset.x-=this.drag.velocityX;this.viewOffset.y-=this.drag.velocityY;this.drag.velocityX*=this.inertia;this.drag.velocityY*=this.inertia;
          if(Math.abs(this.drag.velocityX)<0.01)this.drag.velocityX=0;if(Math.abs(this.drag.velocityY)<0.01)this.drag.velocityY=0;}
        this.render();requestAnimationFrame(()=>this.animate());
      }
      createProgram(vsSource,fsSource){const vs=this.loadShader(this.gl.VERTEX_SHADER,vsSource),fs=this.loadShader(this.gl.FRAGMENT_SHADER,fsSource),prog=this.gl.createProgram();
        this.gl.attachShader(prog,vs);this.gl.attachShader(prog,fs);this.gl.linkProgram(prog);if(!this.gl.getProgramParameter(prog,this.gl.LINK_STATUS))return null;return prog;}
      loadShader(type,source){const shader=this.gl.createShader(type);this.gl.shaderSource(shader,source);this.gl.compileShader(shader);if(!this.gl.getShaderParameter(shader,this.gl.COMPILE_STATUS)){this.gl.deleteShader(shader);return null;}return shader;}
    }
    window.addEventListener('DOMContentLoaded',()=>new InfinitePortraitGallery());
  </script>
</body>
</html>`,
    [],
  );

  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <iframe
        title="Infinite portrait gallery preview"
        srcDoc={srcDoc}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </div>
  );
}

function PreviewScrollBrutalMagicVelocity() {
  const srcDoc = useMemo(
    () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=Syncopate:wght@700&display=swap" rel="stylesheet">
  <style>
    :root{--bg:#030303;--fg:#e0e0e0;--accent:#ccff00;--secondary:#ff00ff}
    *{box-sizing:border-box;margin:0;padding:0;cursor:none}
    html,body{width:100%;height:100%;overflow:hidden;background:var(--bg);font-family:'Space Grotesk',sans-serif;color:var(--fg)}
    .noise{position:fixed;inset:0;pointer-events:none;z-index:30;opacity:.06;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")}
    #cursor{position:fixed;left:0;top:0;width:14px;height:14px;border-radius:50%;background:var(--accent);mix-blend-mode:difference;z-index:40;pointer-events:none;transform:translate(-50%,-50%)}
    #cursor.magnet{width:36px;height:36px;background:transparent;border:1px solid var(--accent)}
    #scroll-content{height:100%;overflow-y:auto;transform-origin:center top;will-change:transform}
    .brutal-nav{position:sticky;top:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:rgba(0,0,0,.35);backdrop-filter:blur(6px);border-bottom:1px solid rgba(255,255,255,.1)}
    .nav-logo{font-family:'Syncopate',sans-serif;font-size:11px;color:#fff;text-decoration:none}
    .nav-menu{display:flex;list-style:none;gap:10px}
    .nav-link{position:relative;color:#fff;text-decoration:none;font-size:8px;letter-spacing:.8px}
    .cta-btn{border:0;background:#fff;color:#000;border-radius:999px;padding:5px 8px;font-size:8px;font-weight:700}
    .hero{height:120px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;position:relative}
    .hero h1{font-family:'Syncopate',sans-serif;font-size:24px;line-height:.9;color:transparent;-webkit-text-stroke:1px var(--fg)}
    .word{display:inline-block}
    .char{display:inline-block;transition:transform .2s,color .2s}
    .hero h1:hover .char{color:var(--accent);-webkit-text-stroke:0;transform:translateY(-1px)}
    .tape-wrapper{position:absolute;bottom:8px;left:-20%;width:140%;background:var(--accent);color:#000;transform:rotate(-2deg);padding:3px 0;overflow:hidden}
    .tape-text{font-family:'Syncopate',sans-serif;font-size:8px;white-space:nowrap;animation:tape 12s linear infinite}
    @keyframes tape{to{transform:translateX(-50%)}}
    .section-dark{min-height:110px;display:flex;align-items:center;padding:12px;background:#090909;border-top:1px solid #202020}
    .big-text{font-size:12px;line-height:1.2;color:#4d4d4d}
    .big-text span{color:#fff;font-weight:700}
    .footer{height:80px;background:#fff;color:#000;display:flex;align-items:center;justify-content:center;flex-direction:column}
    .footer h2{font-family:'Syncopate',sans-serif;font-size:14px}
  </style>
</head>
<body>
  <div class="noise"></div>
  <div id="cursor"></div>
  <div id="scroll-content">
    <nav class="brutal-nav">
      <a href="#" class="nav-logo magnetic">ALERAK</a>
      <ul class="nav-menu">
        <li><a href="#" class="nav-link magnetic" data-text="WORK">WORK</a></li>
        <li><a href="#" class="nav-link magnetic" data-text="ABOUT">ABOUT</a></li>
        <li><a href="#" class="nav-link magnetic" data-text="LABS">LABS</a></li>
      </ul>
      <button class="cta-btn magnetic"><span>LET'S TALK</span></button>
    </nav>
    <section class="hero">
      <h1><div class="word">BRUTAL</div><br><div class="word">MAGIC</div></h1>
      <div class="tape-wrapper"><div class="tape-text">ALERAK STUDIO ✦ SCROLL VELOCITY ✦ INTERACTIVE SYSTEMS ✦ ALERAK STUDIO ✦ SCROLL VELOCITY ✦ INTERACTIVE SYSTEMS ✦</div></div>
    </section>
    <section class="section-dark"><p class="big-text">WE BUILD <span>DIGITAL EXPERIENCES</span> THAT DEFY GRAVITY. NO TEMPLATES. NO LIMITS.</p></section>
    <section class="section-dark" style="justify-content:flex-end;text-align:right"><p class="big-text">INTERACTION<br><span>REDEFINED</span></p></section>
    <div class="footer"><h2>ALERAK</h2><p style="font-size:10px">© 2026</p></div>
  </div>
  <script>
    const words=document.querySelectorAll('.hero h1 .word');
    words.forEach((word)=>{const text=word.innerText;word.innerHTML='';text.split('').forEach((char)=>{const span=document.createElement('span');span.classList.add('char');span.innerText=char;word.appendChild(span);});});
    const cursor=document.getElementById('cursor');const magneticElements=document.querySelectorAll('.magnetic');let mouseX=0,mouseY=0,cursorX=0,cursorY=0;
    window.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY;});
    function lerp(a,b,f){return a+(b-a)*f;}
    function animateCursor(){cursorX=lerp(cursorX,mouseX,.15);cursorY=lerp(cursorY,mouseY,.15);cursor.style.transform='translate('+cursorX+'px,'+cursorY+'px) translate(-50%,-50%)';requestAnimationFrame(animateCursor);}
    animateCursor();
    magneticElements.forEach((el)=>{el.addEventListener('mousemove',(e)=>{const r=el.getBoundingClientRect();const cx=r.left+r.width/2;const cy=r.top+r.height/2;const mx=(e.clientX-cx)*.35;const my=(e.clientY-cy)*.35;el.style.transform='translate('+mx+'px,'+my+'px)';cursor.classList.add('magnet');});el.addEventListener('mouseleave',()=>{el.style.transform='translate(0,0)';cursor.classList.remove('magnet');});});
    const nav=document.querySelector('.brutal-nav');const content=document.getElementById('scroll-content');let lastTop=0,skew=0;
    content.addEventListener('scroll',()=>{const top=content.scrollTop;const velocity=top-lastTop;lastTop=top;if(top>20)nav.style.background='rgba(10,10,10,.85)';else nav.style.background='rgba(0,0,0,.35)';
      const target=Math.max(Math.min(velocity*.15,4),-4);skew=lerp(skew,target,.12);content.style.transform='skewY('+skew+'deg)';});
    const alpha='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    document.querySelectorAll('[data-text]').forEach((link)=>{link.addEventListener('mouseenter',(e)=>{let iter=0;const original=e.target.dataset.text;clearInterval(e.target._i);e.target._i=setInterval(()=>{e.target.innerText=original.split('').map((l,i)=>i<iter?original[i]:alpha[Math.floor(Math.random()*26)]).join('');if(iter>=original.length)clearInterval(e.target._i);iter+=1/3;},30);});link.addEventListener('mouseleave',(e)=>{clearInterval(e.target._i);e.target.innerText=e.target.dataset.text;});});
  </script>
</body>
</html>`,
    [],
  );

  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <iframe
        title="Brutal Magic velocity scroll preview"
        srcDoc={srcDoc}
        className="h-full w-full border-0"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}

function PreviewAbstractBackground({ id }: { id: string }) {
  if (id === "abstract-bg-grid-dots-parallax") {
    return (
      <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#090d12] sm:h-[180px]">
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(148,163,184,.34) 1px, transparent 1px), radial-gradient(circle, rgba(34,211,238,.2) 1px, transparent 1px)",
            backgroundSize: "16px 16px, 24px 24px",
            backgroundPosition: "0 0, 8px 12px",
          }}
        />
        <div className="absolute inset-x-4 top-4 h-20 rounded-xl border border-white/10 bg-white/5 backdrop-blur-[1px]" />
        <div className="absolute inset-x-4 bottom-4 grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="h-6 rounded-md border border-white/12 bg-white/5" />
          ))}
        </div>
      </div>
    );
  }
  if (id === "abstract-bg-aurora-gradient") {
    return (
      <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#070a11] sm:h-[180px]">
        <div className="absolute -left-10 top-0 h-24 w-36 rounded-full bg-emerald-400/30 blur-2xl" />
        <div className="absolute right-0 top-8 h-24 w-36 rounded-full bg-violet-400/30 blur-2xl" />
        <div className="absolute bottom-0 left-10 h-20 w-40 rounded-full bg-cyan-300/25 blur-2xl" />
        <div className="absolute inset-x-4 top-5 rounded-xl border border-white/10 bg-black/25 p-3">
          <div className="h-2 w-2/3 rounded-full bg-white/30" />
          <div className="mt-2 h-2 w-1/2 rounded-full bg-white/20" />
          <div className="mt-3 h-7 w-24 rounded-md bg-emerald-300/35" />
        </div>
      </div>
    );
  }
  if (id === "abstract-bg-noise-grain") {
    return (
      <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-zinc-900 sm:h-[180px]">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-700/35 via-zinc-900 to-zinc-950" />
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, rgba(255,255,255,.16) 1px, transparent 1px), radial-gradient(circle at 80% 60%, rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "5px 5px, 7px 7px",
          }}
        />
        <div className="absolute inset-x-4 bottom-4 h-8 rounded-md border border-white/10 bg-white/5" />
      </div>
    );
  }
  if (id === "abstract-bg-mesh-blobs") {
    return (
      <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#0a0e16] sm:h-[180px]">
        <div className="absolute -left-8 top-6 h-24 w-32 rounded-[40%] bg-fuchsia-400/30 blur-2xl" />
        <div className="absolute right-2 top-4 h-20 w-28 rounded-[45%] bg-cyan-400/28 blur-2xl" />
        <div className="absolute bottom-1 left-1/2 h-20 w-36 -translate-x-1/2 rounded-[50%] bg-emerald-400/25 blur-2xl" />
        <div className="absolute inset-x-5 top-6 h-14 rounded-xl border border-white/10 bg-black/20" />
      </div>
    );
  }
  if (id === "abstract-bg-hex-honeycomb") {
    return (
      <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#0b1017] sm:h-[180px]">
        <div
          className="absolute inset-0 opacity-45"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(148,163,184,.2) 0 1px, transparent 1px), linear-gradient(30deg, rgba(56,189,248,.12) 12%, transparent 12.5%, transparent 87%, rgba(56,189,248,.12) 87.5%, rgba(56,189,248,.12)), linear-gradient(150deg, rgba(56,189,248,.12) 12%, transparent 12.5%, transparent 87%, rgba(56,189,248,.12) 87.5%, rgba(56,189,248,.12))",
            backgroundSize: "18px 18px, 22px 38px, 22px 38px",
          }}
        />
        <div className="absolute inset-x-4 bottom-4 h-8 rounded-md border border-cyan-300/30 bg-cyan-300/10" />
      </div>
    );
  }
  if (id === "abstract-bg-diagonal-stripes") {
    return (
      <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#0a0d14] sm:h-[180px]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(148,163,184,.16) 0 2px, transparent 2px 12px)",
          }}
        />
        <div className="absolute inset-x-4 top-6 h-12 rounded-lg border border-white/10 bg-black/25" />
      </div>
    );
  }
  if (id === "abstract-bg-vignette-spotlight") {
    return (
      <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#080b11] sm:h-[180px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(56,189,248,.35),rgba(12,16,24,.95)_62%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(3,6,12,.82)_90%)]" />
        <div className="absolute inset-x-6 bottom-5 h-8 rounded-md border border-white/10 bg-white/5" />
      </div>
    );
  }
  if (id === "abstract-bg-cyber-grid-perspective") {
    return (
      <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#060911] sm:h-[180px]">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.18) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            transform: "perspective(180px) rotateX(50deg) translateY(22px)",
            transformOrigin: "center bottom",
          }}
        />
        <div className="absolute inset-x-5 top-5 h-12 rounded-lg border border-cyan-300/20 bg-cyan-300/5" />
      </div>
    );
  }
  if (id === "abstract-bg-watercaustics-fake") {
    return (
      <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#07101a] sm:h-[180px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(56,189,248,.28),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(59,130,246,.26),transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "repeating-linear-gradient(120deg, rgba(255,255,255,.14) 0 1px, transparent 1px 9px)",
          }}
        />
      </div>
    );
  }
  if (id === "abstract-bg-gradient-mesh-css") {
    return (
      <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#090e16] sm:h-[180px]">
        <div className="absolute -left-8 top-4 h-24 w-28 rounded-full bg-indigo-400/30 blur-2xl" />
        <div className="absolute right-0 top-0 h-24 w-32 rounded-full bg-cyan-400/28 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 h-20 w-32 rounded-full bg-fuchsia-400/20 blur-2xl" />
        <div className="absolute inset-x-4 bottom-4 h-10 rounded-md border border-white/10 bg-black/20" />
      </div>
    );
  }
  return <LibraryConceptPreview seed={id} tone="background" />;
}

/** Prévias de Backgrounds, Borders e Carrosséis - chunk lazy separado da biblioteca. */
export function LibraryMiscPreviewRouter({ id }: { id: string }) {
  if (id.startsWith("abstract-bg-")) {
    return <PreviewAbstractBackground id={id} />;
  }
  if (isAbstractPreviewId(id)) {
    const tone =
      id.includes("-carousel") || id.includes("carousel-")
        ? "carousel"
        : id.includes("-border") || id.includes("border-")
          ? "border"
          : "background";
    return <LibraryConceptPreview seed={id} tone={tone} />;
  }
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
    case "scroll-sticky-tabs":
      return <PreviewScrollStickyTabs />;
    case "scroll-horizontal-pin":
      return <PreviewScrollHorizontalPin />;
    case "scroll-fluid-words":
      return <PreviewScrollFluidWords />;
    case "scroll-axis-toggle-marquee":
      return <PreviewScrollAxisToggleMarquee />;
    case "scroll-skewed-onepage":
      return <PreviewScrollSkewedOnePage />;
    case "scroll-infinite-portrait-gallery":
      return <PreviewScrollInfinitePortraitGallery />;
    case "scroll-brutal-magic-velocity":
      return <PreviewScrollBrutalMagicVelocity />;
    default:
      return null;
  }
}
