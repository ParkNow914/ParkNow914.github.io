"use client";

import { allowMotion } from "@/lib/motion";

// Só aparece quando o sistema pede menos movimento (o CSS decide pelo
// data-motion do palco). A escolha fica guardada neste navegador.
export function MotionToggle() {
  return (
    <button
      type="button"
      className="fig__motion"
      onClick={() => {
        allowMotion();
        window.location.reload();
      }}
    >
      Ver a montagem animada
    </button>
  );
}
