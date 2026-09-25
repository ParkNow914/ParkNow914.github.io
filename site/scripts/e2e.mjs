// Testes de ponta a ponta dos fluxos que vendem: rode contra o build de produção.
//   npm run build && npm run start      (em outro terminal)
//   node scripts/e2e.mjs [url] [saida.json] [--landings]
// --landings confere também as páginas que moram fora deste app, no mesmo
// domínio (lp/ e assets/ na raiz do repositório): use no site montado ou em produção.
// Cobre o que a CI do site anterior cobria e o que é novo aqui: ilhas estáticas
// funcionando sem hidratação, montagem da Fig. 1, WhatsApp com origem e sem JS.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const URL = args[0] || "http://localhost:3100/";
const OUT = args[1];
const LANDINGS = process.argv.includes("--landings");
const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? "ok  " : "FALHOU"}  ${name}${detail ? `  (${detail})` : ""}`);
};

// Espera a rolagem (suave ou não) parar: três leituras iguais seguidas.
async function settle(page, max = 6000) {
  let last = -1;
  let same = 0;
  const t0 = Date.now();
  while (Date.now() - t0 < max) {
    await page.waitForTimeout(150);
    const y = await page.evaluate(() => Math.round(window.scrollY));
    same = y === last ? same + 1 : 0;
    if (same >= 3) return;
    last = y;
  }
}

const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

// 1. Estrutura, SEO e erros de console (desktop)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const failed = [];
  page.on("requestfailed", (r) => failed.push(r.url()));
  page.on("response", (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));
  await page.goto(URL, { waitUntil: "networkidle" });

  check("exatamente um h1", (await page.locator("h1").count()) === 1);
  const ld = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => e.textContent));
  let parsed = [];
  try {
    parsed = ld.flatMap((t) => JSON.parse(t));
  } catch {
    parsed = [];
  }
  const types = parsed.map((x) => x["@type"]).sort().join(",");
  check("JSON-LD com Person, ProfessionalService, WebSite e FAQPage", types === "FAQPage,Person,ProfessionalService,WebSite", types);
  check("sem aggregateRating no JSON-LD", !JSON.stringify(parsed).includes("aggregateRating"));
  check("12 seções endereçadas", (await page.locator("[data-section]").count()) === 12);
  check("10 fichas de sistema", (await page.locator("article.sheet").count()) === 10);
  check("6 depoimentos", (await page.locator(".field__row").count()) === 6);
  check("relatório de campo com 10 avaliações", (await page.locator(".field-sum__figs dd").first().textContent()).trim() === "10");

  // Ilhas estáticas: HTML sem hidratação ainda funciona
  const faq = page.locator(".trouble__row").first();
  await faq.locator("summary").click();
  check("FAQ abre (details nativo na ilha estática)", await faq.evaluate((d) => d.open));
  await page.locator('a[href="#sys-05"]').first().click();
  await settle(page);
  const sheetTop = await page.locator("#sys-05").evaluate((el) => el.getBoundingClientRect().top);
  check("link interno do registro leva à ficha", sheetTop > -20 && sheetTop < 400, `top=${Math.round(sheetTop)}`);

  // Calculadora (§6)
  const readout = page.locator(".readout__v");
  const before = await readout.textContent();
  const slider = page.locator(".scale input").first();
  await slider.evaluate((el) => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    set.call(el, "8");
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(200);
  const after = await readout.textContent();
  check("calculadora recalcula ao mover a escala", before !== after && after.includes("73.920"), `${before} -> ${after}`);
  const cta = await page.locator(".readout .btn").getAttribute("href");
  check("CTA da calculadora leva o valor ao WhatsApp", decodeURIComponent(cta).includes("73.920"));

  // Ordem de serviço (§11): abre o WhatsApp com a mensagem montada
  await page.evaluate(() => {
    window.__opened = [];
    window.open = (u) => {
      window.__opened.push(u);
      return null;
    };
  });
  await page.locator(".os input").first().fill("Marina");
  await page.locator(".os input").nth(1).fill("salão em Lorena");
  await page.locator(".os textarea").fill("agenda no WhatsApp");
  await page.locator(".os .btn").click();
  const opened = decodeURIComponent((await page.evaluate(() => window.__opened[0])) || "");
  check("ordem de serviço monta a mensagem do WhatsApp", opened.includes("Sou Marina") && opened.includes("salão em Lorena") && opened.includes("agenda no WhatsApp"));

  // Índice (TOC): abre, fecha com Esc e devolve o foco
  await page.locator(".rh__index").click();
  const tocOpen = await page.locator("#indice").isVisible();
  await page.keyboard.press("Escape");
  const tocClosed = !(await page.locator("#indice").isVisible());
  const focusBack = await page.evaluate(() => document.activeElement?.classList.contains("rh__index"));
  check("índice abre, fecha com Esc e devolve o foco", tocOpen && tocClosed && focusBack);

  // Montagem da Fig. 1: o 3D liga na interação e a montagem acompanha o scroll
  await page.mouse.move(700, 400);
  await page.waitForFunction(() => document.documentElement.classList.contains("fig-ready"), null, { timeout: 30000 }).catch(() => {});
  check("3D carrega na primeira interação", await page.evaluate(() => document.documentElement.classList.contains("fig-ready")));
  await page.evaluate(() => document.querySelector('[data-step="5"]').scrollIntoView({ block: "center" }));
  await settle(page);
  await page.waitForFunction(() => document.querySelector(".fig--main")?.getAttribute("data-fig") === "running", null, { timeout: 8000 }).catch(() => {});
  const figState = await page.locator(".fig--main").getAttribute("data-fig");
  check("montagem chega a OPERANDO no último passo", figState === "running", figState);
  const bia = await page.locator('[data-count="487"]').textContent();
  check("bancada conta 487 testes", bia === "487", bia);

  // Imagens: todo arquivo carregou
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = "eager";
    await Promise.all([...document.images].map((i) => (i.complete ? 1 : new Promise((r) => (i.onload = i.onerror = r)))));
  });
  const broken = await page.$$eval("img", (imgs) => imgs.filter((i) => !i.naturalWidth).map((i) => i.src));
  check("todas as imagens carregam", broken.length === 0, broken.join(" "));
  check("nenhum request falhou", failed.length === 0, failed.slice(0, 3).join(" "));
  check("nenhum erro no console", errors.length === 0, errors.slice(0, 2).join(" | "));
  await ctx.close();
}

// 2. Origem da conversa: UTM carimbada nos links do WhatsApp
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${URL}?utm_source=instagram&utm_medium=bio`, { waitUntil: "networkidle" });
  const hrefs = await page.$$eval('a[href*="wa.me"]', (as) => as.map((a) => decodeURIComponent(a.href)));
  check("todo link de WhatsApp carrega a origem", hrefs.length > 5 && hrefs.every((h) => h.includes("[instagram/bio]")), `${hrefs.length} links`);
  await page.goto(URL, { waitUntil: "networkidle" });
  const clean = await page.$$eval('a[href*="wa.me"]', (as) => as.every((a) => !decodeURIComponent(a.href).includes("[")));
  check("sem UTM, a mensagem fica intacta", clean);
  await ctx.close();
}

// 3. Sem JavaScript: conteúdo e WhatsApp continuam
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "load" });
  const wa = await page.locator('.cover a[href*="wa.me"]').count();
  const visible = await page.locator("#sys-01").isVisible();
  check("sem JS: CTA do WhatsApp e fichas continuam", wa > 0 && visible);
  await ctx.close();
}

// 3b. Endereços da home anterior e página 404
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const legacy = { projetos: "sistemas", contato: "assistencia", faq: "problemas", calculadora: "dimensionamento" };
  const wrong = [];
  for (const [old, now] of Object.entries(legacy)) {
    await page.goto(`${URL}#${old}`, { waitUntil: "networkidle" });
    await settle(page);
    const top = await page.locator(`#${now}`).evaluate((el) => el.getBoundingClientRect().top);
    if (top < -400 || top > 400) wrong.push(`#${old} -> top ${Math.round(top)}`);
  }
  check("links antigos (#projetos, #contato, #faq, #calculadora) caem na seção certa", wrong.length === 0, wrong.join(", "));
  const res = await page.goto(new globalThis.URL("pagina-que-nao-existe", URL).href);
  const home = await page.locator('a[href="/"]').count();
  check("endereço inexistente responde 404 com caminho de volta", res.status() === 404 && home > 0, `status ${res.status()}`);
  if (LANDINGS) {
    const paths = ["lp/agenda/", "lp/atendimento/", "lp/juridico/", "lp/delivery/", "lp/lp.css", "assets/logo-mark.svg", "assets/fonts/fonts.css", "sw.js"];
    const bad = [];
    for (const p of paths) {
      const r = await page.request.get(new globalThis.URL(p, URL).href);
      if (r.status() !== 200) bad.push(`${p} ${r.status()}`);
    }
    check("landings e assets das landings respondem 200", bad.length === 0, bad.join(", "));
  }
  await ctx.close();
}

// 4. Sem rolagem horizontal em 7 larguras
for (const w of [320, 360, 390, 414, 768, 1024, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  check(`sem rolagem horizontal em ${w}px`, sw <= w, `scrollWidth=${sw}`);
  await ctx.close();
}

// 5. Movimento reduzido: máquina montada e estática, com opção de animar
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  const motion = await page.locator("#stage").getAttribute("data-motion");
  const toggle = await page.locator(".fig__motion").isVisible();
  check("movimento reduzido: montagem estática com botão para animar", motion === "static" && toggle, motion);
  await ctx.close();
}

await browser.close();
const passed = results.filter((r) => r.ok).length;
console.log(`\n${passed}/${results.length} verificações passaram`);
if (OUT) writeFileSync(OUT, JSON.stringify({ url: URL, date: new Date().toISOString(), passed, total: results.length, results }, null, 2));
process.exit(passed === results.length ? 0 : 1);
