#!/usr/bin/env python3
"""Собрать GlowMail как одно дополнение с автообновлением.

Раскладка готового архива (manifest.json — в КОРНЕ, иначе Thunderbird
скажет «corrupt»):
  manifest.json            — из extension/manifest.json (версия 1.1.0+)
  background.js, api/      — Experiment API развёртывания
  chrome/userChrome.css    — из theme/chrome/
  chrome/icons/*.svg       — из theme/chrome/icons/
  chrome/fonts/*.woff2     — из theme/chrome/fonts/
  chrome-files.json        — список файлов под chrome/, генерируется из glob,
                             чтобы добавление CSS или SVG не требовало правок
                             кода (паттерн thunderbird-fluent).

Правило версий: ЛЮБОЕ изменение под chrome/ или icons/ требует bump
версии в extension/manifest.json, иначе развёртывание — no-op и правка
не дойдёт до профиля.

Выход: dist/glowmail-<version>.zip. Для публикации на
addons.thunderbird.net загружается этот архив; после ревью и подписи
обновления прилетают пользователям сами, без ручного копирования файлов.
"""
import json
import pathlib
import shutil
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"


def main() -> None:
    manifest = json.loads((ROOT / "extension" / "manifest.json").read_text())
    version = manifest["version"]
    stage = DIST / f"glowmail-{version}"
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir(parents=True)

    for name in ("manifest.json", "background.js"):
        shutil.copy2(ROOT / "extension" / name, stage / name)
    shutil.copytree(ROOT / "extension" / "api", stage / "api")
    chrome = stage / "chrome"
    shutil.copytree(ROOT / "theme" / "chrome", chrome)

    files = sorted(
        str(p.relative_to(chrome)).replace("\\", "/")
        for p in chrome.rglob("*")
        if p.is_file()
    )
    (stage / "chrome-files.json").write_text(
        json.dumps(files, indent=2, ensure_ascii=False) + "\n"
    )

    out = DIST / f"glowmail-{version}.zip"
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for p in sorted(stage.rglob("*")):
            if p.is_file():
                z.write(p, p.relative_to(stage))
    # То же содержимое под именем .xpi — именно на него ссылается
    # update_link в updates.json (GitHub Releases, v<версия>).
    xpi = DIST / f"glowmail-{version}.xpi"
    shutil.copy2(out, xpi)
    print(f"packed {out} ({out.stat().st_size} bytes), {len(files)} chrome files")
    print("chrome files:", ", ".join(files))
    return 0


if __name__ == "__main__":
    sys.exit(main())
