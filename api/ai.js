// Vercel Serverless Function — /api/ai
// Ключ Anthropic лежит в переменных окружения проекта и в браузер не попадает.

const DAILY_LIMIT = 300;       // всего генераций в сутки на весь сервис
const IP_LIMIT_PER_HOUR = 5;   // сколько раз один посетитель может нажать кнопку

// Счётчики живут в памяти инстанса. Это заплатка, а не полноценная защита:
// Vercel может поднять несколько инстансов, и у каждого будет свой счётчик.
// Надёжный вариант — внешнее хранилище (KV). Это следующий шаг.
const hits = new Map(); // ip -> [время нажатия, ...]
let dayKey = "";
let dayCount = 0;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  const raw = Array.isArray(fwd) ? fwd[0] : String(fwd || "");
  return raw.split(",")[0].trim() || "unknown";
}

function tooManyFromIp(ip) {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < hour);
  if (list.length >= IP_LIMIT_PER_HOUR) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  return false;
}

// Промпт собираем МЫ, на сервере. Клиент присылает только данные о бизнесе.
function buildPrompt({ name, about, city }) {
  return [
    "Ты делаешь одностраничный сайт для малого бизнеса в Казахстане.",
    "Верни только HTML-код страницы, без пояснений и без markdown-разметки.",
    "",
    "Название: " + name,
    "Чем занимается: " + about,
    "Город: " + (city || "не указан"),
  ].join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Только POST" });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    console.error("ANTHROPIC_API_KEY не задана");
    return res.status(500).json({ error: "Сервис временно недоступен" });
  }

  const body =
    typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};

  // Принимаем ТОЛЬКО эти три поля. Свободного prompt больше нет.
  const name = String(body.name || "").trim().slice(0, 80);
  const about = String(body.about || "").trim().slice(0, 400);
  const city = String(body.city || "").trim().slice(0, 60);

  if (!name || !about) {
    return res.status(400).json({ error: "Заполните название и описание" });
  }

  // Дневной потолок на весь сервис — аварийный тормоз.
  const d = today();
  if (dayKey !== d) {
    dayKey = d;
    dayCount = 0;
    hits.clear();
  }
  if (dayCount >= DAILY_LIMIT) {
    return res
      .status(429)
      .json({ error: "Сегодня слишком много запросов. Попробуйте завтра." });
  }

  // Лимит на одного посетителя.
  if (tooManyFromIp(clientIp(req))) {
    return res
      .status(429)
      .json({ error: "Слишком часто. Подождите немного и попробуйте снова." });
  }

  dayCount++;

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        messages: [{ role: "user", content: buildPrompt({ name, about, city }) }],
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      // Подробности — в логи Vercel. Наружу отдаём общую фразу.
      console.error("Ошибка модели:", JSON.stringify(data));
      return res
        .status(502)
        .json({ error: "Не удалось создать сайт. Попробуйте ещё раз." });
    }

    const text = (data.content || []).map((c) => c.text || "").join("");
    return res.status(200).json({ text });
  } catch (e) {
    console.error("Запрос не прошёл:", e);
    return res.status(502).json({ error: "Не удалось связаться с сервисом." });
  }
}
