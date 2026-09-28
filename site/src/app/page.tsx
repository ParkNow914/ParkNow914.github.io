import { RunningHeader } from "@/components/RunningHeader";
import { Stage } from "@/components/Stage";
import { Sizing } from "@/components/Sizing";
import { Assistance } from "@/components/Assistance";
import { MachineMount } from "@/components/machine/MachineMount";
import { Enhance } from "@/components/Enhance";
import { STATIC_SECTIONS as S } from "@/generated/static-sections";
import { jsonLdHome } from "@/content/jsonld";
import { NotasRecentes } from "@/components/Notas";
import { notas } from "@/lib/notas";

// Ilha estática: HTML pronto, gerado no build a partir dos mesmos componentes
// (scripts/prerender.mjs). O React insere o bloco inteiro de uma vez em vez de
// hidratar cada nó; só a capa com o 3D, a calculadora e o formulário são React vivo.
function Static({ html }: { html: string }) {
  return <div className="static-island" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Page() {
  return (
    <>
      <RunningHeader />
      <main id="conteudo">
        <Stage />
        <Static html={S.applications} />
        <Static html={S.models} />
        <Static html={S.systems} />
        <Static html={S.install} />
        <Sizing />
        <Static html={S.field} />
        <NotasRecentes lista={notas()} />
        <Static html={S.maker} />
        <Static html={S.troubleshooting} />
        <Static html={S.warranty} />
        <Assistance />
      </main>
      <Static html={S.colophon} />
      <MachineMount />
      <Enhance />
      <script
        type="application/ld+json"
        // Sem aggregateRating: ver o comentário em content/jsonld.ts.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHome) }}
      />
    </>
  );
}
