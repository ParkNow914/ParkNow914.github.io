import Link from "next/link";
import { LogoMark } from "@/components/Icon";

export const metadata = { title: "Página não encontrada · Autark", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="nf">
      <LogoMark size={36} />
      <p className="nf__code">Erro 404</p>
      <h1 className="nf__t">Esta página não consta no manual.</h1>
      <p className="nf__body">O endereço pode ter mudado ou nunca ter existido. A capa tem o índice completo.</p>
      <Link className="btn btn--signal" href="/">
        Voltar à capa
      </Link>
    </main>
  );
}
