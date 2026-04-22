export const CRIAR_SCHEMA_VERSION = 1;

export type CriarTheme = {
  primary: string;
  background: string;
  text: string;
};

export type ElementAnimation = {
  preset: "none" | "float" | "pulse" | "slideUp";
  duration: number;
  delay: number;
};

export type CanvasBaseElement = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  opacity: number;
  radius: number;
  animation: ElementAnimation;
};

export type TextElement = CanvasBaseElement & {
  type: "text";
  text: string;
  color: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
};

export type ButtonElement = CanvasBaseElement & {
  type: "button";
  label: string;
  href: string;
  color: string;
  bg: string;
  fontSize: number;
  fontFamily: string;
};

export type ShapeElement = CanvasBaseElement & {
  type: "shape";
  bg: string;
};

export type ImageElement = CanvasBaseElement & {
  type: "image";
  src: string;
};

export type CriarCanvasElement = TextElement | ButtonElement | ShapeElement | ImageElement;

export type CriarPageSchema = {
  slug: string;
  title: string;
  viewport: "desktop" | "tablet" | "mobile";
  canvas: {
    width: number;
    height: number;
    background: string;
    elements: CriarCanvasElement[];
  };
};

export type CriarProjectSchema = {
  meta: {
    version: number;
  };
  theme: CriarTheme;
  pages: CriarPageSchema[];
};

export type CriarProjectRecord = {
  id: string;
  name: string;
  ownerUid: string;
  status: "draft" | "published";
  schema: CriarProjectSchema;
  createdAt?: string;
  updatedAt?: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validateElementBase(record: Record<string, unknown>): boolean {
  return (
    isString(record.id) &&
    isNumber(record.x) &&
    isNumber(record.y) &&
    isNumber(record.w) &&
    isNumber(record.h) &&
    isNumber(record.rotation) &&
    isNumber(record.opacity) &&
    isNumber(record.radius)
  );
}

function validateAnimation(animation: unknown): boolean {
  const a = asRecord(animation);
  if (!a) return false;
  return (
    (a.preset === "none" || a.preset === "float" || a.preset === "pulse" || a.preset === "slideUp") &&
    isNumber(a.duration) &&
    isNumber(a.delay)
  );
}

type LegacyBlock = {
  id: string;
  type: string;
  props: Record<string, unknown>;
};

function defaultAnimation(): ElementAnimation {
  return { preset: "none", duration: 1.2, delay: 0 };
}

function fromLegacyBlock(block: LegacyBlock, index: number): CriarCanvasElement[] {
  const y = 60 + index * 140;
  switch (block.type) {
    case "hero":
      return [
        {
          id: `${block.id}-title`,
          type: "text",
          text: String(block.props.title ?? "Título"),
          color: "#f8fafc",
          fontSize: 52,
          fontWeight: 700,
          fontFamily: "Inter, system-ui, sans-serif",
          x: 80,
          y,
          w: 840,
          h: 80,
          rotation: 0,
          opacity: 1,
          radius: 12,
          animation: defaultAnimation(),
        },
        {
          id: `${block.id}-sub`,
          type: "text",
          text: String(block.props.subtitle ?? "Subtítulo"),
          color: "#cbd5e1",
          fontSize: 20,
          fontWeight: 400,
          fontFamily: "Inter, system-ui, sans-serif",
          x: 80,
          y: y + 92,
          w: 760,
          h: 60,
          rotation: 0,
          opacity: 1,
          radius: 12,
          animation: defaultAnimation(),
        },
      ];
    case "footer":
      return [
        {
          id: `${block.id}-footer`,
          type: "text",
          text: String(block.props.text ?? "Rodapé"),
          color: "#94a3b8",
          fontSize: 16,
          fontWeight: 400,
          fontFamily: "Inter, system-ui, sans-serif",
          x: 80,
          y,
          w: 840,
          h: 42,
          rotation: 0,
          opacity: 1,
          radius: 8,
          animation: defaultAnimation(),
        },
      ];
    default:
      return [
        {
          id: `${block.id}-box`,
          type: "shape",
          bg: "#1e293b",
          x: 80,
          y,
          w: 460,
          h: 120,
          rotation: 0,
          opacity: 1,
          radius: 16,
          animation: defaultAnimation(),
        },
        {
          id: `${block.id}-label`,
          type: "text",
          text: String(block.props.title ?? block.type.toUpperCase()),
          color: "#e2e8f0",
          fontSize: 24,
          fontWeight: 600,
          fontFamily: "Inter, system-ui, sans-serif",
          x: 98,
          y: y + 42,
          w: 420,
          h: 36,
          rotation: 0,
          opacity: 1,
          radius: 8,
          animation: defaultAnimation(),
        },
      ];
  }
}

export function normalizeCriarSchema(input: unknown): CriarProjectSchema | null {
  const root = asRecord(input);
  if (!root) return null;
  const meta = asRecord(root.meta);
  const theme = asRecord(root.theme);
  if (!meta || !theme || !isNumber(meta.version)) return null;
  if (!isString(theme.primary) || !isString(theme.background) || !isString(theme.text)) return null;
  if (!Array.isArray(root.pages) || root.pages.length === 0) return null;

  const normalizedPages: CriarPageSchema[] = [];
  for (const page of root.pages) {
    const pageRecord = asRecord(page);
    if (!pageRecord || !isString(pageRecord.slug) || !isString(pageRecord.title)) return null;

    const canvas = asRecord(pageRecord.canvas);
    if (canvas && Array.isArray(canvas.elements) && isNumber(canvas.width) && isNumber(canvas.height)) {
      const elements = canvas.elements as CriarCanvasElement[];
      normalizedPages.push({
        slug: pageRecord.slug,
        title: pageRecord.title,
        viewport:
          pageRecord.viewport === "tablet" || pageRecord.viewport === "mobile" ? pageRecord.viewport : "desktop",
        canvas: {
          width: canvas.width,
          height: canvas.height,
          background: isString(canvas.background) ? canvas.background : "#ffffff",
          elements,
        },
      });
      continue;
    }

    // Legacy migration from blocks -> canvas elements
    if (Array.isArray(pageRecord.blocks)) {
      const legacyBlocks = pageRecord.blocks
        .map((entry) => asRecord(entry))
        .filter(Boolean)
        .map((entry) => ({
          id: String(entry!.id ?? `legacy-${Math.random().toString(36).slice(2, 8)}`),
          type: String(entry!.type ?? "shape"),
          props: asRecord(entry!.props) ?? {},
        })) as LegacyBlock[];

      const elements = legacyBlocks.flatMap((block, index) => fromLegacyBlock(block, index));
      normalizedPages.push({
        slug: pageRecord.slug,
        title: pageRecord.title,
        viewport: "desktop",
        canvas: {
          width: 1200,
          height: Math.max(900, elements.length * 180),
          background: "#ffffff",
          elements,
        },
      });
      continue;
    }

    return null;
  }

  return {
    meta: { version: meta.version },
    theme: {
      primary: theme.primary,
      background: theme.background,
      text: theme.text,
    },
    pages: normalizedPages,
  };
}

export function validateCriarSchema(input: unknown): { ok: true; value: CriarProjectSchema } | { ok: false; error: string } {
  const normalized = normalizeCriarSchema(input);
  if (!normalized) return { ok: false, error: "Schema invalido." };

  for (const page of normalized.pages) {
    if (
      !isString(page.slug) ||
      !isString(page.title) ||
      (page.viewport !== "desktop" && page.viewport !== "tablet" && page.viewport !== "mobile")
    ) {
      return { ok: false, error: "Pagina invalida." };
    }
    if (
      !isNumber(page.canvas.width) ||
      !isNumber(page.canvas.height) ||
      !isString(page.canvas.background) ||
      !Array.isArray(page.canvas.elements)
    ) {
      return { ok: false, error: "Canvas invalido." };
    }

    for (const element of page.canvas.elements) {
      const record = asRecord(element);
      if (!record || !isString(record.type) || !validateElementBase(record) || !validateAnimation(record.animation)) {
        return { ok: false, error: "Elemento invalido." };
      }

      switch (record.type) {
        case "text":
          if (
            !isString(record.text) ||
            !isString(record.color) ||
            !isNumber(record.fontSize) ||
            !isNumber(record.fontWeight) ||
            !isString(record.fontFamily)
          ) {
            return { ok: false, error: "Elemento text invalido." };
          }
          break;
        case "button":
          if (
            !isString(record.label) ||
            !isString(record.href) ||
            !isString(record.color) ||
            !isString(record.bg) ||
            !isNumber(record.fontSize) ||
            !isString(record.fontFamily)
          ) {
            return { ok: false, error: "Elemento button invalido." };
          }
          break;
        case "shape":
          if (!isString(record.bg)) return { ok: false, error: "Elemento shape invalido." };
          break;
        case "image":
          if (!isString(record.src)) return { ok: false, error: "Elemento image invalido." };
          break;
        default:
          return { ok: false, error: `Tipo de elemento nao suportado: ${record.type}` };
      }
    }
  }

  return { ok: true, value: normalized };
}
