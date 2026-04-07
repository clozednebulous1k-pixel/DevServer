"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function createBeam(logicalW: number, logicalH: number): Beam {
  const angle = -35 + Math.random() * 10;
  return {
    x: Math.random() * logicalW * 1.5 - logicalW * 0.25,
    y: Math.random() * logicalH * 1.5 - logicalH * 0.25,
    width: 30 + Math.random() * 60,
    length: logicalH * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: 190 + Math.random() * 70,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export interface BeamsBackgroundProps {
  className?: string;
  children?: ReactNode;
  intensity?: "subtle" | "medium" | "strong";
}

const opacityMap = { subtle: 0.7, medium: 0.85, strong: 1 };

const BEAM_COUNT = 24;

export function BeamsBackground({ className, children, intensity = "strong" }: BeamsBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef(0);
  const logicalSizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c = ctx;

    const setupSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      logicalSizeRef.current = { w, h };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      beamsRef.current = Array.from({ length: BEAM_COUNT }, () => createBeam(w, h));
    };

    setupSize();
    window.addEventListener("resize", setupSize);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      const { w, h } = logicalSizeRef.current;
      const column = index % 3;
      const spacing = w / 3;
      beam.y = h + 100;
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 80 + Math.random() * 80;
      beam.speed = 0.5 + Math.random() * 0.5;
      beam.hue = 190 + (index * 70) / totalBeams;
      beam.opacity = 0.15 + Math.random() * 0.1;
    }

    function drawBeam(b: Beam) {
      c.save();
      c.translate(b.x, b.y);
      c.rotate((b.angle * Math.PI) / 180);
      const pulse = b.opacity * (0.8 + Math.sin(b.pulse) * 0.2) * opacityMap[intensity];
      const gradient = c.createLinearGradient(0, 0, 0, b.length);
      gradient.addColorStop(0, `hsla(${b.hue}, 85%, 65%, 0)`);
      gradient.addColorStop(0.1, `hsla(${b.hue}, 85%, 65%, ${pulse * 0.5})`);
      gradient.addColorStop(0.4, `hsla(${b.hue}, 85%, 65%, ${pulse})`);
      gradient.addColorStop(0.6, `hsla(${b.hue}, 85%, 65%, ${pulse})`);
      gradient.addColorStop(0.9, `hsla(${b.hue}, 85%, 65%, ${pulse * 0.5})`);
      gradient.addColorStop(1, `hsla(${b.hue}, 85%, 65%, 0)`);
      c.fillStyle = gradient;
      c.fillRect(-b.width / 2, 0, b.width, b.length);
      c.restore();
    }

    function animate() {
      const { w, h } = logicalSizeRef.current;
      if (!w || !h) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      c.clearRect(0, 0, w, h);
      c.filter = "blur(35px)";
      const total = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;
        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, total);
        }
        drawBeam(beam);
      });
      c.filter = "none";
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", setupSize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [intensity]);

  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden bg-neutral-950", className)}>
      <canvas ref={canvasRef} className="absolute inset-0" style={{ filter: "blur(15px)" }} />

      <motion.div
        className="absolute inset-0 bg-neutral-950/5"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 10, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
        style={{ backdropFilter: "blur(50px)" }}
      />

      <div className="relative z-10 flex h-screen w-full flex-col items-center justify-center px-4 text-center">
        {children ?? (
          <>
            <motion.h1
              className="text-6xl font-semibold tracking-tighter text-white md:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Beams
              <br />
              Background
            </motion.h1>
            <motion.p
              className="text-lg tracking-tighter text-white/70 md:text-2xl lg:text-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              For your pleasure
            </motion.p>
          </>
        )}
      </div>
    </div>
  );
}
