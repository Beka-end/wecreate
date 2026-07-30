import { useRef, useEffect } from "react";
import * as THREE from "three";

/* ─── Тема: кофейня ────────────────────────────────────────────────── */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap');

.pro{
  --cream:#FBF5EC; --paper:#FFFCF7; --latte:#F0E3D2; --sand:#E3D3BC;
  --line:rgba(90,66,48,.14); --line2:rgba(90,66,48,.26);
  --espresso:#33231A; --cocoa:#6B4A34; --dim:#8A7461; --faint:#A99781;
  --crema:#C88A4A; --berry:#B4523F; --sage:#7C8F6B;
  background:var(--cream); color:var(--espresso); min-height:100vh;
  font-family:'Manrope',system-ui,sans-serif; -webkit-font-smoothing:antialiased;
}
.pro *{box-sizing:border-box}
.pro button{font-family:inherit}
.pro ::selection{background:var(--crema);color:#fff}

/* бумажная фактура */
.grain{position:fixed;inset:0;z-index:80;pointer-events:none;opacity:.5;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='4'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E")}

.p-canvas{position:absolute;inset:0}

/* ── Панель ────────────────────────────────────────────────────── */
.p-grid{display:grid;grid-template-columns:400px 1fr;background:var(--paper)}
@media (max-width:900px){.p-grid{grid-template-columns:1fr}}
.p-panel{padding:32px 30px 38px;border-right:1px solid var(--line);background:var(--cream)}
@media (max-width:900px){.p-panel{border-right:none;border-bottom:1px solid var(--line)}}
.p-eyebrow{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint);margin:0 0 18px;font-weight:600}
.p-field{margin-bottom:18px}
.p-label{display:block;font-size:13.5px;font-weight:500;margin-bottom:8px;color:var(--cocoa)}
.p-input,.p-area{width:100%;border:1px solid var(--line);background:var(--paper);color:var(--espresso);
  padding:14px 18px;font-family:inherit;font-size:14.5px;border-radius:16px;outline:none;
  transition:border-color .15s,box-shadow .15s}
.p-input::placeholder,.p-area::placeholder{color:var(--faint)}
.p-input:focus,.p-area:focus{border-color:var(--crema);box-shadow:0 0 0 4px rgba(200,138,74,.16)}
.p-area{min-height:96px;resize:vertical;line-height:1.55}
.p-go{width:100%;border:none;border-radius:100px;cursor:pointer;padding:17px;color:#FFF9F0;
  font-family:'Lora',serif;font-weight:600;font-size:16px;background:var(--cocoa);
  box-shadow:0 10px 26px rgba(107,74,52,.26);transition:transform .18s,box-shadow .18s,background .18s}
.p-go:hover:not(:disabled){transform:translateY(-2px);background:#5B3E2B;box-shadow:0 16px 34px rgba(107,74,52,.32)}
.p-go:disabled{background:var(--sand);color:var(--faint);box-shadow:none;cursor:not-allowed}
.p-mini{border:1px solid var(--line2);background:var(--paper);color:var(--cocoa);padding:0 18px;border-radius:100px;
  cursor:pointer;font-size:12.5px;font-weight:600;white-space:nowrap;transition:all .15s}
.p-mini:hover{border-color:var(--crema);background:#FDF6EC;color:var(--espresso)}
.p-mini:disabled{opacity:.45;cursor:not-allowed}
.p-row{display:flex;gap:9px;margin-top:12px}
.p-row .p-input{flex:1}

.p-lamps{display:flex;gap:18px;margin-top:24px;flex-wrap:wrap}
.p-lamp{display:flex;align-items:center;gap:8px;font-size:10.5px;text-transform:uppercase;letter-spacing:.14em;
  color:var(--faint);font-weight:600}
.p-bulb{width:8px;height:8px;border-radius:50%;background:var(--sand)}
.p-lamp[data-on="1"] .p-bulb{background:var(--crema);box-shadow:0 0 10px rgba(200,138,74,.6)}
.p-lamp[data-on="1"]{color:var(--cocoa)}

.p-look{margin-top:24px;border:1px solid var(--line);border-radius:24px;padding:20px;background:var(--paper);
  box-shadow:0 8px 24px rgba(90,66,48,.07)}
.p-tokens{margin:0;display:grid;gap:9px}
.p-tokens div{display:flex;justify-content:space-between;gap:12px;font-size:13px}
.p-tokens dt{color:var(--faint);text-transform:uppercase;letter-spacing:.1em;font-size:10px;padding-top:3px;font-weight:600}
.p-tokens dd{margin:0;text-align:right;color:var(--espresso)}
.p-swatch{display:flex;gap:7px;margin-top:16px}
.p-swatch span{flex:1;height:34px;border-radius:100px;border:1px solid var(--line)}
.p-note{font-size:12.5px;color:var(--faint);margin-top:12px;line-height:1.6}

.p-gate{border:1px solid var(--line);border-radius:28px;padding:24px;margin-top:24px;background:var(--latte);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.7)}
.p-price{font-family:'Lora',serif;font-weight:600;font-size:36px;letter-spacing:-.02em;color:var(--espresso)}
.p-price small{font-family:'Manrope',sans-serif;font-weight:400;font-size:14px;color:var(--dim);margin-left:9px}
.p-kaspi{display:block;text-align:center;margin-top:18px;background:var(--berry);color:#FFF6F3;text-decoration:none;
  padding:16px;border-radius:100px;font-family:'Lora',serif;font-weight:600;font-size:15.5px;transition:transform .18s}
.p-kaspi:hover{transform:translateY(-2px)}
.p-queue{display:grid;gap:10px;margin-top:16px}
.p-wait{border:1px solid rgba(124,143,107,.5);border-radius:22px;padding:16px 18px;background:rgba(124,143,107,.1);
  font-size:13.5px;color:var(--espresso);line-height:1.6}
.p-wait b{display:block;font-size:10.5px;text-transform:uppercase;letter-spacing:.16em;color:var(--sage);
  margin-bottom:8px;font-weight:700}
.p-ok{font-size:11.5px;color:var(--sage);text-transform:uppercase;letter-spacing:.16em;font-weight:700}
.p-err{border:1px solid rgba(180,82,63,.4);background:rgba(180,82,63,.08);padding:14px 18px;font-size:13.5px;
  margin-top:16px;border-radius:22px;color:#8E3F30}
.p-flag{color:var(--berry)}
.p-toggle{display:flex;align-items:center;gap:11px;font-size:13.5px;color:var(--cocoa);cursor:pointer;margin-top:10px}
.p-toggle input{width:17px;height:17px;accent-color:var(--crema)}
.p-act{border:1px solid var(--line2);background:var(--paper);color:var(--cocoa);border-radius:100px;padding:5px 13px;
  cursor:pointer;font-size:11.5px;font-weight:600}
.p-act:hover{border-color:var(--crema);color:var(--espresso)}

/* ── Предпросмотр ──────────────────────────────────────────────── */
.p-stage{padding:32px 30px 40px;min-width:0;background:var(--paper)}
.p-head{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:16px;flex-wrap:wrap}
.p-serial{font-size:11.5px;color:var(--faint);letter-spacing:.08em;text-transform:uppercase;font-weight:600}
.p-tools{display:flex;gap:8px;flex-wrap:wrap}
.p-tool{border:1px solid var(--line);background:transparent;color:var(--dim);padding:9px 16px;cursor:pointer;
  border-radius:100px;font-size:12px;font-weight:600;transition:all .15s}
.p-tool[data-on="1"]{background:var(--espresso);color:var(--cream);border-color:var(--espresso)}
.p-tool:hover:not(:disabled):not([data-on="1"]){border-color:var(--crema);color:var(--espresso)}
.p-tool:disabled{opacity:.4;cursor:not-allowed}
.p-screen{border:1px solid var(--line);border-radius:24px;background:#fff;overflow:hidden;
  box-shadow:0 24px 60px rgba(90,66,48,.16)}
.p-frame{display:block;width:100%;height:620px;border:0;margin:0 auto;transition:width .3s cubic-bezier(.2,.8,.2,1)}
.p-empty{height:620px;background:var(--latte);display:flex;flex-direction:column;align-items:center;
  justify-content:center;gap:12px;text-align:center;padding:30px}
.p-empty b{font-family:'Lora',serif;font-weight:600;font-size:20px}
.p-empty span{max-width:320px;font-size:14px;color:var(--dim);line-height:1.6}
.p-deliver{border:1px solid var(--line);border-radius:24px;background:var(--latte);padding:24px;margin-bottom:18px}
.p-deliver h3{font-family:'Lora',serif;font-weight:600;font-size:19px;margin:0 0 8px}
.p-deliver p{font-size:14px;color:var(--dim);margin:0 0 16px;line-height:1.6}
.p-steps{list-style:none;padding:0;margin:0;display:grid;gap:11px}
.p-steps li{font-size:14px;color:var(--cocoa);padding-left:28px;position:relative;line-height:1.55}
.p-steps li:before{content:"";position:absolute;left:0;top:7px;width:13px;height:13px;border-radius:50%;
  border:1.5px solid var(--crema)}

/* ── Кабинет ───────────────────────────────────────────────────── */
.p-admin{max-width:820px;margin:0 auto;padding:60px 26px 90px}
.p-admin h1{font-family:'Lora',serif;font-weight:600;font-size:34px;margin:0 0 8px}
.p-lock{max-width:360px;margin:14vh auto;text-align:center}
.p-lock h2{font-family:'Lora',serif;font-weight:600;font-size:24px;margin-bottom:10px}
.p-stats{display:flex;gap:12px;margin:22px 0 26px;flex-wrap:wrap}
.p-stat{flex:1;min-width:140px;border:1px solid var(--line);border-radius:100px;background:var(--paper);
  padding:18px 28px;box-shadow:0 6px 18px rgba(90,66,48,.06)}
.p-stat b{display:block;font-family:'Lora',serif;font-weight:600;font-size:26px;margin-top:5px}
.p-stat span{font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:var(--faint);font-weight:700}
.p-table{width:100%;border-collapse:collapse;margin-top:12px;font-size:13px}
.p-table th{text-align:left;color:var(--faint);font-weight:700;padding:10px 6px;border-bottom:1px solid var(--line);
  font-size:10px;text-transform:uppercase;letter-spacing:.12em}
.p-table td{padding:12px 6px;border-bottom:1px solid var(--line);color:var(--espresso)}
.p-used{color:var(--faint)}
.p-exit{background:none;border:none;color:var(--dim);cursor:pointer;font-size:13.5px;text-decoration:underline;padding:0}
.p-exit:hover{color:var(--espresso)}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

/* ─── Сцена: чашка кофе, пар и зёрна ───────────────────────────────── */
export function Hero3D() {
  const mount = useRef(null);
  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, el.clientWidth / el.clientHeight, 0.1, 100);
    camera.position.set(0, 1.9, 7.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    /* тёплый свет из окна кофейни */
    scene.add(new THREE.AmbientLight(0xFFF0DC, 1.5));
    const sun = new THREE.DirectionalLight(0xFFE7C4, 1.5);
    sun.position.set(4, 7, 5);
    scene.add(sun);
    const fill = new THREE.PointLight(0xFFCF9B, 40, 20);
    fill.position.set(-4, 2, 4);
    scene.add(fill);
    const back = new THREE.PointLight(0xC88A4A, 26, 16);
    back.position.set(0, 1, -5);
    scene.add(back);

    const stage = new THREE.Group();
    stage.rotation.y = -0.35;
    scene.add(stage);

    const porcelain = new THREE.MeshStandardMaterial({
      color: 0xFFFBF4, roughness: 0.34, metalness: 0.04, side: THREE.DoubleSide,
    });
    const coffeeMat = new THREE.MeshStandardMaterial({ color: 0x3A2015, roughness: 0.16, metalness: 0.22 });
    const cremaMat = new THREE.MeshStandardMaterial({ color: 0xC08243, roughness: 0.5, metalness: 0.05 });

    /* блюдце */
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 1.9, 0.09, 72), porcelain);
    saucer.position.y = -0.78;
    stage.add(saucer);
    const saucerRim = new THREE.Mesh(new THREE.TorusGeometry(2.03, 0.045, 12, 80), porcelain);
    saucerRim.rotation.x = Math.PI / 2;
    saucerRim.position.y = -0.735;
    stage.add(saucerRim);

    /* чашка */
    const cup = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 0.84, 1.34, 72, 1, true), porcelain);
    cup.add(body);
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.84, 48), porcelain);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -0.67;
    cup.add(bottom);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.045, 14, 80), porcelain);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.67;
    cup.add(rim);

    /* напиток и пенка */
    const drink = new THREE.Mesh(new THREE.CircleGeometry(1.07, 56), coffeeMat);
    drink.rotation.x = -Math.PI / 2;
    drink.position.y = 0.5;
    cup.add(drink);
    const crema = new THREE.Mesh(new THREE.CircleGeometry(0.62, 48), cremaMat);
    crema.rotation.x = -Math.PI / 2;
    crema.position.y = 0.505;
    cup.add(crema);
    const cremaRing = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.035, 10, 64), cremaMat);
    cremaRing.rotation.x = Math.PI / 2;
    cremaRing.position.y = 0.508;
    cup.add(cremaRing);

    /* ручка */
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.085, 16, 60, Math.PI * 1.45), porcelain);
    handle.position.set(1.16, 0.05, 0);
    handle.rotation.z = -Math.PI * 0.72;
    cup.add(handle);

    cup.position.y = -0.05;
    stage.add(cup);

    /* пар: мягкие спрайты, поднимаются и тают */
    function puffTexture() {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const x = c.getContext("2d");
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(255,252,246,.85)");
      g.addColorStop(0.4, "rgba(255,250,240,.28)");
      g.addColorStop(1, "rgba(255,250,240,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    }
    const puffTex = puffTexture();
    const steam = [];
    for (let i = 0; i < 18; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 0 }));
      sp.userData = { t: Math.random(), speed: 0.16 + Math.random() * 0.16, sway: (Math.random() - 0.5) * 0.9, x: (Math.random() - 0.5) * 0.7 };
      stage.add(sp);
      steam.push(sp);
    }

    /* кофейные зёрна вокруг */
    const beanGeo = new THREE.SphereGeometry(0.16, 20, 14);
    const beanMat = new THREE.MeshStandardMaterial({ color: 0x5A3520, roughness: 0.55, metalness: 0.08 });
    const beans = [];
    for (let i = 0; i < 9; i++) {
      const b = new THREE.Mesh(beanGeo, beanMat);
      b.scale.set(1, 0.66, 0.8);
      const a = (i / 9) * Math.PI * 2;
      b.position.set(Math.cos(a) * (2.5 + Math.random() * 0.7), -0.66 + Math.random() * 0.05, Math.sin(a) * (2.3 + Math.random() * 0.6));
      b.rotation.set(Math.random(), Math.random() * Math.PI, Math.random());
      b.userData = { spin: (Math.random() - 0.5) * 0.4, phase: Math.random() * 6.28 };
      stage.add(b);
      beans.push(b);
    }

    let mx = 0, my = 0, raf;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    el.addEventListener("pointermove", onMove);

    const clock = new THREE.Clock();
    clock.getDelta();

    const tick = () => {
      const t = clock.getElapsedTime();
      const dt = reduced ? 0 : Math.min(clock.getDelta(), 0.05);

      steam.forEach((sp) => {
        const u = sp.userData;
        u.t += dt * u.speed;
        if (u.t > 1) { u.t = 0; u.x = (Math.random() - 0.5) * 0.7; u.sway = (Math.random() - 0.5) * 0.9; }
        const k = u.t;
        sp.position.set(u.x + Math.sin(k * 4 + u.sway * 3) * 0.28 * k, 0.6 + k * 2.9, Math.cos(k * 3) * 0.16);
        sp.scale.setScalar(0.5 + k * 1.9);
        sp.material.opacity = Math.sin(Math.PI * k) * 0.5;
      });

      beans.forEach((b) => {
        b.rotation.y += b.userData.spin * dt;
        b.position.y = -0.66 + Math.sin(t * 0.8 + b.userData.phase) * 0.03;
      });

      stage.rotation.y += (-0.35 + mx * 0.32 - stage.rotation.y) * 0.04;
      camera.position.y += (1.9 - my * 0.5 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.1, 0);

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
