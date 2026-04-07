"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

export interface Logos3Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

export interface Logos3Props {
  heading?: string;
  logos?: Logos3Logo[];
  className?: string;
}

const defaultLogos: Logos3Logo[] = [
  {
    id: "logo-1",
    description: "Astro",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-2",
    description: "Figma",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/figma-wordmark.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-3",
    description: "Next.js",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/nextjs-wordmark.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-4",
    description: "React",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react-wordmark.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-5",
    description: "shadcn/ui",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-wordmark.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-6",
    description: "Supabase",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/supabase-wordmark.svg",
    className: "h-7 w-auto",
  },
  {
    id: "logo-7",
    description: "Tailwind CSS",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-wordmark.svg",
    className: "h-4 w-auto",
  },
  {
    id: "logo-8",
    description: "Vercel",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vercel-wordmark.svg",
    className: "h-7 w-auto",
  },
];

export function Logos3({
  heading = "Empresas e times que confiam nesta stack",
  logos = defaultLogos,
  className,
}: Logos3Props) {
  return (
    <section className={className ?? "py-12 md:py-16 lg:py-20"}>
      <div className="container flex flex-col items-center text-center">
        <h2 className="my-4 text-balance text-2xl font-bold lg:text-3xl">{heading}</h2>
        <p className="max-w-xl text-sm text-muted-foreground">
          Marcas de referência no ecossistema web moderno — o mesmo tipo de base técnica que usamos nos projetos.
        </p>
      </div>
      <div className="pt-8 md:pt-10 lg:pt-12">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <Carousel opts={{ loop: true }} plugins={[AutoScroll({ playOnInit: true, speed: 0.8 })]}>
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
                >
                  <div className="mx-10 flex shrink-0 items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.image}
                      alt={logo.description}
                      className={`opacity-80 grayscale transition-opacity hover:opacity-100 hover:grayscale-0 dark:brightness-0 dark:invert ${logo.className ?? ""}`}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
