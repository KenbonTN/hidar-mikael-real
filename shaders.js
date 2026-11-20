// Realistic backgrounds, rendered live with WebGL.
// UBER draws skies, clouds, light, land, interiors and smoke; each scene switches parts on with #defines.
// SEA ray-marches the Red Sea parting, seen from the dry road between the walls of water.
(function () {
  'use strict';

  const PRE = `
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform float uP;
float sq(float x){ return x*x; }
float h11(float n){ return fract(sin(n*12.9898)*43758.5453); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float vn(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1.,0.)), u.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), u.x), u.y);
}
const mat2 M2 = mat2(1.6,1.2,-1.2,1.6);
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<6;i++){ s += a*vn(p); p = M2*p; a *= .5; } return s; }
float fbm3(vec2 p){ float a=.5, s=0.; for(int i=0;i<3;i++){ s += a*vn(p); p = M2*p; a *= .5; } return s; }
vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14), 0., 1.); }
`;

  const UBER = `
#ifndef HORIZON
#define HORIZON .3
#endif
#ifndef SKY_TOP
#define SKY_TOP vec3(.15,.3,.62)
#endif
#ifndef SKY_HOR
#define SKY_HOR vec3(.9,.75,.6)
#endif
#ifndef SUN
#define SUN vec2(.5,.4)
#endif
#ifndef SUN_COL
#define SUN_COL vec3(1.,.8,.5)
#endif
#ifndef SUN_STR
#define SUN_STR 1.
#endif
#ifndef CLOUD_COVER
#define CLOUD_COVER .5
#endif
#ifndef CLOUD_SCALE
#define CLOUD_SCALE .5
#endif
#ifndef CLOUD_LIT
#define CLOUD_LIT vec3(1.,.9,.8)
#endif
#ifndef CLOUD_DARK
#define CLOUD_DARK vec3(.4,.4,.5)
#endif
#ifndef CLOUD_ALPHA
#define CLOUD_ALPHA .92
#endif
#ifndef RAYP
#define RAYP SUN
#endif
#ifndef RAY_COL
#define RAY_COL vec3(1.,.88,.6)
#endif
#ifndef RAY_STR
#define RAY_STR .5
#endif
#ifndef LAND_COL
#define LAND_COL vec3(.2,.3,.15)
#endif
#ifndef LAND_SHADE
#define LAND_SHADE vec3(.06,.08,.05)
#endif
#ifndef LAND_AMP
#define LAND_AMP .12
#endif
#ifndef LAND_STEP
#define LAND_STEP .05
#endif
#ifndef LAND_HAZE
#define LAND_HAZE .55
#endif
#ifndef LAND_LITDIR
#define LAND_LITDIR 1.
#endif
#ifndef MIST
#define MIST .4
#endif
#ifndef CS_H
#define CS_H .3
#endif
#ifndef CS_LIT
#define CS_LIT vec3(1.,.95,.85)
#endif
#ifndef CS_DARK
#define CS_DARK vec3(.6,.5,.45)
#endif
#ifndef EXPOSURE
#define EXPOSURE 1.
#endif
#ifndef SMOKE_X
#define SMOKE_X .5
#endif
#ifndef SMOKE_Y
#define SMOKE_Y .26
#endif

float landH(float x, float fi){
#if defined(LAND_DUNES)
  float s = x*.7 + .35*sin(x*.9 + fi*1.7);
  float f = fract(s);
  float d = f < .72 ? f/.72 : (1.-f)/.28;
  d = d*d*(3.-2.*d);
  return d*.75 + .35*fbm3(vec2(x*1.1, fi*3.));
#elif defined(LAND_MOUNTAINS)
  float r = 0., a = .55;
  vec2 p = vec2(x*.9, fi*5.3);
  for(int i=0;i<4;i++){ r += a*(1.-abs(vn(p)*2.-1.)); p *= 2.07; a *= .45; }
  return r*.95;
#else
  return fbm3(vec2(x*.55, fi*4.1))*1.25;
#endif
}

void main(){
  vec2 uv = gl_FragCoord.xy/uRes;
  float asp = uRes.x/uRes.y;
  vec2 q = vec2((uv.x-.5)*asp, uv.y);
  vec2 sv = (uv-SUN)*vec2(asp,1.);
  float dsun = length(sv);
  float flash = 0.;
  float beam = 0.;
#ifdef LIGHTNING
  float cyc = mod(uT, 6.);
  flash = step(3.,cyc)*step(cyc,3.07) + .7*step(3.18,cyc)*step(cyc,3.3) + .45*step(3.38,cyc)*step(cyc,3.52);
#endif
  vec3 col;

#ifdef INTERIOR
  col = mix(vec3(.035,.02,.012), vec3(.1,.055,.03), uv.y);
  col *= .7 + .6*fbm(uv*vec2(5.,7.));
  for(int i=0;i<16;i++){
    float fi = float(i);
    vec2 c = vec2(h11(fi*3.17+1.), .3+.65*h11(fi*7.71+2.));
    float r = .025 + .045*h11(fi*1.37+3.);
    float d = length((uv-c)*vec2(asp,1.));
    float fl = .75 + .25*sin(uT*(2.+h11(fi*5.)*3.) + fi*2.);
    col += vec3(1.,.62,.28)*smoothstep(r, r*.8, d)*.07*fl + vec3(1.,.55,.22)*exp(-d*d/(r*r*5.))*.06*fl;
  }
  if(uv.y < .18){
    col = mix(vec3(.1,.025,.015), vec3(.22,.06,.03), fbm(uv*vec2(30.,60.)));
    col *= .45 + uv.y/.18*.6;
  }
#else
  float sy = clamp((uv.y-HORIZON)/(1.-HORIZON), 0., 1.);
  col = mix(SKY_HOR, SKY_TOP, pow(sy, .55));
  col += SUN_COL*SUN_STR*(exp(-dsun*dsun*900.)*3. + exp(-dsun*7.)*.45 + exp(-dsun*2.2)*.22);

#ifdef STARS
  for(int L=0;L<2;L++){
    float sc = L==0 ? 90. : 220.;
    vec2 sp = vec2(uv.x*asp, uv.y)*sc;
    vec2 id = floor(sp);
    vec2 f = fract(sp)-.5;
    float hh = h21(id + float(L)*17.);
    float th = L==0 ? .94 : .9;
    if(hh > th){
      vec2 o = vec2(h21(id+3.1), h21(id+7.7))-.5;
      float d = length(f-o*.7);
      float tw = .55 + .45*sin(uT*(1.5+hh*3.) + hh*60.);
      float b = (hh-th)/(1.-th);
      col += vec3(1.,.93,.85)*smoothstep(.16,0.,d)*b*tw*(L==0 ? 1.6 : .8)*smoothstep(HORIZON, HORIZON+.15, uv.y);
    }
  }
  {
    float mwd = fbm(vec2(uv.x*2.5+uv.y*1.4, uv.y*2.2-uv.x*.8)*2.);
    float band = exp(-sq((uv.y-.62-(uv.x-.5)*.55)*3.5));
    float hz = smoothstep(HORIZON, HORIZON+.2, uv.y);
    col += vec3(.3,.32,.48)*band*smoothstep(.35,.85,mwd)*.55*hz + vec3(.08,.06,.12)*band*.5*hz;
  }
#endif

#ifdef HEAVEN
  {
    vec2 hv = (uv-vec2(.5,1.04))*vec2(asp*.7, 1.);
    float hd = length(hv);
    col += vec3(1.,.86,.58)*exp(-hd*hd*16.)*1.1;
    float bx = abs(uv.x-.5)*asp;
    float bw = .12 + (1.-uv.y)*.3;
    col += vec3(1.,.9,.62)*smoothstep(bw, 0., bx)*.09*(.7+.3*vn(vec2(uv.x*18., uT*.3)))*smoothstep(HORIZON, 1., uv.y+.3);
  }
#endif

#ifdef CLOUDS
  {
    float yy = uv.y - HORIZON;
    if(yy > 0.){
      float z = 1./(yy+.12);
      vec2 pc = vec2(q.x*z, z)*CLOUD_SCALE*5. + vec2(uT*.06, uT*.02);
      float d = fbm(pc);
      vec2 toS = normalize(sv+.0001);
      float d2 = fbm(pc - toS*.35);
      float den = smoothstep(CLOUD_COVER, CLOUD_COVER+.3, d);
      float lit = clamp(.5 + (d-d2)*4., 0., 1.);
      vec3 cc = mix(CLOUD_DARK, CLOUD_LIT, lit);
      cc += SUN_COL*SUN_STR*exp(-dsun*4.)*(1.-den)*1.1;
      cc *= 1. + flash*2.2;
      col = mix(col, cc, den*CLOUD_ALPHA*smoothstep(0.,.06,yy));
    }
  }
#endif

#ifdef RAYS
  {
    vec2 rv = (uv-RAYP)*vec2(asp,1.);
    float r = length(rv);
    vec2 dir = rv/(r+.0001);
    float n1 = vn(dir*7. + vec2(uT*.12, 0.));
    float n2 = vn(dir*17. - vec2(0., uT*.09));
    float ray = sq(n1*n2*1.6);
    col += RAY_COL*ray*RAY_STR*exp(-r*1.4)*smoothstep(0.,.05,r)*(1.+flash);
  }
#endif

#ifdef RINGS
  {
    vec2 rc = vec2(0., .66);
    float pul = .8 + .2*sin(uT*1.3);
    for(int i=0;i<3;i++){
      float a = 1.5708 + 6.2832*float(i)/3.;
      vec2 c = rc + vec2(cos(a), sin(a))*.085;
      float d = abs(length(q-c)-.125);
      col += vec3(1.,.86,.55)*(exp(-d*d*9000.)*1.8 + exp(-d*45.)*.35)*pul;
    }
    col += vec3(1.,.95,.8)*exp(-length(q-rc)*18.)*1.2;
  }
#endif

#ifdef LIGHTNING
  {
    float sL = floor(uT/6.);
    float bx = .2 + .6*h11(sL*1.7+.3);
    float x0 = bx + (fbm3(vec2(uv.y*5., sL*3.))-.5)*.3 + (vn(vec2(uv.y*40., sL))-.5)*.035;
    float dd = abs(uv.x-x0)*asp;
    float bolt = (exp(-dd*dd*30000.)*2.5 + exp(-dd*50.)*.35)*step(.4, uv.y);
    col += vec3(.85,.9,1.)*bolt*flash;
  }
#endif

#ifdef CLOUDSEA
  if(uv.y < CS_H){
    float yy = CS_H - uv.y;
    vec2 pc = vec2(q.x/(yy+.04), 1./(yy+.04))*.9 + vec2(0., uT*.12);
    float d = fbm(pc);
    float d2 = fbm(pc + vec2(0., -.15));
    float lit = clamp(.55 + (d-d2)*2.5, 0., 1.);
    vec3 cc = mix(CS_DARK, CS_LIT, lit)*(.65 + .55*d);
    cc = mix(cc, SKY_HOR*1.05, exp(-yy*14.));
    col = mix(col, cc, smoothstep(0., .015, yy));
  }
#endif

#ifdef LAND
  for(int i=0;i<4;i++){
    float fi = float(i);
    float k = fi/3.;
    float base = HORIZON - fi*LAND_STEP;
    float x = uv.x*(1.3+fi*.9) + fi*7.31;
    float amp = LAND_AMP*(.6+.6*k);
    float h = base + amp*(landH(x, fi)-.3);
    if(uv.y < h){
      float sl = landH(x+.02, fi) - landH(x-.02, fi);
      float lit = clamp(.55 + sl*LAND_LITDIR*8., 0., 1.);
      vec2 tp = vec2(uv.x*asp, uv.y)*(7.+fi*3.) + fi*4.3;
      float face = fbm3(tp + vec2(fbm3(tp*1.7)*1.5, 0.));
      float lit2 = clamp(.42 + (face - fbm3(tp + vec2(.06*LAND_LITDIR, -.04)))*2.2 + (face-.5)*.35, .22, .8);
      lit = mix(lit, lit2, smoothstep(0., .035, h-uv.y));
      vec3 lc = mix(LAND_SHADE, LAND_COL, lit);
      lc *= .88 + .2*vn(vec2(uv.x*asp, uv.y)*(90.+fi*40.));
      lc *= .8 + .4*fbm3(vec2(uv.x*asp, uv.y)*(14.+fi*6.) + fi);
      lc = mix(lc, SKY_HOR, (1.-k)*LAND_HAZE);
      lc += SUN_COL*SUN_STR*.22*exp(-(h-uv.y)*300.)*(1.-k*.5);
      col = lc;
    }
    col = mix(col, SKY_HOR, MIST*exp(-abs(uv.y-(base-.01))*30.)*.35*(1.-k));
  }
#endif
#endif

#ifdef BEAM
  {
    vec2 bp = (uv - vec2(.12, 1.02))*vec2(asp,1.);
    vec2 dir = normalize(vec2(.42,-1.));
    float along = dot(bp, dir);
    float perp = abs(dot(bp, vec2(-dir.y, dir.x)));
    float w = .05 + along*.13;
    beam = smoothstep(w, w*.25, perp)*smoothstep(0., .1, along)*(.85 + .15*vn(vec2(perp*30., uT*.2)));
    col += vec3(1.,.84,.58)*beam*.2;
    vec2 mp = uv*vec2(asp,1.)*60. + vec2(0., -uT*.6);
    float mote = smoothstep(.985, 1., h21(floor(mp)))*smoothstep(.35, 0., length(fract(mp)-.5));
    col += vec3(1.,.9,.7)*mote*beam*1.5;
  }
#endif

#ifdef SMOKE
  {
    vec2 sp = vec2((uv.x-SMOKE_X)*asp, uv.y-SMOKE_Y);
    float hgt = max(sp.y, 0.);
    float w = .03 + hgt*.38;
    vec2 wp = vec2(sp.x*3., sp.y*2.5 - uT*.25);
    wp.x += (fbm3(wp*1.3 + vec2(0., uT*.1))-.5)*1.8;
    float n = fbm(wp*2.);
    float plume = exp(-sq(sp.x/w))*smoothstep(0.,.03,sp.y)*smoothstep(.78,.2,hgt);
    float dens = smoothstep(.35,.85,n)*plume;
    vec3 sc = vec3(.5,.48,.46) + vec3(1.,.85,.6)*beam*1.8;
    col = mix(col, sc, dens*.8);
  }
#endif

  col += flash*vec3(.22,.25,.38);
  vec2 vv = uv-.5;
  col *= 1. - dot(vv,vv)*.55;
  col = aces(col*EXPOSURE);
  col += (h21(gl_FragCoord.xy + fract(uT*.37)*311.)-.5)*.018;
  gl_FragColor = vec4(col, 1.);
}
`;

  const SEA = `
#define WL 3.2
#define FL -3.
float GAP;
vec3 SUND;

float waves(vec2 p){
  return .16*sin(p.x*.7 + uT*1.2 + sin(p.y*.35)) + .11*sin(p.y*.9 - uT*1.4 + p.x*.25) + .07*sin((p.x+p.y)*1.7 + uT*2.);
}
float wallG(vec3 p){
  float t = clamp((p.y-FL)/(WL-FL), 0., 1.);
  return GAP - .6*t*t*t + .05*sin(p.z*.53 + p.y*.7 + uT*1.5) + .035*sin(p.z*1.37 - p.y*1.9 + uT*2.7) + .025*sin(p.z*3.1 + p.y*2.3 - uT*3.1);
}
float floorH(vec2 p){
  return FL + .06*sin(p.x*1.3 + sin(p.y*.4)) + .05*sin(p.y*.7) + smoothstep(45.,85.,p.y)*5.5;
}
float sdW(vec3 p){
  float crest = .5*exp(-sq(abs(p.x)-GAP)*1.2);
  float top = p.y - (WL + waves(p.xz) + crest);
  float side = wallG(p) - abs(p.x);
  return max(top, side);
}
float map(vec3 p, out float m){
  float a = sdW(p);
  float b = p.y - floorH(p.xz);
  m = a < b ? 1. : 2.;
  return min(a, b);
}
vec3 nor(vec3 p){
  vec2 e = vec2(.008, 0.);
  float m;
  return normalize(vec3(map(p+e.xyy,m)-map(p-e.xyy,m), map(p+e.yxy,m)-map(p-e.yxy,m), map(p+e.yyx,m)-map(p-e.yyx,m)));
}
vec3 sky(vec3 rd){
  float y = max(rd.y, 0.);
  vec3 c = mix(vec3(1.,.66,.42), vec3(.18,.32,.62), pow(y, .45));
  float s = max(dot(rd, SUND), 0.);
  c += vec3(1.,.62,.32)*pow(s,6.)*.35 + vec3(1.,.85,.6)*pow(s,64.)*.45 + vec3(1.,.95,.85)*pow(s,900.)*5.;
  if(rd.y > 0.){
    vec2 cp = rd.xz/(rd.y+.05)*.25 + vec2(uT*.01, uT*.02);
    float d = fbm(cp);
    float den = smoothstep(.5,.8,d)*smoothstep(0.,.15,rd.y);
    vec3 cc = mix(vec3(.45,.35,.42), vec3(1.,.78,.6), pow(s,3.)*.7 + .3);
    c = mix(c, cc, den*.85);
  }
  float az = atan(rd.x, rd.z);
  float hh = .015 + .04*fbm3(vec2(az*3. + 1.7, 2.));
  if(rd.y < hh) c = mix(c, vec3(.5,.36,.38)*(.8+.4*s), .85);
  return c;
}

void main(){
  GAP = mix(.8, 3., smoothstep(.3, 7., uP));
  SUND = normalize(vec3(0., .1, 1.));
  vec2 q = (gl_FragCoord.xy - .5*uRes)/uRes.y;
  vec3 ro = vec3(sin(uT*.25)*.06, FL+1.75, -6.);
  vec3 rd = normalize(vec3(q, 1.25));

  float t = 0., m = 0.;
  bool hit = false;
  for(int i=0;i<110;i++){
    vec3 p = ro + rd*t;
    float mm;
    float d = map(p, mm);
    if(d < .002*t + .001){ hit = true; m = mm; break; }
    t += d*.7;
    if(t > 160.) break;
  }

  vec3 col;
  if(!hit){
    col = sky(rd);
  } else {
    vec3 p = ro + rd*t;
    vec3 n = nor(p);
    if(m > 1.5){
      float wet = smoothstep(GAP-1.4, GAP-.1, abs(p.x));
      vec3 sand = mix(vec3(.52,.4,.28), vec3(.2,.16,.12), wet)*(.7 + .45*fbm(p.xz*vec2(1.5,1.)));
      sand *= .9 + .1*sin(p.z*6. + sin(p.x*3.)*2.);
      float dif = clamp(dot(n, SUND), 0., 1.);
      float occ = .55 + .45*smoothstep(GAP, 0., abs(p.x));
      col = sand*(vec3(1.,.8,.6)*dif*1.2 + vec3(.35,.45,.6)*.6*occ);
      vec3 r = reflect(rd, n);
      float fr = pow(1.-max(dot(-rd,n),0.), 4.);
      float puddle = smoothstep(.62,.75,fbm(p.xz*.6)) + wet*.3;
      col = mix(col, sky(r)*.8, clamp(puddle*(.2+.5*fr), 0., .45));
      float ca = pow(abs(sin(p.z*3. + uT*2. + fbm3(p.xz*2.)*6.)), 8.);
      col += vec3(.2,.55,.55)*ca*wet*.25;
    } else {
      float hgt = clamp((p.y-FL)/(WL-FL), 0., 1.);
      vec3 r = reflect(rd, n);
      float fr = .03 + .97*pow(1.-max(dot(-rd,n),0.), 5.);
      float spec = pow(max(dot(r, SUND),0.), 120.)*4.;
      if(n.y > .55){
        col = mix(vec3(0.,.06,.12), sky(r)*.8, fr*.6) + vec3(1.,.85,.6)*spec;
      } else {
        vec3 body = mix(vec3(0.,.02,.06), vec3(.0,.24,.34), pow(hgt, 1.6));
        float sss = pow(max(dot(rd, SUND),0.), 3.)*hgt;
        body += vec3(.05,.55,.5)*sss*.55;
        float st = fbm(vec2(p.z*.9 + fbm3(p.zy*.5)*2., p.y*1.6 + uT*1.4));
        body *= .55 + .9*st;
        body += vec3(.05,.4,.42)*pow(hgt, 8.)*.9;
        col = mix(body, sky(r)*.7, min(fr*.22, .25)) + vec3(1.,.9,.7)*spec*.5;
      }
      float fo = smoothstep(WL-.3, WL+.4, p.y)*smoothstep(.45,.7,fbm(vec2(p.z*2.2+p.x, p.y*3. + uT*2.5)));
      col = mix(col, vec3(.92,.95,.97), fo*.85);
      float bf = smoothstep(FL+.7, FL+.05, p.y)*smoothstep(.4,.65,fbm(vec2(p.z*3., uT*1.5 + p.x)));
      col = mix(col, vec3(.85,.9,.92), bf*.7);
    }
    col = mix(col, sky(normalize(vec3(rd.x, max(rd.y,.01), rd.z)))*.85, 1.-exp(-t*.007));
  }
  vec2 uv = gl_FragCoord.xy/uRes;
  vec2 vv = uv-.5;
  col *= 1. - dot(vv,vv)*.5;
  col = aces(col*1.);
  col += (h21(gl_FragCoord.xy + fract(uT*.37)*311.)-.5)*.018;
  gl_FragColor = vec4(col, 1.);
}
`;

  window.SHADERS = { PRE, UBER, SEA };
})();
