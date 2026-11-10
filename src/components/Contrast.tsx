import { ratio } from "../lib/tokens";

type Row = { what: string; fg: string; bg: string; kind: "text" | "ui"; note?: string };

const ROWS: Row[] = [
  { what: "Папки: основной текст", fg: "#E6F2EE", bg: "#0F1A17", kind: "text" },
  { what: "Папки: второстепенный", fg: "#8FA39C", bg: "#0F1A17", kind: "text" },
  { what: "Текст на акценте (начало)", fg: "#062018", bg: "#2EE6A8", kind: "text" },
  { what: "Текст на акценте (конец)", fg: "#062018", bg: "#22D3EE", kind: "text" },
  { what: "Вкладка неактивная", fg: "#A9BDB6", bg: "#0F1A17", kind: "text", note: "Взято #A9BDB6 вместо «серого»" },
  { what: "Фокус папок: белая обводка", fg: "#FFFFFF", bg: "#0F1A17", kind: "ui" },
  { what: "Бейдж на плашке (инверсия)", fg: "#2EE6A8", bg: "#062018", kind: "text" },
  { what: "Список: текст", fg: "#1A1F1D", bg: "#FFFFFF", kind: "text" },
  { what: "Список: второстепенный", fg: "#5F6B67", bg: "#FFFFFF", kind: "text" },
  { what: "Непрочитанное", fg: "#0A7A5A", bg: "#FFFFFF", kind: "text" },
  { what: "Непрочитанное на выделении", fg: "#0A7A5A", bg: "#D6F5EA", kind: "text" },
  { what: "Непрочитанное, выделение без фокуса", fg: "#0A7A5A", bg: "#E2F3EB", kind: "text", note: "Фон подобран, чтобы держать 4.5:1" },
  { what: "Непрочитанное на избранном", fg: "#0A7A5A", bg: "#FFF8E1", kind: "text" },
  { what: "Тема «Важно»", fg: "#B4232A", bg: "#FFEDEE", kind: "text" },
  { what: "Тема «Важно» на выделении", fg: "#B4232A", bg: "#D6F5EA", kind: "text" },
  { what: "Второстепенный на избранном", fg: "#5F6B67", bg: "#FFF8E1", kind: "text" },
  { what: "Второстепенный на «Важно»", fg: "#5F6B67", bg: "#FFEDEE", kind: "text" },
  { what: "Иконки списка", fg: "#4A5652", bg: "#FFFFFF", kind: "ui" },
  { what: "Рамка полей поиска/ввода", fg: "#8A9893", bg: "#FFFFFF", kind: "ui", note: "Граница поля, а не разделитель" },
  { what: "Красная полоска «Важно»", fg: "#D92D3A", bg: "#FFFFFF", kind: "ui" },
  { what: "Контур выделения без фокуса", fg: "#3E9A7B", bg: "#FFFFFF", kind: "ui" },
  { what: "Звезда #F5B700 на #FFF8E1 (как в ТЗ)", fg: "#F5B700", bg: "#FFF8E1", kind: "ui", note: "Не проходит → добавлен контур" },
  { what: "Контур звезды #7A5600 на #FFF8E1", fg: "#7A5600", bg: "#FFF8E1", kind: "ui", note: "Решение: заливка #F5B700 + контур" },
  { what: "Жёлтая полоска #F5B700 на белом", fg: "#F5B700", bg: "#FFFFFF", kind: "ui", note: "Декор: дублируется звездой и фоном" },
  { what: "Разделители #E6EBE9 на белом", fg: "#E6EBE9", bg: "#FFFFFF", kind: "ui", note: "Чисто декоративные линии между строками" },
];

export function Contrast() {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#d5ddda] bg-white">
      <table className="w-full min-w-[720px] text-left text-[13px]">
        <thead className="bg-[#F7FAF9] text-[12px] text-[#5F6B67]">
          <tr>
            <th className="px-3 py-2 font-semibold">Пара</th>
            <th className="px-3 py-2 font-semibold">Образец</th>
            <th className="px-3 py-2 font-semibold">Цвета</th>
            <th className="px-3 py-2 font-semibold">Порог</th>
            <th className="px-3 py-2 font-semibold">Контраст</th>
            <th className="px-3 py-2 font-semibold">AA</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => {
            const k = ratio(r.fg, r.bg);
            const need = r.kind === "text" ? 4.5 : 3;
            const ok = k >= need;
            const decor = r.note?.includes("Декор") || r.note?.includes("декоратив");
            return (
              <tr key={r.what} className="border-t border-[#E6EBE9] align-top">
                <td className="px-3 py-2">
                  <div className="font-medium text-[#1A1F1D]">{r.what}</div>
                  {r.note && <div className="text-[12px] text-[#5F6B67]">{r.note}</div>}
                </td>
                <td className="px-3 py-2">
                  <span
                    className="inline-block rounded px-2 py-0.5 text-[13px] font-bold"
                    style={{ color: r.fg, background: r.bg, border: "1px solid #d5ddda" }}
                  >
                    Aa ★
                  </span>
                </td>
                <td className="px-3 py-2 font-mono text-[12px] text-[#3F4A46]">
                  {r.fg} / {r.bg}
                </td>
                <td className="px-3 py-2 text-[#3F4A46]">{r.kind === "text" ? "4.5:1 текст" : "3:1 иконка/рамка"}</td>
                <td className="px-3 py-2 font-mono font-semibold text-[#1A1F1D]">{k.toFixed(2)}:1</td>
                <td className="px-3 py-2">
                  {ok ? (
                    <span className="rounded-full bg-[#D6F5EA] px-2 py-0.5 text-[12px] font-bold text-[#06452F]">Да</span>
                  ) : decor ? (
                    <span className="rounded-full bg-[#E6EBE9] px-2 py-0.5 text-[12px] font-bold text-[#3F4A46]">Декор</span>
                  ) : (
                    <span className="rounded-full bg-[#FFEDEE] px-2 py-0.5 text-[12px] font-bold text-[#8F1B21]">Нет</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
