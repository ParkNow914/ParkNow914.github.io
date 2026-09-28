titulo: API oficial do WhatsApp ou não oficial: qual usar
data: 2026-09-28
pilar: ensino
projeto: Autark
legenda: |
  Quem vai automatizar o WhatsApp esbarra cedo nessa escolha. A resposta muda
  conforme o negócio, e o critério que eu uso cabe numa pergunta: quem manda a
  primeira mensagem?

  A **API oficial** é a Cloud API da Meta. Ela pede conta comercial verificada,
  e toda conversa que você inicia fora da janela de 24 horas depois da última
  mensagem do cliente precisa usar um modelo aprovado pela Meta. A Meta cobra
  pela maior parte desses modelos, conforme a categoria, e vale conferir a
  tabela dela antes de fechar a conta. Em troca, vários atendentes e
  integrações usam o mesmo número sem gambiarra, e o risco deixa de ser o
  bloqueio por automação e passa a ser a qualidade das suas mensagens.

  A **não oficial** (Evolution API e parecidas) conecta um número comum, do
  mesmo jeito que o WhatsApp Web. Fica pronta em minutos e custa pouco. O preço
  é o risco: a Meta não autoriza esse uso, e um número que manda mensagem
  demais para quem não pediu pode ser banido.

  Minha regra: se o negócio depende de você mandar mensagem em volume
  (campanha, cobrança, aviso para milhares de pessoas), vá de oficial. Se o bot
  responde quem chama e avisa quem marcou horário, a não oficial costuma
  servir, desde que nunca vire disparo.

  Nos meus sistemas eu já usei as duas. O CRM da corretora rodou na API
  oficial, com modelos aprovados e opt-out. A agenda dos salões usa a Evolution
  API, porque cada salão conecta o próprio número em minutos.
hashtags: whatsapp, whatsappbusiness, apioficial, automacao, chatbot, atendimento
---
:: capa
## antes de automatizar
# API oficial do WhatsApp ou não oficial?
> Depende de quem manda a primeira mensagem.

---
:: conteudo
## API oficial (Meta)
- Conta comercial verificada
- Modelo aprovado para iniciar conversa fora da janela de 24h
- A Meta cobra por modelo, conforme a categoria
- Vários atendentes e integrações no mesmo número

---
:: conteudo
## não oficial (Evolution API)
- Conecta um número comum em minutos
- Custo baixo
- Uso não autorizado pela Meta
- Disparo em massa derruba o número

---
:: destaque
## a regra que eu uso
> Quem manda a primeira mensagem?
Se é você, em volume, vá de oficial. Se é o cliente, a não oficial costuma
servir.

---
:: conteudo
## e se eu escolher errado?
Dá para trocar depois.

Nos meus sistemas o WhatsApp é uma **porta plugada no núcleo**: troca a porta,
as regras do negócio continuam as mesmas.

---
:: cta
# Não sabe qual serve para você?
> Me conte quem manda a primeira mensagem.
Eu digo qual API faz sentido no seu caso e quanto ela custa por mês, antes de
você decidir.
