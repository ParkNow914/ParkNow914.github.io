import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

// As landings de tráfego pago moram no mesmo domínio, fora deste app (pasta lp/
// na raiz do repositório), e entram no mesmo sitemap.
const LANDINGS = ["agenda", "atendimento", "juridico", "delivery"];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: "2026-09-24", changeFrequency: "monthly", priority: 1 },
    ...LANDINGS.map((slug) => ({
      url: `${SITE_URL}/lp/${slug}/`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
