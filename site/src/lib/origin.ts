// Origem da conversa: a UTM da URL de entrada vai carimbada no fim da mensagem
// do WhatsApp. Assim a conversa que veio da bio do Instagram chega marcada como
// [instagram/bio], e quem entrou direto manda a mensagem limpa.

const CHAVE = "autark-origem";

// A origem de entrada vale para a visita inteira: quem chega pela bio na home,
// abre uma nota e só então chama no WhatsApp continua marcado como
// [instagram/bio]. Fica em sessionStorage, que não é cookie, some ao fechar a
// aba e não vai para lugar nenhum além da mensagem que a própria pessoa envia.
export function origem(): string {
  if (typeof window === "undefined") return "";
  try {
    const q = new URLSearchParams(window.location.search);
    const parts = ["utm_source", "utm_medium", "utm_campaign"].map((k) => q.get(k)).filter(Boolean);
    if (parts.length) {
      const mark = `\n\n[${parts.join("/")}]`;
      try {
        sessionStorage.setItem(CHAVE, mark);
      } catch {
        /* navegação privada sem storage: vale só para esta página */
      }
      return mark;
    }
    try {
      return sessionStorage.getItem(CHAVE) || "";
    } catch {
      return "";
    }
  } catch {
    return "";
  }
}

/** Carimba a origem em todo link wa.me já presente no HTML. */
export function stampWhatsAppLinks(root: ParentNode = document) {
  const mark = origem();
  if (!mark) return;
  // data-no-origin: links que a pessoa usa para mandar o site a alguém. A marca
  // de origem é para a conversa com a Autark, não para a mensagem de um amigo.
  root.querySelectorAll<HTMLAnchorElement>('a[href*="wa.me"]:not([data-no-origin])').forEach((a) => {
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
