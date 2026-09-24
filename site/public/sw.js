/* Desinstalador do service worker da home anterior (set/2026).

   O site antigo registrava /sw.js com cache de HTML: depois de 3 s de espera,
   ele servia a cópia guardada. Quem já tinha visitado podia continuar vendo a
   home velha. O navegador confere este arquivo a cada visita e, ao achar esta
   versão, instala-a no lugar da antiga: ela apaga os caches e se desregistra.
   Da visita seguinte em diante tudo vem direto da rede. O site novo não
   registra service worker nenhum. */

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
    })(),
  );
});
