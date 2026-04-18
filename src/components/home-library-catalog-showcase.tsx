"use client";

import Image from "next/image";
import { LibraryConceptPreview, type LibraryConceptTone } from "@/components/prompts/library-concept-preview";
import { cn } from "@/lib/utils";

/** Mesmas áreas da biblioteca (UI + guias para desenvolvimento). */
const TOPICS: {
  id: string;
  label: string;
  blurb: string;
  seed: string;
  tone: LibraryConceptTone;
  soon?: boolean;
}[] = [
  {
    id: "heroes",
    label: "Heroes",
    blurb: "Hero sections, CTAs, animações e headers para landing e produto.",
    seed: "catalog-heroes",
    tone: "hero",
  },
  {
    id: "backgrounds",
    label: "Backgrounds",
    blurb: "Grids, gradientes, noise, mesh e fundos que não pesam na performance.",
    seed: "catalog-backgrounds",
    tone: "background",
  },
  {
    id: "borders",
    label: "Borders",
    blurb: "Cards, tags, divisores e micro-bordas para hierarquia visual.",
    seed: "catalog-borders",
    tone: "border",
  },
  {
    id: "carousels",
    label: "Carrosséis",
    blurb: "Logos, depoimentos, vitrines e sliders para clientes.",
    seed: "catalog-carousels",
    tone: "carousel",
  },
  {
    id: "images",
    label: "Imagens",
    blurb: "Bento, masonry, lightbox, comparadores e galerias interativas.",
    seed: "catalog-images",
    tone: "image",
  },
  {
    id: "navigation",
    label: "Navigation",
    blurb: "Menus, navbars, mobile sheet e padrões de navegação.",
    seed: "catalog-navigation",
    tone: "navigation",
  },
  {
    id: "texts",
    label: "Textos",
    blurb: "Títulos animados, scramble, destaques tipográficos e hierarquia.",
    seed: "catalog-texts",
    tone: "default",
  },
  {
    id: "announcements",
    label: "Announcements",
    blurb: "Faixas, banners e avisos — catálogo em expansão.",
    seed: "catalog-announcements",
    tone: "default",
    soon: true,
  },
  {
    id: "security",
    label: "Segurança",
    blurb: "Checklists de .env, headers HTTP e boas práticas para app em produção.",
    seed: "catalog-security",
    tone: "default",
  },
  {
    id: "hosting",
    label: "Hospedagem",
    blurb: "DNS, SSL, ambientes e escolha de provedor alinhada ao seu stack.",
    seed: "catalog-hosting",
    tone: "default",
  },
  {
    id: "speed",
    label: "Velocidade",
    blurb: "Core Web Vitals, lazy load, bundle e tuning de front-end.",
    seed: "catalog-speed",
    tone: "default",
  },
  {
    id: "databases",
    label: "Bancos de dados",
    blurb: "Modelagem, migrations, Postgres e integração com a API.",
    seed: "catalog-databases",
    tone: "default",
  },
  {
    id: "frontend_deploy",
    label: "Deploy front-end",
    blurb: "Pipelines, CI/CD e publicação (Vercel, Docker, etc.).",
    seed: "catalog-frontend-deploy",
    tone: "default",
  },
];

const MOOD_STRIP: { src: string; alt: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    alt: "Ambiente de desenvolvimento com notebook",
  },
  {
    src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    alt: "Código em tela",
  },
  {
    src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    alt: "Workspace com monitor",
  },
  {
    src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80",
    alt: "Terminal e desenvolvimento",
  },
];

export function HomeLibraryCatalogShowcase() {
  return (
    <section
      id="catalogo-biblioteca"
      className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-12 md:py-16"
    >
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Biblioteca completa</p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Tudo que o dev usa no dia a dia
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground md:text-base">
          Da interface ao deploy: prompts de UI e guias técnicos no mesmo lugar — para acelerar implementação e evitar
          retrabalho.
        </p>
      </div>

      <div className="mb-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:justify-center md:overflow-visible">
        {MOOD_STRIP.map((item) => (
          <div
            key={item.src}
            className="relative h-24 w-40 shrink-0 snap-center overflow-hidden rounded-xl border border-border/60 shadow-sm md:h-28 md:w-52"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 160px, 208px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TOPICS.map((topic) => (
          <article
            key={topic.id}
            className={cn(
              "flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/40 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/30",
              topic.soon && "opacity-90",
            )}
          >
            <div className="relative h-[140px] shrink-0 sm:h-[152px]">
              <LibraryConceptPreview
                seed={topic.seed}
                tone={topic.tone}
                className="h-full rounded-none border-0"
              />
              {topic.soon && (
                <span className="absolute right-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground shadow">
                  Em breve
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-4">
              <h3 className="text-sm font-semibold leading-tight">{topic.label}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{topic.blurb}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
