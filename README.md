# Portfólio — Alisson Santos

Página de portfólio profissional, 100% estática, sem build e sem dependências.
Um único arquivo (`index.html`) — feita para converter clientes, não só mostrar projetos.

## ⚠️ Antes de publicar (2 minutos)

1. **WhatsApp**: abra o `index.html` e substitua **`SEUNUMEROAQUI`** (aparece 2x) pelo seu
   número no formato internacional, ex.: `5512999999999`.
2. **Link do 99freelas**: confira se o link do seu perfil público na seção de contato está
   correto (busque por `99freelas.com.br/user/` no arquivo e cole a URL real do seu perfil).
3. *(Opcional)* Troque o avatar "AS" por uma foto sua na seção Sobre.

## 🚀 Publicar de graça (para sempre)

### Opção A — GitHub Pages (mais simples)
```bash
cd "C:\Users\Loja Miguel\Documents\MEGA\portfolio"
git init
git add .
git commit -m "Portfolio"
git remote add origin https://github.com/ParkNow914/portfolio.git
git branch -M main
git push -u origin main --force
```
Depois: no GitHub → repositório `portfolio` → **Settings → Pages → Branch: main → Save**.
Site no ar em: `https://parknow914.github.io/portfolio/`

### Opção B — Cloudflare Pages (banda ilimitada, mais rápido)
1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages**
2. Conecte o repositório `portfolio` do GitHub (sem comando de build, output = `/`)
3. Site no ar em `portfolio-xxx.pages.dev` — e aceita domínio próprio grátis.

### Domínio próprio (opcional, ~R$ 40/ano)
Compre `alissonsantos.dev` ou similar no [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)
(preço de custo) e aponte para o GitHub Pages ou Cloudflare Pages.

## 🎨 Decisões de design (baseadas em pesquisa)

- **Referências**: Brittany Chiang (estrutura + spotlight cards), Dennis Snellenberg
  (posicionamento de freelancer premiado no Awwwards), tendências Awwwards/Muzli 2026.
- **Hero com bot de WhatsApp animado**: demonstra o serviço principal em 3 segundos —
  o visitante *vê* o bot vendendo sozinho.
- **Verde como cor de destaque**: on-brand com WhatsApp, seu nicho principal.
- **Estudos de caso, não lista de projetos**: cada projeto segue problema → solução →
  resultado, o formato que converte clientes segundo os guias de portfólio freelancer.
- **Depoimentos reais** do 99freelas com nota 5.0.
- **CTA de WhatsApp** acima da dobra, após os projetos e no fim — os 3 pontos de conversão.
- **Performance**: zero frameworks, zero imagens pesadas, JS vanilla (~150 linhas).
- **Acessibilidade**: HTML semântico, skip-link, `prefers-reduced-motion`, contraste AA.
- **SEO**: meta tags, Open Graph e JSON-LD (schema.org/Person).
