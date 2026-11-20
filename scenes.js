// Each scene = a live WebGL background (shaders.js) + an SVG layer on top for figures.
// Michael appears as a figure of light; the faithful are backlit silhouettes in netela and gabi.
(function () {
  'use strict';

  const SH = window.SHADERS;
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const R = (a, b) => +(a + rnd() * (b - a)).toFixed(1);
  const f1 = (n) => n.toFixed(1);
  const EASE = 'calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"';
  const FONT = `font-family="'Noto Serif Ethiopic','Abyssinica SIL','Kefa',serif" font-weight="800"`;

  const DEFS = `<defs>
    <radialGradient id="rGlow"><stop offset="0" stop-color="#fffbe8" stop-opacity=".95"/><stop offset=".35" stop-color="#ffe7a6" stop-opacity=".5"/><stop offset="1" stop-color="#ffc861" stop-opacity="0"/></radialGradient>
    <radialGradient id="rHalo"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#fff2c2" stop-opacity=".9"/><stop offset=".75" stop-color="#ffcf6b" stop-opacity=".4"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
    <radialGradient id="rWarm"><stop offset="0" stop-color="#ffd27f" stop-opacity=".6"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
    <radialGradient id="rFlake"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#fffdf5" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="rFace" cx=".45" cy=".4"><stop offset="0" stop-color="#ffe6c6"/><stop offset="1" stop-color="#d99a64"/></radialGradient>
    <radialGradient id="rFlame" cx=".5" cy=".72" r=".62"><stop offset="0" stop-color="#ffffff"/><stop offset=".3" stop-color="#fff3b0"/><stop offset=".62" stop-color="#ffb347" stop-opacity=".9"/><stop offset="1" stop-color="#ff6a00" stop-opacity="0"/></radialGradient>
    <linearGradient id="lRobe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0" stop-opacity=".97"/><stop offset=".45" stop-color="#ffe6ad" stop-opacity=".92"/><stop offset=".8" stop-color="#f4a865" stop-opacity=".7"/><stop offset="1" stop-color="#e0703f" stop-opacity="0"/></linearGradient>
    <linearGradient id="lMantle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0d6" stop-opacity=".9"/><stop offset=".5" stop-color="#f2905f" stop-opacity=".75"/><stop offset="1" stop-color="#c0392b" stop-opacity="0"/></linearGradient>
    <linearGradient id="lSleeve" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff8e8"/><stop offset="1" stop-color="#ffd596" stop-opacity=".85"/></linearGradient>
    <linearGradient id="lFeather" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fffaf0" stop-opacity=".97"/><stop offset=".5" stop-color="#ffe2a0" stop-opacity=".92"/><stop offset=".85" stop-color="#f0b45a" stop-opacity=".7"/><stop offset="1" stop-color="#d98a3a" stop-opacity=".25"/></linearGradient>
    <linearGradient id="lFeather2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#fff2cc" stop-opacity=".9"/><stop offset="1" stop-color="#ffd27a" stop-opacity=".35"/></linearGradient>
    <linearGradient id="lBlade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d6ebff"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#bcd8ff"/></linearGradient>
    <linearGradient id="lGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a4f0e"/><stop offset=".22" stop-color="#f3cf6a"/><stop offset=".42" stop-color="#fff3c4"/><stop offset=".6" stop-color="#d6a032"/><stop offset=".82" stop-color="#7f520f"/><stop offset="1" stop-color="#e8bd52"/></linearGradient>
    <linearGradient id="lGoldV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff0b8"/><stop offset=".35" stop-color="#e2ae3e"/><stop offset=".7" stop-color="#8a5a12"/><stop offset="1" stop-color="#d9a640"/></linearGradient>
    <linearGradient id="lLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6d77e"/><stop offset=".5" stop-color="#d9a63c"/><stop offset="1" stop-color="#f1c75a"/></linearGradient>
    <linearGradient id="lVelvet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a3241c"/><stop offset="1" stop-color="#3e0806"/></linearGradient>
    <linearGradient id="lWax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9a582"/><stop offset=".4" stop-color="#fff6e2"/><stop offset="1" stop-color="#9c8a6a"/></linearGradient>
    <linearGradient id="lRock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b08560"/><stop offset=".45" stop-color="#6a4a33"/><stop offset="1" stop-color="#22170f"/></linearGradient>
    <linearGradient id="lPool" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe3ff"/><stop offset="1" stop-color="#2f74c0"/></linearGradient>
    <linearGradient id="lShroud" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset=".6" stop-color="#e3d6bd"/><stop offset="1" stop-color="#8c7a60"/></linearGradient>
    <filter id="fGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="fText" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="fSmoke" x="-60%" y="-60%" width="220%" height="220%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="3" seed="4"><animate attributeName="baseFrequency" values=".03;.042;.03" dur="7s" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="20" xChannelSelector="R" yChannelSelector="G"/><feGaussianBlur stdDeviation="3.5"/></filter>
  </defs>`;

  const svg = (inner, extra = '') =>
    `<svg viewBox="0 0 600 850" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${DEFS}${extra}${inner}</svg>`;

  /* ---------- Michael, as light ---------- */

  const FEATHERS = (() => {
    let s = '';
    const f = (x, y, a, L, w, fill, op) => {
      const tr = `translate(${f1(x)},${f1(y)}) rotate(${f1(a)})`;
      return `<path transform="${tr}" d="M0,0 C${f1(L * .25)},${f1(-w)} ${f1(L * .75)},${f1(-w * .9)} ${f1(L)},${f1(-w * .1)} C${f1(L * .8)},${f1(w * .5)} ${f1(L * .3)},${f1(w * .8)} 0,0 Z" fill="url(#${fill})" stroke="#c98a2e" stroke-opacity=".55" stroke-width="1.1" opacity="${op.toFixed(2)}"/>` +
        `<path transform="${tr}" d="M2,0 Q${f1(L * .5)},${f1(-w * .2)} ${f1(L * .96)},${f1(-w * .12)}" fill="none" stroke="#fffdf4" stroke-opacity=".55" stroke-width="1.3"/>`;
    };
    const NP = 14, NC = 11, NS = 7;
    for (let i = NP - 1; i >= 0; i--) { const t = i / (NP - 1); s += f(20 + 46 * t, 4 + 30 * t, -84 + 104 * t, 270 - 150 * t, 15 - 4 * t, 'lFeather', .5 + .4 * (1 - t)); }
    for (let i = NC - 1; i >= 0; i--) { const t = i / (NC - 1); s += f(8 + 26 * t, 20 * t, -74 + 92 * t, 150 - 60 * t, 14, 'lFeather2', .78); }
    for (let i = NS - 1; i >= 0; i--) { const t = i / (NS - 1); s += f(4 + 12 * t, -2 + 12 * t, -60 + 80 * t, 78 - 20 * t, 12, 'lFeather2', .9); }
    return s;
  })();

  function lightAngel(o = {}) {
    const { x = 300, y = 400, s = 1, arms = 'sword', wings = 'flap', ws = 1, bob = true, kneel = false, aura = 1, op = 1, shine = false } = o;
    let wAnim = '', wInit = '';
    if (wings === 'flap') {
      wAnim = `<animateTransform attributeName="transform" type="rotate" values="0;-7;0" dur="4s" repeatCount="indefinite" ${EASE}/>`;
    } else if (wings === 'spread') {
      wInit = ' transform="rotate(64)"';
      wAnim = `<animateTransform attributeName="transform" type="rotate" values="64;-6" dur="4s" begin="0.5s" fill="freeze" calcMode="spline" keySplines=".3 0 .2 1"/>` +
        `<animateTransform attributeName="transform" type="rotate" values="-6;-12;-6" dur="5s" begin="4.5s" repeatCount="indefinite" ${EASE}/>`;
    }
    const wing = side => `<g transform="translate(${side * 18},-78) scale(${side * ws},${ws})"><g${wInit}>${FEATHERS}${wAnim}</g></g>`;
    const robeD = kneel
      ? 'M-38,-84 Q0,-98 38,-84 Q50,0 56,58 Q100,70 134,92 Q140,116 112,122 L-58,122 Q-50,20 -38,-84 Z'
      : 'M-38,-84 Q0,-98 38,-84 Q52,20 72,150 Q36,172 0,166 Q-36,172 -72,150 Q-52,20 -38,-84 Z';
    const skin = '#f0c294';

    let g = `<circle cx="0" cy="-70" r="260" fill="url(#rGlow)" opacity="${(.3 * aura).toFixed(2)}"/>`;
    g += `<g filter="url(#fGlow)">${wing(-1)}${wing(1)}`;
    if (arms === 'sword') {
      g += `<path d="M28,-80 L80,-132 L102,-112 L46,-46 Z" fill="url(#lSleeve)"/><circle cx="93" cy="-124" r="10" fill="${skin}"/>
        <path d="M86,-130 L99,-262 L106,-278 L111,-260 L102,-126 Z" fill="url(#lBlade)"/>
        <path d="M74,-140 L120,-130" stroke="#ffd766" stroke-width="7" stroke-linecap="round"/>
        <path d="M-28,-80 L-80,-34 L-64,-12 L-38,-40 Z" fill="url(#lSleeve)"/><circle cx="-74" cy="-20" r="9" fill="${skin}"/>`;
    } else if (arms === 'open') {
      g += `<path d="M28,-80 L92,-30 L80,-8 L38,-42 Z" fill="url(#lSleeve)"/><circle cx="90" cy="-14" r="9" fill="${skin}"/>
        <path d="M-28,-80 L-92,-30 L-80,-8 L-38,-42 Z" fill="url(#lSleeve)"/><circle cx="-90" cy="-14" r="9" fill="${skin}"/>`;
    } else if (arms === 'up') {
      g += `<path d="M28,-80 L78,-140 L100,-124 L46,-48 Z" fill="url(#lSleeve)"/><circle cx="92" cy="-138" r="9" fill="${skin}"/>
        <path d="M-28,-80 L-78,-140 L-100,-124 L-46,-48 Z" fill="url(#lSleeve)"/><circle cx="-92" cy="-138" r="9" fill="${skin}"/>`;
    }
    g += `<path d="${robeD}" fill="url(#lRobe)"/>`;
    if (!kneel) {
      g += `<path d="M-38,-84 Q-6,-96 16,-90 Q-8,40 -18,166 Q-48,166 -72,150 Q-52,20 -38,-84 Z" fill="url(#lMantle)" opacity=".8"/>
        <path d="M-10,-60 Q-16,40 -26,150 M14,-62 Q18,40 30,150 M2,-50 Q4,60 4,160" fill="none" stroke="#fffaf0" stroke-opacity=".35" stroke-width="2"/>`;
    }
    g += `<path d="M-48,-14 Q0,4 50,-14" fill="none" stroke="#ffd56a" stroke-width="5" stroke-linecap="round" opacity=".9"/>
      <path d="M-24,-90 Q0,-62 24,-90" fill="none" stroke="#ffe08a" stroke-width="4"/>`;
    if (arms === 'pray') {
      g += `<path d="M30,-78 L4,-30 L-18,-34 L-30,-78 Q0,-70 30,-78 Z" fill="url(#lSleeve)"/><path d="M-12,-54 L-7,-24 L4,-24 L2,-54 Z" fill="${skin}"/>`;
    }
    if (shine) g += `<path class="shimmer" d="${robeD}" fill="#ffffff"/>`;
    g += `</g>`;
    g += `<circle cx="0" cy="-130" r="68" fill="url(#rHalo)"/>
      <circle cx="0" cy="-130" r="52" fill="none" stroke="#fff6d0" stroke-width="2.5" opacity=".85"/>
      <rect x="-8" y="-106" width="16" height="18" fill="#e3ad7a"/>
      <path d="M-27,-122 Q-30,-170 0,-170 Q30,-170 27,-122 Q24,-142 0,-147 Q-24,-142 -27,-122 Z" fill="#6e4220"/>
      <ellipse cx="0" cy="-126" rx="23" ry="28" fill="url(#rFace)"/>
      <path d="M-18,-129 Q-10.5,-137 -3,-129 Q-10.5,-123 -18,-129 Z M18,-129 Q10.5,-137 3,-129 Q10.5,-123 18,-129 Z" fill="#2c180b" opacity=".85"/>
      <circle cx="-10.5" cy="-130" r="1.4" fill="#fff" opacity=".8"/><circle cx="10.5" cy="-130" r="1.4" fill="#fff" opacity=".8"/>
      <path d="M-20,-139 Q-11,-145 -3,-140 M20,-139 Q11,-145 3,-140" fill="none" stroke="#4a2a12" stroke-width="2" stroke-linecap="round" opacity=".75"/>
      <path d="M0,-126 L-2.5,-114 L2.5,-114" fill="none" stroke="#8a5530" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>
      <path d="M-5,-106 Q0,-103 5,-106" fill="none" stroke="#a5553a" stroke-width="2.2" stroke-linecap="round"/>`;
    if (kneel) {
      g = `<g transform="translate(0,120)"><g><g transform="translate(0,-120)">${g}</g><animateTransform attributeName="transform" type="rotate" values="0;-12;-12;0;0" keyTimes="0;.3;.6;.9;1" dur="7s" repeatCount="indefinite"/></g></g>`;
    }
    return `<g transform="translate(${x},${y}) scale(${s})" opacity="${op}"><g${bob ? ' class="bob"' : ''}>${g}</g></g>`;
  }

  function miniAngel(x, y, s, d) {
    return `<g transform="translate(${x},${y}) scale(${s})"><g class="bob" style="animation-delay:-${d}s">
      <circle r="40" fill="url(#rGlow)" opacity=".85"/>
      <path d="M-6,-6 C-30,-44 -66,-40 -74,-14 C-52,-14 -30,-2 -6,4 Z" fill="url(#lFeather2)" opacity=".9"/>
      <path d="M6,-6 C30,-44 66,-40 74,-14 C52,-14 30,-2 6,4 Z" fill="url(#lFeather2)" opacity=".9"/>
      <path d="M-9,-8 Q0,-12 9,-8 L15,28 Q0,32 -15,28 Z" fill="url(#lRobe)"/>
      <circle cy="-17" r="13" fill="url(#rHalo)"/><circle cy="-17" r="6.5" fill="#f0c294"/>
    </g></g>`;
  }

  /* ---------- the faithful, as silhouettes ---------- */

  function silBody(arms, scarf, hat, staff) {
    let b = `<path stroke="none" d="M-15,-122 Q-25,-118 -27,-100 Q-30,-50 -36,0 L36,0 Q30,-50 27,-100 Q25,-118 15,-122 Z"/>
      <rect stroke="none" x="-6" y="-134" width="12" height="16"/>
      <ellipse stroke="none" cx="0" cy="-143" rx="12.5" ry="15"/>`;
    if (scarf) b += `<path stroke="none" d="M-15,-150 Q-16,-167 0,-167 Q16,-167 15,-150 L22,-118 Q30,-104 34,-80 L-34,-80 Q-30,-104 -22,-118 Z"/>`;
    if (hat) b += `<ellipse stroke="none" cx="0" cy="-156" rx="15" ry="9"/>`;
    const A = 'fill="none" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"';
    if (arms === 'up') b += `<path ${A} d="M-18,-112 L-34,-150 L-38,-188 M18,-112 L34,-150 L38,-188"/><circle stroke="none" cx="-38" cy="-192" r="6"/><circle stroke="none" cx="38" cy="-192" r="6"/>`;
    else if (arms === 'pray') b += `<path ${A} d="M-20,-110 L-14,-82 L-3,-98 M20,-110 L14,-82 L3,-98"/><ellipse stroke="none" cx="0" cy="-102" rx="5" ry="9"/>`;
    else if (arms === 'basket') b += `<path ${A} d="M-18,-112 L-30,-148 L-20,-176 M18,-112 L30,-148 L20,-176"/><path stroke="none" d="M-30,-176 L30,-176 L24,-196 L-24,-196 Z"/>`;
    if (staff) b += `<path fill="none" stroke-width="4" d="M30,-100 L44,0 M30,-100 L26,-150"/>`;
    return b;
  }

  function sil(o) {
    const { x, y, s = 1, arms = 'down', scarf = false, hat = false, staff = false, dark = '#0b0806', rim = '#ffd59a', rimOp = .6, rdx = 0, rdy = -1.8, cloth = null } = o;
    const b = silBody(arms, scarf, hat, staff);
    let g = `<g transform="translate(${rdx},${rdy})" fill="${rim}" stroke="${rim}" opacity="${rimOp}">${b}</g><g fill="${dark}" stroke="${dark}">${b}</g>`;
    if (cloth) {
      g += scarf
        ? `<path d="M-15,-150 Q-16,-167 0,-167 Q16,-167 15,-150 L22,-118 Q30,-104 34,-80 L-34,-80 Q-30,-104 -22,-118 Z" fill="${cloth}" opacity=".9"/>`
        : `<path d="M-27,-104 Q0,-124 27,-104 L32,-60 Q0,-48 -32,-60 Z" fill="${cloth}" opacity=".85"/>`;
    }
    return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
  }
  const sils = (list, common = {}) => list.map(p => sil({ ...common, ...p })).join('');

  /* ---------- things ---------- */

  function tree(x, y, s, sd, begin) {
    seed = sd;
    let st = '', lv = '';
    const br = (x1, y1, a, len, w, d) => {
      const x2 = x1 + len * Math.sin(a), y2 = y1 - len * Math.cos(a);
      st += `<path d="M${f1(x1)},${f1(y1)} L${f1(x2)},${f1(y2)}" stroke-width="${f1(w)}"/>`;
      if (d === 0) { for (let k = 0; k < 3; k++) lv += `<circle cx="${f1(x2 + R(-15, 15))}" cy="${f1(y2 + R(-15, 8))}" r="${R(9, 17)}"/>`; return; }
      const n = d > 3 ? 2 : (rnd() > .45 ? 3 : 2);
      for (let i = 0; i < n; i++) br(x2, y2, a + (i - (n - 1) / 2) * R(.38, .62) + R(-.15, .15), len * R(.68, .8), w * .68, d - 1);
    };
    br(0, 0, 0, 82, 18, 5);
    return `<g transform="translate(${x},${y}) scale(${s})"><g transform="scale(0)">
      <animateTransform attributeName="transform" type="scale" values="0;1" dur="3.5s" begin="${begin}s" fill="freeze" calcMode="spline" keySplines=".2 .7 .3 1"/>
      <g fill="#0b0f07" stroke="#0b0f07" stroke-linecap="round">${st}${lv}</g></g></g>`;
  }

  function juniper(x, y, s, sd) {
    seed = sd;
    const H = 170, L = [], Rr = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12, yy = -14 - t * H, w = (1 - t) * 38 + 3;
      L.push(`${f1(-w - R(0, 7))},${f1(yy)}`); Rr.unshift(`${f1(w + R(0, 7))},${f1(yy - R(0, 6))}`);
    }
    return `<g transform="translate(${x},${y}) scale(${s})" fill="#0b0d08"><rect x="-4" y="-16" width="8" height="18"/><path d="M-4,-14 L${L.join(' L')} L0,${-H - 30} L${Rr.join(' L')} L4,-14 Z"/></g>`;
  }

  function tent(x, y, s) {
    return `<g transform="translate(${x},${y}) scale(${s})" fill="#1a110b"><path d="M-95,0 L-82,-52 Q-40,-64 0,-58 Q40,-64 82,-52 L95,0 Z"/><path d="M-60,-55 L-62,-80 M60,-55 L62,-80" stroke="#1a110b" stroke-width="4"/><path d="M-18,0 L-14,-40 L14,-40 L18,0 Z" fill="#000"/></g>`;
  }

  function ethCrossGold(x, y, s, stem = true) {
    const arm = 'M-16,-50 L-16,-108 Q-52,-118 -42,-150 Q-22,-140 -15,-152 Q-22,-182 0,-194 Q22,-182 15,-152 Q22,-140 42,-150 Q52,-118 16,-108 L16,-50 Z';
    const E = 'stroke="#4a2c06" stroke-width="2.5"';
    let g = stem ? `<rect x="-9" y="120" width="18" height="250" fill="url(#lGoldV)" ${E}/>` : '';
    for (const a of [0, 90, 180, 270]) g += `<g transform="rotate(${a})"><path d="${arm}" fill="url(#lGold)" ${E}/><circle cx="0" cy="-150" r="9" fill="#a3161a" ${E}/><circle cx="-3" cy="-153" r="3" fill="#ff8a7a"/></g>`;
    for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) g += `<circle cx="${dx * 66}" cy="${dy * 66}" r="13" fill="url(#lGold)" ${E}/><circle cx="${dx * 66}" cy="${dy * 66}" r="4.5" fill="#1f6a3a"/>`;
    g += `<rect x="-48" y="-48" width="96" height="96" transform="rotate(45)" fill="url(#lGold)" ${E}/>
      <rect x="-30" y="-30" width="60" height="60" transform="rotate(45)" fill="url(#lVelvet)" ${E}/>
      <path d="M0,-22 V22 M-22,0 H22" stroke="#ffe9a8" stroke-width="7" stroke-linecap="round"/>`;
    return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
  }

  function throneGold(x, y, s) {
    const E = 'stroke="#4a2c06" stroke-width="3"';
    return `<g transform="translate(${x},${y}) scale(${s})">
      ${ethCrossGold(0, -232, .22, false)}
      <path d="M-95,110 V-60 Q-95,-150 0,-170 Q95,-150 95,-60 V110 Z" fill="url(#lGold)" ${E}/>
      <path d="M-74,110 V-56 Q-74,-128 0,-146 Q74,-128 74,-56 V110 Z" fill="url(#lVelvet)"/>
      <circle cx="-95" cy="-60" r="13" fill="url(#lGold)" ${E}/><circle cx="95" cy="-60" r="13" fill="url(#lGold)" ${E}/>
      <rect x="-116" y="100" width="232" height="36" rx="8" fill="url(#lGold)" ${E}/>
      <path d="M-135,136 H135 L150,166 H-150 Z" fill="url(#lGoldV)" ${E}/>
      <path d="M-150,166 H150 L165,196 H-165 Z" fill="url(#lGold)" ${E}/>
      <path d="M-165,196 H165 L180,226 H-180 Z" fill="url(#lGoldV)" ${E}/>
    </g>`;
  }

  function church(x, y, s) {
    const d = '#100a08';
    let w = '';
    for (const wx of [-80, -40, 40, 80]) w += `<circle cx="${wx}" cy="-46" r="26" fill="url(#rWarm)"/><path d="M${wx - 7},-30 V-56 Q${wx},-67 ${wx + 7},-56 V-30 Z" fill="#ffc163"/>`;
    return `<g transform="translate(${x},${y}) scale(${s})">
      <ellipse cx="0" cy="-2" rx="160" ry="14" fill="${d}"/>
      <rect x="-112" y="-96" width="224" height="96" fill="${d}"/>
      <path d="M-140,-92 L0,-198 L140,-92 Z" fill="${d}"/>
      <path d="M-140,-92 L0,-198 L140,-92" fill="none" stroke="#ffbf7a" stroke-opacity=".55" stroke-width="2"/>
      <rect x="-14" y="-228" width="28" height="34" fill="${d}"/><path d="M-20,-228 Q0,-248 20,-228 Z" fill="${d}"/>
      ${w}<path d="M-14,0 V-44 Q0,-60 14,-44 V0 Z" fill="#ffb54d" opacity=".8"/>
      <circle cx="0" cy="-292" r="40" fill="url(#rGlow)"/>${ethCrossGold(0, -290, .2, false)}
    </g>`;
  }

  function candle(x, y) {
    return `<g transform="translate(${x},${y})">
      <circle class="pulse" cx="0" cy="-372" r="120" fill="url(#rWarm)"/>
      <path d="M-28,0 H28 L18,-22 H-18 Z" fill="url(#lGold)"/><rect x="-6" y="-262" width="12" height="242" fill="url(#lGold)"/>
      <path d="M-24,-262 H24 L15,-278 H-15 Z" fill="url(#lGold)"/>
      <rect x="-9" y="-346" width="18" height="84" fill="url(#lWax)"/>
      <ellipse cx="0" cy="-346" rx="9" ry="3" fill="#fff8e6"/>
      <path d="M0,-346 V-352" stroke="#2a1a10" stroke-width="2"/>
      <ellipse class="flame" cx="0" cy="-370" rx="9" ry="22" fill="url(#rFlame)"/>
      <ellipse cx="0" cy="-354" rx="3.5" ry="5" fill="#6d8cff" opacity=".45"/>
    </g>`;
  }

  function manna(n, top) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const d = R(6, 10);
      s += `<circle class="fall" cx="${R(20, 580)}" cy="${top}" r="${R(3, 6)}" fill="url(#rFlake)" style="--d:${R(470, 580)}px;animation-duration:${d}s;animation-delay:-${R(0, d)}s"/>`;
    }
    return s;
  }

  function groundManna(n, y0, y1) {
    let s = '';
    for (let i = 0; i < n; i++) s += `<ellipse cx="${R(10, 590)}" cy="${R(y0, y1)}" rx="${R(2.5, 5)}" ry="${R(1.5, 2.6)}" fill="#fffaf0" opacity=".9"/>`;
    return s;
  }

  // People walking away down the dry road, drawn in true perspective (eye level at the horizon).
  function walkers() {
    let k = '@keyframes walkR{';
    for (let i = 0; i <= 10; i++) {
      const t = i / 10, sc = (1 / (.55 + 4.2 * t)).toFixed(3);
      const o = t > .9 ? ((1 - t) / .1).toFixed(2) : 1;
      k += `${(t * 100).toFixed(0)}%{transform:translate(calc(300px + var(--dx) * ${sc}),425px) scale(${sc});opacity:${o}}`;
    }
    k += '}.walkR{animation:walkR 24s linear infinite}@keyframes fadeIn{from{opacity:0}to{opacity:1}}.late{animation:fadeIn 2.5s 4.5s both}';
    const dxs = [-150, 90, -40, 160, -110, 30, -170, 120, 0, -70, 60];
    let g = '';
    for (let i = 0; i < dxs.length; i++) {
      g += `<g class="walkR" style="--dx:${dxs[i]}px;animation-delay:-${(i * 24 / dxs.length).toFixed(2)}s"><g transform="translate(0,160)">${sil({ x: 0, y: 0, scarf: i % 3 === 1, staff: i % 4 === 2, arms: i % 5 === 3 ? 'up' : 'down', rim: '#ffdcae', rdy: -2.2, rimOp: .75 })}</g></g>`;
    }
    return `<style>${k}</style><g class="late">${g}</g>`;
  }

  /* ---------- palettes ---------- */

  const PAL = {
    dawn: ['SKY_TOP vec3(.16,.3,.6)', 'SKY_HOR vec3(1.,.7,.46)', 'SUN_COL vec3(1.,.72,.42)', 'CLOUD_LIT vec3(1.,.8,.62)', 'CLOUD_DARK vec3(.36,.32,.42)'],
    day: ['SKY_TOP vec3(.1,.3,.7)', 'SKY_HOR vec3(.98,.84,.66)', 'SUN_COL vec3(1.,.85,.6)', 'CLOUD_LIT vec3(1.,.96,.9)', 'CLOUD_DARK vec3(.5,.52,.6)'],
    dusk: ['SKY_TOP vec3(.1,.1,.3)', 'SKY_HOR vec3(1.,.48,.26)', 'SUN_COL vec3(1.,.55,.25)', 'CLOUD_LIT vec3(1.,.6,.38)', 'CLOUD_DARK vec3(.26,.17,.28)'],
    night: ['SKY_TOP vec3(.008,.015,.06)', 'SKY_HOR vec3(.07,.09,.18)', 'SUN_STR 0.', 'CLOUD_LIT vec3(.3,.32,.45)', 'CLOUD_DARK vec3(.04,.05,.09)'],
    gold: ['SKY_TOP vec3(.26,.14,.1)', 'SKY_HOR vec3(.9,.58,.32)', 'SUN_COL vec3(1.,.8,.5)', 'CLOUD_LIT vec3(1.,.82,.58)', 'CLOUD_DARK vec3(.32,.2,.17)', 'CS_LIT vec3(1.,.84,.62)', 'CS_DARK vec3(.36,.24,.2)', 'EXPOSURE .9'],
    storm: ['SKY_TOP vec3(.03,.04,.08)', 'SKY_HOR vec3(.16,.18,.26)', 'SUN_COL vec3(.75,.85,1.)', 'CLOUD_LIT vec3(.45,.48,.58)', 'CLOUD_DARK vec3(.06,.06,.1)', 'CLOUD_COVER .3']
  };

  function uber(list) {
    const m = new Map();
    list.forEach(d => m.set(d.split(' ')[0], d));
    return SH.PRE + [...m.values()].map(d => '#define ' + d).join('\n') + '\n' + SH.UBER;
  }

  /* ---------- scenes ---------- */

  const S = {};
  const hillFront = (d, fill = '#07090a') => `<path d="${d}" fill="${fill}"/>`;

  S.michael = () => ({
    defs: [...PAL.gold, 'HORIZON .3', 'SUN vec2(.5,.62)', 'SUN_STR 1.', 'CLOUDS', 'CLOUD_COVER .4', 'RAYS', 'RAY_STR .35', 'CLOUDSEA', 'CS_H .3'],
    svg: lightAngel({ x: 300, y: 470, s: 1.4, ws: .95, aura: 1.2 })
  });

  S.prayer = (v) => {
    seed = 5;
    let s = '';
    for (let i = 0; i < 14; i++) { const d = R(6, 10); s += `<circle class="rise" cx="${R(90, 510)}" cy="700" r="${R(6, 13)}" fill="url(#rGlow)" style="animation-duration:${d}s;animation-delay:-${R(0, d)}s"/>`; }
    if (v === 'ascend') {
      s += `<g class="ascend">${lightAngel({ x: 300, y: 420, s: .72, arms: 'up', bob: false })}</g>`;
    } else {
      const xs = [160, 430, 290, 200, 400];
      for (let i = 0; i < 5; i++) s += `<text class="rise" x="${xs[i]}" y="660" text-anchor="middle" font-size="46" fill="#ffefc0" filter="url(#fText)" ${FONT} style="animation-duration:10s;animation-delay:-${i * 2}s">ሃሌ ሉያ</text>`;
    }
    s += sils([
      { x: 70, y: 880, s: 1.6, arms: 'up', scarf: true },
      { x: 530, y: 880, s: 1.6, arms: 'up' },
      { x: 180, y: 900, s: 1.9, arms: 'up', hat: true },
      { x: 420, y: 900, s: 1.9, arms: 'up', scarf: true },
      { x: 300, y: 920, s: 2.15, arms: 'up', scarf: true }
    ], { rim: '#ffe4ad', rdy: -2.4, rimOp: .7 });
    return {
      defs: [...PAL.night, 'HORIZON .26', 'STARS', 'HEAVEN', 'LAND', 'LAND_COL vec3(.025,.03,.04)', 'LAND_SHADE vec3(.01,.012,.02)', 'LAND_AMP .1', 'LAND_STEP .035', 'LAND_HAZE .5', 'MIST .3'],
      svg: s
    };
  };

  S.trinity = () => ({
    defs: [...PAL.gold, 'HORIZON .28', 'SUN vec2(.5,.66)', 'SUN_STR .7', 'CLOUDS', 'CLOUD_COVER .4', 'RAYS', 'RAY_STR .3', 'RINGS', 'CLOUDSEA', 'CS_H .28'],
    svg: lightAngel({ x: 150, y: 660, s: .55, arms: 'sword', aura: .8 }) + lightAngel({ x: 450, y: 660, s: .55, arms: 'pray', aura: .8 })
  });

  S.creation = () => ({
    defs: [...PAL.dawn, 'HORIZON .34', 'SUN vec2(.5,.37)', 'SUN_STR 1.3', 'CLOUDS', 'CLOUD_COVER .44', 'RAYS', 'RAY_STR .22', 'LAND', 'LAND_COL vec3(.16,.26,.1)', 'LAND_SHADE vec3(.04,.07,.03)', 'LAND_AMP .1', 'LAND_STEP .045', 'LAND_HAZE .6', 'MIST .9'],
    svg: hillFront('M-10,800 Q150,742 300,752 T610,744 V860 H-10 Z', '#0a0d07') +
      tree(128, 772, .72, 21, 2.5) + tree(472, 766, .72, 34, 4.2) + tree(300, 754, 1.0, 47, 3.3)
  });

  S.manna = (v) => {
    seed = 13;
    const rock = v === 'rock', storm = v === 'lightning';
    let s = lightAngel({ x: 300, y: 190, s: .6, arms: 'open', aura: storm ? 1.5 : 1.15 });
    s += tent(468, 642, .55) + tent(560, 656, .45);
    if (!rock) s += tent(92, 652, .6);
    s += manna(60, 300) + groundManna(46, 760, 848);
    if (rock) {
      s += `<path d="M-10,780 L-10,560 L40,520 L110,500 L170,530 L205,600 L215,690 L200,780 Z" fill="url(#lRock)"/>
        <path d="M40,520 L110,500 L170,530 L205,600" fill="none" stroke="#ffd29a" stroke-opacity=".6" stroke-width="2.5"/>
        <path d="M118,560 L110,606 L128,640" stroke="#1d130d" stroke-width="3" fill="none"/>
        <ellipse cx="205" cy="796" rx="135" ry="28" fill="url(#lPool)" opacity=".92"/>
        <ellipse class="ripple" cx="180" cy="792" rx="40" ry="8" fill="none" stroke="#e8f6ff" stroke-width="2"/>
        <ellipse class="ripple" style="animation-delay:-1.2s" cx="180" cy="792" rx="40" ry="8" fill="none" stroke="#e8f6ff" stroke-width="2"/>
        <path d="M126,604 Q170,622 176,704 Q178,744 180,790" fill="none" stroke="#86c6f6" stroke-width="20" stroke-linecap="round" opacity=".9"/>
        <path class="flow" d="M126,604 Q170,622 176,704 Q178,744 180,790" fill="none" stroke="#f4fbff" stroke-width="5" stroke-linecap="round" stroke-dasharray="14 18"/>
        <path class="flow" style="animation-delay:-.5s" d="M120,608 Q162,628 168,706 Q170,744 172,790" fill="none" stroke="#dff1ff" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 22"/>
        <circle cx="180" cy="784" r="34" fill="url(#rFlake)" opacity=".5"/>`;
    }
    const px = rock ? 330 : 190;
    s += sils([
      { x: px, y: 890, s: 1.55, arms: 'up', scarf: true },
      { x: px + 115, y: 905, s: 1.75, arms: 'basket', hat: true },
      { x: px + 225, y: 890, s: 1.5, arms: 'up' },
      { x: px + 60, y: 870, s: .95, arms: 'up' }
    ], { rim: storm ? '#cfe0ff' : '#ffdcae', rdx: 1.8, rdy: -1.2, rimOp: .7 });
    const base = [...PAL.day, 'HORIZON .36', 'SUN vec2(.8,.44)', 'SUN_STR 1.1', 'CLOUDS', 'CLOUD_COVER .52', 'CLOUD_SCALE .45', 'HEAVEN', 'LAND', 'LAND_DUNES', 'LAND_COL vec3(.96,.68,.4)', 'LAND_SHADE vec3(.5,.29,.18)', 'LAND_LITDIR -1.', 'LAND_AMP .09', 'LAND_STEP .045', 'LAND_HAZE .45', 'MIST .2'];
    return {
      defs: storm ? [...base, ...PAL.storm, 'LIGHTNING', 'LAND_COL vec3(.36,.27,.22)', 'LAND_SHADE vec3(.12,.09,.08)', 'CLOUD_COVER .32'] : base,
      svg: s
    };
  };

  S.wings = () => ({
    defs: [...PAL.dusk, 'HORIZON .3', 'SUN vec2(.5,.31)', 'SUN_STR 1.3', 'CLOUDS', 'CLOUD_COVER .42', 'RAYS', 'RAYP vec2(.5,.62)', 'RAY_STR .3', 'LAND', 'LAND_COL vec3(.1,.07,.08)', 'LAND_SHADE vec3(.04,.03,.04)', 'LAND_AMP .09', 'LAND_STEP .04', 'MIST .5'],
    svg: lightAngel({ x: 300, y: 330, s: 1.12, arms: 'open', wings: 'spread', ws: 1.15, aura: 1.3 }) +
      hillFront('M-10,790 Q160,760 300,770 T610,762 V860 H-10 Z') +
      sils([
        { x: 60, y: 880, s: 1.45, arms: 'pray', scarf: true },
        { x: 540, y: 880, s: 1.45, arms: 'pray' },
        { x: 160, y: 900, s: 1.75, arms: 'up', hat: true },
        { x: 440, y: 900, s: 1.75, arms: 'up', scarf: true },
        { x: 300, y: 915, s: 2.0, arms: 'up', scarf: true },
        { x: 235, y: 860, s: 1.0, arms: 'up' },
        { x: 370, y: 860, s: 1.0, arms: 'pray', scarf: true }
      ], { rim: '#ffc890', rdy: -2.2, rimOp: .7 })
  });

  S.moses = () => ({
    defs: [...PAL.dusk, 'HORIZON .44', 'SUN vec2(.22,.47)', 'SUN_STR 1.1', 'CLOUDS', 'CLOUD_COVER .45', 'LAND', 'LAND_MOUNTAINS', 'LAND_COL vec3(.5,.32,.22)', 'LAND_SHADE vec3(.14,.08,.08)', 'LAND_LITDIR 1.', 'LAND_AMP .2', 'LAND_STEP .07', 'LAND_HAZE .55', 'MIST .3'],
    svg: `<circle class="flare" cx="190" cy="420" r="260" fill="url(#rGlow)"/>
      <path d="M-10,712 L120,668 L330,694 L460,654 L610,690 V860 H-10 Z" fill="#140d0a"/>
      <path d="M-10,712 L120,668 L330,694 L460,654 L610,690" fill="none" stroke="#ffb070" stroke-opacity=".5" stroke-width="2.5"/>
      <g transform="translate(380,680) scale(1.0)" opacity=".92">
        <path d="M-112,0 Q-122,-26 -92,-30 L80,-28 Q112,-24 110,0 Q112,20 80,22 L-92,24 Q-122,22 -112,0 Z" fill="url(#lShroud)"/>
        <path d="M-60,-29 Q-56,-2 -52,23 M-10,-29 Q-6,-2 -2,22 M40,-28 Q44,-2 48,22" stroke="#b5a383" stroke-width="3" fill="none"/>
        <path d="M-100,-12 Q-10,-20 96,-10" stroke="#fffdf6" stroke-opacity=".7" stroke-width="2" fill="none"/>
      </g>
      <g class="recoil"><g transform="translate(486,470)" filter="url(#fSmoke)">
        <path d="M-30,-40 C-90,-110 -120,-40 -130,10 C-100,-10 -90,10 -84,36 C-66,10 -50,10 -34,30 Z M30,-40 C90,-110 120,-40 130,10 C100,-10 90,10 84,36 C66,10 50,10 34,30 Z" fill="#0d0710"/>
        <path d="M-34,-50 Q0,-70 34,-50 L52,130 Q0,150 -52,130 Z" fill="#08050a"/>
        <path d="M-20,-104 L-34,-150 L-8,-118 Z M20,-104 L34,-150 L8,-118 Z" fill="#08050a"/>
        <circle cx="0" cy="-86" r="30" fill="#08050a"/>
      </g><g transform="translate(486,470)"><path d="M-17,-92 l12,6 l-12,4 Z M17,-92 l-12,6 l12,4 Z" fill="#ff3b1f"/><circle cx="-11" cy="-88" r="9" fill="#ff3b1f" opacity=".25"/><circle cx="11" cy="-88" r="9" fill="#ff3b1f" opacity=".25"/></g></g>
      ${lightAngel({ x: 180, y: 440, s: .95, ws: .85, aura: 1.1 })}`
  });

  S.icon = () => {
    const P = window.PAINT;
    return {
      defs: ['INTERIOR'],
      extra: P.DEFS,
      svg: `<circle cx="300" cy="320" r="320" fill="url(#rWarm)" opacity=".7"/>
        <rect x="130" y="86" width="340" height="452" rx="8" fill="url(#lGold)"/>
        <rect x="149" y="105" width="302" height="414" fill="url(#lLeaf)"/>
        ${P.angel({ x: 300, y: 344, s: .82, ws: .6, wings: 'still', bob: false })}
        <rect x="149" y="105" width="302" height="414" fill="url(#rWarm)" opacity=".35"/>
        ${candle(70, 700)}${candle(530, 700)}
        <text class="oho" x="300" y="598" text-anchor="middle" font-size="76" fill="#ffeab0" filter="url(#fText)" ${FONT}>ኦሆ</text>
        ${sils([
          { x: 200, y: 900, s: 1.9, arms: 'up', scarf: true, cloth: '#cdbfa4' },
          { x: 400, y: 905, s: 2.0, arms: 'up', cloth: '#c9b99c' }
        ], { dark: '#140c07', rim: '#ffb860', rdy: -2, rimOp: .6 })}`
    };
  };

  S.throne = () => {
    let rows = '';
    [[650, 5, 70, 115, .62], [730, 4, 128, 115, .76], [815, 5, 70, 115, .9]].forEach(([y, n, x0, dx, sc], r) => {
      for (let i = 0; i < n; i++) rows += miniAngel(x0 + i * dx, y, sc, (i * .7 + r) % 3.4);
    });
    return {
      defs: [...PAL.gold, 'HORIZON .36', 'SUN vec2(.5,.62)', 'SUN_STR 1.', 'CLOUDS', 'CLOUD_COVER .42', 'RAYS', 'RAY_STR .3', 'CLOUDSEA', 'CS_H .36'],
      svg: `${rows}<g class="liftUp"><circle cx="300" cy="290" r="280" fill="url(#rGlow)" opacity=".8"/>${throneGold(300, 300, 1)}${lightAngel({ x: 300, y: 310, s: .78, ws: 1, aura: .6 })}</g>`
    };
  };

  S.sea = () => ({
    sea: true,
    svg: walkers() + lightAngel({ x: 300, y: 150, s: .38, arms: 'open', aura: 1.4 })
  });

  S.incense = () => ({
    defs: ['INTERIOR', 'BEAM', 'SMOKE', 'SMOKE_X .505', 'SMOKE_Y .27'],
    svg: lightAngel({ x: 300, y: 170, s: .5, arms: 'open', op: .55, aura: .9 }) +
      `<path d="M198,645 L303,517" stroke="#120b07" stroke-width="22" stroke-linecap="round"/><circle cx="303" cy="517" r="11" fill="#120b07"/>` +
      sil({ x: 160, y: 880, s: 2.1, hat: true, cloth: '#d3c6ad', dark: '#120b07', rim: '#ffcf8a', rdx: 1.5, rdy: -2 }) +
      `<g transform="translate(303,520)"><g>
        <animateTransform attributeName="transform" type="rotate" values="-13;13;-13" dur="2.8s" repeatCount="indefinite" ${EASE}/>
        <path d="M0,0 L-22,96 M0,0 L0,84 M0,0 L22,96" stroke="#e8c26a" stroke-width="2.2"/>
        <circle cx="-11" cy="48" r="3.5" fill="#f0cf7a"/><circle cx="11" cy="48" r="3.5" fill="#f0cf7a"/><circle cx="0" cy="60" r="3.5" fill="#f0cf7a"/>
        <path d="M-26,98 Q0,62 26,98 Z" fill="url(#lGold)"/>
        <circle cx="-9" cy="88" r="2.4" fill="#2a1606"/><circle cx="9" cy="88" r="2.4" fill="#2a1606"/><circle cx="0" cy="80" r="2.4" fill="#2a1606"/>
        <path d="M-31,98 Q-31,138 0,142 Q31,138 31,98 Z" fill="url(#lGold)"/>
        <path d="M-27,112 Q0,122 27,112" fill="none" stroke="#8a1a12" stroke-width="3"/>
        <path d="M-14,142 H14 L18,154 H-18 Z" fill="url(#lGoldV)"/>
        <circle class="pulse" cx="0" cy="100" r="34" fill="url(#rWarm)"/>
      </g></g>` +
      sils([
        { x: 440, y: 880, s: 1.55, arms: 'up', scarf: true, cloth: '#bfb196' },
        { x: 540, y: 895, s: 1.45, arms: 'pray', cloth: '#b8a98e' }
      ], { dark: '#120b07', rim: '#ffcf8a', rdy: -1.8, rimOp: .5 })
  });

  S.host = () => {
    let ring = '';
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2 + Math.PI / 10;
      ring += miniAngel(300 + 238 * Math.cos(a), 430 + 345 * Math.sin(a), .62, (i * .55) % 3.4);
    }
    return {
      defs: [...PAL.storm, 'HORIZON -.15', 'SUN vec2(.5,.5)', 'SUN_STR .7', 'CLOUDS', 'CLOUD_COVER .28', 'CLOUD_SCALE .6', 'LIGHTNING', 'RAYS', 'RAY_COL vec3(.75,.85,1.)', 'RAY_STR .6'],
      svg: ring + lightAngel({ x: 300, y: 470, s: 1.18, ws: .9, aura: 1.4, shine: true })
    };
  };

  S.kneel = () => {
    seed = 47;
    let drops = '';
    for (let i = 0; i < 26; i++) { const d = R(5, 8); drops += `<circle class="fall" cx="${R(110, 490)}" cy="260" r="${R(3, 6)}" fill="url(#rHalo)" style="--d:${R(430, 520)}px;animation-duration:${d}s;animation-delay:-${R(0, d)}s"/>`; }
    return {
      defs: [...PAL.gold, 'HORIZON .3', 'SUN vec2(.5,.8)', 'SUN_STR 1.1', 'CLOUDS', 'CLOUD_COVER .43', 'RAYS', 'RAY_STR .3', 'CLOUDSEA', 'CS_H .3'],
      svg: `<circle cx="300" cy="170" r="200" fill="url(#rGlow)"/>${throneGold(300, 168, .5)}${drops}` +
        lightAngel({ x: 285, y: 480, s: 1, ws: .82, arms: 'pray', kneel: true, bob: false, aura: .9 })
    };
  };

  S.cross = () => ({
    defs: [...PAL.dawn, 'HORIZON .3', 'SUN vec2(.5,.33)', 'SUN_STR 1.3', 'CLOUDS', 'CLOUD_COVER .44', 'RAYS', 'RAY_STR .25', 'LAND', 'LAND_COL vec3(.12,.18,.08)', 'LAND_SHADE vec3(.03,.05,.02)', 'LAND_AMP .09', 'LAND_STEP .04', 'MIST .9'],
    svg: `<circle cx="300" cy="290" r="240" fill="url(#rGlow)" opacity=".7"/>
      <g class="bob">${ethCrossGold(300, 280, .95, false)}</g>
      ${hillFront('M-10,790 Q150,742 300,748 T610,752 V860 H-10 Z', '#08090a')}
      ${juniper(70, 790, 1.0, 3)}${juniper(130, 775, .7, 5)}${juniper(520, 788, .95, 7)}${juniper(470, 770, .65, 9)}
      ${church(300, 760, .85)}`
  });

  window.REAL = {
    get(key) {
      const [name, variant] = String(key || 'michael').split(':');
      const r = (S[name] || S.michael)(variant);
      return {
        shader: r.sea ? SH.PRE + SH.SEA : uber(r.defs),
        scale: r.sea ? .85 : 1,
        overlay: svg(r.svg, r.extra || '')
      };
    }
  };
})();
