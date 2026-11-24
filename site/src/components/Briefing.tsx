"use client";

import { useId, useRef } from "react";
import { PACOTES, WHATSAPP } from "@/content/site";
import { origem } from "@/lib/origin";
import { Icon } from "./Icon";

// Briefing do pacote, sem <form> e sem backend (a CSP declara form-action 'none'):
// o botão monta o pedido completo e abre o WhatsApp. Nada fica salvo neste site.
export function Briefing() {
  const pacote = useRef<HTMLSelectElement>(null);
  const nome = useRef<HTMLInputElement>(null);
  const negocio = useRef<HTMLInputElement>(null);
  const objetivo = useRef<HTMLTextAreaElement>(null);
  const referencia = useRef<HTMLInputElement>(null);
  const pago = useRef<HTMLInputElement>(null);
  const ids = { pc: useId(), n: useId(), b: useId(), o: useId(), r: useId(), p: useId() };

  const enviar = () => {
    const v = (el: { current: { value: string } | null }) => el.current?.value.trim() || "";
    const linhas = [
      `Olá Alisson! Briefing do pacote: ${v(pacote) || "(escolher)"}`,
      "",
      `Nome: ${v(nome) || "(sem nome)"}`,
      `Negócio e cidade: ${v(negocio) || "(descrever)"}`,
      `O que eu quero que o sistema faça: ${v(objetivo) || "(descrever)"}`,
    ];
    const r = v(referencia);
    if (r) linhas.push(`Instagram ou site atual: ${r}`);
    linhas.push(pago.current?.checked ? "Já paguei a entrada pelo Mercado Pago." : "Ainda não paguei a entrada.");
    linhas.push("", "(vim pela página de pacotes)");
    const msg = linhas.join("\n") + origem();
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  return (
    <div className="briefing" role="group" aria-labelledby="briefing-t">
      <p className="briefing__t" id="briefing-t">
        Briefing do pacote
      </p>
      <div className="os__field">
        <label htmlFor={ids.pc}>Pacote</label>
        <select id={ids.pc} ref={pacote} defaultValue="">
          <option value="" disabled>
            Escolha um pacote
          </option>
          {PACOTES.pacotes.map((p) => (
            <option key={p.code} value={`${p.nome} (${p.preco}${p.sufixo ? ` ${p.sufixo}` : ""})`}>
              {p.nome}
            </option>
          ))}
          <option value={`${PACOTES.sobMedida.nome} (orçamento)`}>{PACOTES.sobMedida.nome}</option>
        </select>
      </div>
      <div className="os__field">
        <label htmlFor={ids.n}>Seu nome</label>
        <input id={ids.n} ref={nome} type="text" autoComplete="name" />
      </div>
      <div className="os__field">
        <label htmlFor={ids.b}>Seu negócio e cidade</label>
        <input id={ids.b} ref={negocio} type="text" placeholder="Ex.: barbearia em Guaratinguetá" />
      </div>
      <div className="os__field">
        <label htmlFor={ids.o}>O que o sistema precisa fazer</label>
        <textarea id={ids.o} ref={objetivo} rows={4} placeholder="Ex.: marcar horário pelo WhatsApp e lembrar o cliente antes" />
      </div>
      <div className="os__field">
        <label htmlFor={ids.r}>Instagram ou site atual (se tiver)</label>
        <input id={ids.r} ref={referencia} type="text" inputMode="url" placeholder="@seunegocio" />
      </div>
      <label className="briefing__pago" htmlFor={ids.p}>
        <input id={ids.p} ref={pago} type="checkbox" /> Já paguei a entrada
      </label>
      <button type="button" className="btn btn--ink" onClick={enviar}>
        <Icon name="whatsapp" size={18} />
        Enviar o briefing pelo WhatsApp
      </button>
      <p className="os__note">O botão abre o WhatsApp com tudo preenchido. Nada fica salvo neste site.</p>
    </div>
  );
}
