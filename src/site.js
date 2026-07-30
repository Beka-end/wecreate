/* ─── Библиотека внешнего вида ─────────────────────────────────────── */
export const PALETTES = [
  { id: "Ночной графит", bg: "#0D0F14", paper: "#171A21", ink: "#EDEFF3", acc: "#FF5A36", mut: "#8A92A0", cta: "#fff" },
  { id: "Кремовая бумага", bg: "#F6F1E7", paper: "#FFFFFF", ink: "#2C2A26", acc: "#B4472F", mut: "#7E7668", cta: "#fff" },
  { id: "Глубокая вода", bg: "#0A1F2E", paper: "#102E42", ink: "#E6F1F7", acc: "#46C7C7", mut: "#7B9AAB", cta: "#06232F" },
  { id: "Мятная свежесть", bg: "#F2F7F3", paper: "#FFFFFF", ink: "#16241C", acc: "#1F8A5B", mut: "#657A6F", cta: "#fff" },
  { id: "Вино и бархат", bg: "#1A0F14", paper: "#26161C", ink: "#F3E9EC", acc: "#C9455F", mut: "#9E838C", cta: "#fff" },
  { id: "Песок и хвоя", bg: "#EFEAE0", paper: "#FFFDF9", ink: "#23301F", acc: "#4B6B3C", mut: "#767D6C", cta: "#fff" },
  { id: "Электрик", bg: "#0B0C1E", paper: "#14162E", ink: "#EAEAFF", acc: "#6C63FF", mut: "#9092BE", cta: "#fff" },
  { id: "Латунь на чёрном", bg: "#101010", paper: "#191919", ink: "#F2EFE9", acc: "#D4A24C", mut: "#948D82", cta: "#141414" },
  { id: "Голубая сталь", bg: "#F1F4F8", paper: "#FFFFFF", ink: "#17222E", acc: "#2C6BE0", mut: "#66758A", cta: "#fff" },
  { id: "Терракота в ночи", bg: "#17110E", paper: "#221A15", ink: "#F4EBE4", acc: "#E2703A", mut: "#A08B7D", cta: "#fff" },
  { id: "Йогурт и вишня", bg: "#FBF7F4", paper: "#FFFFFF", ink: "#241A1C", acc: "#D6234E", mut: "#7C6C70", cta: "#fff" },
  { id: "Оливка и мел", bg: "#E8E6DC", paper: "#F7F6F1", ink: "#1F241A", acc: "#7A8B2E", mut: "#71765F", cta: "#fff" },
];

export const FONTS = [
  { id: "Prata / Manrope", d: "Prata", b: "Manrope", q: "family=Prata&family=Manrope:wght@400;600", w: 400 },
  { id: "Russo One / Rubik", d: "Russo One", b: "Rubik", q: "family=Russo+One&family=Rubik:wght@400;600", w: 400 },
  { id: "Yeseva One / Montserrat", d: "Yeseva One", b: "Montserrat", q: "family=Yeseva+One&family=Montserrat:wght@400;600", w: 400 },
  { id: "Unbounded / Manrope", d: "Unbounded", b: "Manrope", q: "family=Unbounded:wght@700;900&family=Manrope:wght@400;600", w: 900 },
  { id: "Playfair / Inter", d: "Playfair Display", b: "Inter", q: "family=Playfair+Display:wght@700;900&family=Inter:wght@400;600", w: 800 },
  { id: "Oswald / PT Sans", d: "Oswald", b: "PT Sans", q: "family=Oswald:wght@500;700&family=PT+Sans:wght@400;700", w: 700 },
  { id: "Bitter / Golos Text", d: "Bitter", b: "Golos Text", q: "family=Bitter:wght@700&family=Golos+Text:wght@400;600", w: 700 },
  { id: "Cormorant / Raleway", d: "Cormorant Garamond", b: "Raleway", q: "family=Cormorant+Garamond:wght@600;700&family=Raleway:wght@400;600", w: 700 },
  { id: "Alegreya / Jost", d: "Alegreya", b: "Jost", q: "family=Alegreya:wght@700;800&family=Jost:wght@400;600", w: 800 },
];

export const HEROES = ["slab", "stack", "center", "sidebar", "marquee", "overlap"];
export const BLOCKS = ["rows", "menu", "bands", "ticker", "steps", "columns"];
export const PROOFS = ["bigNums", "slash", "defs"];
export const MOTIFS = ["rings", "halftone", "hairlines", "blob", "dots", "none"];
export const WIDTHS = [760, 1040, 1240, 1440];
export const CTAS = ["pill", "block", "frame", "arrow"];

export const HERO_RU = { slab: "плита", stack: "колонна", center: "центр", sidebar: "с боковиной", marquee: "бегущая строка", overlap: "с нахлёстом" };
export const BLOCK_RU = { rows: "строки", menu: "меню", bands: "полосы", ticker: "лента", steps: "шаги", columns: "колонки" };
export const PROOF_RU = { bigNums: "крупные цифры", slash: "через дробь", defs: "определения" };
export const MOTIF_RU = { rings: "кольца", halftone: "растр", hairlines: "линии", blob: "пятна", dots: "3D-сетка", none: "чисто" };

export const MOODS = {
  "тёмный":        { p: [0, 4, 7, 9, 6], f: [3, 1, 5, 0, 8] },
  "светлый":       { p: [1, 3, 5, 8, 10, 11], f: [6, 4, 2, 7, 8] },
  "премиум":       { p: [7, 4, 9, 2, 0], f: [0, 7, 4, 2] },
  "дерзкий":       { p: [0, 6, 4, 9, 10], f: [3, 1, 5] },
  "природный":     { p: [5, 3, 11, 1], f: [6, 7, 4, 0, 8] },
  "технологичный": { p: [6, 2, 8, 0], f: [1, 3, 5] },
};

export const pick = (a) => a[Math.floor(Math.random() * a.length)];

export function rollLook(mood, avoid) {
  const m = MOODS[mood] || MOODS["светлый"];
  let look = null;
  for (let i = 0; i < 60; i++) {
    look = {
      palette: pick(m.p), fonts: pick(m.f),
      hero: pick(HEROES), block: pick(BLOCKS), proof: pick(PROOFS), motif: pick(MOTIFS),
      width: pick(WIDTHS), cta: pick(CTAS),
      radius: pick(["0px", "2px", "6px", "14px", "999px"]),
      reveal: pick(["up", "left", "scale", "clip", "blur"]),
      marquee: Math.random() < 0.45,
      upper: Math.random() < 0.35,
      swapped: Math.random() < 0.35,
    };
    look.sig = [look.palette, look.fonts, look.hero, look.block, look.proof, look.motif, look.cta].join("-");
    if (!avoid || !avoid.has(look.sig)) break;
  }
  return look;
}

export const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function waNumber(phone) {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.length === 10) d = "7" + d;
  if (d[0] === "8" && d.length === 11) d = "7" + d.slice(1);
  return d;
}
export function waLink(phone, business) {
  return "https://wa.me/" + waNumber(phone) +
    "?text=" + encodeURIComponent("Здравствуйте! Пишу с сайта " + (business || "") + ". Хочу записаться.");
}

/* ─── Декор фона ───────────────────────────────────────────────────── */
export function motif(kind) {
  if (kind === "rings")
    return { html: `<svg id="bg" data-par="0.06" viewBox="0 0 600 600" aria-hidden="true"><g fill="none" stroke="var(--acc)" stroke-width="1">
      <circle cx="300" cy="300" r="120"/><circle cx="300" cy="300" r="190"/><circle cx="300" cy="300" r="260"/>
      <circle cx="300" cy="300" r="292" stroke-dasharray="4 12"/></g></svg>`,
      css: `#bg{position:fixed;top:50%;right:-14vw;width:78vw;transform:translateY(-50%);z-index:0;opacity:.3;
      animation:spin 70s linear infinite}@keyframes spin{to{transform:translateY(-50%) rotate(360deg)}}` };
  if (kind === "halftone")
    return { html: `<div id="bg" aria-hidden="true"></div>`,
      css: `#bg{position:fixed;inset:0;z-index:0;opacity:.5;background-image:radial-gradient(var(--mut) 1px,transparent 1.4px);
      background-size:22px 22px;mask-image:radial-gradient(ellipse at 70% 20%,#000,transparent 72%)}` };
  if (kind === "hairlines")
    return { html: `<div id="bg" aria-hidden="true"></div>`,
      css: `#bg{position:fixed;inset:0;z-index:0;opacity:.45;
      background-image:repeating-linear-gradient(90deg,transparent 0 calc(12.5% - 1px),var(--mut) calc(12.5% - 1px) 12.5%)}` };
  if (kind === "blob")
    return { html: `<div id="bg" data-par="0.04" aria-hidden="true"><i></i><b></b></div>`,
      css: `#bg{position:fixed;inset:0;z-index:0;overflow:hidden}
      #bg i,#bg b{position:absolute;border-radius:50%;filter:blur(90px)}
      #bg i{width:58vw;height:58vw;background:var(--acc);opacity:.18;top:-16vw;right:-10vw;animation:drift 24s ease-in-out infinite alternate}
      #bg b{width:42vw;height:42vw;background:var(--mut);opacity:.16;bottom:-12vw;left:-8vw;animation:drift 30s ease-in-out infinite alternate-reverse}
      @keyframes drift{to{transform:translate3d(6vw,4vh,0) scale(1.14)}}` };
  if (kind === "dots")
    return { html: `<canvas id="bg" aria-hidden="true"></canvas>`, css: `#bg{position:fixed;inset:0;z-index:0;opacity:.5}`, script: true };
  return { html: "", css: "" };
}

export const dotsScript = `<script>(function(){
var c=document.getElementById('bg');if(!c||!c.getContext)return;var x=c.getContext('2d'),W,H,pts=[],
 acc=getComputedStyle(document.body).getPropertyValue('--acc').trim(),
 reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
export function size(){W=c.width=innerWidth;H=c.height=innerHeight;}size();addEventListener('resize',size);
for(var i=0;i<80;i++){var th=Math.acos(2*Math.random()-1),ph=Math.random()*6.283;
 pts.push({x:Math.sin(th)*Math.cos(ph),y:Math.cos(th),z:Math.sin(th)*Math.sin(ph)});}
var t=0;function draw(){t+=reduce?0:0.0022;x.clearRect(0,0,W,H);
 var cx=W*0.76,cy=H*0.4,R=Math.min(W,H)*0.34,pr=[];
 for(var i=0;i<pts.length;i++){var p=pts[i],
  X=p.x*Math.cos(t)-p.z*Math.sin(t),Z=p.x*Math.sin(t)+p.z*Math.cos(t),
  Y=p.y*Math.cos(t*0.6)-Z*Math.sin(t*0.6),Z2=p.y*Math.sin(t*0.6)+Z*Math.cos(t*0.6),
  s=2.6/(Z2+3.2);pr.push({x:cx+X*R*s,y:cy+Y*R*s,d:s});}
 for(var i=0;i<pr.length;i++)for(var j=i+1;j<pr.length;j++){
  var dx=pr[i].x-pr[j].x,dy=pr[i].y-pr[j].y,d=dx*dx+dy*dy;
  if(d<5000){x.strokeStyle=acc;x.globalAlpha=(1-d/5000)*0.12;x.beginPath();
  x.moveTo(pr[i].x,pr[i].y);x.lineTo(pr[j].x,pr[j].y);x.stroke();}}
 for(var i=0;i<pr.length;i++){x.globalAlpha=Math.min(pr[i].d*0.4,0.5);x.fillStyle=acc;
  x.beginPath();x.arc(pr[i].x,pr[i].y,pr[i].d*1.4,0,6.283);x.fill();}
 x.globalAlpha=1;requestAnimationFrame(draw);}draw();})();<\/script>`;

/* ─── Секции ───────────────────────────────────────────────────────── */
export function heroHtml(kind, d, wa) {
  const eb = `<span class="eyebrow">${esc(d.tagline)}</span>`;
  const h1 = `<h1>${esc(d.heroHeadline)}</h1>`;
  const lead = `<p class="lead">${esc(d.heroSub)}</p>`;
  const cta = `<a class="cta" href="${wa}" target="_blank" rel="noreferrer">${esc(d.ctaText)}</a>`;
  const strip = (d.services || []).map((s) => esc(s.title)).join(" ✦ ");

  if (kind === "slab")
    return `<div class="hero slab">${eb}${h1}<div class="under"><div>${lead}</div><div>${cta}</div></div></div>`;
  if (kind === "stack")
    return `<div class="hero stack"><span class="bar"></span><div>${eb}${h1}${lead}${cta}</div></div>`;
  if (kind === "center")
    return `<div class="hero center">${eb}${h1}${lead}${cta}</div>`;
  if (kind === "sidebar")
    return `<div class="hero side"><div>${eb}${h1}${cta}</div><aside>${lead}
      <p class="addr">${esc(d.address)}</p><a class="stel" href="${wa}" target="_blank" rel="noreferrer">${esc(d.phone)}</a></aside></div>`;
  if (kind === "marquee")
    return `<div class="hero mqh">${eb}${h1}<div class="mqRow">${lead}${cta}</div></div>
      <div class="mq"><div><span>${strip} ✦ ${strip} ✦ </span><span>${strip} ✦ ${strip} ✦ </span></div></div>`;
  return `<div class="hero ov">${eb}${h1}<div class="ovCard">${lead}${cta}</div></div>`;
}

export function blockHtml(kind, d) {
  const S = d.services || [];
  const n = (i) => String(i + 1).padStart(2, "0");
  if (kind === "rows")
    return `<div class="rows">${S.map((s, i) =>
      `<div class="row"><span class="num">${n(i)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("")}</div>`;
  if (kind === "menu")
    return `<dl class="menu">${S.map((s) =>
      `<div><dt>${esc(s.title)}</dt><dd>${esc(s.text)}</dd></div>`).join("")}</dl>`;
  if (kind === "bands")
    return `<div class="bands">${S.map((s, i) =>
      `<div class="band"><span class="ghost">${n(i)}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></div>`).join("")}</div>`;
  if (kind === "ticker")
    return `<div class="strip">${S.map((s, i) =>
      `<article><span class="num">${n(i)}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join("")}</div>`;
  if (kind === "steps")
    return `<div class="steps">${S.map((s, i) =>
      `<div class="step"><span class="dot"></span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("")}</div>`;
  return `<div class="cols">${S.map((s) =>
    `<div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`).join("")}</div>`;
}

export function proofHtml(kind, d) {
  const P = d.points || [];
  if (kind === "bigNums")
    return `<div class="proofNums">${P.map((t, i) =>
      `<div><span>${String(i + 1).padStart(2, "0")}</span><p>${esc(t)}</p></div>`).join("")}</div>`;
  if (kind === "slash")
    return `<p class="proofSlash">${P.map((t) => esc(t)).join(' <i>/</i> ')}</p>`;
  return `<dl class="proofDefs">${P.map((t, i) =>
    `<div><dt>0${i + 1}</dt><dd>${esc(t)}</dd></div>`).join("")}</dl>`;
}

/* ─── Сборка страницы ──────────────────────────────────────────────── */
export function buildSite(d, look, watermark) {
  const p = PALETTES[look.palette];
  const f = FONTS[look.fonts];
  const wa = waLink(d.phone, d.businessName);
  const mo = motif(look.motif);

  const ctaCss = {
    pill: `border-radius:999px;background:var(--acc);color:var(--ctc);padding:15px 34px`,
    block: `border-radius:0;background:var(--acc);color:var(--ctc);padding:17px 34px;box-shadow:8px 8px 0 var(--ink)`,
    frame: `border-radius:var(--r);background:transparent;color:var(--acc);padding:14px 32px;border:2px solid var(--acc)`,
    arrow: `background:none;color:var(--acc);padding:6px 0;border-bottom:2px solid var(--acc);border-radius:0`,
  }[look.cta];

  const stats = (d.stats || []).filter((x) => x && x.value);
  const statsBand = stats.length
    ? `<section class="sStats" data-rev><div class="stats">${stats
        .map((x) => `<div><b data-count="${esc(x.value)}">${esc(x.value)}</b><span>${esc(x.label)}</span></div>`)
        .join("")}</div></section>`
    : "";

  const strip = (d.services || []).map((x) => esc(x.title)).join(" — ");
  const marquee = look.marquee
    ? `<div class="mq" aria-hidden="true"><div><span>${strip} — </span><span>${strip} — </span></div></div>`
    : "";

  const finalCta = `<section class="sFinal" data-rev>
      <h2 class="bigCta">${esc(d.finalHeadline || "Напишите — ответим сегодня")}</h2>
      <p class="finalSub">${esc(d.address)}</p>
      <a class="cta" href="${wa}" target="_blank" rel="noreferrer">${esc(d.ctaText)}</a>
    </section>`;

  const sections = [
    `<section class="sBlock" data-rev><h2>${esc(d.servicesTitle || "Что мы делаем")}</h2>${blockHtml(look.block, d)}</section>`,
    `<section class="sProof" data-rev><h2>${esc(d.pointsTitle || "Почему к нам возвращаются")}</h2>${proofHtml(look.proof, d)}</section>`,
  ];
  if (look.swapped) sections.reverse();
  sections.splice(1, 0, statsBand);
  sections.push(finalCta);

  const mark = watermark
    ? `<div id="wm">предпросмотр · станок</div><style>#wm{position:fixed;z-index:99;right:16px;bottom:16px;
       background:rgba(0,0,0,.82);color:#fff;padding:9px 16px;border-radius:100px;font:600 12px/1 system-ui,sans-serif;
       letter-spacing:.06em;text-transform:uppercase}
       body:after{content:"ПРЕДПРОСМОТР";position:fixed;inset:0;z-index:98;pointer-events:none;display:flex;
       align-items:center;justify-content:center;font:900 clamp(40px,11vw,120px)/1 system-ui,sans-serif;
       color:var(--ink);opacity:.07;transform:rotate(-24deg)}</style>`
    : "";

  return `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(d.businessName)} — ${esc(d.tagline)}</title>
<meta name="description" content="${esc(d.heroSub)}">
<meta property="og:title" content="${esc(d.businessName)} — ${esc(d.tagline)}">
<meta property="og:description" content="${esc(d.heroSub)}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='${encodeURIComponent(p.acc)}'/%3E%3C/svg%3E">
<link href="https://fonts.googleapis.com/css2?${f.q}&display=swap" rel="stylesheet">
<style>
:root{--bg:${p.bg};--paper:${p.paper};--ink:${p.ink};--acc:${p.acc};--mut:${p.mut};--ctc:${p.cta};--r:${look.radius};--w:${look.width}px}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font:400 17px/1.55 '${f.b}',system-ui,sans-serif;overflow-x:hidden}
.w{max-width:var(--w);margin:0 auto;padding:0 clamp(20px,4vw,40px);position:relative;z-index:2}
h1,h2,h3,.dsp{font-family:'${f.d}',Georgia,serif;font-weight:${f.w};letter-spacing:-.02em;${look.upper ? "text-transform:uppercase;letter-spacing:0;" : ""}}
a{color:inherit}
.eyebrow{display:block;color:var(--acc);font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;margin-bottom:20px}
.lead{color:var(--mut);font-size:clamp(16px,2.1vw,19px);max-width:56ch}
.cta{display:inline-block;margin-top:28px;text-decoration:none;font-weight:600;font-size:16px;transition:transform .18s;${ctaCss}}
.cta:hover{transform:translateY(-3px)}
header{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:24px 0;flex-wrap:wrap}
.brand{font-family:'${f.d}',serif;font-weight:${f.w};font-size:20px;${look.upper ? "letter-spacing:.08em;text-transform:uppercase;" : ""}}
.tel{color:var(--acc);text-decoration:none;font-weight:600;font-size:15px}
h1{opacity:0;transform:translateY(20px);animation:rise .9s .08s forwards cubic-bezier(.2,.7,.3,1)}
.lead,.cta{opacity:0;animation:rise .9s .3s forwards cubic-bezier(.2,.7,.3,1)}
@keyframes rise{to{opacity:1;transform:none}}
h2{font-size:clamp(22px,3.2vw,34px);margin-bottom:34px}
section{padding:64px 0}
section+section{border-top:1px solid color-mix(in srgb,var(--mut) 40%,transparent)}

/* герои */
.hero.slab{padding:56px 0 76px}
.hero.slab h1{font-size:clamp(38px,10.4vw,136px);line-height:.92}
.hero.slab .under{display:grid;grid-template-columns:1.4fr .6fr;gap:32px;margin-top:38px;padding-top:28px;border-top:2px solid var(--ink);align-items:start}
.hero.stack{padding:72px 0 88px;display:grid;grid-template-columns:auto 1fr;gap:30px}
.hero.stack .bar{width:5px;background:var(--acc);border-radius:9px}
.hero.stack h1{font-size:clamp(34px,6.6vw,76px);line-height:1.03}
.hero.center{padding:88px 0;text-align:center;max-width:900px;margin:0 auto}
.hero.center .eyebrow{border-top:1px solid var(--mut);border-bottom:1px solid var(--mut);padding:11px 0;margin-bottom:30px}
.hero.center h1{font-size:clamp(36px,7.6vw,88px);line-height:1}
.hero.center .lead{margin:22px auto 0}
.hero.side{padding:72px 0;display:grid;grid-template-columns:1.45fr .75fr;gap:46px;align-items:end}
.hero.side h1{font-size:clamp(34px,6.2vw,72px);line-height:1.02}
.hero.side aside{border-left:1px solid var(--mut);padding-left:26px;display:grid;gap:16px}
.hero.side .addr{color:var(--mut);font-size:14px}
.hero.side .stel{font-family:'${f.d}',serif;font-size:21px;text-decoration:none}
.hero.mqh{padding:64px 0 44px}
.hero.mqh h1{font-size:clamp(36px,8.2vw,104px);line-height:.96}
.hero.mqh .mqRow{display:grid;grid-template-columns:1.3fr .7fr;gap:30px;margin-top:30px;align-items:center}
.mq{border-top:1px solid var(--mut);border-bottom:1px solid var(--mut);overflow:hidden;padding:16px 0;margin-bottom:20px}
.mq>div{display:flex;width:max-content;animation:slide 30s linear infinite}
.mq span{font-family:'${f.d}',serif;font-size:clamp(19px,3vw,32px);color:var(--acc);white-space:nowrap;padding-right:20px}
@keyframes slide{to{transform:translateX(-50%)}}
.hero.ov{padding:64px 0 84px}
.hero.ov h1{font-size:clamp(38px,9.2vw,120px);line-height:.94}
.hero.ov .ovCard{background:var(--acc);color:var(--ctc);padding:30px 32px;max-width:470px;margin:-24px 0 0 auto;position:relative;border-radius:var(--r)}
.hero.ov .ovCard .lead{color:var(--ctc);opacity:.92}
.hero.ov .ovCard .cta{margin-top:20px;background:var(--ink);color:var(--bg);box-shadow:none;border:0;padding:13px 26px;border-radius:var(--r)}
@media (max-width:780px){.hero.slab .under,.hero.side,.hero.mqh .mqRow{grid-template-columns:1fr}
.hero.side aside{border-left:0;border-top:1px solid var(--mut);padding:22px 0 0}
.hero.ov .ovCard{margin:24px 0 0}}

/* услуги */
.rows .row{display:grid;grid-template-columns:64px 1.1fr 1.4fr;gap:22px;align-items:baseline;padding:26px 0;
  border-top:1px solid color-mix(in srgb,var(--mut) 35%,transparent)}
.rows .row:last-child{border-bottom:1px solid color-mix(in srgb,var(--mut) 35%,transparent)}
.rows h3{font-size:clamp(19px,2.4vw,26px)}
.menu{display:grid;gap:4px}
.menu>div{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:baseline;padding:16px 0}
.menu dt{font-family:'${f.d}',serif;font-weight:${f.w};font-size:clamp(19px,2.6vw,27px)}
.menu>div:after{content:"";border-bottom:1px dotted var(--mut);transform:translateY(-5px)}
.menu dd{color:var(--mut);font-size:15px;max-width:34ch;text-align:right}
.bands .band{display:flex;align-items:center;gap:26px;padding:30px 0;border-top:2px solid var(--ink)}
.bands .band:last-child{border-bottom:2px solid var(--ink)}
.bands .ghost{font-family:'${f.d}',serif;font-size:clamp(52px,9vw,104px);line-height:.8;color:var(--acc);opacity:.28;flex:none}
.bands h3{font-size:clamp(20px,2.6vw,28px);margin-bottom:6px}
.strip{display:flex;gap:0;overflow-x:auto;scroll-snap-type:x mandatory;margin:0 -2px}
.strip article{flex:0 0 min(78vw,320px);scroll-snap-align:start;padding:26px 24px;border-left:1px solid var(--mut)}
.strip article:last-child{border-right:1px solid var(--mut)}
.strip h3{font-size:20px;margin:12px 0 8px}
.steps{display:grid;gap:0;padding-left:8px}
.steps .step{position:relative;padding:0 0 34px 32px;border-left:1px solid var(--mut)}
.steps .step:last-child{border-left-color:transparent}
.steps .dot{position:absolute;left:-6px;top:5px;width:11px;height:11px;border-radius:50%;background:var(--acc)}
.steps h3{font-size:20px;margin-bottom:7px}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:34px}
.cols h3{font-size:19px;margin-bottom:10px;padding-bottom:10px;border-bottom:2px solid var(--acc);display:inline-block}
.num{font-family:'${f.b}',sans-serif;font-size:12px;color:var(--acc);font-weight:700;letter-spacing:.12em}
.rows p,.strip p,.steps p,.cols p,.bands p{color:var(--mut);font-size:15.5px}

/* доводы */
.proofNums{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:30px}
.proofNums span{font-family:'${f.d}',serif;font-size:clamp(40px,6vw,64px);color:var(--acc);line-height:1;display:block;margin-bottom:12px}
.proofNums p{color:var(--mut);font-size:16px}
.proofSlash{font-family:'${f.d}',serif;font-weight:${f.w};font-size:clamp(22px,3.6vw,40px);line-height:1.3;letter-spacing:-.01em}
.proofSlash i{color:var(--acc);font-style:normal;padding:0 6px}
.proofDefs>div{display:grid;grid-template-columns:70px 1fr;gap:20px;padding:20px 0;
  border-top:1px solid color-mix(in srgb,var(--mut) 35%,transparent)}
.proofDefs dt{color:var(--acc);font-family:'${f.b}',sans-serif;font-weight:700;font-size:13px;letter-spacing:.1em;padding-top:4px}
.proofDefs dd{font-size:clamp(17px,2.2vw,21px)}

footer{padding:50px 0 96px;border-top:1px solid color-mix(in srgb,var(--mut) 40%,transparent);
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
footer p{color:var(--mut);font-size:14px}
.float{position:fixed;left:20px;bottom:20px;z-index:60;display:flex;align-items:center;gap:10px;background:#25D366;color:#06251A;
  text-decoration:none;padding:13px 20px 13px 16px;border-radius:100px;font-weight:700;font-size:15px;
  box-shadow:0 10px 30px rgba(0,0,0,.28);transition:transform .18s}
.float:hover{transform:translateY(-3px)}
.float svg{width:22px;height:22px;flex:none}
@media (max-width:560px){.float{left:14px;right:14px;bottom:14px;justify-content:center}
.rows .row,.menu>div,.proofDefs>div{grid-template-columns:1fr;gap:8px}
.menu>div:after{display:none}.menu dd{text-align:left}
.bands .band{flex-direction:column;align-items:flex-start;gap:8px}}
${mo.css}

/* появление при прокрутке */
[data-rev]{opacity:0;transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1),filter .9s}
[data-rev].up{transform:translateY(38px)}
[data-rev].left{transform:translateX(-42px)}
[data-rev].scale{transform:scale(.94)}
[data-rev].clip{clip-path:inset(0 0 100% 0)}
[data-rev].blur{filter:blur(14px);transform:translateY(20px)}
[data-rev].seen{opacity:1;transform:none;filter:none;clip-path:inset(0 0 0 0)}
[data-rev] > *{transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}
[data-rev]:not(.seen) .card,[data-rev]:not(.seen) .row,[data-rev]:not(.seen) .band,
[data-rev]:not(.seen) .step,[data-rev]:not(.seen) .menu>div{opacity:0;transform:translateY(22px)}
[data-rev].seen .card,[data-rev].seen .row,[data-rev].seen .band,
[data-rev].seen .step,[data-rev].seen .menu>div{opacity:1;transform:none;
  transition:opacity .7s ease var(--d,0s),transform .7s cubic-bezier(.2,.7,.2,1) var(--d,0s)}

/* липкая шапка, ужимается при прокрутке */
header{position:sticky;top:0;z-index:40;transition:padding .35s ease,background .35s ease,backdrop-filter .35s;
  backdrop-filter:blur(0px)}
header.stuck{padding:12px 0;background:color-mix(in srgb,var(--bg) 82%,transparent);backdrop-filter:blur(14px);
  border-bottom:1px solid color-mix(in srgb,var(--mut) 30%,transparent)}
header.stuck .brand{font-size:18px}

/* полоса цифр */
.sStats{padding:52px 0}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:28px;text-align:center}
.stats b{display:block;font-family:'${f.d}',serif;font-size:clamp(34px,5.4vw,60px);line-height:1;color:var(--acc);
  letter-spacing:-.03em}
.stats span{display:block;margin-top:10px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--mut)}

/* бегущая строка */
.mq{overflow:hidden;padding:14px 0;border-top:1px solid color-mix(in srgb,var(--mut) 30%,transparent);
  border-bottom:1px solid color-mix(in srgb,var(--mut) 30%,transparent)}
.mq>div{display:flex;width:max-content;animation:mqSlide 32s linear infinite}
.mq span{font-family:'${f.d}',serif;font-size:clamp(18px,2.6vw,30px);color:var(--acc);white-space:nowrap;
  padding-right:24px;opacity:.85}
@keyframes mqSlide{to{transform:translateX(-50%)}}

/* финальный призыв */
.sFinal{text-align:center;padding:88px 0 96px}
.bigCta{font-size:clamp(28px,5.2vw,58px);line-height:1.06;max-width:16ch;margin:0 auto 18px}
.finalSub{color:var(--mut);font-size:16px;margin-bottom:30px}
.sFinal .cta{margin-top:0}

/* плавные мелочи */
html{scroll-behavior:smooth}
a,button{transition:transform .2s ease,opacity .2s ease,background .2s ease,color .2s ease}
.tel:hover{opacity:.7}
.cta:focus-visible,.tel:focus-visible,.float:focus-visible{outline:3px solid var(--acc);outline-offset:4px}
.card,.band,.row,.step{will-change:transform}

@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}
  [data-rev]{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}}
</style></head>
<body>
${mo.html}${mark}
<div class="w">
<header><div class="brand">${esc(d.businessName)}</div><a class="tel" href="${wa}" target="_blank" rel="noreferrer">${esc(d.phone)}</a></header>
${heroHtml(look.hero, d, wa)}
</div>
${marquee}
<div class="w">
${sections.join("\n")}
<footer><p>${esc(d.address)}</p><p>${esc(d.businessName)} · ${esc(d.phone)}</p></footer>
</div>
<a class="float" href="${wa}" target="_blank" rel="noreferrer" aria-label="Написать в WhatsApp">
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 5 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3c-.8-1.3-1.3-2.8-1.3-4.4 0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.6 8.3-8 8.3z"/></svg>
Написать в WhatsApp</a>
${mo.script ? dotsScript : ""}
<script>
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealKind = '${look.reveal}';

  /* появление секций и ступенчатый выход карточек */
  var items = document.querySelectorAll('[data-rev]');
  items.forEach(function(el){ el.classList.add(revealKind); });
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function(el){ el.classList.add('seen'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        en.target.classList.add('seen');
        var kids = en.target.querySelectorAll('.card,.row,.band,.step,.menu>div');
        kids.forEach(function(k,i){ k.style.setProperty('--d', (i*0.09)+'s'); });
        io.unobserve(en.target);
      });
    }, { rootMargin: '-12% 0px -8% 0px' });
    items.forEach(function(el){ io.observe(el); });
  }

  /* шапка ужимается при прокрутке */
  var head = document.querySelector('header');
  var onScroll = function(){
    if (head) head.classList.toggle('stuck', window.scrollY > 40);
    if (!reduce) {
      var par = document.querySelectorAll('[data-par]');
      par.forEach(function(el){
        var k = parseFloat(el.getAttribute('data-par')) || 0.1;
        el.style.transform = 'translate3d(0,' + (window.scrollY * k * -1) + 'px,0)';
      });
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* цифры набегают, когда до них дошли */
  var nums = document.querySelectorAll('[data-count]');
  if (nums.length && !reduce && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        var el = en.target, raw = el.getAttribute('data-count');
        var num = parseFloat(String(raw).replace(/[^0-9.]/g,''));
        if (isNaN(num)) { io2.unobserve(el); return; }
        var suffix = String(raw).replace(/[0-9.\s]/g,'');
        var t0 = performance.now(), dur = 1500;
        (function step(t){
          var k = Math.min((t - t0)/dur, 1);
          var v = Math.round(num * (1 - Math.pow(1-k,3)));
          el.textContent = v.toLocaleString('ru-RU') + suffix;
          if (k < 1) requestAnimationFrame(step);
        })(t0);
        io2.unobserve(el);
      });
    }, { rootMargin: '-10%' });
    nums.forEach(function(n){ io2.observe(n); });
  }
})();
<\/script>
</body></html>`;
}