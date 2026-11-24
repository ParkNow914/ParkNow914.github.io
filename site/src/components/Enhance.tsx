"use client";

import { useEffect } from "react";
import { stampWhatsAppLinks } from "@/lib/origin";
import { reducedMotion } from "@/lib/motion";

// Melhorias que só existem com JavaScript. A página inteira funciona sem elas.
// A rolagem é a nativa do navegador: a montagem da Fig. 1 já amortece o
// movimento sozinha, e rolagem sequestrada por biblioteca quebrava âncoras.
export function Enhance() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    stampWhatsAppLinks();

    // Carimbos caem uma vez, quando entram na tela, e ficam.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-down");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-stamp]").forEach((el) => io.observe(el));
    // Se o observador não disparar (aba em segundo plano, navegador econômico),
    // o carimbo que já está na tela cai do mesmo jeito: nunca fica invisível.
    const fallback = window.setTimeout(() => {
      document.querySelectorAll("[data-stamp]:not(.is-down)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-down");
      });
    }, 1200);

    if (!reducedMotion() && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("motion-on");
    }

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
