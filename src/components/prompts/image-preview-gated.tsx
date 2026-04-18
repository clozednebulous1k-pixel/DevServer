"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { isAbstractPreviewId, LibraryConceptPreview } from "@/components/prompts/library-concept-preview";

function ImagePreviewSkeleton() {
  return <div className="h-[168px] animate-pulse rounded-lg bg-muted/30 sm:h-[180px]" />;
}

const ImageRouter = dynamic(
  () => import("@/components/prompts/image-prompt-previews-lazy").then((m) => m.ImagePreviewLazyRouter),
  { ssr: false, loading: ImagePreviewSkeleton },
);

/**
 * Categoria Imagens: estado estático até clicar; depois carrega a prévia com animação/interação.
 */
export function GatedImagePreview({ id }: { id: string }) {
  const [live, setLive] = useState(false);

  if (isAbstractPreviewId(id)) {
    return <LibraryConceptPreview seed={id} tone="image" />;
  }

  if (!live) {
    return (
      <button
        type="button"
        onClick={() => setLive(true)}
        className="flex min-h-[168px] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 p-4 text-center text-sm text-muted-foreground transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-[180px]"
      >
        <ImageIcon className="size-8 opacity-50" aria-hidden />
        <span className="font-medium text-foreground">Prévia estática</span>
        <span className="max-w-[220px] text-xs leading-snug">
          Clique para carregar animação, WebGL ou interação deste bloco
        </span>
      </button>
    );
  }

  return <ImageRouter id={id} />;
}
