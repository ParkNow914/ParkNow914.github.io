#!/usr/bin/env python3
"""
Troca o domínio do site em todos os lugares de uma vez.

A URL aparece em ~28 pontos (canonical, hreflang, Open Graph, Twitter, cinco
blocos de JSON-LD, sitemap, robots, README). Trocar à mão é receita para deixar
uma para trás — e uma URL errada em canonical ou og:image quebra SEO e preview
social sem dar erro visível.

Uso:
    python3 tools/trocar-dominio.py autarktech.com.br
    python3 tools/trocar-dominio.py autarktech.com.br --conferir   (não grava)

Depois de rodar:
    1. confira o diff  ->  git diff
    2. crie o arquivo CNAME  ->  echo autarktech.com.br > CNAME
    3. commit e push
    4. no GitHub: Settings > Pages > Custom domain + "Enforce HTTPS"

IMPORTANTE: só rode isto quando o DNS já estiver propagado (o domínio precisa
responder). Se o CNAME entrar antes, o GitHub Pages para de servir no endereço
antigo e o site fica fora do ar até o DNS resolver.
"""

import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ATUAL = "parknow914.github.io"

ARQUIVOS = [
    "index.html",
    "404.html",
    "sitemap.xml",
    "robots.txt",
    "README.md",
    "manifest.webmanifest",
    # Cada landing tem canonical e Open Graph proprios. Fora desta lista,
    # apontariam para o dominio antigo depois da migracao — e canonical errado
    # nao da erro nenhum, so some do indice do Google semanas depois.
    "lp/agenda/index.html",
    "lp/atendimento/index.html",
    "lp/juridico/index.html",
    "lp/delivery/index.html",
    # O monitor bate no dominio de producao. Fora desta lista, continuaria
    # vigiando o endereco antigo e diria "no ar" com o site novo fora.
    ".github/workflows/disponibilidade.yml",
    # O lychee exclui as auto-referencias pelo dominio. Fora desta lista,
    # passaria a checar as proprias paginas contra o endereco antigo.
    ".github/workflows/quality.yml",
]


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    conferir = "--conferir" in sys.argv

    if not args:
        print(__doc__)
        return 1

    novo = args[0].strip().lower().removeprefix("https://").removeprefix("http://").rstrip("/")
    if "." not in novo or " " in novo:
        print(f"erro: '{novo}' não parece um domínio", file=sys.stderr)
        return 1

    total = 0
    for nome in ARQUIVOS:
        caminho = os.path.join(ROOT, nome)
        if not os.path.exists(caminho):
            continue
        texto = open(caminho, encoding="utf-8").read()
        quantas = texto.count(ATUAL)
        if not quantas:
            continue
        total += quantas
        print(f"  {nome:22} {quantas:3} ocorrência(s)")
        if not conferir:
            open(caminho, "w", encoding="utf-8").write(texto.replace(ATUAL, novo))

    if not total:
        print(f"nada encontrado — o domínio já é outro? (procurei por '{ATUAL}')")
        return 0

    if conferir:
        print(f"\n{total} ocorrência(s) seriam trocadas por '{novo}'. Nada foi gravado.")
    else:
        print(f"\n{total} ocorrência(s) trocadas para '{novo}'.")
        print("\nFalta ainda:")
        print(f"  1. echo {novo} > CNAME")
        print("  2. git add -A && git commit && git push")
        print("  3. GitHub > Settings > Pages > Custom domain + Enforce HTTPS")
        print("  4. atualizar os links do README do perfil (repo ParkNow914/ParkNow914)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
