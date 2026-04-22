"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CriarCanvasElement, CriarProjectSchema } from "@/lib/criar/schema";
import { cn } from "@/lib/utils";

type Props = {
  schema: CriarProjectSchema;
  pageIndex: number;
  onSelectPage: (pageIndex: number) => void;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onChangeElement: (next: CriarCanvasElement) => void;
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
  selectedBlockId,
  onSelectBlock,
  onChangeElement,
  zoom,
  zoomMode,
  onFitZoomChange,
  onManualZoomChange,
}: Props) {
  const page = schema.pages[pageIndex] ?? null;
  const canvasGap = 96;
  const workspaceWidth = schema.pages.reduce((total, current, index) => total + current.canvas.width + (index > 0 ? canvasGap : 0), 0);
  const workspaceHeight = schema.pages.reduce((maxHeight, current) => Math.max(maxHeight, current.canvas.height), 0);
  const dragging = useRef<{ id: string; mode: "move" | "resize"; startX: number; startY: number; baseX: number; baseY: number; baseW: number; baseH: number } | null>(null);
  const [, force] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

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
    const current = dragging.current;
    if (!current) return;
    const element = page.canvas.elements.find((entry) => entry.id === current.id);
    if (!element) return;
    const scale = Math.max(zoom, 0.2);
    const dx = (event.clientX - current.startX) / scale;
    const dy = (event.clientY - current.startY) / scale;
    if (current.mode === "move") {
      onChangeElement({ ...element, x: Math.round(current.baseX + dx), y: Math.round(current.baseY + dy) });
    } else {
      onChangeElement({
        ...element,
        w: Math.max(24, Math.round(current.baseW + dx)),
        h: Math.max(24, Math.round(current.baseH + dy)),
      });
    }
    force((n) => n + 1);
  }

  function endDrag() {
    dragging.current = null;
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
        className="h-full min-h-0 overflow-auto bg-background"
        onWheel={(event) => {
          if (!event.ctrlKey) return;
          event.preventDefault();
          const delta = event.deltaY > 0 ? -0.08 : 0.08;
          onManualZoomChange(Math.max(0.2, Math.min(2, zoom + delta)));
        }}
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
          onClick={() => setEditingId(null)}
        >
          <style>{`
            @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
            @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
            @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
          `}</style>
          {schema.pages.map((currentPage, currentPageIndex) => {
            const frameOffsetX = schema.pages
              .slice(0, currentPageIndex)
              .reduce((total, entry) => total + entry.canvas.width + canvasGap, 0);
            const isActivePage = currentPageIndex === pageIndex;

            return (
              <div
                key={`${currentPage.slug}-${currentPageIndex}`}
                className={cn(
                  "absolute top-0 overflow-hidden bg-white transition",
                  isActivePage ? "ring-2 ring-primary/70" : "ring-1 ring-border hover:ring-primary/40",
                )}
                style={{
                  left: frameOffsetX,
                  width: currentPage.canvas.width,
                  height: currentPage.canvas.height,
                  backgroundColor: currentPage.canvas.background,
                }}
                onClick={() => {
                  onSelectPage(currentPageIndex);
                  if (!isActivePage) onSelectBlock(currentPage.canvas.elements[0]?.id ?? "");
                }}
              >
                {currentPage.canvas.elements.map((element) => (
                  <div
                    key={element.id}
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (!isActivePage) onSelectPage(currentPageIndex);
                      onSelectBlock(element.id);
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
                    className={cn(
                      "absolute select-none outline-none transition",
                      isActivePage ? "cursor-move" : "cursor-pointer",
                      selectedBlockId === element.id && isActivePage ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/60",
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
    </section>
  );
}
