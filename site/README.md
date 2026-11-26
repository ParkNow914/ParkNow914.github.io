# Autark · Prancha Técnica

Home da **Autark** (autarktech.com.br), o estúdio de automação com IA de Alisson Santos.
A página inteira é um jogo de pranchas de projeto executivo: cada seção é uma folha de
papel vegetal com moldura, régua e legenda, assinada pelo responsável técnico. A Fig. 1
é um desenho isométrico em traço que vira 3D e se monta, peça por peça, conforme a
página rola.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # export estático em out/
npm run start      # serve out/ em http://localhost:3100, como o GitHub Pages
npm run typecheck
node scripts/e2e.mjs http://localhost:3100/   # testes de ponta a ponta contra o build
```

Para ver a montagem animada num sistema com "reduzir movimento" ligado, abra `/?movimento=1`
ou use o botão da Fig. 1. A escolha fica guardada no navegador, e `/?movimento=0` desfaz.

## Estrutura

```
src/
  app/              layout (metadados, ícones, JSON-LD, fontes), página, CSS, robots, sitemap, 404
    globals.css     base estrutural (grade, seções, componentes)
    prancha.css     a camada visual da prancha: papel, traço, moldura, régua, legenda
  content/site.ts   TODO o texto do site, com os dados reais; nada ali pode ser inventado
  content/jsonld.ts dados estruturados da marca (home) e de quem publica as notas
  lib/              notas, preferência de movimento, origem UTM e o que cada sistema junta (sistemas.ts)
  components/
    Stage.tsx         capa + §1 (montagem) com a Fig. 1 e o quadro de legenda
    StageDriver.tsx   liga o scroll dos passos ao progresso da montagem
    machine/          cena 3D: Montagem.tsx (Three.js), modelo.json, carregamento adiado
    Manual.tsx        régua, legenda (Folio) e cabeçalho de seção de cada prancha
    Simbolo.tsx       os 10 símbolos geométricos dos sistemas (SYS-01 a SYS-10)
    Sections.tsx      §2 a §10 e o colofão
    Sizing.tsx        calculadora de economia
    Assistance.tsx    ordem de serviço que abre o WhatsApp
    RunningHeader.tsx cabeçalho corrido com seção atual e índice
    Enhance.tsx       entradas, opção de movimento e origem UTM nos links do WhatsApp
    Notas.tsx         notas de campo: cabeçalho, artigo, lista e o anexo da home
    Paginas.tsx       trilha, bloco e fecho das páginas avulsas (sistemas, Vale, privacidade)
    Compartilhar.tsx  compartilhar nativo do celular, copiar link, mandar pelo WhatsApp
  fonts/            Geologica e Sofia Sans Condensed, recorte latim (ver fonts.ts)
scripts/
  prerender.mjs     gera as ilhas estáticas (roda sozinho antes de dev, build e typecheck)
  cerebro-poster.mjs pôster SVG da Fig. 1 e poster-bounds.json, tirados do mesmo modelo do 3D
  icones.mjs        favicon, ícones do app, apple-touch-icon e a marca solta
  og-molde.mjs      molde das imagens de compartilhamento 1200x630
  og-notas.mjs      imagem de cada nota (npm run og:notas)
  og-paginas.mjs    imagens dos sistemas, das páginas avulsas e das landings (npm run og:paginas)
  serve.mjs         servidor estático que imita o GitHub Pages
  e2e.mjs           testes de ponta a ponta
public/
  projetos/         prints reais dos sistemas, cada um com uma cópia de 640 px (-640.webp)
  marca/            logo, foto, ícones, imagem de compartilhamento (og-prancha.png)
  figs/             pôster da Fig. 1 em vista explodida
  .well-known/      security.txt
  sw.js             desinstalador do service worker da home anterior
  licencas/         licenças OFL das fontes
PRODUCT.md          verdade do produto (público, posicionamento, provas, restrições)
DESIGN.md           sistema visual: tokens, tipografia, componentes e regras
.impeccable/        contrato de direção da página e tokens (design.json)
```

## Decisões que não podem se perder

- **LGPD coerente com o que se vende.** Nenhum request a terceiros. As fontes são
  self-hosted, não há analytics nem cookies, e o 3D é procedural, sem GLB e sem HDRI baixado
  de CDN. A CSP vai em `<meta>` no `layout.tsx` (o GitHub Pages não deixa configurar
  cabeçalhos) e não libera nenhuma origem externa.
- **Export estático.** `output: "export"` no `next.config.ts`: o build gera `out/` com HTML,
  CSS e JS prontos, sem servidor. Por isso não existe otimizador de imagem. Cada print de
  sistema tem uma cópia de 640 px, e o `srcset` (função `telaSrcset` em `site.ts`) deixa o
  navegador escolher.
- **O WhatsApp funciona sem JavaScript.** Todo CTA tem o `href` real. O JS só acrescenta a
  origem UTM (`utm_source/medium/campaign`) no fim da mensagem, e a calculadora e a ordem de
  serviço montam o texto.
- **3D sem pesar no primeiro carregamento.** O Three.js só carrega na primeira interação
  (mouse, toque, roda, tecla) ou depois de 12 s (`MachineMount.tsx`). Até lá, e sem WebGL, a
  moldura mostra o pôster `public/figs/cerebro-explodido.svg`. Com movimento reduzido, a
  máquina aparece montada e parada.
- **Pôster e 3D batem.** A câmera é ortográfica e isométrica (1 unidade = 1 px), e o pôster
  sai de `scripts/cerebro-poster.mjs` com a mesma conta de três tons das faces e os mesmos
  limites (`poster-bounds.json`). Mudou o `modelo.json`, rode o script de novo para a troca
  do pôster pelo 3D não pular.
- **Uma tinta só.** O verde `#0d7050` aparece só no que opera (botão, status em produção,
  peça da vez). O resto é grafite `#1b1f22` sobre papel `#edf0ef`. Fundo cinza não existe:
  separação é traço de 1,5 px ou hachura. As regras completas estão em `DESIGN.md`.
- **Ícones de um script só.** `node scripts/icones.mjs` regrava `public/icon.svg`,
  `public/favicon.ico`, os PNGs de `public/marca/` e os ícones da raiz `../assets/`, que as
  landings usam. Os PNGs saem em RGBA porque o Next recusa `.ico` com PNG RGB dentro. Os
  dois favicons entram no `<head>` pelo `icons` do `layout.tsx`.
- **Ilhas estáticas.** As seções sem interação são renderizadas para HTML puro antes do
  build por `scripts/prerender.mjs` (roda sozinho em `predev`, `prebuild` e
  `pretypecheck`) e entram na página por `dangerouslySetInnerHTML`. O React não hidrata
  esses nós. Edite `src/components/Sections.tsx` e `src/content/site.ts` normalmente: o
  arquivo gerado em `src/generated/` é refeito a cada comando. Não use hooks, estado ou
  eventos nessas seções; interação vive em componentes client como `Sizing` e `Assistance`.
- **Rolagem nativa.** Sem biblioteca de smooth scroll: a montagem da Fig. 1 já amortece o
  movimento, âncoras usam `scroll-behavior` e `scroll-padding-top` do CSS, e o sistema do
  visitante manda (movimento reduzido desliga o deslize).
- **Sem `aggregateRating` no JSON-LD.** Nota da própria empresa sobre si viola a política de
  reviews do Google. As avaliações do 99freelas ficam visíveis na página.

## Qualidade medida (26/11/2026, CI no build de produção)

| | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 |
| Celular, 4G lenta e CPU 4x: home | 95 | 100 | 100 | 100 |
| Celular: notas, sistemas, Vale | 97 | 100 | 100 | 100 |

- **Celular:** o LCP simulado da home é 2,8 s, mas o medido num navegador de verdade é de
  0,4 a 0,8 s. A simulação soma ao caminho crítico as duas fontes com preload e o
  JavaScript do framework, em 4G lenta.
- **E2E:** 61 checagens no domínio montado (`scripts/e2e.mjs --landings`). Cobre estrutura,
  JSON-LD, favicons, ilhas estáticas, calculadora, ordem de serviço, índice, montagem até
  OPERANDO, UTM, página sem JS, links da home anterior, 404, landings, `security.txt`,
  notas, páginas de sistema, Vale do Paraíba, privacidade, 7 larguras sem rolagem
  horizontal e movimento reduzido.

A CI guarda o `e2e.json` de cada publicação como artefato do workflow Publicar. As
medições locais (relatórios, capturas em 1440 e 390) vão para `.impeccable/review/`, que
fica fora do git porque se refaz a cada rodada.

## Publicar

Este app é a home de um repositório maior. Push na `main` compila, monta o domínio com as
landings e publica no GitHub Pages depois dos testes. O passo a passo está no
[README da raiz](../README.md).
