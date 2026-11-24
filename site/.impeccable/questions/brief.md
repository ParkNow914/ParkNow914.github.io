## Scope

Site inteiro de `autarktech.com.br`: home, `/sistemas/`, `/sistemas/<slug>/`, `/vale-do-paraiba/`, `/notas/`, `/privacidade/`, 404 e as landings `/lp/*` (estas por `lp/lp.css`). Visitor mode da home e das landings: **Persuade**. Notas e privacidade: **Read**, no mesmo mundo. `/lab/` e as demos externas ficam fora.

## Surface strategy

- Público: donos de pequenos negócios no Brasil (salão, barbearia, clínica, delivery, corretora), frios, no celular de 360px vindo do Instagram, muitas vezes à noite.
- Ação: abrir conversa no WhatsApp com mensagem contextual e origem UTM carimbada.
- Prova: 9 sistemas reais com status honesto, 12 avaliações 5.0 no 99freelas, 6 depoimentos verificáveis, prints reais e a foto do Alisson.
- Momento memorável: a matriz de madeira é entalhada peça por peça conforme o scroll, recebe tinta do rolo e a folha amarela sai impressa com o carimbo OPERANDO.
- Decisões do usuário (23/11/2026): site inteiro, trocar o mundo visual inteiro, manter Lighthouse mobile ≥ 80. Depois delegou a escolha: "decida você a top1 melhor e faça". Estrutura, ids, classes de teste e conteúdo factual são preservados (E2E de 58 checagens).

## Direction contract

THESIS: A Autark é uma oficina de xilogravura: cada sistema é entalhado à mão numa matriz de madeira e sai impresso como capa de cordel. "Construído à mão, sem template" vira material. A página recusa a landing escura de SaaS com 3D brilhante e também o manual técnico grafite que ela substitui.

OWN-WORLD: Tinta preta de rolo (#17130f) sobre papéis de capa de cordel saturados, um por seção: amarelo-gema, rosa-chiclete, azul-anil claro, verde-folha, laranja-urucum, e papel-jornal acinzentado para leitura longa. Nada de creme. Vermelho de carimbo só para status e atenção. Wood type pesado (Alfa Slab One) com borda entalhada nos títulos, Archivo no texto, Special Elite só em carimbo e numeração de folheto. Imagens em uma tinta por passada, profundidade por sobreposição de cor, nunca por sombra ou brilho. Botão principal é bloco de tinta sólida que inverte para papel ao pressionar.

STORY: Em segundos o visitante entende que um homem só entalha sistemas que atendem sozinhos de madrugada; vê as capas dos 9 sistemas com status carimbado, calcula o quanto perde e pede instalação pelo WhatsApp.

FIRST VIEWPORT (1440x900): Página em papel amarelo-gema. Colunas 1–6: título em wood type entalhado "Sistemas que trabalham sozinhos enquanto você cresce.", lede, bloco de tinta "Pedir instalação no WhatsApp", dois links e a ficha do folheto (avaliação 5.0, 12 recomendações, 12 projetos). Colunas 7–12: a matriz de madeira em 3D real, inclinada sob luz rasante, com a gravura do salão fechado de madrugada e o celular respondendo, moldura de 9 vinhetas numeradas e a legenda "Matriz 1: o Cérebro Autark. Role para entalhar."

FORM: Matriz de Xilogravura (quarto da minha lista ordenada de 7). Seed key: f454ee7a. Raises:
- Do livro futurista: os sons do atendimento (PLIM, AGENDADO) são impressos em wood type, maiores quanto mais alto o barulho.
- Da carteira de bilhetes: status nunca some; o CRM encerrado leva carimbo vermelho ENCERRADO por cima.
- Do display de partículas: a capa acompanha uma mensagem de cliente de cada vez.
- Do recorte em camadas: cada cor é uma matriz separada, sobreposta; profundidade só por sobreposição.

SIGNATURE INTERACTION: Em §1 o scroll entalha a matriz: cada passo cava as vinhetas das peças (lascas e marcas de goiva), a lista de peças risca linha a linha, o rolo passa tinta preta e a folha amarela desce, é prensada e levanta com a gravura impressa e o carimbo OPERANDO. Reduced motion: folha já impressa, estática, com botão para animar.

MOTION GRAMMAR: Uma coreografia só, a da impressão, com scrub. O resto: carimbos que caem uma vez, folhas que assentam com ease-out forte (cubic-bezier(0.23,1,0.32,1)), pressionar inverte a tinta. Sem glow, sem bounce.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Versão em inglês segue adiada.
