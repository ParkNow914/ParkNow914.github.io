// Imagens de compartilhamento (1200x630) das notas de campo, na folha de rosto
// do manual. São as que aparecem quando alguém cola o link no WhatsApp, no
// LinkedIn ou no Facebook.
//   node scripts/og-notas.mjs          (gera só as que faltam)
//   node scripts/og-notas.mjs --todas  (refaz todas)
// Saída: public/notas/og/<nota>.png e public/notas/og/indice.png. Os PNG entram
// no repositório: o build do site não abre navegador.
import { readdirSync, readFileSync, existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const RAIZ = process.cwd();
const PASTA = path.join(RAIZ, "content", "notas");
const SAIDA = path.join(RAIZ, "public", "notas", "og");
const TODAS = process.argv.includes("--todas");
const PILARES = { oferta: "Oferta", dor: "Problema", prova: "Prova", bastidor: "Bastidor", ensino: "Como funciona" };
const MESES = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const limpa = (s) => s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");
const url = (arquivo) => pathToFileURL(path.join(RAIZ, arquivo)).href;

function ler(arquivo) {
  const fonte = readFileSync(path.join(PASTA, arquivo), "utf8");
  const campo = (k) => (fonte.match(new RegExp(`^${k}: (.+)$`, "m")) || [])[1]?.trim();
  const capa = fonte.split(/\r?\n---\r?\n/).find((b) => b.includes(":: capa")) || "";
  const lede = (capa.match(/^> (.+)$/m) || [])[1];
  const [a, m, d] = campo("data").split("-").map(Number);
  return {
    slug: arquivo.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, ""),
    titulo: campo("titulo"),
    pilar: PILARES[campo("pilar")] || campo("pilar"),
    data: `${d} ${MESES[m - 1]} ${a}`,
    lede: lede && limpa(lede),
  };
}

function pagina({ kicker, titulo, lede, rodape }) {
  const tamanho = titulo.length > 46 ? 64 : titulo.length > 30 ? 74 : 84;
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
.fig{position:absolute;right:50px;top:104px;width:390px;height:430px;opacity:.95}
.fig img{width:100%;height:100%;object-fit:contain}
.main{position:absolute;left:60px;top:104px;bottom:96px;width:700px;display:flex;flex-direction:column;justify-content:center}
h1{font-family:Hubot;font-weight:850;font-stretch:75%;font-size:${tamanho}px;line-height:.92;letter-spacing:-.015em;text-wrap:balance}
.lede{margin-top:24px;padding-left:18px;border-left:4px solid #ff5a1f;font-size:22px;font-weight:650;line-height:1.35;max-width:620px}
.foot{position:absolute;left:60px;right:60px;bottom:52px;display:flex;justify-content:space-between;align-items:center;font-family:Martian;font-stretch:87.5%;font-size:14px;color:#c6c1b6}
.foot b{color:#ff5a1f;font-weight:600}
</style></head><body>
<div class="frame"></div><i class="reg tl"></i><i class="reg tr"></i><i class="reg bl"></i><i class="reg br"></i>
<div class="head"><span class="brand">AUTARK</span><span class="doc">Manual de Operação · Notas de campo</span><span class="kicker">${esc(kicker)}</span></div>
<div class="fig"><img src="${url("public/figs/fig1-explodida-662.webp")}" alt=""></div>
<div class="main"><h1>${esc(titulo)}</h1>${lede ? `<p class="lede">${esc(lede)}</p>` : ""}</div>
<div class="foot"><span>${esc(rodape)}</span><b>autarktech.com.br</b></div>
</body></html>`;
}

mkdirSync(SAIDA, { recursive: true });
const hoje = new Date().toISOString().slice(0, 10);
const arquivos = readdirSync(PASTA).filter((f) => f.endsWith(".md") && f.slice(0, 10) <= hoje).sort();
const notas = arquivos.map((f, i) => ({ ...ler(f), n: i + 1 }));

const nav = await chromium.launch();
const p = await nav.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
let feitas = 0;
const alvos = [
  ...notas.map((n) => ({
    arquivo: `${n.slug}.png`,
    html: pagina({ kicker: `Nº ${String(n.n).padStart(2, "0")} · ${n.pilar}`, titulo: n.titulo, lede: n.lede, rodape: `Por Alisson Santos · ${n.data}` }),
  })),
  {
    arquivo: "indice.png",
    html: pagina({
      kicker: `${notas.length} notas`,
      titulo: "Notas de campo",
      lede: "Problema real, sistema real, número conferido. Uma nota por vez.",
      rodape: "Por Alisson Santos",
    }),
  },
];
for (const a of alvos) {
  const destino = path.join(SAIDA, a.arquivo);
  if (!TODAS && existsSync(destino) && a.arquivo !== "indice.png") continue;
  // Arquivo de verdade, e não setContent: uma página about:blank não pode abrir
  // as fontes e a figura por file://.
  const tmp = path.join(tmpdir(), `og-nota-${process.pid}.html`);
  writeFileSync(tmp, a.html);
  await p.goto(pathToFileURL(tmp).href, { waitUntil: "load" });
  rmSync(tmp);
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: destino });
  feitas++;
  console.log(`ok  public/notas/og/${a.arquivo}`);
}
await nav.close();
console.log(`${feitas} imagem(ns) gerada(s), ${notas.length} notas publicadas`);
