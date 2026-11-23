import type { Metadata, Viewport } from "next";
import { alfa, archivo, elite } from "./fonts";
import { SITE_URL } from "@/content/site";
import "./globals.css";
import "./xilo.css";

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
    images: [{ url: "/marca/og-manual.png", width: 1200, height: 630, alt: "Folheto da Autark impresso em xilogravura: sistemas que trabalham sozinhos enquanto você cresce." }],
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
  themeColor: "#f2c12e",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${alfa.variable} ${archivo.variable} ${elite.variable}`}>
      <head>{process.env.NODE_ENV === "production" ? <meta httpEquiv="Content-Security-Policy" content={csp} /> : null}</head>
      <body>
        {/* Borda roída da goiva nos títulos grandes (filter: url(#entalhe) em xilo.css). */}
        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
          <filter id="entalhe" x="-2%" y="-4%" width="104%" height="108%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" />
            <feDisplacementMap in="SourceGraphic" scale="2.6" />
          </filter>
        </svg>
        <a className="skip" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
