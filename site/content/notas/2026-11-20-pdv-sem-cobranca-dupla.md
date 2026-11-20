titulo: Três regras para o PDV não cobrar duas vezes
data: 2026-11-20
pilar: ensino
projeto: PDV em maquininha
legenda: |
  Quando a resposta da maquininha não chega, o PDV tem duas saídas: tentar de
  novo ou descobrir o que aconteceu. Tentar de novo é o que gera a cobrança
  dupla.

  As três regras que eu uso:

  **Primeira: gravar a intenção antes de chamar a maquininha.** Antes de
  cobrar, o PDV anota que existe uma cobrança daquele valor em andamento. Se
  tudo cair no meio, ao voltar ele sabe o que estava fazendo.

  **Segunda: a chave de idempotência nasce no aplicativo.** Cada cobrança leva
  uma identificação única criada no próprio PDV. A mesma chave enviada duas
  vezes pede a mesma cobrança, e não uma nova.

  **Terceira: na dúvida, consultar em vez de reenviar.** Sem resposta, o PDV
  pergunta se a cobrança daquela chave passou. Só cobra de novo se a resposta
  for não.

  Eu montei um simulador clicável desse fluxo, com a integração escrita em
  Kotlin para a Cielo Lio. Está aberto no site para você simular a falha no
  meio da venda.
hashtags: pdv, pagamento, idempotencia, kotlin, varejo, desenvolvimento
---
:: capa
## ensino
# Três regras para o PDV não cobrar duas vezes
> Quando a rede cai no meio da venda.
---
:: conteudo
## 1. grave a intenção
Antes de chamar a maquininha, o PDV anota a cobrança **em andamento**.
---
:: conteudo
## 2. a chave nasce no app
Cada cobrança leva uma identificação única criada no PDV.

Mesma chave, **mesma cobrança**.
---
:: conteudo
## 3. na dúvida, consulte
Sem resposta, pergunte se a cobrança passou.

Só cobre de novo se a resposta for não.
---
:: cta
# Veja funcionando
> O simulador está aberto no site.
autarktech.com.br/pdv-lio-demo: simule a falha no meio da venda.
