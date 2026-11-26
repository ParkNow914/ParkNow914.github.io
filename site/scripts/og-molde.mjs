// Molde das imagens de compartilhamento (1200x630): uma prancha do projeto executivo.
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
 * Prancha 1200x630: papel vegetal frio, traço grafite, verde só na ação.
 * `fig` é o desenho da direita: por padrão o Cérebro Autark em vista explodida;
 * com `print: true` vira a tela real de um sistema, em moldura de traço.
 * `papel` fica aceito por compatibilidade e é ignorado: toda prancha usa o mesmo papel.
 */
export function pagina({ kicker, titulo, lede, rodape, secao = "Notas de campo", fig = "public/figs/cerebro-explodido.svg", print = false }) {
  const tamanho = titulo.length > 46 ? 54 : titulo.length > 30 ? 62 : 72;
  const figW = print ? 470 : 380;
  const mainW = print ? 590 : 650;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:Geologica;src:url(${url("src/fonts/geologica.woff2")}) format("woff2");font-weight:100 900}
@font-face{font-family:Sofia;src:url(${url("src/fonts/sofia-condensed.woff2")}) format("woff2");font-weight:100 900}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px}
body{position:relative;overflow:hidden;background:#edf0ef;color:#1b1f22;font-family:Geologica,sans-serif;font-synthesis:none}
.malha{position:absolute;right:40px;top:40px;width:${figW + 60}px;bottom:40px;
  background-image:linear-gradient(rgba(27,31,34,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(27,31,34,.07) 1px,transparent 1px);background-size:24px 24px;border-left:1px solid rgba(27,31,34,.45)}
.moldura{position:absolute;inset:24px;border:1.5px solid #1b1f22;
  background:repeating-linear-gradient(90deg,#1b1f22 0 1px,transparent 1px 12.5%) top left/100% 8px no-repeat,repeating-linear-gradient(90deg,#1b1f22 0 1px,transparent 1px 12.5%) bottom left/100% 8px no-repeat}
.head{position:absolute;left:62px;right:62px;top:54px;display:flex;align-items:center;gap:16px}
.brand{font-weight:650;font-size:28px;letter-spacing:-.01em}
.doc{padding-left:16px;border-left:1.5px solid #1b1f22;font-family:Sofia;font-weight:650;font-size:17px;letter-spacing:.06em;text-transform:uppercase;color:#545d63}
.kicker{margin-left:auto;font-family:Sofia;font-weight:700;font-size:17px;letter-spacing:.08em;text-transform:uppercase;padding:6px 12px 5px;border:1.5px solid #1b1f22;background:#edf0ef}
.fig{position:absolute;right:70px;top:120px;width:${figW}px;height:370px;display:flex;align-items:center;justify-content:center}
.fig img{max-width:100%;max-height:100%}
.fig.print img{border:1.5px solid #1b1f22;background:#e4e8e6}
.main{position:absolute;left:62px;top:112px;bottom:118px;width:${mainW}px;display:flex;flex-direction:column;justify-content:center}
h1{font-weight:620;font-size:${tamanho}px;line-height:1.02;letter-spacing:-.03em;text-wrap:balance}
.lede{margin-top:22px;font-size:24px;font-weight:400;line-height:1.35;color:#353c41;max-width:${mainW - 40}px}
.foot{position:absolute;left:62px;right:62px;bottom:52px;display:flex;justify-content:space-between;align-items:stretch}
.legenda{display:flex;border:1.5px solid #1b1f22;font-family:Sofia;font-weight:650;font-size:16px;letter-spacing:.05em;text-transform:uppercase;background:#edf0ef}
.legenda span{padding:8px 14px;border-left:1px solid #1b1f22}
.legenda span:first-child{border-left:0;letter-spacing:.12em}
.dom{font-weight:600;font-size:19px;background:#0d7050;color:#edf0ef;padding:9px 18px;display:flex;align-items:center}
</style></head><body>
<div class="moldura"></div>
<div class="malha"></div>
<div class="head"><span class="brand">Autark</span><span class="doc">Projeto executivo · ${esc(secao)}</span><span class="kicker">${esc(kicker)}</span></div>
<div class="fig${print ? " print" : ""}"><img src="${url(fig)}" alt=""></div>
<div class="main"><h1>${esc(titulo)}</h1>${lede ? `<p class="lede">${esc(lede)}</p>` : ""}</div>
<div class="foot"><div class="legenda"><span>Autark</span><span>${esc(rodape)}</span></div><span class="dom">autarktech.com.br</span></div>
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
