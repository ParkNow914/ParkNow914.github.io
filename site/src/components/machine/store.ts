// Estado compartilhado entre o scroll (DOM) e a cena 3D, fora do React de
// propósito: ele muda a cada frame e re-renderizar componentes a 60fps seria
// desperdício. Quem precisa reagir registra um ouvinte.

import { ASSEMBLY } from "@/content/site";

export const STEP_COUNT = ASSEMBLY.length;

/** Peças montadas em cada passo, na ordem do texto de §1. */
export const ASSEMBLY_PARTS: readonly (readonly number[])[] = ASSEMBLY.map((s) => s.parts);

/** A = progresso da montagem. <0 é a capa (explodida), 0..6 são os passos, 6 é "operando". */
export const machine = {
  target: -1,
  current: -1,
  pointerX: 0,
  pointerY: 0,
  reduced: false,
  live: false,
};

type Listener = (a: number) => void;
const listeners = new Set<Listener>();

export function onAssembly(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function emitAssembly(a: number) {
  listeners.forEach((fn) => fn(a));
}

/** Janelas de montagem de cada peça, em unidades de A. */
export const WINDOWS: Record<number, [number, number]> = {
  1: [0.05, 0.5],
  2: [1.05, 1.3],
  3: [1.15, 1.4],
  4: [1.25, 1.5],
  5: [2.05, 2.3],
  6: [2.15, 2.4],
  7: [2.25, 2.5],
  8: [3.05, 3.3],
  9: [4.05, 4.3],
};

export const TESTS_WINDOW: [number, number] = [3.1, 3.38];
export const SCREWS_WINDOW: [number, number] = [4.22, 4.55];
export const POWER_WINDOW: [number, number] = [4.9, 5.08];

export function progressIn(a: number, [s, e]: [number, number]) {
  return Math.min(1, Math.max(0, (a - s) / (e - s)));
}
