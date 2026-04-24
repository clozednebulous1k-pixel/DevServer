import type { CriarCanvasElement } from "@/lib/criar/schema";

export type LibraryComponentItem = {
  id: string;
  title: string;
  category:
    | "heroes"
    | "backgrounds"
    | "borders"
    | "carousels"
    | "images"
    | "navigation"
    | "texts"
    | "scroll"
    | "seo"
    | "security"
    | "hosting"
    | "speed"
    | "databases"
    | "frontend_deploy";
  description: string;
  template: "hero-clean" | "hero-split" | "cta-center" | "features-3" | "features-4" | "pricing-3" | "faq-list" | "footer-simple";
};

const LIBRARY_COMPONENT_REGISTRY: LibraryComponentItem[] = [
  { id: "hero-myna-ui", title: "Hero Myna UI", category: "heroes", description: "Hero com CTA e foco em produto tech.", template: "hero-clean" },
  { id: "hero-digital-loom", title: "Hero Digital Loom", category: "heroes", description: "Hero com fundo marcante para landing.", template: "hero-split" },
  { id: "hero-robot-spline", title: "Hero Robot Spline", category: "heroes", description: "Composicao hero com area de destaque visual.", template: "hero-split" },
  { id: "hero-cta-dithering", title: "Hero CTA Dithering", category: "heroes", description: "Bloco de chamada com titulo e acao.", template: "cta-center" },
  { id: "hero-section-8", title: "Hero Section 8", category: "heroes", description: "Hero limpo para captura de leads.", template: "hero-clean" },
  { id: "animated-hero-section-1", title: "Animated Hero 1", category: "heroes", description: "Hero com narrativa e botoes secundarios.", template: "hero-split" },
  { id: "background-orbital", title: "Orbital Background", category: "backgrounds", description: "Secao com visual de background para destaque.", template: "features-4" },
  { id: "background-grid-gradient", title: "Grid Gradient Background", category: "backgrounds", description: "Composicao de fundo para seções de features.", template: "features-3" },
  { id: "border-divided-sections", title: "Border Divided Sections", category: "borders", description: "Layout dividido com blocos e bordas.", template: "features-3" },
  { id: "carousel-logos", title: "Carrossel de Logos", category: "carousels", description: "Faixa de clientes/parceiros.", template: "features-4" },
  { id: "image-gallery-focus", title: "Image Gallery Focus", category: "images", description: "Secao visual com destaque de imagem.", template: "hero-split" },
  { id: "navigation-tubelight", title: "Navigation Tubelight", category: "navigation", description: "Topo para navegação principal do site.", template: "footer-simple" },
  { id: "text-vaporize", title: "Vaporize Text", category: "texts", description: "Bloco de texto para headlines e storytelling.", template: "hero-clean" },
  { id: "scroll-expansion-hero", title: "Scroll Expansion Hero", category: "scroll", description: "Secao com ritmo de leitura vertical.", template: "hero-split" },
  { id: "seo-guia-pratico", title: "SEO Guia Pratico", category: "seo", description: "Secao de conteudo e orientacao SEO.", template: "faq-list" },
  { id: "security-check-panel", title: "Security Check Panel", category: "security", description: "Checklist de seguranca para deploy.", template: "faq-list" },
  { id: "hosting-panel", title: "Hosting Panel", category: "hosting", description: "Comparativo de hospedagem e ambiente.", template: "pricing-3" },
  { id: "speed-panel", title: "Speed Panel", category: "speed", description: "Bloco para performance e otimizações.", template: "features-3" },
  { id: "database-panel", title: "Database Panel", category: "databases", description: "Estrutura para dados e persistencia.", template: "pricing-3" },
  { id: "frontend-deploy-panel", title: "Frontend Deploy Panel", category: "frontend_deploy", description: "Fluxo de deploy de front-end.", template: "cta-center" },
];

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function makeText(
  x: number,
  y: number,
  text: string,
  size = 44,
  color = "#0f172a",
): Extract<CriarCanvasElement, { type: "text" }> {
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

function makeButton(x: number, y: number, label: string, bg = "#2563eb"): Extract<CriarCanvasElement, { type: "button" }> {
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

function makeShape(
  x: number,
  y: number,
  w: number,
  h: number,
  bg = "#e2e8f0",
): Extract<CriarCanvasElement, { type: "shape" }> {
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

function makeImage(x: number, y: number, w = 420, h = 280): Extract<CriarCanvasElement, { type: "image" }> {
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
  const template = LIBRARY_COMPONENT_REGISTRY.find((entry) => entry.id === componentId)?.template ?? "hero-clean";

  switch (template) {
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
        makeButton(x + 40, y + 132, "Criar meu projeto", "#22c55e"),
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
