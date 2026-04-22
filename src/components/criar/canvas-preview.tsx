"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CriarCanvasElement, CriarProjectSchema } from "@/lib/criar/schema";
import { cn } from "@/lib/utils";

type Props = {
  schema: CriarProjectSchema;
  pageIndex: number;
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onChangeElement: (next: CriarCanvasElement) => void;
  zoom: number;
  zoomMode: "fit" | "manual";
  onFitZoomChange: (zoom: number) => void;
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
  selectedBlockId,
  onSelectBlock,
  onChangeElement,
  zoom,
  zoomMode,
  onFitZoomChange,
}: Props) {
  const page = schema.pages[pageIndex] ?? null;
  const canvasWidth = page?.canvas.width ?? 0;
  const canvasHeight = page?.canvas.height ?? 0;
  const dragging = useRef<{ id: string; mode: "move" | "resize"; startX: number; startY: number; baseX: number; baseY: number; baseW: number; baseH: number } | null>(null);
  const [, force] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!page) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    function computeFit() {
      const availableW = Math.max(viewport.clientWidth - 24, 320);
      const availableH = Math.max(viewport.clientHeight - 24, 280);
      const fit = Math.min(availableW / canvasWidth, availableH / canvasHeight, 1);
      onFitZoomChange(Math.max(0.2, Number(fit.toFixed(2))));
    }

    computeFit();
    const observer = new ResizeObserver(computeFit);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [onFitZoomChange, page, canvasHeight, canvasWidth]);

  const effectiveZoom = zoomMode === "fit" ? zoom : zoom;

  if (!page) return null;

  function beginDrag(event: React.PointerEvent, element: CriarCanvasElement, mode: "move" | "resize") {
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
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
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

  return (
    <section className="min-w-0 rounded-2xl border bg-background/50 p-3">
      <div ref={viewportRef} className="h-[72vh] overflow-auto rounded-xl border bg-[#111827] p-4">
        <div
          className="relative mx-auto overflow-hidden rounded-xl border border-slate-700 bg-[#0b1220]"
          style={{
            width: page.canvas.width,
            height: page.canvas.height,
            backgroundColor: page.canvas.background,
            transform: `scale(${effectiveZoom})`,
            transformOrigin: "top left",
            marginBottom: `${Math.max(0, (effectiveZoom - 1) * page.canvas.height)}px`,
          }}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <style>{`
            @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
            @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
            @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
          `}</style>
          {page.canvas.elements.map((element) => (
            <div
              key={element.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectBlock(element.id)}
              onPointerDown={(event) => beginDrag(event, element, "move")}
              className={cn(
                "absolute cursor-move select-none outline-none transition",
                selectedBlockId === element.id ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/60",
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
              ) : null}
              {element.type === "button" ? (
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

              {selectedBlockId === element.id ? (
                <span
                  className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-full border border-white bg-primary"
                  onPointerDown={(event) => beginDrag(event, element, "resize")}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
