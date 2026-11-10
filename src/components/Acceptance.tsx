import { useEffect, useState } from "react";
import { C } from "../lib/tokens";
import { Icon } from "./Icons";

const OS = ["Windows 11", "macOS", "Linux (GTK)", "Betterbird"];
const SCALES = ["100 %", "125 %", "150 %"];
const STATES = [
  "S01–S05 метки строк (чтение, ⭐, важно, ⭐+важно)",
  "S06–S09 выделение, с фокусом и без",
  "S10 свёрнутая ветка с непрочитанными",
  "S11–S12 иконки и спам",
  "F01–F06 папки: hover, active, focus, цвета",
  "T01–T03 вкладки",
  "B01 кнопка «Написать», поиск, фильтры",
  "W01–W03 написание, адресная книга, меню/диалоги",
  "Письмо: HTML не перекрашивается",
  "Системная тёмная тема: панели остаются светлыми",
];

function useStored(key: string): [Record<string, boolean>, (k: string) => void] {
  const [v, set] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  }, [key, v]);
  return [v, (k) => set((p) => ({ ...p, [k]: !p[k] }))];
}

function Box({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      role="checkbox"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md border outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1F1D]"
      style={{ borderColor: on ? C.unread : C.border, background: on ? C.unread : "#fff", color: "#fff" }}
    >
      {on && <Icon name="check" size={16} sw={3} />}
    </button>
  );
}

export function Acceptance() {
  const [m, toggleM] = useStored("gm-matrix");
  const [s, toggleS] = useStored("gm-states");
  const total = OS.length * SCALES.length;
  const done = OS.flatMap((o) => SCALES.map((x) => `${o}|${x}`)).filter((k) => m[k]).length;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-[#d5ddda] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[16px] font-bold">Матрица платформ и масштаба</h3>
          <span className="text-[13px] font-semibold" style={{ color: C.unread }}>
            {done}/{total}
          </span>
        </div>
        <table className="w-full text-[14px]">
          <thead>
            <tr className="text-left text-[12px]" style={{ color: C.muted }}>
              <th className="py-1 font-semibold">Платформа</th>
              {SCALES.map((x) => (
                <th key={x} className="py-1 text-center font-semibold">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {OS.map((o) => (
              <tr key={o} className="border-t border-[#E6EBE9]">
                <td className="py-2 font-medium">{o}</td>
                {SCALES.map((x) => (
                  <td key={x} className="py-2">
                    <div className="flex justify-center">
                      <Box on={!!m[`${o}|${x}`]} label={`${o} ${x}`} onClick={() => toggleM(`${o}|${x}`)} />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-[12px]" style={{ color: C.muted }}>
          Отметки сохраняются в браузере. На 125–150 % проверяйте: обрезку бейджей, высоту строк, читаемость
          12-пиксельного текста, обводку фокуса.
        </p>
      </div>
      <div className="rounded-xl border border-[#d5ddda] bg-white p-4">
        <h3 className="mb-3 text-[16px] font-bold">Чек-лист состояний</h3>
        <ul className="space-y-2">
          {STATES.map((t) => (
            <li key={t} className="flex items-center gap-3 text-[14px]">
              <Box on={!!s[t]} label={t} onClick={() => toggleS(t)} />
              <span style={{ color: s[t] ? C.muted : C.text }}>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
