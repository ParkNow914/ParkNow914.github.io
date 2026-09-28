// RSS das notas de campo: leitor de feed, automação (IFTTT, Zapier, n8n) e
// agregadores recebem cada nota nova sem ninguém copiar link à mão.
import { notas, textoPuro } from "@/lib/notas";
import { SITE_URL } from "@/content/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rfc822 = (iso: string) => new Date(`${iso}T12:00:00-03:00`).toUTCString();

export function GET() {
  const lista = notas();
  const itens = lista
    .map((n) => {
      const url = `${SITE_URL}/notas/${n.slug}/`;
      const corpo = [n.lede, ...n.legenda].filter(Boolean).map((p) => `<p>${esc(textoPuro(p as string))}</p>`).join("");
      return `    <item>
      <title>${esc(n.titulo)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(n.data)}</pubDate>
      <category>${esc(n.pilar)}</category>
      <description><![CDATA[${corpo}]]></description>
    </item>`;
    })
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Notas de campo · Autark</title>
    <link>${SITE_URL}/notas/</link>
    <atom:link href="${SITE_URL}/notas/feed.xml" rel="self" type="application/rss+xml" />
    <description>Problemas reais de atendimento, delivery e agenda no WhatsApp, e os sistemas com IA que resolvem. Por Alisson Santos.</description>
    <language>pt-BR</language>
    <lastBuildDate>${lista[0] ? rfc822(lista[0].data) : new Date().toUTCString()}</lastBuildDate>
${itens}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
