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
    default:
      return null;
  }
}
