"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { listLibraryComponents } from "@/lib/criar/library-components";
import type { CriarCanvasElement } from "@/lib/criar/schema";

const ELEMENT_TYPES: Array<{ type: CriarCanvasElement["type"]; label: string }> = [
  { type: "text", label: "Texto" },
  { type: "button", label: "Botão" },
  { type: "shape", label: "Bloco" },
  { type: "image", label: "Imagem" },
];

type Props = {
  onAddBlock: (type: CriarCanvasElement["type"]) => void;
  onAddLibraryComponent: (componentId: string) => void;
};

const LIBRARY_COMPONENTS = listLibraryComponents();
const LIBRARY_CATEGORIES = ["all", ...Array.from(new Set(LIBRARY_COMPONENTS.map((entry) => entry.category)))] as const;
const CATEGORY_LABELS: Record<(typeof LIBRARY_CATEGORIES)[number], string> = {
  all: "All",
  heroes: "Heroes",
  backgrounds: "Backgrounds",
  borders: "Borders",
  carousels: "Carrossel para clientes",
  images: "Imagens",
  navigation: "Navigation Menus",
  texts: "Textos",
  scroll: "Scroll",
  seo: "SEO",
  security: "Segurança",
  hosting: "Hospedagem",
  speed: "Velocidade",
  databases: "Bancos de dados",
  frontend_deploy: "Deploy front-end",
};

export function BlockPalette({ onAddBlock, onAddLibraryComponent }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof LIBRARY_CATEGORIES)[number]>("all");

  const filteredComponents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return LIBRARY_COMPONENTS.filter((component) => {
      const matchesCategory = activeCategory === "all" || component.category === activeCategory;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      return (
        component.title.toLowerCase().includes(normalizedQuery) ||
        component.description.toLowerCase().includes(normalizedQuery) ||
        component.category.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [activeCategory, query]);

  return (
    <aside className="rounded-xl border bg-card/80 p-3">
      <h2 className="text-sm font-semibold">Componentes</h2>
      <p className="mt-1 text-xs text-muted-foreground">Adicione elementos no canvas.</p>
      <div className="mt-2 grid gap-1.5">
        {ELEMENT_TYPES.map((element) => (
          <Button key={element.type} size="sm" type="button" variant="outline" className="justify-start" onClick={() => onAddBlock(element.type)}>
            + {element.label}
          </Button>
        ))}
      </div>
      <div className="mt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Biblioteca</h3>
        <p className="mt-1 text-[11px] text-muted-foreground">Real library catalog with search, categories and drag-and-drop.</p>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search in library..."
          className="mt-2 h-8 w-full rounded-md border bg-background px-2 text-xs outline-none ring-primary/20 focus:ring-2"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {LIBRARY_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-md border px-2 py-1 text-[10px] uppercase ${activeCategory === category ? "border-blue-500 bg-blue-500/10" : "border-border bg-background/70"}`}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          {filteredComponents.length} item(s). Drag to canvas or click to insert.
        </p>
        <div className="mt-2 grid gap-1.5">
          {filteredComponents.map((component) => (
            <button
              key={component.id}
              type="button"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData("application/x-criar-library-component", component.id);
                event.dataTransfer.effectAllowed = "copy";
              }}
              onClick={() => onAddLibraryComponent(component.id)}
              className="rounded-lg border bg-background/70 px-2.5 py-2 text-left transition hover:bg-accent"
            >
              <p className="text-xs font-medium">{component.title}</p>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{component.description}</p>
            </button>
          ))}
          {filteredComponents.length === 0 ? (
            <p className="rounded-md border border-dashed p-2 text-[11px] text-muted-foreground">No items found for this search/category.</p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
