# GlowMail — тема для Thunderbird / Betterbird

Тёмная панель папок с мятно-бирюзовым акцентом, светлый список писем и письмо.
Версия 1.0, Thunderbird 128+ и Betterbird, контраст WCAG AA.

## Что внутри

| Папка / файл | Что это |
|---|---|
| `theme/` | Сама тема: `manifest.json` (WebExtension-тема) + `chrome/userChrome.css` (список писем, папки, окно письма) + `INSTALL.md` |
| `src/` + `index.html` + `vite.config.ts` | Стенд-спецификация на Vite + React 19: живой макет, состояния для приёмки, проверка контраста, кнопки скачивания файлов темы |
| `public/download/` | Копии `userChrome.css` и `INSTALL.md` для стенда |
| `AGENTS.md` | Короткие правила для агентов, работающих над темой |

## Установка

Полная инструкция — в [`theme/INSTALL.md`](theme/INSTALL.md).

Коротко:
1. Соберите `glowmail-theme.xpi` из `theme/manifest.json` (zip) и установите через «Дополнения и темы → Установить дополнение из файла».
2. Включите `toolkit.legacyUserProfileCustomizations.stylesheets = true` в Редакторе конфигурации.
3. Скопируйте `theme/chrome/userChrome.css` (и папку `fonts/`, когда она появится) в `<профиль>/chrome/`.
4. Перезапустите Thunderbird / Betterbird.

Релизный Thunderbird принимает только подписанные `.xpi` — либо публикация на addons.thunderbird.net, либо временная загрузка через `about:debugging`, либо `xpinstall.signatures.required = false` на Betterbird / ESR.

## Известная проблема (v1.0)

В архиве **нет шрифтов Inter**: `userChrome.css` и стенд ссылаются на `theme/chrome/fonts/Inter-latin.woff2` и `Inter-cyrillic.woff2`, но папки `fonts/` в комплекте нет.

Что это значит:
- `userChrome.css` работает, но шрифт падает на запасной `system-ui` вместо GlowMail Inter;
- сборка стенда (`npm run build`) не проходит без этих файлов — `src/components/Downloads.tsx` импортирует их напрямую;
- кнопка скачивания `glowmail-userchrome.zip` на стенде тоже не соберётся без шрифтов.

Шрифты не выдумывать и не подменять другими файлами — нужно добавить настоящие variable woff2 Inter (латиница + кириллица) в `theme/chrome/fonts/`.

## Проверка перед публикацией

Перед каждым коммитом / публикацией проверить, что в репозиторий не попало никаких ключей и секретов (см. `AGENTS.md`). В проверенном архиве v1.0 секретов не найдено.

## Статус

Маленькая тема, дорабатывается потихоньку, неспешно. Проект в TigerWiki для неё не заводится.
