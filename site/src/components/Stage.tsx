import { ASSEMBLY, ASSEMBLY_INTRO, COVER, PARTS, REVISION, WA_DEFAULT } from "@/content/site";
import { Balloon, Icon } from "./Icon";
import { Folio, LegacyAnchors, SectionHead } from "./Manual";
import { StageDriver } from "./StageDriver";
import { MotionToggle } from "./MotionToggle";

// O pôster é o mesmo desenho da cena em vista explodida, gerado em SVG por
// scripts/cerebro-poster.mjs: aparece antes do 3D, sem WebGL e sem JavaScript.
function Poster() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="fig__poster" src="/figs/cerebro-explodido.svg" alt="" aria-hidden="true" decoding="async" loading="eager" width={719} height={725} />
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
      aria-label="Figura 1: o Cérebro Autark em desenho técnico, montado peça por peça conforme você rola a página."
    >
      <Poster />
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
          <span>Escala 1:1</span>
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
            Ver projetos e sistemas <Icon name="arrow-down" size={16} />
          </a>
          <a className="link-arrow" href="/pacotes/">
            Pacotes e preços <Icon name="arrow-right" size={16} />
          </a>
        </div>
        {/* Só aparece no celular: a promessa ("montado peça por peça") precisa
            estar na primeira tela de quem chega pelo Instagram. */}
        <FigFrame inline />
        <div className="plate">
          <p className="plate__head">
            <span>Medições no 99freelas</span>
            <span className="plate__model">Nov/2026</span>
          </p>
          <dl className="plate__list">
            {COVER.plate.map((r) => (
              <div className="plate__row" key={r.k}>
                <dt>{r.k}</dt>
                <dd>
                  {"star" in r && r.star ? <Icon name="star" size={16} className="plate__star" /> : null}
                  {r.v}
                </dd>
              </div>
            ))}
          </dl>
          <p className="plate__note">{COVER.plateNote}</p>
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
          <caption>Lista de peças do Cérebro Autark</caption>
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
            </li>
          ))}
        </ol>
        <Folio id="montagem" />
      </section>
      <StageDriver />
    </div>
  );
}
