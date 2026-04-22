"use client";

import { Button } from "@/components/ui/button";
import type { CriarBlock } from "@/lib/criar/schema";

const BLOCK_TYPES: Array<{ type: CriarBlock["type"]; label: string }> = [
  { type: "hero", label: "Hero" },
  { type: "features", label: "Features" },
  { type: "cta", label: "CTA" },
  { type: "faq", label: "FAQ" },
  { type: "footer", label: "Footer" },
];

export function BlockPalette({ onAddBlock }: { onAddBlock: (type: CriarBlock["type"]) => void }) {
  return (
    <aside className="rounded-2xl border bg-card/80 p-4">
      <h2 className="text-sm font-semibold">Componentes</h2>
      <p className="mt-1 text-xs text-muted-foreground">Adicione blocos na página.</p>
      <div className="mt-3 grid gap-2">
        {BLOCK_TYPES.map((block) => (
          <Button key={block.type} type="button" variant="outline" className="justify-start" onClick={() => onAddBlock(block.type)}>
            + {block.label}
          </Button>
        ))}
      </div>
    </aside>
  );
}
