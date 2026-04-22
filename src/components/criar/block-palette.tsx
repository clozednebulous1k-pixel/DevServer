"use client";

import { Button } from "@/components/ui/button";
import type { CriarCanvasElement } from "@/lib/criar/schema";

const ELEMENT_TYPES: Array<{ type: CriarCanvasElement["type"]; label: string }> = [
  { type: "text", label: "Texto" },
  { type: "button", label: "Botão" },
  { type: "shape", label: "Bloco" },
  { type: "image", label: "Imagem" },
];

export function BlockPalette({ onAddBlock }: { onAddBlock: (type: CriarCanvasElement["type"]) => void }) {
  return (
    <aside className="rounded-2xl border bg-card/80 p-4">
      <h2 className="text-sm font-semibold">Componentes</h2>
      <p className="mt-1 text-xs text-muted-foreground">Adicione elementos no canvas.</p>
      <div className="mt-3 grid gap-2">
        {ELEMENT_TYPES.map((element) => (
          <Button key={element.type} type="button" variant="outline" className="justify-start" onClick={() => onAddBlock(element.type)}>
            + {element.label}
          </Button>
        ))}
      </div>
    </aside>
  );
}
