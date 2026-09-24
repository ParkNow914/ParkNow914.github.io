"use client";

import { useEffect, useRef, useState } from "react";
import { REVISION, SECTIONS, WA_DEFAULT, type SectionId } from "@/content/site";
import { Icon, LogoMark } from "./Icon";

const TOTAL = String(SECTIONS.length).padStart(2, "0");

// Cabeçalho corrido do manual: sabe em que seção você está e em que página.
export function RunningHeader() {
  const [cur, setCur] = useState<SectionId>("capa");
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setCur(e.target.getAttribute("data-section") as SectionId);
        }
      },
      { rootMargin: "-38% 0px -58% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !btn.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const i = SECTIONS.findIndex((s) => s.id === cur);
  const sec = SECTIONS[i] ?? SECTIONS[0];
  const page = String(i + 1).padStart(2, "0");

  return (
    <>
      <header className="rh">
        <a className="rh__brand" href="#capa" aria-label="Autark, voltar à capa">
          <LogoMark size={20} />
          <span className="rh__name">Autark</span>
        </a>
        <span className="rh__doc">
          Manual de Operação <span className="rh__rev">{REVISION}</span>
        </span>
        <span className="rh__sec">
          <span className="rh__addr">{sec.address === "Capa" ? "" : sec.address}</span> {sec.title}
        </span>
        <span className="rh__page">
          Pág. {page}/{TOTAL}
        </span>
        <button
          ref={btn}
          type="button"
          className="rh__index"
          aria-expanded={open}
          aria-controls="indice"
          aria-label={open ? "Fechar o índice" : "Abrir o índice"}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "index"} size={18} />
          <span>Índice</span>
        </button>
        <a
          className="btn btn--signal btn--sm rh__cta"
          href={WA_DEFAULT}
          target="_blank"
          rel="noopener"
          aria-label="Pedir instalação pelo WhatsApp"
        >
          <Icon name="whatsapp" size={16} />
          <span>Pedir instalação</span>
        </a>
      </header>

      <nav id="indice" ref={panel} className="toc" aria-label="Índice do manual" hidden={!open}>
        <p className="toc__t">Índice</p>
        <ol className="toc__list">
          {SECTIONS.map((s, k) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={() => setOpen(false)} aria-current={s.id === cur ? "location" : undefined}>
                <span className="toc__addr">{s.address === "Capa" ? "" : s.address}</span>
                <span className="toc__title">{s.title}</span>
                <span className="toc__dots" aria-hidden="true" />
                <span className="toc__pg">{String(k + 1).padStart(2, "0")}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
