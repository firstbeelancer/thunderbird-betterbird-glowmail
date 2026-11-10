const P: Record<string, { d: string; fill?: boolean; extra?: string }> = {
  star: { d: "M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8z" },
  flame: { d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" },
  tag: { d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z", extra: "M7.5 7.5h.01" },
  "reply-all": { d: "M7 17L2 12l5-5M14 17l-5-5 5-5M22 18v-2a4 4 0 0 0-4-4H2" },
  pin: { d: "M12 17v5M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z" },
  clip: { d: "M21 11l-9 9a6 6 0 01-8.5-8.5l9-9a4 4 0 015.7 5.7l-9 9a2 2 0 01-2.8-2.8l8.3-8.3" },
  reply: { d: "M9 14L4 9l5-5M4 9h10a6 6 0 016 6v3" },
  forward: { d: "M15 14l5-5-5-5M20 9H10a6 6 0 00-6 6v3" },
  ban: { d: "M12 3a9 9 0 100 18 9 9 0 000-18zM5.6 5.6l12.8 12.8" },
  inbox: { d: "M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13L22 12v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6z" },
  draft: { d: "M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" },
  send: { d: "M22 2L11 13M22 2l-7 20-4-9-9-4z" },
  archive: { d: "M21 8v13H3V8M1 3h22v5H1zM10 12h4" },
  trash: { d: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" },
  folder: { d: "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" },
  search: { d: "M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3" },
  chevron: { d: "M6 9l6 6 6-6" },
  chevronR: { d: "M9 6l6 6-6 6" },
  check: { d: "M5 12l5 5L20 7" },
  x: { d: "M6 6l12 12M18 6L6 18" },
  mail: { d: "M3 6h18v12H3zM3 7l9 7 9-7" },
  download: { d: "M12 3v12M7 10l5 5 5-5M4 20h16" },
  refresh: { d: "M20 11a8 8 0 10-2.3 5.7M20 4v7h-7" },
  user: { d: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" },
  book: { d: "M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4zM8 4v16" },
  info: { d: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 11v6M12 7.5v.5" },
  alert: { d: "M12 3L2 20h20zM12 10v5M12 17.5v.5" },
  bold: { d: "M7 5h6a3.5 3.5 0 010 7H7zM7 12h7a3.5 3.5 0 010 7H7z" },
  list: { d: "M8 6h13M8 12h13M8 18h13M3 6h.5M3 12h.5M3 18h.5" },
  cal: { d: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
};

export function Icon({
  name,
  size = 16,
  color = "currentColor",
  fill = "none",
  stroke,
  sw = 1.8,
  className,
}: {
  name: string;
  size?: number;
  color?: string;
  fill?: string;
  stroke?: string;
  sw?: number;
  className?: string;
}) {
  const p = P[name];
  const flameGrad = name === "flame";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke ?? color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={{ flex: "none" }}
    >
      {flameGrad && (
        <defs>
          <linearGradient id="gm-flame-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#2EE6A8" />
          </linearGradient>
        </defs>
      )}
      <path d={p.d} />
    </svg>
  );
}
