"use client";

import { useId, useRef } from "react";
import { ASSISTANCE, EMAIL, FREELAS, GITHUB, WA_DEFAULT, WHATSAPP } from "@/content/site";
import { origem } from "@/lib/origin";
import { Icon } from "./Icon";
import { Folio, LegacyAnchors } from "./Manual";

// Sem <form> e sem backend: a CSP declara form-action 'none'. O botão monta a
// mensagem e abre o WhatsApp; sem JavaScript, o link direto ao lado resolve.
export function Assistance() {
  const nome = useRef<HTMLInputElement>(null);
  const negocio = useRef<HTMLInputElement>(null);
  const precisa = useRef<HTMLTextAreaElement>(null);
  const ids = { n: useId(), b: useId(), p: useId() };

  const send = () => {
    const n = nome.current?.value.trim() || "";
    const b = negocio.current?.value.trim() || "";
    const p = precisa.current?.value.trim() || "";
    let msg = `Olá Alisson! Sou ${n || "(sem nome)"}`;
    if (b) msg += `, do ${b}`;
    msg += `.\n\nO que eu preciso: ${p || "(descrever)"}\n\n(vim pelo site da Autark)`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg + origem())}`, "_blank", "noopener");
  };

  return (
    <section className="sec sec--signal" id="assistencia" data-section="assistencia" aria-labelledby="h-assistencia">
      <LegacyAnchors section="assistencia" />
      <div className="shead">
        <h2 id="h-assistencia" className="shead__t">
          <span className="shead__addr">§11</span>
          <span className="shead__title">{ASSISTANCE.title}</span>
        </h2>
        <p className="shead__lede">{ASSISTANCE.body}</p>
      </div>

      <div className="assist">
        <div className="assist__direct">
          <a className="btn btn--ink btn--lg" href={WA_DEFAULT} target="_blank" rel="noopener">
            <Icon name="whatsapp" size={20} />
            Chamar no WhatsApp
          </a>
          <ul className="assist__promises">
            {ASSISTANCE.promises.map((p) => (
              <li key={p}>
                <Icon name="check" size={16} /> {p}
              </li>
            ))}
          </ul>
          <ul className="assist__links">
            <li>
              <a href={`mailto:${EMAIL}`}>
                <Icon name="mail" size={16} /> {EMAIL}
              </a>
            </li>
            <li>
              <a href={GITHUB} target="_blank" rel="noopener">
                <Icon name="github" size={16} /> github.com/ParkNow914
              </a>
            </li>
            <li>
              <a href={FREELAS} target="_blank" rel="noopener">
                <Icon name="star" size={16} /> 99freelas, nota 5.0
              </a>
            </li>
          </ul>
        </div>

        <div className="os" role="group" aria-labelledby="os-t">
          <p className="os__t" id="os-t">
            Ordem de serviço
          </p>
          <div className="os__field">
            <label htmlFor={ids.n}>Seu nome</label>
            <input id={ids.n} ref={nome} type="text" autoComplete="name" />
          </div>
          <div className="os__field">
            <label htmlFor={ids.b}>Seu negócio</label>
            <input id={ids.b} ref={negocio} type="text" placeholder="Ex.: barbearia em Lorena" />
          </div>
          <div className="os__field">
            <label htmlFor={ids.p}>O que você quer automatizar ou construir</label>
            <textarea id={ids.p} ref={precisa} rows={4} placeholder="Ex.: parar de responder horário no WhatsApp o dia inteiro" />
          </div>
          <button type="button" className="btn btn--ink" onClick={send}>
            <Icon name="whatsapp" size={18} />
            Enviar pelo WhatsApp
          </button>
          <p className="os__note">O botão abre o WhatsApp com a mensagem pronta. Nada fica salvo neste site.</p>
        </div>
      </div>
      <Folio id="assistencia" />
    </section>
  );
}
