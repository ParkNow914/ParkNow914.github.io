titulo: Imprimir na Epson do balcão, direto do pedido
data: 2026-10-14
pilar: prova
projeto: Bia
legenda: |
  No post anterior eu falei do cupom que não sai. Esse é o sistema onde ele sai.

  O cliente monta o pedido — na loja web, no Telegram ou no WhatsApp, tanto faz.
  O sistema calcula a taxa pelo endereço, fecha a conta e manda o cupom direto
  pra impressora térmica do balcão. A Epson que a loja já tinha, sem trocar
  equipamento e sem instalar programa novo no computador do caixa.

  Isso funciona porque impressora térmica fala uma linguagem própria, antiga e
  bem documentada, chamada ESC/POS. Em vez de mandar uma imagem do cupom, o
  sistema fala essa linguagem direto: o que é negrito, onde corta o papel, onde
  pula linha.

  O resultado prático: ninguém digita o pedido de novo. O que o cliente escolheu
  é exatamente o que sai no papel, e o tempo entre "pedido feito" e "cupom na
  mão da cozinha" é zero.

  Detalhe que importa: o preço e a taxa são sempre recalculados no servidor
  antes de imprimir. Falo disso no próximo post.
hashtags: supermercado, delivery, mercadinho, pdv, escpos, comerciolocal, automacao
---
:: capa
## prova
# O cupom sai na Epson que a loja já tinha
> Sem trocar equipamento.

---
:: conteudo
## o caminho completo
O cliente monta o pedido — loja web, Telegram ou WhatsApp, tanto faz.

O sistema calcula a taxa pelo endereço, fecha a conta e manda o cupom **direto
pra impressora do balcão**.

---
:: codigo
## a linguagem da impressora
```ESC/POS
negrito ligado
CUPOM DE PEDIDO
negrito desligado
... itens ...
cortar papel
```
Impressora térmica fala um idioma próprio, antigo e bem documentado.

---
:: conteudo
## por que isso importa
Em vez de mandar uma **imagem** do cupom, o sistema fala esse idioma direto.

Ele diz onde é negrito, onde pula linha e onde corta o papel. Sai limpo, do
tamanho certo, sempre.

---
:: destaque
## o resultado prático
> Ninguém digita o pedido de novo.
O que o cliente escolheu é exatamente o que sai no papel.

---
:: conteudo
## e sem obra na loja
- A impressora é a que já existe
- Nenhum programa novo no computador do caixa
- O atendente não muda de rotina

---
:: cta
# Quer ver imprimindo?
> Eu abro na sua frente.
E no próximo post eu conto por que o preço nunca é calculado no navegador do
cliente — é uma armadilha comum e cara.
