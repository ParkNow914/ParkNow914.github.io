#!/usr/bin/env bash
# Monta em _site/ tudo o que vai ao ar em autarktech.com.br:
#   site/out/  o site (export estático do Next, gerado por `npm run build` em site/)
#   lp/        landings de tráfego pago
#   assets/    arquivos das landings. Também servem a quem mora fora deste
#              repositório: o /lab/ puxa assets/fonts/ e o README do perfil no
#              GitHub mostra os prints de assets/*.webp. Não apague nada daqui
#              sem procurar nesses dois lugares.
# Falha se o site e as pastas antigas disputarem o mesmo caminho.
set -euo pipefail
cd "$(dirname "$0")/.."

test -f site/out/index.html || { echo "site/out/ não existe: rode npm run build em site/"; exit 1; }
rm -rf _site
mkdir _site
cp -R site/out/. _site/
for d in lp assets; do
  if [ -e "_site/$d" ]; then
    echo "conflito: o site também publica /$d"
    exit 1
  fi
  cp -R "$d" "_site/$d"
done
echo "montado em _site/: $(find _site -type f | wc -l) arquivos"
