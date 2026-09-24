"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MachineLayer = dynamic(() => import("./MachineLayer"), { ssr: false });

// O 3D chega depois do conteúdo. Até lá, a moldura mostra o pôster da vista
// explodida (gerado da própria cena). O Three.js só carrega na primeira
// interação (mexer o mouse, tocar, rolar a roda, teclar) ou depois de alguns
// segundos parado. Até a checagem de WebGL espera: criar um contexto de GPU é
// caro e não pode disputar a thread com o primeiro paint. Sem WebGL, fica o pôster.
export function MachineMount() {
  const [go, setGo] = useState(false);

  useEffect(() => {
    // Sem "scroll": a rolagem suave emite um na inicialização e acordaria o 3D
    // antes da hora. Roda, toque, clique e tecla cobrem toda rolagem de verdade.
    const events = ["pointermove", "pointerdown", "wheel", "touchstart", "keydown"] as const;
    let timer = 0;
    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, start));
      window.clearTimeout(timer);
    };
    function start() {
      cleanup();
      const probe = document.createElement("canvas");
      if (probe.getContext("webgl2") || probe.getContext("webgl")) setGo(true);
    }
    events.forEach((e) => window.addEventListener(e, start, { passive: true }));
    timer = window.setTimeout(start, 12000);
    return cleanup;
  }, []);

  return go ? <MachineLayer /> : null;
}
