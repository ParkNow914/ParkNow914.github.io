/* ============================================================
   Autark — service worker.

   Estratégia:
     - HTML  : network-first (o conteúdo muda; cache só como fallback offline)
     - demais: stale-while-revalidate (fontes, imagens e ícones têm hash de
               conteúdo estável, então servir do cache é seguro e instantâneo)

   Ao mudar arquivos do PRECACHE, suba o CACHE_VERSION: o SW antigo é
   descartado e os caches órfãos são apagados no activate.
   ============================================================ */

const CACHE_VERSION = "autark-v1";
const PRECACHE = [
  "/",
  "/index.html",
  "/404.html",
  "/manifest.webmanifest",
  "/assets/logo-mark.svg",
  "/assets/fonts/fonts.css",
  "/assets/fonts/inter-400-latin.woff2",
  "/assets/fonts/inter-500-latin.woff2",
  "/assets/fonts/inter-600-latin.woff2",
  "/assets/fonts/space-grotesk-400-latin.woff2",
  "/assets/fonts/space-grotesk-500-latin.woff2",
  "/assets/fonts/space-grotesk-600-latin.woff2",
  "/assets/fonts/space-grotesk-700-latin.woff2",
  "/assets/fonts/jetbrains-mono-400-latin.woff2",
  "/assets/fonts/jetbrains-mono-500-latin.woff2",
  "/assets/fonts/jetbrains-mono-600-latin.woff2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      // addAll é tudo-ou-nada: um 404 abortaria a instalação inteira.
      .then((cache) => Promise.allSettled(PRECACHE.map((url) => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Só interceptamos GET do próprio domínio. Links externos (wa.me, GitHub,
  // demos) passam direto para a rede, sem cache.
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isHTML =
    req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");

  if (isHTML) {
    // Network-first com teto de 3s: "offline" é fácil de detectar, mas rede ruim
    // (metrô, 3G no interior) trava esperando pelo servidor. Passou de 3s e
    // existe cópia em cache, servimos o cache e seguimos a vida.
    const rede = fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
      return res;
    });

    event.respondWith(
      caches.match(req).then((hit) => {
        if (!hit) return rede.catch(() => caches.match("/index.html"));
        const teto = new Promise((resolve) => setTimeout(() => resolve(hit), 3000));
        return Promise.race([rede.catch(() => hit), teto]);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((hit) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});
