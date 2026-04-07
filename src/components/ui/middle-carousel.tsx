"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const logos = [
  { id: "logo-1", description: "React", image: "https://cdn.simpleicons.org/react", className: "h-8 w-auto" },
  { id: "logo-2", description: "Next.js", image: "https://cdn.simpleicons.org/nextdotjs", className: "h-8 w-auto" },
  { id: "logo-3", description: "TypeScript", image: "https://cdn.simpleicons.org/typescript", className: "h-8 w-auto" },
  {
    id: "logo-4",
    description: "Tailwind CSS",
    image: "https://cdn.simpleicons.org/tailwindcss",
    className: "h-7 w-auto",
  },
  { id: "logo-5", description: "Node.js", image: "https://cdn.simpleicons.org/nodedotjs", className: "h-8 w-auto" },
  { id: "logo-6", description: "PostgreSQL", image: "https://cdn.simpleicons.org/postgresql", className: "h-8 w-auto" },
  { id: "logo-7", description: "Docker", image: "https://cdn.simpleicons.org/docker", className: "h-8 w-auto" },
  { id: "logo-8", description: "Vercel", image: "https://cdn.simpleicons.org/vercel", className: "h-8 w-auto" },
  { id: "logo-9", description: "GitHub", image: "https://cdn.simpleicons.org/github", className: "h-8 w-auto" },
  { id: "logo-10", description: "Figma", image: "https://cdn.simpleicons.org/figma", className: "h-8 w-auto" },
  { id: "logo-11", description: "Firebase", image: "https://cdn.simpleicons.org/firebase", className: "h-8 w-auto" },
  { id: "logo-12", description: "Prisma", image: "https://cdn.simpleicons.org/prisma", className: "h-8 w-auto" },
];

export function MiddleCarousel() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-2">
      <div className="relative">
        <Carousel
          opts={{ loop: true, align: "start" }}
          plugins={[
            AutoScroll({
              playOnInit: true,
              speed: 0.6,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
            }),
          ]}
        >
          <CarouselContent className="ml-0">
            {logos.map((logo) => (
              <CarouselItem
                key={logo.id}
                className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <div className="mx-8 flex h-14 shrink-0 items-center justify-center">
                  <img src={logo.image} alt={logo.description} className={logo.className} loading="lazy" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
