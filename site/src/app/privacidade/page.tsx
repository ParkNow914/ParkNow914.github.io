import type { Metadata } from "next";
import { NotasHeader } from "@/components/Notas";
import { Colophon } from "@/components/Sections";
import { Enhance } from "@/components/Enhance";
import { Bloco, Trilha } from "@/components/Paginas";
import { EMAIL, SITE_URL, wa } from "@/content/site";

// Escrita para ser lida por quem visita, não por advogado: o que o site faz de
// verdade, na ordem em que a pessoa encontra cada coisa. Mudou o comportamento
// do site (um script novo, um formulário), muda aqui no mesmo PR.
const ATUALIZADA = { iso: "2026-09-28", texto: "28 de setembro de 2026" };

const descricao =
  "Como a Autark trata dados pessoais: o site não usa cookies nem rastreadores, a medição das páginas de anúncio só liga com o seu aceite, e o que você manda no WhatsApp serve só para responder.";

export const metadata: Metadata = {
  title: "Política de privacidade · Autark",
  description: descricao,
  alternates: { canonical: "/privacidade/" },
  openGraph: {
    type: "website",
    url: "/privacidade/",
    siteName: "Autark",
    locale: "pt_BR",
    title: "Política de privacidade · Autark",
    description: descricao,
    images: [{ url: "/og/privacidade.png", width: 1200, height: 630, alt: "Política de privacidade da Autark" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/privacidade.png"] },
};

export default function PrivacidadePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Política de privacidade · Autark",
    url: `${SITE_URL}/privacidade/`,
    inLanguage: "pt-BR",
    dateModified: ATUALIZADA.iso,
    description: descricao,
  };
  return (
    <>
      <NotasHeader secao={{ label: "Privacidade", href: "/privacidade/" }} />
      <main id="conteudo" className="nota-pag">
        <article className="nota juridico">
          <Trilha itens={[{ label: "Manual", href: "/" }, { label: "Privacidade" }]} />
          <header className="nota__cab">
            <p className="nota__kicker">
              <span className="nota__pilar">LGPD</span>
              <span>
                Atualizada em <time dateTime={ATUALIZADA.iso}>{ATUALIZADA.texto}</time>
              </span>
            </p>
            <h1 className="nota__t">Política de privacidade</h1>
            <p className="nota__lede">Este site não usa cookies nem rastreadores. O resto desta página explica o pouco que acontece com os seus dados, e por quê.</p>
          </header>

          <Bloco id="pv-quem" titulo="Quem é o responsável">
            <div className="nota__texto">
              <p>
                A Autark é o trabalho de Alisson Santos, em Lorena (SP). Para qualquer assunto de privacidade, escreva para{" "}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ou chame no{" "}
                <a href={wa("Olá Alisson! Tenho uma dúvida sobre os meus dados.")} target="_blank" rel="noopener">
                  WhatsApp
                </a>
                . Sou eu quem responde.
              </p>
            </div>
          </Bloco>

          <Bloco id="pv-site" titulo="O que acontece quando você visita o site">
            <div className="nota__texto">
              <p>
                <strong>Nenhum cookie, nenhum rastreador, nenhum formulário.</strong> Fontes, imagens e o modelo 3D saem do
                próprio domínio, então a sua visita não é avisada a Google, Meta ou qualquer outra empresa.
              </p>
              <p>
                <strong>A origem da visita fica no seu navegador.</strong> Se você chega por um link marcado (de um post, da
                bio do Instagram, de um anúncio), o navegador guarda essa marca enquanto a aba estiver aberta. Ela só serve
                para aparecer no fim da mensagem de WhatsApp que você mesmo escolhe enviar, como <code>[instagram/bio]</code>.
                Fechou a aba, ela some.
              </p>
              <p>
                <strong>Duas preferências ficam no seu aparelho.</strong> Se você pede para ver a montagem animada mesmo com o
                movimento reduzido ligado no sistema, o navegador lembra disso. Nas páginas de anúncio, ele lembra também se
                você prefere o tema claro ou o escuro. Nada disso sai do seu navegador.
              </p>
              <p>
                <strong>A hospedagem registra acessos.</strong> O site fica no GitHub Pages, e o GitHub pode guardar o endereço
                IP e dados técnicos de cada acesso por segurança, conforme a política de privacidade do GitHub. Eu não tenho
                acesso a esses registros.
              </p>
            </div>
          </Bloco>

          <Bloco id="pv-anuncio" titulo="Páginas de anúncio (/lp/)">
            <div className="nota__texto">
              <p>
                As páginas em <code>/lp/</code> recebem quem vem de anúncio. Elas podem usar a medição da Meta (o Pixel) para
                saber quais anúncios trazem clientes. <strong>Nada da Meta carrega antes de você tocar em Aceitar</strong>, e
                recusar não muda nada na página. A sua escolha fica guardada no próprio navegador para a pergunta não voltar a
                cada visita.
              </p>
              <p>
                Se você aceitar, a Meta recebe dados de navegação da página, como a visita e o toque no botão do WhatsApp, e
                trata esses dados pela política de privacidade dela. Para mudar de ideia, apague os dados do site no seu
                navegador e a pergunta aparece de novo.
              </p>
            </div>
          </Bloco>

          <Bloco id="pv-conversa" titulo="Quando você me chama">
            <div className="nota__texto">
              <p>
                Os botões de WhatsApp abrem uma conversa comigo no aplicativo, que é operado pela Meta e segue a política dela.
                O que você me conta ali ou por e-mail (nome, número, o que precisa) eu uso para responder, montar a proposta e
                executar o projeto. Não vendo, não empresto e não uso para anúncio de terceiros.
              </p>
              <p>
                Guardo a conversa e a proposta enquanto houver relação de trabalho e pelo tempo que a lei exigir para
                documentos fiscais e contratos. Fora disso, você pode pedir para apagar a qualquer momento.
              </p>
            </div>
          </Bloco>

          <Bloco id="pv-direitos" titulo="Seus direitos">
            <div className="nota__texto">
              <p>Pela Lei Geral de Proteção de Dados (Lei 13.709/2018, art. 18), você pode pedir, a qualquer momento:</p>
              <ul className="ficha__lista">
                <li>a confirmação de que eu trato algum dado seu, e acesso a ele;</li>
                <li>a correção de dado incompleto ou errado;</li>
                <li>a eliminação ou anonimização do que não for mais necessário;</li>
                <li>a portabilidade dos dados para outro fornecedor;</li>
                <li>a informação de com quem os dados foram compartilhados;</li>
                <li>a revogação de um consentimento que você deu.</li>
              </ul>
              <p>
                Peça pelo e-mail ou pelo WhatsApp acima. Eu respondo em até 15 dias. Se achar que a resposta não resolveu,
                você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
              </p>
            </div>
          </Bloco>

          <Bloco id="pv-clientes" titulo="Sistemas que eu construo para clientes">
            <div className="nota__texto">
              <p>
                Quando eu construo um sistema que trata dados dos clientes de outra empresa (uma agenda, um delivery, um CRM), a
                empresa dona do sistema é a controladora desses dados e eu atuo como operador, nos termos do contrato. Quem é
                cliente dessas empresas deve falar primeiro com elas.
              </p>
            </div>
          </Bloco>

          <Bloco id="pv-mudancas" titulo="Mudanças nesta política">
            <div className="nota__texto">
              <p>
                Se o site passar a tratar dados de outro jeito, esta página muda junto e a data lá em cima também. O histórico
                completo fica público no{" "}
                <a href="https://github.com/ParkNow914/ParkNow914.github.io/commits/main/site/src/app/privacidade" target="_blank" rel="noopener">
                  repositório do site
                </a>
                .
              </p>
            </div>
          </Bloco>
        </article>
      </main>
      <Colophon capa="/#capa" />
      <Enhance />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
