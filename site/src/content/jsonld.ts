// Dados estruturados da marca (JSON-LD). Moram aqui, e não no layout, porque a
// FAQ só vale para a home: as notas de campo têm o próprio Article.
import { SITE_URL, EMAIL, GITHUB, FREELAS, INSTAGRAM, LINKEDIN, WHATSAPP, TROUBLESHOOTING, WARRANTY, VALE } from "./site";

/** Vale do Paraíba com visita, Brasil a distância. Usado na home e na página do Vale. */
export const AREA_ATENDIDA = [
  ...VALE.cidades.map((name) => ({
    "@type": "City",
    name,
    containedInPlace: { "@type": "State", name: "São Paulo" },
  })),
  { "@type": "Country", name: "Brasil" },
];

// Sem aggregateRating: nota da própria empresa sobre si mesma viola a política
// de reviews do Google. As avaliações seguem visíveis na página.
export const jsonLdHome = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alisson Santos",
    url: SITE_URL,
    jobTitle: "Desenvolvedor full-stack, automação e IA",
    email: `mailto:${EMAIL}`,
    sameAs: [GITHUB, FREELAS, INSTAGRAM, LINKEDIN],
    worksFor: { "@type": "Organization", name: "Autark", url: SITE_URL },
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Autark",
    url: SITE_URL,
    description:
      "Estúdio de automação com IA: atendimento de WhatsApp com IA, SaaS full-stack, landing pages e integrações. Por Alisson Santos.",
    image: `${SITE_URL}/marca/og-manual.png`,
    telephone: `+${WHATSAPP}`,
    email: EMAIL,
    address: { "@type": "PostalAddress", addressLocality: "Lorena", addressRegion: "SP", addressCountry: "BR" },
    areaServed: AREA_ATENDIDA,
    founder: { "@type": "Person", name: "Alisson Santos" },
    sameAs: [INSTAGRAM, GITHUB, FREELAS],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: "Autark",
    inLanguage: "pt-BR",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ...TROUBLESHOOTING.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
      {
        "@type": "Question",
        name: "E se eu não gostar do resultado?",
        acceptedAnswer: { "@type": "Answer", text: WARRANTY[0].body },
      },
    ],
  },
];

/** Quem publica as notas: a mesma Autark do JSON-LD da home. */
export const PUBLISHER = {
  "@type": "Organization",
  name: "Autark",
  url: SITE_URL,
  logo: `${SITE_URL}/marca/icon-512.png`,
  sameAs: [INSTAGRAM, GITHUB, FREELAS],
};

export const AUTHOR = {
  "@type": "Person",
  name: "Alisson Santos",
  url: SITE_URL,
  jobTitle: "Desenvolvedor full-stack, automação e IA",
  sameAs: [GITHUB, FREELAS, INSTAGRAM, LINKEDIN],
};
