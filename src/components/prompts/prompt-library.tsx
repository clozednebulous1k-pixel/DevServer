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
import { HostingPanel, HOSTING_TOPIC_COUNT } from "@/components/prompts/hosting-panel";
import { DatabasePanel, DATABASE_PANEL_SECTION_COUNT } from "@/components/prompts/database-panel";
import {
  FrontendDeployPanel,
  FRONTEND_DEPLOY_PIPELINE_STEPS,
} from "@/components/prompts/frontend-deploy-panel";
import { SpeedPanel, SPEED_TOPIC_COUNT } from "@/components/prompts/speed-panel";
import {
  LibraryCatalogPanel,
  SECURITY_ENV_CHECKS_COUNT,
  SecurityCheckPanel,
} from "@/components/prompts/library-security-panels";

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

type PromptCategoryId =
  | "heroes"
  | "backgrounds"
  | "borders"
  | "carousels"
  | "images"
  | "navigation"
  | "texts"
  | "announcements";

type CategoryId =
  | PromptCategoryId
  | "library"
  | "security"
  | "hosting"
  | "speed"
  | "databases"
  | "frontend_deploy";

const promptCategories: readonly {
  id: PromptCategoryId;
  label: string;
  count: number;
  soon?: boolean;
}[] = [
  { id: "heroes", label: "Heroes", count: 39 },
  { id: "backgrounds", label: "Backgrounds", count: 18 },
  { id: "borders", label: "Borders", count: 24 },
  { id: "carousels", label: "Carrossel para clientes", count: 18 },
  { id: "images", label: "Imagens", count: 23 },
  { id: "navigation", label: "Navigation Menus", count: 13 },
  { id: "texts", label: "Textos", count: 16 },
  { id: "announcements", label: "Announcements", count: 0, soon: true },
];

const totalLibraryPromptItems = promptCategories.filter((c) => !c.soon).reduce((sum, c) => sum + c.count, 0);

/** Sidebar: guias + Biblioteca de prompts. */
const navCategories: readonly {
  id: CategoryId;
  label: string;
  count: number;
  soon?: boolean;
}[] = [
  { id: "library", label: "Biblioteca", count: totalLibraryPromptItems },
  { id: "security", label: "Segurança", count: SECURITY_ENV_CHECKS_COUNT },
  { id: "hosting", label: "Hospedagem", count: HOSTING_TOPIC_COUNT },
  { id: "speed", label: "Velocidade", count: SPEED_TOPIC_COUNT },
  { id: "databases", label: "Bancos de dados", count: DATABASE_PANEL_SECTION_COUNT },
  { id: "frontend_deploy", label: "Deploy front-end", count: FRONTEND_DEPLOY_PIPELINE_STEPS },
];

const heroPrompts = [
  {
    id: "myna-hero",
    title: "Hero Myna UI - IA & mono",
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
    description: "Fundo em canvas com fios animados e texto central com motion - vibe futurista DevServer.",
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
    description: "Cena 3D interativa em fullscreen com texto sobreposto - ótimo para produtos tech.",
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
- CTA: elemento <a> com cn(buttonVariants({ size: "lg" })) - o projeto pode usar Button Base UI sem asChild; evite Slot.
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
    title: "Hero Tailark - mockup + logos",
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
    title: "Hero WebGL - esferas metálicas",
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
    title: "Stellar.ai - tabs + vídeo + overlays",
    description: "Landing clara Inter, nav, hero com tabs que alternam a cada 4s, vídeo CloudFront e badges.",
    prompt: `Ver implementação em marketing-heroes-part1 (StellarAiHeroInner): animate-fade-in-up, Lucide, vídeo MP4, 4 overlays condicionais.`,
    preview: "stellar" as const,
  },
  {
    id: "hero-power-ai",
    title: "Power AI - vídeo escuro + marquee",
    description: "Fullscreen escuro, vídeo com fade loop (VideoFadeMp4), General Sans, blob blur, marquee logos.",
    prompt: `CSS vars HSL, liquid-glass no marquee, sem overlay no vídeo além do fade JS.`,
    preview: "power-ai" as const,
  },
  {
    id: "hero-aethera",
    title: "Aethera - Instrument Serif + vídeo fade",
    description: "Vídeo posicionado abaixo do nav, gradiente sobre o vídeo, headline editorial.",
    prompt: `VideoFadeMp4 + classes animate-fade-rise em globals.css.`,
    preview: "aethera" as const,
  },
  {
    id: "hero-rubik-era",
    title: "NEW ERA - Rubik + vídeo azul",
    description: "Headline em 3 linhas uppercase, botão com SVG fill, fundo #21346e.",
    prompt: `RubikEraHeroInner - vídeo CloudFront, tipografia bold uppercase, CTA 184×65 com path SVG branco.`,
    preview: "rubik-era" as const,
  },
  {
    id: "hero-web3-eos",
    title: "Web3 EOS - gradient text + waitlist",
    description: "Vídeo com overlay 50%, nav 120px, pills waitlist com brilho.",
    prompt: `Web3EosHeroInner - gradiente 144.5deg em background-clip text, botões waitlist em camadas.`,
    preview: "web3-eos" as const,
  },
  {
    id: "hero-glass-hls",
    title: "Glass + HLS (Cloudflare Stream)",
    description: "hls.js, mix-blend-screen no vídeo, faixa logos tailus, react-use-measure, InfiniteSlider.",
    prompt: `GlassHlsHeroInner - HLS Cloudflare Stream, motion/react, clsx + tailwind-merge; logo cloud com SVG externos.`,
    preview: "glass-hls" as const,
  },
  {
    id: "hero-geist-minimal",
    title: "Geist + Instrument Serif - vídeo invertido",
    description: "scaleY(-1) no vídeo, gradiente branco, email bar + CTA com inner shadow.",
    prompt: `GeistMinimalHeroInner - gradiente Tailwind from/to com stops percentuais, motion stagger.`,
    preview: "geist-minimal" as const,
  },
  {
    id: "hero-ai-builder-hls",
    title: "AI builder - Mux HLS",
    description: "HlsVideo stream Mux, overlays gradiente, motion headline, CTAs.",
    prompt: `AiBuilderHlsHeroInner - HlsVideo + poster Unsplash; gradientes decorativos blur mix-blend-screen.`,
    preview: "ai-builder-hls" as const,
  },
  {
    id: "hero-taskly-glass",
    title: "Taskly - orb webm + Fustat",
    description: "future.co orb.webm, mix-blend-screen, filtros hue/saturation, nav glass sticky.",
    prompt: `TasklyGlassHeroInner - vídeo webm future.co, nav backdrop-blur 50px, CTA rgba(0,132,255,0.8).`,
    preview: "taskly-glass" as const,
  },
  {
    id: "hero-barlow-agency",
    title: "Agency - Barlow + Instrument Serif",
    description: "Vídeo full bleed, badge Fortune glass, cantos 7px, CTAs #f8f8f8.",
    prompt: `BarlowAgencyHeroInner - sem overlay no vídeo; cantos 7×7px nos quatro cantos do bloco central.`,
    preview: "barlow-agency" as const,
  },
  {
    id: "hero-bloom-glass",
    title: "Bloom - liquid glass + vídeo",
    description: "Poppins/Source Serif 4, painéis liquid-glass / liquid-glass-strong, split layout.",
    prompt: `BloomGlassHeroInner - classes .liquid-glass e .liquid-glass-strong em globals.css; lucide ícones.`,
    preview: "bloom-glass" as const,
  },
  {
    id: "hero-targo",
    title: "Targo - logística vermelha",
    description: "Rubik bold, vídeo sem overlay, clip-path nos botões, card consulta glass.",
    prompt: `TargoHeroInner - marca #EE3F2C, clipPath polygon para cantos cortados, backdrop-blur no card.`,
    preview: "targo-red" as const,
  },
  {
    id: "hero-synapse-hls",
    title: "Synapse - HLS atrás do texto",
    description: "Vídeo Mux 80vh bottom-[35vh], navbar glass, motion stagger.",
    prompt: `SynapseHlsHeroInner - stream Mux .m3u8, posicionamento bottom 35vh / h-[80vh].`,
    preview: "synapse-hls" as const,
  },
  {
    id: "hero-ai-unlock-hls",
    title: "AI Unlock - split text + Mux",
    description: "Vídeo deslocado/scaled, blur-in motion, badge Sparkles.",
    prompt: `AiUnlockHlsHeroInner - motion blur filter, palavras com stagger; vídeo margin-left + scale.`,
    preview: "ai-unlock-hls" as const,
  },
  {
    id: "hero-clear-invoice",
    title: "ClearInvoice - barra gradiente + HLS",
    description: "Topo colorido, vídeo Mux memoizado, CTAs gradiente laranja.",
    prompt: `ClearInvoiceHeroInner - React.memo no fundo HLS; barra topo gradiente ccf/e7d04c/31fb78.`,
    preview: "clear-invoice-hls" as const,
  },
  {
    id: "section-webfluin-calculator",
    title: "Calculadora orçamento Webfluin",
    description: "Grid 2 colunas, radios/checkbox custom, slider páginas, preços agency/freelancer/you.",
    prompt: `WebfluinCalculatorInner - calculatePrice / calculateAgencyCost / calculateFreelancerCost conforme especificação; input range 1-30.`,
    preview: "webfluin-calculator" as const,
  },
  {
    id: "hero-saas-metrics-live",
    title: "Hero SaaS - métricas ao vivo",
    description: "Cards flutuantes com números animados, sparklines SVG e badge de uptime; vibe dashboard confiável.",
    prompt: `Crie um hero B2B SaaS em viewport alto:
- Fundo sutil (gradiente radial ou noise CSS) sem roubar foco dos números.
- Grid 2×2 ou 3 mini-cards com valor principal (tabular-nums), delta % verde/vermelho e micro sparkline (SVG ou recharts só se leve).
- Headline forte + subtítulo; CTA primário e secundário (outline).
- Opcional: linha de logos em escala de cinza abaixo (trust).
Stack: Next.js, Tailwind, framer-motion para contadores e entrada stagger. Prefira tokens theme (primary, muted).`,
    preview: "stellar" as const,
  },
  {
    id: "hero-podcast-wave",
    title: "Hero podcast - ondas + episódio",
    description: "Visual tipo waveform reativo (fake ou áudio opcional), capa do episódio e botão play.",
    prompt: `Hero para podcast ou newsletter em áudio:
- Coluna esquerda: título do show, episódio atual (número + nome), descrição curta.
- Coluna direita ou fundo: waveform animado (canvas ou barras CSS com motion) que pode ser só decorativo se não houver áudio.
- Botão play circular grande; links Spotify/Apple/Youtube como ícones ghost.
- Tipografia contrastante (display + sans legível).
Next.js client onde necessário; reduza bundle (sem libs pesadas de áudio se não precisar).`,
    preview: "power-ai" as const,
  },
  {
    id: "hero-event-countdown",
    title: "Hero conferência - countdown",
    description: "Contagem regressiva grande, timezone, CTA ingresso e faixa de palestrantes.",
    prompt: `Landing de evento (dev conference / webinar):
- Countdown com dias-horas-min-seg atualizado por setInterval ou date-fns; layout responsivo (stack em mobile).
- Bloco inferior com avatares empilhados + \"+120 palestrantes\" e link para grade.
- Navbar mínima com logo e botão \"Garantir ingresso\".
Acessível: números com aria-live polite ao tick; prefers-reduced-motion reduz pulsação decorativa.`,
    preview: "rubik-era" as const,
  },
  {
    id: "hero-product-hotspots",
    title: "Hero e-commerce - produto + hotspots",
    description: "Imagem do produto com pontos clicáveis e tooltip para features.",
    prompt: `Hero tipo PDP premium:
- Imagem grande (next/image) com hotspots absolutos (% top/left) que abrem popover Radix ou Sheet no mobile.
- Lista de bullets ao lado sincronizada ao hotspot ativo (estado lifted).
- Preço, parcelamento e CTA \"Adicionar\"; selo de garantia.
Use cn(), motion só no hover dos pontos (scale). Evite CLS: width/height na imagem.`,
    preview: "bloom-glass" as const,
  },
  {
    id: "hero-nonprofit-story",
    title: "Hero ONG - história + impacto",
    description: "Foto humanizada full-bleed, headline emotiva e métricas de impacto (vidas, água, escolas).",
    prompt: `Hero institucional para ONG ou impacto social:
- Meia viewport ou full com foto real (Unsplash placeholder com crédito), overlay gradiente para leitura.
- Headline curta + subtítulo factual; linha com 3 métricas grandes (número + label).
- CTAs: \"Doar\" (primário) e \"Conhecer projetos\" (outline branco/semi-transparente).
Tom respeitoso; contraste WCAG AA no texto sobre foto.`,
    preview: "animated" as const,
  },
  {
    id: "hero-crypto-ticker",
    title: "Hero fintech crypto - ticker",
    description: "Faixa com preços fake scrollando, cards glass e aviso de risco.",
    prompt: `Hero estética crypto/fintech (genérico, sem prometer retorno):
- Marquee horizontal com pares SYMBOL/USDT e variação % (dados mock).
- Painel glass central: headline, subtítulo, dois CTAs (\"Criar conta\" / \"Ver taxas\").
- Disclaimer pequeno abaixo sobre volatilidade.
Tailwind glass (backdrop-blur, border-white/10); motion reduzida se prefers-reduced-motion.`,
    preview: "web3-eos" as const,
  },
  {
    id: "hero-fitness-rings",
    title: "Hero fitness - anéis de progresso",
    description: "SVG ou conic-gradient animado como Apple rings; meta diária e CTA treino.",
    prompt: `Hero app de saúde/fitness:
- Visual central: três anéis (calorias, minutos, passos) com stroke-dasharray animado via CSS ou framer-motion.
- Texto motivacional + progresso \"Hoje: 72% da meta\".
- CTA \"Começar treino\" e link secundário para planos.
Cores vibrantes mas consistentes com tema; preview compacto deve funcionar em altura fixa.`,
    preview: "particle" as const,
  },
  {
    id: "hero-editorial-split",
    title: "Hero editorial - revista split",
    description: "Layout assimétrico tipo capa de revista: serif grande + imagem sangrando.",
    prompt: `Hero editorial / blog premium:
- Grid 12 colunas: coluna texto (serif para título multilinha) + coluna imagem com object-cover e cantos opcionalmente cortados (clip-path suave).
- Metadados: categoria pill, tempo de leitura, autor com avatar.
- Sem carrossel automático; foco tipográfico.
Tailwind typography opcional para lead paragraph.`,
    preview: "geist-minimal" as const,
  },
  {
    id: "hero-weather-glass",
    title: "Hero clima - card glass dinâmico",
    description: "Ícone meteorológico animado (sol/chuva), temperatura grande e cidade.",
    prompt: `Hero landing de app de clima ou widget destaque:
- Card glass grande com ícone Lucide ou SVG animado leve (sun/cloud-rain).
- Temperatura principal \"24°\" + sensação + vento em linhas secundárias.
- Campo de busca cidade estilizado (combobox shadcn).
Fundo: gradiente dinâmico por tema (dia/noite) via classe dark ou prop.`,
    preview: "glass-hls" as const,
  },
  {
    id: "hero-onboarding-steps",
    title: "Hero onboarding - passos numerados",
    description: "Progress horizontal, três passos com ícones e CTA \"Começar cadastro\".",
    prompt: `Hero para fluxo de onboarding ou produto com trial:
- Stepper horizontal (1 Connect 2 Configure 3 Launch) com estado ativo no primeiro passo.
- Área principal: headline + lista curta de benefícios com ícones Lucide.
- CTA \"Continuar\" + link \"Já tenho conta\".
Componentes acessíveis: aria-current no passo ativo; foco visível nos botões.`,
    preview: "form8" as const,
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
      "Full viewport escuro com formas elípticas animadas (Framer Motion), badge e título em gradiente - ideal como hero ou seção de impacto.",
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
  {
    id: "bg-aurora-gradient",
    title: "Aurora boreal (gradientes em movimento)",
    description: "Camadas de blur + gradientes CSS animados; vibe noturno sem WebGL.",
    prompt: `Crie um fundo tipo aurora para hero ou seção full-width:
- 3-4 divs absolute com blur-3xl, cores primary/secondary/accent em opacidade baixa; animar background-position ou transform com CSS @keyframes (30-60s loop).
- Overlay escuro linear-gradient para manter contraste do texto.
- Sem canvas; performance: will-change só se necessário; prefers-reduced-motion pausa animação.
Exporte AuroraBackground({ className, children? }). Tailwind + cn().`,
    preview: "geometric",
  },
  {
    id: "bg-grid-dots-parallax",
    title: "Grade de pontos + parallax leve",
    description: "Pattern radial-repeat; camadas movem em velocidades diferentes no scroll.",
    prompt: `Fundo abstrato com grid de pontos:
- background-image com radial-gradient em repeat; máscara fade nas bordas.
- useScroll + useTransform (framer-motion) em 2 camadas com offset Y diferentes para ilusão de profundidade.
- Container relative min-h-[50vh]; pointer-events-none no fundo.
Documente intensidade de parallax para não causar enjoo (reduzir em mobile).`,
    preview: "paths",
  },
  {
    id: "bg-noise-grain",
    title: "Ruído film grain overlay",
    description: "SVG filter ou PNG tile sutil; combina com qualquer cor de fundo.",
    prompt: `Overlay de grain cinematográfico:
- Opção A: SVG filter feTurbulence com mix-blend-overlay e opacity 5-12%.
- Opção B: imagem noise tile repetida com repeat.
- Props: intensity, blendMode; aplicar sobre bg sólido ou gradiente existente.
useMemo para não recriar SVG a cada render; z-index acima do bg, abaixo do conteúdo.`,
    preview: "falling",
  },
  {
    id: "bg-mesh-blobs",
    title: "Mesh orgânico (blobs SVG)",
    description: "Curvas suaves com filter blur; paleta limitada alinhada ao tema.",
    prompt: `Fundo com blobs orgânicos:
- SVG com paths ou ellipses em defs + blur filter; animar cx/cy ou transform com CSS animation suave.
- 3 cores do tema com opacidade; container viewBox fixo preserveAspectRatio slice.
Componente BlobMeshBackground; altura full ou h-96 para seções.`,
    preview: "beams",
  },
  {
    id: "bg-hex-honeycomb",
    title: "Colmeia hexagonal (CSS mask)",
    description: "Pattern tech / sci-fi discreto atrás de dashboards.",
    prompt: `Pattern hexagonal repetido:
- Use mask-image com SVG hex tile OU linear-gradients encadeados para formar colmeia (ou pseudo-elementos rotacionados).
- Stroke sutil em border-primary/20; animação opcional de brilho em uma linha (linear-gradient animado).
Evitar excesso de contrast com texto; fundo base bg-background.`,
    preview: "spiral",
  },
  {
    id: "bg-diagonal-stripes",
    title: "Listras diagonais sutis",
    description: "repeating-linear-gradient 45deg; ótimo para CTAs ou faixas de destaque.",
    prompt: `Background utilitário com listras:
- repeating-linear-gradient com duas cores próximas (ex.: muted/30 e transparent).
- Props angle, stripeWidth, colorA, colorB.
- Opcional mix-blend-multiply em modo escuro para suavizar.
Export DiagonalStripes({ className }) como wrapper ou classe Tailwind arbitrary.`,
    preview: "particle",
  },
  {
    id: "bg-vignette-spotlight",
    title: "Vinheta + spotlight central",
    description: "Escurece bordas e ilumina centro; foco em headline.",
    prompt: `Camada radial-gradient fixa:
- inset 0 com ellipse at center: transparente no meio ~40%, transição para bg-background nas bordas.
- Combinar com imagem ou cor sólida atrás.
Útil para landing com foto + texto central; garantir leitura em mobile (aumentar área clara).`,
    preview: "smoke",
  },
  {
    id: "bg-cyber-grid-perspective",
    title: "Grade perspectiva (Tron-like)",
    description: "Linhas em perspectiva CSS 3D ou SVG; neon discreto.",
    prompt: `Fundo estilo grade infinita:
- perspective no pai; rotateX no grid (transform-style preserve-3d) OU SVG com linhas horizontais mais próximas no topo.
- Cor das linhas primary/40; animação opcional translateZ ou stroke-dashoffset.
Performance: limitar blur; reduzir linhas em mobile.`,
    preview: "radar",
  },
  {
    id: "bg-watercaustics-fake",
    title: "Cáusticas simuladas (SVG)",
    description: "Ondas suaves animadas lembrando luz sob água - sem shader.",
    prompt: `Efeito água leve:
- SVG com paths orgânicos e animate em d ou opacity; blur leve no grupo.
- Cores azul/cyan em baixa opacidade sobre fundo escuro.
Sem WebGL; loop suave 6-12s; reduced motion = opacity estática.`,
    preview: "paths",
  },
  {
    id: "bg-gradient-mesh-css",
    title: "Mesh gradient (só CSS variables)",
    description: "Vários radial-gradient em uma div; troca de tema claro/escuro.",
    prompt: `Mesh estático moderno:
- background com 4+ radial-gradient em posições diferentes usando variáveis CSS (--mesh-1, --mesh-2).
- Transição de cor ao trocar .dark via variáveis em :root.
Sem JS obrigatório; export MeshCssBackground com tokens documentados para o design system.`,
    preview: "geometric",
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
    prompt: `NeonButton em components/ui/neon-button.tsx - export NeonButton + neonButtonVariants (não colidir com Button do projeto).
Props: neon?: boolean, variant, size, className. CVA + cn. "use client".`,
    preview: "neon",
  },
  {
    id: "shine-border",
    title: "Shine border + timeline",
    description: "Borda animada com radial-gradient em ::before; timeline vertical com ícones Lucide.",
    prompt: `ShineBorder, ShineTimeline, ShineTimelineEvent em shine-border.tsx.
Keyframes shine-pulse em globals.css. Timeline sem pacote dicons - usar Lucide (Layers, Send, Check, Repeat, Download).`,
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
    prompt: `RippleButton em multi-type-ripple-buttons.tsx - variantes default | hover | ghost | hoverborder.
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
    prompt: `GlowCardSpotlight em spotlight-card.tsx - props glowColor, size, customSize, width/height.
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
    prompt: `RainbowBordersButton em rainbow-borders-button.tsx - evitar nome Button exportado genérico.`,
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
    prompt: `paper-shader-showcase.tsx - MeshGradient, PulsingBorder de @paper-design/shaders-react.
dynamic(..., { ssr: false }) em páginas; wireframe boolean no segundo MeshGradient.`,
    preview: "paper",
  },
  {
    id: "wave-path",
    title: "Divisor ondulado interativo",
    description: "SVG path Q atualizado com movimento do rato; easing ao sair.",
    prompt: `WavePath em wave-path.tsx - useRef para path e estado de animação; cleanup requestAnimationFrame.`,
    preview: "wave",
  },
  {
    id: "moving-border",
    title: "Borda em movimento (GSAP)",
    description: "Gradiente percorre perímetro com MotionPathPlugin; ResizeObserver.",
    prompt: `MovingBorder em moving-border.tsx - gsap + @gsap/react useGSAP; register ScrollTrigger + MotionPathPlugin.
Inner bg-background; props isCircle, colors[].`,
    preview: "moving",
  },
  {
    id: "border-double-outline",
    title: "Duplo contorno minimalista",
    description: "Duas rings com gap; parece moldura física.",
    prompt: `Componente DoubleOutlineCard:
- Wrapper relativo rounded-2xl com border-2 border-muted; inner absolute inset-[3px] rounded-xl border border-border.
- Hover: border-primary/40 + transição shadow-sm.
- Opcional pseudo-element shine no hover (::after com gradient linear).
Slots para children; preserve aspect ratio opcional.`,
    preview: "neon",
  },
  {
    id: "border-sketch-hand-drawn",
    title: "Borda sketch / rabisco SVG",
    description: "stroke irregular com roughen filter ou path hand-drawn fake.",
    prompt: `Card com aparência desenhada à mão:
- SVG rect com rx alto e stroke-dasharray irregular OU path com curvas Bézier ligando cantos \"imperfeitos\".
- stroke-muted-foreground/60; opcional animate stroke-dashoffset só no hover.
Biblioteca pode usar filtros SVG feTurbulence leve em displacement para irregularidade.`,
    preview: "wave",
  },
  {
    id: "border-notched-corner",
    title: "Cantos recortados (engineering)",
    description: "clip-path polygon nos cantos; vibe blueprint.",
    prompt: `Card técnico com chanfros:
- clip-path polygon com pontos calculados ou CSS mask; cantos cortados ~12px consistentes em todos os lados ou só dois.
- Contraste com grid tracejado opcional (::before pattern).
Tailwind arbitrary clip-path ou style inline.`,
    preview: "bauhaus",
  },
  {
    id: "border-stitched-dashed",
    title: "Costura tracejada (dashed rhythm)",
    description: "outline dashed com offset animado tipo loading card.",
    prompt: `Estilo etiqueta cosida:
- outline ou border dashed; animation stroke-offset em SVG rectangle por cima do card (preferível a border CSS para dash offset uniforme).
- Radius rounded-lg; cores muted.
Use case: badges \"Novo\", cards de changelog.`,
    preview: "shine",
  },
  {
    id: "border-neumorphic-soft",
    title: "Soft UI / neumorphism leve",
    description: "Sombras duplas convexo; alto contraste só onde fizer sentido.",
    prompt: `Card neumorphic sutil (tendência controlada):
- bg-muted; box-shadow inset highlight + shadow externa dupla para relevo.
- Button press: inset maior no active.
Advertência de acessibilidade: garantir contraste texto/fundo WCAG; não usar só sombra como único estado.`,
    preview: "glow-x",
  },
  {
    id: "border-chamfer-tech",
    title: "Metal tech chamfer",
    description: "Borda inferior grossa tipo painel HUD.",
    prompt: `Painel HUD:
- Borda inferior 3px gradiente horizontal primary → transparente; cantos superiores arredondados, inferiores retos ou leve ângulo.
- Scanline opcional (::after linear-gradient repeating com opacity 5%).
Ótimo para dashboards cyber sem exagerar neon.`,
    preview: "spotlight",
  },
  {
    id: "border-brass-antique",
    title: "Moldura bronze / vintage",
    description: "Gradiente cónico âmbar + inset shadow.",
    prompt: `Moldura vintage:
- border-image ou múltiplos box-shadow para simular metal oxidado (tons âmbar/marrom).
- Cantos ornamentados opcionais com pseudo SVG corners pequenos.
Combine com serif no título para editorial.`,
    preview: "grad",
  },
  {
    id: "border-inner-glow-ring",
    title: "Anel interno luminoso",
    description: "ring inset blur simulando LED por dentro do card.",
    prompt: `Inner glow ring:
- inset shadow com spread negativo + blur primary/30; segunda camada blur maior em primary/15.
- Funciona bem em bg-card escuro.
Sem overflow visible em lists para não cortar sombras.`,
    preview: "ripple",
  },
  {
    id: "border-dashed-label-tag",
    title: "Tag de preço / label cortada",
    description: "Forma etiqueta com triângulo circular no canto tipo tag de loja.",
    prompt: `Tag component:
- clip-path ou SVG path em formato de etiqueta com furo circular (opcional pseudo círculo bg-background).
- Pequeno triângulo notch no lado direito tipo ticket.
Ideal para badges de preço, promoções.`,
    preview: "rainbow",
  },
  {
    id: "border-divided-sections",
    title: "Card dividido em faixas",
    description: "Linhas verticais/horizontais como Japandi / brutalist soft.",
    prompt: `Card com subdivisões:
- grid grid-cols-3 com divisores border-r border-border último:border-0 ou rows com mesmo padrão.
- Cada célula pode ter número + label.
Micro-interação hover por célula com bg-muted/40.`,
    preview: "search",
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
  library: "Biblioteca",
  security: "Segurança",
  hosting: "Hospedagem",
  speed: "Velocidade",
  databases: "Bancos de dados",
  frontend_deploy: "Deploy front-end",
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
    prompt: `Logos3 em components/ui/logos3.tsx - Carousel (shadcn) + AutoScroll({ playOnInit: true }).
Props: heading?, logos? (id, description, image, className?), className?.
Dependências: embla-carousel-react, embla-carousel-auto-scroll.
Gradientes: from-background (não bg-linear-to-r). Logos externos: img ou next/image com domínios em next.config.`,
    preview: "logos3",
  },
  {
    id: "gallery4-cases",
    title: "Galeria horizontal (cases / cards)",
    description: "Embla com dragFree no mobile, setas, dots e overlay em gradiente primary nos cards.",
    prompt: `Gallery4 em gallery4.tsx - setApi no Carousel, estado canScrollPrev/Next e currentSlide.
items: { id, title, description, href, image }[]. Overlay: bg-gradient-to-t from-primary/90 (oklch-friendly).
Links externos: target="_blank" rel="noopener noreferrer".`,
    preview: "gallery4",
  },
  {
    id: "logo-cloud-3",
    title: "Faixa de logos infinita (máscara)",
    description: "InfiniteSlider + máscara linear nas laterais; hover opcional acelera/desacelera.",
    prompt: `LogoCloud3 + InfiniteSlider - props logos: { src, alt, width?, height? }.
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
    prompt: `CustomersSection - props customers: { src, alt, height }[], moreHref?, moreLabel?, className?.
AnimatedGroup com variants custom (blur + y). Substituir blur-xs por blur-sm se o tema não tiver blur-xs.`,
    preview: "customers",
  },
  {
    id: "spinning-logos",
    title: "Anel de ícones a girar",
    description: "Ícones em órbita com animate-spin-slow + counter-spin nos filhos (animate-spin-reverse).",
    prompt: `spinning-logos.tsx - lucide-react (Globe, PlayCircle em vez de Facebook/Youtube se o pacote não exportar).
@theme: --animate-spin-reverse: spin-reverse 12s linear infinite; keyframes spin-reverse em globals.css.`,
    preview: "spinning",
  },
  {
    id: "stack-feature-orbit",
    title: "Secção stack com órbitas de ícones",
    description: "react-icons (Fa*, Si*) em círculos concêntricos animados com keyframes orbit-rotate.",
    prompt: `stack-feature-section.tsx - default export; CTAs com Link + buttonVariants (Base UI Button sem asChild).
Animação: cada órbita usa style animation orbit-rotate com duração em segundos (ex.: 12s + índice * 6). globals.css @keyframes orbit-rotate.`,
    preview: "stack-orbit",
  },
  {
    id: "infinite-slider-primitive",
    title: "InfiniteSlider (primitivo)",
    description: "Base para marquees: framer-motion animate + useMeasure, conteúdo duplicado para loop.",
    prompt: `infinite-slider.tsx - children renderizados duas vezes; translation em x ou y.
Parâmetros: speed/speedOnHover ou duration; reverse; direction horizontal | vertical.
Dependência: react-use-measure, framer-motion.`,
    preview: "infinite-slider",
  },
  {
    id: "carousel-testimonial-quotes",
    title: "Carrossel de depoimentos (quotes)",
    description: "Cards com aspas, foto e cargo; autoplay pausável.",
    prompt: `Carrossel de quotes para clientes:
- Embla ou Carousel shadcn; um slide visível no desktop, stack ou dots no mobile.
- Card: avatar, nome, cargo, logo empresa pequeno, texto com tipografia italic.
- autoplay com pause on hover e botões prev/next acessíveis (aria-label).
Dados em array tipado Testimonial[].`,
    preview: "gallery4",
  },
  {
    id: "carousel-logo-strip-brands",
    title: "Faixa de marcas com pause no hover",
    description: "Marquee infinito; velocidade reduz ao hover para leitura.",
    prompt: `Faixa de logos clientes:
- Use InfiniteSlider ou Embla com loop; logos em escala de cinza e color no hover (transition).
- Prop speedOnHover maior duration (mais lento) para facilitar leitura do nome.
Gradientes nas bordas from-background.`,
    preview: "logo-cloud-3",
  },
  {
    id: "carousel-feature-cards",
    title: "Carrossel de cases (imagem + métrica)",
    description: "Cada slide: screenshot, KPI \"+42% conversão\", link case study.",
    prompt: `Carrossel de cases B2B:
- Slides com imagem 16:9, título do projeto, métrica em destaque (tabular-nums), CTA \"Ver case\".
- Progress indicador estilo fracionado (1/5) ou barra no topo.
Embla + useCallback para scrollPrev/Next.`,
    preview: "gallery4",
  },
  {
    id: "carousel-partner-ecosystem",
    title: "Órbita de integrações",
    description: "Ícones em círculo rotacionando devagar + centro com copy.",
    prompt: `Seção \"Integra com\":
- Centro fixo com headline; ao redor ícones de integrações em órbita CSS (animation rotate) ou componente spinning-logos adaptado.
- Reverse rotation em ícones para legibilidade (counter-spin).
Reduzir velocidade em prefers-reduced-motion.`,
    preview: "stack-orbit",
  },
  {
    id: "carousel-press-mentions",
    title: "Mídia / as seen on",
    description: "Logos de veículos em carrossel + links para matérias.",
    prompt: `Carrossel \"Na mídia\":
- Logos monocromáticos (TechCrunch, etc. placeholders) com link opcional por item.
- Layout compacto altura fixa; máscara fade nas laterais.
SEO: links rel=\"noopener\" externos.`,
    preview: "logo-cloud-4",
  },
  {
    id: "carousel-team-avatars",
    title: "Roda de equipe / investidores",
    description: "Avatares em slider com nome ao expandir hover.",
    prompt: `Carrossel horizontal de pessoas:
- Slides estreitos com foto circular e nome sob hover (opacity transition).
- Opcional badge \"Investidor\" ou \"Advisor\".
Touch-friendly drag no mobile.`,
    preview: "customers",
  },
  {
    id: "carousel-product-cards-ecom",
    title: "Vitrine produtos (snap)",
    description: "Cards de produto com preço e estrela; scroll-snap.",
    prompt: `Vitrine e-commerce em carrossel:
- scroll-snap-x mandatory + cards w-64; imagem, título, preço, rating stars.
- Botão carrinho rápido no card (stop propagation).
Pode usar Embla com dragFree ou CSS scroll nativo.`,
    preview: "gallery4",
  },
  {
    id: "carousel-timeline-milestones",
    title: "Linha do tempo horizontal",
    description: "Marcos da empresa em carrossel com linha conectora.",
    prompt: `Timeline horizontal scrollável:
- Cada slide: ano, título, uma linha de descrição; linha SVG ou border-t conectando dots entre slides.
- Centro slide ativo levemente maior (scale).
Implementação com Embla ou scroll native + intersection para estado ativo.`,
    preview: "logos3",
  },
  {
    id: "carousel-certifications-badges",
    title: "Selos e certificações",
    description: "ISO, LGPD, SOC2 em faixa contínua com tooltips.",
    prompt: `Faixa de certificações:
- Ícones ou badges SVG em InfiniteSlider; Tooltip Radix explicando cada selo ao hover/focus.
- Alt text descritivo para acessibilidade.
Velocidade moderada; pause focus trap em modal se abrir detalhe.`,
    preview: "infinite-slider",
  },
  {
    id: "carousel-before-after",
    title: "Antes / depois (slider reveal)",
    description: "Handle arrastável revelando segunda imagem - ótimo para agências.",
    prompt: `Comparação antes/depois:
- Duas imagens sobrepostas; divisor vertical arrastável (pointer events) controlando clip-path ou width da camada superior.
- Label \"Antes\" / \"Depois\" nas pontas.
Client component; reset button opcional.`,
    preview: "gallery4",
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
    prompt: `interactive-bento-gallery.tsx - MediaItemType { id, type, title, desc, url, span }.
Framer Motion + lucide X. Vídeo: muted, loop, play quando visível. Imagens: lazy. Grid com auto-rows e col-span/row-span Tailwind.
next.config: remotePatterns para hosts de mídia (unsplash, pixabay, etc.).`,
    preview: "bento",
  },
  {
    id: "stacked-cards-interaction",
    title: "Cartões empilhados ao hover",
    description: "Até 3 cards; spread horizontal com rotação via framer-motion spring.",
    prompt: `stacked-cards-interaction.tsx - export StackedCardsInteraction, Card. Props: cards { image, title, description }[], spreadDistance?, rotationAngle?, animationDelay?.
Use tokens bg-card, border-border para dark mode.`,
    preview: "stacked",
  },
  {
    id: "scroll-expansion-hero",
    title: "Hero com média que expande ao scroll",
    description: "Wheel/touch acumulam progresso; fundo com next/image; vídeo MP4 ou YouTube embed.",
    prompt: `scroll-expansion-hero.tsx - default export ScrollExpandMedia. Props: mediaType, mediaSrc, posterSrc?, bgImageSrc, title?, date?, scrollToExpand?, textBlend?, children.
Listeners em window (wheel/touch): pode conflitar com scroll da página - usar só em página dedicada ou isolar.`,
    preview: "scroll-expand",
  },
  {
    id: "scroll-cards-parallax",
    title: "Cards sticky em scroll vertical",
    description: "Cada item ocupa h-screen; imagem de fundo com next/image fill.",
    prompt: `scroll-cards.tsx - export CardsParallax, tipo ScrollCardItem (title, description, tag, src, link, color, textColor). Card com sticky top-0.
Image: fill + sizes; não usar layout="fill" legado.`,
    preview: "scroll-cards",
  },
  {
    id: "interactive-selector",
    title: "Seletor de opções com imagem de fundo",
    description: "Faixas expansíveis; react-icons Fa*; animação de entrada escalonada.",
    prompt: `interactive-selector.tsx - default export. Opções com title, description, image, icon. Estado activeIndex; flex animado.
Dependência: react-icons. Estilos: styled-jsx embutido para fade-in.`,
    preview: "selector",
  },
  {
    id: "diced-hero-section",
    title: "Hero com grelha 2×2 e máscaras CSS",
    description: "ChronicleButton; gradiente no título; slides[0..3] mapeados para cantos; suporte RTL.",
    prompt: `diced-hero-section.tsx + chronicle-button.tsx - variáveis CSS em globals :root e .dark (--diced-hero-section-*).
ChronicleButton injeta <style id="chronicle-button-style"> uma vez. DicedHeroSection: styled-jsx para classes .warped-image e máscaras.`,
    preview: "diced",
  },
  {
    id: "flip-reveal",
    title: "Reveal com GSAP Flip",
    description: "Alterna classes show/hide em filhos [data-flip]; animação Flip.from.",
    prompt: `flip-reveal.tsx - FlipReveal + FlipRevealItem. useGSAP com scope no wrapper; querySelectorAll("[data-flip]").
Dependências: gsap, Flip plugin, @gsap/react. Demo: shadcn ToggleGroup + ToggleGroupItem.`,
    preview: "flip",
  },
  {
    id: "interactive-image-accordion",
    title: "Acordeão horizontal de imagens",
    description: "Hover expande largura; título rotaciona quando colapsado.",
    prompt: `interactive-image-accordion.tsx - LandingAccordionItem; props items opcional AccordionImageItem[]. Estado activeIndex.
Ajustar larguras em mobile (overflow-x-auto).`,
    preview: "accordion",
  },
  {
    id: "arc-gallery-hero",
    title: "Galeria em arco (memórias)",
    description: "Imagens posicionadas em arco com trigonometria; resize responsivo.",
    prompt: `arc-gallery-hero-component.tsx - ArcGalleryHero props: images[], startAngle, endAngle, radius*, cardSize*, className.
Keyframes fade-in no <style> local. Substituir cores fixas por theme quando integrar.`,
    preview: "arc",
  },
  {
    id: "zoom-parallax",
    title: "Zoom parallax multi-camada",
    description: "useScroll + useTransform por camada; secção altura 300vh + sticky.",
    prompt: `zoom-parallax.tsx - ZoomParallax({ images }). Máximo 7 imagens; scales ciclados.
Demo com Lenis opcional (@studio-freight/lenis). Sem Lenis, scroll nativo funciona.`,
    preview: "zoom-parallax",
  },
  {
    id: "image-tiles",
    title: "Três fotos sobrepostas (spring)",
    description: "Variants hover por cartão; rotação e offset em animate inicial.",
    prompt: `image-tiles.tsx - default export ImageReveal({ leftImage, middleImage, rightImage }). framer-motion Variants.
Imagens externas: img ou configurar next/image com tamanhos fixos.`,
    preview: "image-tiles",
  },
  {
    id: "circular-gallery-ogl",
    title: "Galeria curva infinita (OGL / WebGL)",
    description:
      "Faixa de cartões com textura, curvatura no eixo Y, títulos em canvas; arraste, roda do rato e loop infinito.",
    prompt: `Componente em components/ui/circular-gallery-ogl.tsx - dependência npm: ogl (Camera, Mesh, Plane, Program, Renderer, Texture, Transform).
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
    prompt: `components/ui/rotating-photo-ring.tsx + rotating-photo-ring.css - lista de IDs Unsplash ou props para srcs.
CSS: perspective no .rpr-scene, transform-style preserve-3d em .rpr-a3d, --n e --i para ângulo (--ba: 1turn/var(--n)).
Variante preview: <RotatingPhotoRing variant="preview" /> para altura da biblioteca. prefers-reduced-motion: animação mais lenta.
Usar <img> (não next/image) se precisar de transform 3D direto no elemento sem wrapper.`,
    preview: "css-photo-ring",
  },
  {
    id: "image-masonry-lightbox",
    title: "Masonry + lightbox",
    description: "Grelha Pinterest-like; clique abre dialog fullscreen com navegação.",
    prompt: `Galeria masonry responsiva:
- CSS columns ou grid masonry (onde suportado) com cards de altura variável.
- Lightbox Radix Dialog com next/image grande, prev/next keyboard, ESC fecha.
- Lazy load imagens fora da viewport (loading lazy ou intersection).
Tipar items: { src, alt, width, height, caption? }.`,
    preview: "bento",
  },
  {
    id: "image-compare-environment",
    title: "Slider ambientes (interior)",
    description: "Mesmo cômodo dia/noite ou estilos com divisor arrastável.",
    prompt: `Comparação de ambientes:
- Mesmo padrão clip do antes/depois mas com labels \"Dia\" / \"Noite\" ou \"Clássico\" / \"Moderno\".
- Handle vertical opcional; motion smooth com requestAnimationFrame ou CSS.
Acessível: role slider, aria-valuenow no percentual.`,
    preview: "scroll-expand",
  },
  {
    id: "image-kanban-board-screens",
    title: "Quadro estilo Kanban com screenshots",
    description: "Colunas com thumbs de produto / telas de app.",
    prompt: `Seção produto tipo Kanban decorativo:
- 3 colunas \"Planejar / Executar / Medir\" com cards contendo screenshot + título curto.
- Drag opcional (@dnd-kit) só se necessário; senão estático para landing.
Screenshots com border rounded-lg shadow-md.`,
    preview: "stacked",
  },
  {
    id: "image-polaroid-stack",
    title: "Pilha Polaroid",
    description: "Fotos levemente rotacionadas com sombra; hover desempilha.",
    prompt: `Stack estilo Polaroid:
- Cada card branco padding bottom grande (área \"Polaroid\"), img object-cover acima.
- Rotacionar -6deg, 4deg, -3deg em camadas; hover z-index e scale.
CSS only ou framer-motion para hover.`,
    preview: "image-tiles",
  },
  {
    id: "image-map-pins-gallery",
    title: "Mapa + fotos por região",
    description: "SVG mapa simplificado com pontos clicáveis trocando foto lateral.",
    prompt: `Layout mapa interativo leve:
- SVG world ou país com círculos clicáveis; estado selectedRegion muda imagem e texto ao lado.
- Sem Mapbox obrigatório; pode ser SVG estático.
Foco teclado nos pontos (button ou role tab).`,
    preview: "selector",
  },
  {
    id: "image-story-chapters",
    title: "História em capítulos (scroll)",
    description: "Fullbleed por capítulo com número romano e quote.",
    prompt: `Storytelling scroll:
- Seções full viewport com imagem de fundo fixa ou scroll parallax leve; capítulo I, II, III em tipografia display.
- Transição entre capítulos com fade border via framer-motion whileInView.
Reduzir altura em mobile para não cansar.`,
    preview: "scroll-cards",
  },
  {
    id: "image-avatar-wall",
    title: "Mural de rostos (comunidade)",
    description: "Grid denso de avatares com contador \"+2k membros\".",
    prompt: `Mural de avatares:
- Grid muito compacto (ex.: 8×4) com imagens 40px rounded-full sobrepostas levemente (negative margin).
- Overlay gradiente + texto central \"Junte-se à comunidade\".
Dados mock array de URLs; lazy load.`,
    preview: "accordion",
  },
  {
    id: "image-device-mockup-browser",
    title: "Mockup browser + screenshot",
    description: "Janela fake com traffic lights e URL bar; produto dentro.",
    prompt: `Mockup browser:
- Div rounded-xl border com barra superior (três círculos), URL fictícia, conteúdo iframe ou imagem do app.
- Sombra xl; opcional reflexo CSS (gradiente invertido com mask).
Export BrowserMockup({ children | imageSrc }).`,
    preview: "diced",
  },
  {
    id: "image-caption-newspaper",
    title: "Legenda estilo jornal",
    description: "Figura com legenda serif pequena e crédito do fotógrafo.",
    prompt: `Figure semântico:
- <figure> com next/image, <figcaption> com classe text-sm text-muted-foreground italic e span para crédito.
- Layout article: imagem largura total ou float em desktop.
Boas práticas SEO: alt descritivo longo quando necessário.`,
    preview: "arc",
  },
  {
    id: "image-neon-duotone",
    title: "Duotone neon em camadas",
    description: "Mix-blend-mode em duas cópias da imagem com cores primárias.",
    prompt: `Efeito duotone criativo:
- Duas camadas absolutas da mesma img com mix-blend-multiply/screen e filtros hue-rotate ou CSS mix duotone via SVG filter.
- Limitar a seção hero para performance.
Fallback: imagem normal se prefers-reduced-motion ou reduced data.`,
    preview: "zoom-parallax",
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
    prompt: `shadcnblocks-com-navbar1.tsx - usa accordion.tsx, navigation-menu.tsx, sheet.tsx e button.tsx.
Props: logo, menu (com subitems + icon), mobileExtraLinks, auth.
Desktop: NavigationMenu com dropdown. Mobile: Sheet + Accordion.`,
    preview: "navbar-1",
  },
  {
    id: "header-1-simple",
    title: "Header sticky simples (mobile fullscreen)",
    description: "Menu mobile em portal, lock de scroll e MenuToggleIcon animado.",
    prompt: `header-1.tsx - usa useScroll(threshold), MenuToggleIcon e createPortal.
Quando open=true, body overflow hidden. Links via buttonVariants(ghost).`,
    preview: "header-1",
  },
  {
    id: "header-3-mega-menu",
    title: "Header com mega menu",
    description: "Dois dropdowns (Product/Company) com cartões de links e ícones Lucide.",
    prompt: `header-3.tsx - NavigationMenu com content em grid e ListItem reutilizável.
Mobile: menu em portal com mesmas seções. Usa useScroll para backdrop após scroll.`,
    preview: "header-3",
  },
  {
    id: "nav-sidebar-app-shell",
    title: "Shell app - sidebar fixa",
    description: "Nav vertical com ícones + labels colapsáveis; ideal SaaS.",
    prompt: `Implemente layout dashboard com sidebar:
- Nav fixa w-64 (colapsa para ícones só com toggle); items com Lucide + Link active state (bg-muted).
- Header superior com breadcrumbs e user menu dropdown.
- Main scrollável; respeitar min-h-screen.
Next.js App Router: slot children; estado collapsed em localStorage opcional.`,
    preview: "navbar-1",
  },
  {
    id: "nav-tabs-url-sync",
    title: "Tabs de navegação com URL",
    description: "Abas sincronizadas com searchParams ou hash.",
    prompt: `Navegação por tabs que atualiza URL:
- useSearchParams para ?tab=pricing ou usePathname segmentos.
- Lista de tabs acessível role tablist; keyboard arrows entre abas.
- Evitar flash: default tab no servidor igual ao cliente (mesmo default).
shadcn Tabs ou Radix Tabs.`,
    preview: "header-1",
  },
  {
    id: "nav-footer-mega",
    title: "Rodapé mega (sitemap)",
    description: "Colunas Produto, Empresa, Recursos, Legal + newsletter.",
    prompt: `Footer grande estilo marketing site:
- Grid 4-5 colunas links agrupados; newsletter com input + botão.
- Linha inferior copyright + redes sociais Lucide.
- Links externos rel noopener; contraste AA em texto muted.`,
    preview: "header-3",
  },
  {
    id: "nav-breadcrumb-dynamic",
    title: "Breadcrumb dinâmico",
    description: "Segmentos derivados da rota com ícone home.",
    prompt: `Breadcrumb component:
- usePathname split; último segmento sem link (aria-current page).
- Separador ChevronRight ou slash; Home como primeiro item.
- Truncate middle em URLs longas com dropdown \"...\" opcional.`,
    preview: "navbar-1",
  },
  {
    id: "nav-lang-switcher",
    title: "Seletor de idioma",
    description: "Dropdown com bandeiras + nome do idioma; persiste em cookie.",
    prompt: `Language switcher:
- Dropdown ou combobox com locales ['pt-BR','en']; ao trocar, router.push mesma path com prefixo /en se usar i18n routing (next-intl).
- Sem bandeiras ofensivas erradas: preferir nome do idioma por extenso.
Acessível: lang attribute no html atualizado se possível.`,
    preview: "header-1",
  },
  {
    id: "nav-command-radius",
    title: "Paleta de comandos secundária",
    description: "Atalhos para seções da página (scroll spy).",
    prompt: `Mini-nav in-page:
- Links âncora #pricing que fazem scroll-smooth; IntersectionObserver destaca item ativo conforme scroll (scroll spy).
- Sticky top abaixo do header principal offset.
Reduzir observers em mobile se performance precisar.`,
    preview: "header-3",
  },
  {
    id: "nav-mobile-bottom-bar",
    title: "Bottom bar mobile (app-like)",
    description: "4 ícones + centro destacado; safe-area inset.",
    prompt: `Navigation inferior fixa:
- fixed bottom-0 z-50; pb-safe para iOS (env(safe-area-inset-bottom)).
- 4-5 itens com ícone + label 10px; item ativo primary.
Esconder quando modal fullscreen aberto (context).`,
    preview: "navbar-1",
  },
  {
    id: "nav-notifications-inbox",
    title: "Centro de notificações no header",
    description: "Sino com badge count e popover lista.",
    prompt: `Header com bell icon:
- Popover Radix com lista de notificações (title, time, unread dot); botão \"Marcar todas lidas\".
- Badge numérico máx 9+.
Mock data primeiro; depois integrar API ou Supabase realtime opcional.`,
    preview: "header-1",
  },
  {
    id: "nav-search-global",
    title: "Busca global no header",
    description: "Input expande em modal ⌘K style simplificado.",
    prompt: `Busca no header:
- Input compacto que abre Dialog com campo grande e resultados agrupados (Páginas, Docs, Blog).
- Atalho Ctrl+K / Cmd+K global listener com cleanup.
Debounce fetch; estado loading skeleton.`,
    preview: "header-3",
  },
  {
    id: "nav-step-wizard-nav",
    title: "Navegação de wizard (checkout)",
    description: "Steps clicáveis só até o atual; futuros disabled.",
    prompt: `Wizard nav para fluxo multi-passos:
- Steps horizontais com número em círculo; completed check Lucide.
- Clicável só steps já visitados ou atual; próximos disabled até validação.
Integrar com react-hook-form + zod por step.`,
    preview: "navbar-1",
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
    prompt: `text-three.tsx - default export TextThree; texto fixo "Namaste World!"; speed 100ms no intervalo.
Dependência: framer-motion.`,
    preview: "text-three",
  },
  {
    id: "animated-text-letters",
    title: "Letras com stagger + sublinhado",
    description: "motion.span por letra; linha com gradiente animada (width/left).",
    prompt: `animated-text.tsx - export AnimatedText; props text, duration, delay, replay, textClassName, underlineGradient.
framer-motion Variants + staggerChildren.`,
    preview: "animated-letters",
  },
  {
    id: "hand-writing-text",
    title: "SVG path desenhado + título",
    description: "motion.path pathLength; título e subtítulo com delay.",
    prompt: `hand-writing-text.tsx - HandWrittenTitle; props title?, subtitle?; stroke currentColor.`,
    preview: "hand-written",
  },
  {
    id: "animated-underline-text-one",
    title: "Título + SVG sublinhado (hover no path)",
    description: "motion.path pathLength; whileHover altera d do path.",
    prompt: `animated-underline-text-one.tsx - AnimatedUnderlineTextOne; props underlinePath, underlineHoverPath, underlineDuration.`,
    preview: "underline-one",
  },
  {
    id: "animated-shiny-text",
    title: "Gradiente animado no texto",
    description: "background linear-gradient + backgroundPosition animado (framer-motion).",
    prompt: `animated-shiny-text.tsx - AnimatedShinyText; gradientColors, gradientAnimationDuration, hoverEffect opcional.`,
    preview: "shiny",
  },
  {
    id: "blurred-stagger-text",
    title: "Letras com blur stagger",
    description: "motion/react; filter blur por letra.",
    prompt: `blurred-stagger-text.tsx - BlurredStagger({ text? }); motion + staggerChildren.`,
    preview: "blurred-stagger",
  },
  {
    id: "shining-text",
    title: "Brilho deslizante (gradiente)",
    description: "backgroundPosition animado em loop linear.",
    prompt: `shining-text.tsx - ShiningText({ text, className? }); motion/react.`,
    preview: "shining",
  },
  {
    id: "animated-underline-css",
    title: "Sublinhado CSS (hover)",
    description: "after: pseudo-elemento com scale-x e origin.",
    prompt: `animated-underline.tsx - AnimatedUnderline; sem deps extra; usa token-primary.`,
    preview: "underline-css",
  },
  {
    id: "infinite-text-marquee",
    title: "Marquee infinito + tooltip opcional",
    description: "motion x loop; Link interno ou <a> externo; tooltip segue cursor.",
    prompt: `infinite-text-marquee.tsx - InfiniteTextMarquee; props speed, fontSize, textColor, hoverColor, showTooltip.
Links externo: https:// com target _blank.`,
    preview: "marquee",
  },
  {
    id: "text-color-neon",
    title: "Três palavras neon (máscara + before)",
    description: "Keyframes em globals.css; ícones Plus nos cantos (lucide-react).",
    prompt: `text-color.tsx - TextColor; classes: animate-gradient-foreground-*, before:animate-gradient-background-*.
Estender globals.css com keyframes e .from-gradient-* / .to-gradient-* (ver projeto).`,
    preview: "text-color",
  },
  {
    id: "reveal-text",
    title: "Letras com imagem no hover + overlay",
    description: "URLs Unsplash padrão por letra; camada overlay após spring.",
    prompt: `reveal-text.tsx - RevealText; props letterImages[], fontSize, letterDelay, overlayDelay.
next.config: remotePatterns para images.unsplash.com.`,
    preview: "reveal",
  },
  {
    id: "vertical-text",
    title: "Texto vertical (writing-mode)",
    description: "vertical-rl + rotate; cn de @/lib/utils.",
    prompt: `vertical-text.tsx - VerticalText (as polimórfico); writingMode vertical-rl.`,
    preview: "vertical",
  },
  {
    id: "interactive-text-particle",
    title: "Partículas do texto (hover repulsão)",
    description: "Canvas 2D; rasterizar texto; partículas regressam ao repouso.",
    prompt: `interactive-text-particle.tsx - InteractiveParticleText; props text, colors, animationForce, particleDensity.
Diferente de particle-text-effect.tsx (palavras + clique direito).`,
    preview: "interactive-particle",
  },
  {
    id: "vaporize-animation-text",
    title: "Texto a vaporizar (canvas)",
    description: "Fases static → vaporizing → fadingIn; ciclo entre texts[].",
    prompt: `vaporize-animation-text.tsx - VaporizeAnimationText({ texts? }); canvas 2D; fundo preto.`,
    preview: "vaporize",
  },
  {
    id: "particle-text-effect",
    title: "Partículas formando palavras (ciclo)",
    description: "Canvas offscreen; palavras alternam; botão direito mata partículas.",
    prompt: `particle-text-effect.tsx - ParticleTextEffect({ words?, className? }); já usado em Heroes; canvas 1000×500.`,
    preview: "particle-effect",
  },
  {
    id: "morphing-cursor-magnetic",
    title: "Círculo magnético (texto alternativo)",
    description: "cursor-none; lerp em requestAnimationFrame; círculo revela hoverText.",
    prompt: `morphing-cursor.tsx - MagneticText; text, hoverText, className.`,
    preview: "magnetic",
  },
  {
    id: "shimmer-text",
    title: "Shimmer em texto (motion)",
    description: "background linear-gradient em currentColor; backgroundPositionX loop.",
    prompt: `shimmer-text.tsx - ShimmerText (default export); variantes de cor; motion/react.`,
    preview: "shimmer",
  },
];

export function PromptLibrary() {
  const [active, setActive] = useState<CategoryId>("library");
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

  const filteredLibraryNavCategories = useMemo(() => {
    if (!deferredQuery.trim()) return promptCategories;
    const q = deferredQuery.toLowerCase();
    return promptCategories.filter((c) => c.label.toLowerCase().includes(q));
  }, [deferredQuery]);

  const browsingFromLibrary =
    active !== "library" &&
    active !== "security" &&
    active !== "hosting" &&
    active !== "speed" &&
    active !== "databases" &&
    active !== "frontend_deploy";

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
            <p className="shrink-0 px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>
            {navCategories.map((cat) => {
              const isActive =
                cat.id === "library"
                  ? active === "library" || browsingFromLibrary
                  : active === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActive(cat.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    isActive && "bg-muted text-foreground font-medium",
                    !isActive && "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <span>{cat.label}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs tabular-nums",
                      isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden px-4 md:px-0">
          <div className="mb-6 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {active !== "library" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-2 mb-1 h-8 gap-1 px-2 text-muted-foreground hover:text-foreground md:hidden"
                  onClick={() => setActive("library")}
                >
                  <ChevronLeft className="size-4" />
                  Biblioteca
                </Button>
              )}
              <p className="text-sm text-muted-foreground">
                {active !== "library" ? (
                  <>
                    Biblioteca /{" "}
                    <span className="font-medium text-foreground">{categoryLabels[active]}</span>
                  </>
                ) : (
                  <span className="font-medium text-foreground">Biblioteca</span>
                )}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
                {categoryLabels[active]}
              </h1>
              {active !== "library" && (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="mt-1 hidden h-auto p-0 text-xs text-muted-foreground md:inline-flex"
                  onClick={() => setActive("library")}
                >
                  <ChevronLeft className="mr-1 size-3" />
                  Voltar à biblioteca
                </Button>
              )}
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

          {active === "library" && (
            <LibraryCatalogPanel
              categories={filteredLibraryNavCategories}
              onPickCategory={(id) => setActive(id as CategoryId)}
            />
          )}

          {active === "security" && <SecurityCheckPanel />}

          {active === "hosting" && <HostingPanel />}

          {active === "speed" && <SpeedPanel />}

          {active === "databases" && <DatabasePanel />}

          {active === "frontend_deploy" && <FrontendDeployPanel />}

          {active !== "heroes" &&
            active !== "backgrounds" &&
            active !== "borders" &&
            active !== "carousels" &&
            active !== "images" &&
            active !== "navigation" &&
            active !== "texts" &&
            active !== "library" &&
            active !== "security" &&
            active !== "hosting" &&
            active !== "speed" &&
            active !== "databases" &&
            active !== "frontend_deploy" && (
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
