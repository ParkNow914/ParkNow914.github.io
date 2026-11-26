import type { Metadata } from "next";
import { NotasHeader } from "@/components/Notas";
import { Colophon } from "@/components/Sections";
import { Enhance } from "@/components/Enhance";
import { Icon } from "@/components/Icon";
import { Briefing } from "@/components/Briefing";
import { Bloco, Trilha } from "@/components/Paginas";
import { FIELD, FREELAS, PACOTES, SITE_URL, wa } from "@/content/site";

const titulo = "Pacotes e preços";
const descricao =
  "Preço fechado e tudo por mensagem: AgendaZap com 14 dias grátis, Autark Barber grátis para 1 unidade, landing page por R$ 1.490, atendente de WhatsApp com agenda por R$ 1.990 e manutenção por R$ 390 por mês.";

export const metadata: Metadata = {
  title: `${titulo} · Autark`,
  description: descricao,
  alternates: { canonical: "/pacotes/" },
  openGraph: {
    type: "website",
    url: "/pacotes/",
    siteName: "Autark",
    locale: "pt_BR",
    title: `${titulo} · Autark`,
    description: descricao,
    images: [{ url: "/og/pacotes.png", width: 1200, height: 630, alt: titulo }],
  },
  twitter: { card: "summary_large_image", images: ["/og/pacotes.png"] },
};

// "R$ 1.490" -> 1490, para o JSON-LD.
const valor = (preco: string) => Number(preco.replace(/[^\d,]/g, "").replace(",", "."));

export default function PacotesPage() {
  const url = `${SITE_URL}/pacotes/`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      name: titulo,
      url,
      itemListElement: PACOTES.pacotes.map((p) => ({
        "@type": "Offer",
        name: p.nome,
        description: p.inclui.join("; "),
        price: valor(p.preco),
        priceCurrency: "BRL",
        url: `${url}#${p.code.toLowerCase()}`,
        seller: { "@type": "Organization", name: "Autark", url: SITE_URL },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: PACOTES.perguntas.map((p) => ({ "@type": "Question", name: p.q, acceptedAnswer: { "@type": "Answer", text: p.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Autark", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: titulo, item: url },
      ],
    },
  ];

  return (
    <>
      <NotasHeader secao={{ label: titulo, href: "/pacotes/" }} />
      <main id="conteudo" className="nota-pag pacotes-pag">
        <article className="nota nota--larga">
          <Trilha itens={[{ label: "Início", href: "/" }, { label: titulo }]} />
          <header className="nota__cab">
            <p className="nota__kicker">
              <span className="nota__pilar">Tabela de preços</span>
              <span>Preço fechado · tudo por mensagem</span>
            </p>
            <h1 className="nota__t">{titulo}</h1>
            <p className="nota__lede">{PACOTES.lede}</p>
          </header>

          <Bloco id="pac-produtos" titulo="Produtos prontos: comece hoje, sozinho">
            <div className="produtos">
              {PACOTES.produtos.map((p) => (
                <section key={p.code} className="produto" id={p.code.toLowerCase()} aria-labelledby={`${p.code}-t`}>
                  <p className="produto__code">{p.code}</p>
                  <h3 className="produto__nome" id={`${p.code}-t`}>
                    {p.nome}
                  </h3>
                  <p className="produto__para">{p.para}</p>
                  <p className="produto__o">{p.o}</p>
                  <p className="produto__preco">{p.preco}</p>
                  <p className="produto__detalhe">{p.detalhe}</p>
                  <div className="produto__acoes">
                    <a className="btn btn--ink" href={p.acao.href} target="_blank" rel="noopener">
                      {p.acao.label} <Icon name="arrow-up-right" size={16} />
                    </a>
                    <a className="link-arrow" href={p.ficha}>
                      Ver a ficha <Icon name="arrow-right" size={16} />
                    </a>
                  </div>
                </section>
              ))}
            </div>
          </Bloco>

          <Bloco id="pac-pacotes" titulo="Pacotes com preço fechado">
            <div className="tabela">
              {PACOTES.pacotes.map((p) => (
                <section key={p.code} className="pacote" id={p.code.toLowerCase()} aria-labelledby={`${p.code}-t`}>
                  <p className="pacote__code">{p.code}</p>
                  <h3 className="pacote__nome" id={`${p.code}-t`}>
                    {p.nome}
                  </h3>
                  <p className="pacote__para">{p.para}</p>
                  <p className="pacote__preco">
                    {p.preco}
                    {p.sufixo ? <span className="pacote__sufixo"> {p.sufixo}</span> : null}
                  </p>
                  <p className="pacote__prazo">{p.prazo}</p>
                  <ul className="pacote__inclui">
                    {p.inclui.map((i) => (
                      <li key={i}>
                        <Icon name="check" size={16} /> {i}
                      </li>
                    ))}
                  </ul>
                  <p className="pacote__fora">
                    <strong>Fica de fora:</strong> {p.fora.join("; ")}.
                  </p>
                  <div className="pacote__acoes">
                    {p.checkout ? (
                      <a className="btn btn--ink" href={p.checkout} target="_blank" rel="noopener">
                        {p.entrada ? `Pagar a entrada (${p.entrada})` : `Assinar (${p.preco} ${p.sufixo ?? ""})`.trim()}
                      </a>
                    ) : (
                      <a className="btn btn--ink" href={wa(p.mensagem)} target="_blank" rel="noopener">
                        <Icon name="whatsapp" size={18} /> Quero este pacote
                      </a>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <div className="sob-medida">
              <div>
                <h3 className="sob-medida__t">{PACOTES.sobMedida.nome}</h3>
                <p className="sob-medida__preco">{PACOTES.sobMedida.preco}</p>
                <p>{PACOTES.sobMedida.o}</p>
              </div>
              <a className="btn btn--ink" href={wa(PACOTES.sobMedida.mensagem)} target="_blank" rel="noopener">
                <Icon name="whatsapp" size={18} /> Pedir orçamento por escrito
              </a>
            </div>
          </Bloco>

          <Bloco id="pac-pagamento" titulo="Como funciona o pagamento">
            <ol className="passos">
              {PACOTES.pagamento.map((t, k) => (
                <li key={t}>
                  <span className="passos__n">{String(k + 1).padStart(2, "0")}</span>
                  <div>
                    <p>{t}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="bloco__nota">
              Antes de decidir, confira: {FIELD.reviews} avaliações no 99freelas, todas 5.0,{" "}
              <a href={FREELAS} target="_blank" rel="noopener">
                no perfil público
              </a>
              , e os <a href="/sistemas/">sistemas no portfólio</a>.
            </p>
          </Bloco>

          <Bloco id="pac-briefing" titulo="Mande o briefing">
            <Briefing />
          </Bloco>

          <Bloco id="pac-perguntas" titulo="Perguntas antes de pagar">
            <div className="trouble">
              {PACOTES.perguntas.map((p, i) => (
                <details key={p.q} className="trouble__row" name="pacotes">
                  <summary>
                    <span className="trouble__n">{i + 1}</span>
                    <span className="trouble__q">{p.q}</span>
                    <Icon name="plus" size={18} className="trouble__ico" />
                  </summary>
                  <div className="trouble__a">
                    <p>{p.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </Bloco>
        </article>
      </main>
      <Colophon capa="/#capa" />
      <Enhance />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
