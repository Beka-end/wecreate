import { useRef, useEffect } from "react";
import * as THREE from "three";

/* ─── Тема: лагуна ─────────────────────────────────────────────────── */
export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Manrope:wght@400;500;600;700&display=swap');

.pro{
  --paper:#FBFDFD; --shell:#FFFFFF; --mist:#EFF7F7; --sand:#F3E7D2; --sandDeep:#E6D3B3;
  --shallow:#8FE4DC; --lagoon:#2FB6AE; --deep:#12707E; --abyss:#0C4B58;
  --line:rgba(18,112,126,.14); --line2:rgba(18,112,126,.26);
  --ink:#10333B; --dim:#5F818A; --faint:#93AEB4;
  --coral:#FF7A66; --sun:#FFC46B;
  background:var(--paper); color:var(--ink); min-height:100vh;
  font-family:'Manrope',system-ui,sans-serif; -webkit-font-smoothing:antialiased;
}
.pro *{box-sizing:border-box}
.pro button{font-family:inherit}
.pro ::selection{background:var(--shallow);color:var(--abyss)}

/* лёгкая соляная фактура */
.grain{position:fixed;inset:0;z-index:80;pointer-events:none;opacity:.35;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)' opacity='.1'/%3E%3C/svg%3E")}

.p-canvas{position:absolute;inset:0}

/* ── Панель ────────────────────────────────────────────────────── */
.p-grid{display:grid;grid-template-columns:400px 1fr;background:var(--shell)}
@media (max-width:900px){.p-grid{grid-template-columns:1fr}}
.p-panel{padding:32px 30px 38px;border-right:1px solid var(--line);background:var(--mist)}
@media (max-width:900px){.p-panel{border-right:none;border-bottom:1px solid var(--line)}}
.p-eyebrow{font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--faint);margin:0 0 18px;font-weight:700}
.p-field{margin-bottom:18px}
.p-label{display:block;font-size:13.5px;font-weight:500;margin-bottom:8px;color:var(--deep)}
.p-input,.p-area{width:100%;border:1px solid var(--line);background:var(--shell);color:var(--ink);
  padding:14px 18px;font-family:inherit;font-size:14.5px;border-radius:16px;outline:none;
  transition:border-color .15s,box-shadow .15s}
.p-input::placeholder,.p-area::placeholder{color:var(--faint)}
.p-input:focus,.p-area:focus{border-color:var(--lagoon);box-shadow:0 0 0 4px rgba(47,182,174,.16)}
.p-area{min-height:96px;resize:vertical;line-height:1.55}
.p-go{width:100%;border:none;border-radius:100px;cursor:pointer;padding:17px;color:#fff;
  font-family:'Manrope',sans-serif;font-weight:700;font-size:15.5px;
  background:linear-gradient(115deg,var(--lagoon),#3FD0C0 60%,var(--shallow));
  box-shadow:0 12px 30px rgba(47,182,174,.34);transition:transform .18s,box-shadow .18s}
.p-go:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 18px 38px rgba(47,182,174,.42)}
.p-go:disabled{background:var(--mist);color:var(--faint);box-shadow:none;cursor:not-allowed}
.p-mini{border:1px solid var(--line2);background:var(--shell);color:var(--deep);padding:0 18px;border-radius:100px;
  cursor:pointer;font-size:12.5px;font-weight:600;white-space:nowrap;transition:all .15s}
.p-mini:hover{border-color:var(--lagoon);background:#F2FCFB;color:var(--abyss)}
.p-mini:disabled{opacity:.45;cursor:not-allowed}
.p-row{display:flex;gap:9px;margin-top:12px}
.p-row .p-input{flex:1}

.p-lamps{display:flex;gap:18px;margin-top:24px;flex-wrap:wrap}
.p-lamp{display:flex;align-items:center;gap:8px;font-size:10px;text-transform:uppercase;letter-spacing:.16em;
  color:var(--faint);font-weight:700}
.p-bulb{width:8px;height:8px;border-radius:50%;background:#D6E6E7}
.p-lamp[data-on="1"] .p-bulb{background:var(--lagoon);box-shadow:0 0 10px rgba(47,182,174,.7)}
.p-lamp[data-on="1"]{color:var(--deep)}

.p-look{margin-top:24px;border:1px solid var(--line);border-radius:24px;padding:20px;background:var(--shell);
  box-shadow:0 10px 30px rgba(18,112,126,.07)}
.p-tokens{margin:0;display:grid;gap:9px}
.p-tokens div{display:flex;justify-content:space-between;gap:12px;font-size:13px}
.p-tokens dt{color:var(--faint);text-transform:uppercase;letter-spacing:.12em;font-size:10px;padding-top:3px;font-weight:700}
.p-tokens dd{margin:0;text-align:right;color:var(--ink)}
.p-swatch{display:flex;gap:7px;margin-top:16px}
.p-swatch span{flex:1;height:34px;border-radius:100px;border:1px solid var(--line)}
.p-note{font-size:12.5px;color:var(--faint);margin-top:12px;line-height:1.6}

.p-gate{border:1px solid var(--line);border-radius:28px;padding:24px;margin-top:24px;
  background:linear-gradient(170deg,#EAFAF8,var(--shell))}
.p-price{font-family:'Playfair Display',serif;font-weight:600;font-size:38px;letter-spacing:-.02em;color:var(--abyss)}
.p-price small{font-family:'Manrope',sans-serif;font-weight:400;font-size:14px;color:var(--dim);margin-left:9px}
.p-kaspi{display:block;text-align:center;margin-top:18px;background:var(--coral);color:#fff;text-decoration:none;
  padding:16px;border-radius:100px;font-weight:700;font-size:15.5px;box-shadow:0 10px 26px rgba(255,122,102,.3);
  transition:transform .18s}
.p-kaspi:hover{transform:translateY(-2px)}
.p-queue{display:grid;gap:10px;margin-top:16px}
.p-wait{border:1px solid rgba(47,182,174,.45);border-radius:22px;padding:16px 18px;background:#EDFAF9;
  font-size:13.5px;color:var(--ink);line-height:1.6}
.p-wait b{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.18em;color:var(--deep);
  margin-bottom:8px;font-weight:800}
.p-ok{font-size:11px;color:var(--deep);text-transform:uppercase;letter-spacing:.18em;font-weight:800}
.p-err{border:1px solid rgba(255,122,102,.5);background:#FFF2EF;padding:14px 18px;font-size:13.5px;
  margin-top:16px;border-radius:22px;color:#B34A38}
.p-flag{color:var(--coral)}
.p-toggle{display:flex;align-items:center;gap:11px;font-size:13.5px;color:var(--deep);cursor:pointer;margin-top:10px}
.p-toggle input{width:17px;height:17px;accent-color:var(--lagoon)}
.p-act{border:1px solid var(--line2);background:var(--shell);color:var(--deep);border-radius:100px;padding:5px 13px;
  cursor:pointer;font-size:11.5px;font-weight:600}
.p-act:hover{border-color:var(--lagoon);color:var(--abyss)}

/* ── Предпросмотр ──────────────────────────────────────────────── */
.p-stage{padding:32px 30px 40px;min-width:0;background:var(--shell)}
.p-head{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:16px;flex-wrap:wrap}
.p-serial{font-size:11px;color:var(--faint);letter-spacing:.14em;text-transform:uppercase;font-weight:700}
.p-tools{display:flex;gap:8px;flex-wrap:wrap}
.p-tool{border:1px solid var(--line);background:transparent;color:var(--dim);padding:9px 16px;cursor:pointer;
  border-radius:100px;font-size:12px;font-weight:600;transition:all .15s}
.p-tool[data-on="1"]{background:var(--deep);color:#fff;border-color:var(--deep)}
.p-tool:hover:not(:disabled):not([data-on="1"]){border-color:var(--lagoon);color:var(--deep)}
.p-tool:disabled{opacity:.4;cursor:not-allowed}
.p-screen{border:1px solid var(--line);border-radius:24px;background:#fff;overflow:hidden;
  box-shadow:0 26px 64px rgba(18,112,126,.16)}
.p-frame{display:block;width:100%;height:620px;border:0;margin:0 auto;transition:width .3s cubic-bezier(.2,.8,.2,1)}
.p-empty{height:620px;background:linear-gradient(180deg,var(--mist),#E4F5F3);display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:12px;text-align:center;padding:30px}
.p-empty b{font-family:'Playfair Display',serif;font-weight:600;font-size:21px}
.p-empty span{max-width:320px;font-size:14px;color:var(--dim);line-height:1.6}
.p-deliver{border:1px solid var(--line);border-radius:24px;background:var(--mist);padding:24px;margin-bottom:18px}
.p-deliver h3{font-family:'Playfair Display',serif;font-weight:600;font-size:20px;margin:0 0 8px}
.p-deliver p{font-size:14px;color:var(--dim);margin:0 0 16px;line-height:1.6}
.p-steps{list-style:none;padding:0;margin:0;display:grid;gap:11px}
.p-steps li{font-size:14px;color:var(--deep);padding-left:28px;position:relative;line-height:1.55}
.p-steps li:before{content:"";position:absolute;left:0;top:8px;width:14px;height:3px;border-radius:3px;
  background:linear-gradient(90deg,var(--lagoon),var(--shallow))}

/* ── Кабинет ───────────────────────────────────────────────────── */
.p-admin{max-width:820px;margin:0 auto;padding:60px 26px 90px}
.p-admin h1{font-family:'Playfair Display',serif;font-weight:600;font-size:34px;margin:0 0 8px}
.p-lock{max-width:360px;margin:14vh auto;text-align:center}
.p-lock h2{font-family:'Playfair Display',serif;font-weight:600;font-size:24px;margin-bottom:10px}
.p-stats{display:flex;gap:12px;margin:22px 0 26px;flex-wrap:wrap}
.p-stat{flex:1;min-width:140px;border:1px solid var(--line);border-radius:100px;background:var(--shell);
  padding:18px 28px;box-shadow:0 8px 22px rgba(18,112,126,.07)}
.p-stat b{display:block;font-family:'Playfair Display',serif;font-weight:600;font-size:27px;margin-top:5px}
.p-stat span{font-size:9.5px;text-transform:uppercase;letter-spacing:.18em;color:var(--faint);font-weight:800}
.p-table{width:100%;border-collapse:collapse;margin-top:12px;font-size:13px}
.p-table th{text-align:left;color:var(--faint);font-weight:800;padding:10px 6px;border-bottom:1px solid var(--line);
  font-size:9.5px;text-transform:uppercase;letter-spacing:.14em}
.p-table td{padding:12px 6px;border-bottom:1px solid var(--line);color:var(--ink)}
.p-used{color:var(--faint)}
.p-exit{background:none;border:none;color:var(--dim);cursor:pointer;font-size:13.5px;text-decoration:underline;padding:0}
.p-exit:hover{color:var(--abyss)}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

/* ─── Сцена: водная гладь лагуны ───────────────────────────────────── */
export function Hero3D() {
  const mount = useRef(null);
  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xeaf7f6, 26, 62);

    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.1, 200);
    camera.position.set(0, 3.2, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    /* полуденное солнце над лагуной */
    scene.add(new THREE.AmbientLight(0xDFF4F2, 1.6));
    const sun = new THREE.DirectionalLight(0xFFF6E2, 1.6);
    sun.position.set(6, 14, 8);
    scene.add(sun);
    const bounce = new THREE.PointLight(0x8FE4DC, 60, 40);
    bounce.position.set(-8, 3, 6);
    scene.add(bounce);

    /* песчаное дно */
    const sand = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xEBDCBE, roughness: 1, metalness: 0 })
    );
    sand.rotation.x = -Math.PI / 2;
    sand.position.y = -1.5;
    scene.add(sand);

    /* вода: полупрозрачная гладь с бегущими волнами */
    const SEG = 90;
    const waterGeo = new THREE.PlaneGeometry(120, 120, SEG, SEG);
    const water = new THREE.Mesh(
      waterGeo,
      new THREE.MeshStandardMaterial({
        color: 0x49CFC4, roughness: 0.12, metalness: 0.35,
        transparent: true, opacity: 0.82, side: THREE.DoubleSide,
      })
    );
    water.rotation.x = -Math.PI / 2;
    scene.add(water);

    const base = Float32Array.from(waterGeo.attributes.position.array);

    /* блики на воде */
    function glintTexture() {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const x = c.getContext("2d");
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(255,255,255,.95)");
      g.addColorStop(0.3, "rgba(255,246,226,.35)");
      g.addColorStop(1, "rgba(255,246,226,0)");
      x.fillStyle = g;
      x.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    }
    const glintTex = glintTexture();
    const glints = [];
    for (let i = 0; i < 26; i++) {
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: glintTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
      );
      sp.position.set((Math.random() - 0.5) * 46, 0.12, (Math.random() - 0.5) * 34 - 6);
      const s = 0.4 + Math.random() * 1.1;
      sp.scale.set(s * 2.4, s * 0.5, 1);
      sp.userData = { s, phase: Math.random() * 6.28, drift: 0.2 + Math.random() * 0.5 };
      scene.add(sp);
      glints.push(sp);
    }

    /* лёгкая дымка над горизонтом */
    const haze = new THREE.Mesh(
      new THREE.PlaneGeometry(160, 26),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.35, depthWrite: false })
    );
    haze.position.set(0, 6, -46);
    scene.add(haze);

    let mx = 0, my = 0, raf;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      my = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    el.addEventListener("pointermove", onMove);

    const clock = new THREE.Clock();
    const pos = waterGeo.attributes.position;

    const tick = () => {
      const t = reduced ? 0.4 : clock.getElapsedTime();

      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3], y = base[i * 3 + 1];
        const h =
          Math.sin(x * 0.28 + t * 0.9) * 0.18 +
          Math.sin(y * 0.21 - t * 0.7) * 0.16 +
          Math.sin((x + y) * 0.12 + t * 1.3) * 0.09;
        pos.array[i * 3 + 2] = h;
      }
      pos.needsUpdate = true;
      waterGeo.computeVertexNormals();

      glints.forEach((sp) => {
        const u = sp.userData;
        sp.position.x += Math.sin(t * 0.4 + u.phase) * 0.004;
        sp.position.z -= u.drift * 0.004;
        if (sp.position.z < -30) sp.position.z = 12;
        const k = 0.55 + Math.sin(t * 1.6 + u.phase) * 0.45;
        sp.material.opacity = 0.25 + k * 0.5;
        sp.scale.set(u.s * (2.1 + k * 0.6), u.s * 0.5, 1);
      });

      camera.position.x += (mx * 2.4 - camera.position.x) * 0.03;
      camera.position.y += (3.2 - my * 0.9 - camera.position.y) * 0.03;
      camera.lookAt(0, 0.4, -12);

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
