// Gera os ícones do site a partir do "A" da marca (o mesmo de LogoMark):
// traço papel sobre quadro grafite, cantos retos, como o resto da prancha.
//   node scripts/icones.mjs
// Saídas: src/app/icon.svg, public/marca/{favicon-48,apple-touch-icon,icon-192,icon-512,icon-maskable-512}.png
// e src/app/favicon.ico (16, 32 e 48 px; o Next liga sozinho os dois no <head>). O .ico é montado em Node, sem dependência.
// Também regrava os ícones da raiz do repositório (../assets/), que servem às
// landings em /lp/ e a quem guardou os endereços antigos.
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const RAIZ = process.cwd();
const GRAFITE = "#1b1f22";
const PAPEL = "#edf0ef";
const A =
  "M171 25.3a39 39 0 0 0-25.6 20.9c-1.5 2.9-16.7 30.3-33.8 60.8l-42.1 75-25.1 44.5c-24.3 42.8-25.3 60-4.6 81.7 28.1 29.5 74 21.3 96.3-17.2l13.4-23c22.9-39.7 42.9-73.6 43.9-74.8 1-1 2.7-.3 8.4 3.4 13 8.3 14.1 6 9.6-19.6l-3.4-20.7c-.1-5.2-39.4.3-46.2 6.4-3.9 3.5 3.3 12.5 12.6 15.6 1 .3-1.2 4.2-23.4 42.2l-31.9 54.9c-16.3 28.6-45.9 36.5-63.2 16.9-12.3-14.1-10.9-21.5 10.9-59.9L97 179l40.5-72L166 56.4c3.1-5.7 8.7-8.8 14.7-8.1 8.5.9 1.7-10 91.7 148 42.3 74.2 41 71.7 40.4 80.6-1.4 19.5-9.5 24.1-42.3 24.1-32.1 0-29.6 1.4-46.4-27.5-14.8-25.6-15.4-26.2-23.7-24.1-11.5 2.9-11 9.2 2.7 32.9 18.3 31.4 19.4 32.8 30.9 38.5l5.5 2.7h61l6.8-3.2c35.9-17 37.1-43.6 4.4-100.8l-58.2-102-41.8-73.4A38 38 0 0 0 171 25.3";

// O "A" ocupa 359x350 unidades. `folga` é a margem em volta, em unidades;
// `reforco` engrossa o traço (em unidades) para os tamanhos de aba, onde o "A"
// fino some.
function svg(folga, reforco = 0) {
  const lado = 359 + folga * 2;
  const x = -folga;
  const y = -folga - (359 - 350) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" aria-label="Autark" viewBox="${x} ${y} ${lado} ${lado}"><rect x="${x}" y="${y}" width="${lado}" height="${lado}" fill="${GRAFITE}"/><path fill="${PAPEL}" fill-rule="evenodd" d="${A}"${reforco ? ` stroke="${PAPEL}" stroke-width="${reforco}" stroke-linejoin="round"` : ""}/></svg>`;
}

const normal = svg(58);
const pequeno = svg(26, 26);
// Maskable: o Android recorta até 20% de cada lado, então o "A" fica no miolo seguro.
const maskable = svg(150);
writeFileSync(path.join(RAIZ, "src/app/icon.svg"), `${pequeno}\n`);
writeFileSync(path.join(RAIZ, "../assets/logo-mark.svg"), `${pequeno}\n`);

const alvos = [
  ["public/marca/favicon-48.png", 48, pequeno],
  ["public/marca/apple-touch-icon.png", 180, normal],
  ["public/marca/icon-192.png", 192, normal],
  ["public/marca/icon-512.png", 512, normal],
  ["public/marca/icon-maskable-512.png", 512, maskable],
  ["../assets/favicon-48.png", 48, pequeno],
  ["../assets/apple-touch-icon.png", 180, normal],
  ["../assets/icon-192.png", 192, normal],
  ["../assets/icon-512.png", 512, normal],
  ["ico-16", 16, pequeno],
  ["ico-32", 32, pequeno],
  ["ico-48", 48, pequeno],
];

const nav = await chromium.launch();
const pngs = {};
for (const [destino, px, fonte] of alvos) {
  const p = await nav.newPage({ viewport: { width: px, height: px }, deviceScaleFactor: 1 });
  const tmp = path.join(tmpdir(), `icone-${process.pid}.html`);
  writeFileSync(tmp, `<!doctype html><html><body style="margin:0">${fonte.replace("<svg ", `<svg width="${px}" height="${px}" `)}</body></html>`);
  await p.goto(pathToFileURL(tmp).href);
  const buf = await p.screenshot({ type: "png", omitBackground: false });
  rmSync(tmp);
  await p.close();
  if (destino.startsWith("ico-")) pngs[px] = buf;
  else {
    mkdirSync(path.dirname(path.join(RAIZ, destino)), { recursive: true });
    writeFileSync(path.join(RAIZ, destino), buf);
    console.log(`ok  ${destino}`);
  }
}
await nav.close();

// favicon.ico com três PNGs dentro (formato aceito por todo navegador atual).
const tamanhos = [16, 32, 48];
const cab = Buffer.alloc(6 + 16 * tamanhos.length);
cab.writeUInt16LE(0, 0);
cab.writeUInt16LE(1, 2);
cab.writeUInt16LE(tamanhos.length, 4);
let deslocamento = cab.length;
tamanhos.forEach((t, i) => {
  const dado = pngs[t];
  const o = 6 + i * 16;
  cab.writeUInt8(t, o);
  cab.writeUInt8(t, o + 1);
  cab.writeUInt8(0, o + 2);
  cab.writeUInt8(0, o + 3);
  cab.writeUInt16LE(1, o + 4);
  cab.writeUInt16LE(32, o + 6);
  cab.writeUInt32LE(dado.length, o + 8);
  cab.writeUInt32LE(deslocamento, o + 12);
  deslocamento += dado.length;
});
writeFileSync(path.join(RAIZ, "src/app/favicon.ico"), Buffer.concat([cab, ...tamanhos.map((t) => pngs[t])]));
console.log("ok  src/app/favicon.ico");
