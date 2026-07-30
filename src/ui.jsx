import { useRef, useEffect } from "react";
import * as THREE from "three";


/* ─── Стили интерфейса ─────────────────────────────────────────────── */
export const CSS = `
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
export function Hero3D() {
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