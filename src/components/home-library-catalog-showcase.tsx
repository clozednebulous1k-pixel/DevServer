"use client";

import Image from "next/image";

/** Poucos destaques da biblioteca — cada um com foto real (não ilustração abstrata). */
const TOPICS: {
  id: string;
  label: string;
  blurb: string;
  image: string;
  alt: string;
}[] = [
  {
    id: "heroes-ui",
    label: "Heroes e interfaces",
    blurb: "Landings, seções hero e componentes de destaque para converter visitante.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    alt: "Tela com gráficos e interface de produto",
  },
  {
    id: "imagens",
    label: "Imagens e galerias",
    blurb: "Bento, masonry, lightbox e padrões de mídia para o seu front-end.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    alt: "Desenvolvedor em frente a monitores com código",
  },
  {
    id: "seguranca",
    label: "Segurança",
    blurb: "Checklists e boas práticas antes de colocar o app em produção.",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    alt: "Segurança digital e autenticação",
  },
  {
    id: "deploy",
    label: "Deploy e entrega",
    blurb: "Pipelines, hospedagem e publicação alinhados ao seu stack.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    alt: "Servidor e infraestrutura",
  },
  {
    id: "performance",
    label: "Performance",
    blurb: "Velocidade, métricas e otimização para usuário e SEO.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    alt: "Dashboard com métricas e analytics",
  },
];

export function HomeLibraryCatalogShowcase() {
  return (
    <section
      id="catalogo-biblioteca"
      className="relative mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-12 md:py-16"
    >
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Biblioteca DevServer</p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl">
          Um gostinho do que você desbloqueia
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
          Prompts de UI e guias práticos — abaixo, só alguns temas; dentro da biblioteca o catálogo é bem maior.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((topic) => (
          <article
            key={topic.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/40 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/30"
          >
            <div className="relative aspect-[16/10] w-full shrink-0">
              <Image
                src={topic.image}
                alt={topic.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
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
