import { useRef, useEffect } from "react";
import * as THREE from "three";

/* ─── Тема интерфейса ──────────────────────────────────────────────── */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@600;900&family=Inter+Tight:wght@400;500;600;700&family=Manrope:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

.pro{
  --void:#07070A; --deep:#0C0C11; --surface:#12121A; --glass:rgba(255,255,255,.035);
  --line:rgba(255,255,255,.08); --line2:rgba(255,255,255,.14);
  --text:#F2F2F5; --dim:#9695A4; --faint:#5E5D6B;
  --a1:#6C5CE7; --a2:#12CFB0; --hot:#FF6B57; --gold:#F0C46A;
  background:var(--void); color:var(--text); min-height:100vh;
  font-family:'Manrope',system-ui,sans-serif; -webkit-font-smoothing:antialiased;
}
.pro *{box-sizing:border-box}
.pro button{font-family:inherit}
.pro ::selection{background:var(--a1);color:#fff}

/* зерно поверх всего — придаёт «дорогую» матовость */
.grain{position:fixed;inset:0;z-index:80;pointer-events:none;opacity:.05;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E")}

.p-canvas{position:absolute;inset:0}

/* ── Панель станка ─────────────────────────────────────────────── */
.p-grid{display:grid;grid-template-columns:400px 1fr;background:var(--deep)}
@media (max-width:900px){.p-grid{grid-template-columns:1fr}}
.p-panel{padding:30px 28px 36px;border-right:1px solid var(--line)}
@media (max-width:900px){.p-panel{border-right:none;border-bottom:1px solid var(--line)}}
.p-eyebrow{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;
  color:var(--faint);margin:0 0 18px}
.p-field{margin-bottom:18px}
.p-label{display:block;font-size:13px;font-weight:500;margin-bottom:8px;color:var(--dim)}
.p-input,.p-area{width:100%;border:1px solid var(--line);background:var(--glass);color:var(--text);
  padding:13px 15px;font-family:inherit;font-size:14.5px;border-radius:10px;outline:none;transition:border-color .15s,box-shadow .15s}
.p-input::placeholder,.p-area::placeholder{color:var(--faint)}
.p-input:focus,.p-area:focus{border-color:var(--a1);box-shadow:0 0 0 4px rgba(108,92,231,.16)}
.p-area{min-height:96px;resize:vertical;line-height:1.5}
.p-go{width:100%;border:none;border-radius:12px;cursor:pointer;padding:17px;color:#fff;
  font-family:'Inter Tight',sans-serif;font-weight:600;font-size:15.5px;letter-spacing:-.01em;
  background:linear-gradient(120deg,var(--a1),#8E7BFF 55%,var(--a2));
  box-shadow:0 10px 34px rgba(108,92,231,.32);transition:transform .18s,box-shadow .18s}
.p-go:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 16px 40px rgba(108,92,231,.42)}
.p-go:disabled{background:var(--surface);color:var(--faint);box-shadow:none;cursor:not-allowed}
.p-mini{border:1px solid var(--line2);background:var(--glass);color:var(--text);padding:0 16px;border-radius:9px;
  cursor:pointer;font-size:12.5px;font-weight:500;white-space:nowrap;transition:border-color .15s,background .15s}
.p-mini:hover{border-color:var(--a2);background:rgba(18,207,176,.08)}
.p-mini:disabled{opacity:.4;cursor:not-allowed}
.p-row{display:flex;gap:9px;margin-top:12px}
.p-row .p-input{flex:1}

.p-lamps{display:flex;gap:18px;margin-top:24px;flex-wrap:wrap}
.p-lamp{display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:10px;
  text-transform:uppercase;letter-spacing:.14em;color:var(--faint)}
.p-bulb{width:7px;height:7px;border-radius:50%;background:#26262F}
.p-lamp[data-on="1"] .p-bulb{background:var(--a2);box-shadow:0 0 10px var(--a2)}
.p-lamp[data-on="1"]{color:var(--text)}

.p-look{margin-top:24px;border:1px solid var(--line);border-radius:14px;padding:18px;background:var(--glass)}
.p-tokens{margin:0;display:grid;gap:9px}
.p-tokens div{display:flex;justify-content:space-between;gap:12px;font-size:12.5px}
.p-tokens dt{color:var(--faint);font-family:'JetBrains Mono',monospace;text-transform:uppercase;
  letter-spacing:.1em;font-size:9.5px;padding-top:3px}
.p-tokens dd{margin:0;text-align:right;color:var(--text)}
.p-swatch{display:flex;gap:7px;margin-top:16px}
.p-swatch span{flex:1;height:30px;border-radius:8px;border:1px solid var(--line2)}
.p-note{font-size:12px;color:var(--faint);margin-top:12px;line-height:1.55}

.p-gate{border:1px solid var(--line2);border-radius:16px;padding:22px;margin-top:24px;
  background:radial-gradient(120% 100% at 0% 0%,rgba(108,92,231,.16),transparent 60%),var(--surface)}
.p-price{font-family:'Unbounded',sans-serif;font-weight:900;font-size:34px;letter-spacing:-.03em;
  background:linear-gradient(100deg,#fff,#BFB6FF);-webkit-background-clip:text;background-clip:text;color:transparent}
.p-price small{font-family:'Manrope',sans-serif;font-weight:400;font-size:14px;color:var(--dim);margin-left:9px;
  -webkit-text-fill-color:var(--dim)}
.p-kaspi{display:block;text-align:center;margin-top:18px;background:var(--gold);color:#171205;text-decoration:none;
  padding:16px;border-radius:12px;font-family:'Inter Tight',sans-serif;font-weight:600;font-size:15px;transition:transform .18s}
.p-kaspi:hover{transform:translateY(-2px)}
.p-queue{display:grid;gap:10px;margin-top:16px}
.p-wait{border:1px solid rgba(18,207,176,.4);border-radius:12px;padding:16px;background:rgba(18,207,176,.07);
  font-size:13px;color:var(--text);line-height:1.55}
.p-wait b{display:block;font-family:'JetBrains Mono',monospace;font-size:10px;text-transform:uppercase;
  letter-spacing:.18em;color:var(--a2);margin-bottom:8px}
.p-ok{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--a2);text-transform:uppercase;letter-spacing:.16em}
.p-err{border:1px solid rgba(255,107,87,.45);background:rgba(255,107,87,.09);padding:13px 15px;font-size:13px;
  margin-top:16px;border-radius:12px;color:#FFC7BF}
.p-flag{color:var(--hot)}
.p-toggle{display:flex;align-items:center;gap:11px;font-size:13px;color:var(--dim);cursor:pointer;margin-top:10px}
.p-toggle input{width:17px;height:17px;accent-color:var(--a1)}
.p-act{border:1px solid var(--line2);background:transparent;color:var(--text);border-radius:7px;padding:5px 11px;
  cursor:pointer;font-size:11px;font-family:'JetBrains Mono',monospace}
.p-act:hover{border-color:var(--a2);color:var(--a2)}

/* ── Экран предпросмотра ───────────────────────────────────────── */
.p-stage{padding:30px 28px 40px;min-width:0}
.p-head{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:16px;flex-wrap:wrap}
.p-serial{font-family:'JetBrains Mono',monospace;font-size:10.5px;color:var(--faint);letter-spacing:.1em}
.p-tools{display:flex;gap:8px;flex-wrap:wrap}
.p-tool{border:1px solid var(--line);background:transparent;color:var(--dim);padding:9px 14px;cursor:pointer;
  border-radius:9px;font-size:11.5px;font-family:'JetBrains Mono',monospace;transition:all .15s}
.p-tool[data-on="1"]{background:var(--text);color:var(--void);border-color:var(--text)}
.p-tool:hover:not(:disabled):not([data-on="1"]){border-color:var(--line2);color:var(--text)}
.p-tool:disabled{opacity:.32;cursor:not-allowed}
.p-screen{border:1px solid var(--line);border-radius:16px;background:#fff;overflow:hidden;
  box-shadow:0 30px 80px rgba(0,0,0,.5)}
.p-frame{display:block;width:100%;height:620px;border:0;margin:0 auto;transition:width .3s cubic-bezier(.2,.8,.2,1)}
.p-empty{height:620px;background:var(--surface);display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:12px;text-align:center;padding:30px}
.p-empty b{font-family:'Inter Tight',sans-serif;font-weight:600;font-size:18px;letter-spacing:-.02em}
.p-empty span{max-width:320px;font-size:13.5px;color:var(--dim);line-height:1.6}
.p-deliver{border:1px solid var(--line);border-radius:16px;background:var(--surface);padding:22px;margin-bottom:18px}
.p-deliver h3{font-family:'Inter Tight',sans-serif;font-weight:600;font-size:17px;margin:0 0 8px;letter-spacing:-.02em}
.p-deliver p{font-size:13.5px;color:var(--dim);margin:0 0 16px;line-height:1.6}
.p-steps{list-style:none;padding:0;margin:0;display:grid;gap:10px;counter-reset:s}
.p-steps li{font-size:13.5px;color:var(--dim);padding-left:26px;position:relative;line-height:1.5}
.p-steps li:before{content:"";position:absolute;left:0;top:9px;width:12px;height:2px;border-radius:2px;
  background:linear-gradient(90deg,var(--a1),var(--a2))}

/* ── Кабинет ───────────────────────────────────────────────────── */
.p-admin{max-width:820px;margin:0 auto;padding:56px 26px 80px}
.p-admin h1{font-family:'Unbounded',sans-serif;font-weight:900;font-size:30px;letter-spacing:-.035em;margin:0 0 8px}
.p-lock{max-width:360px;margin:14vh auto;text-align:center}
.p-lock h2{font-family:'Unbounded',sans-serif;font-weight:600;font-size:20px;letter-spacing:-.02em;margin-bottom:10px}
.p-stats{display:flex;gap:12px;margin:22px 0 26px;flex-wrap:wrap}
.p-stat{flex:1;min-width:130px;border:1px solid var(--line);border-radius:14px;background:var(--glass);padding:16px 18px}
.p-stat b{display:block;font-family:'Unbounded',sans-serif;font-weight:600;font-size:26px;margin-top:6px;letter-spacing:-.03em}
.p-stat span{font-family:'JetBrains Mono',monospace;font-size:9.5px;text-transform:uppercase;letter-spacing:.16em;color:var(--faint)}
.p-table{width:100%;border-collapse:collapse;margin-top:12px;font-size:12.5px}
.p-table th{text-align:left;color:var(--faint);font-weight:400;padding:9px 6px;border-bottom:1px solid var(--line);
  font-family:'JetBrains Mono',monospace;font-size:9.5px;text-transform:uppercase;letter-spacing:.12em}
.p-table td{padding:11px 6px;border-bottom:1px solid var(--line);color:var(--text)}
.p-used{color:var(--faint)}
.p-exit{background:none;border:none;color:var(--dim);cursor:pointer;font-size:13px;text-decoration:underline;padding:0}
.p-exit:hover{color:var(--text)}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

/* ─── 3D-сцена: стеклянные плиты в световом поле ───────────────────── */
export function Hero3D() {
  const mount = useRef(null);
  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x07070a, 10, 24);
    const camera = new THREE.PerspectiveCamera(40, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 1.4, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x2A2A44, 1.4));
    const key = new THREE.DirectionalLight(0xEDEBFF, 1.1);
    key.position.set(5, 8, 7);
    scene.add(key);
    const violet = new THREE.PointLight(0x6C5CE7, 90, 26);
    violet.position.set(-6, 1, 4);
    scene.add(violet);
    const teal = new THREE.PointLight(0x12CFB0, 60, 22);
    teal.position.set(6, -2, 2);
    scene.add(teal);

    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.BoxGeometry(1.6, 2.2, 0.03);
    const mats = [
      new THREE.MeshStandardMaterial({ color: 0x1B1B2A, roughness: 0.18, metalness: 0.6 }),
      new THREE.MeshStandardMaterial({ color: 0xEFEEF6, roughness: 0.4, metalness: 0.1 }),
      new THREE.MeshStandardMaterial({ color: 0x6C5CE7, roughness: 0.25, metalness: 0.5 }),
    ];
    const plates = [];
    const N = 18;
    for (let i = 0; i < N; i++) {
      const m = new THREE.Mesh(geo, mats[i % 6 === 0 ? 2 : i % 3 === 0 ? 1 : 0]);
      const a = (i / N) * Math.PI * 2;
      m.position.set(Math.cos(a) * 4.6, ((i % 5) - 2) * 0.78, Math.sin(a) * 4.6);
      m.rotation.set(0, -a + Math.PI / 2, (i % 2 ? 1 : -1) * 0.07);
      m.userData.base = m.position.y;
      group.add(m);
      plates.push(m);
    }

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(6.1, 0.008, 6, 160),
      new THREE.MeshBasicMaterial({ color: 0x12CFB0, transparent: true, opacity: 0.55 })
    );
    ring.rotation.x = Math.PI / 2;
    group.add(ring);

    const g = new THREE.BufferGeometry();
    const arr = [];
    for (let i = 0; i < 520; i++)
      arr.push((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 20);
    g.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3));
    const dust = new THREE.Points(g, new THREE.PointsMaterial({ color: 0x7A78A0, size: 0.035, transparent: true, opacity: 0.8 }));
    scene.add(dust);

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
      group.rotation.y = reduced ? 0.5 : t * 0.16;
      group.rotation.x = -0.1;
      plates.forEach((p, i) => { p.position.y = p.userData.base + Math.sin(t * 0.7 + i * 0.6) * 0.2; });
      dust.rotation.y = t * 0.015;
      camera.position.x += (mx * 1.2 - camera.position.x) * 0.035;
      camera.position.y += (1.4 - my * 0.7 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);
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
