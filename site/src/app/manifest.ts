import type { MetadataRoute } from "next";
import { COVER } from "@/content/site";

// Manifesto de aplicativo: a prancha pode ser instalada na tela do celular, com o
// papel vegetal como cor da barra e o "A" papel sobre grafite como ícone
// (scripts/icones.mjs). Sem service worker de propósito: /sw.js é o interruptor
// que desliga o service worker do site antigo.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Autark · Sistemas que trabalham sozinhos",
    short_name: "Autark",
    description: COVER.title,
    lang: "pt-BR",
    start_url: "/?utm_source=app&utm_medium=atalho",
    scope: "/",
    display: "standalone",
    background_color: "#edf0ef",
    theme_color: "#edf0ef",
    icons: [
      { src: "/marca/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/marca/icon-512.png", sizes: "512x512", type: "image/png" },
      // Maskable com folga própria: o Android recorta até 20% de cada lado.
      { src: "/marca/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
