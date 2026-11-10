import { ACCENT, C } from "../lib/tokens";
import { Icon } from "./Icons";
import { Tab } from "./ThunderMock";

function Win({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-[#d5ddda] bg-white">
      <div className="flex items-baseline gap-2 border-b border-[#E6EBE9] bg-[#F7FAF9] px-3 py-2">
        <span className="rounded bg-[#0F1A17] px-1.5 py-0.5 font-mono text-[12px] font-bold text-[#2EE6A8]">{id}</span>
        <figcaption className="text-[14px] font-semibold">{title}</figcaption>
      </div>
      {children}
    </figure>
  );
}

const field = "flex items-center gap-2 border-b px-4 py-2 text-[14px]";

function Compose() {
  return (
    <Win id="W01" title="Окно написания письма">
      <div className="flex items-end px-3 pt-2" style={{ background: C.paneBg }}>
        <Tab label="Написать: Re: План релиза 2.4" state="active" icon="draft" />
      </div>
      <div className="flex items-center gap-2 border-b px-3 py-2" style={{ borderColor: C.divider }}>
        <button
          className="flex h-9 items-center gap-2 rounded-lg px-4 text-[14px] font-bold outline-none hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1F1D]"
          style={{ background: ACCENT, color: C.accentText }}
        >
          <Icon name="send" size={16} /> Отправить
        </button>
        <span className="mx-1 h-6 w-px bg-[#C9D3CF]" />
        <Icon name="clip" size={18} color={C.icon} />
        <Icon name="bold" size={18} color={C.icon} />
        <Icon name="list" size={18} color={C.icon} />
      </div>
      <div style={{ background: "#F7FAF9" }}>
        <div className={field} style={{ borderColor: C.divider }}>
          <span className="w-12 text-[13px]" style={{ color: C.muted }}>
            Кому
          </span>
          <span
            className="rounded-full border px-2.5 py-0.5 text-[13px] font-medium"
            style={{ background: C.sel, color: C.accentText, borderColor: C.unread }}
          >
            Игорь Левин
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-[13px] font-medium text-white"
            style={{ background: C.unread }}
            title="Выбранная плашка"
          >
            Анна Власова
          </span>
        </div>
        <div className={field} style={{ borderColor: C.divider }}>
          <span className="w-12 text-[13px]" style={{ color: C.muted }}>
            Тема
          </span>
          <span className="font-semibold">Re: План релиза 2.4</span>
        </div>
      </div>
      <div className="h-24 p-4 text-[14px]" style={{ color: C.text }}>
        Игорь, согласен с датами. Добавим два дня на тестирование…
      </div>
    </Win>
  );
}

function Contacts() {
  const list = [
    ["Анна Власова", "anna@glowmail.app"],
    ["Игорь Левин", "igor@studio.example"],
    ["Мария Котова", "maria@mail.example"],
  ];
  return (
    <Win id="W02" title="Адресная книга">
      <div className="grid h-60 grid-cols-[150px_1fr_1.1fr]">
        <div className="py-3" style={{ background: C.paneBg }}>
          {[
            ["Личная", true],
            ["Работа", false],
            ["Собранные", false],
          ].map(([n, s]) => (
            <div
              key={n as string}
              className="mx-2 mb-0.5 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[14px]"
              style={
                s
                  ? { background: ACCENT, color: C.accentText, fontWeight: 700 }
                  : { color: C.paneText }
              }
            >
              <Icon name="book" size={16} />
              {n}
            </div>
          ))}
        </div>
        <div className="border-r" style={{ borderColor: C.divider }}>
          {list.map(([n, e], i) => (
            <div
              key={n}
              className="px-3 py-2 text-[14px]"
              style={{
                background: i === 0 ? C.sel : undefined,
                boxShadow: i === 0 ? `inset 4px 0 0 ${C.unread}` : undefined,
                borderBottom: `1px solid ${C.divider}`,
              }}
            >
              <div className="font-semibold">{n}</div>
              <div className="text-[13px]" style={{ color: C.muted }}>
                {e}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full text-[18px] font-bold" style={{ background: ACCENT, color: C.accentText }}>
            А
          </div>
          <div className="text-[18px] font-bold">Анна Власова</div>
          <div className="mt-1 text-[13px]" style={{ color: C.muted }}>
            anna@glowmail.app
          </div>
          <div className="mt-3 inline-flex h-8 items-center rounded-lg px-3 text-[13px] font-bold" style={{ background: ACCENT, color: C.accentText }}>
            Написать
          </div>
        </div>
      </div>
    </Win>
  );
}

function Popups() {
  return (
    <Win id="W03" title="Меню, диалог, уведомления, скроллбар">
      <div className="grid gap-4 p-4 md:grid-cols-2" style={{ background: "#F2F5F4" }}>
        {/* меню */}
        <div
          className="w-56 rounded-[10px] border py-1.5 text-[14px] shadow-[0_8px_24px_rgba(15,26,23,.22)]"
          style={{ background: "#fff", borderColor: "#C9D3CF", color: C.text }}
        >
          {["Ответить", "Ответить всем", "Переслать"].map((t, i) => (
            <div
              key={t}
              className="flex items-center justify-between px-3 py-1.5"
              style={i === 1 ? { background: C.sel, color: C.accentText } : undefined}
            >
              {t}
              <span className="text-[12px]" style={{ color: i === 1 ? C.accentText : C.muted }}>
                Ctrl+{i + 1}
              </span>
            </div>
          ))}
          <div className="my-1 border-t" style={{ borderColor: C.divider }} />
          <div className="px-3 py-1.5" style={{ color: C.muted }}>
            Недоступно (disabled)
          </div>
        </div>
        {/* диалог */}
        <div className="rounded-xl border bg-white p-4 shadow-[0_8px_24px_rgba(15,26,23,.18)]" style={{ borderColor: "#C9D3CF" }}>
          <div className="text-[16px] font-bold">Удалить письмо?</div>
          <p className="mt-1 text-[14px]" style={{ color: C.muted }}>
            Письмо переместится в Корзину. Это действие можно отменить.
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button className="h-9 rounded-lg border px-4 text-[14px] font-medium outline-none hover:bg-[#F2F5F4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1F1D]" style={{ borderColor: C.border }}>
              Отмена
            </button>
            <button className="h-9 rounded-lg px-4 text-[14px] font-bold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1F1D]" style={{ background: ACCENT, color: C.accentText }}>
              Удалить
            </button>
          </div>
        </div>
        {/* уведомления */}
        <div className="space-y-2">
          {[
            { t: "Письмо отправлено", bg: "#F2FBF8", b: C.unread, ic: "check" },
            { t: "Соединение нестабильно, повтор через 30 с", bg: C.favBg, b: C.starOutline, ic: "alert" },
            { t: "Не удалось отправить: сервер отклонил письмо", bg: C.impBg, b: C.impBar, ic: "info" },
          ].map((n) => (
            <div
              key={n.t}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-[14px]"
              style={{ background: n.bg, borderColor: n.b, borderLeftWidth: 6, color: C.text }}
            >
              <Icon name={n.ic} size={16} color={n.b} />
              {n.t}
            </div>
          ))}
        </div>
        {/* скроллбар */}
        <div className="relative h-28 overflow-y-scroll rounded-lg border bg-white p-3 text-[14px]" style={{ borderColor: C.divider }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <p key={i} className="mb-1" style={{ color: C.text }}>
              Строка длинного списка №{i + 1} — прокрутите, чтобы увидеть ползунок
            </p>
          ))}
        </div>
      </div>
    </Win>
  );
}

export function Windows() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Compose />
      <Contacts />
      <div className="xl:col-span-2">
        <Popups />
      </div>
    </div>
  );
}
