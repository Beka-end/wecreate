// Vercel Serverless Function — /api/store
// Данные лежат в Upstash Redis (бесплатный тариф), обращение по REST — без зависимостей.

/* Vercel и Upstash называют переменные по-разному, поэтому ищем сами:
   подходит любая пара, где адрес начинается на https:// и есть токен. */
function findCreds() {
  const e = process.env;
  const known = [
    ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
    ["REDIS_REST_URL", "REDIS_REST_TOKEN"],
  ];
  for (const [u, t] of known) {
    if (e[u] && e[t] && String(e[u]).startsWith("https://")) return { url: e[u], token: e[t] };
  }
  // ищем по шаблону: SOMETHING_REST_URL + SOMETHING_REST_TOKEN
  for (const k of Object.keys(e)) {
    if (/REST_URL$/.test(k) && String(e[k]).startsWith("https://")) {
      const t = k.replace(/URL$/, "TOKEN");
      if (e[t]) return { url: e[k], token: e[t] };
    }
  }
  return { url: null, token: null };
}

const { url: URL_, token: TOKEN } = findCreds();

const PRICE = Number(process.env.PRICE_KZT || 2500);
const ALPHABET = "ACDEFGHJKLMNPQRTUVWXY3479";

function makeCode() {
  let s = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) s += "-";
    s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return "WC-" + s;
}
const now = () => new Date().toISOString().slice(0, 16).replace("T", " ");

async function kvGet(key, fallback) {
  const r = await fetch(`${URL_}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!r.ok) throw new Error("Хранилище недоступно");
  const j = await r.json();
  if (j.result == null) return fallback;
  try { return JSON.parse(j.result); } catch { return fallback; }
}
async function kvSet(key, value) {
  const r = await fetch(`${URL_}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!r.ok) throw new Error("Не удалось сохранить");
}

export default async function handler(req, res) {
  /* Диагностика: откройте /api/store в браузере.
     Показываем только ИМЕНА переменных, значения не раскрываем. */
  if (req.method === "GET") {
    const names = Object.keys(process.env)
      .filter((k) => /REDIS|KV_|UPSTASH/i.test(k))
      .sort();
    let ping = "не проверялось";
    if (URL_ && TOKEN) {
      try {
        const r = await fetch(`${URL_}/ping`, { headers: { Authorization: `Bearer ${TOKEN}` } });
        ping = r.ok ? "база отвечает" : `база ответила ${r.status}`;
      } catch (e) {
        ping = "нет связи с базой";
      }
    }
    return res.status(200).json({
      хранилище_найдено: !!(URL_ && TOKEN),
      адрес_начинается_с_https: URL_ ? String(URL_).startsWith("https://") : false,
      проверка_связи: ping,
      ключ_anthropic_задан: !!process.env.ANTHROPIC_API_KEY,
      pin_задан: !!process.env.ADMIN_PIN,
      найденные_имена_переменных: names,
      подсказка:
        "Нужна пара переменных с REST-адресом (https://...) и токеном. " +
        "REDIS_URL вида redis://... не подходит — возьмите REST-данные в консоли Upstash, раздел REST API.",
    });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Только POST" });
  if (!URL_ || !TOKEN)
    return res.status(500).json({ error: "Хранилище не подключено. Откройте /api/store в браузере — там написано, чего не хватает" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const action = String(body.action || "");

  try {
    const rows = await kvGet("rows", []);
    const cfg = await kvGet("settings", { auto: false });
    const save = () => kvSet("rows", rows.slice(0, 800));

    /* ── Клиент ─────────────────────────────────────────── */
    if (action === "create") {
      const sender = String(body.sender || "").trim().replace(/\s+/g, " ").slice(0, 60);
      const receipt = String(body.receipt || "").replace(/\D/g, "").slice(0, 20);
      const amount = Number(String(body.amount || "").replace(/\D/g, ""));
      if (sender.length < 3) return res.status(400).json({ error: "Впишите имя отправителя как в Kaspi" });
      if (!amount) return res.status(400).json({ error: "Укажите сумму" });

      const key = sender.toLowerCase() + "|" + amount;
      const found = rows.find((r) => r.key === key);
      if (found) {
        if (found.status === "used") return res.status(409).json({ error: "По этому платежу сайт уже забрали" });
        return res.status(200).json({ code: found.code, status: found.status });
      }
      const row = {
        code: makeCode(), key, sender, receipt, amount,
        at: now(), status: cfg.auto ? "issued" : "pending",
      };
      rows.unshift(row);
      await save();
      return res.status(200).json({ code: row.code, status: row.status });
    }

    if (action === "status") {
      const r = rows.find((x) => x.code === String(body.code || "").toUpperCase());
      return res.status(200).json({ status: r ? r.status : "none" });
    }

    if (action === "redeem") {
      const r = rows.find((x) => x.code === String(body.code || "").trim().toUpperCase());
      if (!r) return res.status(404).json({ error: "Такого кода нет" });
      if (r.status === "used") return res.status(409).json({ error: "Код уже использован" });
      if (r.status === "pending") return res.status(402).json({ error: "Оплата ещё не подтверждена" });
      r.status = "used";
      r.at2 = now();
      await save();
      return res.status(200).json({ ok: true });
    }

    /* ── Кабинет: PIN сверяется здесь, на сервере ────────── */
    if (action === "admin") {
      const real = process.env.ADMIN_PIN || "";
      if (!real || String(body.pin || "") !== real) {
        await new Promise((r) => setTimeout(r, 600)); // тормозим перебор
        return res.status(401).json({ error: "PIN не подошёл" });
      }
      const op = String(body.op || "list");

      if (op === "set") {
        const r = rows.find((x) => x.code === body.code);
        if (r) { r.status = String(body.status); r.at2 = now(); }
        await save();
      }
      if (op === "remove") {
        const i = rows.findIndex((x) => x.code === body.code);
        if (i >= 0) rows.splice(i, 1);
        await save();
      }
      if (op === "auto") {
        cfg.auto = !!body.auto;
        await kvSet("settings", cfg);
      }
      return res.status(200).json({ rows, settings: cfg, price: PRICE });
    }

    return res.status(400).json({ error: "Неизвестное действие" });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Ошибка хранилища" });
  }
}
