import type { CriarCanvasElement } from "@/lib/criar/schema";

export type LibraryComponentItem = {
  id: string;
  title: string;
  category: "hero" | "cta" | "features" | "pricing" | "faq" | "footer";
  description: string;
};

const LIBRARY_COMPONENT_REGISTRY: LibraryComponentItem[] = [
  { id: "hero-clean", title: "Hero Clean", category: "hero", description: "Titulo, subtitulo e CTA principal." },
  { id: "hero-split", title: "Hero Split", category: "hero", description: "Texto a esquerda e imagem a direita." },
  { id: "cta-center", title: "CTA Center", category: "cta", description: "Bloco de chamada com botao central." },
  { id: "features-3", title: "Features 3 Colunas", category: "features", description: "Titulo e tres cartoes de recursos." },
  { id: "features-4", title: "Features 4 Colunas", category: "features", description: "Grade compacta com quatro blocos." },
  { id: "pricing-3", title: "Pricing 3 Planos", category: "pricing", description: "Tabela com tres planos e destaque." },
  { id: "faq-list", title: "FAQ Lista", category: "faq", description: "Perguntas e respostas em lista visual." },
  { id: "footer-simple", title: "Footer Simples", category: "footer", description: "Rodape com links e copyright." },
];

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeText(x: number, y: number, text: string, size = 44, color = "#0f172a"): CriarCanvasElement {
  return {
    id: uid("text"),
    type: "text",
    text,
    color,
    fontSize: size,
    fontWeight: 700,
    fontFamily: "Inter, system-ui, sans-serif",
    x,
    y,
    w: Math.max(360, text.length * 18),
    h: size + 26,
    rotation: 0,
    opacity: 1,
    radius: 12,
    animation: { preset: "none", duration: 1.2, delay: 0 },
  };
}

function makeButton(x: number, y: number, label: string, bg = "#2563eb"): CriarCanvasElement {
  return {
    id: uid("btn"),
    type: "button",
    label,
    href: "#",
    color: "#ffffff",
    bg,
    fontSize: 16,
    fontFamily: "Inter, system-ui, sans-serif",
    x,
    y,
    w: 220,
    h: 52,
    rotation: 0,
    opacity: 1,
    radius: 999,
    animation: { preset: "none", duration: 1.2, delay: 0 },
  };
}

function makeShape(x: number, y: number, w: number, h: number, bg = "#e2e8f0"): CriarCanvasElement {
  return {
    id: uid("shape"),
    type: "shape",
    bg,
    x,
    y,
    w,
    h,
    rotation: 0,
    opacity: 1,
    radius: 20,
    animation: { preset: "none", duration: 1.2, delay: 0 },
  };
}

function makeImage(x: number, y: number, w = 420, h = 280): CriarCanvasElement {
  return {
    id: uid("img"),
    type: "image",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    x,
    y,
    w,
    h,
    rotation: 0,
    opacity: 1,
    radius: 20,
    animation: { preset: "none", duration: 1.2, delay: 0 },
  };
}

export function listLibraryComponents(): LibraryComponentItem[] {
  return LIBRARY_COMPONENT_REGISTRY;
}

export function createLibraryComponentElements(componentId: string, originX: number, originY: number): CriarCanvasElement[] {
  const x = Math.round(originX);
  const y = Math.round(originY);

  switch (componentId) {
    case "hero-clean":
      return [
        makeText(x, y, "Construa landing pages com DevServer", 52),
        makeText(x, y + 86, "Edite visualmente, publique com velocidade e mantenha controle total.", 22, "#334155"),
        makeButton(x, y + 156, "Comecar agora"),
      ];
    case "hero-split":
      return [
        makeText(x, y, "Seu projeto do zero ao deploy", 48),
        makeText(x, y + 82, "Biblioteca, editor visual e fluxos prontos para producao.", 22, "#334155"),
        makeButton(x, y + 148, "Testar gratis", "#16a34a"),
        makeImage(x + 520, y - 12, 420, 300),
      ];
    case "cta-center":
      return [
        makeShape(x, y, 860, 220, "#0f172a"),
        { ...makeText(x + 40, y + 38, "Escale seu produto com confianca", 40, "#f8fafc"), w: 760 },
        { ...makeButton(x + 40, y + 132, "Criar meu projeto"), bg: "#22c55e" },
      ];
    case "features-3":
      return [
        makeText(x, y, "Recursos principais", 38),
        makeShape(x, y + 82, 300, 220, "#f1f5f9"),
        makeShape(x + 320, y + 82, 300, 220, "#f1f5f9"),
        makeShape(x + 640, y + 82, 300, 220, "#f1f5f9"),
      ];
    case "features-4":
      return [
        makeText(x, y, "Modulos do DevServer", 34),
        makeShape(x, y + 72, 220, 180, "#f8fafc"),
        makeShape(x + 240, y + 72, 220, 180, "#f8fafc"),
        makeShape(x + 480, y + 72, 220, 180, "#f8fafc"),
        makeShape(x + 720, y + 72, 220, 180, "#f8fafc"),
      ];
    case "pricing-3":
      return [
        makeText(x, y, "Planos para cada estagio", 36),
        makeShape(x, y + 78, 270, 380, "#f8fafc"),
        makeShape(x + 300, y + 58, 290, 420, "#e2e8f0"),
        makeShape(x + 620, y + 78, 270, 380, "#f8fafc"),
      ];
    case "faq-list":
      return [
        makeText(x, y, "Perguntas frequentes", 36),
        makeShape(x, y + 78, 900, 74, "#f8fafc"),
        makeShape(x, y + 166, 900, 74, "#f8fafc"),
        makeShape(x, y + 254, 900, 74, "#f8fafc"),
      ];
    case "footer-simple":
      return [
        makeShape(x, y, 1200, 180, "#0f172a"),
        makeText(x + 30, y + 40, "DevServer", 28, "#f8fafc"),
        makeText(x + 30, y + 96, "Copyright 2026 DevServer. Todos os direitos reservados.", 16, "#94a3b8"),
      ];
    default:
      return [makeText(x, y, "Componente de biblioteca", 32)];
  }
}
import type { CriarCanvasElement } from "@/lib/criar/schema";

export type LibraryComponentItem = {
  id: string;
  title: string;
  category: "hero" | "cta" | "features" | "pricing" | "faq" | "footer";
  description: string;
};

const LIBRARY_COMPONENT_REGISTRY: LibraryComponentItem[] = [
  { id: "hero-clean", title: "Hero Clean", category: "hero", description: "Título, subtítulo e CTA principal." },
  { id: "hero-split", title: "Hero Split", category: "hero", description: "Texto à esquerda e imagem à direita." },
  { id: "cta-center", title: "CTA Center", category: "cta", description: "Bloco de chamada com botão central." },
  { id: "features-3", title: "Features 3 Colunas", category: "features", description: "Título e três cartões de recursos." },
  { id: "features-4", title: "Features 4 Colunas", category: "features", description: "Grade compacta com quatro blocos." },
  { id: "pricing-3", title: "Pricing 3 Planos", category: "pricing", description: "Tabela com três planos e destaque." },
  { id: "faq-list", title: "FAQ Lista", category: "faq", description: "Perguntas e respostas em lista visual." },
  { id: "footer-simple", title: "Footer Simples", category: "footer", description: "Rodapé com links e copyright." },
];

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeText(x: number, y: number, text: string, size = 44, color = "#0f172a"): CriarCanvasElement {
  return {
    id: uid("text"),
    type: "text",
    text,
    color,
    fontSize: size,
    fontWeight: 700,
    fontFamily: "Inter, system-ui, sans-serif",
    x,
    y,
    w: Math.max(360, text.length * 18),
    h: size + 26,
    rotation: 0,
    opacity: 1,
    radius: 12,
    animation: { preset: "none", duration: 1.2, delay: 0 },
  };
}

function makeButton(x: number, y: number, label: string, bg = "#2563eb"): CriarCanvasElement {
  return {
    id: uid("btn"),
    type: "button",
    label,
    href: "#",
    color: "#ffffff",
    bg,
    fontSize: 16,
    fontFamily: "Inter, system-ui, sans-serif",
    x,
    y,
    w: 220,
    h: 52,
    rotation: 0,
    opacity: 1,
    radius: 999,
    animation: { preset: "none", duration: 1.2, delay: 0 },
  };
}

function makeShape(x: number, y: number, w: number, h: number, bg = "#e2e8f0"): CriarCanvasElement {
  return {
    id: uid("shape"),
    type: "shape",
    bg,
    x,
    y,
    w,
    h,
    rotation: 0,
    opacity: 1,
    radius: 20,
    animation: { preset: "none", duration: 1.2, delay: 0 },
  };
}

function makeImage(x: number, y: number, w = 420, h = 280): CriarCanvasElement {
  return {
    id: uid("img"),
    type: "image",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    x,
    y,
    w,
    h,
    rotation: 0,
    opacity: 1,
    radius: 20,
    animation: { preset: "none", duration: 1.2, delay: 0 },
  };
}

export function listLibraryComponents(): LibraryComponentItem[] {
  return LIBRARY_COMPONENT_REGISTRY;
}

export function createLibraryComponentElements(componentId: string, originX: number, originY: number): CriarCanvasElement[] {
  const x = Math.round(originX);
  const y = Math.round(originY);

  switch (componentId) {
    case "hero-clean":
      return [
        makeText(x, y, "Construa landing pages com DevServer", 52),
        makeText(x, y + 86, "Edite visualmente, publique com velocidade e mantenha controle total.", 22, "#334155"),
        makeButton(x, y + 156, "Começar agora"),
      ];
    case "hero-split":
      return [
        makeText(x, y, "Seu projeto do zero ao deploy", 48),
        makeText(x, y + 82, "Biblioteca, editor visual e fluxos prontos para produção.", 22, "#334155"),
        makeButton(x, y + 148, "Testar grátis", "#16a34a"),
        makeImage(x + 520, y - 12, 420, 300),
      ];
    case "cta-center":
      return [
        makeShape(x, y, 860, 220, "#0f172a"),
        { ...makeText(x + 40, y + 38, "Escale seu produto com confiança", 40, "#f8fafc"), w: 760 },
        { ...makeButton(x + 40, y + 132, "Criar meu projeto"), bg: "#22c55e" },
      ];
    case "features-3":
      return [
        makeText(x, y, "Recursos principais", 38),
        makeShape(x, y + 82, 300, 220, "#f1f5f9"),
        makeShape(x + 320, y + 82, 300, 220, "#f1f5f9"),
        makeShape(x + 640, y + 82, 300, 220, "#f1f5f9"),
      ];
    case "features-4":
      return [
        makeText(x, y, "Módulos do DevServer", 34),
        makeShape(x, y + 72, 220, 180, "#f8fafc"),
        makeShape(x + 240, y + 72, 220, 180, "#f8fafc"),
        makeShape(x + 480, y + 72, 220, 180, "#f8fafc"),
        makeShape(x + 720, y + 72, 220, 180, "#f8fafc"),
      ];
    case "pricing-3":
      return [
        makeText(x, y, "Planos para cada estágio", 36),
        makeShape(x, y + 78, 270, 380, "#f8fafc"),
        makeShape(x + 300, y + 58, 290, 420, "#e2e8f0"),
        makeShape(x + 620, y + 78, 270, 380, "#f8fafc"),
      ];
    case "faq-list":
      return [
        makeText(x, y, "Perguntas frequentes", 36),
        makeShape(x, y + 78, 900, 74, "#f8fafc"),
        makeShape(x, y + 166, 900, 74, "#f8fafc"),
        makeShape(x, y + 254, 900, 74, "#f8fafc"),
      ];
    case "footer-simple":
      return [
        makeShape(x, y, 1200, 180, "#0f172a"),
        makeText(x + 30, y + 40, "DevServer", 28, "#f8fafc"),
        makeText(x + 30, y + 96, "© 2026 DevServer. Todos os direitos reservados.", 16, "#94a3b8"),
      ];
    default:
      return [makeText(x, y, "Componente de biblioteca", 32)];
  }
}
