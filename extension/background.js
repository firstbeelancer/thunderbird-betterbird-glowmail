// Фоновая страница дополнения GlowMail: разворачивает chrome/-файлы
// в профиль при запуске. Развёртывание version-gated (см. api/api.js),
// поэтому повторные запуски ничего не перезаписывают.
browser.glowmail.deploy().catch((e) => {
  console.error("GlowMail deploy failed:", e);
});
