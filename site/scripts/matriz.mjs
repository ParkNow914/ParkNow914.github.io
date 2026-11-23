// Monta a Matriz 1 (a xilogravura do Cérebro Autark) a partir das 9 gravuras
// vetoriais em art/ e gera, com o Chromium do Playwright:
//   public/matriz/relevo.webp       altura do entalhe, espelhada (a matriz é o avesso da impressão)
//   public/matriz/relevo-lite.webp  a mesma, menor, para celular
//   public/matriz/tinta.webp        a impressão na leitura certa, tinta preta sobre transparente
//   public/matriz/folha-*.webp      a folha impressa em papel amarelo (pôster sem WebGL e capas)
//   src/components/machine/matriz-layout.ts   onde cada peça mora na matriz (0..1)
// Rode depois de trocar qualquer gravura: node scripts/matriz.mjs
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ART = join(ROOT, "art");
const OUT = join(ROOT, "public", "matriz");
mkdirSync(OUT, { recursive: true });

// Prancha de 1000 x 1300 (proporção de folheto de cordel, 11 x 14,3 cm).
const W = 1000;
const H = 1300;
// Peça 1 no centro; canais em cima, conectores embaixo, testes à esquerda, tampa à direita.
const SLOTS = {
  1: { x: 262, y: 318, w: 476, h: 660 },
  2: { x: 70, y: 52, w: 250, h: 250 },
  3: { x: 375, y: 52, w: 250, h: 250 },
  4: { x: 680, y: 52, w: 250, h: 250 },
  5: { x: 70, y: 998, w: 250, h: 250 },
  6: { x: 375, y: 998, w: 250, h: 250 },
  7: { x: 680, y: 998, w: 250, h: 250 },
  8: { x: 30, y: 538, w: 216, h: 216 },
  9: { x: 754, y: 538, w: 216, h: 216 },
};
// Recorte da gravura central: só o quadro desenhado, sem a margem branca.
const CENTRAL_VIEW = "806 327 2746 3682";

function clean(svg) {
  return svg
    .replace(/<metadata>[\s\S]*?<\/metadata>/g, "")
    .replace(/\s(width|height|style|preserveAspectRatio)="[^"]*"/g, "")
    .replace(/xmlns:c2pa="[^"]*"/g, "");
}

function inner(svg) {
  const m = svg.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>\s*$/);
  if (!m) throw new Error("SVG sem viewBox");
  return { viewBox: m[1], body: m[2] };
}

const art = {};
for (let n = 1; n <= 9; n++) {
  const file = join(ART, `peca-${n}.svg`);
  const svg = clean(readFileSync(file, "utf8"));
  writeFileSync(file, svg); // guarda a versão limpa (sem o manifesto C2PA de 1 MB)
  art[n] = inner(svg);
}

// Moldura entalhada: borda grossa irregular e um filete por dentro, à mão.
const frame = `
  <filter id="goiva" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/>
    <feDisplacementMap in="SourceGraphic" scale="9"/>
  </filter>
  <g filter="url(#goiva)" fill="none" stroke="#000">
    <rect x="16" y="16" width="${W - 32}" height="${H - 32}" stroke-width="22"/>
    <rect x="44" y="40" width="${W - 88}" height="${H - 80}" stroke-width="5"/>
    <line x1="44" y1="314" x2="${W - 44}" y2="314" stroke-width="5"/>
    <line x1="44" y1="986" x2="${W - 44}" y2="986" stroke-width="5"/>
  </g>`;

function plate({ mirror, ink = "#000", paper = null }) {
  const pieces = Object.entries(SLOTS)
    .map(([n, s]) => {
      const a = art[n];
      const view = n === "1" ? CENTRAL_VIEW : a.viewBox;
      return `<svg x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" viewBox="${view}" preserveAspectRatio="xMidYMid meet">${a.body}</svg>`;
    })
    .join("");
  const flip = mirror ? `transform="translate(${W} 0) scale(-1 1)"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <defs>${frame.match(/<filter[\s\S]*?<\/filter>/)[0]}</defs>
    ${paper ? `<rect width="${W}" height="${H}" fill="${paper}"/>` : ""}
    <g ${flip}>
      <g style="color:${ink}">${pieces.replaceAll('fill="#000000"', `fill="${ink}"`).replaceAll("fill:#000000", `fill:${ink}`)}</g>
      ${frame.replace(/<filter[\s\S]*?<\/filter>/, "").replaceAll('stroke="#000"', `stroke="${ink}"`)}
    </g>
  </svg>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

// Fotografa a prancha em tinta preta sobre branco e converte pixel a pixel:
//   "height": altura = 1 - luminância (tinta alta, branco cavado)
//   "ink":    tinta com alfa = 1 - luminância (o branco some)
//   "sheet":  a mesma tinta sobre o papel da folha
async function render(svg, w, h, { mode, quality = 90, name, paper = "#f2c12e", ink = [23, 19, 15] }) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><style>html,body{margin:0;background:#fff}svg{display:block;width:100vw;height:100vh}</style>${svg}`);
  await page.waitForTimeout(150);
  const b64 = (await page.screenshot({ type: "png" })).toString("base64");
  const out = await page.evaluate(
    async ({ b64, mode, quality, paper, ink }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = new OffscreenCanvas(img.width, img.height);
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, c.width, c.height);
      const px = d.data;
      for (let i = 0; i < px.length; i += 4) {
        const lum = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
        const a = Math.min(1, Math.max(0, (1 - lum - 0.1) / 0.85));
        if (mode === "height") {
          const v = Math.round(a * 255);
          px[i] = px[i + 1] = px[i + 2] = v;
          px[i + 3] = 255;
        } else {
          px[i] = ink[0];
          px[i + 1] = ink[1];
          px[i + 2] = ink[2];
          px[i + 3] = Math.round(a * 255);
        }
      }
      ctx.putImageData(d, 0, 0);
      let final = c;
      if (mode === "sheet") {
        final = new OffscreenCanvas(c.width, c.height);
        const f = final.getContext("2d");
        f.fillStyle = paper;
        f.fillRect(0, 0, c.width, c.height);
        f.drawImage(c, 0, 0);
      }
      const blob = await final.convertToBlob({ type: "image/webp", quality: quality / 100 });
      const u = new Uint8Array(await blob.arrayBuffer());
      let s = "";
      for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
      return btoa(s);
    },
    { b64, mode, quality, paper, ink },
  );
  writeFileSync(join(OUT, name), Buffer.from(out, "base64"));
  console.log("ok", name, w, "x", h);
}

const mirrored = plate({ mirror: true });
const reading = plate({ mirror: false });
await render(mirrored, 1024, 1331, { mode: "height", quality: 90, name: "relevo.webp" });
await render(mirrored, 640, 832, { mode: "height", quality: 88, name: "relevo-lite.webp" });
await render(reading, 1200, 1560, { mode: "ink", quality: 90, name: "tinta.webp" });
for (const w of [480, 720, 960]) {
  await render(reading, w, Math.round((w * H) / W), { mode: "sheet", quality: 86, name: `folha-${w}.webp` });
}
await browser.close();

// Layout em 0..1 (u da esquerda, v de cima) na leitura da IMPRESSÃO.
const norm = Object.fromEntries(
  Object.entries(SLOTS).map(([n, s]) => [n, [s.x / W, s.y / H, s.w / W, s.h / H].map((v) => +v.toFixed(4))]),
);
writeFileSync(
  join(ROOT, "src", "components", "machine", "matriz-layout.ts"),
  `// Gerado por scripts/matriz.mjs. Não edite à mão.
// Onde cada peça mora na Matriz 1, em 0..1 na leitura da impressão: [u, v, largura, altura].
export const MATRIZ_ASPECT = ${H / W};
export const SLOTS: Record<number, readonly [number, number, number, number]> = ${JSON.stringify(norm, null, 2)};
`,
);
console.log("ok matriz-layout.ts");
