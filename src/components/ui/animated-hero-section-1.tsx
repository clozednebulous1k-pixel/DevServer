"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface NavLink {
  label: string;
  href: string;
}

export interface AnimatedHeroProps {
  backgroundImageUrl: string;
  logo: React.ReactNode;
  navLinks: NavLink[];
  topRightAction?: React.ReactNode;
  title: string;
  description: string;
  ctaButton: {
    text: string;
    onClick: () => void;
  };
  secondaryCta?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function AnimatedHero({
  backgroundImageUrl,
  logo,
  navLinks,
  topRightAction,
  title,
  description,
  ctaButton,
  secondaryCta,
  className,
}: AnimatedHeroProps) {
  const glassButtonClassName =
    "border border-white/20 bg-white/10 text-primary-foreground backdrop-blur-sm transition-colors hover:bg-white/20";

  const isRemote = backgroundImageUrl.startsWith("http");

  return (
    <div
      className={cn(
        "relative flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden bg-background md:min-h-screen",
        className,
      )}
    >
      <div className="absolute inset-0 z-0">
        {isRemote ? (
          <Image
            src={backgroundImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="h-full w-full bg-muted" style={{ backgroundImage: `url(${backgroundImageUrl})` }} />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 z-20 flex h-16 w-full items-center justify-between px-4 text-white md:h-20 md:px-12"
      >
        <div className="flex items-center gap-2">{logo}</div>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">{topRightAction}</div>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex w-full max-w-4xl flex-col items-start justify-center px-4 text-left text-white md:px-12"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl"
        >
          {title}
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-2xl text-base leading-7 text-primary-foreground/80 md:mt-6 md:text-lg"
        >
          {description}
        </motion.p>
        <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center gap-3 md:mt-10 md:gap-x-4">
          <Button onClick={ctaButton.onClick} size="lg" className={glassButtonClassName}>
            {ctaButton.text}
          </Button>
          {secondaryCta && (
            <Button onClick={secondaryCta.onClick} size="lg" className={glassButtonClassName}>
              {secondaryCta.text}
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
