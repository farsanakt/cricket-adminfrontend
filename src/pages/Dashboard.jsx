import { useState, useMemo } from "react";
import {
  Users, Activity, AlertTriangle,
  CheckCircle2, Award, ChevronRight,
  Filter, Search, Calendar, Target, Clock,
  BarChart2, ChevronDown, ChevronUp, Eye,
} from "lucide-react";
import { PageBanner } from "../theme";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const PLAYERS = [
  { id: 1,  name: "Arjun Menon",      age: 23, gender: "Male",   category: "Senior",   role: "Batsman",        team: "Kerala CA",    status: "Available",  injury: null,           form: 87, matches: 34 },
  { id: 2,  name: "Rahul Das",        age: 25, gender: "Male",   category: "Senior",   role: "Bowler",         team: "Kerala CA",    status: "Injured",    injury: "Shoulder Strain", form: 0,  matches: 28 },
  { id: 3,  name: "Vivek Pillai",     age: 22, gender: "Male",   category: "Under-23", role: "All-rounder",    team: "Kerala CA",    status: "Available",  injury: null,           form: 76, matches: 19 },
  { id: 4,  name: "Nikhil Krishnan",  age: 24, gender: "Male",   category: "Senior",   role: "Wicket-keeper",  team: "Kerala CA",    status: "Available",  injury: null,           form: 81, matches: 22 },
  { id: 5,  name: "Rohit Sharma Jr.", age: 26, gender: "Male",   category: "Senior",   role: "Batsman",        team: "Mumbai Strikers", status: "Available", injury: null,          form: 92, matches: 45 },
  { id: 6,  name: "Aditya Kulkarni",  age: 21, gender: "Male",   category: "Under-23", role: "Bowler",         team: "Mumbai Strikers", status: "Resting",   injury: null,          form: 68, matches: 12 },
  { id: 7,  name: "Kartik Verma",     age: 17, gender: "Male",   category: "Under-19", role: "All-rounder",    team: "Delhi Dynamos", status: "Available", injury: null,           form: 74, matches: 8  },
  { id: 8,  name: "Aryan Singh",      age: 15, gender: "Male",   category: "Under-16", role: "Batsman",        team: "Delhi Dynamos", status: "Available", injury: null,           form: 71, matches: 5  },
  { id: 9,  name: "Sneha Krishnan",   age: 22, gender: "Female", category: "Senior",   role: "Batsman",        team: "Kerala Women", status: "Available",  injury: null,           form: 85, matches: 18 },
  { id: 10, name: "Priya Menon",      age: 19, gender: "Female", category: "Under-23", role: "Bowler",         team: "Kerala Women", status: "Available",  injury: null,           form: 79, matches: 11 },
  { id: 11, name: "Divya Nair",       age: 16, gender: "Female", category: "Under-19", role: "All-rounder",    team: "Kerala Women", status: "Available",  injury: null,           form: 66, matches: 6  },
  { id: 12, name: "Rohan Patel",      age: 12, gender: "Male",   category: "Under-14", role: "Batsman",        team: "Junior Academy", status: "Available", injury: null,          form: 60, matches: 3  },
  { id: 13, name: "Mia Thomas",       age: 11, gender: "Female", category: "Under-14", role: "Bowler",         team: "Junior Academy", status: "Available", injury: null,          form: 58, matches: 2  },
  { id: 14, name: "Dev Kumar",        age: 9,  gender: "Male",   category: "Under-10", role: "Batsman",        team: "Junior Academy", status: "Available", injury: null,          form: 55, matches: 1  },
];

const RECENT_ACTIVITY = [
  { name: "Rahul Das",       action: "Injury reported — Shoulder Strain",    time: "2 hrs ago",  status: "injured"   },
  { name: "Arjun Menon",     action: "Daily progress report submitted",       time: "3 hrs ago",  status: "active"    },
  { name: "Sneha Krishnan",  action: "Clearance request submitted",           time: "5 hrs ago",  status: "pending"   },
  { name: "Rohit Sharma Jr.", action: "Net practice session logged",          time: "6 hrs ago",  status: "completed" },
  { name: "Vivek Pillai",    action: "Fitness assessment completed",          time: "8 hrs ago",  status: "completed" },
  { name: "Priya Menon",     action: "Nutrition plan assigned",               time: "1 day ago",  status: "active"    },
  { name: "Kartik Verma",    action: "Under-19 trials registered",            time: "1 day ago",  status: "pending"   },
];

const UPCOMING_EVENTS = [
  { date: "May 08", event: "Under-19 State Trials",   team: "Under-19",   type: "Trial"   },
  { date: "May 10", event: "Senior Squad Net Practice", team: "Kerala CA", type: "Practice" },
  { date: "May 12", event: "Kerala vs Mumbai (T20)",   team: "Senior",     type: "Match"   },
  { date: "May 15", event: "Junior Academy Assessment", team: "U-14 / U-10", type: "Assessment" },
  { date: "May 18", event: "Women's T20 Warm-up",      team: "Kerala Women", type: "Match"  },
];

const ALL_CATEGORIES = ["All", "Senior", "Under-23", "Under-19", "Under-16", "Under-14"];
const CATEGORIES = ["Senior", "Under-23", "Under-19", "Under-16", "Under-14", "Under-10"];
const GENDERS    = ["All", "Male", "Female"];
const STATUSES   = ["All", "Available", "Injured", "Resting"];
const TEAMS      = ["All", "Kerala CA", "Mumbai Strikers", "Delhi Dynamos", "Kerala Women", "Junior Academy"];

const STATUS_CFG = {
  Available: { bg: "#f0faf0", color: "#2e7d32", border: "#b8e6b8", dot: "#2e7d32" },
  Injured:   { bg: "#fff0f0", color: "#cc3333", border: "#ffc5c5", dot: "#cc3333" },
  Resting:   { bg: "#fff8e1", color: "#f9a825", border: "#ffe082", dot: "#f9a825" },
};

// Subtle, blue-theme-compatible colors per category (used for tile left border + badge)
const CAT_COLORS = {
  "Senior":    { bg: "#e8f3fb", color: "#2f9be0", border: "#cfe6f7" }, // Blue
  "Under-23":  { bg: "#e6f7fa", color: "#0e9bb5", border: "#bdecf4" }, // Cyan
  "Under-19":  { bg: "#f5f0ff", color: "#7c3aed", border: "#ddd6fe" }, // Purple
  "Under-16":  { bg: "#f0faf0", color: "#2e7d32", border: "#b8e6b8" }, // Green
  "Under-14":  { bg: "#fff4e8", color: "#e87722", border: "#ffd9b3" }, // Orange
  "Under-10":  { bg: "#fff1f2", color: "#e11d48", border: "#fecdd3" },
};

const EVENT_TYPE_COLORS = {
  Match:      { bg: "#fff0f0", color: "#cc3333", border: "#ffc5c5" },
  Practice:   { bg: "#e8f3fb", color: "#2f9be0", border: "#cfe6f7" },
  Trial:      { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" },
  Assessment: { bg: "#f0faf0", color: "#2e7d32", border: "#b8e6b8" },
};

// ─── SHARED ───────────────────────────────────────────────────────────────────
const card = (x = {}) => ({ backgroundColor: "#fff", borderRadius: "10px", border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...x });

function FormBar({ value }) {
  const pct = Math.max(value, 2);
  const col = value >= 80 ? "#2e7d32" : value >= 60 ? "#2f9be0" : "#cc3333";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ flex: 1, height: "6px", backgroundColor: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, backgroundColor: col, borderRadius: "4px", transition: "width 0.5s" }} />
      </div>
      <span style={{ fontSize: "11px", fontWeight: "700", color: col, minWidth: "24px" }}>{value > 0 ? value : "—"}</span>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, sub, onClick }) {
  return (
    <div onClick={onClick}
      style={{ ...card({ padding: "20px 22px", borderLeft: `4px solid ${color}`, cursor: onClick ? "pointer" : "default", transition: "all 0.15s" }) }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "6px" }}>
        <div>
          <div style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{label}</div>
          <div style={{ fontSize: "28px", fontWeight: "800", color: "#222", lineHeight: 1 }}>{value}</div>
        </div>
        <div style={{ width: "42px", height: "42px", borderRadius: "10px", backgroundColor: color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      {sub && <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

// ─── CATEGORY FILTER TILE ──────────────────────────────────────────────────────
function CategoryTile({ data, isSelected, onClick }) {
  const cfg = CAT_COLORS[data.category];
  return (
    <div
      onClick={onClick}
      style={{
        ...card({
          padding: "20px 22px",
          borderLeft: `4px solid ${cfg.color}`,
          cursor: "pointer",
          transition: "all 0.15s",
          border: isSelected ? `1.5px solid ${cfg.color}` : "1px solid #e8e8e8",
          borderLeftWidth: "4px",
          borderLeftColor: cfg.color,
          boxShadow: isSelected ? `0 0 0 3px ${cfg.color}22, 0 4px 14px rgba(0,0,0,0.08)` : "0 1px 4px rgba(0,0,0,0.05)",
        }),
      }}
      onMouseEnter={e => {
        if (!isSelected) {
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.10)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = isSelected ? `0 0 0 3px ${cfg.color}22, 0 4px 14px rgba(0,0,0,0.08)` : "0 1px 4px rgba(0,0,0,0.05)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px", fontWeight: "800", color: "#222" }}>{data.category}</span>
        <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 9px", borderRadius: "20px", backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
          {data.total} {data.total === 1 ? "Player" : "Players"}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>Available</span>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#2e7d32" }}>{data.available}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>Injured</span>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#cc3333" }}>{data.injured}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>Resting / Rehab</span>
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#f9a825" }}>{data.resting}</span>
        </div>
      </div>
    </div>
  );
}

// ─── PLAYER TABLE ─────────────────────────────────────────────────────────────
function PlayerTable({ players, onPlayerClick }) {
  const [search,   setSearch]   = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [teamFilter,   setTeamFilter]   = useState("All");
  const [sortKey, setSortKey] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);

  const toggleSort = (key) => { if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(key); setSortDir("asc"); } };

  const filtered = players
    .filter(p =>
      (search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.role.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase())) &&
      (catFilter    === "All" || p.category === catFilter) &&
      (genderFilter === "All" || p.gender   === genderFilter) &&
      (statusFilter === "All" || p.status   === statusFilter) &&
      (teamFilter   === "All" || p.team     === teamFilter)
    )
    .sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const SortIcon = ({ k }) => sortKey !== k ? null : (sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />);

  const thStyle = () => ({
    padding: "11px 14px", fontSize: "11px", fontWeight: "700", color: "#888", textTransform: "uppercase",
    letterSpacing: "0.4px", textAlign: "left", borderBottom: "1px solid #e8e8e8", cursor: "pointer",
    whiteSpace: "nowrap", backgroundColor: "#fafafa", userSelect: "none",
  });

  return (
    <div style={card({ overflow: "hidden" })}>
      {/* Toolbar */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players, roles, teams..."
              style={{ width: "100%", padding: "8px 12px 8px 34px", border: "1.5px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9", outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = "#2f9be0")} onBlur={e => (e.target.style.borderColor = "#e0e0e0")} />
          </div>

          <button onClick={() => setShowFilters(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", border: `1.5px solid ${showFilters ? "#2f9be0" : "#e0e0e0"}`, borderRadius: "8px", backgroundColor: showFilters ? "#e8f3fb" : "#fff", color: showFilters ? "#2f9be0" : "#666", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
            <Filter size={13} /> Filters {showFilters ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <div style={{ fontSize: "13px", color: "#888", flexShrink: 0 }}>
            <b style={{ color: "#222" }}>{filtered.length}</b> of {players.length} players
          </div>
        </div>

        {/* Filter pills */}
        {showFilters && (
          <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
            {[
              { label: "Category", options: ALL_CATEGORIES, value: catFilter,    set: setCatFilter    },
              { label: "Gender",   options: GENDERS,         value: genderFilter, set: setGenderFilter },
              { label: "Status",   options: STATUSES,        value: statusFilter, set: setStatusFilter },
              { label: "Team",     options: TEAMS,           value: teamFilter,   set: setTeamFilter   },
            ].map(f => (
              <div key={f.label}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "5px" }}>{f.label}</div>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                  {f.options.map(o => (
                    <button key={o} onClick={() => f.set(o)}
                      style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", cursor: "pointer", border: `1.5px solid ${f.value === o ? "#2f9be0" : "#e0e0e0"}`, backgroundColor: f.value === o ? "#e8f3fb" : "#f9f9f9", color: f.value === o ? "#2f9be0" : "#666", transition: "all 0.12s" }}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <div className="scroll-x">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "820px" }}>
          <thead>
            <tr>
              {[
                { key: "name",     label: "Player"   },
                { key: "category", label: "Category" },
                { key: "gender",   label: "Gender"   },
                { key: "role",     label: "Role"     },
                { key: "team",     label: "Team"     },
                { key: "age",      label: "Age"      },
                { key: "status",   label: "Status"   },
                { key: "form",     label: "Form"     },
                { key: "matches",  label: "Matches"  },
              ].map(col => (
                <th key={col.key} onClick={() => toggleSort(col.key)} style={thStyle()}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>{col.label} <SortIcon k={col.key} /></span>
                </th>
              ))}
              <th style={{ ...thStyle(), cursor: "default" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const stCfg = STATUS_CFG[p.status] || STATUS_CFG.Available;
              const catCfg = CAT_COLORS[p.category] || CAT_COLORS["Senior"];
              return (
                <tr key={p.id}
                  style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa", transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#fdf8f4")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = i % 2 === 0 ? "#fff" : "#fafafa")}
                >
                  {/* Name */}
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: p.status === "Injured" ? "#fff0f0" : "#e8f3fb", border: `1.5px solid ${p.status === "Injured" ? "#ffc5c5" : "#cfe6f7"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", color: p.status === "Injured" ? "#cc3333" : "#2f9be0", flexShrink: 0 }}>
                        {p.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>{p.name}</div>
                        {p.injury && <div style={{ fontSize: "10px", color: "#cc3333", fontWeight: "600" }}>⚠ {p.injury}</div>}
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 9px", borderRadius: "20px", backgroundColor: catCfg.bg, color: catCfg.color, border: `1px solid ${catCfg.border}`, whiteSpace: "nowrap" }}>{p.category}</span>
                  </td>
                  {/* Gender */}
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5" }}>
                    <span style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}>{p.gender === "Male" ? "♂" : "♀"} {p.gender}</span>
                  </td>
                  {/* Role */}
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5", fontSize: "13px", color: "#444", whiteSpace: "nowrap" }}>{p.role}</td>
                  {/* Team */}
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5", fontSize: "12px", color: "#666" }}>{p.team}</td>
                  {/* Age */}
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5", fontSize: "13px", fontWeight: "600", color: "#333", textAlign: "center" }}>{p.age}</td>
                  {/* Status */}
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: stCfg.dot, flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", fontWeight: "700", color: stCfg.color }}>{p.status}</span>
                    </div>
                  </td>
                  {/* Form */}
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5", minWidth: "100px" }}>
                    <FormBar value={p.form} />
                  </td>
                  {/* Matches */}
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5", fontSize: "13px", fontWeight: "700", color: "#333", textAlign: "center" }}>{p.matches}</td>
                  {/* Action */}
                  <td style={{ padding: "12px 14px", borderBottom: "1px solid #f5f5f5" }}>
                    <button onClick={() => onPlayerClick(p)}
                      style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 12px", backgroundColor: "#e8f3fb", color: "#2f9be0", border: "1px solid #cfe6f7", borderRadius: "7px", fontSize: "12px", fontWeight: "700", cursor: "pointer", whiteSpace: "nowrap" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#cfe6f7")}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#e8f3fb")}
                    ><Eye size={11} /> View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <Search size={32} style={{ color: "#ddd", margin: "0 auto 10px", display: "block" }} />
            <p style={{ fontSize: "14px", color: "#aaa", fontWeight: "600" }}>No players match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SQUAD AVAILABILITY MODAL ───────────────────────────────────────────────
function SquadAvailabilityModal({ categoryLabel, total, available, injured, resting, injuredPlayers, onClose }) {
  const accent = categoryLabel === "All Squads" ? CAT_COLORS["Senior"].color : (CAT_COLORS[categoryLabel]?.color || "#2f9be0");
  const accentBg = categoryLabel === "All Squads" ? CAT_COLORS["Senior"].bg : (CAT_COLORS[categoryLabel]?.bg || "#e8f3fb");
  const accentBorder = categoryLabel === "All Squads" ? CAT_COLORS["Senior"].border : (CAT_COLORS[categoryLabel]?.border || "#cfe6f7");

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...card(), width: "100%", maxWidth: "480px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1a2340, #2d3a5c)", padding: "22px 24px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Target size={20} style={{ color: "#fff" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "17px", fontWeight: "800", color: "#fff" }}>Squad Availability</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>{categoryLabel}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "20px", lineHeight: 1, padding: "0" }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "4px 0 0" }}>
          <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: "20px" }}>
            {total > 0 ? (
              <svg width="110" height="110" viewBox="0 0 110 110" style={{ flexShrink: 0 }}>
                {(() => {
                  const data = [
                    { val: available, color: "#2e7d32" },
                    { val: injured,   color: "#cc3333" },
                    { val: resting,   color: "#f9a825" },
                  ];
                  const cx = 55, cy = 55, r = 42, stroke = 16;
                  let offset = -90;
                  const circumference = 2 * Math.PI * r;
                  return data.map((d, i) => {
                    const pct = d.val / total;
                    const dash = pct * circumference;
                    const rotate = offset;
                    offset += pct * 360;
                    return (
                      <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={stroke}
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={-(rotate / 360) * circumference}
                        style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }} />
                    );
                  });
                })()}
                <text x="55" y="50" textAnchor="middle" fontSize="18" fontWeight="800" fill="#222">{total}</text>
                <text x="55" y="65" textAnchor="middle" fontSize="9" fill="#888">players</text>
              </svg>
            ) : (
              <div style={{ width: "110px", height: "110px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: "2px dashed #e0e0e0" }}>
                <span style={{ fontSize: "11px", color: "#aaa" }}>No data</span>
              </div>
            )}
            <div style={{ flex: 1 }}>
              {[
                { label: "Available", value: available, color: "#2e7d32", pct: total > 0 ? Math.round((available/total)*100) : 0 },
                { label: "Injured",   value: injured,   color: "#cc3333", pct: total > 0 ? Math.round((injured/total)*100) : 0 },
                { label: "Resting",   value: resting,   color: "#f9a825", pct: total > 0 ? Math.round((resting/total)*100) : 0 },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                    <div style={{ width: "9px", height: "9px", borderRadius: "50%", backgroundColor: s.color }} />
                    <span style={{ fontSize: "13px", color: "#555" }}>{s.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#222" }}>{s.value}</span>
                    <span style={{ fontSize: "12px", color: "#aaa", minWidth: "30px", textAlign: "right" }}>{s.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Injured list */}
          {injured > 0 && (
            <div style={{ padding: "0 22px 20px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#cc3333", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "8px" }}>Injured Players</div>
              {injuredPlayers.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", borderBottom: "1px solid #f5f5f5" }}>
                  <AlertTriangle size={12} style={{ color: "#cc3333", flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", fontWeight: "600", color: "#222", flex: 1 }}>{p.name}</span>
                  <span style={{ fontSize: "11px", color: "#cc3333" }}>{p.injury}</span>
                </div>
              ))}
            </div>
          )}

          {injured === 0 && total > 0 && (
            <div style={{ padding: "0 22px 20px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", backgroundColor: accentBg, color: accent, border: `1px solid ${accentBorder}` }}>No active injuries</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PLAYER MODAL ─────────────────────────────────────────────────────────────
function PlayerModal({ player, onClose }) {
  if (!player) return null;
  const stCfg  = STATUS_CFG[player.status] || STATUS_CFG.Available;
  const catCfg = CAT_COLORS[player.category] || CAT_COLORS["Senior"];

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ ...card(), width: "100%", maxWidth: "480px", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #1a2340, #2d3a5c)", padding: "22px 24px", display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: player.status === "Injured" ? "#cc3333" : "#2f9be0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "800", color: "#fff", flexShrink: 0 }}>
            {player.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>{player.name}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", marginTop: "2px" }}>{player.role} · {player.team}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: "20px", lineHeight: 1, padding: "0" }}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", backgroundColor: catCfg.bg, color: catCfg.color, border: `1px solid ${catCfg.border}` }}>{player.category}</span>
            <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", backgroundColor: stCfg.bg, color: stCfg.color, border: `1px solid ${stCfg.border}` }}>{player.status}</span>
            <span style={{ fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "20px", backgroundColor: "#f5f5f5", color: "#666", border: "1px solid #e0e0e0" }}>{player.gender}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "18px" }}>
            {[
              { label: "Age",     value: `${player.age} years` },
              { label: "Matches", value: player.matches },
              { label: "Team",    value: player.team },
              { label: "Form",    value: player.form > 0 ? `${player.form}/100` : "—" },
            ].map(f => (
              <div key={f.label} style={{ padding: "12px 14px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #f0f0f0" }}>
                <div style={{ fontSize: "10px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "3px" }}>{f.label}</div>
                <div style={{ fontSize: "15px", fontWeight: "800", color: "#222" }}>{f.value}</div>
              </div>
            ))}
          </div>

          {player.injury && (
            <div style={{ padding: "12px 16px", backgroundColor: "#fff0f0", border: "1px solid #ffc5c5", borderRadius: "9px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={15} style={{ color: "#cc3333" }} />
              <div>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#cc3333" }}>Active Injury</div>
                <div style={{ fontSize: "13px", color: "#666" }}>{player.injury}</div>
              </div>
            </div>
          )}

          <div style={{ marginBottom: "4px" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#888", marginBottom: "6px" }}>Current Form</div>
            <FormBar value={player.form} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab,   setActiveTab]   = useState("overview");
  const [modalPlayer, setModalPlayer] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);

  // Players scoped to the currently selected category + gender filter (affects stats + chart)
  const scopedPlayers = useMemo(
    () => PLAYERS.filter(p =>
      (selectedCategory === "All" || p.category === selectedCategory) &&
      (genderFilter === "All" || p.gender === genderFilter)
    ),
    [selectedCategory, genderFilter]
  );

  const total      = scopedPlayers.length;
  const available  = scopedPlayers.filter(p => p.status === "Available").length;
  const injured    = scopedPlayers.filter(p => p.status === "Injured").length;
  const resting    = scopedPlayers.filter(p => p.status === "Resting").length;
  const male       = scopedPlayers.filter(p => p.gender === "Male").length;
  const female     = scopedPlayers.filter(p => p.gender === "Female").length;

  // Per-category tile data (respects gender filter, shows each category's own totals regardless of selected category)
  const categoryTileData = useMemo(
    () => CATEGORIES.filter(c => c !== "Under-10").map(cat => {
      const inCat = PLAYERS.filter(p => p.category === cat && (genderFilter === "All" || p.gender === genderFilter));
      return {
        category: cat,
        total: inCat.length,
        available: inCat.filter(p => p.status === "Available").length,
        injured: inCat.filter(p => p.status === "Injured").length,
        resting: inCat.filter(p => p.status === "Resting").length,
      };
    }),
    [genderFilter]
  );

  const TABS = [
    { key: "overview", label: "Overview",  icon: BarChart2 },
    { key: "players",  label: "All Players", icon: Users  },
  ];

  const statusColors = {
    active:    { bg: "#e8f3fb", text: "#2f9be0" },
    completed: { bg: "#f0faf0", text: "#2e7d32" },
    pending:   { bg: "#fff8e1", text: "#f9a825" },
    injured:   { bg: "#fff0f0", text: "#cc3333" },
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setAvailabilityModalOpen(true);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      {/* Top nav tabs */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8e8e8", padding: "0 28px" }}>
        <div style={{ display: "flex", gap: "0", maxWidth: "1200px", margin: "0 auto" }}>
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ display: "flex", alignItems: "center", gap: "7px", padding: "16px 20px", border: "none", backgroundColor: "transparent", fontSize: "13px", fontWeight: "700", cursor: "pointer", color: activeTab === tab.key ? "#2f9be0" : "#888", borderBottom: activeTab === tab.key ? "3px solid #2f9be0" : "3px solid transparent", transition: "all 0.15s" }}>
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "28px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <>
            {/* Heading */}
            <PageBanner title="Squad Dashboard" sub="Overview, players & activity" />

            {/* Top stat cards (reflect selected category scope) */}
            {/* <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "16px", marginBottom: "24px" }}>
              <StatCard label="Total Players"     value={total}     icon={Users}        color="#2f9be0" sub={`${male} male · ${female} female`}             onClick={() => setActiveTab("players")} />
              <StatCard label="Available"         value={available} icon={CheckCircle2} color="#2e7d32" sub={total > 0 ? `${Math.round((available/total)*100)}% of squad` : "—"} onClick={() => setActiveTab("players")} />
              <StatCard label="Injured"           value={injured}   icon={AlertTriangle}color="#cc3333" sub="Requires attention"                              onClick={() => setActiveTab("players")} />
              <StatCard label="Resting / Rehab"   value={resting}   icon={Clock}        color="#f9a825" sub="Managed load"                                    onClick={() => setActiveTab("players")} />
            </div> */}

            {/* Gender filter */}
            <div style={{ marginBottom: "18px" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "8px" }}>Gender</div>
              <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
                {["All", "Male", "Female"].map(g => (
                  <label key={g} style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", fontSize: "13px", fontWeight: "600", color: genderFilter === g ? "#2f9be0" : "#555" }}>
                    <input
                      type="radio"
                      name="genderFilter"
                      value={g}
                      checked={genderFilter === g}
                      onChange={() => setGenderFilter(g)}
                      style={{ width: "15px", height: "15px", accentColor: "#2f9be0", cursor: "pointer" }}
                    />
                    {g === "All" ? "All" : g}
                  </label>
                ))}
              </div>
            </div>

            {/* Category filter strip */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <span style={{ fontWeight: "700", fontSize: "14px", color: "#333", display: "flex", alignItems: "center", gap: "7px" }}>
                  <Award size={15} style={{ color: "#2f9be0" }} /> Age Categories
                </span>
                {selectedCategory !== "All" && (
                  <span style={{ fontSize: "12px", color: "#2f9be0", display: "flex", alignItems: "center", gap: "4px" }}>
                    Viewing: <b>{selectedCategory}</b>
                    <ChevronRight size={12} />
                    <button onClick={() => setSelectedCategory("All")} style={{ background: "none", border: "none", color: "#2f9be0", cursor: "pointer", fontWeight: "700", fontSize: "12px", padding: 0, textDecoration: "underline" }}>
                      Reset
                    </button>
                  </span>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "16px" }}>
                {/* All Squads tile */}
                <div
                  onClick={() => handleCategorySelect("All")}
                  style={{
                    ...card({
                      padding: "20px 22px",
                      borderLeft: "4px solid #2f9be0",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      border: selectedCategory === "All" ? "1.5px solid #2f9be0" : "1px solid #e8e8e8",
                      borderLeftWidth: "4px",
                      borderLeftColor: "#2f9be0",
                      boxShadow: selectedCategory === "All" ? "0 0 0 3px #2f9be022, 0 4px 14px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.05)",
                    }),
                  }}
                  onMouseEnter={e => {
                    if (selectedCategory !== "All") {
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.10)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = selectedCategory === "All" ? "0 0 0 3px #2f9be022, 0 4px 14px rgba(0,0,0,0.08)" : "0 1px 4px rgba(0,0,0,0.05)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "800", color: "#222" }}>All Squads</span>
                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 9px", borderRadius: "20px", backgroundColor: "#e8f3fb", color: "#2f9be0", border: "1px solid #cfe6f7" }}>
                      {PLAYERS.filter(p => genderFilter === "All" || p.gender === genderFilter).length} Players
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "#888" }}>Available</span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#2e7d32" }}>{PLAYERS.filter(p => p.status === "Available" && (genderFilter === "All" || p.gender === genderFilter)).length}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "#888" }}>Injured</span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#cc3333" }}>{PLAYERS.filter(p => p.status === "Injured" && (genderFilter === "All" || p.gender === genderFilter)).length}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "12px", color: "#888" }}>Resting / Rehab</span>
                      <span style={{ fontSize: "13px", fontWeight: "700", color: "#f9a825" }}>{PLAYERS.filter(p => p.status === "Resting" && (genderFilter === "All" || p.gender === genderFilter)).length}</span>
                    </div>
                  </div>
                </div>

                {/* Category tiles */}
                {categoryTileData.map(data => (
                  <CategoryTile
                    key={data.category}
                    data={data}
                    isSelected={selectedCategory === data.category}
                    onClick={() => handleCategorySelect(data.category)}
                  />
                ))}
              </div>
            </div>

            {/* Middle row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>

              {/* Prompt card — Squad Availability now opens as a modal from the tiles above */}
              {/* <div style={card({ padding: "0", overflow: "hidden" })}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontWeight: "700", fontSize: "14px", color: "#333", display: "flex", alignItems: "center", gap: "7px" }}>
                    <Target size={15} style={{ color: "#2f9be0" }} /> Squad Availability
                  </span>
                </div>
                <div style={{ padding: "36px 22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", textAlign: "center" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#e8f3fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Target size={22} style={{ color: "#2f9be0" }} />
                  </div>
                  <p style={{ fontSize: "13px", color: "#888", margin: 0, maxWidth: "260px" }}>
                    Click <b style={{ color: "#333" }}>All Squads</b> or any category tile above to view its availability breakdown.
                  </p>
                  <button onClick={() => handleCategorySelect(selectedCategory)}
                    style={{ marginTop: "4px", display: "flex", alignItems: "center", gap: "6px", padding: "7px 16px", backgroundColor: "#e8f3fb", color: "#2f9be0", border: "1px solid #cfe6f7", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                    <Eye size={13} /> View {selectedCategory === "All" ? "All Squads" : selectedCategory}
                  </button>
                </div>
              </div> */}

              {/* Gender split (scoped to selected category + gender filter) */}
              {/* <div style={card({ padding: "0", overflow: "hidden" })}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontWeight: "700", fontSize: "14px", color: "#333", display: "flex", alignItems: "center", gap: "7px" }}><Users size={15} style={{ color: "#2f9be0" }} /> Gender Split</span>
                </div>
                <div style={{ padding: "18px 22px", display: "flex", gap: "14px" }}>
                  {[
                    { label: "Male",   count: male,   color: "#3b82f6", pct: total > 0 ? Math.round((male/total)*100) : 0 },
                    { label: "Female", count: female, color: "#e879a0", pct: total > 0 ? Math.round((female/total)*100) : 0 },
                  ].map(g => (
                    <div key={g.label} style={{ flex: 1, padding: "12px", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #f0f0f0", textAlign: "center" }}>
                      <div style={{ fontSize: "20px", fontWeight: "800", color: g.color }}>{g.count}</div>
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>{g.label} · {g.pct}%</div>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>

            {/* Bottom row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>

              {/* Recent activity */}
              <div style={card({ overflow: "hidden" })}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "700", fontSize: "14px", color: "#333", display: "flex", alignItems: "center", gap: "7px" }}><Activity size={15} style={{ color: "#2f9be0" }} /> Recent Activity</span>
                  <span style={{ fontSize: "12px", color: "#2f9be0", cursor: "pointer", fontWeight: "600" }}>View all</span>
                </div>
                {RECENT_ACTIVITY.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", padding: "12px 22px", borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid #f5f5f5" : "none", gap: "12px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#e8f3fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "800", color: "#2f9be0", flexShrink: 0 }}>
                      {item.name[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.action}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px", flexShrink: 0 }}>
                      <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "20px", backgroundColor: statusColors[item.status]?.bg || "#f5f5f5", color: statusColors[item.status]?.text || "#666", fontWeight: "600", textTransform: "capitalize" }}>{item.status}</span>
                      <span style={{ fontSize: "10px", color: "#bbb" }}>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upcoming events */}
              <div style={card({ overflow: "hidden" })}>
                <div style={{ padding: "16px 22px", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontWeight: "700", fontSize: "14px", color: "#333", display: "flex", alignItems: "center", gap: "7px" }}><Calendar size={15} style={{ color: "#2f9be0" }} /> Upcoming Events</span>
                </div>
                <div style={{ padding: "10px 22px" }}>
                  {UPCOMING_EVENTS.map((ev, i) => {
                    const typeCfg = EVENT_TYPE_COLORS[ev.type] || EVENT_TYPE_COLORS.Practice;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "11px 0", borderBottom: i < UPCOMING_EVENTS.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                        <div style={{ minWidth: "48px", textAlign: "center", padding: "6px 8px", backgroundColor: "#e8f3fb", border: "1px solid #cfe6f7", borderRadius: "8px" }}>
                          <div style={{ fontSize: "11px", fontWeight: "800", color: "#2f9be0", lineHeight: 1.2 }}>{ev.date.split(" ")[0]}</div>
                          <div style={{ fontSize: "10px", color: "#2f9be0", fontWeight: "600" }}>{ev.date.split(" ")[1]}</div>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "13px", fontWeight: "700", color: "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.event}</div>
                          <div style={{ fontSize: "11px", color: "#888", marginTop: "1px" }}>{ev.team}</div>
                        </div>
                        <span style={{ fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px", backgroundColor: typeCfg.bg, color: typeCfg.color, border: `1px solid ${typeCfg.border}`, flexShrink: 0 }}>{ev.type}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Team breakdown */}
                <div style={{ padding: "14px 22px", borderTop: "1px solid #f0f0f0" }}>
                  <div style={{ fontSize: "12px", fontWeight: "700", color: "#888", marginBottom: "10px" }}>PLAYERS BY TEAM</div>
                  {TEAMS.filter(t => t !== "All").map(team => {
                    const count = PLAYERS.filter(p => p.team === team).length;
                    const injCount = PLAYERS.filter(p => p.team === team && p.status === "Injured").length;
                    return (
                      <div key={team} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 0", borderBottom: "1px solid #f5f5f5" }}>
                        <span style={{ fontSize: "13px", color: "#555", flex: 1 }}>{team}</span>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#222" }}>{count}</span>
                        {injCount > 0 && <span style={{ fontSize: "10px", fontWeight: "700", padding: "1px 7px", borderRadius: "20px", backgroundColor: "#fff0f0", color: "#cc3333", border: "1px solid #ffc5c5" }}>⚠ {injCount}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── PLAYERS TAB ── */}
        {activeTab === "players" && (
          <>
            <div style={{ marginBottom: "22px" }}>
              <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#222", margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>All Players</h1>
              <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Filter, sort and view full squad details</p>
              <div style={{ width: "32px", height: "3px", backgroundColor: "#2f9be0", borderRadius: "2px", marginTop: "6px" }} />
            </div>
            <PlayerTable players={PLAYERS} onPlayerClick={setModalPlayer} />
          </>
        )}
      </div>

      {/* Squad availability modal */}
      {availabilityModalOpen && (
        <SquadAvailabilityModal
          categoryLabel={selectedCategory === "All" ? "All Squads" : selectedCategory}
          total={total}
          available={available}
          injured={injured}
          resting={resting}
          injuredPlayers={scopedPlayers.filter(p => p.status === "Injured")}
          onClose={() => setAvailabilityModalOpen(false)}
        />
      )}

      {/* Player modal */}
      {modalPlayer && <PlayerModal player={modalPlayer} onClose={() => setModalPlayer(null)} />}
    </div>
  );
}