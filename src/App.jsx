import { useState, useRef, useEffect } from "react";
import { CSS, Hero3D } from "./ui.jsx";
import { askAI, reserveAmount, createRequest, checkStatus, redeem, adminCall, saveProject, loadProject } from "./api.js";
import {
  PALETTES, FONTS, HEROES, BLOCKS, PROOFS, MOTIFS, CTAS, MOODS,
  HERO_RU, BLOCK_RU, PROOF_RU, MOTIF_RU, rollLook, buildSite,
} from "./site.js";

/* ─── Настройки: ссылка Kaspi и цена ───────────────────────────────── */
const PAY = {
  link: "https://pay.kaspi.kz/pay/cwevqlzj",
  kzt: 2500,
  usd: 5,
};

const CSS2 = `
.pro{scroll-behavior:smooth}

/* ── Навигация ─────────────────────────────────────────────────── */
.ln-nav{position:sticky;top:0;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:20px;
  padding:16px 34px;background:rgba(251,253,253,.82);backdrop-filter:blur(18px) saturate(1.3);
  border-bottom:1px solid var(--line);flex-wrap:wrap}
.ln-mark{font-family:'Playfair Display',serif;font-weight:600;font-size:21px;letter-spacing:-.01em;
  cursor:default;user-select:none;color:var(--abyss)}
.ln-mark em{font-style:italic;color:var(--lagoon)}
.ln-navR{display:flex;align-items:center;gap:24px;font-size:14px;color:var(--dim)}
.ln-navR a{color:var(--dim);text-decoration:none;transition:color .15s}
.ln-navR a:hover{color:var(--abyss)}
.ln-btn{border:none;border-radius:100px;padding:11px 22px;font-weight:700;font-size:13.5px;cursor:pointer;color:#fff;
  background:linear-gradient(115deg,var(--lagoon),#3FD0C0);box-shadow:0 8px 20px rgba(47,182,174,.32);
  transition:transform .18s}
.ln-btn:hover{transform:translateY(-2px)}

/* ── Первый экран: текст над водой ─────────────────────────────── */
.ln-hero{position:relative;min-height:min(96vh,900px);display:flex;flex-direction:column;align-items:center;
  overflow:hidden;text-align:center;padding:96px 26px 0;
  background:linear-gradient(180deg,#FBFDFD 0%,#EEF8F8 34%,#DCF0EE 62%,#CDEAE6 100%)}
.ln-sunhalo{position:absolute;z-index:1;width:min(900px,120vw);aspect-ratio:1;border-radius:50%;top:-18%;
  left:50%;transform:translateX(-50%);
  background:radial-gradient(circle,rgba(255,240,205,.55),rgba(255,225,170,.22) 34%,transparent 66%);
  filter:blur(24px);pointer-events:none}
.ln-water{position:absolute;left:0;right:0;bottom:0;height:72%;z-index:1}
.ln-waterFade{position:absolute;left:0;right:0;bottom:0;height:74%;z-index:2;pointer-events:none;
  background:linear-gradient(180deg,rgba(238,248,248,.92) 0%,rgba(238,248,248,.25) 12%,rgba(238,248,248,0) 26%)}
.ln-heroIn{position:relative;z-index:4;max-width:880px}
.ln-badge{display:inline-flex;align-items:center;gap:9px;border:1px solid var(--line2);border-radius:100px;
  padding:8px 18px 8px 13px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--deep);
  background:rgba(255,255,255,.72);margin-bottom:28px;font-weight:700}
.ln-dot{width:7px;height:7px;border-radius:50%;background:var(--lagoon);animation:pulse 2.6s ease-in-out infinite}
@keyframes pulse{50%{opacity:.35}}
.ln-h1{font-family:'Playfair Display',serif;font-weight:600;font-size:clamp(40px,7.4vw,88px);line-height:1.04;
  letter-spacing:-.025em;margin:0;color:var(--abyss)}
.ln-h1 em{font-style:italic;color:var(--lagoon)}
.ln-sub{margin:26px auto 0;font-size:clamp(16px,1.9vw,19.5px);color:var(--dim);max-width:56ch;line-height:1.68}
.ln-acts{display:flex;gap:16px;margin-top:38px;flex-wrap:wrap;align-items:center;justify-content:center}
.ln-cta{border:none;border-radius:100px;padding:19px 42px;cursor:pointer;color:#fff;font-weight:700;font-size:16.5px;
  background:linear-gradient(115deg,var(--lagoon),#3FD0C0 58%,var(--shallow));
  box-shadow:0 16px 40px rgba(47,182,174,.36);transition:transform .2s,box-shadow .2s}
.ln-cta:hover{transform:translateY(-3px);box-shadow:0 22px 50px rgba(47,182,174,.44)}
.ln-ghost{color:var(--deep);text-decoration:none;font-size:15px;padding:18px 8px;border-bottom:1px solid var(--line2)}
.ln-ghost:hover{border-color:var(--lagoon)}
.ln-meta{display:flex;gap:44px;margin-top:52px;flex-wrap:wrap;justify-content:center;padding-bottom:70px}
.ln-meta div{text-align:center}
.ln-meta b{display:block;font-family:'Playfair Display',serif;font-weight:600;font-size:28px;margin-bottom:6px;
  color:var(--abyss)}
.ln-meta span{font-size:10.5px;text-transform:uppercase;letter-spacing:.16em;color:var(--faint);font-weight:700}

/* ── Секции ────────────────────────────────────────────────────── */
.ln-sec{padding:96px 34px;max-width:1220px;margin:0 auto;position:relative}
.ln-sec+.ln-sec{border-top:1px solid var(--line)}
.ln-secHead{margin-bottom:50px;max-width:620px;position:relative;z-index:2}
.ln-tag{font-size:10.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--lagoon);margin:0 0 14px;font-weight:800}
.ln-h2{font-family:'Playfair Display',serif;font-weight:600;font-size:clamp(27px,3.8vw,44px);letter-spacing:-.02em;
  margin:0;line-height:1.12;color:var(--abyss)}
.ln-hint{font-size:15.5px;color:var(--dim);margin:16px 0 0;line-height:1.65}
.ln-steps{display:grid;gap:0;position:relative;z-index:2}
.ln-step{display:grid;grid-template-columns:58px 1.1fr 1.4fr;gap:28px;padding:30px 0;border-top:1px solid var(--line);
  align-items:baseline}
.ln-step:last-child{border-bottom:1px solid var(--line)}
.ln-step i{font-family:'Playfair Display',serif;font-style:italic;font-size:24px;color:var(--lagoon)}
.ln-step h3{font-family:'Playfair Display',serif;font-weight:600;font-size:21px;margin:0;color:var(--abyss)}
.ln-step p{color:var(--dim);font-size:15px;margin:0;line-height:1.65}
@media (max-width:800px){.ln-step{grid-template-columns:34px 1fr;gap:14px}.ln-step p{grid-column:2}}

/* блики-отсветы на фоне секций */
.orbs{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.orb{position:absolute;border-radius:50%;filter:blur(42px);opacity:.55;
  background:radial-gradient(circle,rgba(143,228,220,.75),rgba(143,228,220,0) 70%);
  animation:drift 26s ease-in-out infinite}
.orb:nth-child(2){animation-duration:34s;animation-delay:-8s;
  background:radial-gradient(circle,rgba(255,196,107,.5),rgba(255,196,107,0) 70%)}
.orb:nth-child(3){animation-duration:30s;animation-delay:-15s}
.orb:nth-child(4){animation-duration:38s;animation-delay:-4s}
@keyframes drift{50%{transform:translate3d(3vw,-3vh,0) scale(1.12)}}

/* рамка конструктора */
.ln-scene{perspective:1500px;perspective-origin:50% 30%}
.ln-frame{position:relative;border:1px solid var(--line);border-radius:30px;overflow:hidden;background:var(--shell);
  box-shadow:0 44px 100px rgba(18,112,126,.2);transform-style:preserve-3d;
  transition:transform .5s cubic-bezier(.2,.8,.2,1);will-change:transform}
.ln-bar{display:flex;align-items:center;gap:8px;padding:15px 20px;border-bottom:1px solid var(--line);
  background:var(--mist)}
.ln-bar i{width:11px;height:11px;border-radius:50%;background:#D6E6E7;display:block}
.ln-bar span{margin-left:12px;font-size:11.5px;color:var(--dim);font-weight:600}
.ln-status{margin-left:auto!important;display:flex;align-items:center;gap:8px;letter-spacing:.14em;text-transform:uppercase}
.ln-status .ln-dot{width:7px;height:7px;border-radius:50%;background:var(--lagoon)}

/* волна-разделитель и бегущая строка */
.ln-ticker{border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;padding:18px 0;
  background:linear-gradient(180deg,#EAF7F6,#FBFDFD)}
.ln-ticker>div{display:flex;width:max-content;animation:slide 38s linear infinite}
.ln-ticker span{font-family:'Playfair Display',serif;font-style:italic;font-size:19px;color:var(--deep);
  white-space:nowrap;padding-right:28px}
.ln-ticker em{font-style:normal;color:var(--lagoon)}
@keyframes slide{to{transform:translateX(-50%)}}

/* ── Цена ──────────────────────────────────────────────────────── */
.ln-priceRow{display:grid;grid-template-columns:1fr 1fr;gap:54px;align-items:center;position:relative;z-index:2}
@media (max-width:800px){.ln-priceRow{grid-template-columns:1fr;gap:34px}}
.ln-big{font-family:'Playfair Display',serif;font-weight:600;font-size:clamp(62px,10.5vw,120px);line-height:.92;
  letter-spacing:-.03em;color:var(--abyss)}
.ln-big small{display:block;font-family:'Manrope',sans-serif;font-size:15px;font-weight:400;color:var(--dim);
  letter-spacing:0;margin-top:22px;line-height:1.65}
.ln-inc{list-style:none;padding:0;margin:0;display:grid;gap:16px}
.ln-inc li{padding-left:32px;position:relative;color:var(--deep);font-size:15.5px;line-height:1.55}
.ln-inc li:before{content:"";position:absolute;left:0;top:7px;width:16px;height:16px;border-radius:50%;
  border:1.5px solid var(--lagoon);background:radial-gradient(circle,var(--shallow) 0 4px,transparent 5px)}
.ln-foot{padding:44px 34px 72px;max-width:1220px;margin:0 auto;display:flex;justify-content:space-between;gap:20px;
  flex-wrap:wrap;font-size:13.5px;color:var(--faint);border-top:1px solid var(--line)}

/* медленно вращающееся кольцо за заголовком */
.ln-ring{position:absolute;z-index:2;left:50%;top:38%;width:min(680px,92vw);aspect-ratio:1;translate:-50% -50%;
  border-radius:50%;pointer-events:none;opacity:.5;
  background:conic-gradient(from 0deg,transparent 0 12%,rgba(47,182,174,.5) 22%,transparent 34% 62%,
    rgba(255,196,107,.55) 72%,transparent 84%);
  -webkit-mask:radial-gradient(circle,transparent 63%,#000 64%,#000 66%,transparent 67%);
  mask:radial-gradient(circle,transparent 63%,#000 64%,#000 66%,transparent 67%);
  animation:ringSpin 46s linear infinite}
.ln-ring.two{width:min(940px,120vw);opacity:.32;animation-duration:78s;animation-direction:reverse}
@keyframes ringSpin{to{transform:rotate(1turn)}}

/* конструктор мягко покачивается, пока на него не навели */
.ln-frame{animation:hover 9s ease-in-out infinite}
.ln-scene:hover .ln-frame{animation:none}
@keyframes hover{50%{transform:translateY(-10px) rotateX(1.2deg)}}

/* значок прокрутки */
.ln-scroll{position:absolute;bottom:26px;left:50%;translate:-50%;z-index:5;display:flex;flex-direction:column;
  align-items:center;gap:8px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--faint);
  font-weight:700}
.ln-scroll i{width:1px;height:38px;background:linear-gradient(180deg,var(--lagoon),transparent);
  animation:drop 2.4s ease-in-out infinite}
@keyframes drop{0%{transform:scaleY(.2);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}
  51%{transform-origin:bottom}100%{transform:scaleY(.2);transform-origin:bottom}}

/* язык, фото и правка текстов */
.p-langs{display:flex;gap:8px}
.p-lang{flex:1;border:1px solid var(--line);background:var(--shell);color:var(--dim);padding:11px 4px;
  border-radius:100px;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s}
.p-lang[data-on="1"]{background:var(--deep);color:#fff;border-color:var(--deep)}
.p-shots{display:flex;gap:9px;flex-wrap:wrap}
.p-shot{position:relative;width:74px;height:74px;border-radius:16px;overflow:hidden;border:1px solid var(--line)}
.p-shot img{width:100%;height:100%;object-fit:cover;display:block}
.p-shot button{position:absolute;top:3px;right:3px;width:22px;height:22px;border-radius:50%;border:none;
  background:rgba(16,51,59,.72);color:#fff;cursor:pointer;font-size:15px;line-height:1;display:flex;
  align-items:center;justify-content:center}
.p-shotAdd{width:74px;height:74px;border-radius:16px;border:1.5px dashed var(--line2);display:flex;
  align-items:center;justify-content:center;font-size:26px;color:var(--faint);cursor:pointer;
  background:var(--shell);transition:all .15s}
.p-shotAdd:hover{border-color:var(--lagoon);color:var(--lagoon)}
.p-edit{display:grid;gap:6px;margin-bottom:14px;padding-bottom:14px;border-bottom:1px solid var(--line)}
.p-edit .p-label{margin-top:8px;margin-bottom:4px}

/* что внутри */
.ln-inside{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:0 44px;position:relative;z-index:2}
.ln-inside>div{padding:26px 0;border-top:1px solid var(--line)}
.ln-inside h3{font-family:'Playfair Display',serif;font-weight:600;font-size:19px;margin:0 0 8px;color:var(--abyss)}
.ln-inside p{margin:0;color:var(--dim);font-size:14.5px;line-height:1.6}

/* переключатель режимов и разбор */
.p-modes{display:flex;gap:8px;margin-bottom:18px}
.p-mode{flex:1;border:1px solid var(--line);background:var(--shell);color:var(--dim);padding:11px 4px;
  border-radius:100px;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s}
.p-mode[data-on="1"]{background:var(--lagoon);color:#fff;border-color:var(--lagoon)}
.p-parsed{margin-top:20px;border:1px solid var(--line);border-radius:24px;padding:18px;background:var(--shell)}
.p-parsedRow{display:flex;justify-content:space-between;gap:12px;padding:7px 0;font-size:13px}
.p-parsedRow span{color:var(--faint);text-transform:uppercase;letter-spacing:.1em;font-size:10px;font-weight:700;
  padding-top:3px}
.p-parsedRow b{text-align:right;color:var(--ink);font-weight:600}

/* возврат по заказу */
.p-return{border:1px dashed var(--line2);border-radius:20px;padding:14px 16px;margin-bottom:20px;background:var(--shell)}
.p-return>span{font-size:12.5px;color:var(--dim);font-weight:600}
.p-saved{margin-top:20px;padding:14px 16px;border:1px solid rgba(47,182,174,.4);border-radius:20px;background:#EDFAF9}
.p-saved .p-note b{color:var(--deep);font-family:monospace;letter-spacing:.06em}

/* появление при прокрутке */
.rev{opacity:0;transform:translateY(24px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)}
.rev.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.rev{opacity:1;transform:none}}
`;

/* ─── Кабинет: PIN уходит на сервер, в браузере его нет ────────────── */
function Admin({ onExit }) {
  const [pin, setPin] = useState("");
  const [auth, setAuth] = useState("");
  const [rows, setRows] = useState([]);
  const [cfg, setCfg] = useState({ auto: false });
  const [msg, setMsg] = useState("");

  async function enter(p) {
    try {
      const d = await adminCall(p, "list");
      setAuth(p); setRows(d.rows || []); setCfg(d.settings || { auto: false }); setMsg("");
    } catch (e) { setMsg(e.message); }
  }
  useEffect(() => {
    if (!auth) return;
    const id = setInterval(async () => {
      try { const d = await adminCall(auth, "list"); setRows(d.rows || []); setCfg(d.settings); } catch (e) {}
    }, 30000);
    return () => clearInterval(id);
  }, [auth]);

  async function op(o, extra) {
    try { const d = await adminCall(auth, o, extra); setRows(d.rows || []); setCfg(d.settings); }
    catch (e) { setMsg(e.message); }
  }

  if (!auth)
    return (
      <div className="p-lock">
        <h2>Кабинет</h2>
        <p className="p-note" style={{ marginTop: 0, marginBottom: 16 }}>Введите PIN владельца</p>
        <input className="p-input" type="password" value={pin} inputMode="numeric" autoFocus
          onChange={(e) => setPin(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") enter(pin); }} aria-label="PIN" />
        <button className="p-go" style={{ marginTop: 12 }} type="button" onClick={() => enter(pin)}>Войти</button>
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
        Сверяйте два признака: сначала найдите в истории Kaspi перевод <b>ровно на указанную сумму</b>, затем проверьте, что имя отправителя совпадает. Сходится и то и другое — «выдать». Сумма меньше {PAY.kzt} ₸ подсвечена красным.
      </p>

      <div className="p-stats">
        <div className="p-stat"><span>на проверке</span><b>{pending.length}</b></div>
        <div className="p-stat"><span>выдано</span><b>{done.length}</b></div>
        <div className="p-stat"><span>заявлено, ₸</span><b>{income}</b></div>
      </div>

      <label className="p-toggle">
        <input type="checkbox" checked={!!cfg.auto} onChange={(e) => op("auto", { auto: e.target.checked })} />
        Автовыдача без проверки (быстро, но рискованно)
      </label>

      <p className="p-eyebrow" style={{ marginTop: 28 }}>Ждут проверки</p>
      <table className="p-table">
        <thead><tr><th>Сумма</th><th>Имя</th><th>Когда</th><th>Код</th><th /></tr></thead>
        <tbody>
          {pending.map((r) => (
            <tr key={r.code}>
              <td className={Number(r.amount) < PAY.kzt ? "p-flag" : ""}>
                <b style={{ fontSize: 13, color: Number(r.amount) < PAY.kzt ? "var(--coral)" : "var(--sun)" }}>{r.amount || "—"} ₸</b>
              </td>
              <td>{r.sender || "—"}</td>
              <td>{r.at}</td><td>{r.code}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button className="p-act" type="button" onClick={() => op("set", { code: r.code, status: "issued" })}>выдать</button>{" "}
                <button className="p-act" type="button" onClick={() => op("remove", { code: r.code })}>отклонить</button>
              </td>
            </tr>
          ))}
          {!pending.length && <tr><td colSpan="5" style={{ color: "var(--faint)" }}>Заявок нет</td></tr>}
        </tbody>
      </table>

      <p className="p-eyebrow" style={{ marginTop: 30 }}>История</p>
      <table className="p-table">
        <thead><tr><th>Код</th><th>Имя</th><th>Сумма</th><th>Статус</th><th /></tr></thead>
        <tbody>
          {done.slice(0, 30).map((r) => (
            <tr key={r.code} className={r.status === "used" ? "p-used" : ""}>
              <td>{r.code}</td><td>{r.sender || "—"}</td>
              <td className={Number(r.amount) < PAY.kzt ? "p-flag" : ""}>{r.amount || "—"}</td>
              <td>{r.status === "used" ? "забрал сайт" : "код выдан"}</td>
              <td><button className="p-exit" type="button" onClick={() => op("remove", { code: r.code })}>удалить</button></td>
            </tr>
          ))}
          {!done.length && <tr><td colSpan="5" style={{ color: "var(--faint)" }}>Пока пусто</td></tr>}
        </tbody>
      </table>

      {msg && <div className="p-err">{msg}</div>}
      <p className="p-note" style={{ marginTop: 22 }}>PIN меняется в настройках Netlify — переменная ADMIN_PIN.</p>
      <p style={{ marginTop: 20 }}><button className="p-exit" type="button" onClick={onExit}>Вернуться на сайт</button></p>
    </div>
  );
}

const STAGES = ["Текст", "Вёрстка", "Готово", "Оплачено"];
const COMBOS = PALETTES.length * FONTS.length * HEROES.length * BLOCKS.length * PROOFS.length * MOTIFS.length * CTAS.length;

/* Числа набегают вместо мгновенного появления */
function CountUp({ to, suffix = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }
    const t0 = performance.now(), dur = 1400;
    let raf;
    const step = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n.toLocaleString("ru-RU")}{suffix}</>;
}

/* Плавное появление секций при прокрутке */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".rev");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
      { rootMargin: "-60px" }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

export default function App() {
  const [form, setForm] = useState({
    name: "Барбершоп «Пила»",
    about: "Мужские стрижки и бритьё опасной бритвой. Без записи, три мастера, кофе за счёт заведения.",
    city: "Алматы",
    phone: "+7 700 000-00-00",
    priceList: "Стрижка — 5 000 ₸\nБритьё опасной бритвой — 4 000 ₸\nБорода — 3 000 ₸",
    hoursText: "Пн–Пт — 10:00–21:00\nСб–Вс — 11:00–19:00",
  });
  const [stage, setStage] = useState(-1);
  const [data, setData] = useState(null);
  const [mood, setMood] = useState("светлый");
  const [look, setLook] = useState(rollLook("светлый"));
  const [serial, setSerial] = useState("");
  const [err, setErr] = useState("");
  const [device, setDevice] = useState("desktop");
  const [lang, setLang] = useState("ru");
  const [mode, setMode] = useState("free");
  const [brief, setBrief] = useState(
    "Барбершоп «Пила» в Алматы на Абая 15. Мужские стрижки без записи, три мастера, бритьё опасной бритвой. " +
    "Стрижка 5000, бритьё 4000, борода 3000. Работаем пн-пт с 10 до 21, выходные с 11 до 19. WhatsApp +7 700 000 00 00."
  );
  const [photos, setPhotos] = useState([]);
  const [editing, setEditing] = useState(false);
  const [myCode, setMyCode] = useState("");
  const [restore, setRestore] = useState("");

  const [sender, setSender] = useState("");
  const [hold, setHold] = useState(null);   // бронь: {code, amount}
  const [req, setReq] = useState(null);
  const [paid, setPaid] = useState(false);
  const [code, setCode] = useState("");
  const [admin, setAdmin] = useState(false);

  const busy = stage >= 0 && stage < 2;
  const linkRef = useRef(null);
  const clicks = useRef({ n: 0, t: 0 });
  const seen = useRef(new Set());
  useReveal();
  const frameRef = useRef(null);

  function tiltFrame(e) {
    const f = frameRef.current;
    if (!f || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = f.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    f.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 4}deg) translateZ(0)`;
  }
  function resetTilt() {
    if (frameRef.current) frameRef.current.style.transform = "";
  }

  useEffect(() => {
    const check = () => setAdmin(window.location.hash === "#kabinet");
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  /* ждём подтверждения оплаты владельцем */
  useEffect(() => {
    if (!req || req.status !== "pending" || paid) return;
    const id = setInterval(async () => {
      try {
        const { status } = await checkStatus(req.code);
        if (status === "issued") {
          await redeem(req.code);
          setReq({ ...req, status: "used" }); setPaid(true); setStage(3);
          setMyCode(req.code); keep(null, null, req.code);
        }
      } catch (e) {}
    }, 7000);
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
    clicks.current.n = now - clicks.current.t < 900 ? clicks.current.n + 1 : 1;
    clicks.current.t = now;
    if (clicks.current.n >= 5) { clicks.current.n = 0; window.location.hash = "kabinet"; }
  }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const preview = data ? buildSite({ ...data, photos }, look, !paid) : "";

  /* фотографии ужимаем прямо в браузере и вшиваем в файл — сайт работает без интернета */
  async function addPhotos(files) {
    const list = Array.from(files).slice(0, 3 - photos.length);
    const done = [];
    for (const file of list) {
      if (!file.type.startsWith("image/")) continue;
      const url = await new Promise((res) => {
        const img = new Image();
        const fr = new FileReader();
        fr.onload = () => { img.src = fr.result; };
        img.onload = () => {
          const max = 1400;
          const k = Math.min(max / img.width, max / img.height, 1);
          const c = document.createElement("canvas");
          c.width = Math.round(img.width * k);
          c.height = Math.round(img.height * k);
          c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
          res(c.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = () => res(null);
        fr.readAsDataURL(file);
      });
      if (url) done.push(url);
    }
    setPhotos((p) => [...p, ...done].slice(0, 3));
  }
  /* проект хранится на сервере: клиент вернётся по номеру заказа и поправит цены */
  async function keep(nextData, nextLook, codeOverride) {
    const code = codeOverride || myCode;
    if (!code) return;
    try {
      await saveProject(code, JSON.stringify({ form, data: nextData || data, look: nextLook || look, lang }));
    } catch (e) {}
  }
  async function openOrder() {
    setErr("");
    try {
      const { payload } = await loadProject(restore);
      const j = JSON.parse(payload);
      if (j.form) setForm(j.form);
      if (j.lang) setLang(j.lang);
      setData(j.data);
      setLook(j.look);
      setMyCode(restore.trim().toUpperCase());
      setPaid(true);
      setStage(3);
      setSerial("заказ " + restore.trim().toUpperCase());
    } catch (e) { setErr(e.message); }
  }
  /* строки вида «Стрижка — 5 000 ₸» разбираем на пару, время внутри значения не ломаем */
  function parsePairs(text) {
    return String(text || "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const m = l.match(/^(.*?)\s[—–-]\s(.*)$/);
        return m ? { left: m[1].trim(), right: m[2].trim() } : { left: l, right: "" };
      });
  }

  function editField(path, value) {
    setData((d) => {
      const next = JSON.parse(JSON.stringify(d));
      if (path.length === 1) next[path[0]] = value;
      else if (path.length === 3) next[path[0]][path[1]][path[2]] = value;
      else next[path[0]][path[1]] = value;
      keep(next);
      return next;
    });
  }

  async function generate() {
    setErr(""); setData(null); setStage(0);
    const brief_ = mode === "free"
      ? `Вот всё, что рассказал владелец. Разбери это сам: вытащи название, город, адрес, телефон,
услуги с ценами и часы работы, ничего не выдумывая сверх сказанного.

«${brief}»`
      : "";

    const prompt = `Ты копирайтер и арт-директор для сайтов малого бизнеса.
${brief_}

${mode === "fields" ? `Бизнес: ${form.name}
Описание: ${form.about}
Город: ${form.city}
Телефон: ${form.phone}` : ""}
Язык всех текстов: ${lang === "kk" ? "казахский" : "русский"}
${mode === "fields" && parsePairs(form.priceList).length ? "Услуги и цены (взять дословно, ничего не менять и не добавлять):\n" + parsePairs(form.priceList).map((x) => `- ${x.left}${x.right ? " — " + x.right : ""}`).join("\n") : ""}
${mode === "fields" && parsePairs(form.hoursText).length ? "Часы работы (взять дословно):\n" + parsePairs(form.hoursText).map((x) => `- ${x.left} ${x.right}`).join("\n") : ""}

Верни ТОЛЬКО JSON без markdown. Поле mood — одно из: тёмный, светлый, премиум, дерзкий, природный, технологичный.
В stats дай три правдоподобных показателя: короткое значение и подпись. Не выдумывай награды и премии.
В faq задай вопросы, которые клиент правда задаёт этому бизнесу: цена, запись, сроки, оплата.
Цены ставь только там, где они уместны и правдоподобны для города.
{"mood":"","businessName":"","tagline":"до 4 слов","heroHeadline":"до 7 слов, конкретно, без штампов вроде «качество и надёжность»","heroSub":"2 предложения о пользе для клиента","ctaText":"2-3 слова, призыв написать в WhatsApp","servicesTitle":"","services":[{"title":"","text":"одно предложение","price":"цена или «от 3 000 ₸», пустая строка если цена неуместна"},{"title":"","text":"","price":""},{"title":"","text":"","price":""}],"pointsTitle":"","points":["","",""],"stats":[{"value":"7 лет","label":"на рынке"},{"value":"3 000","label":"клиентов"},{"value":"20 мин","label":"средний визит"}],"finalHeadline":"призыв на 4-6 слов","hours":[{"days":"Пн–Пт","time":"10:00–20:00"},{"days":"Сб–Вс","time":"11:00–18:00"}],"faqTitle":"","faq":[{"q":"вопрос клиента","a":"короткий ответ"},{"q":"","a":""},{"q":"","a":""}],"visitTitle":"","address":"улица и город","city":"","phone":""}`;
    try {
      const parsed = await askAI(prompt);
      setStage(1);
      const m = MOODS[parsed.mood] ? parsed.mood : "светлый";
      setMood(m); setLook(freshLook(m));
      const merged = { ...parsed, phone: parsed.phone || form.phone, city: parsed.city || form.city };

      /* свободный ввод: показываем в полях то, что распозналось, — можно проверить и поправить */
      if (mode === "free") {
        setForm((f) => ({
          ...f,
          name: parsed.businessName || f.name,
          about: brief.slice(0, 400),
          city: parsed.city || f.city,
          phone: parsed.phone || f.phone,
          priceList: (parsed.services || [])
            .map((x) => (x.price ? `${x.title} — ${x.price}` : x.title))
            .join("\n"),
          hoursText: (parsed.hours || []).map((h) => `${h.days} — ${h.time}`).join("\n"),
        }));
      }

      /* режим полей: свои цены и часы всегда сильнее того, что придумала модель */
      const myServices = mode === "fields" ? parsePairs(form.priceList) : [];
      const myHours = mode === "fields" ? parsePairs(form.hoursText) : [];
      if (myServices.length) {
        merged.services = myServices.map((x, i) => ({
          title: x.left,
          price: x.right,
          text: (parsed.services && parsed.services[i] && parsed.services[i].text) || "",
        }));
      }
      if (myHours.length) merged.hours = myHours.map((x) => ({ days: x.left, time: x.right }));
      setData(merged);
      setSerial("№ " + Date.now().toString().slice(-6));
      setStage(2);
      try { setHold(await reserveAmount()); } catch (e) { setHold(null); }
    } catch (e) {
      setStage(-1);
      setErr("Не получилось собрать страницу: " + e.message);
    }
  }

  async function sendRequest() {
    setErr("");
    if (!hold) { setErr("Бронь суммы не создана — соберите сайт заново."); return; }
    if (sender.trim().length < 3) { setErr("Впишите имя, с которого платили."); return; }
    try {
      const r = await createRequest({ sender, code: hold.code });
      setReq({ code: r.code, sender, amount: hold.amount, status: r.status });
      setMyCode(r.code);
      if (r.status === "issued") { await redeem(r.code); setPaid(true); setStage(3); keep(null, null, r.code); }
    } catch (e) { setErr(e.message); }
  }

  async function activate() {
    setErr("");
    try { await redeem(code); setPaid(true); setStage(3); const c = code.trim().toUpperCase(); setMyCode(c); keep(null, null, c); }
    catch (e) { setErr(e.message); }
  }

  function download() {
    const blob = new Blob([buildSite({ ...data, photos }, look, false)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = linkRef.current;
    a.href = url; a.download = "index.html"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function copy(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
  }
  const toTool = () => document.getElementById("tool")?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (admin)
    return (
      <div className="pro">
        <style dangerouslySetInnerHTML={{ __html: CSS + CSS2 }} />
        <Admin onExit={() => { window.location.hash = ""; setAdmin(false); }} />
      </div>
    );

  return (
    <div className="pro">
      <style dangerouslySetInnerHTML={{ __html: CSS + CSS2 }} />
      <div className="grain" />

      <nav className="ln-nav">
        <div className="ln-mark" onClick={tapLogo}>WE<em>CREATE</em></div>
        <div className="ln-navR">
          <a href="#how">Как это работает</a>
          <a href="#inside">Что внутри</a>
          <a href="#price">{PAY.kzt} ₸</a>
          <button className="ln-btn" type="button" onClick={toTool}>Собрать сайт</button>
        </div>
      </nav>

      <header className="ln-hero">
        <div className="ln-sunhalo" />
        <div className="ln-ring" />
        <div className="ln-ring two" />
        <div className="ln-water"><Hero3D /></div>
        <div className="ln-waterFade" />
        <div className="ln-heroIn">
          <span className="ln-badge"><i className="ln-dot" />предпросмотр бесплатно</span>
          <h1 className="ln-h1">Сайт вашему делу<br />за <em>двадцать секунд</em></h1>
          <p className="ln-sub">
            Опишите бизнес тремя строчками. Тексты, шрифты, цвета и вёрстка подберутся сами —
            получите живую страницу с кнопкой WhatsApp. Платите, только если забираете.
          </p>
          <div className="ln-acts">
            <button className="ln-cta" type="button" onClick={toTool}>Собрать сайт</button>
            <a className="ln-ghost" href="#how">Как это работает</a>
          </div>
          <div className="ln-meta">
            <div><b><CountUp to={20} suffix=" сек" /></b><span>до готовой страницы</span></div>
            <div><b><CountUp to={PAY.kzt} suffix=" ₸" /></b><span>один раз, без подписки</span></div>
            <div><b><CountUp to={COMBOS} /></b><span>вариантов дизайна</span></div>
          </div>
        </div>
        <div className="ln-scroll" aria-hidden="true">листайте<i /></div>
      </header>

      <section className="ln-sec rev" id="how">
        <div className="orbs" aria-hidden="true">
          <span className="orb" style={{ width: 420, height: 420, left: "-10%", top: "4%" }} />
          <span className="orb" style={{ width: 260, height: 260, right: "2%", top: "-6%" }} />
          <span className="orb" style={{ width: 180, height: 180, right: "26%", bottom: "6%" }} />
        </div>
        <div className="ln-secHead">
          <p className="ln-tag">как это работает</p>
          <h2 className="ln-h2">Четыре шага и ни одного пароля</h2>
          <p className="ln-hint">Без регистрации и подписок. Оплата в самом конце, когда сайт уже перед глазами.</p>
        </div>
        <div className="ln-steps">
          {[
            ["01", "Расскажите о деле", "Название, чем занимаетесь, город и номер WhatsApp. Пары предложений достаточно."],
            ["02", "Смотрите готовый сайт", "Тексты, цвета, шрифты и вёрстка подбираются под ваш бизнес. Не понравилось — «Перемешать вид»."],
            ["03", "Платите, если забираете", `${PAY.kzt} ₸ через Kaspi. Пока не оплатили — на странице водяной знак.`],
            ["04", "Выкладываете в интернет", "Скачиваете файл и получаете ссылку за полминуты. Инструкция внутри."],
          ].map(([n, t, p]) => (
            <div className="ln-step" key={n}><i>{n}</i><h3>{t}</h3><p>{p}</p></div>
          ))}
        </div>
      </section>

      <div className="ln-ticker" aria-hidden="true">
        <div>
          {[0, 1].map((k) => (
            <span key={k}>
              тексты пишет ИИ <em>◦</em> палитра под ваше дело <em>◦</em> кнопка WhatsApp внутри <em>◦</em>
              двух одинаковых не бывает <em>◦</em> оплата в конце <em>◦</em> файл ваш навсегда <em>◦</em>
            </span>
          ))}
        </div>
      </div>

      <section className="ln-sec rev" id="tool">
        <div className="ln-secHead">
          <p className="ln-tag">конструктор</p>
          <h2 className="ln-h2">Попробуйте прямо здесь</h2>
          <p className="ln-hint">Слева — данные о бизнесе. Справа — то, что увидят ваши клиенты.</p>
        </div>

        <div className="ln-scene" onMouseMove={tiltFrame} onMouseLeave={resetTilt}>
        <div className="ln-frame" ref={frameRef}>
        <div className="ln-bar">
          <i /><i /><i />
          <span>предпросмотр вашего сайта</span>
          <span className="ln-status">
            <b className="ln-dot" />{busy ? "сборка идёт" : data ? "готово" : "ожидание данных"}
          </span>
        </div>
        <div className="p-grid">
          <div className="p-panel">
            <p className="p-eyebrow">Данные бизнеса</p>

            <div className="p-modes">
              {[["free", "Одним текстом"], ["fields", "По полям"]].map(([k, t]) => (
                <button key={k} className="p-mode" type="button" data-on={mode === k ? "1" : "0"}
                  onClick={() => setMode(k)}>{t}</button>
              ))}
            </div>

            {mode === "free" ? (
              <div className="p-field">
                <label className="p-label" htmlFor="br">Расскажите о деле как есть</label>
                <textarea id="br" className="p-area" style={{ minHeight: 150 }} value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="Что за бизнес, где, что делаете, цены, часы работы, номер WhatsApp — своими словами, одним куском." />
                <p className="p-note" style={{ marginTop: 6 }}>
                  Разберу сам: вытащу название, город, телефон, услуги с ценами и часы. После сборки всё
                  это появится в полях — проверите и поправите.
                </p>
              </div>
            ) : (
            <>
            <div className="p-field">
              <label className="p-label" htmlFor="n">Название</label>
              <input id="n" className="p-input" value={form.name} onChange={set("name")} />
            </div>
            <div className="p-field">
              <label className="p-label" htmlFor="a">Чем занимаетесь</label>
              <textarea id="a" className="p-area" value={form.about} onChange={set("about")} />
            </div>
            <div className="p-field">
              <label className="p-label" htmlFor="c">Город</label>
              <input id="c" className="p-input" value={form.city} onChange={set("city")} />
            </div>
            <div className="p-field">
              <label className="p-label" htmlFor="t">Телефон WhatsApp</label>
              <input id="t" className="p-input" value={form.phone} onChange={set("phone")} />
            </div>

            <div className="p-return">
              <span>Уже покупали сайт?</span>
              <div className="p-row" style={{ marginTop: 8 }}>
                <input className="p-input" placeholder="Номер заказа" value={restore}
                  onChange={(e) => setRestore(e.target.value)} aria-label="Номер заказа" />
                <button className="p-mini" type="button" onClick={openOrder}>Открыть</button>
              </div>
            </div>

            <div className="p-field">
              <label className="p-label" htmlFor="pl">Услуги и цены · по строке на услугу</label>
              <textarea id="pl" className="p-area" value={form.priceList} onChange={set("priceList")}
                placeholder={"Стрижка — 5 000 ₸\nБритьё — 4 000 ₸"} />
              <p className="p-note" style={{ marginTop: 6 }}>
                Название, тире, цена. Описание к каждой услуге напишет ИИ, а название и цену возьмёт как есть.
              </p>
            </div>

            <div className="p-field">
              <label className="p-label" htmlFor="hr">Часы работы</label>
              <textarea id="hr" className="p-area" style={{ minHeight: 68 }} value={form.hoursText}
                onChange={set("hoursText")} placeholder={"Пн–Пт — 10:00–21:00\nСб–Вс — 11:00–19:00"} />
            </div>
            </>
            )}

            <div className="p-field">
              <span className="p-label">Язык сайта</span>
              <div className="p-langs">
                {[["ru", "Русский"], ["kk", "Қазақша"]].map(([k, t]) => (
                  <button key={k} className="p-lang" type="button" data-on={lang === k ? "1" : "0"}
                    onClick={() => setLang(k)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="p-field">
              <span className="p-label">Фотографии · до трёх</span>
              <div className="p-shots">
                {photos.map((src, i) => (
                  <div className="p-shot" key={i}>
                    <img src={src} alt="" />
                    <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                      aria-label="Убрать фото">×</button>
                  </div>
                ))}
                {photos.length < 3 && (
                  <label className="p-shotAdd">
                    +
                    <input type="file" accept="image/*" multiple hidden
                      onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />
                  </label>
                )}
              </div>
              <p className="p-note" style={{ marginTop: 8 }}>
                Живые снимки поднимают доверие сильнее любого текста. Ужимаются прямо здесь и вшиваются в файл.
              </p>
            </div>

            <button className="p-go" type="button" onClick={generate} disabled={busy}>
              {busy ? "Собираем…" : data ? "Собрать заново" : "Собрать сайт бесплатно"}
            </button>

            {data && mode === "free" && (
              <div className="p-parsed">
                <p className="p-eyebrow" style={{ margin: "0 0 10px" }}>что распозналось</p>
                <div className="p-parsedRow"><span>название</span><b>{form.name}</b></div>
                <div className="p-parsedRow"><span>город</span><b>{form.city}</b></div>
                <div className="p-parsedRow"><span>телефон</span><b>{form.phone}</b></div>
                <div className="p-parsedRow"><span>услуг</span><b>{(data.services || []).length}</b></div>
                <div className="p-parsedRow"><span>часы</span><b>{(data.hours || []).length ? "есть" : "нет"}</b></div>
                <button className="p-mini" style={{ width: "100%", padding: "10px 0", marginTop: 12 }}
                  type="button" onClick={() => setMode("fields")}>Открыть поля и поправить</button>
              </div>
            )}

            {data && (
              <div className="p-look">
                <button className="p-mini" style={{ width: "100%", padding: "11px 0", marginBottom: 14 }}
                  type="button" onClick={() => setEditing(!editing)}>
                  {editing ? "Свернуть тексты" : "Править тексты вручную"}
                </button>
                {editing && (
                  <div className="p-edit">
                    <label className="p-label">Заголовок</label>
                    <textarea className="p-area" style={{ minHeight: 60 }} value={data.heroHeadline}
                      onChange={(e) => editField(["heroHeadline"], e.target.value)} />
                    <label className="p-label">Подзаголовок</label>
                    <textarea className="p-area" style={{ minHeight: 72 }} value={data.heroSub}
                      onChange={(e) => editField(["heroSub"], e.target.value)} />
                    <label className="p-label">Кнопка</label>
                    <input className="p-input" value={data.ctaText}
                      onChange={(e) => editField(["ctaText"], e.target.value)} />
                    <label className="p-label">Услуги</label>
                    {(data.services || []).map((sv, i) => (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <input className="p-input" value={sv.title} style={{ marginBottom: 6 }}
                          onChange={(e) => editField(["services", i, "title"], e.target.value)} />
                        <div className="p-row" style={{ marginTop: 0 }}>
                          <input className="p-input" value={sv.text}
                            onChange={(e) => editField(["services", i, "text"], e.target.value)} />
                          <input className="p-input" value={sv.price || ""} placeholder="цена"
                            style={{ maxWidth: 118 }}
                            onChange={(e) => editField(["services", i, "price"], e.target.value)} />
                        </div>
                      </div>
                    ))}

                    <label className="p-label">Часы работы</label>
                    {(data.hours || []).map((h, i) => (
                      <div className="p-row" key={i} style={{ marginTop: 0, marginBottom: 6 }}>
                        <input className="p-input" value={h.days} placeholder="Пн–Пт"
                          onChange={(e) => editField(["hours", i, "days"], e.target.value)} />
                        <input className="p-input" value={h.time} placeholder="10:00–20:00"
                          onChange={(e) => editField(["hours", i, "time"], e.target.value)} />
                      </div>
                    ))}

                    <label className="p-label">Частые вопросы</label>
                    {(data.faq || []).map((q, i) => (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <input className="p-input" value={q.q} style={{ marginBottom: 6 }} placeholder="вопрос"
                          onChange={(e) => editField(["faq", i, "q"], e.target.value)} />
                        <input className="p-input" value={q.a} placeholder="ответ"
                          onChange={(e) => editField(["faq", i, "a"], e.target.value)} />
                      </div>
                    ))}
                    <label className="p-label">Адрес и часы</label>
                    <input className="p-input" value={data.address}
                      onChange={(e) => editField(["address"], e.target.value)} />
                  </div>
                )}
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
                  Вариантов: {PALETTES.length * FONTS.length * HEROES.length * BLOCKS.length * PROOFS.length * MOTIFS.length * CTAS.length}
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
                <div className="p-price">{hold ? hold.amount : PAY.kzt} ₸<small>≈ ${PAY.usd}</small></div>
                {hold ? (
                  <p className="p-note" style={{ margin: "8px 0 0" }}>
                    Сумма для вас <b style={{ color: "var(--sun)" }}>{hold.amount} ₸</b> — впишите её в Kaspi
                    до последней цифры. По этой сумме ваш платёж и найдут: у каждого заказа она своя.
                  </p>
                ) : (
                  <p className="p-note" style={{ margin: "8px 0 0" }}>Готовим сумму для оплаты…</p>
                )}
                <a className="p-kaspi" href={PAY.link} target="_blank" rel="noreferrer">Оплатить через Kaspi</a>

                {!req ? (
                  <div className="p-queue">
                    <input className="p-input" placeholder="Имя и буква фамилии, как в Kaspi: Айдар К." value={sender}
                      onChange={(e) => setSender(e.target.value)} aria-label="Имя отправителя" />
                    <button className="p-mini" style={{ padding: "12px 0" }} type="button" onClick={sendRequest} disabled={!hold}>
                      Я оплатил — на проверку
                    </button>
                  </div>
                ) : (
                  <div className="p-wait">
                    <b>оплата на проверке</b>
                    Принято: <b>{req.amount} ₸</b> от {req.sender}. Сверят сумму и имя — и доступ
                    откроется сам, страницу можно не закрывать.
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(201,162,39,.3)" }}>
                      Номер заказа <b style={{ fontFamily: "'JetBrains Mono',monospace" }}>{req.code}</b> — запишите
                      на случай, если закроете страницу. Он заработает как код доступа после подтверждения оплаты.
                    </div>
                  </div>
                )}

                <div className="p-row">
                  <input className="p-input" placeholder="Номер заказа или код доступа" value={code}
                    onChange={(e) => setCode(e.target.value)} aria-label="Код доступа" />
                  <button className="p-mini" type="button" onClick={activate}>Открыть</button>
                </div>
              </div>
            )}

            {paid && (
              <div className="p-saved">
                <p className="p-ok">✓ оплачено · сайт ваш</p>
                {myCode && (
                  <p className="p-note" style={{ marginTop: 8 }}>
                    Номер заказа <b>{myCode}</b> — сохраните. По нему вернётесь сюда, поменяете цены
                    или часы работы и скачаете обновлённый сайт бесплатно.
                  </p>
                )}
              </div>
            )}
            {err && <div className="p-err">{err}</div>}
          </div>

          <div className="p-stage">
            {paid && (
              <div className="p-deliver">
                <h3>Как выложить сайт в интернет</h3>
                <p>Файл готов. Осталось получить ссылку для Instagram или 2ГИС.</p>
                <ol className="p-steps">
                  <li>Нажмите «Скачать HTML» — сохранится файл index.html</li>
                  <li>Откройте app.netlify.com/drop и перетащите файл в окно</li>
                  <li>Через 30 секунд получите бесплатную ссылку</li>
                  <li>Свой домен подключается там же в настройках</li>
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
                  <span>Опишите бизнес слева и нажмите «Собрать сайт бесплатно».</span>
                </div>
              )}
            </div>
            <a ref={linkRef} style={{ display: "none" }} href="#d">скачать</a>
          </div>
        </div>
        </div>
        </div>
      </section>

      <section className="ln-sec rev" id="inside">
        <div className="ln-secHead">
          <p className="ln-tag">что внутри</p>
          <h2 className="ln-h2">Каждый сайт собран как надо</h2>
          <p className="ln-hint">Не просто красивая страница — рабочий инструмент, который приводит клиентов.</p>
        </div>
        <div className="ln-inside">
          {[
            ["Кнопка WhatsApp", "С готовым текстом сообщения. На телефоне — панель звонка внизу экрана."],
            ["Цены и часы", "Прайс в блоке услуг, расписание по дням и ссылка на 2ГИС."],
            ["Частые вопросы", "Раскрывающиеся ответы про запись, оплату и сроки."],
            ["Ваши фотографии", "До трёх снимков: обложка, снимок у заголовка или галерея."],
            ["Разметка для поиска", "Название, телефон, адрес и часы — в формате, который читает Google."],
            ["Работает без интернета", "Один файл: фото внутри, ничего не подгружается со стороны."],
          ].map(([t, p]) => (
            <div key={t}><h3>{t}</h3><p>{p}</p></div>
          ))}
        </div>
      </section>

      <section className="ln-sec rev" id="price">
        <div className="orbs" aria-hidden="true">
          <span className="orb" style={{ width: 460, height: 460, right: "-12%", top: "-14%" }} />
          <span className="orb" style={{ width: 220, height: 220, left: "6%", bottom: "2%" }} />
          <span className="orb" style={{ width: 150, height: 150, left: "38%", top: "12%" }} />
          <span className="orb" style={{ width: 300, height: 300, left: "-6%", top: "44%" }} />
        </div>
        <div className="ln-secHead">
          <p className="ln-tag">цена</p>
          <h2 className="ln-h2">Один платёж, дальше сайт ваш</h2>
        </div>
        <div className="ln-priceRow">
          <div className="ln-big">{PAY.kzt} ₸<small>один платёж через Kaspi · без подписки</small></div>
          <ul className="ln-inc">
            <li>Готовая страница одним файлом</li>
            <li>Кнопка WhatsApp с готовым сообщением</li>
            <li>Уникальный дизайн: цвета, шрифты и вёрстка не повторяются</li>
            <li>Инструкция, как получить ссылку бесплатно</li>
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
