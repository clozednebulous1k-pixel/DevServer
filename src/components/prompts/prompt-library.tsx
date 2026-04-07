"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronLeft, Copy, Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LazyPreview } from "@/components/ui/lazy-preview";
import { HeroPreviewRouter, type HeroPreviewId } from "@/components/prompts/hero-preview-router";
import { GatedImagePreview } from "@/components/prompts/image-preview-gated";

function CategoryPreviewSkeleton() {
  return <div className="h-[168px] animate-pulse rounded-lg bg-muted/30 sm:h-[180px]" />;
}

const TextPreviewsLazy = dynamic(
  () => import("@/components/prompts/text-prompt-previews-lazy").then((m) => m.TextPreviewLazyRouter),
  { ssr: false, loading: CategoryPreviewSkeleton },
);

const NavigationPreviewsLazy = dynamic(
  () => import("@/components/prompts/navigation-prompt-previews-lazy").then((m) => m.NavigationPreviewLazyRouter),
  { ssr: false, loading: CategoryPreviewSkeleton },
);

const LibraryMiscLazy = dynamic(
  () => import("@/components/prompts/library-misc-previews").then((m) => ({ default: m.LibraryMiscPreviewRouter })),
  { ssr: false, loading: CategoryPreviewSkeleton },
);

type CategoryId =
  | "heroes"
  | "backgrounds"
  | "borders"
  | "carousels"
  | "images"
  | "navigation"
  | "texts"
  | "announcements";

const categories: readonly {
  id: CategoryId;
  label: string;
  count: number;
  soon?: boolean;
}[] = [
  { id: "heroes", label: "Heroes", count: 29 },
  { id: "backgrounds", label: "Backgrounds", count: 8 },
  { id: "borders", label: "Borders", count: 14 },
  { id: "carousels", label: "Carrossel para clientes", count: 8 },
  { id: "images", label: "Imagens", count: 13 },
  { id: "navigation", label: "Navigation Menus", count: 3 },
  { id: "texts", label: "Textos", count: 16 },
  { id: "announcements", label: "Announcements", count: 0, soon: true },
];

const heroPrompts = [
  {
    id: "myna-hero",
    title: "Hero Myna UI — IA & mono",
    description: "Hero completo com navegação, menu mobile (Sheet), título animado por palavra e grid de features.",
    prompt: `Crie um hero para landing de produto B2B no estilo "Myna UI":
- Tipografia monoespaçada no título principal; palavras aparecem em sequência com animação suave (Framer Motion).
- Header fixo com logo + links (desktop) e menu hambúrguer com Sheet no mobile.
- CTA primário "COMEÇAR" com ícone de seta.
- Faixa de 3 labels com ícones (Sparkles, Plug, Activity) abaixo do subtítulo.
- Seção inferior com 3 cards em grid (BarChart, Zap, Activity) com borda e ícone em círculo com fundo primary/10.
Stack: Next.js, Tailwind, shadcn Button + Sheet, framer-motion, lucide-react.
Use tokens do tema (primary, muted-foreground) em vez de cores hex fixas.`,
    preview: "myna" as const,
  },
  {
    id: "digital-loom",
    title: "Hero Digital Loom",
    description: "Fundo em canvas com fios animados e texto central com motion — vibe futurista DevServer.",
    prompt: `Implemente um hero full-viewport com fundo animado em canvas:
- Componente DigitalLoomBackground: threads horizontais com onda senoidal, composite "lighter", fade trail preto semi-transparente.
- Cor dos fios próxima ao verde primary da marca (rgba com baixa opacidade).
- Conteúdo central: badge pill com borda branca/10, título grande branco, parágrafo explicativo, botão pill branco.
- Animações de entrada com framer-motion (stagger por índice).
- children renderizados acima do canvas com z-index.
Next.js client component, TypeScript, Tailwind para tipografia.`,
    preview: "loom" as const,
  },
  {
    id: "robot-spline",
    title: "Hero com robô 3D (Spline)",
    description: "Cena 3D interativa em fullscreen com texto sobreposto — ótimo para produtos tech.",
    prompt: `Monte um hero fullscreen com @splinetool/react-spline:
- Lazy import do Spline dentro de Suspense com fallback de spinner.
- Prop scene com URL .splinecode da prod.spline.design.
- Camada absoluta z-0 para o Spline; conteúdo z-10 com pointer-events-none no wrapper do texto.
- Título responsivo (text-2xl até xl:text-5xl), texto branco com drop-shadow.
- use dynamic(..., { ssr: false }) no Next.js para evitar erro de hidratação.
Exporte constante DEFAULT_ROBOT_SCENE para reutilizar a URL da cena.`,
    preview: "robot" as const,
  },
  {
    id: "hero-dithering-card",
    title: "Hero CTA com dithering (Paper Design)",
    description:
      "Card grande com shader Dithering em lazy/Suspense, hover acelera animação; badge, headline serif e botão pill.",
    prompt: `Implemente um hero tipo CTA em card arredondado:
- Lazy import de Dithering de @paper-design/shaders-react dentro de Suspense (fallback bg-muted/20).
- Props do shader: colorBack transparente, colorFront alinhado ao primary da marca, shape "warp", type "4x4", speed maior no hover (ex.: 0.2 → 0.6), minPixelRatio 1, className size-full.
- Camada do shader: absolute inset-0, opacity ~40%, mix-blend-multiply (dark: mix-blend-screen).
- Conteúdo: badge pill com ping dot, título serif em duas linhas, parágrafo muted-foreground, botão primary com ícone ArrowRight (lucide-react).
- Exporte CTASection; opcional prop preview para altura menor em grids de demos.
Next.js client component, Tailwind, tokens border-border bg-card text-foreground.`,
    preview: "dither" as const,
  },
  {
    id: "hero-section-8",
    title: "Hero formulário / ilustração central",
    description:
      "Ilustração no topo, título e descrição com stagger (Framer Motion), CTA como link estilizado com buttonVariants.",
    prompt: `Crie FormBuilderHero com props: illustrationSrc, illustrationAlt, title (ReactNode), description, buttonText, buttonHref.
- Animação: motion container com staggerChildren 0.2; itens com fade + y.
- Ilustração: next/image para URLs remotas (remotePatterns), w-48 md:w-64.
- CTA: elemento <a> com cn(buttonVariants({ size: "lg" })) — o projeto pode usar Button Base UI sem asChild; evite Slot.
- lucide-react ArrowRight ao lado do texto.
Stack: framer-motion, Tailwind, TypeScript.`,
    preview: "form8" as const,
  },
  {
    id: "animated-hero-section-1",
    title: "Hero fullscreen com imagem + header animado",
    description:
      "Foto de fundo com overlay escuro, header com logo e nav, título/descrição e dois CTAs estilo vidro (backdrop-blur).",
    prompt: `Componente AnimatedHero com props: backgroundImageUrl, logo (ReactNode), navLinks[], topRightAction opcional, title, description, ctaButton { text, onClick }, secondaryCta opcional, className.
- Fundo: next/image fill object-cover + overlay bg-black/60.
- motion.header: entrada de y -100 → 0; nav links visíveis só md+.
- Conteúdo: stagger + itemVariants (y 20 → 0).
- Botões: Button do shadcn/Base UI com classes glass (bg-white/10, border-white/20, backdrop-blur, hover:bg-white/20).
Use imagem Unsplash widescreen para o fundo.`,
    preview: "animated" as const,
  },
  {
    id: "galaxy-interactive-hero",
    title: "Hero Galaxy + Spline",
    description:
      "Cena 3D fullscreen com gradientes laterais/inferiores; na biblioteca usamos prévia compacta (mesmo padrão do robô).",
    prompt: `Hero landing escuro com @splinetool/react-spline:
- Lazy Spline + Suspense; scene URL .splinecode (ex.: prod.spline.design/.../scene.splinecode).
- Wrapper absolute inset-0 com min-height 100vh; gradientes CSS por cima (laterais escuras + vinheta inferior).
- Conteúdo à esquerda: título multi-linha, parágrafo, botões (trial + vídeo com ícone play).
- Navbar fixa com blur, dropdowns desktop e menu mobile expansível.
- Seção screenshot abaixo com parallax leve no scroll (translateY no ref).
Next.js: dynamic(..., { ssr: false }) ou client-only para o Spline. Constante exportada GALAXY_HERO_SCENE para reuso.
Para cards de demo, use componente GalaxyHeroSplinePreview (Spline + gradientes + legenda).`,
    preview: "galaxy" as const,
  },
  {
    id: "particle-hero",
    title: "Hero partículas + modo ouro",
    description:
      "Canvas fullscreen com partículas ascendentes, spotlight cônica animada e toggle “gold mode” no ponto central.",
    prompt: `Hero escuro (#05060f) com partículas em canvas 2D:
- requestAnimationFrame; densidade ~ (width*height)/6000; reset ao resize.
- Interface Particle com update (movimento vertical, fade após delay aleatório) e draw.
- Camadas: header com mid-spot clicável (toggle gold-mode), três feixes spotlight com blur e animação longa, linhas horizontais de acento.
- Título duplo com gradiente em texto, animação --p (@property) e keyframes pulse.
Use styled-jsx global para @property e keyframes se necessário.`,
    preview: "particle" as const,
  },
  {
    id: "hero-section-2",
    title: "Hero Tailark — mockup + logos",
    description:
      "AnimatedGroup (blur→foco), radial no fundo, mockup claro/escuro, grid de logos com hover blur e link.",
    prompt: `Hero em duas seções:
- HeroHeader fixo: scroll via useScroll (motion/react) para backdrop blur após ~5% scroll; menu mobile data-state active; links Login/Sign Up com buttonVariants + Link (sem asChild no Base UI).
- Corpo: AnimatedGroup com variants container (stagger + delayChildren) e item (spring, blur 12px→0).
- Mockup: imagens tailark mail2 / mail2-light com gradiente inferior para background.
- Logos clientes em grid 4 colunas; hover no grupo reduz opacidade e aplica blur leve no grid.
Dependências: framer-motion (AnimatedGroup), motion/react (useScroll), lucide-react, next/link.`,
    preview: "hero2" as const,
  },
  {
    id: "shader-animation",
    title: "Fundo shader (Three.js)",
    description: "Plano fullscreen com fragment shader animado (linhas orgânicas) e uniform time/resolution.",
    prompt: `Componente client-only ShaderAnimation:
- THREE.OrthographicCamera, PlaneGeometry(2,2), ShaderMaterial com vertex trivial e fragment com loop aninhado (cores RGB).
- Uniforms: time (incrementa a cada frame), resolution (pixel dims do canvas).
- Resize: container clientWidth/Height; cleanup dispose geometry/material/renderer.
Next.js: dynamic(..., { ssr: false }) em páginas. Dependência: three.`,
    preview: "shader" as const,
  },
  {
    id: "hero-with-video",
    title: "Navbar + hero email + vídeo",
    description:
      "Dropdowns desktop/mobile, toggle de tema (next-themes), captura de email e vídeo sobre imagem (play/pause).",
    prompt: `NavbarHero com props opcionais: brandName, heroTitle, heroDescription, backgroundImage (Unsplash), videoUrl (mp4 público), emailPlaceholder.
- Estado: email, menus mobile/dropdowns, isVideoPlaying / isVideoPaused, mounted para hidratação do tema.
- useTheme de next-themes para Sun/Moon.
- Área media aspect-video: img de capa + video sobreposto; botão play/pause flutuante.
- Import correto: "next-themes", não caminhos relativos inventados.`,
    preview: "video" as const,
  },
  {
    id: "hero-section-5",
    title: "Hero vídeo DNA + carrossel infinito",
    description:
      "Vídeo em painel absoluto invertido, CTAs pill, faixa InfiniteSlider com speed/speedOnHover e ProgressiveBlur nas bordas.",
    prompt: `HeroSection5:
- Fundo: video mp4 (imagekit tailark dna) em container absolute inset-1 aspect ratio responsivo.
- InfiniteSlider com gap fixo, props speed e speedOnHover mapeadas para duração (implementação em components/ui/infinite-slider).
- ProgressiveBlur nas laterais do slider; gradientes from-background nas pontas.
- Header arredondado com motion.div reduzindo padding vertical quando scrolled.
CTAs: Link + buttonVariants (sem Slot).`,
    preview: "hero5" as const,
  },
  {
    id: "interactive-hero-ballpit",
    title: "Hero WebGL — esferas metálicas",
    description:
      "InstancedMesh + RoomEnvironment; esferas seguem o ponteiro com suavização; navbar, formulário email e menu mobile.",
    prompt: `InteractiveHero (versão simplificada do “ballpit”):
- Canvas absolute fullscreen; PerspectiveCamera; WebGLRenderer alpha; PMREM + RoomEnvironment.
- InstancedMesh esferas físicas com MeshPhysicalMaterial; prop sphereCount para performance.
- pointermove normalizado → vetor alvo; cada instância interpola entre base aleatória e alvo.
- UI: brandName, heroTitle, heroDescription, email + submit, theme toggle, overlay menu mobile.
O prompt original com classes X/W/Z completas pode ser expandido para física completa; esta base cobre visual e interação.`,
    preview: "ballpit" as const,
  },
  {
    id: "hero-stellar-ai",
    title: "Stellar.ai — tabs + vídeo + overlays",
    description: "Landing clara Inter, nav, hero com tabs que alternam a cada 4s, vídeo CloudFront e badges.",
    prompt: `Ver implementação em marketing-heroes-part1 (StellarAiHeroInner): animate-fade-in-up, Lucide, vídeo MP4, 4 overlays condicionais.`,
    preview: "stellar" as const,
  },
  {
    id: "hero-power-ai",
    title: "Power AI — vídeo escuro + marquee",
    description: "Fullscreen escuro, vídeo com fade loop (VideoFadeMp4), General Sans, blob blur, marquee logos.",
    prompt: `CSS vars HSL, liquid-glass no marquee, sem overlay no vídeo além do fade JS.`,
    preview: "power-ai" as const,
  },
  {
    id: "hero-aethera",
    title: "Aethera — Instrument Serif + vídeo fade",
    description: "Vídeo posicionado abaixo do nav, gradiente sobre o vídeo, headline editorial.",
    prompt: `VideoFadeMp4 + classes animate-fade-rise em globals.css.`,
    preview: "aethera" as const,
  },
  {
    id: "hero-rubik-era",
    title: "NEW ERA — Rubik + vídeo azul",
    description: "Headline em 3 linhas uppercase, botão com SVG fill, fundo #21346e.",
    prompt: `RubikEraHeroInner — vídeo CloudFront, tipografia bold uppercase, CTA 184×65 com path SVG branco.`,
    preview: "rubik-era" as const,
  },
  {
    id: "hero-web3-eos",
    title: "Web3 EOS — gradient text + waitlist",
    description: "Vídeo com overlay 50%, nav 120px, pills waitlist com brilho.",
    prompt: `Web3EosHeroInner — gradiente 144.5deg em background-clip text, botões waitlist em camadas.`,
    preview: "web3-eos" as const,
  },
  {
    id: "hero-glass-hls",
    title: "Glass + HLS (Cloudflare Stream)",
    description: "hls.js, mix-blend-screen no vídeo, faixa logos tailus, react-use-measure, InfiniteSlider.",
    prompt: `GlassHlsHeroInner — HLS Cloudflare Stream, motion/react, clsx + tailwind-merge; logo cloud com SVG externos.`,
    preview: "glass-hls" as const,
  },
  {
    id: "hero-geist-minimal",
    title: "Geist + Instrument Serif — vídeo invertido",
    description: "scaleY(-1) no vídeo, gradiente branco, email bar + CTA com inner shadow.",
    prompt: `GeistMinimalHeroInner — gradiente Tailwind from/to com stops percentuais, motion stagger.`,
    preview: "geist-minimal" as const,
  },
  {
    id: "hero-ai-builder-hls",
    title: "AI builder — Mux HLS",
    description: "HlsVideo stream Mux, overlays gradiente, motion headline, CTAs.",
    prompt: `AiBuilderHlsHeroInner — HlsVideo + poster Unsplash; gradientes decorativos blur mix-blend-screen.`,
    preview: "ai-builder-hls" as const,
  },
  {
    id: "hero-taskly-glass",
    title: "Taskly — orb webm + Fustat",
    description: "future.co orb.webm, mix-blend-screen, filtros hue/saturation, nav glass sticky.",
    prompt: `TasklyGlassHeroInner — vídeo webm future.co, nav backdrop-blur 50px, CTA rgba(0,132,255,0.8).`,
    preview: "taskly-glass" as const,
  },
  {
    id: "hero-barlow-agency",
    title: "Agency — Barlow + Instrument Serif",
    description: "Vídeo full bleed, badge Fortune glass, cantos 7px, CTAs #f8f8f8.",
    prompt: `BarlowAgencyHeroInner — sem overlay no vídeo; cantos 7×7px nos quatro cantos do bloco central.`,
    preview: "barlow-agency" as const,
  },
  {
    id: "hero-bloom-glass",
    title: "Bloom — liquid glass + vídeo",
    description: "Poppins/Source Serif 4, painéis liquid-glass / liquid-glass-strong, split layout.",
    prompt: `BloomGlassHeroInner — classes .liquid-glass e .liquid-glass-strong em globals.css; lucide ícones.`,
    preview: "bloom-glass" as const,
  },
  {
    id: "hero-targo",
    title: "Targo — logística vermelha",
    description: "Rubik bold, vídeo sem overlay, clip-path nos botões, card consulta glass.",
    prompt: `TargoHeroInner — marca #EE3F2C, clipPath polygon para cantos cortados, backdrop-blur no card.`,
    preview: "targo-red" as const,
  },
  {
    id: "hero-synapse-hls",
    title: "Synapse — HLS atrás do texto",
    description: "Vídeo Mux 80vh bottom-[35vh], navbar glass, motion stagger.",
    prompt: `SynapseHlsHeroInner — stream Mux .m3u8, posicionamento bottom 35vh / h-[80vh].`,
    preview: "synapse-hls" as const,
  },
  {
    id: "hero-ai-unlock-hls",
    title: "AI Unlock — split text + Mux",
    description: "Vídeo deslocado/scaled, blur-in motion, badge Sparkles.",
    prompt: `AiUnlockHlsHeroInner — motion blur filter, palavras com stagger; vídeo margin-left + scale.`,
    preview: "ai-unlock-hls" as const,
  },
  {
    id: "hero-clear-invoice",
    title: "ClearInvoice — barra gradiente + HLS",
    description: "Topo colorido, vídeo Mux memoizado, CTAs gradiente laranja.",
    prompt: `ClearInvoiceHeroInner — React.memo no fundo HLS; barra topo gradiente ccf/e7d04c/31fb78.`,
    preview: "clear-invoice-hls" as const,
  },
  {
    id: "section-webfluin-calculator",
    title: "Calculadora orçamento Webfluin",
    description: "Grid 2 colunas, radios/checkbox custom, slider páginas, preços agency/freelancer/you.",
    prompt: `WebfluinCalculatorInner — calculatePrice / calculateAgencyCost / calculateFreelancerCost conforme especificação; input range 1–30.`,
    preview: "webfluin-calculator" as const,
  },
];

type BackgroundPreviewId =
  | "geometric"
  | "paths"
  | "beams"
  | "smoke"
  | "falling"
  | "particle"
  | "spiral"
  | "radar";

const backgroundPrompts: {
  id: string;
  title: string;
  description: string;
  prompt: string;
  preview: BackgroundPreviewId;
}[] = [
  {
    id: "shape-landing-hero",
    title: "Hero geométrico (formas + gradiente)",
    description:
      "Full viewport escuro com formas elípticas animadas (Framer Motion), badge e título em gradiente — ideal como hero ou seção de impacto.",
    prompt: `Implemente HeroGeometric em components/ui/shape-landing-hero.tsx (client):
- ElegantShape: motion.div com entrada opacity/y/rotate, flutuação vertical infinita, gradiente radial e borda suave.
- Props: badge, title1, title2, description opcional, className.
- Fundo #030303 com gradientes indigo/rose discretos e vinheta inferior.
Stack: framer-motion, lucide-react (Circle no badge), cn de @/lib/utils.`,
    preview: "geometric",
  },
  {
    id: "background-paths",
    title: "SVG paths animados",
    description:
      "Fundo claro/escuro com curvas SVG em loop (pathLength/pathOffset) e CTA com Button do projeto.",
    prompt: `BackgroundPaths em components/ui/background-paths.tsx:
- FloatingPaths gera 36 paths; transição com duration estável por índice (evitar Math.random() no objeto transition).
- Props title, ctaLabel, className; letras animadas com framer-motion spring.
- Usar Button de @/components/ui/button (Base UI), não Radix Slot.`,
    preview: "paths",
  },
  {
    id: "beams-background",
    title: "Feixes de luz (canvas + Motion)",
    description:
      "Canvas 2D com feixes em gradiente HSL, blur e overlay motion; intensidade subtle | medium | strong.",
    prompt: `BeamsBackground em components/ui/beams-background.tsx:
- Pacote motion/react para motion.div; canvas com DPR limitado, coordenadas em espaço lógico (CSS px), clearRect e blur no desenho.
- Props: className, children opcionais (substituem título padrão), intensity.
- Cleanup: cancelAnimationFrame e remove resize listener.`,
    preview: "beams",
  },
  {
    id: "spooky-smoke",
    title: "Fumaça WebGL2 (shader)",
    description:
      "Canvas fullscreen com fragment shader GLSL 300 es; prop smokeColor em hex para matizar o efeito.",
    prompt: `SmokeBackground em components/ui/spooky-smoke-animation.tsx:
- Renderer WebGL2 com uniformes time, resolution, u_color; resize com devicePixelRatio.
- Tratar ausência de WebGL2 com try/catch e cleanup (reset program/shaders).
- "use client"; cn de @/lib/utils para className no canvas.`,
    preview: "smoke",
  },
  {
    id: "falling-pattern",
    title: "Padrão vertical (CSS + Framer Motion)",
    description:
      "Múltiplos radial-gradients em backgroundImage animando backgroundPosition; overlay com blur e pontilhado.",
    prompt: `FallingPattern em components/ui/falling-pattern.tsx:
- Props: color, backgroundColor (CSS vars padrão var(--primary) / var(--background)), duration, blurIntensity, density, className.
- motion.div com variants initial/animate para backgroundPosition.
- Em tema escuro, garantir --background adequado (ex.: .dark no globals).`,
    preview: "falling",
  },
  {
    id: "particle-text-effect",
    title: "Texto em partículas (canvas 2D)",
    description:
      "Palavras rasterizadas em canvas offscreen; partículas voam até os pixels; botão direito dispersa.",
    prompt: `ParticleTextEffect em components/ui/particle-text-effect.tsx:
- Props words?: string[]; canvas fixo 1000x500; loop requestAnimationFrame com trail escuro.
- Cancelar rAF no unmount; atualizar wordsRef quando words mudar.
- Texto de ajuda em PT para interação (clique direito).`,
    preview: "particle",
  },
  {
    id: "spiral-animation",
    title: "Espiral estelar (GSAP timeline)",
    description:
      "Timeline GSAP infinita com trilha espiral, milhares de estrelas projetadas e animação de câmera.",
    prompt: `SpiralAnimation em components/ui/spiral-animation.tsx:
- gsap.timeline({ repeat: -1 }) animando time no controller; resize SSR-safe (estado inicial 0,0 até window).
- Canvas com DPR limitado; destroy timeline no cleanup.
- Uma única geração de estrelas (evitar duplicar createStars).`,
    preview: "spiral",
  },
  {
    id: "radar-effect",
    title: "Radar + ícones (Framer Motion)",
    description:
      "Anéis concêntricos animados, linha de varredura CSS keyframes e IconContainer para grid de serviços.",
    prompt: `radar-effect.tsx exporta RadarCircle (não colidir com Circle do lucide), Radar, RadarIconContainer.
- Animações com framer-motion; estilos inline para tamanho dos anéis.
- Demo da biblioteca usa lucide-react nos ícones em vez de react-icons.`,
    preview: "radar",
  },
];

type BorderPreviewId =
  | "neon"
  | "shine"
  | "lamp"
  | "ripple"
  | "glow-x"
  | "spotlight"
  | "grad"
  | "search"
  | "bauhaus"
  | "rainbow"
  | "omni"
  | "paper"
  | "wave"
  | "moving";

const borderPrompts: {
  id: string;
  title: string;
  description: string;
  prompt: string;
  preview: BorderPreviewId;
}[] = [
  {
    id: "neon-button",
    title: "Botão neon (bordas em gradiente)",
    description: "Botão arredondado com linhas horizontais em gradiente no hover; variantes default/solid/ghost.",
    prompt: `NeonButton em components/ui/neon-button.tsx — export NeonButton + neonButtonVariants (não colidir com Button do projeto).
Props: neon?: boolean, variant, size, className. CVA + cn. "use client".`,
    preview: "neon",
  },
  {
    id: "shine-border",
    title: "Shine border + timeline",
    description: "Borda animada com radial-gradient em ::before; timeline vertical com ícones Lucide.",
    prompt: `ShineBorder, ShineTimeline, ShineTimelineEvent em shine-border.tsx.
Keyframes shine-pulse em globals.css. Timeline sem pacote dicons — usar Lucide (Layers, Send, Check, Repeat, Download).`,
    preview: "shine",
  },
  {
    id: "lamp-tooltip",
    title: "Tooltip estilo “lamp”",
    description: "Radix Tooltip com bordas por lado e sombras no tema escuro (variáveis --shadow-tooltip-*).",
    prompt: `lamp-tooltip.tsx: TooltipProvider, Tooltip, TooltipTrigger, TooltipContent com @radix-ui/react-tooltip.
Estender @theme com sombras ou usar shadow-[var(--shadow-tooltip-b)] etc.`,
    preview: "lamp",
  },
  {
    id: "ripple-button",
    title: "Botões com ripple (vários modos)",
    description: "Ripple JS + grelha para hover/hoverborder; variável --button-ripple-color em :root/.dark.",
    prompt: `RippleButton em multi-type-ripple-buttons.tsx — variantes default | hover | ghost | hoverborder.
Keyframes js-ripple-animation inline; tema com --button-ripple-color em globals.css.`,
    preview: "ripple",
  },
  {
    id: "animated-glow-card",
    title: "Card com moldura luminosa + XCard",
    description: "GlowCardCanvas + GlowCard (SVG filter) envolvendo conteúdo; XCard estilo post para demo.",
    prompt: `animated-glow-card.tsx (GlowCardCanvas, GlowCard) + x-gradient-card.tsx (XCard com BadgeCheck).
Imagens externas: usar img ou next/image com domínios permitidos.`,
    preview: "glow-x",
  },
  {
    id: "spotlight-card",
    title: "Borda spotlight (cursor)",
    description: "Card que segue o ponteiro com radial-gradient fixo e pseudo-elementos ::before/::after.",
    prompt: `GlowCardSpotlight em spotlight-card.tsx — props glowColor, size, customSize, width/height.
pointermove em document para atualizar --x/--y.`,
    preview: "spotlight",
  },
  {
    id: "animated-gradient-border",
    title: "Borda em gradiente cónico animado",
    description: "BorderRotate com @property --gradient-angle e modos auto/hover/pause-on-hover.",
    prompt: `BorderRotate em animated-gradient-border.tsx + classes .gradient-border-* em globals.css.
animationMode: auto-rotate | rotate-on-hover | stop-rotate-on-hover.`,
    preview: "grad",
  },
  {
    id: "glowing-search-bar",
    title: "Barra de pesquisa com halos cônicos",
    description: "Várias camadas blur + conic-gradient animadas no hover/focus; animate-spin-slow no tema.",
    prompt: `GlowingSearchBar default export em animated-glowing-search-bar.tsx.
@theme: --animate-spin-slow: spin 12s linear infinite.`,
    preview: "search",
  },
  {
    id: "bauhaus-card",
    title: "Card Bauhaus + ChronicleButton",
    description: "Borda com ângulo que segue o rato; botões com texto em flip 3D.",
    prompt: `BauhausCard + ChronicleButton; variáveis CSS --bauhaus-* em :root e .dark (globals.css).
Ícone “mais opções”: lucide MoreHorizontal.`,
    preview: "bauhaus",
  },
  {
    id: "rainbow-border-button",
    title: "Botão com arco-íris animado",
    description: "::before/::after com linear-gradient e blur; keyframes em style injetado.",
    prompt: `RainbowBordersButton em rainbow-borders-button.tsx — evitar nome Button exportado genérico.`,
    preview: "rainbow",
  },
  {
    id: "omni-command-palette",
    title: "Command palette (⌘K)",
    description: "Dialog Radix, fuzzy search, grupos, recentes, pins, tema claro/escuro indicador.",
    prompt: `OmniCommandPalette em omni-command-palette.tsx; tipos OmniItem, OmniSource.
@radix-ui/react-dialog; classes bg-popover; hotkeys estáveis com refs.`,
    preview: "omni",
  },
  {
    id: "paper-shader-showcase",
    title: "Hero MeshGradient + PulsingBorder",
    description: "Paper Design shaders + framer-motion; borda pulsante circular no canto.",
    prompt: `paper-shader-showcase.tsx — MeshGradient, PulsingBorder de @paper-design/shaders-react.
dynamic(..., { ssr: false }) em páginas; wireframe boolean no segundo MeshGradient.`,
    preview: "paper",
  },
  {
    id: "wave-path",
    title: "Divisor ondulado interativo",
    description: "SVG path Q atualizado com movimento do rato; easing ao sair.",
    prompt: `WavePath em wave-path.tsx — useRef para path e estado de animação; cleanup requestAnimationFrame.`,
    preview: "wave",
  },
  {
    id: "moving-border",
    title: "Borda em movimento (GSAP)",
    description: "Gradiente percorre perímetro com MotionPathPlugin; ResizeObserver.",
    prompt: `MovingBorder em moving-border.tsx — gsap + @gsap/react useGSAP; register ScrollTrigger + MotionPathPlugin.
Inner bg-background; props isCircle, colors[].`,
    preview: "moving",
  },
];

const categoryLabels: Record<CategoryId, string> = {
  heroes: "Heroes",
  backgrounds: "Backgrounds",
  borders: "Borders",
  carousels: "Carrossel para clientes",
  images: "Imagens",
  navigation: "Navigation Menus",
  texts: "Textos",
  announcements: "Announcements",
};

type CarouselPreviewId =
  | "logos3"
  | "gallery4"
  | "logo-cloud-3"
  | "logo-cloud-4"
  | "customers"
  | "spinning"
  | "stack-orbit"
  | "infinite-slider";

const clientCarouselPrompts: {
  id: string;
  title: string;
  description: string;
  prompt: string;
  preview: CarouselPreviewId;
}[] = [
  {
    id: "logos3-embla",
    title: "Carrossel de logos (Embla + auto-scroll)",
    description: "Loop infinito com plugin embla-carousel-auto-scroll; fades nas bordas com gradiente do background.",
    prompt: `Logos3 em components/ui/logos3.tsx — Carousel (shadcn) + AutoScroll({ playOnInit: true }).
Props: heading?, logos? (id, description, image, className?), className?.
Dependências: embla-carousel-react, embla-carousel-auto-scroll.
Gradientes: from-background (não bg-linear-to-r). Logos externos: img ou next/image com domínios em next.config.`,
    preview: "logos3",
  },
  {
    id: "gallery4-cases",
    title: "Galeria horizontal (cases / cards)",
    description: "Embla com dragFree no mobile, setas, dots e overlay em gradiente primary nos cards.",
    prompt: `Gallery4 em gallery4.tsx — setApi no Carousel, estado canScrollPrev/Next e currentSlide.
items: { id, title, description, href, image }[]. Overlay: bg-gradient-to-t from-primary/90 (oklch-friendly).
Links externos: target="_blank" rel="noopener noreferrer".`,
    preview: "gallery4",
  },
  {
    id: "logo-cloud-3",
    title: "Faixa de logos infinita (máscara)",
    description: "InfiniteSlider + máscara linear nas laterais; hover opcional acelera/desacelera.",
    prompt: `LogoCloud3 + InfiniteSlider — props logos: { src, alt, width?, height? }.
InfiniteSlider: gap, reverse, speed, speedOnHover (mapeados para duration) ou duration/durationOnHover.
Exportar também LogoCloud como alias de LogoCloud3 se o projeto já importava LogoCloud.`,
    preview: "logo-cloud-3",
  },
  {
    id: "logo-cloud-4",
    title: "Faixa de logos + blur progressivo",
    description: "Como LogoCloud3, com bordas decorativas e ProgressiveBlur nas laterais.",
    prompt: `LogoCloud4 usa InfiniteSlider + ProgressiveBlur (framer-motion motion.div, backdrop-filter por camadas).
Container: bg-gradient-to-r from-secondary via-transparent to-secondary.`,
    preview: "logo-cloud-4",
  },
  {
    id: "customers-section",
    title: "Grelha de logos com hover (Framer)",
    description: "AnimatedGroup com stagger; ao hover, link 'Ver projetos' e blur leve na grelha.",
    prompt: `CustomersSection — props customers: { src, alt, height }[], moreHref?, moreLabel?, className?.
AnimatedGroup com variants custom (blur + y). Substituir blur-xs por blur-sm se o tema não tiver blur-xs.`,
    preview: "customers",
  },
  {
    id: "spinning-logos",
    title: "Anel de ícones a girar",
    description: "Ícones em órbita com animate-spin-slow + counter-spin nos filhos (animate-spin-reverse).",
    prompt: `spinning-logos.tsx — lucide-react (Globe, PlayCircle em vez de Facebook/Youtube se o pacote não exportar).
@theme: --animate-spin-reverse: spin-reverse 12s linear infinite; keyframes spin-reverse em globals.css.`,
    preview: "spinning",
  },
  {
    id: "stack-feature-orbit",
    title: "Secção stack com órbitas de ícones",
    description: "react-icons (Fa*, Si*) em círculos concêntricos animados com keyframes orbit-rotate.",
    prompt: `stack-feature-section.tsx — default export; CTAs com Link + buttonVariants (Base UI Button sem asChild).
Animação: cada órbita usa style animation orbit-rotate com duração em segundos (ex.: 12s + índice * 6). globals.css @keyframes orbit-rotate.`,
    preview: "stack-orbit",
  },
  {
    id: "infinite-slider-primitive",
    title: "InfiniteSlider (primitivo)",
    description: "Base para marquees: framer-motion animate + useMeasure, conteúdo duplicado para loop.",
    prompt: `infinite-slider.tsx — children renderizados duas vezes; translation em x ou y.
Parâmetros: speed/speedOnHover ou duration; reverse; direction horizontal | vertical.
Dependência: react-use-measure, framer-motion.`,
    preview: "infinite-slider",
  },
];

type ImagePreviewId =
  | "bento"
  | "stacked"
  | "scroll-expand"
  | "scroll-cards"
  | "selector"
  | "diced"
  | "flip"
  | "accordion"
  | "arc"
  | "zoom-parallax"
  | "image-tiles"
  | "ogl-circular-gallery"
  | "css-photo-ring";

const imagePrompts: {
  id: string;
  title: string;
  description: string;
  prompt: string;
  preview: ImagePreviewId;
}[] = [
  {
    id: "interactive-bento-gallery",
    title: "Grelha bento interativa + modal",
    description: "Embla implícito via drag; modal com dock arrastável; vídeo com IntersectionObserver.",
    prompt: `interactive-bento-gallery.tsx — MediaItemType { id, type, title, desc, url, span }.
Framer Motion + lucide X. Vídeo: muted, loop, play quando visível. Imagens: lazy. Grid com auto-rows e col-span/row-span Tailwind.
next.config: remotePatterns para hosts de mídia (unsplash, pixabay, etc.).`,
    preview: "bento",
  },
  {
    id: "stacked-cards-interaction",
    title: "Cartões empilhados ao hover",
    description: "Até 3 cards; spread horizontal com rotação via framer-motion spring.",
    prompt: `stacked-cards-interaction.tsx — export StackedCardsInteraction, Card. Props: cards { image, title, description }[], spreadDistance?, rotationAngle?, animationDelay?.
Use tokens bg-card, border-border para dark mode.`,
    preview: "stacked",
  },
  {
    id: "scroll-expansion-hero",
    title: "Hero com média que expande ao scroll",
    description: "Wheel/touch acumulam progresso; fundo com next/image; vídeo MP4 ou YouTube embed.",
    prompt: `scroll-expansion-hero.tsx — default export ScrollExpandMedia. Props: mediaType, mediaSrc, posterSrc?, bgImageSrc, title?, date?, scrollToExpand?, textBlend?, children.
Listeners em window (wheel/touch): pode conflitar com scroll da página — usar só em página dedicada ou isolar.`,
    preview: "scroll-expand",
  },
  {
    id: "scroll-cards-parallax",
    title: "Cards sticky em scroll vertical",
    description: "Cada item ocupa h-screen; imagem de fundo com next/image fill.",
    prompt: `scroll-cards.tsx — export CardsParallax, tipo ScrollCardItem (title, description, tag, src, link, color, textColor). Card com sticky top-0.
Image: fill + sizes; não usar layout="fill" legado.`,
    preview: "scroll-cards",
  },
  {
    id: "interactive-selector",
    title: "Seletor de opções com imagem de fundo",
    description: "Faixas expansíveis; react-icons Fa*; animação de entrada escalonada.",
    prompt: `interactive-selector.tsx — default export. Opções com title, description, image, icon. Estado activeIndex; flex animado.
Dependência: react-icons. Estilos: styled-jsx embutido para fade-in.`,
    preview: "selector",
  },
  {
    id: "diced-hero-section",
    title: "Hero com grelha 2×2 e máscaras CSS",
    description: "ChronicleButton; gradiente no título; slides[0..3] mapeados para cantos; suporte RTL.",
    prompt: `diced-hero-section.tsx + chronicle-button.tsx — variáveis CSS em globals :root e .dark (--diced-hero-section-*).
ChronicleButton injeta <style id="chronicle-button-style"> uma vez. DicedHeroSection: styled-jsx para classes .warped-image e máscaras.`,
    preview: "diced",
  },
  {
    id: "flip-reveal",
    title: "Reveal com GSAP Flip",
    description: "Alterna classes show/hide em filhos [data-flip]; animação Flip.from.",
    prompt: `flip-reveal.tsx — FlipReveal + FlipRevealItem. useGSAP com scope no wrapper; querySelectorAll("[data-flip]").
Dependências: gsap, Flip plugin, @gsap/react. Demo: shadcn ToggleGroup + ToggleGroupItem.`,
    preview: "flip",
  },
  {
    id: "interactive-image-accordion",
    title: "Acordeão horizontal de imagens",
    description: "Hover expande largura; título rotaciona quando colapsado.",
    prompt: `interactive-image-accordion.tsx — LandingAccordionItem; props items opcional AccordionImageItem[]. Estado activeIndex.
Ajustar larguras em mobile (overflow-x-auto).`,
    preview: "accordion",
  },
  {
    id: "arc-gallery-hero",
    title: "Galeria em arco (memórias)",
    description: "Imagens posicionadas em arco com trigonometria; resize responsivo.",
    prompt: `arc-gallery-hero-component.tsx — ArcGalleryHero props: images[], startAngle, endAngle, radius*, cardSize*, className.
Keyframes fade-in no <style> local. Substituir cores fixas por theme quando integrar.`,
    preview: "arc",
  },
  {
    id: "zoom-parallax",
    title: "Zoom parallax multi-camada",
    description: "useScroll + useTransform por camada; secção altura 300vh + sticky.",
    prompt: `zoom-parallax.tsx — ZoomParallax({ images }). Máximo 7 imagens; scales ciclados.
Demo com Lenis opcional (@studio-freight/lenis). Sem Lenis, scroll nativo funciona.`,
    preview: "zoom-parallax",
  },
  {
    id: "image-tiles",
    title: "Três fotos sobrepostas (spring)",
    description: "Variants hover por cartão; rotação e offset em animate inicial.",
    prompt: `image-tiles.tsx — default export ImageReveal({ leftImage, middleImage, rightImage }). framer-motion Variants.
Imagens externas: img ou configurar next/image com tamanhos fixos.`,
    preview: "image-tiles",
  },
  {
    id: "circular-gallery-ogl",
    title: "Galeria curva infinita (OGL / WebGL)",
    description:
      "Faixa de cartões com textura, curvatura no eixo Y, títulos em canvas; arraste, roda do rato e loop infinito.",
    prompt: `Componente em components/ui/circular-gallery-ogl.tsx — dependência npm: ogl (Camera, Mesh, Plane, Program, Renderer, Texture, Transform).
Classes GalleryApp + Media + Title; shaders com ondulação em Z, cantos arredondados via SDF no fragment.
Props React: items?: { image, text }[], bend, textColor, borderRadius, font, scrollSpeed, scrollEase, className.
Prévia compacta: className "circular-gallery--preview" no wrapper interno. next.config: remotePatterns para picsum.photos e hosts das imagens.
Client-only ("use client"); destruir no unmount (cancelAnimationFrame, remove canvas, listeners).`,
    preview: "ogl-circular-gallery",
  },
  {
    id: "rotating-photo-ring-css",
    title: "Anel de fotos 3D (só CSS)",
    description:
      "Cartões empilhados em grid; rotateY + translateZ formam cilindro; animação linear; máscara gradiente nas laterais.",
    prompt: `components/ui/rotating-photo-ring.tsx + rotating-photo-ring.css — lista de IDs Unsplash ou props para srcs.
CSS: perspective no .rpr-scene, transform-style preserve-3d em .rpr-a3d, --n e --i para ângulo (--ba: 1turn/var(--n)).
Variante preview: <RotatingPhotoRing variant="preview" /> para altura da biblioteca. prefers-reduced-motion: animação mais lenta.
Usar <img> (não next/image) se precisar de transform 3D direto no elemento sem wrapper.`,
    preview: "css-photo-ring",
  },
];

type NavigationPreviewId = "navbar-1" | "header-1" | "header-3";

const navigationPrompts: {
  id: string;
  title: string;
  description: string;
  prompt: string;
  preview: NavigationPreviewId;
}[] = [
  {
    id: "navbar-1-shadcnblocks",
    title: "Navbar com dropdown + sheet mobile",
    description: "Combina NavigationMenu, Accordion e Sheet com login/signup.",
    prompt: `shadcnblocks-com-navbar1.tsx — usa accordion.tsx, navigation-menu.tsx, sheet.tsx e button.tsx.
Props: logo, menu (com subitems + icon), mobileExtraLinks, auth.
Desktop: NavigationMenu com dropdown. Mobile: Sheet + Accordion.`,
    preview: "navbar-1",
  },
  {
    id: "header-1-simple",
    title: "Header sticky simples (mobile fullscreen)",
    description: "Menu mobile em portal, lock de scroll e MenuToggleIcon animado.",
    prompt: `header-1.tsx — usa useScroll(threshold), MenuToggleIcon e createPortal.
Quando open=true, body overflow hidden. Links via buttonVariants(ghost).`,
    preview: "header-1",
  },
  {
    id: "header-3-mega-menu",
    title: "Header com mega menu",
    description: "Dois dropdowns (Product/Company) com cartões de links e ícones Lucide.",
    prompt: `header-3.tsx — NavigationMenu com content em grid e ListItem reutilizável.
Mobile: menu em portal com mesmas seções. Usa useScroll para backdrop após scroll.`,
    preview: "header-3",
  },
];

type TextPreviewId =
  | "text-three"
  | "animated-letters"
  | "hand-written"
  | "underline-one"
  | "shiny"
  | "blurred-stagger"
  | "shining"
  | "underline-css"
  | "marquee"
  | "text-color"
  | "reveal"
  | "vertical"
  | "interactive-particle"
  | "vaporize"
  | "particle-effect"
  | "magnetic"
  | "shimmer";

const textPrompts: {
  id: string;
  title: string;
  description: string;
  prompt: string;
  preview: TextPreviewId;
}[] = [
  {
    id: "text-three",
    title: "Digitação letra a letra",
    description: "useState + setInterval; framer-motion fade-in no contêiner.",
    prompt: `text-three.tsx — default export TextThree; texto fixo "Namaste World!"; speed 100ms no intervalo.
Dependência: framer-motion.`,
    preview: "text-three",
  },
  {
    id: "animated-text-letters",
    title: "Letras com stagger + sublinhado",
    description: "motion.span por letra; linha com gradiente animada (width/left).",
    prompt: `animated-text.tsx — export AnimatedText; props text, duration, delay, replay, textClassName, underlineGradient.
framer-motion Variants + staggerChildren.`,
    preview: "animated-letters",
  },
  {
    id: "hand-writing-text",
    title: "SVG path desenhado + título",
    description: "motion.path pathLength; título e subtítulo com delay.",
    prompt: `hand-writing-text.tsx — HandWrittenTitle; props title?, subtitle?; stroke currentColor.`,
    preview: "hand-written",
  },
  {
    id: "animated-underline-text-one",
    title: "Título + SVG sublinhado (hover no path)",
    description: "motion.path pathLength; whileHover altera d do path.",
    prompt: `animated-underline-text-one.tsx — AnimatedUnderlineTextOne; props underlinePath, underlineHoverPath, underlineDuration.`,
    preview: "underline-one",
  },
  {
    id: "animated-shiny-text",
    title: "Gradiente animado no texto",
    description: "background linear-gradient + backgroundPosition animado (framer-motion).",
    prompt: `animated-shiny-text.tsx — AnimatedShinyText; gradientColors, gradientAnimationDuration, hoverEffect opcional.`,
    preview: "shiny",
  },
  {
    id: "blurred-stagger-text",
    title: "Letras com blur stagger",
    description: "motion/react; filter blur por letra.",
    prompt: `blurred-stagger-text.tsx — BlurredStagger({ text? }); motion + staggerChildren.`,
    preview: "blurred-stagger",
  },
  {
    id: "shining-text",
    title: "Brilho deslizante (gradiente)",
    description: "backgroundPosition animado em loop linear.",
    prompt: `shining-text.tsx — ShiningText({ text, className? }); motion/react.`,
    preview: "shining",
  },
  {
    id: "animated-underline-css",
    title: "Sublinhado CSS (hover)",
    description: "after: pseudo-elemento com scale-x e origin.",
    prompt: `animated-underline.tsx — AnimatedUnderline; sem deps extra; usa token-primary.`,
    preview: "underline-css",
  },
  {
    id: "infinite-text-marquee",
    title: "Marquee infinito + tooltip opcional",
    description: "motion x loop; Link interno ou <a> externo; tooltip segue cursor.",
    prompt: `infinite-text-marquee.tsx — InfiniteTextMarquee; props speed, fontSize, textColor, hoverColor, showTooltip.
Links externo: https:// com target _blank.`,
    preview: "marquee",
  },
  {
    id: "text-color-neon",
    title: "Três palavras neon (máscara + before)",
    description: "Keyframes em globals.css; ícones Plus nos cantos (lucide-react).",
    prompt: `text-color.tsx — TextColor; classes: animate-gradient-foreground-*, before:animate-gradient-background-*.
Estender globals.css com keyframes e .from-gradient-* / .to-gradient-* (ver projeto).`,
    preview: "text-color",
  },
  {
    id: "reveal-text",
    title: "Letras com imagem no hover + overlay",
    description: "URLs Unsplash padrão por letra; camada overlay após spring.",
    prompt: `reveal-text.tsx — RevealText; props letterImages[], fontSize, letterDelay, overlayDelay.
next.config: remotePatterns para images.unsplash.com.`,
    preview: "reveal",
  },
  {
    id: "vertical-text",
    title: "Texto vertical (writing-mode)",
    description: "vertical-rl + rotate; cn de @/lib/utils.",
    prompt: `vertical-text.tsx — VerticalText (as polimórfico); writingMode vertical-rl.`,
    preview: "vertical",
  },
  {
    id: "interactive-text-particle",
    title: "Partículas do texto (hover repulsão)",
    description: "Canvas 2D; rasterizar texto; partículas regressam ao repouso.",
    prompt: `interactive-text-particle.tsx — InteractiveParticleText; props text, colors, animationForce, particleDensity.
Diferente de particle-text-effect.tsx (palavras + clique direito).`,
    preview: "interactive-particle",
  },
  {
    id: "vaporize-animation-text",
    title: "Texto a vaporizar (canvas)",
    description: "Fases static → vaporizing → fadingIn; ciclo entre texts[].",
    prompt: `vaporize-animation-text.tsx — VaporizeAnimationText({ texts? }); canvas 2D; fundo preto.`,
    preview: "vaporize",
  },
  {
    id: "particle-text-effect",
    title: "Partículas formando palavras (ciclo)",
    description: "Canvas offscreen; palavras alternam; botão direito mata partículas.",
    prompt: `particle-text-effect.tsx — ParticleTextEffect({ words?, className? }); já usado em Heroes; canvas 1000×500.`,
    preview: "particle-effect",
  },
  {
    id: "morphing-cursor-magnetic",
    title: "Círculo magnético (texto alternativo)",
    description: "cursor-none; lerp em requestAnimationFrame; círculo revela hoverText.",
    prompt: `morphing-cursor.tsx — MagneticText; text, hoverText, className.`,
    preview: "magnetic",
  },
  {
    id: "shimmer-text",
    title: "Shimmer em texto (motion)",
    description: "background linear-gradient em currentColor; backgroundPositionX loop.",
    prompt: `shimmer-text.tsx — ShimmerText (default export); variantes de cor; motion/react.`,
    preview: "shimmer",
  },
];

export function PromptLibrary() {
  const [active, setActive] = useState<CategoryId>("heroes");
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const deferredQuery = useDeferredValue(query);

  const filteredHeroes = useMemo(() => {
    if (!deferredQuery.trim()) return heroPrompts;
    const q = deferredQuery.toLowerCase();
    return heroPrompts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [deferredQuery]);

  const filteredBackgrounds = useMemo(() => {
    if (!deferredQuery.trim()) return backgroundPrompts;
    const q = deferredQuery.toLowerCase();
    return backgroundPrompts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [deferredQuery]);

  const filteredBorders = useMemo(() => {
    if (!deferredQuery.trim()) return borderPrompts;
    const q = deferredQuery.toLowerCase();
    return borderPrompts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [deferredQuery]);

  const filteredCarousels = useMemo(() => {
    if (!deferredQuery.trim()) return clientCarouselPrompts;
    const q = deferredQuery.toLowerCase();
    return clientCarouselPrompts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [deferredQuery]);

  const filteredImages = useMemo(() => {
    if (!deferredQuery.trim()) return imagePrompts;
    const q = deferredQuery.toLowerCase();
    return imagePrompts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [deferredQuery]);

  const filteredNavigation = useMemo(() => {
    if (!deferredQuery.trim()) return navigationPrompts;
    const q = deferredQuery.toLowerCase();
    return navigationPrompts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [deferredQuery]);

  const filteredTexts = useMemo(() => {
    if (!deferredQuery.trim()) return textPrompts;
    const q = deferredQuery.toLowerCase();
    return textPrompts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
    );
  }, [deferredQuery]);

  async function copyPrompt(text: string, id: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="relative flex h-[100dvh] min-h-0 w-full flex-col overflow-hidden">
      <SiteNav />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col gap-0 overflow-hidden pt-20 pb-4 md:flex-row md:gap-6 md:px-4 md:pb-6 lg:pt-24">
        <aside className="hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-border bg-card/40 backdrop-blur-md md:flex md:w-64 md:max-h-none lg:w-72 rounded-none lg:rounded-2xl lg:border lg:shadow-sm">
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-4">
            <a href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <ChevronLeft className="size-4" />
              DevServer
            </a>
          </div>
          <div className="shrink-0 p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar…"
                className="h-10 rounded-xl border-border bg-background/80 pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 text-xs text-muted-foreground xl:block">
                ⌘K
              </span>
            </div>
          </div>
          <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden overscroll-y-contain px-2 pb-4 [scrollbar-gutter:stable]">
            <p className="shrink-0 px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categorias</p>
            {categories.map((cat) => {
              const isActive = active === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => !cat.soon && setActive(cat.id)}
                  disabled={!!cat.soon}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    isActive && "bg-muted text-foreground font-medium",
                    !isActive && !cat.soon && "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    cat.soon && "cursor-not-allowed opacity-50",
                  )}
                >
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs tabular-nums",
                      isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {cat.soon ? "—" : cat.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 md:px-0">
          <div className="mb-6 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Biblioteca /{" "}
                <span className="font-medium text-foreground">{categoryLabels[active]}</span>
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                {categoryLabels[active]}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar</span>
              <span className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium">Recomendado</span>
            </div>
          </div>

          <div className="mb-4 shrink-0 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar prompts…"
                className="h-10 rounded-xl border-border bg-card/80 pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain pb-4 [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]">
          {active === "heroes" && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredHeroes.map((item) => (
                <div
                  key={item.id}
                  className="h-full w-full overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur-sm"
                >
                  <article className="flex h-full flex-col p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold leading-tight">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Image
                        src="/devserver-logo.png"
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 shrink-0 object-contain opacity-80 dark:invert dark:brightness-200"
                      />
                    </div>

                    <LazyPreview minHeight={168} rootMargin="80px 0px" className="min-h-[168px] sm:min-h-[180px]">
                      <HeroPreviewRouter id={item.preview as HeroPreviewId} />
                    </LazyPreview>

                    <div className="mt-4 flex flex-1 flex-col gap-3">
                      <div className="max-h-28 overflow-y-auto rounded-xl border border-border/80 bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground">
                        {item.prompt}
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full rounded-full"
                        onClick={() => copyPrompt(item.prompt, item.id)}
                      >
                        <Copy className="mr-2 size-4" />
                        {copiedId === item.id ? "Copiado!" : "Copiar prompt"}
                      </Button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {active === "backgrounds" && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBackgrounds.map((item) => (
                <div
                  key={item.id}
                  className="h-full w-full overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur-sm"
                >
                  <article className="flex h-full flex-col p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold leading-tight">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Image
                        src="/devserver-logo.png"
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 shrink-0 object-contain opacity-80 dark:invert dark:brightness-200"
                      />
                    </div>

                    <LazyPreview minHeight={168} rootMargin="80px 0px" className="min-h-[168px] sm:min-h-[180px]">
                      <LibraryMiscLazy id={item.preview} />
                    </LazyPreview>

                    <div className="mt-4 flex flex-1 flex-col gap-3">
                      <div className="max-h-28 overflow-y-auto rounded-xl border border-border/80 bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground">
                        {item.prompt}
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full rounded-full"
                        onClick={() => copyPrompt(item.prompt, item.id)}
                      >
                        <Copy className="mr-2 size-4" />
                        {copiedId === item.id ? "Copiado!" : "Copiar prompt"}
                      </Button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {active === "borders" && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBorders.map((item) => (
                <div
                  key={item.id}
                  className="h-full w-full overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur-sm"
                >
                  <article className="flex h-full flex-col p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold leading-tight">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Image
                        src="/devserver-logo.png"
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 shrink-0 object-contain opacity-80 dark:invert dark:brightness-200"
                      />
                    </div>

                    <LazyPreview minHeight={168} rootMargin="80px 0px" className="min-h-[168px] sm:min-h-[180px]">
                      <LibraryMiscLazy id={item.preview} />
                    </LazyPreview>

                    <div className="mt-4 flex flex-1 flex-col gap-3">
                      <div className="max-h-28 overflow-y-auto rounded-xl border border-border/80 bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground">
                        {item.prompt}
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full rounded-full"
                        onClick={() => copyPrompt(item.prompt, item.id)}
                      >
                        <Copy className="mr-2 size-4" />
                        {copiedId === item.id ? "Copiado!" : "Copiar prompt"}
                      </Button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {active === "carousels" && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredCarousels.map((item) => (
                <div
                  key={item.id}
                  className="h-full w-full overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur-sm"
                >
                  <article className="flex h-full flex-col p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold leading-tight">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Image
                        src="/devserver-logo.png"
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 shrink-0 object-contain opacity-80 dark:invert dark:brightness-200"
                      />
                    </div>

                    <LazyPreview minHeight={168} rootMargin="80px 0px" className="min-h-[168px] sm:min-h-[180px]">
                      <LibraryMiscLazy id={item.preview} />
                    </LazyPreview>

                    <div className="mt-4 flex flex-1 flex-col gap-3">
                      <div className="max-h-28 overflow-y-auto rounded-xl border border-border/80 bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground">
                        {item.prompt}
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full rounded-full"
                        onClick={() => copyPrompt(item.prompt, item.id)}
                      >
                        <Copy className="mr-2 size-4" />
                        {copiedId === item.id ? "Copiado!" : "Copiar prompt"}
                      </Button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {active === "images" && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredImages.map((item) => (
                <div
                  key={item.id}
                  className="h-full w-full overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur-sm"
                >
                  <article className="flex h-full flex-col p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold leading-tight">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Image
                        src="/devserver-logo.png"
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 shrink-0 object-contain opacity-80 dark:invert dark:brightness-200"
                      />
                    </div>

                    <LazyPreview minHeight={168} rootMargin="80px 0px" className="min-h-[168px] sm:min-h-[180px]">
                      <GatedImagePreview id={item.preview} />
                    </LazyPreview>

                    <div className="mt-4 flex flex-1 flex-col gap-3">
                      <div className="max-h-28 overflow-y-auto rounded-xl border border-border/80 bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground">
                        {item.prompt}
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full rounded-full"
                        onClick={() => copyPrompt(item.prompt, item.id)}
                      >
                        <Copy className="mr-2 size-4" />
                        {copiedId === item.id ? "Copiado!" : "Copiar prompt"}
                      </Button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {active === "texts" && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTexts.map((item) => (
                <div
                  key={item.id}
                  className="h-full w-full overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur-sm"
                >
                  <article className="flex h-full flex-col p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold leading-tight">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Image
                        src="/devserver-logo.png"
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 shrink-0 object-contain opacity-80 dark:invert dark:brightness-200"
                      />
                    </div>

                    <LazyPreview minHeight={168} rootMargin="80px 0px" className="min-h-[168px] sm:min-h-[180px]">
                      <TextPreviewsLazy id={item.preview} />
                    </LazyPreview>

                    <div className="mt-4 flex flex-1 flex-col gap-3">
                      <div className="max-h-28 overflow-y-auto rounded-xl border border-border/80 bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground">
                        {item.prompt}
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full rounded-full"
                        onClick={() => copyPrompt(item.prompt, item.id)}
                      >
                        <Copy className="mr-2 size-4" />
                        {copiedId === item.id ? "Copiado!" : "Copiar prompt"}
                      </Button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {active === "navigation" && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredNavigation.map((item) => (
                <div
                  key={item.id}
                  className="h-full w-full overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur-sm"
                >
                  <article className="flex h-full flex-col p-4">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-semibold leading-tight">{item.title}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Image
                        src="/devserver-logo.png"
                        alt=""
                        width={28}
                        height={28}
                        className="size-7 shrink-0 object-contain opacity-80 dark:invert dark:brightness-200"
                      />
                    </div>

                    <LazyPreview minHeight={168} rootMargin="80px 0px" className="min-h-[168px] sm:min-h-[180px]">
                      <NavigationPreviewsLazy id={item.preview} />
                    </LazyPreview>

                    <div className="mt-4 flex flex-1 flex-col gap-3">
                      <div className="max-h-28 overflow-y-auto rounded-xl border border-border/80 bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground">
                        {item.prompt}
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full rounded-full"
                        onClick={() => copyPrompt(item.prompt, item.id)}
                      >
                        <Copy className="mr-2 size-4" />
                        {copiedId === item.id ? "Copiado!" : "Copiar prompt"}
                      </Button>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {active !== "heroes" &&
            active !== "backgrounds" &&
            active !== "borders" &&
            active !== "carousels" &&
            active !== "images" &&
            active !== "navigation" &&
            active !== "texts" && (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center text-muted-foreground">
              Em breve nesta categoria.
            </div>
          )}
          </div>
        </main>
        </div>
      </div>
    </div>
  );
}
