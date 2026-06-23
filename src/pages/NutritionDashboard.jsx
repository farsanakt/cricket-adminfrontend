import { useState } from "react";
import {
  Users, CheckCircle2, AlertCircle, ChevronRight,
  AlertTriangle, ArrowLeft, Plus, Droplets, Moon,
  Zap, Apple, Pill, ClipboardList, FileText,
} from "lucide-react";
import { PageBanner } from "../theme";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PLAYERS = [
  {
    id: 101, name: "Arjun Menon",    number: "01", role: "Batsman",       age: 23, weight: 72, height: 178, status: "Active",  injury: false,
    plans: [
      {
        id: "p1", date: "2024-05-01", title: "Pre-Season Build",
        calories: 2800, protein: 160, carbs: 320, fat: 75, fiber: 35, water: 3.5,
        meals: [
          { name: "Breakfast",         items: "Oats with banana, 3 eggs, 1 glass milk" },
          { name: "Mid-Morning Snack", items: "Protein shake, 1 apple, handful almonds" },
          { name: "Lunch",             items: "Brown rice, grilled chicken (200g), dal, salad" },
          { name: "Pre-Workout",       items: "Banana, peanut butter toast" },
          { name: "Post-Workout",      items: "Whey protein, fruit bowl" },
          { name: "Dinner",            items: "Roti x3, paneer/fish curry, curd" },
          { name: "Bedtime Snack",     items: "—" },
        ],
        supplements: ["Whey Protein", "Creatine", "Vitamin D3", "Omega-3"],
        hydration: "3.5", sleepTarget: "8",
        notes: "Focus on increasing lean muscle. Avoid processed sugars.",
      },
    ],
  },
  { id: 102, name: "Rahul Das",       number: "02", role: "Bowler",        age: 25, weight: 80, height: 185, status: "Injured", injury: true,  plans: [] },
  {
    id: 103, name: "Vivek Pillai",    number: "03", role: "All-rounder",   age: 22, weight: 75, height: 180, status: "Active",  injury: false,
    plans: [
      {
        id: "p2", date: "2024-04-15", title: "Match Prep Phase",
        calories: 3000, protein: 175, carbs: 360, fat: 80, fiber: 38, water: 4.0,
        meals: [
          { name: "Breakfast",         items: "Idli x4, sambar, coconut chutney, eggs x2" },
          { name: "Mid-Morning Snack", items: "Dry fruits mix, 1 glass coconut water" },
          { name: "Lunch",             items: "Rice, fish curry, vegetable stir-fry, salad" },
          { name: "Pre-Workout",       items: "Sweet potato, banana shake" },
          { name: "Post-Workout",      items: "Protein shake with milk" },
          { name: "Dinner",            items: "Chappati x4, chicken/dal, vegetables" },
          { name: "Bedtime Snack",     items: "Warm milk, handful of walnuts" },
        ],
        supplements: ["Whey Protein", "BCAA", "Multivitamin", "Magnesium"],
        hydration: "4.0", sleepTarget: "8",
        notes: "Match phase — prioritise carb loading 48hrs before game.",
      },
    ],
  },
  { id: 104, name: "Nikhil Krishnan", number: "04", role: "Wicket-keeper", age: 24, weight: 68, height: 172, status: "Active",  injury: false, plans: [] },
  { id: 201, name: "Rohit Sharma Jr.",number: "11", role: "Batsman",       age: 26, weight: 78, height: 182, status: "Active",  injury: false, plans: [] },
  { id: 202, name: "Aditya Kulkarni", number: "12", role: "Bowler",        age: 21, weight: 70, height: 176, status: "Active",  injury: false, plans: [] },
];

const ALL_SUPPLEMENTS = [
  "Whey Protein","Creatine","BCAA","Vitamin D3","Vitamin C",
  "Omega-3","Magnesium","Multivitamin","Iron","Calcium","Zinc",
];

const DEFAULT_MEALS = [
  { name: "Breakfast",         items: "" },
  { name: "Mid-Morning Snack", items: "" },
  { name: "Lunch",             items: "" },
  { name: "Pre-Workout",       items: "" },
  { name: "Post-Workout",      items: "" },
  { name: "Dinner",            items: "" },
  { name: "Bedtime Snack",     items: "" },
];

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
const card = (extra = {}) => ({
  backgroundColor: "#fff",
  borderRadius: "10px",
  border: "1px solid #e8e8e8",
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  ...extra,
});

const Heading = ({ title, sub }) => (
  <div style={{ marginBottom: "22px" }}>
    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#222", marginBottom: "2px", margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>{title}</h1>
    {sub && <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>{sub}</p>}
    <div style={{ width: "32px", height: "3px", backgroundColor: "#2f9be0", borderRadius: "2px", marginTop: "6px" }} />
  </div>
);

const BackBtn = ({ label, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: "6px",
    background: "none", border: "none", color: "#888",
    fontSize: "13px", fontWeight: "600", cursor: "pointer",
    marginBottom: "18px", padding: "0",
  }}
    onMouseEnter={e => (e.currentTarget.style.color = "#2f9be0")}
    onMouseLeave={e => (e.currentTarget.style.color = "#888")}
  >
    <ArrowLeft size={15} style={{ color: "inherit" }} /> {label}
  </button>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: "8px",
    paddingBottom: "12px", borderBottom: "1px solid #f0f0f0", marginBottom: "16px",
  }}>
    {Icon && <Icon size={15} style={{ color: "#2f9be0" }} />}
    <span style={{ fontSize: "13px", fontWeight: "700", color: "#333" }}>{title}</span>
  </div>
);

const StatusBadge = ({ label, color, bg, border }) => (
  <span style={{
    fontSize: "11px", fontWeight: "700", padding: "2px 9px",
    borderRadius: "20px", backgroundColor: bg, color,
    border: `1px solid ${border}`,
  }}>{label}</span>
);

const textInput = {
  width: "100%", padding: "9px 12px",
  border: "1.5px solid #e0e0e0", borderRadius: "7px",
  fontSize: "13px", color: "#333", backgroundColor: "#f9f9f9",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};

const MacroBar = ({ label, value, max, unit, color }) => {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#555" }}>{label}</span>
        <span style={{ fontSize: "12px", fontWeight: "700", color }}>{value}{unit}</span>
      </div>
      <div style={{ height: "6px", backgroundColor: "#f0f0f0", borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, backgroundColor: color, borderRadius: "4px", transition: "width 0.5s" }} />
      </div>
    </div>
  );
};

const InputField = ({ label, type = "text", placeholder, value, onChange }) => (
  <div>
    <label style={{ fontSize: "11px", fontWeight: "700", color: "#888", display: "block", marginBottom: "5px", letterSpacing: "0.4px" }}>
      {label}
    </label>
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={textInput}
      onFocus={e => (e.target.style.borderColor = "#2f9be0")}
      onBlur={e  => (e.target.style.borderColor = "#e0e0e0")}
    />
  </div>
);

// ─── VIEW CONSTANTS ───────────────────────────────────────────────────────────
const V_LIST    = "list";
const V_PLAYER  = "player";
const V_CREATE  = "create";
const V_DETAIL  = "detail";

// ─── CREATE PLAN FORM ─────────────────────────────────────────────────────────
const CreateForm = ({ player, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: "", date: new Date().toISOString().split("T")[0],
    calories: "", protein: "", carbs: "", fat: "", fiber: "", water: "",
    meals: DEFAULT_MEALS.map(m => ({ ...m })),
    supplements: [], hydration: "", sleepTarget: "", notes: "",
  });

  const set      = (k, v)  => setForm(f => ({ ...f, [k]: v }));
  const setMeal  = (i, v)  => setForm(f => { const m = [...f.meals]; m[i] = { ...m[i], items: v }; return { ...f, meals: m }; });
  const toggleS  = (s)     => setForm(f => ({ ...f, supplements: f.supplements.includes(s) ? f.supplements.filter(x => x !== s) : [...f.supplements, s] }));

  const handleSave = () => {
    if (!form.title.trim()) { alert("Please enter a plan title."); return; }
    onSave({ ...form, id: `p${Date.now()}` });
  };

  const sectionCard = { ...card({ padding: "22px", marginBottom: "16px" }) };

  return (
    <div style={{ padding: "28px", maxWidth: "860px", margin: "0 auto" }}>
      <BackBtn label="Back to Player" onClick={onCancel} />

      <Heading title="New Nutrition Plan"
        sub={`For ${player.name} · #${player.number} · ${player.role}`} />

      {/* Plan Overview */}
      <div style={sectionCard}>
        <SectionHeader icon={ClipboardList} title="Plan Overview" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          <InputField label="PLAN TITLE"  placeholder="e.g. Pre-Season Build"       value={form.title}  onChange={e => set("title",  e.target.value)} />
          <InputField label="DATE"        type="date"                                 value={form.date}   onChange={e => set("date",   e.target.value)} />
        </div>
      </div>

      {/* Macros */}
      <div style={sectionCard}>
        <SectionHeader icon={Zap} title="Daily Macro Targets" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          <InputField label="CALORIES (KCAL)"       type="number" placeholder="e.g. 2800" value={form.calories} onChange={e => set("calories", e.target.value)} />
          <InputField label="PROTEIN (G)"           type="number" placeholder="e.g. 160"  value={form.protein}  onChange={e => set("protein",  e.target.value)} />
          <InputField label="CARBOHYDRATES (G)"     type="number" placeholder="e.g. 320"  value={form.carbs}    onChange={e => set("carbs",    e.target.value)} />
          <InputField label="TOTAL FAT (G)"         type="number" placeholder="e.g. 75"   value={form.fat}      onChange={e => set("fat",      e.target.value)} />
          <InputField label="DIETARY FIBER (G)"     type="number" placeholder="e.g. 35"   value={form.fiber}    onChange={e => set("fiber",    e.target.value)} />
          <InputField label="WATER INTAKE (L)"      type="number" placeholder="e.g. 3.5"  value={form.water}    onChange={e => set("water",    e.target.value)} />
        </div>
      </div>

      {/* Meal Plan */}
      <div style={sectionCard}>
        <SectionHeader icon={Apple} title="Meal Plan" />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {form.meals.map((meal, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px", alignItems: "center" }}>
              <div style={{
                fontSize: "12px", fontWeight: "700", textAlign: "center",
                borderRadius: "8px", padding: "8px 10px",
                backgroundColor: "#e8f3fb", color: "#2f9be0", border: "1px solid #cfe6f7",
              }}>
                {meal.name}
              </div>
              <input
                placeholder="Food items, quantities…"
                value={meal.items}
                onChange={e => setMeal(i, e.target.value)}
                style={textInput}
                onFocus={e => (e.target.style.borderColor = "#2f9be0")}
                onBlur={e  => (e.target.style.borderColor = "#e0e0e0")}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Supplements */}
      <div style={sectionCard}>
        <SectionHeader icon={Pill} title="Supplements" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {ALL_SUPPLEMENTS.map(s => {
            const sel = form.supplements.includes(s);
            return (
              <button key={s} onClick={() => toggleS(s)} style={{
                padding: "6px 14px", borderRadius: "20px", fontSize: "12px",
                fontWeight: "600", cursor: "pointer", transition: "all 0.15s",
                border: `1.5px solid ${sel ? "#2f9be0" : "#e0e0e0"}`,
                backgroundColor: sel ? "#e8f3fb" : "#f9f9f9",
                color: sel ? "#2f9be0" : "#666",
              }}
                onMouseEnter={e => { if (!sel) e.currentTarget.style.borderColor = "#2f9be0"; }}
                onMouseLeave={e => { if (!sel) e.currentTarget.style.borderColor = "#e0e0e0"; }}
              >{s}</button>
            );
          })}
        </div>
      </div>

      {/* Lifestyle */}
      <div style={sectionCard}>
        <SectionHeader icon={Droplets} title="Lifestyle Targets" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
          <InputField label="HYDRATION GOAL (L/DAY)" type="number" placeholder="e.g. 4.0" value={form.hydration}   onChange={e => set("hydration",   e.target.value)} />
          <InputField label="SLEEP TARGET (HRS)"      type="number" placeholder="e.g. 8"   value={form.sleepTarget} onChange={e => set("sleepTarget", e.target.value)} />
        </div>
      </div>

      {/* Notes */}
      <div style={sectionCard}>
        <SectionHeader icon={FileText} title="Notes & Restrictions" />
        <textarea
          placeholder="Allergies, intolerances, special instructions, goals…"
          value={form.notes}
          onChange={e => set("notes", e.target.value)}
          rows={4}
          style={{ ...textInput, resize: "vertical", minHeight: "80px" }}
          onFocus={e => (e.target.style.borderColor = "#2f9be0")}
          onBlur={e  => (e.target.style.borderColor = "#e0e0e0")}
        />
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={handleSave} style={{
          display: "flex", alignItems: "center", gap: "7px",
          padding: "11px 24px", backgroundColor: "#2f9be0",
          color: "#fff", border: "none", borderRadius: "8px",
          fontSize: "14px", fontWeight: "700", cursor: "pointer",
          boxShadow: "0 2px 8px rgba(47, 155, 224,0.3)",
        }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2380c2")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2f9be0")}
        >
          Save Plan
        </button>
        <button onClick={onCancel} style={{
          padding: "11px 20px", backgroundColor: "#fff", color: "#555",
          border: "1.5px solid #e0e0e0", borderRadius: "8px",
          fontSize: "14px", fontWeight: "600", cursor: "pointer",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.color = "#2f9be0"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#555"; }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// ─── PLAN DETAIL ──────────────────────────────────────────────────────────────
const PlanDetail = ({ plan, onBack }) => (
  <div style={{ padding: "28px", maxWidth: "860px", margin: "0 auto" }}>
    <BackBtn label="Back to Plans" onClick={onBack} />

    {/* Header */}
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
      <div>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#222", margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>{plan.title}</h2>
        <p style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
          {new Date(plan.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
        <div style={{ width: "32px", height: "3px", backgroundColor: "#2f9be0", borderRadius: "2px", marginTop: "6px" }} />
      </div>
      {/* Key stats */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {[
          { val: plan.calories, unit: "kcal/day",  bg: "#e8f3fb",  border: "#cfe6f7",  color: "#2f9be0" },
          { val: `${plan.water}L`,  unit: "water/day", bg: "#f0faf0",  border: "#b8e6b8",  color: "#2e7d32" },
          { val: `${plan.sleepTarget}h`, unit: "sleep",  bg: "#eff6ff",  border: "#bfdbfe",  color: "#3b82f6" },
        ].map(s => (
          <div key={s.unit} style={{ textAlign: "center", padding: "10px 16px", backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: "10px" }}>
            <div style={{ fontSize: "20px", fontWeight: "800", color: s.color }}>{s.val}</div>
            <div style={{ fontSize: "10px", color: "#999", fontWeight: "600", marginTop: "2px" }}>{s.unit}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Macro bars */}
    <div style={card({ padding: "22px", marginBottom: "16px" })}>
      <SectionHeader icon={Zap} title="Macro Breakdown" />
      <MacroBar label="Protein"       value={plan.protein} max={200} unit="g" color="#2f9be0" />
      <MacroBar label="Carbohydrates" value={plan.carbs}   max={450} unit="g" color="#3b82f6" />
      <MacroBar label="Fat"           value={plan.fat}     max={120} unit="g" color="#f59e0b" />
      <MacroBar label="Fiber"         value={plan.fiber}   max={50}  unit="g" color="#10b981" />
    </div>

    {/* Meals */}
    <div style={card({ padding: "22px", marginBottom: "16px" })}>
      <SectionHeader icon={Apple} title="Daily Meal Plan" />
      {plan.meals.map((meal, i) => (
        <div key={i} style={{
          display: "flex", gap: "12px", paddingTop: "11px", paddingBottom: "11px",
          borderBottom: i < plan.meals.length - 1 ? "1px solid #f5f5f5" : "none",
          alignItems: "flex-start",
        }}>
          <div style={{
            fontSize: "11px", fontWeight: "700", padding: "5px 10px",
            borderRadius: "7px", whiteSpace: "nowrap", flexShrink: 0,
            backgroundColor: "#e8f3fb", color: "#2f9be0", border: "1px solid #cfe6f7",
          }}>
            {meal.name}
          </div>
          <div style={{ fontSize: "13px", color: "#444", lineHeight: "1.5", paddingTop: "4px" }}>
            {meal.items || "—"}
          </div>
        </div>
      ))}
    </div>

    {/* Supplements */}
    {plan.supplements?.length > 0 && (
      <div style={card({ padding: "22px", marginBottom: "16px" })}>
        <SectionHeader icon={Pill} title="Supplements" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {plan.supplements.map(s => (
            <span key={s} style={{
              fontSize: "12px", fontWeight: "600", padding: "4px 12px",
              borderRadius: "20px", backgroundColor: "#e8f3fb",
              color: "#2f9be0", border: "1px solid #cfe6f7",
            }}>{s}</span>
          ))}
        </div>
      </div>
    )}

    {/* Notes */}
    {plan.notes && (
      <div style={card({ padding: "22px" })}>
        <SectionHeader icon={FileText} title="Notes" />
        <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.6", margin: 0 }}>{plan.notes}</p>
      </div>
    )}
  </div>
);

// ─── PLAYER DETAIL ────────────────────────────────────────────────────────────
const PlayerDetail = ({ player: init, allPlayers, setAllPlayers, onBack }) => {
  const [innerView,  setInnerView]  = useState(V_PLAYER);
  const [activePlan, setActivePlan] = useState(null);

  const player = allPlayers.find(p => p.id === init.id) || init;

  const handleSave = (plan) => {
    setAllPlayers(prev => prev.map(p => p.id === player.id ? { ...p, plans: [plan, ...p.plans] } : p));
    setInnerView(V_PLAYER);
  };

  if (innerView === V_CREATE) return (
    <CreateForm player={player} onSave={handleSave} onCancel={() => setInnerView(V_PLAYER)} />
  );
  if (innerView === V_DETAIL && activePlan) return (
    <PlanDetail plan={activePlan} onBack={() => { setActivePlan(null); setInnerView(V_PLAYER); }} />
  );

  return (
    <div style={{ padding: "28px", maxWidth: "860px", margin: "0 auto" }}>
      <BackBtn label="All Players" onClick={onBack} />

      {/* Player hero card */}
      <div style={card({ padding: "20px", marginBottom: "20px" })}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "50%", flexShrink: 0,
            backgroundColor: player.injury ? "#fff0f0" : "#e8f3fb",
            border: `2px solid ${player.injury ? "#ffc5c5" : "#cfe6f7"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "14px", fontWeight: "800",
            color: player.injury ? "#cc3333" : "#2f9be0",
          }}>
            {player.number}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#222", margin: 0, fontFamily: "'Barlow Condensed', sans-serif" }}>{player.name}</h2>
              <StatusBadge
                label={player.status}
                color={player.injury ? "#cc3333" : "#2e7d32"}
                bg={player.injury ? "#fff0f0" : "#f0faf0"}
                border={player.injury ? "#ffc5c5" : "#b8e6b8"}
              />
            </div>
            <p style={{ fontSize: "12px", color: "#888", marginTop: "3px" }}>
              {player.role} · Age {player.age} · {player.height}cm · {player.weight}kg
            </p>
          </div>
          <button onClick={() => setInnerView(V_CREATE)} style={{
            display: "flex", alignItems: "center", gap: "7px",
            padding: "10px 18px", backgroundColor: "#2f9be0",
            color: "#fff", border: "none", borderRadius: "8px",
            fontSize: "13px", fontWeight: "700", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(47, 155, 224,0.28)", flexShrink: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2380c2")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#2f9be0")}
          >
            <Plus size={15} /> New Plan
          </button>
        </div>
      </div>

      {/* Plans heading */}
      <div style={{ fontSize: "11px", fontWeight: "700", color: "#aaa", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "12px" }}>
        Nutrition Plans ({player.plans.length})
      </div>

      {/* Empty state */}
      {player.plans.length === 0 ? (
        <div style={card({ padding: "48px", textAlign: "center" })}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🥗</div>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "#555" }}>No nutrition plans yet</p>
          <p style={{ fontSize: "13px", color: "#aaa", marginTop: "4px" }}>Create the first plan for this player</p>
          <button onClick={() => setInnerView(V_CREATE)} style={{
            marginTop: "16px", padding: "10px 22px",
            backgroundColor: "#2f9be0", color: "#fff",
            border: "none", borderRadius: "8px",
            fontSize: "13px", fontWeight: "700", cursor: "pointer",
          }}>
            + Create Plan
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {player.plans.map(plan => (
            <div key={plan.id}
              onClick={() => { setActivePlan(plan); setInnerView(V_DETAIL); }}
              style={card({ padding: "18px 20px", cursor: "pointer", transition: "all 0.15s" })}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2f9be0"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(47, 155, 224,0.12)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e8e8e8"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {/* Plan title row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "700", color: "#222" }}>{plan.title}</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                    {new Date(plan.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: "#ccc", flexShrink: 0 }} />
              </div>

              {/* Macro pills */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: plan.supplements?.length ? "8px" : "0" }}>
                {[
                  { label: `${plan.calories} kcal`, color: "#2f9be0", bg: "#e8f3fb", border: "#cfe6f7" },
                  { label: `P: ${plan.protein}g`,   color: "#2e7d32", bg: "#f0faf0", border: "#b8e6b8" },
                  { label: `C: ${plan.carbs}g`,     color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
                  { label: `F: ${plan.fat}g`,       color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
                ].map(p => (
                  <span key={p.label} style={{ fontSize: "11px", fontWeight: "700", padding: "2px 9px", borderRadius: "20px", backgroundColor: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
                    {p.label}
                  </span>
                ))}
              </div>

              {/* Supplement pills */}
              {plan.supplements?.length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {plan.supplements.slice(0, 4).map(s => (
                    <span key={s} style={{ fontSize: "11px", fontWeight: "600", padding: "2px 9px", borderRadius: "20px", backgroundColor: "#f5f5f5", color: "#666", border: "1px solid #e0e0e0" }}>
                      {s}
                    </span>
                  ))}
                  {plan.supplements.length > 4 && (
                    <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 9px", borderRadius: "20px", backgroundColor: "#f5f5f5", color: "#aaa", border: "1px solid #e0e0e0" }}>
                      +{plan.supplements.length - 4} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const NutritionDashboard = () => {
  const [players,  setPlayers]  = useState(PLAYERS);
  const [selected, setSelected] = useState(null);

  if (selected) return (
    <PlayerDetail
      player={selected}
      allPlayers={players}
      setAllPlayers={setPlayers}
      onBack={() => setSelected(null)}
    />
  );

  const withPlans  = players.filter(p => p.plans.length > 0).length;
  const needsPlan  = players.filter(p => p.plans.length === 0).length;

  return (
    <div style={{ padding: "28px", maxWidth: "900px", margin: "0 auto" }}>
      <PageBanner title="Nutrition" sub="Player meal plans & macros" />

      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px", marginBottom: "22px" }}>
        {[
          { label: "Total Players", value: players.length, icon: Users,         color: "#2f9be0" },
          { label: "With Plans",    value: withPlans,      icon: CheckCircle2,  color: "#2e7d32" },
          { label: "Needs Plan",    value: needsPlan,      icon: AlertCircle,   color: "#f9a825" },
        ].map(s => (
          <div key={s.label} style={card({ padding: "16px 20px", borderLeft: `4px solid ${s.color}` })}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
              <span style={{ fontSize: "22px", fontWeight: "800", color: s.color }}>{s.value}</span>
              <div style={{ width: "34px", height: "34px", borderRadius: "9px", backgroundColor: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
            <span style={{ fontSize: "12px", color: "#888", fontWeight: "500" }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Player list */}
      <div style={card({ overflow: "hidden" })}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: "7px" }}>
          <Users size={15} style={{ color: "#2f9be0" }} />
          <span style={{ fontSize: "14px", fontWeight: "700", color: "#333" }}>{players.length} Players</span>
        </div>

        {players.map((player, i) => (
          <div key={player.id}
            onClick={() => setSelected(player)}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              padding: "14px 22px", cursor: "pointer",
              borderBottom: i < players.length - 1 ? "1px solid #f5f5f5" : "none",
              borderLeft: player.injury ? "3px solid #cc3333" : "3px solid transparent",
              transition: "background 0.12s",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = player.injury ? "#fff8f8" : "#fdf8f4")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            {/* Number badge */}
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
              backgroundColor: player.injury ? "#fff0f0" : "#e8f3fb",
              border: `1.5px solid ${player.injury ? "#ffc5c5" : "#cfe6f7"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: "800",
              color: player.injury ? "#cc3333" : "#2f9be0",
            }}>
              {player.number}
            </div>

            {/* Name + role */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "14px", fontWeight: "700", color: "#222" }}>{player.name}</span>
                {player.injury && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: "700", color: "#cc3333", backgroundColor: "#fff0f0", border: "1px solid #ffc5c5", borderRadius: "20px", padding: "2px 8px" }}>
                    <AlertTriangle size={10} /> Injured
                  </span>
                )}
              </div>
              <div style={{ fontSize: "12px", color: "#888", marginTop: "1px" }}>
                {player.role} · Age {player.age}
              </div>
            </div>

            {/* Plan count + arrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              {player.plans.length > 0 ? (
                <span style={{ fontSize: "11px", fontWeight: "700", padding: "2px 9px", borderRadius: "20px", backgroundColor: "#e8f3fb", color: "#2f9be0", border: "1px solid #cfe6f7" }}>
                  {player.plans.length} plan{player.plans.length > 1 ? "s" : ""}
                </span>
              ) : (
                <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 9px", borderRadius: "20px", backgroundColor: "#f5f5f5", color: "#aaa", border: "1px solid #e0e0e0" }}>
                  No plan
                </span>
              )}
              <ChevronRight size={15} style={{ color: "#ccc" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionDashboard;