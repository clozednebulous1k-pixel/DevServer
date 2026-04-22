"use client";

import { renderCriarBlock } from "@/lib/criar/renderer";
import type { CriarProjectSchema } from "@/lib/criar/schema";
import { cn } from "@/lib/utils";

type Props = {
  schema: CriarProjectSchema;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
};

export function CanvasPreview({ schema, selectedBlockId, onSelectBlock }: Props) {
  const page = schema.pages[0];
  if (!page) return null;

  return (
    <section className="rounded-2xl border bg-background/50 p-3">
      <div className="max-h-[70vh] overflow-auto rounded-xl border bg-background p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {page.blocks.map((block) => (
            <button
              key={block.id}
              type="button"
              className={cn(
                "block w-full rounded-2xl text-left outline-none transition",
                selectedBlockId === block.id ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/40",
              )}
              onClick={() => onSelectBlock(block.id)}
            >
              {renderCriarBlock(block)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
