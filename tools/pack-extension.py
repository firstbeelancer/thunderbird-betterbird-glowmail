#!/usr/bin/env python3
"""Собрать GlowMail как ОДИН файл .xpi — чистая тема (без background и Experiment API).

Раскладка архива (manifest.json — в КОРНЕ, иначе «повреждено»):
  manifest.json              — theme/manifest.json: цвета (ключ theme) +
                               theme_experiment.stylesheet = chrome/userChrome.css
  chrome/userChrome.css      — стили и подмена иконок (переменные --icon-*)
  chrome/icons/*.svg, chrome/fonts/*.woff2 — ресурсы, лежат внутри .xpi

Почему так: статическая тема не может содержать background/experiment_apis,
а theme_experiment.stylesheet — штатный способ подключить CSS к интерфейсу
Thunderbird из самой темы, без записи в профиль. Проверено на Thunderbird 128.

Перед сборкой перегенерируется блок --icon-* (tools/build-icon-vars.py).
Выход: dist/glowmail-<версия>.xpi
"""
import json
import pathlib
import subprocess
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
THEME = ROOT / "theme"
DIST = ROOT / "dist"


def main() -> int:
    subprocess.run([sys.executable, str(ROOT / "tools" / "build-icon-vars.py")], check=True)
    manifest = json.loads((THEME / "manifest.json").read_text(encoding="utf-8"))
    version = manifest["version"]
    DIST.mkdir(exist_ok=True)
    out = DIST / f"glowmail-{version}.xpi"
    files = [THEME / "manifest.json"] + sorted(p for p in (THEME / "chrome").rglob("*") if p.is_file())
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for p in files:
            z.write(p, p.relative_to(THEME).as_posix())
    print(f"packed {out} ({out.stat().st_size} bytes), {len(files)} files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
