import localFont from "next/font/local";

// Três fontes self-hosted (SIL OFL 1.1, licenças em /licencas). Carregar do
// Google Fonts mandaria o IP do visitante para terceiros sem consentimento.
//
// Os arquivos em src/fonts saem do @fontsource (recorte latim):
//   alfa.woff2     Alfa Slab One: letra de madeira de cartaz, só nos títulos
//   archivo.woff2  Archivo variável (400 a 800): todo o texto corrido
//   elite.woff2    Special Elite: carimbo e numeração de folheto, nada mais

export const alfa = localFont({
  src: "../fonts/alfa.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-display",
  preload: true,
});

export const archivo = localFont({
  src: "../fonts/archivo.woff2",
  weight: "400 800",
  style: "normal",
  display: "swap",
  variable: "--font-text",
  preload: true,
});

export const elite = localFont({
  src: "../fonts/elite.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-stamp",
  preload: false,
});
