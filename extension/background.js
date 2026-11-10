// GlowMail: цвета применяются динамически (browser.theme.update),
// потому что статическая тема (ключ "theme" в манифесте) несовместима
// с background-скриптом и Experiment API — Thunderbird отклоняет такой
// манифест как повреждённый. Цвета — те же, что в theme/manifest.json.
const THEME = {
  colors: {
  "button_background_active": "rgba(10, 122, 90, 0.22)",
  "button_background_hover": "rgba(10, 122, 90, 0.12)",
  "frame": "#0F1A17",
  "frame_inactive": "#14221E",
  "icons": "#4A5652",
  "icons_attention": "#0A7A5A",
  "popup": "#FFFFFF",
  "popup_border": "#C9D3CF",
  "popup_highlight": "#D6F5EA",
  "popup_highlight_text": "#062018",
  "popup_text": "#1A1F1D",
  "sidebar": "#0F1A17",
  "sidebar_border": "#1F2F2A",
  "sidebar_highlight": "#2EE6A8",
  "sidebar_highlight_text": "#062018",
  "sidebar_text": "#E6F2EE",
  "tab_background_separator": "#0F1A17",
  "tab_background_text": "#A9BDB6",
  "tab_line": "#22D3EE",
  "tab_loading": "#22D3EE",
  "tab_selected": "#2EE6A8",
  "tab_text": "#062018",
  "toolbar": "#FFFFFF",
  "toolbar_bottom_separator": "#E6EBE9",
  "toolbar_field": "#F2F5F4",
  "toolbar_field_border": "#8A9893",
  "toolbar_field_border_focus": "#0A7A5A",
  "toolbar_field_focus": "#FFFFFF",
  "toolbar_field_highlight": "#D6F5EA",
  "toolbar_field_highlight_text": "#062018",
  "toolbar_field_text": "#1A1F1D",
  "toolbar_field_text_focus": "#1A1F1D",
  "toolbar_text": "#1A1F1D",
  "toolbar_top_separator": "#FFFFFF",
  "toolbar_vertical_separator": "#C9D3CF"
},
  properties: {
  "color_scheme": "light",
  "content_color_scheme": "light"
},
};

browser.theme.update(THEME).catch((e) => {
  console.error("GlowMail theme update failed:", e);
});

// Разворачивает chrome/-файлы в профиль при запуске.
// Развёртывание version-gated (см. api/api.js).
browser.glowmail.deploy().catch((e) => {
  console.error("GlowMail deploy failed:", e);
});
