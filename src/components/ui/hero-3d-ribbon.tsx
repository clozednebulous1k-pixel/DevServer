"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type RibbonItem = { label: string; href: string };

const items: RibbonItem[] = [
  { label: "CONVERSAO", href: "/projetos" },
  { label: "AUTOMACAO", href: "/projetos" },
  { label: "ESCALA", href: "/projetos" },
  { label: "LUCRO", href: "/projetos" },
];

const params = {
  textColor: "#ffffff",
  fontPx: 214,
  planeH: 2.9,
  letterSpacing: 0.02,
  gap: 8.2,
  curveRadius: 46,
  autoRotate: 4.2,
  minBackOpacity: 0.12,
  flipBackText: true,
};

function makeGlyphTexture(renderer: THREE.WebGLRenderer, ch: string) {
  const fam = "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";
  const size = params.fontPx;
  const pad = Math.floor(size * 0.2);
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = `800 ${size}px ${fam}`;
  const w = Math.max(8, Math.ceil(probe.measureText(ch).width + pad * 2));
  const h = Math.ceil(size * 1.6);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext("2d")!;
  g.clearRect(0, 0, w, h);
  g.fillStyle = params.textColor;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `800 ${size}px ${fam}`;
  g.fillText(ch, w / 2, h / 2 + size * 0.06);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy?.() || 1, 8);
  return { texture, w, h };
}

export function Hero3DRibbon() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 35);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableDamping = true;

    const shared = { uBend: { value: 0 } };
    const vshader = `
      varying vec2 vUv;
      uniform float uBend;
      void main(){
        vUv = uv;
        vec3 p = position;
        float k = uBend;
        if (abs(k) > 1e-6) {
          float r = 1.0 / k;
          float th = p.x * k;
          p.x = sin(th) * r;
          p.z += r - cos(th) * r;
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p,1.0);
      }
    `;
    const fshader = `
      varying vec2 vUv;
      uniform sampler2D map;
      uniform float uOpacity;
      uniform float uMirror;
      void main(){
        vec2 uv = mix(vUv, vec2(1.0 - vUv.x, vUv.y), uMirror);
        vec4 c = texture2D(map, uv);
        gl_FragColor = vec4(c.rgb, c.a * uOpacity);
      }
    `;

    const belt = new THREE.Group();
    scene.add(belt);
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    type Layer = { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; W: number; offset: number };
    const words: Array<{ front: Layer[]; back: Layer[]; width: number; href: string; blend: number }> = [];
    const H = params.planeH;

    const buildLayer = (label: string, mirrorFlag: boolean) => {
      const arr: Layer[] = [];
      for (const ch of label) {
        const { texture, w: tw, h: th } = makeGlyphTexture(renderer, ch);
        const W = H * (tw / th);
        const geo = new THREE.PlaneGeometry(W, H, 64, 1);
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            map: { value: texture },
            uBend: shared.uBend,
            uOpacity: { value: 1.0 },
            uMirror: { value: mirrorFlag ? 1.0 : 0.0 },
          },
          vertexShader: vshader,
          fragmentShader: fshader,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.userData = { ch };
        belt.add(mesh);
        arr.push({ mesh, mat, W, offset: 0 });
      }
      return arr;
    };

    for (const it of items) {
      const front = buildLayer(it.label, false);
      const back = buildLayer(it.label, true);
      words.push({ front, back, width: 0, href: it.href, blend: 0 });
    }

    const measureLayer = (layer: Layer[]) => {
      let x = 0;
      for (let i = 0; i < layer.length; i++) {
        const L = layer[i];
        L.offset = x + L.W / 2;
        x += L.W;
        if (i < layer.length - 1) x += params.letterSpacing * H;
      }
      return x;
    };

    const layout = () => {
      const r = Math.max(0, params.curveRadius);
      shared.uBend.value = r > 1e-4 ? 1 / r : 0;
      for (const w of words) {
        w.width = measureLayer(w.front);
        measureLayer(w.back);
      }
      const total = words.reduce((s, w) => s + w.width, 0) + (words.length - 1) * params.gap * H;
      let s = -total / 2;
      for (let wi = 0; wi < words.length; wi++) {
        const w = words[wi];
        const wordMid = s + w.width / 2;
        const place = (lx: number) => {
          if (shared.uBend.value === 0) return { pos: new THREE.Vector3(wordMid + lx, 0, 0), rotY: 0 };
          const rad = 1 / shared.uBend.value;
          const th = (wordMid + lx) / rad;
          return { pos: new THREE.Vector3(Math.sin(th) * rad, 0, Math.cos(th) * rad), rotY: th };
        };
        for (const L of w.front) {
          const P = place(L.offset - w.width / 2);
          L.mesh.position.copy(P.pos);
          L.mesh.rotation.set(0, P.rotY, 0);
          L.mesh.position.z += 0.0005;
        }
        for (const L of w.back) {
          const P = place(-(L.offset - w.width / 2));
          L.mesh.position.copy(P.pos);
          L.mesh.rotation.set(0, P.rotY, 0);
          L.mesh.position.z -= 0.0005;
        }
        s += w.width + (wi < words.length - 1 ? params.gap * H : 0);
      }
    };
    layout();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const meshes = words.flatMap((w) => [...w.front, ...w.back].map((l) => l.mesh));
    const rayHit = (e: PointerEvent | MouseEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      return raycaster.intersectObjects(meshes, false)[0] || null;
    };

    let dragging = false;
    let lastX = 0;
    let vel = 0;
    let downAt = 0;
    let moved = false;
    let hoveredWord = -1;
    renderer.domElement.style.cursor = "grab";

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      vel = 0;
      downAt = performance.now();
      moved = false;
      renderer.domElement.style.cursor = "grabbing";
      hoveredWord = -1;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) {
        const hit = rayHit(e);
        if (hit) {
          hoveredWord = words.findIndex(
            (w) => w.front.some((L) => L.mesh === hit.object) || w.back.some((L) => L.mesh === hit.object),
          );
          renderer.domElement.style.cursor = "pointer";
        } else {
          hoveredWord = -1;
          renderer.domElement.style.cursor = "grab";
        }
      }
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const d = (dx / window.innerWidth) * Math.PI * 1.8;
      belt.rotation.y -= d;
      vel = -d / (1 / 60);
      if (Math.abs(dx) > 3) moved = true;
    };
    const onUp = () => {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
    };
    const onClick = (e: MouseEvent) => {
      if (moved && performance.now() - downAt > 200) return;
      const hit = rayHit(e);
      if (!hit) return;
      const idx = words.findIndex(
        (w) => w.front.some((L) => L.mesh === hit.object) || w.back.some((L) => L.mesh === hit.object),
      );
      if (idx >= 0) window.location.href = words[idx].href;
    };

    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("click", onClick);

    const baseN = new THREE.Vector3(0, 0, 1);
    const toCam = new THREE.Vector3();
    const q = new THREE.Quaternion();
    const wp = new THREE.Vector3();
    let lastT = performance.now();
    const BLEND_WIDTH = 0.18;
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      if (!dragging) belt.rotation.y += THREE.MathUtils.degToRad(params.autoRotate) * dt;
      if (!dragging && Math.abs(vel) > 1e-4) {
        belt.rotation.y += vel * dt;
        vel *= Math.pow(0.06, dt);
      }

      for (let wi = 0; wi < words.length; wi++) {
        const w = words[wi];
        const mid = w.front[(w.front.length - 1) >> 1].mesh;
        mid.getWorldPosition(wp);
        toCam.copy(camera.position).sub(wp).normalize();
        mid.getWorldQuaternion(q);
        const dot = baseN.clone().applyQuaternion(q).dot(toCam);
        const target = params.flipBackText ? THREE.MathUtils.smoothstep(-dot, -BLEND_WIDTH, BLEND_WIDTH) : 0;
        w.blend += (target - w.blend) * Math.min(1, dt * 18);

        for (const pass of [0, 1] as const) {
          const layer = pass ? w.back : w.front;
          const weight = pass ? w.blend : 1 - w.blend;
          for (const L of layer) {
            L.mesh.getWorldPosition(wp);
            toCam.copy(camera.position).sub(wp).normalize();
            L.mesh.getWorldQuaternion(q);
            const df = Math.max(0, baseN.clone().applyQuaternion(q).dot(toCam));
            let a = params.minBackOpacity + (1 - params.minBackOpacity) * df;
            if (hoveredWord === wi) a *= 0.6;
            L.mat.uniforms.uOpacity.value = a * weight;
            L.mesh.renderOrder = Math.round(df * 1000) + pass;
          }
        }
      }
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onResize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("click", onClick);
      controls.dispose();
      meshes.forEach((m) => {
        m.geometry.dispose();
        const mat = m.material as THREE.ShaderMaterial;
        const tex = mat.uniforms.map.value as THREE.Texture;
        tex.dispose();
        mat.dispose();
      });
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0 -z-[1] opacity-75" aria-hidden />;
}

