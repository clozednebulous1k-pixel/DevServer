"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { useTheme } from "next-themes";
import { Mail, ArrowRight, Menu, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveHeroProps {
  brandName?: string;
  heroTitle?: string;
  heroDescription?: string;
  emailPlaceholder?: string;
  className?: string;
  /** Menos esferas = mais leve (ex.: prévia na biblioteca). */
  sphereCount?: number;
}

export function InteractiveHero({
  brandName = "NEXUS",
  heroTitle = "Innovation Meets Simplicity",
  heroDescription = "Discover cutting-edge solutions designed for the modern digital landscape.",
  emailPlaceholder = "your@email.com",
  className,
  sphereCount = 72,
}: InteractiveHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pointerRef = useRef(new THREE.Vector2(0, 0));

  const onMove = useCallback((e: PointerEvent) => {
    const el = canvasRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    pointerRef.current.set(x * 9, y * 6);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const count = Math.max(12, Math.min(sphereCount, 200));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 120);
    camera.position.z = 16;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const geometry = new THREE.SphereGeometry(0.42, 18, 18);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xb8b8b8,
      metalness: 0.72,
      roughness: 0.32,
      envMap: envTexture,
      envMapIntensity: 1.1,
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D();
    const base: THREE.Vector3[] = [];
    const current: THREE.Vector3[] = [];
    const scales: number[] = [];

    for (let i = 0; i < count; i++) {
      const p = new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 11,
        (Math.random() - 0.5) * 7,
      );
      base.push(p.clone());
      current.push(p.clone());
      scales.push(0.32 + (i % 9) * 0.045);
    }

    const resize = () => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    const target = new THREE.Vector3();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      target.set(pointerRef.current.x, pointerRef.current.y, 0);

      for (let i = 0; i < count; i++) {
        const dest = base[i].clone().multiplyScalar(0.28).add(target.clone().multiplyScalar(0.62));
        current[i].lerp(dest, 0.045);
        dummy.position.copy(current[i]);
        dummy.scale.setScalar(scales[i]);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      envTexture.dispose();
      renderer.dispose();
    };
  }, [onMove, sphereCount]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void email;
  };

  return (
    <div className={cn("relative h-screen w-full overflow-hidden bg-background", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" />

      <header className="relative z-10 mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <a href="#" className="text-2xl font-bold tracking-tight text-foreground">
            {brandName}
          </a>
          <nav className="hidden items-center gap-2 text-sm font-medium text-muted-foreground md:flex">
            <a href="#" className="rounded-md px-3 py-2 transition-colors hover:text-foreground">
              About
            </a>
            <a href="#" className="rounded-md px-3 py-2 transition-colors hover:text-foreground">
              Blog
            </a>
            <a href="#" className="rounded-md px-3 py-2 transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            {mounted ? (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex-shrink-0 rounded-full bg-secondary/50 p-2.5 transition-colors hover:bg-secondary"
                aria-label="Alternar tema"
              >
                <Sun className="h-5 w-5 text-foreground dark:hidden" />
                <Moon className="hidden h-5 w-5 text-foreground dark:block" />
              </button>
            ) : (
              <div className="h-10 w-10 shrink-0" />
            )}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="p-2.5 md:hidden"
              aria-label="Menu"
            >
              <Menu className="h-6 w-6 text-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex h-[calc(100%-100px)] items-center justify-center px-4 text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl">{heroTitle}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{heroDescription}</p>
          <form
            onSubmit={handleEmailSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <div className="relative w-full">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                placeholder={emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-transparent bg-secondary/50 py-3 pl-11 pr-4 font-medium text-foreground placeholder-muted-foreground transition-colors hover:border-border/50 focus:border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                required
              />
            </div>
            <button
              type="submit"
              className="flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Get Notified <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>

      {isMobileMenuOpen && (
        <div className="absolute left-0 top-0 z-20 h-full w-full bg-background/80 backdrop-blur-sm md:hidden">
          <div className="absolute right-8 top-24 w-48 rounded-xl border bg-card p-4 shadow-lg">
            <nav className="flex flex-col gap-2 font-medium text-muted-foreground">
              <a href="#" className="rounded-lg px-3 py-2 text-sm transition-colors hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </a>
              <a href="#" className="rounded-lg px-3 py-2 text-sm transition-colors hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                Blog
              </a>
              <a href="#" className="rounded-lg px-3 py-2 text-sm transition-colors hover:text-foreground" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </a>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
