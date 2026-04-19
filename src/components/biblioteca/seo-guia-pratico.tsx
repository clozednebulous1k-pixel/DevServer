"use client";

import { Instrument_Serif, Outfit } from "next/font/google";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-seo-display",
});

const sans = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-seo-sans",
});

const steps: { title: string; detail: string }[] = [
  {
    title: "Palavras-chave e intenção",
    detail:
      "Antes de escrever: mapeie o que o público pesquisa (informacional, navegacional, transacional) e alinhe cada página a uma intenção clara.",
  },
  {
    title: "Arquitetura e URLs",
    detail:
      "URLs legíveis, hierarquia consistente, canonical quando houver duplicidade, e sitemap/XML atualizado para o Google indexar sem surpresas.",
  },
  {
    title: "On-page",
    detail:
      "Um H1 por página, title e meta description únicos, headings em ordem lógica, e dados estruturados (schema) só onde agregam contexto real.",
  },
  {
    title: "Conteúdo que responde",
    detail:
      "Responda a dúvida logo no início, aprofunde com seções curtas, exemplos e FAQs quando fizer sentido — sempre melhor que texto genérico.",
  },
  {
    title: "Performance e Core Web Vitals",
    detail:
      "Site rápido no mobile, layout estável (CLS), interação responsiva (INP): ranking e conversão melhoram juntos.",
  },
  {
    title: "Links internos e medição",
    detail:
      "Relacione páginas relacionadas com âncoras naturais; use Search Console para cobrir indexação, consultas e páginas com potencial.",
  },
];

export function SeoGuiaPratico({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        display.variable,
        sans.variable,
        "relative mb-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0b] text-zinc-100 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_-32px_rgba(0,0,0,0.85)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120,119,198,0.25), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(59,130,246,0.08), transparent)",
        }}
      />
      <div className="relative px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex gap-1.5 opacity-40">
            <span className="h-2 w-6 rounded-full bg-zinc-700" />
            <span className="h-2 w-5 rounded-full bg-zinc-600" />
            <span className="h-2 w-7 rounded-full bg-zinc-700" />
            <span className="h-2 w-4 rounded-full bg-zinc-600" />
          </div>
          <div className="hidden h-px w-24 bg-gradient-to-r from-transparent via-white/25 to-transparent sm:block" />
        </div>

        <p
          className={`${sans.className} text-center text-[11px] font-semibold uppercase tracking-[0.35em] text-zinc-500 sm:text-left`}
        >
          Guia prático
        </p>

        <h2
          className={`${display.className} mt-3 text-center text-[1.65rem] font-semibold leading-[1.15] tracking-tight text-white sm:text-left sm:text-3xl md:text-[2.15rem]`}
        >
          Passo a passo de SEO no seu site
        </h2>

        <p
          className={`${sans.className} mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-zinc-400 sm:mx-0 sm:text-left`}
        >
          Não é mágica: é organização técnica + conteúdo alinhado ao que as pessoas buscam. Siga a ordem abaixo e refine com o tempo usando dados do
          Search Console.
        </p>

        <ol className={`${sans.className} mt-10 space-y-6 border-t border-white/[0.06] pt-8`}>
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex shrink-0 flex-col items-center pt-0.5">
                <span className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-semibold tabular-nums text-zinc-300">
                  {index + 1}
                </span>
              </span>
              <div className="min-w-0 flex-1 border-b border-white/[0.05] pb-6 last:border-0 last:pb-0">
                <div className="flex items-start gap-2">
                  <Circle className="mt-1 size-3 shrink-0 fill-emerald-400/90 text-emerald-400/90" strokeWidth={0} />
                  <h3 className="text-base font-semibold text-zinc-100">{step.title}</h3>
                </div>
                <p className="mt-2 pl-5 text-sm leading-relaxed text-zinc-500">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
