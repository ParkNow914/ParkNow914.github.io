/* eslint-disable @next/next/no-img-element -- export estático sem otimizador de imagem; os prints já são WebP leves. */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotasHeader, ListaNotas } from "@/components/Notas";
import { Colophon, Stamp } from "@/components/Sections";
import { Enhance } from "@/components/Enhance";
import { Icon } from "@/components/Icon";
import { Bloco, Chamada, Trilha, frases, resumir } from "@/components/Paginas";
import { SITE_URL, STATUS_LABEL, SYSTEMS } from "@/content/site";
import { AUTHOR, PUBLISHER } from "@/content/jsonld";
import { aplicacoes, notasDoSistema, sistema } from "@/lib/sistemas";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SYSTEMS.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = sistema(slug);
  if (!s) return {};
  const url = `/sistemas/${s.slug}/`;
  const img = `/og/sistemas/${s.slug}.png`;
  const descricao = resumir(s.body);
  return {
    title: `${s.name}: ${s.kind} · Autark`,
    description: descricao,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "Autark",
      locale: "pt_BR",
      title: `${s.name} · ${s.kind}`,
      description: descricao,
      images: [{ url: img, width: 1200, height: 630, alt: `${s.name}, ${s.kind}` }],
    },
    twitter: { card: "summary_large_image", images: [img] },
  };
}

function acaoIcone(kind: string) {
  if (kind === "chat") return <Icon name="whatsapp" size={16} />;
  if (kind === "code") return <Icon name="github" size={16} />;
  return <Icon name="arrow-up-right" size={16} />;
}

export default async function SistemaPage({ params }: Props) {
  const { slug } = await params;
  const i = SYSTEMS.findIndex((x) => x.slug === slug);
  const s = SYSTEMS[i];
  if (!s) notFound();
  const [lede, ...resto] = frases(s.body);
  const usos = aplicacoes(s);
  const relacionadas = notasDoSistema(s);
  const anterior = SYSTEMS[i - 1];
  const proximo = SYSTEMS[i + 1];
  const url = `${SITE_URL}/sistemas/${s.slug}/`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: s.name,
      genre: s.kind,
      description: resumir(s.body),
      url,
      image: `${SITE_URL}${s.image}`,
      inLanguage: "pt-BR",
      creator: AUTHOR,
      publisher: PUBLISHER,
      keywords: s.stack.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Manual de Operação", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Sistemas", item: `${SITE_URL}/sistemas/` },
        { "@type": "ListItem", position: 3, name: s.name, item: url },
      ],
    },
  ];

  return (
    <>
      <NotasHeader secao={{ label: "Sistemas", href: "/sistemas/" }} />
      <main id="conteudo" className="nota-pag">
        <article className="nota sis">
          <Trilha itens={[{ label: "Manual", href: "/" }, { label: "Sistemas", href: "/sistemas/" }, { label: s.code }]} />
          <header className="nota__cab sis__cab">
            <p className="nota__kicker">
              <span className="nota__pilar">{s.code}</span>
              <span>{s.kind}</span>
            </p>
            <h1 className="nota__t">{s.name}</h1>
            <p className="nota__lede">{lede}</p>
            <div className="sis__carimbo">
              <Stamp status={s.status} />
            </div>
          </header>

          <figure className="sis__fig">
            <div className="sheet__img">
              <img src={s.image} width={s.imageW} height={s.imageH} alt={`Tela real: ${s.name}.`} decoding="async" />
            </div>
            <figcaption>{s.imageNote ?? `${s.name}, tela real.`}</figcaption>
          </figure>

          <div className="nota__texto">
            {resto.length ? <p>{resto.join(" ")}</p> : null}
            {s.statusNote ? <p className="sheet__note">{s.statusNote}</p> : null}
          </div>

          <Bloco id="sis-ficha" titulo="Ficha técnica">
            <dl className="spec">
              <div className="spec__row">
                <dt>Situação</dt>
                <dd>{STATUS_LABEL[s.status]}</dd>
              </div>
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
                <a key={a.href} className={k === 0 ? "btn btn--ink" : "link-arrow"} href={a.href} target="_blank" rel="noopener">
                  {acaoIcone(a.kind)}
                  {a.label}
                </a>
              ))}
            </div>
          </Bloco>

          {usos.length ? (
            <Bloco id="sis-uso" titulo="Onde ele trabalha">
              {usos.map((u) => (
                <dl key={u.who} className="uso">
                  <div>
                    <dt>Quem usa</dt>
                    <dd>{u.who}</dd>
                  </div>
                  <div>
                    <dt>O problema</dt>
                    <dd>{u.pain}</dd>
                  </div>
                  <div>
                    <dt>O que o sistema faz</dt>
                    <dd>{u.fix}</dd>
                  </div>
                </dl>
              ))}
            </Bloco>
          ) : null}

          {relacionadas.length ? (
            <Bloco id="sis-notas" titulo={`Notas de campo: ${s.name}`}>
              <ListaNotas lista={relacionadas} />
            </Bloco>
          ) : null}

          <Chamada
            id="sis-cta-t"
            titulo="Quer um sistema assim no seu negócio?"
            texto="Conte o que você precisa. Eu respondo no mesmo dia e mostro este sistema funcionando antes de qualquer proposta."
            mensagem={`Olá Alisson! Vi o sistema ${s.name} no site e quero algo parecido para o meu negócio.`}
          />

          <nav className="nota__vizinhas" aria-label="Outros sistemas">
            {anterior ? (
              <a href={`/sistemas/${anterior.slug}/`}>
                <span>Sistema anterior · {anterior.code}</span>
                {anterior.name}
              </a>
            ) : (
              <a href="/sistemas/">
                <span>Registro</span>
                Todos os sistemas
              </a>
            )}
            {proximo ? (
              <a href={`/sistemas/${proximo.slug}/`} className="nota__vizinhas--ant">
                <span>Próximo sistema · {proximo.code}</span>
                {proximo.name}
              </a>
            ) : (
              <a href="/sistemas/" className="nota__vizinhas--ant">
                <span>Registro</span>
                Todos os sistemas
              </a>
            )}
          </nav>
        </article>
      </main>
      <Colophon capa="/#capa" />
      <Enhance />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
