// Отдаёт опубликованный сайт: /s/имя-сайта
const URL_ =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.REDIS_REST_URL ||
  (() => {
    for (const k of Object.keys(process.env))
      if (/REST_URL$/.test(k) && String(process.env[k]).startsWith("https://")) return process.env[k];
    return null;
  })();
const TOKEN =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.REDIS_REST_TOKEN ||
  (() => {
    for (const k of Object.keys(process.env))
      if (/REST_TOKEN$/.test(k)) return process.env[k];
    return null;
  })();

function page(title, text) {
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#FBFDFD;color:#10333B;
font-family:system-ui,sans-serif;text-align:center;padding:24px}
h1{font-size:22px;margin:0 0 10px}p{color:#5F818A;margin:0}</style></head>
<body><div><h1>${title}</h1><p>${text}</p></div></body></html>`;
}

export default async function handler(req, res) {
  const slug = String(req.query.slug || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 60);
  if (!slug) {
    res.setHeader("content-type", "text/html; charset=utf-8");
    return res.status(400).send(page("Нет адреса", "В ссылке не указано имя сайта."));
  }
  if (!URL_ || !TOKEN) {
    res.setHeader("content-type", "text/html; charset=utf-8");
    return res.status(500).send(page("Хранилище не подключено", "Добавьте базу в настройках проекта."));
  }

  try {
    const r = await fetch(`${URL_}/get/site:${encodeURIComponent(slug)}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const j = await r.json();
    if (!j.result) {
      res.setHeader("content-type", "text/html; charset=utf-8");
      return res.status(404).send(page("Сайт не найден", "Проверьте адрес — возможно, в нём опечатка."));
    }
    const html = JSON.parse(j.result);
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.setHeader("cache-control", "public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
    return res.status(200).send(html);
  } catch (e) {
    res.setHeader("content-type", "text/html; charset=utf-8");
    return res.status(500).send(page("Что-то пошло не так", "Попробуйте обновить страницу."));
  }
}
