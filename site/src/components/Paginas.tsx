// Peças das páginas avulsas do manual (sistemas, Vale do Paraíba, privacidade):
// a mesma trilha e o mesmo fecho laranja das notas de campo, para a pessoa não
// sentir que saiu do manual.

import { Fragment } from "react";
import { wa } from "@/content/site";
import { Icon } from "./Icon";

export function Trilha({ itens }: { itens: { label: string; href?: string }[] }) {
  return (
    <nav className="nota__trilha" aria-label="Você está em">
      {itens.map((it, i) => (
        <Fragment key={it.label}>
          {i > 0 ? <span aria-hidden="true">/</span> : null}
          {it.href ? <a href={it.href}>{it.label}</a> : <span aria-current="page">{it.label}</span>}
        </Fragment>
      ))}
    </nav>
  );
}

export function Chamada({
  id,
  titulo,
  texto,
  mensagem,
  kicker = "Assistência técnica",
}: {
  id: string;
  titulo: string;
  texto?: string;
  mensagem: string;
  kicker?: string;
}) {
  return (
    <aside className="nota__cta" aria-labelledby={id}>
      <p className="nota__cta-k">{kicker}</p>
      <h2 id={id} className="nota__cta-t">
        {titulo}
      </h2>
      {texto ? <p className="nota__cta-p">{texto}</p> : null}
      <a className="btn btn--signal btn--lg" href={wa(mensagem)} target="_blank" rel="noopener">
        <Icon name="whatsapp" size={18} />
        Chamar no WhatsApp
      </a>
      <p className="nota__cta-nota">Resposta no mesmo dia. Sem formulário: abre o WhatsApp com a mensagem pronta.</p>
    </aside>
  );
}

/** Bloco com título em régua, no idioma da ficha das notas. */
export function Bloco({ id, titulo, children }: { id: string; titulo: string; children: React.ReactNode }) {
  return (
    <section className="bloco" aria-labelledby={id}>
      <h2 className="bloco__t" id={id}>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

/** Primeira frase de um parágrafo, para lede e meta description. */
export function frases(texto: string): string[] {
  return texto.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9“"])/);
}

export function resumir(texto: string, max = 158) {
  return texto.length > max ? `${texto.slice(0, max - 3).replace(/\s+\S*$/, "")}…` : texto;
}
