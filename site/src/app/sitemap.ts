import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { notas } from "@/lib/notas";

// As landings de tráfego pago moram no mesmo domínio, fora deste app (pasta lp/
// na raiz do repositório), e entram no mesmo sitemap.
const LANDINGS = ["agenda", "atendimento", "juridico", "delivery"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lista = notas();
  return [
    { url: `${SITE_URL}/`, lastModified: "2026-09-28", changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/notas/`, lastModified: lista[0]?.data, changeFrequency: "weekly", priority: 0.8 },
    ...lista.map((n) => ({
      url: `${SITE_URL}/notas/${n.slug}/`,
      lastModified: n.data,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...LANDINGS.map((slug) => ({
      url: `${SITE_URL}/lp/${slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
