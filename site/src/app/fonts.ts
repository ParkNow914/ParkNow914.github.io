import localFont from "next/font/local";

// Três fontes self-hosted (SIL OFL 1.1, licenças em /licencas). Carregar do
// Google Fonts mandaria o IP do visitante para terceiros sem consentimento.
//
// Os arquivos em src/fonts são recortes dos originais do @fontsource-variable:
// só o latim e só a faixa de peso e largura que o site usa (fontTools
// instancer + subset). De ~230 KB para ~120 KB. Para regenerar, rode o
// instancer nos .woff2 do node_modules com as faixas abaixo.

export const hubot = localFont({
  src: "../fonts/hubot.woff2",
  weight: "600 900",
  style: "normal",
  display: "swap",
  variable: "--font-hubot",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
  preload: true,
});

export const mona = localFont({
  src: "../fonts/mona.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-mona",
  preload: true,
});

export const martian = localFont({
  src: "../fonts/martian.woff2",
  weight: "400 600",
  style: "normal",
  display: "swap",
  variable: "--font-martian",
  declarations: [{ prop: "font-stretch", value: "87.5% 100%" }],
  preload: false,
});
