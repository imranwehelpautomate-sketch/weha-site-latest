import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

export const COLORS = {
  light: {
    bg: 0xf7f6f2,
    cobalt: 0x2547ff,
    orange: 0xff5a1f,
    violet: 0x4a2f8f,
    marigold: 0xffd447,
    ink: 0x28251d,
    bloom: 0.18,
    metalRough: 0.18,
  },
  dark: {
    bg: 0x171614,
    cobalt: 0x5b78ff,
    orange: 0xff7a45,
    violet: 0xb39af0,
    marigold: 0xf2c445,
    ink: 0xf3f1ea,
    bloom: 1.05,
    metalRough: 0.12,
  },
};

export function setupRenderer(container, { alpha = false } = {}) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha,
    powerPreference: "high-performance",
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);
  return renderer;
}

export function makeEnv(renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  return env;
}

export function makeComposer(renderer, scene, camera, w, h, strength) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), strength, 0.65, 0.82);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  return { composer, bloom };
}

export function makeBgTexture(theme) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d");
  if (theme === "dark") {
    ctx.fillStyle = "#171614";
    ctx.fillRect(0, 0, 512, 512);
    const g = ctx.createRadialGradient(330, 210, 30, 330, 210, 420);
    g.addColorStop(0, "rgba(179,154,240,0.30)");
    g.addColorStop(0.45, "rgba(30,26,40,0.5)");
    g.addColorStop(1, "rgba(23,22,20,1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    const g2 = ctx.createRadialGradient(150, 380, 10, 150, 380, 260);
    g2.addColorStop(0, "rgba(242,196,69,0.16)");
    g2.addColorStop(1, "rgba(23,22,20,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, 512, 512);
  } else {
    ctx.fillStyle = "#f7f6f2";
    ctx.fillRect(0, 0, 512, 512);
    const g = ctx.createRadialGradient(330, 200, 40, 330, 200, 460);
    g.addColorStop(0, "rgba(74,47,143,0.14)");
    g.addColorStop(0.5, "rgba(247,246,242,0.4)");
    g.addColorStop(1, "rgba(247,246,242,1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    const g2 = ctx.createRadialGradient(150, 380, 10, 150, 380, 280);
    g2.addColorStop(0, "rgba(255,212,71,0.20)");
    g2.addColorStop(1, "rgba(247,246,242,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, 512, 512);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function sectionProgress(el) {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const total = rect.height + vh;
  const seen = vh - rect.top;
  return Math.min(1, Math.max(0, seen / total));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}
