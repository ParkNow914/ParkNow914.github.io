# Autark — site institucional

Site de uma página da **Autark**, estúdio de automação com IA de **Alisson Santos**.
Estático de verdade: sem framework, sem build, sem dependência em runtime.

**No ar:** <https://parknow914.github.io/>

---

## Estrutura

```
index.html              página inteira (HTML + CSS + JS inline)
404.html                página de erro
sw.js                   service worker (offline + cache)
manifest.webmanifest    PWA instalável
robots.txt / sitemap.xml
lighthouserc.json       metas de performance/a11y/SEO da CI
assets/
  *.webp                screenshots dos projetos e foto
  og.jpg                preview social 1200x630
  icon-*.png            ícones do PWA
  logo-mark.svg         logo vetorial (favicon e navbar)
  fonts/                Space Grotesk, Inter, JetBrains Mono (self-hosted)
tools/
  fetch-fonts.py        regenera assets/fonts/
  check-assets.py       valida referências locais e assets órfãos
.github/workflows/      CI de qualidade
```

## Rodar localmente

Não tem build. Qualquer servidor estático serve — mas **abra por HTTP, não por
`file://`**, senão o service worker e o manifest não funcionam.

```bash
python3 -m http.server 8000
# http://localhost:8000
```

## Editar

Tudo vive em `index.html`, na ordem: `<head>` (meta/SEO/JSON-LD) → `<style>` →
markup das seções → `<script>`.

### Trocar o número de WhatsApp

O número `5512991743827` aparece **6 vezes**, sempre dentro de `href`. Ficou
hardcoded de propósito: assim os CTAs continuam funcionando mesmo se o
JavaScript falhar. Para trocar, faça find/replace em `index.html` e neste README.

### Traduções (PT/EN)

O site é bilíngue via JavaScript, sem duplicar arquivos. Quatro atributos:

| Atributo | O que substitui | Use quando |
|---|---|---|
| `data-i18n` | `textContent` | texto puro |
| `data-i18n-html` | `innerHTML` | o texto tem `<strong>`, `<br>` ou entidades |
| `data-i18n-aria` | `aria-label` | rótulo de leitor de tela |
| `data-i18n-alt` | `alt` | descrição de imagem |

> ⚠️ Se o valor em inglês contiver **qualquer** tag ou entidade HTML, o elemento
> **precisa** usar `data-i18n-html`. Com `data-i18n` o markup aparece como texto
> literal na tela (`&amp;`, `<br />`), e o snapshot do português perde a
> formatação ao voltar de idioma.

O português é lido do próprio DOM (não existe dicionário PT). Para adicionar um
texto novo: marque o elemento com o atributo certo e acrescente a chave ao objeto
`en` dentro do `<script>`.

O idioma vem, nesta ordem: `?lang=en` na URL → preferência salva no
`localStorage` → português. O toggle atualiza a URL, o `<title>`, a
`description`, as tags Open Graph e o `canonical`.

### Regenerar as fontes

```bash
python3 tools/fetch-fonts.py
```

As fontes são **self-hosted** de propósito: carregá-las do `fonts.googleapis.com`
enviaria o IP de todo visitante para o Google sem consentimento — incoerente com
uma página que vende conformidade com a LGPD. Só o subset `latin` é baixado
(o conteúdo é PT/EN), o que dá ~320 KB no total.

## Qualidade (CI)

`.github/workflows/quality.yml` roda a cada push, PR e toda segunda-feira:

- **HTML + CSS** válidos (html5validator)
- **`tools/check-assets.py`** — nenhuma referência local quebrada, nenhum asset órfão
- **lychee** — links externos vivos (as demos apodrecem sozinhas quando um deploy cai)
- **Lighthouse CI** — mínimos de 90 em performance/boas práticas e 95 em a11y/SEO

Rodar a checagem local:

```bash
python3 tools/check-assets.py
```

## Decisões técnicas

- **Zero dependências.** Sem framework, sem CDN, sem tracker. O único request de
  terceiros que existia (Google Fonts) foi eliminado.
- **CSP via `<meta>`.** O GitHub Pages não permite cabeçalhos customizados, então
  a política vai no HTML. `frame-ancestors` foi omitido porque é ignorado em
  `<meta>` — proteção contra clickjacking exigiria um cabeçalho real
  (o Cloudflare Pages, por exemplo, permite).
- **Degradação sem JS.** As animações de entrada escondem seções com
  `opacity: 0`; um bloco `<noscript>` e um `try/catch` por módulo garantem que
  a página continue legível se o JavaScript falhar ou for bloqueado.
- **Imagens em WebP** com `width`/`height` declarados, para CLS zero.
- **Sem markup de avaliação (`aggregateRating`).** As notas do 99freelas seguem
  visíveis na página, mas não são declaradas em JSON-LD: nota da própria empresa
  sobre si mesma viola a política de reviews do Google e rende aviso de spam de
  dados estruturados.
- **Acessibilidade:** contraste AA em todo texto, `prefers-reduced-motion`,
  skip-link, FAQ com `aria-controls` e headings, menu mobile com `Esc`,
  clique-fora e retorno de foco.

## Publicar

O repositório é `ParkNow914/ParkNow914.github.io`, então o GitHub Pages serve a
branch `main` na raiz do domínio automaticamente — basta dar push.

```bash
git push origin main
```

Alternativa com banda ilimitada e cabeçalhos HTTP customizáveis:
[Cloudflare Pages](https://dash.cloudflare.com) → Workers & Pages → Create →
Pages → conectar o repositório (sem comando de build, output `/`).

## Analytics (opcional)

Não há nenhum tracker instalado. Há um comentário no `<head>` do `index.html`
com duas opções gratuitas e sem cookies (Cloudflare Web Analytics e GoatCounter).
Ao adicionar uma delas, **libere o domínio na CSP** — senão o script é bloqueado.
