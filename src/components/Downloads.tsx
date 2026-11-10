import { useState } from "react";
import css from "../../theme/chrome/userChrome.css?raw";
import manifest from "../../theme/manifest.json?raw";
import install from "../../theme/INSTALL.md?raw";
import fontLatin from "../../theme/chrome/fonts/Inter-latin.woff2?url";
import fontCyr from "../../theme/chrome/fonts/Inter-cyrillic.woff2?url";
// Современные иконки для userChrome: те же SVG, что в theme/chrome/icons/.
const iconFiles = import.meta.glob("../../theme/chrome/icons/*.svg", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
import { makeZip, saveBlob } from "../lib/zip";
import { Icon } from "./Icons";
import { ACCENT, C } from "../lib/tokens";

const bin = async (u: string) => new Uint8Array(await (await fetch(u)).arrayBuffer());

export function Downloads() {
  const [busy, setBusy] = useState<string | null>(null);

  const run = async (key: string, fn: () => Promise<void> | void) => {
    setBusy(key);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };

  const items = [
    {
      key: "xpi",
      title: "glowmail-theme.xpi",
      desc: "WebExtension-тема: рамка, вкладки, панели, меню",
      action: () => saveBlob(makeZip([{ name: "manifest.json", data: manifest }]), "glowmail-theme.xpi"),
    },
    {
      key: "css",
      title: "userChrome.css",
      desc: "Список писем, папки, письмо, окна — 1 файл",
      action: () => saveBlob(new Blob([css], { type: "text/css" }), "userChrome.css"),
    },
    {
      key: "pack",
      title: "glowmail-userchrome.zip",
      desc: "chrome/userChrome.css + иконки + шрифт Inter + INSTALL.md",
      action: async () => {
        const [a, b] = await Promise.all([bin(fontLatin), bin(fontCyr)]);
        const icons = Object.entries(iconFiles).map(([p, data]) => ({
          name: `chrome/icons/${p.split("/").pop()}`,
          data,
        }));
        saveBlob(
          makeZip([
            { name: "chrome/userChrome.css", data: css },
            ...icons,
            { name: "chrome/fonts/Inter-latin.woff2", data: a },
            { name: "chrome/fonts/Inter-cyrillic.woff2", data: b },
            { name: "INSTALL.md", data: install },
          ]),
          "glowmail-userchrome.zip",
        );
      },
    },
    {
      key: "md",
      title: "INSTALL.md",
      desc: "Инструкция: установка и включение userChrome",
      action: () => saveBlob(new Blob([install], { type: "text/markdown" }), "INSTALL.md"),
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i) => (
        <button
          key={i.key}
          onClick={() => run(i.key, i.action)}
          className="group flex flex-col items-start gap-1 rounded-xl border border-[#1F2F2A] bg-[#14221E] p-4 text-left outline-none transition hover:border-[#2EE6A8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <span
            className="mb-1 flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: ACCENT, color: C.accentText }}
          >
            <Icon name="download" size={16} />
          </span>
          <span className="font-mono text-[14px] font-semibold text-[#E6F2EE]">{i.title}</span>
          <span className="text-[13px] text-[#8FA39C]">{busy === i.key ? "Готовлю файл…" : i.desc}</span>
        </button>
      ))}
    </div>
  );
}
