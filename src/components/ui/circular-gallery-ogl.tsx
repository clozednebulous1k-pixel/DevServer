"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

import "./circular-gallery-ogl.css";

export type CircularGalleryItem = { image: string; text: string };

export type CircularGalleryProps = {
  items?: CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  font?: string;
  scrollSpeed?: number;
  scrollEase?: number;
  className?: string;
};

function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: object) {
  const proto = Object.getPrototypeOf(instance) as object;
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key === "constructor") return;
    const val = (instance as Record<string, unknown>)[key];
    if (typeof val === "function") {
      (instance as Record<string, unknown>)[key] = (val as (...a: unknown[]) => unknown).bind(instance);
    }
  });
}

function textHeightFromFont(font: string): number {
  const m = font.match(/(\d+(?:\.\d+)?)px/i);
  const px = m ? parseFloat(m[1]) : 30;
  return Math.ceil(px * 1.2);
}

function createTextTexture(
  gl: Renderer["gl"],
  text: string,
  font = "bold 30px monospace",
  color = "black",
) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("2d context unavailable");
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = textHeightFromFont(font);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

type TitleOpts = {
  gl: Renderer["gl"];
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor?: string;
  font?: string;
};

class Title {
  gl: Renderer["gl"];
  plane: Mesh;
  renderer: Renderer;
  text: string;
  textColor: string;
  font: string;
  mesh!: Mesh;

  constructor({ gl, plane, renderer, text, textColor = "#545050", font = "30px sans-serif" }: TitleOpts) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }

  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: /* glsl */ `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: /* glsl */ `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textH = this.plane.scale.y * 0.15;
    const textW = textH * aspect;
    this.mesh.scale.set(textW, textH, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textH * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

type Screen = { width: number; height: number };
type Viewport = { width: number; height: number };

type MediaOpts = {
  geometry: Plane;
  gl: Renderer["gl"];
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: Screen;
  text: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
};

class Media {
  extra = 0;
  geometry: Plane;
  gl: Renderer["gl"];
  image: string;
  index: number;
  length: number;
  renderer: Renderer;
  scene: Transform;
  screen: Screen;
  text: string;
  viewport: Viewport;
  bend: number;
  textColor: string;
  borderRadius: number;
  font: string;
  program!: Program;
  plane!: Mesh;
  title!: Title;
  speed = 0;
  scale = 0;
  padding = 0;
  width = 0;
  widthTotal = 0;
  x = 0;
  isBefore = false;
  isAfter = false;

  constructor(opts: MediaOpts) {
    this.geometry = opts.geometry;
    this.gl = opts.gl;
    this.image = opts.image;
    this.index = opts.index;
    this.length = opts.length;
    this.renderer = opts.renderer;
    this.scene = opts.scene;
    this.screen = opts.screen;
    this.text = opts.text;
    this.viewport = opts.viewport;
    this.bend = opts.bend;
    this.textColor = opts.textColor;
    this.borderRadius = opts.borderRadius;
    this.font = opts.font;
    this.createShader();
    this.createMesh();
    this.createTitle();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: /* glsl */ `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: /* glsl */ `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }

        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);

          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);

          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);

          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] as [number, number] },
        uImageSizes: { value: [0, 0] as [number, number] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius },
      },
      transparent: true,
    });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      font: this.font,
    });
  }

  update(scroll: { current: number; last: number }, direction: "right" | "left") {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = false;
      this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = false;
      this.isAfter = false;
    }
  }

  onResize(opts: { screen?: Screen; viewport?: Viewport } = {}) {
    if (opts.screen) this.screen = opts.screen;
    if (opts.viewport) {
      this.viewport = opts.viewport;
      const u = this.plane.program.uniforms.uViewportSizes as { value: [number, number] } | undefined;
      if (u) u.value = [this.viewport.width, this.viewport.height];
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

type GalleryItem = CircularGalleryItem;

class GalleryApp {
  container: HTMLElement;
  scrollSpeed: number;
  scroll: { ease: number; current: number; target: number; last: number; position: number };
  onCheckDebounce: () => void;
  renderer!: Renderer;
  gl!: Renderer["gl"];
  camera!: Camera;
  scene!: Transform;
  planeGeometry!: Plane;
  mediasImages: GalleryItem[] = [];
  medias: Media[] = [];
  isDown = false;
  start = 0;
  raf = 0;
  boundOnResize!: () => void;
  boundOnWheel!: (e: WheelEvent) => void;
  boundOnTouchDown!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchMove!: (e: MouseEvent | TouchEvent) => void;
  boundOnTouchUp!: () => void;
  screen!: Screen;
  viewport!: Viewport;
  private frameLoop!: () => void;

  constructor(
    container: HTMLElement,
    opts: {
      items?: GalleryItem[];
      bend?: number;
      textColor?: string;
      borderRadius?: number;
      font?: string;
      scrollSpeed?: number;
      scrollEase?: number;
    } = {},
  ) {
    const {
      items,
      bend = 1,
      textColor = "#ffffff",
      borderRadius = 0,
      font = "bold 30px Figtree, sans-serif",
      scrollSpeed = 2,
      scrollEase = 0.05,
    } = opts;

    document.documentElement.classList.remove("no-js");
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0, position: 0 };
    this.onCheckDebounce = debounce(() => this.onCheck(), 200);
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.frameLoop = this.update.bind(this);
    this.frameLoop();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }

  createMedias(
    items: GalleryItem[] | undefined,
    bend: number,
    textColor: string,
    borderRadius: number,
    font: string,
  ) {
    const defaultItems: GalleryItem[] = [
      { image: "https://picsum.photos/seed/1/800/600?grayscale", text: "Bridge" },
      { image: "https://picsum.photos/seed/2/800/600?grayscale", text: "Desk Setup" },
      { image: "https://picsum.photos/seed/3/800/600?grayscale", text: "Waterfall" },
      { image: "https://picsum.photos/seed/4/800/600?grayscale", text: "Strawberries" },
      { image: "https://picsum.photos/seed/5/800/600?grayscale", text: "Deep Diving" },
      { image: "https://picsum.photos/seed/16/800/600?grayscale", text: "Train Track" },
      { image: "https://picsum.photos/seed/17/800/600?grayscale", text: "Santorini" },
      { image: "https://picsum.photos/seed/8/800/600?grayscale", text: "Blurry Lights" },
      { image: "https://picsum.photos/seed/9/800/600?grayscale", text: "New York" },
      { image: "https://picsum.photos/seed/10/800/600?grayscale", text: "Good Boy" },
      { image: "https://picsum.photos/seed/21/800/600?grayscale", text: "Coastline" },
      { image: "https://picsum.photos/seed/12/800/600?grayscale", text: "Palm Trees" },
    ];
    const galleryItems = items && items.length > 0 ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map(
      (data, index) =>
        new Media({
          geometry: this.planeGeometry,
          gl: this.gl,
          image: data.image,
          index,
          length: this.mediasImages.length,
          renderer: this.renderer,
          scene: this.scene,
          screen: this.screen,
          text: data.text,
          viewport: this.viewport,
          bend,
          textColor,
          borderRadius,
          font,
        }),
    );
  }

  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = "touches" in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
  }

  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const x =
      "touches" in e && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }

  onWheel(e: WheelEvent) {
    const delta = e.deltaY || (e as unknown as { wheelDelta?: number }).wheelDelta || 0;
    this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }

  onCheck() {
    if (!this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }

  onResize = () => {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    this.medias.forEach((media) => media.onResize({ screen: this.screen, viewport: this.viewport }));
  };

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction: "right" | "left" = this.scroll.current > this.scroll.last ? "right" : "left";
    this.medias.forEach((media) => media.update(this.scroll, direction));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.frameLoop);
  }

  addEventListeners() {
    this.boundOnResize = this.onResize;
    this.boundOnWheel = (e) => this.onWheel(e);
    this.boundOnTouchDown = (e) => this.onTouchDown(e);
    this.boundOnTouchMove = (e) => this.onTouchMove(e);
    this.boundOnTouchUp = () => this.onTouchUp();
    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("wheel", this.boundOnWheel, { passive: true });
    window.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    window.addEventListener("touchstart", this.boundOnTouchDown, { passive: true });
    window.addEventListener("touchmove", this.boundOnTouchMove, { passive: true });
    window.addEventListener("touchend", this.boundOnTouchUp);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("wheel", this.boundOnWheel);
    window.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);
    const parent = this.renderer?.gl?.canvas?.parentNode;
    if (parent) parent.removeChild(this.renderer.gl.canvas);
  }
}

/** Galeria curva em WebGL (OGL): arraste ou use a roda do rato. */
export function CircularGallery({
  items,
  bend = 3,
  textColor = "#ffffff",
  borderRadius = 0.05,
  font = "bold 30px Figtree, sans-serif",
  scrollSpeed = 2,
  scrollEase = 0.05,
  className,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const app = new GalleryApp(el, {
      items,
      bend,
      textColor,
      borderRadius,
      font,
      scrollSpeed,
      scrollEase,
    });

    return () => {
      app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase]);

  return <div className={cn("circular-gallery", className)} ref={containerRef} />;
}

export default CircularGallery;
