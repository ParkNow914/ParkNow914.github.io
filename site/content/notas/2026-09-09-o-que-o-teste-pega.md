titulo: O que um teste automático pega que olho nenhum vê
data: 2026-09-09
pilar: bastidor
projeto: Portfólio Autark
legenda: |
  Todo sistema que eu entrego tem um robô que abre a página sozinho, clica nos
  botões e confere se nada quebrou. Ele roda a cada mudança, antes de qualquer
  coisa chegar no ar.

  Um exemplo do que ele pega e o olho não: contraste de cor.

  Existe um mínimo que a norma de acessibilidade exige para texto pequeno ser
  legível — 4,5 pontos de contraste sobre o fundo. Um cinza claro num horário de
  mockup dava 4,14 sobre o balão cinza e 2,88 sobre o verde. Bonito na tela
  grande. Ilegível para quem enxerga pouco, e reprovado pela norma.

  Nenhuma pessoa olhando aquilo diria "esse cinza está com 4,14". O robô diz, e
  trava a publicação até arrumar.

  Tem um detalhe que só automação pega: as mensagens do mockup entram com
  animação, então o teste só enxerga o horário depois que ele termina de
  aparecer. É o tipo de coisa que passa em revisão manual e não passa em teste.

  Por que isso te interessa: o mesmo robô que confere um cinza confere o preço,
  a taxa e o botão de pagar do seu sistema.
hashtags: desenvolvimento, acessibilidade, qualidadedesoftware, automacao, testes
---
:: capa
## bastidor
# O que um teste automático pega que olho nenhum vê
> Começando por um cinza claro.

---
:: conteudo
## o que é esse teste
Toda vez que eu mudo uma linha, um robô abre a página sozinho, clica nos botões
e confere se nada quebrou.

Se algo quebra, ele **trava a publicação**. Não é opcional.

---
:: numero
## o mínimo da norma
# 4,5
É o contraste que texto pequeno precisa ter sobre o fundo para ser legível. Um
cinza de mockup dava **4,14** — e **2,88** sobre o balão verde.

---
:: destaque
## e aqui está o ponto
> Ninguém olhando aquilo diria "esse cinza está com 4,14".
Uma pessoa vê "meio claro". O robô vê o número, e não negocia.

---
:: codigo
## uma linha de estilo
```css
.hora { color: rgba(255, 255, 255, 0.45); }
```
Bonito na tela grande. Ilegível para quem enxerga pouco.

---
:: conteudo
## o detalhe que só automação pega
As mensagens entram com **animação**. O teste só enxerga o horário depois que
ele termina de aparecer.

É o tipo de coisa que passa numa revisão manual e não passa num teste.

---
:: conteudo
## por que isso te interessa
- O mesmo robô confere o **preço**, a **taxa** e o **botão de pagar**
- Ele roda a cada mudança, não só na entrega
- Você não descobre o defeito pelo cliente reclamando

---
:: cta
# Software que ninguém testa não é mais barato
> Só adia a conta.
Eu construo com teste automatizado desde o primeiro dia — e te mostro
funcionando antes de você depender disso.
