// Vercel Serverless Function — /api/ai
// Ключ Anthropic лежит в переменных окружения проекта и в браузер не попадает.

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Только POST" });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "Не задана переменная ANTHROPIC_API_KEY" });

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const prompt = String(body.prompt || "").slice(0, 4000);
  if (!prompt) return res.status(400).json({ error: "Пустой запрос" });

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
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      const m = (data && data.error && data.error.message) || "Модель отказала";
      return res.status(502).json({ error: m });
    }
    const text = (data.content || []).map((c) => c.text || "").join("");
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(502).json({ error: "Не удалось связаться с моделью" });
  }
}
