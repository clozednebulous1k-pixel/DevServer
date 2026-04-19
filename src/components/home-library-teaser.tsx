"use client";

import Image from "next/image";
import { BookOpen, Lock, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NeonButton } from "@/components/ui/neon-button";

const WA_LIBRARY =
  "https://wa.me/5511952025568?text=" +
  encodeURIComponent(
    "Olá, vim do site da DevServer e quero saber mais sobre o projeto com acesso à Biblioteca de prompts.",
  );

const TEASER_PHOTOS: { src: string; alt: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    alt: "Mesa com laptop e café",
  },
  {
    src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80",
    alt: "Código em tela de monitor",
  },
  {
    src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    alt: "Smartphone com apps",
  },
];

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
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {TEASER_PHOTOS.map((photo) => (
                <div
                  key={photo.src}
                  className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border/50 shadow-md"
                >
                  <Image src={photo.src} alt={photo.alt} fill sizes="140px" className="object-cover" />
                </div>
              ))}
            </div>
            <p className="relative z-10 mt-4 text-center text-xs text-muted-foreground">
              Fotos ilustrativas — na biblioteca você acessa prompts e guias completos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
