"use client";

import { useState } from "react";
import { Icon } from "./Icon";

// Compartilhar sem botão de rede social (que carregaria script de terceiros):
// no celular abre a folha nativa do sistema; no desktop copia o link. O link
// do WhatsApp é um endereço comum, só sai do site se a pessoa clicar.
export function Compartilhar({ titulo, url }: { titulo: string; url: string }) {
  const [copiado, setCopiado] = useState(false);

  const compartilhar = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
        return;
      } catch {
        // cancelado pela pessoa: nada a fazer
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2400);
    } catch {
      window.prompt("Copie o link:", url);
    }
  };

  const zap = `https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`;

  return (
    <div className="partilha">
      <button type="button" className="btn btn--ink btn--sm" onClick={compartilhar}>
        <Icon name="share" size={16} />
        <span>{copiado ? "Link copiado" : "Compartilhar"}</span>
      </button>
      <a className="btn btn--sm partilha__zap" href={zap} target="_blank" rel="noopener" data-no-origin>
        <Icon name="whatsapp" size={16} />
        <span>Mandar para alguém</span>
      </a>
      <span className="sr-only" aria-live="polite">
        {copiado ? "Link copiado para a área de transferência" : ""}
      </span>
    </div>
  );
}
