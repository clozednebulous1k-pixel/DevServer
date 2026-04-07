"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ChevronRight } from "lucide-react";
import { useScroll, motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { cn } from "@/lib/utils";

const CUSTOMER_LOGOS = [
  { src: "https://html.tailus.io/blocks/customers/nvidia.svg", alt: "Nvidia", h: "h-5", height: 20 },
  { src: "https://html.tailus.io/blocks/customers/column.svg", alt: "Column", h: "h-4", height: 16 },
  { src: "https://html.tailus.io/blocks/customers/github.svg", alt: "GitHub", h: "h-4", height: 16 },
  { src: "https://html.tailus.io/blocks/customers/nike.svg", alt: "Nike", h: "h-5", height: 20 },
  { src: "https://html.tailus.io/blocks/customers/lemonsqueezy.svg", alt: "Lemon Squeezy", h: "h-5", height: 20 },
  { src: "https://html.tailus.io/blocks/customers/laravel.svg", alt: "Laravel", h: "h-4", height: 16 },
  { src: "https://html.tailus.io/blocks/customers/lilly.svg", alt: "Lilly", h: "h-7", height: 28 },
  { src: "https://html.tailus.io/blocks/customers/openai.svg", alt: "OpenAI", h: "h-6", height: 24 },
] as const;

const menuItems = [
  { name: "Features", href: "#link" },
  { name: "Solution", href: "#link" },
  { name: "Pricing", href: "#link" },
  { name: "About", href: "#link" },
];

export function HeroSection5() {
  return (
    <>
      <HeroHeader5 />
      <main className="overflow-x-hidden">
        <section>
          <div className="relative py-24 md:pb-32 lg:pb-36 lg:pt-72">
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                <h1 className="mt-8 max-w-2xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl">
                  Build 10x Faster with NS
                </h1>
                <p className="mt-8 max-w-2xl text-balance text-lg">
                  Highly customizable components for building modern websites and applications you mean it.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <Link
                    href="#link"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "inline-flex h-12 items-center rounded-full pl-5 pr-3 text-base",
                    )}
                  >
                    <span className="text-nowrap">Start Building</span>
                    <ChevronRight className="ml-1 size-4" />
                  </Link>
                  <Link
                    href="#link"
                    className={cn(
                      buttonVariants({ size: "lg", variant: "ghost" }),
                      "inline-flex h-12 items-center rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5",
                    )}
                  >
                    <span className="text-nowrap">Request a demo</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute inset-1 aspect-[2/3] overflow-hidden rounded-3xl border border-black/10 sm:aspect-video lg:rounded-[3rem] dark:border-white/5">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="size-full object-cover opacity-50 invert dark:opacity-35 dark:invert-0 dark:lg:opacity-75"
                src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477"
              />
            </div>
          </div>
        </section>
        <section className="bg-background pb-2">
          <div className="group relative m-auto max-w-7xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:max-w-44 md:border-r md:pr-6">
                <p className="text-end text-sm">Powering the best teams</p>
              </div>
              <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                  {CUSTOMER_LOGOS.map((logo) => (
                    <div key={logo.alt} className="flex">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className={cn("mx-auto w-fit dark:invert", logo.h)}
                        src={logo.src}
                        alt={logo.alt}
                        height={logo.height}
                        width={120}
                      />
                    </div>
                  ))}
                </InfiniteSlider>

                <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
                <ProgressiveBlur
                  className="pointer-events-none absolute left-0 top-0 h-full w-20"
                  direction="left"
                  blurIntensity={1}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute right-0 top-0 h-full w-20"
                  direction="right"
                  blurIntensity={1}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function HeroHeader5() {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <header>
      <nav data-state={menuState ? "active" : "idle"} className="group fixed z-20 w-full pt-2">
        <div
          className={cn(
            "mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12",
            scrolled && "bg-background/50 backdrop-blur-2xl",
          )}
        >
          <motion.div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6",
              scrolled && "lg:py-4",
            )}
          >
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <span className="bg-gradient-to-br from-[#9B99FE] to-[#2BC8B7] bg-clip-text text-lg font-bold tracking-tight text-transparent">
                  NS
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="m-auto size-6 duration-200 group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0" />
                <X className="absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-accent-foreground"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 group-data-[state=active]:block md:flex-nowrap dark:shadow-none lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none lg:group-data-[state=active]:flex dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="block text-muted-foreground duration-150 hover:text-accent-foreground"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Link href="#" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex justify-center")}>
                  <span>Login</span>
                </Link>
                <Link href="#" className={cn(buttonVariants({ size: "sm" }), "inline-flex justify-center")}>
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}
