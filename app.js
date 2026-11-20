(function () {
  'use strict';

  const S = window.SLIDES;
  const $ = (id) => document.getElementById(id);
  const stage = $('stage'), textside = $('textside'), labelText = $('labelText'),
    body = $('body'), content = $('content'), sceneEl = $('scene'), count = $('count'), hint = $('hint');

  let index = 0, currentScene = null, token = 0;
  const wrap = $('sceneWrap');

  // Live WebGL background + figures on top; the painted version if the browser has no WebGL.
  function renderScene(key) {
    const r = window.REAL.get(key);
    if (window.GL && window.GL.ok && window.GL.use(r.shader, r.scale)) {
      wrap.classList.remove('flat');
      sceneEl.innerHTML = r.overlay;
    } else {
      wrap.classList.add('flat');
      sceneEl.innerHTML = window.PAINTED.render(key);
    }
  }

  // 1..99 in Ge'ez numerals, for the slide counter.
  function geez(n) {
    const ones = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
    const tens = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];
    return n >= 100 ? String(n) : tens[Math.floor(n / 10)] + ones[n % 10];
  }

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function fmt(s) {
    return esc(s)
      .replace(/(ሚካኤል|እግዚአብሔር|እግዚኦ|ሥላሴ|ገብርኤል)/g, '<span class="holy">$1</span>')
      .replace(/([፡፤።])/g, '<span class="punc">$1</span>')
      .replace(/\/([፩-፼]+)\//g, '⁠<span class="rep">$1</span>');
  }

  function renderText(sl) {
    stage.classList.toggle('is-title', sl.kind === 'title');
    labelText.textContent = sl.label || '';
    content.className = sl.kind;
    if (sl.kind === 'title') {
      content.innerHTML = sl.lines.map((l, i) =>
        `<div class="t${i + 1}">${esc(l)}</div>` + (i === 0 && sl.lines.length > 1 ? '<div class="rule"></div>' : '')).join('');
    } else if (sl.kind === 'wereb') {
      content.innerHTML = sl.lines.map((l) => `<p class="line">${fmt(l)}</p>`).join('');
    } else {
      content.innerHTML = `<p>${fmt(sl.text)}</p>`;
    }
    fit(sl.kind);
  }

  // Make the words as large as the space allows.
  function fit(kind) {
    // Sung lines read best unbroken: keep each on one line unless that makes it too small.
    content.classList.remove('nowrap');
    if (kind === 'wereb') {
      content.classList.add('nowrap');
      if (fitSize(kind) >= 62) return;
      content.classList.remove('nowrap');
    }
    fitSize(kind);
  }

  function fitSize(kind) {
    let lo = 30, hi = kind === 'title' ? 190 : kind === 'wereb' ? 112 : 96;
    const ok = () => content.scrollHeight <= body.clientHeight && content.scrollWidth <= body.clientWidth;
    content.style.fontSize = hi + 'px';
    if (ok()) return hi;
    for (let k = 0; k < 9; k++) {
      const mid = (lo + hi) / 2;
      content.style.fontSize = mid + 'px';
      if (ok()) lo = mid; else hi = mid;
    }
    content.style.fontSize = Math.floor(lo) + 'px';
    return Math.floor(lo);
  }

  function show(n, instant) {
    index = Math.max(0, Math.min(S.length - 1, n));
    const sl = S[index], my = ++token;
    count.textContent = `${geez(index + 1)} / ${geez(S.length)}`;
    try { history.replaceState(null, '', '#' + (index + 1)); } catch (e) { /* file:// in some browsers */ }

    if (instant) {
      renderText(sl);
    } else {
      textside.classList.add('out');
      setTimeout(() => { if (my !== token) return; renderText(sl); textside.classList.remove('out'); }, 220);
    }

    if (sl.scene !== currentScene) {
      currentScene = sl.scene;
      if (instant) {
        renderScene(sl.scene);
      } else {
        wrap.classList.add('out');
        setTimeout(() => { if (my !== token) return; renderScene(S[index].scene); wrap.classList.remove('out'); }, 350);
      }
    } else {
      wrap.classList.remove('out');
    }

    // Compile the next scene ahead of time so the change is smooth.
    const nx = S[index + 1];
    if (nx && nx.scene !== sl.scene && window.GL && window.GL.ok) {
      setTimeout(() => window.GL.prepare(window.REAL.get(nx.scene).shader), 900);
    }
  }

  const next = () => show(index + 1);
  const prev = () => show(index - 1);

  function scale() {
    const k = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = `translate(-50%, -50%) scale(${k})`;
  }

  function fullscreen() {
    const el = document.documentElement;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  }

  window.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter': e.preventDefault(); next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': e.preventDefault(); prev(); break;
      case 'Home': show(0); break;
      case 'End': show(S.length - 1); break;
      case 'f': case 'F': fullscreen(); break;
    }
    hint.classList.add('gone');
  });

  // Click or tap: right two-thirds goes forward, left third goes back.
  let touchX = null;
  window.addEventListener('click', (e) => { (e.clientX < window.innerWidth / 3 ? prev : next)(); hint.classList.add('gone'); });
  window.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) { e.preventDefault(); (dx < 0 ? next : prev)(); }
  });

  let idle;
  window.addEventListener('mousemove', () => {
    document.body.classList.remove('idle');
    clearTimeout(idle);
    idle = setTimeout(() => document.body.classList.add('idle'), 2500);
  });

  window.addEventListener('resize', scale);
  window.addEventListener('hashchange', () => {
    const n = parseInt(location.hash.slice(1), 10);
    if (n && n - 1 !== index) show(n - 1, true);
  });

  scale();
  show((parseInt(location.hash.slice(1), 10) || 1) - 1, true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fit(S[index].kind));
  setTimeout(() => hint.classList.add('gone'), 7000);
})();
