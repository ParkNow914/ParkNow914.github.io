import type { NextConfig } from "next";

// O site é publicado como arquivos estáticos no GitHub Pages (ver README), que
// não deixa configurar cabeçalhos HTTP. Por isso a CSP e a política de
// referrer vão em <meta> no layout, e o otimizador de imagem do Next fica
// desligado: as larguras em WebP dos pôsteres saem de scripts/posters.mjs.
const config: NextConfig = {
  output: "export",
  // /notas/ e /notas/<nota>/ viram pasta com index.html: é o formato que o
  // GitHub Pages serve com e sem a barra no fim.
  trailingSlash: true,
  reactStrictMode: true,
  turbopack: { root: process.cwd() },
  images: { unoptimized: true },
};

export default config;
