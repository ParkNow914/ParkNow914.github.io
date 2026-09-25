#!/usr/bin/env python3
"""
Confere que todo arquivo local referenciado pelo site existe no disco, e que
todo arquivo em assets/ ainda é usado por alguém.

Pega os dois erros que passam despercebidos num site sem build:
  1. referência quebrada  -> imagem/fonte 404 em produção
  2. asset órfão          -> peso morto no repositório

Uso: python3 tools/check-assets.py   (sai com código 1 se achar problema)
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Arquivos onde procuramos referências. O site em site/ é um app Next.js: as
# referências dele são conferidas pelo build e pelos testes de ponta a ponta
# (site/scripts/e2e.mjs). Aqui fica o que é HTML escrito à mão.
SOURCES = [
    "assets/fonts/fonts.css",
    # Landings de anúncio: têm CSP própria e quebram se um asset sumir.
    "lp/lp.css",
    "lp/agenda/index.html",
    "lp/atendimento/index.html",
    "lp/juridico/index.html",
    "lp/delivery/index.html",
]

# Assets que existem para o mundo externo (crawlers, outros repositórios,
# links antigos) e por isso não aparecem citados no HTML deste repositório.
ALLOWED_ORPHANS = {
    # Preview social da home anterior: links compartilhados antes de set/2026
    # continuam apontando para ele.
    "assets/og.jpg",
    "assets/apple-touch-icon.png",
    "assets/icon-192.png",
    "assets/icon-512.png",
    # Consumidos pelo README de github.com/ParkNow914/ParkNow914, que aponta
    # para as versões publicadas aqui. Não são referenciados pelo site.
    "assets/banner.svg",
    "assets/agendazap.webp",
    "assets/bia.webp",
    "assets/crm.webp",
    "assets/flowhub.webp",
    "assets/marvet.webp",
    "assets/parknow.webp",
    # Prints da home anterior que ninguém mais cita. Ficam porque podem estar
    # em mensagens e posts antigos; o site novo usa as cópias em site/public/.
    "assets/acerto.webp",
    "assets/jurisia.webp",
    "assets/realcredmais.webp",
    "assets/tratto.webp",
    # Exigido pela SIL OFL 1.1: redistribuir os .woff2 obriga a licenca a
    # acompanhar. Ninguem linka do HTML, e nao deve mesmo.
    "assets/fonts/LICENSE.txt",
    "assets/fonts/hubot-sans-OFL.txt",
    "assets/fonts/mona-sans-OFL.txt",
    "assets/fonts/martian-mono-OFL.txt",
}

REF = re.compile(r'(?:src|href)\s*=\s*["\']([^"\']+)["\']|url\(\s*["\']?([^"\')]+)["\']?\s*\)')


def is_local(path: str) -> bool:
    return not (
        path.startswith(("http://", "https://", "//", "data:", "mailto:", "tel:", "#"))
        or path.strip() == ""
    )


def main() -> int:
    referenced, problems = set(), []

    for src in SOURCES:
        full = os.path.join(ROOT, src)
        if not os.path.exists(full):
            problems.append(f"fonte ausente: {src}")
            continue
        text = open(full, encoding="utf-8").read()

        raw = [a or b for a, b in REF.findall(text)]

        for ref in raw:
            if not is_local(ref):
                continue
            rel = ref.split("?")[0].split("#")[0].lstrip("/")
            referenced.add(rel)
            # "/" e as âncoras da home são do site em site/, publicado na raiz.
            if rel in ("", "index.html"):
                continue
            if not os.path.exists(os.path.join(ROOT, rel)):
                problems.append(f"referência quebrada em {src}: {ref}")

    for dirpath, _, files in os.walk(os.path.join(ROOT, "assets")):
        for name in files:
            rel = os.path.relpath(os.path.join(dirpath, name), ROOT).replace(os.sep, "/")
            if rel not in referenced and rel not in ALLOWED_ORPHANS:
                problems.append(f"asset órfão (ninguém referencia): {rel}")

    if problems:
        print("FALHOU:\n" + "\n".join("  - " + p for p in problems))
        return 1

    print(f"OK — {len(referenced)} referências locais resolvidas, nenhum asset órfão.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
