"use client";

import dynamic from "next/dynamic";
import TextThree from "@/components/ui/text-three";
import { AnimatedText } from "@/components/ui/animated-text";
import { HandWrittenTitle } from "@/components/ui/hand-writing-text";
import { AnimatedUnderlineTextOne } from "@/components/ui/animated-underline-text-one";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BlurredStagger } from "@/components/ui/blurred-stagger-text";
import { ShiningText } from "@/components/ui/shining-text";
import { AnimatedUnderline } from "@/components/ui/animated-underline";
import { InfiniteTextMarquee } from "@/components/ui/infinite-text-marquee";
import { TextColor } from "@/components/ui/text-color";
import { RevealText } from "@/components/ui/reveal-text";
import { VerticalText } from "@/components/ui/vertical-text";
import { MagneticText } from "@/components/ui/morphing-cursor";
import ShimmerText from "@/components/ui/shimmer-text";

const InteractiveParticleTextClient = dynamic(
  () => import("@/components/ui/interactive-text-particle").then((m) => m.InteractiveParticleText),
  { ssr: false, loading: () => <div className="h-[120px] w-full animate-pulse rounded-lg bg-zinc-900" /> },
);

const VaporizeAnimationTextClient = dynamic(
  () => import("@/components/ui/vaporize-animation-text").then((m) => m.VaporizeAnimationText),
  { ssr: false, loading: () => <div className="h-[120px] w-full animate-pulse rounded-lg bg-black" /> },
);

const ParticleTextEffectClient = dynamic(
  () => import("@/components/ui/particle-text-effect").then((m) => m.ParticleTextEffect),
  { ssr: false, loading: () => <div className="h-[120px] w-full animate-pulse rounded-lg bg-black" /> },
);

export function PreviewTextThree() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-card sm:h-[180px]">
      <div className="scale-90">
        <TextThree />
      </div>
    </div>
  );
}

export function PreviewAnimatedLetters() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-card sm:h-[180px]">
      <AnimatedText text="Mishra Hub" textClassName="text-2xl md:text-3xl" />
    </div>
  );
}

export function PreviewHandWritten() {
  return (
    <div className="h-[168px] overflow-hidden rounded-lg border border-border bg-card sm:h-[180px]">
      <div className="origin-top scale-[0.45]">
        <HandWrittenTitle title="Kokonut UI" subtitle="Subtítulo" />
      </div>
    </div>
  );
}

export function PreviewAnimatedUnderlineOne() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-card sm:h-[180px]">
      <AnimatedUnderlineTextOne text="Namaste!" textClassName="text-2xl" />
    </div>
  );
}

export function PreviewAnimatedShiny() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-zinc-950 sm:h-[180px]">
      <AnimatedShinyText
        text="Hub"
        gradientColors="linear-gradient(90deg, #fff, #888, #fff)"
        textClassName="text-3xl font-bold md:text-4xl"
        className="py-2"
      />
    </div>
  );
}

export function PreviewBlurredStagger() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-card px-4 sm:h-[180px]">
      <BlurredStagger text="DevServer ❤️" />
    </div>
  );
}

export function PreviewShiningTextLib() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-zinc-950 sm:h-[180px]">
      <ShiningText text="HextaAI…" className="text-lg" />
    </div>
  );
}

export function PreviewAnimatedUnderlineCss() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-card sm:h-[180px]">
      <AnimatedUnderline />
    </div>
  );
}

export function PreviewInfiniteMarquee() {
  return (
    <div className="h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <InfiniteTextMarquee
        text="DevServer"
        link="/"
        speed={25}
        fontSize="3rem"
        showTooltip={false}
      />
    </div>
  );
}

export function PreviewTextColor() {
  return (
    <div className="h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div className="origin-top scale-[0.22]">
        <TextColor />
      </div>
    </div>
  );
}

export function PreviewRevealText() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-zinc-950 sm:h-[180px]">
      <RevealText
        text="WOW"
        fontSize="text-5xl sm:text-6xl"
        textColor="text-white"
        overlayColor="text-orange-500"
        letterDelay={0.06}
      />
    </div>
  );
}

export function PreviewVerticalText() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-card sm:h-[180px]">
      <VerticalText className="text-sm font-bold uppercase tracking-widest">summer</VerticalText>
    </div>
  );
}

export function PreviewInteractiveParticle() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <InteractiveParticleTextClient text="HOVER" className="absolute inset-0" />
    </div>
  );
}

export function PreviewVaporize() {
  return (
    <div className="h-[168px] overflow-hidden rounded-lg border border-border sm:h-[180px]">
      <VaporizeAnimationTextClient texts={["21st", "dev"]} />
    </div>
  );
}

export function PreviewParticleTextLib() {
  return (
    <div className="h-[168px] overflow-hidden rounded-lg border border-border bg-black sm:h-[180px]">
      <div className="origin-top scale-[0.35]">
        <ParticleTextEffectClient words={["HELLO"]} className="min-h-0 bg-transparent p-0" />
      </div>
    </div>
  );
}

export function PreviewMagneticText() {
  return (
    <div className="flex h-[168px] flex-col items-center justify-center gap-4 overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <MagneticText text="CREATE" hoverText="GO" className="scale-90" />
    </div>
  );
}

export function PreviewShimmerTextLib() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-card sm:h-[180px]">
      <ShimmerText className="text-2xl font-bold">Future</ShimmerText>
    </div>
  );
}
