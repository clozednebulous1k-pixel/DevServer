"use client";

import {
  PreviewAnimatedLetters,
  PreviewAnimatedShiny,
  PreviewAnimatedUnderlineCss,
  PreviewAnimatedUnderlineOne,
  PreviewBlurredStagger,
  PreviewHandWritten,
  PreviewInfiniteMarquee,
  PreviewInteractiveParticle,
  PreviewMagneticText,
  PreviewParticleTextLib,
  PreviewRevealText,
  PreviewShimmerTextLib,
  PreviewShiningTextLib,
  PreviewTextColor,
  PreviewTextThree,
  PreviewVaporize,
  PreviewVerticalText,
} from "@/components/prompts/text-prompt-previews";

export function TextPreviewLazyRouter({ id }: { id: string }) {
  switch (id) {
    case "text-three":
      return <PreviewTextThree />;
    case "animated-letters":
      return <PreviewAnimatedLetters />;
    case "hand-written":
      return <PreviewHandWritten />;
    case "underline-one":
      return <PreviewAnimatedUnderlineOne />;
    case "shiny":
      return <PreviewAnimatedShiny />;
    case "blurred-stagger":
      return <PreviewBlurredStagger />;
    case "shining":
      return <PreviewShiningTextLib />;
    case "underline-css":
      return <PreviewAnimatedUnderlineCss />;
    case "marquee":
      return <PreviewInfiniteMarquee />;
    case "text-color":
      return <PreviewTextColor />;
    case "reveal":
      return <PreviewRevealText />;
    case "vertical":
      return <PreviewVerticalText />;
    case "interactive-particle":
      return <PreviewInteractiveParticle />;
    case "vaporize":
      return <PreviewVaporize />;
    case "particle-effect":
      return <PreviewParticleTextLib />;
    case "magnetic":
      return <PreviewMagneticText />;
    case "shimmer":
      return <PreviewShimmerTextLib />;
    default:
      return null;
  }
}
