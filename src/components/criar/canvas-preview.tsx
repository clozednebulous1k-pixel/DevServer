"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CriarCanvasElement, CriarProjectSchema } from "@/lib/criar/schema";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

const QUICK_FONT_OPTIONS = [
  "Inter, system-ui, sans-serif",
  "Arial, sans-serif",
  "Roboto, sans-serif",
  "Poppins, sans-serif",
  "Montserrat, sans-serif",
  "\"Open Sans\", sans-serif",
  "\"Space Grotesk\", sans-serif",
  "Georgia, serif",
  "\"Playfair Display\", serif",
  "\"Courier New\", monospace",
];

type Props = {
  schema: CriarProjectSchema;
  pageIndex: number;
  onSelectPage: (pageIndex: number) => void;
  onMovePage: (pageIndex: number, x: number, y: number) => void;
  onDeletePage: (pageIndex: number) => void;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onChangeElement: (next: CriarCanvasElement) => void;
  onDuplicateSelected: () => void;
  onRemoveSelected: () => void;
  onMoveLayerUp: () => void;
  onMoveLayerDown: () => void;
  zoom: number;
  zoomMode: "fit" | "manual";
  onFitZoomChange: (zoom: number) => void;
  onManualZoomChange: (zoom: number) => void;
};

function animationClass(element: CriarCanvasElement): string {
  switch (element.animation.preset) {
    case "float":
      return "animate-[float_var(--anim-duration)_ease-in-out_var(--anim-delay)_infinite]";
    case "pulse":
      return "animate-[pulse_var(--anim-duration)_ease-in-out_var(--anim-delay)_infinite]";
    case "slideUp":
      return "animate-[slideUp_var(--anim-duration)_ease_var(--anim-delay)_both]";
    default:
      return "";
  }
}

export function CanvasPreview({
  schema,
  pageIndex,
  onSelectPage,
  onMovePage,
  onDeletePage,
  selectedBlockId,
  onSelectBlock,
  onChangeElement,
  onDuplicateSelected,
  onRemoveSelected,
  onMoveLayerUp,
  onMoveLayerDown,
  zoom,
  zoomMode,
  onFitZoomChange,
  onManualZoomChange,
}: Props) {
  const page = schema.pages[pageIndex] ?? null;
  const canvasGap = 96;
  const pageFrames = schema.pages.map((currentPage, currentPageIndex) => ({
      page: currentPage,
      pageIndex: currentPageIndex,
      x: currentPage.layout.x,
      y: currentPage.layout.y,
    }));
  const workspaceWidth = pageFrames.reduce((max, frame) => Math.max(max, frame.x + frame.page.canvas.width), 0) + canvasGap;
  const workspaceHeight = pageFrames.reduce((max, frame) => Math.max(max, frame.y + frame.page.canvas.height), 0) + canvasGap;
  const dragging = useRef<{ id: string; mode: "move" | "resize"; startX: number; startY: number; baseX: number; baseY: number; baseW: number; baseH: number } | null>(null);
  const pageDragging = useRef<{ pageIndex: number; startX: number; startY: number; baseX: number; baseY: number } | null>(null);
  const panning = useRef<{ startX: number; startY: number; scrollLeft: number; scrollTop: number } | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [isPanning, setIsPanning] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string } | null>(null);
  const [fontMenu, setFontMenu] = useState<{
    x: number;
    y: number;
    elementId: string;
    baseFont: string;
    locked: boolean;
  } | null>(null);
  const [guideState, setGuideState] = useState<{ showCenterX: boolean; showCenterY: boolean }>({
    showCenterX: false,
    showCenterY: false,
  });

  const selectedElement =
    page?.canvas.elements.find((element) => element.id === selectedBlockId) ?? null;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey) return;
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.08 : 0.08;
      onManualZoomChange(Math.max(0.2, Math.min(2, zoom + delta)));
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [zoom, onManualZoomChange]);

  useEffect(() => {
    function closeFloatingMenus() {
      setContextMenu(null);
      setFontMenu((current) => {
        if (!current) return null;
        if (!current.locked && selectedElement && selectedElement.id === current.elementId) {
          if (selectedElement.type === "text" || selectedElement.type === "button") {
            onChangeElement({ ...selectedElement, fontFamily: current.baseFont });
          }
        }
        return null;
      });
    }
    window.addEventListener("mousedown", closeFloatingMenus);
    window.addEventListener("scroll", closeFloatingMenus, true);
    return () => {
      window.removeEventListener("mousedown", closeFloatingMenus);
      window.removeEventListener("scroll", closeFloatingMenus, true);
    };
  }, [onChangeElement, selectedElement]);

  useEffect(() => {
    if (!page || schema.pages.length === 0) return;

    function computeFit() {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const availableW = Math.max(viewport.clientWidth - 24, 320);
      const availableH = Math.max(viewport.clientHeight - 24, 280);
      const fit = Math.min(availableW / Math.max(workspaceWidth, 1), availableH / Math.max(workspaceHeight, 1), 1);
      onFitZoomChange(Math.max(0.2, Number(fit.toFixed(2))));
    }

    const viewport = viewportRef.current;
    if (!viewport) return;
    computeFit();
    const observer = new ResizeObserver(computeFit);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [onFitZoomChange, page, schema.pages.length, workspaceHeight, workspaceWidth]);

  const effectiveZoom = zoomMode === "fit" ? zoom : zoom;

  if (!page) return null;

  function beginDrag(event: React.PointerEvent, element: CriarCanvasElement, mode: "move" | "resize") {
    if (editingId === element.id) return;
    event.preventDefault();
    event.stopPropagation();
    onSelectBlock(element.id);
    dragging.current = {
      id: element.id,
      mode,
      startX: event.clientX,
      startY: event.clientY,
      baseX: element.x,
      baseY: element.y,
      baseW: element.w,
      baseH: element.h,
    };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent) {
    const pageCurrent = pageDragging.current;
    if (pageCurrent) {
      const scale = Math.max(zoom, 0.2);
      const dx = (event.clientX - pageCurrent.startX) / scale;
      const dy = (event.clientY - pageCurrent.startY) / scale;
      onMovePage(pageCurrent.pageIndex, pageCurrent.baseX + dx, pageCurrent.baseY + dy);
      return;
    }

    const current = dragging.current;
    if (!current) return;
    const element = page.canvas.elements.find((entry) => entry.id === current.id);
    if (!element) return;
    const scale = Math.max(zoom, 0.2);
    const dx = (event.clientX - current.startX) / scale;
    const dy = (event.clientY - current.startY) / scale;
    if (current.mode === "move") {
      const SNAP_THRESHOLD = 10;
      let nextX = Math.round(current.baseX + dx);
      let nextY = Math.round(current.baseY + dy);
      const elementCenterX = nextX + element.w / 2;
      const elementCenterY = nextY + element.h / 2;
      const pageCenterX = page.canvas.width / 2;
      const pageCenterY = page.canvas.height / 2;
      const snapX = Math.abs(elementCenterX - pageCenterX) <= SNAP_THRESHOLD;
      const snapY = Math.abs(elementCenterY - pageCenterY) <= SNAP_THRESHOLD;

      if (snapX) nextX = Math.round(pageCenterX - element.w / 2);
      if (snapY) nextY = Math.round(pageCenterY - element.h / 2);

      setGuideState({ showCenterX: snapX, showCenterY: snapY });
      onChangeElement({ ...element, x: nextX, y: nextY });
    } else {
      setGuideState({ showCenterX: false, showCenterY: false });
      onChangeElement({
        ...element,
        w: Math.max(24, Math.round(current.baseW + dx)),
        h: Math.max(24, Math.round(current.baseH + dy)),
      });
    }
  }

  function endDrag() {
    dragging.current = null;
    pageDragging.current = null;
    setGuideState({ showCenterX: false, showCenterY: false });
  }

  function beginPan(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 1) return;
    const viewport = viewportRef.current;
    if (!viewport) return;
    event.preventDefault();
    panning.current = {
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
    };
    setIsPanning(true);
  }

  function movePan(event: React.MouseEvent<HTMLDivElement>) {
    const current = panning.current;
    const viewport = viewportRef.current;
    if (!current || !viewport) return;
    event.preventDefault();
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    viewport.scrollLeft = current.scrollLeft - dx;
    viewport.scrollTop = current.scrollTop - dy;
  }

  function endPan() {
    panning.current = null;
    setIsPanning(false);
  }

  function applyQuickEdit(
    patch: Partial<CriarCanvasElement>,
    target: CriarCanvasElement | null = selectedElement,
  ) {
    if (!target) return;
    onChangeElement({ ...target, ...patch } as CriarCanvasElement);
  }

  function beginInlineEdit(element: CriarCanvasElement) {
    if (element.type !== "text" && element.type !== "button") return;
    setEditingId(element.id);
    setEditingValue(element.type === "text" ? element.text : element.label);
    onSelectBlock(element.id);
  }

  function commitInlineEdit(element: CriarCanvasElement) {
    if (editingId !== element.id) return;
    const nextValue = editingValue.trim();
    if (element.type === "text") {
      onChangeElement({ ...element, text: nextValue || "Novo texto" });
    }
    if (element.type === "button") {
      onChangeElement({ ...element, label: nextValue || "Botao" });
    }
    setEditingId(null);
  }

  return (
    <section className="min-w-0 h-full">
      <div
        ref={viewportRef}
        className={cn("h-full min-h-0 overflow-auto bg-background", isPanning ? "cursor-grabbing" : "cursor-default")}
        onMouseDown={beginPan}
        onMouseMove={movePan}
        onMouseUp={endPan}
        onMouseLeave={endPan}
        onAuxClick={(event) => {
          if (event.button === 1) event.preventDefault();
        }}
        onContextMenu={(event) => event.preventDefault()}
      >
        <div
          className="relative mx-auto bg-background"
          style={{
            width: workspaceWidth,
            height: workspaceHeight,
            transform: `scale(${effectiveZoom})`,
            transformOrigin: "top left",
            marginBottom: `${Math.max(0, (effectiveZoom - 1) * workspaceHeight)}px`,
          }}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClick={(event) => {
            setEditingId(null);
            if (event.target !== event.currentTarget) return;
            if (!selectedElement) return;
            if (selectedElement.type !== "text" && selectedElement.type !== "button") return;
            setContextMenu(null);
            setFontMenu({
              x: event.clientX,
              y: event.clientY,
              elementId: selectedElement.id,
              baseFont: selectedElement.fontFamily,
              locked: false,
            });
          }}
        >
          <style>{`
            @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
            @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
            @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
          `}</style>
          {pageFrames.map((frame) => {
            const currentPage = frame.page;
            const currentPageIndex = frame.pageIndex;
            const isActivePage = currentPageIndex === pageIndex;

            return (
              <div
                key={`${currentPage.slug}-${currentPageIndex}`}
                className={cn(
                  "absolute top-0 overflow-hidden bg-white transition",
                  isActivePage ? "ring-2 ring-blue-500" : "ring-1 ring-border hover:ring-blue-400",
                )}
                style={{
                  left: frame.x,
                  top: frame.y,
                  width: currentPage.canvas.width,
                  height: currentPage.canvas.height,
                  backgroundColor: currentPage.canvas.background,
                }}
                onClick={() => {
                  onSelectPage(currentPageIndex);
                  if (!isActivePage) onSelectBlock(currentPage.canvas.elements[0]?.id ?? null);
                }}
                onPointerDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  event.preventDefault();
                  onSelectPage(currentPageIndex);
                  pageDragging.current = {
                    pageIndex: currentPageIndex,
                    startX: event.clientX,
                    startY: event.clientY,
                    baseX: frame.x,
                    baseY: frame.y,
                  };
                }}
              >
                {isActivePage ? (
                  <button
                    type="button"
                    className="absolute right-2 top-2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-md border bg-background/80 text-destructive hover:bg-destructive/10"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeletePage(currentPageIndex);
                    }}
                    title="Deletar tela"
                  >
                    <Trash2 className="size-4" />
                  </button>
                ) : null}
                {isActivePage ? (
                  <>
                    <div className="pointer-events-none absolute left-10 right-10 top-10 bottom-10 rounded-md border border-blue-300/35 border-dashed" />
                    <div
                      className={cn(
                        "pointer-events-none absolute left-1/2 top-0 h-full w-px bg-blue-400/30 transition-opacity",
                        guideState.showCenterX ? "opacity-100" : "opacity-60",
                      )}
                    />
                    <div
                      className={cn(
                        "pointer-events-none absolute left-0 top-1/2 h-px w-full bg-blue-400/30 transition-opacity",
                        guideState.showCenterY ? "opacity-100" : "opacity-60",
                      )}
                    />
                  </>
                ) : null}
                {currentPage.canvas.elements.map((element) => (
                  <div
                    key={element.id}
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (!isActivePage) onSelectPage(currentPageIndex);
                      onSelectBlock(element.id);
                      setContextMenu(null);
                      setFontMenu(null);
                    }}
                    onDoubleClick={(event) => {
                      event.stopPropagation();
                      if (!isActivePage) onSelectPage(currentPageIndex);
                      beginInlineEdit(element);
                    }}
                    onPointerDown={(event) => {
                      if (!isActivePage) return;
                      beginDrag(event, element, "move");
                    }}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      if (!isActivePage) onSelectPage(currentPageIndex);
                      onSelectBlock(element.id);
                      setContextMenu({
                        x: event.clientX,
                        y: event.clientY,
                        elementId: element.id,
                      });
                      setFontMenu(null);
                    }}
                    className={cn(
                      "absolute select-none outline-none transition",
                      isActivePage ? "cursor-move" : "cursor-pointer",
                      selectedBlockId === element.id && isActivePage ? "ring-2 ring-blue-500" : "hover:ring-1 hover:ring-blue-400",
                      animationClass(element),
                    )}
                    style={
                      {
                        left: element.x,
                        top: element.y,
                        width: element.w,
                        height: element.h,
                        borderRadius: element.radius,
                        opacity: element.opacity,
                        transform: `rotate(${element.rotation}deg)`,
                        "--anim-duration": `${element.animation.duration}s`,
                        "--anim-delay": `${element.animation.delay}s`,
                      } as CSSProperties
                    }
                  >
                    {element.type === "text" ? (
                      editingId === element.id ? (
                        <textarea
                          autoFocus
                          value={editingValue}
                          onChange={(event) => setEditingValue(event.target.value)}
                          onBlur={() => commitInlineEdit(element)}
                          onPointerDown={(event) => event.stopPropagation()}
                          onKeyDown={(event) => {
                            if (event.key === "Escape") setEditingId(null);
                            if (event.key === "Enter" && !event.shiftKey) {
                              event.preventDefault();
                              commitInlineEdit(element);
                            }
                          }}
                          className="h-full w-full resize-none rounded-md border border-primary/50 bg-black/30 px-2 py-1 outline-none"
                          style={{
                            color: element.color,
                            fontSize: element.fontSize,
                            fontWeight: element.fontWeight,
                            fontFamily: element.fontFamily,
                          }}
                        />
                      ) : (
                        <div
                          className="h-full w-full whitespace-pre-wrap px-2 py-1"
                          style={{
                            color: element.color,
                            fontSize: element.fontSize,
                            fontWeight: element.fontWeight,
                            fontFamily: element.fontFamily,
                          }}
                        >
                          {element.text}
                        </div>
                      )
                    ) : null}
                    {element.type === "button" ? (
                      editingId === element.id ? (
                        <input
                          autoFocus
                          value={editingValue}
                          onChange={(event) => setEditingValue(event.target.value)}
                          onBlur={() => commitInlineEdit(element)}
                          onPointerDown={(event) => event.stopPropagation()}
                          onKeyDown={(event) => {
                            if (event.key === "Escape") setEditingId(null);
                            if (event.key === "Enter") commitInlineEdit(element);
                          }}
                          className="h-full w-full rounded-md border border-primary/60 bg-black/20 px-3 text-center outline-none"
                          style={{
                            backgroundColor: element.bg,
                            color: element.color,
                            fontSize: element.fontSize,
                            fontFamily: element.fontFamily,
                          }}
                        />
                      ) : (
                        <button
                          type="button"
                          className="h-full w-full"
                          style={{
                            backgroundColor: element.bg,
                            color: element.color,
                            fontSize: element.fontSize,
                            fontFamily: element.fontFamily,
                            borderRadius: element.radius,
                          }}
                        >
                          {element.label}
                        </button>
                      )
                    ) : null}
                    {element.type === "shape" ? (
                      <div className="h-full w-full" style={{ backgroundColor: element.bg, borderRadius: element.radius }} />
                    ) : null}
                    {element.type === "image" ? (
                      <img
                        src={element.src}
                        alt=""
                        className="h-full w-full object-cover"
                        style={{ borderRadius: element.radius }}
                        draggable={false}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}

                    {selectedBlockId === element.id && isActivePage ? (
                      <span
                        className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-full border border-white bg-primary"
                        onPointerDown={(event) => beginDrag(event, element, "resize")}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      {contextMenu && selectedElement && selectedElement.id === contextMenu.elementId ? (
        <div
          className="fixed z-50 w-64 rounded-xl border bg-background/95 p-3 shadow-2xl backdrop-blur"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Menu rápido</p>
          <div className="grid grid-cols-2 gap-1.5">
            <button type="button" className="rounded-md border px-2 py-1 text-xs hover:bg-accent" onClick={onMoveLayerUp}>
              Camada cima
            </button>
            <button type="button" className="rounded-md border px-2 py-1 text-xs hover:bg-accent" onClick={onMoveLayerDown}>
              Camada baixo
            </button>
            <button type="button" className="rounded-md border px-2 py-1 text-xs hover:bg-accent" onClick={onDuplicateSelected}>
              Duplicar
            </button>
            <button type="button" className="rounded-md border px-2 py-1 text-xs text-destructive hover:bg-destructive/10" onClick={onRemoveSelected}>
              Remover
            </button>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            <input
              type="number"
              value={Math.round(selectedElement.w)}
              onChange={(event) => applyQuickEdit({ w: Math.max(24, Number(event.target.value) || 24) })}
              className="h-8 rounded-md border px-2 text-xs"
              title="Largura"
            />
            <input
              type="number"
              value={Math.round(selectedElement.h)}
              onChange={(event) => applyQuickEdit({ h: Math.max(24, Number(event.target.value) || 24) })}
              className="h-8 rounded-md border px-2 text-xs"
              title="Altura"
            />
          </div>
          {selectedElement.type === "text" ? (
            <div className="mt-2 grid gap-1.5">
              <input
                type="color"
                value={selectedElement.color}
                onChange={(event) => applyQuickEdit({ color: event.target.value })}
                className="h-8 w-full rounded-md border p-1"
              />
              <input
                type="number"
                value={selectedElement.fontSize}
                onChange={(event) => applyQuickEdit({ fontSize: Math.max(8, Number(event.target.value) || 8) })}
                className="h-8 rounded-md border px-2 text-xs"
                title="Tamanho fonte"
              />
              <input
                value={selectedElement.fontFamily}
                onChange={(event) => applyQuickEdit({ fontFamily: event.target.value })}
                className="h-8 rounded-md border px-2 text-xs"
                title="Fonte"
              />
            </div>
          ) : null}
          {selectedElement.type === "button" ? (
            <div className="mt-2 grid gap-1.5">
              <input
                type="color"
                value={selectedElement.bg}
                onChange={(event) => applyQuickEdit({ bg: event.target.value })}
                className="h-8 w-full rounded-md border p-1"
              />
              <input
                type="color"
                value={selectedElement.color}
                onChange={(event) => applyQuickEdit({ color: event.target.value })}
                className="h-8 w-full rounded-md border p-1"
              />
              <input
                type="number"
                value={selectedElement.fontSize}
                onChange={(event) => applyQuickEdit({ fontSize: Math.max(8, Number(event.target.value) || 8) })}
                className="h-8 rounded-md border px-2 text-xs"
                title="Tamanho fonte"
              />
              <input
                value={selectedElement.fontFamily}
                onChange={(event) => applyQuickEdit({ fontFamily: event.target.value })}
                className="h-8 rounded-md border px-2 text-xs"
                title="Fonte"
              />
            </div>
          ) : null}
          {selectedElement.type === "shape" ? (
            <div className="mt-2">
              <input
                type="color"
                value={selectedElement.bg}
                onChange={(event) => applyQuickEdit({ bg: event.target.value })}
                className="h-8 w-full rounded-md border p-1"
              />
            </div>
          ) : null}
        </div>
      ) : null}
      {fontMenu && selectedElement && selectedElement.id === fontMenu.elementId && (selectedElement.type === "text" || selectedElement.type === "button") ? (
        <div
          className="fixed z-50 w-64 rounded-xl border bg-background/95 p-2 shadow-2xl backdrop-blur"
          style={{ left: fontMenu.x, top: fontMenu.y }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <p className="mb-1 px-1 text-xs font-semibold text-muted-foreground">Fontes (preview no hover)</p>
          <div className="max-h-56 overflow-auto">
            {QUICK_FONT_OPTIONS.map((font) => (
              <button
                key={font}
                type="button"
                className="block w-full rounded-md px-2 py-1 text-left text-xs hover:bg-accent"
                style={{ fontFamily: font }}
                onMouseEnter={() => {
                  if (!selectedElement || selectedElement.id !== fontMenu.elementId) return;
                  onChangeElement({ ...selectedElement, fontFamily: font });
                }}
                onClick={() => {
                  if (!selectedElement || selectedElement.id !== fontMenu.elementId) return;
                  onChangeElement({ ...selectedElement, fontFamily: font });
                  setFontMenu(null);
                }}
              >
                {font.split(",")[0]!.replace(/"/g, "")}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
