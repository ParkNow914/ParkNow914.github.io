"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Machine, type OverlayRefs } from "./Machine";
import { machine } from "./store";
import { PARTS } from "@/content/site";
import { reducedMotion } from "@/lib/motion";

// Um canvas fixo do tamanho da janela, por cima do conteúdo e sem capturar
// clique. A máquina se desenha dentro do "slot" do DOM que estiver ativo, então
// o mesmo objeto desliza da capa para a bancada de montagem sem trocar de cena.
export default function MachineLayer() {
  const overlay = useRef<OverlayRefs>({ svg: null, balloons: [], tag: null });
  const [active, setActive] = useState(true);
  const [lite] = useState(() => window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    machine.reduced = reducedMotion();
    const onMq = () => {
      machine.reduced = reducedMotion();
    };
    mq.addEventListener("change", onMq);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      machine.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      machine.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Fora da área da figura o canvas para de desenhar: bateria e GPU agradecem.
    const stage = document.getElementById("stage");
    let io: IntersectionObserver | undefined;
    if (stage) {
      io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: "120px 0px" });
      io.observe(stage);
    }

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("pointermove", onMove);
      io?.disconnect();
      document.documentElement.classList.remove("fig-ready");
    };
  }, []);

  return (
    <div className="fig-layer" aria-hidden="true" data-active={active}>
      <Canvas
        // O R3F põe pointer-events: auto no invólucro; aqui a figura é só
        // imagem, e o canvas fixo por cima da página não pode roubar cliques.
        style={{ pointerEvents: "none" }}
        eventSource={undefined}
        frameloop={active ? "always" : "never"}
        dpr={lite ? [1, 1.25] : [1, 1.75]}
        camera={{ fov: 30, position: [0, 0, 14], near: 0.1, far: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1.05;
          machine.live = true;
          requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("fig-ready")));
        }}
      >
        <Machine overlay={overlay} lite={lite} />
      </Canvas>
      <svg
        className="fig-overlay"
        ref={(el) => {
          overlay.current.svg = el;
        }}
      >
        {PARTS.map((p) => (
          <g
            key={p.n}
            opacity="0"
            ref={(el) => {
              overlay.current.balloons[p.n] = el;
            }}
          >
            <line className="fig-leader" x1="0" y1="0" x2="0" y2="0" />
            <circle className="fig-balloon" r="12" />
            <text className="fig-balloon-n" textAnchor="middle" dy="0.36em">
              {p.n}
            </text>
          </g>
        ))}
        <g
          opacity="0"
          ref={(el) => {
            overlay.current.tag = el;
          }}
        >
          <line className="fig-leader" x1="4" y1="-4" x2="30" y2="-30" />
          <g transform="translate(30 -46)">
            <rect className="fig-tag" x="0" y="0" width="104" height="24" />
            <circle className="fig-tag-dot" cx="13" cy="12" r="4" />
            <text className="fig-tag-t" x="24" y="16">
              OPERANDO
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
