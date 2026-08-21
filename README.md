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
lighthouserc.json       metas da CI no perfil desktop
lighthouserc.mobile.json  idem no perfil mobile (limiares menores: throttling)
_headers                cabeçalhos HTTP reais — só valem fora do GitHub Pages
assets/
  *.webp                screenshots dos projetos e foto
                        (tratto e acerto sao capas ilustradas: o print real
                         mostraria a marca do cliente)
  og.jpg                preview social 1200x630
  icon-*.png            ícones do PWA
  logo-mark.svg         logo vetorial (favicon e navbar)
  banner.svg            banner animado do README do perfil (não usado no site)
  fonts/                Space Grotesk, Inter, JetBrains Mono (self-hosted)
tools/
  fetch-fonts.py        regenera assets/fonts/
  check-assets.py       valida referências locais e assets órfãos
  e2e.mjs               testes de ponta a ponta dos fluxos da página
  trocar-dominio.py     migra o domínio em todos os 28 pontos de uma vez
.github/workflows/      CI de qualidade
.github/dependabot.yml  atualização mensal das actions
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

O site é bilíngue via JavaScript, sem duplicar arquivos. Cinco atributos:

| Atributo | O que substitui | Use quando |
|---|---|---|
| `data-i18n` | `textContent` | texto puro |
| `data-i18n-html` | `innerHTML` | o texto tem `<strong>`, `<br>` ou entidades |
| `data-i18n-aria` | `aria-label` | rótulo de leitor de tela |
| `data-i18n-alt` | `alt` | descrição de imagem |
| `data-i18n-ph` | `placeholder` | campo do formulário de contato |

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

`.github/workflows/quality.yml` roda a cada push, PR e toda segunda-feira, em
6 jobs:

| Job | O que garante |
|---|---|
| HTML + referências locais | HTML/CSS válidos e nenhum arquivo referenciado faltando |
| Links externos | as demos continuam no ar (elas caem sozinhas com o tempo) |
| Lighthouse (desktop) | performance/boas práticas ≥ 90, a11y/SEO ≥ 95 |
| Lighthouse (mobile) | mesmos mínimos, performance ≥ 80 (throttling é agressivo) |
| Fluxos críticos (E2E) | 26 testes de comportamento — ver abaixo |

O limiar de SEO vale só para o `index.html`. O `404.html` é `noindex` de propósito,
o que derruba a categoria de SEO para ~0.58 — cobrar 95 dele seria exigir que a
página de erro fosse indexável. Ele continua sendo checado em performance,
acessibilidade e boas práticas (ver `assertMatrix` no `lighthouserc.json`).

**A rodada semanal não é enfeite.** Ela roda no mesmo commit que já passou no push
e mesmo assim pega coisa nova: link externo que morreu, e falhas que dependem de
tempo — a asserção `color-contrast`, por exemplo, só enxerga as mensagens do chat
depois que elas animam, então um contraste ruim pode passar num push e reprovar
no agendamento. CI vermelha no agendado é sinal real, não flake para ignorar.

Rodar localmente:

```bash
python3 tools/check-assets.py    # referências e assets órfãos
node tools/e2e.mjs               # precisa de: npm install playwright
```

### O que o E2E cobre

O resto da CI valida estrutura; nenhuma dessas checagens pega uma regressão de
comportamento. `tools/e2e.mjs` cobre o formulário montando a mensagem, a troca de
idioma sem sobra de português, o FAQ abrindo, a calculadora, o tema e erros de
runtime no console.

Cobre também **rolagem horizontal em 7 larguras** (320 a 1024px). Por muito tempo
o teste rodava só em 1440px e por isso não pegou o hero escapando 18px num Android
de 360px — a largura mais comum de quem chega pelo Instagram.

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
- **Acessibilidade:** contraste AA em todo texto **nos dois temas**,
  `prefers-reduced-motion` (inclusive nas View Transitions), skip-link, FAQ com
  `aria-controls` e headings, menu mobile com `Esc`, clique-fora e retorno de foco.
- **Formulário sem `<form>`.** A CSP declara `form-action 'none'`; o botão monta a
  mensagem e abre o WhatsApp por JS, e o link direto logo abaixo cobre o caso sem
  JavaScript.
- **Grid com `minmax(0, …)`.** Colunas de grid têm `min-width: auto` e não encolhem
  abaixo do conteúdo — com o mockup do celular em 330px fixos, isso empurrava a
  página inteira para o lado em telas pequenas, e o `max-width: 100%` dele não
  segurava nada porque resolvia contra a própria largura travada.
- **`CACHE_VERSION` no `sw.js` precisa subir** sempre que um arquivo em `assets/`
  mudar de conteúdo mantendo o nome. Os assets são servidos
  *stale-while-revalidate*: sem o bump, quem já visitou o site continua vendo a
  versão antiga na primeira visita depois da atualização.

## Publicar

O repositório é `ParkNow914/ParkNow914.github.io`, então o GitHub Pages serve a
branch `main` na raiz do domínio automaticamente — basta dar push.

```bash
git push origin main
```

Alternativa com banda ilimitada e cabeçalhos HTTP customizáveis:
[Cloudflare Pages](https://dash.cloudflare.com) → Workers & Pages → Create →
Pages → conectar o repositório (sem comando de build, output `/`). O arquivo
`_headers` já está pronto para esse dia: leva a CSP completa (com o
`frame-ancestors` que o `<meta>` não consegue entregar), `Permissions-Policy`,
HSTS e as regras de cache.

### Trocar de domínio

```bash
python3 tools/trocar-dominio.py --conferir meudominio.com   # simula
python3 tools/trocar-dominio.py meudominio.com              # grava
```

A URL aparece em 28 pontos (canonical, hreflang, OG, Twitter, 5 blocos de JSON-LD,
sitemap, robots e README). Trocar à mão deixa algum para trás, e uma `canonical`
ou `og:image` errada quebra SEO e preview sem dar erro visível.

## Analytics (opcional)

Não há nenhum tracker instalado. Há um comentário no `<head>` do `index.html`
com duas opções gratuitas e sem cookies (Cloudflare Web Analytics e GoatCounter).
Ao adicionar uma delas, **libere o domínio na CSP** — senão o script é bloqueado.
