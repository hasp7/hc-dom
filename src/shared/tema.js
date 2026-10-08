/* Alternância claro/escuro. Corre no <head> para aplicar a preferência antes de pintar.
   A escolha fica em localStorage (só neste browser); sem escolha, segue o sistema. */
(function () {
  "use strict";
  var K = "hc-tema", r = document.documentElement;
  try { var t = localStorage.getItem(K); if (t === "dark" || t === "light") r.setAttribute("data-theme", t); } catch (e) {}
  function escuro() {
    var t = r.getAttribute("data-theme");
    return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  document.addEventListener("DOMContentLoaded", function () {
    var alvo = document.querySelector("header.cab .doc-id") || document.querySelector("header");
    if (!alvo) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "tema-btn nao-imprimir";
    function rotulo() { b.textContent = escuro() ? "Modo claro" : "Modo escuro"; b.setAttribute("aria-pressed", String(escuro())); }
    b.addEventListener("click", function () {
      var novo = escuro() ? "light" : "dark";
      r.setAttribute("data-theme", novo);
      try { localStorage.setItem(K, novo); } catch (e) {}
      rotulo();
    });
    rotulo();
    alvo.appendChild(b);
  });
})();
