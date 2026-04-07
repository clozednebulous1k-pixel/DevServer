"use client";

import {
  Activity,
  ArrowRight,
  BarChart,
  Bird,
  Menu,
  Plug,
  Sparkles,
  Zap,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "SOLUÇÕES", href: "#" },
  { title: "SETOR", href: "#" },
  { title: "RECURSOS", href: "#" },
  { title: "SOBRE", href: "#" },
];

const labels = [
  { icon: Sparkles, label: "Analytics preditivo" },
  { icon: Plug, label: "Machine Learning" },
  { icon: Activity, label: "Processamento de linguagem" },
];

const features = [
  {
    icon: BarChart,
    label: "Analytics avançado",
    description: "Insights mais profundos com modelos preditivos de ponta.",
  },
  {
    icon: Zap,
    label: "Automação inteligente",
    description: "Fluxos otimizados com automação orientada por IA.",
  },
  {
    icon: Activity,
    label: "Insights em tempo real",
    description: "Decisões mais rápidas com processamento contínuo de dados.",
  },
];

export function MynaHero() {
  const titleWords = ["A", "REVOLUÇÃO", "DE", "IA", "PARA", "O", "SEU", "NEGÓCIO"];

  return (
    <div className="min-h-screen w-full bg-background px-3 sm:px-4">
      <header className="mx-auto max-w-6xl">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <a href="#" className="flex items-center gap-2">
            <Bird className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
            <span className="font-mono text-lg font-bold sm:text-xl">Myna UI</span>
          </a>

          <nav className="hidden items-center space-x-6 md:flex md:space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="font-mono text-xs text-foreground transition-colors hover:text-primary sm:text-sm"
              >
                {item.title}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="default" size="sm" className="hidden rounded-none font-mono md:inline-flex">
              COMEÇAR <ArrowRight className="ml-1 size-4" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}
                  aria-label="Abrir menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="mt-6 flex flex-col gap-6">
                  {navigationItems.map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      className="font-mono text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {item.title}
                    </a>
                  ))}
                  <Button variant="default" size="sm" className="w-full rounded-none font-mono">
                    COMEÇAR <ArrowRight className="ml-1 size-4" />
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl">
        <section className="py-12 sm:py-20 md:py-24">
          <div className="flex flex-col items-center text-center">
            <motion.h1
              initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
              animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto max-w-4xl font-mono text-2xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {titleWords.map((text, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                  }}
                  className="mx-1 inline-block md:mx-2"
                >
                  {text}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="mx-auto mt-6 max-w-2xl font-mono text-base text-muted-foreground sm:text-lg md:text-xl"
            >
              Transforme dados em decisões com soluções de IA modernas para o seu produto.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-8 flex flex-wrap justify-center gap-4 sm:mt-12 sm:gap-6"
            >
              {labels.map((feature, index) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.2 + index * 0.12,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                  }}
                  className="flex items-center gap-2 px-3 sm:px-6"
                >
                  <feature.icon className="h-5 w-5 text-primary" />
                  <span className="font-mono text-xs sm:text-sm">{feature.label}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.6,
                duration: 0.5,
                type: "spring",
                stiffness: 100,
                damping: 12,
              }}
            >
              <Button size="lg" variant="default" className="mt-8 rounded-none font-mono sm:mt-12">
                COMEÇAR <ArrowRight className="ml-1 size-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="pb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 text-center font-mono text-2xl font-bold sm:text-3xl md:text-4xl"
          >
            Potência de IA desbloqueada
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mx-auto grid max-w-6xl md:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35 + index * 0.15,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 100,
                  damping: 12,
                }}
                className="flex flex-col items-center border bg-background p-6 text-center sm:p-8"
              >
                <div className="mb-4 rounded-full bg-primary/10 p-3 sm:mb-6 sm:p-4">
                  <feature.icon className="h-7 w-7 text-primary sm:h-8 sm:w-8" />
                </div>
                <h3 className="mb-3 font-mono text-lg font-bold sm:text-xl">{feature.label}</h3>
                <p className="font-mono text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
