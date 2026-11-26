// Gera o pôster da Fig. 1 (o Cérebro Autark em vista explodida, isométrica) como
// SVG, a partir do mesmo modelo que a cena 3D usa. O pôster aparece antes do 3D
// carregar, sem WebGL e sem JavaScript; a cena usa os mesmos limites para cair
// exatamente em cima dele.
//
//   node scripts/cerebro-poster.mjs
//
// Saídas: public/figs/cerebro-explodido.svg e src/components/machine/poster-bounds.json

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// --montado <arquivo.svg>: a peça montada e ligada (lâmpada verde), sem balões,
// para material de divulgação. Não mexe no pôster nem nos limites da cena.
const iMontado = process.argv.indexOf("--montado");
const MONTADO = iMontado > -1 ? process.argv[iMontado + 1] : null;
const off = (v) => (MONTADO ? [0, 0, 0] : v);
const modelo = JSON.parse(readFileSync(join(root, "src/components/machine/modelo.json"), "utf8"));

const INK = "#1b1f22";
const ISO = Math.atan(1 / Math.SQRT2);
const YAW = -Math.PI / 4;
const SEG = 32;
// Mesma luz da cena: de cima, um pouco à esquerda e de frente.
const L = norm([-0.4, 1, 0.75]);
const TONE_DARK = [0xd3, 0xd9, 0xd6];
const TONE_LIGHT = [0xf8, 0xfa, 0xf9];

function norm(v) {
  const l = Math.hypot(...v) || 1;
  return v.map((x) => x / l);
}
function sub(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/** Mundo -> vista: gira em Y (-45°) e depois em X (35,26°), como a cena. */
function view([x, y, z]) {
  const c = Math.cos(YAW);
  const s = Math.sin(YAW);
  const x1 = x * c + z * s;
  const z1 = -x * s + z * c;
  const ci = Math.cos(ISO);
  const si = Math.sin(ISO);
  return [x1, y * ci - z1 * si, y * si + z1 * ci];
}

function boxMesh(s, p) {
  const [w, h, d] = s.map((v) => v / 2);
  const v = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) v.push([p[0] + sx * w, p[1] + sy * h, p[2] + sz * d]);
  const id = (sx, sy, sz) => (sx > 0 ? 4 : 0) + (sy > 0 ? 2 : 0) + (sz > 0 ? 1 : 0);
  // Faces em sentido anti-horário vistas de fora.
  const f = [
    [id(1, -1, -1), id(1, 1, -1), id(1, 1, 1), id(1, -1, 1)],
    [id(-1, -1, 1), id(-1, 1, 1), id(-1, 1, -1), id(-1, -1, -1)],
    [id(-1, 1, -1), id(-1, 1, 1), id(1, 1, 1), id(1, 1, -1)],
    [id(-1, -1, 1), id(-1, -1, -1), id(1, -1, -1), id(1, -1, 1)],
    [id(-1, -1, 1), id(1, -1, 1), id(1, 1, 1), id(-1, 1, 1)],
    [id(1, -1, -1), id(-1, -1, -1), id(-1, 1, -1), id(1, 1, -1)],
  ];
  return { v, f };
}
function cylMesh(r, h, p) {
  const v = [];
  for (let i = 0; i < SEG; i++) {
    const t = (i / SEG) * Math.PI * 2;
    v.push([p[0] + r * Math.sin(t), p[1] - h / 2, p[2] + r * Math.cos(t)]);
  }
  for (let i = 0; i < SEG; i++) {
    const t = (i / SEG) * Math.PI * 2;
    v.push([p[0] + r * Math.sin(t), p[1] + h / 2, p[2] + r * Math.cos(t)]);
  }
  const f = [];
  for (let i = 0; i < SEG; i++) {
    const j = (i + 1) % SEG;
    f.push([i, j, SEG + j, SEG + i]);
  }
  f.push(Array.from({ length: SEG }, (_, i) => SEG + i));
  f.push(Array.from({ length: SEG }, (_, i) => SEG - 1 - i));
  return { v, f };
}
function meshOf(sh, off) {
  const p = [sh.p[0] + off[0], sh.p[1] + off[1], sh.p[2] + off[2]];
  return sh.t === "box" ? boxMesh(sh.s, p) : cylMesh(sh.r, sh.h, p);
}

function faceNormal(v, face) {
  const a = v[face[0]];
  const b = v[face[1]];
  const c = v[face[2]];
  return norm(cross(sub(b, a), sub(c, a)));
}
function tone(n) {
  const k = 0.25 + 0.75 * Math.max(0, dot(n, L));
  const c = TONE_DARK.map((d, i) => Math.round(d + (TONE_LIGHT[i] - d) * k));
  return `#${c.map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

// Vista explodida: toda peça no deslocamento total.
const meshes = [];
for (const part of modelo.parts) {
  for (const sh of part.shapes) meshes.push({ n: part.n, m: meshOf(sh, off(part.explode)) });
}
for (const sh of modelo.screws.shapes) meshes.push({ n: 9, m: meshOf(sh, off(modelo.screws.explode)) });
const lid = modelo.parts.find((p) => p.n === 9);
meshes.push({ n: 9, m: meshOf(modelo.lamp, off(lid.explode)), lamp: true });

const all = [];
let minX = Infinity;
let maxX = -Infinity;
let minY = Infinity;
let maxY = -Infinity;
for (const item of meshes) {
  const { v, f } = item.m;
  const pv = v.map(view);
  for (const q of pv) {
    minX = Math.min(minX, q[0]);
    maxX = Math.max(maxX, q[0]);
    minY = Math.min(minY, q[1]);
    maxY = Math.max(maxY, q[1]);
  }
  const depth = pv.reduce((s, q) => s + q[2], 0) / pv.length;
  const faces = f.map((face) => {
    const wn = faceNormal(v, face);
    const vn = faceNormal(pv, face);
    return { face, wn, visible: vn[2] > 1e-6, depth: face.reduce((s, i) => s + pv[i][2], 0) / face.length };
  });
  all.push({ ...item, pv, faces, depth });
}

// Balões: um por peça, no centro da primeira forma, empurrado para fora do centro.
const anchors = {};
for (const part of modelo.parts) {
  const sh = part.shapes[0];
  anchors[part.n] = view([sh.p[0] + part.explode[0], sh.p[1] + part.explode[1], sh.p[2] + part.explode[2]]);
}
const cx0 = (minX + maxX) / 2;
const cy0 = (minY + maxY) / 2;
const balloons = (MONTADO ? [] : Object.entries(anchors)).map(([n, a]) => {
  let dx = a[0] - cx0;
  let dy = a[1] - cy0;
  const l = Math.hypot(dx, dy) || 1;
  dx /= l;
  dy /= l;
  const reach = Number(n) === 1 ? 0 : 0.62;
  return { n, ax: a[0], ay: a[1], bx: a[0] + dx * reach, by: a[1] + dy * reach };
});
for (const b of balloons) {
  minX = Math.min(minX, b.bx - 0.2);
  maxX = Math.max(maxX, b.bx + 0.2);
  minY = Math.min(minY, b.by - 0.2);
  maxY = Math.max(maxY, b.by + 0.2);
}
const M = 0.2;
minX -= M;
maxX += M;
minY -= M;
maxY += M;

// Limites da peça montada: a cena aproxima o desenho conforme ele fecha.
const montada = [];
for (const part of modelo.parts) for (const sh of part.shapes) montada.push(meshOf(sh, [0, 0, 0]));
for (const sh of modelo.screws.shapes) montada.push(meshOf(sh, [0, 0, 0]));
let aMinX = Infinity;
let aMaxX = -Infinity;
let aMinY = Infinity;
let aMaxY = -Infinity;
for (const m of montada) {
  for (const q of m.v.map(view)) {
    aMinX = Math.min(aMinX, q[0]);
    aMaxX = Math.max(aMaxX, q[0]);
    aMinY = Math.min(aMinY, q[1]);
    aMaxY = Math.max(aMaxY, q[1]);
  }
}
const AM = 0.35;

// SVG: y da vista cresce para cima; no SVG cresce para baixo.
const S = 100;
const X = (x) => ((x - minX) * S).toFixed(1);
const Y = (y) => ((maxY - y) * S).toFixed(1);
const W = (maxX - minX) * S;
const H = (maxY - minY) * S;

all.sort((a, b) => a.depth - b.depth);
let body = "";
for (const item of all) {
  const { pv, faces } = item;
  const vis = faces.filter((f) => f.visible).sort((a, b) => a.depth - b.depth);
  for (const f of vis) {
    const fill = item.lamp ? (MONTADO ? "#0d7050" : "#eef2f0") : tone(f.wn);
    body += `<path d="M${f.face.map((i) => `${X(pv[i][0])} ${Y(pv[i][1])}`).join("L")}Z" fill="${fill}"/>`;
  }
  // Arestas: silhueta (uma face visível, a outra não) e quinas vivas entre faces visíveis.
  const edges = new Map();
  faces.forEach((f, fi) => {
    f.face.forEach((a, k) => {
      const b = f.face[(k + 1) % f.face.length];
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      const e = edges.get(key) ?? { a, b, fs: [] };
      e.fs.push(fi);
      edges.set(key, e);
    });
  });
  let d = "";
  for (const e of edges.values()) {
    const [f1, f2] = e.fs.map((i) => faces[i]);
    if (!f1 || !f2) continue;
    const silhouette = f1.visible !== f2.visible;
    const crease = f1.visible && f2.visible && dot(f1.wn, f2.wn) < Math.cos((25 * Math.PI) / 180);
    if (silhouette || crease) d += `M${X(pv[e.a][0])} ${Y(pv[e.a][1])}L${X(pv[e.b][0])} ${Y(pv[e.b][1])}`;
  }
  if (d) body += `<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
}
let notes = "";
for (const b of balloons) {
  const lx = b.ax - b.bx;
  const ly = b.ay - b.by;
  const ll = Math.hypot(lx, ly);
  if (ll > 0.15) {
    const k = 0.12 / ll;
    notes += `<line x1="${X(b.bx + lx * k)}" y1="${Y(b.by + ly * k)}" x2="${X(b.ax)}" y2="${Y(b.ay)}" stroke="${INK}" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
    notes += `<circle cx="${X(b.ax)}" cy="${Y(b.ay)}" r="2.2" fill="${INK}"/>`;
  }
  notes += `<circle cx="${X(b.bx)}" cy="${Y(b.by)}" r="12" fill="#edf0ef" stroke="${INK}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`;
  notes += `<text x="${X(b.bx)}" y="${Y(b.by)}" dy="0.36em" text-anchor="middle" font-family="'Sofia Sans Condensed','Arial Narrow',sans-serif" font-weight="650" font-size="12" fill="${INK}">${b.n}</text>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="${W.toFixed(0)}" height="${H.toFixed(0)}" role="img" aria-label="Cérebro Autark em vista explodida isométrica, com as nove peças numeradas.">${body}${notes}</svg>\n`;
if (MONTADO) {
  writeFileSync(MONTADO, svg);
  console.log(`peça montada ${W.toFixed(0)}x${H.toFixed(0)} em ${MONTADO}`);
  process.exit(0);
}
mkdirSync(join(root, "public/figs"), { recursive: true });
writeFileSync(join(root, "public/figs/cerebro-explodido.svg"), svg);
writeFileSync(
  join(root, "src/components/machine/poster-bounds.json"),
  `${JSON.stringify(
    {
      minX: +minX.toFixed(4),
      maxX: +maxX.toFixed(4),
      minY: +minY.toFixed(4),
      maxY: +maxY.toFixed(4),
      montada: { minX: +(aMinX - AM).toFixed(4), maxX: +(aMaxX + AM).toFixed(4), minY: +(aMinY - AM).toFixed(4), maxY: +(aMaxY + AM).toFixed(4) },
    },
    null,
    2,
  )}\n`,
);
console.log(`pôster ${W.toFixed(0)}x${H.toFixed(0)}, ${svg.length} bytes`);
