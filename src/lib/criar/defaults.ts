import {
  CRIAR_SCHEMA_VERSION,
  type CriarCanvasElement,
  type CriarProjectSchema,
} from "@/lib/criar/schema";

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeElementBase() {
  return {
    x: 80,
    y: 80,
    w: 260,
    h: 90,
    rotation: 0,
    opacity: 1,
    radius: 14,
    animation: {
      preset: "none" as const,
      duration: 1.2,
      delay: 0,
    },
  };
}

type ElementByType<T extends CriarCanvasElement["type"]> = Extract<CriarCanvasElement, { type: T }>;

export function makeElement<T extends CriarCanvasElement["type"]>(type: T): ElementByType<T> {
  const base = makeElementBase();
  switch (type) {
    case "text":
      return {
        id: uid("text"),
        type: "text",
        text: "Novo texto",
        color: "#f8fafc",
        fontSize: 42,
        fontWeight: 700,
        fontFamily: "Inter, system-ui, sans-serif",
        ...base,
        w: 420,
        h: 72,
      } as ElementByType<T>;
    case "button":
      return {
        id: uid("btn"),
        type: "button",
        label: "Call to action",
        href: "#",
        color: "#ffffff",
        bg: "#2563eb",
        fontSize: 16,
        fontFamily: "Inter, system-ui, sans-serif",
        ...base,
        w: 220,
        h: 56,
        radius: 999,
      } as ElementByType<T>;
    case "shape":
      return {
        id: uid("shape"),
        type: "shape",
        bg: "#334155",
        ...base,
        w: 320,
        h: 180,
      } as ElementByType<T>;
    case "image":
      return {
        id: uid("img"),
        type: "image",
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
        ...base,
        w: 360,
        h: 220,
      } as ElementByType<T>;
    default: {
      const neverType: never = type;
      throw new Error(`Tipo de elemento não suportado: ${neverType as string}`);
    }
  }
}

export function makeDefaultSchema(): CriarProjectSchema {
  return {
    meta: { version: CRIAR_SCHEMA_VERSION },
    theme: {
      primary: "#5bf68b",
      background: "#09090b",
      text: "#f5f5f5",
    },
    pages: [
      {
        slug: "home",
        title: "Home",
        canvas: {
          width: 1280,
          height: 900,
          background: "#0b1220",
          elements: [],
        },
      },
    ],
  };
}
