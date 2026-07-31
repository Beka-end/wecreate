#!/usr/bin/env node
/*
 * Правит src/App.jsx автоматически.
 * Запускать из корня проекта:  node patch-app.mjs
 *
 * Оригинал сохраняется рядом как src/App.jsx.bak — если что-то пойдёт
 * не так, просто переименуй его обратно.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";

const FILE = "src/App.jsx";

if (!existsSync(FILE)) {
  console.error("Не нашёл " + FILE + ". Запусти скрипт из корня проекта.");
  process.exit(1);
}

let src = readFileSync(FILE, "utf8");
const report = [];

/* ── простая замена: найти точный кусок и подменить ──────────────── */
function swap(name, find, replace) {
  const n = src.split(find).length - 1;
  if (n === 0) { report.push(["—", name, "не найдено, пропускаю"]); return; }
  if (n > 1) { report.push(["!", name, "найдено " + n + " раз, пропускаю"]); return; }
  src = src.replace(find, replace);
  report.push(["✓", name, ""]);
}

/* ── вырезать блок от начала до закрывающей кавычки шаблона ──────── */
function cutTemplate(name, startsWith, count = 1) {
  const a = src.indexOf(startsWith);
  if (a < 0) { report.push(["—", name, "не найдено, пропускаю"]); return; }
  let end = a;
  for (let i = 0; i < count; i++) {
    end = src.indexOf("`;", end + 1);
    if (end < 0) { report.push(["!", name, "не нашёл конец шаблона"]); return; }
  }
  src = src.slice(0, a) + src.slice(end + 2);
  report.push(["✓", name, ""]);
}

/* ═══ 1. Промпты уезжают на сервер ════════════════════════════════ */

swap(
  "импорт: askAI → generateSite и patchSite, лишний checkSlug убран",
  `import { askAI, reserveAmount, createRequest, checkStatus, redeem, adminCall, saveProject, loadProject, publishSite, checkSlug } from "./api.js";`,
  `import { generateSite, patchSite, reserveAmount, createRequest, checkStatus, redeem, adminCall, saveProject, loadProject, publishSite } from "./api.js";`
);

cutTemplate("удаляю промпт правок из applyRequest", "const prompt = `Ты правишь готовый сайт");

swap(
  "applyRequest зовёт patchSite",
  `const patch = await askAI(prompt);`,
  `const patch = await patchSite(state, q);`
);

cutTemplate("удаляю промпт генерации из generate", "const brief_ = `Вот всё, что рассказал владелец", 2);

swap(
  "generate зовёт generateSite",
  `const parsed = await askAI(prompt);`,
  `const parsed = await generateSite(brief, lang);`
);

/* ═══ 2. Демо-текст больше не тратит деньги ═══════════════════════ */

swap(
  "поле описания пустое по умолчанию (демо ушло в подсказку)",
  `  const [brief, setBrief] = useState(
    "Барбершоп «Пила» в Алматы на Абая 15. Мужские стрижки без записи, три мастера, бритьё опасной бритвой. " +
    "Стрижка 5000, бритьё 4000, борода 3000. Работаем пн-пт с 10 до 21, выходные с 11 до 19. WhatsApp +7 700 000 00 00."
  );`,
  `  const [brief, setBrief] = useState("");`
);

swap(
  "кнопка на первом экране неактивна без описания",
  `<button className="ln-cta" type="button" onClick={startFromHero} disabled={busy}>`,
  `<button className="ln-cta" type="button" onClick={startFromHero} disabled={busy || !brief.trim()}>`
);

swap(
  "кнопка в конструкторе неактивна без описания",
  `<button className="p-go" type="button" onClick={generate} disabled={busy}>`,
  `<button className="p-go" type="button" onClick={generate} disabled={busy || !brief.trim()}>`
);

swap(
  "generate не стартует на пустом описании",
  `  async function generate() {
    setErr(""); setData(null); setStage(0);`,
  `  async function generate() {
    if (brief.trim().length < 10) { setErr("Опишите бизнес хотя бы одним предложением."); return; }
    setErr(""); setData(null); setStage(0);`
);

/* ═══ 3. Опрос статуса не крутится вечно ══════════════════════════ */

swap(
  "опрос оплаты останавливается через 20 минут",
  `    if (!req || req.status !== "pending" || paid) return;
    const id = setInterval(async () => {
      try {`,
  `    if (!req || req.status !== "pending" || paid) return;
    let ticks = 0;
    const id = setInterval(async () => {
      /* забытая открытой вкладка иначе дёргает серверную функцию тысячи раз */
      if (++ticks > 170) {
        clearInterval(id);
        setErr("Проверка затянулась. Обновите страницу и войдите по номеру заказа.");
        return;
      }
      try {`
);

/* ═══ 4. Мелочи в интерфейсе ══════════════════════════════════════ */

swap(
  "в таблице «История» не хватало заголовка колонки",
  `<thead><tr><th>Код</th><th>Имя</th><th>Сумма</th><th>Статус</th><th /></tr></thead>`,
  `<thead><tr><th>Код</th><th>Имя</th><th>Сумма</th><th>Статус</th><th>Сайт</th><th /></tr></thead>`
);

swap(
  "подпись на пустом экране совпадает с названием кнопки",
  `<span>Опишите бизнес слева и нажмите «Собрать сайт бесплатно».</span>`,
  `<span>Опишите бизнес слева и нажмите «Создать сайт».</span>`
);

swap(
  "автовыдача спрашивает подтверждение при включении",
  `        <input type="checkbox" checked={!!cfg.auto} onChange={(e) => op("auto", { auto: e.target.checked })} />`,
  `        <input type="checkbox" checked={!!cfg.auto} onChange={(e) => {
          if (e.target.checked && !window.confirm(
            "Автовыдача открывает сайт любому, кто нажал «Я оплатил», без проверки платежа. Точно включить?"
          )) return;
          op("auto", { auto: e.target.checked });
        }} />`
);

/* ═══ Итог ════════════════════════════════════════════════════════ */

const failed = report.filter((r) => r[0] !== "✓").length;

copyFileSync(FILE, FILE + ".bak");
writeFileSync(FILE, src, "utf8");

console.log("");
for (const [mark, name, note] of report) {
  console.log(" " + mark + "  " + name + (note ? "  — " + note : ""));
}
console.log("");
console.log("Оригинал сохранён: " + FILE + ".bak");

if (failed) {
  console.log("");
  console.log("Не применилось правок: " + failed + ".");
  console.log("Скорее всего файл уже правился руками — напиши мне, разберёмся.");
} else {
  console.log("Все правки применены.");
}
