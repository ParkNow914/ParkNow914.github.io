// Fotografa a Matriz 1 da própria cena 3D (estado "desenhada a pincel", sem
// balões nem legenda) para virar o pôster que aparece antes do Three.js.
//   npm run dev -- -p 3210   (em outro terminal)
//   node scripts/capturar-posters.mjs [url]
//   node scripts/posters.mjs            (gera as larguras em WebP)
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";

const URL = process.argv[2] || "http://localhost:3210/";
const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });

async function shoot(viewport, selector, out) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.mouse.move(viewport.width / 2, viewport.height / 2);
  await page.waitForSelector(".fig-layer canvas", { timeout: 30000 });
  await page.waitForTimeout(6000);
  await page.addStyleTag({
    content: `html,body,.stage,.fig,.fig--main,.cover{background:transparent!important;border-image:none!important}
      body::after,.fig-overlay,.fig__cap,.fig__meter,.fig__block,.fig__parts,.fig__hint,.fig__motion,.fig__poster,.rh{visibility:hidden!important}
      .fig-layer{opacity:1!important}
      nextjs-portal,[data-nextjs-toast],#__next-build-watcher{display:none!important}
      .fig--inline,.fig--inline *:not(canvas){border:0!important;box-shadow:none!important}`,
  });
  await page.waitForTimeout(1500);
  // A figura é sticky e a cena respira: recorta pela caixa em vez de esperar "estabilidade".
  // Captura direto pelo protocolo do Chrome: o page.screenshot fica esperando a
  // fonte do carimbo, que só carrega sob demanda.
  const box = await page.locator(selector).boundingBox();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "png",
    clip: { x: box.x, y: box.y, width: box.width, height: box.height, scale: 1 },
    captureBeyondViewport: false,
  });
  writeFileSync(out, Buffer.from(data, "base64"));
  console.log("ok", out);
  await page.close();
}

await shoot({ width: 1440, height: 900 }, ".fig--main", "public/figs/fig1-explodida.png");
await shoot({ width: 390, height: 844 }, ".fig--inline", "public/figs/fig1-explodida-mobile.png");
await browser.close();
