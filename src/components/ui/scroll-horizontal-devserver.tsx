"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type { CSSProperties } from "react";
import { useRef } from "react";
import {
  LibraryConceptPreview,
  type LibraryConceptTone,
} from "@/components/prompts/library-concept-preview";

type ShowcaseItem = {
  id: number;
  color: string;
  label: string;
  /** Mesmo padrão da biblioteca: seed + tom definem a prévia abstrata. */
  seed: string;
  tone: LibraryConceptTone;
};

const items: ShowcaseItem[] = [
  { id: 1, color: "#5bf68b", label: "Landing de Conversao", seed: "vitrine-landing-conversao", tone: "hero" },
  { id: 2, color: "#7ee8ff", label: "Painel de Gestao", seed: "vitrine-painel-gestao", tone: "navigation" },
  { id: 3, color: "#c38bff", label: "App Comercial", seed: "vitrine-app-comercial", tone: "carousel" },
  { id: 4, color: "#60a5fa", label: "Site Institucional", seed: "vitrine-site-institucional", tone: "background" },
  { id: 5, color: "#22d3ee", label: "Sistema com IA", seed: "vitrine-sistema-ia", tone: "image" },
];

const ITEM_WIDTH = 400;
const GAP = 30;

/** Scroll horizontal com efeito sticky para vitrine DevServer. */
export default function ScrollHorizontalDevServer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const totalDistance = (items.length - 1) * (ITEM_WIDTH + GAP);
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

  return (
    <section id="planos" className="mx-auto w-full max-w-6xl px-4 pb-0">
      <div className="sh-intro">
        <p className="sh-kicker">Vitrine DevServer</p>
        <h2 className="sh-impact">Projetos que vendem</h2>
      </div>

      <div ref={containerRef} className="sh-scroll-container">
        <div className="sh-sticky-wrapper">
          <motion.div className="sh-gallery" style={{ x }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="sh-gallery-item"
                style={
                  {
                    "--item-color": item.color,
                  } as CSSProperties
                }
              >
                <div className="sh-gallery-visual">
                  <LibraryConceptPreview
                    seed={item.seed}
                    tone={item.tone}
                    className="h-full w-full min-h-full rounded-none border-0"
                  />
                </div>
                <div className="sh-item-content">
                  <span className="sh-item-number">{String(item.id).padStart(2, "0")}</span>
                  <h3>{item.label}</h3>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        .sh-intro {
          height: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          text-align: center;
          padding-bottom: 0;
          overflow: hidden;
        }

        .sh-kicker {
          margin: 0;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          color: color-mix(in oklab, var(--foreground), transparent 45%);
          font-weight: 600;
        }

        .sh-impact {
          margin: 0;
          font-size: clamp(30px, 7vw, 62px);
          line-height: 1;
          color: var(--foreground);
        }

        .sh-scroll-container {
          height: 74vh;
          position: relative;
        }

        .sh-sticky-wrapper {
          position: sticky;
          top: 0;
          height: 40vh;
          width: 400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          overflow: visible;
        }

        .sh-gallery {
          display: flex;
          gap: ${GAP}px;
          will-change: transform;
        }

        .sh-gallery-visual {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .sh-gallery-item {
          flex-shrink: 0;
          width: ${ITEM_WIDTH}px;
          height: 500px;
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          border: 1px solid color-mix(in oklab, var(--foreground), transparent 85%);
        }

        .sh-gallery-item::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 45%, var(--item-color));
          mix-blend-mode: multiply;
        }

        .sh-gallery-item::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent 45%);
        }

        .sh-item-content {
          position: absolute;
          bottom: 24px;
          left: 24px;
          z-index: 2;
        }

        .sh-item-number {
          font-size: 12px;
          color: var(--item-color);
          font-family: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace;
          display: block;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .sh-gallery-item h3 {
          font-size: 26px;
          font-weight: 700;
          color: #f5f5f5;
          margin: 0;
        }

        @media (max-width: 600px) {
          .sh-sticky-wrapper {
            width: 280px;
          }

          .sh-gallery {
            gap: 15px;
          }

          .sh-gallery-item {
            width: 280px;
            height: 350px;
          }
        }

      `}</style>
    </section>
  );
}
