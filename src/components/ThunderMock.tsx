import { useState } from "react";
import { ACCENT, C, FOLDERS, MAILS, type Folder } from "../lib/tokens";
import { Icon } from "./Icons";
import { Chip, MailRow, type Density, type Layout } from "./MailRow";

/* ---------- Папка ---------- */
export function FolderRow({
  f,
  selected,
  forceHover,
  forceFocus,
  onClick,
}: {
  f: Folder;
  selected?: boolean;
  forceHover?: boolean;
  forceFocus?: boolean;
  onClick?: () => void;
}) {
  const fg = selected ? C.accentText : C.paneText;
  return (
    <button
      onClick={onClick}
      className="relative mx-2 flex min-h-8 w-[calc(100%-16px)] items-center gap-2 rounded-lg px-2 text-left text-[14px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      style={{
        background: selected ? ACCENT : forceHover ? "rgba(230,242,238,.09)" : undefined,
        color: fg,
        fontWeight: selected || f.unread ? 700 : 400,
        outline: forceFocus ? "2px solid #fff" : undefined,
        outlineOffset: forceFocus ? 2 : undefined,
      }}
      onMouseEnter={(e) => {
        if (!selected && !forceHover) e.currentTarget.style.background = "rgba(230,242,238,.09)";
      }}
      onMouseLeave={(e) => {
        if (!selected && !forceHover) e.currentTarget.style.background = "";
      }}
    >
      <span
        className="absolute top-[7px] bottom-[7px] -left-2 w-1 rounded-sm"
        style={{ background: selected ? C.accentText : f.color }}
      />
      <Icon name={f.icon} size={18} color={selected ? C.accentText : f.color} />
      <span className="flex-1 truncate">{f.name}</span>
      {f.unread ? (
        <span
          className="min-w-5 rounded-full px-[7px] py-px text-center text-[12px] font-bold"
          style={
            selected
              ? { background: C.accentText, color: C.accentFrom }
              : { background: ACCENT, color: C.accentText }
          }
        >
          {f.unread}
        </span>
      ) : f.total ? (
        <span className="text-[12px] font-normal" style={{ color: selected ? C.accentText : C.paneMuted }}>
          {f.total}
        </span>
      ) : null}
    </button>
  );
}

/* ---------- Вкладка ---------- */
export function Tab({
  label,
  state,
  icon,
}: {
  label: string;
  state: "active" | "inactive" | "hover";
  icon?: string;
}) {
  const active = state === "active";
  return (
    <div
      tabIndex={0}
      className={`flex h-9 items-center gap-2 rounded-t-lg px-4 text-[14px] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white ${
        state === "inactive" ? "hover:bg-[rgba(230,242,238,.08)] hover:text-[#E6F2EE]" : ""
      }`}
      style={{
        background: active ? ACCENT : state === "hover" ? "rgba(230,242,238,.08)" : "transparent",
        color: active ? C.accentText : state === "hover" ? C.paneText : C.inactiveTab,
        fontWeight: active ? 700 : 500,
      }}
    >
      {icon && <Icon name={icon} size={16} />}
      {label}
      <Icon name="x" size={12} />
    </div>
  );
}

export function WriteButton({ small }: { small?: boolean }) {
  return (
    <button
      className={`flex items-center gap-2 rounded-lg font-bold outline-none transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1F1D] ${
        small ? "h-8 px-3 text-[13px]" : "h-9 px-4 text-[14px]"
      }`}
      style={{ background: ACCENT, color: C.accentText }}
    >
      <Icon name="draft" size={16} />
      Написать
    </button>
  );
}

function TbBtn({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium outline-none hover:bg-[rgba(10,122,90,.12)] focus-visible:outline-2 focus-visible:outline-[#0A7A5A]"
      style={{ color: C.text }}
    >
      <Icon name={icon} size={18} color={C.icon} />
      <span className="hidden xl:inline">{label}</span>
    </button>
  );
}

/* ---------- Окно ---------- */
export function ThunderMock({
  layout,
  density,
  paneFocused,
  scale,
}: {
  layout: Layout;
  density: Density;
  paneFocused: boolean;
  scale: number;
}) {
  const [folder, setFolder] = useState("inbox");
  const [sel, setSel] = useState("m3");
  const [filter, setFilter] = useState<string | null>(null);
  const mail = MAILS.find((m) => m.id === sel) ?? MAILS[0];

  const list = MAILS.filter((m) => {
    if (filter === "unread") return m.unread || m.thread?.unreadInside;
    if (filter === "flag") return m.flagged;
    if (filter === "attach") return m.attach;
    return true;
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-[#1F2F2A] shadow-[0_20px_60px_-20px_rgba(6,32,24,.55)]">
      <div style={{ zoom: scale, minWidth: 1040 }} className="select-none">
        {/* рамка + вкладки */}
        <div className="flex items-end gap-1 px-3 pt-2" style={{ background: C.paneBg }}>
          <div className="mr-3 mb-2 flex items-center gap-1.5 self-center">
            <span className="h-3 w-3 rounded-full bg-[#FF7A85]" />
            <span className="h-3 w-3 rounded-full bg-[#FFC857]" />
            <span className="h-3 w-3 rounded-full bg-[#2EE6A8]" />
          </div>
          <Tab label="Входящие" state="active" icon="inbox" />
          <Tab label="Календарь" state="inactive" icon="cal" />
          <Tab label="Адресная книга" state="inactive" icon="book" />
        </div>
        {/* тулбар */}
        <div className="flex items-center gap-1 border-b px-3 py-1.5" style={{ background: "#fff", borderColor: C.divider }}>
          <WriteButton />
          <span className="mx-1 h-6 w-px" style={{ background: "#C9D3CF" }} />
          <TbBtn icon="refresh" label="Получить" />
          <TbBtn icon="reply" label="Ответить" />
          <TbBtn icon="forward" label="Переслать" />
          <TbBtn icon="archive" label="Архивировать" />
          <TbBtn icon="ban" label="Спам" />
          <TbBtn icon="trash" label="Удалить" />
          <div className="ml-auto flex h-9 w-64 items-center gap-2 rounded-lg border bg-[#F2F5F4] px-3 focus-within:bg-white focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-[#0A7A5A]" style={{ borderColor: C.border }}>
            <Icon name="search" size={16} color={C.icon} />
            <input
              placeholder="Поиск Ctrl+K"
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#5F6B67]"
              style={{ color: C.text }}
            />
          </div>
        </div>
        {/* три панели */}
        <div className="grid" style={{ gridTemplateColumns: "232px 380px 1fr", height: 560, background: "#fff" }}>
          {/* папки */}
          <div className="overflow-y-auto py-3" style={{ background: C.paneBg }}>
            <div className="mx-4 mb-2 flex items-center gap-1 text-[12px] font-semibold tracking-wide uppercase" style={{ color: C.paneMuted }}>
              <Icon name="chevron" size={12} /> anna@glowmail.app
            </div>
            <div className="flex flex-col gap-0.5">
              {FOLDERS.map((f) => (
                <FolderRow key={f.id} f={f} selected={folder === f.id} onClick={() => setFolder(f.id)} />
              ))}
            </div>
          </div>
          {/* список */}
          <div className="flex min-w-0 flex-col border-r" style={{ borderColor: C.divider }}>
            <div className="flex items-center gap-1.5 border-b px-3 py-2" style={{ background: "#F7FAF9", borderColor: C.divider }}>
              {[
                ["unread", "Непрочитанные"],
                ["flag", "Избранное"],
                ["attach", "Вложения"],
              ].map(([k, l]) => {
                const on = filter === k;
                return (
                  <button
                    key={k}
                    aria-pressed={on}
                    onClick={() => setFilter(on ? null : k)}
                    className="rounded-md px-2.5 py-1 text-[13px] font-medium outline-none hover:bg-[#E6EBE9] focus-visible:outline-2 focus-visible:outline-[#1A1F1D]"
                    style={{
                      background: on ? C.sel : undefined,
                      color: on ? C.accentText : C.muted,
                      fontWeight: on ? 700 : 500,
                      boxShadow: on ? `inset 0 -3px 0 ${C.unread}` : undefined,
                    }}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
            <div className="flex-1 overflow-y-auto" role="grid" aria-label="Список писем">
              {list.map((m) => (
                <MailRow
                  key={m.id}
                  m={m}
                  selected={sel === m.id}
                  paneFocused={paneFocused}
                  layout={layout}
                  density={density}
                  onClick={() => setSel(m.id)}
                />
              ))}
              {list.length === 0 && (
                <p className="p-6 text-center text-[14px]" style={{ color: C.muted }}>
                  Писем по фильтру нет
                </p>
              )}
            </div>
          </div>
          {/* письмо */}
          <div className="flex min-w-0 flex-col" style={{ background: "#fff", color: C.text }}>
            <div className="border-b-2 px-6 py-4 shadow-[0_6px_10px_-8px_rgba(15,26,23,.35)]" style={{ borderColor: C.divider }}>
              <div className="flex items-start gap-3">
                <div
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-[14px] font-bold"
                  style={{ background: ACCENT, color: C.accentText }}
                >
                  {mail.from.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[18px] leading-snug font-bold">{mail.subject}</h3>
                  <dl className="mt-1.5 grid grid-cols-[48px_1fr] gap-x-2 gap-y-0.5 text-[13px]">
                    <dt style={{ color: C.muted }}>От</dt>
                    <dd className="font-semibold">{mail.from}</dd>
                    <dt style={{ color: C.muted }}>Кому</dt>
                    <dd>anna@glowmail.app</dd>
                    <dt style={{ color: C.muted }}>Дата</dt>
                    <dd>{mail.date}, 2026</dd>
                  </dl>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {mail.tag && <Chip t={mail.tag} />}
                    {mail.flagged && <Chip t={{ name: "Избранное", color: "#FFE9A6", text: "#5C4000" }} />}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 text-[14px] leading-relaxed">
              <p className="mb-3 text-[12px]" style={{ color: C.muted }}>
                Тело письма — отдельный документ: собственные стили письма тема не перекрашивает.
              </p>
              <div className="rounded-lg border p-5" style={{ borderColor: "#d0d7de", background: "#fdf6e3", fontFamily: "Georgia, serif", color: "#2b2b6b" }}>
                <p className="mb-2 text-[17px]" style={{ color: "#8b1a6b", fontWeight: 700 }}>
                  Привет!
                </p>
                <p>
                  Это HTML-письмо с собственным шрифтом, фоном и цветами. {mail.preview} Тема GlowMail его не трогает —
                  меняется только «рамка» вокруг.
                </p>
                <p className="mt-3">
                  <span className="rounded px-2 py-1 text-white" style={{ background: "#c2410c", fontFamily: "Arial" }}>
                    Кнопка из письма
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-1.5 text-[12px]" style={{ background: C.paneBg, color: C.paneMuted }}>
          <span>Непрочитанных: 12 · Всего: 248</span>
          <span>GlowMail 1.0</span>
        </div>
      </div>
    </div>
  );
}
