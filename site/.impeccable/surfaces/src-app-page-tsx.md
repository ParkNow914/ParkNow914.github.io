---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

## Scope

Página única de `autarktech.com.br` (vitrine comercial da Autark). Visitor mode: **Persuade**. Rotas `/lp/*`, `/lab/` e demos externas ficam fora deste surface.

## Surface strategy

- Público: donos de pequenos negócios no Brasil, frios, muitas vezes no celular vindo do Instagram.
- Ação: abrir conversa no WhatsApp com mensagem contextual e origem UTM carimbada.
- Prova: 10 sistemas reais com status honesto, números de testes, demos abertas, 5 depoimentos verificáveis e a foto do Alisson.
- Momento memorável: a máquina "Cérebro Autark" sai do desenho técnico e se monta, peça por peça, conforme o scroll, até a lâmpada acender OPERANDO.
- Decisão do usuário: delegou todas as decisões em 23/09/2026 ("decida tudo por mim"). Direção sorteada aceita sem troca.

## Direction contract

THESIS: A Autark é apresentada como o manual do proprietário de um sistema que trabalha sozinho: especificação, montagem, ensaios e assistência. A página recusa a landing escura de SaaS com mock de chat, neon, glow e grade de cards iguais, que é exatamente o site atual.

OWN-WORLD: Um manual técnico impresso em negativo. Fundo grafite tingido e tinta cor de papel quente. Laranja de segurança aparece só em ação e atenção, e o verde de lâmpada só marca "operando". O desenho usa hairlines de desenho técnico, balões de peça numerados, tabelas de especificação com régua fina, carimbos de status datados, plaqueta de identificação rebitada, cabeçalho corrido com endereço de seção e contador de página. A tipografia é Hubot Sans condensada pesada nos títulos, Mona Sans no texto e Martian Mono só em código, medida e número de série.

STORY: O visitante entende em segundos que a Autark instala um sistema montado peça por peça e testado antes de ir ao ar. Depois vê as fichas dos sistemas reais com o status verdadeiro, calcula quanto perde no manual e pede instalação pelo WhatsApp. Sai sabendo que fala com uma pessoa só, que atende, constrói e entrega.

FIRST VIEWPORT (1440x900): No topo, o cabeçalho corrido do manual: logo em tinta, "Manual de Operação", Rev. 2026.09, a seção atual, "Pág. 01/11" e o botão laranja "Pedir instalação". Nas colunas 1 a 5, o título condensado de até 6rem "Sistemas que trabalham sozinhos enquanto você cresce.", o lede de duas frases, o botão laranja "Pedir instalação no WhatsApp", o link "Ver sistemas em operação" e a plaqueta com avaliação 5.0, 100% de recomendação e 3 sistemas em produção. Nas colunas 6 a 12, a Fig. 1: o Cérebro Autark em vista explodida, desenhado em traço de tinta, com 9 balões e a legenda "Fig. 1: Cérebro Autark, vista explodida. Role para montar."

FORM: Manual de Operação (quinto da minha lista ordenada de 7). Seed key: 6bf2879c. Raises:
- Da borda iridescente de nuvem: a cor só marca estado.
- Do tsuru: a montagem segue passos numerados na margem, linkáveis e reversíveis pelo scroll.
- Do desktop de 1 bit: o vocabulário de estados é fechado; pressionar inverte a tinta e o foco é hachura.
- Do teletexto: todo conteúdo tem endereço de manual (§n, SYS-nn) usado na navegação.
- Do passaporte: o status de cada sistema é um carimbo datado que cai uma vez e fica.

SIGNATURE INTERACTION: Montagem guiada pelo scroll em §2. As peças da Fig. 1 encaixam uma a uma, a lista de peças acende linha a linha, o traço vira material físico (alumínio anodizado grafite, conectores laranja) e a bancada de testes conta até 487. No fim, a lâmpada acende verde "OPERANDO" e pulsos correm dos canais para o núcleo e do núcleo para os conectores. Com reduced motion, a máquina aparece montada e estática, e os passos viram lista.

MOTION GRAMMAR: Uma coreografia só, a da montagem, com scrub. O resto usa entradas curtas com ease-out forte (cubic-bezier(0.23,1,0.32,1)), carimbos que "caem" uma vez e pressionar que inverte a tinta. Nada de hover com glow nem entrada idêntica em todas as seções.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Migração do domínio para a Vercel sem quebrar `/lp/*`, `/lab/`, `/configurador-camadas/` e `/pdv-lio-demo/`.
- Versão em inglês fica adiada.
