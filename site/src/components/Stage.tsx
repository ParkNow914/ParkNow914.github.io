import { ASSEMBLY, ASSEMBLY_INTRO, COVER, PARTS, REVISION, WA_DEFAULT } from "@/content/site";
import { Balloon, Icon } from "./Icon";
import { Folio, LegacyAnchors, SectionHead } from "./Manual";
import { StageDriver } from "./StageDriver";
import { MotionToggle } from "./MotionToggle";

// Cada tela tem seu pôster: o da capa no celular, o da bancada no desktop. O
// preload leva `media`, então nenhum aparelho baixa com pressa a imagem do outro.
// As larguras em WebP saem de scripts/posters.mjs (o site é estático, sem
// otimizador de imagem no servidor).
const POSTER = {
  inline: { base: "/figs/fig1-explodida-mobile", widths: [358, 537, 716], sizes: "100vw", media: "(max-width: 960px)" },
  main: { base: "/figs/fig1-explodida", widths: [662, 993, 1324], sizes: "46vw", media: "(min-width: 961px)" },
} as const;
const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

function Poster({ inline }: { inline?: boolean }) {
  const p = inline ? POSTER.inline : POSTER.main;
  const srcSet = p.widths.map((w) => `${p.base}-${w}.webp ${w}w`).join(", ");
  const src = `${p.base}-${p.widths[p.widths.length - 1]}.webp`;
  return (
    <>
      <link rel="preload" as="image" imageSrcSet={srcSet} imageSizes={p.sizes} media={p.media} fetchPriority="high" />
      <picture>
        {/* No desktop a figura da capa fica oculta; um pixel vazio evita baixar o pôster à toa. */}
        {inline ? <source media={POSTER.main.media} srcSet={BLANK} /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="fig__poster"
          src={src}
          srcSet={srcSet}
          sizes={p.sizes}
          alt=""
          aria-hidden="true"
          decoding="async"
          // No celular a figura da bancada começa fora da tela; só a da capa tem pressa.
          fetchPriority={inline ? "high" : "auto"}
          loading="eager"
        />
      </picture>
    </>
  );
}

function FigFrame({ inline }: { inline?: boolean }) {
  return (
    <figure
      className={`fig ${inline ? "fig--inline" : "fig--main"}`}
      data-machine-slot
      data-pad={inline ? "10 72" : "84 128"}
      data-pad-sm={inline ? "10 72" : "62 64"}
      data-fig="drawing"
      aria-label="Fig. 1: o Cérebro Autark, uma máquina de nove peças que se monta conforme você rola a página."
    >
      <Poster inline={inline} />
      <span className="fig__mark fig__mark--tl" />
      <span className="fig__mark fig__mark--tr" />
      <span className="fig__mark fig__mark--bl" />
      <span className="fig__mark fig__mark--br" />
      <figcaption className="fig__cap">
        <span className="fig__no">Fig. 1</span> <span data-fig-state>Cérebro Autark, vista explodida</span>
      </figcaption>
      {inline ? null : (
        <p className="fig__block" aria-hidden="true">
          <span>Desenho AT-01</span>
          <span>Folha 1/1</span>
          <span>{REVISION}</span>
        </p>
      )}
      {inline ? null : (
        <ol className="fig__parts" aria-hidden="true">
          {PARTS.map((p) => (
            <li key={p.n} data-part={p.n} title={p.name}>
              {p.n}
            </li>
          ))}
        </ol>
      )}
      {inline ? null : (
        <div className="fig__meter" aria-hidden="true">
          <span className="fig__meter-label">Montagem</span>
          <span className="fig__meter-track">
            <span className="fig__meter-fill" data-fig-fill />
          </span>
          <span className="fig__meter-val" data-fig-step>
            0/{ASSEMBLY.length}
          </span>
        </div>
      )}
      <p className="fig__hint" aria-hidden="true">
        <Icon name="arrow-down" size={14} /> Role para montar
      </p>
      {inline ? null : <MotionToggle />}
    </figure>
  );
}

export function Stage() {
  return (
    <div className="stage" id="stage">
      <div className="stage__fig">
        <FigFrame />
      </div>

      <header className="cover" id="capa" data-section="capa">
        <h1 className="cover__title">{COVER.title}</h1>
        <p className="cover__lede">{COVER.lede}</p>
        <div className="cover__actions">
          <a className="btn btn--signal" href={WA_DEFAULT} target="_blank" rel="noopener">
            <Icon name="whatsapp" size={18} />
            Pedir instalação no WhatsApp
          </a>
          <a className="link-arrow" href="#sistemas">
            Ver sistemas em operação <Icon name="arrow-down" size={16} />
          </a>
        </div>
        {/* Só aparece no celular: a promessa ("montado peça por peça") precisa
            estar na primeira tela de quem chega pelo Instagram. */}
        <FigFrame inline />
        <div className="plate">
          <p className="plate__head">
            <span>Plaqueta de identificação</span>
            <span className="plate__model">mod. 2026.09</span>
          </p>
          <dl className="plate__list">
            {COVER.plate.map((r) => (
              <div className="plate__row" key={r.k}>
                <dt>{r.k}</dt>
                <dd>
                  {r.star ? <Icon name="star" size={13} className="plate__star" /> : null}
                  {r.v}
                </dd>
              </div>
            ))}
          </dl>
          <span className="plate__rivet plate__rivet--tl" aria-hidden="true" />
          <span className="plate__rivet plate__rivet--tr" aria-hidden="true" />
          <span className="plate__rivet plate__rivet--bl" aria-hidden="true" />
          <span className="plate__rivet plate__rivet--br" aria-hidden="true" />
        </div>
      </header>

      <section className="assembly" id="montagem" data-section="montagem" aria-labelledby="h-montagem">
        <LegacyAnchors section="montagem" />
        <SectionHead id="h-montagem" address="§1" title="Como o sistema é montado" />
        <p className="assembly__lede">{ASSEMBLY_INTRO}</p>

        <table className="bom">
          <caption>Lista de peças da Fig. 1</caption>
          <thead>
            <tr>
              <th scope="col">Nº</th>
              <th scope="col">Peça</th>
              <th scope="col">Função</th>
              <th scope="col" className="bom__st">
                <span className="sr-only">Situação</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {PARTS.map((p) => (
              <tr key={p.n} data-part={p.n}>
                <td>
                  <Balloon n={p.n} />
                </td>
                <th scope="row">{p.name}</th>
                <td>{p.role}</td>
                <td className="bom__st">
                  <Icon name="check" size={14} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ol className="steps" data-steps>
          {ASSEMBLY.map((s, i) => (
            <li className="step" key={s.title} data-step={i}>
              <h3 className="step__title">
                <span className="step__n">
                  Passo {i + 1}/{ASSEMBLY.length}
                </span>
                {s.title}
              </h3>
              {s.parts.length ? (
                <p className="step__parts">
                  {s.parts.map((n) => (
                    <span key={n} className="step__part">
                      <Balloon n={n} />
                      {PARTS[n - 1].name}
                    </span>
                  ))}
                </p>
              ) : null}
              <p className="step__body">{s.body}</p>
              {"proof" in s && s.proof ? (
                <p className="step__proof">
                  <span className="step__proof-k">Nota de campo</span>
                  {s.proof}
                </p>
              ) : null}
              {"tests" in s && s.tests ? (
                <dl className="counters">
                  {s.tests.map((t) => (
                    <div key={t.label} className="counter">
                      <dt>{t.label}</dt>
                      <dd>
                        <span className="counter__n" data-count={t.n}>
                          {t.n}
                        </span>{" "}
                        testes verdes
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </li>
          ))}
        </ol>
        <Folio id="montagem" />
      </section>
      <StageDriver />
    </div>
  );
}
