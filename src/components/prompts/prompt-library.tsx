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
import { SeoGuiaPratico } from "@/components/biblioteca/seo-guia-pratico";

import {
  heroPrompts,
  backgroundPrompts,
  borderPrompts,
  clientCarouselPrompts,
  imagePrompts,
  navigationPrompts,
  textPrompts,
  scrollPrompts,
} from "@/lib/biblioteca/library-prompt-entries";

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
  | "scroll";

type CategoryId =
  | PromptCategoryId
  | "library"
  | "seo"
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
  { id: "scroll", label: "Scroll", count: 9 },
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
  { id: "seo", label: "SEO", count: 6 },
  { id: "security", label: "Segurança", count: SECURITY_ENV_CHECKS_COUNT },
  { id: "hosting", label: "Hospedagem", count: HOSTING_TOPIC_COUNT },
  { id: "speed", label: "Velocidade", count: SPEED_TOPIC_COUNT },
  { id: "databases", label: "Bancos de dados", count: DATABASE_PANEL_SECTION_COUNT },
  { id: "frontend_deploy", label: "Deploy front-end", count: FRONTEND_DEPLOY_PIPELINE_STEPS },
];

const categoryLabels: Record<CategoryId, string> = {
  heroes: "Heroes",
  backgrounds: "Backgrounds",
  borders: "Borders",
  carousels: "Carrossel para clientes",
  images: "Imagens",
  navigation: "Navigation Menus",
  texts: "Textos",
  scroll: "Scroll",
  library: "Biblioteca",
  seo: "SEO",
  security: "Segurança",
  hosting: "Hospedagem",
  speed: "Velocidade",
  databases: "Bancos de dados",
  frontend_deploy: "Deploy front-end",
};

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

  const filteredScroll = useMemo(() => {
    if (!deferredQuery.trim()) return scrollPrompts;
    const q = deferredQuery.toLowerCase();
    return scrollPrompts.filter(
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
    active !== "seo" &&
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
                      <div className="rounded-xl border border-border/80 bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap break-words">
                        {item.prompt}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full rounded-full"
                          onClick={() => alert(item.prompt)}
                        >
                          Ver código
                        </Button>
                      </div>
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

          {active === "scroll" && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredScroll.map((item) => (
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
                      <div className="flex flex-col gap-2">
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
                        {item.code ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full rounded-full"
                            onClick={() => copyPrompt(item.code!, `${item.id}-code`)}
                          >
                            <Copy className="mr-2 size-4" />
                            {copiedId === `${item.id}-code` ? "Código copiado!" : "Copiar código"}
                          </Button>
                        ) : null}
                      </div>
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

          {active === "seo" && <SeoGuiaPratico />}

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
            active !== "scroll" &&
            active !== "library" &&
            active !== "seo" &&
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
