// Um símbolo geométrico por sistema, todos desenhados na mesma grade de 24 com o
// mesmo traço, como a legenda de símbolos de um projeto. Decorativo: o nome do
// sistema sempre vem escrito ao lado.

const TRACOS: Record<string, React.ReactNode> = {
  // Agenda: o quadro do dia com o ponteiro do horário.
  "SYS-01": (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <circle cx="12" cy="12" r="5" />
      <path d="M12 12V9" />
    </>
  ),
  // CRM de WhatsApp: a conversa atravessando o funil.
  "SYS-02": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
    </>
  ),
  // JurisIA: o triângulo da balança com o fiel no meio.
  "SYS-03": (
    <>
      <path d="M12 3l9 17H3z" />
      <path d="M12 8v12" />
    </>
  ),
  // ParkNow: a vaga e a faixa diagonal.
  "SYS-04": (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <path d="M3 21L21 3" />
    </>
  ),
  // Bia: o pedido sobre a caixa da entrega.
  "SYS-05": (
    <>
      <circle cx="12" cy="8" r="5" />
      <rect x="4" y="13" width="16" height="8" />
    </>
  ),
  // FlowHub: as três etapas do funil subindo.
  "SYS-06": (
    <>
      <rect x="4" y="14" width="4" height="7" />
      <rect x="10" y="9" width="4" height="12" />
      <rect x="16" y="4" width="4" height="17" />
    </>
  ),
  // RealCred+: o círculo com o sinal de mais.
  "SYS-07": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M7 12h10" />
    </>
  ),
  // Índice de Gestão: o quadro dentro do quadro.
  "SYS-08": (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <rect x="8" y="8" width="8" height="8" />
    </>
  ),
  // Acerto: dois círculos que dividem a mesma área (a comissão repartida).
  "SYS-09": (
    <>
      <circle cx="9" cy="12" r="6" />
      <circle cx="15" cy="12" r="6" />
    </>
  ),
  // Autark Barber: as duas lâminas cruzadas no quadro.
  "SYS-10": (
    <>
      <rect x="3" y="3" width="18" height="18" />
      <path d="M3 3l18 18M21 3L3 21" />
    </>
  ),
};

export function Simbolo({ code, size = 24, className = "simbolo" }: { code: string; size?: number; className?: string }) {
  const tracos = TRACOS[code];
  if (!tracos) return null;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {tracos}
    </svg>
  );
}
