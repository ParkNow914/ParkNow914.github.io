# Segurança

Achou uma falha em autarktech.com.br, nas landings em `/lp/` ou neste repositório? Escreva
para **alimiguel1098@gmail.com** com o endereço afetado e os passos para reproduzir. Não
abra issue pública com o detalhe da falha antes de ela ser corrigida.

A resposta sai no mesmo dia útil. Correções de segurança passam na frente de qualquer outra
entrega e vão ao ar pelo mesmo caminho de sempre: pull request, testes de ponta a ponta no
site montado e publicação automática.

## O que o site já faz

- Nenhum request a terceiros: fontes, imagens e 3D saem do próprio domínio.
- CSP em `<meta>` em todas as páginas, sem origem externa liberada.
- Nenhum formulário envia dados a um servidor. A ordem de serviço monta a mensagem e abre o
  WhatsApp no aparelho de quem visita; nada fica salvo no site.
- HTTPS obrigatório, com o certificado do GitHub Pages vigiado duas vezes por dia pelo
  workflow Disponibilidade.
