import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NotasHeader, NotaArtigo } from "@/components/Notas";
import { Compartilhar } from "@/components/Compartilhar";
import { Colophon } from "@/components/Sections";
import { Enhance } from "@/components/Enhance";
import { nota, notas, textoPuro } from "@/lib/notas";
import { SITE_URL } from "@/content/site";
import { AUTHOR, PUBLISHER } from "@/content/jsonld";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return notas().map((n) => ({ slug: n.slug }));
}

export const dynamicParams = false;

function resumo(slug: string) {
  const n = nota(slug);
  if (!n) return "";
  const base = textoPuro([n.lede, n.legenda[0]].filter(Boolean).join(" "));
  return base.length > 158 ? `${base.slice(0, 155).replace(/\s+\S*$/, "")}…` : base;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = nota(slug);
  if (!n) return {};
  const url = `/notas/${n.slug}/`;
  const img = `/notas/og/${n.slug}.png`;
  return {
    title: `${n.titulo} · Notas de campo · Autark`,
    description: resumo(slug),
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: "Autark",
      locale: "pt_BR",
      title: n.titulo,
      description: resumo(slug),
      publishedTime: n.data,
      authors: ["Alisson Santos"],
      images: [{ url: img, width: 1200, height: 630, alt: n.titulo }],
    },
    twitter: { card: "summary_large_image", images: [img] },
  };
}

export default async function NotaPage({ params }: Props) {
  const { slug } = await params;
  const lista = notas();
  const i = lista.findIndex((n) => n.slug === slug);
  const n = lista[i];
  if (!n) notFound();
  const url = `${SITE_URL}/notas/${n.slug}/`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: n.titulo,
      description: resumo(slug),
      datePublished: n.data,
      dateModified: n.data,
      inLanguage: "pt-BR",
      mainEntityOfPage: url,
      url,
      image: `${SITE_URL}/notas/og/${n.slug}.png`,
      wordCount: n.palavras,
      author: AUTHOR,
      publisher: PUBLISHER,
      isPartOf: { "@type": "Blog", name: "Notas de campo · Autark", url: `${SITE_URL}/notas/` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Manual de Operação", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Notas de campo", item: `${SITE_URL}/notas/` },
        { "@type": "ListItem", position: 3, name: n.titulo, item: url },
      ],
    },
  ];
  return (
    <>
      <NotasHeader />
      <main id="conteudo" className="nota-pag">
        <NotaArtigo nota={n} anterior={lista[i + 1]} proxima={lista[i - 1]} />
        <div className="nota-pag__partilha">
          <p>Conhece alguém que perde tempo com isso?</p>
          <Compartilhar titulo={n.titulo} url={url} />
        </div>
      </main>
      <Colophon capa="/#capa" />
      <Enhance />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
