from playwright.sync_api import sync_playwright
import pathlib
out = pathlib.Path("/home/hatch/workspace/glowmail-theme/docs/screenshots")
out.mkdir(parents=True, exist_ok=True)
sections = [
    ("01-hero", "#top"),
    ("02-mock", "#mock"),
    ("03-states", "#states"),
    ("04-windows", "#windows"),
    ("05-contrast", "#contrast"),
    ("06-decisions", "#decisions"),
    ("07-install", "#install"),
    ("08-accept", "#accept"),
]
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto("file:///home/hatch/workspace/glowmail-theme/dist/index.html")
    pg.wait_for_timeout(1500)
    for name, sel in sections:
        el = pg.locator(sel)
        el.scroll_into_view_if_needed()
        pg.wait_for_timeout(400)
        el.screenshot(path=str(out / f"{name}.png"))
        print(name, "ok")
    pg.screenshot(path=str(out / "00-full.png"), full_page=True)
    print("full ok")
    b.close()
