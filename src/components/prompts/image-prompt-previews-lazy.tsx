"use client";

import {
  PreviewArcGallery,
  PreviewCircularGalleryOgl,
  PreviewDicedHero,
  PreviewFlipRevealBlock,
  PreviewImageAccordion,
  PreviewImageTiles,
  PreviewInteractiveBentoGallery,
  PreviewInteractiveSelector,
  PreviewRotatingPhotoRing,
  PreviewScrollCardsStatic,
  PreviewScrollExpandStatic,
  PreviewStackedCardsInteraction,
  PreviewZoomParallaxStatic,
} from "@/components/prompts/image-prompt-previews";

export function ImagePreviewLazyRouter({ id }: { id: string }) {
  switch (id) {
    case "bento":
      return <PreviewInteractiveBentoGallery />;
    case "stacked":
      return <PreviewStackedCardsInteraction />;
    case "scroll-expand":
      return <PreviewScrollExpandStatic />;
    case "scroll-cards":
      return <PreviewScrollCardsStatic />;
    case "selector":
      return <PreviewInteractiveSelector />;
    case "diced":
      return <PreviewDicedHero />;
    case "flip":
      return <PreviewFlipRevealBlock />;
    case "accordion":
      return <PreviewImageAccordion />;
    case "arc":
      return <PreviewArcGallery />;
    case "zoom-parallax":
      return <PreviewZoomParallaxStatic />;
    case "image-tiles":
      return <PreviewImageTiles />;
    case "ogl-circular-gallery":
      return <PreviewCircularGalleryOgl />;
    case "css-photo-ring":
      return <PreviewRotatingPhotoRing />;
    default:
      return null;
  }
}
