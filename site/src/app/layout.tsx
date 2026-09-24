import type { Metadata, Viewport } from "next";
import { hubot, mona, martian } from "./fonts";
import { SITE_URL, EMAIL, GITHUB, FREELAS, WHATSAPP, TROUBLESHOOTING, WARRANTY } from "@/content/site";
import "./globals.css";

const title = "Autark · Sistemas que trabalham sozinhos enquanto você cresce";
const description =
  "A Autark instala atendimento de WhatsApp com IA, SaaS completos e integrações que tiram o trabalho manual do seu negócio. Sistemas reais em produção, testados antes de ir ao ar. Por Alisson Santos.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  applicationName: "Autark",
  authors: [{ name: "Alisson Santos", url: SITE_URL }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Autark",
    locale: "pt_BR",
    title: "Autark · Sistemas que trabalham sozinhos enquanto você cresce",
    description:
      "Atendimento de WhatsApp com IA, SaaS completos e sistemas em produção real. Nota 5.0, com 100% de recomendação. Por Alisson Santos.",
    images: [{ url: "/marca/og-manual.png", width: 1200, height: 630, alt: "Capa do Manual de Operação da Autark: sistemas que trabalham sozinhos enquanto você cresce, com a Fig. 1 em vista explodida." }],
  },
  twitter: { card: "summary_large_image", images: ["/marca/og-manual.png"] },
  icons: { apple: "/marca/apple-touch-icon.png" },
  referrer: "strict-origin-when-cross-origin",
};

// A CSP vai em <meta> porque o GitHub Pages não deixa configurar cabeçalhos.
// Só em produção: o dev server do Next precisa de eval para o React Refresh.
// Nenhuma origem de terceiros aparece aqui de propósito: o site vende LGPD, então
// fonte, imagem e 3D saem todos do próprio domínio. `frame-ancestors` fica de
// fora porque o navegador ignora essa diretiva quando ela vem por <meta>.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "form-action 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const viewport: Viewport = {
  themeColor: "#15181b",
  colorScheme: "dark",
};

// Sem aggregateRating: nota da própria empresa sobre si mesma viola a política
// de reviews do Google. As avaliações seguem visíveis na página.
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alisson Santos",
    url: SITE_URL,
    jobTitle: "Desenvolvedor full-stack, automação e IA",
    email: `mailto:${EMAIL}`,
    sameAs: [GITHUB, FREELAS],
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
    areaServed: { "@type": "Country", name: "Brasil" },
    founder: { "@type": "Person", name: "Alisson Santos" },
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${hubot.variable} ${mona.variable} ${martian.variable}`}>
      <head>{process.env.NODE_ENV === "production" ? <meta httpEquiv="Content-Security-Policy" content={csp} /> : null}</head>
      <body>
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
