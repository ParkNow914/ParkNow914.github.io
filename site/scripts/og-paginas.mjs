// Imagens de compartilhamento das páginas avulsas (sistemas, Vale do Paraíba,
// privacidade) e das quatro landings de anúncio.
//   node scripts/og-paginas.mjs
// Saída: public/og/… (site) e ../lp/og/<landing>.png (landings, fora deste app).
// Refaz tudo a cada rodada: são poucas imagens e os dados vêm de content/site.ts.
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildSync } from "esbuild";
import { pagina, renderizar } from "./og-molde.mjs";

const RAIZ = process.cwd();
const OG = path.join(RAIZ, "public", "og");
const LP = path.join(RAIZ, "..", "lp", "og");

// content/site.ts é TypeScript: o esbuild transpila para um módulo temporário.
const tmp = mkdtempSync(path.join(tmpdir(), "og-site-"));
const mod = path.join(tmp, "site.mjs");
const { outputFiles } = buildSync({ entryPoints: [path.join(RAIZ, "src/content/site.ts")], bundle: true, format: "esm", write: false });
writeFileSync(mod, outputFiles[0].text);
const { SYSTEMS, STATUS_LABEL, VALE } = await import(pathToFileURL(mod).href);
rmSync(tmp, { recursive: true, force: true });

const img = (arquivo) => `public${arquivo}`;
const rodape = "Por Alisson Santos";

const alvos = [
  {
    destino: path.join(OG, "sistemas.png"),
    html: pagina({
      secao: "Sistemas",
      kicker: `${SYSTEMS.length} sistemas`,
      titulo: "Sistemas em operação",
      lede: "Três rodam hoje com clientes. Qualquer um abre na sua frente.",
      rodape,
    }),
  },
  ...SYSTEMS.map((s) => ({
    destino: path.join(OG, "sistemas", `${s.slug}.png`),
    html: pagina({
      secao: "Sistemas",
      kicker: `${s.code} · ${STATUS_LABEL[s.status]}`,
      titulo: s.name,
      lede: `${s.kind}. ${s.metric.charAt(0).toUpperCase()}${s.metric.slice(1)}.`,
      rodape,
      fig: img(s.image),
      print: true,
    }),
  })),
  {
    destino: path.join(OG, "vale-do-paraiba.png"),
    html: pagina({
      secao: "Vale do Paraíba",
      kicker: "Atendimento local",
      titulo: "Automação para negócios do Vale do Paraíba",
      lede: `Base em Lorena, com visita ao seu negócio em ${VALE.cidades.length} cidades.`,
      rodape,
    }),
  },
  {
    destino: path.join(OG, "privacidade.png"),
    html: pagina({ secao: "Privacidade", kicker: "LGPD", titulo: "Política de privacidade", lede: "Sem cookies e sem rastreadores.", rodape }),
  },
  ...[
    ["agenda", "Salão · barbearia · estética", "Agenda que atende sozinha no WhatsApp", "A cliente marca sozinha, e o sistema lembra 24h e 2h antes.", "agendazap"],
    ["atendimento", "Corretora · financeira", "Lead que espera uma hora já é do concorrente", "Atendimento na hora, no WhatsApp oficial da Meta.", "crm"],
    ["juridico", "Advocacia", "IA que mostra de onde tirou a resposta", "Triagem 24h e análise de documento com a fonte citada.", "jurisia"],
    ["delivery", "Supermercado · delivery", "O pedido chega pronto na cozinha", "Catálogo do ERP, taxa por bairro e cupom na impressora.", "bia"],
  ].map(([slug, kicker, titulo, lede, print]) => ({
    destino: path.join(LP, `${slug}.png`),
    html: pagina({ secao: "Soluções", kicker, titulo, lede, rodape, fig: img(`/projetos/${print}.webp`), print: true }),
  })),
];

const feitas = await renderizar(alvos);
console.log(`${feitas} imagem(ns) gerada(s)`);
