// Movimento reduzido: o padrão é respeitar o sistema. Quem pede a montagem
// animada pelo botão da Fig. 1 (ou por ?movimento=1) fica com ela neste navegador.

const KEY = "autark-motion";

export function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(window.location.search).get("movimento");
    if (q === "1") window.localStorage.setItem(KEY, "on");
    if (q === "0") window.localStorage.removeItem(KEY);
    if (window.localStorage.getItem(KEY) === "on") return false;
  } catch {
    /* storage bloqueado: segue a preferência do sistema */
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function allowMotion() {
  try {
    window.localStorage.setItem(KEY, "on");
  } catch {
    /* sem storage, vale só para esta visita */
  }
}
