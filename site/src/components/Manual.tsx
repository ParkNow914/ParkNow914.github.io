import { LEGACY_ANCHORS, REVISION, SECTIONS, type SectionId } from "@/content/site";

export function pageOf(id: SectionId) {
  const i = SECTIONS.findIndex((s) => s.id === id);
  return { n: String(i + 1).padStart(2, "0"), total: String(SECTIONS.length).padStart(2, "0") };
}

/** Título de seção: o número da prancha vai num marcador de detalhe ao lado do título, nunca acima. */
export function SectionHead({
  id,
  address,
  title,
  lede,
}: {
  id: string;
  address: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="shead">
      <h2 id={id} className="shead__t">
        <span className="shead__addr">{address}</span>
        <span className="shead__title">{title}</span>
      </h2>
      {lede ? <p className="shead__lede">{lede}</p> : null}
    </div>
  );
}

const COLUNAS = ["1", "2", "3", "4", "5", "6", "7", "8"];
const LINHAS = ["A", "B", "C", "D", "E", "F"];

/** Coordenadas da margem da prancha: números em cima, letras do lado. */
export function Regua() {
  return (
    <span className="regua" aria-hidden="true">
      <span className="regua__x">
        {COLUNAS.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </span>
      <span className="regua__y">
        {LINHAS.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </span>
    </span>
  );
}

/** Legenda das páginas avulsas (notas, sistemas, pacotes…): o mesmo quadro, sem número de prancha. */
export function LegendaAvulsa() {
  return (
    <>
      <Regua />
      <p className="folio folio--avulsa" aria-hidden="true">
        <span>Autark</span>
        <span>
          <span className="folio__k">Desenho</span>Projeto executivo · {REVISION}
        </span>
        <span>
          <span className="folio__k">Responsável técnico</span>Alisson Santos
        </span>
        <span className="folio__n">
          <span className="folio__k">Folha</span>Avulsa
        </span>
      </p>
    </>
  );
}

/** Legenda da prancha: o quadro de identificação que fecha cada seção, com a régua da margem. */
export function Folio({ id }: { id: SectionId }) {
  const p = pageOf(id);
  return (
    <>
    <Regua />
    <p className="folio" aria-hidden="true">
      <span>Autark</span>
      <span>
        <span className="folio__k">Desenho</span>Projeto executivo · {REVISION}
      </span>
      <span>
        <span className="folio__k">Responsável técnico</span>Alisson Santos
      </span>
      <span className="folio__n">
        <span className="folio__k">Prancha</span>
        {p.n}/{p.total}
      </span>
    </p>
    </>
  );
}

/** Âncoras da home anterior: um link velho (#projetos, #contato…) chega à seção certa, sem JS. */
export function LegacyAnchors({ section }: { section: SectionId }) {
  const ids = LEGACY_ANCHORS[section];
  if (!ids) return null;
  return (
    <>
      {ids.map((id) => (
        <span key={id} id={id} className="anchor-alias" aria-hidden="true" />
      ))}
    </>
  );
}
