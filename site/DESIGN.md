---
name: Autark · Oficina de Xilogravura
description: O site da Autark impresso como folheto de cordel, com tinta preta de rolo sobre papéis de capa saturados, letra de madeira entalhada e carimbo só para status.
colors:
  papel-amarelo: "#f2c12e"
  papel-rosa: "#f2789f"
  papel-azul: "#93c6e4"
  papel-verde: "#86c681"
  papel-laranja: "#f2914a"
  papel-jornal: "#dadad3"
  ink: "#17130f"
  ink-2: "#241c16"
  ink-3: "#33291f"
  ink-hover: "#3d3027"
  amarelo-hover: "#f6d059"
  stamp: "#c8261d"
  stamp-ink: "#6b130c"
  run: "#1d6b3f"
typography:
  display:
    fontFamily: "Alfa Slab One, Rockwell Extra Bold, Rockwell, serif"
    fontSize: "clamp(2.35rem, 1.1rem + 3.9vw, 5.1rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "0"
  headline:
    fontFamily: "Alfa Slab One, Rockwell Extra Bold, Rockwell, serif"
    fontSize: "clamp(2rem, 1.25rem + 2.6vw, 3.9rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0"
  title:
    fontFamily: "Alfa Slab One, Rockwell Extra Bold, Rockwell, serif"
    fontSize: "clamp(1.35rem, 1.1rem + 0.9vw, 1.85rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0"
  body:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Archivo, Segoe UI, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "0.005em"
  stamp:
    fontFamily: "Special Elite, Courier New, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  none: "0px"
  stamp: "2px"
spacing:
  gutter: "clamp(16px, 3.4vw, 44px)"
  sheet-pad: "clamp(18px, 2.4vw, 32px)"
  section-end: "clamp(56px, 7vw, 104px)"
  stage-top: "clamp(96px, 11vw, 176px)"
  maxw: "1440px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.papel-amarelo}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  button-ink-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.papel-amarelo}"
  button-ink-active:
    backgroundColor: "{colors.papel-amarelo}"
    textColor: "{colors.ink}"
  button-tarja:
    backgroundColor: "{colors.papel-amarelo}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  button-tarja-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.papel-amarelo}"
  tarja:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.papel-amarelo}"
  ficha-capa:
    backgroundColor: "{colors.papel-amarelo}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.sheet-pad}"
  carimbo:
    textColor: "{colors.stamp-ink}"
    typography: "{typography.stamp}"
    rounded: "{rounded.stamp}"
  ordem-de-servico:
    backgroundColor: "{colors.papel-amarelo}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
---

# Design System: Autark · Oficina de Xilogravura

## Overview

**Creative North Star: "A Oficina de Xilogravura"**

A Autark é apresentada como uma oficina onde cada sistema é entalhado à mão numa matriz de madeira e sai impresso como capa de cordel. "Construído à mão, sem template" deixa de ser frase e vira material: tinta preta de rolo, papel de capa colorido, letra de madeira com a borda roída da goiva, carimbo de borracha batido por cima. O mundo foi escolhido para recusar duas coisas ao mesmo tempo: a landing escura de SaaS com 3D brilhante e o manual técnico grafite e laranja que este redesign substituiu.

O papel de cordel resolve o problema do público. Quem chega é dono de salão, barbearia, clínica ou delivery, frio, no celular de 360px vindo do Instagram, muitas vezes à noite. Um folheto popular brasileiro é um objeto que essa pessoa já conhece e confia, lê de longe e não confunde com startup. As cores saturadas de capa dão contraste de sobra para a tinta preta (de 7:1 a 13,2:1) e trocam de seção para seção como as capas trocam de folheto, então a rolagem vira um maço de folhetos sendo folheado.

A densidade é de impresso: blocos de texto curtos, títulos grandes, linhas de tinta grossas (2 a 4px) separando dados, nenhum canto arredondado, nenhum brilho. A profundidade vem só de sobreposição: uma folha de papel sobre outra de outra cor, como duas matrizes impressas em registro.

**Key Characteristics:**
- Tinta preta quente (`ink`) sobre um papel de capa saturado por seção; nada de creme, branco ou cinza neutro.
- Letra de madeira (Alfa Slab One) nos títulos, com filtro de entalhe e máscara de falha de tinta.
- Vermelho de carimbo só em moldura; quando o carimbo vira texto, a tinta é o vermelho-sangue `stamp-ink`.
- Cantos retos, linhas de tinta cheias, nenhuma sombra: o que se destaca ganha uma segunda folha de outro papel atrás, em registro.
- Uma coreografia só: a impressão da matriz, com scrub. O resto assenta com ease-out forte.

## Colors

Uma tinta, seis papéis e dois sinais: a paleta é a de uma gráfica de cordel, e cada cor tem um ofício.

### Primary
- **Tinta de Rolo** (`ink`): preto quente, levemente marrom, como tinta tipográfica à base de óleo. É a cor de todo texto, de toda linha, do botão principal, do cabeçalho em faixa e do colofão. Nunca é #000: o marrom mantém a tinta no mesmo mundo do papel.
- **Tinta Gasta** (`ink-2`) e **Tinta Rala** (`ink-3`): a mesma tinta com menos carga. `ink-2` nos ledes e textos de apoio; `ink-3` em metadados, rótulos de ficha e colunas secundárias. `ink-3` ainda dá 5,4:1 no rosa, o papel mais escuro.
- **Tinta Pisada** (`ink-hover`): hover do bloco de tinta, um passo mais claro, como tinta que ainda não secou.

### Secondary
- **Vermelho de Carimbo** (`stamp`): exclusivo de moldura. Borda dupla do carimbo ENCERRADO, moldura dupla dos selos das landings, cursor de texto (`caret-color`) e o carimbo OPERANDO desenhado na folha 3D. Sobre os papéis ele dá 3,3:1 no amarelo, 3,05:1 no azul e 2,1:1 no rosa: não passa nos 4,5:1 de texto pequeno em nenhum papel, por isso não escreve texto.
- **Vermelho-Sangue** (`stamp-ink`): a tinta do carimbo quando ela precisa ser lida. Numeração de passos e cláusulas, código das fichas, endereço de seção (§3, §11), número das figuras, texto dos carimbos. Passa de 4,5:1 em todos os papéis (o rosa é o pior, 4,6:1; no amarelo, 7,2:1).

### Tertiary
- **Verde de Operação** (`run`): sinal gráfico de "está rodando". Losango indicador e barra do medidor da matriz em funcionamento, moldura dos carimbos de produção e OK. Como gráfico passa de 3:1 no amarelo, azul e jornal; como texto pequeno não passa em nenhum papel (3,9:1 no amarelo, 2,5:1 no rosa), então segue a mesma regra do vermelho: moldura, não letra.

### Neutral
- **Amarelo-Gema** (`papel-amarelo`): o papel padrão. Capa (§1), fabricante, leitura do dimensionamento, ordem de serviço, texto sobre tinta no cabeçalho e no colofão, `theme-color` do navegador.
- **Rosa-Chiclete** (`papel-rosa`): aplicações e garantia; endereço de seção sobre a matriz entintada.
- **Azul-Anil Claro** (`papel-azul`): sistemas e problemas.
- **Verde-Folha** (`papel-verde`): instalação e as notas na home.
- **Laranja-Urucum** (`papel-laranja`): dimensionamento.
- **Papel-Jornal** (`papel-jornal`): cinza-papel levemente esverdeado, sem nenhum creme (a tinta dá 13,2:1; `stamp-ink`, 8,7:1). Leitura longa. Modelos, relatório de campo, índice e todas as páginas de leitura (notas, nota, sistemas, privacidade, 404).
- **Amarelo Aceso** (`amarelo-hover`): hover dos botões amarelos sobre tinta (cabeçalho e §11).
- Linhas e superfícies derivadas são misturas da tinta no papel corrente, nunca cinzas: `rule` = papel + 34% de tinta, `ground-raised` = papel + 8%, `ground-sunk` = papel + 14% (via `color-mix` em oklab).

### Named Rules
**The Um Papel por Seção Rule.** Cada seção define `--ground` com um papel de capa, e tudo que é "fundo" dentro dela herda esse papel. A sequência da home é amarelo, rosa, jornal, azul, verde, laranja, jornal, amarelo, azul, rosa, tinta (§11), tinta (colofão). Seção nova escolhe um papel que não repete o vizinho.

**The Carimbo na Moldura Rule.** `stamp` e `run` desenham moldura e sinal, nunca letra. Texto vermelho é sempre `stamp-ink`; texto de carimbo verde é `ink`. Teste: se o vermelho vivo ou o verde formam letras pequenas, está errado.

**The Tinta Nunca Preta Rule.** Nenhum #000, #fff ou cinza puro. A tinta é `ink`; o "branco" é o papel da seção.

## Typography

**Display Font:** Alfa Slab One (com Rockwell Extra Bold, Rockwell, serif)
**Body Font:** Archivo variável, 400 a 800 (com Segoe UI, system-ui)
**Label/Mono Font:** Special Elite (com Courier New)

**Character:** Letra de madeira de cartaz, pesada e de serifa quadrada, contra um grotesco de trabalho que aguenta parágrafo no celular; a máquina de escrever gasta entra só onde haveria carimbo ou numeração de folheto. As três são self-hosted (SIL OFL), sem Google Fonts, porque o site vende LGPD e não manda o IP do visitante a terceiros.

### Hierarchy
- **Display** (400, `clamp(2.35rem, 1.1rem + 3.9vw, 5.1rem)`, 0.98): só o título da capa, no máximo 13ch, `text-wrap: balance`, com entalhe e falha de tinta.
- **Headline** (400, `clamp(2rem, 1.25rem + 2.6vw, 3.9rem)`, 1): títulos de seção, máximo 18ch, também entalhados.
- **Title** (400, `clamp(1.35rem, 1.1rem + 0.9vw, 1.85rem)`): títulos de passo, cláusula, problema, bloco; nome das fichas sobe para `clamp(1.9rem, 1.3rem + 1.8vw, 3rem)`. Números de leitura (medidor, contadores, valores da ficha) também saem em letra de madeira.
- **Body** (400, 1.0625rem, 1.62): texto corrido em `ink`; ledes em `ink-2`, máximo 31em na capa. Perguntas do relatório de campo sobem para 560 a 650.
- **Label** (750, 1rem, 0.005em): botões e cabeçalhos de tabela, em Archivo. Rótulos de ficha usam 700 com 0.04em.
- **Stamp** (400, 0.86 a 0.95rem, 0.02 a 0.06em; caixa alta só no carimbo): carimbos de status, números de passo e cláusula, código de ficha, folio, cabeçalho da ficha do folheto, endereço de seção (este maior, `clamp(1.05rem, 0.85rem + 0.6vw, 1.45rem)`, girado -4°).

### Named Rules
**The Madeira Sem Peso Rule.** Alfa Slab One existe num peso só (400) e com `letter-spacing: 0`. Nunca sintetize negrito (`font-synthesis: none`) nem aperte o espaçamento: a letra de madeira já é o peso máximo.

**The Entalhe Só no Grande Rule.** O filtro SVG `#entalhe` (turbulência 0.045, deslocamento 2.6) e a máscara `--falha` vão só nos títulos grandes (capa, seção, notas, 404). Em texto pequeno o deslocamento destrói a leitura. A falha de rolo tem grão direcional (turbulência `.9 .035`, o rastro horizontal do rolo) e `mask-size` medido em `em`, para que o grão acompanhe o corpo da letra em vez de ter o mesmo tamanho num título de 80px e num carimbo de 14px.

**The Elite Só Carimba Rule.** Special Elite é carimbo e numeração de folheto, nada mais. Nunca parágrafo, nunca botão, nunca título.

## Layout

Grade de 12 colunas com `--gutter` fluido (`clamp(16px, 3.4vw, 44px)`) e largura máxima de 1440px. Na capa (1440x900), colunas 1 a 6 levam título, lede, botão e links; colunas 7 a 12 levam a matriz 3D. A ficha do folheto corre como faixa horizontal na base da primeira dobra, atravessando a grade. A capa abre com `clamp(96px, 11vw, 176px)` de respiro no topo; toda seção fecha com `clamp(56px, 7vw, 104px)`.

O papel de cada seção vai de ponta a ponta sem criar rolagem lateral (`border-image` com `conic-gradient` do `--ground` e extensão de 100vw), e o encontro de duas seções é uma borda serrilhada de 18px: semicírculos de 9px recortados no papel de cima, o corte do papel de capa. Abaixo de 1180px a capa reequilibra; abaixo de 960px tudo empilha em uma coluna e a matriz da capa fica direto no papel, sem moldura nem grade; abaixo de 600px tabelas e listas compactam suas colunas.

Landings (`lp/lp.css`) usam coluna única de 980px com 20px de margem, um papel por página (`data-papel` no `<body>`), seções separadas por linha de tinta de 4px. As vantagens de cada landing são uma folha de papel-jornal única, dividida por réguas de tinta de 3px, sem números nem cartões soltos; o público da landing vai como carimbo no cabeçalho, não acima do título.

## Elevation & Depth

O sistema é chapado e não tem sombra. Nenhum `box-shadow` ou `drop-shadow` de tinta, nenhum desfoque, brilho ou gradiente de luz. A profundidade vem do recorte em camadas em que cada cor é uma matriz separada: o elemento destacado ganha atrás de si uma segunda folha de outro papel de capa (rosa, azul, verde ou laranja, nunca o papel da seção), deslocada cerca de 10px e girada cerca de 1°, como uma segunda cor impressa quase em registro. A fibra do papel (`--fibra`, multiply a 14%) cobre tudo, e as falhas de rolo (`--falha`) roem títulos e carimbos.

### Shadow Vocabulary
- **Segunda folha** (pseudo-elemento atrás do elemento, fundo num papel de capa diferente do da seção, deslocamento ~10px, rotação ~1°): fichas dos sistemas, ordem de serviço, pôster da matriz, capas e foto das landings, gravura das imagens de compartilhamento.
- **Segunda cor do bloco de chamada** (deslocamento chapado em `stamp-ink`): a única chapa escura permitida, porque vale como segunda tinta de impressão (vermelho-sangue) e não como sombra.

### Named Rules
**The Segunda Matriz Rule.** Destaque é sobreposição de papel, não sombra. Se o que está atrás do elemento é preto ou translúcido, está errado; tem de ser outro papel de capa (ou o vermelho-sangue do bloco de chamada), chapado, deslocado e levemente girado.

**The Sem Brilho Rule.** Nenhum glow, `backdrop-filter`, gradiente de luz ou sombra difusa. Na cena 3D a luz é rasante e quente, sem bloom.

## Shapes

Cantos retos (0px) em tudo que é papel ou tinta: botões, fichas, ficha do folheto, campos, chips, índice, credenciais. A única curva é a do carimbo de borracha (2px, borda dupla de 3px). Linhas são de tinta cheia e grossa: 2px em botões e chips, 3px em molduras de ficha, foto e leitura, 4px nas réguas da ficha do folheto e 3px nas réguas da folha de vantagens das landings; tracejado de 1px só entre linhas de dados. Rotação é o gesto de mão: o endereço de seção a -4°, a ordem de serviço a -1.2°, os carimbos a -2° e -3°, a segunda folha atrás dos destaques a ~1°. Marcadores são losangos de tinta (quadrado girado 45°), nunca círculos de ícone.

## Components

### Buttons
O botão é um bloco de tinta sólida que inverte para papel ao pressionar, como a matriz que solta a tinta na folha.
- **Shape:** retângulo de canto reto (0px), borda de 2px na cor da tinta.
- **Primary (bloco de tinta):** fundo `ink`, texto no papel da seção (`--ground`), Archivo 750.
- **Hover (só com ponteiro fino):** o bloco não levanta (sem `translate`). O hover só sublinha o rótulo ou escurece a seta; o fundo pode ir a `ink-hover`. O papel não sai da mesa: o gesto do botão é o pressionar.
- **Active:** inverte. Fundo vira o papel, texto e borda viram tinta.
- **Focus:** contorno tracejado de 3px em tinta, afastado 4px.
- **Sobre tinta (cabeçalho, §11, CTA de nota):** o bloco é amarelo com texto em tinta; hover `amarelo-hover`; active inverte para tinta com borda amarela.
- **Link com seta:** Archivo 700, sublinhado de 2px em tinta a 45%, afastado 0.2em.

### Cards / Containers: fichas como capas de cordel
- **Corner Style:** reto (0px).
- **Background:** cada ficha é uma capa num papel diferente, em ciclo de 5 (amarelo, rosa, verde, laranja, jornal), e redefine `--ground` para dentro dela.
- **Shadow Strategy:** sem sombra; segunda folha de outro papel atrás (ver Elevation & Depth).
- **Border:** 3px de tinta.
- **Internal Padding:** `clamp(18px, 2.4vw, 32px)`.
- **Conteúdo:** código em Special Elite `stamp-ink`, tipo em `ink-3`, nome em letra de madeira, print real numa moldura de tinta de 3px (levemente dessaturado, `grayscale(0.15) contrast(1.05)`), legenda em `ink-2` no papel da capa, carimbo de status.

### Carimbos
- **Style:** Special Elite em caixa alta, 0.06em, borda dupla de 3px na cor do texto, canto de 2px, fundo transparente, roído pela máscara de falha (160px).
- **Estados:** padrão em `stamp-ink`; ENCERRADO em `stamp-ink` com moldura em `stamp` (o vermelho vivo fica na borda); próprio em `ink`; produção e OK com moldura em `run` e letra em `ink` (o build ainda escreve a letra em `run`, que reprova contraste; não replicar).
- **Em seção de tinta** (§11, colofão, CTA de nota): `--stamp-ink` passa a `papel-rosa`, que dá 7:1 sobre a tinta.
- **Entrada:** cai uma vez ao entrar na tela (escala 1.35 para 1, com rotação, 420ms em `cubic-bezier(0.23, 1, 0.32, 1)`); com reduced motion já está batido.
- **Regra de conteúdo:** carimbo marca status, endereço ou público (no cabeçalho das landings), nunca enfeita título nem vira rótulo acima dele. O status nunca some: sistema encerrado leva o carimbo por cima, não sai da lista.

### Ficha do folheto
A ficha técnica da capa (avaliação, recomendações, projetos), em faixa horizontal na primeira dobra: sem caixa, réguas de tinta de 4px em cima e embaixo, cabeçalho em Special Elite, rótulos em Archivo 700 `ink-3`, valores em letra de madeira, dados separados por fios de tinta.

### Navigation: cabeçalho em faixa de tinta
- **Style:** a tarja preta do alto da capa. Fundo `ink`, todo texto em `papel-amarelo`, sem borda inferior.
- **CTA:** bloco amarelo com texto em tinta (variante sobre tinta dos botões).
- **Índice:** caixa em papel-jornal com borda de 3px; endereço e página em Special Elite `stamp-ink`.
- **Colofão:** o mesmo bloco de tinta de ponta a ponta, texto amarelo.

### Inputs / Fields
Só na ordem de serviço (§11): folha amarela girada -1.2° presa sobre a matriz entintada. Campos são uma linha de tinta de 2px embaixo, sem caixa; cursor vermelho de carimbo; foco tracejado de 3px.

### Seção entintada (§11)
A matriz inteira coberta de tinta: o papel vira `ink` e a tinta vira amarelo (`ink-2` #f4cf5c, `ink-3` #e8c34d), o endereço de seção e todo texto de carimbo saem em rosa (`--stamp-ink: var(--papel-rosa)`), os botões em amarelo. É a única inversão de seção além do colofão.

### Matriz 1 (assinatura)
Prancha de madeira em 3D real (Three.js, sem GLB): madeira `#b98457` na face, laterais `#8f5f37` e `#a8744a`, relevo espelhado como em toda matriz, luz rasante quente de cima à esquerda (`#ffe2b8`) com contraluz fria fraca. O scroll entalha as vinhetas peça por peça, a lista de peças risca linha a linha, o rolo passa tinta (a madeira fica menos áspera onde há tinta), a folha amarela desce, é prensada e levanta com a gravura e o carimbo OPERANDO. Balões numerados em Special Elite sobre amarelo com traço de 2px; legenda em Archivo 650.

### Movimento
Uma coreografia só: a impressão da matriz, com scrub amortecido (o progresso segue o scroll com `damp`, para parecer físico) e ease-out cúbico nas fases de rolo, prensa e levantamento. Todo o resto é curto: carimbos que caem uma vez (1.35 para 1, 420ms), folhas que assentam, pressionar que inverte a tinta. A curva de entrada é `cubic-bezier(0.23, 1, 0.32, 1)` (`--ease-out`); só `transform` e `opacity`. Com `prefers-reduced-motion: reduce` a folha já aparece impressa e parada, os carimbos já estão batidos, a ordem de serviço não gira e as animações caem para 0.01ms.

## Do's and Don'ts

### Do:
- **Do** dar a cada seção nova um papel de capa via `--ground` e herdar dele fundos, linhas (`color-mix` com a tinta) e texto de botão.
- **Do** escrever todo texto vermelho em `stamp-ink` e deixar `stamp` para molduras e o cursor.
- **Do** usar Alfa Slab One 400 com espaçamento 0 em títulos e números de leitura, com entalhe só nos títulos grandes.
- **Do** fazer o botão principal como bloco de `ink` de canto reto que inverte para o papel no `:active`.
- **Do** destacar com uma segunda folha de outro papel de capa atrás do elemento, deslocada ~10px e girada ~1°.
- **Do** manter fotos e prints em uma tinta por passada: foto do fabricante em `grayscale(1) contrast(1.15)` com `multiply`, borda de tinta de 3px.
- **Do** entrar com `cubic-bezier(0.23, 1, 0.32, 1)`, animar só `transform` e `opacity` e entregar a versão estática sob reduced motion.

### Don't:
- **Don't** escrever texto em `stamp` (#c8261d): dá 3,3:1 no amarelo e 2,1:1 no rosa.
- **Don't** usar creme, branco, #000 ou cinza neutro; nem voltar ao grafite e laranja do mundo anterior.
- **Don't** pôr sombra de qualquer tipo (`box-shadow`/`drop-shadow` preta, chapada ou difusa), glow, `backdrop-filter`, gradiente de luz ou texto em gradiente. A cena 3D não usa bloom.
- **Don't** arredondar cantos de botão, ficha ou campo; a única curva é o carimbo de 2px.
- **Don't** usar Special Elite fora de carimbo e numeração, nem pôr rótulo, kicker ou carimbo acima do título.
- **Don't** levantar o botão no hover; o único gesto dele é inverter ao pressionar.
- **Don't** criar uma segunda coreografia de scroll; a impressão da matriz é a única com scrub.
- **Don't** usar bounce, elastic ou ease-in em entrada.
- **Don't** carregar fontes ou imagens de terceiros; a CSP só aceita a própria origem.
