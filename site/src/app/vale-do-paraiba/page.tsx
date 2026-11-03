import type { Metadata } from "next";
import { NotasHeader } from "@/components/Notas";
import { Colophon } from "@/components/Sections";
import { Enhance } from "@/components/Enhance";
import { Icon } from "@/components/Icon";
import { Bloco, Chamada, Trilha } from "@/components/Paginas";
import { FIELD, FREELAS, INSTALL, SITE_URL, VALE, WHATSAPP } from "@/content/site";
import { AREA_ATENDIDA } from "@/content/jsonld";

const titulo = "Sistemas e automação para negócios do Vale do Paraíba";
const descricao =
  "Atendimento de WhatsApp com IA, agenda, delivery e sistemas sob medida para negócios de Lorena, Guaratinguetá, Taubaté, São José dos Campos e região, com atendimento remoto e por escrito.";

const SEGMENTOS = [
  {
    quem: "Salão, barbearia e estética",
    o: "A cliente marca sozinha pelo WhatsApp, e o sistema confirma e lembra 24h e 2h antes.",
    href: "/lp/agenda/",
  },
  {
    quem: "Supermercado, mercadinho e delivery",
    o: "O pedido chega pronto na cozinha, com a taxa por bairro calculada e o cupom na impressora que a loja já tem.",
    href: "/lp/delivery/",
  },
  {
    quem: "Corretora, financeira e promotora",
    o: "O lead é atendido na hora no WhatsApp oficial da Meta, qualificado e registrado com auditoria.",
    href: "/lp/atendimento/",
  },
  {
    quem: "Escritório de advocacia",
    o: "Triagem 24h no WhatsApp e análise de documento com a fonte citada no trecho.",
    href: "/lp/juridico/",
  },
];

const PERGUNTAS = [
  {
    q: "Você vai até o meu negócio?",
    a: "O atendimento é remoto e assíncrono, inclusive no Vale do Paraíba. Você pode descrever o processo por escrito e enviar capturas e vídeos gravados quando forem necessários.",
  },
  {
    q: "Preciso me encontrar pessoalmente para contratar?",
    a: "O projeto é organizado por mensagens, com escopo, dúvidas e validações por escrito. Normalmente atendo das 19h às 00h, todos os dias, no horário de Brasília.",
  },
  {
    q: "Em quanto tempo fica pronto?",
    a: "Uma landing page ou automação costuma sair em dias, e um sistema completo em semanas. Você recebe o prazo por escrito na proposta, antes de qualquer pagamento.",
  },
];

export const metadata: Metadata = {
  title: `${titulo} · Autark`,
  description: descricao,
  alternates: { canonical: "/vale-do-paraiba/" },
  openGraph: {
    type: "website",
    url: "/vale-do-paraiba/",
    siteName: "Autark",
    locale: "pt_BR",
    title: titulo,
    description: descricao,
    images: [{ url: "/og/vale-do-paraiba.png", width: 1200, height: 630, alt: titulo }],
  },
  twitter: { card: "summary_large_image", images: ["/og/vale-do-paraiba.png"] },
};

export default function ValePage() {
  const url = `${SITE_URL}/vale-do-paraiba/`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: titulo,
      url,
      description: descricao,
      serviceType: "Automação de atendimento, sistemas web e integrações",
      areaServed: AREA_ATENDIDA,
      provider: {
        "@type": "ProfessionalService",
        name: "Autark",
        url: SITE_URL,
        telephone: `+${WHATSAPP}`,
        address: { "@type": "PostalAddress", addressLocality: "Lorena", addressRegion: "SP", addressCountry: "BR" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: PERGUNTAS.map((p) => ({ "@type": "Question", name: p.q, acceptedAnswer: { "@type": "Answer", text: p.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Manual de Operação", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Vale do Paraíba", item: url },
      ],
    },
  ];

  return (
    <>
      <NotasHeader secao={{ label: "Vale do Paraíba", href: "/vale-do-paraiba/" }} />
      <main id="conteudo" className="nota-pag">
        <article className="nota">
          <Trilha itens={[{ label: "Manual", href: "/" }, { label: "Vale do Paraíba" }]} />
          <header className="nota__cab">
            <p className="nota__kicker">
              <span className="nota__pilar">Atendimento remoto</span>
              <span>Base em Lorena, SP</span>
            </p>
            <h1 className="nota__t">{titulo}</h1>
            <p className="nota__lede">
              A Autark tem base em Lorena e atende negócios do Vale e de todo o Brasil de forma remota, com briefing,
              acompanhamento e validações por escrito.
            </p>
          </header>

          <Bloco id="vale-cidades" titulo="Negócios do Vale atendidos a distância">
            <ul className="cidades">
              {VALE.cidades.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p className="bloco__nota">O atendimento remoto também está disponível para outras cidades do Brasil.</p>
          </Bloco>

          <Bloco id="vale-o-que" titulo="O que dá para instalar">
            <ol className="notas">
              {SEGMENTOS.map((s) => (
                <li key={s.href} className="notas__item notas__item--sem-n">
                  <div className="notas__corpo">
                    <h3 className="notas__t">
                      <a href={s.href}>{s.quem}</a>
                    </h3>
                    <p className="notas__lede">{s.o}</p>
                  </div>
                  <Icon name="arrow-right" size={20} className="notas__seta" />
                </li>
              ))}
            </ol>
            <p className="bloco__nota">
              Outro tipo de negócio? Se a tarefa se repete e dá para descrever a regra, dá para automatizar.{" "}
              <a href="/sistemas/">Conheça os projetos e sistemas</a>.
            </p>
          </Bloco>

          <Bloco id="vale-perto" titulo="Como entender a rotina a distância">
            <div className="nota__texto">
              <p>
                O diagnóstico registra onde o pedido chega, quem responde ao cliente e quais sistemas e equipamentos
                participam do fluxo. Mensagens, capturas e vídeos gravados ajudam a esclarecer a rotina e as dependências
                antes de definir a solução.
              </p>
            </div>
          </Bloco>

          <Bloco id="vale-como" titulo="Como funciona">
            <ol className="passos">
              {INSTALL.steps.map((p, k) => (
                <li key={p.title}>
                  <span className="passos__n">{String(k + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="passos__t">{p.title}</h3>
                    <p>{p.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Bloco>

          <Bloco id="vale-prova" titulo="Antes de contratar, confira">
            <div className="nota__texto">
              <p>
                O portfólio identifica entregas para clientes, produtos próprios e demonstrações.{" "}
                <a href="/sistemas/">Veja o registro completo</a>. No 99freelas são {FIELD.reviews} avaliações, todas 5.0, com
                100% de recomendação,{" "}
                <a href={FREELAS} target="_blank" rel="noopener">
                  no perfil público
                </a>
                .
              </p>
            </div>
          </Bloco>

          <Bloco id="vale-perguntas" titulo="Perguntas de quem é da região">
            <div className="trouble">
              {PERGUNTAS.map((p, i) => (
                <details key={p.q} className="trouble__row" name="vale">
                  <summary>
                    <span className="trouble__n">{i + 1}</span>
                    <span className="trouble__q">{p.q}</span>
                    <Icon name="plus" size={18} className="trouble__ico" />
                  </summary>
                  <div className="trouble__a">
                    <p>{p.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </Bloco>

          <Chamada
            id="vale-cta-t"
            titulo="Tem um negócio no Vale?"
            texto="Conte por escrito o que toma o seu tempo. Retorno na minha janela de atendimento para organizar o escopo e os próximos passos."
            mensagem="Olá Alisson! Tenho um negócio no Vale do Paraíba e quero conversar sobre automação."
          />
        </article>
      </main>
      <Colophon capa="/#capa" />
      <Enhance />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
