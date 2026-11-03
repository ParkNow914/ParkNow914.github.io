// /llms.txt (llmstxt.org): o resumo do site para assistentes de IA, que hoje
// também respondem "quem faz automação de WhatsApp em tal cidade". Sai do mesmo
// conteúdo do site, então não desatualiza sozinho.
import { SITE_URL, MODELS, SYSTEMS, STATUS_LABEL, FIELD, COVER, VALE } from "@/content/site";
import { notas } from "@/lib/notas";

export const dynamic = "force-static";

export function GET() {
  const linhas = [
    "# Autark",
    "",
    `> ${COVER.title} Estúdio de automação com IA de Alisson Santos, em Lorena (SP), com atendimento remoto e assíncrono em todo o Brasil: atendimento de WhatsApp com IA, SaaS completos, landing pages e integrações. Nota 5.0 no 99freelas (${FIELD.reviews} avaliações, 100% de recomendação, conferido em 02/11/2026).`,
    "",
    "Contato: WhatsApp +55 12 99174-3827. Atendimento por escrito, normalmente das 19h às 00h, todos os dias (Brasília). Horas reservadas e prazos são combinados por projeto.",
    "",
    "## Serviços",
    "",
    ...MODELS.items.map((m) => `- [${m.name}](${SITE_URL}/#modelos): ${m.body}`),
    "",
    "## Projetos e sistemas",
    "",
    ...SYSTEMS.map((s) => `- [${s.name}](${SITE_URL}/sistemas/${s.slug}/): ${s.kind}. Situação: ${STATUS_LABEL[s.status]}.`),
    "",
    "## Atendimento no Vale do Paraíba",
    "",
    `- [Sistemas e automação no Vale do Paraíba](${SITE_URL}/vale-do-paraiba/): atendimento remoto para ${VALE.cidades.join(", ")} e todo o Brasil.`,
    "",
    "## Notas de campo",
    "",
    ...notas().map((n) => `- [${n.titulo}](${SITE_URL}/notas/${n.slug}/): ${n.lede ?? ""}`),
    "",
    "## Optional",
    "",
    `- [Manual de Operação completo](${SITE_URL}/): a página inteira, com calculadora de economia, FAQ e termo de garantia`,
    "- [Avaliações no 99freelas](https://www.99freelas.com.br/user/Alisson_sntsz): perfil público com todas as avaliações",
    "- [Código no GitHub](https://github.com/ParkNow914): projetos abertos e o código deste site",
    `- [Política de privacidade](${SITE_URL}/privacidade/): o site não usa cookies nem rastreadores`,
    "",
  ];
  return new Response(linhas.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
