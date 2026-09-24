"use client";

// Fig. 1: o Cérebro Autark. Uma máquina procedural (nenhum GLB, nenhum request)
// que começa como desenho técnico em traço de tinta, em vista explodida, e vira
// objeto físico peça por peça conforme a montagem avança.
//
// Truque do "desenho": cada material mistura sua cor iluminada com a cor exata
// do papel (fundo da página) por um uniforme uMat. Em uMat = 0 a face some no
// fundo e só as arestas aparecem, com remoção de linhas ocultas de graça.

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import {
  ASSEMBLY_PARTS,
  POWER_WINDOW,
  SCREWS_WINDOW,
  STEP_COUNT,
  TESTS_WINDOW,
  WINDOWS,
  emitAssembly,
  machine,
  progressIn,
} from "./store";

// Cor do papel em sRGB puro (sem gestão de cor): o mix acontece depois da
// conversão de saída, então precisa ser o mesmo hex do --ground no CSS.
const PAPER = new THREE.Vector3(0x15 / 255, 0x18 / 255, 0x1b / 255);
const INK = "#ece7dc";
const LED_OFF = new THREE.Color("#2b3033");
const LED_ON = new THREE.Color("#3ddc97");

const LOGO_PATH =
  "M171 25.3a39 39 0 0 0-25.6 20.9c-1.5 2.9-16.7 30.3-33.8 60.8l-42.1 75-25.1 44.5c-24.3 42.8-25.3 60-4.6 81.7 28.1 29.5 74 21.3 96.3-17.2l13.4-23c22.9-39.7 42.9-73.6 43.9-74.8 1-1 2.7-.3 8.4 3.4 13 8.3 14.1 6 9.6-19.6l-3.4-20.7c-.1-5.2-39.4.3-46.2 6.4-3.9 3.5 3.3 12.5 12.6 15.6 1 .3-1.2 4.2-23.4 42.2l-31.9 54.9c-16.3 28.6-45.9 36.5-63.2 16.9-12.3-14.1-10.9-21.5 10.9-59.9L97 179l40.5-72L166 56.4c3.1-5.7 8.7-8.8 14.7-8.1 8.5.9 1.7-10 91.7 148 42.3 74.2 41 71.7 40.4 80.6-1.4 19.5-9.5 24.1-42.3 24.1-32.1 0-29.6 1.4-46.4-27.5-14.8-25.6-15.4-26.2-23.7-24.1-11.5 2.9-11 9.2 2.7 32.9 18.3 31.4 19.4 32.8 30.9 38.5l5.5 2.7h61l6.8-3.2c35.9-17 37.1-43.6 4.4-100.8l-58.2-102-41.8-73.4A38 38 0 0 0 171 25.3";

type Uniform = { value: number };

/** O "A" da Autark extrudado, em pé no plano XY, centrado na origem. */
function logoGeometry(scale: number) {
  const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 359 350"><path d="${LOGO_PATH}"/></svg>`);
  const shapes = data.paths.flatMap((p) => p.toShapes());
  const geo = new THREE.ExtrudeGeometry(shapes, { depth: 14, bevelEnabled: false, curveSegments: 18 });
  geo.center();
  // Girar 180° em X desvira o SVG (y para baixo) sem inverter o sentido das
  // faces, o que uma escala negativa faria (e o emblema ficaria preto).
  geo.rotateX(Math.PI);
  geo.scale(scale, scale, scale);
  return geo;
}

/** Etiqueta gravada (número de série) desenhada num canvas com a mono do site. */
function labelTexture(lines: string[], w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-martian").trim() || "monospace";
  ctx.fillStyle = "#e4ded1";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "#2a2e33";
  ctx.lineWidth = Math.max(2, h * 0.03);
  ctx.strokeRect(h * 0.08, h * 0.08, w - h * 0.16, h - h * 0.16);
  ctx.fillStyle = "#1d2125";
  ctx.textBaseline = "middle";
  const size = (h * 0.62) / lines.length;
  lines.forEach((line, i) => {
    ctx.font = `${i === 0 ? 600 : 500} ${size}px ${mono}`;
    ctx.fillText(line, h * 0.22, h * 0.5 + (i - (lines.length - 1) / 2) * size * 1.15);
  });
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** Injeta o mix papel → material. Todos os materiais de uma peça dividem o mesmo uniforme. */
function paint<T extends THREE.Material>(mat: T, u: Uniform): T {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uMat = u;
    shader.uniforms.uPaper = { value: PAPER };
    shader.fragmentShader =
      "uniform float uMat;\nuniform vec3 uPaper;\n" +
      shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        "#include <dithering_fragment>\n  gl_FragColor.rgb = mix(uPaper, gl_FragColor.rgb, uMat);",
      );
  };
  mat.customProgramCacheKey = () => "paint";
  mat.polygonOffset = true;
  mat.polygonOffsetFactor = 1;
  mat.polygonOffsetUnits = 1;
  return mat;
}

function palette(u: Uniform) {
  return {
    anod: paint(
      new THREE.MeshPhysicalMaterial({ color: "#6f7780", metalness: 0.72, roughness: 0.34, clearcoat: 0.35, clearcoatRoughness: 0.35 }),
      u,
    ),
    anodLight: paint(new THREE.MeshPhysicalMaterial({ color: "#9aa1a8", metalness: 0.7, roughness: 0.3, clearcoat: 0.5 }), u),
    dark: paint(new THREE.MeshStandardMaterial({ color: "#23272b", metalness: 0.2, roughness: 0.6 }), u),
    rubber: paint(new THREE.MeshStandardMaterial({ color: "#16191b", metalness: 0, roughness: 0.85 }), u),
    ivory: paint(new THREE.MeshPhysicalMaterial({ color: "#e4ded1", metalness: 0, roughness: 0.42, clearcoat: 0.25 }), u),
    orange: paint(new THREE.MeshPhysicalMaterial({ color: "#ff5a1f", metalness: 0.05, roughness: 0.38, clearcoat: 0.4 }), u),
    steel: paint(new THREE.MeshStandardMaterial({ color: "#a7adb3", metalness: 1, roughness: 0.28 }), u),
  };
}

function lineMat() {
  return new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 1, toneMapped: false, depthWrite: false });
}

function boxEdges(w: number, h: number, d: number) {
  return new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
}

function circle(r: number, seg = 64) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

type Piece = {
  geom: THREE.BufferGeometry;
  mat: THREE.Material;
  edges?: THREE.BufferGeometry;
  loop?: boolean;
  pos?: [number, number, number];
  rot?: [number, number, number];
};

type PartDef = {
  n: number;
  final: [number, number, number];
  explode: [number, number, number];
  anchor: [number, number, number];
  pieces: Piece[];
  uniform: Uniform;
  lines: THREE.LineBasicMaterial;
};

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// Onde a máquina olha em cada momento da montagem: [A, yaw, tilt]. Um giro
// completo ao longo da montagem, para mostrar a frente, as costas e o topo.
const VIEW: [number, number, number][] = [
  [-1, -0.62, 0.5],
  [0.5, -0.55, 0.46],
  [1.45, -0.3, 0.32],
  [2.45, 2.55, 0.36],
  [3.45, 3.35, 0.78],
  [4.45, 5.7, 0.55],
  [5.45, 5.66, 0.42],
  [6.5, 5.66, 0.42],
];

function viewAt(a: number): [number, number] {
  if (a <= VIEW[0][0]) return [VIEW[0][1], VIEW[0][2]];
  for (let i = 0; i < VIEW.length - 1; i++) {
    const [a0, y0, t0] = VIEW[i];
    const [a1, y1, t1] = VIEW[i + 1];
    if (a <= a1) {
      const k = smooth((a - a0) / (a1 - a0));
      return [y0 + (y1 - y0) * k, t0 + (t1 - t0) * k];
    }
  }
  const last = VIEW[VIEW.length - 1];
  return [last[1], last[2]];
}

export type OverlayRefs = {
  svg: SVGSVGElement | null;
  balloons: (SVGGElement | null)[];
  tag: SVGGElement | null;
};

export function Machine({ overlay, lite }: { overlay: React.RefObject<OverlayRefs>; lite: boolean }) {
  const { camera, size } = useThree();
  const root = useRef<THREE.Group>(null);
  const turn = useRef<THREE.Group>(null);
  const partRefs = useRef<(THREE.Group | null)[]>([]);
  const screwRefs = useRef<(THREE.Group | null)[]>([]);
  const leds = useRef<THREE.InstancedMesh>(null);
  const lamp = useRef<THREE.MeshStandardMaterial>(null);
  const dashes = useRef<(THREE.LineDashedMaterial | null)[]>([]);
  const shadowGroup = useRef<THREE.Group>(null);

  const state = useRef({
    a: machine.current,
    yaw: -0.62,
    tilt: 0.5,
    px: 0,
    py: 0,
    x: 0,
    y: 0,
    s: 0.001,
    placed: false,
    balloonOpacity: new Array(10).fill(0) as number[],
    // Posições da vez: âncora na peça e centro do balão, reaproveitadas a cada quadro.
    spots: Array.from({ length: 10 }, () => ({ on: false, ax: 0, ay: 0, bx: 0, by: 0, o: 0 })),
    tagOpacity: 0,
    lastEmit: -99,
    ledLit: -1,
  });

  const parts = useMemo<PartDef[]>(() => {
    const defs: PartDef[] = [];
    const mk = (u: Uniform) => palette(u);

    // 1: núcleo de regras (o chassi)
    {
      const u = { value: 0 };
      const m = mk(u);
      const pieces: Piece[] = [
        { geom: new RoundedBoxGeometry(3.2, 0.9, 2.2, 3, 0.09), mat: m.anod, edges: boxEdges(3.2, 0.9, 2.2) },
        {
          geom: new RoundedBoxGeometry(3.0, 0.7, 0.03, 2, 0.01),
          mat: m.dark,
          edges: boxEdges(3.0, 0.7, 0.03),
          pos: [0, 0, 1.11],
        },
        {
          geom: new THREE.CylinderGeometry(0.62, 0.62, 0.012, 48),
          mat: m.dark,
          edges: circle(0.62),
          loop: true,
          pos: [0.75, 0.451, -0.1],
        },
        {
          geom: new THREE.CylinderGeometry(0.075, 0.075, 0.06, 24),
          mat: m.dark,
          pos: [1.3, 0.15, 1.13],
          rot: [Math.PI / 2, 0, 0],
        },
        {
          geom: new THREE.BoxGeometry(0.26, 0.06, 0.01),
          mat: paint(new THREE.MeshStandardMaterial({ map: labelTexture(["AT-01"], 256, 64), roughness: 0.5 }), u),
          pos: [1.3, -0.16, 1.13],
        },
      ];
      // Emblema da marca em relevo na frente, lido de pé como numa placa de máquina.
      pieces.push({ geom: logoGeometry(0.0012), mat: m.ivory, pos: [0.93, 0.03, 1.128] });
      for (const [fx, fz] of [
        [-1.35, -0.9],
        [1.35, -0.9],
        [-1.35, 0.9],
        [1.35, 0.9],
      ]) {
        pieces.push({ geom: new THREE.CylinderGeometry(0.1, 0.1, 0.06, 20), mat: m.rubber, pos: [fx, -0.48, fz] });
      }
      defs.push({ n: 1, final: [0, 0, 0], explode: [0, 0, 0], anchor: [-1.2, 0.45, 0.7], pieces, uniform: u, lines: lineMat() });
    }

    // 2–4: portas de canal (cartuchos que entram pela frente)
    const channelX = [-1.15, -0.45, 0.25];
    channelX.forEach((x, i) => {
      const u = { value: 0 };
      const m = mk(u);
      const pieces: Piece[] = [
        { geom: new RoundedBoxGeometry(0.6, 0.44, 0.7, 2, 0.04), mat: m.rubber, edges: boxEdges(0.6, 0.44, 0.7) },
        {
          geom: new RoundedBoxGeometry(0.64, 0.48, 0.08, 2, 0.02),
          mat: m.ivory,
          edges: boxEdges(0.64, 0.48, 0.08),
          pos: [0, 0, 0.39],
        },
      ];
      if (i === 0) {
        pieces.push({ geom: new THREE.TorusGeometry(0.075, 0.014, 8, 32), mat: m.dark, pos: [0, 0, 0.436] });
      } else if (i === 1) {
        pieces.push({
          geom: new THREE.CylinderGeometry(0.1, 0.1, 0.02, 3),
          mat: m.dark,
          pos: [0, 0, 0.436],
          rot: [Math.PI / 2, 0, -Math.PI / 6],
        });
      } else {
        for (const y of [-0.05, 0, 0.05]) {
          pieces.push({ geom: new THREE.BoxGeometry(0.18, 0.018, 0.01), mat: m.dark, pos: [0, y, 0.437] });
        }
      }
      defs.push({ n: 2 + i, final: [x, -0.02, 0.9], explode: [0, 0, 2.1], anchor: [0, 0.24, 0.43], pieces, uniform: u, lines: lineMat() });
    });

    // 5–7: conectores (plugues laranja que entram por trás)
    const plugX = [-1.0, -0.25, 0.5];
    plugX.forEach((x, i) => {
      const u = { value: 0 };
      const m = mk(u);
      const rx: [number, number, number] = [Math.PI / 2, 0, 0];
      const pieces: Piece[] = [
        {
          geom: new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32),
          mat: m.dark,
          edges: new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 32), 30),
          pos: [0, 0, -0.02],
          rot: rx,
        },
        {
          geom: new THREE.CylinderGeometry(0.16, 0.16, 0.42, 32),
          mat: m.orange,
          edges: new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.16, 0.16, 0.42, 32), 30),
          pos: [0, 0, -0.25],
          rot: rx,
        },
        {
          geom: new THREE.CylinderGeometry(0.065, 0.065, 0.9, 16),
          mat: m.rubber,
          edges: new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.065, 0.065, 0.9, 16), 30),
          pos: [0, 0, -0.9],
          rot: rx,
        },
      ];
      defs.push({ n: 5 + i, final: [x, 0.02, -1.1], explode: [0, 0, -2.1], anchor: [0, 0.17, -0.3], pieces, uniform: u, lines: lineMat() });
    });

    // 8: bancada de testes (anel de lâmpadas)
    {
      const u = { value: 0 };
      const m = mk(u);
      const pieces: Piece[] = [
        { geom: new THREE.TorusGeometry(0.52, 0.06, 12, 64), mat: m.dark, rot: [Math.PI / 2, 0, 0] },
        { geom: new THREE.BufferGeometry(), mat: m.dark, edges: circle(0.46), loop: true },
        { geom: new THREE.BufferGeometry(), mat: m.dark, edges: circle(0.58), loop: true },
      ];
      defs.push({ n: 8, final: [0.75, 0.47, -0.1], explode: [0, 1.7, 0], anchor: [0, 0.07, 0.56], pieces, uniform: u, lines: lineMat() });
    }

    // 9: tampa com o emblema, e os parafusos
    {
      const u = { value: 0 };
      const m = mk(u);
      const pieces: Piece[] = [
        { geom: new RoundedBoxGeometry(1.66, 0.06, 2.02, 2, 0.025), mat: m.anodLight, edges: boxEdges(1.66, 0.06, 2.02) },
      ];
      // Etiqueta de identificação e faixa laranja na tampa.
      pieces.push({ geom: new THREE.BoxGeometry(0.62, 0.012, 0.16), mat: paint(new THREE.MeshStandardMaterial({ map: labelTexture(["AUTARK  AT-01", "SN 2026-09 · REV. 2026.09"], 512, 132), roughness: 0.5 }), u), pos: [0.2, 0.036, 0.62] });
      pieces.push({ geom: new THREE.BoxGeometry(1.3, 0.012, 0.05), mat: m.orange, pos: [0, 0.036, -0.72] });
      defs.push({ n: 9, final: [-0.72, 0.485, 0], explode: [0, 2.1, 0], anchor: [-0.62, 0.03, 0.85], pieces, uniform: u, lines: lineMat() });
    }

    return defs;
  }, []);

  const screwParts = useMemo(() => {
    const u = parts[parts.length - 1].uniform;
    const m = palette(u);
    return {
      head: new THREE.CylinderGeometry(0.05, 0.05, 0.04, 20),
      slot: new THREE.BoxGeometry(0.075, 0.012, 0.014),
      mat: m.steel,
      dark: m.dark,
      at: [
        [-0.72, 0.05, -0.9],
        [0.72, 0.05, -0.9],
        [-0.72, 0.05, 0.9],
        [0.72, 0.05, 0.9],
      ] as [number, number, number][],
    };
  }, [parts]);

  const ledGeo = useMemo(() => new THREE.BoxGeometry(0.05, 0.03, 0.07), []);
  const ledMat = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false });
    return paint(m, parts.find((p) => p.n === 8)!.uniform);
  }, [parts]);

  const ledMatrices = useMemo(() => {
    const out: THREE.Matrix4[] = [];
    const o = new THREE.Object3D();
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      o.position.set(Math.cos(a) * 0.52, 0.055, Math.sin(a) * 0.52);
      o.rotation.set(0, -a, 0);
      o.updateMatrix();
      out.push(o.matrix.clone());
    }
    return out;
  }, []);

  const dashGeoms = useMemo(
    () =>
      parts
        .filter((p) => p.n !== 1)
        .map((p) => {
          const a = new THREE.Vector3(...p.final);
          const b = a.clone().add(new THREE.Vector3(...p.explode));
          const g = new THREE.BufferGeometry().setFromPoints([a, b]);
          const line = new THREE.Line(g);
          line.computeLineDistances();
          return { n: p.n, geom: line.geometry };
        }),
    [parts],
  );

  const tmp = useMemo(
    () => ({ v: new THREE.Vector3(), c: new THREE.Vector3(), color: new THREE.Color(), lampColor: new THREE.Color("#3ddc97") }),
    [],
  );

  const slotsRef = useRef<HTMLElement[] | null>(null);

  useFrame((frame, dt) => {
    const st = state.current;
    const r = root.current;
    const t = turn.current;
    if (!r || !t) return;
    const delta = Math.min(dt, 1 / 20);

    // 1. Progresso da montagem, amortecido para o scrub parecer físico.
    const target = machine.reduced ? STEP_COUNT : machine.target;
    st.a = machine.reduced ? target : THREE.MathUtils.damp(st.a, target, 5, delta);
    const a = st.a;
    machine.current = a;
    if (Math.abs(a - st.lastEmit) > 0.002) {
      st.lastEmit = a;
      emitAssembly(a);
    }

    // 2. Onde está o "papel" desta figura: o slot ativo no DOM.
    if (!slotsRef.current) slotsRef.current = Array.from(document.querySelectorAll<HTMLElement>("[data-machine-slot]"));
    // Vale o slot com mais área dentro da janela; se nenhum aparece, o mais próximo.
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
        // data-pad="topo base": faixa reservada para legenda e régua da figura.
        const padAttr = size.width <= 960 && el.dataset.padSm ? el.dataset.padSm : el.dataset.pad;
        pad = (padAttr ?? "0 0").split(" ").map(Number);
      }
    }
    if (rect) {
      const cam = camera as THREE.PerspectiveCamera;
      const worldH = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
      const upp = worldH / vh;
      const cx = rect.left + rect.width / 2;
      const innerH = Math.max(60, rect.height - pad[0] - pad[1]);
      const cy = rect.top + pad[0] + innerH / 2;
      const assembled = smooth(Math.min(1, Math.max(0, (a - 4.2) / 1.2)));
      const fit = 7.5 - 2.5 * assembled;
      const tx = (cx - size.width / 2) * upp;
      const ty = -(cy - vh / 2) * upp;
      const ts = (Math.min(rect.width, innerH * 1.12) * upp) / fit;
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
      r.position.set(st.x + 0.3 * st.s * (1 - assembled), st.y - 0.75 * st.s * (1 - assembled), 0);
      r.scale.setScalar(st.s);
    }

    // 3. Ângulo: roteiro da montagem + respiração ociosa + parallax do cursor.
    const [yaw, tilt] = viewAt(a);
    const idle = machine.reduced ? 0 : 1;
    const time = frame.clock.elapsedTime;
    st.px = THREE.MathUtils.damp(st.px, machine.pointerX * idle, 3, delta);
    st.py = THREE.MathUtils.damp(st.py, machine.pointerY * idle, 3, delta);
    t.rotation.set(tilt + st.py * 0.08, yaw + Math.sin(time * 0.35) * 0.05 * idle + st.px * 0.16, 0, "XYZ");

    // 4. Peças: posição (explodida → encaixada), material (traço → objeto).
    let solid = 0;
    for (const p of parts) {
      const g = partRefs.current[p.n];
      if (!g) continue;
      const w = WINDOWS[p.n];
      const k = progressIn(a, w);
      const ins = p.n === 1 ? 1 : easeOut(k);
      g.position.set(
        p.final[0] + p.explode[0] * (1 - ins),
        p.final[1] + p.explode[1] * (1 - ins),
        p.final[2] + p.explode[2] * (1 - ins),
      );
      p.uniform.value = smooth(k);
      p.lines.opacity = 1 - 0.82 * smooth(k);
      solid += smooth(k);
    }
    solid /= parts.length;

    dashGeoms.forEach((d, i) => {
      const m = dashes.current[i];
      if (!m) return;
      m.opacity = 0.55 * (1 - progressIn(a, WINDOWS[d.n]));
    });

    // 5. Parafusos descem girando.
    const sk = progressIn(a, SCREWS_WINDOW);
    screwRefs.current.forEach((sg, i) => {
      if (!sg) return;
      const local = Math.min(1, Math.max(0, sk * 1.4 - i * 0.12));
      const e = easeOut(local);
      sg.position.y = screwParts.at[i][1] + (1 - e) * 0.6;
      sg.rotation.y = (1 - e) * Math.PI * 6;
    });

    // 6. Bancada de testes: as lâmpadas acendem; depois de ligada, corrida.
    const im = leds.current;
    if (im) {
      const lit = Math.floor(progressIn(a, TESTS_WINDOW) * 36);
      const power = progressIn(a, POWER_WINDOW);
      for (let i = 0; i < 36; i++) {
        let on = i < lit ? 1 : 0;
        if (power > 0 && !machine.reduced) {
          const wave = (Math.sin(time * 3 - (i / 36) * Math.PI * 2) + 1) / 2;
          on = 0.55 + 0.45 * wave * power;
        }
        tmp.color.copy(LED_OFF).lerp(LED_ON, on);
        im.setColorAt(i, tmp.color);
      }
      if (im.instanceColor) im.instanceColor.needsUpdate = true;
    }
    if (lamp.current) {
      const power = progressIn(a, POWER_WINDOW);
      const pulse = machine.reduced ? 1 : 0.8 + 0.2 * Math.sin(time * 2.2);
      lamp.current.emissiveIntensity = power * 2.4 * pulse;
      lamp.current.color.set(power > 0.05 ? "#3ddc97" : "#1d2125");
    }
    if (shadowGroup.current) shadowGroup.current.visible = solid > 0.05;

    // 7. Balões: projeta a âncora de cada peça e posiciona o SVG por cima.
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

    const top = rect ? rect.top + pad[0] + 14 : -Infinity;
    const bottom = rect ? rect.bottom - pad[1] - 14 : Infinity;
    for (const p of parts) {
      const spot = st.spots[p.n];
      spot.on = false;
      const el = ov.balloons[p.n];
      const g = partRefs.current[p.n];
      if (!el || !g) continue;
      let want = 0;
      if (onScreen) {
        if (a < 0.15) want = 1;
        else if (stepParts.includes(p.n)) want = 1;
      }
      st.balloonOpacity[p.n] = THREE.MathUtils.damp(st.balloonOpacity[p.n], want, 8, delta);
      const o = st.balloonOpacity[p.n];
      if (o < 0.01) {
        el.setAttribute("opacity", "0");
        continue;
      }
      tmp.v.set(...p.anchor);
      g.localToWorld(tmp.v);
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
      const reach = 34 + 30 * (p.n % 3) * 0.5;
      spot.on = true;
      spot.o = o;
      spot.ax = ax;
      spot.ay = ay;
      spot.bx = ax + dx * reach;
      // O balão nunca invade as faixas reservadas da moldura (fileira de peças,
      // carimbo, legenda): fica dentro da área útil do slot.
      spot.by = Math.min(Math.max(ay + dy * reach, top), bottom);
    }

    // Na vista explodida do celular as peças ficam perto e os balões se
    // sobrepunham: afasta os pares que se tocam, mantendo a faixa útil.
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
          u.by = Math.min(Math.max(u.by - ey * push, top), bottom);
          w.bx += ex * push;
          w.by = Math.min(Math.max(w.by + ey * push, top), bottom);
        }
      }
    }

    for (const p of parts) {
      const spot = st.spots[p.n];
      const el = ov.balloons[p.n];
      if (!spot.on || !el) continue;
      el.setAttribute("opacity", spot.o.toFixed(3));
      el.setAttribute("transform", `translate(${spot.bx.toFixed(1)} ${spot.by.toFixed(1)})`);
      // A linha de chamada sai da borda do balão (raio 12) e termina na peça.
      const line = el.firstElementChild as SVGLineElement | null;
      if (line) {
        const lx = spot.ax - spot.bx;
        const ly = spot.ay - spot.by;
        const ll = Math.hypot(lx, ly) || 1;
        line.setAttribute("x1", ((lx / ll) * 12).toFixed(1));
        line.setAttribute("y1", ((ly / ll) * 12).toFixed(1));
        line.setAttribute("x2", lx.toFixed(1));
        line.setAttribute("y2", ly.toFixed(1));
      }
    }

    // Etiqueta OPERANDO na lâmpada.
    if (ov.tag) {
      const power = progressIn(a, POWER_WINDOW);
      st.tagOpacity = THREE.MathUtils.damp(st.tagOpacity, onScreen && power > 0.5 ? 1 : 0, 6, delta);
      if (st.tagOpacity < 0.01) ov.tag.setAttribute("opacity", "0");
      else {
        const core = partRefs.current[1];
        if (core) {
          tmp.v.set(1.3, 0.15, 1.16);
          core.localToWorld(tmp.v);
          tmp.v.project(camera);
          const lx = ((tmp.v.x + 1) / 2) * size.width;
          const ly = ((1 - tmp.v.y) / 2) * vh;
          ov.tag.setAttribute("opacity", st.tagOpacity.toFixed(3));
          ov.tag.setAttribute("transform", `translate(${lx.toFixed(1)} ${ly.toFixed(1)})`);
        }
      }
    }
  });

  return (
    <>
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 2]} rotation={[-Math.PI / 2, 0, 0]} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={1.4} position={[-7, 2, 3]} rotation={[0, Math.PI / 2, 0]} scale={[8, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[7, 1, -2]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 1.2, 1]} />
        <Lightformer form="ring" color="#ffd9c4" intensity={0.8} position={[3, 3, 7]} scale={3} />
      </Environment>
      <ambientLight intensity={0.45} />
      <directionalLight position={[-4, 8, 6]} intensity={2.1} />
      <directionalLight position={[6, 3, -6]} intensity={0.9} color="#ffe2d2" />

      <group ref={root}>
        <group ref={turn}>
          {parts.map((p) => (
            <group
              key={p.n}
              ref={(el) => {
                partRefs.current[p.n] = el;
              }}
              position={p.final}
            >
              {p.pieces.map((pc, i) => (
                <group key={i} position={pc.pos} rotation={pc.rot}>
                  {pc.geom.attributes.position ? <mesh geometry={pc.geom} material={pc.mat} /> : null}
                  {pc.edges ? (
                    pc.loop ? (
                      <lineLoop geometry={pc.edges} material={p.lines} />
                    ) : (
                      <lineSegments geometry={pc.edges} material={p.lines} />
                    )
                  ) : null}
                </group>
              ))}
              {p.n === 1 ? (
                <mesh position={[1.3, 0.15, 1.165]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.06, 0.06, 0.02, 24]} />
                  <meshStandardMaterial ref={lamp} color="#1d2125" emissive="#3ddc97" emissiveIntensity={0} toneMapped={false} />
                </mesh>
              ) : null}
              {p.n === 8 ? (
                <instancedMesh
                  ref={(im) => {
                    leds.current = im;
                    if (im) {
                      ledMatrices.forEach((m, i) => {
                        im.setMatrixAt(i, m);
                        im.setColorAt(i, LED_OFF);
                      });
                      im.instanceMatrix.needsUpdate = true;
                    }
                  }}
                  args={[ledGeo, ledMat, 36]}
                />
              ) : null}
              {p.n === 9
                ? screwParts.at.map((pos, i) => (
                    <group
                      key={i}
                      ref={(el) => {
                        screwRefs.current[i] = el;
                      }}
                      position={pos}
                    >
                      <mesh geometry={screwParts.head} material={screwParts.mat} />
                      <mesh geometry={screwParts.slot} material={screwParts.dark} position={[0, 0.021, 0]} />
                    </group>
                  ))
                : null}
            </group>
          ))}

          {dashGeoms.map((d, i) => (
            <lineSegments key={d.n} geometry={d.geom}>
              <lineDashedMaterial
                ref={(m) => {
                  dashes.current[i] = m;
                }}
                color={INK}
                dashSize={0.09}
                gapSize={0.07}
                transparent
                opacity={0.55}
                toneMapped={false}
                depthWrite={false}
              />
            </lineSegments>
          ))}

          {!lite ? (
            <group ref={shadowGroup} position={[0, -0.52, 0]}>
              <ContactShadows opacity={0.55} scale={7} blur={2.6} far={1.6} resolution={512} color="#000000" frames={Infinity} />
            </group>
          ) : null}
        </group>
      </group>
    </>
  );
}
