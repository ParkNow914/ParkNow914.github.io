"use client";

// Matriz 1: o Cérebro Autark entalhado numa matriz de xilogravura.
//
// Uma prancha de madeira de verdade (geometria deslocada pelo mapa de relevo,
// nenhum GLB) que começa lisa, com o desenho a pincel por cima, e é entalhada
// peça por peça conforme a página rola. No fim o rolo passa tinta, a folha
// amarela é prensada e levanta com a gravura impressa e o carimbo OPERANDO.
//
// O relevo é espelhado (scripts/matriz.mjs): a matriz é o avesso da impressão,
// como em qualquer xilogravura, e só a folha lê no sentido certo.

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { ASSEMBLY_PARTS, STEP_COUNT, WINDOWS, emitAssembly, machine, progressIn } from "./store";
import { MATRIZ_ASPECT, SLOTS } from "./matriz-layout";

export type OverlayRefs = {
  svg: SVGSVGElement | null;
  balloons: (SVGGElement | null)[];
  tag: SVGGElement | null;
};

// Medidas da prancha, em unidades da cena.
const BW = 3;
const BH = BW * MATRIZ_ASPECT;
const BD = 0.46;
const CARVE = 0.07;
const INK_WINDOW: [number, number] = [4.3, 4.64];
const PRESS_WINDOW: [number, number] = [4.64, 4.8];
const LIFT_WINDOW: [number, number] = [4.8, 5.35];
// O fundo e a moldura são entalhados no passo da tampa: é ali que a matriz "fecha".
const FRAME_WINDOW = WINDOWS[9];

const smooth = (t: number) => t * t * (3 - 2 * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Retângulo da peça no espaço de textura do relevo (espelhado e com v para cima). */
function rectUv(n: number) {
  const [u, v, w, h] = SLOTS[n];
  return new THREE.Vector4(1 - u - w, 1 - v - h, 1 - u, 1 - v);
}

/** Centro da peça na face da matriz, em coordenadas locais da prancha. */
function anchorOf(n: number): [number, number, number] {
  const [u, v, w, h] = SLOTS[n];
  const cu = 1 - (u + w / 2); // espelhado
  const cv = 1 - (v + h / 2);
  return [(cu - 0.5) * BW * 0.97, (cv - 0.5) * BH * 0.97, BD / 2 + 0.01];
}

const NOISE = /* glsl */ `
  float hash21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
  float vnoise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash21(i), b = hash21(i+vec2(1,0)), c = hash21(i+vec2(0,1)), d = hash21(i+vec2(1,1));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
  }
  float fbm(vec2 p){ float s = 0.0, a = 0.5; for(int i=0;i<4;i++){ s += a*vnoise(p); p *= 2.03; a *= 0.5; } return s; }
`;

// Altura entalhada num ponto: 1 = madeira intacta, relevo = depois da goiva.
const CARVE_FN = /* glsl */ `
  uniform sampler2D uRelevo;
  uniform vec4 uRects[9];
  uniform float uCarve[9];
  uniform float uFrame;
  float carveAt(vec2 uv){
    float c = uFrame;
    for (int i = 0; i < 9; i++) {
      vec4 r = uRects[i];
      if (uv.x >= r.x && uv.x <= r.z && uv.y >= r.y && uv.y <= r.w) c = uCarve[i];
    }
    return c;
  }
  float carveMask(vec2 uv, float c){
    // A goiva avança em lascas, de cima para baixo, com borda irregular.
    float sweep = 1.0 - uv.y;
    float t = sweep * 0.55 + fbm(uv * vec2(9.0, 38.0)) * 0.45;
    return smoothstep(t - 0.06, t + 0.06, c * 1.12);
  }
  float heightAt(vec2 uv){
    float raw = texture2D(uRelevo, uv).r;
    float m = carveMask(uv, carveAt(uv));
    return mix(1.0, raw, m);
  }
`;

function matrizMaterial(relevo: THREE.Texture, uniforms: Record<string, THREE.IUniform>) {
  const mat = new THREE.MeshStandardMaterial({ color: "#b98457", roughness: 0.72, metalness: 0 });
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>\nvarying vec2 vMUv;\n${NOISE}\n${CARVE_FN}\nuniform float uDepth;`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>\n  vMUv = uv;\n  transformed.z += (heightAt(uv) - 1.0) * uDepth;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nvarying vec2 vMUv;\n${NOISE}\n${CARVE_FN}\nuniform float uInk;\nuniform float uBump;\nuniform float uBrush;\nfloat gH; float gRaw; float gM;`,
      )
      .replace(
        "#include <color_fragment>",
        `#include <color_fragment>
  gRaw = texture2D(uRelevo, vMUv).r;
  gM = carveMask(vMUv, carveAt(vMUv));
  gH = mix(1.0, gRaw, gM);
  // Madeira de umburana: veios ao longo da prancha, anéis deformados por ruído.
  float ring = sin((vMUv.x * 3.2 + fbm(vMUv * vec2(2.2, 9.0)) * 1.6) * 11.0) * 0.5 + 0.5;
  float fiber = fbm(vMUv * vec2(70.0, 6.0));
  vec3 wood = mix(vec3(0.50, 0.30, 0.16), vec3(0.31, 0.17, 0.08), ring * 0.6 + fiber * 0.4);
  // O fundo cavado mostra madeira clara e fresca, riscada pela goiva.
  float gouge = smoothstep(0.35, 0.9, vnoise(vMUv * vec2(260.0, 22.0)));
  vec3 fresh = mix(vec3(0.86, 0.66, 0.42), vec3(0.72, 0.51, 0.30), gouge);
  float low = 1.0 - gH;
  vec3 col = mix(wood, fresh, smoothstep(0.2, 0.7, low));
  // Antes da goiva: o desenho passado a pincel com nanquim ralo sobre a madeira lisa.
  float drawn = gRaw * (1.0 - gM) * uBrush;
  col = mix(col, vec3(0.07, 0.05, 0.04), drawn * 0.9);
  // Tinta do rolo: só pega nas partes altas, e só por onde o rolo já passou.
  float rolled = smoothstep(vMUv.y - 0.04, vMUv.y + 0.04, uInk * 1.08);
  float inked = rolled * smoothstep(0.82, 0.97, gH);
  col = mix(col, vec3(0.045, 0.038, 0.034), inked);
  diffuseColor.rgb = col;`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
  roughnessFactor = mix(0.74, 0.32, inked);`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
  {
    vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
    vec3 r1 = cross(sy, normal), r2 = cross(normal, sx);
    float det = dot(sx, r1);
    vec2 dh = vec2(dFdx(gH), dFdy(gH)) * uBump;
    vec3 grad = sign(det) * (dh.x * r1 + dh.y * r2);
    normal = normalize(abs(det) * normal - grad);
  }`,
      );
  };
  mat.customProgramCacheKey = () => "matriz";
  void relevo;
  return mat;
}

/** Folha com a gravura impressa e o carimbo OPERANDO, desenhada num canvas. */
function folhaTexture(img: HTMLImageElement) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  const stamp = getComputedStyle(document.documentElement).getPropertyValue("--font-stamp").trim() || "monospace";
  ctx.save();
  ctx.translate(w * 0.7, h * 0.57);
  ctx.rotate(-0.16);
  ctx.globalAlpha = 0.92;
  ctx.strokeStyle = "#c8261d";
  ctx.fillStyle = "#c8261d";
  ctx.lineWidth = w * 0.012;
  const bw = w * 0.46;
  const bh = w * 0.13;
  ctx.strokeRect(-bw / 2, -bh / 2, bw, bh);
  ctx.font = `${Math.round(w * 0.082)}px ${stamp}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("OPERANDO", 0, w * 0.004);
  ctx.restore();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Ângulo da prancha ao longo da história: inclinada sob luz rasante, de frente na impressão. */
function viewAt(a: number): [number, number] {
  if (a < 0) return [-0.24, -0.5];
  if (a < 4.3) return [-0.24 + 0.1 * Math.sin(a * 0.9), -0.5 + 0.05 * Math.sin(a * 0.7)];
  const k = smooth(Math.min(1, (a - 4.3) / 1.05));
  return [-0.2 * (1 - k) - 0.06 * k, -0.5 * (1 - k) - 0.28 * k];
}

export function Machine({ overlay, lite }: { overlay: React.RefObject<OverlayRefs>; lite: boolean }) {
  const { camera, size, gl } = useThree();
  const root = useRef<THREE.Group>(null);
  const turn = useRef<THREE.Group>(null);
  const roller = useRef<THREE.Group>(null);
  const sheet = useRef<THREE.Group>(null);

  const [relevo, folhaImg] = useTexture([lite ? "/matriz/relevo-lite.webp" : "/matriz/relevo.webp", lite ? "/matriz/folha-720.webp" : "/matriz/folha-960.webp"]);

  const uniforms = useMemo(() => {
    relevo.colorSpace = THREE.NoColorSpace;
    relevo.anisotropy = 8;
    relevo.generateMipmaps = true;
    relevo.minFilter = THREE.LinearMipmapLinearFilter;
    return {
      uRelevo: { value: relevo },
      uRects: { value: Array.from({ length: 9 }, (_, i) => rectUv(i + 1)) },
      uCarve: { value: new Array(9).fill(0) as number[] },
      uFrame: { value: 0 },
      uDepth: { value: CARVE },
      uInk: { value: 0 },
      uBump: { value: lite ? 2.2 : 3.2 },
      uBrush: { value: 1 },
    };
  }, [relevo, lite]);

  const faceMat = useMemo(() => matrizMaterial(relevo, uniforms), [relevo, uniforms]);
  const faceGeo = useMemo(() => new THREE.PlaneGeometry(BW * 0.97, BH * 0.97, lite ? 200 : 360, lite ? 260 : 468), [lite]);
  const sideMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#8f5f37", roughness: 0.82 }), []);
  const endMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#a8744a", roughness: 0.9 }), []);

  const folha = useMemo(() => {
    const src = (folhaImg as THREE.Texture).image as HTMLImageElement;
    return folhaTexture(src);
  }, [folhaImg]);
  // Folha: frente impressa (só aparece depois de levantar) e verso de papel amarelo.
  const SX = 40;
  const SY = Math.round(40 * MATRIZ_ASPECT);
  const sheetGeo = useMemo(() => new THREE.PlaneGeometry(BW * 0.97, BH * 0.97, SX, SY), [SY]);
  const sheetBase = useMemo(() => Float32Array.from(sheetGeo.attributes.position.array as Float32Array), [sheetGeo]);
  // O lado impresso fica para baixo, contra a matriz; ao levantar pela borda de
  // cima ele vira para quem lê. A textura gira 180° para a gravura ficar em pé.
  const sheetPrint = useMemo(() => {
    folha.wrapS = folha.wrapT = THREE.RepeatWrapping;
    folha.center.set(0.5, 0.5);
    folha.rotation = Math.PI;
    folha.repeat.set(-1, 1);
    return new THREE.MeshStandardMaterial({ map: folha, emissiveMap: folha, emissive: "#ffffff", emissiveIntensity: 0.5, roughness: 0.92, side: THREE.BackSide });
  }, [folha]);
  const sheetPaper = useMemo(() => new THREE.MeshStandardMaterial({ color: "#e9b625", roughness: 0.95, side: THREE.FrontSide }), []);

  const rollerParts = useMemo(
    () => ({
      drum: new THREE.CylinderGeometry(0.2, 0.2, BW * 1.04, 48, 1),
      axle: new THREE.CylinderGeometry(0.035, 0.035, BW * 1.22, 12),
      grip: new THREE.CylinderGeometry(0.07, 0.07, 0.75, 20),
      arm: new THREE.BoxGeometry(0.05, 0.05, 0.5),
      rubber: new THREE.MeshStandardMaterial({ color: "#151211", roughness: 0.28, metalness: 0 }),
      steel: new THREE.MeshStandardMaterial({ color: "#9a9590", roughness: 0.35, metalness: 0.9 }),
      wood: new THREE.MeshStandardMaterial({ color: "#7a4a28", roughness: 0.6 }),
    }),
    [],
  );

  useEffect(() => {
    gl.shadowMap.enabled = false;
  }, [gl]);

  const state = useRef({
    a: machine.current,
    px: 0,
    py: 0,
    x: 0,
    y: 0,
    s: 0.001,
    placed: false,
    lastEmit: -99,
    balloonOpacity: new Array(10).fill(0) as number[],
    spots: Array.from({ length: 10 }, () => ({ on: false, ax: 0, ay: 0, bx: 0, by: 0, o: 0 })),
  });
  const tmp = useMemo(() => ({ v: new THREE.Vector3(), c: new THREE.Vector3() }), []);
  const slotsRef = useRef<HTMLElement[] | null>(null);
  const anchors = useMemo(() => Array.from({ length: 10 }, (_, n) => (n ? anchorOf(n) : ([0, 0, 0] as [number, number, number]))), []);

  useFrame((frame, dt) => {
    const st = state.current;
    const r = root.current;
    const t = turn.current;
    if (!r || !t) return;
    const delta = Math.min(dt, 1 / 20);

    // 1. Progresso, amortecido para o scrub parecer físico. Aqui o passo segue o
    // relógio de verdade (até meio segundo por quadro): num aparelho que só
    // consegue 2 quadros por segundo a montagem ainda chega ao fim no tempo do
    // scroll, em vez de ficar presa a 50 ms por quadro.
    const target = machine.reduced ? STEP_COUNT : machine.target;
    st.a = machine.reduced ? target : THREE.MathUtils.damp(st.a, target, 5, Math.min(dt, 0.5));
    const a = st.a;
    machine.current = a;
    if (Math.abs(a - st.lastEmit) > 0.002) {
      st.lastEmit = a;
      emitAssembly(a);
    }

    // 2. O slot ativo no DOM: a prancha se desenha dentro da moldura visível.
    if (!slotsRef.current) slotsRef.current = Array.from(document.querySelectorAll<HTMLElement>("[data-machine-slot]"));
    let rect: DOMRect | null = null;
    let pad = [0, 0];
    let best = -Infinity;
    const vh = size.height;
    for (const el of slotsRef.current) {
      if (el.offsetParent === null) continue;
      const rr = el.getBoundingClientRect();
      const visible = Math.min(rr.bottom, vh) - Math.max(rr.top, 0);
      const score = visible > 0 ? visible : visible - 10000;
      if (score >= best) {
        best = score;
        rect = rr;
        const padAttr = size.width <= 960 && el.dataset.padSm ? el.dataset.padSm : el.dataset.pad;
        pad = (padAttr ?? "0 0").split(" ").map(Number);
      }
    }
    const printed = smooth(progressIn(a, LIFT_WINDOW));
    if (rect) {
      const cam = camera as THREE.PerspectiveCamera;
      const worldH = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
      const upp = worldH / vh;
      const cx = rect.left + rect.width / 2;
      const innerH = Math.max(60, rect.height - pad[0] - pad[1]);
      const cy = rect.top + pad[0] + innerH / 2;
      const fit = 3.95 + 1.85 * printed;
      const tx = (cx - size.width / 2) * upp;
      const ty = -(cy - vh / 2) * upp;
      const ts = (Math.min(rect.width * 1.25, innerH) * upp) / fit;
      if (!st.placed) {
        st.x = tx;
        st.y = ty;
        st.s = ts;
        st.placed = true;
      } else {
        st.x = THREE.MathUtils.damp(st.x, tx, 9, delta);
        st.y = THREE.MathUtils.damp(st.y, ty, 9, delta);
        st.s = THREE.MathUtils.damp(st.s, ts, 9, delta);
      }
      r.position.set(st.x, st.y - 0.36 * BH * st.s * printed, 0);
      r.scale.setScalar(st.s);
    }

    // 3. Ângulo + respiração ociosa + parallax do cursor.
    const [yaw, tilt] = viewAt(a);
    const idle = machine.reduced ? 0 : 1;
    const time = frame.clock.elapsedTime;
    st.px = THREE.MathUtils.damp(st.px, machine.pointerX * idle, 3, delta);
    st.py = THREE.MathUtils.damp(st.py, machine.pointerY * idle, 3, delta);
    t.rotation.set(tilt + st.py * 0.07, yaw + Math.sin(time * 0.3) * 0.035 * idle + st.px * 0.14, 0, "XYZ");

    // 4. Goiva: cada peça é entalhada na sua janela; a moldura fecha no passo da tampa.
    const carve = uniforms.uCarve.value;
    for (let n = 1; n <= 9; n++) carve[n - 1] = n === 1 ? smooth(progressIn(a, [0.05, 0.85])) : smooth(progressIn(a, WINDOWS[n]));
    uniforms.uFrame.value = smooth(progressIn(a, FRAME_WINDOW));
    uniforms.uInk.value = progressIn(a, INK_WINDOW);
    uniforms.uBrush.value = 1;

    // 5. O rolo atravessa a prancha de cima para baixo, girando.
    const rk = progressIn(a, INK_WINDOW);
    const rg = roller.current;
    if (rg) {
      const showing = rk > 0 && rk < 1;
      rg.visible = showing || (a > INK_WINDOW[0] - 0.06 && a < INK_WINDOW[1] + 0.06);
      const yPos = THREE.MathUtils.lerp(BH * 0.62, -BH * 0.62, easeOut(rk));
      rg.position.set(0, yPos, BD / 2 + 0.2);
      const drum = rg.children[0];
      if (drum) drum.rotation.y = -yPos / 0.2;
    }

    // 6. A folha desce, é prensada e levanta dobrando a partir da borda de cima.
    const sg = sheet.current;
    if (sg) {
      const press = easeOut(progressIn(a, PRESS_WINDOW));
      const lift = progressIn(a, LIFT_WINDOW);
      sg.visible = press > 0.001;
      const pos = sheetGeo.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      const top = BD / 2 + 0.012;
      const hover = (1 - press) * 1.4;
      // Ângulo final da folha em pé, de frente para quem lê.
      const theta = smooth(lift) * Math.PI * 0.64;
      const rows = SY + 1;
      const cols = SX + 1;
      const rowLen = (BH * 0.97) / SY;
      for (let j = 0; j < rows; j++) {
        // j = 0 é a borda de cima: a folha fica presa ali e a borda de baixo sobe.
        let y = BH * 0.485;
        let z = top + hover;
        let ang = 0;
        for (let k = 0; k < j; k++) {
          const p = (k + 0.5) / SY;
          ang = Math.min(theta, theta * Math.pow(p, 0.55) * 1.35);
          y -= Math.cos(ang) * rowLen;
          z += Math.sin(ang) * rowLen;
        }
        for (let i = 0; i < cols; i++) {
          const idx = (j * cols + i) * 3;
          arr[idx] = sheetBase[idx];
          arr[idx + 1] = y;
          arr[idx + 2] = z;
        }
      }
      pos.needsUpdate = true;
      sheetGeo.computeVertexNormals();
    }

    // 7. Balões: projeta o centro de cada peça e posiciona o SVG por cima.
    r.updateMatrixWorld(true);
    const ov = overlay.current;
    if (!ov || !ov.svg) return;
    const step = Math.floor(a);
    const stepParts: readonly number[] = a < 0.15 ? [] : step >= 0 && step < ASSEMBLY_PARTS.length ? ASSEMBLY_PARTS[step] : [];
    tmp.c.set(0, 0, 0);
    t.localToWorld(tmp.c);
    tmp.c.project(camera);
    const ccx = ((tmp.c.x + 1) / 2) * size.width;
    const ccy = ((1 - tmp.c.y) / 2) * vh;
    const onScreen = rect ? rect.bottom > 0 && rect.top < vh : false;
    const topLimit = rect ? rect.top + pad[0] + 14 : -Infinity;
    const bottomLimit = rect ? rect.bottom - pad[1] - 14 : Infinity;
    for (let n = 1; n <= 9; n++) {
      const spot = st.spots[n];
      spot.on = false;
      const el = ov.balloons[n];
      if (!el) continue;
      let want = 0;
      if (onScreen && a < 4.3) {
        if (a < 0.15) want = 1;
        else if (stepParts.includes(n)) want = 1;
      }
      st.balloonOpacity[n] = THREE.MathUtils.damp(st.balloonOpacity[n], want, 8, delta);
      const o = st.balloonOpacity[n];
      if (o < 0.01) {
        el.setAttribute("opacity", "0");
        continue;
      }
      tmp.v.set(...anchors[n]);
      t.localToWorld(tmp.v);
      tmp.v.project(camera);
      const ax = ((tmp.v.x + 1) / 2) * size.width;
      const ay = ((1 - tmp.v.y) / 2) * vh;
      let dx = ax - ccx;
      let dy = ay - ccy;
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      if (len < 8) {
        dx = 0.7;
        dy = -0.7;
      }
      const reach = n === 1 ? 0 : 26;
      spot.on = true;
      spot.o = o;
      spot.ax = ax;
      spot.ay = ay;
      spot.bx = ax + dx * reach;
      spot.by = Math.min(Math.max(ay + dy * reach, topLimit), bottomLimit);
    }
    const GAP = 33;
    for (let pass = 0; pass < 4; pass++) {
      for (let i = 1; i < 10; i++) {
        const u = st.spots[i];
        if (!u.on) continue;
        for (let j = i + 1; j < 10; j++) {
          const w = st.spots[j];
          if (!w.on) continue;
          let ex = w.bx - u.bx;
          let ey = w.by - u.by;
          const d = Math.hypot(ex, ey);
          if (d >= GAP) continue;
          if (d < 0.5) {
            ex = 1;
            ey = 0;
          } else {
            ex /= d;
            ey /= d;
          }
          const push = (GAP - d) / 2;
          u.bx -= ex * push;
          u.by = Math.min(Math.max(u.by - ey * push, topLimit), bottomLimit);
          w.bx += ex * push;
          w.by = Math.min(Math.max(w.by + ey * push, topLimit), bottomLimit);
        }
      }
    }
    for (let n = 1; n <= 9; n++) {
      const spot = st.spots[n];
      const el = ov.balloons[n];
      if (!spot.on || !el) continue;
      el.setAttribute("opacity", spot.o.toFixed(3));
      el.setAttribute("transform", `translate(${spot.bx.toFixed(1)} ${spot.by.toFixed(1)})`);
      const line = el.firstElementChild as SVGLineElement | null;
      if (line) {
        const lx = spot.ax - spot.bx;
        const ly = spot.ay - spot.by;
        const ll = Math.hypot(lx, ly);
        if (ll > 14) {
          line.setAttribute("x1", ((lx / ll) * 12).toFixed(1));
          line.setAttribute("y1", ((ly / ll) * 12).toFixed(1));
          line.setAttribute("x2", lx.toFixed(1));
          line.setAttribute("y2", ly.toFixed(1));
        } else {
          line.setAttribute("x2", "0");
          line.setAttribute("y2", "0");
          line.setAttribute("x1", "0");
          line.setAttribute("y1", "0");
        }
      }
    }
    if (ov.tag) ov.tag.setAttribute("opacity", "0");
  });

  return (
    <>
      <hemisphereLight args={["#fff1d6", "#4a2c18", 0.42]} />
      {/* Luz rasante de cima e da esquerda: é ela que faz o entalhe aparecer. */}
      <directionalLight position={[-5, 6.5, 2.4]} intensity={3.4} color="#ffe2b8" />
      <directionalLight position={[5, -2, 4]} intensity={0.35} color="#bcd0ff" />
      <group ref={root}>
        <group ref={turn}>
          {/* Corpo da prancha: lados de veio comprido e topos de veio cortado. */}
          <mesh position={[0, 0, -CARVE * 0.75]} material={[endMat, endMat, sideMat, sideMat, sideMat, sideMat]}>
            <boxGeometry args={[BW, BH, BD - CARVE * 1.5]} />
          </mesh>
          <mesh geometry={faceGeo} material={faceMat} position={[0, 0, BD / 2 + 0.001]} />
          <group ref={roller} visible={false}>
            <mesh geometry={rollerParts.drum} material={rollerParts.rubber} rotation={[0, 0, Math.PI / 2]} />
            <mesh geometry={rollerParts.axle} material={rollerParts.steel} rotation={[0, 0, Math.PI / 2]} />
            <mesh geometry={rollerParts.arm} material={rollerParts.steel} position={[-BW * 0.6, 0, 0.25]} />
            <mesh geometry={rollerParts.arm} material={rollerParts.steel} position={[BW * 0.6, 0, 0.25]} />
            <mesh geometry={rollerParts.grip} material={rollerParts.wood} position={[0, 0, 0.55]} rotation={[0, 0, Math.PI / 2]} />
          </group>
          <group ref={sheet} visible={false}>
            <mesh geometry={sheetGeo} material={sheetPrint} />
            <mesh geometry={sheetGeo} material={sheetPaper} />
          </group>
        </group>
      </group>
    </>
  );
}
