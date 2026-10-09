titulo: O que quebra quando um site tem dois idiomas
data: 2026-10-09
pilar: bastidor
projeto: Portfólio Autark
legenda: |
  Site em dois idiomas tem uma armadilha que quase ninguém antecipa, e ela não
  dá erro nenhum — só aparece na tela do visitante.

  Existem dois jeitos de colocar texto numa página: um trata tudo como texto
  puro, o outro entende formatação. Se você usar o primeiro para uma frase que
  tem negrito ou quebra de linha dentro, o visitante vê o código cru no meio do
  texto: "Bots de WhatsApp &amp; Telegram", "<strong>sistemas</strong>".

  E tem uma segunda camada. Ao voltar para o idioma original, o site guarda o
  estado quebrado e a formatação some de vez. Ou seja: bastam dois cliques para
  a página ficar pior do que estava antes de alguém mexer.

  Nenhum servidor reclama. Nenhum log registra. Não existe alerta.

  Por isso a regra que eu sigo: cada texto é marcado com o tipo certo, e existe
  um teste automatizado que trava exatamente essa inversão. Se alguém trocar a
  ordem um dia, fica vermelho antes de chegar no ar.

  A pergunta que vale pro seu site: se ele tem dois idiomas, alguém testou
  trocar e voltar?
hashtags: desenvolvimento, site, internacionalizacao, qualidadedesoftware, programacao
---
:: capa
## bastidor
# O que quebra quando um site tem dois idiomas
> E não dá erro nenhum.

---
:: codigo
## o que o visitante vê
```na tela
Bots de WhatsApp &amp; Telegram
<strong>sistemas</strong> que geram resultado
```
Código cru no meio da frase, onde deveria estar o texto formatado.

---
:: conteudo
## a causa
Existem dois jeitos de colocar texto numa página: um trata tudo como **texto
puro**, o outro entende formatação.

Usar o primeiro numa frase que tem negrito dentro produz isso.

---
:: destaque
## e tem uma segunda camada
> Voltar ao idioma original deixa a página pior do que estava.
O estado quebrado fica guardado, e a formatação some de vez.

---
:: conteudo
## bastam dois cliques
Trocar o idioma e voltar.

Nenhum servidor reclama, nenhum log registra, não existe alerta. Só uma página
progressivamente pior para quem mexeu.

---
:: conteudo
## a regra que eu sigo
- Cada texto marcado com o **tipo certo**, sem exceção
- Um **teste automatizado** que trava essa inversão
- Se alguém trocar a ordem, fica vermelho antes de ir pro ar

---
:: cta
# Seu site tem dois idiomas?
> Alguém já testou trocar e voltar?
É um minuto de teste e um problema que ninguém vê até um cliente ver.
