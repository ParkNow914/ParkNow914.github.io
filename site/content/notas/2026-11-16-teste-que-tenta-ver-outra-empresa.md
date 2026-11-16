titulo: O teste que tenta ver os dados da outra empresa
data: 2026-11-16
pilar: bastidor
projeto: KineQuote
legenda: |
  Quando um sistema atende várias empresas no mesmo banco de dados, existe um
  jeito silencioso de dar errado: a empresa A enxergar um cliente da empresa
  B.

  No uso normal essa falha não aparece. Cada um entra com o próprio login, vê
  os próprios dados e tudo parece certo. Ela só aparece quando alguém pede, de
  propósito, o que não é seu.

  No KineQuote eu travei o isolamento no próprio banco: no Postgres do
  Supabase, a regra de acesso por empresa é forçada, sem exceção. E escrevi
  uma bateria de testes que faz o papel de quem tenta: ler, inserir e alterar
  dados de outra empresa.

  Esses testes só passam quando todas as tentativas falham. Se um dia alguém
  mexer numa regra e abrir uma brecha, o teste avisa antes de o sistema ir ao
  ar.

  O cliente nunca vê esse controle, e é por isso mesmo que ele precisa
  existir.
hashtags: seguranca, saas, supabase, postgres, lgpd, desenvolvimento
---
:: capa
## bastidor
# O teste que tenta ver os dados da outra empresa
> E só passa quando não consegue.
---
:: conteudo
## a falha silenciosa
Um sistema com várias empresas no mesmo banco.

A empresa A enxerga um cliente da empresa B.
---
:: conteudo
## por que ninguém percebe
No uso normal, cada um vê só os próprios dados.

A falha aparece quando alguém pede, **de propósito**, o que não é seu.
---
:: conteudo
## o que eu fiz
- Isolamento por empresa travado no banco
- Regra forçada, sem exceção
- Testes que tentam ler, inserir e alterar dados alheios
---
:: destaque
## o critério
> O teste passa quando todas as tentativas falham.
---
:: cta
# Seu sistema atende mais de uma empresa?
> Pergunte como ele separa os dados.
Se a resposta for "a tela esconde", vale uma conversa.
