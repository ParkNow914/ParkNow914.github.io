import type { MetadataRoute } from "next";
import { COVER } from "@/content/site";

// Manifesto de aplicativo: o folheto pode ser instalado na tela do celular, com o
// papel amarelo como cor da barra. Sem service worker de propósito: /sw.js é o
// interruptor que desliga o service worker do site antigo.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Autark · Folheto da Oficina",
    short_name: "Autark",
    description: COVER.title,
    lang: "pt-BR",
    start_url: "/?utm_source=app&utm_medium=atalho",
    scope: "/",
    display: "standalone",
    background_color: "#f2c12e",
    theme_color: "#f2c12e",
    icons: [
      { src: "/marca/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/marca/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/marca/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
