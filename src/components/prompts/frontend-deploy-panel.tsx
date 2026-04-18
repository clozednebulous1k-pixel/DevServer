"use client";

import {
  ArrowRight,
  Cloud,
  ExternalLink,
  Globe,
  Layers,
  MonitorSmartphone,
  Rocket,
  TestTube2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Badge no menu: número de passos do pipeline principal. */
export const FRONTEND_DEPLOY_PIPELINE_STEPS = 8;

const testPlaces: {
  icon: LucideIcon;
  title: string;
  summary: string;
  bullets: string[];
  accent: string;
}[] = [
  {
    icon: MonitorSmartphone,
    title: "Local (localhost)",
    summary: "Loop mais rápido; ideal para UI e estado antes de subir rede.",
    bullets: [
      "`npm run dev` / `pnpm dev` - hot reload no Next, Vite, CRA legado.",
      "Teste mobile com DevTools (responsive) ou USB com dispositivo real.",
      "Variáveis em `.env.local`; não commite segredos.",
    ],
    accent: "from-indigo-500/18 to-transparent",
  },
  {
    icon: Globe,
    title: "Tunnel (ngrok, Cloudflare Tunnel)",
    summary: "Expose localhost com HTTPS para webhook, OAuth ou QA remota.",
    bullets: [
      "Útil quando o backend exige callback URL público ou cliente quer ver sua máquina.",
      "Tunnel temporário - não use como produção; rotacione URL se vazar.",
    ],
    accent: "from-violet-500/15 to-transparent",
  },
  {
    icon: Layers,
    title: "Preview por branch / PR",
    summary: "O padrão ouro em times: cada PR ganha uma URL estável.",
    bullets: [
      "Vercel, Netlify e Cloudflare Pages criam preview automático ao abrir PR.",
      "Mesmo build que produção com env de “preview”; revise variáveis sensíveis.",
      "Comente o link no PR para design/QA aprovar antes do merge.",
    ],
    accent: "from-sky-500/18 to-transparent",
  },
  {
    icon: TestTube2,
    title: "Ambiente de homologação",
    summary: "Branch `staging` ou projeto separado espelhando prod com dados anonimizados.",
    bullets: [
      "Subdomínio `staging.seudominio.com` ou projeto dedicado no provedor.",
      "Smoke tests E2E (Playwright, Cypress) contra staging antes de promover.",
      "Opcional: BrowserStack / LambdaTest para matriz de navegadores reais.",
    ],
    accent: "from-emerald-500/12 to-transparent",
  },
];

const deployPlatforms: {
  icon: LucideIcon;
  title: string;
  summary: string;
  bullets: string[];
  accent: string;
}[] = [
  {
    icon: Rocket,
    title: "Vercel",
    summary: "Referência para Next.js; edge, analytics e previews nativos.",
    bullets: ["Conecta GitHub/GitLab/Bitbucket; build zero-config para Next.", "Domínio + HTTPS automático; env por ambiente (Production / Preview)."],
    accent: "from-black/40 to-transparent dark:from-white/10",
  },
  {
    icon: Cloud,
    title: "Netlify",
    summary: "SPA, sites estáticos e funções serverless integradas.",
    bullets: ["Deploy folder ou build command; split testing e forms opcionais.", "Previews por PR iguais ao fluxo Vercel."],
    accent: "from-teal-500/18 to-transparent",
  },
  {
    icon: Globe,
    title: "Cloudflare Pages",
    summary: "Edge global, bom custo e integração com Workers.",
    bullets: ["Build em CI na Cloudflare; previews em branches.", "Combine com R2, KV e DNS no mesmo ecossistema."],
    accent: "from-orange-500/15 to-transparent",
  },
  {
    icon: Layers,
    title: "AWS Amplify Hosting",
    summary: "Útil se o restante da stack já está na AWS.",
    bullets: ["Pipeline com branch mapping; SSR com Amplify Gen2 conforme doc.", "Custos e IAM merecem checklist de permissão mínima."],
    accent: "from-amber-500/12 to-transparent",
  },
  {
    icon: ExternalLink,
    title: "GitHub Pages",
    summary: "Grátis para sites estáticos; ótimo para docs e landing simples.",
    bullets: ["Geralmente branch `gh-pages` ou pasta `/docs` com Actions.", "Sem SSR nativo - use export estático ou outro host para apps dinâmicos."],
    accent: "from-muted-foreground/15 to-transparent",
  },
  {
    icon: Rocket,
    title: "Render / Railway (static)",
    summary: "Alternativas full-stack quando você já usa o mesmo provedor para API.",
    bullets: ["Static site ou Docker; verifique cold start e limites do plano gratuito.", "Menos “zero-config Next” que Vercel - leia a doc do framework."],
    accent: "from-rose-500/12 to-transparent",
  },
];

const pipelineSteps: { step: number; title: string; detail: string }[] = [
  {
    step: 1,
    title: "Código no Git",
    detail: "Repo remoto (GitHub, GitLab, Bitbucket). Branch `main` protegida; PR obrigatório para revisão.",
  },
  {
    step: 2,
    title: "Escolher o provedor e importar o repositório",
    detail: "No dashboard: New Project → importar repo → autorizar OAuth do Git. Confirme root directory se o app está em monorepo/subpasta.",
  },
  {
    step: 3,
    title: "Definir build e saída",
    detail: "Framework preset (Next.js, Vite, etc.) ou comandos manuais: install (`pnpm i`), build (`pnpm build`), output (`out`, `dist`, `.next`). Alinhe com `package.json`.",
  },
  {
    step: 4,
    title: "Variáveis de ambiente",
    detail: "Cadastre `NEXT_PUBLIC_*` só para o que pode vazar ao browser; segredos só server-side. Separe Production vs Preview.",
  },
  {
    step: 5,
    title: "Primeiro deploy e preview",
    detail: "Dispare deploy na branch inicial; abra um PR de teste e valide URL de preview em mobile e desktop.",
  },
  {
    step: 6,
    title: "Domínio customizado",
    detail: "Adicione domínio no painel; configure DNS (CNAME/A) conforme instruções; TLS é renovado pelo provedor.",
  },
  {
    step: 7,
    title: "Promover para produção",
    detail: "Merge na branch de produção (geralmente `main`). Monitore build logs; rollback é novo deploy da versão anterior.",
  },
  {
    step: 8,
    title: "Observar e iterar",
    detail: "Web Vitals no painel (quando disponível), logs de função serverless e alertas de erro (Sentry, etc.).",
  },
];

export function FrontendDeployPanel() {
  return (
    <div className="min-w-0 space-y-8 md:space-y-12">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-card via-card to-indigo-500/[0.08] p-4 sm:p-5 md:p-7">
        <div
          className="pointer-events-none absolute -left-16 bottom-0 size-48 rounded-full bg-indigo-400/15 blur-3xl"
          aria-hidden
        />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
          Front-end
        </p>
        <h2 className="mt-2 text-balance text-xl font-semibold tracking-tight sm:text-2xl">
          Testar e publicar interfaces
        </h2>
        <p className="mt-2 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
          Da sua máquina até produção: onde validar UX sem risco, quais hosts costumam usar times web modernos e um fluxo de
          deploy repetível em PR preview → merge → domínio.
        </p>
      </div>

      <section className="min-w-0">
        <div className="mb-3 flex items-start gap-2.5 sm:mb-4 sm:items-center">
          <TestTube2 className="mt-0.5 size-5 shrink-0 text-indigo-600 dark:text-indigo-400 sm:mt-0" aria-hidden />
          <h3 className="min-w-0 text-base font-semibold leading-snug sm:text-lg">
            Onde testar antes da produção
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          {testPlaces.map((t) => {
            const Icon = t.icon;
            return (
              <article
                key={t.title}
                className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm transition-shadow active:opacity-95 sm:p-5 sm:hover:shadow-md"
              >
                <div
                  className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90", t.accent)}
                  aria-hidden
                />
                <div className="relative">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-background/85 text-indigo-600 ring-1 ring-border dark:text-indigo-400">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h4 className="mt-4 text-base font-semibold leading-snug">{t.title}</h4>
                  <p className="mt-1.5 text-sm text-muted-foreground">{t.summary}</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex gap-2 leading-relaxed">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-indigo-500/80" aria-hidden />
                        <span className="min-w-0 break-words">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="min-w-0">
        <div className="mb-3 flex items-start gap-2.5 sm:mb-4 sm:items-center">
          <Rocket className="mt-0.5 size-5 shrink-0 text-indigo-600 dark:text-indigo-400 sm:mt-0" aria-hidden />
          <h3 className="min-w-0 text-base font-semibold leading-snug sm:text-lg">
            Onde fazer deploy (produção e previews)
          </h3>
        </div>
        <p className="mb-3 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground sm:mb-4">
          Lista orientativa - times Next.js costumam começar por Vercel; SPAs puras dividem bem entre Netlify e Cloudflare.
          Avalie custo, região, compliance e lock-in antes de migrar.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          {deployPlatforms.map((t) => {
            const Icon = t.icon;
            return (
              <article
                key={t.title}
                className="relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm transition-shadow active:opacity-95 sm:p-5 sm:hover:shadow-md"
              >
                <div
                  className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90", t.accent)}
                  aria-hidden
                />
                <div className="relative">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-background/85 text-indigo-600 ring-1 ring-border dark:text-indigo-400">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h4 className="mt-4 text-base font-semibold leading-snug">{t.title}</h4>
                  <p className="mt-1.5 text-sm text-muted-foreground">{t.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {t.bullets.map((b) => (
                      <li key={b} className="flex gap-2 leading-relaxed">
                        <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-indigo-500/70" aria-hidden />
                        <span className="min-w-0 break-words">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="min-w-0">
        <div className="mb-3 flex items-start gap-2.5 sm:mb-4 sm:items-center">
          <Layers className="mt-0.5 size-5 shrink-0 text-indigo-600 dark:text-indigo-400 sm:mt-0" aria-hidden />
          <h3 className="min-w-0 text-base font-semibold leading-snug sm:text-lg">Passo a passo do deploy contínuo</h3>
        </div>
        <ol className="relative space-y-0 overflow-x-hidden rounded-2xl border border-border/80 bg-card/60 p-2 sm:p-3 md:p-4">
          <div
            className="absolute left-[2.375rem] top-8 bottom-8 z-0 w-px bg-gradient-to-b from-indigo-500/50 via-border to-transparent sm:left-12"
            aria-hidden
          />
          {pipelineSteps.map(({ step, title, detail }) => (
            <li key={step} className="relative z-[1] flex gap-3 rounded-xl p-3 sm:gap-4 sm:p-4 md:gap-6 md:pl-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-indigo-500/30 bg-card text-sm font-bold tabular-nums text-indigo-700 ring-[3px] ring-card dark:bg-card dark:text-indigo-300 sm:size-10 sm:ring-4">
                {step}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[15px] font-semibold leading-snug text-foreground sm:text-base">{title}</p>
                <p className="mt-1.5 break-words text-sm leading-relaxed text-muted-foreground">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
