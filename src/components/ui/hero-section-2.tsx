"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";
import { useScroll } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
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

const groupVariants = {
  container: {
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.75,
      },
    },
  },
  ...transitionVariants,
};

export function HeroSection2() {
  return (
    <>
      <HeroHeader2 />
      <main className="overflow-hidden">
        <section>
          <div className="relative pt-24">
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
            <div className="mx-auto max-w-5xl px-6">
              <div className="sm:mx-auto lg:mr-auto">
                <AnimatedGroup variants={groupVariants}>
                  <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16">
                    Build and Ship 10x faster with NS
                  </h1>
                  <p className="mt-8 max-w-2xl text-pretty text-lg">
                    Tailwindcss highly customizable components for building modern websites and applications that look and feel the way you mean it.
                  </p>
                  <div className="mt-12 flex items-center gap-2">
                    <div className="rounded-[14px] border bg-foreground/10 p-0.5">
                      <Link
                        href="#link"
                        className={cn(
                          buttonVariants({ size: "lg" }),
                          "inline-flex h-11 items-center rounded-xl px-5 text-base",
                        )}
                      >
                        <span className="text-nowrap">Start Building</span>
                      </Link>
                    </div>
                    <Link
                      href="#link"
                      className={cn(
                        buttonVariants({ size: "lg", variant: "ghost" }),
                        "inline-flex h-[42px] items-center rounded-xl px-5 text-base",
                      )}
                    >
                      <span className="text-nowrap">Request a demo</span>
                    </Link>
                  </div>
                </AnimatedGroup>
              </div>
            </div>
            <AnimatedGroup variants={groupVariants}>
              <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 bg-gradient-to-b from-transparent from-35% to-background"
                />
                <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border bg-background p-4 shadow-lg shadow-zinc-950/15 ring-1 ring-background dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="relative hidden aspect-[15/8] rounded-2xl bg-background dark:block"
                    src="https://tailark.com/_next/image?url=%2Fmail2.png&w=3840&q=75"
                    alt="app screen"
                    width={2700}
                    height={1440}
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="relative z-[2] aspect-[15/8] rounded-2xl border border-border/25 dark:hidden"
                    src="https://tailark.com/_next/image?url=%2Fmail2-light.png&w=3840&q=75"
                    alt="app screen"
                    width={2700}
                    height={1440}
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <section className="bg-background pb-16 pt-16 md:pb-32">
          <div className="group relative m-auto max-w-5xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link href="/" className="block text-sm duration-150 hover:opacity-75">
                <span> Meet Our Customers</span>
                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>
            <div className="mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 group-hover:blur-sm sm:gap-x-16 sm:gap-y-14">
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
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

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

export function HeroHeader2() {
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
      <nav
        data-state={menuState ? "active" : "idle"}
        className={cn(
          "group fixed z-20 w-full border-b transition-colors duration-150",
          scrolled && "bg-background/50 backdrop-blur-3xl",
        )}
      >
        <div className="mx-auto max-w-5xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link href="/" aria-label="home" className="flex items-center space-x-2">
                <TailarkLogo />
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
          </div>
        </div>
      </nav>
    </header>
  );
}

function TailarkLogo({ className }: { className?: string }) {
  return (
    <span className={cn("bg-gradient-to-br from-[#9B99FE] to-[#2BC8B7] bg-clip-text text-lg font-bold tracking-tight text-transparent", className)}>
      NS
    </span>
  );
}
