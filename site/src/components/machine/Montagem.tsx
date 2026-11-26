"use client";

// Fig. 1: o Cérebro Autark em desenho técnico 3D. Faces lisas em três tons de
// papel e arestas em traço grafite firme (linhas de largura fixa em pixels, com
// as linhas escondidas removidas pela profundidade), câmera ortográfica
// isométrica. O scroll de §1 monta as peças ao longo das linhas de chamada; a
// peça do passo atual é traçada em verde; no último passo a lâmpada acende.
// Sem textura, sem luz, sem sombra: leve até em celular fraco.

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import modelo from "./modelo.json";
import bounds from "./poster-bounds.json";
import { ASSEMBLY_PARTS, POWER_WINDOW, SCREWS_WINDOW, STEP_COUNT, WINDOWS, emitAssembly, machine, progressIn } from "./store";

export type OverlayRefs = {
  svg: SVGSVGElement | null;
  balloons: (SVGGElement | null)[];
  tag: SVGGElement | null;
};

type Shape = { t: "box"; s: number[]; p: number[] } | { t: "cyl"; r: number; h: number; p: number[] };

const ISO = Math.atan(1 / Math.SQRT2);
const YAW = -Math.PI / 4;
const INK = new THREE.Color("#1b1f22");
const VERDE = new THREE.Color("#0d7050");
const LIGHT = new THREE.Vector3(-0.4, 1, 0.75).normalize();
// Limites do desenho: vista explodida (os do pôster) e peça montada (mais perto).
const EX = { w: bounds.maxX - bounds.minX, h: bounds.maxY - bounds.minY, cx: (bounds.minX + bounds.maxX) / 2, cy: (bounds.minY + bounds.maxY) / 2 };
const MO = {
  w: bounds.montada.maxX - bounds.montada.minX,
  h: bounds.montada.maxY - bounds.montada.minY,
  cx: (bounds.montada.minX + bounds.montada.maxX) / 2,
  cy: (bounds.montada.minY + bounds.montada.maxY) / 2,
};

const smooth = (t: number) => t * t * (3 - 2 * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Três tons de papel pela face: a mesma conta do pôster (scripts/cerebro-poster.mjs).
const faceVert = /* glsl */ `
  varying vec3 vN;
  void main() {
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const faceFrag = /* glsl */ `
  uniform vec3 uLight;
  uniform float uHi;
  uniform float uLamp;
  varying vec3 vN;
  void main() {
    float k = 0.25 + 0.75 * max(0.0, dot(normalize(vN), uLight));
    vec3 dark = vec3(0.827, 0.851, 0.839);
    vec3 light = vec3(0.973, 0.980, 0.976);
    vec3 c = mix(dark, light, k);
    c = mix(c, vec3(0.85, 0.93, 0.89), uHi * 0.85);
    c = mix(c, vec3(0.051, 0.439, 0.314), uLamp);
    gl_FragColor = vec4(c, 1.0);
  }
`;
// Contorno de cilindro: casca de dentro para fora, empurrada pela normal.
const hullVert = /* glsl */ `
  uniform float uW;
  void main() {
    vec3 p = position + normal * uW;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const hullFrag = /* glsl */ `
  uniform vec3 uColor;
  void main() { gl_FragColor = vec4(uColor, 1.0); }
`;

function geometryOf(sh: Shape) {
  return sh.t === "box" ? new THREE.BoxGeometry(sh.s[0], sh.s[1], sh.s[2]) : new THREE.CylinderGeometry(sh.r, sh.r, sh.h, 32, 1);
}

type Piece = {
  key: string;
  n: number;
  group: THREE.Group;
  explode: THREE.Vector3;
  window: [number, number];
  faceMat: THREE.ShaderMaterial;
  lineMat: LineMaterial;
  hullMat: THREE.ShaderMaterial | null;
  anchor: THREE.Vector3;
  hi: number;
};

function buildPiece(key: string, n: number, shapes: Shape[], explode: number[], window: [number, number]): Piece {
  const group = new THREE.Group();
  const faceMat = new THREE.ShaderMaterial({
    vertexShader: faceVert,
    fragmentShader: faceFrag,
    uniforms: { uLight: { value: LIGHT }, uHi: { value: 0 }, uLamp: { value: 0 } },
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const lineMat = new LineMaterial({ color: INK.getHex(), linewidth: 1.6, worldUnits: false });
  let hullMat: THREE.ShaderMaterial | null = null;
  for (const sh of shapes) {
    const geo = geometryOf(sh);
    const mesh = new THREE.Mesh(geo, faceMat);
    mesh.position.set(sh.p[0], sh.p[1], sh.p[2]);
    group.add(mesh);
    const edges = new THREE.EdgesGeometry(geo, 25);
    const lg = new LineSegmentsGeometry().setPositions(edges.attributes.position.array as Float32Array);
    edges.dispose();
    const lines = new LineSegments2(lg, lineMat);
    lines.position.copy(mesh.position);
    group.add(lines);
    if (sh.t === "cyl") {
      hullMat ??= new THREE.ShaderMaterial({
        vertexShader: hullVert,
        fragmentShader: hullFrag,
        uniforms: { uW: { value: 0.01 }, uColor: { value: INK.clone() } },
        side: THREE.BackSide,
      });
      const hull = new THREE.Mesh(geo, hullMat);
      hull.position.copy(mesh.position);
      hull.renderOrder = -1;
      group.add(hull);
    }
  }
  const first = shapes[0];
  return {
    key,
    n,
    group,
    explode: new THREE.Vector3(explode[0], explode[1], explode[2]),
    window,
    faceMat,
    lineMat,
    hullMat,
    anchor: new THREE.Vector3(first.p[0], first.p[1], first.p[2]),
    hi: 0,
  };
}

export function Machine({ overlay, lite }: { overlay: React.RefObject<OverlayRefs>; lite: boolean }) {
  const { camera, size } = useThree();
  const root = useRef<THREE.Group>(null);
  const turn = useRef<THREE.Group>(null);

  const pieces = useMemo(() => {
    const list: Piece[] = [];
    for (const part of modelo.parts) {
      const win: [number, number] = part.n === 1 ? [0.05, 0.85] : WINDOWS[part.n];
      list.push(buildPiece(`p${part.n}`, part.n, part.shapes as Shape[], part.explode, win));
    }
    list.push(buildPiece("screws", 9, modelo.screws.shapes as Shape[], modelo.screws.explode, SCREWS_WINDOW));
    const lid = modelo.parts.find((p) => p.n === 9)!;
    list.push(buildPiece("lamp", 9, [modelo.lamp as Shape], lid.explode, WINDOWS[9]));
    return list;
  }, []);

  useEffect(() => {
    const t = turn.current;
    if (!t) return;
    pieces.forEach((p) => t.add(p.group));
    return () => {
      pieces.forEach((p) => {
        t.remove(p.group);
        p.group.traverse((o) => {
          if (o instanceof THREE.Mesh || o instanceof LineSegments2) o.geometry.dispose();
        });
        p.faceMat.dispose();
        p.lineMat.dispose();
        p.hullMat?.dispose();
      });
    };
  }, [pieces]);

  const state = useRef({
    a: machine.current,
    px: 0,
    py: 0,
    x: 0,
    y: 0,
    s: 1,
    bcx: 0,
    bcy: 0,
    placed: false,
    lastEmit: -99,
    balloonOpacity: new Array(10).fill(0) as number[],
    tagOpacity: 0,
    spots: Array.from({ length: 10 }, () => ({ on: false, ax: 0, ay: 0, bx: 0, by: 0, o: 0 })),
  });
  const tmp = useMemo(() => ({ v: new THREE.Vector3(), c: new THREE.Vector3() }), []);
  const slotsRef = useRef<HTMLElement[] | null>(null);
  const lamp = pieces.find((p) => p.key === "lamp")!;

  useFrame((frame, dt) => {
    const st = state.current;
    const r = root.current;
    const t = turn.current;
    if (!r || !t) return;
    const delta = Math.min(dt, 1 / 20);

    // 1. Progresso amortecido pelo relógio de verdade (ver o comentário antigo:
    // num aparelho a 2 quadros por segundo a montagem ainda acompanha o scroll).
    const target = machine.reduced ? STEP_COUNT : machine.target;
    st.a = machine.reduced ? target : THREE.MathUtils.damp(st.a, target, 5, Math.min(dt, 0.5));
    const a = st.a;
    machine.current = a;
    if (Math.abs(a - st.lastEmit) > 0.002) {
      st.lastEmit = a;
      emitAssembly(a);
    }

    // 2. O slot ativo no DOM: o desenho cabe na moldura visível, nos mesmos
    // limites do pôster, para cair exatamente em cima dele.
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
    if (rect) {
      const innerH = Math.max(60, rect.height - pad[0] - pad[1]);
      const innerW = rect.width;
      // Conforme a montagem fecha, o enquadramento vai da vista explodida para a peça montada.
      const z = smooth(Math.min(1, Math.max(0, a / (STEP_COUNT - 1))));
      const bw = THREE.MathUtils.lerp(EX.w, MO.w, z);
      const bh = THREE.MathUtils.lerp(EX.h, MO.h, z);
      const bcx = THREE.MathUtils.lerp(EX.cx, MO.cx, z);
      const bcy = THREE.MathUtils.lerp(EX.cy, MO.cy, z);
      st.bcx = bcx;
      st.bcy = bcy;
      const ts = Math.min(innerW / bw, innerH / bh);
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + pad[0] + innerH / 2;
      const tx = cx - size.width / 2 - ts * bcx;
      const ty = -(cy - vh / 2) - ts * bcy;
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
      r.position.set(st.x, st.y, 0);
      r.scale.setScalar(st.s);
    }

    // 3. Ângulo isométrico + parallax curto do cursor (sem respiração: desenho técnico não balança).
    const idle = machine.reduced ? 0 : 1;
    st.px = THREE.MathUtils.damp(st.px, machine.pointerX * idle, 3, delta);
    st.py = THREE.MathUtils.damp(st.py, machine.pointerY * idle, 3, delta);
    t.rotation.set(ISO + st.py * 0.04, YAW + st.px * 0.09, 0, "XYZ");

    // 4. Peças: cada uma volta da vista explodida para o lugar na sua janela.
    const step = Math.floor(a);
    const stepParts: readonly number[] = a < 0.15 || a >= STEP_COUNT - 1 ? [] : (ASSEMBLY_PARTS[step] ?? []);
    const power = progressIn(a, POWER_WINDOW);
    const outline = 1.5 / Math.max(st.s, 1);
    for (const p of pieces) {
      const k = easeOut(smooth(progressIn(a, p.window)));
      p.group.position.copy(p.explode).multiplyScalar(1 - k);
      const want = stepParts.includes(p.n) ? 1 : 0;
      p.hi = THREE.MathUtils.damp(p.hi, want, 8, delta);
      p.faceMat.uniforms.uHi.value = p.hi;
      p.lineMat.color.copy(INK).lerp(VERDE, p.hi);
      p.lineMat.resolution.set(size.width, size.height);
      if (p.hullMat) {
        p.hullMat.uniforms.uW.value = outline;
        (p.hullMat.uniforms.uColor.value as THREE.Color).copy(INK).lerp(VERDE, p.hi);
      }
    }
    lamp.faceMat.uniforms.uLamp.value = smooth(power);
    void lite;

    // 5. Balões: projeta o centro de cada peça e posiciona o SVG por cima.
    r.updateMatrixWorld(true);
    const ov = overlay.current;
    if (!ov || !ov.svg) return;
    const ccx = size.width / 2 + st.x + st.s * st.bcx;
    const ccy = vh / 2 - (st.y + st.s * st.bcy);
    const onScreen = rect ? rect.bottom > 0 && rect.top < vh : false;
    const topLimit = rect ? rect.top + pad[0] + 14 : -Infinity;
    const bottomLimit = rect ? rect.bottom - pad[1] - 14 : Infinity;
    for (let n = 1; n <= 9; n++) {
      const spot = st.spots[n];
      spot.on = false;
      const el = ov.balloons[n];
      if (!el) continue;
      let want = 0;
      if (onScreen && a < STEP_COUNT - 1.2) {
        if (a < 0.15) want = 1;
        else if (stepParts.includes(n)) want = 1;
      }
      st.balloonOpacity[n] = THREE.MathUtils.damp(st.balloonOpacity[n], want, 8, delta);
      const o = st.balloonOpacity[n];
      if (o < 0.01) {
        el.setAttribute("opacity", "0");
        continue;
      }
      const piece = pieces.find((p) => p.key === `p${n}`)!;
      tmp.v.copy(piece.anchor).add(piece.group.position);
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
      const reach = n === 1 ? 0 : Math.max(26, st.s * 0.62);
      spot.on = true;
      spot.o = o;
      spot.ax = ax;
      spot.ay = ay;
      spot.bx = ax + dx * reach;
      spot.by = Math.min(Math.max(ay + dy * reach, topLimit), bottomLimit);
    }
    const GAP = 30;
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
          line.setAttribute("x1", "0");
          line.setAttribute("y1", "0");
          line.setAttribute("x2", "0");
          line.setAttribute("y2", "0");
        }
      }
    }

    // 6. Etiqueta OPERANDO presa na lâmpada quando ela acende.
    st.tagOpacity = THREE.MathUtils.damp(st.tagOpacity, onScreen && power > 0.5 ? 1 : 0, 8, delta);
    if (ov.tag) {
      if (st.tagOpacity < 0.01) ov.tag.setAttribute("opacity", "0");
      else {
        tmp.v.copy(lamp.anchor).add(lamp.group.position);
        t.localToWorld(tmp.v);
        tmp.v.project(camera);
        const lx = ((tmp.v.x + 1) / 2) * size.width;
        const ly = ((1 - tmp.v.y) / 2) * vh;
        ov.tag.setAttribute("opacity", st.tagOpacity.toFixed(3));
        ov.tag.setAttribute("transform", `translate(${lx.toFixed(1)} ${ly.toFixed(1)})`);
      }
    }
    void frame;
  });

  return (
    <group ref={root}>
      <group ref={turn} />
    </group>
  );
}
