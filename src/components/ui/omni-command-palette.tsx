"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowDown,
  ArrowUp,
  ChevronRight,
  Command,
  CornerDownLeft,
  ExternalLink,
  History,
  Loader2,
  Moon,
  Pin,
  Search,
  Sun,
  X,
} from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export type OmniItem = {
  id: string;
  label: string;
  groupId: string;
  subtitle?: string;
  href?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  pinned?: boolean;
  disabled?: boolean;
  keywords?: string[];
  onAction?: () => void;
};

export type OmniSource = {
  id: string;
  label: string;
  fetch: (query: string) => Promise<OmniItem[]> | OmniItem[];
  emptyHint?: React.ReactNode;
  minQuery?: number;
};

type RecentEntry = Pick<OmniItem, "id" | "label" | "groupId" | "href" | "shortcut">;

export type OmniCommandPaletteProps = {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  sources: OmniSource[];
  placeholder?: string;
  storageKey?: string;
  showRecents?: boolean;
  maxRecents?: number;
  showPinnedFirst?: boolean;
  className?: string;
  contentClassName?: string;
  debounceMs?: number;
  onItemExecuted?: (item: OmniItem) => void;
  renderItem?: (item: OmniItem, active: boolean) => React.ReactNode;
  renderHeader?: (query: string) => React.ReactNode;
  renderFooter?: (activeItem: OmniItem | null) => React.ReactNode;
  openKeys?: Array<{ key: string; meta?: boolean; ctrl?: boolean; alt?: boolean; shift?: boolean }>;
  portalContainer?: HTMLElement | null;
};

const DEFAULT_OPEN_KEYS = [{ key: "k", meta: true }, { key: "k", ctrl: true }];
const DEFAULT_PLACEHOLDER = "Buscar comandos, páginas…";
const DEFAULT_STORAGE_KEY = "omni:recents";
const DEFAULT_DEBOUNCE = 120;
const DEFAULT_MAX_RECENTS = 8;

type ScoredItem = OmniItem & { _score: number; _indices: number[] };

function fuzzyScore(query: string, text: string, keywords: string[] = []) {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();
  if (!q) return { score: 0, indices: [] as number[] };
  let score = 0;
  const indices: number[] = [];
  const idx = t.indexOf(q);
  if (idx >= 0) {
    score += 100 + Math.max(0, 20 - idx);
    for (let i = 0; i < q.length; i++) indices.push(idx + i);
  } else {
    let tPos = 0;
    let chain = 0;
    for (let i = 0; i < q.length; i++) {
      const c = q[i];
      const found = t.indexOf(c, tPos);
      if (found === -1) {
        score -= 5;
      } else {
        indices.push(found);
        if (found === tPos) chain += 2;
        else chain = 0;
        score += 2 + chain;
        tPos = found + 1;
        if (found === 0 || /\s|-|_|\/|\./.test(text[found - 1] ?? "")) score += 3;
      }
    }
  }
  for (const k of keywords) {
    const kk = k.toLowerCase();
    if (kk.includes(q) || q.includes(kk)) score += 8;
  }
  return { score, indices: Array.from(new Set(indices)).sort((a, b) => a - b) };
}

function useDebouncedValue<T>(value: T, delay = DEFAULT_DEBOUNCE) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

function renderHighlighted(label: string, indices: number[]) {
  if (!indices.length) return label;
  const out: React.ReactNode[] = [];
  let pos = 0;
  while (pos < label.length) {
    if (indices.includes(pos)) {
      let run = "";
      let p = pos;
      while (p < label.length && indices.includes(p)) {
        run += label[p];
        p++;
      }
      out.push(
        <mark key={`m-${pos}`} className="rounded-[2px] bg-accent/60 px-0.5 text-inherit">
          {run}
        </mark>,
      );
      pos = p;
    } else {
      out.push(<React.Fragment key={`t-${pos}`}>{label[pos]}</React.Fragment>);
      pos++;
    }
  }
  return out;
}

function useIsDarkMode() {
  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const compute = () => {
      if (root.classList.contains("dark") || body.classList.contains("dark")) return true;
      if (root.classList.contains("light") || body.classList.contains("light")) return false;
      return !!mql?.matches;
    };
    setIsDark(compute());
    const onMql = () => setIsDark(compute());
    const obs = new MutationObserver(() => setIsDark(compute()));
    mql?.addEventListener?.("change", onMql);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    obs.observe(body, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mql?.removeEventListener?.("change", onMql);
      obs.disconnect();
    };
  }, []);
  return isDark;
}

function ThemeIndicator() {
  const dark = useIsDarkMode();
  return (
    <div className="inline-flex items-center gap-1 rounded px-2 py-1 text-muted-foreground">
      {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
      <span>{dark ? "Escuro" : "Claro"}</span>
    </div>
  );
}

export function OmniCommandPalette({
  open: controlledOpen,
  onOpenChange,
  sources,
  placeholder = DEFAULT_PLACEHOLDER,
  storageKey = DEFAULT_STORAGE_KEY,
  showRecents = true,
  maxRecents = DEFAULT_MAX_RECENTS,
  showPinnedFirst = true,
  className,
  contentClassName,
  debounceMs = DEFAULT_DEBOUNCE,
  onItemExecuted,
  renderItem,
  renderHeader,
  renderFooter,
  openKeys = DEFAULT_OPEN_KEYS,
  portalContainer,
}: OmniCommandPaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, debounceMs);

  const [loadingIds, setLoadingIds] = React.useState<Set<string>>(new Set());
  const [results, setResults] = React.useState<Record<string, OmniItem[]>>({});
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const [recents, setRecents] = React.useState<RecentEntry[]>([]);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setRecents(JSON.parse(raw) as RecentEntry[]);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const openRef = React.useRef(open);
  openRef.current = open;

  function setOpen(v: boolean) {
    if (controlledOpen === undefined) setUncontrolledOpen(v);
    onOpenChange?.(v);
  }

  const setOpenRef = React.useRef(setOpen);
  setOpenRef.current = setOpen;

  React.useEffect(() => {
    const keys = openKeys ?? DEFAULT_OPEN_KEYS;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && openRef.current) {
        e.preventDefault();
        setOpenRef.current(false);
        return;
      }
      for (const kb of keys) {
        const match =
          e.key.toLowerCase() === kb.key.toLowerCase() &&
          !!kb.meta === e.metaKey &&
          !!kb.ctrl === e.ctrlKey &&
          !!kb.alt === e.altKey &&
          !!kb.shift === e.shiftKey;
        if (match) {
          e.preventDefault();
          setOpenRef.current(!openRef.current);
          return;
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openKeys]);

  React.useEffect(() => {
    let cancelled = false;
    async function go() {
      const q = debouncedQuery;
      const next: Record<string, OmniItem[]> = {};
      for (const src of sources) {
        if (q.length < (src.minQuery ?? 0)) {
          next[src.id] = [];
          continue;
        }
        const mark = (on: boolean) =>
          setLoadingIds((prev) => {
            const copy = new Set(prev);
            if (on) copy.add(src.id);
            else copy.delete(src.id);
            return copy;
          });
        try {
          mark(true);
          const raw = await src.fetch(q);
          next[src.id] = Array.isArray(raw) ? raw : [];
        } catch {
          next[src.id] = [];
        } finally {
          mark(false);
        }
      }
      if (!cancelled) {
        setResults(next);
        setActiveId(null);
      }
    }
    go();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, sources]);

  const groups = React.useMemo(() => {
    const q = debouncedQuery.trim();
    const out: Array<{ id: string; label: string; items: ScoredItem[] }> = [];
    const sourceById = new Map(sources.map((s) => [s.id, s] as const));
    const pinned: OmniItem[] = [];

    for (const [sid, items] of Object.entries(results)) {
      const srcMeta = sourceById.get(sid);
      if (!srcMeta) continue;
      let arr: ScoredItem[] = (items ?? []).map((item) => {
        const { score, indices } = fuzzyScore(q, item.label, item.keywords ?? []);
        return { ...item, _score: q ? score : 0, _indices: q ? indices : [] };
      });

      if (!q && showPinnedFirst) {
        for (const it of arr) {
          if (it.pinned && !it.disabled) pinned.push(it);
        }
        arr = arr.filter((i) => !i.pinned);
      }

      if (q) arr.sort((a, b) => b._score - a._score || a.label.localeCompare(b.label));
      else arr.sort((a, b) => a.label.localeCompare(b.label));

      out.push({ id: sid, label: srcMeta.label, items: arr });
    }

    const final: typeof out = [];
    if (!debouncedQuery && showPinnedFirst && pinned.length) {
      final.push({
        id: "__pinned",
        label: "Fixados",
        items: pinned.map((p) => ({ ...p, _score: 0, _indices: [] })),
      });
    }
    if (!debouncedQuery && showRecents && recents.length) {
      final.push({
        id: "__recents",
        label: "Recentes",
        items: recents.map(
          (r) =>
            ({
              id: r.id,
              label: r.label,
              subtitle: "Usado recentemente",
              groupId: r.groupId,
              href: r.href,
              shortcut: r.shortcut,
              _score: 0,
              _indices: [],
            }) as ScoredItem,
        ),
      });
    }
    final.push(...out);
    return final;
  }, [results, sources, debouncedQuery, showPinnedFirst, showRecents, recents]);

  const flatItems = React.useMemo(() => groups.flatMap((g) => g.items), [groups]);

  React.useEffect(() => {
    if (open && flatItems.length && activeId === null) {
      setActiveId(flatItems[0]!.id);
    }
  }, [open, flatItems, activeId]);

  const activeIndex = React.useMemo(() => {
    if (!activeId) return -1;
    return flatItems.findIndex((i) => i.id === activeId);
  }, [activeId, flatItems]);

  function moveActive(delta: number) {
    if (!flatItems.length) return;
    let next = activeIndex + delta;
    if (next < 0) next = flatItems.length - 1;
    if (next >= flatItems.length) next = 0;
    setActiveId(flatItems[next]!.id);
    const node = listRef.current?.querySelector<HTMLElement>(`[data-id="${flatItems[next]!.id}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }

  function execute(item: OmniItem) {
    try {
      const entry: RecentEntry = {
        id: item.id,
        label: item.label,
        groupId: item.groupId,
        href: item.href,
        shortcut: item.shortcut,
      };
      const next = [entry, ...recents.filter((r) => r.id !== entry.id)].slice(0, maxRecents);
      setRecents(next);
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    item.onAction?.();
    if (item.href) {
      if (item.href.startsWith("http")) window.open(item.href, "_blank", "noopener");
      else window.location.href = item.href;
    }
    onItemExecuted?.(item);
    setOpen(false);
  }

  React.useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
    setQuery("");
    setActiveId(null);
    return undefined;
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal container={portalContainer ?? undefined}>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-label="Paleta de comandos"
          className={cn(
            "fixed inset-x-2 top-16 z-[101] mx-auto w-[min(720px,100%-16px)] rounded-xl border border-border bg-popover text-popover-foreground shadow-lg backdrop-blur-md outline-none",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            contentClassName,
          )}
        >
          <div className="border-b border-border">
            {renderHeader ? (
              renderHeader(query)
            ) : (
              <div className="flex items-center gap-2 px-3 py-2">
                <Search className="size-4 text-muted-foreground" aria-hidden />
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded
                  aria-controls="omni-listbox"
                  aria-activedescendant={activeId ? `omni-item-${activeId}` : undefined}
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      moveActive(1);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      moveActive(-1);
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      if (activeIndex >= 0) execute(flatItems[activeIndex]!);
                    }
                  }}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</kbd>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    aria-label="Fechar"
                    className="ml-2 rounded p-1 text-muted-foreground hover:bg-muted"
                  >
                    <X className="size-4" />
                  </button>
                </Dialog.Close>
              </div>
            )}
          </div>

          <div
            id="omni-listbox"
            role="listbox"
            aria-label="Resultados"
            className={cn("max-h-[60vh] overflow-auto p-1", className)}
            ref={listRef}
          >
            {loadingIds.size > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" aria-hidden />
                A carregar…
              </div>
            )}

            {groups.map((g) => (
              <div key={g.id} className="py-1">
                {g.items.length > 0 && (
                  <div className="px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {g.label}
                  </div>
                )}
                <div className="flex flex-col">
                  {g.items.map((item) => {
                    const active = item.id === activeId;
                    return (
                      <button
                        key={item.id}
                        id={`omni-item-${item.id}`}
                        data-id={item.id}
                        type="button"
                        role="option"
                        aria-selected={active}
                        disabled={item.disabled}
                        onMouseEnter={() => setActiveId(item.id)}
                        onFocus={() => setActiveId(item.id)}
                        onClick={() => !item.disabled && execute(item)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm",
                          active ? "bg-accent/60 text-accent-foreground" : "hover:bg-accent/40",
                          item.disabled && "cursor-not-allowed opacity-50",
                        )}
                      >
                        {renderItem ? (
                          renderItem(item, active)
                        ) : (
                          <>
                            <div className="shrink-0 text-muted-foreground">{item.icon ?? <Command className="size-4" />}</div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate">{renderHighlighted(item.label, item._indices)}</div>
                              {item.subtitle ? (
                                <div className="truncate text-xs text-muted-foreground">{item.subtitle}</div>
                              ) : null}
                            </div>
                            {item.pinned ? <Pin className="size-3.5 text-muted-foreground" aria-hidden /> : null}
                            {item.href ? <ExternalLink className="size-3.5 text-muted-foreground" aria-hidden /> : null}
                            {item.shortcut ? (
                              <span className="ml-2 hidden items-center gap-1 text-[10px] text-muted-foreground sm:flex">
                                {item.shortcut.map((s, i) => (
                                  <kbd key={i} className="rounded bg-muted px-1 py-0.5">
                                    {s}
                                  </kbd>
                                ))}
                              </span>
                            ) : null}
                            <ChevronRight className="ml-1 size-3.5 opacity-0 group-hover:opacity-100" aria-hidden />
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
                {g.items.length === 0 && debouncedQuery ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground">Sem resultados em {g.label}.</div>
                ) : null}
              </div>
            ))}

            {flatItems.length === 0 && !loadingIds.size ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                <div className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-muted">
                  <History className="size-4" />
                </div>
                Experimente outro termo.
              </div>
            ) : null}
          </div>

          <div className="border-t border-border">
            {renderFooter ? (
              renderFooter(activeIndex >= 0 ? flatItems[activeIndex]! : null)
            ) : (
              <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <span className="flex items-center gap-1">
                    <CornerDownLeft className="size-3" /> selecionar
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowUp className="size-3" />
                    <ArrowDown className="size-3" /> navegar
                  </span>
                </div>
                <ThemeIndicator />
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
