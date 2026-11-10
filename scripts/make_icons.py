#!/usr/bin/env python3
"""Generate GlowMail modern line icons as Thunderbird context SVG files.

All icons share one language: 24x24 viewBox, stroke 1.8, round caps/joins,
fill="context-fill" / stroke="context-stroke" so userChrome.css can recolour
them with -moz-context-properties. Paths follow the Lucide-style set already
used in src/components/Icons.tsx (the stand) — same paths, same look.
"""
import pathlib

OUT = pathlib.Path("/home/hatch/workspace/glowmail-theme/theme/chrome/icons")

ICONS = {
    # name: (paths, extra_elements)
    "tag": (
        ["M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 "
         ".586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 "
         "0 0 0 0-3.42z"],
        '<circle cx="7.5" cy="7.5" r="1" fill="context-stroke" stroke="none"/>',
    ),
    "clip": (
        ["M21 11l-9 9a6 6 0 01-8.5-8.5l9-9a4 4 0 015.7 5.7l-9 9a2 2 0 "
         "01-2.8-2.8l8.3-8.3"],
        "",
    ),
    "reply": (["M9 14L4 9l5-5M4 9h10a6 6 0 016 6v3"], ""),
    "reply-all": (
        ["M7 17L2 12l5-5M14 17l-5-5 5-5M22 18v-2a4 4 0 0 0-4-4H2"],
        "",
    ),
    "forward": (["M15 14l5-5-5-5M20 9H10a6 6 0 00-6 6v3"], ""),
    "archive": (["M21 8v13H3V8M1 3h22v5H1zM10 12h4"], ""),
    "pin": (
        ["M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16"
         "a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9"
         "A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"],
        "",
    ),
    "spam": (
        ["M12 3a9 9 0 100 18 9 9 0 000-18zM5.6 5.6l12.8 12.8"],
        "",
    ),
    "trash": (
        ["M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4"
         "c1 0 2 1 2 2v2"],
        "",
    ),
    "compose": (["M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"], ""),
    "get-mail": (["M20 11a8 8 0 10-2.3 5.7M20 4v7h-7"], ""),
    "send": (["M22 2L11 13M22 2l-7 20-4-9-9-4z"], ""),
    "search": (["M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3"], ""),
    "inbox": (
        ["M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13L22 12v6a2 2 0 01-2 2H4a2 2 0 "
         "01-2-2v-6z"],
        "",
    ),
    "folder": (
        ["M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"],
        "",
    ),
}

TPL = ('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" '
       'viewBox="0 0 24 24" fill="none" stroke="context-stroke" '
       'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">\n'
       '  <path d="{d}"/>\n{extra}</svg>\n')

for name, (paths, extra) in ICONS.items():
    d = " ".join(paths)
    extra_line = f"  {extra}\n" if extra else ""
    (OUT / f"{name}.svg").write_text(TPL.format(d=d, extra=extra_line))
    print(name, "ok")
print("total:", len(ICONS))
