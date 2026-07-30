import { useState, useRef, useEffect } from "react";
import * as THREE from "three";

/* ─── Настройки владельца ──────────────────────────────────────────── */
const PAY = {
  link: "https://pay.kaspi.kz/pay/cwevqlzj",
  kzt: 2500,
  usd: 5,
};

/* Кабинет открывается двумя способами:
   1) адрес страницы с #kabinet — для боевого сайта
   2) пять кликов по логотипу — чтобы проверить внутри превью
   PIN хранится хешем, а не текстом. Сменить его можно прямо в кабинете. */
const ADMIN = { pinHash: 2085813349 }; // сейчас это 7788
const HASH_SALT = "stanok";
function pinHash(s) {
  let x = 5381;
  const v = String(s);
  for (let i = 0; i < v.length; i++) x = (((x << 5) + x) ^ v.charCodeAt(i)) >>> 0;
  return x >>> 0;
}

/* ─── Стили интерфейса ─────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Golos+Text:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');

.pro{--void:#0B0D12;--steel:#161A22;--edge:#252C38;--mist:#8F98A8;--paper:#EEF1F6;--signal:#FF4D2E;--brass:#C9A227;
  background:var(--void);color:var(--paper);min-height:100vh;font-family:'Golos Text',system-ui,sans-serif;}
.pro *{box-sizing:border-box;}
.pro button{font-family:inherit;}

.p-hero{position:relative;height:300px;overflow:hidden;border-bottom:1px solid var(--edge);}
.p-canvas{position:absolute;inset:0;}
.p-heroText{position:relative;z-index:2;padding:46px 26px;pointer-events:none;}
.p-logo{font-family:'Unbounded',sans-serif;font-weight:900;font-size:clamp(32px,7vw,58px);letter-spacing:-.03em;line-height:.95;}
.p-logo em{font-style:normal;color:var(--signal);}
.p-tag{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--mist);margin-top:14px;}

.p-grid{display:grid;grid-template-columns:390px 1fr;}
@media (max-width:880px){.p-grid{grid-template-columns:1fr;}}
.p-panel{padding:26px 24px 34px;border-right:1px solid var(--edge);}
@media (max-width:880px){.p-panel{border-right:none;border-bottom:1px solid var(--edge);}}
.p-eyebrow{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--mist);margin:0 0 14px;}
.p-field{margin-bottom:16px;}
.p-label{display:block;font-size:13px;font-weight:500;margin-bottom:6px;}
.p-input,.p-area{width:100%;border:1px solid var(--edge);background:var(--steel);color:var(--paper);padding:11px 13px;font-family:inherit;font-size:14px;border-radius:4px;outline:none;}
.p-input:focus,.p-area:focus{border-color:var(--signal);box-shadow:0 0 0 3px rgba(255,77,46,.18);}
.p-area{min-height:86px;resize:vertical;}
.p-chips{display:flex;gap:8px;}
.p-chip{flex:1;border:1px solid var(--edge);background:var(--steel);color:var(--mist);padding:10px 4px;cursor:pointer;border-radius:4px;
  font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;}
.p-chip[data-on="1"]{border-color:var(--brass);color:var(--void);background:var(--brass);}
.p-go{width:100%;border:none;border-radius:4px;background:var(--signal);color:#fff;padding:17px;cursor:pointer;
  font-family:'Unbounded',sans-serif;font-weight:700;font-size:15px;}
.p-go:disabled{background:#3A414F;color:var(--mist);cursor:not-allowed;}
.p-lamps{display:flex;gap:16px;margin-top:20px;flex-wrap:wrap;}
.p-lamp{display:flex;align-items:center;gap:7px;font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#5B6474;}
.p-bulb{width:8px;height:8px;border-radius:50%;background:#333B48;}
.p-lamp[data-on="1"] .p-bulb{background:var(--brass);box-shadow:0 0 9px var(--brass);}
.p-lamp[data-on="1"]{color:var(--paper);}

.p-stage{padding:26px 24px 44px;min-width:0;}
.p-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap;}
.p-serial{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--mist);letter-spacing:.08em;}
.p-tools{display:flex;gap:8px;flex-wrap:wrap;}
.p-tool{border:1px solid var(--edge);background:transparent;color:var(--mist);padding:8px 13px;cursor:pointer;border-radius:4px;
  font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;}
.p-tool[data-on="1"]{background:var(--paper);color:var(--void);border-color:var(--paper);}
.p-tool:disabled{opacity:.3;cursor:not-allowed;}
.p-screen{border:1px solid var(--edge);border-radius:6px;background:#fff;overflow:hidden;}
.p-frame{display:block;width:100%;height:600px;border:0;margin:0 auto;transition:width .25s ease;}
.p-empty{height:600px;background:var(--steel);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:26px;}
.p-empty b{font-family:'Unbounded',sans-serif;font-size:17px;}
.p-empty span{max-width:300px;font-size:13px;color:var(--mist);}
.p-err{border:1px solid var(--signal);background:rgba(255,77,46,.1);padding:12px;font-size:13px;margin-top:14px;border-radius:4px;}

.p-gate{border:1px solid var(--brass);border-radius:6px;background:linear-gradient(160deg,#1C1A12,#12141A);padding:20px;margin-top:22px;}
.p-price{font-family:'Unbounded',sans-serif;font-weight:900;font-size:28px;letter-spacing:-.02em;}
.p-price small{font-family:'Golos Text',sans-serif;font-weight:400;font-size:14px;color:var(--mist);margin-left:8px;}
.p-kaspi{display:block;text-align:center;margin-top:16px;background:var(--brass);color:#141414;text-decoration:none;padding:15px;border-radius:4px;font-weight:700;font-size:15px;}
.p-row{display:flex;gap:8px;margin-top:12px;}
.p-row .p-input{flex:1;}
.p-mini{border:1px solid var(--edge);background:var(--steel);color:var(--paper);padding:0 14px;border-radius:4px;cursor:pointer;font-size:12px;white-space:nowrap;}
.p-mini:hover{border-color:var(--brass);}
.p-code{margin-top:14px;padding:14px;border:1px dashed var(--brass);border-radius:4px;text-align:center;}
.p-code b{display:block;font-family:'JetBrains Mono',monospace;font-size:22px;letter-spacing:.14em;color:var(--brass);margin-top:6px;}
.p-note{font-size:12px;color:#5B6474;margin-top:12px;line-height:1.5;}
.p-ok{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--brass);text-transform:uppercase;letter-spacing:.12em;}

.p-deliver{border:1px solid var(--edge);border-radius:6px;background:var(--steel);padding:20px;margin-bottom:16px;}
.p-deliver h3{font-family:'Unbounded',sans-serif;font-size:16px;margin:0 0 6px;}
.p-deliver p{font-size:13px;color:var(--mist);margin:0 0 14px;line-height:1.5;}
.p-steps{list-style:none;padding:0;margin:0;display:grid;gap:8px;}
.p-steps li{font-size:13px;color:var(--mist);padding-left:22px;position:relative;line-height:1.45;}
.p-steps li:before{content:"";position:absolute;left:0;top:8px;width:11px;height:2px;background:var(--brass);}
.p-cabinet{margin-top:24px;border-top:1px solid var(--edge);padding-top:18px;}
.p-table{width:100%;border-collapse:collapse;margin-top:10px;font-family:'JetBrains Mono',monospace;font-size:11px;}
.p-table th{text-align:left;color:#5B6474;font-weight:400;padding:6px 4px;border-bottom:1px solid var(--edge);text-transform:uppercase;letter-spacing:.08em;}
.p-table td{padding:7px 4px;border-bottom:1px solid var(--edge);color:var(--paper);}
.p-used{color:#5B6474;}
.p-look{margin-top:20px;border:1px solid var(--edge);border-radius:6px;padding:16px;background:var(--steel);}
.p-tokens{margin:0;display:grid;gap:7px;}
.p-tokens div{display:flex;justify-content:space-between;gap:10px;font-size:12px;}
.p-tokens dt{color:#5B6474;font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.08em;font-size:10px;padding-top:2px;}
.p-tokens dd{margin:0;text-align:right;color:var(--paper);}
.p-swatch{display:flex;gap:6px;margin-top:14px;}
.p-swatch span{flex:1;height:26px;border-radius:3px;border:1px solid rgba(255,255,255,.12);}
.p-admin{max-width:760px;margin:0 auto;padding:40px 24px 60px;}
.p-admin h1{font-family:'Unbounded',sans-serif;font-weight:900;font-size:26px;letter-spacing:-.02em;margin:0 0 6px;}
.p-admin .p-note{margin-bottom:22px;}
.p-lock{max-width:340px;margin:80px auto;text-align:center;}
.p-lock h2{font-family:'Unbounded',sans-serif;font-size:18px;margin-bottom:8px;}
.p-stats{display:flex;gap:10px;margin:18px 0 24px;flex-wrap:wrap;}
.p-stat{flex:1;min-width:120px;border:1px solid var(--edge);border-radius:6px;background:var(--steel);padding:14px 16px;}
.p-stat b{display:block;font-family:'Unbounded',sans-serif;font-size:24px;margin-top:4px;}
.p-stat span{font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#5B6474;}
.p-exit{background:none;border:none;color:var(--mist);cursor:pointer;font-size:13px;text-decoration:underline;padding:0;}
@media (prefers-reduced-motion:reduce){.p-frame{transition:none;}}
`;

/* ─── 3D-сцена ─────────────────────────────────────────────────────── */
function Hero3D() {
  const mount = useRef(null);
  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0d12, 9, 22);
    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 1.6, 11);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x415066, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(4, 7, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0xff4d2e, 60, 24);
    rim.position.set(-5, -1, 3);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);
    const plateGeo = new THREE.BoxGeometry(1.55, 2.1, 0.045);
    const mats = [
      new THREE.MeshStandardMaterial({ color: 0xeef1f6, roughness: 0.35, metalness: 0.15 }),
      new THREE.MeshStandardMaterial({ color: 0xc9a227, roughness: 0.28, metalness: 0.75 }),
      new THREE.MeshStandardMaterial({ color: 0x2a3242, roughness: 0.5, metalness: 0.4 }),
    ];
    const plates = [];
    for (let i = 0; i < 16; i++) {
      const m = new THREE.Mesh(plateGeo, mats[i % 3 === 1 ? 1 : i % 5 === 0 ? 2 : 0]);
      const a = (i / 16) * Math.PI * 2;
      m.position.set(Math.cos(a) * 4.2, ((i % 4) - 1.5) * 0.85, Math.sin(a) * 4.2);
      m.rotation.set(0, -a + Math.PI / 2, (i % 2 ? 1 : -1) * 0.09);
      m.userData.base = m.position.y;
      group.add(m);
      plates.push(m);
    }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.012, 6, 128), new THREE.MeshBasicMaterial({ color: 0xff4d2e }));
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const g = new THREE.BufferGeometry();
    const arr = [];
    for (let i = 0; i < 420; i++) arr.push((Math.random() - 0.5) * 26, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 18);
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    const dots = new THREE.Points(g, new THREE.PointsMaterial({ color: 0x5b6474, size: 0.045 }));
    scene.add(dots);

    let mx = 0, my = 0, raf;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    el.addEventListener("pointermove", onMove);

    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      group.rotation.y = reduced ? 0.4 : t * 0.22;
      group.rotation.x = -0.12;
      plates.forEach((p, i) => { p.position.y = p.userData.base + Math.sin(t * 0.9 + i) * 0.16; });
      dots.rotation.y = t * 0.02;
      camera.position.x += (mx * 1.4 - camera.position.x) * 0.04;
      camera.position.y += (1.6 - my * 0.8 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.2, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("pointermove", onMove);
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);
  return <div className="p-canvas" ref={mount} aria-hidden="true" />;
}
/* ─── Библиотека внешнего вида ─────────────────────────────────────── */
const PALETTES = [
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

const FONTS = [
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

const HEROES = ["slab", "stack", "center", "sidebar", "marquee", "overlap"];
const BLOCKS = ["rows", "menu", "bands", "ticker", "steps", "columns"];
const PROOFS = ["bigNums", "slash", "defs"];
const MOTIFS = ["rings", "halftone", "hairlines", "blob", "dots", "none"];
const WIDTHS = [760, 1040, 1240, 1440];
const CTAS = ["pill", "block", "frame", "arrow"];

const HERO_RU = { slab: "плита", stack: "колонна", center: "центр", sidebar: "с боковиной", marquee: "бегущая строка", overlap: "с нахлёстом" };
const BLOCK_RU = { rows: "строки", menu: "меню", bands: "полосы", ticker: "лента", steps: "шаги", columns: "колонки" };
const PROOF_RU = { bigNums: "крупные цифры", slash: "через дробь", defs: "определения" };
const MOTIF_RU = { rings: "кольца", halftone: "растр", hairlines: "линии", blob: "пятна", dots: "3D-сетка", none: "чисто" };

const MOODS = {
  "тёмный":        { p: [0, 4, 7, 9, 6], f: [3, 1, 5, 0, 8] },
  "светлый":       { p: [1, 3, 5, 8, 10, 11], f: [6, 4, 2, 7, 8] },
  "премиум":       { p: [7, 4, 9, 2, 0], f: [0, 7, 4, 2] },
  "дерзкий":       { p: [0, 6, 4, 9, 10], f: [3, 1, 5] },
  "природный":     { p: [5, 3, 11, 1], f: [6, 7, 4, 0, 8] },
  "технологичный": { p: [6, 2, 8, 0], f: [1, 3, 5] },
};

const pick = (a) => a[Math.floor(Math.random() * a.length)];

function rollLook(mood, avoid) {
  const m = MOODS[mood] || MOODS["светлый"];
  let look = null;
  for (let i = 0; i < 60; i++) {
    look = {
      palette: pick(m.p), fonts: pick(m.f),
      hero: pick(HEROES), block: pick(BLOCKS), proof: pick(PROOFS), motif: pick(MOTIFS),
      width: pick(WIDTHS), cta: pick(CTAS),
      radius: pick(["0px", "2px", "6px", "14px", "999px"]),
      upper: Math.random() < 0.35,
      swapped: Math.random() < 0.35,
    };
    look.sig = [look.palette, look.fonts, look.hero, look.block, look.proof, look.motif, look.cta].join("-");
    if (!avoid || !avoid.has(look.sig)) break;
  }
  return look;
}

const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function waNumber(phone) {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.length === 10) d = "7" + d;
  if (d[0] === "8" && d.length === 11) d = "7" + d.slice(1);
  return d;
}
function waLink(phone, business) {
  return "https://wa.me/" + waNumber(phone) +
    "?text=" + encodeURIComponent("Здравствуйте! Пишу с сайта " + (business || "") + ". Хочу записаться.");
}

/* ─── Декор фона ───────────────────────────────────────────────────── */
function motif(kind) {
  if (kind === "rings")
    return { html: `<svg id="bg" viewBox="0 0 600 600" aria-hidden="true"><g fill="none" stroke="var(--acc)" stroke-width="1">
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
    return { html: `<div id="bg" aria-hidden="true"><i></i><b></b></div>`,
      css: `#bg{position:fixed;inset:0;z-index:0;overflow:hidden}
      #bg i,#bg b{position:absolute;border-radius:50%;filter:blur(90px)}
      #bg i{width:58vw;height:58vw;background:var(--acc);opacity:.18;top:-16vw;right:-10vw;animation:drift 24s ease-in-out infinite alternate}
      #bg b{width:42vw;height:42vw;background:var(--mut);opacity:.16;bottom:-12vw;left:-8vw;animation:drift 30s ease-in-out infinite alternate-reverse}
      @keyframes drift{to{transform:translate3d(6vw,4vh,0) scale(1.14)}}` };
  if (kind === "dots")
    return { html: `<canvas id="bg" aria-hidden="true"></canvas>`, css: `#bg{position:fixed;inset:0;z-index:0;opacity:.5}`, script: true };
  return { html: "", css: "" };
}

const dotsScript = `<script>(function(){
var c=document.getElementById('bg');if(!c||!c.getContext)return;var x=c.getContext('2d'),W,H,pts=[],
 acc=getComputedStyle(document.body).getPropertyValue('--acc').trim(),
 reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function size(){W=c.width=innerWidth;H=c.height=innerHeight;}size();addEventListener('resize',size);
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
function heroHtml(kind, d, wa) {
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

function blockHtml(kind, d) {
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

function proofHtml(kind, d) {
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
function buildSite(d, look, watermark) {
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

  const sections = [
    `<section class="sBlock"><h2>${esc(d.servicesTitle || "Что мы делаем")}</h2>${blockHtml(look.block, d)}</section>`,
    `<section class="sProof"><h2>${esc(d.pointsTitle || "Почему к нам возвращаются")}</h2>${proofHtml(look.proof, d)}</section>`,
  ];
  if (look.swapped) sections.reverse();

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
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style></head>
<body>
${mo.html}${mark}
<div class="w">
<header><div class="brand">${esc(d.businessName)}</div><a class="tel" href="${wa}" target="_blank" rel="noreferrer">${esc(d.phone)}</a></header>
${heroHtml(look.hero, d, wa)}
${sections.join("\n")}
<footer><p>${esc(d.address)}</p><p>${esc(d.businessName)} · ${esc(d.phone)}</p></footer>
</div>
<a class="float" href="${wa}" target="_blank" rel="noreferrer" aria-label="Написать в WhatsApp">
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5 0-.2 0-.4-.1-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 5 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3c-.8-1.3-1.3-2.8-1.3-4.4 0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.6 8.3-8 8.3z"/></svg>
Написать в WhatsApp</a>
${mo.script ? dotsScript : ""}
</body></html>`;
}
/* ─── Хранилище ────────────────────────────────────────────────────── */
const KEY_CODES = "wecreate:codes";
const KEY_SET = "wecreate:settings";
const ALPHABET = "ACDEFGHJKLMNPQRTUVWXY3479";

function makeCode() {
  let s = "";
  for (let i = 0; i < 8; i++) { if (i === 4) s += "-"; s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]; }
  return "WC-" + s;
}
async function loadCodes() {
  try { const r = await window.storage.get(KEY_CODES, true); return r && r.value ? JSON.parse(r.value) : []; }
  catch (e) { return []; }
}
async function saveCodes(list) {
  try { await window.storage.set(KEY_CODES, JSON.stringify(list), true); return true; } catch (e) { return false; }
}
async function loadSettings() {
  try { const r = await window.storage.get(KEY_SET, true); return r && r.value ? JSON.parse(r.value) : { auto: false }; }
  catch (e) { return { auto: false }; }
}
async function saveSettings(s) {
  try { await window.storage.set(KEY_SET, JSON.stringify(s), true); return true; } catch (e) { return false; }
}

/* ─── Стили лендинга ───────────────────────────────────────────────── */
const CSS2 = `
.pro{scroll-behavior:smooth}
.ln-nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:18px;
  padding:14px 26px;background:rgba(11,13,18,.78);backdrop-filter:blur(14px);border-bottom:1px solid var(--edge);flex-wrap:wrap}
.ln-mark{font-family:'Unbounded',sans-serif;font-weight:900;font-size:17px;letter-spacing:-.02em;cursor:default;user-select:none}
.ln-mark em{font-style:normal;color:var(--signal)}
.ln-navR{display:flex;align-items:center;gap:18px;font-size:13px;color:var(--mist)}
.ln-navR a{color:var(--mist);text-decoration:none}
.ln-navR a:hover{color:var(--paper)}
.ln-btn{background:var(--signal);color:#fff;border:none;border-radius:100px;padding:10px 20px;font-weight:700;font-size:13px;cursor:pointer;text-decoration:none;display:inline-block}

.ln-hero{position:relative;min-height:min(88vh,760px);display:flex;align-items:center;overflow:hidden;border-bottom:1px solid var(--edge)}
.ln-scrim{position:absolute;inset:0;z-index:1;pointer-events:none;
  background:radial-gradient(120% 90% at 12% 40%,rgba(11,13,18,.94) 8%,rgba(11,13,18,.5) 52%,rgba(11,13,18,.2) 100%)}
.ln-heroIn{position:relative;z-index:2;padding:70px 26px;max-width:860px}
.ln-kicker{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--brass);margin-bottom:22px}
.ln-h1{font-family:'Unbounded',sans-serif;font-weight:900;font-size:clamp(38px,7.4vw,86px);line-height:.98;letter-spacing:-.035em;margin:0}
.ln-h1 span{color:var(--signal)}
.ln-sub{margin-top:24px;font-size:clamp(16px,2.1vw,20px);color:var(--mist);max-width:52ch;line-height:1.55}
.ln-acts{display:flex;gap:14px;margin-top:36px;flex-wrap:wrap;align-items:center}
.ln-cta{background:var(--signal);color:#fff;border:none;border-radius:100px;padding:17px 34px;
  font-family:'Unbounded',sans-serif;font-weight:700;font-size:15px;cursor:pointer;text-decoration:none;display:inline-block;transition:transform .18s}
.ln-cta:hover{transform:translateY(-3px)}
.ln-ghost{color:var(--paper);text-decoration:none;font-size:14px;border-bottom:1px solid var(--edge);padding-bottom:3px}
.ln-meta{display:flex;gap:28px;margin-top:44px;flex-wrap:wrap;font-family:'JetBrains Mono',monospace;font-size:11px;
  text-transform:uppercase;letter-spacing:.12em;color:#5B6474}
.ln-meta b{color:var(--paper);font-family:'Unbounded',sans-serif;font-size:19px;display:block;margin-bottom:5px;letter-spacing:-.02em}

.ln-sec{padding:78px 26px;border-bottom:1px solid var(--edge);max-width:1180px;margin:0 auto}
.ln-secHead{display:flex;align-items:baseline;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:40px}
.ln-h2{font-family:'Unbounded',sans-serif;font-weight:700;font-size:clamp(22px,3.4vw,34px);letter-spacing:-.025em;margin:0}
.ln-hint{font-size:13px;color:#5B6474;max-width:34ch}
.ln-steps{display:grid;gap:0}
.ln-step{display:grid;grid-template-columns:80px 1fr 1.3fr;gap:24px;padding:26px 0;border-top:1px solid var(--edge);align-items:baseline}
.ln-step:last-child{border-bottom:1px solid var(--edge)}
.ln-step i{font-family:'Unbounded',sans-serif;font-style:normal;font-weight:900;font-size:26px;color:var(--signal);letter-spacing:-.03em}
.ln-step h3{font-family:'Unbounded',sans-serif;font-weight:400;font-size:19px;margin:0;letter-spacing:-.02em}
.ln-step p{color:var(--mist);font-size:15px;margin:0}
@media (max-width:760px){.ln-step{grid-template-columns:44px 1fr;gap:14px}.ln-step p{grid-column:2}}

.ln-priceRow{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}
@media (max-width:760px){.ln-priceRow{grid-template-columns:1fr}}
.ln-big{font-family:'Unbounded',sans-serif;font-weight:900;font-size:clamp(52px,10vw,104px);line-height:.9;letter-spacing:-.04em}
.ln-big small{display:block;font-family:'Golos Text',sans-serif;font-weight:400;font-size:15px;color:var(--mist);letter-spacing:0;margin-top:14px}
.ln-inc{list-style:none;padding:0;margin:0;display:grid;gap:12px}
.ln-inc li{padding-left:26px;position:relative;color:var(--mist);font-size:15px}
.ln-inc li:before{content:"";position:absolute;left:0;top:10px;width:13px;height:2px;background:var(--brass)}
.ln-foot{padding:40px 26px 60px;max-width:1180px;margin:0 auto;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;
  font-size:13px;color:#5B6474}
.ln-foot a{color:#5B6474}

.p-queue{display:grid;gap:10px;margin-top:14px}
.p-wait{border:1px solid var(--brass);border-radius:6px;padding:14px 16px;background:rgba(201,162,39,.08);font-size:13px;color:var(--paper)}
.p-wait b{display:block;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--brass);margin-bottom:6px}
.p-toggle{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--mist);cursor:pointer;margin-top:6px}
.p-toggle input{width:16px;height:16px;accent-color:#C9A227}
.p-flag{color:var(--signal)}
.p-act{border:1px solid var(--edge);background:transparent;color:var(--paper);border-radius:4px;padding:5px 10px;cursor:pointer;font-size:11px;font-family:'JetBrains Mono',monospace}
.p-act:hover{border-color:var(--brass)}
`;

/* ─── Кабинет владельца ────────────────────────────────────────────── */
function Admin({ onExit }) {
  const [pin, setPin] = useState("");
  const [ok, setOk] = useState(false);
  const [rows, setRows] = useState([]);
  const [cfg, setCfg] = useState({ auto: false });
  const [msg, setMsg] = useState("");
  const [newPin, setNewPin] = useState("");

  useEffect(() => {
    if (!ok) return;
    const load = () => { loadCodes().then(setRows); loadSettings().then(setCfg); };
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, [ok]);

  function tryPin() {
    if (pinHash(pin + HASH_SALT) === ADMIN.pinHash || pinHash(pin) === ADMIN.pinHash) { setOk(true); setMsg(""); }
    else setMsg("PIN не подошёл.");
  }
  async function setStatus(code, status) {
    const list = await loadCodes();
    const r = list.find((x) => x.code === code);
    if (r) { r.status = status; r.at2 = new Date().toISOString().slice(0, 16).replace("T", " "); }
    await saveCodes(list); setRows(list);
  }
  async function remove(code) {
    const list = (await loadCodes()).filter((x) => x.code !== code);
    await saveCodes(list); setRows(list);
  }
  async function toggleAuto(v) { const s = { ...cfg, auto: v }; setCfg(s); await saveSettings(s); }

  if (!ok)
    return (
      <div className="p-lock">
        <h2>Кабинет</h2>
        <p className="p-note" style={{ marginTop: 0, marginBottom: 16 }}>Введите PIN владельца</p>
        <input className="p-input" type="password" value={pin} inputMode="numeric" autoFocus
          onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") tryPin(); }} aria-label="PIN владельца" />
        <button className="p-go" style={{ marginTop: 12 }} type="button" onClick={tryPin}>Войти</button>
        {msg && <div className="p-err">{msg}</div>}
        <p style={{ marginTop: 20 }}><button className="p-exit" type="button" onClick={onExit}>Вернуться на сайт</button></p>
      </div>
    );

  const pending = rows.filter((r) => r.status === "pending");
  const done = rows.filter((r) => r.status !== "pending");
  const income = done.reduce((s, r) => s + (Number(r.amount) || 0), 0);

  return (
    <div className="p-admin">
      <h1>Кабинет</h1>
      <p className="p-note" style={{ marginTop: 0 }}>
        Сверяйте заявки с уведомлениями Kaspi. Сумма меньше {PAY.kzt} ₸ подсвечена красным — такую заявку отклоняйте.
      </p>

      <div className="p-stats">
        <div className="p-stat"><span>на проверке</span><b>{pending.length}</b></div>
        <div className="p-stat"><span>выдано</span><b>{done.length}</b></div>
        <div className="p-stat"><span>заявлено, ₸</span><b>{income}</b></div>
      </div>

      <label className="p-toggle">
        <input type="checkbox" checked={!!cfg.auto} onChange={(e) => toggleAuto(e.target.checked)} />
        Автовыдача без проверки (быстро, но рискованно)
      </label>

      <p className="p-eyebrow" style={{ marginTop: 28 }}>Ждут проверки</p>
      <table className="p-table">
        <thead><tr><th>Чек</th><th>Сумма</th><th>Когда</th><th>Код</th><th /></tr></thead>
        <tbody>
          {pending.map((r) => (
            <tr key={r.code}>
              <td>{r.receipt}</td>
              <td className={Number(r.amount) < PAY.kzt ? "p-flag" : ""}>{r.amount || "—"}</td>
              <td>{r.at}</td><td>{r.code}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button className="p-act" type="button" onClick={() => setStatus(r.code, "issued")}>выдать</button>{" "}
                <button className="p-act" type="button" onClick={() => remove(r.code)}>отклонить</button>
              </td>
            </tr>
          ))}
          {!pending.length && <tr><td colSpan="5" style={{ color: "#5B6474" }}>Заявок нет</td></tr>}
        </tbody>
      </table>

      <p className="p-eyebrow" style={{ marginTop: 30 }}>История</p>
      <table className="p-table">
        <thead><tr><th>Код</th><th>Чек</th><th>Сумма</th><th>Статус</th><th /></tr></thead>
        <tbody>
          {done.slice(0, 20).map((r) => (
            <tr key={r.code} className={r.status === "used" ? "p-used" : ""}>
              <td>{r.code}</td><td>{r.receipt}</td>
              <td className={Number(r.amount) < PAY.kzt ? "p-flag" : ""}>{r.amount || "—"}</td>
              <td>{r.status === "used" ? "забрал сайт" : "код выдан"}</td>
              <td><button className="p-exit" type="button" onClick={() => remove(r.code)}>удалить</button></td>
            </tr>
          ))}
          {!done.length && <tr><td colSpan="5" style={{ color: "#5B6474" }}>Пока пусто</td></tr>}
        </tbody>
      </table>

      <div style={{ marginTop: 34 }}>
        <p className="p-eyebrow">Сменить PIN</p>
        <div className="p-row" style={{ marginTop: 0 }}>
          <input className="p-input" placeholder="Новый PIN" value={newPin} onChange={(e) => setNewPin(e.target.value)} aria-label="Новый PIN" />
          <button className="p-mini" type="button" onClick={() => setMsg(String(pinHash(newPin + HASH_SALT)))}>Получить число</button>
        </div>
        {msg && <p className="p-note">Впишите в файл: <b style={{ color: "#C9A227" }}>pinHash: {msg}</b></p>}
      </div>

      <p style={{ marginTop: 30 }}><button className="p-exit" type="button" onClick={onExit}>Вернуться на сайт</button></p>
    </div>
  );
}

const STAGES = ["Текст", "Вёрстка", "Готово", "Оплачено"];

export default function WeCreate() {
  const [form, setForm] = useState({
    name: "Барбершоп «Пила»",
    about: "Мужские стрижки и бритьё опасной бритвой. Без записи, три мастера, кофе за счёт заведения.",
    city: "Алматы",
    phone: "+7 700 000-00-00",
  });
  const [stage, setStage] = useState(-1);
  const [data, setData] = useState(null);
  const [mood, setMood] = useState("светлый");
  const [look, setLook] = useState(rollLook("светлый"));
  const [serial, setSerial] = useState("");
  const [err, setErr] = useState("");
  const [device, setDevice] = useState("desktop");

  const [receipt, setReceipt] = useState("");
  const [amount, setAmount] = useState(String(PAY.kzt));
  const [req, setReq] = useState(null);       // {code, receipt, status}
  const [paid, setPaid] = useState(false);
  const [code, setCode] = useState("");
  const [admin, setAdmin] = useState(false);

  const busy = stage >= 0 && stage < 2;
  const linkRef = useRef(null);
  const clicks = useRef({ n: 0, t: 0 });
  const seen = useRef(new Set());

  useEffect(() => {
    if (typeof window !== "undefined" && window.location && window.location.hash === "#kabinet") setAdmin(true);
  }, []);

  /* ждём, пока владелец подтвердит оплату */
  useEffect(() => {
    if (!req || req.status !== "pending" || paid) return;
    const id = setInterval(async () => {
      const list = await loadCodes();
      const mine = list.find((x) => x.code === req.code);
      if (mine && mine.status === "issued") {
        mine.status = "used";
        await saveCodes(list);
        setReq(mine); setPaid(true); setStage(3);
      }
    }, 6000);
    return () => clearInterval(id);
  }, [req, paid]);

  function freshLook(m) {
    const l = rollLook(m, seen.current);
    seen.current.add(l.sig);
    if (seen.current.size > 400) seen.current.clear();
    return l;
  }
  function tapLogo() {
    const now = Date.now();
    clicks.current.n = now - clicks.current.t < 700 ? clicks.current.n + 1 : 1;
    clicks.current.t = now;
    if (clicks.current.n >= 5) { clicks.current.n = 0; setAdmin(true); }
  }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const preview = data ? buildSite(data, look, !paid) : "";

  async function generate() {
    setErr(""); setData(null); setStage(0);
    const prompt = `Ты копирайтер и арт-директор для сайтов малого бизнеса.

Бизнес: ${form.name}
Описание: ${form.about}
Город: ${form.city}
Телефон: ${form.phone}

Верни ТОЛЬКО JSON без markdown. Поле mood — одно из: тёмный, светлый, премиум, дерзкий, природный, технологичный.
{"mood":"","businessName":"","tagline":"до 4 слов","heroHeadline":"до 7 слов, конкретно, без штампов вроде «качество и надёжность»","heroSub":"2 предложения о пользе для клиента","ctaText":"2-3 слова, призыв написать в WhatsApp","servicesTitle":"","services":[{"title":"","text":"одно предложение"},{"title":"","text":""},{"title":"","text":""}],"pointsTitle":"","points":["","",""],"address":"город и режим работы","phone":""}`;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const j = await r.json();
      const raw = (j.content || []).map((c) => c.text || "").join("");
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));
      setStage(1);
      const m = MOODS[parsed.mood] ? parsed.mood : "светлый";
      setMood(m); setLook(freshLook(m));
      setData({ ...parsed, phone: parsed.phone || form.phone });
      setSerial("№ " + Date.now().toString().slice(-6));
      setStage(2);
    } catch (e) {
      setStage(-1);
      setErr("Не получилось собрать страницу. Заполните описание и попробуйте ещё раз.");
    }
  }

  async function sendRequest() {
    setErr("");
    const rec = receipt.replace(/\D/g, "");
    const amt = Number(String(amount).replace(/\D/g, ""));
    if (rec.length < 4) { setErr("Введите номер чека Kaspi — минимум 4 цифры."); return; }
    if (!amt) { setErr("Укажите сумму, которую перевели."); return; }
    const list = await loadCodes();
    const exists = list.find((x) => x.receipt === rec);
    if (exists) {
      if (exists.status === "used") { setErr("По этому чеку сайт уже забрали. Один чек — один сайт."); return; }
      setReq(exists);
      if (exists.status === "issued") { exists.status = "used"; await saveCodes(list); setPaid(true); setStage(3); }
      return;
    }
    const cfg = await loadSettings();
    const rowNew = {
      code: makeCode(), receipt: rec, amount: amt,
      at: new Date().toISOString().slice(0, 16).replace("T", " "),
      status: cfg.auto ? "issued" : "pending",
    };
    const next = [rowNew, ...list].slice(0, 400);
    if (!(await saveCodes(next))) { setErr("Хранилище недоступно, попробуйте ещё раз."); return; }
    setReq(rowNew);
    if (rowNew.status === "issued") { rowNew.status = "used"; await saveCodes(next); setPaid(true); setStage(3); }
  }

  async function activate() {
    setErr("");
    const c = code.trim().toUpperCase();
    const list = await loadCodes();
    const r = list.find((x) => x.code === c);
    if (!r) { setErr("Такого кода нет. Проверьте символы."); return; }
    if (r.status === "used") { setErr("Код уже использован — он одноразовый."); return; }
    if (r.status === "pending") { setErr("Оплата ещё не подтверждена."); return; }
    r.status = "used"; await saveCodes(list);
    setReq(r); setPaid(true); setStage(3);
  }

  function download() {
    const blob = new Blob([buildSite(data, look, false)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = linkRef.current;
    a.href = url; a.download = "index.html"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function copy(text) {
    const el = document.createElement("textarea");
    el.value = text; document.body.appendChild(el); el.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(el);
  }
  const toTool = () => {
    const t = document.getElementById("tool");
    if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (admin)
    return (
      <div className="pro">
        <style dangerouslySetInnerHTML={{ __html: CSS + CSS2 }} />
        <Admin onExit={() => { setAdmin(false); if (window.location.hash === "#kabinet") window.location.hash = ""; }} />
      </div>
    );

  return (
    <div className="pro">
      <style dangerouslySetInnerHTML={{ __html: CSS + CSS2 }} />

      <nav className="ln-nav">
        <div className="ln-mark" onClick={tapLogo}>WE<em>CREATE</em></div>
        <div className="ln-navR">
          <a href="#how">Как это работает</a>
          <a href="#price">{PAY.kzt} ₸</a>
          <button className="ln-btn" type="button" onClick={toTool}>Собрать сайт</button>
        </div>
      </nav>

      <header className="ln-hero">
        <Hero3D />
        <div className="ln-scrim" />
        <div className="ln-heroIn">
          <p className="ln-kicker">Сайты для малого бизнеса Казахстана</p>
          <h1 className="ln-h1">Сайт вашему делу<br />за <span>двадцать секунд</span></h1>
          <p className="ln-sub">
            Опишите бизнес тремя строчками. WeCreate напишет тексты, подберёт шрифты и цвета,
            соберёт страницу с кнопкой WhatsApp. Смотрите бесплатно — платите, только если понравилось.
          </p>
          <div className="ln-acts">
            <button className="ln-cta" type="button" onClick={toTool}>Собрать бесплатно</button>
            <a className="ln-ghost" href="#how">Сначала посмотреть, как это работает</a>
          </div>
          <div className="ln-meta">
            <div><b>20 сек</b>от описания до готовой страницы</div>
            <div><b>{PAY.kzt} ₸</b>один раз, без подписки</div>
            <div><b>0 ₸</b>посмотреть и передумать</div>
          </div>
        </div>
      </header>

      <section className="ln-sec" id="how">
        <div className="ln-secHead">
          <h2 className="ln-h2">Четыре шага</h2>
          <p className="ln-hint">Ни регистрации, ни паролей. Оплата в самом конце, когда сайт уже перед глазами.</p>
        </div>
        <div className="ln-steps">
          {[
            ["01", "Расскажите о деле", "Название, чем занимаетесь, город и номер WhatsApp. Пары предложений достаточно."],
            ["02", "Смотрите готовый сайт", "Тексты, цвета, шрифты и вёрстка подбираются под ваш бизнес. Не понравилось — жмите «Перемешать вид»."],
            ["03", "Платите, если забираете", `${PAY.kzt} ₸ через Kaspi. Пока не оплатили — на странице стоит водяной знак.`],
            ["04", "Выкладываете в интернет", "Скачиваете файл и получаете ссылку за полминуты. Инструкция внутри."],
          ].map(([n, t, p]) => (
            <div className="ln-step" key={n}><i>{n}</i><h3>{t}</h3><p>{p}</p></div>
          ))}
        </div>
      </section>

      <section className="ln-sec" id="tool">
        <div className="ln-secHead">
          <h2 className="ln-h2">Конструктор</h2>
          <p className="ln-hint">Слева — данные о бизнесе. Справа — то, что увидят ваши клиенты.</p>
        </div>

        <div className="p-grid" style={{ border: "1px solid var(--edge)", borderRadius: 8, overflow: "hidden" }}>
          <div className="p-panel">
            <p className="p-eyebrow">Данные бизнеса</p>
            <div className="p-field">
              <label className="p-label" htmlFor="n">Название</label>
              <input id="n" className="p-input" value={form.name} onChange={set("name")} />
            </div>
            <div className="p-field">
              <label className="p-label" htmlFor="a">Чем занимаетесь</label>
              <textarea id="a" className="p-area" value={form.about} onChange={set("about")} placeholder="Что делаете, для кого, чем отличаетесь" />
            </div>
            <div className="p-field">
              <label className="p-label" htmlFor="c">Город</label>
              <input id="c" className="p-input" value={form.city} onChange={set("city")} />
            </div>
            <div className="p-field">
              <label className="p-label" htmlFor="t">Телефон WhatsApp</label>
              <input id="t" className="p-input" value={form.phone} onChange={set("phone")} />
            </div>

            <button className="p-go" type="button" onClick={generate} disabled={busy}>
              {busy ? "Собираем…" : data ? "Собрать заново" : "Собрать сайт бесплатно"}
            </button>

            {data && (
              <div className="p-look">
                <p className="p-eyebrow" style={{ margin: 0 }}>Вид · настроение «{mood}»</p>
                <dl className="p-tokens">
                  <div><dt>палитра</dt><dd>{PALETTES[look.palette].id}</dd></div>
                  <div><dt>шрифты</dt><dd>{FONTS[look.fonts].id}</dd></div>
                  <div><dt>первый экран</dt><dd>{HERO_RU[look.hero]}</dd></div>
                  <div><dt>услуги</dt><dd>{BLOCK_RU[look.block]}</dd></div>
                  <div><dt>доводы</dt><dd>{PROOF_RU[look.proof]}</dd></div>
                  <div><dt>декор</dt><dd>{MOTIF_RU[look.motif]}</dd></div>
                </dl>
                <div className="p-swatch">
                  {["bg", "paper", "acc", "ink"].map((k) => (
                    <span key={k} style={{ background: PALETTES[look.palette][k] }} />
                  ))}
                </div>
                <button className="p-mini" style={{ width: "100%", padding: "11px 0", marginTop: 12 }}
                  type="button" onClick={() => setLook(freshLook(mood))}>Перемешать вид</button>
                <p className="p-note" style={{ marginTop: 8 }}>
                  Вариантов: {PALETTES.length * FONTS.length * HEROES.length * BLOCKS.length * PROOFS.length * MOTIFS.length * CTAS.length} — повторы не выпадают.
                </p>
              </div>
            )}

            <div className="p-lamps">
              {STAGES.map((s, i) => (
                <div className="p-lamp" key={s} data-on={(i === 3 ? paid : stage >= i) ? "1" : "0"}>
                  <span className="p-bulb" />{s}
                </div>
              ))}
            </div>

            {!paid && data && (
              <div className="p-gate">
                <p className="p-eyebrow">Забрать без водяного знака</p>
                <div className="p-price">{PAY.kzt} ₸<small>≈ ${PAY.usd}</small></div>
                <a className="p-kaspi" href={PAY.link} target="_blank" rel="noreferrer">Оплатить через Kaspi</a>
                <p className="p-note" style={{ marginTop: 10 }}>
                  Впишите в Kaspi ровно {PAY.kzt} ₸. Если сумма меньше — заявку отклонят.
                </p>

                {!req ? (
                  <div className="p-queue">
                    <div className="p-row" style={{ marginTop: 4 }}>
                      <input className="p-input" placeholder="Номер чека" value={receipt} inputMode="numeric"
                        onChange={(e) => setReceipt(e.target.value)} aria-label="Номер чека Kaspi" />
                      <input className="p-input" placeholder="Сумма" value={amount} inputMode="numeric"
                        style={{ maxWidth: 96 }} onChange={(e) => setAmount(e.target.value)} aria-label="Сумма перевода" />
                    </div>
                    <button className="p-mini" style={{ padding: "12px 0" }} type="button" onClick={sendRequest}>
                      Отправить на проверку
                    </button>
                  </div>
                ) : (
                  <div className="p-wait">
                    <b>оплата на проверке</b>
                    Заявка принята, чек № {req.receipt}. Владелец сверит платёж в Kaspi и откроет доступ —
                    обычно за несколько минут. Страницу можно не закрывать, доступ откроется сам.
                  </div>
                )}

                <div className="p-row">
                  <input className="p-input" placeholder="Или введите готовый код" value={code}
                    onChange={(e) => setCode(e.target.value)} aria-label="Код доступа" />
                  <button className="p-mini" type="button" onClick={activate}>Открыть</button>
                </div>
              </div>
            )}

            {paid && <p className="p-ok" style={{ marginTop: 20 }}>✓ оплачено · сайт ваш</p>}
            {err && <div className="p-err">{err}</div>}
          </div>

          <div className="p-stage">
            {paid && (
              <div className="p-deliver">
                <h3>Как выложить сайт в интернет</h3>
                <p>Файл готов. Осталось получить ссылку, которую можно кинуть в Instagram или 2ГИС.</p>
                <ol className="p-steps">
                  <li>Нажмите «Скачать HTML» — сохранится файл index.html</li>
                  <li>Откройте app.netlify.com/drop и перетащите файл в окно</li>
                  <li>Через 30 секунд получите бесплатную ссылку вида ваш-сайт.netlify.app</li>
                  <li>Свой домен (.kz) подключается там же в настройках</li>
                </ol>
                <div className="p-row">
                  <button className="p-mini" type="button" onClick={() => copy("https://app.netlify.com/drop")}>
                    Скопировать ссылку на Netlify Drop
                  </button>
                </div>
              </div>
            )}

            <div className="p-head">
              <span className="p-serial">{serial || "изделие не собрано"}{data && !paid ? " · предпросмотр" : ""}</span>
              <div className="p-tools">
                <button className="p-tool" type="button" data-on={device === "desktop" ? "1" : "0"} onClick={() => setDevice("desktop")}>Десктоп</button>
                <button className="p-tool" type="button" data-on={device === "mobile" ? "1" : "0"} onClick={() => setDevice("mobile")}>Телефон</button>
                <button className="p-tool" type="button" onClick={download} disabled={!paid || !data}>
                  {paid ? "Скачать HTML" : "Скачивание после оплаты"}
                </button>
              </div>
            </div>

            <div className="p-screen">
              {preview ? (
                <iframe className="p-frame" title="Готовый сайт" srcDoc={preview}
                  style={{ width: device === "mobile" ? "390px" : "100%" }} />
              ) : (
                <div className="p-empty">
                  <b>Здесь появится готовая страница</b>
                  <span>Опишите бизнес слева и нажмите «Собрать сайт бесплатно». Оплата — только чтобы забрать.</span>
                </div>
              )}
            </div>
            <a ref={linkRef} style={{ display: "none" }} href="#d">скачать</a>
          </div>
        </div>
      </section>

      <section className="ln-sec" id="price">
        <div className="ln-priceRow">
          <div>
            <div className="ln-big">{PAY.kzt} ₸<small>один платёж через Kaspi · без подписки и продлений</small></div>
          </div>
          <ul className="ln-inc">
            <li>Готовая страница одним файлом, работает без интернета у вас на телефоне</li>
            <li>Кнопка WhatsApp с готовым сообщением — клиент пишет в один тап</li>
            <li>Уникальный дизайн: цвета, шрифты и вёрстка не повторяются</li>
            <li>Инструкция, как получить ссылку в интернете бесплатно</li>
            <li>Сколько угодно попыток до оплаты</li>
          </ul>
        </div>
      </section>

      <footer className="ln-foot">
        <span>WECREATE · сайты для малого бизнеса</span>
        <span>Оплата через Kaspi · {PAY.kzt} ₸</span>
      </footer>
    </div>
  );
}
