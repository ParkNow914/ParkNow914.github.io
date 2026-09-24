// Origem da conversa: a UTM da URL de entrada vai carimbada no fim da mensagem
// do WhatsApp. Assim a conversa que veio da bio do Instagram chega marcada como
// [instagram/bio], e quem entrou direto manda a mensagem limpa.

export function origem(): string {
  if (typeof window === "undefined") return "";
  try {
    const q = new URLSearchParams(window.location.search);
    const parts = ["utm_source", "utm_medium", "utm_campaign"].map((k) => q.get(k)).filter(Boolean);
    return parts.length ? `\n\n[${parts.join("/")}]` : "";
  } catch {
    return "";
  }
}

/** Carimba a origem em todo link wa.me já presente no HTML. */
export function stampWhatsAppLinks(root: ParentNode = document) {
  const mark = origem();
  if (!mark) return;
  root.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"]').forEach((a) => {
    if (a.dataset.origin === "1") return;
    try {
      const u = new URL(a.href);
      u.searchParams.set("text", (u.searchParams.get("text") || "") + mark);
      a.href = u.toString();
      a.dataset.origin = "1";
    } catch {
      /* href fora do padrão: fica como está */
    }
  });
}
