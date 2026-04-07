"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FormBuilderHeroProps {
  illustrationSrc: string;
  illustrationAlt?: string;
  title: React.ReactNode;
  description: string;
  buttonText: string;
  buttonHref?: string;
}

export const FormBuilderHero: React.FC<FormBuilderHeroProps> = ({
  illustrationSrc,
  illustrationAlt = "Ilustração do hero",
  title,
  description,
  buttonText,
  buttonHref = "#",
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" as const },
    },
  };

  const isRemote = illustrationSrc.startsWith("http");

  return (
    <div className="flex w-full items-center justify-center bg-background px-4 py-12 md:py-20">
      <motion.div
        className="mx-auto flex max-w-2xl flex-col items-center text-center"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-6">
          {isRemote ? (
            <Image
              src={illustrationSrc}
              alt={illustrationAlt}
              width={256}
              height={256}
              className="h-auto w-48 select-none md:w-64"
              unoptimized={illustrationSrc.includes("tally.so")}
            />
          ) : (
            <img src={illustrationSrc} alt={illustrationAlt} className="h-auto w-48 select-none md:w-64" />
          )}
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mb-3 text-3xl font-bold tracking-tight text-foreground md:mb-4 md:text-5xl"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="mb-6 max-w-lg text-sm text-muted-foreground md:mb-8 md:text-lg"
        >
          {description}
        </motion.p>

        <motion.div variants={itemVariants}>
          <a href={buttonHref} className={cn(buttonVariants({ size: "lg" }), "inline-flex gap-2")}>
            {buttonText}
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};
