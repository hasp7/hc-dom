/* Registo das avaliações UFMLO na base de dados da HC (Supabase).
   Fala só com REGISTO.url (a CSP não deixa sair para mais lado nenhum) e só pelas funções públicas
   do esquema: registar_avaliacao, corrigir_avaliacao, sessao_estado. As tabelas não estão expostas.
   Sessão: email + password e segundo fator TOTP obrigatório (a base de dados recusa sem aal2).
   Contas só por convite (gerido pelo Hélder no dashboard): o link do email abre esta página para
   definir a password; "Esqueci-me da password" envia um link igual.
   A sessão e o estado do registo ficam em sessionStorage, como o rascunho: morrem com o separador. */
(function () {
  "use strict";
  if (typeof REGISTO === "undefined" || !REGISTO.url || !window.HCForm) return;

  var K_SESSAO = "hc-ufmlo-sessao-v1";
  var K_REGISTOS = "hc-ufmlo-registos-v1";
  var INATIVIDADE_MS = 15 * 60 * 1000;
  var PW_MIN = 12;
  var TESTES = REGISTO.ambiente === "testes";
  var AQUI = location.origin + location.pathname;

  var btnRegisto = document.getElementById("btn-registo");
  var btnSessao = document.getElementById("btn-sessao");
  var estadoReg = document.getElementById("estado-registo");
  var dlg = document.getElementById("dlg-registo");
  var passos = dlg.querySelectorAll("[data-passo]");
  var msg = document.getElementById("dlg-msg");
  var sessao = ler(K_SESSAO);
  var registos = ler(K_REGISTOS) || {};
  var fatorId = null;
  var intencao = "entrar";      // "guardar": depois do login grava o formulário; "entrar": só abre a sessão
  var definirPw = false;        // veio de um link de convite ou recuperação: falta definir a password
  var proximaMsg = "";          // mensagem para o próximo passo do diálogo (ex.: "Password definida.")
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
                   expira: Date.now() + (+s.expires_in || 3600) * 1000 } : null;
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
            var err = new Error(traduzir(d && (d.error_code || d.code), m)); err.status = r.status; err.codigo = d && (d.code || d.error_code); throw err;
          }
          return d;
        });
      }, function () { throw new Error("Sem ligação ao registo. O rascunho continua guardado neste separador — tente de novo."); });
  }

  // Mensagens do serviço de autenticação em português; as da base de dados já vêm em português.
  function traduzir(codigo, m) {
    var t = {
      invalid_credentials: "Email ou password errados.",
      user_banned: "Esta conta está desativada. Fale com a coordenação da HC.",
      mfa_verification_failed: "Código errado ou expirado. Use o código que está agora na aplicação.",
      weak_password: "Password demasiado fraca. Use pelo menos " + PW_MIN + " caracteres, sem palavras óbvias.",
      same_password: "A password nova tem de ser diferente da anterior.",
      otp_expired: "O link expirou ou já foi usado. Peça um novo em «Esqueci-me da password».",
      over_email_send_rate_limit: "Foram pedidos demasiados emails. Espere uns minutos e tente de novo.",
      over_request_rate_limit: "Demasiadas tentativas. Espere uns minutos e tente de novo."
    };
    return t[codigo] || m;
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
    var reg = registos[window.HCForm.id()];
    btnRegisto.textContent = reg ? "Guardar correção" : "Guardar no registo";
    if (!sessao) estadoReg.textContent = "Registo: sem sessão";
    else if (n !== "aal2") estadoReg.textContent = "Registo: falta o segundo fator";
    else estadoReg.textContent = reg ? "Registado · versão " + reg.versao : "Sessão iniciada · ainda não registado";
  }

  function passo(nome, texto) {
    Array.prototype.forEach.call(passos, function (p) { p.hidden = p.getAttribute("data-passo") !== nome; });
    msg.textContent = texto || proximaMsg;
    proximaMsg = "";
    msg.className = "dlg-msg";
    if (!dlg.open) dlg.showModal();
    var campos = dlg.querySelectorAll('[data-passo="' + nome + '"] input:not([type=email]), [data-passo="' + nome + '"] textarea');
    Array.prototype.forEach.call(campos, function (c) { c.value = ""; });
    var foco = dlg.querySelector('[data-passo="' + nome + '"] input:not([hidden]), [data-passo="' + nome + '"] textarea');
    if (foco) foco.focus();
  }
  function erro(e) {
    msg.textContent = e && e.message ? e.message : String(e);
    msg.className = "dlg-msg erro";
  }
  function fechar() { if (dlg.open) dlg.close(); }

  /* ---------- fluxo ---------- */
  // Encaminha para o passo que falta: login → (código) → (password nova) → (inscrever fator) → guardar ou fechar.
  function continuar() {
    if (!sessao) return passo("login");
    var nivel = aal(sessao.access_token);
    if (nivel === "aal2" && definirPw) return passo("password");
    if (nivel === "aal2") return concluir();
    return renovar().then(function () { return pedido("GET", "/auth/v1/user", null, true); }).then(function (u) {
      var fs = (u.factors || []).filter(function (f) { return f.factor_type === "totp"; });
      var ok = fs.filter(function (f) { return f.status === "verified"; })[0];
      if (ok) { fatorId = ok.id; return passo("codigo"); }
      // Sem fator: num convite, primeiro a password; depois inscreve o fator.
      if (definirPw) return passo("password");
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

  function concluir() {
    if (intencao === "guardar") return enviar();
    fechar();
    mostrarEstado();
    if (proximaMsg) { estadoReg.textContent = proximaMsg + " " + estadoReg.textContent; proximaMsg = ""; }
  }

  function verificarCodigo(campoId) {
    var codigo = document.getElementById(campoId).value.replace(/\s/g, "");
    if (!/^\d{6}$/.test(codigo)) return erro(new Error("O código tem 6 algarismos."));
    pedido("POST", "/auth/v1/factors/" + fatorId + "/challenge", {}, true)
      .then(function (ch) { return pedido("POST", "/auth/v1/factors/" + fatorId + "/verify", { challenge_id: ch.id, code: codigo }, true); })
      .then(function (s) { guardarSessao(s); atividade(); continuar(); }, erro);
  }

  function definirPassword() {
    var a = document.getElementById("pw-nova").value, b = document.getElementById("pw-repetir").value;
    if (a.length < PW_MIN) return erro(new Error("A password tem de ter pelo menos " + PW_MIN + " caracteres."));
    if (a !== b) return erro(new Error("As duas passwords não são iguais."));
    renovar()
      .then(function () { return pedido("PUT", "/auth/v1/user", { password: a }, true); })
      .then(function () {
        definirPw = false;
        proximaMsg = "Password definida.";
        continuar();
      }, erro);
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

  /* ---------- links do email (convite e recuperação) ---------- */
  // Dois formatos: ?token_hash=…&type=… (recomendado: só se gasta quando esta página o usa, por isso
  // resiste aos verificadores de links do email) e #access_token=…&type=… (formato de origem da Supabase).
  function tratarLink() {
    var q = new URLSearchParams(location.search), h = new URLSearchParams(location.hash.replace(/^#/, ""));
    var tipo = q.get("type") || h.get("type");
    var limpar = function () { history.replaceState(null, "", AQUI); };
    if (h.get("error") || h.get("error_code")) {
      limpar();
      passo("login"); erro(new Error(traduzir(h.get("error_code"), h.get("error_description") || "Link inválido.")));
      return true;
    }
    if (q.get("token_hash") && (tipo === "invite" || tipo === "recovery")) {
      var th = q.get("token_hash");
      limpar();
      terminar();
      pedido("POST", "/auth/v1/verify", { type: tipo, token_hash: th })
        .then(function (s) { guardarSessao(s); definirPw = true; intencao = "entrar"; atividade(); continuar(); },
              function (e) { passo("login"); erro(e); });
      return true;
    }
    if (h.get("access_token") && (tipo === "invite" || tipo === "recovery")) {
      var s = { access_token: h.get("access_token"), refresh_token: h.get("refresh_token"), expires_in: h.get("expires_in") };
      limpar();
      guardarSessao(s); definirPw = true; intencao = "entrar"; atividade(); continuar();
      return true;
    }
    return false;
  }

  /* ---------- eventos ---------- */
  btnRegisto.addEventListener("click", function () { intencao = "guardar"; atividade(); continuar(); });
  btnSessao.addEventListener("click", function () {
    if (sessao) { terminar(); return; }
    intencao = "entrar"; continuar();
  });
  document.getElementById("frm-login").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("reg-email").value.trim(), pw = document.getElementById("reg-pw").value;
    pedido("POST", "/auth/v1/token?grant_type=password", { email: email, password: pw })
      .then(function (s) { document.getElementById("reg-pw").value = ""; guardarSessao(s); atividade(); continuar(); }, erro);
  });
  document.getElementById("btn-esqueci").addEventListener("click", function () {
    var email = document.getElementById("reg-email").value.trim();
    passo("recuperar");
    document.getElementById("rec-email").value = email;
  });
  document.getElementById("frm-recuperar").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("rec-email").value.trim();
    if (!email) return erro(new Error("Indique o email da conta."));
    var aviso = "Se existir uma conta com este email, vai receber um link para definir uma password nova. " +
                "Abra-o neste dispositivo.";
    pedido("POST", "/auth/v1/recover?redirect_to=" + encodeURIComponent(AQUI), { email: email })
      .then(function () { passo("login", aviso); },
            function (e) { if (e.codigo === "over_email_send_rate_limit" || e.status === 429) erro(e); else passo("login", aviso); });
  });
  document.getElementById("frm-password").addEventListener("submit", function (e) { e.preventDefault(); definirPassword(); });
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
  tratarLink();
  window.addEventListener("hashchange", tratarLink);  // link aberto com a página já carregada neste separador
})();
