/* Escala de Sobrecarga do Cuidador (Zarit, versão de Sequeira) — lógica da página.
   Sem rede, sem IA. Itens, opções e cortes vêm de shared/esc-itens.js. */
(function () {
  "use strict";
  var KEY = "hc-esc-zarit-v1";
  var N = ESC_ITENS.length, MIN = N, MAX = N * 5;
  var form = document.getElementById("f");
  var itensEl = document.getElementById("itens");
  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, texto) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (texto != null) e.textContent = texto;
    return e;
  }
  function campo(n) { return form.elements[n]; }
  function pct(v) { return ((v - MIN) / (MAX - MIN)) * 100; }
  function reduz() { return matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function hojeISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function dataPT(iso) { var p = (iso || "").split("-"); return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : ""; }
  function rotulo(v) { for (var i = 0; i < ESC_OPCOES.length; i++) if (ESC_OPCOES[i][0] === String(v)) return ESC_OPCOES[i][1]; return ""; }
  function categoria(t) { for (var i = 0; i < ESC_CLASSES.length; i++) if (t >= ESC_CLASSES[i][0]) return ESC_CLASSES[i]; return ESC_CLASSES[ESC_CLASSES.length - 1]; }

  // Aviso: marcadores (bloqueante) ou texto ainda não verificado contra o original (informativo)
  var aviso = $("aviso-itens");
  if (ESC_ITENS.some(function (t) { return t === ESC_MARCADOR; })) {
    aviso.hidden = false;
  } else if (!ESC_TEXTO_VERIFICADO) {
    aviso.hidden = false;
    aviso.className = "aviso";
    aviso.textContent = "";
    aviso.appendChild(el("strong", null, "Versão de desenvolvimento e testes de usabilidade. "));
    aviso.appendChild(document.createTextNode("O texto dos itens ainda não foi confirmado palavra a palavra contra a versão de Sequeira (2010). Não usar para decisão clínica até essa verificação."));
    $("nota-verif").hidden = false;
  }

  /* ---------- descrição / uso ---------- */
  (function () {
    var ic = $("intro-corpo");
    if (!ic || typeof ESC_INFO === "undefined") return;
    [["Descrição", ESC_INFO.descricao], ["Leitura", ESC_INFO.leitura], ["Uso", ESC_INFO.uso]].forEach(function (p) {
      ic.appendChild(el("h3", null, p[0])); ic.appendChild(el("p", null, p[1]));
    });
    ic.appendChild(el("h3", null, "Fontes"));
    var ol = el("ol");
    ESC_INFO.fontes.forEach(function (f) { ol.appendChild(el("li", null, f)); });
    ic.appendChild(ol);
  })();

  /* ---------- itens ---------- */
  ESC_ITENS.forEach(function (txt, i) {
    var n = i + 1;
    var fs = el("fieldset", { "class": "item" + (n === N ? " global" : ""), id: "item-" + n });
    var lg = el("legend");
    lg.appendChild(el("span", { "class": "num", "aria-hidden": "true" }, String(n)));
    var t = el("span", { "class": "txt" });
    t.appendChild(el("span", { "class": "sr" }, "Item " + n + ". "));
    t.appendChild(document.createTextNode(txt));
    if (n === N) t.appendChild(el("span", { "class": "etiqueta" }, "Avaliação global"));
    lg.appendChild(t); fs.appendChild(lg);
    var ops = el("div", { "class": "ops" });
    ESC_OPCOES.forEach(function (o) {
      var l = el("label", { "class": "op" });
      l.appendChild(el("input", { type: "radio", name: "i" + n, value: o[0] }));
      var s = el("span"); s.appendChild(el("b", null, o[0])); s.appendChild(el("small", null, o[1]));
      l.appendChild(s); ops.appendChild(l);
    });
    fs.appendChild(ops); itensEl.appendChild(fs);
  });

  /* ---------- medidor e faixas ---------- */
  var cLig = ESC_CLASSES[1][0], cInt = ESC_CLASSES[0][0];
  $("z1").style.width = pct(cLig - 0.5) + "%";
  $("z2").style.width = (pct(cInt - 0.5) - pct(cLig - 0.5)) + "%";
  $("z3").style.width = (100 - pct(cInt - 0.5)) + "%";
  [MIN, cLig, cInt - 1, MAX].forEach(function (v) { var s = el("span", null, String(v)); s.style.left = pct(v) + "%"; $("marcas").appendChild(s); });
  var tbF = document.querySelector("#faixas tbody");
  ESC_FAIXAS.forEach(function (f) { var tr = el("tr", { "data-cls": f[1] }); tr.appendChild(el("td", null, f[0])); tr.appendChild(el("td", null, f[1])); tbF.appendChild(tr); });

  function respostas() { var r = []; for (var n = 1; n <= N; n++) { var v = form.elements["i" + n].value; r.push(v === "" ? null : +v); } return r; }

  function chip(cont, n, titulo) {
    var li = el("li"), a = el("a", { href: "#item-" + n, "data-n": String(n), "aria-label": titulo }, String(n));
    li.appendChild(a); cont.appendChild(li);
  }

  function atualizar() {
    var r = respostas();
    var feitos = r.filter(function (v) { return v !== null; }).length;
    var soma = r.reduce(function (a, v) { return a + (v || 0); }, 0);
    var falta = N - feitos, lo = soma + falta, hi = soma + falta * 5;
    $("pb").style.width = (feitos / N * 100) + "%";
    $("pb-n").textContent = feitos + "/" + N;
    r.forEach(function (v, i) {
      var fs = $("item-" + (i + 1));
      fs.classList.toggle("resp", v !== null);
      fs.classList.toggle("marcado", v !== null && v >= ESC_LIMIAR);
      if (v !== null) fs.classList.remove("falta");
    });

    var pont = $("pontuacao"); pont.textContent = "";
    var banda = $("banda"), ptr = $("ponteiro"), cat = null;
    if (falta === 0) {
      banda.style.display = "none"; ptr.style.display = "block"; ptr.style.left = pct(soma) + "%";
      cat = categoria(soma);
      pont.appendChild(document.createTextNode("Pontuação total"));
      pont.appendChild(el("strong", null, String(soma)));
      pont.appendChild(el("span", { "class": "cat " + cat[2] }, cat[1]));
      $("res-barra").innerHTML = "";
      $("res-barra").appendChild(el("strong", null, String(soma)));
      $("res-barra").appendChild(document.createTextNode(" " + cat[1]));
    } else {
      banda.style.display = feitos ? "block" : "none"; ptr.style.display = "none";
      banda.style.left = pct(lo) + "%"; banda.style.width = Math.max(pct(hi) - pct(lo), 0.8) + "%";
      pont.appendChild(document.createTextNode(feitos ? "Intervalo possível" : "Sem respostas"));
      if (feitos) pont.appendChild(el("strong", null, lo + " a " + hi));
      pont.appendChild(el("p", { "class": "vazio", style: "margin:6px 0 0" },
        "A classificação aparece com os " + N + " itens respondidos. " + (falta === 1 ? "Falta 1 item." : "Faltam " + falta + " itens.")));
      $("res-barra").textContent = feitos ? "intervalo " + lo + "–" + hi : "";
    }
    tbF.querySelectorAll("tr").forEach(function (tr) { tr.classList.toggle("atual", !!cat && tr.getAttribute("data-cls") === cat[1]); });

    // Evolução face à avaliação anterior
    var prevTxt = (campo("r_total").value || "").trim(), be = $("bloco-evol"), ev = $("evolucao");
    ev.textContent = "";
    if (prevTxt === "") { be.hidden = true; }
    else {
      be.hidden = false;
      var prev = parseInt(prevTxt, 10), quando = campo("r_data").value ? " em " + dataPT(campo("r_data").value) : "";
      if (isNaN(prev) || prev < MIN || prev > MAX) {
        ev.textContent = "O total anterior tem de estar entre " + MIN + " e " + MAX + ".";
      } else if (falta > 0) {
        ev.textContent = "Anterior: " + prev + " (" + categoria(prev)[1] + ")" + quando + ". A variação aparece com os " + N + " itens respondidos.";
      } else {
        var d = soma - prev;
        var sinal = el("span", { "class": d > 0 ? "evol-sobe" : d < 0 ? "evol-desce" : "" }, (d > 0 ? "+" : "") + d + " pontos");
        ev.appendChild(sinal);
        ev.appendChild(document.createTextNode(" face à avaliação anterior" + quando + ": " + prev + " (" + categoria(prev)[1] + ") → " + soma + " (" + categoria(soma)[1] + ")."));
      }
    }

    var g = r[N - 1];
    $("global").textContent = g === null ? "Por responder." : rotulo(g) + " (" + g + ")";
    $("global").className = g === null ? "vazio" : "";

    var mc = $("marcados"); mc.textContent = "";
    var marc = [];
    r.forEach(function (v, i) { if (v !== null && v >= ESC_LIMIAR) { marc.push(i + 1); chip(mc, i + 1, "Item " + (i + 1) + ", " + rotulo(v)); } });
    $("sem-marcados").style.display = marc.length ? "none" : "block";

    // Subescalas (fatores de Sequeira): pontuação, intervalo e média por item
    var tbS = document.querySelector("#subescalas tbody"); tbS.textContent = "";
    ESC_FATORES.forEach(function (fx) {
      var vals = fx.itens.map(function (n) { return r[n - 1]; }).filter(function (v) { return v !== null; });
      var k = fx.itens.length, somaF = vals.reduce(function (a, v) { return a + v; }, 0);
      var tr = el("tr");
      var c1 = el("td"); c1.appendChild(document.createTextNode(fx.nome + " (" + fx.id + ")"));
      c1.appendChild(el("small", null, "Itens " + fx.itens.join(", ") + " · α " + fx.alfa));
      if (fx.prudencia) c1.appendChild(el("span", { "class": "aviso-ec" }, "Consistência interna mais baixa — ler com prudência"));
      tr.appendChild(c1);
      if (vals.length === k) {
        var media = somaF / k;
        tr.appendChild(el("td", null, somaF + " (" + k + "–" + k * 5 + ")"));
        var c3 = el("td"); c3.appendChild(document.createTextNode(media.toFixed(1).replace(".", ",")));
        var b = el("span", { "class": "barra-media", "aria-hidden": "true" }), i = el("i"); i.style.width = ((media - 1) / 4 * 100) + "%";
        b.appendChild(i); c3.appendChild(b); tr.appendChild(c3);
      } else {
        tr.appendChild(el("td", { "class": "vazio" }, vals.length + "/" + k + " itens"));
        tr.appendChild(el("td", { "class": "vazio" }, "—"));
      }
      tbS.appendChild(tr);
    });

    var fl = $("falta"); fl.textContent = "";
    var em = [];
    r.forEach(function (v, i) { if (v === null) { em.push(i + 1); chip(fl, i + 1, "Ir para o item " + (i + 1)); } });
    $("bloco-falta").style.display = (em.length && em.length < N) ? "block" : "none";
  }

  /* ---------- navegação ---------- */
  function irPara(n) {
    var fs = $("item-" + n);
    fs.scrollIntoView({ block: "center", behavior: reduz() ? "auto" : "smooth" });
    (fs.querySelector("input:checked") || fs.querySelector("input")).focus({ preventScroll: true });
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest(".chips a"); if (!a) return;
    e.preventDefault(); irPara(+a.getAttribute("data-n"));
  });
  $("btn-seguinte").addEventListener("click", function () {
    var r = respostas(), i = r.indexOf(null);
    if (i < 0) { $("resultado").scrollIntoView({ block: "start", behavior: reduz() ? "auto" : "smooth" }); return; }
    $("item-" + (i + 1)).classList.add("falta");
    irPara(i + 1);
  });
  itensEl.addEventListener("keydown", function (e) {
    if (!/^[1-5]$/.test(e.key)) return;
    var fs = e.target.closest("fieldset.item"); if (!fs) return;
    e.preventDefault();
    var inp = fs.querySelector('input[value="' + e.key + '"]');
    inp.checked = true; inp.dispatchEvent(new Event("change", { bubbles: true }));
    var nx = fs.nextElementSibling;
    if (nx) { (nx.querySelector("input:checked") || nx.querySelector("input")).focus({ preventScroll: true }); nx.scrollIntoView({ block: "center", behavior: reduz() ? "auto" : "smooth" }); }
  });

  /* ---------- rascunho (sessionStorage) ---------- */
  function guardar() {
    var d = {};
    Array.prototype.forEach.call(form.elements, function (e) {
      if (!e.name) return;
      if (e.type === "radio") { if (e.checked) d[e.name] = e.value; } else d[e.name] = e.value;
    });
    try { sessionStorage.setItem(KEY, JSON.stringify(d)); } catch (err) {}
  }
  function repor() {
    var d; try { d = JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch (err) { d = null; }
    if (!d) return false;
    Array.prototype.forEach.call(form.elements, function (e) {
      if (!e.name || !(e.name in d)) return;
      if (e.type === "radio") e.checked = d[e.name] === e.value; else e.value = d[e.name];
    });
    return true;
  }

  /* ---------- impressão ---------- */
  var cabPrint = el("style"); document.head.appendChild(cabPrint);
  var tituloOriginal = document.title;
  function prepararImpressao() {
    atualizar();
    form.querySelectorAll("textarea, input[type=date]").forEach(function (t) {
      var esp = t.nextElementSibling;
      if (!esp || !esp.classList.contains("espelho")) { esp = el("div", { "class": "espelho" }); t.parentNode.insertBefore(esp, t.nextSibling); }
      esp.textContent = t.type === "date" ? dataPT(t.value) : t.value;
      t.classList.add("espelhado");
    });
    var c = $("print-itens"); c.textContent = "";
    var tb = el("table", { "class": "respostas" }), th = el("thead"), tr = el("tr");
    ["N.º", "Item", "Resposta"].forEach(function (h) { tr.appendChild(el("th", null, h)); });
    th.appendChild(tr); tb.appendChild(th);
    var body = el("tbody");
    respostas().forEach(function (v, i) {
      var r = el("tr", v !== null && v >= ESC_LIMIAR ? { "class": "marcado" } : null);
      r.appendChild(el("td", { "class": "n" }, String(i + 1)));
      r.appendChild(el("td", null, ESC_ITENS[i] + (i === N - 1 ? " (avaliação global)" : "")));
      r.appendChild(el("td", { "class": "v" }, v === null ? "—" : v + " · " + rotulo(v)));
      body.appendChild(r);
    });
    tb.appendChild(body); c.appendChild(tb);
    var partes = [campo("c_nome").value.trim() && "Cuidador: " + campo("c_nome").value.trim(), campo("u_nome").value.trim(), "ESC (Zarit)"];
    var txt = partes.filter(Boolean).join(" · ").replace(/[\\"]/g, "\\$&").replace(/[\r\n]+/g, " ");
    cabPrint.textContent = '@page { @top-left { content: "' + txt + '"; font: 8pt "Lato", sans-serif; color: #0e5b6b; } } @page :first { @top-left { content: none; } }';
    var nome = campo("c_nome").value.trim();
    var ini = nome ? nome.split(/\s+/).map(function (p) { return p.charAt(0).toUpperCase(); }).join("") : "cuidador";
    document.title = "HC_ESC-Zarit_" + (campo("a_data").value || hojeISO()) + "_" + ini;
  }
  window.addEventListener("beforeprint", prepararImpressao);
  window.addEventListener("afterprint", function () { document.title = tituloOriginal; });
  $("btn-imprimir").addEventListener("click", function () { guardar(); window.print(); });

  /* ---------- limpar (dois toques) ---------- */
  var armado = null;
  $("btn-limpar").addEventListener("click", function (e) {
    var b = e.currentTarget;
    if (!armado) {
      b.textContent = "Confirmar: apagar todas as respostas";
      armado = setTimeout(function () { b.textContent = "Limpar avaliação"; armado = null; }, 5000);
      return;
    }
    clearTimeout(armado); armado = null; b.textContent = "Limpar avaliação";
    try { sessionStorage.removeItem(KEY); } catch (err) {}
    form.reset(); campo("a_data").value = hojeISO();
    document.querySelectorAll("fieldset.item").forEach(function (f) { f.classList.remove("falta"); });
    atualizar(); window.scrollTo({ top: 0 });
  });

  /* ---------- esconder / mostrar resultado (visível por omissão) ---------- */
  var KEY_RES = KEY + "-ocultar";
  function aplicarOculto(oculto) {
    document.body.classList.toggle("res-oculto", oculto);
    var b = $("btn-ver-res");
    b.textContent = oculto ? "Mostrar resultado" : "Esconder resultado";
    b.setAttribute("aria-pressed", String(oculto));
    try { sessionStorage.setItem(KEY_RES, oculto ? "1" : "0"); } catch (err) {}
  }
  $("btn-ver-res").addEventListener("click", function () { aplicarOculto(!document.body.classList.contains("res-oculto")); });
  try { aplicarOculto(sessionStorage.getItem(KEY_RES) === "1"); } catch (err) { aplicarOculto(false); }

  /* ---------- eventos e arranque ---------- */
  function autosize(t) { t.style.height = "auto"; t.style.height = t.scrollHeight + 2 + "px"; }
  form.addEventListener("input", function (e) { if (e.target.tagName === "TEXTAREA") autosize(e.target); atualizar(); guardar(); });
  form.addEventListener("change", function () { atualizar(); guardar(); });
  if (!repor()) campo("a_data").value = hojeISO();
  form.querySelectorAll("textarea").forEach(autosize);
  atualizar();
})();
