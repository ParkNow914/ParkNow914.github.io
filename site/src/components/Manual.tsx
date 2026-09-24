import { LEGACY_ANCHORS, REVISION, SECTIONS, type SectionId } from "@/content/site";

export function pageOf(id: SectionId) {
  const i = SECTIONS.findIndex((s) => s.id === id);
  return { n: String(i + 1).padStart(2, "0"), total: String(SECTIONS.length).padStart(2, "0") };
}

/** Título de seção: o endereço do manual faz parte do título, não é rótulo solto. */
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

/** Rodapé de página do manual: marca o fim de cada seção como uma folha impressa. */
export function Folio({ id }: { id: SectionId }) {
  const p = pageOf(id);
  return (
    <p className="folio" aria-hidden="true">
      <span>Autark · Manual de Operação · {REVISION}</span>
      <span className="folio__n">
        Pág. {p.n}/{p.total}
      </span>
    </p>
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
