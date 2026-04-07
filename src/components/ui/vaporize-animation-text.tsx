"use client";

import { useEffect, useRef, useMemo } from "react";

type Particle = {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  color: string;
  opacity: number;
  originalAlpha: number;
  velocityX: number;
  velocityY: number;
  angle: number;
  speed: number;
  turbulence: number;
};

type CreatingPageProps = {
  texts?: string[];
};

export function VaporizeAnimationText({ texts = ["Cool"] }: CreatingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const textsRef = useRef(texts);
  textsRef.current = texts;

  const config = useMemo(
    () => ({
      color: "rgb(255, 255, 255)",
      font: { fontFamily: "system-ui, sans-serif", fontSize: "48px", fontWeight: 600 },
      animation: { waitDuration: 500 },
      spread: 5,
      effects: { turbulence: 0.3, gravity: 0.1 },
    }),
    [],
  );

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let currentIndex = 0;
    type Phase = "static" | "vaporizing" | "fadingIn" | "waiting";
    let phase: Phase = "static";
    let vaporizeProgress = 0;
    let fadeOpacity = 0;
    let waitUntil = 0;

    const sampleRate = 4;

    const createParticles = (text: string) => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = config.color;
      ctx.font = `${config.font.fontWeight} ${config.font.fontSize} ${config.font.fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, w / 2, h / 2);

      const imageData = ctx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const particles: Particle[] = [];

      for (let y = 0; y < h; y += sampleRate) {
        for (let x = 0; x < w; x += sampleRate) {
          const i = (y * w + x) * 4;
          const alpha = data[i + 3];
          if (alpha > 0) {
            particles.push({
              x,
              y,
              originalX: x,
              originalY: y,
              color: `rgba(${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${alpha / 255})`,
              opacity: alpha / 255,
              originalAlpha: alpha / 255,
              velocityX: 0,
              velocityY: 0,
              angle: Math.random() * Math.PI * 2,
              speed: 0,
              turbulence: Math.random() * config.effects.turbulence,
            });
          }
        }
      }

      particlesRef.current = particles;
      ctx.clearRect(0, 0, w, h);
    };

    const drawStatic = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      ctx.clearRect(0, 0, w, h);
      particlesRef.current.forEach((p) => {
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
        ctx.fillRect(p.x, p.y, 2, 2);
      });
    };

    createParticles(textsRef.current[currentIndex] ?? "Cool");
    phase = "static";
    waitUntil = performance.now() + 1000;

    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      ctx.clearRect(0, 0, w, h);

      if (phase === "static") {
        drawStatic();
        if (now > waitUntil) {
          phase = "vaporizing";
          vaporizeProgress = 0;
        }
      } else if (phase === "vaporizing") {
        vaporizeProgress += delta * 50;
        const progress = Math.min(100, vaporizeProgress);
        let allGone = true;

        particlesRef.current.forEach((p) => {
          const should = p.originalX <= (w * progress) / 100;
          if (should) {
            if (p.speed === 0) {
              p.speed = Math.random() * config.spread + 2;
              p.angle = Math.random() * Math.PI * 2;
              p.velocityX = Math.cos(p.angle) * p.speed;
              p.velocityY = Math.sin(p.angle) * p.speed;
            }
            p.velocityY += config.effects.gravity;
            p.velocityX *= 0.98;
            p.velocityY *= 0.98;
            p.velocityX += (Math.random() - 0.5) * p.turbulence * 0.5;
            p.velocityY += (Math.random() - 0.5) * p.turbulence * 0.5;
            p.x += p.velocityX;
            p.y += p.velocityY;
            p.opacity *= 0.97;
            if (p.opacity > 0.02) allGone = false;
            if (p.opacity > 0.02) {
              ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
              ctx.fillRect(p.x, p.y, 2, 2);
            }
          } else {
            allGone = false;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.originalX, p.originalY, 2, 2);
          }
        });

        if (progress >= 100 && allGone) {
          currentIndex = (currentIndex + 1) % textsRef.current.length;
          createParticles(textsRef.current[currentIndex] ?? "Cool");
          phase = "fadingIn";
          fadeOpacity = 0;
        }
      } else if (phase === "fadingIn") {
        fadeOpacity += delta * 2;
        const op = Math.min(1, fadeOpacity);
        particlesRef.current.forEach((p) => {
          p.x = p.originalX;
          p.y = p.originalY;
          p.opacity = op * p.originalAlpha;
          ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.opacity})`);
          ctx.fillRect(p.x, p.y, 2, 2);
        });
        if (op >= 1) {
          phase = "waiting";
          waitUntil = now + config.animation.waitDuration;
        }
      } else if (phase === "waiting") {
        drawStatic();
        if (now > waitUntil) {
          phase = "vaporizing";
          vaporizeProgress = 0;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    const onResize = () => {
      createParticles(textsRef.current[currentIndex] ?? "Cool");
      phase = "static";
      waitUntil = performance.now() + 800;
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [config]);

  return (
    <div className="relative h-full min-h-[200px] w-full bg-black">
      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>
    </div>
  );
}
