"use client";

import Image from "next/image";
import { Rocket, ShieldCheck, Sparkles } from "lucide-react";
import { useScreenSize } from "@/components/hooks/use-screen-size";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { IconCloud } from "@/components/ui/interactive-icon-cloud";
import { PixelTrail } from "@/components/ui/pixel-trail";
import ScrollHorizontalDevServer from "@/components/ui/scroll-horizontal-devserver";
import { ShiningText } from "@/components/ui/shining-text";
import { GlowCard } from "@/components/ui/spotlight-card";
import TestimonialsSection from "@/components/ui/testimonial-v2";
import { TextScramble } from "@/components/ui/text-scramble";
import { TextDisperse } from "@/components/ui/text-disperse";
import { SiteNav } from "@/components/site-nav";
import { Hero3DRibbon } from "@/components/ui/hero-3d-ribbon";
import { HomeLibraryCatalogShowcase } from "@/components/home-library-catalog-showcase";
import { HomeLibraryTeaser } from "@/components/home-library-teaser";

export default function Home() {
  const screenSize = useScreenSize();

  return (
    <div className="relative flex w-full flex-col">
      <div className="pointer-events-none fixed inset-0 z-0">
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 34 : 56}
          fadeDuration={500}
          delay={0}
          pixelClassName="rounded-sm bg-primary/30"
        />
      </div>
      <SiteNav />

      <main className="relative z-10 grow pb-12 sm:pb-6">
        <section
          id="inicio"
          className="relative mx-auto flex min-h-[85vh] w-full max-w-6xl flex-col items-center justify-center gap-7 px-4 pt-24 text-center"
        >
          <Image
            src="/devserver-logo.png"
            alt="DevServer"
            width={220}
            height={220}
            priority
            className="relative z-10 h-36 w-36 object-contain drop-shadow-[0_0_28px_rgba(91,246,139,0.35)] dark:invert dark:brightness-200 md:h-52 md:w-52"
          />
          <ShiningText
            text="Seu sistema pronto para vender mais, escalar mais rápido e impressionar clientes."
            className="relative z-10 max-w-4xl text-balance text-4xl font-semibold tracking-tight md:text-6xl"
          />
          <p className="relative z-10 max-w-2xl text-base text-muted-foreground md:text-lg">
            A DevServer combina visual premium, performance e estratégia digital para transformar sua ideia em produto lucrativo.
          </p>
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              className="rounded-full"
              onClick={() => document.getElementById("planos")?.scrollIntoView({ behavior: "smooth" })}
            >
              Quero Participar
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full"
              onClick={() =>
                window.open(
                  "https://wa.me/5511952025568?text=Ol%C3%A1%2C%20quero%20solicitar%20um%20or%C3%A7amento%20com%20a%20DevServer.",
                  "_blank",
                )
              }
            >
              Solicitar Orçamento
            </Button>
          </div>
        </section>

        <section id="solucoes" className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="grid gap-4 md:grid-cols-3">
            <GlowCard
              glowColor="green"
              customSize
              className="h-full w-full rounded-2xl border-0 bg-card/60 p-6 shadow-sm backdrop-blur"
            >
              <article className="relative z-10">
                <Sparkles className="mb-4 size-5 text-primary" />
                <h2 className="mb-2 text-lg font-semibold">Visual que converte</h2>
                <p className="text-sm text-muted-foreground">
                  Design pensado para gerar confiança imediata e aumentar taxa de fechamento.
                </p>
              </article>
            </GlowCard>
            <GlowCard
              glowColor="blue"
              customSize
              className="h-full w-full rounded-2xl border-0 bg-card/60 p-6 shadow-sm backdrop-blur"
            >
              <article className="relative z-10">
                <Rocket className="mb-4 size-5 text-primary" />
                <h2 className="mb-2 text-lg font-semibold">Entrega acelerada</h2>
                <p className="text-sm text-muted-foreground">
                  Stack moderna e arquitetura sólida para publicar rápido sem perder qualidade.
                </p>
              </article>
            </GlowCard>
            <GlowCard
              glowColor="purple"
              customSize
              className="h-full w-full rounded-2xl border-0 bg-card/60 p-6 shadow-sm backdrop-blur"
            >
              <article className="relative z-10">
                <ShieldCheck className="mb-4 size-5 text-primary" />
                <h2 className="mb-2 text-lg font-semibold">Estrutura profissional</h2>
                <p className="text-sm text-muted-foreground">
                  Base escalável para crescer com segurança e facilitar futuras integrações.
                </p>
              </article>
            </GlowCard>
          </div>
        </section>

        <section id="tecnologias" className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6">
          <div className="overflow-hidden rounded-3xl bg-background/60 p-6 shadow-lg">
            <div className="mb-4 text-center">
              <TextScramble
                as="h3"
                className="text-2xl font-semibold md:text-3xl"
                duration={1}
                speed={0.025}
              >
                Tecnologias que seu projeto merece
              </TextScramble>
              <TextScramble
                className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground md:text-base"
                duration={1.2}
                speed={0.02}
              >
                Explore o ecossistema técnico usado para criar produtos robustos e de alta performance.
              </TextScramble>
            </div>
            <div className="grid items-start gap-6">
              <div className="relative flex w-full items-center justify-center overflow-hidden px-4 pb-16 pt-6 md:px-20">
                <IconCloud iconSlugs={slugs} />
              </div>
            </div>
          </div>
        </section>

        <ScrollHorizontalDevServer />
        <HomeLibraryTeaser />
        <HomeLibraryCatalogShowcase />
        <section className="mx-auto w-full max-w-6xl px-4 pb-2">
          <ContainerScroll
            titleComponent={
              <>
                <h3 className="text-3xl font-semibold text-foreground md:text-6xl">
                  <TextDisperse className="text-3xl font-semibold text-foreground md:text-6xl">
                    Mais impacto visual
                  </TextDisperse>
                  <br />
                  <TextDisperse className="mt-2 inline-flex text-3xl font-bold leading-none text-primary md:text-7xl">
                    para fechar mais clientes
                  </TextDisperse>
                </h3>
                <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
                  Uma vitrine com movimento e profundidade para apresentar seu sistema com aparência premium.
                </p>
              </>
            }
          >
            <div
              className="mx-auto grid h-full min-h-0 w-full grid-cols-2 grid-rows-2 gap-1.5 rounded-xl md:gap-2"
              aria-label="Referências visuais de produto e desenvolvimento"
            >
              {[
                {
                  src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
                  alt: "Equipe em reunião com laptop",
                },
                {
                  src: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80",
                  alt: "Servidor e equipamentos de rede",
                },
                {
                  src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
                  alt: "Time colaborando em projeto digital",
                },
                {
                  src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
                  alt: "Ambiente de trabalho com notebook",
                },
              ].map((item) => (
                <div
                  key={item.src}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-lg md:rounded-xl"
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 45vw, 400px"
                    className="object-cover"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </ContainerScroll>
        </section>

        <section id="contato" className="mx-auto w-full max-w-6xl px-4 py-8 md:py-12">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-card/80 to-card p-6 shadow-[0_0_80px_-30px_rgba(91,246,139,0.6)] backdrop-blur md:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative z-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Atendimento imediato</p>
              <h3 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-5xl">
                Fale com a DevServer no WhatsApp e feche seu projeto hoje
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
                Atendimento direto, proposta rápida e início sem enrolação. Clique no botão para abrir conversa com
                mensagem pronta.
              </p>
              <div className="mt-6 flex items-center justify-center">
                <a
                  href="https://wa.me/5511952025568?text=Ol%C3%A1%2C%20vim%20do%20site%20da%20DevServer%20e%20quero%20fechar%20meu%20projeto."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-[1.02]"
                >
                  Chamar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsSection />
        <section className="relative mx-auto mt-6 h-56 w-full max-w-6xl overflow-hidden">
          <Hero3DRibbon />
        </section>

        <footer className="relative mx-auto mt-2 w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur">
          <div className="relative z-10 grid gap-8 px-6 py-10 md:grid-cols-[200px_1fr_1fr] md:px-10">
            <div className="flex flex-col items-start gap-3">
              <Image
                src="/devserver-logo.png"
                alt="DevServer"
                width={68}
                height={68}
                className="h-14 w-14 object-contain dark:invert dark:brightness-200"
              />
              <p className="text-sm text-muted-foreground">DevServer</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Navegação</h4>
              <ul className="mt-4 space-y-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <li>
                  <a href="#inicio" className="transition-colors hover:text-foreground">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#catalogo-biblioteca" className="transition-colors hover:text-foreground">
                    Catálogo da biblioteca
                  </a>
                </li>
                <li>
                  <a href="/projetos" className="transition-colors hover:text-foreground">
                    Projetos
                  </a>
                </li>
                <li>
                  <a href="/sobre" className="transition-colors hover:text-foreground">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/5511952025568?text=Ol%C3%A1%2C%20quero%20solicitar%20um%20or%C3%A7amento%20com%20a%20DevServer."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-foreground"
                  >
                    Solicite uma proposta
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold">Localização</h4>
                <p className="mt-3 text-sm text-muted-foreground">
                  São Paulo - SP
                  <br />
                  Atendimento online para todo o Brasil
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold">Contato</h4>
                <p className="mt-3 text-sm text-muted-foreground">
                  +55 11 95202-5568
                  <br />
                  contato@devserver.com.br
                </p>
              </div>
            </div>
          </div>
          <div className="relative z-10 border-t border-border/70 px-6 py-4 text-center text-[11px] tracking-[0.14em] text-muted-foreground md:px-10">
            © 2026 DEVSERVER. TODOS OS DIREITOS RESERVADOS.
          </div>
        </footer>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 rounded-full border border-border bg-background/90 px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur transition-colors hover:bg-background"
        >
          Voltar ao topo
        </button>
      </main>
    </div>
  );
}

const slugs = [
  "typescript",
  "javascript",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "figma",
];

