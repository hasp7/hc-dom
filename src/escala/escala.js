/* Motor das ferramentas de escala isolada (barthel/, morse/).
   A configuração vem de window.ESCALA (definida por página no build). Sem rede, sem IA. */
(function () {
  "use strict";
  var C = window.ESCALA;
  var KEY = "hc-escala-" + C.chave + "-v1";
  var form = document.getElementById("f");

  function el(tag, attrs, texto) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (texto != null) e.textContent = texto;
    return e;
  }
  function campo(n) { return form.elements[n]; }
  function hojeISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function dataPT(iso) { var p = (iso || "").split("-"); return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : ""; }

  /* ---------- construção ---------- */
  var itensEl = document.getElementById("itens");
  var max = 0;
  C.itens.forEach(function (it) {
    var fs = el("fieldset", { "class": "item", "data-n": it[0] });
    var lg = el("legend");
    lg.appendChild(el("span", null, it[1]));
    lg.appendChild(el("span", { "class": "pts", id: "pts_" + it[0] }));
    fs.appendChild(lg);
    var maxItem = 0;
    it[2].forEach(function (o) {
      maxItem = Math.max(maxItem, +o[0]);
      var l = el("label", { "class": "op" });
      l.appendChild(el("input", { type: "radio", name: it[0], value: o[0] }));
      var s = el("span");
      s.appendChild(el("span", { "class": "v", "data-v": o[0] }, o[0]));
      s.appendChild(document.createTextNode(" " + o[1]));
      s.appendChild(el("span", { "class": "d" }, o[2] || ""));
      l.appendChild(s);
      fs.appendChild(l);
    });
    max += maxItem;
    itensEl.appendChild(fs);
  });
  /* Apresentação alternativa (Barthel: 0–20 por omissão, 0–100 no interruptor).
     Os valores guardam-se sempre na escala original; só a apresentação muda. */
  var KEY_ALT = "hc-" + C.chave + "-0a100";
  var modo100 = false;
  if (C.divisor) { try { modo100 = localStorage.getItem(KEY_ALT) === "1"; } catch (err) {} }
  function f(v) { return C.divisor && !modo100 ? v / C.divisor : v; }
  function escalaTxt() { return C.divisor ? (modo100 ? "0–" + max : "0–" + (max / C.divisor)) : ""; }
  var tbF = document.querySelector("#faixas tbody");
  function preencherApresentacao() {
    itensEl.querySelectorAll(".op .v").forEach(function (s) { s.textContent = f(+s.getAttribute("data-v")); });
    document.getElementById("max").textContent = f(max);
    document.getElementById("faixas-th").textContent = C.divisor ? "Pontuação (" + escalaTxt() + ")" : "Pontuação";
    tbF.textContent = "";
    C.faixas.forEach(function (fx) {
      var rot = fx[fx.length - 1], faixa = fx.length === 3 ? (modo100 ? fx[1] : fx[0]) : fx[0];
      var tr = el("tr", { "data-cls": rot });
      tr.appendChild(el("td", null, faixa)); tr.appendChild(el("td", null, rot));
      tbF.appendChild(tr);
    });
  }
  if (C.divisor) {
    var sw = el("label", { "class": "switch", title: "Mostrar a pontuação na escala de 0 a " + max });
    var cb = el("input", { type: "checkbox", role: "switch", "aria-label": "Pontuação de 0 a " + max });
    cb.checked = modo100;
    sw.appendChild(cb); sw.appendChild(el("span", { "class": "trilho-sw", "aria-hidden": "true" })); sw.appendChild(el("span", null, "0–" + max));
    var barra = document.querySelector(".barra");
    barra.insertBefore(sw, document.getElementById("btn-imprimir"));
    cb.addEventListener("change", function () {
      modo100 = cb.checked;
      try { localStorage.setItem(KEY_ALT, modo100 ? "1" : "0"); } catch (err) {}
      preencherApresentacao(); calcular();
    });
  }
  preencherApresentacao();
  document.getElementById("fonte").textContent = C.fonte;

  // Descrição / Uso
  if (C.info) {
    var ic = document.getElementById("intro-corpo");
    [["Descrição", C.info.descricao], ["Leitura", C.info.leitura], ["Uso", C.info.uso]].forEach(function (p) {
      ic.appendChild(el("h3", null, p[0])); ic.appendChild(el("p", null, p[1]));
    });
    ic.appendChild(el("h3", null, "Fontes"));
    var ol = el("ol");
    C.info.fontes.forEach(function (f) { ol.appendChild(el("li", null, f)); });
    ic.appendChild(ol);
  } else {
    document.querySelector("details.intro").remove();
  }

  /* ---------- cálculo ---------- */
  function classe(t) {
    for (var i = 0; i < C.classes.length; i++) if (t >= C.classes[i][0]) return C.classes[i][1];
    return "";
  }
  function calcular() {
    var total = 0, n = 0;
    C.itens.forEach(function (it) {
      var v = form.elements[it[0]].value;
      var fs = itensEl.querySelector('[data-n="' + it[0] + '"]');
      fs.classList.toggle("feito", v !== "");
      document.getElementById("pts_" + it[0]).textContent = v !== "" ? f(+v) + " pts" : "";
      if (v !== "") { total += +v; n++; }
    });
    var completo = n === C.itens.length;
    var cls = !n ? "" : completo ? classe(total) : "incompleto (" + n + "/" + C.itens.length + ")";
    document.getElementById("total").textContent = n ? f(total) : "—";
    document.getElementById("total-alt").textContent = n && C.divisor
      ? (modo100 ? "= " + total / C.divisor + "/" + max / C.divisor + " (0–" + max / C.divisor + ")" : "= " + total + "/" + max + " (0–" + max + ")") : "";
    document.getElementById("cls").textContent = cls;
    document.getElementById("t-barra").textContent = n ? f(total) + "/" + f(max) : "—";
    document.getElementById("c-barra").textContent = cls;
    tbF.querySelectorAll("tr").forEach(function (tr) { tr.classList.toggle("atual", completo && tr.getAttribute("data-cls") === cls); });
    // idade
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(campo("u_nasc").value), idade = "";
    if (m) {
      var h = new Date(), a = h.getFullYear() - +m[1];
      if (h.getMonth() + 1 < +m[2] || (h.getMonth() + 1 === +m[2] && h.getDate() < +m[3])) a--;
      if (a >= 0 && a < 130) idade = a + " anos";
    }
    campo("u_idade").value = idade;
  }

  /* ---------- rascunho ---------- */
  function guardar() {
    var d = {};
    Array.prototype.forEach.call(form.elements, function (e) {
      if (!e.name) return;
      if (e.type === "radio") { if (e.checked) d[e.name] = e.value; }
      else d[e.name] = e.value;
    });
    try { sessionStorage.setItem(KEY, JSON.stringify(d)); } catch (err) {}
  }
  function repor() {
    var d;
    try { d = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (err) { d = null; }
    if (!d) return false;
    Array.prototype.forEach.call(form.elements, function (e) {
      if (!e.name || !(e.name in d)) return;
      if (e.type === "radio") e.checked = d[e.name] === e.value; else e.value = d[e.name];
    });
    return true;
  }

  /* ---------- impressão ---------- */
  var cabPrint = el("style");
  document.head.appendChild(cabPrint);
  var tituloOriginal = document.title;
  function prepararImpressao() {
    calcular();
    form.querySelectorAll("textarea, input[type=date]").forEach(function (t) {
      var esp = t.nextElementSibling;
      if (!esp || !esp.classList.contains("espelho")) { esp = el("div", { "class": "espelho" }); t.parentNode.insertBefore(esp, t.nextSibling); }
      esp.textContent = t.type === "date" ? dataPT(t.value) : t.value;
      t.classList.add("espelhado");
    });
    var partes = [campo("u_nome").value.trim()];
    if (campo("u_sns").value.trim()) partes.push("SNS " + campo("u_sns").value.trim());
    partes.push(C.nome);
    var txt = partes.filter(Boolean).join(" · ").replace(/[\\"]/g, "\\$&").replace(/[\r\n]+/g, " ");
    cabPrint.textContent = '@page { @top-left { content: "' + txt + '"; font: 8pt "Lato", sans-serif; color: #0e5b6b; } } @page :first { @top-left { content: none; } }';
    var u = campo("u_nome").value.trim();
    var ini = u ? u.split(/\s+/).map(function (p) { return p.charAt(0).toUpperCase(); }).join("") : "utente";
    document.title = "HC_" + C.nome.replace(/\s+/g, "-") + "_" + (campo("a_data").value || hojeISO()) + "_" + ini;
  }
  window.addEventListener("beforeprint", prepararImpressao);
  window.addEventListener("afterprint", function () { document.title = tituloOriginal; });

  /* ---------- eventos ---------- */
  function autosize(t) { t.style.height = "auto"; t.style.height = t.scrollHeight + 2 + "px"; }
  form.addEventListener("input", function (e) { if (e.target.tagName === "TEXTAREA") autosize(e.target); calcular(); guardar(); });
  form.addEventListener("change", function () { calcular(); guardar(); });
  document.getElementById("btn-imprimir").addEventListener("click", function () { guardar(); window.print(); });
  document.getElementById("btn-limpar").addEventListener("click", function () {
    if (!confirm("Apagar tudo o que foi preenchido?")) return;
    try { sessionStorage.removeItem(KEY); } catch (err) {}
    form.reset();
    campo("a_data").value = hojeISO();
    calcular();
  });

  campo("u_nasc").max = hojeISO();
  if (!repor()) campo("a_data").value = hojeISO();
  form.querySelectorAll("textarea").forEach(autosize);
  calcular();
})();
