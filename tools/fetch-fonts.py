#!/usr/bin/env python3
"""
Regenera as fontes self-hosted em assets/fonts/.

Por que self-hostar: carregar as fontes de fonts.googleapis.com envia o IP de
todo visitante para o Google sem consentimento — incoerente com uma página que
vende conformidade com a LGPD. Servindo do próprio domínio, zero terceiros.

Uso:
    python3 tools/fetch-fonts.py

Gera:
    assets/fonts/*.woff2   (subset latin apenas — o site é PT/EN)
    assets/fonts/fonts.css (@font-face apontando para os arquivos locais; usado pelo 404)
    index.html             bloco entre /* FONTS:START */ e /* FONTS:END */

O index.html leva os @font-face inline de propósito: um <link> a mais custaria um
round-trip inteiro antes do primeiro paint. O 404.html, que não é crítico para
performance, continua usando o fonts.css.

Licença das fontes: SIL Open Font License 1.1 (permite self-hosting e
redistribuição). Space Grotesk, Inter e JetBrains Mono.
"""

import os
import re
import sys
import urllib.request

# Chrome moderno no User-Agent => o Google devolve woff2 (o formato mais leve).
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/120.0 Safari/537.36")

# A SIL OFL 1.1 permite uso comercial e self-hosting, mas exige que a licenca
# acompanhe os arquivos redistribuidos. Ela vive em assets/fonts/LICENSE.txt e
# NAO e gerada por este script — se voce trocar de familia de fonte, atualize
# os titulares la a mao, senao o repositorio volta a redistribuir fonte sem
# licenca.

CSS_URL = (
    "https://fonts.googleapis.com/css2?"
    "family=Space+Grotesk:wght@400;500;600;700"
    "&family=Inter:wght@400;500;600"
    "&family=JetBrains+Mono:wght@400;500;600"
    "&display=swap"
)

# O conteúdo do site é português + inglês: ambos cabem no subset 'latin'.
# Incluir 'latin-ext' dobraria o peso do repositório sem nenhum ganho.
KEEP_SUBSETS = {"latin"}

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "fonts")

HEADER = """/* Fontes self-hosted: Space Grotesk, Inter, JetBrains Mono — SIL Open Font License 1.1.
   Servidas do proprio dominio: zero request a servidores de terceiros e nenhum IP de
   visitante enviado ao Google (coerencia com a LGPD que a pagina promete).
   Subset: latin. Gerado por tools/fetch-fonts.py — nao edite a mao. */

"""


def get(url: str) -> bytes:
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60
    ).read()


def main() -> int:
    os.makedirs(OUT_DIR, exist_ok=True)

    css = get(CSS_URL).decode()
    blocks = re.findall(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{.*?\})", css, re.S)
    if not blocks:
        print("erro: nenhum @font-face encontrado na resposta do Google Fonts", file=sys.stderr)
        return 1

    kept, written = [], {}
    for subset, block in blocks:
        if subset not in KEEP_SUBSETS:
            continue
        family = re.search(r"font-family:\s*'([^']+)'", block).group(1)
        weight = re.search(r"font-weight:\s*(\d+)", block).group(1)
        remote = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)

        name = f"{family.lower().replace(' ', '-')}-{weight}-{subset}.woff2"
        if name not in written:
            data = get(remote)
            with open(os.path.join(OUT_DIR, name), "wb") as fh:
                fh.write(data)
            written[name] = len(data)
        kept.append(block.replace(remote, f"/assets/fonts/{name}").strip())

    with open(os.path.join(OUT_DIR, "fonts.css"), "w", encoding="utf-8") as fh:
        fh.write(HEADER + "\n\n".join(kept) + "\n")

    # Mantém o bloco inline do index.html em sincronia com o fonts.css.
    index = os.path.join(os.path.dirname(OUT_DIR), "..", "index.html")
    index = os.path.normpath(index)
    html = open(index, encoding="utf-8").read()
    start, end = "/* FONTS:START", "/* FONTS:END */"
    if start in html and end in html:
        before = html[: html.index(start)]
        after = html[html.index(end) + len(end):]
        inline = "\n".join(
            "    " + line if line.strip() else line
            for line in "\n\n".join(kept).splitlines()
        )
        html = (
            before
            + "/* FONTS:START — gerado por tools/fetch-fonts.py, nao edite a mao */\n"
            + inline
            + "\n    "
            + end
            + after
        )
        with open(index, "w", encoding="utf-8") as fh:
            fh.write(html)
        print("index.html: bloco @font-face inline atualizado")
    else:
        print("aviso: marcadores FONTS:START/END nao encontrados no index.html", file=sys.stderr)

    total = sum(written.values())
    for name, size in sorted(written.items()):
        print(f"  {name:<38} {size / 1024:6.1f} KB")
    print(f"\n{len(written)} arquivos woff2 · {total / 1024:.1f} KB · {len(kept)} regras @font-face")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
