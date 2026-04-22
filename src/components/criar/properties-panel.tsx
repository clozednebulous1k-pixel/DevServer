"use client";

import { Button } from "@/components/ui/button";
import type { CriarBlock } from "@/lib/criar/schema";

type Props = {
  block: CriarBlock | null;
  onChangeBlock: (next: CriarBlock) => void;
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

export function PropertiesPanel({
  block,
  onChangeBlock,
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
        {block.type === "hero" ? (
          <>
            <TextField label="Título" value={block.props.title} onChange={(title) => onChangeBlock({ ...block, props: { ...block.props, title } })} />
            <TextField
              label="Subtítulo"
              value={block.props.subtitle}
              multiline
              onChange={(subtitle) => onChangeBlock({ ...block, props: { ...block.props, subtitle } })}
            />
            <TextField
              label="Texto do botão"
              value={block.props.ctaLabel}
              onChange={(ctaLabel) => onChangeBlock({ ...block, props: { ...block.props, ctaLabel } })}
            />
            <TextField
              label="Link do botão"
              value={block.props.ctaHref}
              onChange={(ctaHref) => onChangeBlock({ ...block, props: { ...block.props, ctaHref } })}
            />
          </>
        ) : null}
        {block.type === "features" ? (
          <>
            <TextField label="Título" value={block.props.title} onChange={(title) => onChangeBlock({ ...block, props: { ...block.props, title } })} />
            {block.props.items.map((item, index) => (
              <TextField
                key={`${block.id}-feature-${index}`}
                label={`Item ${index + 1}`}
                value={item}
                onChange={(nextItem) => {
                  const items = [...block.props.items];
                  items[index] = nextItem;
                  onChangeBlock({ ...block, props: { ...block.props, items } });
                }}
              />
            ))}
          </>
        ) : null}
        {block.type === "cta" ? (
          <>
            <TextField label="Título" value={block.props.title} onChange={(title) => onChangeBlock({ ...block, props: { ...block.props, title } })} />
            <TextField
              label="Descrição"
              multiline
              value={block.props.description}
              onChange={(description) => onChangeBlock({ ...block, props: { ...block.props, description } })}
            />
            <TextField
              label="Botão"
              value={block.props.buttonLabel}
              onChange={(buttonLabel) => onChangeBlock({ ...block, props: { ...block.props, buttonLabel } })}
            />
            <TextField
              label="Link"
              value={block.props.buttonHref}
              onChange={(buttonHref) => onChangeBlock({ ...block, props: { ...block.props, buttonHref } })}
            />
          </>
        ) : null}
        {block.type === "faq" ? (
          <>
            <TextField label="Título" value={block.props.title} onChange={(title) => onChangeBlock({ ...block, props: { ...block.props, title } })} />
            {block.props.items.map((item, index) => (
              <div key={`${block.id}-faq-${index}`} className="grid gap-2 rounded-xl border p-2">
                <TextField
                  label={`Pergunta ${index + 1}`}
                  value={item.question}
                  onChange={(question) => {
                    const items = [...block.props.items];
                    items[index] = { ...item, question };
                    onChangeBlock({ ...block, props: { ...block.props, items } });
                  }}
                />
                <TextField
                  label={`Resposta ${index + 1}`}
                  multiline
                  value={item.answer}
                  onChange={(answer) => {
                    const items = [...block.props.items];
                    items[index] = { ...item, answer };
                    onChangeBlock({ ...block, props: { ...block.props, items } });
                  }}
                />
              </div>
            ))}
          </>
        ) : null}
        {block.type === "footer" ? (
          <TextField label="Texto" value={block.props.text} onChange={(text) => onChangeBlock({ ...block, props: { text } })} />
        ) : null}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
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
