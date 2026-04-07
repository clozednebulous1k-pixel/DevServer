"use client";

import dynamic from "next/dynamic";
import { Mountain } from "lucide-react";
import { AnimatedHero } from "@/components/ui/animated-hero-section-1";
import { CTASection } from "@/components/ui/hero-dithering-card";
import { FormBuilderHero } from "@/components/ui/hero-section-8";
import { GalaxyHeroSplinePreview } from "@/components/ui/galaxy-interactive-hero-section";
import { ParticleHero } from "@/components/ui/particle-hero";
import { HeroSection2 } from "@/components/ui/hero-section-2";
import { HeroSection5 } from "@/components/ui/hero-section-5";
import { NavbarHero } from "@/components/ui/hero-with-video";
import { MynaHero } from "@/components/ui/myna-hero";
import { DigitalLoomHeroDemo } from "@/components/ui/digital-loom-background";
import { DEFAULT_ROBOT_SCENE } from "@/components/ui/interactive-3d-robot";

const InteractiveRobotSpline = dynamic(
  () => import("@/components/ui/interactive-3d-robot").then((m) => m.InteractiveRobotSpline),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[140px] items-center justify-center bg-zinc-950 text-xs text-muted-foreground">
        Carregando prévia 3D…
      </div>
    ),
  },
);

const ShaderAnimationClient = dynamic(
  () => import("@/components/ui/shader-animation").then((m) => m.ShaderAnimation),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[168px] items-center justify-center rounded-lg border border-border bg-zinc-950 text-xs text-muted-foreground">
        Carregando shader…
      </div>
    ),
  },
);

const InteractiveHeroClient = dynamic(
  () => import("@/components/ui/interactive-hero-backgrounds").then((m) => m.InteractiveHero),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[168px] items-center justify-center rounded-lg border border-border bg-zinc-950 text-xs text-muted-foreground">
        Carregando WebGL…
      </div>
    ),
  },
);

export function PreviewMyna() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[min(1100px,200vw)] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.19)" }}
      >
        <MynaHero />
      </div>
    </div>
  );
}

export function PreviewLoom() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border sm:h-[180px]">
      <div className="absolute inset-0 origin-top scale-[0.62] sm:scale-[0.68]">
        <DigitalLoomHeroDemo />
      </div>
    </div>
  );
}

export function PreviewRobot() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-zinc-950 sm:h-[180px]">
      <InteractiveRobotSpline
        scene={DEFAULT_ROBOT_SCENE}
        className="absolute inset-0 z-0 h-full min-h-[168px] w-full sm:min-h-[180px]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-2 z-10 px-2 text-center">
        <p className="text-xs font-semibold text-white drop-shadow-md sm:text-sm">Robô 3D interativo</p>
      </div>
    </div>
  );
}

export function PreviewDither() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[min(900px,220vw)] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.42)" }}
      >
        <CTASection preview />
      </div>
    </div>
  );
}

const FORM_ILLUSTRATION =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80&auto=format&fit=crop";

export function PreviewForm8() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[640px] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.52) translateY(-8px)" }}
      >
        <FormBuilderHero
          illustrationSrc={FORM_ILLUSTRATION}
          illustrationAlt="Equipe colaborando"
          title="Formulários lindos, sem fricção"
          description="Fluxo simples em três passos — experimente sem criar conta."
          buttonText="Criar formulário"
          buttonHref="#"
        />
      </div>
    </div>
  );
}

const ANIMATED_BG =
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&q=80&auto=format&fit=crop";

export function PreviewAnimated() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[1100px] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.2)" }}
      >
        <AnimatedHero
          backgroundImageUrl={ANIMATED_BG}
          logo={
            <>
              <Mountain className="h-5 w-5 text-primary-foreground" />
              <span className="text-sm font-semibold text-primary-foreground">DevPeak</span>
            </>
          }
          navLinks={[
            { label: "Soluções", href: "#" },
            { label: "Cases", href: "#" },
            { label: "Preços", href: "#" },
          ]}
          topRightAction={
            <span className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-primary-foreground backdrop-blur-sm">
              Contato
            </span>
          }
          title="Lidere a próxima geração"
          description="Propósito, produto e escala — um hero fullscreen com imagem e CTAs em vidro."
          ctaButton={{ text: "Saiba mais", onClick: () => {} }}
          secondaryCta={{ text: "Fale conosco", onClick: () => {} }}
        />
      </div>
    </div>
  );
}

export function PreviewGalaxy() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <GalaxyHeroSplinePreview />
    </div>
  );
}

export function PreviewParticle() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-[#05060f] sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[1400px] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.2)" }}
      >
        <ParticleHero />
      </div>
    </div>
  );
}

export function PreviewHero2() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[1200px] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.16)" }}
      >
        <HeroSection2 />
      </div>
    </div>
  );
}

export function PreviewShader() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <ShaderAnimationClient className="absolute inset-0 h-full w-full min-h-[168px]" />
      <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-center text-2xl font-semibold tracking-tighter text-white">
        Shader
      </span>
    </div>
  );
}

const VIDEO_PREVIEW_IMG =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80&auto=format&fit=crop";

export function PreviewVideo() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[900px] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.32)" }}
      >
        <NavbarHero
          brandName="TechFlow"
          heroTitle="Inovação simples"
          heroDescription="Soluções para o digital moderno."
          backgroundImage={VIDEO_PREVIEW_IMG}
          videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        />
      </div>
    </div>
  );
}

export function PreviewHero5() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[1400px] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.12)" }}
      >
        <HeroSection5 />
      </div>
    </div>
  );
}

export function PreviewBallpit() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div
        className="pointer-events-none absolute left-1/2 top-0 w-[1100px] max-w-none origin-top"
        style={{ transform: "translateX(-50%) scale(0.15)" }}
      >
        <InteractiveHeroClient
          sphereCount={24}
          brandName="21st"
          heroTitle="Hero interativo"
          heroDescription="Esferas metálicas seguem o cursor — Three.js + tema."
          className="min-h-[720px] h-[720px]"
        />
      </div>
    </div>
  );
}
