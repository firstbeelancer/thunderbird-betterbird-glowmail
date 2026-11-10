# GlowMail 1.0 — установка

Тема состоит из двух частей. Они независимы, но вместе дают полный вид.

| Часть | Что красит | Файл |
|---|---|---|
| WebExtension-тема | рамку окна, вкладки (базовые цвета), панели инструментов, меню, поля | `glowmail-theme.xpi` |
| userChrome.css | список писем, папки, акцентные плашки, бейджи, полоски, окно письма, написание, адресную книгу | `chrome/userChrome.css` + `chrome/fonts/` |

Подходит для Thunderbird 128 ESR и новее и для Betterbird на базе 128+.

## 1. Установка темы (.xpi)

1. Thunderbird → меню ☰ → **Дополнения и темы** (`Ctrl+Shift+A`).
2. Шестерёнка ⚙ → **Установить дополнение из файла…** → выберите `glowmail-theme.xpi`.
3. Откройте раздел **Темы** и нажмите **Включить** у GlowMail.

> **Подпись.** Релизная сборка Thunderbird принимает только подписанные дополнения.
> Варианты:
> * загрузить тему на addons.thunderbird.net (раздел «Темы») и получить подписанный `.xpi`;
> * для проверки: `about:debugging#/runtime/this-thunderbird` → **Загрузить временное дополнение…** → `manifest.json` (слетает после перезапуска);
> * Betterbird/ESR/Daily: в Config Editor задать `xpinstall.signatures.required = false`.

## 2. Включение userChrome.css

1. **Настройки → Основные → внизу «Редактор конфигурации»** (Config Editor) → «Принять риск».
2. Найдите `toolkit.legacyUserProfileCustomizations.stylesheets` и переключите в **true**.
3. Откройте папку профиля: **Справка → Информация для решения проблем → Папка профиля → Открыть папку**.
4. В профиле создайте папку `chrome` (если её нет).
5. Скопируйте в неё **содержимое** `chrome/` из архива: файл `userChrome.css`, папки `fonts/` и `icons/`.
   Должно получиться: `<профиль>/chrome/userChrome.css`, `<профиль>/chrome/fonts/Inter-*.woff2` и `<профиль>/chrome/icons/*.svg` (18 иконок, включая огонёк вместо звезды).
   Без папки `icons/` новые иконки не подменятся — CSS будет ссылаться на несуществующие файлы.
6. Полностью закройте и снова откройте Thunderbird.

Типичные пути профиля:

| ОС | Путь |
|---|---|
| Windows | `%APPDATA%\Thunderbird\Profiles\<xxxx>.default-esr\chrome\` |
| macOS | `~/Library/Thunderbird/Profiles/<xxxx>.default-esr/chrome/` |
| Linux | `~/.thunderbird/<xxxx>.default-esr/chrome/` (Flatpak: `~/.var/app/org.mozilla.Thunderbird/.thunderbird/…`) |
| Betterbird | те же пути, каталог `Betterbird` вместо `Thunderbird` |

## 3. Рекомендуемые настройки вида

* **Вид списка:** *Настройки → Вид → Карточки* (по умолчанию в 128) — тема рассчитана на карточки.
* **Плотность:** *Обычная*. «Компактная» тоже работает, на масштабе 125–150 % лучше «Обычная».
* **Папки:** включите «Режим папок: Все папки» и задайте цвета иконок (ПКМ → Свойства → Цвет): полоска слева подхватит их.
* **Теги:** тегу «Важно» (`$label1`) оставьте штатный ключ — именно он даёт красную полоску.
* **Тёмный режим системы:** тема принудительно светлая (`color_scheme: light`) — панели остаются белыми; см. раздел «Решения» на стенде.

## 4. Шрифт

В комплекте Inter (variable, латиница + кириллица), подключается из `chrome/fonts/`.
Цепочка: `GlowMail Inter → Inter → Manrope → system-ui → sans-serif`.
Хотите Manrope — замените первую строку `--gm-font` в начале `userChrome.css`.

## 5. Если что-то не подхватилось

1. Проверьте, что файл называется именно `userChrome.css` (Windows может скрывать `.txt`).
2. Убедитесь, что `toolkit.legacyUserProfileCustomizations.stylesheets` = `true`.
3. Если не подменились иконки — проверьте, что в профиле лежит папка `chrome/icons/` с SVG-файлами (а не только `userChrome.css`).
4. Запустите Thunderbird с `-purgecaches` (создайте ярлык с этим ключом) — CSS кэшируется.
4. Откройте Browser Toolbox (`Ctrl+Shift+Alt+I`), выберите нужный элемент и сверьте селектор. Для карточек списка важны `tr.card-layout`, `.subject-line`, `.button-star`; для папок — `li[is="folder-tree-row"] > .container`.

## 6. Удаление

Удалите `userChrome.css` и `fonts/` из профиля, отключите/удалите тему в «Дополнения и темы».
