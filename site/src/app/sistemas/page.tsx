import type { Metadata } from "next";
import { NotasHeader } from "@/components/Notas";
import { Colophon } from "@/components/Sections";
import { Enhance } from "@/components/Enhance";
import { Icon } from "@/components/Icon";
import { Chamada, Trilha, frases } from "@/components/Paginas";
import { SITE_URL, STATUS_LABEL, SYSTEMS, SYSTEMS_INTRO } from "@/content/site";
import { AUTHOR, PUBLISHER } from "@/content/jsonld";

const descricao =
  "Os dez sistemas da Autark, com a situação de cada um: agenda com IA no WhatsApp, delivery multicanal, CRM com a API oficial da Meta, IA jurídica e mais. Três rodam hoje com clientes.";

export const metadata: Metadata = {
  title: "Sistemas em operação · Autark",
  description: descricao,
  alternates: { canonical: "/sistemas/" },
  openGraph: {
    type: "website",
    url: "/sistemas/",
    siteName: "Autark",
    locale: "pt_BR",
    title: "Sistemas em operação · Autark",
    description: descricao,
    images: [{ url: "/og/sistemas.png", width: 1200, height: 630, alt: "Sistemas em operação da Autark" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/sistemas.png"] },
};

export default function SistemasPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Sistemas em operação · Autark",
      url: `${SITE_URL}/sistemas/`,
      inLanguage: "pt-BR",
      description: descricao,
      author: AUTHOR,
      publisher: PUBLISHER,
      hasPart: SYSTEMS.map((s) => ({ "@type": "CreativeWork", name: s.name, url: `${SITE_URL}/sistemas/${s.slug}/` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Manual de Operação", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Sistemas", item: `${SITE_URL}/sistemas/` },
      ],
    },
  ];
  return (
    <>
      <NotasHeader secao={{ label: "Sistemas", href: "/sistemas/" }} />
      <main id="conteudo" className="notas-pag">
        <Trilha itens={[{ label: "Manual", href: "/" }, { label: "Sistemas" }]} />
        <header className="notas-pag__cab">
          <p className="nota__kicker">
            <span className="nota__pilar">§4</span>
            <span>{SYSTEMS.length} sistemas, conferidos em setembro de 2026</span>
          </p>
          <h1 className="notas-pag__t">Sistemas em operação</h1>
          <p className="notas-pag__lede">{SYSTEMS_INTRO}</p>
        </header>
        <ol className="notas">
          {SYSTEMS.map((s) => (
            <li key={s.code} className="notas__item">
              <span className="notas__n">{s.code}</span>
              <div className="notas__corpo">
                <p className="notas__meta">
                  <span className={`status status--${s.status}`}>{STATUS_LABEL[s.status]}</span>
                  <span>{s.kind}</span>
                </p>
                <h2 className="notas__t">
                  <a href={`/sistemas/${s.slug}/`}>{s.name}</a>
                </h2>
                <p className="notas__lede">{frases(s.body)[0]}</p>
              </div>
              <Icon name="arrow-right" size={20} className="notas__seta" />
            </li>
          ))}
        </ol>
        <Chamada
          id="sistemas-cta-t"
          titulo="Quer ver um deles funcionando?"
          texto="Me chame no WhatsApp e eu abro o sistema na sua frente, com a mesma tela que o cliente usa."
          mensagem="Olá Alisson! Vi a lista de sistemas no site e quero ver um funcionando."
        />
      </main>
      <Colophon capa="/#capa" />
      <Enhance />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
