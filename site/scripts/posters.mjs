// Gera as larguras em WebP dos pôsteres da Fig. 1 a partir dos PNG capturados
// da própria cena (ver README, "Regenerar os pôsteres"). O site é servido como
// arquivos estáticos, sem otimizador de imagem, então as variações saem daqui.
//   node scripts/posters.mjs
import sharp from "sharp";

const POSTERS = [
  { src: "public/figs/fig1-explodida.png", widths: [662, 993, 1324] },
  { src: "public/figs/fig1-explodida-mobile.png", widths: [358, 537, 716] },
];

for (const { src, widths } of POSTERS) {
  for (const w of widths) {
    const out = src.replace(/\.png$/, `-${w}.webp`);
    const info = await sharp(src).resize({ width: w }).webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(out);
    console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
  }
}
