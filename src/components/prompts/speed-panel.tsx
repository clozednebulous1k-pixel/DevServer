"use client";

import { Binary, Cpu, Database, Gauge, ImageIcon, Layers, Radio, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const topics: {
  icon: LucideIcon;
  title: string;
  summary: string;
  bullets: string[];
  accent: string;
}[] = [
  {
    icon: Gauge,
    title: "Meça antes de otimizar",
    summary: "Sem número, tudo vira achismo. Defina o que “rápido” significa para o negócio.",
    bullets: [
      "Lighthouse e PageSpeed (LCP, INP, CLS) em mobile throttling; repita após cada mudança grande.",
      "RUM no ar (ex.: Web Vitals no analytics) para ver usuários reais, não só lab.",
      "Backend: tempo de resposta p95/p99, filas e uso de CPU — trace uma requisição ponta a ponta.",
    ],
    accent: "from-amber-500/20 to-transparent",
  },
  {
    icon: Binary,
    title: "Menos JavaScript no cliente",
    summary: "Cada kilobyte parseado atrasa o primeiro uso da tela.",
    bullets: [
      "Analise o bundle (`@next/bundle-analyzer` ou relatório do build); remova libs duplicadas ou pesadas.",
      "`dynamic()` com `ssr: false` só onde fizer sentido; code-split por rota e por feature.",
      "Tree-shaking e imports pontuais (`lodash/es` em vez do pacote inteiro).",
    ],
    accent: "from-orange-500/18 to-transparent",
  },
  {
    icon: ImageIcon,
    title: "Imagens e mídia",
    summary: "Costumam ser o maior peso da página.",
    bullets: [
      "Next/Image ou equivalente: `sizes`, lazy below the fold, formatos AVIF/WebP quando o CDN permitir.",
      "Dimensões explícitas evitam CLS; não estique bitmaps gigantes em HTML pequeno.",
      "Vídeo: poster, `preload=\"none\"` por padrão, bitrate adequado; evite autoplay com som.",
    ],
    accent: "from-yellow-500/15 to-transparent",
  },
  {
    icon: Layers,
    title: "Fontes, CSS e render",
    summary: "Texto visível rápido passa sensação de app ágil.",
    bullets: [
      "Menos famílias e pesos; subset quando possível; `font-display: swap` ou optional.",
      "CSS crítico inline ou extrair acima da dobra; evite `@import` em cascata.",
      "Reduza reflow: leia layout uma vez, escreva depois; animações preferencialmente em `transform`/`opacity`.",
    ],
    accent: "from-lime-500/12 to-transparent",
  },
  {
    icon: Radio,
    title: "Rede, CDN e cache",
    summary: "Aproxime bytes do usuário e não baixe de novo o que não mudou.",
    bullets: [
      "CDN para estáticos; HTTP/2 ou 3; compressão Brotli no edge.",
      "Headers de cache coerentes; ISR ou SWR no Next para páginas semi-estáticas.",
      "Prefetch só de rotas prováveis — prefetch demais compete com o download crítico.",
    ],
    accent: "from-cyan-500/18 to-transparent",
  },
  {
    icon: Database,
    title: "API, banco e filas",
    summary: "Lentidão “some” quando o servidor deixa de esperar o disco.",
    bullets: [
      "Índices alinhados às queries quentes; `EXPLAIN` antes de criar view mágica.",
      "Paginação e limite de profundidade em GraphQL; evite N+1 (DataLoader, joins).",
      "Pool de conexões dimensionado; trabalhos pesados fora da request (fila + worker).",
    ],
    accent: "from-emerald-500/15 to-transparent",
  },
  {
    icon: Cpu,
    title: "SSR, estático e edge",
    summary: "Escolha o modelo certo por rota — nem tudo precisa ser dinâmico.",
    bullets: [
      "Páginas que mudam pouco: gerar estático ou ISR; só SSR o que precisa de cookies por request.",
      "Edge para latência global em lógica leve; não coloque ORM pesado na edge sem medir.",
      "Desative features de debug e logs verbosos em produção.",
    ],
    accent: "from-violet-500/15 to-transparent",
  },
  {
    icon: Zap,
    title: "Hábitos contínuos",
    summary: "Performance é regressão fácil — trave no CI e na cultura do time.",
    bullets: [
      "Orçamento de bundle e de Lighthouse no PR; falhe o build se piorar demais.",
      "Feature flags para ligar experimentos sem deploy cheio; canários em produção.",
      "Checklist de release: imagens novas com `sizes`, queries novas com índice, sem console.log em hot path.",
    ],
    accent: "from-primary/20 to-transparent",
  },
];

export const SPEED_TOPIC_COUNT = topics.length;

export function SpeedPanel() {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-card via-card to-amber-500/[0.07] p-5 md:p-7">
        <div
          className="pointer-events-none absolute -left-12 -top-12 size-40 rounded-full bg-amber-400/15 blur-3xl"
          aria-hidden
        />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
          Performance
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">Deixe o sistema mais rápido</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Front, rede, servidor e processo de entrega — tudo influencia a sensação de velocidade. Use os blocos abaixo
          como roteiro: do diagnóstico às travas no CI para não regredir.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {topics.map((t) => {
          const Icon = t.icon;
          return (
            <article
              key={t.title}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
            >
              <div
                className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90", t.accent)}
                aria-hidden
              />
              <div className="relative">
                <span className="flex size-11 items-center justify-center rounded-xl bg-background/85 text-amber-600 ring-1 ring-border dark:text-amber-400">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold leading-snug">{t.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t.summary}</p>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex gap-2 leading-relaxed">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-amber-500/80" aria-hidden />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
