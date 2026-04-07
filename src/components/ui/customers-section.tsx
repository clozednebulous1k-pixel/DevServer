"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { AnimatedGroup } from "@/components/ui/animated-group";
import { cn } from "@/lib/utils";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export interface CustomerLogo {
  src: string;
  alt: string;
  height: number;
}

export interface CustomersSectionProps {
  customers?: CustomerLogo[];
  className?: string;
  moreHref?: string;
  moreLabel?: string;
}

export function CustomersSection({
  customers = [],
  className,
  moreHref = "/projetos",
  moreLabel = "Ver projetos",
}: CustomersSectionProps) {
  return (
    <section className={cn("bg-background pb-16 pt-16 md:pb-24 md:pt-20", className)}>
      <div className="group relative m-auto max-w-5xl px-6">
        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
          <Link href={moreHref} className="block text-sm duration-150 hover:opacity-75">
            <span>{moreLabel}</span>
            <ChevronRight className="ml-1 inline-block size-3" />
          </Link>
        </div>
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}
          className="mx-auto mt-8 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 group-hover:blur-sm sm:gap-x-16 sm:gap-y-14"
        >
          {customers.map((logo, index) => (
            <div key={`${logo.src}-${index}`} className="flex">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="mx-auto h-auto w-fit dark:invert"
                src={logo.src}
                alt={logo.alt}
                height={logo.height}
                width={120}
              />
            </div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
