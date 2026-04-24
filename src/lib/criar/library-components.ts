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
  { id: "hero-myna-ui", title: "Hero Myna UI - IA & mono", category: "heroes", description: "Hero with navigation, mobile sheet menu, animated title sequence and feature grid.", template: "hero-clean" },
  { id: "hero-digital-loom", title: "Hero Digital Loom", category: "heroes", description: "Threaded canvas-inspired background with futuristic product framing.", template: "hero-split" },
  { id: "hero-robot-spline", title: "Hero with Robot Spline", category: "heroes", description: "3D-focused hero layout with content overlay and scene spotlight area.", template: "hero-split" },
  { id: "hero-cta-dithering", title: "Hero CTA Dithering", category: "heroes", description: "Large CTA hero card style with shader-like visual treatment.", template: "cta-center" },
  { id: "hero-section-8", title: "Hero Section 8", category: "heroes", description: "Form-oriented hero pattern with strong heading and clear CTA.", template: "hero-clean" },
  { id: "animated-hero-section-1", title: "Animated Hero Section 1", category: "heroes", description: "Fullscreen marketing hero with layered content and CTA pair.", template: "hero-split" },
  { id: "background-orbital", title: "Orbital Background", category: "backgrounds", description: "Orbital and glow-style background composition block.", template: "features-4" },
  { id: "background-grid-gradient", title: "Grid Gradient Background", category: "backgrounds", description: "Grid/gradient visual backdrop for section highlights.", template: "features-3" },
  { id: "border-divided-sections", title: "Border Divided Sections", category: "borders", description: "Border-forward section structure with split content areas.", template: "features-3" },
  { id: "carousel-logos", title: "Logo Carousel Strip", category: "carousels", description: "Client/logo carousel section pattern for social proof.", template: "features-4" },
  { id: "image-gallery-focus", title: "Image Gallery Focus", category: "images", description: "Visual-first gallery section with featured media slot.", template: "hero-split" },
  { id: "navigation-tubelight", title: "Navigation Tubelight", category: "navigation", description: "Top navigation block with emphasized active rail.", template: "footer-simple" },
  { id: "text-vaporize", title: "Vaporize Text", category: "texts", description: "Typography-driven section for hero messaging and storytelling.", template: "hero-clean" },
  { id: "scroll-expansion-hero", title: "Scroll Expansion Hero", category: "scroll", description: "Scroll narrative section with staged reveal rhythm.", template: "hero-split" },
  { id: "seo-guia-pratico", title: "SEO Practical Guide", category: "seo", description: "Structured informational panel for SEO guidance content.", template: "faq-list" },
  { id: "security-check-panel", title: "Security Check Panel", category: "security", description: "Operational security checklist section for launch readiness.", template: "faq-list" },
  { id: "hosting-panel", title: "Hosting Panel", category: "hosting", description: "Hosting comparison and infrastructure recommendation section.", template: "pricing-3" },
  { id: "speed-panel", title: "Speed Panel", category: "speed", description: "Performance-focused section for optimization highlights.", template: "features-3" },
  { id: "database-panel", title: "Database Panel", category: "databases", description: "Database architecture and selection overview block.", template: "pricing-3" },
  { id: "frontend-deploy-panel", title: "Frontend Deploy Panel", category: "frontend_deploy", description: "Frontend deployment workflow section with action focus.", template: "cta-center" },
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
      description: `Library-derived component from ${entry.category} prompts.`,
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

function makeMynaHeroSet(x: number, y: number): CriarCanvasElement[] {
  return [
    makeShape(x, y, 1220, 760, "#030712"),
    // Header
    makeShape(x + 26, y + 24, 1168, 72, "#0b1220"),
    { ...makeText(x + 48, y + 48, "DevServer", 24, "#f8fafc"), w: 180, h: 38 },
    { ...makeText(x + 320, y + 52, "Home", 15, "#cbd5e1"), w: 70, h: 28 },
    { ...makeText(x + 408, y + 52, "Recursos", 15, "#cbd5e1"), w: 92, h: 28 },
    { ...makeText(x + 516, y + 52, "Precos", 15, "#cbd5e1"), w: 78, h: 28 },
    { ...makeText(x + 608, y + 52, "Docs", 15, "#cbd5e1"), w: 64, h: 28 },
    { ...makeButton(x + 1038, y + 36, "Comecar", "#2563eb"), w: 138, h: 44 },
    // Hero title with monospace style and staggered animation feel
    {
      ...makeText(x + 86, y + 160, "A REVOLUCAO DE IA PARA O", 56, "#f8fafc"),
      fontFamily: "\"Courier New\", monospace",
      w: 920,
      animation: { preset: "slideUp", duration: 1, delay: 0.05 },
    },
    {
      ...makeText(x + 86, y + 232, "SEU NEGOCIO", 56, "#f8fafc"),
      fontFamily: "\"Courier New\", monospace",
      w: 640,
      animation: { preset: "slideUp", duration: 1, delay: 0.2 },
    },
    {
      ...makeText(x + 88, y + 308, "Transforme dados em receita com automacoes e fluxo inteligente.", 19, "#94a3b8"),
      w: 860,
      animation: { preset: "slideUp", duration: 1, delay: 0.35 },
    },
    // 3 labels below subtitle
    { ...makeShape(x + 88, y + 354, 170, 38, "#111827"), radius: 999 },
    { ...makeText(x + 108, y + 364, "Sparkles", 14, "#cbd5e1"), w: 130, h: 24 },
    { ...makeShape(x + 272, y + 354, 160, 38, "#111827"), radius: 999 },
    { ...makeText(x + 292, y + 364, "Plug", 14, "#cbd5e1"), w: 120, h: 24 },
    { ...makeShape(x + 444, y + 354, 170, 38, "#111827"), radius: 999 },
    { ...makeText(x + 464, y + 364, "Activity", 14, "#cbd5e1"), w: 140, h: 24 },
    // Bottom cards grid
    makeShape(x + 88, y + 438, 330, 220, "#0b1220"),
    makeShape(x + 446, y + 438, 330, 220, "#0b1220"),
    makeShape(x + 804, y + 438, 330, 220, "#0b1220"),
    { ...makeShape(x + 116, y + 464, 42, 42, "#2563eb"), radius: 999, opacity: 0.25 },
    { ...makeText(x + 172, y + 472, "Analise inteligente", 18, "#f8fafc"), w: 210, h: 30 },
    { ...makeText(x + 116, y + 520, "Metrica em tempo real para decisoes.", 15, "#94a3b8"), w: 270, h: 48 },
    { ...makeShape(x + 474, y + 464, 42, 42, "#2563eb"), radius: 999, opacity: 0.25 },
    { ...makeText(x + 530, y + 472, "Automacao total", 18, "#f8fafc"), w: 210, h: 30 },
    { ...makeText(x + 474, y + 520, "Fluxos prontos para marketing e vendas.", 15, "#94a3b8"), w: 280, h: 48 },
    { ...makeShape(x + 832, y + 464, 42, 42, "#2563eb"), radius: 999, opacity: 0.25 },
    { ...makeText(x + 888, y + 472, "Ativacao rapida", 18, "#f8fafc"), w: 210, h: 30 },
    { ...makeText(x + 832, y + 520, "Suba e publique em minutos.", 15, "#94a3b8"), w: 250, h: 48 },
  ];
}

function makeDigitalLoomHeroSet(x: number, y: number): CriarCanvasElement[] {
  return [
    makeShape(x, y, 1220, 760, "#030712"),
    { ...makeShape(x + 18, y + 18, 1184, 724, "#07111f"), radius: 22 },
    // thread-like background strips
    { ...makeShape(x + 60, y + 90, 1080, 3, "#14532d"), opacity: 0.35, animation: { preset: "pulse", duration: 4.2, delay: 0.1 } },
    { ...makeShape(x + 60, y + 132, 1080, 3, "#16a34a"), opacity: 0.28, animation: { preset: "pulse", duration: 5, delay: 0.2 } },
    { ...makeShape(x + 60, y + 176, 1080, 3, "#22c55e"), opacity: 0.22, animation: { preset: "pulse", duration: 5.6, delay: 0.3 } },
    { ...makeShape(x + 60, y + 220, 1080, 3, "#4ade80"), opacity: 0.16, animation: { preset: "pulse", duration: 6, delay: 0.4 } },
    { ...makeShape(x + 84, y + 252, 260, 44, "#0b1220"), radius: 999 },
    { ...makeText(x + 108, y + 264, "Background: Digital Loom", 15, "#bbf7d0"), w: 230, h: 24 },
    { ...makeText(x + 84, y + 328, "Construa interfaces com textura e movimento", 54, "#f8fafc"), w: 980 },
    { ...makeText(x + 86, y + 404, "Hero com visual futurista para produtos DevServer.", 20, "#94a3b8"), w: 760 },
    makeButton(x + 86, y + 462, "Comecar", "#22c55e"),
    { ...makeShape(x + 86, y + 532, 1048, 150, "#0b1220"), radius: 18 },
    { ...makeText(x + 116, y + 568, "Camada pronta para adicionar blocos e cards.", 19, "#cbd5e1"), w: 520 },
  ];
}

function makeRobotSplineHeroSet(x: number, y: number): CriarCanvasElement[] {
  return [
    makeShape(x, y, 1220, 760, "#020617"),
    { ...makeShape(x + 26, y + 26, 1168, 708, "#0b1220"), radius: 22 },
    { ...makeText(x + 76, y + 90, "Hero Robot Spline", 20, "#93c5fd"), w: 260 },
    { ...makeText(x + 76, y + 148, "Experiencia 3D para destaque de produto", 50, "#f8fafc"), w: 760 },
    { ...makeText(x + 76, y + 220, "Layout preparado para cena Spline e CTA principal.", 19, "#94a3b8"), w: 650 },
    makeButton(x + 76, y + 276, "Testar Demo", "#2563eb"),
    { ...makeShape(x + 640, y + 122, 500, 420, "#111827"), radius: 22 },
    { ...makeImage(x + 662, y + 144, 456, 376), radius: 18, animation: { preset: "float", duration: 5.2, delay: 0.1 } },
    { ...makeShape(x + 76, y + 360, 500, 170, "#111827"), radius: 16 },
    { ...makeText(x + 102, y + 392, "Dica: troque a imagem por preview da cena Spline.", 17, "#cbd5e1"), w: 430 },
    { ...makeShape(x + 76, y + 548, 1064, 144, "#0f172a"), radius: 16 },
    { ...makeText(x + 102, y + 586, "Area de specs, bullets e social proof.", 18, "#94a3b8"), w: 480 },
  ];
}

function makeDitheringCtaHeroSet(x: number, y: number): CriarCanvasElement[] {
  return [
    makeShape(x, y, 1220, 760, "#020617"),
    { ...makeShape(x + 96, y + 108, 1028, 540, "#0f172a"), radius: 30 },
    { ...makeShape(x + 118, y + 132, 984, 496, "#1e293b"), radius: 26, opacity: 0.32, animation: { preset: "pulse", duration: 4.5, delay: 0.2 } },
    { ...makeShape(x + 146, y + 172, 210, 38, "#111827"), radius: 999 },
    { ...makeText(x + 170, y + 182, "CTA Dithering", 14, "#cbd5e1"), w: 170, h: 22 },
    { ...makeText(x + 146, y + 250, "Converta visitantes em clientes", 54, "#f8fafc"), w: 860 },
    { ...makeText(x + 146, y + 324, "Secao com foco em headline, prova e botao principal.", 20, "#94a3b8"), w: 770 },
    { ...makeButton(x + 146, y + 390, "COMEÇAR", "#2563eb"), w: 190, h: 52 },
    { ...makeShape(x + 372, y + 398, 180, 40, "#111827"), radius: 999 },
    { ...makeText(x + 402, y + 408, "Ver demo", 16, "#cbd5e1"), w: 120, h: 24 },
    { ...makeShape(x + 146, y + 480, 930, 98, "#111827"), radius: 18 },
    { ...makeText(x + 178, y + 514, "Espaco ideal para bullets, logos e prova social.", 18, "#cbd5e1"), w: 560 },
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

  if (componentId === "hero-myna-ui") {
    return makeMynaHeroSet(x, y);
  }
  if (componentId === "hero-digital-loom") {
    return makeDigitalLoomHeroSet(x, y);
  }
  if (componentId === "hero-robot-spline") {
    return makeRobotSplineHeroSet(x, y);
  }
  if (componentId === "hero-cta-dithering") {
    return makeDitheringCtaHeroSet(x, y);
  }
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
