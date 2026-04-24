"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Laptop, Plus, Save, Smartphone, Tablet, ZoomIn, ZoomOut } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { BlockPalette } from "@/components/criar/block-palette";
import { CanvasPreview } from "@/components/criar/canvas-preview";
import { PropertiesPanel } from "@/components/criar/properties-panel";
import { createLibraryComponentElements } from "@/lib/criar/library-components";
import { makeBlankPage, makeElement } from "@/lib/criar/defaults";
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
  const [zoomMode, setZoomMode] = useState<"fit" | "manual">("fit");
  const [activePageIndex, setActivePageIndex] = useState(0);
  const clipboardRef = useRef<CriarCanvasElement | null>(null);
  const pageClipboardRef = useRef<CriarProjectSchema["pages"][number] | null>(null);
  const historyRef = useRef<CriarProjectSchema[]>([]);
  const historyIndexRef = useRef(-1);
  const applyingHistoryRef = useRef(false);

  function cloneSchemaSnapshot(input: CriarProjectSchema): CriarProjectSchema {
    return JSON.parse(JSON.stringify(input)) as CriarProjectSchema;
  }

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
        setActivePageIndex(0);
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
  const pages = schema?.pages ?? [];
  const page = pages[activePageIndex] ?? null;
  const elements = page?.canvas.elements ?? [];
  const selectedIndex = elements.findIndex((element) => element.id === selectedBlockId);
  const selectedElement = selectedIndex >= 0 ? elements[selectedIndex]! : null;

  useEffect(() => {
    if (!project?.schema) return;
    if (applyingHistoryRef.current) return;
    const snapshot = cloneSchemaSnapshot(project.schema);
    const current = historyRef.current[historyIndexRef.current];
    if (current && JSON.stringify(current) === JSON.stringify(snapshot)) return;
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(snapshot);
    if (nextHistory.length > 100) {
      nextHistory.shift();
    }
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
  }, [project?.schema]);

  function restoreHistory(direction: -1 | 1) {
    if (!project) return;
    const nextIndex = historyIndexRef.current + direction;
    if (nextIndex < 0 || nextIndex >= historyRef.current.length) return;
    const snapshot = historyRef.current[nextIndex];
    if (!snapshot) return;
    applyingHistoryRef.current = true;
    historyIndexRef.current = nextIndex;
    const nextSchema = cloneSchemaSnapshot(snapshot);
    const safePageIndex = Math.max(0, Math.min(activePageIndex, nextSchema.pages.length - 1));
    setProject({ ...project, schema: nextSchema });
    setActivePageIndex(safePageIndex);
    setSelectedBlockId(nextSchema.pages[safePageIndex]?.canvas.elements[0]?.id ?? null);
    window.setTimeout(() => {
      applyingHistoryRef.current = false;
    }, 0);
  }

  function mutateElements(mutator: (list: CriarCanvasElement[]) => CriarCanvasElement[], nextSelectedId?: string | null) {
    if (!project) return;
    const currentPage = project.schema.pages[activePageIndex];
    if (!currentPage) return;
    const nextElements = mutator(currentPage.canvas.elements);
    const nextPages = [...project.schema.pages];
    nextPages[activePageIndex] = { ...currentPage, canvas: { ...currentPage.canvas, elements: nextElements } };
    const nextProject: CriarProjectRecord = {
      ...project,
      schema: {
        ...project.schema,
        pages: nextPages,
      },
    };
    setProject(nextProject);
    if (nextSelectedId !== undefined) setSelectedBlockId(nextSelectedId);
  }

  function addBlock(type: CriarCanvasElement["type"]) {
    const element = makeElement(type);
    mutateElements((list) => [...list, element], element.id);
  }

  function addLibraryComponent(componentId: string, targetPageIndex = activePageIndex, x = 120, y = 120) {
    if (!project) return;
    const localPage = project.schema.pages[targetPageIndex];
    if (!localPage) return;
    const nextElements = createLibraryComponentElements(componentId, x, y);
    const nextPages = [...project.schema.pages];
    nextPages[targetPageIndex] = {
      ...localPage,
      canvas: {
        ...localPage.canvas,
        elements: [...localPage.canvas.elements, ...nextElements],
      },
    };
    setProject({ ...project, schema: { ...project.schema, pages: nextPages } });
    setActivePageIndex(targetPageIndex);
    setSelectedBlockId(nextElements[0]?.id ?? null);
  }

  function cloneElement(element: CriarCanvasElement) {
    return {
      ...element,
      id: `${element.type}-${Math.random().toString(36).slice(2, 10)}`,
      x: element.x + 24,
      y: element.y + 24,
    };
  }

  function clonePage(source: CriarProjectSchema["pages"][number], index: number): CriarProjectSchema["pages"][number] {
    const clonedElements = source.canvas.elements.map((element) => ({
      ...element,
      id: `${element.type}-${Math.random().toString(36).slice(2, 10)}`,
      x: element.x + 24,
      y: element.y + 24,
    }));
    return {
      ...source,
      slug: `pagina-${index + 1}`,
      title: `${source.title} ${index + 1}`,
      connections: [],
      layout: {
        x: source.layout.x + 120,
        y: source.layout.y + 120,
      },
      canvas: {
        ...source.canvas,
        elements: clonedElements,
      },
    };
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

  function duplicateSelected() {
    if (!selectedElement) return;
    const clone = cloneElement(selectedElement);
    mutateElements((list) => [...list, clone], clone.id);
  }

  function setCanvasBackground(background: string) {
    if (!project) return;
    const localPage = project.schema.pages[activePageIndex];
    if (!localPage) return;
    const nextPages = [...project.schema.pages];
    nextPages[activePageIndex] = { ...localPage, canvas: { ...localPage.canvas, background } };
    setProject({
      ...project,
      schema: {
        ...project.schema,
        pages: nextPages,
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
    if (!project) return;
    const current = project.schema.pages[activePageIndex];
    if (!current) return;
    const nextPages = [...project.schema.pages];
    if (next === "desktop") nextPages[activePageIndex] = { ...current, viewport: "desktop", canvas: { ...current.canvas, width: 1280, height: 900 } };
    if (next === "tablet") nextPages[activePageIndex] = { ...current, viewport: "tablet", canvas: { ...current.canvas, width: 900, height: 1200 } };
    if (next === "mobile") nextPages[activePageIndex] = { ...current, viewport: "mobile", canvas: { ...current.canvas, width: 430, height: 932 } };
    setProject({ ...project, schema: { ...project.schema, pages: nextPages } });
    setZoomMode("fit");
  }

  function addPage(viewport: "desktop" | "tablet" | "mobile") {
    if (!project) return;
    const nextIndex = project.schema.pages.length;
    const newPage = makeBlankPage(nextIndex, viewport);
    const nextPages = [...project.schema.pages, newPage];
    setProject({ ...project, schema: { ...project.schema, pages: nextPages } });
    setActivePageIndex(nextIndex);
    setSelectedBlockId(null);
    setZoomMode("fit");
  }

  function duplicateActivePage() {
    if (!project) return;
    const current = project.schema.pages[activePageIndex];
    if (!current) return;
    const nextIndex = project.schema.pages.length;
    const duplicated = clonePage(current, nextIndex);
    const nextPages = [...project.schema.pages, duplicated];
    setProject({ ...project, schema: { ...project.schema, pages: nextPages } });
    setActivePageIndex(nextIndex);
    setSelectedBlockId(duplicated.canvas.elements[0]?.id ?? null);
    setZoomMode("fit");
  }

  function movePage(pageIndexToMove: number, nextX: number, nextY: number) {
    if (!project) return;
    const localPage = project.schema.pages[pageIndexToMove];
    if (!localPage) return;
    const nextPages = [...project.schema.pages];
    nextPages[pageIndexToMove] = {
      ...localPage,
      layout: {
        x: Math.max(0, Math.round(nextX)),
        y: Math.max(0, Math.round(nextY)),
      },
    };
    setProject({ ...project, schema: { ...project.schema, pages: nextPages } });
  }

  function deletePage(pageIndexToDelete: number) {
    if (!project) return;
    if (project.schema.pages.length <= 1) return;
    const removedSlug = project.schema.pages[pageIndexToDelete]?.slug;
    const nextPages = project.schema.pages
      .filter((_, index) => index !== pageIndexToDelete)
      .map((entry) => ({
        ...entry,
        connections: entry.connections.filter((connection) => connection.targetSlug !== removedSlug),
      }));
    const nextActive = Math.max(0, Math.min(activePageIndex > pageIndexToDelete ? activePageIndex - 1 : activePageIndex, nextPages.length - 1));
    setProject({ ...project, schema: { ...project.schema, pages: nextPages } });
    setActivePageIndex(nextActive);
    setSelectedBlockId(nextPages[nextActive]?.canvas.elements[0]?.id ?? null);
  }

  function linkPage(
    pageIndexToLink: number,
    payload: { targetSlug: string; effect: "slideOver" | "slideUnder" | "fold" | "flip" | "fade" | "push"; layer: "over" | "under" } | null,
  ) {
    if (!project) return;
    const currentPage = project.schema.pages[pageIndexToLink];
    if (!currentPage) return;
    const nextPages = [...project.schema.pages];
    nextPages[pageIndexToLink] = {
      ...currentPage,
      connections: payload
        ? [
            {
              id: `conn-${Math.random().toString(36).slice(2, 10)}`,
              targetSlug: payload.targetSlug,
              effect: payload.effect,
              layer: payload.layer,
            },
          ]
        : [],
    };
    setProject({ ...project, schema: { ...project.schema, pages: nextPages } });
  }

  function setManualZoom(next: number) {
    setZoomMode("manual");
    setZoom(Math.max(0.2, Math.min(2, next)));
  }

  useEffect(() => {
    function handleEditorShortcuts(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        !!target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (isTypingTarget) return;

      const key = event.key.toLowerCase();
      const withMeta = event.ctrlKey || event.metaKey;

      if (withMeta && key === "z" && !event.shiftKey) {
        event.preventDefault();
        restoreHistory(-1);
        return;
      }

      if (withMeta && (key === "y" || (event.shiftKey && key === "z"))) {
        event.preventDefault();
        restoreHistory(1);
        return;
      }

      if (withMeta && key === "c" && selectedElement) {
        event.preventDefault();
        clipboardRef.current = { ...selectedElement };
        return;
      }

      if (withMeta && key === "c" && !selectedElement && page) {
        event.preventDefault();
        pageClipboardRef.current = JSON.parse(JSON.stringify(page)) as CriarProjectSchema["pages"][number];
        return;
      }

      if (withMeta && key === "v" && clipboardRef.current) {
        event.preventDefault();
        const clone = cloneElement(clipboardRef.current);
        mutateElements((list) => [...list, clone], clone.id);
        return;
      }

      if (withMeta && key === "v" && !selectedElement && pageClipboardRef.current && project) {
        event.preventDefault();
        const nextIndex = project.schema.pages.length;
        const duplicated = clonePage(pageClipboardRef.current, nextIndex);
        const nextPages = [...project.schema.pages, duplicated];
        setProject({ ...project, schema: { ...project.schema, pages: nextPages } });
        setActivePageIndex(nextIndex);
        setSelectedBlockId(duplicated.canvas.elements[0]?.id ?? null);
        setZoomMode("fit");
        return;
      }

      if (withMeta && key === "d" && selectedElement) {
        event.preventDefault();
        const clone = cloneElement(selectedElement);
        mutateElements((list) => [...list, clone], clone.id);
        return;
      }

      if (withMeta && key === "d" && !selectedElement) {
        event.preventDefault();
        duplicateActivePage();
        return;
      }

      if (key === "delete" || key === "backspace") {
        if (!selectedElement) return;
        event.preventDefault();
        removeSelected();
      }
    }

    window.addEventListener("keydown", handleEditorShortcuts);
    return () => window.removeEventListener("keydown", handleEditorShortcuts);
  }, [selectedElement, activePageIndex, project, page]);

  useEffect(() => {
    function blockBrowserZoom(event: KeyboardEvent) {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && (key === "+" || key === "-" || key === "=" || key === "0")) {
        event.preventDefault();
      }
    }
    window.addEventListener("keydown", blockBrowserZoom);
    return () => window.removeEventListener("keydown", blockBrowserZoom);
  }, []);

  function handleFitZoom(zoomValue: number) {
    if (zoomMode === "fit") setZoom(zoomValue);
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
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold">{headerTitle}</h1>
            <p className="text-xs text-muted-foreground">crie, arraste, redimensione e anime elementos visuais.</p>
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
          <div className="grid h-[calc(100vh-11.5rem)] gap-3 overflow-hidden lg:grid-cols-[190px_minmax(0,1fr)_280px]">
            <div className="min-w-0 space-y-3 overflow-y-auto pr-1">
              <BlockPalette onAddBlock={addBlock} onAddLibraryComponent={(componentId) => addLibraryComponent(componentId)} />
              <section className="rounded-xl border bg-card/80 p-2.5">
                <h3 className="text-sm font-semibold">Telas do site</h3>
                <p className="mt-1 text-xs text-muted-foreground">Defina quantas telas seu site terá.</p>
                <div className="mt-3 grid gap-2">
                  {pages.map((entry, index) => (
                    <button
                      key={`${entry.slug}-${index}`}
                      type="button"
                      className={`rounded-lg border px-2.5 py-1.5 text-left text-sm ${index === activePageIndex ? "border-blue-500 bg-blue-500/10" : "border-border bg-background/50"}`}
                      onClick={() => {
                        setActivePageIndex(index);
                        setSelectedBlockId(entry.canvas.elements[0]?.id ?? null);
                        setZoomMode("fit");
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{entry.title}</span>
                        <span className="text-xs text-muted-foreground">{entry.viewport}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Button type="button" size="sm" variant="outline" onClick={() => addPage("desktop")}>
                    <Plus className="mr-1 size-3.5" />
                    + Desktop
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => addPage("tablet")}>
                    <Plus className="mr-1 size-3.5" />
                    + Tablet
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => addPage("mobile")}>
                    <Plus className="mr-1 size-3.5" />
                    + Mobile
                  </Button>
                </div>
              </section>
              <section className="rounded-xl border bg-card/80 p-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant={page?.viewport === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyViewport("desktop")}
                  >
                    <Laptop className="mr-1 size-3.5" />
                    Desktop
                  </Button>
                  <Button
                    type="button"
                    variant={page?.viewport === "tablet" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyViewport("tablet")}
                  >
                    <Tablet className="mr-1 size-3.5" />
                    Tablet
                  </Button>
                  <Button
                    type="button"
                    variant={page?.viewport === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => applyViewport("mobile")}
                  >
                    <Smartphone className="mr-1 size-3.5" />
                    Mobile
                  </Button>
                  <div className="ml-auto flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">Zoom</label>
                    <Button type="button" size="sm" variant="outline" onClick={() => setManualZoom(zoom - 0.1)}>
                      <ZoomOut className="size-3.5" />
                    </Button>
                    <input
                      type="range"
                      min={20}
                      max={200}
                      value={Math.round(zoom * 100)}
                      onChange={(event) => setManualZoom(Number(event.target.value) / 100)}
                    />
                    <Button type="button" size="sm" variant="outline" onClick={() => setManualZoom(zoom + 0.1)}>
                      <ZoomIn className="size-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setZoomMode("fit")}>
                      Ajustar
                    </Button>
                    <span className="w-12 text-right text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
                  </div>
                </div>
                {page ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Canvas: {page.canvas.width}x{page.canvas.height}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  Atalhos: Ctrl+C/Ctrl+V/Ctrl+D para elemento ou tela ativa, Delete remover. Duplo clique para editar texto.
                </p>
              </section>
            </div>
            <div className="min-w-0 overflow-hidden">
              <CanvasPreview
                schema={schema}
                pageIndex={activePageIndex}
                onSelectPage={setActivePageIndex}
                onMovePage={movePage}
                onDeletePage={deletePage}
                onDropLibraryComponent={addLibraryComponent}
                onLinkPage={linkPage}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onChangeElement={updateSelectedElement}
                onDuplicateSelected={duplicateSelected}
                onRemoveSelected={removeSelected}
                onMoveLayerUp={() => moveSelected(-1)}
                onMoveLayerDown={() => moveSelected(1)}
                zoom={zoom}
                zoomMode={zoomMode}
                onFitZoomChange={handleFitZoom}
                onManualZoomChange={setManualZoom}
              />
            </div>
            <div className="min-w-0 space-y-3 overflow-y-auto pr-1">
              <section className="rounded-xl border bg-card/80 p-3">
                <h3 className="text-sm font-semibold">Aparência global</h3>
                <div className="mt-3 grid gap-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Cor primária</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={schema.theme.primary}
                        onChange={(event) => setTheme({ primary: event.target.value })}
                        className="h-9 w-12 rounded-xl border bg-background p-1"
                      />
                      <input
                        value={schema.theme.primary}
                        onChange={(event) => setTheme({ primary: event.target.value })}
                        className="h-9 flex-1 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                      />
                    </div>
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Cor de texto global</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={schema.theme.text}
                        onChange={(event) => setTheme({ text: event.target.value })}
                        className="h-9 w-12 rounded-xl border bg-background p-1"
                      />
                      <input
                        value={schema.theme.text}
                        onChange={(event) => setTheme({ text: event.target.value })}
                        className="h-9 flex-1 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                      />
                    </div>
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Fundo global</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={schema.theme.background}
                        onChange={(event) => setTheme({ background: event.target.value })}
                        className="h-9 w-12 rounded-xl border bg-background p-1"
                      />
                      <input
                        value={schema.theme.background}
                        onChange={(event) => setTheme({ background: event.target.value })}
                        className="h-9 flex-1 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                      />
                    </div>
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">Fundo do canvas</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={page?.canvas.background ?? "#ffffff"}
                        onChange={(event) => setCanvasBackground(event.target.value)}
                        className="h-9 w-12 rounded-xl border bg-background p-1"
                      />
                      <input
                        value={page?.canvas.background ?? "#ffffff"}
                        onChange={(event) => setCanvasBackground(event.target.value)}
                        className="h-9 flex-1 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                      />
                    </div>
                  </label>
                </div>
              </section>
              <PropertiesPanel
                block={selectedElement}
                onChangeBlock={updateSelectedElement}
                onDuplicate={duplicateSelected}
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
