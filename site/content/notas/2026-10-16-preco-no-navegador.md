titulo: Preço calculado no navegador é preço que dá pra forjar
data: 2026-10-16
pilar: ensino
projeto: Bia
legenda: |
  Uma armadilha comum em loja online barata, e que quase ninguém verifica antes
  de contratar.

  Quando o cliente monta o carrinho, alguém precisa somar. Se essa soma acontece
  no navegador dele e o resultado é enviado pro servidor como verdade, o sistema
  está confiando num número que o cliente controla.

  Não é hipótese exótica. Qualquer pessoa com curiosidade média consegue alterar
  o que o navegador manda. O pedido chega com o total que ela escolheu, e sai
  cupom, sai entrega, sai prejuízo.

  O jeito certo é simples de explicar: o navegador mostra a conta pro cliente
  ver, mas o servidor refaz a conta inteira antes de aceitar o pedido. Se os dois
  números não baterem, vale o do servidor.

  Na Bia, isso é testado de propósito contra pedido forjado — o teste manda um
  total errado e confere que o sistema recusa.

  A pergunta pra fazer a quem te vender uma loja: "o preço é conferido no
  servidor?". Se a pessoa hesitar, você já sabe.
hashtags: ecommerce, seguranca, delivery, lojaonline, desenvolvimento, comerciolocal
---
:: capa
## ensino
# Preço calculado no navegador é preço que dá pra forjar
> E é mais comum do que parece.

---
:: conteudo
## onde a conta acontece
Quando o cliente monta o carrinho, alguém precisa somar.

Se essa soma acontece **no navegador dele** e o servidor aceita o resultado como
verdade, o sistema confia num número que o cliente controla.

---
:: destaque
## não é hipótese exótica
> Qualquer pessoa com curiosidade média altera o que o navegador manda.
O pedido chega com o total que ela escolheu.

---
:: conteudo
## e aí sai tudo
- Sai o cupom
- Sai a entrega
- Sai o prejuízo

Sem nenhum alerta, porque do ponto de vista do sistema estava tudo normal.

---
:: conteudo
## o jeito certo
O navegador mostra a conta **pro cliente ver**. O servidor refaz a conta inteira
antes de aceitar.

Se os dois números não baterem, vale o do servidor. Sempre.

---
:: conteudo
## como eu confiro isso
Na Bia existe um teste que **manda um total errado de propósito** e confere que
o sistema recusa o pedido.

Se alguém quebrar essa proteção um dia, o teste avisa antes do cliente.

---
:: cta
# A pergunta que te protege
> "O preço é conferido no servidor?"
Faça pra quem for te vender uma loja online. Se a pessoa hesitar, você já
descobriu o que precisava.
