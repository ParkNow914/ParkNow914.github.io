// Todo o texto do site mora aqui. Os fatos vêm do site anterior (autarktech.com.br,
// repo ParkNow914.github.io) e do PRODUCT.md; nada aqui pode ser inventado.

export const WHATSAPP = "5512991743827";
export const EMAIL = "contato@autarktech.com.br";
export const GITHUB = "https://github.com/ParkNow914";
export const FREELAS = "https://www.99freelas.com.br/user/Alisson_sntsz";
export const INSTAGRAM = "https://www.instagram.com/autark.tech/";
export const LINKEDIN = "https://www.linkedin.com/in/alisson-santos-70a327270";
export const SITE_URL = "https://autarktech.com.br";
export const REVISION = "Rev. 2026.11";

export function wa(text: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export const WA_DEFAULT = wa("Olá Alisson! Vi o site da Autark e quero conversar sobre um projeto.");

/**
 * Seções na ordem do manual. `page` alimenta o contador "Pág. NN/TT" do cabeçalho.
 * `hint` traduz o título do manual para quem não fala a língua dele; aparece só no índice.
 */
export const SECTIONS = [
  { id: "capa", address: "Capa", title: "Capa", hint: "" },
  { id: "montagem", address: "§1", title: "Montagem", hint: "como o sistema funciona" },
  { id: "aplicacoes", address: "§2", title: "Aplicações", hint: "para quem é" },
  { id: "modelos", address: "§3", title: "Modelos", hint: "o que eu faço" },
  { id: "sistemas", address: "§4", title: "Projetos e sistemas", hint: "" },
  { id: "instalacao", address: "§5", title: "Instalação", hint: "como trabalho" },
  { id: "dimensionamento", address: "§6", title: "Dimensionamento", hint: "calculadora de economia" },
  { id: "campo", address: "§7", title: "Relatório de campo", hint: "avaliações dos clientes" },
  { id: "fabricante", address: "§8", title: "Fabricante", hint: "quem eu sou" },
  { id: "problemas", address: "§9", title: "Solução de problemas", hint: "perguntas frequentes" },
  { id: "garantia", address: "§10", title: "Garantia", hint: "" },
  { id: "assistencia", address: "§11", title: "Assistência técnica", hint: "contato" },
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
    { k: "Recomendação", v: "12 no 99freelas" },
    { k: "Projetos concluídos", v: "12 no 99freelas" },
    { k: "No portfólio", v: "9 sistemas" },
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
      "Na Bia, uma restrição prévia no WhatsApp do cliente levou à entrega pela loja web e pelo Telegram. O núcleo de regras ficou separado dos canais.",
  },
  {
    parts: [5, 6, 7],
    title: "Ligado aos seus sistemas",
    body:
      "O fluxo conversa com seu banco, seu pagamento e sua agenda. Assim ele fecha o pedido sozinho e só chama um humano quando precisa.",
    proof: "A integração e seus custos são definidos conforme o provedor, as credenciais e o fluxo de cada projeto.",
  },
  {
    parts: [8],
    title: "Testado antes de você depender dele",
    body:
      "Regras críticas, permissões e integrações recebem testes proporcionais ao projeto. As mudanças são validadas em ambiente separado antes da publicação.",
    proof: "A entrega inclui o registro do que foi testado e das dependências que ainda exigem acesso ou aprovação.",
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
  intro: "Cenários cobertos por entregas para clientes, produtos próprios e demonstrações apresentados neste portfólio.",
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
      fix: "Landing, encaminhamento ao WhatsApp e integrações de analytics para acompanhar a campanha.",
      ref: "SYS-07",
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
  /** Endereço da página própria: /sistemas/<slug>/ */
  slug: string;
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
  "Entregas para clientes, produtos próprios e demonstrações, com o contexto de cada projeto. As fichas mostram recursos, tecnologia e código ou demo quando disponíveis. Sistemas de clientes são apresentados com materiais que preservam seus dados e acessos.";

export const SYSTEMS: System[] = [
  {
    code: "SYS-01",
    slug: "agendazap",
    name: "AgendaZap",
    kind: "SaaS · IA · WhatsApp",
    status: "proprio",
    metric: "14 dias grátis",
    image: "/projetos/agendazap.webp",
    imageW: 1200,
    imageH: 744,
    feature: true,
    body:
      "Produto próprio de agendamento para salão, barbearia e estética, com demonstração pública. Reúne agenda, página de reservas, recursos de atendimento com IA, lembretes e campanhas. As integrações externas dependem das credenciais e da configuração de cada operação.",
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
    slug: "crm-whatsapp",
    name: "CRM de WhatsApp",
    kind: "CRM · API oficial da Meta",
    status: "encerrado",
    statusNote: "Entregue. O cliente encerrou a operação por custo de infraestrutura.",
    metric: "templates e auditoria",
    image: "/projetos/crm.webp",
    imageW: 1200,
    imageH: 744,
    feature: true,
    body:
      "Inbox e CRM entregue para operação financeira, com governança de templates, regras de elegibilidade, opt-out, auditoria e políticas de retenção de dados. A operação foi encerrada pelo cliente. A apresentação do case preserva seus dados e acessos.",
    spec: [
      { k: "CI", v: "GitHub Actions" },
      { k: "Testes", v: "E2E com Playwright, CodeQL, Trivy + SBOM" },
      { k: "Operação", v: "Backup diário e deploy a cada push" },
      { k: "Processamento", v: "Filas com BullMQ e Redis" },
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
    slug: "jurisia",
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
    slug: "parknow",
    name: "ParkNow",
    kind: "SaaS B2B2C · web",
    status: "proprio",
    metric: "PIX sem gateway",
    image: "/projetos/parknow.webp",
    imageW: 1080,
    imageH: 670,
    body:
      "Estacionamento inteligente para motorista e dono de estacionamento. O mapa de vagas atualiza em tempo real com Socket.IO, a reserva expira sozinha quando o motorista não chega e o pagamento sai em PIX com BR Code gerado no próprio servidor, direto na chave do estacionamento, sem gateway pago.",
    spec: [
      { k: "Segurança", v: "JWT + refresh httpOnly, Argon2id, rate limiting" },
      { k: "CI/CD", v: "CodeQL" },
      { k: "Infra", v: "Configuração de infraestrutura no repositório" },
    ],
    stack: ["Node.js", "Express", "PostgreSQL", "Socket.IO", "PIX BR Code", "Terraform"],
    actions: [{ label: "Ver o código", href: "https://github.com/ParkNow914/ParkNow", kind: "code" }],
  },
  {
    code: "SYS-05",
    slug: "bia",
    name: "Bia",
    kind: "Delivery multicanal · IA",
    status: "entregue",
    statusNote: "Cliente real: supermercado de bairro.",
    metric: "web + Telegram",
    image: "/projetos/bia.webp",
    imageW: 1080,
    imageH: 670,
    feature: true,
    body:
      "Delivery entregue para supermercado de bairro, com catálogo importado do ERP, carrinho, cálculo de taxa, checkout, impressão de pedidos e acompanhamento. A entrega utilizou loja web e Telegram. O conector de WhatsApp foi preparado, mas não foi ativado nesse cliente.",
    spec: [
      { k: "Deploy", v: "Docker em VPS Linux, backup e reversão documentados" },
      { k: "Runtime", v: "Node.js puro, zero dependência" },
      { k: "Segurança", v: "Preço e taxa recalculados no servidor" },
      { k: "Impressão", v: "ESC/POS direto na impressora do balcão" },
    ],
    stack: ["Node.js", "PWA", "Telegram API", "Docker", "ESC/POS"],
    actions: [{ label: "Conhecer este projeto", href: wa("Olá Alisson! Quero conhecer o case da Bia (delivery)."), kind: "chat" }],
  },
  {
    code: "SYS-06",
    slug: "flowhub",
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
    slug: "realcredmais",
    name: "RealCred+",
    kind: "Landing + simulador",
    status: "entregue",
    statusNote: "Landing e simulador entregues.",
    metric: "landing + simulador",
    image: "/projetos/realcredmais.webp",
    imageW: 1080,
    imageH: 670,
    body:
      "Landing para corretora de crédito, com simulador de consignado, calculadora de portabilidade, encaminhamento ao WhatsApp e formulário por e-mail. Inclui integrações de analytics; regras comerciais, credenciais e consentimento precisam acompanhar a configuração da operação.",
    spec: [{ k: "Rastreamento", v: "GTM, GA4, Meta Pixel e CAPI" }],
    stack: ["JavaScript", "Node.js", "GTM + GA4", "Meta CAPI"],
    actions: [{ label: "Ver o código", href: "https://github.com/ParkNow914/realcredmais", kind: "code" }],
  },
  {
    code: "SYS-08",
    slug: "indice-de-gestao",
    name: "Índice de Gestão",
    kind: "Diagnóstico · agronegócio",
    status: "entregue",
    metric: "diagnóstico por pilares",
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
      { label: "Conhecer este projeto", href: wa("Olá Alisson! Quero conhecer o case do Índice de Gestão."), kind: "chat" },
    ],
  },
  {
    code: "SYS-09",
    slug: "acerto",
    name: "Acerto",
    kind: "SaaS · crédito consignado",
    status: "proprio",
    statusNote: "Produto próprio; consulte a disponibilidade de demonstração com dados fictícios.",
    metric: "comissão e auditoria",
    image: "/projetos/acerto.webp",
    imageW: 1200,
    imageH: 744,
    feature: true,
    body:
      "Gestão de comissão para promotoras de crédito consignado e correspondentes bancários. A promotora precisa provar cada comissão, e o sistema foi desenhado para isso: aritmética inteira, tabelas versionadas, splits, cinco tipos de estorno e fechamento mensal com saldo que rola.",
    spec: [
      { k: "Cálculo", v: "Aritmética inteira e regras versionadas" },
      { k: "Segurança", v: "RLS multiempresa, 2FA TOTP, RBAC" },
      { k: "Auditoria", v: "Hash-encadeada" },
      { k: "LGPD", v: "Dossiê, anonimização e portabilidade" },
    ],
    stack: ["Next.js", "Drizzle", "PostgreSQL", "RLS multi-tenant", "2FA TOTP"],
    actions: [{ label: "Pedir acesso à demo", href: wa("Olá Alisson! Quero ver a demo do Acerto."), kind: "chat" }],
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
        "Prova de conceito de roteamento entre entrada, automação, chatbot, IA e humano, com blueprint criado por API no Make.com. As respostas das camadas são simuladas, inclusive a de IA; a demo demonstra a arquitetura do fluxo.",
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
  {
    name: "KineQuote: banco multiempresa isolado",
    body: "Postgres no Supabase com RLS forçado por empresa e uma suíte automatizada que tenta ler, inserir e alterar dados de outra empresa, e precisa falhar em todas.",
    date: "set/2026",
  },
  { name: "Etiqueta do Word com dados do SQL Server", body: "Três campos novos do banco na etiqueta de impressão, ajustando o script que já existia.", date: "set/2026" },
  {
    name: "Página HTML na frente do WordPress",
    body: "index.html como página principal sem derrubar o WordPress com Elementor, e formulários enviando por SMTP autenticado.",
    date: "ago/2026",
  },
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
      body: "Briefing por escrito para entender o objetivo, o código existente e as dependências do projeto.",
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
    "Um briefing por escrito com o objetivo e o fluxo desejado",
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
  /** Conferido no perfil público do 99freelas em 02/11/2026: 12 avaliações, nota 5.0, 12 recomendações, 12 projetos concluídos. */
  reviews: 12,
  intro:
    "Doze avaliações no 99freelas, todas 5.0, com 100% de recomendação. Seis estão abaixo, copiadas como o cliente escreveu, e dá para conferir todas no perfil público.",
  items: [
    {
      quote:
        "Excelente profissional! Desde o início, demonstrou muita organização, agilidade e compromisso com o projeto. A comunicação foi clara durante todo o processo, cumpriu os prazos combinados e entregou um trabalho de altíssima qualidade. Além de ser muito rápido, é extremamente competente, atencioso e sempre disposto a realizar os ajustes necessários para que o resultado fique exatamente como esperado. Superou minhas expectativas e mostrou que realmente entende do que faz.",
      project: "Site e catálogo em Next.js",
      date: "ago. 2026",
    },
    {
      quote: "Excelente profissional. Explica bem tudo.",
      project: "Página HTML na frente do WordPress",
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
    { k: "Atendimento", v: "Por escrito, normalmente 19h–00h (Brasília), todos os dias" },
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
    a: "A quantidade depende do escopo e das horas já reservadas. Confirmo a capacidade antes de fechar o cronograma. A janela habitual de atendimento é das 19h às 00h, todos os dias, no horário de Brasília; a dedicação a cada cliente é combinada separadamente.",
  },
  {
    q: "O que você precisa de mim durante o projeto?",
    a: "Um briefing por escrito, os acessos necessários e a validação de cada entrega. A conversa é assíncrona: você descreve o fluxo e eu organizo as dúvidas e os próximos passos. Você não precisa programar para acompanhar o projeto.",
  },
  {
    q: "Você usa APIs oficiais e métodos seguros?",
    a: "Para WhatsApp, priorizo a API oficial da Meta e verifico os requisitos do fluxo, como templates, consentimento e opt-out. Soluções que usam sessão não oficial têm risco de bloqueio mesmo em baixo volume. A escolha do provedor e as limitações ficam esclarecidas antes da implementação.",
  },
  {
    q: "O sistema fica caro para manter?",
    a: "O custo depende de hospedagem, banco, modelos de IA, mensagens e volume de uso. Comparo alternativas econômicas e informo mensalidades, franquias e cobranças de terceiros antes de implementar. Uma camada gratuita pode ajudar no início, mas seus limites precisam ser conferidos para cada projeto.",
  },
  {
    q: "Depois de entregue, eu fico na mão?",
    a: "Não. O projeto sai testado e documentado, e eu acompanho a estabilização depois do lançamento. Se você quiser evoluir o sistema com o tempo, também ofereço manutenção contínua.",
  },
  {
    q: "Você trabalha remoto? De onde?",
    a: "Trabalho de Lorena (SP) para o Brasil inteiro, de forma remota e assíncrona, por escrito. Normalmente atendo das 19h às 00h, todos os dias, no horário de Brasília. Escopo, horas reservadas e prazo de resposta são combinados para cada projeto.",
  },
];

export const WARRANTY = [
  {
    title: "Primeira entrega cedo",
    body:
      "As etapas têm entregas e critérios de validação definidos por escrito. Você acompanha o trabalho e aprova cada marco. Condições de pagamento, cancelamento e uso do código seguem o contrato e as regras da plataforma em que o projeto for contratado.",
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
    body: "Acessos separados, cuidado com dados pessoais e integrações verificadas antes da publicação. Requisitos de consentimento, opt-out e limites dos provedores entram no planejamento.",
  },
];

export const ASSISTANCE = {
  title: "Seu próximo sistema começa com uma mensagem.",
  body: "Conte por escrito o que você precisa automatizar ou construir. Retorno na minha janela habitual, das 19h às 00h (Brasília), com os próximos passos e exemplos que possam ser compartilhados.",
  promises: ["Escopo e prazo por escrito", "Atendimento remoto e assíncrono", "Custos de terceiros esclarecidos"],
};

/**
 * Cidades da região de base da Autark. O atendimento é remoto em todo o Brasil.
 */
export const VALE = {
  cidades: ["Lorena", "Guaratinguetá", "Cachoeira Paulista", "Cruzeiro", "Aparecida", "Taubaté", "São José dos Campos"],
};
