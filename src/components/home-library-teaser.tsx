"use client";

import { BookOpen, Lock, Sparkles } from "lucide-react";
import { LibraryConceptPreview } from "@/components/prompts/library-concept-preview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NeonButton } from "@/components/ui/neon-button";

const WA_LIBRARY =
  "https://wa.me/5511952025568?text=" +
  encodeURIComponent(
    "Olá, vim do site da DevServer e quero saber mais sobre o projeto com acesso à Biblioteca de prompts.",
  );

export function HomeLibraryTeaser() {
  return (
    <section id="biblioteca" className="relative mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <div className="overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-card/90 via-background/80 to-background p-6 shadow-[0_0_60px_-28px_rgba(91,246,139,0.35)] backdrop-blur md:p-10">
        <div className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Biblioteca DevServer</p>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Um spoiler do que só clientes desbloqueiam
            </h2>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
              Centenas de prompts prontos para IA, organizados por categoria: heroes animados, backgrounds,
              bordas, carrosséis, imagens, navegação e textos — além de guias de deploy, segurança e performance.
              Atalho do briefing ao pixel, sem reinventar a roda.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Componentes visuais e roteiros que você copia e adapta ao seu produto.</span>
              </li>
              <li className="flex items-start gap-2">
                <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Checklists e prompts alinhados ao stack que a DevServer entrega.</span>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Acesso liberado após fechar projeto — conteúdo vivo, não PDF perdido no Drive.</span>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={WA_LIBRARY}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "rounded-full")}
              >
                Quero isso no meu projeto
              </a>
              <NeonButton
                type="button"
                disabled
                tabIndex={-1}
                className="pointer-events-none opacity-85"
                size="sm"
                variant="default"
              >
                Exclusivo para clientes
              </NeonButton>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              <LibraryConceptPreview seed="home-lib-hero" tone="hero" />
              <LibraryConceptPreview seed="home-lib-carousel" tone="carousel" />
              <LibraryConceptPreview seed="home-lib-nav" tone="navigation" />
              <LibraryConceptPreview seed="home-lib-image" tone="image" />
              <LibraryConceptPreview seed="home-lib-border" tone="border" />
              <LibraryConceptPreview seed="home-lib-bg" tone="background" />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-8 h-28 bg-gradient-to-t from-background via-background/85 to-transparent" />
            <p className="relative z-10 mt-3 text-center text-xs text-muted-foreground">
              Prévia visual — o catálogo completo abre na biblioteca após a contratação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
