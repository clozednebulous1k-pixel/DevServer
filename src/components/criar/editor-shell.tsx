"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download, Save } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { BlockPalette } from "@/components/criar/block-palette";
import { CanvasPreview } from "@/components/criar/canvas-preview";
import { PropertiesPanel } from "@/components/criar/properties-panel";
import { makeBlock } from "@/lib/criar/defaults";
import type { CriarBlock, CriarProjectRecord, CriarProjectSchema } from "@/lib/criar/schema";

type Props = {
  projectId: string;
};

type ProjectResponse = { project: CriarProjectRecord };

export function EditorShell({ projectId }: Props) {
  const [project, setProject] = useState<CriarProjectRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/criar/projects/${projectId}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Nao foi possivel carregar projeto.");
        return (await response.json()) as ProjectResponse;
      })
      .then((data) => {
        if (cancelled) return;
        setProject(data.project);
        setSelectedBlockId(data.project.schema.pages[0]?.blocks[0]?.id ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setFeedback("Falha ao carregar projeto.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const schema: CriarProjectSchema | null = project?.schema ?? null;
  const blocks = schema?.pages[0]?.blocks ?? [];
  const selectedIndex = blocks.findIndex((block) => block.id === selectedBlockId);
  const selectedBlock = selectedIndex >= 0 ? blocks[selectedIndex]! : null;

  function mutateBlocks(mutator: (list: CriarBlock[]) => CriarBlock[], nextSelectedId?: string | null) {
    if (!project) return;
    const page = project.schema.pages[0];
    if (!page) return;
    const nextBlocks = mutator(page.blocks);
    const nextProject: CriarProjectRecord = {
      ...project,
      schema: {
        ...project.schema,
        pages: [{ ...page, blocks: nextBlocks }],
      },
    };
    setProject(nextProject);
    if (nextSelectedId !== undefined) setSelectedBlockId(nextSelectedId);
  }

  function addBlock(type: CriarBlock["type"]) {
    const block = makeBlock(type);
    mutateBlocks((list) => [...list, block], block.id);
  }

  function updateSelectedBlock(next: CriarBlock) {
    if (selectedIndex < 0) return;
    mutateBlocks((list) => {
      const clone = [...list];
      clone[selectedIndex] = next;
      return clone;
    });
  }

  function moveSelected(direction: -1 | 1) {
    if (selectedIndex < 0) return;
    const target = selectedIndex + direction;
    if (target < 0 || target >= blocks.length) return;
    mutateBlocks((list) => {
      const clone = [...list];
      const tmp = clone[selectedIndex]!;
      clone[selectedIndex] = clone[target]!;
      clone[target] = tmp;
      return clone;
    }, blocks[target]!.id);
  }

  function removeSelected() {
    if (selectedIndex < 0) return;
    const nextBlocks = blocks.filter((_, index) => index !== selectedIndex);
    mutateBlocks(() => nextBlocks, nextBlocks[selectedIndex - 1]?.id ?? nextBlocks[0]?.id ?? null);
  }

  async function saveProject() {
    if (!project) return;
    setSaving(true);
    setFeedback(null);
    try {
      const response = await fetch(`/api/criar/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: project.name,
          status: project.status,
          schema: project.schema,
        }),
      });
      if (!response.ok) throw new Error("Falha ao salvar.");
      setFeedback("Projeto salvo com sucesso.");
    } catch {
      setFeedback("Erro ao salvar projeto.");
    } finally {
      setSaving(false);
    }
  }

  async function exportProject() {
    if (!project) return;
    setFeedback(null);
    try {
      const response = await fetch(`/api/criar/projects/${project.id}/export`, { method: "GET" });
      if (!response.ok) throw new Error("Falha ao exportar.");
      const payload = (await response.json()) as { project: unknown };
      const blob = new Blob([JSON.stringify(payload.project, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${project.id}-project.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setFeedback("Export concluído.");
    } catch {
      setFeedback("Erro ao exportar.");
    }
  }

  const headerTitle = useMemo(() => {
    if (loading) return "Carregando editor...";
    return project ? `Editor: ${project.name}` : "Editor indisponível";
  }, [loading, project]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto w-full max-w-[1400px] px-4 pb-10 pt-28">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{headerTitle}</h1>
            <p className="text-sm text-muted-foreground">Edite componentes visuais e salve em JSON portável.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/criar">
              <Button type="button" variant="outline">
                Voltar
              </Button>
            </Link>
            <Button type="button" variant="outline" onClick={exportProject} disabled={!project}>
              <Download className="mr-1 size-4" />
              Exportar JSON
            </Button>
            <Button type="button" onClick={saveProject} disabled={saving || !project}>
              <Save className="mr-1 size-4" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
        {feedback ? <p className="mb-3 text-sm text-primary">{feedback}</p> : null}

        {loading ? (
          <div className="rounded-2xl border bg-card/80 p-6 text-sm text-muted-foreground">Carregando...</div>
        ) : !project || !schema ? (
          <div className="rounded-2xl border bg-card/80 p-6 text-sm text-destructive">Não foi possível abrir o projeto.</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[220px_1fr_320px]">
            <BlockPalette onAddBlock={addBlock} />
            <CanvasPreview schema={schema} selectedBlockId={selectedBlockId} onSelectBlock={setSelectedBlockId} />
            <PropertiesPanel
              block={selectedBlock}
              onChangeBlock={updateSelectedBlock}
              onMoveUp={() => moveSelected(-1)}
              onMoveDown={() => moveSelected(1)}
              onRemove={removeSelected}
              canMoveUp={selectedIndex > 0}
              canMoveDown={selectedIndex >= 0 && selectedIndex < blocks.length - 1}
            />
          </div>
        )}
      </main>
    </div>
  );
}
