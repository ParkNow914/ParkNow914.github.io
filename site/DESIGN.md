---
name: Autark · Prancha Técnica
description: O site da Autark desenhado como projeto executivo assinado, em papel vegetal frio com traço grafite, linha de cota cinza e uma única tinta verde, reservada para ação e para "operando".
colors:
  papel: "#edf0ef"
  papel-2: "#e4e8e6"
  papel-3: "#d8dedb"
  mesa: "#d3d9d6"
  grafite: "#1b1f22"
  ink-2: "#353c41"
  ink-3: "#545d63"
  verde: "#0d7050"
  verde-hover: "#0a5c41"
  cota: "#7c868c"
typography:
  display:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 1.2rem + 3.3vw, min(4.6rem, 7.2vh))"
    fontWeight: 620
    lineHeight: 1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 2.5vw, 3.6rem)"
    fontWeight: 620
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "clamp(1.3rem, 1.1rem + 0.8vw, 1.75rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geologica, Segoe UI, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.62
  label:
    fontFamily: "Sofia Sans Condensed, Arial Narrow, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "0.06em"
  folio:
    fontFamily: "Sofia Sans Condensed, Arial Narrow, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.05em"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 3.4vw, 44px)"
  margem: "clamp(8px, 1.1vw, 16px)"
  entre-pranchas: "clamp(10px, 1.4vw, 18px)"
  pe-da-prancha: "clamp(48px, 6vw, 88px)"
  folha: "clamp(18px, 2.2vw, 28px)"
components:
  button-signal:
    backgroundColor: "{colors.verde}"
    textColor: "{colors.papel}"
    rounded: "{rounded.none}"
    padding: "10px 22px"
    height: "52px"
  button-signal-hover:
    backgroundColor: "{colors.verde-hover}"
    textColor: "{colors.papel}"
  button-ink:
    backgroundColor: "transparent"
    textColor: "{colors.grafite}"
    rounded: "{rounded.none}"
    padding: "10px 22px"
    height: "52px"
  folio:
    backgroundColor: "transparent"
    textColor: "{colors.grafite}"
    typography: "{typography.folio}"
    rounded: "{rounded.none}"
    padding: "8px 10px 7px"
  stamp-operando:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.verde}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "6px 10px 5px"
  sheet:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.grafite}"
    rounded: "{rounded.none}"
    padding: "{spacing.folha}"
  field-verde:
    backgroundColor: "{colors.verde}"
    textColor: "{colors.papel}"
    rounded: "{rounded.none}"
  field-verde-button:
    backgroundColor: "{colors.papel}"
    textColor: "{colors.verde}"
    rounded: "{rounded.none}"
---

# Design System: Autark · Prancha Técnica

## Overview

**Creative North Star: "O Projeto Executivo Assinado"**

O site inteiro é um jogo de pranchas de projeto executivo: cada seção é uma folha de papel vegetal frio pousada sobre a mesa de desenho, emoldurada por um traço fino com régua de coordenadas e fechada pelo quadro de identificação com a assinatura do responsável técnico. O desenho é feito a grafite firme; o que é medida aparece em linha de cota cinza; a única tinta de cor é o verde de aprovação, e ele só aparece onde o visitante age ou onde algo está operando.

A densidade é a de uma prancha técnica: muito papel livre, traço exato, rótulos condensados pequenos e em caixa alta só onde um desenho técnico os teria (cotas, balões, legendas, quadros). Nada flutua: não há sombra, gradiente, canto arredondado nem fundo cinza para destacar. O destaque se faz com traço de 1,5px ou com hachura a 45°. A figura principal, o Cérebro Autark, é um modelo 3D desenhado como desenho isométrico de traço, não como render.

O mundo substitui o folheto de xilogravura anterior e recusa, pelo contrato de direção, a landing escura de SaaS com 3D brilhante e o manual escuro de setembro.

**Key Characteristics:**
- Pranchas separadas sobre a mesa, cada uma com moldura de 1px, régua de coordenadas e quadro de identificação.
- Duas tintas: grafite para o desenho, verde para ação e "operando".
- Destaque por traço de 1,5px ou hachura a 45°, nunca por fundo de cor.
- Geologica para títulos e texto; Sofia Sans Condensed em caixa alta só para a letra técnica.
- Cantos retos, sem sombra, sem gradiente, sem glow.
- 3D isométrico de traço, sem luz, textura nem pós-processamento.

## Colors

Duas tintas sobre papel frio: grafite para tudo o que é desenho e texto, verde para a aprovação, e três papéis mais a mesa como superfícies.

### Primary
- **Verde de Aprovação** (verde): botões e links de ação, e o estado "operando": a lâmpada acesa do Cérebro, a etiqueta OPERANDO, o status "em produção" no quadro dos sistemas, a peça do passo atual na montagem, o medidor da figura quando ela está rodando. Contraste de ~5,3:1 sobre o papel, e o texto papel sobre o verde também fica em ~5,3:1.
- **Verde Assinado** (verde-hover): só o estado hover/pressionado do botão verde (~7:1 sobre o papel).

### Neutral
- **Papel Vegetal** (papel): a superfície de toda prancha, das folhas, dos quadros e das fichas. É também a cor do texto sobre campo verde ou grafite.
- **Papel de Margem** (papel-2): apenas o passe-partout sob a imagem das fichas. Não é superfície de destaque nem estado de hover.
- **Papel de Dobra** (papel-3): a superfície afundada herdada (`--ground-sunk`), quase sem uso visível.
- **Mesa de Desenho** (mesa): o que aparece entre as pranchas, a faixa que separa uma seção da outra, e a trilha da barra de rolagem.
- **Grafite** (grafite): texto, traço de moldura, quadros, balões, contorno das peças 3D, contorno de foco e o fundo do colofão. ~14:1 sobre o papel.
- **Grafite Médio** (ink-2): ledes e texto secundário (~9,8:1).
- **Grafite Claro** (ink-3): códigos, numeração, rótulos de quadro, coordenadas da régua e legendas de figura (~5,8:1). É a cor mais clara permitida para texto sobre o papel.
- **Linha de Cota** (cota): só traço não textual: linhas de cota sobre as leituras, sublinhado dos links de seta, polegar da barra de rolagem (~3,2:1, abaixo do mínimo para texto; nunca use em texto).

O contrato de direção previa verde #0f7a55 e cota #6b7378; o build entregou os valores acima, e o build é a referência.

### Named Rules
**The Verde Só Opera Rule.** Verde só para ação (botões, links de ação, controles) e para "operando" (lâmpada, OPERANDO, status em produção, peça do passo atual). Código, numeração, rótulo, estrela de avaliação e ícone de lista ficam em grafite ou grafite claro.

**The Nenhum Fundo Cinza Rule.** Nada se destaca por fundo cinza ou tingido. O que precisa sobressair ganha um traço de 1,5px em grafite ou a hachura a 45° (traço grafite a 22% de opacidade, 1px a cada 7px, a 135°).

**The Campo Verde Rule.** §11 (assistência) e o bloco final das páginas internas são um campo verde de ponta a ponta com texto papel, moldura e régua em papel e botões papel com texto verde. Isto é uma decisão do construtor, tomada sob a autorização geral do usuário ("decida tudo você"), e não um item do contrato de direção. Use só nesses dois lugares: é a prancha aprovada que fecha o percurso, não um recurso de destaque.

## Typography

**Display Font:** Geologica variável (com Segoe UI, system-ui), self-hosted
**Body Font:** Geologica variável
**Label Font:** Sofia Sans Condensed variável (com Arial Narrow), self-hosted

**Character:** Geologica é uma sans geométrica de traço técnico que segura tanto título quanto texto corrido; Sofia Sans Condensed é a letra de normógrafo da prancha, estreita e em caixa alta, que aparece só onde um desenho técnico escreveria.

### Hierarchy
- **Display** (620, escala --fs-display, 1, -0,03em): o título da capa, até 14,5ch, com `text-wrap: balance`.
- **Headline** (620, escala --fs-h2, 1,02, -0,03em): o título de cada prancha, até 18ch, com o marcador de detalhe ao lado. Mesmo peso e tracking nos títulos de nota e de página.
- **Title** (600, escala --fs-h3 e equivalentes, -0,015em): títulos de bloco: passos da montagem, nomes de sistema nas fichas, modelos, cláusulas, perguntas. Números de leitura e preços também em Geologica 600 com algarismos tabulares.
- **Body** (400, 1,0625rem, 1,62): texto corrido; ledes em grafite médio, até ~31em na capa.
- **Label** (600 a 750, 0,66 a 0,86rem, 0,05 a 0,12em, caixa alta): cotas, legendas de figura, quadros de identificação, balões numerados, cabeçalhos da lista de peças, rótulos de campo, etiquetas de status e coordenadas da régua. A primeira célula do quadro (AUTARK) leva 750 e 0,12em.

### Named Rules
**The Letra Técnica Rule.** Sofia Sans Condensed só em cotas, legendas, quadros, balões e rótulos de dados. Nunca em parágrafo, nunca em título.

**The Nada Acima do Título Rule.** Nenhum rótulo ou kicker acima de um título. Códigos como SYS-01, MOD-x, Passo n/6 e Anexo existem só para leitor de tela. Data, assunto e categoria vão abaixo do título, em letra técnica grafite claro, como a linha de identificação da prancha.

## Layout

Grade de 12 colunas herdada da base de layout, com largura máxima de 1440px e calha fluida (gutter). Por cima dela, o modelo espacial é a prancha:

- **Prancha.** Cada seção é uma folha de papel de ponta a ponta, separada da próxima por uma faixa da mesa (entre-pranchas) e com folga de pé (pe-da-prancha) para a legenda caber dentro da moldura.
- **Moldura e régua.** A uma margem fluida (margem) da borda, um traço de 1px em grafite a 65% emoldura a prancha. A régua marca tiques de 7px a cada 12,5% em cima e embaixo e seis divisões na lateral. As coordenadas 1 a 8 ficam em cima; as letras A a F ficam na faixa da margem, por fora do traço, nunca na coluna de conteúdo. Abaixo de 1100px as letras somem; abaixo de 760px some toda a numeração (os tiques continuam).
- **Legenda.** Cada seção fecha com o quadro de identificação alinhado à direita (até 760px): AUTARK / Desenho: Projeto executivo · Rev. / Responsável técnico: Alisson Santos / Prancha nn/12. Nas páginas internas a última célula vira "Folha avulsa". Na capa, o quadro 01/12 fica no canto inferior direito da figura, só com marca, responsável e prancha. Abaixo de 600px o quadro vira AUTARK | PRANCHA em cima, com desenho e responsável em linhas inteiras.
- **Capa (1440px).** Colunas 1 a 6 com título, lede, ação verde, links e três leituras cotadas; colunas 7 a 12 com a Fig. 1 sobre malha de desenho de 24px.
- **Fichas dos sistemas.** Grade fixa: imagem sempre nas colunas 1 a 5, texto e especificações das colunas 6 ao fim, sem alternar lados. Abaixo de 960px tudo empilha.
- **Páginas internas.** Fundo papel inteiro, a mesma moldura com régua abaixo do cabeçalho e a legenda de folha avulsa no pé.

## Elevation & Depth

O sistema é plano. Não há sombra em lugar nenhum: folhas, quadros, fichas, índice, ordem de serviço e credenciais são papel com traço de 1,5px. A profundidade vem de duas coisas só: a separação entre a prancha e a mesa (papel sobre um tom mais escuro) e o 3D da Fig. 1, que é desenhado em isometria com faces em três tons de papel, não iluminado.

### Named Rules
**The Papel Sobre a Mesa Rule.** A única camada é prancha sobre mesa. Uma folha sobre a prancha (ordem de serviço, ficha) se separa por traço de 1,5px, nunca por sombra ou deslocamento.

## Shapes

Cantos retos (0px) em tudo: botões, campos, fichas, quadros, etiquetas, polegar do controle deslizante. Os únicos círculos são de desenho técnico: os balões numerados das peças e o marcador de detalhe da seção (o número num círculo de traço 1,5px cortado ao meio por um fio de 1px abaixo do algarismo, ao lado do título, nunca acima). Traço em dois pesos: 1px para molduras de prancha, fios internos de quadro e linhas de chamada; 1,5px para tudo que é objeto (quadros, fichas, botões, campos, balões, símbolos). Os campos de formulário são só um fio de 1,5px embaixo, como uma linha de preenchimento.

### Símbolos dos sistemas
Um símbolo geométrico por sistema, todos na grade de 24 com traço 1,5 em cor corrente, juntas em esquadria, sem preenchimento: quadrado, círculo, triângulo e diagonais combinados. Aparecem no registro de §4, no cabeçalho de cada ficha e no h1 da página do sistema, sempre com o nome escrito ao lado.

## Components

### Buttons
Firmes e planos, como um carimbo de aprovação recortado.
- **Shape:** retos (0px), traço de 1,5px, altura mínima de 52px, Geologica 600.
- **Primary (verde):** campo verde com texto papel. É a única ação de cor da tela.
- **Secondary (traço):** transparente, texto e traço grafite; no hover ganha a hachura, nunca fundo cinza.
- **Hover / Focus:** o verde escurece para verde-hover em 160ms ease-out; o botão nunca levanta. Ao pressionar, desce 1px (`translateY(1px)`, 120ms). Foco visível com contorno de 2px grafite a 3px de distância (papel sobre o campo verde). Com reduced motion, sem deslocamento nem transição.
- **No campo verde:** os dois botões viram papel com texto verde.
- **Links de seta:** Geologica 600 com sublinhado de 1,5px em cota, que passa à cor do texto no hover.

### Quadro de identificação (legenda da prancha)
A assinatura de cada seção. Grade de quatro células com traço externo de 1,5px e fios internos de 1px, letra técnica 600 em caixa alta (0,8rem, 0,05em); a chave de cada célula em 500, 0,68rem, grafite claro, acima do valor. Decorativo para leitor de tela.

### Etiquetas de status
Quadro de 1,5px, letra técnica 700 em caixa alta (0,78rem, 0,08em), sem rotação nem textura de carimbo. "Em produção" e "ok" ganham traço e texto verdes com um quadrado verde de 7px antes; "encerrado" leva hachura; os demais ficam em grafite.

### Fichas / Folhas
- **Corner Style:** reto (0px).
- **Background:** papel; a imagem fica sobre papel-2 com fio de 1px grafite.
- **Shadow Strategy:** nenhuma (ver Elevation & Depth).
- **Border:** 1,5px grafite.
- **Internal Padding:** a escala folha.

### Inputs / Fields
- **Style:** sem caixa: só o fio inferior de 1,5px grafite, fundo transparente, Geologica 450. Rótulo em letra técnica 650 caixa alta grafite claro acima do campo.
- **Focus:** contorno de 2px grafite a 4px de distância; cursor de texto verde.
- **Controles:** caixa de seleção e controle deslizante com `accent-color` verde; polegar do deslizante reto, em grafite.

### Navigation
Cabeçalho corrido como a faixa de título do desenho: papel, fio inferior de 1,5px grafite, marca em Geologica 650, documento, revisão e página em letra técnica grafite claro. O índice é uma folha de papel com traço de 1,5px, números de prancha em letra técnica grafite claro, sem destaque verde no item atual.

### Fig. 1: o Cérebro Autark (assinatura)
Modelo 3D desenhado como desenho técnico.
- **Câmera:** ortográfica isométrica com zoom 1, de modo que uma unidade do mundo é um pixel.
- **Faces:** três tons de papel calculados pela normal (de #d3d9d6 a #f8faf9), sem textura, luz real, sombra nem pós-processamento.
- **Arestas:** LineSegments2 de 1,6px fixos em tela, com as linhas escondidas removidas pela profundidade; cilindros ganham uma casca de contorno por dentro para fora.
- **Montagem (a única coreografia com scrub):** o scroll de §1 leva as peças da vista explodida até o lugar ao longo das linhas de chamada; a peça do passo atual é traçada em verde (arestas e casca) com as faces levemente esverdeadas; o enquadramento aproxima conforme a máquina fecha; no último passo a lâmpada fica verde e a etiqueta OPERANDO aparece presa a ela. A linha da peça atual na lista de peças ganha hachura e balão verde.
- **Reduced motion:** a máquina aparece montada e parada, com um botão para animar.
- **Pôster:** um SVG gerado pelo mesmo modelo, com os mesmos tons, traço de 1,6px, balões e limites de enquadramento, para que a troca do pôster pela cena não pule.
- **Entorno:** malha de desenho de 24px (grafite a 7%), balões numerados de 1,5px, legenda e régua de montagem à esquerda embaixo, quadro 01/12 à direita embaixo.

### Leituras cotadas
Cada número da capa leva por cima uma linha de cota (1px em cota, com traços de chamada nas pontas); o rótulo vai embaixo do número, em letra técnica caixa alta grafite claro.

## Do's and Don'ts

### Do:
- **Do** fechar toda seção com o quadro de identificação e a régua de coordenadas; nas páginas internas, com a folha avulsa.
- **Do** destacar com traço de 1,5px grafite ou com a hachura a 45°.
- **Do** pôr o número da seção no marcador de detalhe, ao lado do título.
- **Do** usar Sofia Sans Condensed em caixa alta (600 a 750, tracking 0,05 a 0,12em) só para cotas, legendas, quadros, balões e rótulos de dados.
- **Do** desenhar todo símbolo novo na grade de 24 com traço 1,5, sem preenchimento.
- **Do** manter a imagem das fichas nas colunas 1 a 5.
- **Do** usar entradas curtas em ease-out `cubic-bezier(0.23, 1, 0.32, 1)` e só transform e opacity.
- **Do** manter texto em grafite, grafite médio ou grafite claro (mínimo ~5,8:1 sobre o papel).

### Don't:
- **Don't** usar verde em código, numeração, rótulo, estrela, ícone de lista, ênfase de título ou selo de "recomendado".
- **Don't** usar fundo cinza ou tingido como destaque.
- **Don't** pôr rótulo, kicker, código ou data acima de um título.
- **Don't** usar sombra, gradiente de cor, glow, canto arredondado ou deslocamento de "levantar" no hover.
- **Don't** usar a cor de cota em texto.
- **Don't** criar uma segunda coreografia com scrub além da montagem, nem bounce ou elastic.
- **Don't** dar luz, textura, sombra ou pós-processamento ao 3D.
- **Don't** usar o campo verde fora de §11 e do bloco final das páginas internas.
