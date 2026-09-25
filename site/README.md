# Autark · Manual de Operação

Home da **Autark** (autarktech.com.br), o estúdio de automação com IA de Alisson Santos.
A página inteira é o manual do proprietário de um sistema que trabalha sozinho, com
especificação, montagem, ensaios e assistência técnica. A Fig. 1 é uma máquina 3D que
sai do desenho técnico e se monta, peça por peça, conforme a página rola.

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
ou use o botão "Ver a montagem animada" na Fig. 1. A escolha fica guardada no navegador, e
`/?movimento=0` desfaz.

## Estrutura

```
src/
  app/            layout (metadados, JSON-LD, fontes), página, CSS, robots, sitemap, 404
  content/site.ts TODO o texto do site, com os dados reais; nada ali pode ser inventado
  components/
    Stage.tsx         capa + §1 (montagem) com a Fig. 1
    StageDriver.tsx   liga o scroll dos passos ao progresso da montagem
    machine/          cena 3D (Three.js + React Three Fiber), camada fixa, carregamento adiado
    Sections.tsx      §2 a §10 e o colofão
    Sizing.tsx        §6, calculadora de economia
    Assistance.tsx    §11, ordem de serviço que abre o WhatsApp
    RunningHeader.tsx cabeçalho corrido com seção atual, página e índice
    Enhance.tsx       carimbos, opção de movimento e origem UTM nos links do WhatsApp
  lib/            preferência de movimento e origem UTM
scripts/
  prerender.mjs   gera as ilhas estáticas (roda sozinho antes de dev, build e typecheck)
  posters.mjs     larguras em WebP dos pôsteres da Fig. 1
  serve.mjs       servidor estático que imita o GitHub Pages
  e2e.mjs         testes de ponta a ponta
  fonts/          Hubot Sans, Mona Sans e Martian Mono recortadas (ver fonts.ts)
public/
  projetos/       prints reais dos sistemas (vieram do site anterior)
  marca/          logo, foto, ícones, imagem de compartilhamento (og-manual.png)
  figs/           pôsteres da Fig. 1 em vista explodida (gerados da própria cena 3D)
  sw.js           desinstalador do service worker da home anterior
  licencas/       licenças OFL das fontes
PRODUCT.md        verdade do produto (público, posicionamento, provas, restrições)
DESIGN.md         sistema visual: tokens, tipografia, componentes e regras
.impeccable/      contrato de direção da página e evidências da revisão
```

## Decisões que não podem se perder

- **LGPD coerente com o que se vende.** Nenhum request a terceiros. As fontes são
  self-hosted, não há analytics nem cookies, e o 3D é procedural, sem GLB e sem HDRI baixado
  de CDN. A CSP vai em `<meta>` no `layout.tsx` (o GitHub Pages não deixa configurar
  cabeçalhos) e não libera nenhuma origem externa.
- **Export estático.** `output: "export"` no `next.config.ts`: o build gera `out/` com HTML,
  CSS e JS prontos, sem servidor. Por isso não existe otimizador de imagem; as larguras dos
  pôsteres saem de `scripts/posters.mjs`, e as demais imagens já são WebP no tamanho certo.
- **O WhatsApp funciona sem JavaScript.** Todo CTA tem o `href` real. O JS só acrescenta a
  origem UTM (`utm_source/medium/campaign`) no fim da mensagem, e a calculadora e a ordem de
  serviço montam o texto.
- **3D sem pesar no primeiro carregamento.** O Three.js (~280 KB gz) só carrega na
  primeira interação (mouse, toque, roda, tecla) ou depois de 12 s. Até lá, e sem WebGL, a
  moldura mostra o pôster `public/figs/fig1-explodida*.png`. Com movimento reduzido, a
  máquina aparece montada e parada.
- **Cor do "papel".** O traço da Fig. 1 funciona porque as faces 3D pintam exatamente a cor
  do fundo da página. `--ground` em `globals.css` e `PAPER` em `machine/Machine.tsx` precisam
  ser o mesmo hex (`#15181b`).
- **Fontes recortadas.** `src/fonts/*.woff2` só têm o latim e a faixa de peso e largura usada
  (de ~230 KB para ~120 KB). Se um título precisar de peso abaixo de 600 na Hubot, regenere
  a fonte com `fontTools.varLib.instancer` a partir de `node_modules/@fontsource-variable`.
- **Ilhas estáticas.** As seções sem interação (§2–§5, §7–§10 e o colofão) são
  renderizadas para HTML puro antes do build por `scripts/prerender.mjs` (roda sozinho em
  `predev`, `prebuild` e `pretypecheck`) e entram na página por `dangerouslySetInnerHTML`.
  O React não hidrata esses nós. Edite `src/components/Sections.tsx` e `src/content/site.ts`
  normalmente: o arquivo gerado `src/generated/static-sections.ts` é refeito a cada comando.
  Não use hooks, estado ou eventos nessas seções; interação vive em componentes client
  como `Sizing` e `Assistance`.
- **Rolagem nativa.** Sem biblioteca de smooth scroll: a montagem da Fig. 1 já amortece o
  movimento, âncoras usam `scroll-behavior` e `scroll-padding-top` do CSS, e o sistema do
  visitante manda (movimento reduzido desliga o deslize).
- **Nada caro na hidratação.** A sonda de WebGL e a primeira medida do scroll ficam para
  depois do primeiro respiro do navegador. Esse adiamento levou o Lighthouse no
  celular de ~74 para 91 (mediana de 5 rodadas).
- **Sem `aggregateRating` no JSON-LD.** Nota da própria empresa sobre si viola a política de
  reviews do Google. As avaliações do 99freelas ficam visíveis na página.

## Qualidade medida (23/09/2026, build de produção)

| | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| Desktop (mediana de 3) | 100 | 100 | 100 | 100 |
| Celular, 4G lenta e CPU 4x (mediana de 5) | 91 | 100 | 100 | 100 |

- **Desktop:** LCP de 0,69 s, TBT de 0 ms, CLS de 0.
- **Celular:** o LCP simulado é de 3,3 s, mas o observado na mesma rodada é de 0,45 s. O
  teto vem do primeiro layout da página longa, que custa ~1,3 s de CPU no celular
  emulado. `content-visibility: auto` nas seções foi medido e descartado: não mexeu no LCP
  e trouxe um falso positivo de `target-size` na acessibilidade.
- **Pôsteres da Fig. 1:** cada um tem preload com `media` e `fetchpriority=high` só na
  faixa de tela em que é o primeiro visual. No celular, o pôster da bancada vem depois,
  sem pressa, e o desktop nem baixa o da capa do celular (um `<picture>` entrega um
  pixel vazio).
- **E2E:** 33/33 no domínio montado (`scripts/e2e.mjs --landings`). Cobre estrutura,
  JSON-LD, ilhas estáticas, calculadora, ordem de serviço, índice, montagem até OPERANDO,
  UTM, página sem JS, links da home anterior, 404, landings, 7 larguras sem rolagem
  horizontal e movimento reduzido.
- **Detector do impeccable:** 0 achados no código-fonte. Na página renderizada em 1440
  sobra um, sancionado: o título grande da capa, que é a folha de rosto do manual. Há
  também um aviso consultivo sobre as réguas de cota, que fazem parte do desenho técnico.

A CI guarda o `e2e.json` de cada publicação como artefato do workflow Publicar. As
medições locais (relatórios do Lighthouse, detector, capturas em 1440 e 390) vão para
`.impeccable/review/`, que fica fora do git porque se refaz a cada rodada.

## Regenerar os pôsteres da Fig. 1

Se a máquina 3D mudar, os pôsteres precisam ser refeitos para a moldura não mostrar uma
versão antiga antes do 3D carregar. Com o build servido em `localhost:3100`, capture a
camada `.fig-layer` com fundo transparente, recortada no retângulo de `.fig--main`
(1440×900) e de `.fig--inline` (390×844). Salve em `public/figs/fig1-explodida.png` e
`public/figs/fig1-explodida-mobile.png` e rode `node scripts/posters.mjs` para gerar as
larguras em WebP.

## Publicar

Este app é a home de um repositório maior. Push na `main` compila, monta o domínio com as
landings e publica no GitHub Pages depois dos testes. O passo a passo está no
[README da raiz](../README.md).
