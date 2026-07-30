async function post(url, body) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "Ошибка сервера");
  return data;
}

/* Тексты сайта пишет модель на сервере — ключа в браузере нет */
export async function askAI(prompt) {
  const { text } = await post("/api/ai", { prompt });
  const clean = String(text || "").replace(/```json|```/g, "").trim();
  return JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));
}

export const createRequest = (receipt, amount) => post("/api/store", { action: "create", receipt, amount });
export const checkStatus = (code) => post("/api/store", { action: "status", code });
export const redeem = (code) => post("/api/store", { action: "redeem", code });
export const adminCall = (pin, op, extra = {}) => post("/api/store", { action: "admin", pin, op, ...extra });
