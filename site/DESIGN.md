---
name: Autark · Manual de Operação
description: O site da Autark impresso como manual técnico em negativo, com grafite, tinta cor de papel, laranja de segurança e verde de operação.
colors:
  ground: "#15181b"
  ground-raised: "#1b1f23"
  ground-sunk: "#111316"
  rule: "#2c3238"
  rule-strong: "#465058"
  ink: "#ece7dc"
  ink-2: "#c6c1b6"
  ink-3: "#969188"
  ink-surface-muted: "#4a453e"
  signal: "#ff5a1f"
  signal-hover: "#ff7040"
  signal-ink: "#15181b"
  signal-ink-2: "#2b140a"
  run: "#3ddc97"
typography:
  display:
    fontFamily: "Hubot Sans, Arial Narrow, sans-serif"
    fontSize: "clamp(2.85rem, 1.55rem + 4.6vw, 6rem)"
    fontWeight: 850
    lineHeight: 0.9
    letterSpacing: "-0.018em"
    fontVariation: "'wdth' 75"
  headline:
    fontFamily: "Hubot Sans, Arial Narrow, sans-serif"
    fontSize: "clamp(2.35rem, 1.5rem + 3.3vw, 4.6rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.012em"
    fontVariation: "'wdth' 75"
  title:
    fontFamily: "Hubot Sans, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.2vw, 3.3rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 78"
  title-sm:
    fontFamily: "Hubot Sans, Arial Narrow, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.08
    fontVariation: "'wdth' 84"
  figure:
    fontFamily: "Hubot Sans, Arial Narrow, sans-serif"
    fontSize: "2.1rem"
    fontWeight: 800
    lineHeight: 1
    fontFeature: "'tnum'"
    fontVariation: "'wdth' 78"
  button:
    fontFamily: "Hubot Sans, Arial Narrow, sans-serif"
    fontSize: "1.02rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.01em"
    fontVariation: "'wdth' 88"
  lede:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "clamp(1.1rem, 1rem + 0.38vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "0.84rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 650
    letterSpacing: "0.06em"
  code:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.04em"
    fontVariation: "'wdth' 87.5"
rounded:
  none: "0px"
  xs: "1px"
  sm: "2px"
  md: "3px"
  full: "50%"
spacing:
  header: "60px"
  header-compact: "56px"
  gutter: "clamp(16px, 3.4vw, 44px)"
  gap: "clamp(16px, 2vw, 28px)"
  section: "clamp(96px, 11vw, 176px)"
  section-head: "clamp(36px, 4.6vw, 64px)"
  folio: "clamp(72px, 8vw, 128px)"
  max-width: "1440px"
components:
  button-signal:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "10px 22px"
    height: "52px"
  button-signal-hover:
    backgroundColor: "{colors.signal-hover}"
    textColor: "{colors.signal-ink}"
  button-signal-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "10px 22px"
    height: "52px"
  button-ink-hover:
    backgroundColor: "#fff8ec"
    textColor: "{colors.ground}"
  button-ink-active:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
  button-sm:
    padding: "6px 14px"
    height: "38px"
  button-lg:
    padding: "12px 28px"
    height: "62px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
    height: "38px"
  button-outline-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  chiplet:
    textColor: "{colors.ink-2}"
    typography: "{typography.code}"
    rounded: "{rounded.sm}"
    padding: "3px 8px 2px"
  stamp:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.md}"
    padding: "7px 12px 6px"
  running-header:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    height: "{spacing.header}"
  panel-raised:
    backgroundColor: "{colors.ground-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "28px 30px 30px"
  plate:
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 24px 12px"
  service-order:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: "clamp(22px, 3vw, 36px)"
  service-order-input:
    backgroundColor: "transparent"
    textColor: "{colors.ground}"
    rounded: "{rounded.none}"
    padding: "8px 0"
  signal-page:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.signal-ink}"
---

# Design System: Autark · Manual de Operação

## Overview

**Creative North Star: "O Manual do Proprietário"**

O site inteiro se comporta como o manual impresso de uma máquina que trabalha sozinha. Cada seção tem endereço (§1 a §11, SYS-01 a SYS-10, Anexo A a C), o cabeçalho corrido informa a seção e a página atuais, e o conteúdo vem em forma de ficha técnica, lista de peças, procedimento numerado, tabela de tempos, carimbo de status e termo de garantia. A impressão é em negativo: fundo grafite levemente azulado e tinta quente cor de papel. Dessa inversão vem a cor da Fig. 1, porque as faces da máquina 3D pintam exatamente a cor do fundo e o traço aparece por cima como desenho técnico.

A densidade é de documento de engenharia, com colunas largas de respiro e blocos de informação compactos. A estrutura aparece nas réguas finas (hairlines de 1px), nas linhas pontilhadas de índice, nos tracejados de continuação e nas marcas de canto da prancha. Quase não há caixas. A cor é rara e funcional: o laranja de segurança marca ação e endereço, o verde de lâmpada marca o que está operando, e todo o resto é tinta sobre papel. A única página inteira em laranja é a §11, Assistência Técnica, onde o visitante pede a instalação.

O mundo recusa a landing escura de SaaS com mock de chat, neon, glow e grade de cards iguais. Essa recusa foi confirmada no contrato de direção e é o motivo de o sistema trocar sombras e brilhos por régua e carimbo.

**Key Characteristics:**
- Grafite tingido de fundo e tinta cor de papel, sem preto nem branco puros.
- Laranja de segurança só em ação, endereço e atenção. Verde só para "operando".
- Hubot Sans condensada e pesada nos títulos, Mona Sans no texto, Martian Mono em código, medida e número de série.
- Hairlines de desenho técnico no lugar de cartões e sombras.
- Pressionar inverte a tinta e o foco é um tracejado laranja.
- Grão de papel fixo sobre toda a página.

## Colors

Uma paleta de gráfica técnica em negativo: três tons de grafite, duas réguas, três tintas cor de papel e dois sinais que só aparecem com motivo.

### Primary
- **Laranja de Segurança** (#ff5a1f): a cor de ação. Preenche o botão principal "Pedir instalação", o fundo da página §11, os endereços de seção (§n), os códigos de ficha (SYS-nn), o foco tracejado, o cursor de texto, a seleção e o preenchimento das réguas de medida. Com tinta grafite por cima, o contraste passa folgado de AA.
- **Laranja Aceso** (#ff7040): o estado de hover do botão laranja, e só isso.

### Secondary
- **Verde de Lâmpada** (#3ddc97): marca exclusivamente o estado "operando". Aparece na lâmpada da Fig. 1, na etiqueta OPERANDO, no ponto da legenda quando a máquina está montada, nos contadores da bancada de testes, no status "em produção" e no carimbo de produção.

### Neutral
- **Grafite de Prancha** (#15181b): o papel da página. Precisa ser idêntico ao `PAPER` de `machine/Machine.tsx`, porque as faces da máquina pintam essa cor para o traço aparecer sozinho. Também serve de tinta sobre o laranja (signal-ink) com o mesmo valor.
- **Grafite Elevado** (#1b1f23): fundo das poucas peças que se destacam da prancha, como o índice aberto, a calculadora, o termo de garantia, a credencial e o bloco do laboratório. Também é o hover das linhas de tabela.
- **Grafite Fundo** (#111316): fundo das molduras de imagem das fichas, um degrau abaixo do papel para o print não flutuar.
- **Régua** (#2c3238): hairline padrão entre linhas de tabela, passos, rodapés de página e o cabeçalho.
- **Régua Forte** (#465058): hairline de abertura de bloco (topo de tabela, de lista de modelos, de ficha), contorno de botão fantasma, chiplets, pontilhados de índice e barra de rolagem.
- **Tinta Papel** (#ece7dc): texto principal, títulos e o fundo invertido do estado pressionado. Também é o fundo da ordem de serviço na §11.
- **Tinta Papel Média** (#c6c1b6): ledes, corpo de fichas e textos de apoio.
- **Tinta Papel Apagada** (#969188): rótulos, legendas, metadados, folio e números de página. Continua acima de 4,5:1 sobre o grafite.
- **Tinta Gasta** (#4a453e): rótulos e notas sobre a folha clara da ordem de serviço, onde a Tinta Papel Apagada não teria contraste.
- **Tinta Queimada** (#2b140a): texto secundário sobre o laranja da §11 (lede e folio).

### Named Rules
**The Two Signals Rule.** Laranja é ação, endereço ou atenção; verde é "operando". Nenhum dos dois decora. Se um elemento em laranja não pode ser clicado nem é um endereço ou aviso, ele volta para tinta.

**The Same Paper Rule.** O grafite da página e o `PAPER` da cena 3D são o mesmo hex. Mudar um sem o outro quebra a Fig. 1.

**The No Pure Rule.** Nada de #000 ou #fff em superfície ou texto. Os extremos são o grafite e a tinta papel, ambos tingidos.

## Typography

**Display Font:** Hubot Sans (com Arial Narrow de reserva)
**Body Font:** Mona Sans (com system-ui de reserva)
**Label/Mono Font:** Martian Mono (com ui-monospace de reserva)

**Character:** A Hubot comprimida a 75–90% de largura e pesada (700 a 850) dá aos títulos a cara de gravação em placa de máquina. A Mona, da mesma família, mantém o texto corrido calmo e legível, e a Martian Mono entra só onde o manual precisa de precisão: código, medida, revisão e número de série. As três são self-hosted e recortadas ao latim e à faixa de peso e largura usada.

### Hierarchy
- **Display** (850, clamp de 2,85 a 6rem, altura de linha 0,9, largura 75%): só o título da capa, a folha de rosto do manual. Limitado a 14,5ch.
- **Headline** (800, clamp de 2,35 a 4,6rem, 0,94, largura 75%): títulos de seção, com o endereço §n em mono laranja nas colunas 1 e 2. Limitado a 17ch e com `text-wrap: balance`.
- **Title** (800, clamp de 2 a 3,3rem, 0,96, largura 78%): passos da montagem, nomes de ficha e títulos de anexo, sempre com o código mono antes.
- **Title pequeno** (800, 1,5rem, 1,08, largura 84%): cláusulas de garantia, passos de procedimento e perguntas de solução de problemas.
- **Figure** (800, 2,1rem, largura 78%, números tabulares): leituras numéricas da calculadora, dos contadores e dos tempos. Os números grandes do manual usam a fonte de título, e a Martian fica para códigos pequenos.
- **Lede** (400, clamp de 1,1 a 1,3rem, 1,5): abertura de capa e de seção, em Tinta Papel Média, até 34–36em.
- **Body** (400, 1,0625rem, 1,6): texto corrido de fichas, procedimentos e cláusulas, com medida entre 46 e 62ch.
- **Caption** (500, 0,84rem, 1,5): legendas de figura e de foto, sem caixa alta.
- **Label** (650, 0,72rem, 0,06em, caixa alta): cabeçalhos de tabela, termos de ficha técnica (dt), cabeçalho da plaqueta e da credencial. Rotula um dado que vem logo ao lado ou abaixo.
- **Code** (Martian Mono 500, 0,75rem, largura 87,5%): endereços §n, códigos SYS-nn, revisão, número de página, balões de peça e chiplets de stack.

### Named Rules
**The Mono Means Measure Rule.** A Martian Mono aparece só em código, endereço, medida, data e número de série. Frase nunca vai em mono.

**The Condensed Weight Rule.** Título é sempre Hubot entre 700 e 850 com largura entre 75% e 90%. A fonte recortada não tem peso abaixo de 600; se um título pedir peso menor, a fonte precisa ser regenerada antes.

**The Label Needs Data Rule.** O rótulo em caixa alta de 0,72rem só existe acompanhado do dado que ele rotula (célula, valor, linha de ficha). Nunca aparece sozinho acima de um título.

## Layout

A página usa uma grade de 12 colunas com largura máxima de 1440px, margens laterais fluidas (`gutter`, de 16 a 44px) e espaço entre colunas também fluido (`gap`, de 16 a 28px). Nas seções, o conteúdo ocupa as colunas 3 a 12, e as colunas 1 e 2 ficam com o endereço §n do título, que se alinha por subgrid. Essa margem esquerda vazia é o respiro de manual impresso e se repete em toda seção.

A capa divide a tela em duas metades: colunas 1 a 6 para título, lede, ações e plaqueta, e colunas 7 a 12 para a Fig. 1, que fica grudada abaixo do cabeçalho (`position: sticky`) durante a capa e os passos da montagem. As fichas de sistema usam uma grade interna de 10 colunas e alternam lado da imagem com `data-flip`, em versão larga (6 + 4) ou compacta (4 + 6), para quebrar a repetição.

O ritmo vertical é generoso entre seções (96 a 176px) e apertado dentro dos blocos (6 a 30px). Toda seção fecha com um folio: hairline no topo, título do documento à esquerda e número de página à direita.

Pontos de quebra observados: em 1180px as fichas passam a empilhar imagem e texto e o cabeçalho perde o nome do documento; em 960px tudo vira coluna única, o cabeçalho cai para 56px, a Fig. 1 vira uma faixa de 46svh grudada no topo e as tabelas viram listas; em 600px os botões do cabeçalho viram só ícone (40px) e os botões da capa ocupam a largura toda.

A rolagem é nativa. As âncoras deslizam só quando o sistema permite e param abaixo do cabeçalho fixo (`scroll-padding-top`). Nada pode causar rolagem horizontal entre 320 e 1440px.

### Named Rules
**The Margin Address Rule.** Em seção de manual, as colunas 1 e 2 pertencem ao endereço. O conteúdo começa na coluna 3.

**The Folio Rule.** Toda seção termina com folio numerado, e o número bate com o "Pág. nn/nn" do cabeçalho corrido.

## Elevation & Depth

O sistema é plano. A profundidade vem de tom e de régua: o papel grafite, o degrau do Grafite Elevado para peças destacadas, e hairlines de 1px que separam em vez de caixas com sombra. Um grão de ruído fixo (SVG em `overlay`, opacidade 0,32) cobre a página inteira e dá textura de papel impresso. A Fig. 1 fica sobre uma trama de pontos a cada 26px, como papel milimetrado de prancheta.

Há três exceções físicas, todas presas a um objeto do mundo:

### Shadow Vocabulary
- **Folha solta** (`box-shadow: 0 18px 30px -20px rgb(0 0 0 / 0.45)`): só a ordem de serviço sobre a página laranja da §11, uma folha de papel apoiada na mesa.
- **Cursor de régua** (`box-shadow: 0 2px 6px rgb(0 0 0 / 0.5)`): o cursor da calculadora, para parecer uma peça que desliza sobre a escala.
- **Chapa rebitada** (`box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.05)`): o fio de luz no topo da plaqueta de identificação, com rebites de gradiente radial nos quatro cantos.

### Named Rules
**The Hairline Over Shadow Rule.** Separação se faz com régua de 1px (Régua ou Régua Forte). Sombra só existe quando imita um objeto físico nomeado acima.

**The No Glow Rule.** Nenhum brilho, nenhum glow e nenhum vidro fosco. A lâmpada verde acende na cena 3D, e na interface o verde é só cor sólida.

## Shapes

As formas são retas. Botões e chiplets têm canto de 2px, o suficiente para não cortar; a plaqueta e os carimbos têm 3px; painéis, tabelas, molduras de imagem, a ordem de serviço e os campos de texto têm canto zero. O círculo aparece em três usos, todos vindos do desenho técnico: balões numerados de peça (24px com contorno de 1px), pontos de status (8px) e rebites.

As bordas carregam o vocabulário da prancha. A linha contínua separa, a pontilhada liga termo a valor (índice e ficha técnica), e a tracejada marca continuação, nota ou prova (passos do procedimento, notas de ficha, linhas da plaqueta). Marcas de canto de 16px enquadram a Fig. 1. O termo de garantia usa borda dupla (borda mais contorno afastado 7px), e os carimbos usam borda de 2px com contorno afastado 2px, girados −4° e com máscara de tinta gasta.

Réguas de cota com traços (gradiente repetido de 1px) aparecem na medição da Fig. 1 e nas escalas da calculadora. Elas medem alguma coisa, então pertencem ao mundo.

## Components

### Buttons
Botões de chapa: retangulares, pesados e sem ornamento.
- **Shape:** canto quase reto (2px), borda de 1px transparente para manter o tamanho entre variantes.
- **Primary (laranja):** fundo Laranja de Segurança com tinta grafite, Hubot 700 a 88% de largura, 52px de altura mínima e padding de 10px por 22px. Usado para "Pedir instalação" e só para ações que abrem o WhatsApp.
- **Ink:** fundo Tinta Papel com texto grafite, para a ação secundária forte. Dentro da §11 laranja, o mesmo papel vira fundo grafite com texto em tinta.
- **Hover:** apenas em dispositivos com ponteiro fino. O laranja clareia para Laranja Aceso e a tinta clareia para um creme quente.
- **Active:** pressionar inverte a tinta (o laranja vira tinta papel com texto grafite; a tinta vira grafite com contorno) e encolhe para `scale(0.98)` em 140ms com ease-out forte.
- **Focus:** tracejado laranja de 2px afastado 3px. Sobre a página laranja, o tracejado vira grafite.
- **Tamanhos:** pequeno (38px, usado no cabeçalho) e grande (62px).
- **Fantasma (Índice, "Ver a montagem animada"):** fundo transparente, contorno Régua Forte, 38px. Aberto ou pressionado, inverte para tinta.

### Links
- **Link com seta:** Mona 600, sublinhado de 1px em Régua Forte que vira cor cheia no hover, e seta que anda 2px para a direita. Os códigos que levam às fichas (SYS-nn) usam Martian em laranja com sublinhado laranja a 40%.

### Chips
- **Chiplet de stack:** Martian 500 a 0,75rem, texto Tinta Papel Média, contorno Régua Forte e canto de 2px. É uma etiqueta estática de tecnologia, sem estado.
- **Status:** rótulo em caixa alta com ponto de 8px à esquerda. Produção fica em verde com ponto cheio, entregue em tinta média com ponto cheio, encerrado em tinta apagada com ponto vazado.

### Cards / Containers
O sistema quase não usa cartões. Conteúdo repetido (modelos, provas, sistemas, depoimentos) fica em listas separadas por régua, com colunas divididas por hairline vertical.
- **Corner Style:** reto (0).
- **Background:** Grafite Elevado nas poucas peças destacadas (calculadora, garantia, credencial, laboratório).
- **Shadow Strategy:** nenhuma, ver Elevation & Depth.
- **Border:** 1px em Régua ou Régua Forte. A garantia soma um contorno afastado.
- **Internal Padding:** de 22 a 60px, fluido com o viewport.
- **Laboratório (bloco clicável):** o contorno clareia para Tinta Papel Apagada no hover, e o bloco inteiro inverte para tinta ao ser pressionado.

### Inputs / Fields
- **Ordem de serviço:** os campos vivem numa folha de Tinta Papel sobre a página laranja. Não têm caixa, só uma linha de 1px em grafite embaixo, fundo transparente e canto zero. O rótulo usa Mona 650 em Tinta Gasta.
- **Focus:** tracejado laranja de 2px afastado 4px.
- **Calculadora:** o controle deslizante é uma régua com traços e preenchimento laranja de 3px, com cursor de 14 × 30px em tinta. Ao ser arrastado, o cursor fica laranja e encolhe verticalmente.

### Navigation
- **Cabeçalho corrido:** fixo, 60px (56px abaixo de 960px), fundo grafite e hairline embaixo. Traz a marca em Hubot 800 em caixa alta, o nome do documento com a revisão em mono, a seção atual centralizada com endereço laranja, o contador "Pág. nn/nn" em mono, o botão Índice e o botão laranja pequeno.
- **Índice:** painel de 460px que abre à direita em Grafite Elevado. Cada linha tem endereço em mono, título em Hubot, pontilhado até o número de página e régua embaixo. A seção atual acende em laranja. Fecha com Esc e devolve o foco.

### Carimbo de status
A assinatura do sistema. Hubot 800 em caixa alta com espaçamento de 0,1em, borda de 2px com contorno afastado, canto de 3px, giro de −4° e máscara de ruído que imita tinta gasta. Traz a data em mono. Cai uma vez quando entra na tela (escala 1,4 para 1 em 300ms com ease-out forte) e fica. A cor segue o status: verde em produção, tinta nos entregues e próprios, tinta apagada nos encerrados.

### Plaqueta de identificação
Chapa de 440px com contorno Régua Forte, canto de 3px, quatro rebites e fio de luz no topo. O cabeçalho usa rótulo em caixa alta, e cada linha liga termo e valor com tracejado. É o lugar dos números de prova da capa.

### Fig. 1 e lista de peças
A prancha da máquina: moldura com marcas de canto, carimbo de desenho em mono ("Desenho AT-01 | Folha 1/1 | Rev."), fileira de balões numerados que acendem conforme a montagem (atual em tinta invertida, montados com contorno claro), legenda "Fig. n" e régua de progresso com preenchimento laranja que vira verde quando a máquina opera. Com movimento reduzido, a máquina aparece montada e parada, e os passos viram lista comum.

## Do's and Don'ts

### Do:
- **Do** manter `--ground` e o `PAPER` da Fig. 1 no mesmo hex (#15181b).
- **Do** dar a todo bloco de conteúdo um endereço de manual (§n, SYS-nn, Anexo) e usar esse endereço na navegação e no índice.
- **Do** separar conteúdo com hairlines de 1px em Régua ou Régua Forte, com pontilhado para ligar termo e valor e tracejado para notas e continuação.
- **Do** reservar o laranja para ação, endereço, foco e aviso, e o verde para "operando".
- **Do** fazer o estado pressionado inverter a tinta e o foco ser o tracejado laranja de 2px.
- **Do** usar entradas curtas com `cubic-bezier(0.23, 1, 0.32, 1)`, animando apenas transform e opacity, e desligar tudo com `prefers-reduced-motion`.
- **Do** mostrar números grandes em Hubot condensada com algarismos tabulares.
- **Do** colocar hover só atrás de `(hover: hover) and (pointer: fine)`.

### Don't:
- **Don't** usar glow, neon, gradiente roxo para azul, texto em gradiente ou vidro fosco. O gradiente verde para ciano do logo é ativo da marca e não entra na paleta da interface.
- **Don't** montar grade de cartões iguais com ícone em quadrado arredondado. Conteúdo repetido vira tabela, lista com régua ou ficha.
- **Don't** usar sombra para separar blocos. Sombra só nas três exceções físicas de Elevation & Depth.
- **Don't** pôr rótulo em caixa alta sozinho acima de um título. Rótulo sempre acompanha um dado.
- **Don't** usar o tamanho Display em outro lugar além da capa.
- **Don't** usar ícones de biblioteca padrão nem glifos de texto como ícone. Os ícones são desenhados num traço só de 1,5px em grade de 20, e as marcas vêm do simple-icons.
- **Don't** carregar fonte, imagem ou script de terceiros. Tudo é self-hosted.
- **Don't** usar #000 ou #fff puros.
