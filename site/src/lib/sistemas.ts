// Página própria de cada sistema (/sistemas/<slug>/). Os dados são os mesmos da
// ficha na home (content/site.ts); aqui só se junta o que mora em outro lugar:
// a linha da §2 que aponta para o sistema e as notas de campo sobre ele.

import { APPLICATIONS, SYSTEMS, type System } from "@/content/site";
import { notas } from "@/lib/notas";

/** Nome do projeto como aparece no cabeçalho das notas (`projeto:`). */
const PROJETOS: Record<string, string[]> = {
  "SYS-01": ["AgendaZap"],
  "SYS-02": ["CRM RealCred"],
  "SYS-03": ["JurisIA"],
  "SYS-04": ["ParkNow"],
  "SYS-05": ["Bia"],
  "SYS-07": ["RealCred+"],
  "SYS-08": ["Índice de Gestão"],
  "SYS-09": ["Acerto"],
};

export function sistema(slug: string): System | undefined {
  return SYSTEMS.find((s) => s.slug === slug);
}

export function aplicacoes(s: System) {
  return APPLICATIONS.rows.filter((r) => r.ref === s.code);
}

export function notasDoSistema(s: System) {
  const nomes = PROJETOS[s.code] ?? [];
  return notas().filter((n) => n.projeto && nomes.includes(n.projeto));
}
