// api/ai.js — Vercel Serverless Function
//
// Главное отличие от прошлой версии: промпты собираются ЗДЕСЬ.
// Из браузера приходят только данные и название действия, но не текст запроса к модели.
// Поэтому эндпоинт умеет ровно две вещи и не может работать «бесплатным Claude».

import { PALETTES, FONTS, HEROES, BLOCKS, PROOFS, MOTIFS, CTAS } from "../src/site.js";

const DAILY_LIMIT = 300;       // всего обращений к модели в сутки на весь сервис
const IP_GEN_PER_HOUR = 6;     // «Создать сайт» с одного адреса
const IP_PATCH_PER_HOUR = 30;  // правок словами с одного адреса

// Счётчики живут в памяти инстанса — это заплатка, а не полноценная защита.
// Vercel может поднять несколько копий функции, у каждой будет свой счётчик.
const hits = new Map(); // "ip|действие" -> [время, ...]
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

function tooMany(ip, action, limit) {
  const k = ip + "|" + action;
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const list = (hits.get(k) || []).filter((t) => now - t < hour);
  if (list.length >= limit) {
    hits.set(k, list);
    return true;
  }
  list.push(now);
  hits.set(k, list);
  return false;
}

/* ─── Промпт №1: собрать сайт из рассказа владельца ──────────────── */
function promptGenerate(brief, lang) {
  return `Ты копирайтер и арт-директор для сайтов малого бизнеса.
Вот всё, что рассказал владелец. Разбери это сам: вытащи название, город, адрес, телефон,
услуги с ценами и часы работы, ничего не выдумывая сверх сказанного.

«${brief}»

Если чего-то не сказано — не выдумывай, оставь поле пустым.
Язык всех текстов: ${lang === "kk" ? "казахский" : "русский"}

Верни ТОЛЬКО JSON без markdown. Поле mood — одно из: тёмный, светлый, премиум, дерзкий, природный, технологичный.
В stats дай три правдоподобных показателя: короткое значение и подпись. Не выдумывай награды и премии.
В faq задай вопросы, которые клиент правда задаёт этому бизнесу: цена, запись, сроки, оплата.
Цены ставь только там, где они уместны и правдоподобны для города.
{"mood":"","businessName":"","tagline":"до 4 слов","heroHeadline":"до 7 слов, конкретно, без штампов вроде «качество и надёжность»","heroSub":"2 предложения о пользе для клиента","ctaText":"2-3 слова, призыв написать в WhatsApp","servicesTitle":"","services":[{"title":"","text":"одно предложение","price":"цена или «от 3 000 ₸», пустая строка если цена неуместна"},{"title":"","text":"","price":""},{"title":"","text":"","price":""}],"pointsTitle":"","points":["","",""],"stats":[{"value":"7 лет","label":"на рынке"},{"value":"3 000","label":"клиентов"},{"value":"20 мин","label":"средний визит"}],"finalHeadline":"призыв на 4-6 слов","hours":[{"days":"Пн–Пт","time":"10:00–20:00"},{"days":"Сб–Вс","time":"11:00–18:00"}],"faqTitle":"","faq":[{"q":"вопрос клиента","a":"короткий ответ"},{"q":"","a":""},{"q":"","a":""}],"visitTitle":"","address":"улица и город","city":"","phone":""}`;
}

/* ─── Промпт №2: правка готового сайта словами ───────────────────── */
function promptPatch(state, request) {
  return `Ты правишь готовый сайт малого бизнеса по просьбе владельца.

Текущее состояние:
${JSON.stringify(state)}

Что можно менять в look:
- palette: число 0..${PALETTES.length - 1}. Названия по порядку: ${PALETTES.map((x, i) => i + "=" + x.id).join(", ")}
- fonts: число 0..${FONTS.length - 1}. Пары: ${FONTS.map((x, i) => i + "=" + x.id).join(", ")}
- hero (первый экран): ${HEROES.join(", ")}
- block (как показаны услуги): ${BLOCKS.join(", ")}
- proof (как показаны доводы): ${PROOFS.join(", ")}
- motif (фоновый декор): ${MOTIFS.join(", ")}
- cta (форма кнопки): ${CTAS.join(", ")}
- radius: 0px, 2px, 6px, 14px, 999px
- upper: true/false — заголовки капслоком
- marquee: true/false — бегущая строка
- photo: cover, side, strip — как расположить фотографии
- width: 760, 1040, 1240, 1440 — ширина страницы

В data можно менять любые тексты: heroHeadline, heroSub, ctaText, tagline, services, points, stats, faq, hours, finalHeadline, address.

Просьба владельца: «${request}»

Верни ТОЛЬКО JSON без markdown:
{"look":{только изменившиеся ключи},"data":{только изменившиеся поля},"reply":"одно короткое предложение о том, что сделал"}`;
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

  const action = String(body.action || "");
  let prompt;
  let ipLimit;

  if (action === "generate") {
    const brief = String(body.brief || "").trim().slice(0, 1200);
    const lang = body.lang === "kk" ? "kk" : "ru";
    if (brief.length < 10) {
      return res.status(400).json({ error: "Опишите бизнес чуть подробнее" });
    }
    prompt = promptGenerate(brief, lang);
    ipLimit = IP_GEN_PER_HOUR;
  } else if (action === "patch") {
    const request = String(body.request || "").trim().slice(0, 300);
    const state = body.state;
    if (!request) return res.status(400).json({ error: "Напишите, что изменить" });
    if (!state || typeof state !== "object") {
      return res.status(400).json({ error: "Нет данных сайта" });
    }
    if (JSON.stringify(state).length > 20000) {
      return res.status(400).json({ error: "Слишком большой проект" });
    }
    prompt = promptPatch(state, request);
    ipLimit = IP_PATCH_PER_HOUR;
  } else {
    return res.status(400).json({ error: "Неизвестное действие" });
  }

  // Дневной потолок на весь сервис — аварийный тормоз.
  const d = today();
  if (dayKey !== d) {
    dayKey = d;
    dayCount = 0;
    hits.clear();
  }
  if (dayCount >= DAILY_LIMIT) {
    return res.status(429).json({ error: "Сегодня слишком много запросов. Попробуйте завтра." });
  }

  if (tooMany(clientIp(req), action, ipLimit)) {
    return res.status(429).json({ error: "Слишком часто. Подождите немного и попробуйте снова." });
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
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      // Подробности — в логи Vercel. Наружу отдаём общую фразу.
      console.error("Ошибка модели:", JSON.stringify(data));
      return res.status(502).json({ error: "Не удалось обработать запрос. Попробуйте ещё раз." });
    }

    const text = (data.content || []).map((c) => c.text || "").join("");
    return res.status(200).json({ text });
  } catch (e) {
    console.error("Запрос не прошёл:", e);
    return res.status(502).json({ error: "Не удалось связаться с сервисом." });
  }
}
