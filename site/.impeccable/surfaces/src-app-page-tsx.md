---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

## Scope
Site inteiro de `autarktech.com.br`: home, `/sistemas/`, `/sistemas/<slug>/`, `/vale-do-paraiba/`, `/notas/`, `/pacotes/`, `/privacidade/`, 404 e as landings `/lp/*` (estas por `lp/lp.css`). Visitor mode da home, pacotes e landings: **Persuade**. Notas e privacidade: **Read**, no mesmo mundo. `/lab/` e as demos externas ficam fora.

## Surface strategy
- Público: donos de pequenos negócios no Brasil (salão, barbearia, clínica, delivery, corretora), frios, no celular de 360px vindo do Instagram, muitas vezes à noite.
- Ação: abrir conversa no WhatsApp com mensagem contextual e origem UTM carimbada.
- Prova: 10 sistemas reais com status honesto, 13 avaliações 5.0 no 99freelas, 6 depoimentos verificáveis, prints reais e a foto do Alisson.
- Momento memorável: o Cérebro Autark, desenhado em traço 3D, monta peça por peça conforme a rolagem e acende OPERANDO.
- Decisões do usuário (26/11/2026): redesign completo, sério e profissional, "não infantil"; 3D sóbrio em um momento só; "decida tudo você". Estrutura, ids, classes de teste e conteúdo factual preservados (E2E de 57 checagens). Imagens novas: o usuário gera no ChatGPT a partir de prompts que eu entrego; nada de crédito pago.

## Direction contract
THESIS: A Autark como projeto executivo assinado: cada sistema é desenhado, cotado, testado e assinado por um responsável técnico. A página recusa a landing escura de SaaS com 3D brilhante, o folheto colorido de xilogravura que ela substitui e o manual escuro de setembro.
OWN-WORLD: Papel vegetal frio (#edf0ef), traço grafite (#1b1f22) firme, linha de cota cinza (#6b7378) e uma única tinta verde de aprovação (#0f7a55) para ação e "operando". Margem de prancha com coordenadas, legenda de prancha (quadro de identificação) fechando cada seção com número da prancha, escala e revisão. Geologica nos títulos e no texto; Sofia Sans Condensed nas cotas, legendas, balões e quadros. Hachura a 45° como único preenchimento. Sem sombra, sem gradiente, cantos retos.
STORY: Em segundos o visitante entende que um profissional só projeta, testa e assina sistemas que atendem sozinhos; vê os 10 sistemas no quadro da prancha com status real, calcula o quanto perde e pede instalação no WhatsApp.
FIRST VIEWPORT (1440x900): Moldura de prancha com coordenadas na margem. Colunas 1 a 6: título "Sistemas que trabalham sozinhos enquanto você cresce." em Geologica grande, lede, botão verde "Pedir instalação no WhatsApp", dois links e as leituras 5.0, 13 e 14 com linhas de cota. Colunas 7 a 12: o Cérebro Autark em 3D de traço, isométrico, em vista explodida com balões numerados; a legenda da prancha no canto inferior direito.
FORM: Prancha Técnica, 6º da minha lista ordenada de 7. Seed key: 6d3eebb8. Raises:
- Do quadro de partidas: a lista de sistemas é o quadro da prancha, linhas fixas, só a célula de status muda.
- Dos impressos do quiosque: cada sistema tem um símbolo geométrico desenhado na mesma grade.
- Do teletexto: cada seção tem número de prancha, também no índice.
- Da risografia: só duas tintas, grafite e verde.
- Da prateleira do forno: cada sistema mostra sua ficha (tecnologia, status, números) alinhada na mesma linha.
- Da pedreira de nuvens: seções como pranchas separadas, com margem larga entre elas.
SIGNATURE INTERACTION: O scroll de §1 monta o Cérebro: cada passo encaixa as peças ao longo das linhas de chamada, a peça em montagem é traçada em verde, e no último passo a lâmpada verde acende com a etiqueta OPERANDO. Reduced motion: montado e parado, com botão para animar.
MOTION GRAMMAR: Uma coreografia com scrub, a montagem. O resto: entradas curtas em ease-out forte e cotas que se desenham uma vez. Sem bounce, sem glow.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved
- Versão em inglês segue adiada.
