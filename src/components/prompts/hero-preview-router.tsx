"use client";

import dynamic from "next/dynamic";

function PreviewSkeleton() {
  return (
    <div className="flex h-[168px] items-center justify-center rounded-lg border border-border bg-muted/30 text-xs text-muted-foreground sm:h-[180px]">
      Carregando prévia…
    </div>
  );
}

const LegacyMyna = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewMyna })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyLoom = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewLoom })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyRobot = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewRobot })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyDither = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewDither })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyForm8 = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewForm8 })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyAnimated = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewAnimated })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyGalaxy = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewGalaxy })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyParticle = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewParticle })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyHero2 = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewHero2 })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyShader = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewShader })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyVideo = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewVideo })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyHero5 = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewHero5 })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const LegacyBallpit = dynamic(() => import("./legacy-hero-previews").then((m) => ({ default: m.PreviewBallpit })), {
  ssr: false,
  loading: PreviewSkeleton,
});

const MkStellar = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewStellar })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkPowerAi = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewPowerAi })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkAethera = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewAethera })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkRubik = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewRubik })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkWeb3 = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewWeb3 })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkGlassHls = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewGlassHls })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkGeist = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewGeist })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkAiBuilder = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewAiBuilder })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkTaskly = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewTaskly })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkBarlow = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewBarlow })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkBloom = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewBloom })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkTargo = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewTargo })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkSynapse = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewSynapse })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkAiUnlock = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewAiUnlock })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkClearInvoice = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewClearInvoice })), {
  ssr: false,
  loading: PreviewSkeleton,
});
const MkCalculator = dynamic(() => import("./marketing-heroes-part2").then((m) => ({ default: m.MarketingPreviewCalculator })), {
  ssr: false,
  loading: PreviewSkeleton,
});

export type HeroPreviewId =
  | "myna"
  | "loom"
  | "robot"
  | "dither"
  | "form8"
  | "animated"
  | "galaxy"
  | "particle"
  | "hero2"
  | "shader"
  | "video"
  | "hero5"
  | "ballpit"
  | "stellar"
  | "power-ai"
  | "aethera"
  | "rubik-era"
  | "web3-eos"
  | "glass-hls"
  | "geist-minimal"
  | "ai-builder-hls"
  | "taskly-glass"
  | "barlow-agency"
  | "bloom-glass"
  | "targo-red"
  | "synapse-hls"
  | "ai-unlock-hls"
  | "clear-invoice-hls"
  | "webfluin-calculator";

export function HeroPreviewRouter({ id }: { id: HeroPreviewId }) {
  switch (id) {
    case "myna":
      return <LegacyMyna />;
    case "loom":
      return <LegacyLoom />;
    case "robot":
      return <LegacyRobot />;
    case "dither":
      return <LegacyDither />;
    case "form8":
      return <LegacyForm8 />;
    case "animated":
      return <LegacyAnimated />;
    case "galaxy":
      return <LegacyGalaxy />;
    case "particle":
      return <LegacyParticle />;
    case "hero2":
      return <LegacyHero2 />;
    case "shader":
      return <LegacyShader />;
    case "video":
      return <LegacyVideo />;
    case "hero5":
      return <LegacyHero5 />;
    case "ballpit":
      return <LegacyBallpit />;
    case "stellar":
      return <MkStellar />;
    case "power-ai":
      return <MkPowerAi />;
    case "aethera":
      return <MkAethera />;
    case "rubik-era":
      return <MkRubik />;
    case "web3-eos":
      return <MkWeb3 />;
    case "glass-hls":
      return <MkGlassHls />;
    case "geist-minimal":
      return <MkGeist />;
    case "ai-builder-hls":
      return <MkAiBuilder />;
    case "taskly-glass":
      return <MkTaskly />;
    case "barlow-agency":
      return <MkBarlow />;
    case "bloom-glass":
      return <MkBloom />;
    case "targo-red":
      return <MkTargo />;
    case "synapse-hls":
      return <MkSynapse />;
    case "ai-unlock-hls":
      return <MkAiUnlock />;
    case "clear-invoice-hls":
      return <MkClearInvoice />;
    case "webfluin-calculator":
      return <MkCalculator />;
    default:
      return null;
  }
}
