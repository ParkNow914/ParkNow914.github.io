#!/usr/bin/env python3
"""
Confere que todo arquivo local referenciado pelo site existe no disco, e que
todo arquivo em assets/ ainda é usado por alguém.

Pega os dois erros que passam despercebidos num site sem build:
  1. referência quebrada  -> imagem/fonte 404 em produção
  2. asset órfão          -> peso morto no repositório

Uso: python3 tools/check-assets.py   (sai com código 1 se achar problema)
"""

import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Arquivos onde procuramos referências.
SOURCES = [
    "index.html",
    "404.html",
    "sw.js",
    "manifest.webmanifest",
    "assets/fonts/fonts.css",
    # Landing de anúncio: mora fora do index e tem CSP própria, mas quebra
    # do mesmo jeito se um asset sumir. Sem esta linha ela nasceria sem rede.
    "lp/agenda/index.html",
]

# Assets que existem para o mundo externo (crawlers, sistema operacional) e por
# isso não aparecem citados no HTML.
ALLOWED_ORPHANS = {
    "assets/og.jpg",
    "assets/apple-touch-icon.png",
    # Banner da marca: consumido pelo README de github.com/ParkNow914/ParkNow914,
    # que aponta para a versão publicada aqui. Não é referenciado pelo site.
    "assets/banner.svg",
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
        if src.endswith(".webmanifest"):
            raw += [i["src"] for i in json.loads(text).get("icons", [])]
        if src == "sw.js":
            raw += re.findall(r'"(/[^"]*)"', text)

        for ref in raw:
            if not is_local(ref):
                continue
            rel = ref.split("?")[0].split("#")[0].lstrip("/")
            if rel in ("", "index.html"):
                rel = "index.html"
            referenced.add(rel)
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
