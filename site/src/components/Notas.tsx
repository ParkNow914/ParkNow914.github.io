// Notas de campo: a mesma folha do manual, agora como artigo. Componentes de
// servidor, sem estado: o HTML sai pronto do build.

import { REVISION, WA_DEFAULT, wa } from "@/content/site";
import { PILARES, dataLonga, trechosHtml, type Bloco, type Nota, type Slide } from "@/lib/notas";
import { Icon, LogoMark } from "./Icon";

const Html = ({ as: Tag = "p", className, t }: { as?: "p" | "h3" | "li" | "blockquote" | "span"; className?: string; t: string }) => (
  <Tag className={className} dangerouslySetInnerHTML={{ __html: trechosHtml(t) }} />
);

const inicial = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Cabeçalho das páginas fora da home. `secao` diz em que parte do manual a pessoa está. */
export function NotasHeader({ secao = { label: "Notas de campo", href: "/notas/" } }: { secao?: { label: string; href: string } } = {}) {
  return (
    <header className="rh">
      <a className="rh__brand" href="/" aria-label="Autark, ir para a capa do manual">
        <LogoMark size={20} />
        <span className="rh__name">Autark</span>
      </a>
      <span className="rh__doc">
        Manual de Operação <span className="rh__rev">{REVISION}</span>
      </span>
      <span className="rh__sec">
        <a className="rh__notas" href={secao.href}>
          {secao.label}
        </a>
      </span>
      <a
        className="btn btn--signal btn--sm rh__cta"
        href={WA_DEFAULT}
        target="_blank"
        rel="noopener"
        aria-label="Pedir instalação pelo WhatsApp"
      >
        <Icon name="whatsapp" size={16} />
        <span>Pedir instalação</span>
      </a>
    </header>
  );
}

function BlocoNota({ b }: { b: Bloco }) {
  switch (b.tipo) {
    case "sobretitulo":
      return <Html as="h3" className="ficha__t" t={inicial(b.texto)} />;
    case "titulo":
      return <Html className="ficha__numero" t={b.texto} />;
    case "destaque":
      return <Html as="blockquote" className="ficha__destaque" t={b.texto} />;
    case "paragrafo":
      return <Html t={b.texto} />;
    case "lista":
      return (
        <ul className="ficha__lista">
          {b.itens.map((i) => (
            <Html as="li" key={i} t={i} />
          ))}
        </ul>
      );
    case "codigo":
      return (
        <figure className="ficha__codigo">
          {b.rotulo ? <figcaption>{b.rotulo}</figcaption> : null}
          <pre>{b.texto}</pre>
        </figure>
      );
  }
}

function Parte({ s, k }: { s: Slide; k: number }) {
  return (
    <section className={`ficha__parte ficha__parte--${s.tipo}`}>
      <span className="ficha__n" aria-hidden="true">
        {String(k + 1).padStart(2, "0")}
      </span>
      <div className="ficha__corpo">
        {s.blocos.map((b, i) => (
          <BlocoNota key={i} b={b} />
        ))}
      </div>
    </section>
  );
}

export function NotaArtigo({ nota, anterior, proxima }: { nota: Nota; anterior?: Nota; proxima?: Nota }) {
  const minutos = Math.max(1, Math.round(nota.palavras / 200));
  return (
    <article className="nota">
      <nav className="nota__trilha" aria-label="Você está em">
        <a href="/">Manual</a>
        <span aria-hidden="true">/</span>
        <a href="/notas/">Notas de campo</a>
        <span aria-hidden="true">/</span>
        <span>Nota nº {nota.n}</span>
      </nav>

      <header className="nota__cab">
        <p className="nota__kicker">
          <span className="nota__pilar">{PILARES[nota.pilar] ?? nota.pilar}</span>
          <time dateTime={nota.data}>{dataLonga(nota.data)}</time>
        </p>
        <h1 className="nota__t">{nota.titulo}</h1>
        {nota.lede ? <Html className="nota__lede" t={nota.lede} /> : null}
        <p className="nota__autor">
          Por Alisson Santos, fundador da Autark · {minutos} min de leitura
        </p>
      </header>

      <div className="nota__texto">
        {nota.legenda.map((p, i) => (
          <Html key={i} t={p} />
        ))}
      </div>

      {nota.slides.length ? (
        <div className="ficha" aria-label="A nota em partes">
          <h2 className="ficha__cab">
            <span>Ficha da nota</span>
            <span>{nota.slides.length} partes</span>
          </h2>
          {nota.slides.map((s, k) => (
            <Parte key={k} s={s} k={k} />
          ))}
        </div>
      ) : null}

      <aside className="nota__cta" aria-labelledby="nota-cta-t">
        <p className="nota__cta-k">Assistência técnica</p>
        <h2 id="nota-cta-t" className="nota__cta-t">
          {nota.cta?.titulo ?? "Quer ver funcionando?"}
        </h2>
        {nota.cta?.destaque ? <Html className="nota__cta-d" t={nota.cta.destaque} /> : null}
        {nota.cta?.texto ? <Html className="nota__cta-p" t={nota.cta.texto} /> : null}
        <a
          className="btn btn--signal btn--lg"
          href={wa(`Olá Alisson! Li a nota "${nota.titulo}" no site e quero conversar sobre o meu caso.`)}
          target="_blank"
          rel="noopener"
        >
          <Icon name="whatsapp" size={18} />
          Chamar no WhatsApp
        </a>
        <p className="nota__cta-nota">Resposta no mesmo dia. Sem formulário: abre o WhatsApp com a mensagem pronta.</p>
      </aside>

      {anterior || proxima ? (
        <nav className="nota__vizinhas" aria-label="Outras notas">
          {proxima ? (
            <a href={`/notas/${proxima.slug}/`}>
              <span>Nota seguinte</span>
              {proxima.titulo}
            </a>
          ) : (
            <span />
          )}
          {anterior ? (
            <a href={`/notas/${anterior.slug}/`} className="nota__vizinhas--ant">
              <span>Nota anterior</span>
              {anterior.titulo}
            </a>
          ) : null}
        </nav>
      ) : null}
    </article>
  );
}

export function ListaNotas({ lista }: { lista: Nota[] }) {
  return (
    <ol className="notas">
      {lista.map((n) => (
        <li key={n.slug} className="notas__item">
          <span className="notas__n">Nº {String(n.n).padStart(2, "0")}</span>
          <div className="notas__corpo">
            <p className="notas__meta">
              <span className="nota__pilar">{PILARES[n.pilar] ?? n.pilar}</span>
              <time dateTime={n.data}>{dataLonga(n.data)}</time>
            </p>
            <h2 className="notas__t">
              <a href={`/notas/${n.slug}/`}>{n.titulo}</a>
            </h2>
            {n.lede ? <Html className="notas__lede" t={n.lede} /> : null}
          </div>
          <Icon name="arrow-right" size={20} className="notas__seta" />
        </li>
      ))}
    </ol>
  );
}

/** Bloco da home: as três notas mais recentes, depois do relatório de campo. */
export function NotasRecentes({ lista }: { lista: Nota[] }) {
  if (!lista.length) return null;
  return (
    <section className="sec notas-home" aria-labelledby="h-notas">
      <div className="notas-home__cab">
        <h2 id="h-notas" className="notas-home__t">
          <span className="annex__code">Anexo D</span>
          Notas de campo
        </h2>
        <p className="notas-home__lede">
          O que eu aprendo construindo, uma nota por vez: problema real, sistema real, número conferido.
        </p>
      </div>
      <ListaNotas lista={lista.slice(0, 3)} />
      <a className="link-arrow" href="/notas/">
        Todas as notas <Icon name="arrow-right" size={16} />
      </a>
    </section>
  );
}
