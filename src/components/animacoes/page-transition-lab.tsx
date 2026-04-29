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
  const [config, setConfig] = useState<TransitionConfig>({ transition: "right-left", duration: 0.8 });
  const [copied, setCopied] = useState(false);

  const generatedCode = useMemo(() => {
    const motion = getMotionValues(config.transition);
    return `import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial=${motion.initial}
        animate=${motion.animate}
        exit=${motion.exit}
        transition={{ duration: ${config.duration.toFixed(1)}, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}`;
  }, [config.duration, config.transition]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-28">
      <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-xl backdrop-blur md:p-8">
        <h1 className="text-2xl font-semibold md:text-4xl">Animacoes para telas prontas</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">
          Escolha o tipo da transicao e ajuste a duracao. Abaixo voce recebe apenas o prompt e o codigo para aplicar direto nas paginas que ja existem.
        </p>

        <div className="mt-8 grid gap-4 rounded-2xl border border-border/70 bg-background/70 p-4 md:grid-cols-[1.1fr_1fr]">
          <div className="space-y-3">
            <label className="block space-y-1">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Tipo de animacao</span>
              <select
                value={config.transition}
                onChange={(event) => setConfig((prev) => ({ ...prev, transition: event.target.value as TransitionKey }))}
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
                onChange={(event) => setConfig((prev) => ({ ...prev, duration: Number(event.target.value) }))}
                className="w-full accent-primary"
              />
            </label>
            <p className="text-xs text-muted-foreground">{TRANSITION_OPTIONS.find((item) => item.value === config.transition)?.description}</p>
          </div>

          <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">Prompt</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{getPrompt(config)}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">Codigo da animacao</p>
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

