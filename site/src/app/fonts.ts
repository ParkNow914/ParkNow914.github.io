import localFont from "next/font/local";

// Duas fontes self-hosted (SIL OFL 1.1, licenças em /licencas). Carregar do
// Google Fonts mandaria o IP do visitante para terceiros sem consentimento.
//
// Os arquivos em src/fonts saem do @fontsource (recorte latim, que cobre o
// português inteiro):
//   geologica.woff2        Geologica variável (100 a 900): títulos e texto corrido
//   sofia-condensed.woff2  Sofia Sans Condensed variável: a letra técnica da
//                          prancha (cotas, legendas, balões, quadros e rótulos)

export const geologica = localFont({
  src: "../fonts/geologica.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-text",
  preload: true,
});

export const sofia = localFont({
  src: "../fonts/sofia-condensed.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-label",
  preload: true,
});
