// theme.jsx
// Presentation-only design tokens + shared style helpers (Palaestra design system).
// NOTE: styling only — no application logic, API calls, or routing belong here.

import { ArrowLeft } from "lucide-react";

// ── Palette (Palaestra — shared with the Player Portal) ───────────────────────
export const C = {
  ink: "#0d2a63",
  charcoal: "#0f2f6e",

  coral: "#2f9be0",
  coralDark: "#2380c2",
  coralTint: "#e8f3fb",
  coralTintBorder: "#cfe6f7",

  // back-compat keys (kept so existing references adopt the new palette):
  navy: "#2f9be0",        // primary action → coral
  navyHover: "#2380c2",
  navyLight: "#2380c2",
  navyTint: "#e8f3fb",
  navyTintBorder: "#cfe6f7",
  red: "#2f9be0",         // accent → coral
  redHover: "#2380c2",
  redTint: "#e8f3fb",

  blue: "#16306e",
  gold: "#c79a2f",

  green: "#1f9d57",
  greenTint: "#e7f6ed",
  greenBorder: "#bfe3bf",

  danger: "#cc3333",
  dangerTint: "#fdecec",
  dangerBorder: "#f3c9c5",

  warn: "#d98a0b",
  warnTint: "#fdf2dd",
  warnBorder: "#ffe2a8",

  bg: "#f3f4f6",
  surface: "#ffffff",
  border: "#e6e7eb",
  text: "#171a1f",
  textMut: "#6b7280",
  textFaint: "#9aa0aa",
  white: "#ffffff",
};

export const FONT = {
  display: "'Barlow Condensed', sans-serif",
  body: "'Barlow', system-ui, sans-serif",
};

export const RADII = { card: "14px", btn: "10px", pill: "999px" };

export const SHADOW = {
  card: "0 1px 2px rgba(16,18,22,.05),0 8px 24px -12px rgba(16,18,22,.14)",
  elev: "0 24px 60px -24px rgba(16,18,22,.34)",
};

// ── Card surface ─────────────────────────────────────────────────────────────
export const card = (x = {}) => ({
  backgroundColor: C.surface,
  borderRadius: RADII.card,
  border: `1px solid ${C.border}`,
  boxShadow: SHADOW.card,
  ...x,
});

// ── Button ───────────────────────────────────────────────────────────────────
const BTN_VARIANTS = {
  primary: { bg: C.coral, hov: C.coralDark, fg: "#fff", glow: "0 2px 8px rgba(47, 155, 224,0.25)" },
  accent: { bg: C.coral, hov: C.coralDark, fg: "#fff", glow: "0 2px 8px rgba(47, 155, 224,0.25)" },
  danger: { bg: C.danger, hov: "#b82d2d", fg: "#fff", glow: "0 2px 8px rgba(204,51,51,0.22)" },
  dark: { bg: C.ink, hov: "#1f3f8a", fg: "#fff", glow: "none" },
  ghost: { bg: "#ffffff", hov: "#fafafa", fg: C.text, glow: "none" },
};

export const OBtn = ({
  children,
  onClick,
  style = {},
  variant = "primary",
  disabled = false,
  type = "button",
}) => {
  const p = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "11px 18px",
        backgroundColor: disabled ? "#dfe1e5" : p.bg,
        color: disabled ? "#9aa0aa" : p.fg,
        border: variant === "ghost" ? `1px solid ${C.border}` : "1px solid transparent",
        borderRadius: RADII.btn,
        fontSize: "14px",
        fontWeight: 600,
        fontFamily: FONT.body,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : p.glow,
        transition: "background 0.15s, box-shadow 0.15s",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = p.hov;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = p.bg;
      }}
    >
      {children}
    </button>
  );
};

// ── Back button ──────────────────────────────────────────────────────────────
export const BackBtn = ({ label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "none",
      border: "none",
      color: C.textFaint,
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      marginBottom: "18px",
      padding: 0,
      fontFamily: FONT.body,
    }}
    onMouseEnter={(e) => (e.currentTarget.style.color = C.coral)}
    onMouseLeave={(e) => (e.currentTarget.style.color = C.textFaint)}
  >
    <ArrowLeft size={15} /> {label}
  </button>
);

// ── Section heading (Barlow Condensed + coral accent underline) ───────────────
export const Heading = ({ title, sub }) => (
  <div style={{ marginBottom: "22px" }}>
    <h1
      style={{
        fontFamily: FONT.display,
        fontSize: "26px",
        fontWeight: 700,
        color: C.text,
        margin: 0,
        textTransform: "uppercase",
        letterSpacing: "0.01em",
      }}
    >
      {title}
    </h1>
    {sub && <p style={{ fontSize: "13px", color: C.textFaint, marginTop: "5px" }}>{sub}</p>}
    <div
      style={{
        width: "40px",
        height: "3px",
        backgroundColor: C.coral,
        borderRadius: "2px",
        marginTop: "8px",
      }}
    />
  </div>
);

// ── Pill badge ───────────────────────────────────────────────────────────────
export const Badge = ({ label, bg, color, border }) => (
  <span
    style={{
      fontSize: "11px",
      fontWeight: 700,
      padding: "3px 10px",
      borderRadius: RADII.pill,
      backgroundColor: bg,
      color,
      border: `1px solid ${border}`,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

// ── Dark page banner (Palaestra section-banner motif) ─────────────────────────
export const PageBanner = ({ title, sub }) => (
  <div className="banner" style={{ borderRadius: RADII.card, marginBottom: "22px" }}>
    <div className="banner-inner" style={{ padding: "22px 26px" }}>
      <div className="eyebrow">Palaestra</div>
      <h1>{title}</h1>
      {sub && <div className="sub">{sub}</div>}
    </div>
  </div>
);
