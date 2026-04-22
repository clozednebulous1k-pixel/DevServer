"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download, Laptop, Save, Smartphone, Tablet } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { BlockPalette } from "@/components/criar/block-palette";
import { CanvasPreview } from "@/components/criar/canvas-preview";
import { PropertiesPanel } from "@/components/criar/properties-panel";
import { makeElement } from "@/lib/criar/defaults";
import { normalizeCriarSchema, type CriarCanvasElement, type CriarProjectRecord, type CriarProjectSchema } from "@/lib/criar/schema";

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
  const [zoom, setZoom] = useState(1);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/criar/projects/${projectId}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Nao foi possivel carregar projeto.");
        return (await response.json()) as ProjectResponse;
      })
      .then((data) => {
        if (cancelled) return;
        const normalizedSchema = normalizeCriarSchema(data.project.schema);
        if (!normalizedSchema) {
          setFeedback("Schema do projeto inválido.");
          return;
        }
        const normalizedProject: CriarProjectRecord = {
          ...data.project,
          schema: normalizedSchema,
        };
        setProject(normalizedProject);
        setSelectedBlockId(normalizedProject.schema.pages[0]?.canvas.elements[0]?.id ?? null);
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
  const elements = schema?.pages[0]?.canvas.elements ?? [];
  const selectedIndex = elements.findIndex((element) => element.id === selectedBlockId);
  const selectedElement = selectedIndex >= 0 ? elements[selectedIndex]! : null;
  const page = schema?.pages[0] ?? null;

  function mutateElements(mutator: (list: CriarCanvasElement[]) => CriarCanvasElement[], nextSelectedId?: string | null) {
    if (!project) return;
    const page = project.schema.pages[0];
    if (!page) return;
    const nextElements = mutator(page.canvas.elements);
    const nextProject: CriarProjectRecord = {
      ...project,
      schema: {
        ...project.schema,
        pages: [{ ...page, canvas: { ...page.canvas, elements: nextElements } }],
      },
    };
    setProject(nextProject);
    if (nextSelectedId !== undefined) setSelectedBlockId(nextSelectedId);
  }

  function addBlock(type: CriarCanvasElement["type"]) {
    const element = makeElement(type);
    mutateElements((list) => [...list, element], element.id);
  }

  function updateSelectedElement(next: CriarCanvasElement) {
    if (selectedIndex < 0) return;
    mutateElements((list) => {
      const clone = [...list];
      clone[selectedIndex] = next;
      return clone;
    });
  }

  function moveSelected(direction: -1 | 1) {
    if (selectedIndex < 0) return;
    const target = selectedIndex + direction;
    if (target < 0 || target >= elements.length) return;
    mutateElements((list) => {
      const clone = [...list];
      const tmp = clone[selectedIndex]!;
      clone[selectedIndex] = clone[target]!;
      clone[target] = tmp;
      return clone;
    }, elements[target]!.id);
  }

  function removeSelected() {
    if (selectedIndex < 0) return;
    const nextElements = elements.filter((_, index) => index !== selectedIndex);
    mutateElements(() => nextElements, nextElements[selectedIndex - 1]?.id ?? nextElements[0]?.id ?? null);
  }

  function setCanvasSize(next: { width: number; height: number }) {
    if (!project) return;
    const localPage = project.schema.pages[0];
    if (!localPage) return;
    setProject({
      ...project,
      schema: {
        ...project.schema,
        pages: [{ ...localPage, canvas: { ...localPage.canvas, width: next.width, height: next.height } }],
      },
    });
  }

  function setCanvasBackground(background: string) {
    if (!project) return;
    const localPage = project.schema.pages[0];
    if (!localPage) return;
    setProject({
      ...project,
      schema: {
        ...project.schema,
        pages: [{ ...localPage, canvas: { ...localPage.canvas, background } }],
      },
    });
  }

  function setTheme(next: Partial<CriarProjectSchema["theme"]>) {
    if (!project) return;
    setProject({
      ...project,
      schema: {
        ...project.schema,
        theme: { ...project.schema.theme, ...next },
      },
    });
  }

  function applyViewport(next: "desktop" | "tablet" | "mobile") {
    setViewport(next);
    if (next === "desktop") setCanvasSize({ width: 1280, height: 900 });
    if (next === "tablet") setCanvasSize({ width: 900, height: 1200 });
    if (next === "mobile") setCanvasSize({ width: 430, height: 932 });
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
      <main className="w-full px-4 pb-10 pt-28">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{headerTitle}</h1>
            <p className="text-sm text-muted-foreground">Canvas livre: crie, arraste, redimensione e anime elementos visuais.</p>
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
          <div className="grid gap-4 lg:grid-cols-[240px_1fr_340px]">
            <BlockPalette onAddBlock={addBlock} />
            <div className="space-y-4">
              <section className="rounded-2xl border bg-card/80 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant={viewport === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyViewport("desktop")}
                  >
                    <Laptop className="mr-1 size-3.5" />
                    Desktop
                  </Button>
                  <Button
                    type="button"
                    variant={viewport === "tablet" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyViewport("tablet")}
                  >
                    <Tablet className="mr-1 size-3.5" />
                    Tablet
                  </Button>
                  <Button
                    type="button"
                    variant={viewport === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyViewport("mobile")}
                  >
                    <Smartphone className="mr-1 size-3.5" />
                    Mobile
                  </Button>
                  <div className="ml-auto flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">Zoom</label>
                    <input
                      type="range"
                      min={40}
                      max={160}
                      value={Math.round(zoom * 100)}
                      onChange={(event) => setZoom(Number(event.target.value) / 100)}
                    />
                    <span className="w-12 text-right text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
                  </div>
                </div>
                {page ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Canvas: {page.canvas.width}x{page.canvas.height}
                  </p>
                ) : null}
              </section>
              <CanvasPreview
                schema={schema}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onChangeElement={updateSelectedElement}
                zoom={zoom}
              />
            </div>
            <div className="space-y-4">
              <section className="rounded-2xl border bg-card/80 p-4">
                <h3 className="text-sm font-semibold">Aparência global</h3>
                <div className="mt-3 grid gap-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Cor primária</span>
                    <input
                      value={schema.theme.primary}
                      onChange={(event) => setTheme({ primary: event.target.value })}
                      className="h-9 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Cor de texto global</span>
                    <input
                      value={schema.theme.text}
                      onChange={(event) => setTheme({ text: event.target.value })}
                      className="h-9 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Fundo global</span>
                    <input
                      value={schema.theme.background}
                      onChange={(event) => setTheme({ background: event.target.value })}
                      className="h-9 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Fundo do canvas</span>
                    <input
                      value={page?.canvas.background ?? "#0b1220"}
                      onChange={(event) => setCanvasBackground(event.target.value)}
                      className="h-9 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                    />
                  </label>
                </div>
              </section>
              <PropertiesPanel
                block={selectedElement}
                onChangeBlock={updateSelectedElement}
                onMoveUp={() => moveSelected(-1)}
                onMoveDown={() => moveSelected(1)}
                onRemove={removeSelected}
                canMoveUp={selectedIndex > 0}
                canMoveDown={selectedIndex >= 0 && selectedIndex < elements.length - 1}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
