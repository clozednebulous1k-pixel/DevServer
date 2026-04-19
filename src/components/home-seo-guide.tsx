"use client";

import {
  BarChart3,
  FileSearch,
  Gauge,
  ImageIcon,
  Link2,
  Map,
  Search,
  Settings2,
  Type,
} from "lucide-react";

const STEPS: {
  step: number;
  title: string;
  description: string;
  icon: typeof Search;
}[] = [
  {
    step: 1,
    title: "Palavras-chave e intenção",
    description:
      "Liste o que seu público digita no Google (produto, problema, cidade). Separe por intenção: informacional, comercial ou transacional. Uma página = um foco principal.",
    icon: FileSearch,
  },
  {
    step: 2,
    title: "Título e meta description",
    description:
      "Cada URL precisa de um title único (até ~60 caracteres) e meta description convidativa (~150 caracteres) com a palavra-chave naturalmente. Evite duplicar entre páginas.",
    icon: Type,
  },
  {
    step: 3,
    title: "Hierarquia de headings",
    description:
      "Um H1 por página, alinhado ao tema principal. Use H2/H3 para seções e subtópicos. Não pule níveis só por estética: a estrutura ajuda o Google a entender o conteúdo.",
    icon: Search,
  },
  {
    step: 4,
    title: "URLs e links internos",
    description:
      "URLs curtas, legíveis e estáveis. Crie links entre páginas relacionadas (blog → serviço → contato) para distribuir autoridade e facilitar a navegação humana.",
    icon: Link2,
  },
  {
    step: 5,
    title: "Conteúdo útil e confiável",
    description:
      "Texto original, atualizado e que responde à dúvida do usuário. Cite fontes quando fizer sentido e mostre quem está por trás do site (sobre, contato, políticas).",
    icon: BarChart3,
  },
  {
    step: 6,
    title: "Imagens e acessibilidade",
    description:
      "Use atributo alt descritivo em imagens relevantes, comprima arquivos (WebP/AVIF quando possível) e defina width/height para evitar layout shift.",
    icon: ImageIcon,
  },
  {
    step: 7,
    title: "Performance e Core Web Vitals",
    description:
      "Site rápido ranqueia melhor e converte mais. Priorize LCP, INP e CLS: lazy load, fontes otimizadas, menos JavaScript bloqueante e hospedagem estável.",
    icon: Gauge,
  },
  {
    step: 8,
    title: "SEO técnico e monitoramento",
    description:
      "Envie sitemap.xml ao Google Search Console, verifique robots.txt, use dados estruturados (JSON-LD) onde couber e acompanha erros de indexação e queries reais.",
    icon: Settings2,
  },
];

export function HomeSeoGuide() {
  return (
    <section
      id="seo"
      className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-12 md:py-16"
    >
      <div className="overflow-hidden rounded-3xl border border-border/80 bg-card/50 p-6 shadow-lg backdrop-blur-md md:p-10">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Guia prático</p>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Passo a passo de SEO no seu site
          </h2>
          <p className="mt-4 text-sm text-muted-foreground md:text-base">
            Não é mágica: é organização técnica + conteúdo alinhado ao que as pessoas buscam. Siga a ordem abaixo e
            refine com o tempo usando dados do Search Console.
          </p>
        </div>

        <div className="relative">
          <div
            className="absolute left-[1.125rem] top-8 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-primary/50 via-border to-transparent md:block"
            aria-hidden
          />
          <ol className="grid gap-6 md:gap-8">
            {STEPS.map(({ step, title, description, icon: Icon }) => (
              <li
                key={step}
                className="relative flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/40 p-4 pl-4 md:flex-row md:items-start md:gap-5 md:p-5 md:pl-6"
              >
                <div className="flex items-center gap-3 md:block md:shrink-0">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/10 font-mono text-sm font-bold text-primary md:absolute md:left-0 md:top-5 md:z-10 md:size-10 md:-translate-x-[0.125rem]">
                    {step}
                  </span>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted/60 text-primary md:ml-14">
                    <Icon className="size-5" aria-hidden />
                  </div>
                </div>
                <div className="min-w-0 flex-1 md:pl-4">
                  <h3 className="text-lg font-semibold leading-tight">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground md:text-sm">
          <Map className="mb-1 inline size-4 align-text-bottom text-primary" aria-hidden /> SEO local: se você atende
          uma região, inclua cidade e serviço nas páginas certas, mantenha NAP (nome, endereço, telefone) consistente e
          perfis no Google Business Profile alinhados ao site.
        </p>
      </div>
    </section>
  );
}
