// Pré-renderiza as seções estáticas (ver scripts/static-entry.tsx) e grava
// src/generated/static-sections.ts. Roda sozinho antes de dev, build e typecheck.
import { build } from "esbuild";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const outfile = resolve("node_modules/.cache/autark/static-entry.mjs");

await build({
  entryPoints: ["scripts/static-entry.tsx"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile,
  jsx: "automatic",
  external: ["react", "react/*", "react-dom", "react-dom/*"],
  logLevel: "warning",
});

const mod = await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
const html = mod.renderAll();

mkdirSync("src/generated", { recursive: true });
writeFileSync(
  "src/generated/static-sections.ts",
  `// Gerado por scripts/prerender.mjs a partir de src/components/Sections.tsx. Não edite à mão.\n` +
    `export const STATIC_SECTIONS = ${JSON.stringify(html)} as const;\n`,
);

const kb = (Buffer.byteLength(JSON.stringify(html)) / 1024).toFixed(1);
console.log(`prerender: ${Object.keys(html).length} seções estáticas (${kb} KB)`);
