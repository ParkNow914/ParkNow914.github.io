// Molde das imagens de compartilhamento (1200x630): uma folha de cordel impressa na oficina.
// Serve às notas (og-notas.mjs) e às páginas avulsas e landings (og-paginas.mjs).
import { writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const RAIZ = process.cwd();
const url = (arquivo) => pathToFileURL(path.isAbsolute(arquivo) ? arquivo : path.join(RAIZ, arquivo)).href;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Folha de cordel 1200x630: papel colorido, tinta preta de rolo, carimbo vermelho.
 * `fig` é a gravura da direita: por padrão a folha impressa da Matriz 1; com
 * `print: true` vira a tela real de um sistema, colada como recorte.
 * `papel` troca a cor da folha (as mesmas do site).
 */
export function pagina({ kicker, titulo, lede, rodape, secao = "Notas de campo", fig = "public/matriz/folha-720.webp", print = false, papel = "#f2c12e" }) {
  const tamanho = titulo.length > 46 ? 58 : titulo.length > 30 ? 68 : 80;
  const figW = print ? 470 : 330;
  const mainW = print ? 600 : 690;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:Alfa;src:url(${url("src/fonts/alfa.woff2")}) format("woff2")}
@font-face{font-family:Archivo;src:url(${url("src/fonts/archivo.woff2")}) format("woff2");font-weight:400 800}
@font-face{font-family:Elite;src:url(${url("src/fonts/elite.woff2")}) format("woff2")}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px}
body{position:relative;overflow:hidden;background:${papel};color:#17130f;font-family:Archivo,sans-serif;font-synthesis:none}
.fibra{position:absolute;inset:0;opacity:.16;mix-blend-mode:multiply}
.moldura{position:absolute;inset:0}
.head{position:absolute;left:66px;right:66px;top:56px;display:flex;align-items:center;gap:18px}
.brand{font-family:Alfa;font-size:30px;letter-spacing:.02em}
.doc{padding-left:18px;border-left:3px solid #17130f;font-weight:650;font-size:17px}
.kicker{margin-left:auto;font-family:Elite;font-size:18px;color:#c8261d;text-transform:uppercase;letter-spacing:.04em;
  padding:6px 12px;border:3px double #c8261d;transform:rotate(-3deg)}
.fig{position:absolute;right:70px;top:118px;width:${figW}px;height:408px;display:flex;align-items:center;justify-content:center}
.fig img{max-width:100%;max-height:100%;border:3px solid #17130f;box-shadow:12px 12px 0 -3px #17130f;transform:rotate(${print ? "-1.6" : "2.4"}deg);background:#f2c12e}
.main{position:absolute;left:66px;top:112px;bottom:104px;width:${mainW}px;display:flex;flex-direction:column;justify-content:center}
h1{font-family:Alfa;font-weight:400;font-size:${tamanho}px;line-height:.98;letter-spacing:-.005em;text-wrap:balance;filter:url(#entalhe)}
.lede{margin-top:26px;padding-left:20px;border-left:7px solid #17130f;font-size:23px;font-weight:650;line-height:1.32;max-width:${mainW - 50}px}
.foot{position:absolute;left:66px;right:66px;bottom:54px;display:flex;justify-content:space-between;align-items:center}
.foot span{font-family:Elite;font-size:18px}
.foot b{font-family:Archivo;font-weight:800;font-size:19px;background:#17130f;color:${papel};padding:8px 16px;letter-spacing:.01em}
</style></head><body>
<svg class="fibra" width="1200" height="630" aria-hidden="true"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.9 0.06" numOctaves="3" seed="3"/><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .15  0 0 0 0 .1  0 0 0 1.4 -.35"/></filter><rect width="1200" height="630" filter="url(#f)"/></svg>
<svg class="moldura" width="1200" height="630" aria-hidden="true"><defs>
<filter id="goiva"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter>
<filter id="entalhe"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="2.4"/></filter></defs>
<g filter="url(#goiva)" fill="none" stroke="#17130f"><rect x="22" y="22" width="1156" height="586" stroke-width="12"/><rect x="40" y="38" width="1120" height="554" stroke-width="3"/></g></svg>
<div class="head"><span class="brand">AUTARK</span><span class="doc">Folheto da Oficina · ${esc(secao)}</span><span class="kicker">${esc(kicker)}</span></div>
<div class="fig${print ? " print" : ""}"><img src="${url(fig)}" alt=""></div>
<div class="main"><h1>${esc(titulo)}</h1>${lede ? `<p class="lede">${esc(lede)}</p>` : ""}</div>
<div class="foot"><span>${esc(rodape)}</span><b>autarktech.com.br</b></div>
</body></html>`;
}

/** Renderiza cada alvo ({destino, html}) num PNG. Devolve quantas imagens saíram. */
export async function renderizar(alvos) {
  const nav = await chromium.launch();
  const p = await nav.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  let feitas = 0;
  for (const a of alvos) {
    mkdirSync(path.dirname(a.destino), { recursive: true });
    // Arquivo de verdade, e não setContent: uma página about:blank não pode abrir
    // as fontes e a figura por file://.
    const tmp = path.join(tmpdir(), `og-autark-${process.pid}.html`);
    writeFileSync(tmp, a.html);
    await p.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
    rmSync(tmp);
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: a.destino });
    feitas++;
    console.log(`ok  ${path.relative(RAIZ, a.destino)}`);
  }
  await nav.close();
  return feitas;
}
