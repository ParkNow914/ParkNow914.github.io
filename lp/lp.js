/* Comportamento comum das landings.
   Le o numero e o texto do WhatsApp de data- no <body>, entao a mesma logica
   serve as quatro paginas sem nenhuma duplicada. */

(function () {
  "use strict";

  // Vazio de proposito ate a conta de anuncios existir. Enquanto estiver
  // assim, nenhum script de terceiro e carregado e o banner nem aparece —
  // a pagina funciona igual, so nao mede.
  var PIXEL_ID = "";

  var CHAVE = "autark-consentimento";
  // Numero e mensagem vem do <body data-zap data-msg>: a mesma logica serve as
  // quatro landings sem nenhuma copia.
  var ZAP = document.body.dataset.zap || "5512991743827";
  var MSG = document.body.dataset.msg || "Ola Alisson! Vim pelo site da Autark.";

  // ---------- de qual anuncio a pessoa veio ----------
  // Sem isto, todo lead chega identico no WhatsApp e nao da pra saber qual
  // criativo pagou por ele. Com isto, a origem vem escrita na mensagem.
  function origem() {
    try {
      var q = new URLSearchParams(location.search);
      var partes = ["utm_source", "utm_campaign", "utm_content"]
        .map(function (k) { return q.get(k); })
        .filter(Boolean);
      return partes.length ? " [" + partes.join("/") + "]" : "";
    } catch (e) { return ""; }
  }

  var texto = MSG + origem();
  var href = "https://wa.me/" + ZAP + "?text=" + encodeURIComponent(texto);
  ["cta-topo", "cta-fim"].forEach(function (id) {
    var a = document.getElementById(id);
    if (a) a.href = href;
  });

  // ---------- consentimento ----------
  function carregarPixel() {
    if (!PIXEL_ID) return;
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");

    ["cta-topo", "cta-fim"].forEach(function (id) {
      var a = document.getElementById(id);
      if (a) a.addEventListener("click", function () { window.fbq("track", "Contact"); });
    });
  }

  var banner = document.getElementById("consentimento");
  var escolha = null;
  try { escolha = localStorage.getItem(CHAVE); } catch (e) { escolha = null; }

  if (!PIXEL_ID) {
    // nada a consentir: sem medicao, sem banner
  } else if (escolha === "sim") {
    carregarPixel();
  } else if (escolha !== "nao") {
    banner.classList.add("visivel");
  }

  function responder(valor) {
    try { localStorage.setItem(CHAVE, valor); } catch (e) { /* modo privado */ }
    banner.classList.remove("visivel");
    if (valor === "sim") carregarPixel();
  }
  var sim = document.getElementById("aceitar");
  var nao = document.getElementById("recusar");
  if (sim) sim.addEventListener("click", function () { responder("sim"); });
  if (nao) nao.addEventListener("click", function () { responder("nao"); });
})();
