# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js com App Router e TypeScript, export estático publicado no GitHub Pages. O 3D usa Three.js via React Three Fiber; a rolagem é nativa. Estado conferido na fonte em 02/11/2026.

Contexto histórico da migração: o domínio `autarktech.com.br` hoje é servido pelo GitHub Pages (repo `ParkNow914/ParkNow914.github.io`), e outros repos publicam no mesmo domínio: `/lab/`, `/configurador-camadas/`, `/pdv-lio-demo/`, além das landings `/lp/agenda/`, `/lp/atendimento/`, `/lp/juridico/` e `/lp/delivery/`. Antes de apontar o domínio para a Vercel, essas rotas precisam continuar respondendo, seja por rewrite, por export estático no próprio Pages ou por migração.

## Users

Donos de pequenos e médios negócios no Brasil que perdem venda e tempo no atendimento manual, confirmado em 23/09/2026. Os cenários cobertos por entregas, produtos próprios e demonstrações:
- salões, barbearias e clínicas (agenda);
- corretoras e financeiras (CRM de WhatsApp com a API oficial);
- delivery e comércio local (pedido multicanal);
- escritórios e profissionais liberais (triagem e documentos com IA);
- quem investe em tráfego pago (landing, WhatsApp e rastreamento).

Chegam frios, vindos do Instagram (@autark.tech, em geral pelo celular de 360px), de anúncio ou de busca. Precisam de prova antes de conversa. O sucesso é abrir uma conversa no WhatsApp.

## Product Purpose

A Autark é o estúdio de automação com IA de Alisson Santos. Ela instala sistemas que atendem, vendem e agendam sozinhos (WhatsApp com IA, SaaS completos, integrações) e os entrega testados e documentados. O site é a vitrine comercial: transforma visitante desconfiado em conversa no WhatsApp mostrando sistemas reais funcionando.

## Positioning

- **Uma pessoa só: atende, constrói e entrega.** Não há agência nem camadas. O "CEO" foi recusado de propósito, porque contradiz o argumento.
- **Evidência com contexto.** Identificar entregas para clientes, produtos próprios e provas de conceito. Demos e código só são anunciados quando disponíveis. Contagens históricas de testes não equivalem a uma execução atual.
- **O "Cérebro Autark":** um cérebro de regras de negócio com canais plugáveis, cada regra virando teste antes do ar, e integração real com banco, pagamento e agenda.
- **Honestidade operacional como marca.** O card do CRM diz que o cliente encerrou a operação. Card que promete demo inexistente é "a única mentira que a página não pode contar".

## Operating Context

- O visitante decide pelo celular, muitas vezes vindo do Instagram. Largura crítica: 360px.
- Atendimento remoto e assíncrono, normalmente das 19h às 00h, todos os dias (Brasília). Horas reservadas e prazo de resposta são combinados por projeto; não oferecer chamadas, visitas ou plantão 24h.
- A conversão acontece fora do site, no WhatsApp `5512991743827`, com mensagem pré-preenchida por contexto (projeto, calculadora, formulário).
- A UTM de entrada (`utm_source/medium/campaign`) é carimbada na mensagem do WhatsApp para medir a origem da conversa.
- A calculadora de ROI é uma ferramenta educativa: horas/dia × pessoas × custo/hora, 22 dias úteis e ~70% automatizável.

## Capabilities and Constraints

- Todo CTA de WhatsApp funciona sem JavaScript: o `href` real fica hardcoded e o JS só enriquece o texto.
- LGPD coerente com o que se vende: nenhum request a terceiros sem necessidade, fontes self-hosted, nenhum tracker na página principal. O rastreamento de anúncio fica confinado às landings `/lp/`.
- Segurança: CSP restritiva e `form-action 'none'`. O formulário monta a mensagem e abre o WhatsApp, sem backend.
- Qualidade mínima herdada da CI atual: Lighthouse desktop com performance e boas práticas ≥ 90 e a11y/SEO ≥ 95; mobile com performance ≥ 80. Sem rolagem horizontal de 320 a 1440px, exatamente um `h1` e JSON-LD de Person, ProfessionalService, WebSite e FAQPage, sem `aggregateRating`.
- A página continua legível se o JS falhar (conteúdo não depende de animação para aparecer).
- Só português por enquanto. Inglês fica para depois (o site atual tem `?lang=en`).
- Contatos: WhatsApp `5512991743827`, e-mail `contato@autarktech.com.br` (encaminha para o Gmail pelo ImprovMX), GitHub `github.com/ParkNow914`, 99freelas `99freelas.com.br/user/Alisson_sntsz`.

## Brand Commitments

- Nome **Autark**, domínio `autarktech.com.br`, Instagram `@autark.tech`, pessoal `@sntsz.alisson`.
- Logo: o "A" vetorial em `assets/logo-mark.svg`, com gradiente #34d399 → #22d3ee. Desenho original, sem licença de terceiro.
- Frase-âncora: "Sistemas que trabalham sozinhos enquanto você cresce."
- Voz: direta, técnica sem jargão para o dono do negócio, sempre com o número concreto, contraste com o jeito comum de fazer e humildade factual (conta o que deu errado). Português do Brasil coloquial-profissional ("pra", "você").
- Assinatura: "construído à mão, sem template."

## Evidence on Hand

- Projetos feitos para agências parceiras (white-label) nunca aparecem no site, nem anônimos com detalhe que identifique o cliente final.

- 9 sistemas com texto, métricas e stack no site atual:
  - AgendaZap: produto próprio com demonstração pública, demo `agendazap-three.vercel.app` e agendamento em `/b/demo`.
  - CRM WhatsApp Meta: entregue e encerrado pelo cliente; dados e acessos preservados.
  - JurisIA: produto próprio, 4 produtos, planos de R$297 a R$1.200/mês.
  - ParkNow: produto próprio, GitHub.
  - Bia: cliente real, loja web e Telegram, catálogo do ERP, Docker/VPS Linux. WhatsApp não foi ativado no cliente. Contagens de catálogo e testes nas notas de setembro são históricas.
  - FlowHub: código aberto, GitHub.
  - RealCred+: landing e simulador, GitHub.
  - Índice de Gestão: entregue para cliente; acesso restrito e apresentação sem dados identificáveis.
  - Acerto: produto próprio, disponibilidade de demo com dados fictícios sob consulta. Não prometer acesso aberto sem confirmação.
- 3 demonstrações técnicas: PDV Cielo Lio (`/pdv-lio-demo/`), atendimento em camadas (Make.com, GitHub) e configurador visual (`/configurador-camadas/`).
- Laboratório Poliglota em `/lab/`, com um projeto por linguagem rodando no navegador.
- 6 depoimentos reais do 99freelas. São 12 avaliações, todas 5.0, com 100% de recomendação e 12 projetos concluídos (conferido em 02/11/2026), e são verificáveis. Não inventar outros.
- Prints reais em `ref/ParkNow914.github.io/assets/*.webp`. Tratto e Acerto são capas ilustradas, porque o print real mostraria a marca do cliente. A foto do Alisson está em `foto-square.webp`.
- Números do hero: nota 5.0, 12 projetos concluídos e 12 recomendações no 99freelas (02/11/2026), 9 sistemas apresentados. Não afirmar contagem de sistemas atualmente em produção sem verificação.
- Não existem e não podem ser inventados: logos de clientes, estudos de caso com receita, prêmios, imprensa, preços fechados por projeto.

## Product Principles

1. **Mostrar funcionando vence explicar.** Todo argumento aponta para algo que roda (demo, número, código).
2. **Nunca prometer o que a página não pode provar.** Status de cada sistema é o real, inclusive o que acabou.
3. **O dono do negócio entende sem ser técnico**, e o técnico que olhar reconhece o rigor.
4. **O site pratica o que vende:** rápido, seguro, acessível, respeitando a LGPD e funcionando sem JS.
5. **A pessoa por trás é o diferencial.** Alisson atende, constrói e entrega, e o site deixa isso claro.

## Accessibility & Inclusion

WCAG 2.2 AA em todo texto (contraste medido), `prefers-reduced-motion` respeitado em toda animação (inclusive 3D e scroll), navegação completa por teclado, skip-link, menu mobile com Esc e retorno de foco, e alvos de toque adequados no celular.
