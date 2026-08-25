#!/usr/bin/env node
/**
 * Testes de ponta a ponta dos fluxos que sustentam a página.
 *
 * O CI já valida HTML, links e Lighthouse — nada disso pega uma regressão de
 * comportamento: o formulário parar de montar a mensagem, a troca de idioma
 * deixar texto em português, o FAQ não abrir, a calculadora travar. É isso que
 * este arquivo cobre.
 *
 * Uso: node tools/e2e.mjs     (sai com código 1 se algum teste falhar)
 */

import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PORT = 8199;

const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".webp": "image/webp", ".woff2": "font/woff2", ".xml": "application/xml",
  ".txt": "text/plain", ".webmanifest": "application/manifest+json", ".json": "application/json"
};

function serve() {
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    const file = path.join(ROOT, p);
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); res.end("404"); return; }
      res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  });
  return new Promise((ok) => srv.listen(PORT, () => ok(srv)));
}

const results = [];
const check = (nome, condicao, detalhe = "") => {
  results.push({ nome, ok: !!condicao, detalhe });
  console.log(`  ${condicao ? "PASSOU" : "FALHOU"}  ${nome}${detalhe && !condicao ? " — " + detalhe : ""}`);
};

const srv = await serve();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const erros = [];
page.on("pageerror", (e) => erros.push(e.message));
page.on("console", (m) => { if (m.type() === "error") erros.push("console: " + m.text()); });

// Imagem "quebrada" é ambígua: o headless shell de alguns runners não decodifica
// WebP, e o teste acusaria falha num site perfeito. O que importa de verdade é
// que nenhum arquivo referenciado responda 404 — isso vale em qualquer ambiente.
const respostasImagem = [];
page.on("response", (res) => {
  const url = res.url();
  if (/\.(webp|png|jpe?g|svg|avif)$/i.test(url)) {
    respostasImagem.push({ arquivo: url.split("/").pop(), status: res.status() });
  }
});

await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

// Rola a página inteira para disparar reveal, lazy-load e observers.
await page.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
  window.scrollTo(0, 0);
});
// O lazy loading nativo depende de scroll real; em runner headless o
// window.scrollTo não o dispara de forma confiável. Como aqui o objetivo é
// verificar que toda URL de imagem existe, forçamos o download de todas.
await page.evaluate(() => {
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.loading = "eager";
    img.src = img.src; // reatribuir dispara a requisição
  });
});
await page
  .waitForFunction(
    () => [...document.querySelectorAll("img")].every((i) => i.complete),
    { timeout: 15000 }
  )
  .catch(() => {});
await page.waitForTimeout(800);

console.log("\nEstrutura");
const base = await page.evaluate(() => ({
  projetos: document.querySelectorAll(".proj").length,
  quebradas: [...document.querySelectorAll("img")]
    .filter((i) => !i.complete || i.naturalWidth === 0)
    .map((i) => (i.currentSrc || i.src || i.getAttribute("src") || "?").split("/").pop()),
  overflowX: document.documentElement.scrollWidth - window.innerWidth,
  h1: document.querySelectorAll("h1").length,
  jsonld: document.querySelectorAll('script[type="application/ld+json"]').length
}));
const imgsRuins = respostasImagem.filter((r) => r.status >= 400);
check(
  "nenhuma imagem responde erro",
  imgsRuins.length === 0,
  imgsRuins.map((r) => `${r.arquivo} (${r.status})`).join(", ")
);
check("todas as imagens foram baixadas", respostasImagem.length >= 9, `${respostasImagem.length} requisições`);
if (base.quebradas.length) {
  console.log(`  (aviso) ${base.quebradas.length} imagem(ns) não decodificaram neste navegador: ${base.quebradas.join(", ")}`);
}
check("sem rolagem horizontal (1440px)", base.overflowX <= 0, `${base.overflowX}px`);
check("exatamente um h1", base.h1 === 1, `${base.h1} encontrados`);
check("todos os JSON-LD presentes", base.jsonld >= 5, `${base.jsonld}`);
check("todos os projetos renderizam", base.projetos >= 8, `${base.projetos}`);

console.log("\nJSON-LD válido");
const jsonldOk = await page.evaluate(() =>
  [...document.querySelectorAll('script[type="application/ld+json"]')].every((s) => {
    try { JSON.parse(s.textContent); return true; } catch { return false; }
  })
);
check("todo JSON-LD faz parse", jsonldOk);

console.log("\nFAQ");
const faq = await page.evaluate(() => {
  const q = document.querySelector(".faq-q");
  q.click();
  const item = q.closest(".faq-item");
  return { aberto: item.classList.contains("open"), altura: item.querySelector(".faq-a").style.maxHeight };
});
check("primeira pergunta abre", faq.aberto);
check("resposta ganha altura", faq.altura && faq.altura !== "0px", faq.altura);

console.log("\nCalculadora de ROI");
const roi = await page.evaluate(() => {
  const set = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event("input")); };
  set("roiHours", 6); set("roiPeople", 3); set("roiWage", 40);
  return {
    ano: document.getElementById("roiYear").textContent,
    mes: document.getElementById("roiMonth").textContent,
    cta: document.getElementById("roiCta").href
  };
});
check("valor anual é calculado", /\d/.test(roi.ano), roi.ano);
check("CTA leva o valor para o WhatsApp", roi.cta.includes("wa.me") && roi.cta.length > 60);

console.log("\nFormulário de contato");
const form = await page.evaluate(() => {
  document.getElementById("fNome").value = "Fulano";
  document.getElementById("fNegocio").value = "Barbearia Teste";
  document.getElementById("fPrecisa").value = "quero um bot";
  let capturado = null;
  const original = window.open;
  window.open = (u) => { capturado = u; return null; };
  document.getElementById("waSend").click();
  window.open = original;
  return capturado;
});
check("botão monta a mensagem do WhatsApp", !!form && form.includes("wa.me"));
check("mensagem inclui o que o visitante digitou", !!form && decodeURIComponent(form).includes("Barbearia Teste"));

console.log("\nIdioma");
await page.evaluate(() => document.querySelector('.lang-toggle button[data-lang="en"]').click());
await page.waitForTimeout(600);
const en = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  h1: document.querySelector("h1").textContent,
  sobrouPT: [...document.querySelectorAll("[data-i18n],[data-i18n-html]")]
    .map((e) => e.textContent)
    .filter((t) => /\b(você|não|sistemas que|automação|projeto)\b/i.test(t)).length
}));
check("html lang vira en", en.lang === "en", en.lang);
check("headline traduzida", /run themselves/i.test(en.h1), en.h1.slice(0, 40));
check("nenhum texto ficou em português", en.sobrouPT === 0, `${en.sobrouPT} elementos`);

await page.evaluate(() => document.querySelector('.lang-toggle button[data-lang="pt"]').click());
await page.waitForTimeout(600);
const voltou = await page.evaluate(() => document.querySelector("h1").textContent);
check("voltar para PT restaura a headline", /trabalham sozinhos/i.test(voltou));

console.log("\nTema");
const tema = await page.evaluate(() => {
  document.getElementById("themeBtn").click();
  return document.documentElement.getAttribute("data-theme");
});
check("toggle de tema responde", tema === "light" || tema === null);

// Larguras reais de celular. O teste acima roda so em 1440px e por isso nunca
// pegou o hero escapando 18px num Android de 360px — que e a largura mais comum
// do publico que chega pelo Instagram.
console.log("\nLarguras de tela");
const larguras = [320, 360, 375, 390, 412, 768, 1024];
for (const w of larguras) {
  const p = await browser.newPage({ viewport: { width: w, height: 800 } });
  await p.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  const excesso = await p.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check(`sem rolagem horizontal (${w}px)`, excesso <= 0, `${excesso}px`);
  await p.close();
}

// Origem da conversa. Sem isto, toda conversa no WhatsApp chega idêntica e a
// métrica que o calendário do Instagram define — "conversas que citam o
// Instagram" — não tem como ser medida.
console.log("\nOrigem da conversa");
{
  const p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(`http://localhost:${PORT}/?utm_source=instagram&utm_medium=bio`, { waitUntil: "networkidle" });
  const marcados = await p.evaluate(() =>
    [...document.querySelectorAll('a[href*="wa.me"]')]
      .map((a) => decodeURIComponent(a.href))
      .filter((h) => h.includes("[instagram/bio]")).length);
  const total = await p.evaluate(() => document.querySelectorAll('a[href*="wa.me"]').length);
  check("todo link de WhatsApp carrega a origem", marcados === total && total > 0, `${marcados}/${total}`);

  // A calculadora monta a URL no clique, então não passa pela reescrita de href.
  const roiComOrigem = await p.evaluate(() => {
    const set = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event("input")); };
    set("roiHours", 5); set("roiPeople", 2); set("roiWage", 30);
    return decodeURIComponent(document.getElementById("roiCta").href);
  });
  check("calculadora também carrega a origem", roiComOrigem.includes("[instagram/bio]"));

  // Sem UTM nada muda: quem chega direto não recebe marcação nenhuma.
  await p.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  const semMarca = await p.evaluate(() =>
    [...document.querySelectorAll('a[href*="wa.me"]')].every((a) => !decodeURIComponent(a.href).includes("[")));
  check("sem UTM, a mensagem fica intacta", semMarca);
  await p.close();
}

// A landing de anúncio é onde o tráfego pago cai. Se ela quebrar, o dinheiro do
// anúncio continua saindo e ninguém percebe — por isso ela entra no mesmo gate.
console.log("\nLandings de anuncio");
for (const slug of ["agenda", "atendimento", "juridico", "delivery"]) {
  const errosLp = [];
  const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
  p.on("pageerror", (e) => errosLp.push(e.message));
  p.on("console", (m) => { if (m.type() === "error") errosLp.push("console: " + m.text()); });
  await p.goto(`http://localhost:${PORT}/lp/${slug}/?utm_source=meta&utm_campaign=teste`, { waitUntil: "networkidle" });

  const href = await p.getAttribute("#cta-topo", "href");
  check(`${slug}: CTA aponta para o WhatsApp certo`,
    (href || "").startsWith("https://wa.me/5512991743827"), href || "sem href");

  // Sem isto nao ha como saber qual criativo pagou pelo lead.
  check(`${slug}: CTA carrega a origem do anuncio`,
    decodeURIComponent(href || "").includes("[meta/teste]"), href || "");

  // Cada landing precisa da propria mensagem: quatro publicos diferentes
  // chegando com o mesmo texto seria pior que nao marcar nada.
  const msg = await p.evaluate(() => document.body.dataset.msg);
  check(`${slug}: tem mensagem propria`,
    !!msg && decodeURIComponent(href || "").includes(msg), msg || "");

  // O Pixel nao pode carregar sem consentimento, e hoje nem com — o ID esta
  // vazio ate a conta de anuncios existir.
  const terceiros = await p.evaluate(() =>
    [...document.querySelectorAll("script[src]")]
      .map((s) => s.src).filter((s) => !s.startsWith(location.origin)));
  check(`${slug}: nenhum script de terceiro antes do consentimento`,
    terceiros.length === 0, terceiros.join(" | "));

  for (const w of [320, 360, 390, 768]) {
    await p.setViewportSize({ width: w, height: 800 });
    const excesso = await p.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(`${slug}: sem rolagem horizontal (${w}px)`, excesso <= 0, `${excesso}px`);
  }

  check(`${slug}: sem erro no console`, errosLp.length === 0, errosLp.slice(0, 2).join(" | "));
  await p.close();
}

console.log("\nErros de runtime");
check("nenhum erro no console", erros.length === 0, erros.slice(0, 2).join(" | "));

await browser.close();
srv.close();

const falhas = results.filter((r) => !r.ok);
console.log(`\n${results.length - falhas.length}/${results.length} testes passaram`);
if (falhas.length) {
  console.error("\nFALHOU:\n" + falhas.map((f) => `  - ${f.nome}${f.detalhe ? " (" + f.detalhe + ")" : ""}`).join("\n"));
  process.exit(1);
}
