"use client";

import Image from "next/image";
import { useState } from "react";
import InteractiveBentoGallery, { type MediaItemType } from "@/components/ui/interactive-bento-gallery";
import { StackedCardsInteraction } from "@/components/ui/stacked-cards-interaction";
import InteractiveSelector from "@/components/ui/interactive-selector";
import { DicedHeroSection } from "@/components/ui/diced-hero-section";
import { FlipReveal, FlipRevealItem } from "@/components/ui/flip-reveal";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";
import { ArcGalleryHero } from "@/components/ui/arc-gallery-hero-component";
import ImageReveal from "@/components/ui/image-tiles";
import { CircularGallery } from "@/components/ui/circular-gallery-ogl";
import { RotatingPhotoRing } from "@/components/ui/rotating-photo-ring";

const bentoPreviewItems: MediaItemType[] = [
  {
    id: 1,
    type: "image",
    title: "Floresta",
    desc: "Trilha",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    span: "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2",
  },
  {
    id: 2,
    type: "image",
    title: "Praia",
    desc: "Horizonte",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2",
  },
  {
    id: 3,
    type: "image",
    title: "Montanha",
    desc: "Neve",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    span: "md:col-span-1 md:row-span-2 sm:col-span-1 sm:row-span-2",
  },
  {
    id: 4,
    type: "image",
    title: "Cidade",
    desc: "Noite",
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80",
    span: "md:col-span-2 md:row-span-2 sm:col-span-1 sm:row-span-2",
  },
];

export function PreviewInteractiveBentoGallery() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-background sm:h-[180px]">
      <div className="pointer-events-none absolute inset-0 origin-top scale-[0.42]">
        <InteractiveBentoGallery
          mediaItems={bentoPreviewItems}
          title=""
          description=""
        />
      </div>
    </div>
  );
}

const stackedPreviewCards = [
  {
    image: "https://images.unsplash.com/photo-1528741254566-d718e868201f?w=600&q=80",
    title: "Card 1",
    description: "Primeiro",
  },
  {
    image: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=600&q=80",
    title: "Card 2",
    description: "Segundo",
  },
  {
    image: "https://images.unsplash.com/photo-1526827826797-7b05204a22ef?w=600&q=80",
    title: "Card 3",
    description: "Terceiro",
  },
];

export function PreviewStackedCardsInteraction() {
  return (
    <div className="relative flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30 sm:h-[180px]">
      <div className="pointer-events-none origin-center scale-[0.38]">
        <StackedCardsInteraction cards={stackedPreviewCards} />
      </div>
    </div>
  );
}

export function PreviewScrollExpandStatic() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border sm:h-[180px]">
      <Image
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"
        alt=""
        fill
        className="object-cover"
        sizes="400px"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 p-2 text-center">
        <p className="text-xs font-medium text-white">Scroll expand</p>
        <p className="text-[10px] text-white/80">Roda no viewport inteiro</p>
      </div>
    </div>
  );
}

export function PreviewScrollCardsStatic() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border sm:h-[180px]">
      <Image
        src="https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=900&q=80"
        alt=""
        fill
        className="object-cover"
        sizes="400px"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-3">
        <p className="text-center text-lg font-bold text-white drop-shadow">Everest Camp</p>
        <p className="mt-1 text-center text-xs text-white/90">Cards sticky em scroll</p>
      </div>
    </div>
  );
}

export function PreviewInteractiveSelector() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border sm:h-[180px]">
      <div className="pointer-events-none absolute inset-0 origin-top scale-[0.35]">
        <InteractiveSelector />
      </div>
    </div>
  );
}

const dicedSlides = [
  { title: "A", image: "https://images.unsplash.com/photo-1620053927547-cf64d4829ff4?w=800&q=80" },
  { title: "B", image: "https://images.unsplash.com/photo-1623227866882-c005c26dfe41?w=800&q=80" },
  { title: "C", image: "https://images.unsplash.com/photo-1541857754-557a44522bec?w=800&q=80" },
  { title: "D", image: "https://images.unsplash.com/photo-1646340691161-521e588e9964?w=800&q=80" },
];

export function PreviewDicedHero() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-card sm:h-[180px]">
      <div className="pointer-events-none absolute left-1/2 top-0 w-[min(900px,95vw)] max-w-none origin-top -translate-x-1/2 scale-[0.22]">
        <DicedHeroSection
          topText="Discover"
          mainText="Freshness"
          subMainText="Short copy for preview."
          buttonText="Shop"
          slides={dicedSlides}
          topTextStyle={{ color: "var(--diced-hero-section-top-text)" }}
          mainTextStyle={{
            fontSize: "2.5rem",
            gradient:
              "linear-gradient(45deg, var(--diced-hero-section-main-gradient-from), var(--diced-hero-section-main-gradient-to))",
          }}
          subMainTextStyle={{ color: "var(--diced-hero-section-sub-text)" }}
          buttonStyle={{
            backgroundColor: "var(--diced-hero-section-button-bg)",
            color: "var(--diced-hero-section-button-fg)",
            borderRadius: "2rem",
            hoverColor: "var(--diced-hero-section-button-hover-bg)",
            hoverForeground: "var(--diced-hero-section-button-hover-fg)",
          }}
          separatorColor="var(--diced-hero-section-separator)"
          mobileBreakpoint={400}
        />
      </div>
    </div>
  );
}

function FlipRevealMiniDemo() {
  const [key, setKey] = useState("all");
  return (
    <div className="flex flex-col items-center gap-2">
      <ToggleGroup
        type="single"
        className="rounded-md border border-border bg-background p-1"
        value={key}
        onValueChange={(v) => v && setKey(v)}
      >
        <ToggleGroupItem value="all" className="px-2 text-xs">
          All
        </ToggleGroupItem>
        <ToggleGroupItem value="a" className="px-2 text-xs">
          A
        </ToggleGroupItem>
        <ToggleGroupItem value="b" className="px-2 text-xs">
          B
        </ToggleGroupItem>
      </ToggleGroup>
      <FlipReveal className="grid grid-cols-3 gap-1" keys={[key]} showClass="flex" hideClass="hidden">
        <FlipRevealItem flipKey="a">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1696086152504-4843b2106ab4?w=120&q=80"
            alt=""
            className="size-10 rounded-md object-cover sm:size-12"
          />
        </FlipRevealItem>
        <FlipRevealItem flipKey="b">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1648688135643-2716ec8f4b24?w=120&q=80"
            alt=""
            className="size-10 rounded-md object-cover sm:size-12"
          />
        </FlipRevealItem>
        <FlipRevealItem flipKey="a">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1583656346517-4716a62e27b7?w=120&q=80"
            alt=""
            className="size-10 rounded-md object-cover sm:size-12"
          />
        </FlipRevealItem>
      </FlipReveal>
    </div>
  );
}

export function PreviewFlipRevealBlock() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/20 sm:h-[180px]">
      <FlipRevealMiniDemo />
    </div>
  );
}

export function PreviewImageAccordion() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border sm:h-[180px]">
      <div className="pointer-events-none absolute left-0 top-0 w-[200%] max-w-none origin-top-left scale-[0.28]">
        <LandingAccordionItem />
      </div>
    </div>
  );
}

const arcImages = [
  "https://images.unsplash.com/photo-1546238232-20216dec9f72?w=400&q=80",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&q=80",
];

export function PreviewArcGallery() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border sm:h-[180px]">
      <div className="pointer-events-none absolute left-1/2 top-0 w-[min(800px,200vw)] max-w-none origin-top -translate-x-1/2 scale-[0.2]">
        <ArcGalleryHero images={arcImages} />
      </div>
    </div>
  );
}

export function PreviewZoomParallaxStatic() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border sm:h-[180px]">
      <Image
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
        alt=""
        fill
        className="object-cover"
        sizes="400px"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <p className="text-xs font-medium text-white">Zoom parallax (scroll longo)</p>
      </div>
    </div>
  );
}

export function PreviewImageTiles() {
  return (
    <div className="flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30 sm:h-[180px]">
      <div className="origin-center scale-[0.35]">
        <ImageReveal
          leftImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80"
          middleImage="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80"
          rightImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80"
        />
      </div>
    </div>
  );
}

export function PreviewCircularGalleryOgl() {
  return (
    <div className="relative h-[168px] overflow-hidden rounded-lg border border-border bg-neutral-950 sm:h-[180px]">
      <CircularGallery
        className="circular-gallery--preview"
        bend={2}
        scrollSpeed={1.2}
        textColor="#e5e5e5"
        font="bold 12px system-ui, sans-serif"
      />
    </div>
  );
}

export function PreviewRotatingPhotoRing() {
  return (
    <div className="relative flex h-[168px] items-center justify-center overflow-hidden rounded-lg border border-border bg-[#fff3ed] dark:bg-neutral-900 sm:h-[180px]">
      <div className="pointer-events-none flex h-full w-full items-center justify-center">
        <RotatingPhotoRing variant="preview" />
      </div>
    </div>
  );
}
