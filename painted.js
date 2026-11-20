// Animated scenes, drawn as SVG in the manner of Ethiopian church painting:
// flat strong colour, dark outlines, large eyes, banded wings.
(function () {
  'use strict';

  const C = {
    ink: '#22130a', gold: '#f2b632', goldL: '#ffd96b', goldD: '#c8871a',
    red: '#b3261e', redD: '#7d1712', green: '#1f7a3d', greenL: '#3fa35a',
    blue: '#1d4e9e', blueD: '#0d2259', skin: '#b9773f', skinD: '#8a5226',
    white: '#fffaf0', sand: '#e2b469', sandD: '#c9954a'
  };
  const FONT = `font-family="'Noto Serif Ethiopic','Abyssinica SIL','Kefa',serif" font-weight="800"`;

  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const R = (a, b) => +(a + rnd() * (b - a)).toFixed(1);
  const ink = (w = 3) => `stroke="${C.ink}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const EASE = 'calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"';

  const DEFS = `<defs>
    <radialGradient id="gGlow"><stop offset="0" stop-color="#fff8d6"/><stop offset=".45" stop-color="#f9cf55" stop-opacity=".75"/><stop offset="1" stop-color="#f9cf55" stop-opacity="0"/></radialGradient>
    <radialGradient id="gIcon" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#ffe07a"/><stop offset=".5" stop-color="#eda024"/><stop offset="1" stop-color="#a52a16"/></radialGradient>
    <linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1b4a"/><stop offset="1" stop-color="#2a59ad"/></linearGradient>
    <linearGradient id="gDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b4596"/><stop offset=".7" stop-color="#6f9fe0"/><stop offset="1" stop-color="#f6d58a"/></linearGradient>
    <linearGradient id="gDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a5e"/><stop offset=".6" stop-color="#a8433f"/><stop offset="1" stop-color="#f0a13c"/></linearGradient>
    <linearGradient id="gBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3b0" stop-opacity=".85"/><stop offset="1" stop-color="#fff3b0" stop-opacity="0"/></linearGradient>
    <linearGradient id="gSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6fd0"/><stop offset="1" stop-color="#123a8a"/></linearGradient>
    <pattern id="pWall" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="${C.redD}"/><path d="M30,16 V44 M18,28 H42" stroke="${C.gold}" stroke-width="4" opacity=".45"/></pattern>
  </defs>`;

  /* ---------- small building blocks ---------- */

  const limb = (x1, y1, x2, y2, w, col) =>
    `<path d="M${x1},${y1} L${x2},${y2}" stroke="${C.ink}" stroke-width="${w + 5}" stroke-linecap="round"/><path d="M${x1},${y1} L${x2},${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  const hand = (x, y, r = 5.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.skin}" ${ink(2)}/>`;

  function stars(n, yMax = 500) {
    let s = '';
    for (let i = 0; i < n; i++)
      s += `<circle class="tw" cx="${R(10, 590)}" cy="${R(10, yMax)}" r="${R(1.5, 3.6)}" fill="${C.goldL}" style="animation-delay:-${R(0, 4)}s"/>`;
    return s;
  }

  function rays(cx, cy, r, n = 18, fill = '#fff2a8', op = 0.25, dur = 80) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a0 = (i * 2 * Math.PI) / n, a1 = a0 + (Math.PI / n) * 0.85;
      d += `M0,0 L${(r * Math.cos(a0)).toFixed(1)},${(r * Math.sin(a0)).toFixed(1)} L${(r * Math.cos(a1)).toFixed(1)},${(r * Math.sin(a1)).toFixed(1)} Z `;
    }
    return `<g transform="translate(${cx},${cy})"><g opacity="${op}"><path d="${d}" fill="${fill}"/><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${dur}s" repeatCount="indefinite"/></g></g>`;
  }

  const glow = (cx, cy, r, cls = 'pulse') => `<circle class="${cls}" cx="${cx}" cy="${cy}" r="${r}" fill="url(#gGlow)"/>`;

  function cloud(x, y, s = 1, fill = C.white) {
    return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-90,20 a26,26 0 0 1 20,-42 a34,34 0 0 1 62,-16 a30,30 0 0 1 54,16 a24,24 0 0 1 14,42 Z" fill="${fill}" ${ink(3)}/><path d="M-52,-4 a18,18 0 0 1 30,-8 M10,-14 a16,16 0 0 1 28,2" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".45"/></g>`;
  }

  // The opening of heaven at the top of a scene.
  function heaven(withBeams = true) {
    let s = '';
    if (withBeams) {
      s += `<g class="pulse"><path d="M200,60 L400,60 L560,850 L40,850 Z" fill="url(#gBeam)" opacity=".5"/><path d="M270,60 L330,60 L380,850 L220,850 Z" fill="url(#gBeam)" opacity=".5"/></g>`;
    }
    s += `<ellipse cx="300" cy="-30" rx="340" ry="170" fill="${C.red}" ${ink(4)}/>
      <ellipse cx="300" cy="-30" rx="318" ry="152" fill="${C.gold}" ${ink(3)}/>
      <ellipse cx="300" cy="-30" rx="270" ry="118" fill="${C.goldL}"/>
      <ellipse class="pulse" cx="300" cy="-20" rx="200" ry="80" fill="#fffbe6"/>`;
    return s;
  }

  const WING = 'M0,0 C40,-95 135,-135 205,-70 C180,-62 170,-40 176,-8 C150,-10 140,12 146,42 C120,36 108,56 110,84 C86,74 66,90 56,116 C34,84 12,44 0,0 Z';
  const WING_LAYERS =
    `<path d="${WING}" fill="${C.blue}" ${ink(4)}/>` +
    `<path d="${WING}" transform="scale(.8)" fill="${C.red}" ${ink(4)}/>` +
    `<path d="${WING}" transform="scale(.6)" fill="${C.gold}" ${ink(4.5)}/>` +
    `<path d="${WING}" transform="scale(.38)" fill="${C.green}" ${ink(5)}/>`;

  // The archangel. Origin is the middle of the body; head is near y=-130, feet near y=160.
  function angel(o = {}) {
    const { x = 300, y = 400, s = 1, robe = C.red, mantle = C.green, arms = 'sword',
      wings = 'flap', ws = 1, bob = true, shine = false, kneel = false } = o;

    let wAnim = '', wInit = '';
    if (wings === 'flap') {
      wAnim = `<animateTransform attributeName="transform" type="rotate" values="0;-9;0" dur="3.6s" repeatCount="indefinite" ${EASE}/>`;
    } else if (wings === 'spread') {
      wInit = ' transform="rotate(62)"';
      wAnim = `<animateTransform attributeName="transform" type="rotate" values="62;-8" dur="4s" begin="0.5s" fill="freeze" calcMode="spline" keySplines=".3 0 .2 1"/>` +
        `<animateTransform attributeName="transform" type="rotate" values="-8;-15;-8" dur="5s" begin="4.5s" repeatCount="indefinite" ${EASE}/>`;
    }
    const wing = side => `<g transform="translate(${side * 24},-72) scale(${side * ws},${ws})"><g${wInit}>${WING_LAYERS}${wAnim}</g></g>`;

    const robePath = kneel
      ? 'M-40,-82 Q0,-98 40,-82 L56,58 L132,84 Q146,108 124,120 L-58,120 Z'
      : 'M-40,-82 Q0,-98 40,-82 L66,150 Q0,172 -66,150 Z';

    let g = wing(-1) + wing(1);

    if (!kneel) g += `<ellipse cx="-22" cy="162" rx="14" ry="7" fill="${C.skin}" ${ink(2.5)}/><ellipse cx="22" cy="162" rx="14" ry="7" fill="${C.skin}" ${ink(2.5)}/>`;

    if (arms === 'sword') {
      g += `<path d="M28,-80 L80,-132 L102,-112 L46,-46 Z" fill="${robe}" ${ink(3.5)}/>
        <path d="M86,-130 L99,-262 L106,-272 L111,-260 L102,-126 Z" fill="#f7f5ea" ${ink(3)}/>
        <path d="M74,-140 L120,-130" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/><path d="M74,-140 L120,-130" stroke="${C.gold}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="93" cy="-124" r="11" fill="${C.skin}" ${ink(2.5)}/>
        <path class="tw" d="M105,-292 l4,14 l14,4 l-14,4 l-4,14 l-4,-14 l-14,-4 l14,-4 Z" fill="#fff"/>
        <path d="M-28,-80 L-80,-34 L-64,-12 L-38,-40 Z" fill="${mantle}" ${ink(3.5)}/><circle cx="-74" cy="-20" r="10" fill="${C.skin}" ${ink(2.5)}/>`;
    } else if (arms === 'open') {
      g += `<path d="M28,-80 L92,-30 L80,-8 L38,-42 Z" fill="${robe}" ${ink(3.5)}/><circle cx="90" cy="-14" r="10" fill="${C.skin}" ${ink(2.5)}/>
        <path d="M-28,-80 L-92,-30 L-80,-8 L-38,-42 Z" fill="${mantle}" ${ink(3.5)}/><circle cx="-90" cy="-14" r="10" fill="${C.skin}" ${ink(2.5)}/>`;
    } else if (arms === 'up') {
      g += `<path d="M28,-80 L78,-140 L100,-124 L46,-48 Z" fill="${robe}" ${ink(3.5)}/><circle cx="92" cy="-138" r="10" fill="${C.skin}" ${ink(2.5)}/>
        <path d="M-28,-80 L-78,-140 L-100,-124 L-46,-48 Z" fill="${mantle}" ${ink(3.5)}/><circle cx="-92" cy="-138" r="10" fill="${C.skin}" ${ink(2.5)}/>`;
    }

    g += `<path d="${robePath}" fill="${robe}" ${ink(4)}/>`;
    if (!kneel) {
      g += `<path d="M-40,-82 Q-10,-94 14,-90 L-22,160 Q-46,158 -66,150 Z" fill="${mantle}" ${ink(3)}/>
        <path d="M-64,128 Q0,150 64,128 L66,150 Q0,172 -66,150 Z" fill="${C.gold}" ${ink(3)}/>`;
      for (let i = -3; i <= 3; i++) g += `<circle cx="${i * 17}" cy="${150 - Math.abs(i) * 2.2}" r="3.6" fill="${C.red}"/>`;
      g += `<path d="M22,-78 L34,134" stroke="${C.ink}" stroke-width="13"/><path d="M22,-78 L34,134" stroke="${C.gold}" stroke-width="8"/>`;
      for (let i = 0; i < 6; i++) g += `<circle cx="${23.5 + i * 1.9}" cy="${-56 + i * 34}" r="2.6" fill="${C.redD}"/>`;
    } else {
      g += `<path d="M-40,-82 Q-10,-94 14,-90 L-10,120 L-58,120 Z" fill="${mantle}" ${ink(3)}/>
        <path d="M56,58 L132,84" stroke="${C.ink}" stroke-width="2.5" opacity=".6"/>`;
    }
    g += `<path d="M-52,-14 Q0,4 54,-14" fill="none" stroke="${C.ink}" stroke-width="13" stroke-linecap="round"/><path d="M-52,-14 Q0,4 54,-14" fill="none" stroke="${C.gold}" stroke-width="8" stroke-linecap="round"/>`;
    g += `<path d="M-26,-90 Q0,-58 26,-90 Q0,-100 -26,-90 Z" fill="${C.gold}" ${ink(3)}/>`;
    if (shine) g += `<path class="shimmer" d="${robePath}" fill="#fffbe0"/><path class="flash" d="M-20,-60 L8,-10 L-12,-4 L20,70 L-4,20 L16,14 Z" fill="#fff"/>`;

    if (arms === 'pray') {
      g += `<path d="M30,-78 L4,-30 L-18,-34 L-30,-78 Q0,-70 30,-78 Z" fill="${robe}" ${ink(3)}/>
        <path d="M-14,-52 L-8,-22 L4,-22 L2,-52 Z" fill="${C.skin}" ${ink(2.5)}/>`;
    }

    // head
    g += `<circle cx="0" cy="-130" r="57" fill="${C.gold}" ${ink(3.5)}/><circle cx="0" cy="-130" r="50" fill="none" stroke="${C.red}" stroke-width="5"/>
      <circle cx="0" cy="-130" r="43" fill="none" stroke="${C.redD}" stroke-width="1.6" stroke-dasharray="2 6"/>
      <rect x="-9" y="-104" width="18" height="18" fill="${C.skinD}" ${ink(2)}/>
      <circle cx="0" cy="-136" r="36" fill="${C.ink}"/>
      <ellipse cx="0" cy="-126" rx="25" ry="30" fill="${C.skin}" ${ink(2.5)}/>
      <path d="M-25,-138 Q0,-170 25,-138 Q0,-152 -25,-138 Z" fill="${C.ink}"/>
      <path d="M-20,-129 Q-11.5,-140 -3,-129 Q-11.5,-121 -20,-129 Z" fill="#fff" ${ink(1.8)}/><circle cx="-11.5" cy="-129.5" r="4.4" fill="${C.ink}"/>
      <path d="M20,-129 Q11.5,-140 3,-129 Q11.5,-121 20,-129 Z" fill="#fff" ${ink(1.8)}/><circle cx="11.5" cy="-129.5" r="4.4" fill="${C.ink}"/>
      <path d="M-22,-140 Q-11,-148 -2,-141 M22,-140 Q11,-148 2,-141" fill="none" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M0,-127 L-3.5,-113 L3,-113" fill="none" stroke="${C.ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>
      <path d="M-6,-105 Q0,-101 6,-105" fill="none" stroke="${C.redD}" stroke-width="2.6" stroke-linecap="round"/>`;

    if (kneel) {
      g = `<g transform="translate(0,120)"><g><g transform="translate(0,-120)">${g}</g><animateTransform attributeName="transform" type="rotate" values="0;-13;-13;0;0" keyTimes="0;.3;.6;.9;1" dur="7s" repeatCount="indefinite"/></g></g>`;
    }
    return `<g transform="translate(${x},${y}) scale(${s})"><g${bob ? ' class="bob"' : ''}>${g}</g></g>`;
  }

  // A small winged face, as on the ceiling of Debre Berhan Selassie.
  function cherub(x, y, s = 1, delay = 0) {
    const w = 'M12,2 C32,-28 64,-30 78,-8 C64,-6 60,4 62,14 C48,10 40,18 38,28 C26,20 16,12 12,2 Z';
    return `<g transform="translate(${x},${y}) scale(${s})"><g class="bob" style="animation-delay:-${delay}s">
      <path d="${w}" fill="${C.red}" ${ink(2.5)}/><path d="${w}" transform="translate(4,1) scale(.62)" fill="${C.gold}" ${ink(2.5)}/>
      <g transform="scale(-1,1)"><path d="${w}" fill="${C.red}" ${ink(2.5)}/><path d="${w}" transform="translate(4,1) scale(.62)" fill="${C.gold}" ${ink(2.5)}/></g>
      <circle r="25" fill="${C.gold}" ${ink(2.5)}/><circle r="20.5" fill="none" stroke="${C.red}" stroke-width="2.5"/>
      <circle cy="-3" r="18.5" fill="${C.ink}"/><circle cy="2" r="15.5" fill="${C.skin}" ${ink(2)}/>
      <path d="M-15,-4 Q0,-20 15,-4 Q0,-11 -15,-4 Z" fill="${C.ink}"/>
      <ellipse cx="-6.2" cy="1" rx="4.6" ry="3.6" fill="#fff" ${ink(1.2)}/><circle cx="-6.2" cy="1.2" r="2.4" fill="${C.ink}"/>
      <ellipse cx="6.2" cy="1" rx="4.6" ry="3.6" fill="#fff" ${ink(1.2)}/><circle cx="6.2" cy="1.2" r="2.4" fill="${C.ink}"/>
      <path d="M-3.5,10 Q0,12.5 3.5,10" fill="none" stroke="${C.redD}" stroke-width="1.8" stroke-linecap="round"/>
    </g></g>`;
  }

  // One of the faithful, in white with a coloured border (tibeb).
  function person(o = {}) {
    const { x = 0, y = 0, s = 1, robe = C.white, trim = C.red, arms = 'down', back = false,
      scarf = false, turban = false, beard = false, cls = '', style = '' } = o;
    let g = '';
    if (arms === 'up') g += limb(-18, -32, -38, -72, 9, robe) + limb(18, -32, 38, -72, 9, robe) + hand(-39, -77) + hand(39, -77);
    g += `<path d="M-22,-42 Q0,-52 22,-42 L33,60 Q0,72 -33,60 Z" fill="${robe}" ${ink(3)}/>
      <path d="M-31.5,46 Q0,58 31.5,46 L33,60 Q0,72 -33,60 Z" fill="${trim}" ${ink(2)}/>`;
    if (back) g += `<path d="M-22,-42 L18,24 L29,16 L-8,-47 Z" fill="${trim}" opacity=".85"/>`;
    else g += `<path d="M0,-45 V50" stroke="${trim}" stroke-width="5"/>`;
    if (arms === 'pray') g += `<path d="M-20,-30 L-3,-12 M20,-30 L3,-12" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M-5,-26 L-3,-8 L3,-8 L5,-26 Z" fill="${C.skin}" ${ink(2)}/>`;
    if (back) {
      g += `<circle cx="0" cy="-62" r="17" fill="${scarf ? robe : C.ink}" ${ink(2.5)}/>`;
      if (scarf) g += `<path d="M-17,-58 Q0,-40 17,-58 L22,-40 Q0,-30 -22,-40 Z" fill="${robe}" ${ink(2.5)}/>`;
    } else {
      if (scarf) g += `<path d="M-21,-60 A21,22 0 0 1 21,-60 L23,-40 Q0,-32 -23,-40 Z" fill="${robe}" ${ink(2.5)}/>`;
      g += `<circle cx="0" cy="-62" r="16" fill="${C.skin}" ${ink(2.5)}/>`;
      if (turban) g += `<path d="M-19,-66 Q-20,-88 0,-88 Q20,-88 19,-66 Q0,-74 -19,-66 Z" fill="${C.white}" ${ink(2.5)}/><path d="M-14,-78 Q0,-84 14,-78" fill="none" stroke="${C.ink}" stroke-width="1.4" opacity=".5"/>`;
      else if (!scarf) g += `<path d="M-16.5,-64 A16.5,17 0 0 1 16.5,-64 Q0,-74 -16.5,-64 Z" fill="${C.ink}" ${ink(2)}/>`;
      if (beard) g += `<path d="M-13,-56 Q0,-34 13,-56 Q0,-50 -13,-56 Z" fill="${C.white}" ${ink(2)}/>`;
      g += `<ellipse cx="-6" cy="-62" rx="3.8" ry="3" fill="#fff"/><circle cx="-6" cy="-61.8" r="2" fill="${C.ink}"/><ellipse cx="6" cy="-62" rx="3.8" ry="3" fill="#fff"/><circle cx="6" cy="-61.8" r="2" fill="${C.ink}"/>`;
    }
    return `<g transform="translate(${x},${y}) scale(${s})"${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''}>${g}</g>`;
  }

  function throne(x, y, s = 1) {
    return `<g transform="translate(${x},${y}) scale(${s})">
      <path d="M0,-168 V-218 M-18,-198 H18" stroke="${C.ink}" stroke-width="13" stroke-linecap="round"/><path d="M0,-168 V-218 M-18,-198 H18" stroke="${C.gold}" stroke-width="7" stroke-linecap="round"/>
      <path d="M-95,110 V-60 Q-95,-150 0,-170 Q95,-150 95,-60 V110 Z" fill="${C.gold}" ${ink(5)}/>
      <path d="M-74,110 V-56 Q-74,-128 0,-146 Q74,-128 74,-56 V110 Z" fill="${C.red}" ${ink(3)}/>
      <path d="M0,-120 V-20 M-34,-84 H34" stroke="${C.gold}" stroke-width="7" opacity=".55"/>
      <circle cx="-95" cy="-60" r="13" fill="${C.gold}" ${ink(3)}/><circle cx="95" cy="-60" r="13" fill="${C.gold}" ${ink(3)}/>
      <rect x="-116" y="100" width="232" height="36" rx="8" fill="${C.gold}" ${ink(4)}/>
      <path d="M-135,136 H135 L150,166 H-150 Z" fill="${C.green}" ${ink(3.5)}/>
      <path d="M-150,166 H150 L165,196 H-165 Z" fill="${C.gold}" ${ink(3.5)}/>
      <path d="M-165,196 H165 L180,226 H-180 Z" fill="${C.red}" ${ink(3.5)}/>
    </g>`;
  }

  function ethCross(x, y, s = 1) {
    const arm = 'M-16,-50 L-16,-108 Q-52,-118 -42,-150 Q-22,-140 -15,-152 Q-22,-182 0,-194 Q22,-182 15,-152 Q22,-140 42,-150 Q52,-118 16,-108 L16,-50 Z';
    let g = `<rect x="-9" y="120" width="18" height="250" fill="${C.gold}" ${ink(4)}/>`;
    for (const a of [0, 90, 180, 270]) g += `<g transform="rotate(${a})"><path d="${arm}" fill="${C.gold}" ${ink(5)}/><circle cx="0" cy="-150" r="9" fill="${C.red}" ${ink(2.5)}/><path d="M0,-60 V-112" stroke="${C.redD}" stroke-width="4"/></g>`;
    for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) g += `<circle cx="${dx * 66}" cy="${dy * 66}" r="13" fill="${C.gold}" ${ink(4)}/><circle cx="${dx * 66}" cy="${dy * 66}" r="4.5" fill="${C.green}"/>`;
    g += `<rect x="-48" y="-48" width="96" height="96" transform="rotate(45)" fill="${C.gold}" ${ink(5)}/>
      <rect x="-30" y="-30" width="60" height="60" transform="rotate(45)" fill="${C.red}" ${ink(3)}/>
      <path d="M0,-22 V22 M-22,0 H22" stroke="${C.goldL}" stroke-width="7" stroke-linecap="round"/>`;
    return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
  }

  function hill(y, fill = C.green, amp = 40) {
    return `<path d="M-10,${y} Q150,${y - amp} 300,${y - amp * 0.3} T610,${y - amp * 0.5} V860 H-10 Z" fill="${fill}" ${ink(4)}/>`;
  }

  // Meskel daisies for the green hills.
  function flowers(n, y0, y1) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = R(20, 580), y = R(y0, y1);
      s += `<g transform="translate(${x},${y})">`;
      for (let k = 0; k < 6; k++) s += `<ellipse rx="3" ry="7" cy="-7" transform="rotate(${k * 60})" fill="${C.goldL}" stroke="${C.goldD}" stroke-width=".8"/>`;
      s += `<circle r="3.4" fill="${C.goldD}"/></g>`;
    }
    return s;
  }

  function crowd(list) { return list.map(person).join(''); }

  /* ---------- scenes ---------- */

  const SC = {};

  SC.michael = () => {
    seed = 3;
    return `<rect width="600" height="850" fill="url(#gIcon)"/>
      ${rays(300, 360, 760, 20, '#fff2a8', 0.28, 90)}
      ${glow(300, 360, 330)}
      ${cherub(95, 130, 1.05, 0)}${cherub(505, 130, 1.05, 1.6)}
      ${hill(735, C.green, 50)}${flowers(16, 740, 840)}
      ${cherub(80, 660, 0.85, 0.8)}${cherub(520, 660, 0.85, 2.3)}
      ${angel({ x: 300, y: 445, s: 1.5, ws: 0.93 })}`;
  };

  SC.prayer = (v) => {
    seed = 5;
    const ascend = v === 'ascend';
    let s = `<rect width="600" height="850" fill="url(#gSky)"/>${stars(46, 560)}${heaven(true)}`;
    if (ascend) s += throne(300, 86, 0.36);
    s += hill(730, '#17612f', 36) + flowers(8, 760, 840);
    // prayers rising
    for (let i = 0; i < 9; i++) {
      const x = R(120, 480);
      s += `<circle class="rise" cx="${x}" cy="650" r="${R(6, 12)}" fill="url(#gGlow)" style="animation-duration:${R(6, 9)}s;animation-delay:-${R(0, 9)}s"/>`;
    }
    if (ascend) {
      s += `<g class="ascend">${angel({ x: 300, y: 400, s: 0.82, arms: 'up', ws: 0.95, bob: false })}</g>`;
    } else {
      const xs = [150, 420, 280, 200, 400];
      for (let i = 0; i < 5; i++)
        s += `<text class="rise word" x="${xs[i]}" y="640" text-anchor="middle" font-size="46" fill="${C.goldL}" stroke="${C.ink}" stroke-width="1.2" ${FONT} style="animation-duration:9s;animation-delay:-${i * 1.8}s">ሃሌ ሉያ</text>`;
    }
    s += crowd([
      { x: 95, y: 735, s: 1.45, arms: 'up', trim: C.green, scarf: true },
      { x: 505, y: 735, s: 1.45, arms: 'up', trim: C.blue },
      { x: 200, y: 760, s: 1.6, arms: 'up', trim: C.red },
      { x: 400, y: 760, s: 1.6, arms: 'up', trim: C.goldD, scarf: true },
      { x: 300, y: 780, s: 1.75, arms: 'up', trim: C.green, turban: true, beard: true }
    ]);
    return s;
  };

  SC.trinity = () => {
    seed = 8;
    const ring = (cx, cy, d) => `<g class="pulse" style="animation-delay:-${d}s"><circle cx="${cx}" cy="${cy}" r="82" fill="#fff3bf" fill-opacity=".38" stroke="${C.ink}" stroke-width="22"/><circle cx="${cx}" cy="${cy}" r="82" fill="none" stroke="${C.gold}" stroke-width="15"/><circle cx="${cx}" cy="${cy}" r="82" fill="none" stroke="${C.red}" stroke-width="3"/></g>`;
    return `<rect width="600" height="850" fill="url(#gSky)"/>${stars(40, 520)}
      ${rays(300, 285, 640, 24, '#ffe9a0', 0.2, 100)}${glow(300, 285, 290)}
      ${ring(300, 205, 0)}${ring(230, 325, 1.3)}${ring(370, 325, 2.6)}
      <circle class="pulse" cx="300" cy="287" r="34" fill="#fffbe6"/>
      ${cherub(80, 100, 0.85, 0)}${cherub(520, 100, 0.85, 1.2)}${cherub(62, 400, 0.75, 2.2)}${cherub(538, 400, 0.75, 0.6)}
      ${cloud(110, 830, 1.5)}${cloud(490, 830, 1.5)}${cloud(300, 850, 1.7)}
      ${angel({ x: 160, y: 640, s: 0.8, ws: 0.62, arms: 'sword' })}
      ${angel({ x: 440, y: 640, s: 0.8, ws: 0.62, arms: 'pray', robe: C.blue, mantle: C.goldD })}
      ${cloud(140, 800, 1.1)}${cloud(460, 800, 1.1)}`;
  };

  SC.creation = () => {
    seed = 21;
    const tree = (x, y, sc, begin) => {
      let fr = '';
      for (const [fx, fy] of [[-34, -150], [28, -176], [4, -128], [-12, -190], [44, -134], [-50, -122]])
        fr += `<circle class="tw" cx="${fx}" cy="${fy}" r="7.5" fill="${C.goldL}" ${ink(1.5)} style="animation-delay:-${R(0, 3)}s"/>`;
      return `<g transform="translate(${x},${y}) scale(${sc})"><g transform="scale(0)">
        <animateTransform attributeName="transform" type="scale" values="0;1" dur="3s" begin="${begin}s" fill="freeze" calcMode="spline" keySplines=".2 .7 .3 1"/>
        <g><animateTransform attributeName="transform" type="rotate" values="-1.6;1.6;-1.6" dur="6s" repeatCount="indefinite" ${EASE}/>
          <path d="M-11,0 Q-5,-60 -8,-124 L8,-124 Q5,-60 11,0 Z" fill="#7a4a22" ${ink(3)}/>
          <circle cx="-42" cy="-132" r="40" fill="${C.green}" ${ink(3.5)}/><circle cx="42" cy="-132" r="40" fill="${C.green}" ${ink(3.5)}/>
          <circle cx="0" cy="-166" r="56" fill="${C.green}" ${ink(3.5)}/>
          <circle cx="-8" cy="-176" r="34" fill="${C.greenL}" opacity=".7"/>${fr}
        </g></g></g>`;
    };
    return `<rect width="600" height="850" fill="url(#gSky)"/>${stars(60, 600)}${heaven(true)}
      <circle cx="96" cy="250" r="34" fill="${C.goldL}" ${ink(3)}/>
      <path d="M520,222 a32,32 0 1 0 14,58 a26,26 0 1 1 -14,-58 Z" fill="${C.white}" ${ink(3)}/>
      <g class="riseUp">
        <ellipse cx="300" cy="960" rx="440" ry="290" fill="${C.green}" ${ink(4)}/>
        <path d="M60,760 Q300,640 540,760" fill="none" stroke="${C.greenL}" stroke-width="5" opacity=".6"/>
        ${flowers(12, 730, 840)}
        ${tree(132, 728, 1.0, 3)}${tree(468, 728, 1.0, 5)}${tree(300, 690, 1.3, 4)}
      </g>`;
  };

  SC.manna = (v) => {
    seed = 13;
    const tent = (x, y, sc, col) => `<g transform="translate(${x},${y}) scale(${sc})"><path d="M-64,0 L0,-84 L64,0 Z" fill="${col}" ${ink(3.5)}/><path d="M-32,0 L0,-84 L32,0" fill="none" stroke="${C.goldL}" stroke-width="6"/><path d="M-14,0 L0,-40 L14,0 Z" fill="${C.ink}"/></g>`;
    const basket = (x, y, sc) => `<g transform="translate(${x},${y}) scale(${sc})"><ellipse cx="0" cy="-22" rx="27" ry="9" fill="#fff" ${ink(2.5)}/><circle cx="-10" cy="-27" r="6" fill="#fff" ${ink(1.5)}/><circle cx="6" cy="-29" r="6.5" fill="#fff" ${ink(1.5)}/><path d="M-26,-22 L-19,12 Q0,18 19,12 L26,-22 Q0,-10 -26,-22 Z" fill="${C.goldD}" ${ink(3)}/><path d="M-23,-8 l6,8 l6,-8 l6,8 l6,-8 l6,8 l6,-8 l6,8" fill="none" stroke="${C.red}" stroke-width="3"/></g>`;
    let s = `<rect width="600" height="850" fill="url(#gDawn)"/>${glow(300, 200, 260)}`;
    if (v === 'lightning') {
      s += `<rect class="flash" width="600" height="850" fill="#fff" opacity=".5"/>
        <path class="flash" d="M110,150 L60,300 L96,296 L40,460 L130,270 L92,274 Z" fill="#fff8c0" ${ink(2.5)}/>
        <path class="flash" style="animation-delay:-2.2s" d="M490,150 L540,300 L504,296 L560,460 L470,270 L508,274 Z" fill="#fff8c0" ${ink(2.5)}/>`;
    }
    s += angel({ x: 300, y: 205, s: 0.85, arms: 'open', ws: 0.98 });
    s += cloud(170, 330, 1.25) + cloud(430, 330, 1.25) + cloud(300, 345, 1.45) + cloud(60, 300, 0.9) + cloud(545, 300, 0.9);
    s += `<path d="M-10,620 Q150,560 300,600 T610,575 V860 H-10 Z" fill="${C.sand}" ${ink(4)}/>`;
    if (v === 'rock') {
      s += `<path d="M18,720 L36,560 L104,512 L176,566 L196,720 Z" fill="#8b6f52" ${ink(4)}/><path d="M104,512 L96,600 L120,640" fill="none" stroke="${C.ink}" stroke-width="3" opacity=".6"/>
        <path d="M100,596 Q150,620 150,740" fill="none" stroke="${C.ink}" stroke-width="30" stroke-linecap="round"/>
        <path d="M100,596 Q150,620 150,740" fill="none" stroke="#3f86e8" stroke-width="24" stroke-linecap="round"/>
        <path class="flow" d="M100,596 Q150,620 150,740" fill="none" stroke="#d6ecff" stroke-width="5" stroke-linecap="round" stroke-dasharray="14 18"/>
        <path class="flow" style="animation-delay:-.5s" d="M92,600 Q138,626 140,740" fill="none" stroke="#d6ecff" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="10 22"/>
        <ellipse cx="170" cy="772" rx="118" ry="30" fill="#3f86e8" ${ink(3.5)}/>
        <ellipse class="ripple" cx="160" cy="770" rx="44" ry="10" fill="none" stroke="#d6ecff" stroke-width="3"/>
        <ellipse class="ripple" style="animation-delay:-1.2s" cx="160" cy="770" rx="44" ry="10" fill="none" stroke="#d6ecff" stroke-width="3"/>`;
    } else {
      s += tent(92, 640, 1.05, C.red);
    }
    s += tent(520, 628, 0.95, C.green);
    s += `<path d="M-10,720 Q200,670 380,712 T610,690 V860 H-10 Z" fill="${C.sandD}" ${ink(4)}/>`;
    for (let i = 0; i < 26; i++) s += `<circle cx="${R(10, 590)}" cy="${R(725, 840)}" r="${R(3, 5.5)}" fill="#fff" stroke="${C.ink}" stroke-width=".8"/>`;
    // the manna, falling white as frost
    for (let i = 0; i < 52; i++) {
      const x = R(40, 560), d = R(5, 9);
      s += `<circle class="fall" cx="${x}" cy="335" r="${R(4, 7.5)}" fill="#fff" stroke="${C.ink}" stroke-width="1" style="--d:${R(380, 480)}px;animation-duration:${d}s;animation-delay:-${R(0, d)}s"/>`;
    }
    const px = v === 'rock' ? 300 : 200;
    s += crowd([
      { x: px, y: 742, s: 1.5, arms: 'up', trim: C.red, scarf: true },
      { x: px + 115, y: 768, s: 1.65, arms: 'up', trim: C.green, turban: true, beard: true },
      { x: px + 225, y: 748, s: 1.45, arms: 'up', trim: C.blue },
      { x: px + 172, y: 800, s: 0.95, arms: 'up', trim: C.goldD }
    ]);
    s += basket(px + 58, 812, 1.25) + basket(px + 262, 814, 1.05);
    return s;
  };

  SC.wings = () => {
    seed = 17;
    return `<rect width="600" height="850" fill="url(#gSky)"/>${stars(50, 540)}
      ${rays(300, 270, 620, 20, '#ffe9a0', 0.16, 110)}${glow(300, 270, 280)}
      <path class="pulse" d="M190,250 L410,250 L570,850 L30,850 Z" fill="url(#gBeam)" opacity=".7"/>
      ${hill(745, '#17612f', 30)}${flowers(10, 770, 840)}
      ${crowd([
        { x: 120, y: 745, s: 1.4, arms: 'pray', trim: C.blue, scarf: true },
        { x: 480, y: 745, s: 1.4, arms: 'pray', trim: C.green },
        { x: 215, y: 765, s: 1.6, arms: 'up', trim: C.red, turban: true, beard: true },
        { x: 385, y: 765, s: 1.6, arms: 'up', trim: C.goldD, scarf: true },
        { x: 300, y: 795, s: 1.05, arms: 'up', trim: C.green },
        { x: 150, y: 805, s: 0.9, arms: 'pray', trim: C.red },
        { x: 450, y: 805, s: 0.9, arms: 'pray', trim: C.blue }
      ])}
      ${angel({ x: 300, y: 300, s: 1.22, arms: 'open', wings: 'spread', ws: 1.22 })}`;
  };

  SC.moses = () => {
    seed = 23;
    return `<rect width="600" height="850" fill="url(#gDusk)"/>${stars(26, 260)}
      <path d="M-10,860 V560 L120,470 L250,380 L330,402 L470,300 L610,380 V860 Z" fill="#8a5a33" ${ink(4)}/>
      <path d="M250,380 L290,520 L200,640 M470,300 L440,470 L520,560" fill="none" stroke="${C.ink}" stroke-width="3" opacity=".45"/>
      <path d="M-10,860 V700 Q160,640 330,676 T610,660 V860 Z" fill="#6f4526" ${ink(4)}/>
      <circle class="flare" cx="190" cy="430" r="300" fill="url(#gGlow)"/>
      <g class="recoil"><g transform="translate(486,470)">
        <path d="M-30,-40 C-90,-110 -120,-40 -130,10 C-100,-10 -90,10 -84,36 C-66,10 -50,10 -34,30 Z" fill="#241332" ${ink(3)}/>
        <path d="M30,-40 C90,-110 120,-40 130,10 C100,-10 90,10 84,36 C66,10 50,10 34,30 Z" fill="#241332" ${ink(3)}/>
        <path d="M-34,-50 Q0,-70 34,-50 L52,120 L30,96 L14,128 L0,98 L-14,128 L-30,96 L-52,120 Z" fill="#1a0f24" ${ink(3)}/>
        <path d="M-20,-104 L-34,-150 L-8,-118 Z M20,-104 L34,-150 L8,-118 Z" fill="#1a0f24" ${ink(2.5)}/>
        <circle cx="0" cy="-86" r="30" fill="#1a0f24" ${ink(3)}/>
        <path d="M-17,-92 l12,6 l-12,4 Z M17,-92 l-12,6 l12,4 Z" fill="#ff3b1f"/>
      </g></g>
      <g transform="translate(372,668) scale(1.35)">
        <circle cx="-128" cy="-6" r="31" fill="${C.gold}" ${ink(3)}/><circle cx="-128" cy="-6" r="25" fill="none" stroke="${C.red}" stroke-width="3"/>
        <path d="M-110,0 Q-120,-28 -90,-32 L80,-30 Q112,-26 110,0 Q112,22 80,24 L-90,26 Q-120,24 -110,0 Z" fill="${C.white}" ${ink(3.5)}/>
        <path d="M-60,-31 L-52,25 M-10,-31 L-2,24 M40,-30 L48,24" stroke="${C.red}" stroke-width="5"/>
        <circle cx="-128" cy="-6" r="18" fill="${C.skin}" ${ink(2.5)}/>
        <path d="M-145,-12 A18,18 0 0 1 -112,-14 Q-128,-22 -145,-12 Z" fill="${C.white}" ${ink(1.8)}/>
        <path d="M-142,0 Q-128,22 -114,0 Q-128,8 -142,0 Z" fill="${C.white}" ${ink(1.8)}/>
        <path d="M-137,-6 q4,3 8,0 M-127,-6 q4,3 8,0" fill="none" stroke="${C.ink}" stroke-width="1.8" stroke-linecap="round"/>
      </g>
      ${angel({ x: 190, y: 440, s: 0.98, ws: 0.85 })}`;
  };

  SC.icon = () => {
    seed = 29;
    const candle = (x) => `<g transform="translate(${x},0)">
      <path d="M-26,690 H26 L16,670 H-16 Z" fill="${C.gold}" ${ink(3)}/><rect x="-6" y="430" width="12" height="240" fill="${C.gold}" ${ink(3)}/>
      <path d="M-22,430 H22 L14,446 H-14 Z" fill="${C.gold}" ${ink(3)}/><rect x="-8" y="350" width="16" height="80" fill="${C.white}" ${ink(2.5)}/>
      <circle class="pulse" cx="0" cy="326" r="52" fill="url(#gGlow)"/>
      <path class="flame" d="M0,296 C16,318 13,338 0,350 C-13,338 -16,318 0,296 Z" fill="${C.goldL}" stroke="#e8641e" stroke-width="3"/>
    </g>`;
    return `<rect width="600" height="850" fill="url(#pWall)"/>
      <path d="M0,0 H600 V60 Q520,110 450,60 Q375,110 300,60 Q225,110 150,60 Q80,110 0,60 Z" fill="${C.green}" ${ink(4)}/>
      <path d="M0,0 H600 V34 Q520,78 450,34 Q375,78 300,34 Q225,78 150,34 Q80,78 0,34 Z" fill="${C.gold}" ${ink(3)}/>
      <rect y="690" width="600" height="160" fill="#5a1a12" ${ink(4)}/><rect y="716" width="600" height="18" fill="${C.gold}"/><rect y="744" width="600" height="14" fill="${C.green}"/>
      ${glow(300, 320, 330)}
      <path class="pulse" d="M190,520 L410,520 L500,850 L100,850 Z" fill="url(#gBeam)" opacity=".8"/>
      <rect x="140" y="96" width="320" height="432" rx="10" fill="${C.gold}" ${ink(5)}/>
      <rect x="158" y="114" width="284" height="396" fill="#f8cf52" ${ink(3)}/>
      <rect x="158" y="114" width="284" height="396" fill="none" stroke="${C.red}" stroke-width="5" stroke-dasharray="3 12"/>
      ${angel({ x: 300, y: 344, s: 0.82, ws: 0.6, wings: 'still', bob: false })}
      ${candle(72)}${candle(528)}
      <text class="oho" x="300" y="655" text-anchor="middle" font-size="76" fill="${C.goldL}" stroke="${C.ink}" stroke-width="2" ${FONT}>ኦሆ</text>
      ${crowd([
        { x: 205, y: 745, s: 1.75, arms: 'up', back: true, trim: C.green, scarf: true },
        { x: 395, y: 750, s: 1.85, arms: 'up', back: true, trim: C.red }
      ])}`;
  };

  SC.throne = () => {
    seed = 31;
    let rows = '';
    [[620, 5, 60, 120, 0.82], [712, 4, 120, 120, 0.9], [800, 5, 60, 120, 0.98]].forEach(([y, n, x0, dx, sc], r) => {
      for (let i = 0; i < n; i++) rows += cherub(x0 + i * dx, y, sc, (i * 0.7 + r) % 3.4);
    });
    return `<rect width="600" height="850" fill="url(#gSky)"/>${stars(50, 560)}
      ${rays(300, 280, 640, 22, '#ffe9a0', 0.2, 100)}
      ${cloud(110, 590, 1.3)}${cloud(490, 590, 1.3)}${cloud(300, 575, 1.2)}
      ${rows}
      <g class="liftUp">${glow(300, 280, 300)}${throne(300, 300, 1)}${angel({ x: 300, y: 308, s: 0.8, ws: 1.02 })}</g>`;
  };

  SC.sea = () => {
    seed = 37;
    const anim = (a) => `<animate attributeName="d" values="${a[0]};${a[1]}" dur="5.5s" begin="1.2s" fill="freeze" calcMode="spline" keySplines=".4 0 .2 1"/>`;
    const p = (a, attrs) => `<path d="${a[0]}" ${attrs}>${anim(a)}</path>`;
    const LW = ['M0,250 L300,250 L300,850 L0,850 Z', 'M0,250 L283,250 L95,850 L0,850 Z'];
    const RW = ['M600,250 L300,250 L300,850 L600,850 Z', 'M600,250 L317,250 L505,850 L600,850 Z'];
    const LF = ['M300,250 L300,250 L300,850 L300,850 Z', 'M283,250 L289,250 L165,850 L95,850 Z'];
    const RF = ['M300,250 L300,250 L300,850 L300,850 Z', 'M317,250 L311,250 L435,850 L505,850 Z'];
    const LE = ['M300,250 L300,850', 'M283,250 L95,850'];
    const RE = ['M300,250 L300,850', 'M317,250 L505,850'];

    let waves = '';
    for (let y = 276, k = 0; y < 850; y += 30, k++) {
      let d = `M-120,${y}`;
      for (let i = 0; i < 21; i++) d += ' q10,-9 20,0 t20,0';
      waves += `<path class="drift" style="animation-delay:-${(k % 4) * 1.3}s;animation-direction:${k % 2 ? 'alternate' : 'alternate-reverse'}" d="${d}" fill="none" stroke="#a9ccff" stroke-width="${2 + k * 0.12}" opacity=".6"/>`;
    }
    const fish = (x, y, sc, d) => `<g transform="translate(${x},${y}) scale(${sc})"><g class="swim" style="animation-delay:-${d}s"><path d="M-18,0 Q0,-12 18,0 Q0,12 -18,0 Z M18,0 l12,-9 v18 Z" fill="${C.gold}" ${ink(2)}/><circle cx="-9" cy="-2" r="1.8" fill="${C.ink}"/></g></g>`;

    let walkers = '';
    const cols = [C.red, C.green, C.blue, C.goldD];
    for (let i = 8; i >= 0; i--) { // farthest first, so nearer walkers overlap them
      walkers += `<g class="walk" style="--dx:${[-52, 40, -10, 58, -38, 14, -60, 46, 0][i]}px;animation-delay:-${(i * 18 / 9).toFixed(2)}s">${person({ back: true, trim: cols[i % 4], scarf: i % 3 === 1, arms: 'down' })}</g>`;
    }

    return `<clipPath id="cSea">${p(LW, '')}${p(RW, '')}</clipPath>
      <rect width="600" height="850" fill="url(#gDusk)"/>${stars(24, 200)}
      ${glow(300, 250, 190)}
      <rect y="250" width="600" height="600" fill="${C.sand}"/>
      <path d="M300,250 L120,850 M300,250 L480,850 M300,250 L300,850" stroke="${C.sandD}" stroke-width="3" opacity=".6"/>
      ${walkers}
      ${p(LW, 'fill="url(#gSea)"')}${p(RW, 'fill="url(#gSea)"')}
      <g clip-path="url(#cSea)">${waves}${fish(48, 560, 1, 0)}${fish(555, 640, 1.1, 2)}${fish(70, 760, 1.3, 3.5)}${fish(540, 440, 0.8, 1)}</g>
      ${p(LF, `fill="#0b2a66" ${ink(3)}`)}${p(RF, `fill="#0b2a66" ${ink(3)}`)}
      ${p(LE, `class="foam" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-dasharray="1 22"`)}
      ${p(RE, `class="foam" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round" stroke-dasharray="1 22"`)}
      <path d="M0,250 H600" stroke="${C.ink}" stroke-width="3"/>
      <path class="pulse" d="M272,190 L328,190 L440,850 L160,850 Z" fill="url(#gBeam)" opacity=".75"/>
      ${cloud(190, 222, 0.8)}${cloud(410, 222, 0.8)}
      ${angel({ x: 300, y: 152, s: 0.56, ws: 1.1 })}`;
  };

  SC.incense = () => {
    seed = 41;
    let smoke = '';
    for (let i = 0; i < 16; i++) {
      const d = R(7, 11);
      smoke += `<circle class="puff" cx="${R(294, 316)}" cy="640" r="${R(13, 22)}" fill="#fffaf0" style="--sx:${R(-70, 70)}px;animation-duration:${d}s;animation-delay:-${R(0, d)}s"/>`;
    }
    return `<rect width="600" height="850" fill="url(#gSky)"/>${stars(46, 520)}${heaven(true)}
      ${angel({ x: 300, y: 186, s: 0.62, arms: 'open', ws: 1 })}
      ${cloud(190, 276, 1.0)}${cloud(410, 276, 1.0)}${cloud(300, 290, 1.15)}
      <rect y="750" width="600" height="100" fill="#5a1a12" ${ink(4)}/><rect y="770" width="600" height="14" fill="${C.gold}"/><rect y="794" width="600" height="10" fill="${C.green}"/>
      ${smoke}
      ${limb(196, 610, 300, 520, 14, C.white)}${hand(303, 517, 9)}
      ${person({ x: 160, y: 700, s: 2.1, trim: C.red, turban: true, beard: true })}
      <path d="M118,610 Q160,590 202,610 L190,650 Q160,640 130,650 Z" fill="${C.green}" ${ink(3)}/>
      <g transform="translate(303,520)"><g>
        <animateTransform attributeName="transform" type="rotate" values="-13;13;-13" dur="2.8s" repeatCount="indefinite" ${EASE}/>
        <path d="M0,0 L-22,96 M0,0 L0,84 M0,0 L22,96" stroke="${C.gold}" stroke-width="2.6"/>
        <circle cx="-11" cy="48" r="4" fill="${C.gold}" ${ink(1.2)}/><circle cx="11" cy="48" r="4" fill="${C.gold}" ${ink(1.2)}/><circle cx="0" cy="60" r="4" fill="${C.gold}" ${ink(1.2)}/>
        <path d="M0,58 V70 M-6,64 H6" stroke="${C.gold}" stroke-width="3"/>
        <path d="M-26,98 Q0,64 26,98 Z" fill="${C.gold}" ${ink(3)}/><circle cx="-9" cy="88" r="2.6" fill="${C.ink}"/><circle cx="9" cy="88" r="2.6" fill="${C.ink}"/><circle cx="0" cy="80" r="2.6" fill="${C.ink}"/>
        <path d="M-31,98 Q-31,138 0,142 Q31,138 31,98 Z" fill="${C.gold}" ${ink(3)}/><path d="M-27,112 Q0,122 27,112" fill="none" stroke="${C.red}" stroke-width="4"/>
        <path d="M-14,142 H14 L18,154 H-18 Z" fill="${C.gold}" ${ink(2.5)}/>
        <circle class="pulse" cx="0" cy="98" r="30" fill="url(#gGlow)"/>
      </g></g>
      ${crowd([
        { x: 440, y: 735, s: 1.5, arms: 'up', trim: C.blue, scarf: true },
        { x: 530, y: 755, s: 1.4, arms: 'up', trim: C.green }
      ])}`;
  };

  SC.host = () => {
    seed = 43;
    let ring = '';
    const n = 10;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2 + Math.PI / n;
      ring += cherub(300 + 236 * Math.cos(a), 425 + 345 * Math.sin(a), 0.66, (i * 0.55) % 3.4);
    }
    return `<rect width="600" height="850" fill="url(#gSky)"/>${stars(40, 840)}
      <rect class="flash" width="600" height="850" fill="#fff" opacity=".35"/>
      ${rays(300, 400, 720, 24, '#ffe9a0', 0.22, 90)}${glow(300, 400, 330)}
      <path class="flash" d="M120,250 L84,372 L112,368 L70,500 L140,346 L110,350 Z" fill="#fff8c0" ${ink(2.5)}/>
      <path class="flash" style="animation-delay:-2.2s" d="M480,250 L516,372 L488,368 L530,500 L460,346 L490,350 Z" fill="#fff8c0" ${ink(2.5)}/>
      ${ring}
      ${angel({ x: 300, y: 470, s: 1.22, ws: 0.9, robe: C.green, mantle: C.gold, shine: true })}`;
  };

  SC.kneel = () => {
    seed = 47;
    let drops = '';
    for (let i = 0; i < 26; i++) {
      const d = R(5, 8);
      drops += `<circle class="fall" cx="${R(110, 490)}" cy="250" r="${R(4, 7)}" fill="${C.goldL}" style="--d:${R(430, 520)}px;animation-duration:${d}s;animation-delay:-${R(0, d)}s"/>`;
    }
    return `<rect width="600" height="850" fill="url(#gSky)"/>${stars(40, 600)}
      ${rays(300, 150, 560, 22, '#ffe9a0', 0.25, 90)}${glow(300, 150, 250)}
      <path class="pulse" d="M210,240 L390,240 L560,850 L40,850 Z" fill="url(#gBeam)" opacity=".8"/>
      ${throne(300, 152, 0.56)}
      ${cloud(150, 262, 1.0)}${cloud(450, 262, 1.0)}
      ${cherub(70, 110, 0.8, 0)}${cherub(530, 110, 0.8, 1.5)}
      ${drops}
      <path d="M-10,735 Q300,690 610,735 V860 H-10 Z" fill="#3b2a1c" ${ink(4)}/>
      ${angel({ x: 285, y: 480, s: 1.02, ws: 0.8, arms: 'pray', kneel: true, bob: false, wings: 'flap' })}
      ${crowd([
        { x: 80, y: 770, s: 1.3, arms: 'pray', trim: C.red, scarf: true },
        { x: 190, y: 785, s: 1.4, arms: 'pray', trim: C.green },
        { x: 300, y: 792, s: 1.35, arms: 'pray', trim: C.blue, turban: true, beard: true },
        { x: 410, y: 785, s: 1.4, arms: 'pray', trim: C.goldD, scarf: true },
        { x: 520, y: 770, s: 1.3, arms: 'pray', trim: C.red }
      ])}`;
  };

  SC.cross = () => {
    seed = 53;
    return `<rect width="600" height="850" fill="url(#gIcon)"/>
      ${rays(300, 300, 760, 20, '#fff2a8', 0.3, 90)}${glow(300, 300, 320)}
      ${cherub(90, 120, 0.95, 0)}${cherub(510, 120, 0.95, 1.4)}${cherub(80, 470, 0.85, 2.4)}${cherub(520, 470, 0.85, 0.7)}
      ${hill(760, C.green, 40)}${flowers(14, 770, 840)}
      <g transform="translate(300,760)">
        <rect x="-112" y="-70" width="224" height="100" fill="${C.white}" ${ink(4)}/>
        <path d="M-22,30 V-22 Q0,-50 22,-22 V30 Z" fill="${C.redD}" ${ink(3)}/>
        <path d="M-84,-40 h30 v36 h-30 Z M54,-40 h30 v36 h-30 Z" fill="${C.blue}" ${ink(2.5)}/>
        <path d="M-142,-70 L0,-170 L142,-70 Z" fill="${C.goldD}" ${ink(4)}/>
        <path d="M-70,-70 L0,-170 L70,-70 M0,-170 V-70" fill="none" stroke="${C.ink}" stroke-width="2" opacity=".5"/>
      </g>
      <g class="bob">${ethCross(300, 300, 1.12)}</g>`;
  };

  window.PAINT = { angel, cherub, throne, ethCross, DEFS, C };
  window.PAINTED = {
    render(key) {
      const [name, variant] = String(key || 'michael').split(':');
      const fn = SC[name] || SC.michael;
      return `<svg viewBox="0 0 600 850" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">${DEFS}${fn(variant)}</svg>`;
    }
  };
})();
