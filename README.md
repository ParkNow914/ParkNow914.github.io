# Autark — autarktech.com.br

Tudo o que vai ao ar em **<https://autarktech.com.br/>**, o domínio da Autark, estúdio de
automação com IA de **Alisson Santos**.

Desde setembro de 2026 a home é o **Manual de Operação**: o site inteiro é o manual do
proprietário de um sistema que trabalha sozinho, com uma máquina 3D que se monta conforme a
página rola. O código dele mora em [`site/`](site/) e tem o próprio README.

## O que mora aqui

```
site/                  a home: Next.js exportado como arquivos estáticos (ver site/README.md)
lp/                    landings de tráfego pago: agenda, atendimento, juridico, delivery
assets/                arquivos das landings (fontes, logo, foto). Também servem a quem
                       mora fora deste repositório: o /lab/ puxa assets/fonts/ e o README
                       do perfil no GitHub mostra os prints de assets/*.webp
tools/
  montar-site.sh       junta site/out, lp/ e assets/ em _site/, o que vai ao ar
  check-assets.py      referências locais das landings e assets órfãos
  fetch-fonts.py       regenera assets/fonts/ (fontes das landings e do /lab/)
lighthouserc*.json     metas de Lighthouse da CI (desktop e mobile)
_headers               cabeçalhos HTTP ideais; o GitHub Pages ignora (ver o próprio arquivo)
CNAME                  registro do domínio; quem manda é Settings > Pages
.github/workflows/     publicação, qualidade e disponibilidade
```

Outros endereços do domínio são repositórios próprios, servidos pelo GitHub Pages em
`autarktech.com.br/<repo>/`: `/lab/`, `/pdv-lio-demo/` e `/configurador-camadas/`. Nada
aqui os publica, mas o monitor de disponibilidade vigia os três.

## Publicar

Push na `main` publica. O workflow **Publicar** (`.github/workflows/publicar.yml`):

1. compila o site (`npm ci && npm run build` em `site/`);
2. monta o domínio com `tools/montar-site.sh`: o site na raiz, `lp/` e `assets/` ao lado;
3. roda os testes de ponta a ponta no site montado, com as landings junto;
4. só então publica no GitHub Pages.

Em pull request ele faz os passos 1 a 3 e para. Se um teste falha, nada vai ao ar e o
site continua na versão anterior.

O Pages está com a fonte **GitHub Actions** (Settings > Pages). O domínio, o HTTPS e o
DNS no Registro.br (registros A para o GitHub Pages) ficam como estão.

### Voltar uma versão

Reverta o commit na `main` (`git revert <commit>` e push). O workflow publica a versão
anterior em poucos minutos.

## Rodar localmente

```bash
cd site
npm install
npm run dev                      # http://localhost:3000, só o site
npm run build                    # gera site/out/
cd .. && bash tools/montar-site.sh
node site/scripts/serve.mjs _site 3100      # domínio montado, como no GitHub Pages
node site/scripts/e2e.mjs http://localhost:3100/ --landings
```

## Qualidade (CI)

| Workflow | Quando | O que garante |
|---|---|---|
| Publicar | push, PR | build, 32 testes de ponta a ponta no site montado (landings incluídas), publicação |
| Qualidade | push, PR, segunda 09:00 UTC | HTML e CSS das landings, referências locais, links externos, Lighthouse desktop e mobile na home, no 404 e nas landings |
| Disponibilidade | 09:00 e 21:00 UTC | a home responde com "Manual de Operação", as 4 landings e as 3 demos respondem, o certificado não está vencendo. Se algo cair, abre uma issue |

O E2E cobre:
- estrutura e JSON-LD;
- ilhas estáticas funcionando sem hidratação;
- calculadora e ordem de serviço montando a mensagem do WhatsApp;
- índice com teclado;
- montagem 3D até OPERANDO;
- origem UTM nos links;
- página sem JavaScript;
- links antigos da home anterior (`#projetos`, `#contato`, `#faq`, `#calculadora`) caindo na seção certa;
- 404;
- ausência de rolagem horizontal em 7 larguras;
- movimento reduzido.

## Decisões que valem para o domínio inteiro

- **Nenhum request a terceiros.** Fontes, imagens e 3D saem do próprio domínio; sem
  analytics, sem cookies. A página vende LGPD e precisa ser coerente com isso.
- **CSP via `<meta>`.** O GitHub Pages não deixa configurar cabeçalhos, então cada página
  leva a política no HTML. `frame-ancestors` fica de fora porque o navegador ignora essa
  diretiva em `<meta>`.
- **O service worker da home anterior foi desligado.** `/sw.js` agora é um desinstalador:
  apaga os caches e se desregistra no navegador de quem visitou o site antigo. Não volte a
  registrar service worker sem pensar em como desligá-lo depois.
- **Links antigos continuam chegando.** As âncoras da home anterior existem no site novo
  como marcadores invisíveis na seção equivalente (`LEGACY_ANCHORS` em
  `site/src/content/site.ts`).
- **Sem `aggregateRating` no JSON-LD.** Nota da própria empresa sobre si viola a política de
  reviews do Google. As avaliações do 99freelas ficam visíveis na página.

### Trocar de domínio

O domínio aparece em:
- `SITE_URL` em `site/src/content/site.ts`;
- canonical e Open Graph de cada landing em `lp/*/index.html`;
- `.github/workflows/disponibilidade.yml`;
- a exclusão do lychee em `.github/workflows/quality.yml`;
- `CNAME`.

Depois de trocar esses pontos, configure o domínio novo em Settings > Pages e aponte o DNS.
