"use client";

import { useEffect } from "react";
import { reducedMotion } from "@/lib/motion";
import { ASSEMBLY } from "@/content/site";
import {
  ASSEMBLY_PARTS,
  POWER_WINDOW,
  STEP_COUNT,
  TESTS_WINDOW,
  WINDOWS,
  machine,
  onAssembly,
  progressIn,
} from "./machine/store";

// Liga o scroll dos passos de §1 ao progresso da montagem (A de 0 a 6) e
// devolve o estado para o DOM: passo ativo, lista de peças, contadores e régua.
export function StageDriver() {
  useEffect(() => {
    const stage = document.getElementById("stage");
    const stepsEl = stage?.querySelector<HTMLElement>("[data-steps]");
    if (!stage || !stepsEl) return;

    const steps = Array.from(stage.querySelectorAll<HTMLElement>("[data-step]"));
    const rows = Array.from(stage.querySelectorAll<HTMLElement>("[data-part]"));
    const counts = Array.from(stage.querySelectorAll<HTMLElement>("[data-count]"));
    const figs = Array.from(stage.querySelectorAll<HTMLElement>("[data-fig]"));
    const fills = Array.from(stage.querySelectorAll<HTMLElement>("[data-fig-fill]"));
    const stepLabels = Array.from(stage.querySelectorAll<HTMLElement>("[data-fig-step]"));
    const stateLabels = Array.from(stage.querySelectorAll<HTMLElement>("[data-fig-state]"));

    const reduced = reducedMotion();
    machine.reduced = reduced;
    stage.dataset.motion = reduced ? "static" : "scroll";

    let lastState = "";
    let lastLabel = "";
    const render = (a: number) => {
      const idx = Math.min(STEP_COUNT - 1, Math.max(0, Math.floor(a)));
      const started = a > 0.02;
      steps.forEach((el, i) => {
        el.dataset.state = !started ? "" : i < idx ? "done" : i === idx ? "now" : "";
      });
      const now = started ? ASSEMBLY_PARTS[idx] ?? [] : [];
      rows.forEach((row) => {
        const n = Number(row.dataset.part);
        const ok = progressIn(a, WINDOWS[n]) >= 0.98;
        // A peça do passo atual fica em destaque o passo inteiro, mesmo já encaixada.
        row.dataset.state = now.includes(n) ? "now" : ok ? "ok" : "";
      });
      const k = progressIn(a, TESTS_WINDOW);
      counts.forEach((el) => {
        el.textContent = String(Math.round(k * Number(el.dataset.count)));
      });
      const done = Math.max(0, Math.min(STEP_COUNT, a));
      fills.forEach((el) => {
        el.style.transform = `scaleX(${(done / STEP_COUNT).toFixed(4)})`;
      });
      // O último passo é o "Operando": a cena liga assim que ele começa, e a
      // legenda só diz operando quando a lâmpada já acendeu.
      const state = a < 0.05 ? "drawing" : progressIn(a, POWER_WINDOW) > 0.5 ? "running" : "building";
      // A régua conta o mesmo passo que a legenda mostra.
      const shown = state === "drawing" ? 0 : state === "running" ? STEP_COUNT : idx + 1;
      stepLabels.forEach((el) => {
        el.textContent = `${shown}/${STEP_COUNT}`;
      });
      // A legenda da figura repete o passo atual: no celular o texto do passo
      // pode estar sob a figura fixa, e o leitor nunca perde onde está.
      const label =
        state === "drawing"
          ? "Cérebro Autark, vista explodida"
          : state === "running"
            ? "Cérebro Autark, operando"
            : `Passo ${idx + 1}/${STEP_COUNT}: ${ASSEMBLY[idx].title}`;
      if (state !== lastState || label !== lastLabel) {
        lastState = state;
        lastLabel = label;
        figs.forEach((el) => (el.dataset.fig = state));
        stateLabels.forEach((el) => (el.textContent = label));
      }
    };

    if (reduced) {
      machine.target = STEP_COUNT;
      render(STEP_COUNT);
      return;
    }

    render(0);
    const off = onAssembly(render);

    // Progresso = quanto da lista de passos já cruzou a linha de leitura. No
    // desktop é o meio da tela; no celular, logo abaixo da figura fixa, onde o
    // texto do passo realmente aparece.
    const figMain = stage.querySelector<HTMLElement>(".fig--main");
    const narrow = window.matchMedia("(max-width: 960px)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      const vh = window.innerHeight;
      let line = vh / 2;
      if (narrow.matches && figMain) {
        const fb = figMain.getBoundingClientRect().bottom;
        line = fb + (vh - fb) * 0.3;
      }
      const r = stepsEl.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      machine.target = p * STEP_COUNT;
      if (!machine.live) render(machine.target);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // A primeira medida espera o próximo quadro: medir durante a hidratação
    // forçaria um layout da página inteira no meio da tarefa mais pesada.
    onScroll();

    return () => {
      off();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
