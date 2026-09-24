// Todo o texto do site mora aqui. Os fatos vêm do site anterior (autarktech.com.br,
// repo ParkNow914.github.io) e do PRODUCT.md; nada aqui pode ser inventado.

export const WHATSAPP = "5512991743827";
export const EMAIL = "alimiguel1098@gmail.com";
export const GITHUB = "https://github.com/ParkNow914";
export const FREELAS = "https://www.99freelas.com.br/user/Alisson_sntsz";
export const SITE_URL = "https://autarktech.com.br";
export const REVISION = "Rev. 2026.09";

export function wa(text: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export const WA_DEFAULT = wa("Olá Alisson! Vi o site da Autark e quero conversar sobre um projeto.");

/** Seções na ordem do manual. `page` alimenta o contador "Pág. NN/TT" do cabeçalho. */
export const SECTIONS = [
  { id: "capa", address: "Capa", title: "Capa" },
  { id: "montagem", address: "§1", title: "Montagem" },
  { id: "aplicacoes", address: "§2", title: "Aplicações" },
  { id: "modelos", address: "§3", title: "Modelos" },
  { id: "sistemas", address: "§4", title: "Sistemas em operação" },
  { id: "instalacao", address: "§5", title: "Instalação" },
  { id: "dimensionamento", address: "§6", title: "Dimensionamento" },
  { id: "campo", address: "§7", title: "Relatório de campo" },
  { id: "fabricante", address: "§8", title: "Fabricante" },
  { id: "problemas", address: "§9", title: "Solução de problemas" },
  { id: "garantia", address: "§10", title: "Garantia" },
  { id: "assistencia", address: "§11", title: "Assistência técnica" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/**
 * Endereços da home anterior (até set/2026) que seguem vivos em bios, anúncios,
 * mensagens antigas e buscadores. Cada um cai na seção equivalente do manual.
 */
export const LEGACY_ANCHORS: Partial<Record<SectionId, readonly string[]>> = {
  montagem: ["mecanismo"],
  aplicacoes: ["para-quem"],
  modelos: ["servicos"],
  sistemas: ["projetos"],
  instalacao: ["processo"],
  dimensionamento: ["calculadora"],
  campo: ["depoimentos"],
  fabricante: ["sobre"],
  problemas: ["faq"],
  assistencia: ["contato"],
};

export const COVER = {
  title: "Sistemas que trabalham sozinhos enquanto você cresce.",
  lede:
    "Atendimento feito na mão perde venda fora do horário. A Autark instala no seu WhatsApp uma IA ligada aos seus sistemas, que atende, vende e agenda a qualquer hora, e só vai ao ar depois de testada.",
  plate: [
    { k: "Fabricante", v: "Alisson Santos" },
    { k: "Avaliação", v: "5.0 no 99freelas", star: true },
    { k: "Recomendação", v: "100% dos clientes" },
    { k: "Em produção real", v: "3 sistemas" },
    { k: "SaaS próprios", v: "6 construídos" },
  ],
};

/** Peças da Fig. 1. `n` é o número do balão; a ordem de montagem está em ASSEMBLY. */
export const PARTS = [
  { n: 1, name: "Núcleo de regras", role: "Preço, regra, agenda e estoque num lugar só" },
  { n: 2, name: "Porta WhatsApp", role: "Canal de atendimento" },
  { n: 3, name: "Porta Telegram", role: "Canal de atendimento" },
  { n: 4, name: "Porta Web", role: "Loja ou agendamento pelo site (PWA)" },
  { n: 5, name: "Conector de banco", role: "Postgres, Supabase" },
  { n: 6, name: "Conector de pagamento", role: "PIX, Stripe, Mercado Pago" },
  { n: 7, name: "Conector de agenda", role: "Horários e lembretes" },
  { n: 8, name: "Bancada de testes", role: "Uma regra, um teste" },
  { n: 9, name: "Tampa e parafusos", role: "Fechamento e documentação" },
] as const;

export const ASSEMBLY_INTRO =
  "Bot qualquer um vende. O que segura um sistema no mundo real são três decisões de arquitetura que entram em todo projeto da Autark. Chamo o conjunto de Cérebro Autark. Role a página e acompanhe a montagem.";

export const ASSEMBLY = [
  {
    parts: [1],
    title: "Um cérebro no centro",
    body:
      "A lógica do seu negócio mora num lugar só: preço, regra de desconto, horário de atendimento e estoque. Todo canal consulta o mesmo núcleo, então a resposta é a mesma no WhatsApp, no site e no balcão.",
  },
  {
    parts: [2, 3, 4],
    title: "Canais que encaixam",
    body:
      "WhatsApp, Telegram e site entram como portas plugadas no núcleo. Você soma ou troca um canal sem reescrever regra nenhuma.",
    proof:
      "Na Bia, o WhatsApp do cliente caiu no meio do projeto. A loja web e o Telegram assumiram o atendimento sem mudar uma linha de regra de negócio.",
  },
  {
    parts: [5, 6, 7],
    title: "Ligado aos seus sistemas",
    body:
      "O fluxo conversa com seu banco, seu pagamento e sua agenda. Assim ele fecha o pedido sozinho e só chama um humano quando precisa.",
    proof: "PIX, Stripe e Mercado Pago rodando em operação real.",
  },
  {
    parts: [8],
    title: "Testado antes de você depender dele",
    body:
      "Cada regra vira um teste automatizado. O sistema entra no ar sabendo o que fazer e continua certo depois de cada mudança.",
    tests: [
      { label: "Bia", n: 487 },
      { label: "Acerto", n: 276 },
      { label: "Índice de Gestão", n: 85 },
    ],
  },
  {
    parts: [9],
    title: "Fechado e documentado",
    body:
      "Todo projeto sai testado e documentado. Depois do lançamento eu acompanho a estabilização, e a manutenção contínua fica disponível se você quiser evoluir o sistema.",
  },
  {
    parts: [],
    title: "Operando",
    body:
      "Lâmpada verde. O sistema atende, vende e agenda sozinho, 24 horas por dia, e você volta a cuidar do que só você faz.",
  },
] as const;

export const APPLICATIONS = {
  intro: "Cada cenário abaixo tem um sistema meu por trás, construído e entregue.",
  rows: [
    {
      who: "Salões, barbearias e clínicas",
      pain: "Você passa o dia respondendo “tem horário?” e ainda leva bolo.",
      fix: "A IA agenda, confirma e lembra o cliente 24h e 2h antes.",
      ref: "SYS-01",
    },
    {
      who: "Corretoras e financeiras",
      pain: "O lead que espera resposta fecha com o concorrente.",
      fix: "Um CRM no WhatsApp oficial da Meta atende, qualifica e registra tudo com auditoria e LGPD.",
      ref: "SYS-02",
    },
    {
      who: "Delivery e comércio local",
      pain: "Alguém fica preso no balcão anotando pedido no papel.",
      fix: "O bot recebe o pedido, calcula a taxa, cobra e manda para a cozinha, em qualquer canal.",
      ref: "SYS-05",
    },
    {
      who: "Escritórios e profissionais liberais",
      pain: "Horas perdidas em triagem e leitura de documento.",
      fix: "A IA faz a primeira triagem 24h e resume documentos com a fonte citada.",
      ref: "SYS-03",
    },
    {
      who: "Quem investe em tráfego pago",
      pain: "O anúncio traz o lead e ele cai num formulário sem resposta.",
      fix: "Landing de alta conversão, WhatsApp e rastreamento completo para medir cada real.",
      ref: "SYS-08",
    },
    {
      who: "Qualquer negócio com tarefa repetitiva",
      pain: "Uma tarefa manual come as horas da sua equipe.",
      fix: "Se dá para descrever a regra, dá para automatizar, ligado aos sistemas que você já usa.",
      ref: "§6",
    },
  ],
};

export const MODELS = {
  intro:
    "Seis configurações cobrem do primeiro “oi” no WhatsApp ao anúncio rodando. Toda entrega sai testada, documentada e pensada para se pagar.",
  items: [
    {
      code: "MOD-A",
      name: "Atendimento com IA no WhatsApp e Telegram",
      body:
        "Atendimento em linguagem natural, por texto e áudio, com pedido no carrinho, agendamento, pagamento por PIX e passagem para um humano quando precisa. Funciona no WhatsApp, no Telegram ou na loja web com o mesmo cérebro.",
      parts: ["n8n", "Evolution API", "Meta Cloud API", "GPT, Claude, Gemini"],
    },
    {
      code: "MOD-B",
      name: "SaaS e sistemas completos",
      body:
        "Plataforma multiempresa com login, assinatura recorrente, painel administrativo, relatórios e LGPD, pronta para crescer.",
      parts: ["Next.js", "Node.js", "PostgreSQL", "Stripe, Mercado Pago"],
    },
    {
      code: "MOD-C",
      name: "Aplicações com IA",
      body:
        "Análise de documentos, RAG com a fonte citada e agentes de IA aplicados a problema real, como o JurisIA, suíte jurídica que está no ar.",
      parts: ["RAG", "Agentes", "APIs de IA"],
    },
    {
      code: "MOD-D",
      name: "Landing page e tráfego",
      body:
        "Página feita para converter e aparecer no Google, com GTM, GA4, Meta Pixel e Conversions API para cada campanha render mais.",
      parts: ["React ou WordPress", "GA4 + GTM", "Meta CAPI"],
    },
    {
      code: "MOD-E",
      name: "Automações e integrações",
      body:
        "Fluxos que ligam CRM, planilha, e-mail, pagamento e notificação, e tiram o trabalho manual do meio do caminho.",
      parts: ["n8n", "Webhooks", "APIs REST"],
    },
    {
      code: "MOD-F",
      name: "Manutenção e performance",
      body:
        "Correção de site, limpeza de malware, segurança e velocidade (Core Web Vitals), em projeto novo ou antigo.",
      parts: ["WordPress", "Segurança", "Core Web Vitals"],
    },
  ],
};

export type Status = "producao" | "entregue" | "encerrado" | "proprio";

export const STATUS_LABEL: Record<Status, string> = {
  producao: "Em produção",
  entregue: "Entregue",
  encerrado: "Encerrado pelo cliente",
  proprio: "Produto próprio",
};

export type SystemAction = { label: string; href: string; kind: "demo" | "chat" | "code" };

export type System = {
  code: string;
  name: string;
  kind: string;
  status: Status;
  statusNote?: string;
  metric: string;
  image: string;
  imageW: number;
  imageH: number;
  imageNote?: string;
  body: string;
  spec: { k: string; v: string }[];
  stack: string[];
  actions: SystemAction[];
  feature?: boolean;
};

export const SYSTEMS_INTRO =
  "Você quer ver funcionando, então aqui estão. Três rodam hoje com clientes. Os outros são produtos meus ou entregas concluídas, com código aberto ou demo ao vivo. Me chame no WhatsApp e eu abro qualquer um na sua frente.";

export const SYSTEMS: System[] = [
  {
    code: "SYS-01",
    name: "AgendaZap",
    kind: "SaaS · IA · WhatsApp",
    status: "producao",
    metric: "14 dias grátis",
    image: "/projetos/agendazap.webp",
    imageW: 1200,
    imageH: 744,
    feature: true,
    body:
      "Agenda inteligente para salão, barbearia e estética. O cliente marca sozinho pelo link público ou conversando com a atendente de IA no WhatsApp, que consulta horário, agenda e cancela sem ninguém encostar. Os lembretes de 24h e 2h antes derrubam o bolo, e as campanhas de inativos, aniversário e NPS seguram o cliente na base.",
    spec: [
      { k: "Arquitetura", v: "Multiempresa com RLS no Supabase" },
      { k: "Cobrança", v: "Assinatura no Mercado Pago, teste de 14 dias" },
      { k: "App", v: "PWA instalável" },
      { k: "Operação", v: "Monitoramento com Sentry, LGPD" },
    ],
    stack: ["Next.js 16", "React 19", "Supabase", "Gemini", "Evolution API", "Mercado Pago"],
    actions: [
      { label: "Abrir a demo", href: "https://agendazap-three.vercel.app", kind: "demo" },
      { label: "Testar um agendamento", href: "https://agendazap-three.vercel.app/b/demo", kind: "demo" },
    ],
  },
  {
    code: "SYS-02",
    name: "CRM de WhatsApp",
    kind: "CRM · API oficial da Meta",
    status: "encerrado",
    statusNote: "Entregue. O cliente encerrou a operação por custo de infraestrutura.",
    metric: "12 workflows de CI",
    image: "/projetos/crm.webp",
    imageW: 1200,
    imageH: 744,
    feature: true,
    body:
      "Inbox omnichannel e CRM para WhatsApp Business que rodou em operação financeira real, com campanhas sob governança de templates, motor de elegibilidade, opt-out, auditoria completa e retenção LGPD automática. Ficava no Fly.io em São Paulo, com duas máquinas sempre ligadas e cerca de 28 ms até o banco. O sistema seguia estável até o dia do desligamento.",
    spec: [
      { k: "CI", v: "12 workflows no GitHub Actions" },
      { k: "Testes", v: "E2E com Playwright, CodeQL, Trivy + SBOM" },
      { k: "Operação", v: "Backup diário e deploy a cada push" },
      { k: "Latência", v: "~28 ms até o banco, zero cold start" },
    ],
    stack: ["Fastify", "React", "Prisma", "Postgres 17", "BullMQ + Redis", "Fly.io"],
    actions: [
      {
        label: "Conversar sobre este projeto",
        href: wa("Olá Alisson! Quero saber mais sobre o CRM de WhatsApp com a API oficial da Meta."),
        kind: "chat",
      },
    ],
  },
  {
    code: "SYS-03",
    name: "JurisIA",
    kind: "IA jurídica · SaaS B2B",
    status: "proprio",
    metric: "4 produtos em 1",
    image: "/projetos/jurisia.webp",
    imageW: 1200,
    imageH: 744,
    feature: true,
    body:
      "Suíte de automação para advogados e escritórios, com quatro produtos: JurisBot faz atendimento 24h e triagem de leads no WhatsApp, JurisDoc gera peças jurídicas com IA em streaming, JurisData faz jurimetria com dados do TJSP e JurisGrow cuida da gestão de leads. A análise de documentos usa RAG e sempre cita a fonte.",
    spec: [
      { k: "Filas", v: "BullMQ + Redis" },
      { k: "Cobrança", v: "Recorrente pelo Stripe" },
      { k: "Planos", v: "De R$ 297 a R$ 1.200 por mês" },
    ],
    stack: ["Next.js", "Hono + Bun", "Drizzle", "BullMQ", "Stripe", "RAG"],
    actions: [{ label: "Ver a demo no chat", href: wa("Olá Alisson! Quero ver a demo do JurisIA."), kind: "chat" }],
  },
  {
    code: "SYS-04",
    name: "ParkNow",
    kind: "SaaS B2B2C · web + mobile",
    status: "proprio",
    metric: "web + mobile",
    image: "/projetos/parknow.webp",
    imageW: 1080,
    imageH: 670,
    body:
      "Estacionamento inteligente em monorepo. Tem painel B2B em Next.js, app B2C em React Native com Expo que funciona offline e Supabase com PostGIS para geolocalização. O backend mostra o mapa em tempo real com Socket.IO, expira reservas sozinho e gera o PIX com BR Code local, sem gateway pago.",
    spec: [
      { k: "Segurança", v: "JWT + refresh httpOnly, Argon2id, rate limiting" },
      { k: "CI/CD", v: "CodeQL" },
      { k: "Infra", v: "100% em serviços always-free" },
    ],
    stack: ["Turborepo", "Next.js", "React Native", "Expo", "Supabase + PostGIS", "Socket.IO", "PIX"],
    actions: [{ label: "Ver o código", href: "https://github.com/ParkNow914/ParkNow", kind: "code" }],
  },
  {
    code: "SYS-05",
    name: "Bia",
    kind: "Delivery multicanal · IA",
    status: "entregue",
    statusNote: "Cliente real: supermercado de bairro.",
    metric: "487 testes verdes",
    image: "/projetos/bia.webp",
    imageW: 1080,
    imageH: 670,
    feature: true,
    body:
      "Delivery completo para supermercado de bairro, com catálogo de 6.438 produtos importado do ERP, carrinho com taxa dinâmica, checkout, cupom impresso direto na Epson do balcão e acompanhamento do pedido. Loja web, Telegram e WhatsApp caem no mesmo cérebro, e por isso o WhatsApp do cliente pôde sair do projeto sem quebrar nada.",
    spec: [
      { k: "Testes", v: "487 automatizados, todos verdes" },
      { k: "Runtime", v: "Node.js puro, zero dependência" },
      { k: "Segurança", v: "Preço e taxa recalculados no servidor" },
      { k: "Impressão", v: "ESC/POS direto na impressora do balcão" },
    ],
    stack: ["Node.js", "PWA", "Telegram API", "Meta Cloud API", "ESC/POS"],
    actions: [{ label: "Ver a demo no chat", href: wa("Olá Alisson! Quero ver a demo da Bia (delivery)."), kind: "chat" }],
  },
  {
    code: "SYS-06",
    name: "FlowHub",
    kind: "CRM SaaS · código aberto",
    status: "proprio",
    metric: "command palette ⌘K",
    image: "/projetos/flowhub.webp",
    imageW: 1200,
    imageH: 744,
    body:
      "CRM para pequenos negócios, com leads pontuados e importação CSV, pipeline kanban de arrastar e soltar, tarefas, dashboard, command palette, notificações, modo escuro e quatro papéis de acesso. Toda alteração vai para o audit log com o antes e o depois.",
    spec: [{ k: "Acesso", v: "RBAC com Owner, Admin, Member e Viewer" }],
    stack: ["Next.js 15", "TypeScript", "Prisma", "PostgreSQL", "shadcn/ui"],
    actions: [{ label: "Ver o código", href: "https://github.com/ParkNow914/flowhub", kind: "code" }],
  },
  {
    code: "SYS-07",
    name: "Marvet",
    kind: "Site e catálogo · SEO",
    status: "entregue",
    statusNote: "Cliente real: agropecuária de Santa Catarina.",
    metric: "1 arquivo = 1 página",
    image: "/projetos/marvet.webp",
    imageW: 1080,
    imageH: 670,
    body:
      "Site e catálogo de uma agropecuária que vende mudas de capim para o Brasil inteiro. Cada cultivar ganhou página própria, com ficha técnica, dúvidas e pedido de orçamento, porque quem busca “muda de tifton 85” precisa cair numa página sobre tifton 85. Para adicionar uma cultivar, basta editar um arquivo e a página, o SEO e o sitemap aparecem sozinhos.",
    spec: [{ k: "Conversão", v: "Todo caminho leva ao WhatsApp já preenchido" }],
    stack: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4"],
    actions: [{ label: "Ver no chat", href: wa("Olá Alisson! Quero ver o site da Marvet."), kind: "chat" }],
  },
  {
    code: "SYS-08",
    name: "RealCred+",
    kind: "Landing + simulador",
    status: "entregue",
    statusNote: "Em uso pela corretora.",
    metric: "funil 100% rastreado",
    image: "/projetos/realcredmais.webp",
    imageW: 1080,
    imageH: 670,
    body:
      "Landing de conversão para corretora de crédito, com simulador de consignado e calculadora de portabilidade que mostram o número na hora, WhatsApp direto e formulário por e-mail. GTM, GA4, Meta Pixel e Conversions API medem cada real de anúncio até a conversa.",
    spec: [{ k: "Rastreamento", v: "GTM, GA4, Meta Pixel e CAPI" }],
    stack: ["JavaScript", "Node.js", "GTM + GA4", "Meta CAPI"],
    actions: [{ label: "Ver o código", href: "https://github.com/ParkNow914/realcredmais", kind: "code" }],
  },
  {
    code: "SYS-09",
    name: "Índice de Gestão",
    kind: "Diagnóstico · agronegócio",
    status: "producao",
    metric: "85 testes",
    image: "/projetos/tratto.webp",
    imageW: 1200,
    imageH: 744,
    imageNote: "Capa ilustrada. O print real mostraria a marca do cliente.",
    body:
      "Diagnóstico para consultoria do agronegócio familiar. As 38 perguntas viram nota por pilar, estágio de maturidade e até três prioridades de ação. Nenhum texto sai de IA: as 190 alternativas e os 18 textos de pilar nascem dos documentos do cliente, e o mesmo relatório sai na tela, em PDF e por e-mail.",
    spec: [
      { k: "Dados", v: "RLS forçado nas 6 tabelas" },
      { k: "LGPD", v: "Consentimento com data, hora e IP" },
    ],
    stack: ["Next.js", "Supabase + RLS", "@react-pdf", "Resend", "RD Station"],
    actions: [
      { label: "Ver funcionando no chat", href: wa("Olá Alisson! Quero ver o Índice de Gestão funcionando."), kind: "chat" },
    ],
  },
  {
    code: "SYS-10",
    name: "Acerto",
    kind: "SaaS · crédito consignado",
    status: "proprio",
    statusNote: "Demo aberta.",
    metric: "276 testes",
    image: "/projetos/acerto.webp",
    imageW: 1200,
    imageH: 744,
    feature: true,
    body:
      "Gestão de comissão para promotoras de crédito consignado e correspondentes bancários. A promotora precisa provar cada comissão, e o sistema foi desenhado para isso: aritmética inteira, tabelas versionadas, splits, cinco tipos de estorno e fechamento mensal com saldo que rola.",
    spec: [
      { k: "Testes", v: "276 (263 unidade e integração, 13 ponta a ponta)" },
      { k: "Segurança", v: "RLS multiempresa, 2FA TOTP, RBAC" },
      { k: "Auditoria", v: "Hash-encadeada" },
      { k: "LGPD", v: "Dossiê, anonimização e portabilidade" },
    ],
    stack: ["Next.js", "Drizzle", "PostgreSQL", "RLS multi-tenant", "2FA TOTP"],
    actions: [{ label: "Abrir a demo", href: "https://acerto-comissao.netlify.app", kind: "demo" }],
  },
];

export const PROOFS = {
  title: "Provas de conceito",
  intro:
    "Código público que escrevi para sustentar um argumento numa conversa técnica. Não são entregas de cliente, e estão aqui porque mostram como eu penso antes de construir.",
  items: [
    {
      name: "PDV em maquininha: o que fazer quando a rede cai",
      body:
        "O PDV cai em produção quando o timeout faz o operador passar o cartão duas vezes. A defesa tem três regras: gravar a intenção antes de chamar a maquininha, gerar a chave de idempotência no app e, na dúvida, consultar em vez de reenviar.",
      tags: ["Kotlin", "SDK Cielo Lio", "Idempotência"],
      link: { label: "Abrir o simulador", href: `${SITE_URL}/pdv-lio-demo/` },
    },
    {
      name: "Atendimento em camadas, montado por API",
      body:
        "Entrada, automação, chatbot, IA e humano. Cada pedido se resolve no nível mais simples e barato possível e só sobe de camada quando precisa, em vez de pagar token de IA para responder o horário de funcionamento.",
      tags: ["Make.com", "Blueprint por API", "PowerShell"],
      link: { label: "Ver arquitetura e blueprint", href: "https://github.com/ParkNow914/make-atendimento-camadas" },
    },
    {
      name: "Configurador visual em camadas",
      body:
        "Personalização de uniforme em tempo real, com base fixa, cor dinâmica e camadas que se recombinam sem gerar uma imagem por variação. É um arquivo só, sem dependência, e abre na hora até em conexão ruim.",
      tags: ["HTML + SVG", "Zero dependências"],
      link: { label: "Abrir o configurador", href: `${SITE_URL}/configurador-camadas/` },
    },
  ],
};

export const OTHER_WORK = [
  { name: "Importação de XML para banco SQL", body: "Mapeamento campo a campo de vários arquivos XML para um schema existente, sem retrabalho manual.", date: "ago/2026" },
  { name: "Site jurídico: GA4, blog e conversão", body: "Segunda etapa de melhorias num site de escritório de advocacia já publicado.", date: "ago/2026" },
  { name: "Publicação de página e responsividade", body: "Página nova publicada no domínio existente, testada no ambiente real e com o botão ligado ao WhatsApp.", date: "ago/2026" },
];

export const LAB = {
  title: "Laboratório Poliglota",
  body:
    "Fora do trabalho com cliente eu mantenho um laboratório aberto, com um programa por linguagem, escolhido para mostrar o que só aquela linguagem faz bem. Você abre e usa no navegador, sem instalar nada. São estudos, com todo o código aberto.",
  figures: [
    { v: "67", k: "linguagens" },
    { v: "88", k: "projetos mapeados" },
    { v: "100%", k: "código aberto" },
  ],
  href: `${SITE_URL}/lab/`,
};

export const INSTALL = {
  intro:
    "O medo de contratar dev é pagar e ver o cara sumir. Aqui você recebe escopo e prazo por escrito e acompanha o sistema funcionando ao longo do caminho.",
  steps: [
    {
      title: "Diagnóstico",
      body: "Uma conversa direta no WhatsApp para entender o resultado que o projeto precisa gerar, além do que você quer construir.",
    },
    {
      title: "Proposta por escrito",
      body: "Escopo, prazo e valor fechados por escrito. Você sabe o que vai receber e quando, antes de qualquer pagamento.",
    },
    {
      title: "Entregas visíveis",
      body: "Você acompanha versões funcionando ao longo do projeto e aprova cada etapa. Ninguém some por semanas.",
    },
    {
      title: "Entrega e suporte",
      body: "Projeto publicado, testado e documentado. Depois do lançamento eu acompanho a estabilização.",
    },
  ],
  requirements: [
    "Uma conversa inicial de 20 a 30 minutos",
    "Acesso ao que o sistema vai usar: número de WhatsApp, site, planilha",
    "Uma resposta rápida quando eu mandar algo para você aprovar",
  ],
  times: [
    { k: "Landing page ou automação", v: "dias" },
    { k: "SaaS completo", v: "semanas" },
  ],
};

export const SIZING = {
  intro:
    "Ajuste os valores e veja quanto sua equipe gasta por ano com atendimento e tarefas repetitivas, e quanto uma automação devolve.",
  note: "Considera 22 dias úteis por mês e automação de cerca de 70% das tarefas. Estimativa educativa, sem valor de proposta: o número real depende do seu processo.",
};

export const FIELD = {
  intro:
    "Sete avaliações no 99freelas, todas 5.0, com 100% de recomendação. Cinco estão abaixo, copiadas como o cliente escreveu, e dá para conferir todas no perfil público.",
  items: [
    {
      quote:
        "Excelente profissional! Desde o início, demonstrou muita organização, agilidade e compromisso com o projeto. A comunicação foi clara durante todo o processo, cumpriu os prazos combinados e entregou um trabalho de altíssima qualidade. Além de ser muito rápido, é extremamente competente, atencioso e sempre disposto a realizar os ajustes necessários para que o resultado fique exatamente como esperado. Superou minhas expectativas e mostrou que realmente entende do que faz.",
      project: "Landing page em Next.js (Marvet)",
      date: "ago. 2026",
    },
    {
      quote:
        "Recomendo a todos, um ótimo profissional e de muito conhecimento, sempre atendendo com rapidez todas as demandas solicitadas.",
      project: "Fluxo para delivery de supermercado",
      date: "jul. 2026",
    },
    {
      quote: "Muito prestativo e profissional, sem dúvidas se precisar novamente voltarei a contratar os serviços dele, super recomendo!!!",
      project: "Landing page para produto low ticket",
      date: "jun. 2026",
    },
    {
      quote: "Pontual, organizado e muito profissional! Excelente trabalho!",
      project: "Análise de imagens MEV com Python",
      date: "mai. 2026",
    },
    {
      quote: "Conclusão rapida e eficiente, com experincia incrivel.",
      project: "Importação de XML para banco SQL",
      date: "ago. 2026",
    },
  ],
};

export const MAKER = {
  title: "A Autark é uma pessoa só, e é por isso que funciona.",
  body: [
    "Você não passa por agência, gerente de conta nem cinco camadas até chegar em quem faz. Quem atende, constrói e entrega sou eu, Alisson Santos.",
    "Antes de abrir o editor eu entendo o objetivo de negócio do projeto. Esse hábito vem da minha formação em Gestão da Tecnologia da Informação: a conversa começa pelo resultado que você precisa e só depois chega no código.",
    "No dia a dia uso React, Next.js, Node.js, TypeScript e PostgreSQL no full-stack, n8n, Evolution API e modelos de IA (GPT, Claude, Gemini) nas automações, e WordPress com tráfego pago quando o objetivo é captar cliente rápido. Com isso eu cubro o projeto inteiro, da ideia ao anúncio rodando.",
  ],
  card: [
    { k: "Nome", v: "Alisson Santos" },
    { k: "Função", v: "Full-stack, automação e IA" },
    { k: "Formação", v: "Gestão da Tecnologia da Informação" },
    { k: "Base", v: "Lorena, SP, atendendo o Brasil inteiro" },
    { k: "Resposta", v: "No mesmo dia" },
  ],
};

export const TROUBLESHOOTING = [
  {
    q: "Quanto custa um projeto?",
    a: "Depende do escopo, e o valor fica fechado por escrito antes de começar. Automação simples e landing page custam menos; um SaaS completo é projeto maior. Mande sua ideia no WhatsApp e eu passo uma estimativa rápida e honesta.",
  },
  {
    q: "Em quanto tempo fica pronto?",
    a: "Uma landing page ou automação costuma sair em dias, e um SaaS completo em semanas. No diagnóstico você já recebe um cronograma realista, com entregas visíveis ao longo do caminho.",
  },
  {
    q: "Quantos projetos você pega por vez?",
    a: "Poucos, de propósito. Como sou eu quem atende e constrói, trabalho com poucos projetos ao mesmo tempo para responder no mesmo dia e cumprir prazo. Se a agenda estiver cheia quando você chamar, eu aviso na hora em vez de aceitar e atrasar.",
  },
  {
    q: "O que você precisa de mim durante o projeto?",
    a: "Menos do que parece: uma conversa inicial de 20 a 30 minutos, acesso ao que o sistema vai usar e uma resposta rápida quando eu pedir aprovação. Você não precisa entender de tecnologia para tocar o projeto.",
  },
  {
    q: "Você usa APIs oficiais e métodos seguros?",
    a: "Sim. No WhatsApp trabalho com a API oficial da Meta (Cloud API) ou com a Evolution API, conforme o caso, sempre com consentimento, opt-out e LGPD. Sem lista comprada, sem spam e sem técnica que arrisque bloquear seu número.",
  },
  {
    q: "O sistema fica caro para manter?",
    a: "Na maioria dos casos, não. Eu priorizo serviços com camada gratuita, como Supabase, Cloudflare, Oracle Cloud e Fly.io, então você começa pagando pouco ou nada de infraestrutura e o custo só cresce junto com o projeto.",
  },
  {
    q: "Depois de entregue, eu fico na mão?",
    a: "Não. O projeto sai testado e documentado, e eu acompanho a estabilização depois do lançamento. Se você quiser evoluir o sistema com o tempo, também ofereço manutenção contínua.",
  },
  {
    q: "Você trabalha remoto? De onde?",
    a: "Trabalho 100% remoto, de Lorena (SP), para o Brasil inteiro. A conversa acontece no WhatsApp e em chamada quando precisa, com resposta no mesmo dia.",
  },
];

export const WARRANTY = [
  {
    title: "Primeira entrega cedo",
    body:
      "Você vê o sistema funcionando antes do fim do projeto. Se nesse ponto não fizer sentido continuar, a gente encerra ali: você fica com o que já foi entregue e não paga o restante. Nunca precisei usar esta cláusula, mas ela existe para o risco não ficar todo com você.",
  },
  {
    title: "Tudo por escrito",
    body: "Escopo, prazo e valor ficam fechados por escrito antes de qualquer pagamento.",
  },
  {
    title: "Acompanhamento depois do lançamento",
    body: "Eu acompanho a estabilização do sistema no ar. Manutenção contínua fica disponível para quem quer evoluir.",
  },
  {
    title: "Método seguro",
    body: "APIs oficiais, consentimento, opt-out e LGPD. Nada de lista comprada ou spam que coloque seu número em risco.",
  },
];

export const ASSISTANCE = {
  title: "Seu próximo sistema começa com uma mensagem.",
  body: "Conte o que você precisa automatizar ou construir. Eu respondo no mesmo dia e já te mostro um projeto parecido funcionando.",
  promises: ["Escopo e prazo por escrito", "Resposta no mesmo dia", "Infraestrutura gratuita quando dá"],
};
