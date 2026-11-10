import { C, FOLDERS, type Mail } from "../lib/tokens";
import { FolderRow, Tab, WriteButton } from "./ThunderMock";
import { MailRow, type Layout } from "./MailRow";

const base = (o: Partial<Mail>): Mail => ({
  id: "x",
  from: "Анна Власова",
  subject: "Макеты главной страницы",
  preview: "Привет! Прикрепляю финальные макеты, посмотри до обеда…",
  date: "10:42",
  ...o,
});

type RowState = { id: string; title: string; note: string; mail: Mail; selected?: boolean; focused?: boolean };

const ROWS: RowState[] = [
  { id: "S01", title: "Прочитанное", note: "Обычный вес, текст #1A1F1D, разделитель #E6EBE9", mail: base({}) },
  { id: "S02", title: "Непрочитанное", note: "Жирный, #0A7A5A (5.3:1), точка-маркер слева", mail: base({ unread: true }) },
  { id: "S03", title: "Избранное", note: "Жёлтая полоска 4 px, фон #FFF8E1, огонёк с тёмным контуром", mail: base({ flagged: true }) },
  { id: "S04", title: "Важно", note: "Красная полоска 4 px, фон #FFEDEE, тема #B4232A", mail: base({ important: true, subject: "Подтвердите платёж до 18:00" }) },
  { id: "S05", title: "Избранное + важно", note: "Красный фон, жёлто-зелёный огонёк, обе полоски (красная, затем жёлтая)", mail: base({ flagged: true, important: true, subject: "Договор подряда: правки" }) },
  { id: "S06", title: "Выделенное, панель в фокусе", note: "Фон #D6F5EA", mail: base({ unread: true }), selected: true, focused: true },
  { id: "S07", title: "Выделенное, панель без фокуса", note: "Фон бледнее (#E2F3EB) + контур 3:1 сверху и снизу", mail: base({ unread: true }), selected: true, focused: false },
  { id: "S08", title: "Выделенное + избранное", note: "Полоска сохраняется, фон — выделение", mail: base({ flagged: true }), selected: true, focused: true },
  { id: "S09", title: "Выделенное + важно + избранное", note: "Обе полоски и тема #B4232A на #D6F5EA (5.6:1)", mail: base({ flagged: true, important: true, subject: "Договор подряда: правки" }), selected: true, focused: true },
  { id: "S10", title: "Свёрнутая ветка с непрочитанными", note: "Жирный + кольцо-маркер у шеврона + счётчик писем", mail: base({ subject: "Обсуждение: переезд на новый CI", thread: { count: 6, unreadInside: true } }) },
  { id: "S11", title: "Иконки: вложение, ответ, пересылка", note: "Иконки 16 px, #4A5652 / #0A7A5A — ≥ 3:1", mail: base({ attach: true, replied: true, forwarded: true }) },
  { id: "S12", title: "Спам", note: "Приглушённый текст, диагональная штриховка, красная иконка", mail: base({ junk: true, subject: "ВЫ ВЫИГРАЛИ! Заберите подарок" }) },
];

function Frame({ id, title, note, children }: { id: string; title: string; note: string; children: React.ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-[#d5ddda] bg-white">
      <div className="flex items-baseline gap-2 border-b border-[#E6EBE9] bg-[#F7FAF9] px-3 py-2">
        <span className="rounded bg-[#0F1A17] px-1.5 py-0.5 font-mono text-[12px] font-bold text-[#2EE6A8]">{id}</span>
        <figcaption className="text-[14px] font-semibold text-[#1A1F1D]">{title}</figcaption>
      </div>
      {children}
      <p className="border-t border-[#E6EBE9] px-3 py-2 text-[12px] text-[#5F6B67]">{note}</p>
    </figure>
  );
}

export function Gallery({ layout, density }: { layout: Layout; density: "compact" | "normal" | "comfortable" }) {
  return (
    <div className="space-y-10">
      <div>
        <h3 className="mb-3 text-[18px] font-bold">Строки списка (S01–S12)</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {ROWS.map((r) => (
            <Frame key={r.id} id={r.id} title={r.title} note={r.note}>
              <MailRow
                m={r.mail}
                selected={!!r.selected}
                paneFocused={!!r.focused}
                layout={layout}
                density={density}
              />
            </Frame>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[18px] font-bold">Панель папок (F01–F06)</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { id: "F01", t: "Обычная", n: "Текст #E6F2EE (15.5:1), счётчик общего числа #8FA39C (6.7:1)", f: FOLDERS[2] },
            { id: "F02", t: "С непрочитанными", n: "Жирное имя + яркий градиентный бейдж", f: FOLDERS[0] },
            { id: "F03", t: "Наведение", n: "Лёгкая подсветка rgba(230,242,238,.09)", f: FOLDERS[3], hover: true },
            { id: "F04", t: "Активная", n: "Акцентная плашка, жирный #062018, бейдж инвертирован", f: FOLDERS[0], selected: true },
            { id: "F05", t: "Фокус с клавиатуры", n: "Белая обводка 2 px (17.8:1 на тёмном). Попробуйте Tab", f: FOLDERS[4], focus: true },
            { id: "F06", t: "Свой цвет папки", n: "Цвет иконки (штатно) + полоска слева той же окраски", f: FOLDERS[6] },
          ].map((x) => (
            <Frame key={x.id} id={x.id} title={x.t} note={x.n}>
              <div className="py-3" style={{ background: C.paneBg }}>
                <FolderRow f={x.f} selected={x.selected} forceHover={x.hover} forceFocus={x.focus} />
              </div>
            </Frame>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[18px] font-bold">Вкладки и кнопки (T01–T03, B01)</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Frame id="T01" title="Активная вкладка" note="Градиент, жирный #062018 (10:1)">
            <div className="flex items-end px-3 pt-3" style={{ background: C.paneBg }}>
              <Tab label="Входящие" state="active" icon="inbox" />
            </div>
          </Frame>
          <Frame id="T02" title="Неактивная" note="Без заливки, #A9BDB6 (9:1)">
            <div className="flex items-end px-3 pt-3" style={{ background: C.paneBg }}>
              <Tab label="Календарь" state="inactive" icon="cal" />
            </div>
          </Frame>
          <Frame id="T03" title="Наведение на неактивную" note="Чуть ярче текст + едва заметная подложка">
            <div className="flex items-end px-3 pt-3" style={{ background: C.paneBg }}>
              <Tab label="Календарь" state="hover" icon="cal" />
            </div>
          </Frame>
          <Frame id="B01" title="Кнопка «Написать»" note="Акцент, текст #062018 (9.5–10.6:1)">
            <div className="flex items-center px-3 py-4">
              <WriteButton />
            </div>
          </Frame>
        </div>
      </div>
    </div>
  );
}
