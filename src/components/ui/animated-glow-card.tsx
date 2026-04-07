"use client";

import type { ReactNode } from "react";

const GLOW_STYLES = `
.card-canvas { position: relative; display: inline-block; }
.card-canvas .card-backdrop {
  position: absolute; inset: -20px; z-index: 0; border-radius: inherit;
  background: radial-gradient(ellipse at center, rgba(99,102,241,0.15), transparent 70%);
  filter: blur(24px); pointer-events: none;
}
.glow-card {
  position: relative; z-index: 1; overflow: hidden; border-radius: 1rem;
  background: rgba(15,15,20,0.85); backdrop-filter: blur(12px);
}
.glow-card .card-content { position: relative; z-index: 5; }
.glow-card .border-element {
  position: absolute; z-index: 2; pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
  filter: url(#unopaq);
}
.glow-card .border-left { left: 0; top: 8%; bottom: 8%; width: 2px; }
.glow-card .border-right { right: 0; top: 8%; bottom: 8%; width: 2px; }
.glow-card .border-top { top: 0; left: 8%; right: 8%; height: 2px; background: linear-gradient(180deg, transparent, rgba(255,255,255,0.35), transparent); }
.glow-card .border-bottom { bottom: 0; left: 8%; right: 8%; height: 2px; background: linear-gradient(180deg, transparent, rgba(255,255,255,0.35), transparent); }
`;

export function GlowCardCanvas({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOW_STYLES }} />
      <div className={`card-canvas ${className}`}>
        <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
          <filter width="300%" x="-100%" height="300%" y="-100%" id="unopaq">
            <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0" />
          </filter>
        </svg>
        <div className="card-backdrop" />
        {children}
      </div>
    </>
  );
}

export function GlowCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glow-card ${className}`}>
      <div className="border-element border-left" />
      <div className="border-element border-right" />
      <div className="border-element border-top" />
      <div className="border-element border-bottom" />
      <div className="card-content">{children}</div>
    </div>
  );
}
