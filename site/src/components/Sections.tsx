/* eslint-disable @next/next/no-img-element -- estas seções viram HTML estático no build (ver scripts/prerender.mjs); os prints já são WebP leves. */
import {
  APPLICATIONS,
  EMAIL,
  FIELD,
  FREELAS,
  GITHUB,
  INSTALL,
  LAB,
  MAKER,
  MODELS,
  OTHER_WORK,
  PROOFS,
  REVISION,
  STATUS_LABEL,
  SYSTEMS,
  SYSTEMS_INTRO,
  TROUBLESHOOTING,
  WARRANTY,
  type Status,
  type System,
} from "@/content/site";
import { Icon, LogoMark } from "./Icon";
import { Folio, LegacyAnchors, SectionHead } from "./Manual";

function refHref(ref: string) {
  if (ref.startsWith("SYS-")) return `#${ref.toLowerCase()}`;
  return "#dimensionamento";
}

export function Stamp({ status, compact }: { status: Status; compact?: boolean }) {
  return (
    <span className={`stamp stamp--${status} ${compact ? "stamp--compact" : ""}`} data-stamp>
      <span className="stamp__t">{STATUS_LABEL[status]}</span>
      {compact ? null : <span className="stamp__d">conferido set/2026</span>}
    </span>
  );
}

/* §2 ------------------------------------------------------------------ */
export function Applications() {
  return (
    <section className="sec" id="aplicacoes" data-section="aplicacoes" aria-labelledby="h-aplicacoes">
      <LegacyAnchors section="aplicacoes" />
      <SectionHead id="h-aplicacoes" address="§2" title="Onde o sistema trabalha" lede={APPLICATIONS.intro} />
      <table className="apps">
        <thead>
          <tr>
            <th scope="col">Quem usa</th>
            <th scope="col">O problema</th>
            <th scope="col">O que o sistema faz</th>
            <th scope="col" className="apps__ref">
              Ref.
            </th>
          </tr>
        </thead>
        <tbody>
          {APPLICATIONS.rows.map((r) => (
            <tr key={r.who}>
              <th scope="row">{r.who}</th>
              <td className="apps__pain">{r.pain}</td>
              <td className="apps__fix">{r.fix}</td>
              <td className="apps__ref">
                <a href={refHref(r.ref)}>{r.ref}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Folio id="aplicacoes" />
    </section>
  );
}

/* §3 ------------------------------------------------------------------ */
export function Models() {
  return (
    <section className="sec" id="modelos" data-section="modelos" aria-labelledby="h-modelos">
      <LegacyAnchors section="modelos" />
      <SectionHead id="h-modelos" address="§3" title="Modelos disponíveis" lede={MODELS.intro} />
      <ol className="models">
        {MODELS.items.map((m) => (
          <li className="model" key={m.code}>
            <h3 className="model__name">
              <span className="model__code">{m.code}</span>
              {m.name}
            </h3>
            <p className="model__body">{m.body}</p>
            <p className="model__parts">
              <span className="model__parts-k">Componentes</span>
              {m.parts.map((p) => (
                <span key={p} className="chiplet">
                  {p}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ol>
      <Folio id="modelos" />
    </section>
  );
}

/* §4 ------------------------------------------------------------------ */
function actionIcon(kind: System["actions"][number]["kind"]) {
  if (kind === "chat") return <Icon name="whatsapp" size={16} />;
  if (kind === "code") return <Icon name="github" size={16} />;
  return <Icon name="arrow-up-right" size={16} />;
}

function Sheet({ s, i }: { s: System; i: number }) {
  const id = s.code.toLowerCase();
  return (
    <article className={`sheet ${s.feature ? "sheet--feature" : "sheet--compact"}`} id={id} data-flip={i % 2} aria-labelledby={`${id}-t`}>
      <header className="sheet__head">
        <h3 className="sheet__name" id={`${id}-t`}>
          <span className="sheet__code">{s.code}</span>
          {s.name}
        </h3>
        <p className="sheet__kind">{s.kind}</p>
        <Stamp status={s.status} />
      </header>
      <figure className="sheet__fig">
        <div className="sheet__img">
          <img
            src={s.image}
            width={s.imageW}
            height={s.imageH}
            alt={`Tela real do ${s.name}.`}
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption>
          <span className="fig__no">Fig. 4.{i + 1}</span> {s.imageNote ?? `${s.name}, tela real.`}
        </figcaption>
      </figure>
      <div className="sheet__text">
        <p className="sheet__body">{s.body}</p>
        {s.statusNote ? <p className="sheet__note">{s.statusNote}</p> : null}
        <dl className="spec">
          <div className="spec__row">
            <dt>Marca</dt>
            <dd>{s.metric}</dd>
          </div>
          {s.spec.map((r) => (
            <div className="spec__row" key={r.k}>
              <dt>{r.k}</dt>
              <dd>{r.v}</dd>
            </div>
          ))}
        </dl>
        <p className="stack">
          <span className="stack__k">Stack</span>
          {s.stack.map((x) => (
            <span key={x} className="chiplet">
              {x}
            </span>
          ))}
        </p>
        <div className="sheet__actions">
          {s.actions.map((a, k) => (
            <a
              key={a.href}
              className={k === 0 ? "btn btn--ink" : "link-arrow"}
              href={a.href}
              target="_blank"
              rel="noopener"
            >
              {actionIcon(a.kind)}
              {a.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export function Systems() {
  return (
    <section className="sec sec--systems" id="sistemas" data-section="sistemas" aria-labelledby="h-sistemas">
      <LegacyAnchors section="sistemas" />
      <SectionHead id="h-sistemas" address="§4" title="Sistemas em operação" lede={SYSTEMS_INTRO} />

      <table className="register">
        <caption>Registro de sistemas, conferido em setembro de 2026</caption>
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Sistema</th>
            <th scope="col" className="register__kind">
              Tipo
            </th>
            <th scope="col">Situação</th>
            <th scope="col" className="register__metric">
              Marca
            </th>
          </tr>
        </thead>
        <tbody>
          {SYSTEMS.map((s) => (
            <tr key={s.code}>
              <td>
                <a className="register__code" href={`#${s.code.toLowerCase()}`}>
                  {s.code}
                </a>
              </td>
              <th scope="row">{s.name}</th>
              <td className="register__kind">{s.kind}</td>
              <td>
                <span className={`status status--${s.status}`}>{STATUS_LABEL[s.status]}</span>
              </td>
              <td className="register__metric">{s.metric}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="sheets">
        {SYSTEMS.map((s, i) => (
          <Sheet key={s.code} s={s} i={i} />
        ))}
      </div>

      <div className="annex" id="anexos">
        <div className="annex__block">
          <h3 className="annex__t">
            <span className="annex__code">Anexo A</span>
            {PROOFS.title}
          </h3>
          <p className="annex__lede">{PROOFS.intro}</p>
          <ol className="proofs">
            {PROOFS.items.map((p) => (
              <li key={p.name} className="proof">
                <h4 className="proof__t">{p.name}</h4>
                <p>{p.body}</p>
                <p className="proof__tags">
                  {p.tags.map((t) => (
                    <span key={t} className="chiplet">
                      {t}
                    </span>
                  ))}
                </p>
                <a className="link-arrow" href={p.link.href} target="_blank" rel="noopener">
                  {p.link.label} <Icon name="arrow-up-right" size={16} />
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="annex__block annex__block--split">
          <div>
            <h3 className="annex__t">
              <span className="annex__code">Anexo B</span>
              Outros trabalhos entregues
            </h3>
            <ul className="others">
              {OTHER_WORK.map((o) => (
                <li key={o.name}>
                  <p className="others__t">
                    {o.name} <span className="others__d">{o.date}</span>
                  </p>
                  <p>{o.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <a className="lab" href={LAB.href} target="_blank" rel="noopener">
            <span className="lab__t">
              <span className="annex__code">Anexo C</span>
              {LAB.title}
            </span>
            <span className="lab__body">{LAB.body}</span>
            <span className="lab__spec">
              {LAB.figures.map((f) => (
                <span key={f.k} className="lab__spec-row">
                  <span className="lab__spec-k">{f.k}</span>
                  <span className="lab__spec-v">{f.v}</span>
                </span>
              ))}
            </span>
            <span className="lab__go">
              Abrir o laboratório <Icon name="arrow-up-right" size={16} />
            </span>
          </a>
        </div>
      </div>
      <Folio id="sistemas" />
    </section>
  );
}

/* §5 ------------------------------------------------------------------ */
export function Install() {
  return (
    <section className="sec" id="instalacao" data-section="instalacao" aria-labelledby="h-instalacao">
      <LegacyAnchors section="instalacao" />
      <SectionHead id="h-instalacao" address="§5" title="Procedimento de instalação" lede={INSTALL.intro} />
      <div className="install">
        <ol className="procedure">
          {INSTALL.steps.map((s, i) => (
            <li key={s.title} className="procedure__step">
              <span className="procedure__n" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="procedure__t">{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <aside className="install__aside">
          <div className="req">
            <h3 className="req__t">
              <Icon name="warning" size={18} /> Antes de começar, tenha em mãos
            </h3>
            <ul>
              {INSTALL.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <table className="times">
            <caption>Tempo de instalação</caption>
            <tbody>
              {INSTALL.times.map((t) => (
                <tr key={t.k}>
                  <th scope="row">{t.k}</th>
                  <td>{t.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </div>
      <Folio id="instalacao" />
    </section>
  );
}

/* §7 ------------------------------------------------------------------ */
export function Field() {
  return (
    <section className="sec" id="campo" data-section="campo" aria-labelledby="h-campo">
      <LegacyAnchors section="campo" />
      <SectionHead id="h-campo" address="§7" title="Relatório de campo" lede={FIELD.intro} />
      <div className="field-sum">
        <dl className="field-sum__figs">
          <div>
            <dt>Avaliações</dt>
            <dd>7</dd>
          </div>
          <div>
            <dt>Nota</dt>
            <dd>
              5.0 <Icon name="star" size={18} className="field-sum__star" />
            </dd>
          </div>
          <div>
            <dt>Recomendam</dt>
            <dd>100%</dd>
          </div>
        </dl>
        <a className="link-arrow" href={FREELAS} target="_blank" rel="noopener">
          Conferir no 99freelas <Icon name="arrow-up-right" size={16} />
        </a>
      </div>
      <ol className="field">
        {FIELD.items.map((f, i) => (
          <li className={`field__row ${i === 0 ? "field__row--lead" : ""}`} key={f.project}>
            <p className="field__n">Ensaio {String(i + 1).padStart(2, "0")}</p>
            <blockquote className="field__q">
              <p>“{f.quote}”</p>
            </blockquote>
            <p className="field__meta">
              {f.project} · {f.date}
            </p>
            <span className="stamp stamp--ok stamp--compact" data-stamp>
              <span className="stamp__t">Aprovado 5.0</span>
            </span>
          </li>
        ))}
      </ol>
      <Folio id="campo" />
    </section>
  );
}

/* §8 ------------------------------------------------------------------ */
export function Maker() {
  return (
    <section className="sec" id="fabricante" data-section="fabricante" aria-labelledby="h-fabricante">
      <LegacyAnchors section="fabricante" />
      <SectionHead id="h-fabricante" address="§8" title="Fabricante e responsável técnico" />
      <div className="maker">
        <figure className="maker__photo">
          <img
            src="/marca/foto-square.webp"
            width={760}
            height={760}
            alt="Alisson Santos no escritório, trabalhando no computador."
            loading="lazy"
            decoding="async"
          />
          <figcaption>
            <span className="fig__no">Fig. 8.1</span> Alisson Santos, responsável técnico.
          </figcaption>
        </figure>
        <div className="maker__text">
          <h3 className="maker__title">{MAKER.title}</h3>
          {MAKER.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <div className="credential">
          <p className="credential__head">
            <LogoMark size={16} />
            <span>Credencial técnica</span>
          </p>
          <dl>
            {MAKER.card.map((r) => (
              <div className="credential__row" key={r.k}>
                <dt>{r.k}</dt>
                <dd>{r.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <Folio id="fabricante" />
    </section>
  );
}

/* §9 ------------------------------------------------------------------ */
export function Troubleshooting() {
  return (
    <section className="sec" id="problemas" data-section="problemas" aria-labelledby="h-problemas">
      <LegacyAnchors section="problemas" />
      <SectionHead
        id="h-problemas"
        address="§9"
        title="Solução de problemas"
        lede="As perguntas que todo cliente faz antes de começar, com a resposta direta."
      />
      <div className="trouble">
        {TROUBLESHOOTING.map((f, i) => (
          <details className="trouble__row" key={f.q} name="duvidas">
            <summary>
              <span className="trouble__n">9.{i + 1}</span>
              <span className="trouble__q">{f.q}</span>
              <Icon name="plus" size={18} className="trouble__ico" />
            </summary>
            <div className="trouble__a">
              <p>{f.a}</p>
            </div>
          </details>
        ))}
      </div>
      <Folio id="problemas" />
    </section>
  );
}

/* §10 ----------------------------------------------------------------- */
export function Warranty() {
  return (
    <section className="sec" id="garantia" data-section="garantia" aria-labelledby="h-garantia">
      <SectionHead id="h-garantia" address="§10" title="Termo de garantia" lede="E se eu não gostar do resultado? Está escrito aqui." />
      <div className="warranty">
        <ol className="warranty__list">
          {WARRANTY.map((w, i) => (
            <li key={w.title} className="clause">
              <h3 className="clause__t">
                <span className="clause__n">Cl. {i + 1}</span>
                {w.title}
              </h3>
              <p>{w.body}</p>
            </li>
          ))}
        </ol>
        <p className="warranty__sig">
          <span className="warranty__line" aria-hidden="true" />
          Alisson Santos, responsável técnico da Autark
        </p>
      </div>
      <Folio id="garantia" />
    </section>
  );
}

/* Colofão -------------------------------------------------------------- */
export function Colophon() {
  return (
    <footer className="colophon">
      <div className="colophon__brand">
        <LogoMark size={28} />
        <span>Autark</span>
      </div>
      <p className="colophon__text">
        Manual de Operação, {REVISION}. Escrito, desenhado e construído à mão por Alisson Santos, sem template.
      </p>
      <p className="colophon__text colophon__dim">
        Este site não usa cookies nem rastreadores, e as fontes são servidas daqui mesmo. Fontes Hubot Sans, Mona Sans
        e Martian Mono sob licença SIL OFL 1.1.
      </p>
      <nav className="colophon__nav" aria-label="Links do rodapé">
        <a href={GITHUB} target="_blank" rel="noopener">
          <Icon name="github" size={16} /> GitHub
        </a>
        <a href={`mailto:${EMAIL}`}>
          <Icon name="mail" size={16} /> {EMAIL}
        </a>
        <a href={FREELAS} target="_blank" rel="noopener">
          <Icon name="star" size={16} /> 99freelas
        </a>
        <a href="#capa">
          <Icon name="arrow-right" size={16} className="rot-up" /> Voltar à capa
        </a>
      </nav>
      <p className="colophon__copy">© 2026 Autark</p>
    </footer>
  );
}
