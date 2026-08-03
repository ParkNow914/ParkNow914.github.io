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

await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

// Rola a página inteira para disparar reveal, lazy-load e observers.
await page.evaluate(async () => {
  const h = document.body.scrollHeight;
  for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
  window.scrollTo(0, 0);
});
// As imagens são loading="lazy": rolar só dispara o download, não espera por ele.
// Em máquina rápida elas chegam antes do próximo passo; num runner de CI, não.
await page
  .waitForFunction(
    () => [...document.querySelectorAll("img")].every((i) => i.complete && i.naturalWidth > 0),
    { timeout: 15000 }
  )
  .catch(() => {});
await page.waitForTimeout(600);

console.log("\nEstrutura");
const base = await page.evaluate(() => ({
  projetos: document.querySelectorAll(".proj").length,
  imagensQuebradas: [...document.querySelectorAll("img")].filter((i) => !i.complete || i.naturalWidth === 0).length,
  overflowX: document.documentElement.scrollWidth - window.innerWidth,
  h1: document.querySelectorAll("h1").length,
  jsonld: document.querySelectorAll('script[type="application/ld+json"]').length
}));
check("nenhuma imagem quebrada", base.imagensQuebradas === 0, `${base.imagensQuebradas} quebradas`);
check("sem rolagem horizontal", base.overflowX <= 0, `${base.overflowX}px`);
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
