"use client";

import { SiteNav } from "@/components/site-nav";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function ProjetosPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <SiteNav />
      <main className="pt-24">
        <section className="mx-auto mb-3 w-full max-w-6xl px-4 text-center">
          <h1 className="text-3xl font-semibold md:text-5xl">Projetos DevServer</h1>
          <p className="mt-2 text-muted-foreground">
            Galeria com efeito visual para apresentar seus cases e convencer o cliente.
          </p>
        </section>
        <HeroParallax products={products} />
      </main>
    </div>
  );
}

const products = [
  {
    title: "Projeto 01",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 02",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 03",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 04",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 05",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 06",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 07",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 08",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 09",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 10",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 11",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 12",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 13",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 14",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Projeto 15",
    link: "#",
    thumbnail:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
];
