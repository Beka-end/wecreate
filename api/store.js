// Vercel Serverless Function — /api/store
// Данные лежат в Upstash Redis (бесплатный тариф), обращение по REST — без зависимостей.

const URL_ =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.REDIS_REST_URL;
const TOKEN =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.REDIS_REST_TOKEN;

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
  if (req.method !== "POST") return res.status(405).json({ error: "Только POST" });
  if (!URL_ || !TOKEN)
    return res.status(500).json({ error: "Не подключено хранилище: добавьте Upstash Redis в проект" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const action = String(body.action || "");

  try {
    const rows = await kvGet("rows", []);
    const cfg = await kvGet("settings", { auto: false });
    const save = () => kvSet("rows", rows.slice(0, 800));

    /* ── Клиент ─────────────────────────────────────────── */
    if (action === "create") {
      const receipt = String(body.receipt || "").replace(/\D/g, "");
      const amount = Number(String(body.amount || "").replace(/\D/g, ""));
      if (receipt.length < 4) return res.status(400).json({ error: "Номер чека — минимум 4 цифры" });
      if (!amount) return res.status(400).json({ error: "Укажите сумму" });

      const found = rows.find((r) => r.receipt === receipt);
      if (found) {
        if (found.status === "used") return res.status(409).json({ error: "По этому чеку сайт уже забрали" });
        return res.status(200).json({ code: found.code, status: found.status });
      }
      const row = { code: makeCode(), receipt, amount, at: now(), status: cfg.auto ? "issued" : "pending" };
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
