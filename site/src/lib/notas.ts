// Notas de campo: os posts do Instagram da Autark publicados também como
// artigo, para o Google encontrar o que o carrossel diz. A fonte é o mesmo
// arquivo .md do repositório autark-instagram (cabeçalho + slides separados por
// "---"); o leitor abaixo é o mesmo de lá, portado para TypeScript.
//
// Só entram aqui posts cuja data já chegou: o calendário editorial mora num
// repositório privado e não pode ficar legível antes da hora.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type Bloco =
  | { tipo: "titulo" | "sobretitulo" | "destaque" | "paragrafo"; texto: string }
  | { tipo: "lista"; itens: string[] }
  | { tipo: "codigo"; rotulo: string; texto: string };

export type Slide = { tipo: string; blocos: Bloco[] };

export type Nota = {
  slug: string;
  n: number;
  titulo: string;
  data: string;
  pilar: string;
  projeto?: string;
  legenda: string[];
  lede?: string;
  slides: Slide[];
  cta?: { titulo?: string; destaque?: string; texto?: string };
  palavras: number;
};

const PASTA = path.join(process.cwd(), "content", "notas");

export const PILARES: Record<string, string> = {
  oferta: "Oferta",
  dor: "Problema",
  prova: "Prova",
  bastidor: "Bastidor",
  ensino: "Como funciona",
};

// ---------- leitor (o mesmo de autark-instagram/ferramentas/marcacao.mjs) ----------

function recuarBloco(linhas: string[]): string {
  const comConteudo = linhas.filter((l) => l.trim() !== "");
  if (!comConteudo.length) return "";
  const menor = Math.min(...comConteudo.map((l) => (l.match(/^ */) ?? [""])[0].length));
  return linhas.map((l) => l.slice(menor)).join("\n");
}

function lerCabecalho(fonte: string) {
  const linhas = fonte.split(/\r?\n/);
  const fim = linhas.findIndex((l) => l.trim() === "---");
  if (fim === -1) throw new Error('cabeçalho sem "---" de fechamento');
  const meta: Record<string, string> = {};
  let aberta: string | null = null;
  let bloco: string[] = [];
  const fechar = () => {
    if (aberta) meta[aberta] = recuarBloco(bloco).trim();
    aberta = null;
    bloco = [];
  };
  for (const linha of linhas.slice(0, fim)) {
    if (aberta && (linha.startsWith("  ") || linha.trim() === "")) {
      bloco.push(linha);
      continue;
    }
    fechar();
    if (linha.trim() === "") continue;
    const m = linha.match(/^([a-zA-Zç_]+):\s?(.*)$/);
    if (!m) throw new Error(`linha de cabeçalho inválida: ${JSON.stringify(linha)}`);
    if (m[2].trim() === "|") {
      aberta = m[1];
      bloco = [];
    } else meta[m[1]] = m[2].trim();
  }
  fechar();
  return { meta, corpo: linhas.slice(fim + 1).join("\n") };
}

function comecaOutroBloco(l: string) {
  return l.startsWith("# ") || l.startsWith("## ") || l.startsWith("> ") || l.startsWith("- ") || l.trimStart().startsWith("```");
}

function lerBlocos(texto: string): Bloco[] {
  const linhas = texto.split(/\r?\n/);
  const blocos: Bloco[] = [];
  let i = 0;
  while (i < linhas.length) {
    const linha = linhas[i];
    if (linha.trim() === "") {
      i++;
      continue;
    }
    if (linha.trimStart().startsWith("```")) {
      const rotulo = linha.trim().slice(3).trim();
      const conteudo: string[] = [];
      i++;
      while (i < linhas.length && !linhas[i].trimStart().startsWith("```")) conteudo.push(linhas[i++]);
      i++;
      blocos.push({ tipo: "codigo", rotulo, texto: recuarBloco(conteudo) });
      continue;
    }
    if (linha.startsWith("## ")) {
      blocos.push({ tipo: "sobretitulo", texto: linha.slice(3).trim() });
      i++;
      continue;
    }
    if (linha.startsWith("# ")) {
      blocos.push({ tipo: "titulo", texto: linha.slice(2).trim() });
      i++;
      continue;
    }
    if (linha.startsWith("> ")) {
      blocos.push({ tipo: "destaque", texto: linha.slice(2).trim() });
      i++;
      continue;
    }
    if (linha.startsWith("- ")) {
      const itens: string[] = [];
      while (i < linhas.length && linhas[i].startsWith("- ")) itens.push(linhas[i++].slice(2).trim());
      blocos.push({ tipo: "lista", itens });
      continue;
    }
    const par: string[] = [];
    while (i < linhas.length && linhas[i].trim() !== "" && !comecaOutroBloco(linhas[i])) par.push(linhas[i++].trim());
    blocos.push({ tipo: "paragrafo", texto: par.join(" ") });
  }
  return blocos;
}

function lerSlides(corpo: string): Slide[] {
  const partes = corpo.split(/\r?\n/).reduce<string[][]>(
    (acc, linha) => {
      if (linha.trim() === "---") acc.push([]);
      else acc[acc.length - 1].push(linha);
      return acc;
    },
    [[]],
  );
  return partes
    .map((l) => l.join("\n"))
    .filter((t) => t.trim() !== "")
    .map((texto) => {
      const linhas = texto.split(/\r?\n/);
      const primeira = linhas.find((l) => l.trim() !== "") ?? "";
      let tipo = "conteudo";
      let resto = linhas;
      if (primeira.trim().startsWith("::")) {
        tipo = primeira.trim().slice(2).trim();
        resto = linhas.slice(linhas.indexOf(primeira) + 1);
      }
      return { tipo, blocos: lerBlocos(resto.join("\n")) };
    });
}

// ---------- notas ----------

const texto = (b: Bloco | undefined) => (b && "texto" in b ? b.texto : undefined);

function lerNota(arquivo: string, n: number): Nota {
  const fonte = readFileSync(path.join(PASTA, arquivo), "utf8");
  const { meta, corpo } = lerCabecalho(fonte);
  const slides = lerSlides(corpo);
  const capa = slides.find((s) => s.tipo === "capa");
  const final = slides.find((s) => s.tipo === "cta");
  const legenda = (meta.legenda ?? "").split(/\n\s*\n/).map((p) => p.replace(/\s*\n\s*/g, " ").trim()).filter(Boolean);
  const miolo = slides.filter((s) => s.tipo !== "capa" && s.tipo !== "cta");
  const todas = [meta.titulo, ...legenda, ...miolo.flatMap((s) => s.blocos.map((b) => ("itens" in b ? b.itens.join(" ") : b.texto)))].join(" ");
  return {
    slug: arquivo.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, ""),
    n,
    titulo: meta.titulo,
    data: meta.data,
    pilar: meta.pilar,
    projeto: meta.projeto,
    legenda,
    lede: texto(capa?.blocos.find((b) => b.tipo === "destaque")),
    slides: miolo,
    cta: final && {
      titulo: texto(final.blocos.find((b) => b.tipo === "titulo")),
      destaque: texto(final.blocos.find((b) => b.tipo === "destaque")),
      texto: texto(final.blocos.find((b) => b.tipo === "paragrafo")),
    },
    palavras: todas.split(/\s+/).filter(Boolean).length,
  };
}

let cache: Nota[] | null = null;

/** Notas publicadas, da mais recente para a mais antiga. `n` é a ordem de publicação. */
export function notas(): Nota[] {
  if (cache) return cache;
  const hoje = new Date().toISOString().slice(0, 10);
  const arquivos = readdirSync(PASTA)
    .filter((f) => f.endsWith(".md"))
    .sort();
  cache = arquivos
    .map((f, i) => lerNota(f, i + 1))
    .filter((nota) => nota.data <= hoje)
    .reverse();
  return cache;
}

export function nota(slug: string): Nota | undefined {
  return notas().find((x) => x.slug === slug);
}

const MESES = ["jan.", "fev.", "mar.", "abr.", "mai.", "jun.", "jul.", "ago.", "set.", "out.", "nov.", "dez."];

export function dataLonga(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return `${d} ${MESES[m - 1]} ${a}`;
}

/** Trechos inline: **negrito** e `código`, com escape antes, como no gerador de carrosséis. */
export function trechosHtml(t: string) {
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

/** Texto sem marcação, para meta description e JSON-LD. */
export function textoPuro(t: string) {
  return t.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1");
}
