// Imagens de compartilhamento (1200x630) das notas de campo, na folha de rosto
// do manual. São as que aparecem quando alguém cola o link no WhatsApp, no
// LinkedIn ou no Facebook.
//   node scripts/og-notas.mjs          (gera só as que faltam)
//   node scripts/og-notas.mjs --todas  (refaz todas)
// Saída: public/notas/og/<nota>.png e public/notas/og/indice.png. Os PNG entram
// no repositório: o build do site não abre navegador.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { pagina, renderizar } from "./og-molde.mjs";

const RAIZ = process.cwd();
const PASTA = path.join(RAIZ, "content", "notas");
const SAIDA = path.join(RAIZ, "public", "notas", "og");
const TODAS = process.argv.includes("--todas");
const PILARES = { oferta: "Oferta", dor: "Problema", prova: "Prova", bastidor: "Bastidor", ensino: "Como funciona" };
const MESES = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

const limpa = (s) => s.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");

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

const hoje = new Date().toISOString().slice(0, 10);
const arquivos = readdirSync(PASTA).filter((f) => f.endsWith(".md") && f.slice(0, 10) <= hoje).sort();
const notas = arquivos.map((f, i) => ({ ...ler(f), n: i + 1 }));

const alvos = [
  ...notas.map((n) => ({
    destino: path.join(SAIDA, `${n.slug}.png`),
    html: pagina({ kicker: `Nº ${String(n.n).padStart(2, "0")} · ${n.pilar}`, titulo: n.titulo, lede: n.lede, rodape: `Por Alisson Santos · ${n.data}` }),
  })),
  {
    destino: path.join(SAIDA, "indice.png"),
    sempre: true,
    html: pagina({
      kicker: `${notas.length} notas`,
      titulo: "Notas de campo",
      lede: "Problema real, sistema real, número conferido. Uma nota por vez.",
      rodape: "Por Alisson Santos",
    }),
  },
].filter((a) => TODAS || a.sempre || !existsSync(a.destino));

const feitas = await renderizar(alvos);
console.log(`${feitas} imagem(ns) gerada(s), ${notas.length} notas publicadas`);
