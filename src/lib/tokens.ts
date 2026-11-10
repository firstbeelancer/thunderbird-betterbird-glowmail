export const C = {
  paneBg: "#0F1A17",
  paneText: "#E6F2EE",
  paneMuted: "#8FA39C",
  accentFrom: "#2EE6A8",
  accentTo: "#22D3EE",
  accentText: "#062018",
  bg: "#FFFFFF",
  text: "#1A1F1D",
  muted: "#5F6B67",
  divider: "#E6EBE9",
  border: "#8A9893",
  icon: "#4A5652",
  unread: "#0A7A5A",
  favBg: "#FFF8E1",
  favBar: "#F5B700",
  star: "#F5B700",
  starOutline: "#7A5600",
  impBg: "#FFEDEE",
  impBar: "#D92D3A",
  impText: "#B4232A",
  sel: "#D6F5EA",
  selInactive: "#E2F3EB",
  selEdge: "#3E9A7B",
  inactiveTab: "#A9BDB6",
};

export const ACCENT = `linear-gradient(90deg, ${C.accentFrom}, ${C.accentTo})`;

/* ---------- WCAG ---------- */
const lum = (hex: string) => {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const ratio = (a: string, b: string) => {
  const x = lum(a);
  const y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

/* ---------- Демо-письма ---------- */
export type Mail = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  unread?: boolean;
  flagged?: boolean;
  important?: boolean;
  attach?: boolean;
  replied?: boolean;
  forwarded?: boolean;
  junk?: boolean;
  tag?: { name: string; color: string; text: string };
  thread?: { count: number; unreadInside: boolean };
};

export const MAILS: Mail[] = [
  {
    id: "m1",
    from: "Анна Власова",
    subject: "Макеты главной страницы — финальная версия",
    preview: "Привет! Прикрепляю финальные макеты, посмотри до обеда, пожалуйста…",
    date: "10:42",
    unread: true,
    attach: true,
    tag: { name: "Работа", color: "#CFF3FF", text: "#064E5E" },
  },
  {
    id: "m2",
    from: "Платёжный сервис",
    subject: "Требуется подтвердить платёж до 18:00",
    preview: "Мы не смогли списать оплату по счёту №4471. Проверьте данные карты…",
    date: "09:15",
    unread: true,
    important: true,
    tag: { name: "Важно", color: "#FFD9DC", text: "#7A1219" },
  },
  {
    id: "m3",
    from: "Игорь Левин",
    subject: "Re: План релиза 2.4",
    preview: "Согласен с датами, но по тестированию предлагаю добавить два дня…",
    date: "Вчера",
    flagged: true,
    replied: true,
  },
  {
    id: "m4",
    from: "Юридический отдел",
    subject: "Договор подряда: правки к пункту 5.2",
    preview: "Направляем редакцию с правками. Срок согласования — до пятницы.",
    date: "Вчера",
    flagged: true,
    important: true,
    attach: true,
    tag: { name: "Важно", color: "#FFD9DC", text: "#7A1219" },
  },
  {
    id: "m5",
    from: "Команда разработки",
    subject: "Обсуждение: переезд на новый CI",
    preview: "Свёрнутая ветка — 6 писем, 2 из них не прочитаны.",
    date: "Пн",
    thread: { count: 6, unreadInside: true },
    forwarded: true,
  },
  {
    id: "m6",
    from: "Мария Котова",
    subject: "Фото с корпоратива",
    preview: "Скинула альбом по ссылке, там примерно 120 фото…",
    date: "Пн",
    attach: true,
    replied: true,
    forwarded: true,
  },
  {
    id: "m7",
    from: "promo@lucky-deals.example",
    subject: "ВЫ ВЫИГРАЛИ! Заберите подарок сегодня",
    preview: "Только сегодня скидка 90% на все товары. Перейдите по ссылке…",
    date: "Вс",
    junk: true,
  },
  {
    id: "m8",
    from: "Newsletter · Frontend Weekly",
    subject: "Выпуск 214: контейнерные запросы и многое другое",
    preview: "В этом выпуске: новые возможности CSS, обзор инструментов сборки…",
    date: "Сб",
  },
];

export type Folder = {
  id: string;
  name: string;
  icon: string;
  color: string;
  unread?: number;
  total?: number;
  indent?: boolean;
};
export const FOLDERS: Folder[] = [
  { id: "inbox", name: "Входящие", icon: "inbox", color: "#2EE6A8", unread: 12, total: 248 },
  { id: "drafts", name: "Черновики", icon: "draft", color: "#FFC857", total: 3 },
  { id: "sent", name: "Отправленные", icon: "send", color: "#7AA2FF", total: 512 },
  { id: "archive", name: "Архив", icon: "archive", color: "#B58CFF", total: 1840 },
  { id: "junk", name: "Спам", icon: "ban", color: "#FF7A85", unread: 4, total: 37 },
  { id: "trash", name: "Корзина", icon: "trash", color: "#8FA39C", total: 21 },
  { id: "work", name: "Работа", icon: "folder", color: "#22D3EE", unread: 3, total: 96 },
  { id: "family", name: "Семья", icon: "folder", color: "#F28CE0", total: 54 },
];
