import { useState } from "react";
import { ACCENT, C } from "./lib/tokens";
import { Icon } from "./components/Icons";
import { ThunderMock } from "./components/ThunderMock";
import { Gallery } from "./components/Gallery";
import { Windows } from "./components/Windows";
import { Contrast } from "./components/Contrast";
import { Downloads } from "./components/Downloads";
import { Acceptance } from "./components/Acceptance";
import type { Density, Layout } from "./components/MailRow";

function Section({
  id,
  n,
  title,
  lead,
  children,
}: {
  id: string;
  n: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 max-w-3xl">
          <div className="mb-1 font-mono text-[12px] font-bold" style={{ color: C.unread }}>
            {n}
          </div>
          <h2 className="text-[26px] leading-tight font-extrabold tracking-tight">{title}</h2>
          {lead && (
            <p className="mt-2 text-[15px] leading-relaxed" style={{ color: C.muted }}>
              {lead}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function Seg<T extends string | number>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] font-semibold" style={{ color: C.muted }}>
        {label}
      </span>
      <div role="radiogroup" aria-label={label} className="flex rounded-lg border bg-white p-0.5" style={{ borderColor: C.border }}>
        {options.map(([v, l]) => {
          const on = v === value;
          return (
            <button
              key={String(v)}
              role="radio"
              aria-checked={on}
              onClick={() => onChange(v)}
              className="rounded-md px-3 py-1 text-[13px] outline-none focus-visible:outline-2 focus-visible:outline-[#1A1F1D]"
              style={{
                background: on ? C.paneBg : "transparent",
                color: on ? C.paneText : C.text,
                fontWeight: on ? 700 : 500,
              }}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const SWATCHES: [string, string, string, string?][] = [
  ["Панель папок", "#0F1A17", "#E6F2EE"],
  ["Второстепенный (папки)", "#8FA39C", "#0F1A17"],
  ["Акцент от", "#2EE6A8", "#062018"],
  ["Акцент до", "#22D3EE", "#062018"],
  ["Список и письмо", "#FFFFFF", "#1A1F1D"],
  ["Второстепенный", "#5F6B67", "#FFFFFF"],
  ["Непрочитанное", "#0A7A5A", "#FFFFFF"],
  ["Избранное", "#FFF8E1", "#1A1F1D"],
  ["Звезда", "#F5B700", "#1A1F1D"],
  ["Важно (фон)", "#FFEDEE", "#B4232A"],
  ["Важно (тема)", "#B4232A", "#FFFFFF"],
  ["Выделение", "#D6F5EA", "#062018"],
  ["Выделение без фокуса", "#E2F3EB", "#062018"],
  ["Разделитель", "#E6EBE9", "#1A1F1D"],
];

const DECISIONS: [string, string, string][] = [
  [
    "Вид списка",
    "Карточки",
    "В карточке помещаются отправитель, тема с иконками, превью и тег — полоски слева и точка-маркер читаются лучше, чем в узкой строке таблицы. Таблица поддержана теми же правилами для широких экранов и сортировки по колонкам.",
  ],
  [
    "Плотность",
    "Обычная (≈ 64 px карточка)",
    "На 125–150 % компактная режет превью и бейджи. «Компактная» остаётся рабочей: превью скрывается, строка ≈ 44 px. «Просторная» — для сенсорных экранов.",
  ],
  [
    "Тёмный режим системы",
    "Светлая тема всегда",
    "Тема объявляет color_scheme: light. Панели писем остаются белыми, как в ТЗ; тёмной остаётся только панель папок и рамка. Отдельная тёмная версия — следующий этап (нужна вторая палитра и перепроверка контраста всех меток).",
  ],
  [
    "Звезда избранного",
    "#F5B700 + контур #7A5600",
    "Чистый #F5B700 даёт 1.7:1 на #FFF8E1 и 1.8:1 на белом — меньше порога 3:1 для иконок. Заливка по ТЗ сохранена, добавлен тёмный контур (6.3:1).",
  ],
  [
    "Избранное + важно",
    "Две полоски",
    "Красная (4 px, внешняя) и жёлтая (4 px, рядом): обе метки видны даже без звезды и без различения фона.",
  ],
  [
    "Шрифт",
    "Inter, запасной system-ui",
    "Variable woff2 (латиница + кириллица) лежит рядом с userChrome.css. Manrope — заменой одной переменной. Минимальный размер — 12 px (бейджи, даты, чипсы).",
  ],
];

export default function App() {
  const [layout, setLayout] = useState<Layout>("cards");
  const [density, setDensity] = useState<Density>("normal");
  const [focused, setFocused] = useState(true);
  const [scale, setScale] = useState(1);

  return (
    <div>
      {/* навигация */}
      <nav className="sticky top-0 z-30 border-b border-[#1F2F2A]" style={{ background: C.paneBg }}>
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-2.5 sm:px-6">
          <a href="#top" className="flex items-center gap-2 text-[15px] font-extrabold whitespace-nowrap text-[#E6F2EE] outline-none focus-visible:outline-2 focus-visible:outline-white">
            <span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ background: ACCENT, color: C.accentText }}>
              <Icon name="mail" size={14} sw={2.4} />
            </span>
            GlowMail
          </a>
          {[
            ["#mock", "Макет"],
            ["#states", "Состояния"],
            ["#windows", "Окна"],
            ["#contrast", "Контраст"],
            ["#decisions", "Решения"],
            ["#install", "Установка"],
            ["#accept", "Приёмка"],
          ].map(([h, l]) => (
            <a key={h} href={h} className="rounded px-1 text-[14px] whitespace-nowrap text-[#A9BDB6] outline-none hover:text-white focus-visible:outline-2 focus-visible:outline-white">
              {l}
            </a>
          ))}
        </div>
      </nav>

      {/* hero */}
      <header id="top" style={{ background: C.paneBg }} className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full opacity-25 blur-3xl"
          style={{ background: ACCENT }}
        />
        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-12 sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1F2F2A] bg-[#14221E] px-3 py-1 text-[13px] text-[#A9BDB6]">
            <span className="h-2 w-2 rounded-full" style={{ background: C.accentFrom }} />
            Thunderbird 128+ · Betterbird · v1.3.0
          </div>
          <h1 className="max-w-3xl text-[44px] leading-[1.05] font-extrabold tracking-tight text-[#E6F2EE] sm:text-[56px]">
            Тема <span style={{ background: ACCENT, WebkitBackgroundClip: "text", color: "transparent" }}>GlowMail</span> для Thunderbird
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#A9BDB6]">
            Тёмная панель папок с мятно-бирюзовым свечением, светлый список и письмо. Метки читаются с первого взгляда,
            контраст проверен по WCAG AA. Ниже — рабочий макет, все состояния для приёмки, файлы и инструкция.
          </p>
          <div className="mt-8">
            <Downloads />
          </div>
          <p className="mt-3 text-[12px] text-[#8FA39C]">
            Файлы собираются прямо в браузере из исходников темы (манифест, userChrome.css, шрифты).
          </p>
        </div>
      </header>

      <Section
        id="mock"
        n="01 · ЖИВОЙ МАКЕТ"
        title="Три панели: папки, список, письмо"
        lead="Кликайте по письмам и папкам, нажимайте Tab — виден клавиатурный фокус. Переключатели ниже меняют вид списка, плотность, фокус панели и масштаб интерфейса."
      >
        <div className="no-print mb-4 flex flex-wrap gap-x-6 gap-y-3">
          <Seg label="Список" value={layout} onChange={setLayout} options={[["cards", "Карточки"], ["table", "Таблица"]]} />
          <Seg
            label="Плотность"
            value={density}
            onChange={setDensity}
            options={[["compact", "Компактная"], ["normal", "Обычная"], ["comfortable", "Просторная"]]}
          />
          <Seg label="Фокус в списке" value={focused ? 1 : 0} onChange={(v) => setFocused(!!v)} options={[[1, "Есть"], [0, "Нет"]]} />
          <Seg label="Масштаб" value={scale} onChange={setScale} options={[[1, "100 %"], [1.25, "125 %"], [1.5, "150 %"]]} />
        </div>
        <ThunderMock layout={layout} density={density} paneFocused={focused} scale={scale} />
        <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
          {SWATCHES.map(([n, bg, fg]) => (
            <div key={n + bg} className="rounded-lg border border-[#d5ddda] p-2.5" style={{ background: bg, color: fg }}>
              <div className="text-[12px] font-semibold">{n}</div>
              <div className="font-mono text-[12px]">{bg}</div>
            </div>
          ))}
        </div>
      </Section>

      <div className="border-y border-[#d5ddda] bg-[#EAF0EE]">
        <Section
          id="states"
          n="02 · СОСТОЯНИЯ ДЛЯ ПРИЁМКИ"
          title="Каждое состояние — отдельной карточкой"
          lead="У каждого состояния есть код (S01, F03, T02…) — на него ссылается чек-лист приёмки. Вид строк следует переключателям «Список» и «Плотность» выше."
        >
          <Gallery layout={layout} density={density} />
        </Section>
      </div>

      <Section
        id="windows"
        n="03 · ОКНА И ЭЛЕМЕНТЫ"
        title="Написание, адресная книга, меню, диалоги"
        lead="Та же стилистика: акцентная кнопка действия, тёмные списки источников, белые рабочие области, заметные рамки полей."
      >
        <Windows />
      </Section>

      <div className="border-y border-[#d5ddda] bg-white">
        <Section
          id="contrast"
          n="04 · КОНТРАСТ WCAG AA"
          title="Проверка всех пар цветов"
          lead="Расчёт идёт по формуле WCAG из реальных значений токенов. Строка «Нет» — честный результат черновой палитры; исправление указано рядом."
        >
          <Contrast />
        </Section>
      </div>

      <Section id="decisions" n="05 · РЕШЕНИЯ ПО ОТКРЫТЫМ ПУНКТАМ ТЗ" title="Что выбрано и почему">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DECISIONS.map(([q, a, why]) => (
            <article key={q} className="rounded-xl border border-[#d5ddda] bg-white p-5">
              <div className="text-[12px] font-semibold tracking-wide uppercase" style={{ color: C.muted }}>
                {q}
              </div>
              <div className="mt-1 text-[18px] font-extrabold">{a}</div>
              <p className="mt-2 text-[14px] leading-relaxed" style={{ color: C.muted }}>
                {why}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <div className="text-[#E6F2EE]" style={{ background: C.paneBg }}>
        <Section id="install" n="06 · УСТАНОВКА" title="Как установить GlowMail">
          <div className="grid gap-6 lg:grid-cols-2">
            <ol className="space-y-4">
              {[
                ["Скачать", "Нажми glowmail-theme.xpi выше."],
                ["Установить", "Ctrl+Shift+A → ⚙ → «Установить дополнение из файла…» → выбери скачанный XPI."],
                ["Включить", "Открой раздел «Темы» и включи GlowMail. Затем перезапусти почтовую программу."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-[14px] font-extrabold" style={{ background: ACCENT, color: C.accentText }}>
                    {i + 1}
                  </span>
                  <div>
                    <div className="text-[15px] font-bold">{t}</div>
                    <p className="text-[14px] leading-relaxed text-[#A9BDB6]">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="self-start rounded-xl border border-[#1F2F2A] bg-[#14221E] p-4 text-[14px] leading-relaxed text-[#A9BDB6]">
              XPI включает стили, иконки и шрифт Inter. Версия 1.3.0 проверена в Betterbird 153.6.0.
            </div>
          </div>
        </Section>
      </div>

      <Section
        id="accept"
        n="07 · ПРИЁМКА"
        title="Чек-лист и матрица проверок"
        lead="Скриншоты состояний снимаются в самом Thunderbird по кодам S/F/T/B/W; страница «Состояния» выше — эталон, с которым их сверяют (Ctrl+P сохранит её в PDF)."
      >
        <Acceptance />
      </Section>

      <footer className="border-t border-[#1F2F2A] py-8 text-center text-[13px] text-[#8FA39C]" style={{ background: C.paneBg }}>
        GlowMail 1.3.0 · тема XPI · Inter
      </footer>
    </div>
  );
}
