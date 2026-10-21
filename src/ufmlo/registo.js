/* Registo das avaliações UFMLO na base de dados da HC (Supabase).
   Fala só com REGISTO.url (a CSP não deixa sair para mais lado nenhum) e só pelas funções públicas
   do esquema: registar_avaliacao, corrigir_avaliacao, sessao_estado. As tabelas não estão expostas.
   Sessão: email + password e segundo fator TOTP obrigatório (a base de dados recusa sem aal2).
   A sessão e o estado do registo ficam em sessionStorage, como o rascunho: morrem com o separador. */
(function () {
  "use strict";
  if (typeof REGISTO === "undefined" || !REGISTO.url || !window.HCForm) return;

  var K_SESSAO = "hc-ufmlo-sessao-v1";
  var K_REGISTOS = "hc-ufmlo-registos-v1";
  var INATIVIDADE_MS = 15 * 60 * 1000;
  var TESTES = REGISTO.ambiente === "testes";

  var btnRegisto = document.getElementById("btn-registo");
  var btnSessao = document.getElementById("btn-sessao");
  var estadoReg = document.getElementById("estado-registo");
  var dlg = document.getElementById("dlg-registo");
  var passos = dlg.querySelectorAll("[data-passo]");
  var msg = document.getElementById("dlg-msg");
  var sessao = ler(K_SESSAO);
  var registos = ler(K_REGISTOS) || {};
  var fatorId = null;
  var aCorrer = false;
  var temporizador = null;

  function ler(k) { try { return JSON.parse(sessionStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function gravar(k, v) { try { if (v == null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function aal(token) {
    try {
      var p = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(p + "===".slice((p.length + 3) % 4))).aal || "aal1";
    } catch (e) { return null; }
  }

  function guardarSessao(s) {
    sessao = s ? { access_token: s.access_token, refresh_token: s.refresh_token,
                   expira: Date.now() + (s.expires_in || 3600) * 1000 } : null;
    gravar(K_SESSAO, sessao);
    mostrarEstado();
  }

  /* ---------- pedidos ---------- */
  function pedido(metodo, caminho, corpo, comToken) {
    var h = { "apikey": REGISTO.chave, "Content-Type": "application/json" };
    if (comToken && sessao) h["Authorization"] = "Bearer " + sessao.access_token;
    return fetch(REGISTO.url + caminho, { method: metodo, headers: h, body: corpo == null ? undefined : JSON.stringify(corpo),
                                          cache: "no-store", credentials: "omit", referrerPolicy: "no-referrer" })
      .then(function (r) {
        return r.text().then(function (t) {
          var d = null;
          try { d = t ? JSON.parse(t) : null; } catch (e) { d = t; }
          if (!r.ok) {
            var m = d && (d.message || d.msg || d.error_description || d.error) || ("Erro " + r.status);
            var err = new Error(m); err.status = r.status; err.codigo = d && (d.code || d.error_code); throw err;
          }
          return d;
        });
      }, function () { throw new Error("Sem ligação ao registo. O rascunho continua guardado neste separador — tente de novo."); });
  }

  function renovar() {
    if (!sessao) return Promise.reject(new Error("Sessão em falta"));
    if (sessao.expira - Date.now() > 60000) return Promise.resolve();
    return pedido("POST", "/auth/v1/token?grant_type=refresh_token", { refresh_token: sessao.refresh_token })
      .then(guardarSessao, function (e) { guardarSessao(null); throw e; });
  }

  function rpc(funcao, args) {
    return renovar().then(function () { return pedido("POST", "/rest/v1/rpc/" + funcao, args, true); });
  }

  /* ---------- interface ---------- */
  function mostrarEstado() {
    var n = sessao ? aal(sessao.access_token) : null;
    btnSessao.textContent = sessao ? "Terminar sessão" : "Entrar";
    btnSessao.hidden = !sessao;
    var reg = registos[window.HCForm.id()];
    btnRegisto.textContent = reg ? "Guardar correção" : "Guardar no registo";
    if (!sessao) estadoReg.textContent = "Registo: sem sessão";
    else if (n !== "aal2") estadoReg.textContent = "Registo: falta o segundo fator";
    else estadoReg.textContent = reg ? "Registado · versão " + reg.versao : "Sessão iniciada · ainda não registado";
  }

  function passo(nome, texto) {
    Array.prototype.forEach.call(passos, function (p) { p.hidden = p.getAttribute("data-passo") !== nome; });
    msg.textContent = texto || "";
    msg.className = "dlg-msg";
    if (!dlg.open) dlg.showModal();
    var foco = dlg.querySelector('[data-passo="' + nome + '"] input, [data-passo="' + nome + '"] textarea');
    if (foco) { foco.value = ""; foco.focus(); }
  }
  function erro(e) {
    msg.textContent = e && e.message ? e.message : String(e);
    msg.className = "dlg-msg erro";
  }
  function fechar() { if (dlg.open) dlg.close(); }

  /* ---------- fluxo ---------- */
  // Encaminha para o passo que falta (login → 2.º fator → guardar).
  function continuar() {
    if (!sessao) return passo("login");
    if (aal(sessao.access_token) === "aal2") return enviar();
    return renovar().then(function () { return pedido("GET", "/auth/v1/user", null, true); }).then(function (u) {
      var fs = (u.factors || []).filter(function (f) { return f.factor_type === "totp"; });
      var ok = fs.filter(function (f) { return f.status === "verified"; })[0];
      if (ok) { fatorId = ok.id; return passo("codigo"); }
      // Inscrições a meio (não verificadas) apagam-se antes de começar outra.
      return Promise.all(fs.map(function (f) { return pedido("DELETE", "/auth/v1/factors/" + f.id, null, true); }))
        .then(function () {
          return pedido("POST", "/auth/v1/factors", { factor_type: "totp", friendly_name: "HC registo " + new Date().toISOString().slice(0, 10), issuer: "HC Healthcare" }, true);
        })
        .then(function (f) {
          fatorId = f.id;
          var svg = f.totp.qr_code || "";
          document.getElementById("mfa-qr").src = svg.indexOf("data:") === 0 ? svg : "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
          document.getElementById("mfa-segredo").textContent = f.totp.secret;
          passo("inscrever");
        });
    }).catch(function (e) { passo("login"); erro(e); });
  }

  function verificarCodigo(campoId) {
    var codigo = document.getElementById(campoId).value.replace(/\s/g, "");
    if (!/^\d{6}$/.test(codigo)) return erro(new Error("O código tem 6 algarismos."));
    pedido("POST", "/auth/v1/factors/" + fatorId + "/challenge", {}, true)
      .then(function (ch) { return pedido("POST", "/auth/v1/factors/" + fatorId + "/verify", { challenge_id: ch.id, code: codigo }, true); })
      .then(function (s) { guardarSessao(s); enviar(); }, erro);
  }

  function enviar(motivo) {
    var dados = window.HCForm.recolher();
    var reg = registos[dados.__id];
    if (reg && motivo == null) return passo("motivo");
    if (aCorrer) return;
    aCorrer = true;
    btnRegisto.disabled = true;
    estadoReg.textContent = "A guardar no registo…";
    var p = reg
      ? rpc("corrigir_avaliacao", { p_id: dados.__id, p_dados: dados, p_motivo: motivo })
      : rpc("registar_avaliacao", { p_dados: dados, p_sintetico: TESTES });
    p.then(function (r) {
      registos[dados.__id] = { versao: r.versao };
      gravar(K_REGISTOS, registos);
      fechar();
      mostrarEstado();
      var avisos = (r.avisos || []).length ? " · Atenção: " + r.avisos.join("; ") : "";
      var totais = [r.morse_total != null ? "Morse " + r.morse_total : "", r.braden_total != null ? "Braden " + r.braden_total : ""].filter(Boolean).join(" · ");
      estadoReg.textContent = (r.repetido ? "Já estava registado" : reg ? "Correção guardada" : "Registado") +
        " · versão " + r.versao + (totais ? " · " + totais : "") + avisos;
    }, function (e) {
      mostrarEstado();
      if (e.codigo === "28000" || e.status === 401) { guardarSessao(null); passo("login", ""); erro(e); return; }
      passo(reg ? "motivo" : "falha"); erro(e);
    }).then(function () { aCorrer = false; btnRegisto.disabled = false; });
  }

  function terminar() {
    var s = sessao;
    guardarSessao(null);
    if (s) fetch(REGISTO.url + "/auth/v1/logout", { method: "POST", headers: { "apikey": REGISTO.chave, "Authorization": "Bearer " + s.access_token },
                                                   credentials: "omit", referrerPolicy: "no-referrer" }).catch(function () {});
  }

  // Tablets partilhados: a sessão termina ao fim de 15 minutos sem atividade (o rascunho fica).
  function atividade() {
    if (temporizador) clearTimeout(temporizador);
    if (sessao) temporizador = setTimeout(function () { terminar(); estadoReg.textContent = "Sessão terminada por inatividade"; }, INATIVIDADE_MS);
  }

  /* ---------- eventos ---------- */
  btnRegisto.addEventListener("click", function () { atividade(); continuar(); });
  btnSessao.addEventListener("click", function () { terminar(); });
  document.getElementById("frm-login").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("reg-email").value.trim(), pw = document.getElementById("reg-pw").value;
    pedido("POST", "/auth/v1/token?grant_type=password", { email: email, password: pw })
      .then(function (s) { document.getElementById("reg-pw").value = ""; guardarSessao(s); atividade(); continuar(); }, erro);
  });
  document.getElementById("frm-inscrever").addEventListener("submit", function (e) { e.preventDefault(); verificarCodigo("mfa-codigo-novo"); });
  document.getElementById("frm-codigo").addEventListener("submit", function (e) { e.preventDefault(); verificarCodigo("mfa-codigo"); });
  document.getElementById("frm-motivo").addEventListener("submit", function (e) {
    e.preventDefault();
    var m = document.getElementById("reg-motivo").value.trim();
    if (m.length < 5) return erro(new Error("Indique o motivo da correção (mín. 5 caracteres)."));
    enviar(m);
  });
  Array.prototype.forEach.call(dlg.querySelectorAll("[data-fechar]"), function (b) { b.addEventListener("click", fechar); });
  ["input", "change", "click", "keydown"].forEach(function (ev) { document.addEventListener(ev, atividade, { passive: true }); });
  document.addEventListener("hc:limpo", mostrarEstado);

  if (TESTES) document.getElementById("faixa-testes").hidden = false;
  mostrarEstado();
  atividade();
})();
