titulo: O que roda sozinho antes de um sistema ir ao ar
data: 2026-11-25
pilar: bastidor
projeto: CRM RealCred
legenda: |
  No CRM de WhatsApp que rodou numa operação financeira, nenhuma mudança
  chegava ao ar sem passar por uma fila de conferências automáticas. Eram 12
  fluxos no GitHub Actions.

  Testes de ponta a ponta com Playwright, que abrem o sistema como um usuário
  e clicam onde ele clicaria. CodeQL, que lê o código atrás de falha de
  segurança conhecida. Trivy, que confere as dependências e o servidor atrás
  de vulnerabilidade publicada e gera a lista de tudo o que está dentro, o
  SBOM.

  Por fora disso, backup diário do banco e publicação automática a cada
  mudança.

  Ninguém de fora vê essa parte. É ela que impede uma mudança de sexta à tarde
  de virar um problema no sábado de manhã.
hashtags: desenvolvimento, seguranca, testes, devops, qualidade, whatsapp
---
:: capa
## bastidor
# O que roda antes de um sistema ir ao ar
> 12 conferências automáticas no CRM.
---
:: conteudo
## testes de ponta a ponta
O Playwright abre o sistema como um usuário e clica onde ele clicaria.
---
:: conteudo
## segurança
- CodeQL lê o código atrás de falha conhecida
- Trivy confere dependências e servidor
- SBOM: a lista de tudo o que está dentro
---
:: conteudo
## e todo dia
- Backup diário do banco
- Publicação automática a cada mudança
---
:: destaque
## para que serve
> Mudança de sexta à tarde não vira problema de sábado.
---
:: cta
# Seu sistema tem isso?
> Pergunte a quem mantém.
Se ninguém souber responder, me chama.
