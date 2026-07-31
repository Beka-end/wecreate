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

/* Модель зовёт сервер, он же собирает промпт.
   Из браузера уходят только данные — текста запроса к модели здесь больше нет. */
async function callAI(body) {
  const { text } = await post("/api/ai", body);
  const clean = String(text || "").replace(/```json|```/g, "").trim();
  return JSON.parse(clean.slice(clean.indexOf("{"), clean.lastIndexOf("}") + 1));
}

/* Собрать сайт из рассказа владельца */
export const generateSite = (brief, lang) => callAI({ action: "generate", brief, lang });

/* Поправить готовый сайт словами */
export const patchSite = (state, request) => callAI({ action: "patch", state, request });

export const reserveAmount = () => post("/api/store", { action: "reserve" });
export const createRequest = ({ sender, code }) => post("/api/store", { action: "create", sender, code });
export const checkStatus = (code) => post("/api/store", { action: "status", code });
export const redeem = (code) => post("/api/store", { action: "redeem", code });
export const adminCall = (pin, op, extra = {}) => post("/api/store", { action: "admin", pin, op, ...extra });
export const saveProject = (code, payload) => post("/api/store", { action: "save", code, payload });
export const loadProject = (code) => post("/api/store", { action: "load", code });
export const publishSite = (code, slug, html, auto = false) =>
  post("/api/store", { action: "publish", code, slug, html, auto });
export const checkSlug = (code, slug) => post("/api/store", { action: "slugFree", code, slug });
