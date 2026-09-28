import type { Metadata } from "next";
import { NotasHeader, ListaNotas } from "@/components/Notas";
import { Colophon } from "@/components/Sections";
import { Enhance } from "@/components/Enhance";
import { Icon } from "@/components/Icon";
import { notas } from "@/lib/notas";
import { SITE_URL } from "@/content/site";
import { AUTHOR, PUBLISHER } from "@/content/jsonld";

const descricao =
  "Notas de campo da Autark: problemas reais de atendimento, delivery e agenda no WhatsApp, e como sistemas com IA resolvem, com número conferido.";

export const metadata: Metadata = {
  title: "Notas de campo · Autark",
  description: descricao,
  alternates: { canonical: "/notas/", types: { "application/rss+xml": "/notas/feed.xml" } },
  openGraph: {
    type: "website",
    url: "/notas/",
    siteName: "Autark",
    locale: "pt_BR",
    title: "Notas de campo · Autark",
    description: descricao,
    images: [{ url: "/notas/og/indice.png", width: 1200, height: 630, alt: "Notas de campo da Autark" }],
  },
  twitter: { card: "summary_large_image", images: ["/notas/og/indice.png"] },
};

export default function NotasPage() {
  const lista = notas();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Notas de campo · Autark",
    url: `${SITE_URL}/notas/`,
    inLanguage: "pt-BR",
    description: descricao,
    author: AUTHOR,
    publisher: PUBLISHER,
    blogPost: lista.map((n) => ({
      "@type": "BlogPosting",
      headline: n.titulo,
      url: `${SITE_URL}/notas/${n.slug}/`,
      datePublished: n.data,
    })),
  };
  return (
    <>
      <NotasHeader />
      <main id="conteudo" className="notas-pag">
        <header className="notas-pag__cab">
          <p className="nota__kicker">
            <span className="nota__pilar">Anexo D</span>
            <span>{lista.length} notas publicadas</span>
          </p>
          <h1 className="notas-pag__t">Notas de campo</h1>
          <p className="notas-pag__lede">
            O que eu aprendo construindo sistemas que trabalham sozinhos: um problema real por nota, com o sistema que
            resolveu e o número conferido. As mesmas notas saem no Instagram{" "}
            <a href="https://www.instagram.com/autark.tech/" target="_blank" rel="noopener">
              @autark.tech
            </a>
            .
          </p>
          <a className="link-arrow" href="/notas/feed.xml">
            <Icon name="rss" size={16} /> Assinar pelo RSS
          </a>
        </header>
        <ListaNotas lista={lista} />
      </main>
      <Colophon capa="/#capa" />
      <Enhance />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
