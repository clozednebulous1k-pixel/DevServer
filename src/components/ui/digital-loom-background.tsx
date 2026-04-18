"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface DigitalLoomBackgroundProps {
  children: React.ReactNode;
  backgroundColor?: string;
  threadColor?: string;
  threadCount?: number;
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 1,
      ease: "easeInOut" as const,
    },
  }),
};

export function DigitalLoomHeroDemo() {
  return (
    <DigitalLoomBackground>
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm text-white/80 backdrop-blur-md"
        >
          Nova dimensão de UI
        </motion.div>

        <motion.h1
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          The Digital Loom
        </motion.h1>

        <motion.p
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg"
        >
          Hero com fundo animado de fios digitais entrelaçados - ideal para landing tech e produtos SaaS.
        </motion.p>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-8 flex justify-center"
        >
          <span className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-white/20">
            Weave Your Story
          </span>
        </motion.div>
      </div>
    </DigitalLoomBackground>
  );
}

export function DigitalLoomBackground({
  children,
  backgroundColor = "#000000",
  threadColor = "rgba(91, 246, 139, 0.35)",
  threadCount = 80,
}: DigitalLoomBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let threads: Thread[] = [];
    let animId = 0;
    let width = 0;
    let height = 0;

    class Thread {
      x = 0;
      y = 0;
      speed = 0;
      amplitude = 0;
      frequency = 0;
      phase = 0;

      constructor() {
        this.reset();
      }

      reset() {
        width = canvas!.clientWidth;
        height = canvas!.clientHeight;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speed = Math.random() * 0.5 + 0.1;
        this.amplitude = Math.random() * 20 + 10;
        this.frequency = Math.random() * 0.02 + 0.01;
        this.phase = Math.random() * Math.PI * 2;
      }

      update() {
        this.x += this.speed;
        if (this.x > width) {
          this.x = 0;
          this.y = Math.random() * height;
        }
      }

      draw() {
        const startX = Math.max(this.x - 200, 0);
        ctx!.beginPath();
        ctx!.moveTo(
          startX,
          this.y + Math.sin(startX * this.frequency + this.phase) * this.amplitude,
        );
        for (let i = startX; i < this.x; i++) {
          ctx!.lineTo(i, this.y + Math.sin(i * this.frequency + this.phase) * this.amplitude);
        }
        ctx!.strokeStyle = threadColor;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }
    }

    const setup = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      threads = Array.from({ length: threadCount }, () => new Thread());
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    };

    const animate = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      threads.forEach((thread) => {
        thread.update();
        thread.draw();
      });
      animId = requestAnimationFrame(animate);
    };

    setup();
    animate();
    const onResize = () => setup();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animId);
    };
  }, [threadColor, threadCount, backgroundColor]);

  return (
    <div className="relative h-full min-h-[320px] w-full" style={{ backgroundColor }}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />
      <div className="relative z-10 flex h-full min-h-[320px] items-center justify-center px-2 py-8">{children}</div>
    </div>
  );
}
