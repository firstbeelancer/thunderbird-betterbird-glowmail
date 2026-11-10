# AGENTS.md — GlowMail

Небольшой проект: визуальная тема для Thunderbird / Betterbird. TigerWiki-проект для него не заводится, все заметки — здесь и в `README.md`.

## Главное правило: никаких ключей

**Ни в коем случае никаких ключей в репозитории.**

Запрещено добавлять в репозиторий (в код, документы, примеры, скриншоты, названия файлов и сообщения коммитов):

- API-ключи, токены, пароли, секреты, приватные ключи;
- `.env`, файлы с учётными данными, реальные адреса почты и личные данные.

## Проверка перед любой публикацией

Перед каждым коммитом / публикацией обязательно:

1. Поиск секретов по всему дереву (кроме `node_modules/`, `dist/`): `api[_-]?key`, `secret`, `password`, `ghp_`, `github_pat_`, `sk-`, `AKIA`.
2. `npm run build` — сборка должна проходить.
3. `python3 -m json.tool theme/manifest.json` — манифест валиден.
4. Сверка копий: `public/download/userChrome.css` и `INSTALL.md` должны совпадать с файлами в `theme/` (md5).

Если при проверке всплыл ключ — не коммитить, убрать его из файлов и истории, сообщить Марине, ключ перевыпустить. Публикация откладывается до чистой проверки.

## Сборка .xpi (с 1.2.0)

GlowMail — **чистая статическая тема** (`theme/`): ключ `theme` (цвета) +
`theme_experiment.stylesheet` → `chrome/userChrome.css` внутри самого .xpi.
`python3 tools/pack-extension.py` → `dist/glowmail-<версия>.xpi` (один файл).

Что проверено на живом Thunderbird 128.14 (и почему именно так):
- Попытка 1.1.x (Experiment API пишет в `<профиль>/chrome/`) не работала:
  `PathUtils.join("jar:file:///…xpi!/", …)` бросает NS_ERROR_FILE_UNRECOGNIZED_PATH,
  исключение терялось в `console.error` фона. Не возвращаться к этой схеме.
- `theme_experiment.stylesheet` применяется и к about:3pane / about:message.
- Иконки задаёт Thunderbird через `--icon-*` на `:root`. Подменяем переменные,
  а не селекторы кнопок. Значения — **data:-URI** (`tools/build-icon-vars.py`):
  относительный `url()` в переменной резолвится от `chrome://messenger/skin/…`.
- Картинкам не из chrome:/resource: Gecko не отдаёт `context-fill/stroke` —
  цвета в SVG зашиты (`*-light.svg` — для тёмной панели папок).

Правила:
- Любую правку `icons/*.svg` — через `python3 tools/build-icon-vars.py` (или pack).
- `manifest.json` в архиве — в КОРНЕ. Не добавлять в манифест `background`,
  `experiment_apis` — статическая тема их не допускает.
- Подпись и ATN для установки «из файла» не нужны: в Thunderbird 128
  `xpinstall.signatures.required=false`, `extensions.experiments.enabled=true`.

## Как устроен проект

- Источник правды — `theme/`: `manifest.json`, `chrome/userChrome.css`, `chrome/fonts/`, `chrome/icons/` (18 SVG: современные линейные иконки, огонёк вместо звезды).
- `extension/` — дополнение с автообновлением (см. выше); `src/` — стенд-спецификация (Vite + React), `public/download/` — копии для скачивания со стенда.
- Палитра и токены — в `src/lib/tokens.ts` и в `:root` в `userChrome.css`. Палитру без согласования с Мариной не менять, контраст держать по WCAG AA.
- Шрифт — Inter (variable, латиница + кириллица), SIL OFL, лежит в `theme/chrome/fonts/`.
- Лицензия репозитория пока не выбрана — не назначать её самостоятельно.
