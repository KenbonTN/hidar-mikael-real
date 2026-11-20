// Small WebGL runner: one full-screen fragment shader at a time, with automatic quality
// reduction if the computer driving the TV can't keep up.
window.GL = (function () {
  'use strict';
  const cv = document.getElementById('gl');
  let gl = null;
  try { gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' }); } catch (e) { /* no WebGL */ }
  if (!gl) return { ok: false };

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const VS = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  const cache = new Map();

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
    return s;
  }

  function program(src) {
    if (cache.has(src)) return cache.get(src);
    let info = null;
    const vs = compile(gl.VERTEX_SHADER, VS), fs = compile(gl.FRAGMENT_SHADER, src);
    if (vs && fs) {
      const p = gl.createProgram();
      gl.attachShader(p, vs); gl.attachShader(p, fs);
      gl.bindAttribLocation(p, 0, 'a');
      gl.linkProgram(p);
      if (gl.getProgramParameter(p, gl.LINK_STATUS)) {
        info = { p, uRes: gl.getUniformLocation(p, 'uRes'), uT: gl.getUniformLocation(p, 'uT'), uP: gl.getUniformLocation(p, 'uP') };
      } else console.error(gl.getProgramInfoLog(p));
    }
    cache.set(src, info);
    return info;
  }

  let cur = null, base = .8, quality = 1, start = performance.now(), last = start, frames = 0, acc = 0;
  const t0 = start;

  function size() {
    const r = cv.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = r.width * dpr * base * quality, h = r.height * dpr * base * quality;
    const max = 1100 * base;
    if (w > max) { h *= max / w; w = max; }
    w = Math.max(64, Math.round(w)); h = Math.max(64, Math.round(h));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!cur) return;
    const dt = now - last; last = now;
    if (dt < 250) {
      acc += dt; frames++;
      if (frames >= 45) {
        const avg = acc / frames;
        if (avg > 26 && quality > .4) { quality *= .85; size(); }
        else if (avg < 17.5 && quality < 1) { quality = Math.min(1, quality * 1.06); size(); }
        frames = 0; acc = 0;
      }
    }
    gl.viewport(0, 0, cv.width, cv.height);
    gl.useProgram(cur.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(cur.uRes, cv.width, cv.height);
    gl.uniform1f(cur.uT, ((now - t0) / 1000) % 1200);
    gl.uniform1f(cur.uP, (now - start) / 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  requestAnimationFrame(frame);
  window.addEventListener('resize', size);

  return {
    ok: true,
    use(src, scale) {
      const p = program(src);
      if (!p) return false;
      cur = p; base = scale || .8; start = performance.now();
      size();
      return true;
    },
    prepare(src) { program(src); }
  };
})();
