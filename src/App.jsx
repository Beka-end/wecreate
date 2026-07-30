import { useState, useRef, useEffect } from "react";
import { CSS, Hero3D } from "./ui.jsx";
import { askAI, createRequest, checkStatus, redeem, adminCall } from "./api.js";
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
.ln-nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:18px;
  padding:14px 26px;background:rgba(11,13,18,.78);backdrop-filter:blur(14px);border-bottom:1px solid var(--edge);flex-wrap:wrap}
.ln-mark{font-family:'Unbounded',sans-serif;font-weight:900;font-size:17px;letter-spacing:-.02em;cursor:default;user-select:none}
.ln-mark em{font-style:normal;color:var(--signal)}
.ln-navR{display:flex;align-items:center;gap:18px;font-size:13px;color:var(--mist)}
.ln-navR a{color:var(--mist);text-decoration:none}
.ln-navR a:hover{color:var(--paper)}
.ln-btn{background:var(--signal);color:#fff;border:none;border-radius:100px;padding:10px 20px;font-weight:700;font-size:13px;cursor:pointer}
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
  font-family:'Unbounded',sans-serif;font-weight:700;font-size:15px;cursor:pointer;transition:transform .18s}
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
.ln-foot{padding:40px 26px 60px;max-width:1180px;margin:0 auto;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;font-size:13px;color:#5B6474}
.p-queue{display:grid;gap:10px;margin-top:14px}
.p-wait{border:1px solid var(--brass);border-radius:6px;padding:14px 16px;background:rgba(201,162,39,.08);font-size:13px;color:var(--paper)}
.p-wait b{display:block;font-family:'JetBrains Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.14em;color:var(--brass);margin-bottom:6px}
.p-toggle{display:flex;align-items:center;gap:10px;font-size:13px;color:var(--mist);cursor:pointer;margin-top:6px}
.p-toggle input{width:16px;height:16px;accent-color:#C9A227}
.p-flag{color:var(--signal)}
.p-act{border:1px solid var(--edge);background:transparent;color:var(--paper);border-radius:4px;padding:5px 10px;cursor:pointer;font-size:11px;font-family:'JetBrains Mono',monospace}
.p-act:hover{border-color:var(--brass)}
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
        Ищите в истории Kaspi перевод от этого имени на эту сумму в это время. Сумма меньше {PAY.kzt} ₸ подсвечена красным — такую отклоняйте.
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
        <thead><tr><th>Отправитель</th><th>Сумма</th><th>Когда</th><th>Код</th><th /></tr></thead>
        <tbody>
          {pending.map((r) => (
            <tr key={r.code}>
              <td>{r.sender || r.receipt || "—"}</td>
              <td className={Number(r.amount) < PAY.kzt ? "p-flag" : ""}>{r.amount || "—"}</td>
              <td>{r.at}</td><td>{r.code}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button className="p-act" type="button" onClick={() => op("set", { code: r.code, status: "issued" })}>выдать</button>{" "}
                <button className="p-act" type="button" onClick={() => op("remove", { code: r.code })}>отклонить</button>
              </td>
            </tr>
          ))}
          {!pending.length && <tr><td colSpan="5" style={{ color: "#5B6474" }}>Заявок нет</td></tr>}
        </tbody>
      </table>

      <p className="p-eyebrow" style={{ marginTop: 30 }}>История</p>
      <table className="p-table">
        <thead><tr><th>Код</th><th>Отправитель</th><th>Сумма</th><th>Статус</th><th /></tr></thead>
        <tbody>
          {done.slice(0, 30).map((r) => (
            <tr key={r.code} className={r.status === "used" ? "p-used" : ""}>
              <td>{r.code}</td><td>{r.sender || r.receipt || "—"}</td>
              <td className={Number(r.amount) < PAY.kzt ? "p-flag" : ""}>{r.amount || "—"}</td>
              <td>{r.status === "used" ? "забрал сайт" : "код выдан"}</td>
              <td><button className="p-exit" type="button" onClick={() => op("remove", { code: r.code })}>удалить</button></td>
            </tr>
          ))}
          {!done.length && <tr><td colSpan="5" style={{ color: "#5B6474" }}>Пока пусто</td></tr>}
        </tbody>
      </table>

      {msg && <div className="p-err">{msg}</div>}
      <p className="p-note" style={{ marginTop: 22 }}>PIN меняется в настройках Netlify — переменная ADMIN_PIN.</p>
      <p style={{ marginTop: 20 }}><button className="p-exit" type="button" onClick={onExit}>Вернуться на сайт</button></p>
    </div>
  );
}

const STAGES = ["Текст", "Вёрстка", "Готово", "Оплачено"];

export default function App() {
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

  const [sender, setSender] = useState("");
  const [receipt, setReceipt] = useState("");
  const [amount, setAmount] = useState(String(PAY.kzt));
  const [req, setReq] = useState(null);
  const [paid, setPaid] = useState(false);
  const [code, setCode] = useState("");
  const [admin, setAdmin] = useState(false);

  const busy = stage >= 0 && stage < 2;
  const linkRef = useRef(null);
  const clicks = useRef({ n: 0, t: 0 });
  const seen = useRef(new Set());

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
      const parsed = await askAI(prompt);
      setStage(1);
      const m = MOODS[parsed.mood] ? parsed.mood : "светлый";
      setMood(m); setLook(freshLook(m));
      setData({ ...parsed, phone: parsed.phone || form.phone });
      setSerial("№ " + Date.now().toString().slice(-6));
      setStage(2);
    } catch (e) {
      setStage(-1);
      setErr("Не получилось собрать страницу: " + e.message);
    }
  }

  async function sendRequest() {
    setErr("");
    try {
      const r = await createRequest({ sender, amount, receipt });
      const row = { code: r.code, sender, status: r.status };
      setReq(row);
      if (r.status === "issued") { await redeem(r.code); setPaid(true); setStage(3); }
    } catch (e) { setErr(e.message); }
  }

  async function activate() {
    setErr("");
    try { await redeem(code); setPaid(true); setStage(3); }
    catch (e) { setErr(e.message); }
  }

  function download() {
    const blob = new Blob([buildSite(data, look, false)], { type: "text/html" });
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
          <p className="ln-hint">Ни регистрации, ни паролей. Оплата в конце, когда сайт уже перед глазами.</p>
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
                <div className="p-price">{PAY.kzt} ₸<small>≈ ${PAY.usd}</small></div>
                <a className="p-kaspi" href={PAY.link} target="_blank" rel="noreferrer">Оплатить через Kaspi</a>
                <p className="p-note" style={{ marginTop: 10 }}>
                  Впишите в Kaspi ровно {PAY.kzt} ₸, а ниже — имя, с которого платили. По нему платёж и найдут.
                </p>

                {!req ? (
                  <div className="p-queue">
                    <input className="p-input" placeholder="Имя отправителя, как в Kaspi" value={sender}
                      onChange={(e) => setSender(e.target.value)} aria-label="Имя отправителя" />
                    <div className="p-row" style={{ marginTop: 0 }}>
                      <input className="p-input" placeholder="Сумма" value={amount} inputMode="numeric"
                        onChange={(e) => setAmount(e.target.value)} aria-label="Сумма" />
                      <input className="p-input" placeholder="Чек (если есть)" value={receipt} inputMode="numeric"
                        onChange={(e) => setReceipt(e.target.value)} aria-label="Номер чека" />
                    </div>
                    <button className="p-mini" style={{ padding: "12px 0" }} type="button" onClick={sendRequest}>
                      Отправить на проверку
                    </button>
                  </div>
                ) : (
                  <div className="p-wait">
                    <b>оплата на проверке</b>
                    Заявка принята на имя {req.sender}. Ваш код: {req.code}. Как только платёж сверят,
                    доступ откроется сам — страницу можно не закрывать.
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
      </section>

      <section className="ln-sec" id="price">
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
