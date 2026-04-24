"use client";

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

export function BlockPalette({ onAddBlock, onAddLibraryComponent }: Props) {
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
        <p className="mt-1 text-[11px] text-muted-foreground">Arraste para o canvas ou clique para inserir.</p>
        <div className="mt-2 grid gap-1.5">
          {LIBRARY_COMPONENTS.map((component) => (
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
        </div>
      </div>
    </aside>
  );
}
