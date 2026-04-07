"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  tabs?: Tab[];
  defaultTab?: string;
  className?: string;
}

const defaultTabs: Tab[] = [
  {
    id: "visao-geral",
    label: "Visão geral",
    content: (
      <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
          alt="Painel do sistema"
          className="!m-0 h-60 w-full rounded-lg border-none object-cover shadow-[0_0_20px_rgba(0,0,0,0.2)]"
        />
        <div className="flex flex-col gap-y-2">
          <h2 className="!m-0 mt-0 mb-0 text-2xl font-bold text-foreground">Plataforma completa</h2>
          <p className="mt-0 text-sm text-muted-foreground">
            Um sistema moderno para centralizar processos, acompanhar desempenho e dar clareza para decisões do dia a dia.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "automacoes",
    label: "Automações",
    content: (
      <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
          alt="Automação e produtividade"
          className="!m-0 h-60 w-full rounded-lg border-none object-cover shadow-[0_0_20px_rgba(0,0,0,0.2)]"
        />
        <div className="flex flex-col gap-y-2">
          <h2 className="!m-0 mt-0 mb-0 text-2xl font-bold text-foreground">Fluxos automatizados</h2>
          <p className="mt-0 text-sm text-muted-foreground">
            Reduza tarefas manuais, elimine retrabalho e aumente produtividade com etapas automáticas e acompanhamento em tempo real.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "crescimento",
    label: "Crescimento",
    content: (
      <div className="grid h-full w-full grid-cols-1 gap-4 md:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
          alt="Crescimento com dados"
          className="!m-0 h-60 w-full rounded-lg border-none object-cover shadow-[0_0_20px_rgba(0,0,0,0.2)]"
        />
        <div className="flex flex-col gap-y-2">
          <h2 className="!m-0 mt-0 mb-0 text-2xl font-bold text-foreground">Escala com segurança</h2>
          <p className="mt-0 text-sm text-muted-foreground">
            Estrutura preparada para crescer com seu negócio, mantendo performance, estabilidade e experiência profissional.
          </p>
        </div>
      </div>
    ),
  },
];

const AnimatedTabs = ({ tabs = defaultTabs, defaultTab, className }: AnimatedTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id);

  if (!tabs?.length) return null;

  return (
    <div className={cn("flex w-full max-w-2xl flex-col gap-y-1", className)}>
      <div className="flex flex-wrap gap-2 rounded-xl border border-border/70 bg-card/70 p-1 backdrop-blur">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative rounded-lg px-3 py-1.5 text-sm font-medium text-foreground outline-none transition-colors"
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 !rounded-lg border border-primary/30 bg-primary/15 shadow-[0_0_20px_rgba(59,130,246,0.22)]"
                transition={{ type: "spring", duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="h-full min-h-60 rounded-xl border border-border/70 bg-card/70 p-4 text-foreground shadow-[0_0_20px_rgba(0,0,0,0.12)] backdrop-blur">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, scale: 0.95, x: -10, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, x: -10, filter: "blur(10px)" }}
                transition={{ duration: 0.5, ease: "circInOut", type: "spring" }}
              >
                {tab.content}
              </motion.div>
            ),
        )}
      </div>
    </div>
  );
};

export { AnimatedTabs };
