/* ============================================================
   CPD · Evaluación Interactiva — Motor v2
   Mantenimiento de rutina y salvaguarda de información
   Login por estudiante · Cronómetros · Notas 00-20 (mín. 14)
   Dashboard personal · Consolidado docente · PDF · localStorage
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- Constantes ---------------- */
  var DB_KEY = 'cpd_mant_eval_v2';
  var OLD_KEY = 'cpd_mant_eval_v1';
  var APP_TITLE = 'Mantenimiento de rutina y salvaguarda de información en el Centro de Cómputo';
  var MODULE = 'Monitoreo y acciones de mantenimiento de centros de cómputo · II Semestre 2026';
  var DOCENTE = 'Prof. Juan Carlos Ccanto Camacho';
  var NOTA_MIN = 14;          // nota mínima aprobatoria
  var NOTA_MAX = 20;          // nota máxima
  var EXAM_SECONDS = 1200;    // 20 minutos para el examen final
  var CASOS_SECONDS = 1500;   // 25 minutos para las casuísticas
  var MAX_ATTEMPTS = 3;       // reintentos máximos por evaluación

  var TYPE_TIME = { mc: 45, tf: 30, fill: 40, match: 90, order: 90 };
  var TYPE_LABEL = {
    mc: 'Selección múltiple',
    tf: 'Verdadero / Falso',
    match: 'Relacionar',
    order: 'Ordenar pasos',
    fill: 'Completar'
  };

  var LEVELS = [
    { name: 'Auxiliar', xp: 0, emoji: '🛠️' },
    { name: 'Técnico de Soporte', xp: 150, emoji: '🔧' },
    { name: 'Especialista', xp: 500, emoji: '⚙️' },
    { name: 'Experto CPD', xp: 1200, emoji: '🏆' }
  ];

  /* ---------------- Datos de sesiones ---------------- */
  var ALL = (typeof SESSIONS !== 'undefined' ? SESSIONS : [])
    .concat(typeof SESSIONS2 !== 'undefined' ? SESSIONS2 : [])
    .concat(typeof SESSIONS3 !== 'undefined' ? SESSIONS3 : []);
  var FINAL = (typeof FINAL_EXAM !== 'undefined') ? FINAL_EXAM : null;
  var CASOS = (typeof CASOS_DATA !== 'undefined') ? CASOS_DATA : [];

  /* ---------------- Estado (base de datos local) ---------------- */
  var db = null;
  var ST = null;      // estudiante con sesión activa
  var quiz = null;    // reto en curso
  var lastGain = 0;   // XP ganada en el último intento
  var teacherOk = false;

  function newStudent(name, dni, sexo) {
    return {
      id: 'st' + Date.now(),
      name: name,
      dni: dni,
      sexo: sexo || null,
      xp: 0,
      sessions: {},
      exam: null,
      casos: null,
      created: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
  }
  function newDB() {
    return { version: 2, theme: 'light', currentId: null, teacherCode: 'MMXXVIMASTER', students: [] };
  }
  function save() {
    try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (e) { /* sin almacenamiento */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(DB_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && typeof d === 'object' && Array.isArray(d.students)) {
          db = d;
          if (!db.teacherCode || db.teacherCode === 'CPD2026') { db.teacherCode = 'MMXXVIMASTER'; }
          db.theme = db.theme || 'light';
          db.currentId = db.currentId || null;
        }
      }
      if (!db) { migrate(); }
      if (!db) { db = newDB(); }
      // La sesión NO se restaura al recargar: siempre se pide login
      db.currentId = null;
      ST = null;
    } catch (e) { db = newDB(); }
  }
  function migrate() {
    try {
      var old = JSON.parse(localStorage.getItem(OLD_KEY));
      if (old && typeof old === 'object') {
        db = newDB();
        db.theme = old.theme || 'light';
        var st = newStudent(old.name && old.name.trim() ? old.name.trim() : 'Estudiante');
        st.xp = old.xp || 0;
        st.sessions = old.sessions || {};
        st.exam = old.exam || null;
        db.students.push(st);
        db.currentId = st.id;
        localStorage.removeItem(OLD_KEY);
        save();
      }
    } catch (e) { /* ignorar */ }
  }

  /* ---------------- Helpers ---------------- */
  function $(sel) { return document.querySelector(sel); }
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function norm(s) {
    return String(s).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ').trim();
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function getSesion(id) {
    for (var i = 0; i < ALL.length; i++) { if (ALL[i].id === id) return ALL[i]; }
    return null;
  }
  function recSesion(id) {
    return ST.sessions[id] || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
  }
  function noteOf(pct) { return Math.round(pct / 5 * 10) / 10; }          // % → nota 0-20
  function medalForNote(n) {
    if (n >= 19.5) return '🥇';
    if (n >= 17) return '🥈';
    if (n >= NOTA_MIN) return '🥉';
    return null;
  }
  function notaStatus(n) {
    if (n === null || n === undefined) return 'pend';
    if (n >= NOTA_MIN) return 'good';
    if (n >= 10) return 'warn';
    return 'crit';
  }
  function currentLevel() {
    var lv = LEVELS[0];
    for (var i = 0; i < LEVELS.length; i++) { if (ST.xp >= LEVELS[i].xp) lv = LEVELS[i]; }
    return lv;
  }
  function nextLevel() {
    var lv = currentLevel();
    for (var i = 0; i < LEVELS.length - 1; i++) {
      if (LEVELS[i].name === lv.name) return LEVELS[i + 1];
    }
    return null;
  }
  function completedCount() {
    var n = 0;
    for (var i = 0; i < ALL.length; i++) {
      var r = ST.sessions[ALL[i].id];
      if (r && r.attempts > 0) n++;
    }
    return n;
  }
  function promGeneral(st) {
    var sum = 0;
    for (var i = 0; i < ALL.length; i++) {
      var r = st.sessions[ALL[i].id];
      if (r && r.best > 0) sum += noteOf(r.best);
    }
    return Math.round(sum / Math.max(1, ALL.length) * 10) / 10;
  }
  function promRendidas(st) {
    var sum = 0, n = 0;
    for (var i = 0; i < ALL.length; i++) {
      var r = st.sessions[ALL[i].id];
      if (r && r.best > 0) { sum += noteOf(r.best); n++; }
    }
    return n ? Math.round(sum / n * 10) / 10 : 0;
  }
  function promFinal(st) {
    var p16 = promGeneral(st);
    var nc = st.casos && st.casos.best > 0 ? st.casos.best : 0;
    return Math.round(((p16 + nc) / 2) * 10) / 10;
  }
  /* ---------------- Configuración docente ---------------- */
  function cfg() {
    if (!db.config) { db.config = { nivel: 'basico', attemptsRetos: 3, attemptsCasos: 3, attemptsExamen: 3 }; }
    return db.config;
  }
  function maxAttempts(kind) {
    if (kind === 'casos') { return cfg().attemptsCasos || 3; }
    if (kind === 'examen') { return cfg().attemptsExamen || 3; }
    return cfg().attemptsRetos || 3;
  }
  function nivel() { return cfg().nivel || 'basico'; }
  function nivelLabel() {
    return nivel() === 'basico' ? 'Básico' : (nivel() === 'intermedio' ? 'Intermedio' : 'Avanzado');
  }
  function levelExtras(s) {
    if (nivel() === 'basico') { return null; }
    var map = (typeof LEVELS_DATA !== 'undefined') ? LEVELS_DATA : {};
    return (map[s.id] && map[s.id][nivel()]) ? map[s.id][nivel()] : null;
  }
  /* ---------------- Sincronización en la nube (Google Sheets) ---------------- */
  function cloudUrl() {
    return (typeof CLOUD_URL !== 'undefined' && CLOUD_URL) ? CLOUD_URL : '';
  }
  function sendToCloud(payload) {
    var u = cloudUrl();
    if (!u) { return; }
    try {
      var params = [];
      for (var k in payload) {
        if (payload.hasOwnProperty(k)) {
          params.push(encodeURIComponent(k) + '=' + encodeURIComponent(payload[k]));
        }
      }
      params.push('action=registrar');
      var img = new Image();
      img.src = u + (u.indexOf('?') >= 0 ? '&' : '?') + params.join('&');
    } catch (e) { /* silencioso */ }
  }
  function modules() {
    var out = [], seen = {};
    for (var i = 0; i < ALL.length; i++) {
      var s = ALL[i];
      if (!seen[s.module]) {
        seen[s.module] = true;
        out.push({ key: s.module, name: s.moduleName, color: s.color, list: [] });
      }
      out[out.length - 1].list.push(s);
    }
    return out;
  }
  function reportError(err, where) {
    try {
      var el = document.getElementById('errBanner');
      if (!el) {
        el = document.createElement('div');
        el.id = 'errBanner';
        el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#7f1d1d;color:#fff;padding:10px 14px;font:12px/1.5 monospace;white-space:pre-wrap;';
        document.body.appendChild(el);
      }
      var msg = (err && (err.stack || err.message)) || String(err);
      el.textContent = '⚠ Error en ' + (where || 'la aplicación') + ':\n' + msg;
    } catch (e2) { /* silencioso */ }
  }
  function toast(msg, kind) {
    var box = document.createElement('div');
    box.className = 'toast' + (kind ? ' ' + kind : '');
    box.textContent = msg;
    $('#toastRoot').appendChild(box);
    setTimeout(function () { box.remove(); }, 3600);
  }
  function openModal(html) {
    $('#modalRoot').innerHTML = '<div class="modal-back"><div class="modal-box">' + html + '</div></div>';
    $('#modalRoot').hidden = false;
  }
  function closeModal() {
    $('#modalRoot').hidden = true;
    $('#modalRoot').innerHTML = '';
  }
  function fmtDate(iso) {
    try { return new Date(iso).toLocaleDateString('es-PE'); } catch (e) { return '—'; }
  }

  /* ---------------- Login ---------------- */
  function doLogin(name, dni, sexo) {
    try {
      var n = norm(name);
      if (!n) { toast('Escribe tu nombre completo para ingresar', 'bad'); return false; }
      var d = String(dni || '').trim();
      if (!/^\d{8}$/.test(d)) { toast('El DNI debe tener exactamente 8 dígitos', 'bad'); return false; }
      var st = null;
      for (var i = 0; i < db.students.length; i++) {
        if (norm(db.students[i].name) === n) { st = db.students[i]; break; }
      }
      if (st) {
        if (st.dni && st.dni !== d) { toast('El DNI no coincide con el registrado para este nombre', 'bad'); return false; }
        if (!st.dni) { st.dni = d; } // migración: adopta el DNI la primera vez
      } else {
        st = newStudent(name.trim(), d, sexo);
        db.students.push(st);
        toast('Estudiante registrado ✓', 'good');
      }
      st.lastLogin = new Date().toISOString();
      db.currentId = st.id;
      ST = st;
      save();
      closeModal();
      toast('¡Bienvenido(a), ' + esc(name.trim()) + '! 👋', 'good');
      location.hash = '#/inicio';
      route();
      return true;
    } catch (err) { reportError(err, 'el ingreso'); return false; }
  }
  function doLogout() {
    openModal(
      '<h3>🔓 Cambiar de usuario</h3>' +
      '<p>Tu progreso queda guardado en este dispositivo. Otro estudiante podrá ingresar con su nombre.</p>' +
      '<div class="modal-actions"><button class="btn btn-ghost" id="btnCancelLogout">Cancelar</button><button class="btn btn-primary" id="btnConfirmLogout">Cambiar de usuario</button></div>'
    );
    $('#btnCancelLogout').addEventListener('click', closeModal);
    $('#btnConfirmLogout').addEventListener('click', function () {
      db.currentId = null;
      ST = null;
      save();
      closeModal();
      location.hash = '#/inicio';
      route();
    });
  }

  function viewLogin() {
    var html = '<div class="login-wrap">';
    html += '<div class="login-card">';
    html += '<div class="login-emoji">🖥️</div>';
    html += '<h1>Centro de Cómputo</h1>';
    html += '<p class="login-sub">' + esc(APP_TITLE) + '</p>';

    html += '<div class="role-row">';
    html += '<button class="role-btn active" id="roleStudentBtn">🎓 Estudiante</button>';
    html += '<button class="role-btn" id="roleTeacherBtn">👩‍🏫 Docente</button>';
    html += '</div>';

    html += '<div id="panelStudent">';
    html += '<label class="login-label" for="loginName">Nombre completo (apellidos y nombres)</label>';
    html += '<input type="text" id="loginName" class="fill-input" maxlength="70" placeholder="Ej.: Ana Torres Huamán" autocomplete="off">';
    html += '<label class="login-label" for="loginDni" style="margin-top:10px">Contraseña: tu DNI (8 dígitos)</label>';
    html += '<input type="password" id="loginDni" class="fill-input" maxlength="8" inputmode="numeric" placeholder="Ej.: 12345678" autocomplete="off">';
    html += '<label class="login-label" for="loginSexo" style="margin-top:10px">Sexo (solo al registrarte por primera vez)</label>';
    html += '<select id="loginSexo" class="fill-input"><option value="">— Selecciona —</option><option value="M">Masculino</option><option value="F">Femenino</option></select>';
    html += '<button class="btn btn-primary btn-big" id="btnLogin" style="width:100%;margin-top:14px">Ingresar 🚀</button>';
    html += '<p class="login-note">🔒 Cada estudiante ve SOLO su propio progreso. Tu DNI es tu contraseña personal.</p>';
    html += '<p class="login-note"><a class="link-btn" href="guia.html">📖 Guía del estudiante</a></p>';
    html += '</div>';

    html += '<div id="panelTeacher" class="hidden">';
    html += '<p class="muted" style="font-size:12.5px;margin-bottom:8px">🔐 Zona exclusiva del docente: acceso restringido.</p>';
    html += '<button class="hold-btn" id="btnHoldTeacher"><span class="hold-fill" id="holdFill"></span><span>👩‍🏫 Mantén presionado 3 segundos para ingresar</span></button>';
    html += '</div>';

    html += '</div>';
    html += '<p class="login-note">💾 Los datos se guardan en este dispositivo. La gestión de respaldos y consolidados es exclusiva del docente.</p>';
    html += '</div>';
    $('#app').innerHTML = html;

    function tryLogin() {
      var ok = doLogin($('#loginName').value, $('#loginDni').value, $('#loginSexo').value);
      if (ok) {
        var n1 = $('#loginName'), d1 = $('#loginDni');
        if (n1) { n1.value = ''; }
        if (d1) { d1.value = ''; }
      }
    }
    $('#btnLogin').addEventListener('click', tryLogin);
    $('#loginName').addEventListener('keydown', function (e) { if (e.key === 'Enter') { var d = $('#loginDni'); if (d) d.focus(); } });
    $('#loginDni').addEventListener('keydown', function (e) { if (e.key === 'Enter') tryLogin(); });

    $('#roleStudentBtn').addEventListener('click', function () {
      $('#panelStudent').classList.remove('hidden');
      $('#panelTeacher').classList.add('hidden');
      $('#roleStudentBtn').classList.add('active');
      $('#roleTeacherBtn').classList.remove('active');
    });
    $('#roleTeacherBtn').addEventListener('click', function () {
      $('#panelTeacher').classList.remove('hidden');
      $('#panelStudent').classList.add('hidden');
      $('#roleStudentBtn').classList.remove('active');
      $('#roleTeacherBtn').classList.add('active');
    });

    // acceso docente: mantener presionado 3 segundos (barrera deliberada)
    var holdTimer = null, holdCount = 0;
    function startHold() {
      holdCount = 0;
      var fill = $('#holdFill');
      if (fill) { fill.style.width = '0%'; }
      if (holdTimer) clearInterval(holdTimer);
      holdTimer = setInterval(function () {
        holdCount++;
        var pct = Math.min(100, Math.round(holdCount / 60 * 100));
        var f = $('#holdFill');
        if (f) { f.style.width = pct + '%'; }
        if (holdCount >= 60) {
          clearInterval(holdTimer);
          holdTimer = null;
          var f2 = $('#holdFill');
          if (f2) { f2.style.width = '0%'; }
          askTeacherCode();
        }
      }, 50);
    }
    function cancelHold() {
      if (holdTimer) { clearInterval(holdTimer); holdTimer = null; }
      var fill = $('#holdFill');
      if (fill) { fill.style.width = '0%'; }
    }
    var hb = $('#btnHoldTeacher');
    if (hb) {
      hb.addEventListener('mousedown', startHold);
      hb.addEventListener('touchstart', startHold);
      hb.addEventListener('mouseup', cancelHold);
      hb.addEventListener('mouseleave', cancelHold);
      hb.addEventListener('touchend', cancelHold);
    }

    setTimeout(function () { var inp = $('#loginName'); if (inp) inp.focus(); }, 60);
  }
  function completedOf(st) {
    var n = 0;
    for (var i = 0; i < ALL.length; i++) {
      if (st.sessions[ALL[i].id] && st.sessions[ALL[i].id].attempts > 0) n++;
    }
    return n;
  }

  /* ---------------- Router ---------------- */
  function setTab(view) {
    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].getAttribute('data-view') === view);
    }
  }
  function route() {
    try {
    if (quiz && quiz.timerId) { clearInterval(quiz.timerId); quiz.timerId = null; }
    var h = location.hash.replace(/^#\/?/, '');
    var p = h.split('/').filter(Boolean);

    // consolidado docente no requiere estudiante
    if (p[0] === 'consolidado') { setTab(''); viewConsolidado(); updateHud(); window.scrollTo(0, 0); return; }
    if (!ST) { setTab(''); viewLogin(); updateHud(); window.scrollTo(0, 0); return; }

    if (!p.length) { viewInicio(); setTab('inicio'); }
    else if (p[0] === 'sesiones') { viewSesiones(); setTab('sesiones'); }
    else if (p[0] === 'panel') { viewPanel(); setTab('panel'); }
    else if (p[0] === 'logros') { viewLogros(); setTab('logros'); }
    else if (p[0] === 'casos') { viewCasos(); setTab('casos'); }
    else if (p[0] === 'examen') { viewExamen(); setTab('examen'); }
    else if (p[0] === 'sesion') {
      var s = getSesion(parseInt(p[1], 10));
      setTab('sesiones');
      if (!s) { viewSesiones(); }
      else if (p[2] === 'revisar') { viewRevisar(s); }
      else if (p[2] === 'reto') { viewReto(s); }
      else if (p[2] === 'resultado') { viewResultado(s); }
      else { viewSesion(s); }
    }
    else { viewInicio(); setTab('inicio'); }
    updateHud();
    window.scrollTo(0, 0);
    } catch (err) { reportError(err, 'la navegación'); }
  }

  /* ---------------- HUD ---------------- */
  function updateHud() {
    if (!ST) {
      $('#xpVal').textContent = '—';
      $('#lvName').textContent = 'Invitado';
      $('#doneVal').textContent = '—';
      return;
    }
    var lv = currentLevel();
    $('#xpVal').textContent = ST.xp;
    $('#lvName').textContent = lv.name;
    $('#doneVal').textContent = completedCount() + '/' + ALL.length;
    var nx = nextLevel();
    var pct = nx ? Math.min(100, Math.round(100 * (ST.xp - lv.xp) / (nx.xp - lv.xp))) : 100;
    var bar = $('#progressBar');
    if (bar) bar.style.width = pct + '%';
  }

  /* ============================================================
     VISTAS
     ============================================================ */

  /* ---------------- Inicio ---------------- */
  function viewInicio() {
    var done = completedCount();
    var lv = currentLevel();
    var nx = nextLevel();
    var fin = promFinal(ST);
    var finOK = fin >= NOTA_MIN;

    var html = '<div class="hero"><div class="hero-emoji">🖥️</div>';
    html += '<h1>¡Hola, ' + esc(ST.name) + '! 👋</h1>';
    html += '<p>Repasa cada sesión con tarjetas ilustradas, supera los retos con cronómetro y consolida tus aprendizajes. Nota aprobatoria: <strong>' + NOTA_MIN + '/20</strong>. Tu promedio general aparece en «Mi panel».</p>';
    html += '</div>';

    if (ST.draft) {
      var dr = ST.draft;
      if (dr.mode === 'sesion') {
        var ds = getSesion(dr.sid);
        html += '<div class="tip-box" style="margin-top:12px">💾 Tienes un avance guardado en la sesión ' + (ds ? ds.num + ': ' + esc(ds.title) : '') + ' (pregunta ' + (dr.idx + 1) + ' de ' + dr.qs.length + '). <a class="btn btn-primary" href="#/sesion/' + dr.sid + '/reto">▶️ Continuar</a></div>';
      } else if (dr.mode === 'examen') {
        html += '<div class="tip-box" style="margin-top:12px">💾 Tienes el examen final a medias (pregunta ' + (dr.idx + 1) + ' de ' + dr.qs.length + '). <a class="btn btn-primary" href="#/examen">▶️ Continuar</a></div>';
      } else if (dr.mode === 'casos') {
        html += '<div class="tip-box" style="margin-top:12px">💾 Tienes los casos prácticos a medias (pregunta ' + (dr.idx + 1) + ' de ' + dr.qs.length + '). <a class="btn btn-primary" href="#/casos">▶️ Continuar</a></div>';
      }
    }

    html += '<div class="stats-row">';
    html += '<div class="stat-card"><div class="stat-emoji">⭐</div><div class="stat-val">' + ST.xp + '</div><div class="stat-label">Puntos de experiencia</div></div>';
    html += '<div class="stat-card"><div class="stat-emoji">' + lv.emoji + '</div><div class="stat-val">' + esc(lv.name) + '</div><div class="stat-label">Nivel actual</div></div>';
    html += '<div class="stat-card"><div class="stat-emoji">🎯</div><div class="stat-val">' + done + ' / ' + ALL.length + '</div><div class="stat-label">Sesiones rendidas</div></div>';
    html += '<div class="stat-card"><div class="stat-emoji">📊</div><div class="stat-val" style="color:' + (finOK ? 'var(--viz-good)' : 'var(--viz-warn)') + '">' + fin.toFixed(1) + '</div><div class="stat-label">Promedio final / 20 (sesiones + casos)</div></div>';
    html += '</div>';

    html += '<div class="card level-strip">';
    html += '<div class="level-row"><span>' + lv.emoji + ' ' + esc(lv.name) + '</span><span>' + (nx ? 'Siguiente: ' + esc(nx.name) + ' (' + (nx.xp - ST.xp) + ' XP)' : '¡Nivel máximo alcanzado! 🎉') + '</span></div>';
    var prev = lv.xp;
    var pct = nx ? Math.min(100, Math.round(100 * (ST.xp - prev) / (nx.xp - prev))) : 100;
    html += '<div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
    html += '</div>';

    html += '<h2 class="sec-title">📚 Módulos del curso</h2><div class="grid grid-2">';
    modules().forEach(function (m) {
      html += '<div class="module-card">';
      html += '<h3><span class="module-dot" style="background:' + m.color + '"></span> Módulo ' + esc(m.key) + ': ' + esc(m.name) + '</h3>';
      m.list.forEach(function (s) {
        var r = recSesion(s.id);
        var medal = medalForNote(noteOf(r.best));
        html += '<a class="session-mini" href="#/sesion/' + s.id + '">';
        html += '<span class="sm-num">' + s.num + '</span><span>' + esc(s.title) + '</span>';
        html += '<span class="sm-medal">' + (medal || (r.attempts > 0 ? '·' : '')) + '</span>';
        html += '</a>';
      });
      html += '</div>';
    });
    html += '</div>';

    html += '<div class="tip-box" style="margin-top:16px"><strong>💡 ¿Cómo funciona?</strong><br>' +
      '① Repasa con las tarjetas ilustradas (retroalimentación) → ② Resuelve el reto CONTRA EL CRONÓMETRO → ③ Revisa tu NOTA (0-20, mínimo 14) → ④ Mira tu progreso en «Mi panel» y exporta tus reportes en PDF. 🚀</div>';
    $('#app').innerHTML = html;
  }

  /* ---------------- Lista de sesiones ---------------- */
  function viewSesiones() {
    var html = '<h1 class="page-title">📚 Sesiones de aprendizaje</h1>';
    html += '<p class="subtitle">Cada sesión tiene dos momentos: <strong>Repaso ilustrado</strong> (retroalimentación) y <strong>Reto evaluativo cronometrado</strong>. Tu nota (0-20) se registra con tu mejor intento; se aprueba con ' + NOTA_MIN + '.</p>';

    modules().forEach(function (m) {
      html += '<h2 class="sec-title" style="margin-top:16px"><span class="module-dot" style="background:' + m.color + '"></span> Módulo ' + esc(m.key) + ': ' + esc(m.name) + '</h2>';
      html += '<div class="ses-list">';
      m.list.forEach(function (s) {
        var r = recSesion(s.id);
        var nota = r.best > 0 ? noteOf(r.best) : null;
        var medal = nota !== null ? medalForNote(nota) : null;
        var stCls = notaStatus(nota);
        html += '<div class="ses-card" data-href="#/sesion/' + s.id + '">';
        html += '<div class="ses-emoji">' + s.emoji + '</div>';
        html += '<div class="ses-info"><h3>Sesión ' + s.num + ': ' + esc(s.title) + '</h3>';
        html += '<p>' + esc(s.goal) + '</p>';
        html += '<p style="margin-top:6px">';
        html += '<span class="tag' + (r.attempts > 0 ? ' done' : '') + '">' + (r.attempts > 0 ? '✔ Rendida' : 'Pendiente') + '</span> ';
        html += '<span class="tag">' + s.questions.length + ' preguntas · ⏱ cronometrado</span>';
        html += '</p></div>';
        html += '<div class="ses-status">';
        html += '<span class="ses-medal">' + (medal || '—') + '</span>';
        if (nota !== null) {
          html += '<span class="note-badge ' + stCls + '">' + nota.toFixed(1) + ' / 20</span>';
        } else {
          html += '<span class="ses-score">Sin intentos</span>';
        }
        html += '</div></div>';
      });
      html += '</div>';
    });
    $('#app').innerHTML = html;

    var cards = document.querySelectorAll('.ses-card');
    for (var i = 0; i < cards.length; i++) {
      (function (c) {
        c.addEventListener('click', function () { location.hash = c.getAttribute('data-href'); });
      })(cards[i]);
    }
  }

  /* ---------------- Detalle de sesión ---------------- */
  function viewSesion(s) {
    var r = recSesion(s.id);
    var nota = r.best > 0 ? noteOf(r.best) : null;
    var medal = nota !== null ? medalForNote(nota) : null;
    var html = '<a class="back-link" href="#/sesiones">← Volver a sesiones</a>';
    html += '<div class="card">';
    html += '<div class="session-header">';
    html += '<div class="ses-emoji">' + s.emoji + '</div>';
    html += '<div><h1>Sesión ' + s.num + ': ' + esc(s.title) + '</h1>';
    html += '<p class="subtitle">' + esc(s.goal) + '</p>';
    html += '<p class="muted" style="font-size:12.5px">📅 ' + s.date + ' · Producto: ' + esc(s.product) + ' · 🔰 Nivel de evaluación: ' + nivelLabel() + '</p>';
    html += '</div></div>';
    html += '<p style="font-size:13.5px;margin:8px 0">' +
      (nota !== null
        ? 'Tu mejor nota: <strong>' + nota.toFixed(1) + ' / 20</strong> ' + (medal || '') +
          ' · ' + (nota >= NOTA_MIN ? '✅ Aprobado' : '❌ Desaprobado (mínimo ' + NOTA_MIN + ')') + ' · Intentos: ' + r.attempts
        : 'Aún no rindes el reto. ¡Empieza por el repaso!') +
      '</p>';
    html += '</div>';

    var dSes = (ST.draft && ST.draft.mode === 'sesion' && ST.draft.sid === s.id) ? ST.draft : null;
    if (dSes) {
      html += '<div class="tip-box" style="margin-top:14px">▶️ Tienes este reto a medias: pregunta ' + (dSes.idx + 1) + ' de ' + dSes.qs.length + '. ';
      html += '<a class="btn btn-primary" href="#/sesion/' + s.id + '/reto" style="margin-right:8px">Continuar reto</a>';
      html += '<button class="btn btn-ghost" id="btnDiscardDraft">Descartar avance</button></div>';
    }

    html += '<div class="grid grid-2" style="margin-top:14px">';
    html += '<div class="choice-card"><div class="cc-title">📖 Repasar contenido</div>';
    html += '<p>Tarjetas ilustradas con los conceptos clave, ejemplos aplicados y errores comunes. Es la retroalimentación previa al reto.</p>';
    html += '<a class="btn btn-secondary" href="#/sesion/' + s.id + '/revisar" style="margin-top:10px">Empezar repaso</a></div>';
    html += '<div class="choice-card"><div class="cc-title">🎮 Iniciar reto (cronometrado)</div>';
    html += '<p>' + s.questions.length + ' preguntas variadas con tiempo por pregunta y reloj global del reto. Máximo ' + maxAttempts('retos') + ' intentos.</p>';
    if (r.attempts >= maxAttempts('retos')) {
      html += '<div class="tip-box" style="margin-top:10px">🚫 Alcanzaste el límite de ' + maxAttempts('retos') + ' intentos de esta sesión. Queda registrada tu mejor nota.</div>';
    } else {
      html += '<a class="btn btn-primary" href="#/sesion/' + s.id + '/reto" style="margin-top:10px">' + (r.attempts > 0 ? 'Reintentar reto (' + (maxAttempts('retos') - r.attempts) + ' restantes)' : 'Iniciar reto') + '</a>';
    }
    html += '</div>';
    html += '</div>';
    $('#app').innerHTML = html;

    var dbD = $('#btnDiscardDraft');
    if (dbD) dbD.addEventListener('click', function () {
      clearDraft();
      toast('Avance descartado: puedes iniciar un reto nuevo', 'good');
      viewSesion(s);
    });
  }

  /* ---------------- Repaso (retroalimentación) ---------------- */
  function viewRevisar(s) {
    var html = '<a class="back-link" href="#/sesion/' + s.id + '">← Volver a la sesión</a>';
    html += '<h1 class="page-title">📖 Repaso · Sesión ' + s.num + ': ' + esc(s.title) + '</h1>';
    html += '<p class="subtitle">Lee con calma cada tarjeta. Esta retroalimentación te prepara para el reto cronometrado.</p>';

    html += '<div class="grid grid-2">';
    s.review.forEach(function (r) {
      html += '<div class="flash"><div class="flash-icon">' + r.icon + '</div>';
      html += '<h3>' + esc(r.t) + '</h3>';
      if (r.img) { html += '<div class="question-img" style="margin:10px 0">' + r.img + '</div>'; }
      html += '<p>' + esc(r.d) + '</p>';
      if (r.points && r.points.length) {
        html += '<ul class="point-list">';
        r.points.forEach(function (pt) { html += '<li>' + esc(pt) + '</li>'; });
        html += '</ul>';
      }
      html += '</div>';
    });
    html += '</div>';

    var ext = levelExtras(s);
    if (ext && ext.review && ext.review.length) {
      html += '<div class="tip-box" style="margin-top:14px"><strong>📶 Contenido de nivel ' + nivelLabel() + ':</strong> tu docente elevó el nivel de la evaluación. Estudia estas tarjetas adicionales antes del reto.</div>';
      html += '<div class="grid grid-2">';
      ext.review.forEach(function (r) {
        html += '<div class="flash"><div class="flash-icon">' + r.icon + '</div>';
        html += '<h3>' + esc(r.t) + '</h3>';
        if (r.img) { html += '<div class="question-img" style="margin:10px 0">' + r.img + '</div>'; }
        html += '<p>' + esc(r.d) + '</p>';
        if (r.points && r.points.length) {
          html += '<ul class="point-list">';
          r.points.forEach(function (pt) { html += '<li>' + esc(pt) + '</li>'; });
          html += '</ul>';
        }
        html += '</div>';
      });
      html += '</div>';
    }

    if (s.tip) {
      html += '<div class="tip-box"><strong>💡 Dato clave</strong><br>' + esc(s.tip) + '</div>';
    }

    html += '<div class="center" style="margin-top:18px">';
    html += '<a class="btn btn-primary btn-big" href="#/sesion/' + s.id + '/reto">¡Estoy listo! Iniciar reto 🎮</a>';
    html += '</div>';
    $('#app').innerHTML = html;
  }

  /* ============================================================
     MOTOR DEL RETO (quiz con cronómetro)
     ============================================================ */
  function prepQ(q) {
    var c = {};
    for (var k in q) { if (q.hasOwnProperty(k)) c[k] = q[k]; }
    if (q.type === 'mc') {
      // alternativas en orden aleatorio (por intento y por estudiante),
      // conservando la respuesta correcta apuntando al mismo texto
      var idx = [];
      for (var i = 0; i < q.opts.length; i++) idx.push(i);
      idx = shuffle(idx);
      c.opts = idx.map(function (i) { return q.opts[i]; });
      c.a = idx.indexOf(q.a);
    }
    if (q.type === 'order') { c.shuffled = shuffle(q.items.slice()); }
    if (q.type === 'match') {
      c.shuffledR = shuffle(q.pairs.map(function (p, i) { return { t: p[1], src: i }; }));
    }
    return c;
  }

  function reRender() {
    if (quiz.mode === 'examen') { renderExamQuiz(); }
    else if (quiz.mode === 'casos') { renderCasosQuiz(); }
    else { renderQuiz(); }
  }
  function finishCurrent() {
    if (quiz.mode === 'examen') { finishExam(); }
    else if (quiz.mode === 'casos') { finishCasos(); }
    else { finishQuiz(); }
  }

  /* ---------------- Avance persistente (borrador) ---------------- */
  function saveDraft() {
    if (!quiz || !ST || !quiz.mode) return;
    ST.draft = {
      sid: quiz.sid,
      mode: quiz.mode,
      idx: quiz.idx,
      qs: quiz.qs,
      ans: quiz.ans,
      pts: quiz.pts,
      full: quiz.full,
      timedOut: quiz.timedOut,
      pesos: quiz.pesos || null,
      clockLabel: quiz.clockLabel,
      qTotalMs: quiz.totalMs || null,
      qRemainingMs: quiz.deadline ? Math.max(0, quiz.deadline - Date.now()) : 0,
      gRemainingMs: quiz.globalEnd ? Math.max(0, quiz.globalEnd - Date.now()) : 0,
      savedAt: new Date().toISOString()
    };
    save();
  }
  function clearDraft() {
    if (ST && ST.draft) { delete ST.draft; save(); }
  }
  function restoreQuiz(d) {
    var q = d.qs && d.qs.length ? d.qs : [];
    quiz = {
      sid: d.sid,
      idx: Math.min(d.idx || 0, Math.max(0, q.length - 1)),
      qs: q,
      ans: d.ans || [],
      pts: d.pts || [],
      full: d.full || [],
      timedOut: d.timedOut || [],
      pairL: -1,
      mode: d.mode,
      clockLabel: d.clockLabel || '⏱ Reto',
      pesos: d.pesos || null,
      deadline: Date.now() + (d.qRemainingMs || 0),
      totalMs: d.qTotalMs || (q.length ? questionTime(q[Math.min(d.idx || 0, q.length - 1)]) : 45000),
      timerId: null,
      timerQ: -1,
      globalEnd: Date.now() + (d.gRemainingMs || 0),
      _lastDraft: 0
    };
    return quiz;
  }

  function viewReto(s) {
    // continuar un avance guardado (misma sesión, mismo intento)
    if (ST.draft && ST.draft.mode === 'sesion' && ST.draft.sid === s.id) {
      restoreQuiz(ST.draft);
      toast('▶️ Reto reanudado en la pregunta ' + (quiz.idx + 1) + ' de ' + quiz.qs.length, 'good');
      renderQuiz();
      return;
    }
    if (recSesion(s.id).attempts >= maxAttempts('retos')) {
      toast('🚫 Límite de ' + maxAttempts('retos') + ' intentos alcanzado en esta sesión', 'bad');
      location.hash = '#/sesion/' + s.id;
      route();
      return;
    }
    var ext = levelExtras(s);
    var qlist = s.questions.concat(ext && ext.questions ? ext.questions : []);
    var totalMs = 0;
    for (var i = 0; i < qlist.length; i++) { totalMs += questionTime(qlist[i]); }
    quiz = {
      sid: s.id,
      idx: 0,
      qs: qlist.map(prepQ),
      ans: [],
      pts: [],
      full: [],
      timedOut: [],
      pairL: -1,
      mode: 'sesion',
      clockLabel: '⏱ Reto',
      deadline: null,
      totalMs: null,
      timerId: null,
      timerQ: -1,
      globalEnd: Date.now() + totalMs,
      _lastDraft: 0
    };
    saveDraft();
    renderQuiz();
  }

  function questionTime(q) {
    return (q.time || TYPE_TIME[q.type] || 45) * 1000;
  }

  function renderQuiz() {
    var s = getSesion(quiz.sid);
    var q = quiz.qs[quiz.idx];
    var answered = isAnswered(q);
    var checked = quiz.pts[quiz.idx] !== undefined;

    var html = '<a class="back-link" href="#/sesion/' + quiz.sid + '">💾 Guardar y salir (tu avance queda guardado)</a>';
    html += '<div class="quiz-head">';
    html += '<div class="quiz-dots">';
    for (var i = 0; i < quiz.qs.length; i++) {
      var cls = 'dot';
      if (i === quiz.idx) cls += ' cur';
      else if (i < quiz.pts.length) cls += quiz.full[i] ? ' ok' : ' bad';
      html += '<span class="' + cls + '"></span>';
    }
    html += '</div>';
    html += '<div class="muted" style="font-size:12.5px">Sesión ' + s.num + ' · Pregunta ' + (quiz.idx + 1) + ' de ' + quiz.qs.length + ' · ' + TYPE_LABEL[q.type] + (nivel() !== 'basico' ? ' · Nivel ' + nivelLabel() : '') + '</div>';
    html += '</div>';
    html += '<div class="exam-clock" id="examClock">' + quiz.clockLabel + '</div>';

    html += '<div class="card question-card">';
    html += '<div class="timer-row" id="timerRow">';
    html += '<span class="timer-text" id="timerText">⏱ ' + Math.round(questionTime(q) / 1000) + 's</span>';
    html += '<div class="timer-bar"><div class="timer-fill" id="timerFill" style="width:100%"></div></div>';
    html += '</div>';
    html += '<div class="question-text">' + esc(q.q) + '</div>';
    if (q.img) { html += '<div class="question-img">' + q.img + '</div>'; }

    if (q.type === 'mc') { html += renderMc(q); }
    else if (q.type === 'tf') { html += renderTf(q); }
    else if (q.type === 'match') { html += renderMatch(q); }
    else if (q.type === 'order') { html += renderOrder(q); }
    else if (q.type === 'fill') { html += renderFill(q); }

    if (checked) {
      var f = quiz.pts[quiz.idx];
      var isFull = quiz.full[quiz.idx];
      var isPartial = !isFull && f > 0;
      html += '<div class="feedback-box ' + (f > 0 ? 'good' : 'bad') + '">';
      html += '<div class="fb-title">' + (quiz.timedOut[quiz.idx] ? '⏱ ¡Se agotó el tiempo!' : (isFull ? '✅ ¡Correcto!' : (isPartial ? '🟡 Parcialmente correcto' : '❌ Incorrecto'))) + '</div>';
      html += '<p>' + esc(q.fb) + '</p></div>';
      html += '<div class="quiz-actions">';
      html += '<button class="btn ' + (quiz.idx < quiz.qs.length - 1 ? 'btn-primary' : 'btn-good') + '" id="btnNext">' + (quiz.idx < quiz.qs.length - 1 ? 'Siguiente →' : 'Ver resultados 🏁') + '</button>';
      html += '</div>';
    } else {
      html += '<div class="quiz-actions">';
      html += '<button class="btn btn-primary" id="btnCheck" ' + (answered ? '' : 'disabled') + '>Comprobar ✔</button>';
      html += '</div>';
    }
    html += '</div>';
    $('#app').innerHTML = html;

    bindQuiz(q);
    if (!checked) startTimer();
    updateGlobalClock();
  }

  /* ---------------- Cronómetro ---------------- */
  function startTimer() {
    var q = quiz.qs[quiz.idx];
    // conserva el tiempo restante si la misma pregunta se re-renderiza
    if (quiz.timerQ === quiz.idx && quiz.deadline && quiz.deadline > Date.now()) { tick(); return; }
    quiz.timerQ = quiz.idx;
    quiz.totalMs = questionTime(q);
    quiz.deadline = Date.now() + quiz.totalMs;
    if (quiz.timerId) clearInterval(quiz.timerId);
    quiz.timerId = setInterval(tick, 200);
    tick();
  }
  function tick() {
    try {
    var q = quiz.qs[quiz.idx];
    if (!q) { if (quiz.timerId) clearInterval(quiz.timerId); return; }
    if (quiz.pts[quiz.idx] !== undefined) { if (quiz.timerId) clearInterval(quiz.timerId); return; }
    var rem = quiz.deadline - Date.now();
    updateGlobalClock();
    // guardado automático del avance cada ~3 segundos
    var nowD = Date.now();
    if (!quiz._lastDraft || nowD - quiz._lastDraft > 3000) {
      quiz._lastDraft = nowD;
      saveDraft();
    }
    if (rem <= 0) {
      if (quiz.timerId) clearInterval(quiz.timerId);
      quiz.timedOut[quiz.idx] = true;
      doCheck();
      return;
    }
    var fill = $('#timerFill'), txt = $('#timerText');
    if (fill && txt) {
      var pct = Math.max(0, Math.min(100, rem / quiz.totalMs * 100));
      fill.style.width = pct + '%';
      txt.textContent = '⏱ ' + Math.ceil(rem / 1000) + 's';
      var row = $('#timerRow');
      if (row) {
        row.classList.toggle('urgent', pct <= 25);
        row.classList.toggle('mid', pct > 25 && pct <= 50);
      }
    }
    } catch (err) {
      reportError(err, 'el cronómetro');
      if (quiz && quiz.timerId) { clearInterval(quiz.timerId); quiz.timerId = null; }
    }
  }
  function stopTimer() {
    if (quiz && quiz.timerId) { clearInterval(quiz.timerId); quiz.timerId = null; }
  }

  /* ---------------- Respuestas ---------------- */
  function isAnswered(q) {
    var a = quiz.ans[quiz.idx];
    if (!a) return false;
    if (q.type === 'mc' || q.type === 'tf') return a.sel !== null && a.sel !== undefined;
    if (q.type === 'fill') return !!a.val && a.val.trim().length > 0;
    if (q.type === 'order') return true;
    if (q.type === 'match') {
      var n = 0;
      for (var k in a.map) { if (a.map.hasOwnProperty(k)) n++; }
      return n === q.pairs.length;
    }
    return false;
  }

  function bindQuiz(q) {
    if (quiz.pts[quiz.idx] !== undefined) {
      var nb = $('#btnNext');
      if (nb) nb.addEventListener('click', function () {
        quiz.idx++;
        if (quiz.idx < quiz.qs.length) { reRender(); }
        else { finishCurrent(); }
      });
      return;
    }

    if (q.type === 'mc') {
      var opts = document.querySelectorAll('.opt');
      for (var i = 0; i < opts.length; i++) {
        (function (idx) {
          opts[idx].addEventListener('click', function () {
            if (quiz.pts[quiz.idx] !== undefined) return;
            quiz.ans[quiz.idx] = { sel: idx };
            reRender();
          });
        })(i);
      }
    } else if (q.type === 'tf') {
      var btns = document.querySelectorAll('.tf-btn');
      for (var j = 0; j < btns.length; j++) {
        (function (idx) {
          btns[idx].addEventListener('click', function () {
            if (quiz.pts[quiz.idx] !== undefined) return;
            quiz.ans[quiz.idx] = { sel: idx === 0 };
            reRender();
          });
        })(j);
      }
    } else if (q.type === 'fill') {
      var inp = $('#fillInput');
      if (inp) {
        inp.addEventListener('input', function () {
          quiz.ans[quiz.idx] = { val: inp.value };
          var b = $('#btnCheck');
          if (b) b.disabled = !inp.value.trim().length;
        });
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && inp.value.trim().length) doCheck();
        });
      }
    } else if (q.type === 'order') {
      var up = document.querySelectorAll('.ord-up');
      var dn = document.querySelectorAll('.ord-down');
      for (var u = 0; u < up.length; u++) {
        (function (idx) {
          up[idx].addEventListener('click', function () { moveOrder(idx, -1); });
          dn[idx].addEventListener('click', function () { moveOrder(idx, 1); });
        })(u);
      }
    } else if (q.type === 'match') {
      var lefts = document.querySelectorAll('.match-item.left');
      var rights = document.querySelectorAll('.match-item.right');
      for (var l = 0; l < lefts.length; l++) {
        (function (idx) {
          lefts[idx].addEventListener('click', function () {
            if (quiz.pts[quiz.idx] !== undefined) return;
            quiz.pairL = idx;
            reRender();
          });
        })(l);
      }
      for (var rr = 0; rr < rights.length; rr++) {
        (function (idx) {
          rights[idx].addEventListener('click', function () {
            if (quiz.pts[quiz.idx] !== undefined) return;
            var a = quiz.ans[quiz.idx];
            if (!a) a = quiz.ans[quiz.idx] = { map: {} };
            if (quiz.pairL >= 0) {
              for (var k in a.map) {
                if (a.map.hasOwnProperty(k) && a.map[k] === idx && k !== String(quiz.pairL)) { delete a.map[k]; }
              }
              a.map[quiz.pairL] = idx;
              quiz.pairL = -1;
              reRender();
            }
          });
        })(rr);
      }
    }

    var cb = $('#btnCheck');
    if (cb) cb.addEventListener('click', doCheck);
  }

  function moveOrder(idx, dir) {
    var a = quiz.ans[quiz.idx];
    if (!a) { a = quiz.ans[quiz.idx] = { arr: quiz.qs[quiz.idx].shuffled.slice() }; }
    var j = idx + dir;
    if (j < 0 || j >= a.arr.length) return;
    var t = a.arr[idx]; a.arr[idx] = a.arr[j]; a.arr[j] = t;
    reRender();
  }

  function doCheck() {
    stopTimer();
    var q = quiz.qs[quiz.idx];
    var a = quiz.ans[quiz.idx];
    var answered = isAnswered(q);
    var pts = 0, full = false;

    if (!answered) {
      pts = 0; full = false;
    } else if (q.type === 'mc' || q.type === 'tf') {
      var ok = a && a.sel === q.a;
      pts = ok ? 1 : 0;
      full = ok;
    } else if (q.type === 'fill') {
      var v = norm(a ? a.val : '');
      var okF = false;
      for (var i = 0; i < q.answers.length; i++) { if (v === norm(q.answers[i])) { okF = true; break; } }
      pts = okF ? 1 : 0;
      full = okF;
    } else if (q.type === 'order') {
      var arr = a && a.arr ? a.arr : quiz.qs[quiz.idx].shuffled;
      var n = 0;
      for (var o = 0; o < arr.length; o++) { if (arr[o] === q.items[o]) n++; }
      pts = n / q.items.length;
      full = n === q.items.length;
    } else if (q.type === 'match') {
      var map = a ? a.map : {};
      var n2 = 0;
      for (var m = 0; m < q.pairs.length; m++) {
        if (map[m] !== undefined && q.shuffledR[map[m]].src === m) n2++;
      }
      pts = n2 / q.pairs.length;
      full = n2 === q.pairs.length;
    }

    quiz.pts[quiz.idx] = Math.round(pts * 100) / 100;
    quiz.full[quiz.idx] = full;
    saveDraft();
    reRender();
  }

  function finishQuiz(timeUp) {
    stopTimer();
    var qs = quiz.qs;
    if (timeUp) {
      for (var u = 0; u < qs.length; u++) {
        if (quiz.pts[u] === undefined) { quiz.pts[u] = 0; quiz.full[u] = false; quiz.timedOut[u] = true; }
      }
    }
    var sum = 0;
    for (var i = 0; i < qs.length; i++) { sum += quiz.pts[i]; }
    var pct = Math.round(100 * sum / qs.length);
    var nota = noteOf(pct);

    var rec = recSesion(quiz.sid);
    var first = rec.attempts === 0;
    var oldNota = rec.best > 0 ? noteOf(rec.best) : 0;
    var gained = first
      ? Math.round(nota * 5) + (nota >= NOTA_MAX ? 20 : 0)
      : Math.max(0, Math.round((nota - oldNota) * 5)) + (nota >= NOTA_MAX && oldNota < NOTA_MAX ? 20 : 0);

    rec.attempts++;
    rec.last = pct;
    rec.best = Math.max(rec.best || 0, pct);
    rec.xpAwarded = (rec.xpAwarded || 0) + gained;
    ST.sessions[quiz.sid] = rec;
    ST.xp += gained;
    if (ST.draft) { delete ST.draft; }
    save();
    lastGain = gained;
    sendToCloud({ name: ST.name, dni: ST.dni || '', kind: 'sesion', sid: quiz.sid, note: nota, pct: pct, attempts: rec.attempts });
    location.hash = '#/sesion/' + quiz.sid + '/resultado';
  }

  /* ---------------- Render de tipos ---------------- */
  function renderMc(q) {
    var a = quiz.ans[quiz.idx];
    var sel = a ? a.sel : null;
    var checked = quiz.pts[quiz.idx] !== undefined;
    var letters = ['a', 'b', 'c', 'd', 'e', 'f'];
    var html = '';
    for (var i = 0; i < q.opts.length; i++) {
      var cls = 'opt';
      if (checked) {
        if (i === q.a) cls += ' correct';
        else if (i === sel) cls += ' wrong';
      } else if (i === sel) { cls += ' sel'; }
      html += '<button class="' + cls + '" ' + (checked ? 'disabled' : '') + '><span class="opt-letter">' + letters[i] + '</span><span>' + esc(q.opts[i]) + '</span></button>';
    }
    return html;
  }

  function renderTf(q) {
    var a = quiz.ans[quiz.idx];
    var sel = a ? (a.sel === true ? 0 : 1) : null;
    var checked = quiz.pts[quiz.idx] !== undefined;
    var labels = ['✅ Verdadero', '❌ Falso'];
    var html = '<div class="tf-row">';
    for (var i = 0; i < 2; i++) {
      var correctIdx = q.a === true ? 0 : 1;
      var cls = 'tf-btn';
      if (checked) {
        if (i === correctIdx) cls += ' correct';
        else if (i === sel) cls += ' wrong';
      } else if (i === sel) { cls += ' sel'; }
      html += '<button class="' + cls + '" ' + (checked ? 'disabled' : '') + '>' + labels[i] + '</button>';
    }
    html += '</div>';
    return html;
  }

  function renderMatch(q) {
    var a = quiz.ans[quiz.idx];
    var map = a ? a.map : {};
    var checked = quiz.pts[quiz.idx] !== undefined;
    var letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    var html = '<div class="match-wrap">';
    html += '<div class="match-col">';
    for (var i = 0; i < q.pairs.length; i++) {
      var cls = 'match-item left';
      var paired = map[i] !== undefined;
      if (quiz.pairL === i && !checked) cls += ' act';
      if (paired && !checked) cls += ' paired';
      if (checked) {
        var okPair = paired && q.shuffledR[map[i]].src === i;
        cls += okPair ? ' correct' : ' wrong';
      }
      html += '<button class="' + cls + '" ' + (checked ? 'disabled' : '') + '><strong>' + letters[i] + '.</strong> ' + esc(q.pairs[i][0]) + (paired && !checked ? ' → ' + (map[i] + 1) : '') + '</button>';
    }
    html += '</div><div class="match-col">';
    for (var j = 0; j < q.shuffledR.length; j++) {
      var cls2 = 'match-item right';
      var usedBy = null;
      for (var k in map) { if (map.hasOwnProperty(k) && map[k] === j) usedBy = k; }
      if (usedBy !== null && !checked) cls2 += ' paired';
      if (checked) {
        var okR = usedBy !== null && q.shuffledR[j].src === parseInt(usedBy, 10);
        cls2 += okR ? ' correct' : ' wrong';
      }
      html += '<button class="' + cls2 + '" ' + (checked ? 'disabled' : '') + '><strong>' + (j + 1) + '.</strong> ' + esc(q.shuffledR[j].t) + '</button>';
    }
    html += '</div></div>';
    html += '<p class="match-hint">' + (checked ? '' : 'Toca una opción de la izquierda y luego su pareja de la derecha. Toca de nuevo una pareja para deshacerla.') + '</p>';
    return html;
  }

  function renderOrder(q) {
    var a = quiz.ans[quiz.idx];
    if (!a) { a = quiz.ans[quiz.idx] = { arr: quiz.qs[quiz.idx].shuffled.slice() }; }
    var checked = quiz.pts[quiz.idx] !== undefined;
    var html = '';
    for (var i = 0; i < a.arr.length; i++) {
      var cls = 'order-item';
      if (checked) { cls += a.arr[i] === q.items[i] ? ' correct' : ' wrong'; }
      html += '<div class="' + cls + '"><span class="ord-idx">' + (i + 1) + '</span><span class="ord-text">' + esc(a.arr[i]) + '</span>';
      if (!checked) {
        html += '<span class="ord-btns">';
        html += '<button class="ord-btn ord-up" ' + (i === 0 ? 'disabled' : '') + '>▲</button>';
        html += '<button class="ord-btn ord-down" ' + (i === a.arr.length - 1 ? 'disabled' : '') + '>▼</button>';
        html += '</span>';
      }
      html += '</div>';
    }
    if (!checked) html += '<p class="match-hint">Usa ▲ y ▼ para ordenar los pasos del primero al último. ⏱ ¡El tiempo corre!</p>';
    return html;
  }

  function renderFill(q) {
    var a = quiz.ans[quiz.idx];
    var val = a ? a.val : '';
    var checked = quiz.pts[quiz.idx] !== undefined;
    var cls = 'fill-input';
    if (checked) cls += quiz.full[quiz.idx] ? ' correct' : ' wrong';
    var html = '<input type="text" id="fillInput" class="' + cls + '" placeholder="Escribe tu respuesta…" value="' + esc(val) + '" ' + (checked ? 'disabled' : '') + '>';
    if (checked) {
      html += '<p class="match-hint" style="margin-top:8px">Respuesta correcta: <strong>' + esc(q.answers[0]) + '</strong></p>';
    }
    return html;
  }

  /* ---------------- Resultado ---------------- */
  function viewResultado(s) {
    var rec = recSesion(s.id);
    var pct = rec.last;
    var nota = noteOf(pct);
    var medal = medalForNote(nota);
    var okN = nota >= NOTA_MIN;
    var hasDetail = quiz && quiz.sid === s.id && quiz.pts.length === quiz.qs.length;

    var cls = okN ? 'good' : (nota >= 10 ? 'mid' : 'bad');
    var html = '<div class="result-wrap">';
    html += '<div class="card center">';
    html += '<div class="medal-big">' + (medal || '🎯') + '</div>';
    html += '<h1 class="page-title">' + (okN ? '¡Excelente trabajo!' : 'Sigue practicando') + '</h1>';
    html += '<div class="score-circle ' + cls + '"><span class="sc-val">' + nota.toFixed(1) + '</span><span class="sc-label">Nota / 20</span></div>';
    html += '<p style="margin:-6px 0 10px"><span class="note-badge ' + (okN ? 'good' : (nota >= 10 ? 'warn' : 'crit')) + '">' + (okN ? '✅ APROBADO' : '❌ DESAPROBADO') + ' (mínimo ' + NOTA_MIN + ')</span></p>';
    html += '<div class="result-stats">';
    html += '<span class="pill">⭐ +' + lastGain + ' XP</span>';
    html += '<span class="pill">🏅 ' + esc(currentLevel().name) + '</span>';
    html += '<span class="pill">💪 Mejor nota: ' + noteOf(rec.best).toFixed(1) + '</span>';
    html += '</div>';
    html += '<p class="muted" style="font-size:13px">' + (nota >= NOTA_MAX ? '¡Puntaje perfecto! Dominas el tema de la sesión.' : (okN ? 'Muy bien: repasa las preguntas falladas para llegar al 20.' : 'Te recomendamos volver al repaso ilustrado y reintentar el reto.')) + '</p>';
    html += '<div class="quiz-actions" style="justify-content:center">';
    html += '<a class="btn btn-secondary" href="#/sesion/' + s.id + '/revisar">📖 Repasar</a>';
    html += '<a class="btn btn-primary" href="#/sesion/' + s.id + '/reto">🔁 Reintentar</a>';
    html += '<button class="btn btn-warn" id="btnPdf">📄 Exportar PDF</button>';
    html += '</div>';
    html += '</div>';

    if (hasDetail) {
      html += '<h2 class="sec-title" style="margin-top:18px">📋 Revisión de tus respuestas</h2>';
      for (var i = 0; i < quiz.qs.length; i++) {
        var q = quiz.qs[i];
        var f = quiz.pts[i];
        var isFull = quiz.full[i];
        html += '<div class="review-item ' + (isFull ? 'ok' : 'no') + '">';
        html += '<div class="ri-q">' + (i + 1) + '. ' + esc(q.q) + ' <span style="color:' + (f > 0 ? 'var(--good)' : 'var(--bad)') + ';font-weight:800">(' + Math.round(f * 100) + '%)</span></div>';
        html += '<div>Tu respuesta: <strong>' + (quiz.timedOut[i] ? '⏱ Sin responder (tiempo agotado)' : userAnswerText(q, quiz.ans[i])) + '</strong></div>';
        if (!isFull) {
          html += '<div>Respuesta correcta: <strong>' + correctAnswerText(q) + '</strong></div>';
          html += '<div class="muted" style="margin-top:4px">💡 ' + esc(q.fb) + '</div>';
        }
        html += '</div>';
      }
    } else {
      html += '<div class="tip-box">ℹ️ Este resultado quedó guardado de un intento anterior. Vuelve a intentar el reto para ver el detalle de tus respuestas.</div>';
    }
    html += '</div>';
    $('#app').innerHTML = html;

    var pb = $('#btnPdf');
    if (pb) pb.addEventListener('click', function () { printSessionReport(s, pct); });
  }

  function userAnswerText(q, a) {
    if (!a) return '—';
    if (q.type === 'mc') return a.sel !== null && a.sel !== undefined ? String.fromCharCode(97 + a.sel) + ') ' + q.opts[a.sel] : '—';
    if (q.type === 'tf') return a.sel ? 'Verdadero' : 'Falso';
    if (q.type === 'fill') return a.val || '—';
    if (q.type === 'order') return (a.arr || []).join(' → ');
    if (q.type === 'match') {
      var parts = [];
      for (var k in a.map) {
        if (a.map.hasOwnProperty(k)) {
          parts.push(String.fromCharCode(65 + parseInt(k, 10)) + ' → ' + (a.map[k] + 1));
        }
      }
      parts.sort();
      return parts.join(' · ') || '—';
    }
    return '—';
  }

  function correctAnswerText(q) {
    if (q.type === 'mc') return String.fromCharCode(97 + q.a) + ') ' + q.opts[q.a];
    if (q.type === 'tf') return q.a ? 'Verdadero' : 'Falso';
    if (q.type === 'fill') return q.answers[0];
    if (q.type === 'order') return q.items.join(' → ');
    if (q.type === 'match') {
      var parts = [];
      for (var i = 0; i < q.pairs.length; i++) {
        parts.push(String.fromCharCode(65 + i) + ' → ' + q.pairs[i][1]);
      }
      return parts.join(' · ');
    }
    return '—';
  }

  /* ============================================================
     MI PANEL (dashboard personal del estudiante)
     ============================================================ */
  function viewPanel() {
    var fin = promFinal(ST);
    var rend = promRendidas(ST);
    var done = completedCount();
    var lv = currentLevel();

    var html = '<h1 class="page-title">📊 Mi panel de resultados</h1>';
    html += '<p class="subtitle">' + esc(ST.name) + ' · Visualiza tus notas por sesión, tu promedio final y tu avance hacia la consolidación del curso.</p>';

    html += '<div class="stats-row">';
    html += '<div class="stat-card"><div class="stat-emoji">📊</div><div class="stat-val" style="color:' + (fin >= NOTA_MIN ? 'var(--viz-good)' : 'var(--viz-warn)') + '">' + fin.toFixed(1) + '</div><div class="stat-label">Promedio final / 20 (sesiones + casos)</div></div>';
    html += '<div class="stat-card"><div class="stat-emoji">🎯</div><div class="stat-val">' + done + ' / ' + ALL.length + '</div><div class="stat-label">Sesiones rendidas</div></div>';
    html += '<div class="stat-card"><div class="stat-emoji">🧩</div><div class="stat-val">' + (ST.casos ? ST.casos.best.toFixed(1) : '—') + '</div><div class="stat-label">Casos prácticos / 20</div></div>';
    html += '<div class="stat-card"><div class="stat-emoji">🎓</div><div class="stat-val">' + (ST.exam ? ST.exam.best.toFixed(1) : '—') + '</div><div class="stat-label">Examen final / 20</div></div>';
    html += '</div>';

    html += '<div class="card">';
    html += '<h2 class="sec-title">📋 Notas por sesión (mejor intento)</h2>';
    html += '<div class="viz-legend">';
    html += '<span class="lg-item"><span class="lg-chip st-good">✅</span> Aprobado (14–20)</span>';
    html += '<span class="lg-item"><span class="lg-chip st-warn">⚠️</span> Desaprobado (10–13.9)</span>';
    html += '<span class="lg-item"><span class="lg-chip st-crit">⛔</span> Crítico (0–9.9)</span>';
    html += '<span class="lg-item"><span class="lg-chip st-pend">▫️</span> Pendiente</span>';
    html += '</div>';
    html += '<div class="panel-bars">';
    ALL.forEach(function (s) {
      var r = recSesion(s.id);
      var nota = r.best > 0 ? noteOf(r.best) : null;
      var stCls = notaStatus(nota);
      var icon = nota === null ? '—' : (nota >= NOTA_MIN ? '✅' : (nota >= 10 ? '⚠️' : '⛔'));
      var pctW = nota === null ? 0 : Math.round(nota / NOTA_MAX * 100);
      html += '<div class="bar-row" title="Sesión ' + s.num + ': ' + esc(s.title) + (nota !== null ? ' · Mejor ' + r.best + '% · Intentos: ' + r.attempts : ' · Sin intentos') + '">';
      html += '<span class="bar-label">S' + s.num + '</span>';
      html += '<div class="bar-track"><div class="bar-fill ' + stCls + '" style="width:' + pctW + '%"></div></div>';
      html += '<span class="bar-val">' + (nota !== null ? nota.toFixed(1) : '—') + '</span>';
      html += '<span class="bar-icon">' + icon + '</span>';
      html += '</div>';
    });
    html += '</div></div>';

    html += '<div class="grid grid-2" style="margin-top:14px">';
    html += '<div class="card"><h2 class="sec-title">⭐ Progreso general</h2>';
    html += '<p style="font-size:13.5px;margin:4px 0">Nivel: <strong>' + lv.emoji + ' ' + esc(lv.name) + '</strong></p>';
    html += '<p style="font-size:13.5px;margin:4px 0">XP acumulada: <strong>' + ST.xp + '</strong></p>';
    html += '<p style="font-size:13.5px;margin:4px 0">Medallas ganadas: <strong>' + medalCountOf(ST) + '</strong></p>';
    html += '<p style="font-size:13.5px;margin:4px 0">Estado del curso: <strong>' + (fin >= NOTA_MIN ? '✅ Encaminado (promedio ≥ ' + NOTA_MIN + ')' : '⚠️ Necesitas reforzar para llegar al promedio ' + NOTA_MIN) + '</strong></p>';
    html += '</div>';
    html += '<div class="card"><h2 class="sec-title">📄 Reportes</h2>';
    html += '<p class="muted" style="font-size:13px;margin-bottom:10px">Descarga tus reportes personales en PDF o tu Excel de notas.</p>';
    html += '<div class="quiz-actions">';
    html += '<button class="btn btn-warn" id="btnPdfPanel">📄 Mi consolidado PDF</button>';
    html += '<button class="btn btn-good" id="btnXlsxStudent">📊 Descargar mi Excel de notas</button>';
    html += '</div></div>';
    html += '</div>';

    html += '<div class="card" style="margin-top:14px">';
    html += '<h2 class="sec-title">🎓 Evidencias para Classroom</h2>';
    html += '<p class="muted" style="font-size:13px;margin-bottom:10px">Al terminar las 16 sesiones, los casos y el examen final, descarga <strong>un PDF por cada evaluación</strong> + <strong>tu Excel de notas</strong> y súbelos como tarea en Classroom.</p>';
    html += '<div class="consol-scroll" style="max-height:320px"><table class="consol-table" style="min-width:0">';
    html += '<thead><tr><th style="text-align:left">Evidencia</th><th>Nota</th><th>Resultado</th><th>Descargar</th></tr></thead><tbody>';
    ALL.forEach(function (s) {
      var r = ST.sessions[s.id];
      var n = r && r.best > 0 ? noteOf(r.best) : null;
      html += '<tr><td class="consol-name">📄 Sesión ' + s.num + ' — ' + esc(s.title) + '</td>';
      html += '<td class="td-note ' + notaStatus(n) + '">' + (n !== null ? n.toFixed(1) : '—') + '</td>';
      html += '<td>' + (n === null ? 'Pendiente' : (n >= NOTA_MIN ? '✅ Aprobado' : '❌ Desaprobado')) + '</td>';
      html += '<td><button class="btn btn-ghost btnPdfSes" data-sid="' + s.id + '" style="padding:4px 10px;font-size:12px">📄 PDF</button></td></tr>';
    });
    html += '<tr><td class="consol-name">🧩 Casos prácticos</td><td class="td-note ' + notaStatus(ST.casos ? ST.casos.best : null) + '">' + (ST.casos ? ST.casos.best.toFixed(1) : '—') + '</td><td>' + (ST.casos ? (ST.casos.best >= NOTA_MIN ? '✅ Aprobado' : '❌ Desaprobado') : 'Pendiente') + '</td><td><button class="btn btn-ghost" id="btnPdfCasos" style="padding:4px 10px;font-size:12px">📄 PDF</button></td></tr>';
    html += '<tr><td class="consol-name">🎓 Examen final</td><td class="td-note ' + notaStatus(ST.exam ? ST.exam.best : null) + '">' + (ST.exam ? ST.exam.best.toFixed(1) : '—') + '</td><td>' + (ST.exam ? (ST.exam.best >= NOTA_MIN ? '✅ Aprobado' : '❌ Desaprobado') : 'Pendiente') + '</td><td><button class="btn btn-ghost" id="btnPdfExam2" style="padding:4px 10px;font-size:12px">📄 PDF</button></td></tr>';
    html += '</tbody></table></div>';
    html += '<p class="muted" style="font-size:12px;margin-top:8px">💡 Para el PDF usa el diálogo de impresión: destino «Guardar como PDF». Nombra tus archivos con tu apellido y la sesión (ej.: Torres_Ana_S01.pdf).</p>';
    html += '</div>';
    $('#app').innerHTML = html;

    $('#btnPdfPanel').addEventListener('click', function () { printStudentReport(); });
    $('#btnXlsxStudent').addEventListener('click', exportStudentXLSX);
    var pbs = document.querySelectorAll('.btnPdfSes');
    for (var pb = 0; pb < pbs.length; pb++) {
      (function (b) {
        b.addEventListener('click', function () {
          var s = getSesion(parseInt(b.getAttribute('data-sid'), 10));
          if (s) { printSessionReport(s, recSesion(s.id).best); }
        });
      })(pbs[pb]);
    }
    $('#btnPdfCasos').addEventListener('click', printCasosReport);
    $('#btnPdfExam2').addEventListener('click', printExamReport);
  }

  function medalCountOf(st) {
    var n = 0;
    for (var i = 0; i < ALL.length; i++) {
      var r = st.sessions[ALL[i].id];
      if (r && r.best > 0 && noteOf(r.best) >= NOTA_MIN) n++;
    }
    if (st.exam && st.exam.best >= NOTA_MIN) n++;
    return n;
  }

  /* ---------------- Logros ---------------- */
  function viewLogros() {
    var lv = currentLevel();
    var html = '<h1 class="page-title">🏆 Logros y niveles</h1>';
    html += '<p class="subtitle">Gana XP superando los retos cronometrados y sube de nivel. Las medallas se otorgan según tu mejor nota (0-20).</p>';

    html += '<h2 class="sec-title">📈 Escalera de niveles</h2><div class="level-ladder">';
    LEVELS.forEach(function (l) {
      var reached = ST.xp >= l.xp;
      html += '<div class="level-step ' + (reached ? 'reached' : '') + '">';
      html += '<span class="ls-emoji">' + l.emoji + '</span>';
      html += '<div class="ls-info"><strong>' + esc(l.name) + '</strong><small>' + l.xp + ' XP requeridos</small></div>';
      html += '<span>' + (reached ? '✅' : '🔒') + '</span></div>';
    });
    html += '</div>';

    html += '<h2 class="sec-title" style="margin-top:18px">🥇 Medallas por sesión</h2>';
    html += '<p class="muted" style="font-size:12.5px;margin-bottom:10px">🥉 14.0–16.9 · 🥈 17.0–19.4 · 🥇 19.5–20.0 (escala 0-20)</p>';
    html += '<div class="badge-grid">';
    ALL.forEach(function (s) {
      var r = recSesion(s.id);
      var nota = r.best > 0 ? noteOf(r.best) : null;
      var medal = nota !== null ? medalForNote(nota) : null;
      html += '<div class="badge ' + (medal ? '' : 'locked') + '">';
      html += '<div class="badge-emoji">' + (medal || '🔒') + '</div>';
      html += '<div class="badge-name">Sesión ' + s.num + ': ' + esc(s.title) + '</div>';
      html += '<div class="badge-cond">' + (medal ? 'Mejor nota: ' + nota.toFixed(1) + ' / 20' : 'Completa el reto con 14 o más') + '</div>';
      html += '</div>';
    });
    html += '</div>';

    html += '<h2 class="sec-title" style="margin-top:18px">🎖️ Logros especiales</h2><div class="badge-grid">';
    modules().forEach(function (m) {
      var allOk = true;
      m.list.forEach(function (s) { if (!recSesion(s.id).best || noteOf(recSesion(s.id).best) < 17) allOk = false; });
      html += '<div class="badge ' + (allOk ? '' : 'locked') + '">';
      html += '<div class="badge-emoji">' + (allOk ? '🎖️' : '🔒') + '</div>';
      html += '<div class="badge-name">Módulo ' + esc(m.key) + ' dominado</div>';
      html += '<div class="badge-cond">Todas sus sesiones con nota 17 o más</div></div>';
    });
    html += '<div class="badge ' + (ST.exam ? '' : 'locked') + '">';
    html += '<div class="badge-emoji">' + (ST.exam ? '🎓' : '🔒') + '</div>';
    html += '<div class="badge-name">Examen final superado</div>';
    html += '<div class="badge-cond">Aprobado con ' + NOTA_MIN + ' o más</div></div>';
    html += '<div class="badge ' + (ST.casos ? '' : 'locked') + '">';
    html += '<div class="badge-emoji">' + (ST.casos ? '🧩' : '🔒') + '</div>';
    html += '<div class="badge-name">Casos prácticos resueltos</div>';
    html += '<div class="badge-cond">Aprobado con ' + NOTA_MIN + ' o más</div></div>';
    html += '</div>';
    $('#app').innerHTML = html;
  }

  /* ---------------- Examen final ---------------- */
  function viewExamen() {
    var allDone = completedCount() === ALL.length && ALL.length > 0;
    var r = ST.exam;
    var html = '<div class="exam-hero"><div style="font-size:40px">🎓</div>';
    html += '<h1>Examen final</h1>';
    html += '<p>Evaluación de consolidación de toda la unidad. Cronometrado: ' + Math.round(EXAM_SECONDS / 60) + ' minutos para todas las preguntas. Valor: 20 puntos · Nota mínima: ' + NOTA_MIN + '.</p></div>';

    if (!FINAL) {
      html += '<div class="card center"><p>⏳ El examen final se habilitará cuando se carguen las 16 sesiones.</p></div>';
    } else if (!allDone) {
      html += '<div class="card center">';
      html += '<p style="font-size:15px;margin-bottom:10px">🔒 El examen final se desbloquea al rendir las 16 sesiones.</p>';
      html += '<p class="muted">Progreso: ' + completedCount() + ' de ' + ALL.length + ' sesiones rendidas.</p>';
      html += '<div class="progress-track" style="margin-top:12px"><div class="progress-fill" style="width:' + Math.round(100 * completedCount() / Math.max(1, ALL.length)) + '%"></div></div>';
      html += '</div>';
    } else {
      html += '<div class="grid grid-2">';
      html += '<div class="card"><h3 style="margin-bottom:8px">📜 Reglas</h3>';
      html += '<div class="exam-rule"><span class="er-emoji">📝</span><span>11 preguntas: 5 de Verdadero/Falso (1 pto c/u), 5 de Selección múltiple (2 ptos c/u) y 1 ejercicio de Relacionar con 5 pares (1 pto por par). Total: 20 puntos.</span></div>';
      html += '<div class="exam-rule"><span class="er-emoji">⏱</span><span>Tiempo total: ' + Math.round(EXAM_SECONDS / 60) + ' minutos. Si el tiempo se agota, el examen se cierra automáticamente con lo respondido.</span></div>';
      html += '<div class="exam-rule"><span class="er-emoji">🏅</span><span>Nota mínima aprobatoria: ' + NOTA_MIN + '. Máximo ' + maxAttempts('examen') + ' intentos: queda registrado tu mejor puntaje.</span></div>';
      html += '<div class="exam-rule"><span class="er-emoji">📄</span><span>Al terminar puedes exportar tu acta de resultados en PDF.</span></div>';
      var dEx = (ST.draft && ST.draft.mode === 'examen') ? ST.draft : null;
      html += '<div class="center" style="margin-top:12px">';
      if (dEx) {
        html += '<button class="btn btn-primary btn-big" id="btnStartExam">▶️ Continuar examen (pregunta ' + (dEx.idx + 1) + ' de ' + dEx.qs.length + ')</button>';
      } else if (r && r.attempts >= maxAttempts('examen')) {
        html += '<div class="tip-box">🚫 Alcanzaste el límite de ' + maxAttempts('examen') + ' intentos del examen. Queda registrada tu mejor nota.</div>';
      } else {
        html += '<button class="btn btn-primary btn-big" id="btnStartExam">' + (r ? 'Reintentar examen (' + (maxAttempts('examen') - (r ? r.attempts : 0)) + ' restantes)' : 'Comenzar examen') + '</button>';
      }
      if (r) html += '<button class="btn btn-warn" id="btnPdfExam" style="margin-top:8px">📄 Exportar acta PDF</button>';
      html += '</div></div>';
      html += '<div class="card center"><div style="font-size:44px">' + (r ? (r.best >= NOTA_MIN ? '🎓' : '💪') : '📋') + '</div>';
      html += '<p style="font-size:15px;font-weight:700">' + (r ? 'Mejor nota: ' + r.best.toFixed(1) + ' / 20' : 'Aún no rindes el examen') + '</p>';
      html += '<p class="muted" style="font-size:12.5px">' + (r ? 'Intentos: ' + r.attempts + ' · ' + (r.best >= NOTA_MIN ? '✅ Aprobado' : '❌ Desaprobado') : 'Rinde las 16 sesiones para desbloquearlo') + '</p></div>';
      html += '</div>';
    }
    $('#app').innerHTML = html;
    var sb = $('#btnStartExam');
    if (sb) sb.addEventListener('click', startExam);
    var pb = $('#btnPdfExam');
    if (pb) pb.addEventListener('click', printExamReport);
  }

  function startExam() {
    if (ST.draft && ST.draft.mode === 'examen') {
      restoreQuiz(ST.draft);
      toast('▶️ Examen reanudado en la pregunta ' + (quiz.idx + 1) + ' de ' + quiz.qs.length, 'good');
      renderExamQuiz();
      return;
    }
    var r = ST.exam || { attempts: 0 };
    if (r.attempts >= maxAttempts('examen')) {
      toast('🚫 Límite de ' + maxAttempts('examen') + ' intentos alcanzado en el examen final', 'bad');
      return;
    }
    quiz = {
      sid: 0,
      idx: 0,
      qs: FINAL.questions.map(prepQ),
      ans: [],
      pts: [],
      full: [],
      timedOut: [],
      pairL: -1,
      mode: 'examen',
      clockLabel: '⏱ Examen',
      pesos: FINAL.questions.map(function (q) { return q.pts || 1; }),
      deadline: null,
      totalMs: null,
      timerId: null,
      timerQ: -1,
      globalEnd: Date.now() + EXAM_SECONDS * 1000,
      _lastDraft: 0
    };
    saveDraft();
    renderExamQuiz();
  }

  function updateGlobalClock() {
    var el = $('#examClock');
    if (!el || !quiz || !quiz.globalEnd) return;
    var rem = quiz.globalEnd - Date.now();
    if (rem <= 0) {
      stopTimer();
      if (quiz.mode === 'examen') { finishExam(true); }
      else if (quiz.mode === 'casos') { finishCasos(true); }
      else { finishQuiz(true); }
      return;
    }
    var m = Math.floor(rem / 60000);
    var sec = Math.floor((rem % 60000) / 1000);
    el.textContent = quiz.clockLabel + ': ' + m + ':' + (sec < 10 ? '0' : '') + sec;
    el.classList.toggle('urgent', rem < 60000);
  }

  function renderExamQuiz() {
    var q = quiz.qs[quiz.idx];
    var answered = isAnswered(q);
    var checked = quiz.pts[quiz.idx] !== undefined;

    var html = '<a class="back-link" href="#/examen">💾 Guardar y salir (tu avance queda guardado)</a>';
    html += '<div class="quiz-head">';
    html += '<div class="quiz-dots">';
    for (var i = 0; i < quiz.qs.length; i++) {
      var cls = 'dot';
      if (i === quiz.idx) cls += ' cur';
      else if (i < quiz.pts.length) cls += quiz.full[i] ? ' ok' : ' bad';
      html += '<span class="' + cls + '"></span>';
    }
    html += '</div>';
    html += '<div class="muted" style="font-size:12.5px">Examen final · Pregunta ' + (quiz.idx + 1) + ' de ' + quiz.qs.length + ' · ' + TYPE_LABEL[q.type] + (q.pts ? ' · ' + q.pts + ' ptos' : '') + '</div>';
    html += '</div>';
    html += '<div class="exam-clock" id="examClock">' + quiz.clockLabel + '</div>';

    html += '<div class="card question-card">';
    html += '<div class="timer-row" id="timerRow">';
    html += '<span class="timer-text" id="timerText">⏱ ' + Math.round(questionTime(q) / 1000) + 's</span>';
    html += '<div class="timer-bar"><div class="timer-fill" id="timerFill" style="width:100%"></div></div>';
    html += '</div>';
    html += '<div class="question-text">' + esc(q.q) + '</div>';
    if (q.img) { html += '<div class="question-img">' + q.img + '</div>'; }
    if (q.type === 'mc') { html += renderMc(q); }
    else if (q.type === 'tf') { html += renderTf(q); }
    else if (q.type === 'match') { html += renderMatch(q); }
    else if (q.type === 'order') { html += renderOrder(q); }
    else if (q.type === 'fill') { html += renderFill(q); }

    if (checked) {
      var f = quiz.pts[quiz.idx];
      html += '<div class="feedback-box ' + (f > 0 ? 'good' : 'bad') + '">';
      html += '<div class="fb-title">' + (quiz.timedOut[quiz.idx] ? '⏱ ¡Se agotó el tiempo!' : (quiz.full[quiz.idx] ? '✅ ¡Correcto!' : (f > 0 ? '🟡 Parcial' : '❌ Incorrecto'))) + '</div>';
      html += '<p>' + esc(q.fb) + '</p></div>';
      html += '<div class="quiz-actions"><button class="btn ' + (quiz.idx < quiz.qs.length - 1 ? 'btn-primary' : 'btn-good') + '" id="btnNext">' + (quiz.idx < quiz.qs.length - 1 ? 'Siguiente →' : 'Ver mi acta 🏁') + '</button></div>';
    } else {
      html += '<div class="quiz-actions"><button class="btn btn-primary" id="btnCheck" ' + (answered ? '' : 'disabled') + '>Comprobar ✔</button></div>';
    }
    html += '</div>';
    $('#app').innerHTML = html;
    bindQuiz(q);
    if (!checked) startTimer();
    updateGlobalClock();
  }

  function finishExam(timeUp) {
    stopTimer();
    for (var i = 0; i < quiz.qs.length; i++) {
      if (quiz.pts[i] === undefined) {
        quiz.pts[i] = 0;
        quiz.full[i] = false;
        if (timeUp) quiz.timedOut[i] = true;
      }
    }
    var total = 0, pesoTotal = 0;
    for (var j = 0; j < quiz.qs.length; j++) {
      var w = quiz.pesos[j];
      pesoTotal += w;
      total += quiz.pts[j] * w;
    }
    var nota = Math.round(total * 10) / 10;

    var r = ST.exam || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
    var first = r.attempts === 0;
    var oldBest = r.best || 0;
    var gained = first
      ? Math.round(nota * 6) + (nota >= NOTA_MIN ? 60 : 0)
      : Math.max(0, Math.round((nota - oldBest) * 6)) + (nota >= NOTA_MIN && oldBest < NOTA_MIN ? 60 : 0);
    r.attempts++;
    r.last = nota;
    r.best = Math.max(r.best, nota);
    r.xpAwarded = (r.xpAwarded || 0) + gained;
    ST.exam = r;
    ST.xp += gained;
    if (ST.draft) { delete ST.draft; }
    save();
    lastGain = gained;
    sendToCloud({ name: ST.name, dni: ST.dni || '', kind: 'examen', sid: 0, note: nota, pct: Math.round(nota / 20 * 100), attempts: r.attempts });
    location.hash = '#/examen';
    showFinishModal('🎓', timeUp ? '⏱ Tiempo agotado — Examen cerrado' : '¡Examen finalizado!', nota,
      'Tu mejor nota queda registrada en tu acta.<br>' +
      (nota >= NOTA_MIN ? '¡Felicitaciones! Descarga tu acta PDF como evidencia.' : 'Puedes volver a intentarlo (' + (maxAttempts('examen') - r.attempts) + ' intentos restantes).'));
  }

  /* ============================================================
     CASOS PRÁCTICOS (casuísticas)
     ============================================================ */
  function recCasos() {
    return ST.casos || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
  }

  function viewCasos() {
    var allDone = completedCount() === ALL.length && ALL.length > 0;
    var r = recCasos();
    var html = '<div class="exam-hero" style="background:linear-gradient(135deg,#0d9488,#115e59)"><div style="font-size:40px">🧩</div>';
    html += '<h1>Casos prácticos (casuísticas)</h1>';
    html += '<p>Cuatro situaciones reales de trabajo que consolidan tus aprendizajes: requieren razonamiento lógico y comprensión de los contenidos de las 16 sesiones. Valor: 20 puntos · Nota mínima: ' + NOTA_MIN + '.</p></div>';

    if (!CASOS.length) {
      html += '<div class="card center"><p>⏳ Los casos se habilitarán cuando se carguen las casuísticas.</p></div>';
    } else if (!allDone) {
      html += '<div class="card center">';
      html += '<p style="font-size:15px;margin-bottom:10px">🔒 Los casos se desbloquean al rendir las 16 sesiones.</p>';
      html += '<p class="muted">Progreso: ' + completedCount() + ' de ' + ALL.length + ' sesiones rendidas.</p>';
      html += '<div class="progress-track" style="margin-top:12px"><div class="progress-fill" style="width:' + Math.round(100 * completedCount() / Math.max(1, ALL.length)) + '%"></div></div>';
      html += '</div>';
    } else {
      html += '<div class="grid grid-2">';
      html += '<div class="card"><h3 style="margin-bottom:8px">📜 Reglas</h3>';
      html += '<div class="exam-rule"><span class="er-emoji">📝</span><span>4 casos con situación real + 5 preguntas cada uno (20 preguntas × 1 pto). Total: 20 puntos.</span></div>';
      html += '<div class="exam-rule"><span class="er-emoji">⏱</span><span>Tiempo total: ' + Math.round(CASOS_SECONDS / 60) + ' minutos, con reloj visible y cronómetro por pregunta.</span></div>';
      html += '<div class="exam-rule"><span class="er-emoji">🏅</span><span>Nota mínima aprobatoria: ' + NOTA_MIN + '. Máximo ' + maxAttempts('casos') + ' intentos. Esta nota promedia con la de las sesiones para tu calificación final.</span></div>';
      var dCa = (ST.draft && ST.draft.mode === 'casos') ? ST.draft : null;
      html += '<div class="center" style="margin-top:12px">';
      if (dCa) {
        html += '<button class="btn btn-primary btn-big" id="btnStartCasos">▶️ Continuar casos (pregunta ' + (dCa.idx + 1) + ' de ' + dCa.qs.length + ')</button>';
      } else if (r.attempts >= maxAttempts('casos')) {
        html += '<div class="tip-box">🚫 Alcanzaste el límite de ' + maxAttempts('casos') + ' intentos de los casos. Queda registrada tu mejor nota.</div>';
      } else {
        html += '<button class="btn btn-primary btn-big" id="btnStartCasos">' + (r.attempts > 0 ? 'Reintentar casos (' + (maxAttempts('casos') - r.attempts) + ' restantes)' : 'Comenzar casos') + '</button>';
      }
      html += '</div></div>';
      html += '<div class="card center"><div style="font-size:44px">🧩</div>';
      html += '<p style="font-size:15px;font-weight:700">' + (r.attempts > 0 ? 'Mejor nota: ' + r.best.toFixed(1) + ' / 20' : 'Aún no resuelves los casos') + '</p>';
      html += '<p class="muted" style="font-size:12.5px">' + (r.attempts > 0 ? 'Intentos: ' + r.attempts + ' · ' + (r.best >= NOTA_MIN ? '✅ Aprobado' : '❌ Desaprobado') : 'Rinde las 16 sesiones para desbloquearlos') + '</p></div>';
      html += '</div>';
      html += '<div class="card" style="margin-top:12px"><h3 style="margin-bottom:8px">📚 Los 4 casos de la evaluación</h3>';
      CASOS.forEach(function (c) {
        html += '<div class="exam-rule"><span class="er-emoji">' + c.emoji + '</span><span><strong>' + esc(c.title) + '</strong> · ' + esc(c.module) + ' · 5 preguntas · Situación real de trabajo</span></div>';
      });
      html += '</div>';
    }
    $('#app').innerHTML = html;
    var sb = $('#btnStartCasos');
    if (sb) sb.addEventListener('click', startCasos);
  }

  function startCasos() {
    if (ST.draft && ST.draft.mode === 'casos') {
      restoreQuiz(ST.draft);
      toast('▶️ Casos reanudados en la pregunta ' + (quiz.idx + 1) + ' de ' + quiz.qs.length, 'good');
      renderCasosQuiz();
      return;
    }
    var r = recCasos();
    if (r.attempts >= maxAttempts('casos')) { toast('🚫 Límite de ' + maxAttempts('casos') + ' intentos alcanzado', 'bad'); return; }
    var qs = [];
    CASOS.forEach(function (c) { c.questions.forEach(function (q) { qs.push(q); }); });
    quiz = {
      sid: 0,
      idx: 0,
      qs: qs.map(prepQ),
      ans: [],
      pts: [],
      full: [],
      timedOut: [],
      pairL: -1,
      mode: 'casos',
      clockLabel: '⏱ Casos',
      pesos: qs.map(function () { return 1; }),
      deadline: null,
      totalMs: null,
      timerId: null,
      timerQ: -1,
      globalEnd: Date.now() + CASOS_SECONDS * 1000,
      _lastDraft: 0
    };
    saveDraft();
    renderCasosQuiz();
  }

  function renderCasosQuiz() {
    var q = quiz.qs[quiz.idx];
    var answered = isAnswered(q);
    var checked = quiz.pts[quiz.idx] !== undefined;
    var html = '<a class="back-link" href="#/casos">💾 Guardar y salir (tu avance queda guardado)</a>';
    html += '<div class="quiz-head">';
    html += '<div class="quiz-dots">';
    for (var i = 0; i < quiz.qs.length; i++) {
      var cls = 'dot';
      if (i === quiz.idx) cls += ' cur';
      else if (i < quiz.pts.length) cls += quiz.full[i] ? ' ok' : ' bad';
      html += '<span class="' + cls + '"></span>';
    }
    html += '</div>';
    html += '<div class="muted" style="font-size:12.5px">Casos prácticos · Pregunta ' + (quiz.idx + 1) + ' de ' + quiz.qs.length + ' · ' + TYPE_LABEL[q.type] + '</div>';
    html += '</div>';
    html += '<div class="exam-clock" id="examClock">' + quiz.clockLabel + '</div>';
    html += '<div class="card question-card">';
    html += '<div class="timer-row" id="timerRow">';
    html += '<span class="timer-text" id="timerText">⏱ ' + Math.round(questionTime(q) / 1000) + 's</span>';
    html += '<div class="timer-bar"><div class="timer-fill" id="timerFill" style="width:100%"></div></div>';
    html += '</div>';
    var casoIdx = Math.min(Math.max(0, CASOS.length - 1), Math.floor(quiz.idx / 5));
    var caso = CASOS[casoIdx];
    if (caso) {
      html += '<div class="case-box"><strong>' + caso.emoji + ' Caso ' + (casoIdx + 1) + ' — ' + esc(caso.title) + '</strong>';
      caso.scenario.forEach(function (p) { html += '<p>' + esc(p) + '</p>'; });
      html += '</div>';
    }
    html += '<div class="question-text">' + esc(q.q) + '</div>';
    if (q.img) { html += '<div class="question-img">' + q.img + '</div>'; }
    if (q.type === 'mc') { html += renderMc(q); }
    else if (q.type === 'tf') { html += renderTf(q); }
    else if (q.type === 'match') { html += renderMatch(q); }
    else if (q.type === 'order') { html += renderOrder(q); }
    else if (q.type === 'fill') { html += renderFill(q); }

    if (checked) {
      var f = quiz.pts[quiz.idx];
      html += '<div class="feedback-box ' + (f > 0 ? 'good' : 'bad') + '">';
      html += '<div class="fb-title">' + (quiz.timedOut[quiz.idx] ? '⏱ ¡Se agotó el tiempo!' : (quiz.full[quiz.idx] ? '✅ ¡Correcto!' : (f > 0 ? '🟡 Parcial' : '❌ Incorrecto'))) + '</div>';
      html += '<p>' + esc(q.fb) + '</p></div>';
      html += '<div class="quiz-actions"><button class="btn ' + (quiz.idx < quiz.qs.length - 1 ? 'btn-primary' : 'btn-good') + '" id="btnNext">' + (quiz.idx < quiz.qs.length - 1 ? 'Siguiente →' : 'Ver mis resultados 🏁') + '</button></div>';
    } else {
      html += '<div class="quiz-actions"><button class="btn btn-primary" id="btnCheck" ' + (answered ? '' : 'disabled') + '>Comprobar ✔</button></div>';
    }
    html += '</div>';
    $('#app').innerHTML = html;
    bindQuiz(q);
    if (!checked) startTimer();
    updateGlobalClock();
  }

  function showFinishModal(emoji, titulo, nota, extra) {
    var okN = nota >= NOTA_MIN;
    var html = '<h3 style="text-align:center">' + emoji + ' ' + esc(titulo) + '</h3>';
    html += '<div class="score-circle ' + (okN ? 'good' : 'bad') + '" style="width:120px;height:120px;border-width:8px"><span class="sc-val">' + nota.toFixed(1) + '</span><span class="sc-label">Nota / 20</span></div>';
    html += '<p style="text-align:center;margin:10px 0"><span class="note-badge ' + (okN ? 'good' : 'crit') + '">' + (okN ? '✅ APROBADO' : '❌ DESAPROBADO') + ' (mínimo ' + NOTA_MIN + ')</span></p>';
    html += '<p style="text-align:center;font-size:13.5px;line-height:1.6">' + extra + '</p>';
    html += '<div class="modal-actions" style="justify-content:center"><button class="btn btn-primary btn-big" id="btnCloseFinish">Entendido</button></div>';
    openModal(html);
    $('#btnCloseFinish').addEventListener('click', function () { closeModal(); });
  }

  function finishCasos(timeUp) {
    stopTimer();
    for (var i = 0; i < quiz.qs.length; i++) {
      if (quiz.pts[i] === undefined) { quiz.pts[i] = 0; quiz.full[i] = false; if (timeUp) quiz.timedOut[i] = true; }
    }
    var sum = 0;
    for (var j = 0; j < quiz.qs.length; j++) { sum += quiz.pts[j]; }
    var nota = Math.round(sum * 10) / 10;
    var r = recCasos();
    var first = r.attempts === 0;
    var oldBest = r.best || 0;
    var gained = first
      ? Math.round(nota * 6) + (nota >= NOTA_MIN ? 80 : 0)
      : Math.max(0, Math.round((nota - oldBest) * 6)) + (nota >= NOTA_MIN && oldBest < NOTA_MIN ? 80 : 0);
    r.attempts++;
    r.last = nota;
    r.best = Math.max(r.best, nota);
    r.xpAwarded = (r.xpAwarded || 0) + gained;
    ST.casos = r;
    ST.xp += gained;
    if (ST.draft) { delete ST.draft; }
    save();
    lastGain = gained;
    sendToCloud({ name: ST.name, dni: ST.dni || '', kind: 'casos', sid: 0, note: nota, pct: Math.round(nota / 20 * 100), attempts: r.attempts });
    location.hash = '#/casos';
    showFinishModal('🧩', timeUp ? '⏱ Tiempo agotado — Casos cerrados' : '¡Casos finalizados!', nota,
      'Tu <strong>promedio final</strong> ahora es <strong>' + promFinal(ST).toFixed(1) + ' / 20</strong> (sesiones + casos).<br>' +
      (nota >= NOTA_MIN ? '¡Excelente! Tu calificativo quedó registrado como evidencia.' : 'Tu nota quedó registrada; revisa la retroalimentación y vuelve a intentarlo (' + (maxAttempts('casos') - r.attempts) + ' intentos restantes).'));
  }

  /* ============================================================
     CONSOLIDADO DOCENTE
     ============================================================ */
  function askTeacherCode() {
    openModal(
      '<h3>👩‍🏫 Acceso docente</h3>' +
      '<p>Ingresa el código de docente para ver el consolidado de notas de todos los estudiantes registrados en este equipo.</p>' +
      '<input type="password" id="teacherCodeInput" class="fill-input" placeholder="Código de docente">' +
      '<div class="modal-actions"><button class="btn btn-ghost" id="btnCancelCode">Cancelar</button><button class="btn btn-primary" id="btnOkCode">Ingresar</button></div>'
    );
    $('#btnCancelCode').addEventListener('click', closeModal);
    $('#btnOkCode').addEventListener('click', function () {
      if (norm($('#teacherCodeInput').value) === norm(db.teacherCode)) {
        teacherOk = true;
        try {
          sessionStorage.setItem('cpd_teacher_ok', '1');
          localStorage.setItem('cpd_teacher_open', '1');
        } catch (e) { /* ignorar */ }
        closeModal();
        toast('Acceso docente habilitado 👩‍🏫', 'good');
        location.hash = '#/consolidado';
        route();
      } else {
        toast('Código incorrecto', 'bad');
      }
    });
    $('#teacherCodeInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') $('#btnOkCode').click();
    });
    setTimeout(function () { var inp = $('#teacherCodeInput'); if (inp) inp.focus(); }, 60);
  }

  function viewConsolidado() {
    if (!teacherOk) {
      openModal(
        '<h3>👩‍🏫 Acceso docente</h3>' +
        '<p>Ingresa el código de docente para ver el consolidado de notas.</p>' +
        '<input type="password" id="teacherCodeInput" class="fill-input" placeholder="Código de docente">' +
        '<div class="modal-actions"><button class="btn btn-ghost" id="btnCancelCode2">Cancelar</button><button class="btn btn-primary" id="btnOkCode2">Ingresar</button></div>'
      );
      $('#btnCancelCode2').addEventListener('click', function () { closeModal(); location.hash = '#/inicio'; route(); });
      $('#btnOkCode2').addEventListener('click', function () {
        if (norm($('#teacherCodeInput').value) === norm(db.teacherCode)) {
          teacherOk = true;
          try {
            sessionStorage.setItem('cpd_teacher_ok', '1');
            localStorage.setItem('cpd_teacher_open', '1');
          } catch (e) { /* ignorar */ }
          closeModal();
          viewConsolidado();
        } else {
          toast('Código incorrecto', 'bad');
        }
      });
      $('#teacherCodeInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') $('#btnOkCode2').click();
      });
      setTimeout(function () { var inp = $('#teacherCodeInput'); if (inp) inp.focus(); }, 60);
      return;
    }

    var n = db.students.length;
    var ap = 0, des = 0, pend = 0, term = 0, hom = 0, muj = 0, sinSexo = 0, sumFin = 0;
    db.students.forEach(function (st) {
      var pf = promFinal(st);
      sumFin += pf;
      var c = completedOf(st);
      if (c === ALL.length) { term++; }
      if (c === 0) { pend++; }
      else if (pf >= NOTA_MIN) { ap++; }
      else { des++; }
      if (st.sexo === 'M') { hom++; }
      else if (st.sexo === 'F') { muj++; }
      else { sinSexo++; }
    });
    var promCurso = n ? Math.round(sumFin / n * 10) / 10 : 0;
    function pctOf(x) { return n ? Math.round(x / n * 100) : 0; }

    var html = '<h1 class="page-title">👩‍🏫 Dashboard docente — control y monitoreo</h1>';
    html += '<p class="subtitle">Monitoreo general de las notas de todos los estudiantes (nota 0-20, mínimo ' + NOTA_MIN + '). Los datos viven en este dispositivo: usa «Exportar base» para respaldar o unificar equipos.</p>';

    html += '<div class="quiz-actions" style="margin-bottom:12px">';
    html += '<button class="btn btn-warn" id="btnPdfConsol">📄 Exportar consolidado PDF</button>';
    html += '<button class="btn btn-good" id="btnXlsxConsol">📊 Exportar consolidado XLSX</button>';
    html += '<button class="btn btn-secondary" id="btnExportDB">💾 Exportar base (JSON)</button>';
    html += '<button class="btn btn-secondary" id="btnImportDB">📥 Importar base</button>';
    html += '<input type="file" id="importDBFile" accept="application/json" hidden>';
    html += '<button class="btn btn-good" id="btnImportXlsx">📥 Importar Excel de estudiantes</button>';
    html += '<input type="file" id="importXlsxFile" accept=".xlsx" multiple hidden>';
    if (cloudUrl()) {
      html += '<button class="btn btn-secondary" id="btnSyncCloud">🔄 Sincronizar nube</button>';
    }
    html += '<a class="btn btn-ghost" href="guia-docente.html" target="_blank">📖 Guía del docente</a>';
    html += '<button class="btn btn-ghost" id="btnLogoutTeacher">🔒 Cerrar sesión docente</button>';
    html += '<a class="btn btn-ghost" href="#/inicio">Volver</a>';
    html += '</div>';

    html += '<div class="card" style="margin-bottom:14px">';
    html += '<h2 class="sec-title">⚙️ Configuración de la evaluación</h2>';
    html += '<div class="grid grid-4">';
    html += '<div><label class="login-label">Nivel de evaluación</label>';
    html += '<select id="cfgNivel" class="fill-input">';
    html += '<option value="basico"' + (nivel() === 'basico' ? ' selected' : '') + '>Básico</option>';
    html += '<option value="intermedio"' + (nivel() === 'intermedio' ? ' selected' : '') + '>Intermedio</option>';
    html += '<option value="avanzado"' + (nivel() === 'avanzado' ? ' selected' : '') + '>Avanzado</option>';
    html += '</select></div>';
    html += '<div><label class="login-label">Intentos por reto</label><input type="number" id="cfgRetos" class="fill-input" min="1" max="10" value="' + maxAttempts('retos') + '"></div>';
    html += '<div><label class="login-label">Intentos de casos</label><input type="number" id="cfgCasos" class="fill-input" min="1" max="10" value="' + maxAttempts('casos') + '"></div>';
    html += '<div><label class="login-label">Intentos del examen</label><input type="number" id="cfgExamen" class="fill-input" min="1" max="10" value="' + maxAttempts('examen') + '"></div>';
    html += '</div>';
    html += '<div class="quiz-actions" style="margin-top:10px"><button class="btn btn-primary" id="btnSaveCfg">💾 Guardar configuración</button></div>';
    html += '<p class="muted" style="font-size:12px">La configuración aplica a TODOS los estudiantes de este equipo. Los niveles Intermedio y Avanzado añaden tarjetas de repaso y preguntas más exigentes a cada reto. ' + (cloudUrl() ? '☁️ Nube: configurada — usa «🔄 Sincronizar nube» para traer los resultados de los estudiantes.' : '☁️ Nube: no configurada (editar js/config.js — ver APPS_SCRIPT_GOOGLE.txt).') + '</p>';
    html += '</div>';

    html += '<div class="stats-row">';
    html += '<div class="stat-card"><div class="stat-emoji">👥</div><div class="stat-val">' + n + '</div><div class="stat-label">Estudiantes registrados</div></div>';
    html += '<div class="stat-card"><div class="stat-emoji">📊</div><div class="stat-val">' + promCurso.toFixed(1) + '</div><div class="stat-label">Promedio final del curso / 20</div></div>';
    html += '<div class="stat-card"><div class="stat-emoji">✅</div><div class="stat-val" style="color:var(--viz-good)">' + ap + ' (' + pctOf(ap) + '%)</div><div class="stat-label">Aprobados (≥ ' + NOTA_MIN + ')</div></div>';
    html += '<div class="stat-card"><div class="stat-emoji">⚠️</div><div class="stat-val" style="color:var(--viz-warn)">' + des + ' (' + pctOf(des) + '%)</div><div class="stat-label">Desaprobados</div></div>';
    html += '<div class="stat-card"><div class="stat-emoji">⏳</div><div class="stat-val">' + pend + ' (' + pctOf(pend) + '%)</div><div class="stat-label">Pendientes</div></div>';
    html += '</div>';

    html += '<div class="card" style="margin-bottom:14px">';
    html += '<h2 class="sec-title">📋 Cuadro estadístico de estudiantes</h2>';
    html += '<table class="consol-table" style="min-width:0">';
    html += '<thead><tr><th style="text-align:left">Indicador</th><th>Cantidad</th><th>Porcentaje</th></tr></thead><tbody>';
    html += '<tr><td class="consol-name">✅ Aprobados (promedio final ≥ ' + NOTA_MIN + ')</td><td class="td-note good">' + ap + '</td><td>' + pctOf(ap) + '%</td></tr>';
    html += '<tr><td class="consol-name">❌ Desaprobados</td><td class="td-note warn">' + des + '</td><td>' + pctOf(des) + '%</td></tr>';
    html += '<tr><td class="consol-name">⏳ Pendientes (sin evaluaciones)</td><td class="td-note pend">' + pend + '</td><td>' + pctOf(pend) + '%</td></tr>';
    html += '<tr><td class="consol-name">🏁 Terminados (16 sesiones rendidas)</td><td>' + term + '</td><td>' + pctOf(term) + '%</td></tr>';
    html += '<tr><td class="consol-name">👨 Hombres</td><td>' + hom + '</td><td>' + pctOf(hom) + '%</td></tr>';
    html += '<tr><td class="consol-name">👩 Mujeres</td><td>' + muj + '</td><td>' + pctOf(muj) + '%</td></tr>';
    html += '<tr><td class="consol-name">❔ Sexo sin dato (registros antiguos)</td><td>' + sinSexo + '</td><td>' + pctOf(sinSexo) + '%</td></tr>';
    html += '<tr><td class="consol-name"><strong>Total de estudiantes</strong></td><td><strong>' + n + '</strong></td><td><strong>100%</strong></td></tr>';
    html += '</tbody></table>';
    html += '</div>';

    // estadísticas generales por componente
    var rSes = 0, apSes = 0, sumSes = 0;
    var rCas = 0, apCas = 0, sumCas = 0;
    var rExa = 0, apExa = 0, sumExa = 0;
    db.students.forEach(function (st) {
      var prS = promGeneral(st);
      if (completedOf(st) > 0) { rSes++; sumSes += prS; if (prS >= NOTA_MIN) apSes++; }
      if (st.casos && st.casos.best > 0) { rCas++; sumCas += st.casos.best; if (st.casos.best >= NOTA_MIN) apCas++; }
      if (st.exam && st.exam.best > 0) { rExa++; sumExa += st.exam.best; if (st.exam.best >= NOTA_MIN) apExa++; }
    });
    function avgOf(sum, cnt) { return cnt ? Math.round(sum / cnt * 10) / 10 : 0; }
    html += '<div class="card" style="margin-bottom:14px">';
    html += '<h2 class="sec-title">📊 Estadísticas generales por componente</h2>';
    html += '<table class="consol-table" style="min-width:0">';
    html += '<thead><tr><th style="text-align:left">Componente</th><th>Rendidos</th><th>Promedio</th><th>Aprobados</th><th>% Aprobación</th></tr></thead><tbody>';
    html += '<tr><td class="consol-name">📚 Sesiones (promedio de las 16)</td><td>' + rSes + '</td><td class="td-note ' + (avgOf(sumSes, rSes) >= NOTA_MIN ? 'good' : 'warn') + '">' + avgOf(sumSes, rSes).toFixed(1) + '</td><td>' + apSes + '</td><td>' + (rSes ? Math.round(apSes / rSes * 100) : 0) + '%</td></tr>';
    html += '<tr><td class="consol-name">🧩 Casos prácticos</td><td>' + rCas + '</td><td class="td-note ' + (avgOf(sumCas, rCas) >= NOTA_MIN ? 'good' : 'warn') + '">' + avgOf(sumCas, rCas).toFixed(1) + '</td><td>' + apCas + '</td><td>' + (rCas ? Math.round(apCas / rCas * 100) : 0) + '%</td></tr>';
    html += '<tr><td class="consol-name">🎓 Examen final</td><td>' + rExa + '</td><td class="td-note ' + (avgOf(sumExa, rExa) >= NOTA_MIN ? 'good' : 'warn') + '">' + avgOf(sumExa, rExa).toFixed(1) + '</td><td>' + apExa + '</td><td>' + (rExa ? Math.round(apExa / rExa * 100) : 0) + '%</td></tr>';
    html += '</tbody></table>';
    html += '</div>';

    html += '<div class="card" style="margin-bottom:14px">';
    html += '<h2 class="sec-title">📈 Promedio del curso por sesión</h2>';
    html += '<div class="viz-legend">';
    html += '<span class="lg-item"><span class="lg-chip st-good">✅</span> Aprobado (14–20)</span>';
    html += '<span class="lg-item"><span class="lg-chip st-warn">⚠️</span> Desaprobado (10–13.9)</span>';
    html += '<span class="lg-item"><span class="lg-chip st-crit">⛔</span> Crítico (0–9.9)</span>';
    html += '<span class="lg-item"><span class="lg-chip st-pend">▫️</span> Sin datos</span>';
    html += '</div>';
    html += '<div class="panel-bars">';
    ALL.forEach(function (s) {
      var sum = 0, cnt = 0;
      db.students.forEach(function (st) {
        var r = st.sessions[s.id];
        if (r && r.best > 0) { sum += noteOf(r.best); cnt++; }
      });
      var avg = cnt ? Math.round(sum / cnt * 10) / 10 : null;
      var stCls = notaStatus(avg);
      var icon = avg === null ? '—' : (avg >= NOTA_MIN ? '✅' : (avg >= 10 ? '⚠️' : '⛔'));
      html += '<div class="bar-row" title="Sesión ' + s.num + ': ' + esc(s.title) + (avg !== null ? ' · Promedio ' + avg.toFixed(1) + ' de ' + cnt + ' estudiantes' : ' · Sin datos todavía') + '">';
      html += '<span class="bar-label">S' + s.num + '</span>';
      html += '<div class="bar-track"><div class="bar-fill ' + stCls + '" style="width:' + (avg === null ? 0 : Math.round(avg / NOTA_MAX * 100)) + '%"></div></div>';
      html += '<span class="bar-val">' + (avg !== null ? avg.toFixed(1) : '—') + '</span>';
      html += '<span class="bar-icon">' + icon + '</span>';
      html += '</div>';
    });
    html += '</div></div>';

    if (!db.students.length) {
      html += '<div class="card center"><p>😴 Aún no hay estudiantes registrados en este equipo.</p></div>';
    } else {
      html += '<div class="consol-scroll"><table class="consol-table">';
      html += '<thead><tr><th>Mérito</th><th>Estudiante</th><th>DNI</th><th>Sexo</th>';
      ALL.forEach(function (s) { html += '<th>S' + s.num + '</th>'; });
      html += '<th>Prom. Ses.</th><th>Casos</th><th>Prom. Final</th><th>Rendidas</th><th>Examen</th><th>Estado</th><th></th></tr></thead><tbody>';
      var lista = db.students.slice().sort(function (a, b) { return promFinal(b) - promFinal(a); });
      lista.forEach(function (st, i) {
        var pf = promFinal(st);
        var prom = promGeneral(st);
        var nc = st.casos && st.casos.best > 0 ? st.casos.best : null;
        var rank = i + 1;
        var medalla = rank === 1 ? ' 🥇' : (rank === 2 ? ' 🥈' : (rank === 3 ? ' 🥉' : ''));
        html += '<tr>';
        html += '<td class="td-note ' + (pf >= NOTA_MIN ? 'good' : (pf > 0 ? 'warn' : 'pend')) + '"><strong>' + rank + '</strong>' + medalla + '</td>';
        html += '<td class="consol-name">' + esc(st.name) + '</td>';
        html += '<td>' + esc(st.dni || '—') + '</td>';
        html += '<td>' + (st.sexo === 'M' ? 'M' : (st.sexo === 'F' ? 'F' : '—')) + '</td>';
        ALL.forEach(function (s) {
          var r = st.sessions[s.id];
          var nota = r && r.best > 0 ? noteOf(r.best) : null;
          var stCls = notaStatus(nota);
          html += '<td class="td-note ' + stCls + '">' + (nota !== null ? nota.toFixed(1) : '—') + '</td>';
        });
        html += '<td class="td-note ' + (prom >= NOTA_MIN ? 'good' : (prom > 0 ? 'warn' : 'pend')) + '">' + prom.toFixed(1) + '</td>';
        html += '<td class="td-note ' + (nc !== null ? (nc >= NOTA_MIN ? 'good' : 'warn') : 'pend') + '">' + (nc !== null ? nc.toFixed(1) : '—') + '</td>';
        html += '<td class="td-note ' + (pf >= NOTA_MIN ? 'good' : (pf > 0 ? 'warn' : 'pend')) + '"><strong>' + pf.toFixed(1) + '</strong></td>';
        html += '<td>' + completedOf(st) + '/' + ALL.length + '</td>';
        html += '<td class="td-note ' + (st.exam ? (st.exam.best >= NOTA_MIN ? 'good' : 'warn') : 'pend') + '">' + (st.exam ? st.exam.best.toFixed(1) : '—') + '</td>';
        html += '<td>' + (pf >= NOTA_MIN ? '✅ Aprobado' : (completedOf(st) > 0 ? '❌ Desaprobado' : '⏳ Pendiente')) + '</td>';
        html += '<td style="white-space:nowrap">';
        html += '<button class="icon-btn rev-student" data-id="' + esc(st.id) + '" title="Revisar detalle del estudiante">🔍</button>';
        html += '<button class="icon-btn clear-student" data-id="' + esc(st.id) + '" title="Eliminar resultados (conserva al estudiante)">♻️</button>';
        html += '<button class="icon-btn del-student" data-id="' + esc(st.id) + '" title="Eliminar estudiante">🗑️</button>';
        html += '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div>';
      html += '<p class="muted" style="font-size:12px;margin-top:8px">Leyenda: ✅ 14-20 · ⚠️ 10-13.9 · ⛔ 0-9.9 · — pendiente. Código docente actual: <strong>' + esc(db.teacherCode) + '</strong></p>';
    }
    $('#app').innerHTML = html;

    $('#btnPdfConsol').addEventListener('click', printConsolidado);
    $('#btnXlsxConsol').addEventListener('click', exportConsolidadoXLSX);
    $('#btnExportDB').addEventListener('click', exportDB);
    $('#btnImportDB').addEventListener('click', function () { $('#importDBFile').click(); });
    $('#btnImportXlsx').addEventListener('click', function () { $('#importXlsxFile').click(); });
    $('#importXlsxFile').addEventListener('change', function () {
      var files = this.files;
      if (!files || !files.length) { return; }
      for (var i = 0; i < files.length; i++) {
        (function (f) {
          var fr = new FileReader();
          fr.onload = function () { importStudentXLSXBytes(fr.result); };
          fr.readAsArrayBuffer(f);
        })(files[i]);
      }
      this.value = '';
    });
    $('#btnLogoutTeacher').addEventListener('click', teacherLogout);
    var sbC = $('#btnSyncCloud');
    if (sbC) { sbC.addEventListener('click', syncCloud); }
    $('#btnSaveCfg').addEventListener('click', function () {
      var rN = parseInt($('#cfgRetos').value, 10);
      var cN = parseInt($('#cfgCasos').value, 10);
      var eN = parseInt($('#cfgExamen').value, 10);
      if (isNaN(rN) || rN < 1 || rN > 10) { toast('Intentos por reto: número entre 1 y 10', 'bad'); return; }
      if (isNaN(cN) || cN < 1 || cN > 10) { toast('Intentos de casos: número entre 1 y 10', 'bad'); return; }
      if (isNaN(eN) || eN < 1 || eN > 10) { toast('Intentos del examen: número entre 1 y 10', 'bad'); return; }
      cfg().nivel = $('#cfgNivel').value;
      cfg().attemptsRetos = rN;
      cfg().attemptsCasos = cN;
      cfg().attemptsExamen = eN;
      save();
      toast('Configuración guardada ⚙️', 'good');
      viewConsolidado();
    });
    $('#importDBFile').addEventListener('change', function () {
      if (this.files && this.files[0]) { importDB(this.files[0]); this.value = ''; }
    });
    var dels = document.querySelectorAll('.del-student');
    for (var i = 0; i < dels.length; i++) {
      (function (b) {
        b.addEventListener('click', function () { removeStudent(b.getAttribute('data-id')); });
      })(dels[i]);
    }
    var revs = document.querySelectorAll('.rev-student');
    for (var rv = 0; rv < revs.length; rv++) {
      (function (b) {
        b.addEventListener('click', function () { reviewStudent(b.getAttribute('data-id')); });
      })(revs[rv]);
    }
    var clrs = document.querySelectorAll('.clear-student');
    for (var cl = 0; cl < clrs.length; cl++) {
      (function (b) {
        b.addEventListener('click', function () { clearStudentResults(b.getAttribute('data-id')); });
      })(clrs[cl]);
    }
  }

  function reviewStudent(id) {
    var st = db.students.filter(function (s) { return s.id === id; })[0];
    if (!st) return;
    var pf = promFinal(st);
    var html = '<h3>🔍 Revisión: ' + esc(st.name) + '</h3>';
    html += '<p class="muted" style="font-size:12.5px;margin:0 0 10px">DNI: ' + esc(st.dni || '—') + ' · Sexo: ' + (st.sexo === 'M' ? 'M' : (st.sexo === 'F' ? 'F' : '—')) + ' · XP: ' + st.xp + ' · Promedio final: <strong>' + pf.toFixed(1) + ' / 20</strong></p>';
    html += '<div class="consol-scroll" style="max-height:280px"><table class="consol-table" style="min-width:0"><thead><tr><th style="text-align:left">Sesión</th><th>Nota</th><th>Intentos</th><th>Resultado</th></tr></thead><tbody>';
    ALL.forEach(function (s) {
      var r = st.sessions[s.id];
      var nota = r && r.best > 0 ? noteOf(r.best) : null;
      html += '<tr><td class="consol-name">S' + s.num + ' — ' + esc(s.title) + '</td>';
      html += '<td class="td-note ' + notaStatus(nota) + '">' + (nota !== null ? nota.toFixed(1) : '—') + '</td>';
      html += '<td>' + (r ? r.attempts : 0) + '</td>';
      html += '<td>' + (nota === null ? 'Pendiente' : (nota >= NOTA_MIN ? '✅ Aprobado' : '❌ Desaprobado')) + '</td></tr>';
    });
    html += '</tbody></table></div>';
    html += '<div class="consol-scroll" style="max-height:140px;margin-top:10px"><table class="consol-table" style="min-width:0"><thead><tr><th style="text-align:left">Evaluación</th><th>Nota</th><th>Intentos</th><th>Resultado</th></tr></thead><tbody>';
    html += '<tr><td class="consol-name">🧩 Casos prácticos</td><td class="td-note ' + notaStatus(st.casos ? st.casos.best : null) + '">' + (st.casos ? st.casos.best.toFixed(1) : '—') + '</td><td>' + (st.casos ? st.casos.attempts : 0) + '</td><td>' + (st.casos ? (st.casos.best >= NOTA_MIN ? '✅ Aprobado' : '❌ Desaprobado') : 'Pendiente') + '</td></tr>';
    html += '<tr><td class="consol-name">🎓 Examen final</td><td class="td-note ' + notaStatus(st.exam ? st.exam.best : null) + '">' + (st.exam ? st.exam.best.toFixed(1) : '—') + '</td><td>' + (st.exam ? st.exam.attempts : 0) + '</td><td>' + (st.exam ? (st.exam.best >= NOTA_MIN ? '✅ Aprobado' : '❌ Desaprobado') : 'Pendiente') + '</td></tr>';
    html += '</tbody></table></div>';
    html += '<div class="modal-actions"><button class="btn btn-ghost" id="btnCloseReview">Cerrar</button></div>';
    openModal(html);
    $('#btnCloseReview').addEventListener('click', closeModal);
  }

  function clearStudentResults(id) {
    var st = db.students.filter(function (s) { return s.id === id; })[0];
    if (!st) return;
    openModal(
      '<h3>♻️ ¿Eliminar los resultados de este estudiante?</h3>' +
      '<p>Se borrarán las notas de las sesiones, casos, examen y XP de <strong>' + esc(st.name) + '</strong>, pero el estudiante seguirá registrado (nombre y DNI). Esta acción no se puede deshacer.</p>' +
      '<div class="modal-actions"><button class="btn btn-ghost" id="btnCancelClear">Cancelar</button><button class="btn btn-primary" id="btnConfirmClear" style="background:var(--bad)">Eliminar resultados</button></div>'
    );
    $('#btnCancelClear').addEventListener('click', closeModal);
    $('#btnConfirmClear').addEventListener('click', function () {
      st.sessions = {};
      st.exam = null;
      st.casos = null;
      st.xp = 0;
      if (st.draft) { delete st.draft; }
      if (db.currentId === id) { ST = st; }
      save();
      closeModal();
      toast('Resultados eliminados ♻️', 'good');
      viewConsolidado();
      updateHud();
    });
  }

  function teacherLogout() {
    teacherOk = false;
    try {
      sessionStorage.removeItem('cpd_teacher_ok');
      localStorage.removeItem('cpd_teacher_open');
    } catch (e) { /* ignorar */ }
    toast('Sesión de docente cerrada 🔒');
    location.hash = '#/inicio';
    route();
  }

  function removeStudent(id) {
    var st = db.students.filter(function (s) { return s.id === id; })[0];
    if (!st) return;
    openModal(
      '<h3>🗑️ Eliminar estudiante</h3>' +
      '<p>Se borrará todo el progreso de <strong>' + esc(st.name) + '</strong> en este dispositivo. Esta acción no se puede deshacer.</p>' +
      '<div class="modal-actions"><button class="btn btn-ghost" id="btnCancelDel">Cancelar</button><button class="btn btn-primary" id="btnConfirmDel" style="background:var(--bad)">Eliminar</button></div>'
    );
    $('#btnCancelDel').addEventListener('click', closeModal);
    $('#btnConfirmDel').addEventListener('click', function () {
      db.students = db.students.filter(function (s) { return s.id !== id; });
      if (db.currentId === id) { db.currentId = null; ST = null; }
      save();
      closeModal();
      toast('Estudiante eliminado', 'good');
      viewConsolidado();
      updateHud();
    });
  }

  function exportConsolidadoXLSX() {
    try {
      var n2 = db.students.length;
      var cols = [7, 22, 12, 7];
      for (var i = 0; i < ALL.length; i++) cols.push(7);
      cols = cols.concat([10, 8, 10, 8, 8, 14]);

      var header = ['Mérito', 'Estudiante', 'DNI', 'Sexo'];
      ALL.forEach(function (s) { header.push('S' + s.num); });
      header = header.concat(['Prom. Sesiones', 'Casos', 'Prom. Final', 'Rendidas', 'Examen', 'Estado']);

      var rows = [header];
      var listaX = db.students.slice().sort(function (a, b) { return promFinal(b) - promFinal(a); });
      listaX.forEach(function (st, i) {
        var rank = i + 1; var med = rank === 1 ? '1 - Oro' : (rank === 2 ? '2 - Plata' : (rank === 3 ? '3 - Bronce' : String(rank)));
        var prom = promGeneral(st);
        var nc = st.casos && st.casos.best > 0 ? st.casos.best : null;
        var pf = promFinal(st);
        var row = [med, st.name, st.dni || '—', st.sexo === 'M' ? 'M' : (st.sexo === 'F' ? 'F' : '—')];
        ALL.forEach(function (s) {
          var r = st.sessions[s.id];
          row.push(r && r.best > 0 ? noteOf(r.best) : null);
        });
        row.push(Math.round(prom * 10) / 10);
        row.push(nc !== null ? nc : null);
        row.push(Math.round(pf * 10) / 10);
        row.push(completedOf(st) + '/' + ALL.length);
        row.push(st.exam ? Math.round(st.exam.best * 10) / 10 : null);
        row.push(pf >= NOTA_MIN ? 'Aprobado' : (completedOf(st) > 0 ? 'Desaprobado' : 'Pendiente'));
        rows.push(row);
      });

      var ap2 = 0, des2 = 0, pend2 = 0, term2 = 0, hom2 = 0, muj2 = 0, sin2 = 0;
      db.students.forEach(function (st) {
        var pf2 = promFinal(st);
        var c2 = completedOf(st);
        if (c2 === ALL.length) term2++;
        if (c2 === 0) pend2++;
        else if (pf2 >= NOTA_MIN) ap2++;
        else des2++;
        if (st.sexo === 'M') hom2++;
        else if (st.sexo === 'F') muj2++;
        else sin2++;
      });
      function p2(x) { return n2 ? Math.round(x / n2 * 100) : 0; }
      var rS2 = 0, apS2 = 0, sumS2 = 0, rC2 = 0, apC2 = 0, sumC2 = 0, rE2 = 0, apE2 = 0, sumE2 = 0;
      db.students.forEach(function (st) {
        var prS = promGeneral(st);
        if (completedOf(st) > 0) { rS2++; sumS2 += prS; if (prS >= NOTA_MIN) apS2++; }
        if (st.casos && st.casos.best > 0) { rC2++; sumC2 += st.casos.best; if (st.casos.best >= NOTA_MIN) apC2++; }
        if (st.exam && st.exam.best > 0) { rE2++; sumE2 += st.exam.best; if (st.exam.best >= NOTA_MIN) apE2++; }
      });
      function av2(sum, cnt) { return cnt ? Math.round(sum / cnt * 10) / 10 : 0; }
      var rows2 = [
        ['Indicador', 'Cantidad', 'Porcentaje'],
        ['Aprobados (promedio final >= ' + NOTA_MIN + ')', ap2, p2(ap2) + '%'],
        ['Desaprobados', des2, p2(des2) + '%'],
        ['Pendientes (sin evaluaciones)', pend2, p2(pend2) + '%'],
        ['Terminados (16 sesiones rendidas)', term2, p2(term2) + '%'],
        ['Hombres', hom2, p2(hom2) + '%'],
        ['Mujeres', muj2, p2(muj2) + '%'],
        ['Sexo sin dato', sin2, p2(sin2) + '%'],
        ['Total de estudiantes', n2, '100%'],
        ['— Componentes —', '', ''],
        ['Sesiones: rendidos', rS2, ''],
        ['Sesiones: promedio', av2(sumS2, rS2), ''],
        ['Sesiones: aprobados', apS2, rS2 ? Math.round(apS2 / rS2 * 100) + '%' : '0%'],
        ['Casos: rendidos', rC2, ''],
        ['Casos: promedio', av2(sumC2, rC2), ''],
        ['Casos: aprobados', apC2, rC2 ? Math.round(apC2 / rC2 * 100) + '%' : '0%'],
        ['Examen: rendidos', rE2, ''],
        ['Examen: promedio', av2(sumE2, rE2), ''],
        ['Examen: aprobados', apE2, rE2 ? Math.round(apE2 / rE2 * 100) + '%' : '0%']
      ];

      var bytes = window.buildXLSX([
        { name: 'Consolidado', cols: cols, rows: rows },
        { name: 'Resumen', cols: [40, 12, 12], rows: rows2 }
      ]);
      var blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'consolidado_notas.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast('Consolidado XLSX exportado 📊', 'good');
    } catch (err) { reportError(err, 'la exportación XLSX'); }
  }

  function exportDB() {
    var blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'consolidado_cpd_' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('Base exportada 💾', 'good');
  }

  function importDB(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var d = JSON.parse(reader.result);
        if (!d || typeof d !== 'object' || !Array.isArray(d.students)) throw new Error('inválido');
        // fusionar conservando el mejor puntaje por sesión
        d.students.forEach(function (incoming) {
          var existing = null;
          for (var i = 0; i < db.students.length; i++) {
            if (norm(db.students[i].name) === norm(incoming.name)) { existing = db.students[i]; break; }
          }
          if (!existing) {
            existing = newStudent(incoming.name);
            existing.created = incoming.created || existing.created;
            existing.xp = incoming.xp || 0;
            existing.sessions = incoming.sessions || {};
            existing.exam = incoming.exam || null;
            db.students.push(existing);
          } else {
            incoming.sessions = incoming.sessions || {};
            for (var sid in incoming.sessions) {
              if (!incoming.sessions.hasOwnProperty(sid)) continue;
              var cur = existing.sessions[sid] || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
              cur.best = Math.max(cur.best || 0, incoming.sessions[sid].best || 0);
              cur.attempts = Math.max(cur.attempts || 0, incoming.sessions[sid].attempts || 0);
              cur.last = Math.max(cur.last || 0, incoming.sessions[sid].last || 0);
              cur.xpAwarded = Math.max(cur.xpAwarded || 0, incoming.sessions[sid].xpAwarded || 0);
              existing.sessions[sid] = cur;
            }
            if (incoming.exam) {
              existing.exam = existing.exam || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
              existing.exam.best = Math.max(existing.exam.best || 0, incoming.exam.best || 0);
              existing.exam.attempts = Math.max(existing.exam.attempts || 0, incoming.exam.attempts || 0);
            }
            existing.xp = Math.max(existing.xp || 0, incoming.xp || 0);
          }
        });
        save();
        viewConsolidado();
        toast('Base importada y fusionada 📥', 'good');
      } catch (e) {
        toast('El archivo no es una base válida', 'bad');
      }
    };
    reader.readAsText(file);
  }

  function syncCloud() {
    var u = cloudUrl();
    if (!u) { toast('La nube no está configurada (js/config.js)', 'bad'); return; }
    toast('☁️ Sincronizando con la nube…');
    try {
      fetch(u + (u.indexOf('?') >= 0 ? '&' : '?') + 'action=export')
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (!res || !res.ok || !res.filas) { toast('La nube no respondió correctamente', 'bad'); return; }
          var filas = res.filas;
          var nuevos = 0, actualizados = 0, totalReg = 0;
          for (var i = 1; i < filas.length; i++) {
            var f = filas[i];
            var name = String(f[1] || '').trim();
            var dni = String(f[2] || '').trim();
            var kind = String(f[3] || '');
            var sid = parseInt(f[4], 10) || 0;
            var pct = parseFloat(f[6]) || 0;
            var nota = parseFloat(f[5]) || 0;
            if (!name) { continue; }
            totalReg++;
            var st = null;
            for (var j = 0; j < db.students.length; j++) {
              if (dni && db.students[j].dni === dni) { st = db.students[j]; break; }
            }
            if (!st) {
              for (var k2 = 0; k2 < db.students.length; k2++) {
                if (norm(db.students[k2].name) === norm(name)) { st = db.students[k2]; break; }
              }
            }
            if (!st) {
              st = newStudent(name, dni || null, null);
              db.students.push(st);
              nuevos++;
            }
            if (kind === 'sesion' && sid > 0) {
              var rec = st.sessions[sid] || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
              rec.best = Math.max(rec.best || 0, pct);
              rec.attempts = Math.max(rec.attempts || 0, 1);
              rec.last = Math.max(rec.last || 0, pct);
              st.sessions[sid] = rec;
              actualizados++;
            } else if (kind === 'examen') {
              st.exam = st.exam || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
              st.exam.best = Math.max(st.exam.best || 0, nota);
              st.exam.attempts = Math.max(st.exam.attempts || 0, 1);
              actualizados++;
            } else if (kind === 'casos') {
              st.casos = st.casos || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
              st.casos.best = Math.max(st.casos.best || 0, nota);
              st.casos.attempts = Math.max(st.casos.attempts || 0, 1);
              actualizados++;
            }
          }
          save();
          toast('☁️ Nube sincronizada: ' + totalReg + ' registros · ' + nuevos + ' estudiantes nuevos', 'good');
          viewConsolidado();
        })
        .catch(function () { toast('No se pudo contactar la nube', 'bad'); });
    } catch (e) { toast('No se pudo contactar la nube', 'bad'); }
  }

  /* ---------------- Evidencias del estudiante (Excel + importación) ---------------- */
  function exportStudentXLSX() {
    try {
      var header = ['Estudiante', 'DNI', 'Sexo'];
      ALL.forEach(function (s) { header.push('S' + s.num); });
      header = header.concat(['Casos', 'Examen', 'Prom. Final']);
      var row = [ST.name, ST.dni || '', ST.sexo === 'M' ? 'M' : (ST.sexo === 'F' ? 'F' : '—')];
      ALL.forEach(function (s) {
        var r = ST.sessions[s.id];
        row.push(r && r.best > 0 ? noteOf(r.best) : null);
      });
      row.push(ST.casos ? ST.casos.best : null);
      row.push(ST.exam ? ST.exam.best : null);
      row.push(Math.round(promFinal(ST) * 10) / 10);

      var notas = [['Evaluación', 'Nota / 20', 'Intentos', 'Resultado']];
      ALL.forEach(function (s) {
        var r = ST.sessions[s.id];
        var n = r && r.best > 0 ? noteOf(r.best) : null;
        notas.push(['S' + s.num + ' — ' + s.title, n !== null ? n : null, r ? r.attempts : 0, n === null ? 'Pendiente' : (n >= NOTA_MIN ? 'Aprobado' : 'Desaprobado')]);
      });
      notas.push(['🧩 Casos prácticos', ST.casos ? ST.casos.best : null, ST.casos ? ST.casos.attempts : 0, ST.casos ? (ST.casos.best >= NOTA_MIN ? 'Aprobado' : 'Desaprobado') : 'Pendiente']);
      notas.push(['🎓 Examen final', ST.exam ? ST.exam.best : null, ST.exam ? ST.exam.attempts : 0, ST.exam ? (ST.exam.best >= NOTA_MIN ? 'Aprobado' : 'Desaprobado') : 'Pendiente']);
      notas.push(['📊 PROMEDIO FINAL', Math.round(promFinal(ST) * 10) / 10, '', promFinal(ST) >= NOTA_MIN ? 'Aprobado' : 'Desaprobado']);

      var bytes = window.buildXLSX([
        { name: 'Notas', cols: [60, 12, 10, 14], rows: notas },
        { name: 'Consolidado', cols: [22, 12, 7], rows: [header, row] }
      ]);
      var blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'Notas_' + norm(ST.name).replace(/[^a-z0-9]+/g, '_') + '.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast('Excel de notas descargado 📊', 'good');
    } catch (err) { reportError(err, 'el Excel del estudiante'); }
  }

  function importStudentXLSXBytes(buffer) {
    try {
      var data = window.readXLSX(buffer);
      if (!data || !data.sheets || !data.sheets.length) { toast('El archivo no es un Excel válido', 'bad'); return; }
      var hoja = null;
      for (var i = 0; i < data.sheets.length; i++) {
        if (data.sheets[i].name && data.sheets[i].name.indexOf('Consolidado') >= 0) { hoja = data.sheets[i]; break; }
      }
      if (!hoja) { toast('El Excel no tiene la hoja «Consolidado»', 'bad'); return; }
      var rows = hoja.rows;
      if (!rows || rows.length < 2) { toast('El Excel está vacío', 'bad'); return; }
      var hdr = rows[0];
      var col = {};
      for (var c = 0; c < hdr.length; c++) { col[String(hdr[c] === null ? '' : hdr[c]).trim()] = c; }
      var cNombre = col['Estudiante'], cDni = col['DNI'], cCasos = col['Casos'], cExamen = col['Examen'];
      var nuevos = 0, notasImp = 0;
      for (var r = 1; r < rows.length; r++) {
        var row = rows[r];
        var name = cNombre !== undefined && row[cNombre] !== null ? String(row[cNombre]).trim() : '';
        if (!name) { continue; }
        var dni = cDni !== undefined && row[cDni] !== null ? String(row[cDni]).trim() : '';
        var st = null;
        for (var j = 0; j < db.students.length; j++) {
          if (dni && db.students[j].dni === dni) { st = db.students[j]; break; }
        }
        if (!st) {
          for (var k2 = 0; k2 < db.students.length; k2++) {
            if (norm(db.students[k2].name) === norm(name)) { st = db.students[k2]; break; }
          }
        }
        if (!st) {
          st = newStudent(name, dni || null, null);
          db.students.push(st);
          nuevos++;
        }
        for (var sIdx = 0; sIdx < ALL.length; sIdx++) {
          var colIdx = col['S' + ALL[sIdx].num];
          if (colIdx === undefined) { continue; }
          var v = parseFloat(row[colIdx]);
          if (isNaN(v) || v <= 0) { continue; }
          var pct = Math.round(v * 5);
          var rec = st.sessions[ALL[sIdx].id] || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
          rec.best = Math.max(rec.best || 0, pct);
          rec.attempts = Math.max(rec.attempts || 0, 1);
          rec.last = Math.max(rec.last || 0, pct);
          st.sessions[ALL[sIdx].id] = rec;
          notasImp++;
        }
        if (cCasos !== undefined) {
          var vc = parseFloat(row[cCasos]);
          if (!isNaN(vc) && vc > 0) {
            st.casos = st.casos || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
            st.casos.best = Math.max(st.casos.best || 0, vc);
            st.casos.attempts = Math.max(st.casos.attempts || 0, 1);
          }
        }
        if (cExamen !== undefined) {
          var ve = parseFloat(row[cExamen]);
          if (!isNaN(ve) && ve > 0) {
            st.exam = st.exam || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
            st.exam.best = Math.max(st.exam.best || 0, ve);
            st.exam.attempts = Math.max(st.exam.attempts || 0, 1);
          }
        }
      }
      save();
      toast('Excel importado: ' + nuevos + ' estudiantes nuevos · ' + notasImp + ' notas consolidadas', 'good');
      viewConsolidado();
    } catch (err) { reportError(err, 'la importación de Excel'); }
  }

  /* ============================================================
     PDF (impresión del navegador)
     ============================================================ */
  function reportShell(title, subtitle) {
    return '<div class="print-report">' +
      '<h1>🖥️ Centro de Cómputo — Reporte de Evaluación</h1>' +
      '<h2>' + title + '</h2>' +
      '<div class="print-meta">' +
      '<p><strong>Unidad Didáctica:</strong> ' + esc(APP_TITLE) + '</p>' +
      '<p><strong>Módulo Formativo:</strong> ' + esc(MODULE) + '</p>' +
      '<p><strong>Estudiante:</strong> ' + esc(ST.name) + '</p>' +
      '<p><strong>Fecha de emisión:</strong> ' + new Date().toLocaleDateString('es-PE') + '</p>' +
      (subtitle ? '<p>' + subtitle + '</p>' : '') +
      '</div>';
  }

  function printSessionReport(s, pct) {
    var rec = recSesion(s.id);
    var nota = noteOf(pct);
    var hasDetail = quiz && quiz.sid === s.id && quiz.pts.length === quiz.qs.length;
    var html = reportShell('Sesión ' + s.num + ': ' + esc(s.title), '<strong>Docente:</strong> ' + esc(DOCENTE));
    html += '<p class="print-summary">Nota obtenida: ' + nota.toFixed(1) + ' / 20 · ' + (nota >= NOTA_MIN ? '✅ APROBADO' : '❌ DESAPROBADO') +
      ' · Mejor nota: ' + noteOf(rec.best).toFixed(1) + ' · Medalla: ' + (medalForNote(noteOf(rec.best)) || '—') + ' · XP acumulada: ' + ST.xp + '</p>';
    if (hasDetail) {
      html += '<table class="print-table"><thead><tr><th>N.°</th><th>Tipo</th><th>Pregunta</th><th>Tu respuesta</th><th>Respuesta correcta</th><th>Resultado</th></tr></thead><tbody>';
      for (var i = 0; i < quiz.qs.length; i++) {
        var q = quiz.qs[i];
        var ok = quiz.full[i];
        var partial = !ok && quiz.pts[i] > 0;
        html += '<tr><td>' + (i + 1) + '</td><td>' + TYPE_LABEL[q.type] + '</td><td>' + esc(q.q) + '</td>';
        html += '<td>' + (quiz.timedOut[i] ? '⏱ Sin responder' : esc(userAnswerText(q, quiz.ans[i]))) + '</td>';
        html += '<td>' + esc(correctAnswerText(q)) + '</td>';
        html += '<td class="' + (ok ? 'print-ok' : 'print-no') + '">' + (ok ? 'Correcto' : (partial ? 'Parcial' : 'Incorrecto')) + '</td></tr>';
      }
      html += '</tbody></table>';
    } else {
      html += '<p style="text-align:center;font-style:italic">El detalle de respuestas se genera al completar un intento en esta sesión.</p>';
    }
    html += '<p class="print-foot">Reporte generado desde la plataforma interactiva CPD · ' + esc(DOCENTE) + '</p>';
    $('#printArea').innerHTML = html;
    window.print();
  }

  function printExamReport() {
    var r = ST.exam;
    if (!r) return;
    var html = reportShell('Acta — Examen Final', '<strong>Docente:</strong> ' + esc(DOCENTE));
    html += '<p class="print-summary">Nota obtenida: ' + r.best.toFixed(1) + ' / 20 · ' + (r.best >= NOTA_MIN ? '✅ APROBADO' : '❌ DESAPROBADO') + ' · Intentos: ' + r.attempts + '</p>';
    html += '<p class="print-foot">Reporte generado desde la plataforma interactiva CPD · ' + esc(DOCENTE) + '</p>';
    $('#printArea').innerHTML = html;
    window.print();
  }

  function printCasosReport() {
    var r = ST.casos;
    if (!r) { toast('Aún no resuelves los casos prácticos', 'bad'); return; }
    var html = reportShell('Acta — Casos prácticos', '<strong>Docente:</strong> ' + esc(DOCENTE));
    html += '<p class="print-summary">Nota obtenida: ' + r.best.toFixed(1) + ' / 20 · ' + (r.best >= NOTA_MIN ? '✅ APROBADO' : '❌ DESAPROBADO') + ' · Intentos: ' + r.attempts + '</p>';
    html += '<p class="print-foot">Reporte generado desde la plataforma interactiva CPD · ' + esc(DOCENTE) + '</p>';
    $('#printArea').innerHTML = html;
    window.print();
  }

  function printStudentReport() {
    var prom = promGeneral(ST);
    var finP = promFinal(ST);
    var html = reportShell('Consolidado personal — ' + esc(ST.name), '<strong>Docente:</strong> ' + esc(DOCENTE) + ' · <strong>DNI:</strong> ' + esc(ST.dni || '—'));
    html += '<p class="print-summary">Promedio de sesiones: ' + prom.toFixed(1) + ' / 20 · Casos prácticos: ' + (ST.casos ? ST.casos.best.toFixed(1) + ' / 20' : '—') +
      ' · <strong>PROMEDIO FINAL: ' + finP.toFixed(1) + ' / 20 (' + (finP >= NOTA_MIN ? '✅ APROBADO' : '❌ DESAPROBADO') + ')</strong>' +
      ' · Examen final: ' + (ST.exam ? ST.exam.best.toFixed(1) + ' / 20' : '—') + ' · XP: ' + ST.xp + '</p>';
    html += '<table class="print-table"><thead><tr><th>Sesión</th><th>Tema</th><th>Mejor nota</th><th>Intentos</th><th>Resultado</th></tr></thead><tbody>';
    ALL.forEach(function (s) {
      var r = recSesion(s.id);
      var nota = r.best > 0 ? noteOf(r.best) : null;
      html += '<tr><td>S' + s.num + '</td><td>' + esc(s.title) + '</td><td>' + (nota !== null ? nota.toFixed(1) : '—') + '</td><td>' + (r.attempts || 0) + '</td>';
      html += '<td class="' + (nota !== null && nota >= NOTA_MIN ? 'print-ok' : (nota !== null ? 'print-no' : '')) + '">' +
        (nota === null ? 'Pendiente' : (nota >= NOTA_MIN ? 'Aprobado' : 'Desaprobado')) + '</td></tr>';
    });
    html += '</tbody></table>';
    html += '<p class="print-foot">Reporte generado desde la plataforma interactiva CPD · ' + esc(DOCENTE) + '</p>';
    $('#printArea').innerHTML = html;
    window.print();
  }

  function printConsolidado() {
    var html = '<div class="print-report">';
    html += '<h1>🖥️ Centro de Cómputo — Consolidado de Notas</h1>';
    html += '<h2>' + esc(APP_TITLE) + '</h2>';
    html += '<div class="print-meta">';
    html += '<p><strong>Docente:</strong> ' + esc(DOCENTE) + '</p>';
    html += '<p><strong>Fecha de emisión:</strong> ' + new Date().toLocaleDateString('es-PE') + '</p>';
    html += '<p><strong>Escala:</strong> notas de 00 a 20 · Nota mínima aprobatoria: ' + NOTA_MIN + ' · Promedio de las ' + ALL.length + ' sesiones</p>';
    html += '</div>';
    var nS = db.students.length, apS = 0, desS = 0, pendS = 0, termS = 0, homS = 0, mujS = 0, sumS = 0;
    db.students.forEach(function (st) {
      var pfS = promFinal(st);
      sumS += pfS;
      var c = completedOf(st);
      if (c === ALL.length) { termS++; }
      if (c === 0) { pendS++; }
      else if (pfS >= NOTA_MIN) { apS++; }
      else { desS++; }
      if (st.sexo === 'M') { homS++; }
      else if (st.sexo === 'F') { mujS++; }
    });
    function pS(x) { return nS ? Math.round(x / nS * 100) : 0; }
    html += '<p class="print-summary">Estudiantes: ' + nS + ' · Promedio final del curso: ' + (nS ? (Math.round(sumS / nS * 10) / 10).toFixed(1) : '0.0') + ' / 20</p>';
    html += '<p class="print-summary">Aprobados: ' + apS + ' (' + pS(apS) + '%) · Desaprobados: ' + desS + ' (' + pS(desS) + '%) · Pendientes: ' + pendS + ' (' + pS(pendS) + '%) · Terminados: ' + termS + ' (' + pS(termS) + '%) · Hombres: ' + homS + ' (' + pS(homS) + '%) · Mujeres: ' + mujS + ' (' + pS(mujS) + '%)</p>';
    html += '<table class="print-table print-wide"><thead><tr><th>Mérito</th><th>Estudiante</th><th>DNI</th>';
    ALL.forEach(function (s) { html += '<th>S' + s.num + '</th>'; });
    html += '<th>Casos</th><th>Prom. Final</th><th>Examen</th><th>Estado</th></tr></thead><tbody>';
    var listaP = db.students.slice().sort(function (a, b) { return promFinal(b) - promFinal(a); });
    listaP.forEach(function (st, i) {
      var pf = promFinal(st);
      var nc = st.casos && st.casos.best > 0 ? st.casos.best : null;
      html += '<tr><td>' + (i + 1) + (i === 0 ? ' 🥇' : (i === 1 ? ' 🥈' : (i === 2 ? ' 🥉' : ''))) + '</td><td>' + esc(st.name) + '</td><td>' + esc(st.dni || '—') + '</td>';
      ALL.forEach(function (s) {
        var r = st.sessions[s.id];
        var nota = r && r.best > 0 ? noteOf(r.best) : null;
        html += '<td>' + (nota !== null ? nota.toFixed(1) : '—') + '</td>';
      });
      html += '<td>' + (nc !== null ? nc.toFixed(1) : '—') + '</td>';
      html += '<td><strong>' + pf.toFixed(1) + '</strong></td>';
      html += '<td>' + (st.exam ? st.exam.best.toFixed(1) : '—') + '</td>';
      html += '<td class="' + (pf >= NOTA_MIN ? 'print-ok' : (completedOf(st) > 0 ? 'print-no' : '')) + '">' + (pf >= NOTA_MIN ? 'Aprobado' : (completedOf(st) > 0 ? 'Desaprobado' : 'Pendiente')) + '</td></tr>';
    });
    html += '</tbody></table>';
    html += '<p class="print-foot">Consolidado generado desde la plataforma interactiva CPD · ' + esc(DOCENTE) + '</p>';
    html += '</div>';
    $('#printArea').innerHTML = html;
    window.print();
  }

  /* ============================================================
     Perfil / datos / tema
     ============================================================ */
  function openProfile() {
    openModal(
      '<h3>👤 Editar nombre</h3>' +
      '<p>Este nombre identifica tus reportes PDF y tu registro en el consolidado docente.</p>' +
      '<input type="text" id="nameInput" class="fill-input" maxlength="60" placeholder="Apellidos y nombres" value="' + esc(ST.name) + '">' +
      '<div class="modal-actions"><button class="btn btn-ghost" id="btnCancelName">Cancelar</button><button class="btn btn-primary" id="btnSaveName">Guardar</button></div>'
    );
    $('#btnSaveName').addEventListener('click', function () {
      var v = $('#nameInput').value.trim();
      if (v) { ST.name = v; save(); updateHud(); closeModal(); toast('Nombre guardado ✓', 'good'); route(); }
    });
    $('#btnCancelName').addEventListener('click', closeModal);
  }

  function exportProgress() {
    var data = { tipo: 'progreso-estudiante', name: ST.name, profile: ST };
    var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'progreso_cpd_' + norm(ST.name).replace(/[^a-z0-9]+/g, '_') + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('Progreso exportado 💾', 'good');
  }

  function importProgress(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var d = JSON.parse(reader.result);
        if (!d || !d.profile || typeof d.profile !== 'object') throw new Error('inválido');
        var p = d.profile;
        ST.name = p.name || ST.name;
        ST.xp = Math.max(ST.xp || 0, p.xp || 0);
        p.sessions = p.sessions || {};
        for (var sid in p.sessions) {
          if (!p.sessions.hasOwnProperty(sid)) continue;
          var cur = ST.sessions[sid] || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
          cur.best = Math.max(cur.best || 0, p.sessions[sid].best || 0);
          cur.attempts = Math.max(cur.attempts || 0, p.sessions[sid].attempts || 0);
          cur.last = Math.max(cur.last || 0, p.sessions[sid].last || 0);
          cur.xpAwarded = Math.max(cur.xpAwarded || 0, p.sessions[sid].xpAwarded || 0);
          ST.sessions[sid] = cur;
        }
        if (p.exam) {
          ST.exam = ST.exam || { best: 0, attempts: 0, last: 0, xpAwarded: 0 };
          ST.exam.best = Math.max(ST.exam.best || 0, p.exam.best || 0);
          ST.exam.attempts = Math.max(ST.exam.attempts || 0, p.exam.attempts || 0);
        }
        save();
        updateHud();
        route();
        toast('Progreso importado 📥', 'good');
      } catch (e) {
        toast('El archivo no es un progreso válido', 'bad');
      }
    };
    reader.readAsText(file);
  }

  function resetProgress() {
    openModal(
      '<h3>🗑️ ¿Reiniciar tu progreso?</h3>' +
      '<p>Se borrarán tus puntajes, notas, XP y medallas en este dispositivo. Esta acción no se puede deshacer.</p>' +
      '<div class="modal-actions"><button class="btn btn-ghost" id="btnCancelReset">Cancelar</button><button class="btn btn-primary" id="btnConfirmReset" style="background:var(--bad)">Sí, reiniciar</button></div>'
    );
    $('#btnCancelReset').addEventListener('click', closeModal);
    $('#btnConfirmReset').addEventListener('click', function () {
      ST.xp = 0;
      ST.sessions = {};
      ST.exam = null;
      save();
      closeModal();
      route();
      toast('Progreso reiniciado', 'good');
    });
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', db.theme === 'dark' ? 'dark' : 'light');
  }

  /* ============================================================
     Inicialización
     ============================================================ */
  function init() {
    load();
    applyTheme();

    var tabs = document.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
      (function (t) {
        t.addEventListener('click', function () { location.hash = '#/' + t.getAttribute('data-view'); });
      })(tabs[i]);
    }

    $('#themeBtn').addEventListener('click', function () {
      db.theme = db.theme === 'dark' ? 'light' : 'dark';
      save();
      applyTheme();
    });

    $('#btnLogout').addEventListener('click', function () { if (ST) doLogout(); });

    // acceso docente oculto: Ctrl + Shift + D (o URL #/consolidado)
    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        askTeacherCode();
      }
    });

    // formalidad de la evaluación: sin copiar/pegar ni menú contextual durante los quizzes
    document.addEventListener('copy', function (e) {
      if (quiz && quiz.pts.length < quiz.qs.length) {
        e.preventDefault();
        toast('📵 Copiar está deshabilitado durante la evaluación', 'bad');
      }
    });
    document.addEventListener('contextmenu', function (e) {
      if (quiz && quiz.pts.length < quiz.qs.length) e.preventDefault();
    });

    window.addEventListener('hashchange', route);
    route();
  }

  try {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } catch (err) { reportError(err, 'el arranque'); }

  // acceso de diagnóstico (pruebas automáticas)
  window.__cpd = {
    route: route,
    getQuiz: function () { return quiz; },
    doCheck: doCheck,
    renderQuiz: renderQuiz,
    finishQuiz: finishQuiz,
    startExam: startExam,
    renderExamQuiz: renderExamQuiz,
    finishExam: finishExam,
    startCasos: startCasos,
    renderCasosQuiz: renderCasosQuiz,
    finishCasos: finishCasos,
    getDb: function () { return db; },
    getSt: function () { return ST; },
    reviewStudent: reviewStudent,
    clearStudentResults: clearStudentResults,
    setConfig: function (c) { db.config = c; save(); },
    importStudentXLSXBytes: importStudentXLSXBytes
  };
})();
