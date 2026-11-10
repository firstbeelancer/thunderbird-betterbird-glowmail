#!/usr/bin/env python3
"""Сгенерировать блок --icon-* в theme/chrome/userChrome.css из theme/chrome/icons/*.svg.

Зачем data:-URI, а не url("icons/x.svg"):
  Thunderbird берёт иконки как  list-style-image: var(--icon-reply)  в таблицах
  chrome://messenger/skin/…  — относительный url() из пользовательской переменной
  разрешается от ТОЙ таблицы, где var() подставляется, и превращается в
  chrome://messenger/skin/shared/icons/reply.svg (файла нет — кнопка пустая).
  Абсолютный адрес moz-extension://<UUID>/ заранее неизвестен (UUID случайный
  на каждый профиль). data:-URI не зависит ни от того, ни от другого.

Запуск:  python3 tools/build-icon-vars.py   (идемпотентно; правит файл на месте)
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS = ROOT / "theme" / "chrome" / "userChrome.css"
ICONS = ROOT / "theme" / "chrome" / "icons"
BEGIN = "/* GM:ICON-VARS:BEGIN (генерируется tools/build-icon-vars.py — руками не править) */"
END = "/* GM:ICON-VARS:END */"

# штатная переменная Thunderbird -> файл иконки
ROOT_MAP = {
    "star": "flame", "star-sm": "flame",
    "tag": "tag", "tag-sm": "tag",
    "attachment": "clip", "attachment-sm": "clip",
    "reply": "reply", "reply-all": "reply-all", "forward": "forward",
    "archive": "archive", "pin": "pin",
    "spam": "spam", "spam-sm": "spam",
    "trash": "trash", "trash-sm": "trash",
    "new-mail": "compose", "get-mail": "get-mail",
    "search": "search", "inbox": "inbox", "folder": "folder",
}
# панель папок тёмная: светлые иконки, на выбранной плашке — тёмные
FOLDER_LIGHT = {"folder": "folder-light", "inbox": "inbox-light",
                "trash": "trash-light", "spam": "spam-light",
                "archive": "archive-light"}
FOLDER_DARK = {"folder": "folder", "inbox": "inbox", "trash": "trash",
               "spam": "spam", "archive": "archive"}


def data_uri(name: str, size: int = 16) -> str:
    # Внутренний размер как у штатных иконок (16×16, для *-sm — 12×12): без
    # явного размера <img> в колонках списка рисуется в натуральные 24 px.
    svg = (ICONS / f"{name}.svg").read_text(encoding="utf-8")
    svg = svg.replace('width="24" height="24"', f'width="{size}" height="{size}"', 1)
    svg = re.sub(r"\s+", " ", svg).strip()
    svg = re.sub(r">\s+<", "><", svg).replace('"', "'")
    svg = (svg.replace("%", "%25").replace("#", "%23")
              .replace("<", "%3C").replace(">", "%3E"))
    return f'url("data:image/svg+xml,{svg}")'


def decl(mapping) -> str:
    return "\n".join(
        f"  --icon-{k}: {data_uri(v, 12 if k.endswith('-sm') else 16)} !important;"
        for k, v in mapping.items())


def block() -> str:
    return "\n".join([
        BEGIN,
        ":root {", decl(ROOT_MAP), "}",
        "#folderTree {", decl({k: v for k, v in FOLDER_LIGHT.items()}), "}",
        "#folderTree li.selected {", decl(FOLDER_DARK), "}",
        END,
    ])


def main() -> int:
    s = CSS.read_text(encoding="utf-8")
    if BEGIN in s:
        s = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END), lambda m: block(), s,
                   flags=re.S)
    else:
        print("маркеры не найдены", file=sys.stderr)
        return 1
    CSS.write_text(s, encoding="utf-8")
    print(f"ok: {len(ROOT_MAP)} root vars, {len(FOLDER_LIGHT)} folder vars; css {len(s)} bytes")
    return 0


if __name__ == "__main__":
    sys.exit(main())
