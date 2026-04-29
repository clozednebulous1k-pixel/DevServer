"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type TransitionKey =
  | "top-down"
  | "bottom-up"
  | "left-right"
  | "right-left"
  | "zoom-in"
  | "zoom-out"
  | "fade";

type TransitionConfig = {
  id: string;
  fromPage: number;
  toPage: number;
  transition: TransitionKey;
  duration: number;
};

const TRANSITION_OPTIONS: Array<{ value: TransitionKey; label: string; description: string }> = [
  { value: "top-down", label: "De cima para baixo", description: "A próxima tela entra de cima para baixo." },
  { value: "bottom-up", label: "De baixo para cima", description: "A próxima tela entra de baixo para cima." },
  { value: "left-right", label: "Da esquerda para direita", description: "A próxima tela entra da esquerda para a direita." },
  { value: "right-left", label: "Da direita para esquerda", description: "A próxima tela entra da direita para a esquerda." },
  { value: "zoom-in", label: "Zoom aproximando", description: "A próxima tela cresce suavemente até ocupar o frame." },
  { value: "zoom-out", label: "Zoom afastando", description: "A tela atual afasta e revela a próxima." },
  { value: "fade", label: "Fade suave", description: "Transição limpa por opacidade entre as telas." },
];

function getPrompt(config: TransitionConfig): string {
  const option = TRANSITION_OPTIONS.find((item) => item.value === config.transition);
  return `Apply a "${option?.label}" transition in already existing pages. Duration: ${config.duration.toFixed(1)}s, easing: "easeInOut". Keep good readability and smooth motion between route changes.`;
}

function getMotionValues(transition: TransitionKey) {
  switch (transition) {
    case "top-down":
      return { initial: "{ y: -80, opacity: 0 }", animate: "{ y: 0, opacity: 1 }", exit: "{ y: 80, opacity: 0 }" };
    case "bottom-up":
      return { initial: "{ y: 80, opacity: 0 }", animate: "{ y: 0, opacity: 1 }", exit: "{ y: -80, opacity: 0 }" };
    case "left-right":
      return { initial: "{ x: -80, opacity: 0 }", animate: "{ x: 0, opacity: 1 }", exit: "{ x: 80, opacity: 0 }" };
    case "right-left":
      return { initial: "{ x: 80, opacity: 0 }", animate: "{ x: 0, opacity: 1 }", exit: "{ x: -80, opacity: 0 }" };
    case "zoom-in":
      return { initial: "{ scale: 0.9, opacity: 0 }", animate: "{ scale: 1, opacity: 1 }", exit: "{ scale: 1.06, opacity: 0 }" };
    case "zoom-out":
      return { initial: "{ scale: 1.08, opacity: 0 }", animate: "{ scale: 1, opacity: 1 }", exit: "{ scale: 0.9, opacity: 0 }" };
    default:
      return { initial: "{ opacity: 0 }", animate: "{ opacity: 1 }", exit: "{ opacity: 0 }" };
  }
}

export function PageTransitionLab() {
  const [configs, setConfigs] = useState<TransitionConfig[]>([
    { id: "t-1", fromPage: 1, toPage: 2, transition: "right-left", duration: 0.8 },
    { id: "t-2", fromPage: 2, toPage: 3, transition: "top-down", duration: 0.9 },
    { id: "t-3", fromPage: 3, toPage: 4, transition: "fade", duration: 0.8 },
  ]);
  const [copied, setCopied] = useState(false);
  const [rowPreviewTick, setRowPreviewTick] = useState<Record<string, number>>({});

  const totalPages = configs.length + 1;

  const addPage = () => {
    setConfigs((prev) => {
      const fromPage = prev.length + 1;
      return [...prev, { id: `t-${crypto.randomUUID()}`, fromPage, toPage: fromPage + 1, transition: "fade", duration: 0.8 }];
    });
  };

  const removePage = () => {
    setConfigs((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1).map((cfg, index) => ({ ...cfg, fromPage: index + 1, toPage: index + 2 }));
    });
  };

  const updateConfig = <K extends keyof TransitionConfig>(id: string, key: K, value: TransitionConfig[K]) => {
    setConfigs((prev) => prev.map((cfg) => (cfg.id === id ? { ...cfg, [key]: value } : cfg)));
  };

  const playRowPreview = (id: string) => {
    setRowPreviewTick((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const generatedCode = useMemo(() => {
    const mapLines = configs
      .map((cfg) => `  "${cfg.fromPage}-${cfg.toPage}": { transition: "${cfg.transition}", duration: ${cfg.duration.toFixed(1)} },`)
      .join("\n");
    return `import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const transitions = {
${mapLines}
} as const;

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [from, to] = pathname.split("|"); // adapte para sua chave de rota
  const key = \`\${from}-\${to}\` as keyof typeof transitions;
  const transition = transitions[key] ?? { transition: "fade", duration: 0.8 };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={getMotionValuesFromKey(transition.transition).initial}
        animate={getMotionValuesFromKey(transition.transition).animate}
        exit={getMotionValuesFromKey(transition.transition).exit}
        transition={{ duration: transition.duration, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function getMotionValuesFromKey(key: string) {
  switch (key) {
    case "top-down": return { initial: { y: -80, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 80, opacity: 0 } };
    case "bottom-up": return { initial: { y: 80, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -80, opacity: 0 } };
    case "left-right": return { initial: { x: -80, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 80, opacity: 0 } };
    case "right-left": return { initial: { x: 80, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -80, opacity: 0 } };
    case "zoom-in": return { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 1.06, opacity: 0 } };
    case "zoom-out": return { initial: { scale: 1.08, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 } };
    default: return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
  }
}`;
  }, [configs]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28">
      <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-xl backdrop-blur md:p-8">
        <h1 className="text-2xl font-semibold md:text-4xl">Construtor de animacoes para telas prontas</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
          Adicione telas, defina as transicoes entre elas e veja a visualizacao. No final, copie o prompt e o codigo para aplicar nas paginas prontas.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" variant="outline" className="rounded-full" onClick={addPage}>
            Adicionar tela
          </Button>
          <Button type="button" variant="outline" className="rounded-full" onClick={removePage} disabled={totalPages <= 2}>
            Remover tela
          </Button>
          <span className="self-center text-xs text-muted-foreground">Total de telas: {totalPages}</span>
        </div>

        <div className="mt-8 grid gap-4">
          {configs.map((config) => {
            const option = TRANSITION_OPTIONS.find((item) => item.value === config.transition);
            const motion = getMotionValues(config.transition);
            return (
              <article key={config.id} className="grid gap-4 rounded-2xl border border-border/70 bg-background/70 p-4 md:grid-cols-[1.15fr_1fr]">
                <div className="space-y-3">
                  <p className="text-sm font-semibold">
                    Tela {config.fromPage} {"->"} Tela {config.toPage}
                  </p>
                  <label className="block space-y-1">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">Tipo de animacao</span>
                    <select
                      value={config.transition}
                      onChange={(event) => updateConfig(config.id, "transition", event.target.value as TransitionKey)}
                      className="h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none ring-primary/20 focus:ring-2"
                    >
                      {TRANSITION_OPTIONS.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">Duracao ({config.duration.toFixed(1)}s)</span>
                    <input
                      type="range"
                      min={0.3}
                      max={2}
                      step={0.1}
                      value={config.duration}
                      onChange={(event) => updateConfig(config.id, "duration", Number(event.target.value))}
                      className="w-full accent-primary"
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">{option?.description}</p>
                </div>

                <div className="space-y-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">Prompt</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{getPrompt(config)}</p>
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Visualizacao</p>
                      <Button type="button" size="sm" variant="secondary" className="h-7 rounded-full px-3 text-[11px]" onClick={() => playRowPreview(config.id)}>
                        Ver animacao
                      </Button>
                    </div>
                    <div className="relative h-24 overflow-hidden rounded-lg border border-border/80 bg-black/65">
                      <div className="absolute inset-0 flex items-center justify-center text-xs text-white/75">Tela {config.fromPage}</div>
                      <div
                        key={`${config.id}-${rowPreviewTick[config.id] ?? 0}`}
                        className="absolute inset-0 flex items-center justify-center text-xs text-white"
                        style={{
                          animation: `fadeIn ${config.duration}s ease-in-out forwards`,
                          transform:
                            config.transition === "left-right"
                              ? "translateX(-100%)"
                              : config.transition === "right-left"
                                ? "translateX(100%)"
                                : config.transition === "top-down"
                                  ? "translateY(-100%)"
                                  : config.transition === "bottom-up"
                                    ? "translateY(100%)"
                                    : config.transition === "zoom-in"
                                      ? "scale(0.85)"
                                      : config.transition === "zoom-out"
                                        ? "scale(1.12)"
                                        : "translateX(0)",
                          opacity: 0,
                        }}
                      >
                        Tela {config.toPage}
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">initial: {motion.initial}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">Codigo da animacao (mapa completo)</p>
          <pre className="max-h-96 overflow-auto rounded-2xl border border-border bg-black/90 p-4 text-xs leading-relaxed text-emerald-200">
            <code>{generatedCode}</code>
          </pre>
          <Button type="button" variant="outline" className="mt-3 rounded-full" onClick={copyCode}>
            {copied ? "Codigo copiado!" : "Copiar codigo"}
          </Button>
          </div>
      </div>
    </section>
  );
}

