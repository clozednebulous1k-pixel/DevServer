"use client";

import { Button } from "@/components/ui/button";
import type { CriarCanvasElement } from "@/lib/criar/schema";

type Props = {
  block: CriarCanvasElement | null;
  onChangeBlock: (next: CriarCanvasElement) => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

function TextField({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-20 rounded-xl border bg-background px-3 py-2 text-sm outline-none ring-primary/20 focus:ring-2"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
        />
      )}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-12 rounded-xl border bg-background p-1" />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 flex-1 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
        />
      </div>
    </label>
  );
}

export function PropertiesPanel({
  block,
  onChangeBlock,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
}: Props) {
  if (!block) {
    return (
      <aside className="rounded-2xl border bg-card/80 p-4">
        <h2 className="text-sm font-semibold">Propriedades</h2>
        <p className="mt-2 text-xs text-muted-foreground">Selecione um bloco para editar.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border bg-card/80 p-4">
      <h2 className="text-sm font-semibold">Propriedades: {block.type.toUpperCase()}</h2>
      <div className="mt-3 grid gap-2">
        <TextField
          label="Posição X"
          value={String(Math.round(block.x))}
          onChange={(x) => onChangeBlock({ ...block, x: Number(x) || 0 })}
        />
        <TextField
          label="Posição Y"
          value={String(Math.round(block.y))}
          onChange={(y) => onChangeBlock({ ...block, y: Number(y) || 0 })}
        />
        <TextField
          label="Largura"
          value={String(Math.round(block.w))}
          onChange={(w) => onChangeBlock({ ...block, w: Math.max(24, Number(w) || 24) })}
        />
        <TextField
          label="Altura"
          value={String(Math.round(block.h))}
          onChange={(h) => onChangeBlock({ ...block, h: Math.max(24, Number(h) || 24) })}
        />
        <TextField
          label="Raio da borda"
          value={String(Math.round(block.radius))}
          onChange={(radius) => onChangeBlock({ ...block, radius: Math.max(0, Number(radius) || 0) })}
        />
        <TextField
          label="Rotação"
          value={String(Math.round(block.rotation))}
          onChange={(rotation) => onChangeBlock({ ...block, rotation: Number(rotation) || 0 })}
        />
        <TextField
          label="Opacidade (0-1)"
          value={String(block.opacity)}
          onChange={(opacity) => onChangeBlock({ ...block, opacity: Math.max(0, Math.min(1, Number(opacity) || 0)) })}
        />
        <label className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Movimento</span>
          <select
            value={block.animation.preset}
            onChange={(event) =>
              onChangeBlock({
                ...block,
                animation: { ...block.animation, preset: event.target.value as CriarCanvasElement["animation"]["preset"] },
              })
            }
            className="h-9 rounded-xl border bg-background px-3 text-sm outline-none ring-primary/20 focus:ring-2"
          >
            <option value="none">Nenhum</option>
            <option value="float">Float</option>
            <option value="pulse">Pulse</option>
            <option value="slideUp">Slide up</option>
          </select>
        </label>
        <TextField
          label="Duração do movimento (s)"
          value={String(block.animation.duration)}
          onChange={(duration) =>
            onChangeBlock({
              ...block,
              animation: { ...block.animation, duration: Math.max(0.2, Number(duration) || 0.2) },
            })
          }
        />
        <TextField
          label="Delay (s)"
          value={String(block.animation.delay)}
          onChange={(delay) =>
            onChangeBlock({
              ...block,
              animation: { ...block.animation, delay: Math.max(0, Number(delay) || 0) },
            })
          }
        />
        {block.type === "text" ? (
          <>
            <TextField label="Texto" value={block.text} multiline onChange={(text) => onChangeBlock({ ...block, text })} />
            <ColorField label="Cor" value={block.color} onChange={(color) => onChangeBlock({ ...block, color })} />
            <TextField
              label="Tamanho da fonte"
              value={String(block.fontSize)}
              onChange={(fontSize) => onChangeBlock({ ...block, fontSize: Math.max(8, Number(fontSize) || 8) })}
            />
            <TextField
              label="Peso da fonte"
              value={String(block.fontWeight)}
              onChange={(fontWeight) => onChangeBlock({ ...block, fontWeight: Math.max(100, Number(fontWeight) || 100) })}
            />
            <TextField label="Fonte" value={block.fontFamily} onChange={(fontFamily) => onChangeBlock({ ...block, fontFamily })} />
          </>
        ) : null}
        {block.type === "button" ? (
          <>
            <TextField label="Texto do botão" value={block.label} onChange={(label) => onChangeBlock({ ...block, label })} />
            <TextField label="Link" value={block.href} onChange={(href) => onChangeBlock({ ...block, href })} />
            <ColorField label="Cor de fundo" value={block.bg} onChange={(bg) => onChangeBlock({ ...block, bg })} />
            <ColorField label="Cor do texto" value={block.color} onChange={(color) => onChangeBlock({ ...block, color })} />
            <TextField
              label="Tamanho da fonte"
              value={String(block.fontSize)}
              onChange={(fontSize) => onChangeBlock({ ...block, fontSize: Math.max(8, Number(fontSize) || 8) })}
            />
            <TextField label="Fonte" value={block.fontFamily} onChange={(fontFamily) => onChangeBlock({ ...block, fontFamily })} />
          </>
        ) : null}
        {block.type === "shape" ? <ColorField label="Cor de fundo" value={block.bg} onChange={(bg) => onChangeBlock({ ...block, bg })} /> : null}
        {block.type === "image" ? <TextField label="URL da imagem" value={block.src} onChange={(src) => onChangeBlock({ ...block, src })} /> : null}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" onClick={onDuplicate}>
          Duplicar
        </Button>
        <Button type="button" variant="outline" onClick={onMoveUp} disabled={!canMoveUp}>
          Subir
        </Button>
        <Button type="button" variant="outline" onClick={onMoveDown} disabled={!canMoveDown}>
          Descer
        </Button>
        <Button type="button" variant="destructive" onClick={onRemove}>
          Remover
        </Button>
      </div>
    </aside>
  );
}
