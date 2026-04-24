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

const PROMPT_CATEGORY_COUNTS: Array<{
  category: LibraryComponentItem["category"];
  label: string;
  count: number;
  templates: LibraryComponentItem["template"][];
}> = [
  { category: "heroes", label: "Hero", count: 39, templates: ["hero-clean", "hero-split", "cta-center"] },
  { category: "backgrounds", label: "Background", count: 18, templates: ["features-3", "features-4", "hero-split"] },
  { category: "borders", label: "Border", count: 24, templates: ["features-3", "features-4"] },
  { category: "carousels", label: "Carousel", count: 18, templates: ["features-4", "hero-split"] },
  { category: "images", label: "Image", count: 23, templates: ["hero-split", "features-3"] },
  { category: "navigation", label: "Navigation", count: 13, templates: ["footer-simple", "hero-clean"] },
  { category: "texts", label: "Text", count: 16, templates: ["hero-clean", "faq-list"] },
  { category: "scroll", label: "Scroll", count: 9, templates: ["hero-split", "cta-center", "features-3"] },
];

const GENERATED_PROMPT_COMPONENTS: LibraryComponentItem[] = PROMPT_CATEGORY_COUNTS.flatMap((entry) =>
  Array.from({ length: entry.count }, (_, index) => {
    const template = entry.templates[index % entry.templates.length]!;
    return {
      id: `prompt-${entry.category}-${String(index + 1).padStart(2, "0")}`,
      title: `${entry.label} ${String(index + 1).padStart(2, "0")}`,
      category: entry.category,
      description: `Componente convertido da biblioteca (${entry.category}).`,
      template,
    };
  }),
);

const FULL_LIBRARY_COMPONENT_REGISTRY: LibraryComponentItem[] = [...LIBRARY_COMPONENT_REGISTRY, ...GENERATED_PROMPT_COMPONENTS];

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

function extractVariantFromId(componentId: string): number {
  const match = componentId.match(/-(\d+)$/);
  if (!match) return 1;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? Math.max(1, parsed) : 1;
}

function makeAnimatedBackgroundSet(x: number, y: number, variant: number): CriarCanvasElement[] {
  const palettes = [
    { base: "#0b1020", a: "#7c3aed", b: "#06b6d4", c: "#f43f5e", d: "#22c55e" },
    { base: "#070f1a", a: "#2563eb", b: "#14b8a6", c: "#e879f9", d: "#f59e0b" },
    { base: "#09111f", a: "#a855f7", b: "#22d3ee", c: "#fb7185", d: "#84cc16" },
    { base: "#0a0f1f", a: "#6366f1", b: "#06b6d4", c: "#f97316", d: "#ec4899" },
  ] as const;
  const pick = palettes[(variant - 1) % palettes.length]!;

  return [
    makeShape(x, y, 1180, 560, pick.base),
    {
      ...makeShape(x + 50, y + 40, 360, 220, pick.a),
      opacity: 0.45,
      radius: 999,
      animation: { preset: "float", duration: 6.4, delay: 0.2 },
    },
    {
      ...makeShape(x + 420, y + 70, 420, 260, pick.b),
      opacity: 0.35,
      radius: 999,
      animation: { preset: "pulse", duration: 4.8, delay: 0.4 },
    },
    {
      ...makeShape(x + 820, y + 120, 260, 180, pick.c),
      opacity: 0.4,
      radius: 999,
      animation: { preset: "float", duration: 5.2, delay: 0.1 },
    },
    {
      ...makeShape(x + 220, y + 330, 720, 170, pick.d),
      opacity: 0.3,
      radius: 999,
      animation: { preset: "pulse", duration: 5.6, delay: 0.6 },
    },
    { ...makeText(x + 64, y + 70, `Background ${String(variant).padStart(2, "0")}`, 46, "#f8fafc"), w: 700 },
    { ...makeText(x + 64, y + 130, "Componente animado e colorido da biblioteca", 18, "#cbd5e1"), w: 640 },
  ];
}

function makeAnimatedScrollSet(x: number, y: number, variant: number): CriarCanvasElement[] {
  const accents = ["#22d3ee", "#a78bfa", "#f97316", "#34d399"] as const;
  const accent = accents[(variant - 1) % accents.length]!;
  return [
    makeShape(x, y, 1080, 620, "#0b1020"),
    { ...makeText(x + 54, y + 56, `Scroll ${String(variant).padStart(2, "0")}`, 40, "#f8fafc"), w: 520 },
    { ...makeText(x + 54, y + 114, "Seção com ritmo visual para narrativa no scroll", 18, "#cbd5e1"), w: 620 },
    {
      ...makeShape(x + 56, y + 180, 960, 70, accent),
      opacity: 0.35,
      radius: 16,
      animation: { preset: "slideUp", duration: 1.2, delay: 0.05 },
    },
    {
      ...makeShape(x + 56, y + 280, 880, 70, accent),
      opacity: 0.28,
      radius: 16,
      animation: { preset: "slideUp", duration: 1.2, delay: 0.2 },
    },
    {
      ...makeShape(x + 56, y + 380, 760, 70, accent),
      opacity: 0.2,
      radius: 16,
      animation: { preset: "slideUp", duration: 1.2, delay: 0.35 },
    },
    {
      ...makeShape(x + 840, y + 470, 180, 80, "#111827"),
      radius: 999,
      animation: { preset: "pulse", duration: 3.6, delay: 0.1 },
    },
    { ...makeButton(x + 868, y + 486, "Explorar", accent), w: 130, h: 48 },
  ];
}

function makeAnimatedBorderSet(x: number, y: number, variant: number): CriarCanvasElement[] {
  const accents = ["#38bdf8", "#a78bfa", "#f97316", "#22c55e"] as const;
  const accent = accents[(variant - 1) % accents.length]!;
  return [
    makeShape(x, y, 1100, 560, "#0b1220"),
    { ...makeShape(x + 26, y + 26, 1048, 508, "#111827"), radius: 18 },
    {
      ...makeShape(x + 18, y + 18, 1064, 524, accent),
      opacity: 0.18,
      radius: 22,
      animation: { preset: "pulse", duration: 4.2, delay: 0.1 },
    },
    { ...makeText(x + 52, y + 58, `Borders ${String(variant).padStart(2, "0")}`, 38, "#f8fafc"), w: 540 },
    { ...makeText(x + 52, y + 116, "Layout com destaque de borda e camadas.", 18, "#cbd5e1"), w: 520 },
    makeShape(x + 52, y + 186, 480, 130, "#1f2937"),
    makeShape(x + 560, y + 186, 480, 130, "#1f2937"),
    makeShape(x + 52, y + 334, 988, 160, "#1f2937"),
  ];
}

function makeAnimatedCarouselSet(x: number, y: number, variant: number): CriarCanvasElement[] {
  const accent = ["#22d3ee", "#f59e0b", "#34d399", "#a78bfa"][(variant - 1) % 4]!;
  return [
    makeShape(x, y, 1180, 420, "#0b1020"),
    { ...makeText(x + 44, y + 44, `Carrossel ${String(variant).padStart(2, "0")}`, 34, "#f8fafc"), w: 440 },
    {
      ...makeShape(x + 42, y + 110, 260, 230, "#111827"),
      animation: { preset: "float", duration: 4.8, delay: 0 },
    },
    {
      ...makeShape(x + 320, y + 110, 260, 230, "#111827"),
      animation: { preset: "float", duration: 4.8, delay: 0.15 },
    },
    {
      ...makeShape(x + 598, y + 110, 260, 230, "#111827"),
      animation: { preset: "float", duration: 4.8, delay: 0.3 },
    },
    {
      ...makeShape(x + 876, y + 110, 260, 230, "#111827"),
      animation: { preset: "float", duration: 4.8, delay: 0.45 },
    },
    { ...makeShape(x + 44, y + 360, 1090, 8, accent), radius: 999, opacity: 0.6 },
  ];
}

function makeAnimatedImageSet(x: number, y: number, variant: number): CriarCanvasElement[] {
  const accent = ["#06b6d4", "#f43f5e", "#22c55e", "#a78bfa"][(variant - 1) % 4]!;
  return [
    makeShape(x, y, 1120, 520, "#0b1020"),
    makeImage(x + 44, y + 64, 620, 390),
    {
      ...makeShape(x + 700, y + 64, 380, 390, "#111827"),
      animation: { preset: "pulse", duration: 3.8, delay: 0.2 },
    },
    { ...makeShape(x + 718, y + 86, 344, 120, accent), opacity: 0.35, radius: 16 },
    { ...makeText(x + 730, y + 102, `Imagem ${String(variant).padStart(2, "0")}`, 30, "#f8fafc"), w: 300 },
    { ...makeText(x + 730, y + 220, "Bloco visual para galeria e destaque.", 17, "#cbd5e1"), w: 300 },
    makeButton(x + 730, y + 390, "Ver projeto", accent),
  ];
}

function makeAnimatedNavigationSet(x: number, y: number, variant: number): CriarCanvasElement[] {
  const accent = ["#22d3ee", "#f59e0b", "#34d399", "#a78bfa"][(variant - 1) % 4]!;
  return [
    makeShape(x, y, 1200, 140, "#0b1020"),
    { ...makeText(x + 26, y + 44, "DevServer", 30, "#f8fafc"), w: 220 },
    { ...makeText(x + 330, y + 52, "Inicio", 16, "#cbd5e1"), w: 80, h: 30 },
    { ...makeText(x + 430, y + 52, "Biblioteca", 16, "#cbd5e1"), w: 120, h: 30 },
    { ...makeText(x + 570, y + 52, "Criar", 16, "#cbd5e1"), w: 70, h: 30 },
    { ...makeText(x + 650, y + 52, "Projetos", 16, "#cbd5e1"), w: 95, h: 30 },
    { ...makeButton(x + 980, y + 42, "Entrar", accent), w: 170, h: 48 },
    { ...makeShape(x + 320, y + 88, 450, 4, accent), radius: 999, opacity: 0.65 },
  ];
}

function makeAnimatedTextSet(x: number, y: number, variant: number): CriarCanvasElement[] {
  const accent = ["#38bdf8", "#a78bfa", "#f43f5e", "#22c55e"][(variant - 1) % 4]!;
  return [
    makeShape(x, y, 1080, 420, "#0b1020"),
    { ...makeText(x + 48, y + 70, `Texto ${String(variant).padStart(2, "0")}`, 52, "#f8fafc"), w: 560 },
    { ...makeText(x + 48, y + 146, "Headline e copy com hierarquia visual.", 22, "#cbd5e1"), w: 620 },
    {
      ...makeShape(x + 48, y + 212, 760, 8, accent),
      radius: 999,
      opacity: 0.75,
      animation: { preset: "pulse", duration: 3.2, delay: 0.05 },
    },
    { ...makeText(x + 48, y + 254, "Texto pronto para editar fonte, cor e tamanho.", 18, "#94a3b8"), w: 640 },
  ];
}

function makeAnimatedTechnicalPanelSet(x: number, y: number, variant: number, label: string): CriarCanvasElement[] {
  const accent = ["#22d3ee", "#34d399", "#f59e0b", "#a78bfa"][(variant - 1) % 4]!;
  return [
    makeShape(x, y, 1080, 520, "#0b1020"),
    { ...makeText(x + 44, y + 50, label, 34, "#f8fafc"), w: 680 },
    { ...makeText(x + 44, y + 102, "Painel convertido para edição visual no CRIAR.", 18, "#cbd5e1"), w: 680 },
    { ...makeShape(x + 44, y + 156, 992, 82, "#111827"), radius: 14 },
    { ...makeShape(x + 44, y + 254, 992, 82, "#111827"), radius: 14 },
    { ...makeShape(x + 44, y + 352, 992, 82, "#111827"), radius: 14 },
    { ...makeShape(x + 44, y + 454, 400, 8, accent), radius: 999, opacity: 0.7 },
  ];
}

export function listLibraryComponents(): LibraryComponentItem[] {
  return FULL_LIBRARY_COMPONENT_REGISTRY;
}

export function createLibraryComponentElements(componentId: string, originX: number, originY: number): CriarCanvasElement[] {
  const x = Math.round(originX);
  const y = Math.round(originY);
  const item = FULL_LIBRARY_COMPONENT_REGISTRY.find((entry) => entry.id === componentId);
  const template = item?.template ?? "hero-clean";
  const variant = extractVariantFromId(componentId);

  if (item?.category === "backgrounds") {
    return makeAnimatedBackgroundSet(x, y, variant);
  }
  if (item?.category === "borders") {
    return makeAnimatedBorderSet(x, y, variant);
  }
  if (item?.category === "carousels") {
    return makeAnimatedCarouselSet(x, y, variant);
  }
  if (item?.category === "images") {
    return makeAnimatedImageSet(x, y, variant);
  }
  if (item?.category === "navigation") {
    return makeAnimatedNavigationSet(x, y, variant);
  }
  if (item?.category === "texts") {
    return makeAnimatedTextSet(x, y, variant);
  }
  if (item?.category === "scroll") {
    return makeAnimatedScrollSet(x, y, variant);
  }
  if (item?.category === "seo") {
    return makeAnimatedTechnicalPanelSet(x, y, variant, "SEO Guia Pratico");
  }
  if (item?.category === "security") {
    return makeAnimatedTechnicalPanelSet(x, y, variant, "Security Check Panel");
  }
  if (item?.category === "hosting") {
    return makeAnimatedTechnicalPanelSet(x, y, variant, "Hosting Panel");
  }
  if (item?.category === "speed") {
    return makeAnimatedTechnicalPanelSet(x, y, variant, "Speed Panel");
  }
  if (item?.category === "databases") {
    return makeAnimatedTechnicalPanelSet(x, y, variant, "Database Panel");
  }
  if (item?.category === "frontend_deploy") {
    return makeAnimatedTechnicalPanelSet(x, y, variant, "Frontend Deploy Panel");
  }

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
