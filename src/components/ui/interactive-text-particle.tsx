"use client";

import React, { useEffect, useRef, useState } from "react";

interface Pointer {
  x?: number;
  y?: number;
}

interface Particle {
  ox: number;
  oy: number;
  cx: number;
  cy: number;
  or: number;
  cr: number;
  pv: number;
  ov: number;
  f: number;
  rgb: number[];
}

interface TextBox {
  str: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

export interface InteractiveParticleTextProps {
  text?: string;
  colors?: string[];
  className?: string;
  animationForce?: number;
  particleDensity?: number;
}

function rand(max = 1, min = 0, dec = 0): number {
  return +(min + Math.random() * (max - min)).toFixed(dec);
}

class HoverParticle implements Particle {
  ox: number;
  oy: number;
  cx: number;
  cy: number;
  or: number;
  cr: number;
  pv: number;
  ov: number;
  f: number;
  rgb: number[];

  constructor(
    x: number,
    y: number,
    animationForce: number,
    rgb: number[] = [rand(128), rand(128), rand(128)],
  ) {
    this.ox = x;
    this.oy = y;
    this.cx = x;
    this.cy = y;
    this.or = rand(5, 1);
    this.cr = this.or;
    this.pv = 0;
    this.ov = 0;
    this.f = rand(animationForce + 15, animationForce - 15);
    this.rgb = rgb.map((c) => Math.max(0, c + rand(13, -13)));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = `rgb(${this.rgb.join(",")})`;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.cr, 0, 2 * Math.PI);
    ctx.fill();
  }

  move(
    ctx: CanvasRenderingContext2D,
    interactionRadius: number,
    hasPointer: boolean,
    pointer: Pointer,
  ) {
    if (hasPointer && pointer.x !== undefined && pointer.y !== undefined) {
      const dx = this.cx - pointer.x;
      const dy = this.cy - pointer.y;
      const dist = Math.hypot(dx, dy);
      if (dist < interactionRadius && dist > 0) {
        const force = Math.min(this.f, ((interactionRadius - dist) / dist) * 2);
        this.cx += (dx / dist) * force;
        this.cy += (dy / dist) * force;
      }
    }

    const odx = this.ox - this.cx;
    const ody = this.oy - this.cy;
    const od = Math.hypot(odx, ody);

    if (od > 1) {
      const restore = Math.min(od * 0.1, 3);
      this.cx += (odx / od) * restore;
      this.cy += (ody / od) * restore;
    }

    this.draw(ctx);
  }
}

export const InteractiveParticleText: React.FC<InteractiveParticleTextProps> = ({
  text = "HOVER!",
  colors = ["ffad70", "f7d297", "edb9a1", "e697ac", "b38dca", "9c76db", "705cb5", "43428e", "2c2142"],
  className = "",
  animationForce = 80,
  particleDensity = 4,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const particlesRef = useRef<HoverParticle[]>([]);
  const pointerRef = useRef<Pointer>({});
  const hasPointerRef = useRef(false);
  const interactionRadiusRef = useRef(100);
  const textBoxRef = useRef<TextBox>({ str: text });

  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    setCanvasSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    const handleResize = () => {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    const dottify = () => {
      const cctx = ctxRef.current;
      const textBox = textBoxRef.current;
      if (!cctx || !textBox.x || !textBox.y || !textBox.w || !textBox.h) return;

      const data = cctx.getImageData(textBox.x, textBox.y, textBox.w, textBox.h).data;
      const pixels: { x: number; y: number; rgb: number[] }[] = [];

      for (let i = 0; i < data.length; i += 4) {
        const idx = i / 4;
        const lx = idx % textBox.w!;
        const ly = Math.floor(idx / textBox.w!);
        if (data[i + 3] && !(lx % particleDensity) && !(ly % particleDensity)) {
          pixels.push({
            x: lx,
            y: ly,
            rgb: [data[i], data[i + 1], data[i + 2]],
          });
        }
      }

      cctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = pixels.map(
        (p) => new HoverParticle(textBox.x! + p.x, textBox.y! + p.y, animationForce, p.rgb),
      );
      particlesRef.current.forEach((p) => p.draw(cctx));
    };

    const write = () => {
      const cctx = ctxRef.current;
      if (!cctx) return;

      const textBox = textBoxRef.current;
      textBox.str = text;
      textBox.h = Math.floor(canvas.width / Math.max(textBox.str.length, 1));
      interactionRadiusRef.current = Math.max(50, textBox.h * 1.5);

      cctx.font = `900 ${textBox.h}px Verdana, sans-serif`;
      cctx.textAlign = "center";
      cctx.textBaseline = "middle";

      textBox.w = Math.round(cctx.measureText(textBox.str).width);
      textBox.x = 0.5 * (canvas.width - textBox.w);
      textBox.y = 0.5 * (canvas.height - textBox.h);

      const gradient = cctx.createLinearGradient(
        textBox.x,
        textBox.y,
        textBox.x + textBox.w,
        textBox.y + textBox.h,
      );
      const N = Math.max(colors.length - 1, 1);
      colors.forEach((col, i) => gradient.addColorStop(i / N, `#${col}`));
      cctx.fillStyle = gradient;
      cctx.fillText(textBox.str, 0.5 * canvas.width, 0.5 * canvas.height);
      dottify();
    };

    const initSize = () => {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      write();
    };

    initSize();

    const animate = () => {
      const cctx = ctxRef.current;
      if (!cctx) return;
      cctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) =>
        p.move(cctx, interactionRadiusRef.current, hasPointerRef.current, pointerRef.current),
      );
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [text, colors, animationForce, particleDensity, canvasSize]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    pointerRef.current.x = (e.clientX - rect.left) * scaleX;
    pointerRef.current.y = (e.clientY - rect.top) * scaleY;
    hasPointerRef.current = true;
  };

  const handlePointerLeave = () => {
    hasPointerRef.current = false;
    pointerRef.current = {};
  };

  const handlePointerEnter = () => {
    hasPointerRef.current = true;
  };

  return (
    <canvas
      ref={canvasRef}
      className={`h-full w-full cursor-none ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerEnter={handlePointerEnter}
    />
  );
};
