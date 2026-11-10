import { C, ACCENT, type Mail } from "../lib/tokens";
import { Icon } from "./Icons";

export type Layout = "cards" | "table";
export type Density = "compact" | "normal" | "comfortable";

const PAD: Record<Density, number> = { compact: 6, normal: 10, comfortable: 14 };

export function rowVisual(m: Mail, selected: boolean, paneFocused: boolean) {
  const bg = selected
    ? paneFocused
      ? C.sel
      : C.selInactive
    : m.important
      ? C.impBg
      : m.flagged
        ? C.favBg
        : C.bg;
  const stripe =
    m.important && m.flagged
      ? `inset 4px 0 0 ${C.impBar}, inset 8px 0 0 ${C.favBar}`
      : m.important
        ? `inset 4px 0 0 ${C.impBar}`
        : m.flagged
          ? `inset 4px 0 0 ${C.favBar}`
          : "none";
  const subjectColor = m.important ? C.impText : m.unread ? C.unread : m.junk ? C.muted : C.text;
  const meta = selected ? "#3F4A46" : C.muted;
  const edge = selected ? (paneFocused ? C.unread : C.selEdge) : undefined;
  return { bg, stripe, subjectColor, meta, edge };
}

function Chip({ t }: { t: NonNullable<Mail["tag"]> }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 text-[12px] font-semibold leading-5"
      style={{ background: t.color, color: t.text }}
    >
      {t.name}
    </span>
  );
}

export function FlameGlyph({ on, size = 16 }: { on?: boolean; size?: number }) {
  return on ? (
    <Icon name="flame" size={size} fill="url(#gm-flame-grad)" stroke="#062018" sw={1.4} />
  ) : (
    <Icon name="flame" size={size} color={C.icon} sw={1.6} className="opacity-60" />
  );
}

// Старое имя — на всякий случай, чтобы ничего не сломалось при поиске.
export const StarGlyph = FlameGlyph;

export function MailRow({
  m,
  selected,
  paneFocused,
  layout,
  density,
  onClick,
}: {
  m: Mail;
  selected: boolean;
  paneFocused: boolean;
  layout: Layout;
  density: Density;
  onClick?: () => void;
}) {
  const v = rowVisual(m, selected, paneFocused);
  const py = PAD[density];
  const plainHover = !selected && !m.flagged && !m.important;
  const w = m.unread || m.thread?.unreadInside ? 700 : 400;
  const dot = m.unread ? (
    <span className="mr-1.5 inline-block h-2 w-2 flex-none rounded-full" style={{ background: C.unread }} />
  ) : null;
  const twisty = m.thread ? (
    <span className="mr-1 inline-flex items-center gap-1">
      <Icon name="chevronR" size={12} color={C.icon} />
      {m.thread.unreadInside && (
        <span
          className="inline-block h-[10px] w-[10px] rounded-full"
          style={{ background: ACCENT, boxShadow: `0 0 0 2px #fff, 0 0 0 3.5px ${C.unread}` }}
          title="В свёрнутой ветке есть непрочитанные"
        />
      )}
    </span>
  ) : null;
  const icons = (
    <span className="flex flex-none items-center gap-1.5">
      {m.attach && <Icon name="clip" size={16} color={C.icon} />}
      {m.replied && <Icon name="reply" size={16} color={C.unread} />}
      {m.forwarded && <Icon name="forward" size={16} color={C.unread} />}
      {m.junk && <Icon name="ban" size={16} color={C.impText} />}
      <FlameGlyph on={m.flagged} />
    </span>
  );

  const base: React.CSSProperties = {
    background: v.bg,
    boxShadow: v.stripe,
    borderBottom: `1px solid ${v.edge ?? C.divider}`,
    borderTop: v.edge ? `1px solid ${v.edge}` : "1px solid transparent",
    paddingTop: py,
    paddingBottom: py,
    fontWeight: w,
    backgroundImage: m.junk && !selected
      ? "repeating-linear-gradient(135deg, transparent 0 8px, rgba(180,35,42,.05) 8px 16px)"
      : undefined,
  };
  const cls = `block w-full cursor-default text-left outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1A1F1D] ${
    plainHover ? "hover:bg-[#F2F5F4]" : ""
  }`;

  if (layout === "table") {
    return (
      <div
        role="row"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
        className={`${cls} flex items-center gap-3 pr-3 pl-5 text-[14px]`}
        style={{ ...base, color: v.subjectColor }}
      >
        <FlameGlyph on={m.flagged} />
        <span className="flex min-w-0 flex-1 items-center">
          {twisty}
          {dot}
          <span className="truncate" style={{ fontWeight: w }}>
            {m.subject}
          </span>
          {m.tag && (
            <span className="ml-2 flex-none">
              <Chip t={m.tag} />
            </span>
          )}
        </span>
        <span className="w-36 flex-none truncate text-[13px]" style={{ color: m.unread ? C.unread : v.meta }}>
          {m.from}
        </span>
        <span className="flex w-20 flex-none items-center justify-end gap-1.5">
          {m.attach && <Icon name="clip" size={16} color={C.icon} />}
          {m.replied && <Icon name="reply" size={16} color={C.unread} />}
          {m.forwarded && <Icon name="forward" size={16} color={C.unread} />}
          {m.junk && <Icon name="ban" size={16} color={C.impText} />}
        </span>
        <span className="w-12 flex-none text-right text-[13px] font-normal" style={{ color: v.meta }}>
          {m.date}
        </span>
      </div>
    );
  }

  return (
    <div
      role="row"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      className={`${cls} pr-3 pl-5`}
      style={{ ...base, color: v.subjectColor }}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span
          className="truncate text-[14px]"
          style={{ color: m.unread ? C.unread : selected ? C.text : C.text, fontWeight: m.unread ? 700 : 500 }}
        >
          {m.from}
        </span>
        <span className="flex-none text-[12px] font-normal" style={{ color: v.meta }}>
          {m.date}
        </span>
      </div>
      <div className="mt-0.5 flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center text-[14px]">
          {twisty}
          {dot}
          <span className="truncate" style={{ fontWeight: w }}>
            {m.subject}
          </span>
        </span>
        {icons}
      </div>
      {density !== "compact" && (
        <div className="mt-0.5 flex items-center gap-2 text-[13px] font-normal" style={{ color: v.meta }}>
          <span className="truncate">{m.preview}</span>
          {m.tag && (
            <span className="ml-auto flex-none">
              <Chip t={m.tag} />
            </span>
          )}
          {m.thread && (
            <span
              className="ml-auto flex-none rounded-full px-2 text-[12px] font-semibold leading-5"
              style={{ background: C.paneBg, color: C.paneText }}
            >
              {m.thread.count}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export { Chip };
