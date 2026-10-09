/* Lógica do formulário de avaliação inicial HC.
   Sem rede, sem IA: escalas, alertas e focos saem de regras fixas definidas aqui. */
(function () {
  "use strict";
  var KEY = "hc-avaliacao-domicilio-v2";
  var form = document.getElementById("f");
  var estado = document.getElementById("estado");
  var diagsEl = document.getElementById("diags");
  var medsEl = document.getElementById("meds");
  var validados = new Set();

  /* ---------- utilitários ---------- */
  function el(tag, attrs, texto) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (texto != null) e.textContent = texto;
    return e;
  }
  function campo(nome) { return form.elements[nome]; }
  function val(nome) {
    var e = campo(nome);
    if (!e) return "";
    if (e.type === "checkbox") return e.checked ? "1" : "";
    return (e.value || "").trim();
  }
  function num(nome) {
    var v = val(nome).replace(",", ".");
    if (v === "") return null;
    var n = parseFloat(v);
    return isNaN(n) ? null : n;
  }
  function opcoes(select, lista, vazio) {
    if (vazio) select.appendChild(el("option", { value: "" }, "—"));
    lista.forEach(function (o) {
      if (Array.isArray(o)) select.appendChild(el("option", { value: o[0] }, o[1]));
      else select.appendChild(el("option", { value: o }, o));
    });
  }
  function hojeISO() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  /* ---------- construção da interface a partir de dados.js ---------- */
  var dlF = document.getElementById("dl-farmacos");
  FARMACOS.forEach(function (f) { dlF.appendChild(el("option", { value: f })); });
  var dlC = document.getElementById("dl-cid");
  CID10.forEach(function (c) { dlC.appendChild(el("option", { value: c[0] + " · " + c[1] })); });

  var tplMed = document.getElementById("tpl-med").content.firstElementChild;
  opcoes(tplMed.querySelector("[data-k=un]"), UNIDADES, true);
  opcoes(tplMed.querySelector("[data-k=via]"), VIAS, true);
  var chips = tplMed.querySelector("[data-k=h]");
  HORARIOS.forEach(function (h) {
    var l = el("label");
    l.appendChild(el("input", { type: "checkbox", "data-h": h[0] }));
    l.appendChild(document.createTextNode(" " + h[1]));
    chips.appendChild(l);
  });
  var tplDiag = document.getElementById("tpl-diag").content.firstElementChild;

  var mifCorpo = document.getElementById("mif-corpo");
  MIF_ITENS.forEach(function (g) {
    var tr = el("tr"); tr.appendChild(el("td", { colspan: "2", "class": "grupo" }, g[0])); mifCorpo.appendChild(tr);
    g[1].forEach(function (it) {
      var r = el("tr"); r.appendChild(el("td", { "class": "rot" }, it[1]));
      var td = el("td"), s = el("select", { name: it[0] });
      opcoes(s, MIF_NIVEIS, true); td.appendChild(s); r.appendChild(td); mifCorpo.appendChild(r);
    });
  });

  // Barthel e Morse: definições partilhadas (shared/escalas.js), opção = [valor, rótulo, descrição]
  function tabelaEscala(corpoId, itens) {
    var corpo = document.getElementById(corpoId);
    itens.forEach(function (it) {
      var r = el("tr"); r.appendChild(el("td", { "class": "rot" }, it[1]));
      var td = el("td"), s = el("select", { name: it[0] });
      opcoes(s, it[2].map(function (o) { return [o[0], o[0] + " · " + o[1]]; }), true);
      td.appendChild(s); r.appendChild(td); corpo.appendChild(r);
    });
  }
  tabelaEscala("barthel-corpo", BARTHEL_ITENS);
  tabelaEscala("morse-corpo", MORSE_ITENS);

  // Barthel: apresentação 0–20 (validação portuguesa) ou 0–100. Os valores guardam-se sempre em 0–100.
  // A preferência é partilhada com a página barthel/ (mesma chave, só neste browser).
  var KEY_B100 = "hc-barthel-0a100", bModo100 = false;
  try { bModo100 = localStorage.getItem(KEY_B100) === "1"; } catch (err) {}
  var BARTHEL_MAX = {};
  BARTHEL_ITENS.forEach(function (it) { BARTHEL_MAX[it[0]] = Math.max.apply(null, it[2].map(function (o) { return +o[0]; })); });
  function fB(v) { return bModo100 ? v : v / BARTHEL_DIVISOR; }
  function bPts(nome, v) { return fB(v) + "/" + fB(BARTHEL_MAX[nome]); }
  function rotularBarthel() {
    BARTHEL_ITENS.forEach(function (it) {
      Array.prototype.forEach.call(campo(it[0]).options, function (o) {
        if (o.value === "") return;
        var op = it[2].filter(function (x) { return x[0] === o.value; })[0];
        o.textContent = fB(+o.value) + " · " + op[1];
      });
    });
    document.getElementById("b_max").textContent = "/ " + fB(100);
  }
  (function () {
    var sw = el("label", { "class": "switch", title: "Mostrar a pontuação do Barthel na escala de 0 a 100" });
    var cb = el("input", { type: "checkbox", role: "switch", "aria-label": "Barthel de 0 a 100" });
    cb.checked = bModo100;
    sw.appendChild(cb); sw.appendChild(el("span", { "class": "trilho-sw", "aria-hidden": "true" })); sw.appendChild(el("span", null, "0–100"));
    document.getElementById("b_sw").appendChild(sw);
    cb.addEventListener("change", function () {
      bModo100 = cb.checked;
      try { localStorage.setItem(KEY_B100, bModo100 ? "1" : "0"); } catch (err) {}
      rotularBarthel(); atualizar();
    });
  })();
  rotularBarthel();

  var sinaisCorpo = document.getElementById("sinais-corpo");
  SINAIS.forEach(function (s) {
    var r = el("tr");
    r.appendChild(el("td", { "class": "rot" }, s[1]));
    r.appendChild(el("td", { "class": "ref" }, s[2]));
    var tdH = el("td"); tdH.appendChild(el("input", { type: "text", name: "sv_" + s[0] + "_hab", inputmode: s[0] === "ta" ? "text" : "decimal", "aria-label": s[1] + " habitual" }));
    var tdV = el("td"), w = el("div", { "class": "sinal" });
    w.appendChild(el("input", { type: "text", name: "sv_" + s[0] + "_vis", inputmode: s[0] === "ta" ? "text" : "decimal", "aria-label": s[1] + " na visita" }));
    w.appendChild(el("span", { "class": "ind", id: "ind_" + s[0] }));
    tdV.appendChild(w); r.appendChild(tdH); r.appendChild(tdV); sinaisCorpo.appendChild(r);
  });

  /* ---------- linhas repetíveis ---------- */
  function preencher(no, d) {
    if (!d) return;
    no.querySelectorAll("[data-k]").forEach(function (c) {
      var k = c.getAttribute("data-k");
      if (k === "h") c.querySelectorAll("input").forEach(function (i) { i.checked = (d.h || []).indexOf(i.getAttribute("data-h")) !== -1; });
      else if (d[k] != null) c.value = d[k];
    });
  }
  function addLinha(tpl, cont, d) {
    var no = tpl.cloneNode(true);
    preencher(no, d);
    no.querySelector(".rem").addEventListener("click", function () { no.remove(); alterado(); });
    cont.appendChild(no);
    return no;
  }
  function addDiag(d) { return addLinha(tplDiag, diagsEl, d); }
  function addMed(d) { return addLinha(tplMed, medsEl, d); }
  function linhas(cont) {
    return Array.prototype.map.call(cont.querySelectorAll(".rep"), function (no) {
      var o = {};
      no.querySelectorAll("[data-k]").forEach(function (c) {
        var k = c.getAttribute("data-k");
        if (k === "h") o.h = Array.prototype.filter.call(c.querySelectorAll("input"), function (i) { return i.checked; })
          .map(function (i) { return i.getAttribute("data-h"); });
        else o[k] = c.value.trim();
      });
      return o;
    });
  }
  function meds() { return linhas(medsEl).filter(function (m) { return m.dci; }); }
  function diags() { return linhas(diagsEl).filter(function (d) { return d.txt || d.cod; }); }

  // Mapeamento CID-10: escolher da lista preenche código e designação
  var CID_POR_ROTULO = {};
  CID10.forEach(function (c) { CID_POR_ROTULO[c[1].toLowerCase()] = c[0]; });
  function mapearDiag(inp) {
    var no = inp.closest(".rep"), cod = no.querySelector("[data-k=cod]");
    var m = /^([A-Z]\d{2}(?:\.\d{1,2})?)\s*·\s*(.+)$/.exec(inp.value.trim());
    if (m) { cod.value = m[1]; inp.value = m[2]; return; }
    var c = CID_POR_ROTULO[inp.value.trim().toLowerCase()];
    if (c) cod.value = c;
  }
  function temCid(prefixos) {
    return diags().filter(function (d) {
      return prefixos.some(function (p) { return (d.cod || "").toUpperCase().indexOf(p) === 0; });
    }).map(function (d) { return (d.cod ? d.cod + " " : "") + d.txt; });
  }

  /* ---------- identificação do utente ---------- */
  function idadeEm(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return null;
    var hoje = new Date(), a = hoje.getFullYear() - +m[1];
    if (hoje.getMonth() + 1 < +m[2] || (hoje.getMonth() + 1 === +m[2] && hoje.getDate() < +m[3])) a--;
    return a >= 0 && a < 130 ? a : null;
  }
  // NIF português: 9 dígitos, o último é dígito de controlo (módulo 11)
  function nifValido(n) {
    if (!/^\d{9}$/.test(n)) return false;
    var s = 0;
    for (var i = 0; i < 8; i++) s += +n[i] * (9 - i);
    var r = s % 11, c = r < 2 ? 0 : 11 - r;
    return c === +n[8];
  }
  function marcar(inp, out, estadoOk, msg) {
    inp.classList.toggle("invalido", estadoOk === false);
    out.className = "valid" + (estadoOk === true ? " ok" : estadoOk === false ? " erro" : "");
    out.textContent = msg;
  }
  function identificacao() {
    var a = idadeEm(val("u_nasc"));
    campo("u_idade").value = a == null ? "" : a + " anos";
    var sns = val("u_sns").replace(/\s/g, ""), nif = val("u_nif").replace(/\s/g, "");
    marcar(campo("u_sns"), document.getElementById("v_sns"),
      sns === "" ? null : /^\d{9}$/.test(sns), sns === "" ? "" : /^\d{9}$/.test(sns) ? "9 dígitos ✓" : "deve ter 9 dígitos");
    marcar(campo("u_nif"), document.getElementById("v_nif"),
      nif === "" ? null : nifValido(nif), nif === "" ? "" : nifValido(nif) ? "NIF válido ✓" : "NIF inválido — verificar");
  }
  // Identificação repetida no topo das páginas 2+ do PDF (a 1.ª já tem o bloco completo)
  var cabPrint = document.createElement("style");
  document.head.appendChild(cabPrint);
  function cabecalhoImpressao() {
    var partes = [val("u_nome")];
    if (val("u_sns")) partes.push("SNS " + val("u_sns"));
    if (val("u_nasc")) { var p = val("u_nasc").split("-"); partes.push("DN " + p[2] + "/" + p[1] + "/" + p[0] + (val("u_idade") ? " (" + val("u_idade") + ")" : "")); }
    var txt = partes.filter(Boolean).join(" · ").replace(/[\\"]/g, "\\$&").replace(/[\r\n]+/g, " ");
    cabPrint.textContent = txt
      ? '@page { @top-left { content: "' + txt + '"; font: 8pt "Lato", sans-serif; color: #0e5b6b; } } @page :first { @top-left { content: none; } }'
      : "";
  }

  /* ---------- escalas ---------- */
  function soma(nomes) {
    var t = 0, n = 0;
    nomes.forEach(function (x) { var v = num(x); if (v != null) { t += v; n++; } });
    return { total: t, n: n, de: nomes.length, completo: n === nomes.length };
  }
  function classe(total, classes) {
    for (var i = 0; i < classes.length; i++) if (total >= classes[i][0]) return classes[i][1];
    return "";
  }
  var BARTHEL = BARTHEL_ITENS.map(function (it) { return it[0]; });
  var MIF_NOMES = [];
  MIF_ITENS.forEach(function (g) { g[1].forEach(function (it) { MIF_NOMES.push(it[0]); }); });
  var MORSE_NOMES = MORSE_ITENS.map(function (it) { return it[0]; });

  function mostrar(idT, idC, r, classes) {
    var out = document.getElementById(idT), cls = document.getElementById(idC);
    if (!r.n) { out.textContent = "—"; cls.textContent = ""; return; }
    out.textContent = r.total;
    cls.textContent = r.completo ? classe(r.total, classes) : "incompleto (" + r.n + "/" + r.de + ")";
  }
  var esc = {};
  function escalas() {
    esc.barthel = soma(BARTHEL);
    mostrar("b_total", "b_cls", esc.barthel, BARTHEL_CLASSES);
    if (esc.barthel.n) document.getElementById("b_total").textContent = fB(esc.barthel.total);
    document.getElementById("b_alt").textContent = !esc.barthel.n ? "" : bModo100
      ? "= " + esc.barthel.total / BARTHEL_DIVISOR + "/20 (0–20)" : "= " + esc.barthel.total + "/100 (0–100)";
    esc.mif = soma(MIF_NOMES);
    mostrar("mif_total", "mif_cls", esc.mif, MIF_CLASSES);
    var cog = soma(MIF_COGNITIVOS), mot = esc.mif.total - cog.total;
    document.getElementById("mif_parc").textContent = esc.mif.n ? "motora " + mot + "/91 · cognitiva " + cog.total + "/35" : "";
    esc.morse = soma(MORSE_NOMES);
    mostrar("morse_total", "morse_cls", esc.morse, MORSE_CLASSES);
  }

  /* ---------- sinais vitais ---------- */
  function sinais() {
    var fora = [];
    SINAIS.forEach(function (s) {
      var inp = campo("sv_" + s[0] + "_vis"), ind = document.getElementById("ind_" + s[0]);
      var v = inp.value.trim(), dir = "";
      if (s[0] === "ta") {
        var m = /(\d{2,3})\s*[\/x-]\s*(\d{2,3})/.exec(v);
        if (m) {
          var sis = +m[1], dia = +m[2];
          if (sis >= 140 || dia >= 90) dir = "↑"; else if (sis < 90 || dia < 60) dir = "↓";
        }
      } else if (v !== "") {
        var n = parseFloat(v.replace(",", "."));
        if (!isNaN(n)) {
          if (s[3] != null && n < s[3]) dir = "↓";
          if (s[4] != null && n > s[4]) dir = "↑";
        }
      }
      inp.classList.toggle("fora", !!dir);
      ind.textContent = dir;
      if (dir) fora.push(s[1].replace(/ \(.*\)$/, "") + " " + v + " " + dir);
    });
    return fora;
  }

  /* ---------- focos de atenção (regras fixas) ---------- */
  var GRAU_MIF = function (v) {
    if (v <= 2) return "dependente em grau elevado";
    if (v <= 4) return "dependente em grau moderado";
    return "dependente em grau reduzido (supervisão)";
  };
  // [id, foco, item Barthel, valor Barthel a partir do qual não há dependência, itens MIF]
  var AUTOCUIDADOS = [
    ["ac_banho", "Autocuidado: tomar banho", "b_banho", 5, ["mif_banho"]],
    ["ac_hig", "Autocuidado: higiene pessoal", "b_hig", 5, ["mif_hig"]],
    ["ac_vest", "Autocuidado: vestir-se / despir-se", "b_vestir", 10, ["mif_vest_sup", "mif_vest_inf"]],
    ["ac_alim", "Autocuidado: alimentar-se", "b_alim", 10, ["mif_alim"]],
    ["ac_sanit", "Autocuidado: uso do sanitário", "b_sanita", 10, ["mif_sanita"]],
    ["transf", "Transferir-se", "b_transf", 15, ["mif_tr_cama", "mif_tr_sanita", "mif_tr_banho"]],
    ["andar", "Andar", "b_deamb", 15, ["mif_marcha"]]
  ];
  var OPIOIDES = /morfina|oxicodona|fentanilo|tramadol|tapentadol|buprenorfina|hidromorfona|metadona|code[ií]na/i;
  var ANTICOAG = /varfarina|acenocumarol|apixabano|rivaroxabano|edoxabano|dabigatrano|enoxaparina/i;
  var INSULINA = /insulina/i;

  function calcularFocos(foraSinais) {
    var focos = {}, ordem = [], encs = [];
    function add(id, t, j, motivo) {
      if (!focos[id]) { focos[id] = { id: id, t: t, j: j, m: [] }; ordem.push(id); }
      if (motivo && focos[id].m.indexOf(motivo) === -1) focos[id].m.push(motivo);
    }
    function enc(id, t, motivo) { encs.push({ id: id, t: t, m: motivo ? [motivo] : [] }); }

    // Autocuidados e mobilidade: MIF primeiro (mais fino), Barthel como apoio
    AUTOCUIDADOS.forEach(function (a) {
      var mins = a[4].map(num).filter(function (v) { return v != null; });
      var mm = mins.length ? Math.min.apply(null, mins) : null;
      if (mm != null && mm <= 5) add(a[0], a[1], GRAU_MIF(mm), "MIF " + mm);
      var b = num(a[2]);
      if (b != null && b < a[3]) add(a[0], a[1], b === 0 ? "dependente" : "dependente em grau moderado", "Barthel " + bPts(a[2], b));
    });

    // Eliminação
    var bex = num("b_bex"), mbex = num("mif_bexiga");
    if ((bex != null && bex < 10) || (mbex != null && mbex <= 5))
      add("inc_ur", "Incontinência urinária", (bex === 0 || (mbex != null && mbex <= 2)) ? "presente" : "presente (ocasional)",
        bex != null ? "Barthel bexiga " + bPts("b_bex", bex) : "MIF bexiga " + mbex);
    temCid(["R32"]).forEach(function (d) { add("inc_ur", "Incontinência urinária", "presente", d); });
    var intt = num("b_int"), mint = num("mif_intestino");
    if ((intt != null && intt < 10) || (mint != null && mint <= 5))
      add("inc_int", "Incontinência intestinal", (intt === 0 || (mint != null && mint <= 2)) ? "presente" : "presente (ocasional)",
        intt != null ? "Barthel intestino " + bPts("b_int", intt) : "MIF intestino " + mint);
    temCid(["R15"]).forEach(function (d) { add("inc_int", "Incontinência intestinal", "presente", d); });

    // Queda
    if (esc.morse.n) {
      if (esc.morse.total >= 51) add("queda", "Queda", "risco elevado", "Morse " + esc.morse.total);
      else if (esc.morse.total >= 25) add("queda", "Queda", "risco", "Morse " + esc.morse.total);
    }
    if (val("quedas")) add("queda", "Queda", "risco", "quedas recentes: " + val("quedas"));
    temCid(["G20", "R29.6", "R26.8", "S72"]).forEach(function (d) { add("queda", "Queda", "risco", d); });

    // Pele
    var pele = val("pele");
    if (pele === "feridas") add("up", "Úlcera por pressão / ferida", "presente — caracterizar", val("pele_desc") || "feridas referidas");
    temCid(["L89", "L97"]).forEach(function (d) { add("up", "Úlcera por pressão / ferida", "presente — caracterizar", d); });
    if (!focos.up) {
      if (pele === "risco") add("up", "Úlcera por pressão", "risco", "zonas de risco na pele");
      if (val("mob") === "acamado") add("up", "Úlcera por pressão", "risco", "acamado");
      var bt = num("b_transf");
      if (bt != null && bt <= 5) add("up", "Úlcera por pressão", "risco", "Barthel transferências " + bPts("b_transf", bt));
    }

    // Respiratório
    var dis = val("dispneia");
    var GRAU_DIS = { grandes: "presente em grau reduzido", pequenos: "presente em grau moderado", falar: "presente em grau elevado", repouso: "presente em grau elevado" };
    if (dis) add("dispneia", "Dispneia", GRAU_DIS[dis], "dispneia: " + { grandes: "grandes esforços", pequenos: "pequenos esforços", falar: "ao falar / vestir", repouso: "em repouso" }[dis]);
    if (val("crises")) add("dispneia", "Dispneia", focos.dispneia ? focos.dispneia.j : "presente", "crises de dispneia");
    temCid(["J84", "J44", "J96", "J47", "I50", "I27.2", "R06"]).forEach(function (d) {
      add("dispneia", "Dispneia", focos.dispneia ? focos.dispneia.j : "a avaliar", d);
    });
    if (val("o2") === "sim" || val("vni") === "noite" || val("vni") === "continua")
      add("o2", "Gestão do regime terapêutico: oxigenoterapia / ventilação", "a avaliar",
        [val("o2") === "sim" ? "O₂ " + (val("o2_debito") ? val("o2_debito") + " L/min" : "") : "", val("vni") && val("vni") !== "nao" ? "VNI" : ""].filter(Boolean).join(" · "));
    if (val("secrecoes")) add("vias", "Limpeza das vias aéreas", "comprometida (a confirmar)", val("secrecoes"));
    if (val("edemas")) add("edema", "Edema", "presente", val("edemas"));

    // Medicação
    var ms = meds();
    if (ms.length >= 5) add("grt", "Gestão do regime terapêutico", "a avaliar", ms.length + " fármacos (polimedicação)");
    var op = ms.filter(function (m) { return OPIOIDES.test(m.dci); }).map(function (m) { return m.dci; });
    var ac = ms.filter(function (m) { return ANTICOAG.test(m.dci); }).map(function (m) { return m.dci; });
    var ins = ms.filter(function (m) { return INSULINA.test(m.dci); }).map(function (m) { return m.dci; });
    if (ac.length) add("grt", "Gestão do regime terapêutico", "a avaliar", "anticoagulação: " + ac.join(", "));
    if (ins.length) add("grt", "Gestão do regime terapêutico", "a avaliar", "insulinoterapia: " + ins.join(", "));
    if (op.length) add("grt", "Gestão do regime terapêutico", "a avaliar", "opioides: " + op.join(", "));

    // Nutrição e deglutição
    if (val("disfagia")) add("deglut", "Deglutição", "comprometida (a confirmar)", val("disfagia"));
    temCid(["R13"]).forEach(function (d) { add("deglut", "Deglutição", "comprometida (a confirmar)", d); });
    if (val("perda_peso")) add("nutri", "Ingestão nutricional", "a vigiar", "perda de peso: " + val("perda_peso"));
    temCid(["E46", "R63.4"]).forEach(function (d) { add("nutri", "Ingestão nutricional", "a vigiar", d); });
    if (num("b_alim") === 0) add("nutri", "Ingestão nutricional", "a vigiar", "dependente para alimentar-se");

    // Cognição, comunicação, humor, sono
    var or = val("orient");
    if (or === "desorientado") add("confusao", "Confusão", "presente", "desorientado");
    if (or === "ocasional") add("confusao", "Confusão", "presente (flutuante)", "desorientação ocasional");
    if (val("agitacao")) add("confusao", "Confusão", focos.confusao ? focos.confusao.j : "presente", "agitação: " + val("agitacao"));
    temCid(["F05"]).forEach(function (d) { add("confusao", "Confusão", "presente", d); });
    var mem = num("mif_memoria");
    if (mem != null && mem <= 4) add("memoria", "Memória", "comprometida", "MIF memória " + mem);
    temCid(["F03", "F01", "G30"]).forEach(function (d) { add("memoria", "Memória", "comprometida", d); });
    var cpr = num("mif_compr"), exp = num("mif_expr");
    if ((cpr != null && cpr <= 4) || (exp != null && exp <= 4))
      add("comunic", "Comunicação", "comprometida", "MIF compreensão " + (cpr != null ? cpr : "—") + " / expressão " + (exp != null ? exp : "—"));
    temCid(["H91"]).forEach(function (d) { add("comunic", "Comunicação", focos.comunic ? focos.comunic.j : "a avaliar", d); });
    if (val("ansiedade")) add("ansiedade", "Ansiedade", "presente", val("ansiedade"));
    temCid(["F41"]).forEach(function (d) { add("ansiedade", "Ansiedade", "presente", d); });
    var desp = num("despertares");
    if (desp != null && desp >= 2) add("sono", "Sono", "comprometido", desp + " despertares por noite");
    if (val("noite_nec")) add("sono", "Sono", "comprometido", "necessidades noturnas referidas");
    temCid(["G47.0"]).forEach(function (d) { add("sono", "Sono", "comprometido", d); });

    // Dor
    var dorV = num("sv_dor_vis"), dorH = num("sv_dor_hab");
    var dor = Math.max(dorV != null ? dorV : -1, dorH != null ? dorH : -1);
    if (dor >= 4) add("dor", "Dor", dor >= 7 ? "presente — intensa" : "presente — moderada", "dor " + dor + "/10");
    temCid(["R52.2"]).forEach(function (d) { add("dor", "Dor", focos.dor ? focos.dor.j : "a avaliar", d); });
    if (focos.dor && op.length) add("dor", "Dor", focos.dor.j, "sob opioides");

    // Cuidador e família
    var ex = val("exaust");
    if (ex === "sim") add("stress", "Stress do prestador de cuidados", "presente", "sinais marcados de exaustão");
    if (ex === "alguns") add("stress", "Stress do prestador de cuidados", "risco", "alguns sinais de exaustão");
    var depGrave = (esc.barthel.completo && esc.barthel.total <= 60) || (esc.mif.completo && esc.mif.total <= 60);
    if (val("cuid_nome") && depGrave) add("papel", "Papel de prestador de cuidados", "a avaliar conhecimento e capacidade", "dependência grave com cuidador informal");
    var cs = val("consc");
    if (cs === "parcial" || cs === "nao") add("aceit", "Aceitação do estado de saúde", "a avaliar", cs === "nao" ? "desconhece a gravidade" : "conhece em parte a gravidade");
    var lp = val("local_pref"), dav = val("dav");
    if (lp === "indef" || dav === "nao" || dav === "nao_sabe")
      add("decisao", "Tomada de decisão: planeamento antecipado de cuidados", "a apoiar",
        [lp === "indef" ? "local de cuidados não definido" : "", dav === "nao" || dav === "nao_sabe" ? "sem diretiva antecipada" : ""].filter(Boolean).join(" · "));

    // Articulações / encaminhamentos
    var pal = val("paliat"), pps = parseInt(val("pps"), 10);
    if ((pal === "nao" || pal === "nao_sabe") && ((!isNaN(pps) && pps <= 50) || dis === "repouso" || dis === "falar" || val("al_fim") || temCid(["Z51.5"]).length))
      enc("enc_paliat", "Ponderar articulação com equipa de cuidados paliativos",
        [!isNaN(pps) && pps <= 50 ? "PPS " + pps + "%" : "", dis === "repouso" || dis === "falar" ? "dispneia em grau elevado" : "", val("al_fim") ? "quadro de últimos dias/semanas" : ""].filter(Boolean).join(" · "));
    if (val("med_exp") === "hc") enc("enc_med", "Clarificar o acompanhamento médico", "a família espera que a HC assuma");
    if (val("al_semmed")) enc("enc_cs", "Articular com o centro de saúde / médico de família", "sem médico assistente ativo");
    if (foraSinais.length) enc("enc_sv", "Sinais vitais fora do intervalo de referência", foraSinais.join(" · "));
    var invas = ms.filter(function (m) { return /Subcut|Intramusc|Endoven/.test(m.via || ""); }).map(function (m) { return m.dci + " (" + m.via + ")"; });
    if (invas.length) enc("enc_inv", "Medicação parentérica — requer enfermeiro nos horários respetivos", invas.join(", "));
    var temSos = ms.some(function (m) { return (m.h || []).indexOf("sos") !== -1; });
    if (val("crises") && !temSos) enc("enc_sos", "Confirmar plano de crise de dispneia", "crises referidas sem medicação SOS registada");
    var faltas = [["eq_cama", "cama articulada"], ["eq_colchao", "colchão anti-escaras"], ["eq_cadeira", "cadeira de rodas / sanitária"], ["eq_elev", "elevador de transferência"], ["eq_wc", "WC adaptado"]]
      .filter(function (e) { return val(e[0]) === "falta"; }).map(function (e) { return e[1]; });
    if (faltas.length) enc("enc_eq", "Equipamento em falta", faltas.join(", "));
    if (ex === "sim" && !val("ap_cuidinf")) enc("enc_cuid", "Informar sobre descanso do cuidador e estatuto de cuidador informal", "");

    return { focos: ordem.map(function (id) { return focos[id]; }), encs: encs };
  }

  var ultimo = { focos: [], encs: [] };
  function renderItens(cont, itens, cls, vazioTxt) {
    cont.textContent = "";
    if (!itens.length) { cont.appendChild(el("p", { "class": "vazio" }, vazioTxt)); return; }
    itens.forEach(function (f) {
      var l = el("label", { "class": "foco" + (cls ? " " + cls : "") });
      var cb = el("input", { type: "checkbox", "data-foco": f.id });
      cb.checked = validados.has(f.id);
      l.appendChild(cb);
      var s = el("span");
      s.appendChild(el("span", { "class": "t" }, f.t));
      if (f.j) { s.appendChild(document.createTextNode(" — ")); s.appendChild(el("span", { "class": "j" }, f.j)); }
      if (f.m.length) s.appendChild(el("span", { "class": "m" }, "Porquê: " + f.m.join("; ")));
      l.appendChild(s); cont.appendChild(l);
    });
  }
  function focos(fora) {
    ultimo = calcularFocos(fora);
    renderItens(document.getElementById("focos"), ultimo.focos, "", "Ainda sem sugestões — preencha escalas, sinais e avaliação.");
    renderItens(document.getElementById("encs"), ultimo.encs, "enc", "Nada a ponderar por agora.");
  }

  /* ---------- rascunho (sessionStorage) ---------- */
  function guardar() {
    var dados = {};
    Array.prototype.forEach.call(form.elements, function (e) {
      if (!e.name) return;
      if (e.type === "checkbox") dados[e.name] = e.checked;
      else if (e.type === "radio") { if (e.checked) dados[e.name] = e.value; }
      else dados[e.name] = e.value;
    });
    dados.__meds = linhas(medsEl);
    dados.__diags = linhas(diagsEl);
    dados.__focos = Array.from(validados);
    try {
      sessionStorage.setItem(KEY, JSON.stringify(dados));
      estado.textContent = "Rascunho guardado só neste separador · " + new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
    } catch (err) { estado.textContent = "Rascunho não guardado (modo privado?) — não recarregue a página"; }
  }
  function repor() {
    var raw = null, dados;
    try { raw = sessionStorage.getItem(KEY); } catch (err) {}
    if (!raw) return false;
    try { dados = JSON.parse(raw); } catch (err) { return false; }
    Array.prototype.forEach.call(form.elements, function (e) {
      if (!e.name || !(e.name in dados)) return;
      if (e.type === "checkbox") e.checked = !!dados[e.name];
      else if (e.type === "radio") e.checked = dados[e.name] === e.value;
      else e.value = dados[e.name];
    });
    (dados.__diags || []).forEach(addDiag);
    (dados.__meds || []).forEach(addMed);
    validados = new Set(dados.__focos || []);
    return true;
  }

  /* ---------- impressão ---------- */
  function tabela(cabecalho, linhasDados, classes) {
    var t = el("table", { "class": "tab imp" }), th = el("thead"), tr = el("tr");
    cabecalho.forEach(function (c) { tr.appendChild(el("th", null, c)); });
    th.appendChild(tr); t.appendChild(th);
    var tb = el("tbody");
    linhasDados.forEach(function (l) {
      var r = el("tr");
      l.forEach(function (c, i) { r.appendChild(el("td", classes && classes[i] ? { "class": classes[i] } : null, c)); });
      tb.appendChild(r);
    });
    t.appendChild(tb);
    return t;
  }
  function imprimirDiags() {
    var c = document.getElementById("print-diags"); c.textContent = "";
    var ds = diags().sort(function (a, b) { return (a.tipo === "Antecedente") - (b.tipo === "Antecedente"); });
    if (!ds.length) { c.appendChild(el("p", { "class": "vazio" }, "Sem diagnósticos registados.")); return; }
    c.appendChild(tabela(["Tipo", "CID-10", "Designação", "Ano / notas"],
      ds.map(function (d) { return [d.tipo, d.cod || "—", d.txt, d.notas]; }), ["", "rot", "", ""]));
  }
  function imprimirMeds() {
    var c = document.getElementById("print-meds"); c.textContent = "";
    var ms = meds();
    if (!ms.length) { c.appendChild(el("p", { "class": "vazio" }, "Sem medicação registada.")); return; }
    var cab = ["Fármaco · dose", "Via"].concat(HORARIOS.map(function (h) { return h[1]; })).concat(["Notas"]);
    var cls = ["rot", ""].concat(HORARIOS.map(function () { return "marca"; })).concat([""]);
    c.appendChild(tabela(cab, ms.map(function (m) {
      return [[m.dci, m.dose, m.un].filter(Boolean).join(" "), m.via]
        .concat(HORARIOS.map(function (h) { return (m.h || []).indexOf(h[0]) !== -1 ? "●" : ""; }))
        .concat([m.notas]);
    }), cls));
  }
  function imprimirFocos() {
    var c = document.getElementById("print-focos"); c.textContent = "";
    var fs = ultimo.focos.filter(function (f) { return validados.has(f.id); });
    var es = ultimo.encs.filter(function (f) { return validados.has(f.id); });
    if (!fs.length && !es.length) { c.appendChild(el("p", { "class": "vazio" }, "Nenhum foco validado.")); return; }
    if (fs.length) c.appendChild(tabela(["Foco (validado pelo enfermeiro)", "Juízo", "Fundamentação"],
      fs.map(function (f) { return [f.t, f.j, f.m.join("; ")]; }), ["rot", "", ""]));
    if (es.length) c.appendChild(tabela(["Articulação / encaminhamento", "Fundamentação"],
      es.map(function (f) { return [f.t, f.m.join("; ")]; }), ["rot", ""]));
  }
  function textoImpresso(e) {
    if (e.type === "date" && e.value) { var p = e.value.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
    return e.value;
  }
  function prepararImpressao() {
    atualizar();
    form.querySelectorAll("textarea, input[type=date], input[type=time]").forEach(function (t) {
      if (t.closest(".so-ecra")) return;
      var esp = t.nextElementSibling;
      if (!esp || !esp.classList.contains("espelho")) {
        esp = el("div", { "class": "espelho" });
        t.parentNode.insertBefore(esp, t.nextSibling);
      }
      esp.textContent = textoImpresso(t);
      t.classList.add("espelhado");
    });
    imprimirDiags(); imprimirMeds(); imprimirFocos();
    cabecalhoImpressao();
  }
  var tituloOriginal = document.title;
  function nomeFicheiro() {
    var d = val("v_data") || hojeISO(), u = val("u_nome");
    var ini = u ? u.split(/\s+/).map(function (p) { return p.charAt(0).toUpperCase(); }).join("") : "utente";
    return "HC_Avaliacao-Inicial_" + d + "_" + ini;
  }
  window.addEventListener("beforeprint", function () { prepararImpressao(); document.title = nomeFicheiro(); });
  window.addEventListener("afterprint", function () { document.title = tituloOriginal; });

  /* ---------- eventos ---------- */
  function autosize(t) { t.style.height = "auto"; t.style.height = t.scrollHeight + 2 + "px"; }
  function atualizar() { identificacao(); escalas(); focos(sinais()); }
  function alterado() { atualizar(); guardar(); }

  form.addEventListener("input", function (e) {
    var t = e.target;
    if (t.hasAttribute("data-foco")) return;
    if (t.tagName === "TEXTAREA") autosize(t);
    if (t.getAttribute("data-k") === "txt") mapearDiag(t);
    alterado();
  });
  form.addEventListener("change", function (e) {
    var t = e.target;
    if (t.hasAttribute("data-foco")) {
      if (t.checked) validados.add(t.getAttribute("data-foco")); else validados.delete(t.getAttribute("data-foco"));
      guardar();
      return;
    }
    if (t.getAttribute("data-k") === "txt") mapearDiag(t);
    alterado();
  });
  document.getElementById("add-diag").addEventListener("click", function () { addDiag().querySelector("input").focus(); guardar(); });
  document.getElementById("add-med").addEventListener("click", function () { addMed().querySelector("input").focus(); guardar(); });
  document.getElementById("btn-imprimir").addEventListener("click", function () { guardar(); window.print(); });
  document.getElementById("btn-limpar").addEventListener("click", function () {
    if (!confirm("Apagar tudo o que foi preenchido neste formulário?")) return;
    try { sessionStorage.removeItem(KEY); } catch (err) {}
    form.reset();
    diagsEl.textContent = ""; medsEl.textContent = "";
    addDiag(); addMed();
    validados.clear();
    campo("v_data").value = hojeISO();
    form.querySelectorAll("textarea").forEach(autosize);
    atualizar();
    estado.textContent = "Formulário limpo";
  });

  /* ---------- arranque ---------- */
  campo("u_nasc").max = hojeISO();
  if (!repor()) { campo("v_data").value = hojeISO(); addDiag(); addMed(); }
  form.querySelectorAll("textarea").forEach(autosize);
  atualizar();
})();
