"use client";

import { useState } from "react";
import { Binary, Copy, Cpu, Database, Gauge, ImageIcon, Layers, Radio, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const topics: {
  id: string;
  icon: LucideIcon;
  title: string;
  summary: string;
  bullets: string[];
  accent: string;
  /** Texto pronto para colar em Cursor, ChatGPT, Copilot etc. */
  aiPrompt: string;
}[] = [
  {
    id: "measure",
    icon: Gauge,
    title: "Meça antes de otimizar",
    summary: "Sem número, tudo vira achismo. Defina o que “rápido” significa para o negócio.",
    bullets: [
      "Lighthouse e PageSpeed (LCP, INP, CLS) em mobile throttling; repita após cada mudança grande.",
      "RUM no ar (ex.: Web Vitals no analytics) para ver usuários reais, não só lab.",
      "Backend: tempo de resposta p95/p99, filas e uso de CPU - trace uma requisição ponta a ponta.",
    ],
    accent: "from-amber-500/20 to-transparent",
    aiPrompt: `Sou desenvolvedor(a) e quero melhorar performance real e percebida do meu produto web.

Antes de sugerir mudanças de código, monte um plano de medição objetivo:
1) Quais métricas priorizar (LCP, INP, CLS, TTFB) no meu contexto e por quê.
2) Como rodar Lighthouse/PageSpeed de forma reproduzível (mobile throttling, URL canônica, ambiente sem extensões).
3) O que configurar de RUM / Web Vitals em produção e como interpretar (segmentos, percentis, outliers).
4) Como correlacionar lentidão de API (p95/p99, filas, DB) com a experiência no front.

Peça-me só o que faltar: stack (ex.: Next.js 15 + Vercel), página crítica e URL de staging se existir.
Responda em passos numerados e cite ferramentas concretas.`,
  },
  {
    id: "less-js",
    icon: Binary,
    title: "Menos JavaScript no cliente",
    summary: "Cada kilobyte parseado atrasa o primeiro uso da tela.",
    bullets: [
      "Analise o bundle (`@next/bundle-analyzer` ou relatório do build); remova libs duplicadas ou pesadas.",
      "`dynamic()` com `ssr: false` só onde fizer sentido; code-split por rota e por feature.",
      "Tree-shaking e imports pontuais (`lodash/es` em vez do pacote inteiro).",
    ],
    accent: "from-orange-500/18 to-transparent",
    aiPrompt: `Preciso reduzir JavaScript enviado ao browser no meu projeto.

Contexto que posso detalhar: framework (Next/React/Vite), principais libs e rotas pesadas.

Peça:
1) Como auditar o bundle (ex.: @next/bundle-analyzer, relatório do build, import costs).
2) Lista priorizada do que remover, substituir ou carregar sob demanda (dynamic import, rotas paralelas).
3) Regras práticas de tree-shaking e imports (barrel files, lodash, ícones).
4) Trade-offs de hidratação e quando \`ssr: false\` ou client-only faz sentido.

Devolva um checklist que eu consiga executar em ordem, com “antes/depois” esperado no tamanho do bundle.`,
  },
  {
    id: "images-media",
    icon: ImageIcon,
    title: "Imagens e mídia",
    summary: "Costumam ser o maior peso da página.",
    bullets: [
      "Next/Image ou equivalente: `sizes`, lazy below the fold, formatos AVIF/WebP quando o CDN permitir.",
      "Dimensões explícitas evitam CLS; não estique bitmaps gigantes em HTML pequeno.",
      "Vídeo: poster, `preload=\"none\"` por padrão, bitrate adequado; evite autoplay com som.",
    ],
    accent: "from-yellow-500/15 to-transparent",
    aiPrompt: `Quero otimizar imagens e mídia no meu site (LCP e peso total).

Informe: framework (ex.: Next/Image), onde as imagens vêm (CMS, uploads, URLs externas).

Sugira:
1) Política de formatos (AVIF/WebP), dimensões e \`sizes\` corretos para layouts responsivos.
2) Como evitar CLS com width/height ou aspect-ratio; o que lazy-load abaixo da dobra.
3) Para vídeo: poster, preload, codecs e quando não usar autoplay.
4) Um mini-checklist de validação (Lighthouse, DevTools Coverage de imagens, CDN).

Seja específico; se faltar dados, liste exatamente o que preciso te enviar (HTML de um componente, screenshot do layout).`,
  },
  {
    id: "fonts-css-render",
    icon: Layers,
    title: "Fontes, CSS e render",
    summary: "Texto visível rápido passa sensação de app ágil.",
    bullets: [
      "Menos famílias e pesos; subset quando possível; `font-display: swap` ou optional.",
      "CSS crítico inline ou extrair acima da dobra; evite `@import` em cascata.",
      "Reduza reflow: leia layout uma vez, escreva depois; animações preferencialmente em `transform`/`opacity`.",
    ],
    accent: "from-lime-500/12 to-transparent",
    aiPrompt: `Ajude a acelerar primeira pintura de texto e estabilidade visual (CLS/FCP).

Stack CSS: [Tailwind / CSS Modules / styled-components - completarei].

Peça:
1) Estratégia de fontes (menos pesos, subset, font-display, self-host vs Google Fonts).
2) Como reduzir CSS bloqueante e \`@import\` em cascata.
3) Animações sem layout thrashing (transform/opacity, will-change com cautela).
4) Passos para achar reflows pesados no Performance panel.

Responda com mudanças concretas nos arquivos típicos do meu stack e um parágrafo “o que medir depois”.`,
  },
  {
    id: "network-cdn-cache",
    icon: Radio,
    title: "Rede, CDN e cache",
    summary: "Aproxime bytes do usuário e não baixe de novo o que não mudou.",
    bullets: [
      "CDN para estáticos; HTTP/2 ou 3; compressão Brotli no edge.",
      "Headers de cache coerentes; ISR ou SWR no Next para páginas semi-estáticas.",
      "Prefetch só de rotas prováveis - prefetch demais compete com o download crítico.",
    ],
    accent: "from-cyan-500/18 to-transparent",
    aiPrompt: `Quero melhorar rede, CDN e caching para usuários mais distantes da origem.

Contexto: hospedagem/CDN atual, framework (Next/Vite), APIs próprias ou terceiros.

Oriente:
1) Headers de cache adequados para HTML vs assets imutáveis (hash no nome).
2) ISR/SSG/SWR ou equivalente no meu framework - quando usar cada um.
3) Prefetch/preload: onde ajuda e onde prejudica Core Web Vitals.
4) HTTP/2/3 e compressão Brotli no edge - o que validar na prática.

Formato: lista de verificação + erros comuns que devo evitar.`,
  },
  {
    id: "api-database",
    icon: Database,
    title: "API, banco e filas",
    summary: "Lentidão “some” quando o servidor deixa de esperar o disco.",
    bullets: [
      "Índices alinhados às queries quentes; `EXPLAIN` antes de criar view mágica.",
      "Paginação e limite de profundidade em GraphQL; evite N+1 (DataLoader, joins).",
      "Pool de conexões dimensionado; trabalhos pesados fora da request (fila + worker).",
    ],
    accent: "from-emerald-500/15 to-transparent",
    aiPrompt: `O gargalo parece ser backend: API lenta ou banco pesado.

Stack de dados: [Postgres/MySQL/ORM - completarei]. Descrevo endpoints lentos ou queries suspeitas se tiver.

Peça:
1) Como diagnosticar N+1, falta de índice e planos ruins (EXPLAIN, logs de query).
2) Paginação, limites e contratos de API que protejam o servidor.
3) Pool de conexões e timeouts sensatos.
4) O que mover para fila/worker em vez de bloquear a request HTTP.

Quero um plano em fases: diagnóstico → quick wins → mudanças estruturais.`,
  },
  {
    id: "ssr-edge",
    icon: Cpu,
    title: "SSR, estático e edge",
    summary: "Escolha o modelo certo por rota - nem tudo precisa ser dinâmico.",
    bullets: [
      "Páginas que mudam pouco: gerar estático ou ISR; só SSR o que precisa de cookies por request.",
      "Edge para latência global em lógica leve; não coloque ORM pesado na edge sem medir.",
      "Desative features de debug e logs verbosos em produção.",
    ],
    accent: "from-violet-500/15 to-transparent",
    aiPrompt: `Preciso escolher o modelo de entrega por rota (estático, ISR, SSR, edge) no meu app.

Framework e hospedagem: [Next/Vercel ou outro - completarei].

Explique:
1) Critérios para cada modo (dados personalizados, freshness, auth).
2) Custos e limites de cold start / edge vs Node tradicional.
3) O que NÃO rodar na edge (ORM pesado, conexões longas ao DB).
4) Checklist de produção: logs, debug off, variáveis de ambiente.

Devolva uma tabela “rota / modelo recomendado / motivo” que eu possa revisar com o time.`,
  },
  {
    id: "habits-ci",
    icon: Zap,
    title: "Hábitos contínuos",
    summary: "Performance é regressão fácil - trave no CI e na cultura do time.",
    bullets: [
      "Orçamento de bundle e de Lighthouse no PR; falhe o build se piorar demais.",
      "Feature flags para ligar experimentos sem deploy cheio; canários em produção.",
      "Checklist de release: imagens novas com `sizes`, queries novas com índice, sem console.log em hot path.",
    ],
    accent: "from-primary/20 to-transparent",
    aiPrompt: `Quero evitar regressão de performance no dia a dia do time (CI + processo).

Stack de CI: [GitHub Actions / outro - completarei]. Repositório monorepo ou app único.

Sugira:
1) Orçamento de bundle e/ou Lighthouse no PR - thresholds realistas e como não ser flaky.
2) O que monitorar em produção (Web Vitals, erros, latência de API).
3) Feature flags e canários para mudanças arriscadas.
4) Checklist curto de release para dev (imagens, queries novas, logs).

Formato: política prática que um time pequeno consiga manter sem ferramenta enterprise.`,
  },
];

export const SPEED_TOPIC_COUNT = topics.length;

export function SpeedPanel() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyAiPrompt(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="min-w-0 space-y-6 md:space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-card via-card to-amber-500/[0.07] p-4 sm:p-5 md:p-7">
        <div
          className="pointer-events-none absolute -left-12 -top-12 size-40 rounded-full bg-amber-400/15 blur-3xl"
          aria-hidden
        />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
          Performance
        </p>
        <h2 className="mt-2 text-balance text-xl font-semibold tracking-tight sm:text-2xl">
          Deixe o sistema mais rápido
        </h2>
        <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          Front, rede, servidor e processo de entrega - tudo influencia a sensação de velocidade. Em cada card há um{" "}
          <strong className="font-medium text-foreground">prompt pronto</strong> para colar na IA (Cursor, Copilot,
          ChatGPT): complemente os campos entre colchetes com seu stack e contexto.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
        {topics.map((t) => {
          const Icon = t.icon;
          return (
            <article
              key={t.id}
              className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm transition-shadow sm:p-5 sm:hover:shadow-md"
            >
              <div
                className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90", t.accent)}
                aria-hidden
              />
              <div className="relative flex min-h-0 flex-1 flex-col">
                <span className="flex size-11 items-center justify-center rounded-xl bg-background/85 text-amber-600 ring-1 ring-border dark:text-amber-400">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-semibold leading-snug">{t.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t.summary}</p>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex gap-2 leading-relaxed">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-amber-500/80" aria-hidden />
                      <span className="min-w-0 break-words">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex min-h-0 flex-1 flex-col border-t border-border/70 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Prompt para a IA</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Copie e cole no chat; preencha os trechos indicados com seu projeto.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 h-9 w-full shrink-0 gap-2 border-amber-500/25 bg-background/80 text-amber-900 hover:bg-amber-500/10 dark:text-amber-100"
                    onClick={() => copyAiPrompt(t.id, t.aiPrompt)}
                  >
                    <Copy className="size-4 shrink-0" aria-hidden />
                    {copiedId === t.id ? "Copiado!" : "Copiar prompt"}
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
