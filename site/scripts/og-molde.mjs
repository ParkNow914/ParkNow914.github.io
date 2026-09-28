// Molde das imagens de compartilhamento (1200x630), na folha de rosto do manual.
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
 * `fig` é a imagem da direita: por padrão a Fig. 1 explodida; com `print: true`
 * vira a tela real de um sistema, maior e com moldura.
 */
export function pagina({ kicker, titulo, lede, rodape, secao = "Notas de campo", fig = "public/figs/fig1-explodida-662.webp", print = false }) {
  const tamanho = titulo.length > 46 ? 64 : titulo.length > 30 ? 74 : 84;
  const figW = print ? 470 : 390;
  const mainW = print ? 610 : 700;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:Hubot;src:url(${url("src/fonts/hubot.woff2")}) format("woff2");font-weight:600 900;font-stretch:75% 100%}
@font-face{font-family:Mona;src:url(${url("src/fonts/mona.woff2")}) format("woff2");font-weight:400 700}
@font-face{font-family:Martian;src:url(${url("src/fonts/martian.woff2")}) format("woff2");font-weight:400 600;font-stretch:87.5% 100%}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px}
body{position:relative;overflow:hidden;background:#15181b;color:#ece7dc;font-family:Mona,sans-serif;
  background-image:radial-gradient(circle,rgb(236 231 220/.085) 1px,transparent 1.3px);background-size:22px 22px;background-position:11px 11px}
.frame{position:absolute;inset:26px;border:1px solid #2c3238}
.reg{position:absolute;width:18px;height:18px;border-color:#969188}
.tl{left:18px;top:18px;border-left:1.5px solid;border-top:1.5px solid}.tr{right:18px;top:18px;border-right:1.5px solid;border-top:1.5px solid}
.bl{left:18px;bottom:18px;border-left:1.5px solid;border-bottom:1.5px solid}.br{right:18px;bottom:18px;border-right:1.5px solid;border-bottom:1.5px solid}
.head{position:absolute;left:60px;right:60px;top:54px;display:flex;align-items:center;gap:16px}
.brand{font-family:Hubot;font-weight:850;font-stretch:75%;font-size:26px;letter-spacing:.02em}
.doc{padding-left:16px;border-left:1px solid #465058;color:#969188;font-weight:650;font-size:15px}
.kicker{margin-left:auto;font-family:Martian;font-stretch:87.5%;font-weight:500;font-size:14px;color:#ff5a1f;text-transform:uppercase;letter-spacing:.06em}
.fig{position:absolute;right:50px;top:104px;width:${figW}px;height:430px;opacity:.95;display:flex;align-items:center}
.fig img{width:100%;height:100%;object-fit:contain}
.fig.print img{height:auto;border:1px solid #2c3238;box-shadow:0 18px 40px rgb(0 0 0/.45)}
.main{position:absolute;left:60px;top:104px;bottom:96px;width:${mainW}px;display:flex;flex-direction:column;justify-content:center}
h1{font-family:Hubot;font-weight:850;font-stretch:75%;font-size:${tamanho}px;line-height:.92;letter-spacing:-.015em;text-wrap:balance}
.lede{margin-top:24px;padding-left:18px;border-left:4px solid #ff5a1f;font-size:22px;font-weight:650;line-height:1.35;max-width:${mainW - 60}px}
.foot{position:absolute;left:60px;right:60px;bottom:52px;display:flex;justify-content:space-between;align-items:center;font-family:Martian;font-stretch:87.5%;font-size:14px;color:#c6c1b6}
.foot b{color:#ff5a1f;font-weight:600}
</style></head><body>
<div class="frame"></div><i class="reg tl"></i><i class="reg tr"></i><i class="reg bl"></i><i class="reg br"></i>
<div class="head"><span class="brand">AUTARK</span><span class="doc">Manual de Operação · ${esc(secao)}</span><span class="kicker">${esc(kicker)}</span></div>
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
