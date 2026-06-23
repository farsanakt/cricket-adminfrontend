import { useState, useRef } from "react";
import {
  ChevronRight, ChevronLeft, ArrowLeft, Users, Calendar,
  Activity, AlertCircle, Edit2, BarChart2, Plus, Trash2,
  Clock, Dumbbell, FileText, Eye, Check, X, Save,
  TrendingUp, Target, Zap, CheckCircle2,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const card = (x = {}) => ({
  backgroundColor: "#fff", borderRadius: "10px",
  border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...x,
});
const Heading = ({ title, sub }) => (
  <div style={{ marginBottom: "22px" }}>
    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#222", margin: 0 }}>{title}</h1>
    {sub && <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>{sub}</p>}
    <div style={{ width: "32px", height: "3px", backgroundColor: "#2f9be0", borderRadius: "2px", marginTop: "6px" }} />
  </div>
);
const BackBtn = ({ label, onClick }) => (
  <button onClick={onClick}
    style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#888", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginBottom: "18px", padding: "0" }}
    onMouseEnter={e => (e.currentTarget.style.color = "#2f9be0")}
    onMouseLeave={e => (e.currentTarget.style.color = "#888")}
  ><ArrowLeft size={15} /> {label}</button>
);
const OBtn = ({ children, onClick, style = {}, disabled = false }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "9px 20px", backgroundColor: disabled ? "#e0e0e0" : "#2f9be0", color: disabled ? "#aaa" : "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: disabled ? "not-allowed" : "pointer", boxShadow: disabled ? "none" : "0 2px 8px rgba(47, 155, 224,0.28)", ...style }}
    onMouseEnter={e => { if (!disabled) e.currentTarget.style.backgroundColor = "#2380c2"; }}
    onMouseLeave={e => { if (!disabled) e.currentTarget.style.backgroundColor = disabled ? "#e0e0e0" : "#2f9be0"; }}
  >{children}</button>
);
const inputStyle = { width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0", borderRadius: "7px", fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const InputF = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", display: "block", marginBottom: "4px", letterSpacing: "0.4px", textTransform: "uppercase" }}>{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle}
      onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_PLAYERS = [
  { id: 1, name: "Rahul Das",     role: "Bowler",        status: "Injured", avatar: "RD" },
  { id: 2, name: "Arjun Menon",  role: "Batsman",        status: "Active",  avatar: "AM" },
  { id: 3, name: "Vivek Pillai", role: "All-rounder",    status: "Active",  avatar: "VP" },
  { id: 4, name: "Nikhil K",     role: "Wicket-keeper",  status: "Active",  avatar: "NK" },
];

const SESSION_TYPES = ["Strength", "Conditioning", "Bowling", "Batting", "Fielding", "Net Practice", "Recovery", "Fitness Test", "Match", "Other"];
const DAYS_LABELS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const ROW_LABELS    = ["Strength","Conditioning","Cricket/Other","Location","Recovery/treatment","Practitioner","Fixtures"];
const buildGrid     = () => { const g = {}; for (let w = 1; w <= 7; w++) { g[w] = {}; DAYS_LABELS.forEach((_, i) => { g[w][i] = {}; ROW_LABELS.forEach(r => { g[w][i][r] = ""; }); }); } return g; };
const WEEK_DATES    = { 1:["6 May","7 May","8 May","9 May","10 May","11 May","12 May"], 2:["13 May","14 May","15 May","16 May","17 May","18 May","19 May"], 3:["20 May","21 May","22 May","23 May","24 May","25 May","26 May"], 4:["27 May","28 May","29 May","30 May","31 May","1 Jun","2 Jun"], 5:["3 Jun","4 Jun","5 Jun","6 Jun","7 Jun","8 Jun","9 Jun"], 6:["10 Jun","11 Jun","12 Jun","13 Jun","14 Jun","15 Jun","16 Jun"], 7:["17 Jun","18 Jun","19 Jun","20 Jun","21 Jun","22 Jun","23 Jun"] };

// Workload mock data — 16 days
const WORKLOAD_DAYS = [
  { date:"Nov 22", training:0,   competition:840, acuteLoad:210, chronicLoad:180, freshness:-30,  acwr:1.17, sessions:2 },
  { date:"Nov 23", training:92,  competition:0,   acuteLoad:280, chronicLoad:200, freshness:-80,  acwr:1.40, sessions:1 },
  { date:"Nov 24", training:34,  competition:0,   acuteLoad:270, chronicLoad:210, freshness:-60,  acwr:1.29, sessions:1 },
  { date:"Nov 25", training:0,   competition:630, acuteLoad:320, chronicLoad:220, freshness:-100, acwr:1.45, sessions:2 },
  { date:"Nov 26", training:119, competition:0,   acuteLoad:300, chronicLoad:225, freshness:-75,  acwr:1.33, sessions:1 },
  { date:"Nov 27", training:177, competition:0,   acuteLoad:280, chronicLoad:230, freshness:-50,  acwr:1.22, sessions:1 },
  { date:"Nov 28", training:142, competition:0,   acuteLoad:265, chronicLoad:232, freshness:-33,  acwr:1.14, sessions:1 },
  { date:"Nov 29", training:0,   competition:0,   acuteLoad:250, chronicLoad:233, freshness:-17,  acwr:1.07, sessions:0 },
  { date:"Nov 30", training:0,   competition:0,   acuteLoad:235, chronicLoad:233, freshness:0,    acwr:1.01, sessions:0 },
  { date:"Dec 01", training:59,  competition:0,   acuteLoad:220, chronicLoad:232, freshness:12,   acwr:0.95, sessions:1 },
  { date:"Dec 02", training:47,  competition:0,   acuteLoad:200, chronicLoad:230, freshness:30,   acwr:0.87, sessions:1 },
  { date:"Dec 03", training:0,   competition:0,   acuteLoad:185, chronicLoad:227, freshness:42,   acwr:0.81, sessions:0 },
  { date:"Dec 04", training:38,  competition:0,   acuteLoad:175, chronicLoad:224, freshness:49,   acwr:0.78, sessions:1 },
  { date:"Dec 05", training:29,  competition:0,   acuteLoad:168, chronicLoad:220, freshness:52,   acwr:0.76, sessions:1 },
  { date:"Dec 06", training:22,  competition:0,   acuteLoad:162, chronicLoad:216, freshness:54,   acwr:0.75, sessions:1 },
  { date:"Dec 07", training:18,  competition:0,   acuteLoad:158, chronicLoad:212, freshness:54,   acwr:0.74, sessions:1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// WORKLOAD CHART
// ─────────────────────────────────────────────────────────────────────────────
function WorkloadChart({ data }) {
  const W = 640, H = 280, PL = 55, PR = 45, PT = 30, PB = 45;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;
  const n = data.length;
  const barW = (chartW / n) * 0.6;

  const maxLoad = Math.max(...data.map(d => d.training + d.competition), 900);
  const minFresh = Math.min(...data.map(d => d.freshness), -300);
  const maxFresh = 100;
  const totalRange = maxLoad - minFresh;

  const toY = (v) => PT + chartH - ((v - minFresh) / totalRange) * chartH;
  const toX = (i) => PL + (i + 0.5) * (chartW / n);

  // ACWR right axis (0–4)
  const acwrMax = 4;
  const toYAcwr = (v) => PT + chartH * (1 - v / acwrMax);

  // Acute load area path
  const acutePath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)},${toY(d.acuteLoad)}`).join(" ");
  const acuteArea = acutePath + ` L ${toX(n-1)},${toY(0)} L ${toX(0)},${toY(0)} Z`;

  // Chronic load area path
  const chronicPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)},${toY(d.chronicLoad)}`).join(" ");
  const chronicArea = chronicPath + ` L ${toX(n-1)},${toY(0)} L ${toX(0)},${toY(0)} Z`;

  // Freshness area
  const freshPath = data.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)},${toY(d.freshness)}`).join(" ");
  const freshArea = freshPath + ` L ${toX(n-1)},${toY(0)} L ${toX(0)},${toY(0)} Z`;

  // ACWR line
  const acwrLine = data.map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i)},${toYAcwr(d.acwr)}`).join(" ");

  // Grid lines (load)
  const gridVals = [0, 300, 600, 900];
  const zero_y = toY(0);

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={W} height={H} style={{ display: "block", minWidth: W }}>
        {/* Background */}
        <rect x={PL} y={PT} width={chartW} height={chartH} fill="#fafafa" />

        {/* Grid lines */}
        {gridVals.map(v => (
          <g key={v}>
            <line x1={PL} x2={PL + chartW} y1={toY(v)} y2={toY(v)} stroke="#e8e8e8" strokeWidth="1" strokeDasharray="3 3" />
            <text x={PL - 6} y={toY(v) + 4} textAnchor="end" fontSize="10" fill="#aaa">{v}</text>
          </g>
        ))}
        <text x={PL - 35} y={PT + chartH / 2} fontSize="10" fill="#888" transform={`rotate(-90, ${PL - 35}, ${PT + chartH / 2})`}>Load</text>

        {/* ACWR right axis */}
        {[0,1,2,3,4].map(v => (
          <g key={`acwr${v}`}>
            <text x={W - PR + 6} y={toYAcwr(v) + 4} fontSize="10" fill="#aaa">{v}</text>
          </g>
        ))}

        {/* Zero line */}
        <line x1={PL} x2={PL + chartW} y1={zero_y} y2={zero_y} stroke="#ccc" strokeWidth="1" />

        {/* Freshness area (yellow) */}
        <path d={freshArea} fill="rgba(255,200,0,0.55)" />

        {/* Chronic load area (green) */}
        <path d={chronicArea} fill="rgba(100,200,160,0.35)" />

        {/* Acute load area (pink/salmon) */}
        <path d={acuteArea} fill="rgba(240,140,120,0.45)" />

        {/* Competition bars (orange) */}
        {data.map((d, i) => d.competition > 0 && (
          <rect key={`comp${i}`}
            x={toX(i) - barW / 2} y={toY(d.competition)}
            width={barW} height={zero_y - toY(d.competition)}
            fill="#2f9be0" rx="2" opacity="0.9" />
        ))}

        {/* Training bars (lighter orange) */}
        {data.map((d, i) => d.training > 0 && (
          <rect key={`train${i}`}
            x={toX(i) - barW / 2} y={toY(d.training)}
            width={barW} height={zero_y - toY(d.training)}
            fill="#2380c2" rx="2" opacity="0.75" />
        ))}

        {/* Bar labels */}
        {data.map((d, i) => {
          const val = d.competition || d.training;
          if (val < 30) return null;
          return (
            <text key={`lbl${i}`} x={toX(i)} y={toY(val) - 4}
              textAnchor="middle" fontSize="9" fontWeight="700" fill="#555">
              {val}
            </text>
          );
        })}

        {/* ACWR line (black) */}
        <path d={acwrLine} fill="none" stroke="#1a1a1a" strokeWidth="2" />

        {/* ACWR zone 0.8–1.3 band */}
        <rect x={PL} y={toYAcwr(1.3)} width={chartW} height={toYAcwr(0.8) - toYAcwr(1.3)} fill="rgba(100,200,100,0.08)" />

        {/* ACWR value labels */}
        {data.filter((_, i) => i % 3 === 0 || i === data.length - 1).map((d, _, arr) => {
          const i = data.indexOf(d);
          if (Math.abs(d.acwr - 1) < 0.05) return null;
          return (
            <text key={`acwrl${i}`} x={toX(i)} y={toYAcwr(d.acwr) - 5}
              textAnchor="middle" fontSize="9" fontWeight="700" fill="#333">
              {d.acwr.toFixed(2)}
            </text>
          );
        })}

        {/* X axis labels */}
        {data.map((d, i) => (
          i % 2 === 0 && (
            <text key={`xl${i}`} x={toX(i)} y={H - 5}
              textAnchor="middle" fontSize="9" fill="#888"
              transform={`rotate(-35, ${toX(i)}, ${H - 5})`}
            >{d.date}</text>
          )
        ))}

        {/* Axes border */}
        <rect x={PL} y={PT} width={chartW} height={chartH} fill="none" stroke="#ddd" strokeWidth="1" />
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "10px", paddingLeft: "8px" }}>
        {[
          { color: "#2f9be0", label: "Competition", solid: true },
          { color: "#2380c2", label: "Training",    solid: true },
          { color: "rgba(240,140,120,0.6)", label: "Acute Load",   solid: false },
          { color: "rgba(100,200,160,0.5)", label: "Chronic Load", solid: false },
          { color: "rgba(255,200,0,0.7)",   label: "Freshness",    solid: false },
          { color: "#1a1a1a", label: "ACWR",        line: true },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {l.line
              ? <div style={{ width: "18px", height: "2px", backgroundColor: l.color }} />
              : <div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: l.color }} />
            }
            <span style={{ fontSize: "11px", color: "#666" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DONUT CHART
// ─────────────────────────────────────────────────────────────────────────────
function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div style={{ padding: "24px", textAlign: "center", color: "#aaa", fontSize: "13px" }}>No data</div>;

  const cx = 90, cy = 90, r = 60, inner = 38;
  let angle = -90;
  const slices = data.map(d => {
    const pct   = d.value / total;
    const sweep = pct * 360;
    const a1 = (angle * Math.PI) / 180;
    const a2 = ((angle + sweep) * Math.PI) / 180;
    const laf = sweep > 180 ? 1 : 0;
    const x1  = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2  = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const ix1 = cx + inner * Math.cos(a1), iy1 = cy + inner * Math.sin(a1);
    const ix2 = cx + inner * Math.cos(a2), iy2 = cy + inner * Math.sin(a2);
    const midA = ((angle + sweep / 2) * Math.PI) / 180;
    const lx = cx + (r + 16) * Math.cos(midA), ly = cy + (r + 16) * Math.sin(midA);
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${laf} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${laf} 0 ${ix1} ${iy1} Z`;
    angle += sweep;
    return { ...d, path, pct, lx, ly, sweep };
  });

  return (
    <div>
      <svg width="180" height="180" style={{ display: "block", margin: "0 auto" }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2" />)}
        <text x={cx} y={cy - 6}  textAnchor="middle" fontSize="11" fontWeight="700" fill="#333">{total}</text>
        <text x={cx} y={cy + 8}  textAnchor="middle" fontSize="9"  fill="#888">sessions</text>
        {slices.map((s, i) => s.sweep > 15 && (
          <text key={`l${i}`} x={s.lx} y={s.ly} textAnchor="middle" fontSize="9" fontWeight="700" fill={s.color}>
            {Math.round(s.pct * 100)}%
          </text>
        ))}
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "8px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: d.color }} />
            <span style={{ fontSize: "11px", color: "#666" }}>{d.label} ({d.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLANNED VS REPORTED CHART
// ─────────────────────────────────────────────────────────────────────────────
function PlannedVsReported({ sessions }) {
  const W = 500, H = 200, PL = 45, PR = 20, PT = 20, PB = 40;
  const chartW = W - PL - PR, chartH = H - PT - PB;
  const maxVal = 1000;
  const n = Math.min(sessions.length, 10);
  const recent = sessions.slice(-n);

  const toY = v => PT + chartH * (1 - v / maxVal);
  const toX = i => PL + (i + 0.5) * (chartW / n);
  const barW = (chartW / n) * 0.28;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width={W} height={H} style={{ display: "block", minWidth: W }}>
        <rect x={PL} y={PT} width={chartW} height={chartH} fill="#fafafa" />
        {[0, 300, 600, 900].map(v => (
          <g key={v}>
            <line x1={PL} x2={PL + chartW} y1={toY(v)} y2={toY(v)} stroke="#e8e8e8" strokeWidth="1" strokeDasharray="3 3" />
            <text x={PL - 4} y={toY(v) + 4} textAnchor="end" fontSize="9" fill="#aaa">{v}</text>
          </g>
        ))}
        {recent.map((s, i) => {
          const planned  = s.plannedLoad  || 0;
          const reported = s.reportedLoad || 0;
          return (
            <g key={i}>
              {/* Planned bar (blue) */}
              <rect x={toX(i) - barW - 1} y={toY(planned)} width={barW} height={Math.max(toY(0) - toY(planned), 2)} fill="#3b82f6" rx="2" opacity="0.7" />
              {/* Reported bar (orange) */}
              <rect x={toX(i) + 1}        y={toY(reported)} width={barW} height={Math.max(toY(0) - toY(reported), 2)} fill="#2f9be0" rx="2" opacity="0.8" />
              {/* Labels */}
              {planned  > 50 && <text x={toX(i) - barW/2 - 1} y={toY(planned)  - 3} textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="700">{planned}</text>}
              {reported > 50 && <text x={toX(i) + barW/2 + 1} y={toY(reported) - 3} textAnchor="middle" fontSize="8" fill="#2f9be0" fontWeight="700">{reported}</text>}
              <text x={toX(i)} y={H - 8} textAnchor="middle" fontSize="8" fill="#888" transform={`rotate(-30, ${toX(i)}, ${H - 8})`}>{s.name?.substring(0,8) || `S${i+1}`}</text>
            </g>
          );
        })}
        <rect x={PL} y={PT} width={chartW} height={chartH} fill="none" stroke="#ddd" strokeWidth="1" />
      </svg>
      <div style={{ display: "flex", gap: "14px", marginTop: "6px", paddingLeft: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}><div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#3b82f6", opacity: 0.7 }} /><span style={{ fontSize: "11px", color: "#666" }}>Planned</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}><div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: "#2f9be0", opacity: 0.8 }} /><span style={{ fontSize: "11px", color: "#666" }}>Reported</span></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXERCISE FORM ROW (inside a session)
// ─────────────────────────────────────────────────────────────────────────────
function ExerciseRow({ ex, idx, onChange, onRemove }) {
  const s = { width: "100%", padding: "7px 10px", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontSize: "12px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box" };
  const upd = (k, v) => onChange(idx, k, v);

  return (
    <div style={{ border: "1px solid #e8e8e8", borderRadius: "9px", overflow: "hidden", marginBottom: "10px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 14px", backgroundColor: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#2f9be0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "#fff", flexShrink: 0 }}>{idx + 1}</div>
        <input value={ex.name} onChange={e => upd("name", e.target.value)} placeholder="Exercise name…"
          style={{ flex: 1, ...s, border: "none", backgroundColor: "transparent", fontSize: "13px", fontWeight: "700", padding: "2px 0" }}
          onFocus={e => (e.target.style.borderBottom = "1.5px solid #2f9be0")}
          onBlur={e => (e.target.style.borderBottom = "none")} />
        <button onClick={() => onRemove(idx)} style={{ background: "none", border: "none", cursor: "pointer", padding: "3px", color: "#cc3333", display: "flex", borderRadius: "5px" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fff0f0")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        ><Trash2 size={14} /></button>
      </div>

      {/* Fields grid */}
      <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
        {[
          { label: "SETS",       key: "sets",       placeholder: "e.g. 3"      },
          { label: "REPS / TIME",key: "reps",       placeholder: "e.g. 10 reps"},
          { label: "REST",       key: "rest",       placeholder: "e.g. 60s"    },
          { label: "DURATION",   key: "duration",   placeholder: "e.g. 30 min" },
          { label: "EQUIPMENT",  key: "equipment",  placeholder: "e.g. Barbell"},
        ].map(f => (
          <div key={f.key}>
            <label style={{ fontSize: "9px", fontWeight: "700", color: "#aaa", display: "block", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.4px" }}>{f.label}</label>
            <input value={ex[f.key] || ""} onChange={e => upd(f.key, e.target.value)} placeholder={f.placeholder} style={s}
              onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
          </div>
        ))}
      </div>

      {/* Description + Load */}
      <div style={{ padding: "0 14px 12px", display: "grid", gridTemplateColumns: "1fr auto", gap: "10px", alignItems: "start" }}>
        <div>
          <label style={{ fontSize: "9px", fontWeight: "700", color: "#aaa", display: "block", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.4px" }}>DESCRIPTION / NOTES</label>
          <textarea value={ex.description || ""} onChange={e => upd("description", e.target.value)} placeholder="Technique cues, progressions, coaching notes…" rows={2}
            style={{ ...s, resize: "none", fontFamily: "inherit" }}
            onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
        </div>
        <div style={{ minWidth: "90px" }}>
          <label style={{ fontSize: "9px", fontWeight: "700", color: "#aaa", display: "block", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.4px" }}>LOAD (AU)</label>
          <input type="number" value={ex.load || ""} onChange={e => upd("load", e.target.value)} placeholder="e.g. 120" style={s}
            onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION CARD (create / edit)
// ─────────────────────────────────────────────────────────────────────────────
function SessionCard({ session, idx, onChange, onRemove, collapsed, onToggle }) {
  const upd = (k, v) => onChange(idx, k, v);

  const addExercise = () => {
    upd("exercises", [...(session.exercises || []), { name: "", sets: "", reps: "", rest: "", duration: "", equipment: "", description: "", load: "" }]);
  };

  const updateExercise = (ei, k, v) => {
    const exs = [...(session.exercises || [])];
    exs[ei] = { ...exs[ei], [k]: v };
    upd("exercises", exs);
  };

  const removeExercise = (ei) => {
    upd("exercises", (session.exercises || []).filter((_, i) => i !== ei));
  };

  const totalLoad = (session.exercises || []).reduce((s, e) => s + (Number(e.load) || 0), 0);

  return (
    <div style={{ border: `1.5px solid ${collapsed ? "#e8e8e8" : "#2f9be0"}`, borderRadius: "12px", overflow: "hidden", marginBottom: "14px", transition: "all 0.15s" }}>
      {/* Session header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", backgroundColor: collapsed ? "#fafafa" : "#e8f3fb", cursor: "pointer" }}
        onClick={onToggle}>
        <div style={{ width: "30px", height: "30px", borderRadius: "8px", backgroundColor: "#2f9be0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800", color: "#fff", flexShrink: 0 }}>
          {idx + 1}
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "10px", alignItems: "center" }}>
          <div>
            <label style={{ fontSize: "9px", fontWeight: "700", color: "#aaa", display: "block", marginBottom: "2px", textTransform: "uppercase" }}>SESSION NAME</label>
            <input value={session.name || ""} onChange={e => { e.stopPropagation(); upd("name", e.target.value); }}
              onClick={e => e.stopPropagation()} placeholder="e.g. Morning Strength"
              style={{ width: "100%", padding: "5px 8px", border: "1px solid #e0e0e0", borderRadius: "6px", fontSize: "13px", fontWeight: "700", color: "#222", backgroundColor: "#fff", outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
          </div>
          <div>
            <label style={{ fontSize: "9px", fontWeight: "700", color: "#aaa", display: "block", marginBottom: "2px", textTransform: "uppercase" }}>TYPE</label>
            <select value={session.type || ""} onChange={e => { e.stopPropagation(); upd("type", e.target.value); }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", padding: "5px 8px", border: "1px solid #e0e0e0", borderRadius: "6px", fontSize: "12px", color: "#555", backgroundColor: "#fff", outline: "none", cursor: "pointer" }}
              onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")}>
              <option value="">Select…</option>
              {SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: "9px", fontWeight: "700", color: "#aaa", display: "block", marginBottom: "2px", textTransform: "uppercase" }}>DATE</label>
            <input type="date" value={session.date || ""} onChange={e => { e.stopPropagation(); upd("date", e.target.value); }}
              onClick={e => e.stopPropagation()}
              style={{ width: "100%", padding: "5px 8px", border: "1px solid #e0e0e0", borderRadius: "6px", fontSize: "12px", color: "#555", backgroundColor: "#fff", outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", color: "#2f9be0", fontWeight: "700" }}>{session.exercises?.length || 0} ex</div>
              {totalLoad > 0 && <div style={{ fontSize: "10px", color: "#888" }}>{totalLoad} AU</div>}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); onRemove(idx); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#cc3333", display: "flex", borderRadius: "6px" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fff0f0")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          ><Trash2 size={15} /></button>
          {collapsed ? <ChevronRight size={16} style={{ color: "#aaa" }} /> : <ChevronDown_icon size={16} style={{ color: "#2f9be0" }} />}
        </div>
      </div>

      {/* Session body */}
      {!collapsed && (
        <div style={{ padding: "16px 18px", backgroundColor: "#fff", borderTop: "1px solid #f0f0f0" }}>
          {/* Description */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>SESSION DESCRIPTION / OBJECTIVES</label>
            <textarea value={session.description || ""} onChange={e => upd("description", e.target.value)} placeholder="Session objectives, warm-up notes, overall focus…" rows={2}
              style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #e0e0e0", borderRadius: "7px", fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", resize: "none", boxSizing: "border-box", fontFamily: "inherit" }}
              onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
          </div>

          {/* Planned / Reported Load */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
            {[
              { label: "PLANNED LOAD (AU)", key: "plannedLoad" },
              { label: "REPORTED LOAD (AU)",key: "reportedLoad" },
              { label: "DURATION (min)",   key: "durationMins" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", display: "block", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.4px" }}>{f.label}</label>
                <input type="number" value={session[f.key] || ""} onChange={e => upd(f.key, e.target.value)} placeholder="—"
                  style={{ width: "100%", padding: "7px 10px", border: "1.5px solid #e0e0e0", borderRadius: "6px", fontSize: "13px", fontWeight: "700", color: "#222", backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
              </div>
            ))}
          </div>

          {/* Exercises */}
          <div style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#333", display: "flex", alignItems: "center", gap: "6px" }}>
                <Dumbbell size={13} style={{ color: "#2f9be0" }} /> Exercises ({session.exercises?.length || 0})
              </div>
              <OBtn onClick={addExercise} style={{ padding: "6px 12px", fontSize: "11px" }}>
                <Plus size={12} /> Add Exercise
              </OBtn>
            </div>

            {(session.exercises || []).length === 0 ? (
              <div style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1.5px dashed #e0e0e0", textAlign: "center" }}>
                <Dumbbell size={20} style={{ color: "#ddd", margin: "0 auto 6px", display: "block" }} />
                <p style={{ fontSize: "12px", color: "#aaa", margin: 0 }}>No exercises yet — click "Add Exercise"</p>
              </div>
            ) : (
              (session.exercises || []).map((ex, ei) => (
                <ExerciseRow key={ei} ex={ex} idx={ei} onChange={updateExercise} onRemove={removeExercise} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Chevron down icon inline
const ChevronDown_icon = ({ size, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// WORKLOAD DASHBOARD (per player)
// ─────────────────────────────────────────────────────────────────────────────
function WorkloadDashboard({ player, sessions }) {
  const prev7 = WORKLOAD_DAYS.slice(-14, -7);
  const next7 = WORKLOAD_DAYS.slice(-7);

  const sum = (arr, key) => arr.reduce((s, d) => s + (d[key] || 0), 0);

  const stats = [
    { label: "Duration",     prev: "7:00",  next: "0:00",  change: "-100%", down: true },
    { label: "Load",         prev: "1.43 (835)", next: "—", change: "-100%", down: true, highlight: true },
    { label: "Acute Load",   prev: sum(prev7, "acuteLoad"),   next: sum(next7, "acuteLoad"),   change: "-100%", down: true },
    { label: "Chronic Load", prev: sum(prev7, "chronicLoad"), next: sum(next7, "chronicLoad"),  change: "-37%",  down: true },
    { label: "Freshness",    prev: -250, next: 368, change: "-247%", down: false },
    { label: "ACWR",         prev: "1.43",  next: "0",     change: "-100%", down: true },
  ];

  const donutData = [
    { label: "Competition", value: WORKLOAD_DAYS.filter(d => d.competition > 0).length, color: "#64c8f0" },
    { label: "Training",    value: WORKLOAD_DAYS.filter(d => d.training > 0).length,    color: "#2f9be0" },
  ];

  return (
    <div style={{ padding: "28px" }}>
      <Heading title="Workload" sub={`Training load monitoring for ${player.name}`} />

      {/* Workload chart */}
      <div style={card({ padding: "20px 22px", marginBottom: "20px" })}>
        <WorkloadChart data={WORKLOAD_DAYS} />
      </div>

      {/* Bottom row — Planned vs Reported + Donut + Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>

        {/* Planned vs Reported */}
        <div style={card({ padding: "20px 22px" })}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#333", marginBottom: "14px", display: "flex", alignItems: "center", gap: "7px" }}>
            <BarChart2 size={14} style={{ color: "#2f9be0" }} /> Planned vs Reported
          </div>
          {sessions.length > 0
            ? <PlannedVsReported sessions={sessions} />
            : <div style={{ padding: "32px", textAlign: "center", color: "#aaa", fontSize: "13px" }}>Add sessions to see chart</div>
          }
        </div>

        {/* Distribution donut */}
        <div style={card({ padding: "20px 22px" })}>
          <div style={{ fontSize: "13px", color: "#888", textAlign: "center", marginBottom: "4px" }}>Distribution of activities/sessions</div>
          <div style={{ fontSize: "12px", color: "#aaa", textAlign: "center", marginBottom: "14px" }}>Prev 7d</div>
          <DonutChart data={donutData} />
        </div>
      </div>

      {/* Stats table */}
      <div style={card({ overflow: "hidden" })}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9f9f9" }}>
              {["Metric","Prev 7d","Next 7d","% change"].map(h => (
                <th key={h} style={{ padding: "11px 16px", fontSize: "12px", fontWeight: "700", color: "#555", textAlign: h === "Metric" ? "left" : "center", borderBottom: "1px solid #e8e8e8" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr key={s.label} style={{ backgroundColor: s.highlight ? "#fff8e1" : i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "10px 16px", fontSize: "13px", color: "#333", borderBottom: "1px solid #f5f5f5", fontWeight: s.highlight ? "700" : "500" }}>{s.label}</td>
                <td style={{ padding: "10px 16px", fontSize: "13px", color: "#333", borderBottom: "1px solid #f5f5f5", textAlign: "center", fontWeight: s.highlight ? "700" : "400" }}>{s.prev}</td>
                <td style={{ padding: "10px 16px", fontSize: "13px", color: "#333", borderBottom: "1px solid #f5f5f5", textAlign: "center" }}>{s.next}</td>
                <td style={{ padding: "10px 16px", fontSize: "12px", borderBottom: "1px solid #f5f5f5", textAlign: "center" }}>
                  <span style={{ fontWeight: "700", color: s.down ? "#cc3333" : "#2e7d32" }}>
                    {s.change} {s.down ? "↓" : "↑"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSIONS VIEW (create / manage sessions for a player)
// ─────────────────────────────────────────────────────────────────────────────
function SessionsView({ player, sessions, setSessions }) {
  const [collapsed, setCollapsed] = useState({});

  const addSession = () => {
    const ns = { id: `s_${Date.now()}`, name: "", type: "", date: "", description: "", plannedLoad: "", reportedLoad: "", durationMins: "", exercises: [] };
    setSessions(prev => [...prev, ns]);
    setCollapsed(prev => ({ ...prev, [sessions.length]: false }));
  };

  const updateSession = (idx, k, v) => {
    setSessions(prev => { const a = [...prev]; a[idx] = { ...a[idx], [k]: v }; return a; });
  };

  const removeSession = (idx) => {
    setSessions(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleCollapse = (idx) => {
    setCollapsed(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const totalSessions   = sessions.length;
  const completedSessions = sessions.filter(s => s.reportedLoad > 0).length;
  const totalLoad       = sessions.reduce((s, se) => s + (Number(se.plannedLoad) || 0), 0);

  return (
    <div style={{ padding: "28px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "22px", gap: "12px", flexWrap: "wrap" }}>
        <Heading title="Sessions" sub={`Plan and manage training sessions for ${player.name}`} />
        <OBtn onClick={addSession}><Plus size={14} /> Add Session</OBtn>
      </div>

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", marginBottom: "22px" }}>
        {[
          { label: "Total Sessions",   value: totalSessions,                 color: "#2f9be0", icon: Calendar },
          { label: "Completed",        value: completedSessions,             color: "#2e7d32", icon: CheckCircle2 },
          { label: "Total Planned Load",value: totalLoad > 0 ? totalLoad + " AU" : "—", color: "#3b82f6", icon: Zap },
        ].map(s => (
          <div key={s.label} style={card({ padding: "14px 18px", borderLeft: `4px solid ${s.color}` })}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "20px", fontWeight: "800", color: s.color }}>{s.value}</span>
              <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={15} style={{ color: s.color }} />
              </div>
            </div>
            <span style={{ fontSize: "12px", color: "#888", fontWeight: "500" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Sessions */}
      {sessions.length === 0 ? (
        <div style={card({ padding: "56px", textAlign: "center" })}>
          <Calendar size={40} style={{ color: "#ddd", margin: "0 auto 14px", display: "block" }} />
          <p style={{ fontSize: "16px", fontWeight: "700", color: "#555", margin: 0 }}>No sessions yet</p>
          <p style={{ fontSize: "13px", color: "#aaa", marginTop: "6px" }}>Create your first training session for {player.name}</p>
          <OBtn onClick={addSession} style={{ marginTop: "18px" }}><Plus size={14} /> Add First Session</OBtn>
        </div>
      ) : (
        sessions.map((session, idx) => (
          <SessionCard key={session.id || idx} session={session} idx={idx} onChange={updateSession} onRemove={removeSession} collapsed={collapsed[idx] !== false && idx !== sessions.length - 1} onToggle={() => toggleCollapse(idx)} />
        ))
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FITNESS OVERVIEW (grid)
// ─────────────────────────────────────────────────────────────────────────────
function FitnessOverview({ player }) {
  const [activeWeek, setActiveWeek] = useState(1);
  const [gridData,   setGridData]   = useState(buildGrid);
  const [editCell,   setEditCell]   = useState(null);
  const [editVal,    setEditVal]    = useState("");

  const saveCell = () => {
    if (!editCell) return;
    setGridData(prev => {
      const n = { ...prev };
      n[activeWeek] = { ...n[activeWeek] };
      n[activeWeek][editCell.day] = { ...n[activeWeek][editCell.day], [editCell.row]: editVal };
      return n;
    });
    setEditCell(null); setEditVal("");
  };

  return (
    <div style={{ padding: "28px" }}>
      <div style={{ background: "linear-gradient(135deg,#1a2340,#2d3a5c)", borderRadius: "12px", padding: "24px 28px", marginBottom: "22px" }}>
        <div style={{ fontSize: "22px", fontWeight: "800", color: "#fff", marginBottom: "12px" }}>Fitness Overview</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setActiveWeek(w => Math.max(1, w - 1))} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", opacity: activeWeek === 1 ? 0.3 : 1 }}><ChevronLeft size={22} /></button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>Week {activeWeek}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>{WEEK_DATES[activeWeek]?.[0]} – {WEEK_DATES[activeWeek]?.[6]}</div>
          </div>
          <button onClick={() => setActiveWeek(w => Math.min(7, w + 1))} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", opacity: activeWeek === 7 ? 0.3 : 1 }}><ChevronRight size={22} /></button>
        </div>
      </div>

      <div style={card({ overflow: "auto" })}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "700px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f9f9f9" }}>
              <th style={{ padding: "12px 14px", fontSize: "12px", fontWeight: "700", color: "#888", textAlign: "left", borderBottom: "1px solid #e8e8e8", width: "120px" }} />
              {DAYS_LABELS.map((day, di) => (
                <th key={day} style={{ padding: "10px 12px", fontSize: "11px", fontWeight: "700", color: "#555", textAlign: "center", borderBottom: "1px solid #e8e8e8", borderLeft: "1px solid #f0f0f0", minWidth: "90px" }}>
                  <div>{WEEK_DATES[activeWeek]?.[di] || ""}</div>
                  <div style={{ color: "#aaa", fontWeight: "500", marginTop: "1px" }}>{day}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROW_LABELS.map((row, ri) => (
              <tr key={row} style={{ backgroundColor: ri % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 14px", fontSize: "12px", fontWeight: "600", color: "#555", borderBottom: "1px solid #f5f5f5", borderRight: "1px solid #f0f0f0", verticalAlign: "top", lineHeight: "1.4" }}>{row}</td>
                {DAYS_LABELS.map((_, di) => {
                  const cellVal = gridData[activeWeek]?.[di]?.[row] || "";
                  const isEditing = editCell?.day === di && editCell?.row === row;
                  return (
                    <td key={di} style={{ padding: "10px 12px", fontSize: "12px", color: "#333", borderBottom: "1px solid #f5f5f5", borderLeft: "1px solid #f0f0f0", verticalAlign: "top", cursor: "pointer", backgroundColor: isEditing ? "#fffaf5" : "transparent", minHeight: "48px" }}
                      onClick={() => { if (!isEditing) { setEditCell({ day: di, row }); setEditVal(cellVal); } }}
                    >
                      {isEditing ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <textarea autoFocus value={editVal} onChange={e => setEditVal(e.target.value)} onClick={e => e.stopPropagation()} rows={3}
                            style={{ width: "100%", padding: "6px 8px", border: "1.5px solid #2f9be0", borderRadius: "6px", fontSize: "12px", outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                          <div style={{ display: "flex", gap: "4px" }}>
                            <button onClick={e => { e.stopPropagation(); saveCell(); }} style={{ flex: 1, padding: "4px", backgroundColor: "#2f9be0", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px", fontWeight: "700" }}>Save</button>
                            <button onClick={e => { e.stopPropagation(); setEditCell(null); setEditVal(""); }} style={{ flex: 1, padding: "4px", backgroundColor: "#f0f0f0", color: "#555", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "4px", minHeight: "24px" }}>
                          <span style={{ lineHeight: "1.4", color: cellVal ? "#333" : "#ccc" }}>{cellVal || "–"}</span>
                          {cellVal && <Edit2 size={11} style={{ color: "#ccc", flexShrink: 0, marginTop: "2px" }} />}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: "10px", fontSize: "12px", color: "#aaa", textAlign: "right" }}>Click any cell to edit</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIEWS
// ─────────────────────────────────────────────────────────────────────────────
const V = { HOME: "home", PLAYER: "player" };

// ─────────────────────────────────────────────────────────────────────────────
// MAIN TRAINER DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
export default function TrainerDashboard() {
  const [players,      setPlayers]      = useState(INITIAL_PLAYERS);
  const [view,         setView]         = useState(V.HOME);
  const [activePlayer, setActivePlayer] = useState(null);
  const [activeTab,    setActiveTab]    = useState("workload");
  // Per-player sessions stored by player id
  const [allSessions,  setAllSessions]  = useState({});

  const getSessions    = (pid) => allSessions[pid] || [];
  const setSessions    = (pid, fn) => setAllSessions(prev => ({ ...prev, [pid]: typeof fn === "function" ? fn(prev[pid] || []) : fn }));

  const TABS = [
    { key: "workload",  label: "Workload",        icon: TrendingUp },
    { key: "sessions",  label: "Sessions",        icon: Dumbbell   },
    { key: "fitness",   label: "Fitness Overview", icon: BarChart2  },
  ];

  // ── HOME ──
  if (view === V.HOME) return (
    <div style={{ padding: "28px", maxWidth: "1100px", margin: "0 auto" }}>
      <Heading title="Trainer Dashboard" sub="Monitor player workload, sessions and fitness" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Total Players",   value: players.length,                                     icon: Users,    color: "#2f9be0" },
          { label: "Active Players",  value: players.filter(p => p.status === "Active").length,   icon: Activity, color: "#2e7d32" },
          { label: "Injured",         value: players.filter(p => p.status === "Injured").length,  icon: AlertCircle, color: "#cc3333" },
          { label: "Total Sessions",  value: Object.values(allSessions).flat().length,            icon: Calendar, color: "#3b82f6" },
        ].map(s => (
          <div key={s.label} style={card({ padding: "16px 20px", borderLeft: `4px solid ${s.color}` })}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "22px", fontWeight: "800", color: s.color }}>{s.value}</span>
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", backgroundColor: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
            <span style={{ fontSize: "12px", color: "#888", fontWeight: "500" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={card({ overflow: "hidden" })}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={15} style={{ color: "#2f9be0" }} />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#333" }}>Players</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
          {players.map((p, i) => {
            const sessCount = getSessions(p.id).length;
            return (
              <div key={p.id} onClick={() => { setActivePlayer(p); setActiveTab("workload"); setView(V.PLAYER); }}
                style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 22px", cursor: "pointer", borderRight: i % 2 === 0 ? "1px solid #f5f5f5" : "none", borderBottom: i < players.length - 2 ? "1px solid #f5f5f5" : "none", transition: "background 0.12s" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fdf8f4")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: p.status === "Injured" ? "#fff0f0" : "#e8f3fb", border: `2px solid ${p.status === "Injured" ? "#ffc5c5" : "#cfe6f7"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: "800", color: p.status === "Injured" ? "#cc3333" : "#2f9be0", flexShrink: 0 }}>{p.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#222" }}>{p.name}</span>
                    {p.status === "Injured" && <span style={{ fontSize: "10px", fontWeight: "700", color: "#cc3333", backgroundColor: "#fff0f0", border: "1px solid #ffc5c5", borderRadius: "20px", padding: "2px 7px" }}>Injured</span>}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "1px" }}>{p.role} · {sessCount} session{sessCount !== 1 ? "s" : ""}</div>
                </div>
                <ChevronRight size={15} style={{ color: "#ccc" }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── PLAYER HUB ──
  if (view === V.PLAYER && activePlayer) {
    const sessions    = getSessions(activePlayer.id);
    const setMySession = (fn) => setSessions(activePlayer.id, fn);

    return (
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg,#1a2340 0%,#2d3a5c 100%)", padding: "28px 28px 0", borderBottom: "1px solid #e8e8e8" }}>
          <button onClick={() => setView(V.HOME)}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginBottom: "16px", padding: "0" }}>
            <ArrowLeft size={15} /> All Players
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: activePlayer.status === "Injured" ? "#cc3333" : "#2f9be0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "800", color: "#fff" }}>
              {activePlayer.avatar}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#fff", margin: 0 }}>{activePlayer.name}</h2>
                <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", backgroundColor: activePlayer.status === "Injured" ? "#cc3333" : "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>{activePlayer.status}</span>
              </div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", marginTop: "3px" }}>{activePlayer.role} · {sessions.length} session{sessions.length !== 1 ? "s" : ""}</div>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                style={{ display: "flex", alignItems: "center", gap: "7px", padding: "12px 20px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "700", backgroundColor: "transparent", color: activeTab === tab.key ? "#fff" : "rgba(255,255,255,0.5)", borderBottom: activeTab === tab.key ? "3px solid #2f9be0" : "3px solid transparent", transition: "all 0.15s" }}>
                <tab.icon size={15} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "workload" && <WorkloadDashboard player={activePlayer} sessions={sessions} />}
        {activeTab === "sessions" && <SessionsView player={activePlayer} sessions={sessions} setSessions={setMySession} />}
        {activeTab === "fitness"  && <FitnessOverview player={activePlayer} />}
      </div>
    );
  }

  return null;
}